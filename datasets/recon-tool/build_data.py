# -*- coding: utf-8 -*-
"""Generate synthetic bank statement & ledger CSVs with embedded (ground-truth) differences."""
import csv
import os
import random
from datetime import date, timedelta

random.seed(20261031)
OUT = r"D:\My Certificates\附件材料\02 作品集（财务分析与数据可视化）\recon-tool\data"
os.makedirs(OUT, exist_ok=True)

CUSTOMERS = ["杭州云链科技有限公司", "宁波汇金塑业有限公司", "苏州锦程电子有限公司", "深圳迅捷网络科技有限公司"]
VENDORS = ["广州恒达物流有限公司", "上海启明广告有限公司", "北京瑞鑫办公用品有限公司", "成都蜀味餐饮管理有限公司", "苏州锦程电子有限公司"]
INCOME_SUM = ["销售回款", "货款", "尾款结算"]
EXPENSE_SUM = ["采购付款", "运输费", "办公用品采购", "广告投放", "员工餐费", "设备维修"]

# 异常参考号占用的序号（地面真值，见 README）
ANOMALY_SEQ = {7, 12, 15, 20, 32, 41, 48, 55}
day0 = date(2026, 10, 1)

normal = []  # (date, direction, amount, counterparty, summary, ref)
for seq in range(1, 59):
    if seq in ANOMALY_SEQ:
        continue
    day = 1 + (seq - 1) * 29 // 58
    d = day0 + timedelta(days=day - 1)
    if seq % 5 in (0, 2):
        direction, amt = "收入", round(random.uniform(18000, 92000), 2)
        cp, sm = random.choice(CUSTOMERS), random.choice(INCOME_SUM)
    else:
        direction, amt = "支出", round(random.uniform(800, 78000), 2)
        cp, sm = random.choice(VENDORS), random.choice(EXPENSE_SUM)
    normal.append((d, direction, amt, cp, sm, f"REF-202610{day:02d}-{seq:03d}"))

# ---- 异常（地面真值） ----
a1_b = (date(2026, 10, 3), "收入", 45000.00, "杭州云链科技有限公司", "销售回款", "REF-20261003-007")
a1_l = (date(2026, 10, 3), "收入", 45600.00, "杭州云链科技有限公司", "销售回款", "REF-20261003-007")
a2_b = (date(2026, 10, 15), "支出", 8925.50, "广州恒达物流有限公司", "10月运输费", "REF-20261015-032")
a2_l = (date(2026, 10, 15), "支出", 8955.50, "广州恒达物流有限公司", "10月运输费", "REF-20261015-032")
b1_b = (date(2026, 10, 8), "支出", 120.00, "银行费用", "账户管理费", "REF-20261008-012")           # 仅银行
b2_b = (date(2026, 10, 19), "收入", 86.40, "计息", "存款利息", "REF-20261019-041")                  # 仅银行
b3_l = (date(2026, 10, 22), "支出", 15000.00, "苏州锦程电子有限公司", "采购预付款（支票 No.1031）", "REF-20261022-048")  # 仅账面（未达账）
c1_b = (date(2026, 10, 27), "支出", 23400.00, "上海启明广告有限公司", "Q4广告首期款", "REF-20261028-055")
c1_l = (date(2026, 10, 30), "支出", 23400.00, "上海启明广告有限公司", "Q4广告首期款", "REF-20261028-055")
c2_b = (date(2026, 10, 12), "收入", 66000.00, "宁波汇金塑业有限公司", "货款", "REF-20261009-015")
c2_l = (date(2026, 10, 9), "收入", 66000.00, "宁波汇金塑业有限公司", "货款", "REF-20261009-015")
d_b = (date(2026, 10, 11), "支出", 5800.00, "北京瑞鑫办公用品有限公司", "办公设备采购", "REF-20261011-020")
d_l1 = (date(2026, 10, 11), "支出", 5800.00, "北京瑞鑫办公用品有限公司", "办公设备采购", "REF-20261011-020")
d_l2 = (date(2026, 10, 11), "支出", 5800.00, "北京瑞鑫办公用品有限公司", "办公设备采购", "REF-20261011-020")

bank = list(normal) + [a1_b, a2_b, b1_b, b2_b, c1_b, c2_b, d_b]
ledger = list(normal) + [a1_l, a2_l, b3_l, c1_l, c2_l, d_l1, d_l2]

bank.sort(key=lambda r: (r[0], r[5]))
ledger.sort(key=lambda r: (r[0], r[5]))

with open(os.path.join(OUT, "bank_statement.csv"), "w", newline="", encoding="utf-8-sig") as f:
    w = csv.writer(f)
    w.writerow(["流水日期", "收付方向", "金额", "对方户名", "摘要", "参考号", "银行流水号", "账户余额"])
    balance = 1280000.00
    for i, (d, direction, amt, cp, sm, ref) in enumerate(bank, 1):
        balance += amt if direction == "收入" else -amt
        w.writerow([d.isoformat(), direction, f"{amt:.2f}", cp, sm, ref, f"BNK-2026{i:05d}", f"{balance:.2f}"])

with open(os.path.join(OUT, "ledger_entries.csv"), "w", newline="", encoding="utf-8-sig") as f:
    w = csv.writer(f)
    w.writerow(["记账日期", "收付方向", "金额", "对方户名", "摘要", "参考号", "凭证号"])
    for i, (d, direction, amt, cp, sm, ref) in enumerate(ledger, 1):
        w.writerow([d.isoformat(), direction, f"{amt:.2f}", cp, sm, ref, f"JZ-{1000 + i}"])

bank_net = sum(a if dir_ == "收入" else -a for _, dir_, a, *_ in bank)
ledger_net = sum(a if dir_ == "收入" else -a for _, dir_, a, *_ in ledger)
print(f"bank rows={len(bank)}  ledger rows={len(ledger)}")
print(f"银行期初 1,280,000.00  期末 {1280000 + bank_net:,.2f}")
print(f"账面期初 1,280,000.00  期末 {1280000 + ledger_net:,.2f}")
print(f"期末差额（银行 − 账面）= {bank_net - ledger_net:,.2f}  （应为 20,196.40）")
print("--- 地面真值 ---")
print("金额不符: REF-20261003-007 (账面多记 600.00), REF-20261015-032 (账面多记 30.00)")
print("仅银行  : REF-20261008-012 (-120.00), REF-20261019-041 (+86.40)")
print("仅账面  : REF-20261022-048 (-15,000.00, 支票未兑付)")
print("日期错位: REF-20261028-055 (3天), REF-20261009-015 (3天)")
print("账面重复: REF-20261011-020 (多记一笔 5,800.00)")
