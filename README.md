# ⚡ FDE Learning Hub & Flight Simulator (前线部署工程师全栈学习中心与交付模拟舱)

> **全方位覆盖 · 深度实操 · 拒绝走马观花**  
> 专为企业级大模型（GenAI）与智能体（AI Agents）生产落地打造的体系化知识中心、交付战役方法论、硬核工程代码与现场沙盒演练平台。

---

## 🌟 为什么发起这个项目？

麻省理工学院（MIT）NANDA 实验室 2025 年发布的《生成式人工智能的鸿沟》揭示：全球财富 2000 强企业在 GenAI 上投入了数百亿美元，然而**高达 95% 的 PoC 项目最终死在生产上线前夜**。

模型能力（GPT-4、Claude、Llama）正在全面商品化，**“模型不稀缺，能把模型塞进企业真实业务流、为客户算清账本的前线部署工程师（FDE）才极度稀缺”**。

本项目旨在解决从“玩具 Demo / Prompt 调优”向“高价值企业生产闭环交付”的断层，提供一套可供工程师、技术创始人与架构师持续学习演进的实战战备系统。

---

## 🗺️ 四层资料图谱纳管

1. **第 1 层：根源哲学与一手内参（基因层）**
   - Palantir S-1 招股书与 Foundry 架构论（The Delta 哲学与产品化咨询机制）
   - MIT NANDA 实验室《The GenAI Divide》解剖报告
   - Anthropic MCP (Model Context Protocol) 官方协议与 OpenAI Applied AI 最佳实践
2. **第 2 层：本土化全景专著与体系地图（方法论层）**
   - 范冰《前线部署工程师：人工智能时代的客户价值交付秘籍》全 8 章深度沉淀
   - 附录 A 完整指标库（4 大维度指标、24+ 现场核心黑话深度辨析）
   - Awesome-FDE-Roadmap（企业数据栈、VPC-SC 安全隔离与 Tactical Edge）
3. **第 3 层：原生工程手艺武器库（代码手艺层）**
   - 反框架化（No-Framework）原生 Python Agent 控制流（带最大轮数与 Token 预算熔断器）
   - Pydantic 强类型约束解码与格式防呆校验守门员
   - Air-Gap 物理隔离网攻坚（单向光闸数据摆渡、零外联遥测 Zero-Telemetry 排雷）
   - RAGAS 四维自动化评测体系（Faithfulness、Relevance、Precision、Recall）
4. **第 4 层：商业护城河与交付防具（契约防具层）**
   - SOW (Statement of Work) 防御性工程模板（抗击需求蝗虫与 Scope Creep）
   - UAT 黄金测试集（Golden Test Set）构建标准
   - Cost of Inaction (CoI) 财务推演测算模型与高管谈判话术库

---

## 🧠 核心学习方法论 (Learning Skills)

* 🔍 **启发式逆向工程 (Pre-Mortem Inversion)**：“事前验尸法”，开工前先预演 10 种暴毙场景，倒推防护底线。
* 🧪 **项目式沙盒淬炼 (Project-Based Learning)**：模拟 48 小时极速金融合规审核等恶劣场景，在脏乱差真实环境练兵。
* 🥋 **原子手艺肌肉记忆 (Deliberate Kata)**：30 分钟不看文档、徒手手写无黑盒 Agent 循环与状态机。
* 🌉 **双轨双语翻译能力 (Dual-Track Translation)**：技术 Spec ↔ 业务痛点 ↔ 财务指标无缝对齐。

---

## 🚀 核心功能与交互工具

- 📖 **树状章节知识库**：涵盖心智重塑、六大交付战役、工程手艺、标杆案例。
- 📊 **学习进度打卡追踪**：每个小节支持打卡标记，本地持久化（LocalStorage）并动态更新进度百分比。
- 🧮 **Cost of Inaction (CoI) 测算器**：动态输入员工人数、薪资、低效比，一键生成高管说服财务报告。
- 📋 **交付双防线自检表**：包含 SOW 需求边界自检与 Air-Gap 离线排雷清单。
- 📝 **现场实战决策考场**：10 道高保真情境模拟自测题，点击即时判定并附资深专家复盘解析。
- 🌙 **明暗双主题一键切换**。

---

## 💻 本地预览与 Cloudflare 部署

### 1. 本地启动
本平台采用纯原生轻量化架构（遵循 Ponytail 极简原则），无重型 Node 构建黑盒：
```bash
# 使用任何静态服务器打开即可，例如 Python:
python3 -m http.server 8080

# 或使用 Wrangler Pages 本地模拟器:
npm run dev
```
打开浏览器访问 `http://localhost:8080` 即可沉浸式学习。

### 2. 部署至 Cloudflare Pages
```bash
# 登录并部署至 Cloudflare
npm run deploy
```

---

## 📄 许可协议
MIT License © 2026 ggxx39
