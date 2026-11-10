# -*- coding: utf-8 -*-
"""银行流水 × 账面 逐笔勾稽工具（recon）

用法:
    python recon.py

输入: data/bank_statement.csv（银行对账单）、data/ledger_entries.csv（账面日记账）
输出: output/matched.csv、amount_mismatch.csv、date_shift.csv、duplicate_ledger.csv、
      bank_only.csv、ledger_only.csv、reconciliation.csv

匹配规则（严格 1:1，每条记录至多被消费一次）:
    Pass 1  参考号一致直接配对；参考号在任一侧多次出现 → 报告并标记疑似重复；
            参考号对上但金额不同 → 金额不符；金额相同但日期不同 → 日期错位。
    Pass 2  参考号无法配对的，按「金额 + 对方户名 + 收付方向 + 日期 ±DATE_TOL 天」就近唯一匹配。
    余下未消费记录 → 单边（银行单边=企业未记；账面单边=未达账）。
"""
import csv
import os
from collections import Counter
from datetime import datetime

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE, "data")
OUT_DIR = os.path.join(BASE, "output")
OPENING_BALANCE = 1_280_000.00   # 2026-10-01 期初余额（银行与账面一致）
DATE_TOL = 3                     # 模糊匹配日期容差（天）

BASE_COLS = ["日期", "收付方向", "金额", "对方户名", "摘要", "参考号"]


def parse_date(s):
    return datetime.strptime(s, "%Y-%m-%d").date()


def load(name, date_col):
    """读入 CSV，并给每行分配稳定下标 _i（用于 1:1 消费跟踪）。"""
    with open(os.path.join(DATA_DIR, name), encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    for i, r in enumerate(rows):
        r["_i"] = i  # 行下标：作为唯一标识，替代脆弱的 id()，便于解释与复现
        r["日期"] = parse_date(r[date_col])
        r["金额"] = round(float(r["金额"]), 2)
        r["Signed"] = r["金额"] if r["收付方向"] == "收入" else -r["金额"]
    return rows


def fmt_row(r):
    return {
        "日期": r["日期"].isoformat(),
        "收付方向": r["收付方向"],
        "金额": f"{r['金额']:.2f}",
        "对方户名": r["对方户名"],
        "摘要": r["摘要"],
        "参考号": r["参考号"],
    }


def write_single(filename, rows, note_key=None):
    cols = BASE_COLS + ([note_key] if note_key else []) + ["人工复核"]
    with open(os.path.join(OUT_DIR, filename), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            out = {}
            for c in BASE_COLS:  # 兼容原始行（date 对象）与已格式化行（str）
                v = r.get(c, "")
                if c == "金额":
                    out[c] = f"{float(v):.2f}"   # 金额统一保留 2 位小数
                elif hasattr(v, "isoformat"):
                    out[c] = v.isoformat()
                else:
                    out[c] = v
            if note_key:
                out[note_key] = r.get(note_key, "")
            out["人工复核"] = r.get("人工复核", "")
            w.writerow(out)


def write_pair(filename, pairs, extra_cols):
    cols = []
    for p in ("银行", "账面"):
        cols += [f"{p}日期", f"{p}方向", f"{p}金额", f"{p}户名", f"{p}摘要", f"{p}参考号"]
    cols += list(extra_cols) + ["人工复核"]
    with open(os.path.join(OUT_DIR, filename), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        for p in pairs:
            row = dict(p)
            row["人工复核"] = p.get("人工复核", "")
            w.writerow(row)


def pair_of(b, l, match_way):
    d = {}
    for prefix, r in (("银行", b), ("账面", l)):
        d[f"{prefix}日期"] = r["日期"].isoformat()
        d[f"{prefix}方向"] = r["收付方向"]
        d[f"{prefix}金额"] = f"{r['金额']:.2f}"
        d[f"{prefix}户名"] = r["对方户名"]
        d[f"{prefix}摘要"] = r["摘要"]
        d[f"{prefix}参考号"] = r["参考号"]
    d["匹配方式"] = match_way
    return d


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    bank = load("bank_statement.csv", "流水日期")
    ledger = load("ledger_entries.csv", "记账日期")
    b_ref = Counter(r["参考号"] for r in bank)
    l_ref = Counter(r["参考号"] for r in ledger)

    matched, amount_mismatch, date_shift = [], [], []
    duplicates, bank_only, ledger_only = [], [], []
    adj = []  # (类别, 说明, 调整额)：把银行对账单期末余额调到企业账面期末余额
    used_b, used_l = set(), set()   # 已消费行下标（_i），保证严格 1:1

    # 参考号在任一侧出现多次 → 需报告并人工处理（任务书 2a）
    multi_refs = sorted({ref for ref in set(b_ref) | set(l_ref)
                         if b_ref[ref] > 1 or l_ref[ref] > 1})

    # ---------- Pass 1: 参考号配对 ----------
    for ref in sorted(set(b_ref) | set(l_ref)):
        bs = sorted([r for r in bank if r["参考号"] == ref], key=lambda r: r["日期"])
        ls = sorted([r for r in ledger if r["参考号"] == ref], key=lambda r: r["日期"])
        k = min(len(bs), len(ls))
        for i in range(k):
            b, l = bs[i], ls[i]
            used_b.add(b["_i"])
            used_l.add(l["_i"])
            if abs(b["金额"] - l["金额"]) > 0.005:
                amount_mismatch.append(pair_of(b, l, "参考号"))
                adj.append(("金额不符", f"金额不符更正：{ref}（账面 {l['金额']:,.2f} vs 银行 {b['金额']:,.2f}）",
                            round(l["Signed"] - b["Signed"], 2)))
            elif b["日期"] != l["日期"]:
                date_shift.append(pair_of(b, l, "参考号"))
                date_shift[-1]["天数差"] = (l["日期"] - b["日期"]).days
            else:
                matched.append(pair_of(b, l, "参考号"))
        # 银行侧多余行：仅此一笔银行记录 → 银行单边；否则 → 疑似银行侧重复
        for b in bs[k:]:
            used_b.add(b["_i"])
            if len(ls) == 0 and len(bs) == 1:
                bank_only.append(b)
                adj.append(("银行单边", f"银行已{'收' if b['收付方向'] == '收入' else '付'}、企业未记：{b['摘要']}（{ref}）",
                            round(-b["Signed"], 2)))
            else:
                duplicates.append({**fmt_row(b),
                                   "备注": f"参考号在银行侧出现 {len(bs)} 次（账面 {len(ls)} 次）——疑似银行侧重复"})
                adj.append(("银行侧重复", f"疑似银行侧重复：{ref}（{b['摘要']}）", round(-b["Signed"], 2)))
        # 账面侧多余行：仅此一笔账面记录 → 单边（未达账）；否则 → 疑似重复记账
        for l in ls[k:]:
            used_l.add(l["_i"])
            if len(bs) == 0 and len(ls) == 1:
                ledger_only.append(l)
                adj.append(("账面单边（未达账）", f"企业已{'收' if l['收付方向'] == '收入' else '付'}、银行未记（未达账）：{l['摘要']}（{ref}）",
                            round(l["Signed"], 2)))
            else:
                duplicates.append({**fmt_row(l),
                                   "备注": f"参考号在账面侧出现 {len(ls)} 次（银行 {len(bs)} 次）——疑似重复记账"})
                adj.append(("账面重复", f"疑似账面重复记账：{ref}（{l['摘要']}）", round(l["Signed"], 2)))

    # ---------- Pass 2: 模糊匹配（金额 + 对方户名 + 方向，日期 ±DATE_TOL，就近 1:1） ----------
    by_key = {}
    for l in ledger:
        if l["_i"] not in used_l:
            by_key.setdefault((l["金额"], l["对方户名"], l["收付方向"]), []).append(l)
    for b in sorted((r for r in bank if r["_i"] not in used_b), key=lambda r: r["日期"]):
        cands = [l for l in by_key.get((b["金额"], b["对方户名"], b["收付方向"]), [])
                 if l["_i"] not in used_l and abs((l["日期"] - b["日期"]).days) <= DATE_TOL]
        if not cands:
            continue
        l = min(cands, key=lambda x: abs((x["日期"] - b["日期"]).days))
        used_b.add(b["_i"])
        used_l.add(l["_i"])
        matched.append(pair_of(b, l, f"模糊（金额+户名+方向+日期±{DATE_TOL}天）"))

    # ---------- 剩余单边（只处理上述两步未消费的行，避免调整项重复计入） ----------
    leftover_bank = [r for r in bank if r["_i"] not in used_b]
    leftover_ledger = [r for r in ledger if r["_i"] not in used_l]
    bank_only += leftover_bank
    ledger_only += leftover_ledger
    for r in leftover_bank:
        side = "收" if r["收付方向"] == "收入" else "付"
        adj.append(("银行单边", f"银行已{side}、企业未记：{r['摘要']}（{r['参考号']}）", round(-r["Signed"], 2)))
    for r in leftover_ledger:
        side = "收" if r["收付方向"] == "收入" else "付"
        adj.append(("账面单边（未达账）", f"企业已{side}、银行未记（未达账）：{r['摘要']}（{r['参考号']}）", round(r["Signed"], 2)))

    # ---------- 调节表（银行对账单余额 → 企业账面余额） ----------
    bank_net = round(sum(r["Signed"] for r in bank), 2)
    ledger_net = round(sum(r["Signed"] for r in ledger), 2)
    bank_end = round(OPENING_BALANCE + bank_net, 2)
    ledger_end = round(OPENING_BALANCE + ledger_net, 2)
    total_adj = round(sum(a for _, _, a in adj), 2)
    adjusted_end = round(bank_end + total_adj, 2)
    check = round(adjusted_end - ledger_end, 2)
    if abs(check) < 0.005:      # 避免出现 -0.00
        check = 0.0
    ok = check == 0.0

    # 分类型小计：便于与差异台账逐类交叉印证
    cat_order = ["金额不符", "银行单边", "账面单边（未达账）", "账面重复", "银行侧重复"]
    subtotals = {c: round(sum(a for cat, _, a in adj if cat == c), 2) for c in cat_order}
    # 独立校验：每条调节项都应唯一对应差异台账中的一行
    ledger_rows = len(amount_mismatch) + len(bank_only) + len(ledger_only) + len(duplicates)

    with open(os.path.join(OUT_DIR, "reconciliation.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["项目", "金额", "说明"])
        w.writerow(["期初余额（2026-10-01，双方一致）", f"{OPENING_BALANCE:.2f}", "银行与账面期初一致"])
        w.writerow(["银行对账单期末余额（2026-10-31）", f"{bank_end:.2f}", "银行流水合计 " + f"{bank_net:+,.2f}"])
        for cat, desc, amt in adj:
            w.writerow([desc, f"{amt:+,.2f}", f"调整项[{cat}]（银行 → 账面）"])
        w.writerow(["—— 分类型小计 ——", "", ""])
        for c in cat_order:
            w.writerow([f"小计：{c}", f"{subtotals[c]:+,.2f}", f"{sum(1 for cat, _, _ in adj if cat == c)} 笔"])
        w.writerow(["调整合计", f"{total_adj:+,.2f}", f"共 {len(adj)} 项，与差异台账 {ledger_rows} 行一一对应"])
        w.writerow(["企业账面期末余额（调节后）", f"{adjusted_end:.2f}", "= 银行期末余额 + 调整合计"])
        w.writerow(["企业账面日记账期末余额（实际）", f"{ledger_end:.2f}", "账面流水合计 " + f"{ledger_net:+,.2f}"])
        w.writerow(["校验差异", f"{check:.2f}", "调节平衡" if ok else "不平衡！"])
        w.writerow(["调整项笔数 vs 台账行数", f"{len(adj)} vs {ledger_rows}",
                    "一致" if len(adj) == ledger_rows else "不一致！"])

    # ---------- 台账输出（均含“人工复核”列，填写后另存为 *_reviewed.csv 即可） ----------
    write_pair("matched.csv", matched, ["匹配方式"])
    write_pair("amount_mismatch.csv", amount_mismatch, ["匹配方式"])
    write_pair("date_shift.csv", date_shift, ["匹配方式", "天数差"])
    write_single("duplicate_ledger.csv", duplicates, "备注")
    write_single("bank_only.csv", bank_only, "备注")
    write_single("ledger_only.csv", ledger_only, "备注")

    # ---------- 控制台摘要 ----------
    print("=" * 62)
    print("勾稽结果摘要")
    print("=" * 62)
    print(f"成功勾稽        : {len(matched)} 笔（其中模糊匹配 {sum(1 for m in matched if m['匹配方式'].startswith('模糊'))} 笔）")
    print(f"金额不符        : {len(amount_mismatch)} 笔")
    print(f"日期错位        : {len(date_shift)} 笔")
    print(f"疑似重复记账    : {len(duplicates)} 笔")
    print(f"银行单边（未记）: {len(bank_only)} 笔")
    print(f"账面单边（未达账）: {len(ledger_only)} 笔")
    if multi_refs:
        print("-" * 62)
        print("⚠ 参考号在任一侧出现多次（任务书 2a，需人工复核）：")
        for ref in multi_refs:
            print(f"    {ref}  银行 {b_ref[ref]} 次 / 账面 {l_ref[ref]} 次")
    print("-" * 62)
    print(f"银行对账单期末余额 : {bank_end:>14,.2f}")
    for cat, desc, amt in adj:
        print(f"  [{cat}] {desc:<32} {amt:>+14,.2f}")
    for c in cat_order:
        print(f"  └ 小计[{c}]{'':<20} {subtotals[c]:>+14,.2f}")
    print(f"{'调整合计':<40} {total_adj:>+14,.2f}")
    print(f"企业账面期末余额（调节后）: {adjusted_end:>14,.2f}")
    print(f"企业账面日记账期末余额    : {ledger_end:>14,.2f}")
    print(f"调节{'平衡 ✓' if ok else '不平衡 ✗（需人工核查）'}"
          f"（调整项 {len(adj)} 项 / 台账 {ledger_rows} 行，"
          f"{'一致' if len(adj) == ledger_rows else '不一致 ✗'}）")
    print("=" * 62)
    print("台账已输出至 output/（含“人工复核”空列，供人工填写）")


if __name__ == "__main__":
    main()
