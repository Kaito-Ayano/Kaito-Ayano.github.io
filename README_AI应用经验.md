# AI 应用经验 · README

> **摘要**：这份材料整理了四段使用 AI 完成的实践——华为年报多准则数据集与可视化看板、银行流水对账工具（recon）、德勤数字化精英挑战赛的两个应用、LightFit 商业计划与产品。做法是一致的：先明确需求和验收标准，再让 AI 生成初稿或执行具体步骤，最后由人工逐项核对。各项成果均可在链接中打开。
>
> 🐙 更多详细内容（看板、Demo、源码）以及其他作品见我的 GitHub 目录页：**[kaito-ayano.github.io](https://kaito-ayano.github.io/)**

---

## 🗄️ 01 · 华为年报多准则数据集与可视化看板

**概要**：整理华为 2015–2025 共十一个财年年报，建立多准则、多语言的数据集，并做成可视化看板。

**AI Agent 应用领域**：辅助年报信息抽取、字段映射初稿和看板代码生成。

**人工核对**：字段映射与术语表人工整理；关键数字用 Wind、Choice 两个数据源分别核验；差异分为口径差异、尾差、错值三类处理，口径差异保留原口径、不强行对齐。

**成果**：四版同构 Excel 工作簿（中/英 IFRS、俄文 МСФО、俄文 РСБУ；28 项财务主指标 + 19 项 ESG 指标）；中英俄三语看板（6 页签 33 张图表）。

**链接**：[交互式看板](https://kaito-ayano.github.io/datasets/huawei/02_Dashboard/Huawei_2015-2025_Dashboard.html) ｜ [中文 IFRS 工作簿](https://kaito-ayano.github.io/datasets/huawei/01_Excel/01_CN_IFRS_Huawei_Annual_Reports_2015-2025.xlsx) ｜ [项目说明](https://kaito-ayano.github.io/datasets/huawei/03_Documentation/Huawei_Coursework_Trilingual_Note.docx)

---

## ✅ 02 · 银行流水 × 账面 逐笔勾稽工具（recon）

**概要**：把银行对账单与企业银行存款日记账的逐笔核对（俗称"银行倒盘"）做成一个小工具。本次提供的 AI 协作会话即来自这个项目。

**AI Agent 应用领域**：生成勾稽程序并做加固——先按参考号精确配对，未命中的按"金额 + 对方户名 + 方向 + 日期（±3 天）"做一对一模糊匹配；输出金额不符、日期错位、重复记账、单边四类差异台账和银行余额调节表。

**人工核对**：需求和验收标准由本人制定，匹配规则和数据口径逐项确认；在数据中预先埋入已知差异，用于检验 AI 的识别结果；程序重跑后调节表与差异台账完全对应（校验差异 0.00）。

**成果**：recon.py（纯 Python 标准库、离线可复现）、四类差异台账、银行余额调节表（均含"人工复核"列）。

**链接**：[结果报告](https://kaito-ayano.github.io/datasets/recon-tool/recon_report.html) ｜ [源码 recon.py](https://kaito-ayano.github.io/datasets/recon-tool/recon.py) ｜ [调节表 CSV](https://kaito-ayano.github.io/datasets/recon-tool/output/reconciliation.csv)

---

## 🛡️ 03 · 德勤数字化精英挑战赛 2026（Deloitte Digital Camp）

**概要**：提交 AI 辅助财务分析的治理方案，并上线两个可交互的应用。

**AI Agent 应用领域**：AI Agent 辅助编码，完成 Sentinel（规则初筛 → 团伙关系图谱 → 人工复核留痕）和 Arbiter（风险画像 → 成熟度雷达 → 人工裁决 → 90 天治理路线图，对应 SR 11-7、BCBS 239、欧盟《人工智能法案》）。

**人工核对**：两个应用都把人工复核留痕做进了流程——AI 只做初筛和画像，裁决由人完成，复核记录可以导出。

**成果**：两个可公开访问的 Demo、德勤中国官方参赛证书、90 秒讲解视频、开源机读数据集。

**链接**：[Sentinel](https://kaito-ayano.github.io/Sentinel/) ｜ [Arbiter](https://kaito-ayano.github.io/Arbiter/) ｜ [演示视频](https://kaito-ayano.github.io/Sentinel/media/demo-90s.mp4)

---

## ❤️ 04 · 中国国际大学生创新大赛（中亚赛区）· 轻体 LightFit

**概要**：作为三人团队负责人，完成健康管理产品 LightFit 的商业分析与产品交付。

**AI Agent 应用领域**：辅助商业计划书初稿和市场资料整理；Android 端由 AI Agent 辅助编码（五语言界面、端侧 AI 体态识别、AES-256 本地加密、可完全离线）。

**人工核对**：三年期收入-成本-盈亏平衡模型（约第 18 个月单月盈亏平衡）与多情景敏感性分析（获客成本 +20% 时净利润约 −23%）由本人搭建和测算；AI 产出的每一版都经人工修订后采用。

**成果**：中英文商业计划书、数据看板（HTML / 14 页 PDF）、五语言产品 Demo、Android (Java) 源码仓库。

**链接**：[产品 Demo](https://kaito-ayano.github.io/lightfit-app/demo/lightfit_v8.4.3_demo.html) ｜ [商业计划书](https://kaito-ayano.github.io/business-plan/LightFit-Business-Plan-CN.pdf) ｜ [源码仓库](https://github.com/Kaito-Ayano/LightFit-Android)

---

## 🧭 关于方法

四段实践中，AI 的使用是递进的——

**01** 信息抽取与初稿 → **02** 可运行的程序 → **03** AI Agent 辅助编码并上线应用 → **04** 从文档到端侧产品的全链路。

不变的是验收环节：每个项目在 AI 动手之前先确定验收标准（口径锁定、ground truth 回归、复核留痕、人工测算），AI 的输出必须通过这些标准，才会进入交付物。这也是四个项目对"AI 在财务工作中怎么用"的回答——AI 的产出要能被核验，才算能用。

## ℹ️ 数据说明

华为与 miHoYo 的数据来自公开年报；recon、Sentinel、Arbiter、LightFit 为合成数据或个人原创作品，不含实习单位内部信息、商业秘密或个人敏感信息。
