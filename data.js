const FDE_ALL_DATA = {
  "meta": {
    "title": "FDE Flight Simulator & Competency Engine | 前线部署工程师全栈学习与战力评估系统",
    "version": "3.0.0",
    "description": "专为企业级 GenAI 落地打造的沉浸式实战平台：四层资料图谱、六大交付战役、无黑盒代码手艺、分支决策沙盘、代码排错寻错与4维战力雷达。"
  },
  "modules": [
    {
      "id": "mindset",
      "title": "模块〇：FDE 核心心智与行业真相",
      "badge": "认知地基",
      "items": [
        {
          "id": "intro-1",
          "title": "0.1 为什么硅谷 FDE 需求激增 7 倍？麻省理工 95% 阵亡率报告",
          "summary": "模型能力商品化时代的残酷真相：没有现场交付，模型价值归零。",
          "content": "\n<div class=\"prose\">\n    <h3>一、数百万美元是如何在企业现场死掉的？</h3>\n    <p>2024~2025 年，麻省理工学院（MIT）NANDA 实验室发布了标志性报告——<strong>《生成式人工智能的鸿沟》(The GenAI Divide)</strong>。报告调研了全球企业在生成式 AI 上的数百亿美元投入，发现<strong>高达 95% 的试点项目最终无法产生可计入财务报表的商业价值</strong>。</p>\n    \n    <div class=\"callout danger\">\n        <strong>95% 阵亡率的三大致命病因：</strong>\n        <ol>\n            <li><strong>“能演示”与“能上线”的鸿沟：</strong>在 Jupyter Notebook 或公网环境演示 85% 准确率看起来很惊艳；但到了银行反洗钱、工业质检或处方审查现场，15% 的格式漂移与幻觉足以引发灾难性事故。</li>\n            <li><strong>数据沼泽（The Data Swamp）：</strong>企业的核心业务数据不在干净的 CSV 里，而散落在打补丁 15 年的 Oracle、非标准 SAP 字段以及员工私人加密的 Excel 中。</li>\n            <li><strong>组织政治与抵触情绪：</strong>业务一线担心被 AI 抢走饭碗或凭空增加校验负担，表面配合、暗中抵触，拒不提供真实有效样本。</li>\n        </ol>\n    </div>\n\n    <p>与此同时，硅谷的 OpenAI、Anthropic、Palantir、Scale AI 以及 YC 孵化器内数百家企业，对同一个职位的需求在一年内暴增 <strong>700% 以上</strong>——这个岗位就是 <strong>前线部署工程师（Forward Deployed Engineer，简称 FDE）</strong>。</p>\n\n    <div class=\"callout tip\">\n        <strong>FDE 核心公理：</strong>当大模型以每周为单位卷平跑分时，<strong>“基础模型不再稀缺，能把模型塞进客户真实业务流水线、为客户算清财务账本的人，才极度稀缺。”</strong>\n    </div>\n\n    <div class=\"reflection-card\">\n        <span class=\"ref-badge\">⚡ 现场思维反思</span>\n        <p><strong>反思问答：</strong>如果一个客户提出“我们需要一个像 ChatGPT 一样的内部知识库”，合格的 FDE 第一句话绝对不谈模型大小，而是问：“哪 3 个业务环节因为找不到资料每天在浪费多少工时？上线后以什么财务指标衡量成功？”</p>\n    </div>\n</div>\n"
        },
        {
          "id": "intro-2",
          "title": "0.2 Palantir 的核心哲学：“The Delta”与“产品化咨询”",
          "summary": "通用软件与脏乱差现实之间的最后 20%~30% 断层，以及如何避免沦为外包奴隶。",
          "content": "\n<div class=\"prose\">\n    <h3>一、什么是 “The Delta”（现场断层）？</h3>\n    <p>FDE 这个概念源自大数据情报先驱 <strong>Palantir</strong>。在服务五角大楼、CIA 以及跨国银行时，Palantir 总结出一条企业软件物理铁律：</p>\n    \n    <div class=\"quote-box\">\n        “没有任何一款开箱即用的标准企业软件（COTS），可以直接无缝融入超大型企业的实际业务流程中。总部（HQ）研发的核心平台通常只能覆盖 70%~80% 的通用能力，而剩下的 20%~30% 则是极其肮脏、充斥着历史遗留包袱与特殊规则的现实断层。这段无法靠通用软件消除的差距，就是 <strong>The Delta</strong>。”\n    </div>\n\n    <p>传统公司的两极困境：</p>\n    <ul>\n        <li><strong>传统标准 SaaS：</strong>拒绝改代码，强逼客户改流程，最终陷入数年无休止的集成扯皮。</li>\n        <li><strong>传统外包集成商：</strong>毫无节制地做硬编码定制，代码越写越杂乱，边际交付成本递增，沦为劳动密集型作坊。</li>\n    </ul>\n\n    <h3>二、Palantir 的破局之道：Productized Consulting（产品化咨询）</h3>\n    <p>FDE 的神圣职责不是做一次性外包，而是践行 <strong>产品化咨询（Productized Consulting）</strong>：</p>\n    <div class=\"diagram-card\">\n        <div class=\"flow-step\">\n            <span class=\"step-num\">Step 1</span>\n            <strong>扎进现场</strong>\n            <p>FDE 拿到客户工卡和内网权限，坐进客户工位，在现场用代码抹平 Delta。</p>\n        </div>\n        <div class=\"flow-arrow\">➔</div>\n        <div class=\"flow-step\">\n            <span class=\"step-num\">Step 2</span>\n            <strong>抽象共性</strong>\n            <p>当连续在 3 个不同客户现场遇到相似的 Delta 时，坚决抽象为可复用的标准模块。</p>\n        </div>\n        <div class=\"flow-arrow\">➔</div>\n        <div class=\"flow-step\">\n            <span class=\"step-num\">Step 3</span>\n            <strong>反哺总部核心</strong>\n            <p>将抽象模块合并进核心平台（Core Product），让后续同类客户交付成本断崖式下降。</p>\n        </div>\n    </div>\n    \n    <div class=\"callout note\">\n        <strong>衡量 FDE 团队健康度的终极标尺：定制递减率（Decaying Customization Rate）</strong><br>\n        交付第 1 个客户现场代码占 30%；交付第 5 个客户降至 10% 以下。如果交付第 10 个客户依然全凭手写定制，说明组织已经退化为低毛利外包作坊。\n    </div>\n</div>\n"
        },
        {
          "id": "intro-3",
          "title": "0.3 岗位全景对比：FDE vs SWE vs SA vs 售前 vs 实施",
          "summary": "一张表彻底理清权责边界、核心产出与不可替代性。",
          "content": "\n<div class=\"prose\">\n    <div class=\"table-container\">\n        <table class=\"data-table\">\n            <thead>\n                <tr>\n                    <th>岗位角色</th>\n                    <th>工作主战场</th>\n                    <th>核心交付物</th>\n                    <th>考核北极星指标</th>\n                    <th>核心技能组合</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr>\n                    <td><strong>后方研发 (SWE)</strong></td>\n                    <td>总部工位 / Git 仓库</td>\n                    <td>标准功能特性、底层架构、API 接口</td>\n                    <td>系统稳定性、吞吐量、代码覆盖率</td>\n                    <td>算法、分布式系统、代码重构</td>\n                </tr>\n                <tr>\n                    <td><strong>售前顾问 / 售前专家</strong></td>\n                    <td>客户会议室 / 投标现场</td>\n                    <td>方案 PPT、投标白皮书、商务报价</td>\n                    <td>商机线索签约率、签约合同金额</td>\n                    <td>公众演讲、客户商务公关、PPT 架构编排</td>\n                </tr>\n                <tr>\n                    <td><strong>解决方案架构师 (SA)</strong></td>\n                    <td>客户中高层会议 / 评审会</td>\n                    <td>技术白皮书、拓扑架构图、技术选型方案</td>\n                    <td>云资源消耗量（ARR / Consumption）</td>\n                    <td>云原生产品矩阵理解、高可用架构设计</td>\n                </tr>\n                <tr>\n                    <td><strong>传统实施运维工程师</strong></td>\n                    <td>客户机房 / 运维现场</td>\n                    <td>安装介质部署、网络调优、日常工单响应</td>\n                    <td>SLA 可用率、故障恢复时长 (MTTR)</td>\n                    <td>Linux 运维、网络配置、Shell 脚本编写</td>\n                </tr>\n                <tr class=\"highlight-row\">\n                    <td><strong>前线部署工程师 (FDE)</strong></td>\n                    <td><strong>直接坐进客户业务前线战壕</strong></td>\n                    <td><strong>端到端跑通的生产级 Agent / Pipeline + 财务价值闭环</strong></td>\n                    <td><strong>首次见效时间 (TTV)、PoC 转签约率、客户业务指标改善率</strong></td>\n                    <td><strong>双语翻译（业务↔代码）、48h 原生敏捷打法、防反弹抗 Scope Creep、企业合规攻坚</strong></td>\n                </tr>\n            </tbody>\n        </table>\n    </div>\n</div>\n"
        },
        {
          "id": "pre-mortem-sandbox",
          "title": "0.4 启发式逆向工程：事前验尸（Pre-Mortem）10 种暴毙场景沙盘",
          "summary": "【PRD 核心方法论】在写第一行代码前，预演导致项目死掉的 10 个致命死因与防守底线。",
          "content": "\n<div class=\"prose\">\n    <div class=\"callout danger\">\n        <strong>什么是事前验尸（Pre-Mortem Inversion）？</strong><br>\n        传统团队总在项目失败后写复盘报告（Post-Mortem），而成熟 FDE 在项目启动第 1 天便召开“事前验尸会”：<strong>“假设 3 个月后该项目被客户退单、全面叫停，列出 10 种最可能暴毙的死因，并在立项时逐一封死。”</strong>\n    </div>\n\n    <div class=\"pre-mortem-grid\">\n        <div class=\"pm-card\">\n            <span class=\"pm-tag\">死因 1 · 架构脱节</span>\n            <h4>下游 ERP 接口暗中修改 Schema 导致崩溃</h4>\n            <p><strong>病理：</strong>客户信息部在周五晚升级了老旧系统，某个字段从大写变成小写，Prompt 提取的字段无法入库，整个数据流瘫痪。</p>\n            <div class=\"pm-remedy\"><strong>FDE 防具：</strong>强制使用 Pydantic 强类型严格校验守门员，配置接口 Schema 自动探测与告警网关。</div>\n        </div>\n\n        <div class=\"pm-card\">\n            <span class=\"pm-tag\">死因 2 · 组织断粮</span>\n            <h4>内部推动者（Champion）离职导致项目被砍</h4>\n            <p><strong>病理：</strong>合作高度依赖某一位副总裁的个人热情，该副总裁调岗后，继任者为了削减前任开支直接废除项目。</p>\n            <div class=\"pm-remedy\"><strong>FDE 防具：</strong>向基层业务渗透沉淀不可逆的肌肉记忆，并建立按月量化的财务账本（QBR Dashboard）。</div>\n        </div>\n\n        <div class=\"pm-card\">\n            <span class=\"pm-tag\">死因 3 · 数据幻觉</span>\n            <h4>扫描件反光歪斜，OCR 漏检导致决策失真</h4>\n            <p><strong>病理：</strong>线下上传的票据有大面积公章遮挡和反光，模型胡乱脑补金额数字，导致财务对账严重不符。</p>\n            <div class=\"pm-remedy\"><strong>FDE 防具：</strong>绝不用模型心算金额；模型仅负责圈定坐标与候选文本，数学验算交由刚性规则引擎进行三表钩稽。</div>\n        </div>\n\n        <div class=\"pm-card\">\n            <span class=\"pm-tag\">死因 4 · 安全红牌</span>\n            <h4>单向隔离网内静默 Telemetry 外联触发红牌</h4>\n            <p><strong>病理：</strong>引入的开源库在后台向公网发送版本检查或数据打点，被客户安全运营中心（SOC）抓包，认定为严重违规外联事故。</p>\n            <div class=\"pm-remedy\"><strong>FDE 防具：</strong>部署前执行全局代码与容器镜像抓包审计，彻底拔除所有第三方分析与外联代码。</div>\n        </div>\n\n        <div class=\"pm-card\">\n            <span class=\"pm-tag\">死因 5 · 员工抵触</span>\n            <h4>业务一线因失业恐慌产生消极抵触</h4>\n            <p><strong>病理：</strong>基层员工担心系统上线后自己会被裁撤，暗中提供错误数据、拒绝提供业务规则细节。</p>\n            <div class=\"pm-remedy\"><strong>FDE 防具：</strong>将系统定位为“一线员工的免加班护盾”——率先自动化最痛苦的周五对账加班，让基层体会到立竿见影的减负。</div>\n        </div>\n\n        <div class=\"pm-card\">\n            <span class=\"pm-tag\">死因 6 · 契约失控</span>\n            <h4>SOW 边界模糊，被“需求蝗虫”无止境白嫖</h4>\n            <p><strong>病理：</strong>没有量化验收界限，客户天天提新想法，项目延期数月无法进入结算阶段。</p>\n            <div class=\"pm-remedy\"><strong>FDE 防具：</strong>在 SOW 中划定 200 条黄金测试集指标（达标即通过 UAT），新需求统一打入 Phase 2 待办池。</div>\n        </div>\n\n        <div class=\"pm-card\">\n            <span class=\"pm-tag\">死因 7 · 验收扯皮</span>\n            <h4>未建立 Golden Test Set，验收死于主观评价</h4>\n            <p><strong>病理：</strong>验收评审会上，某个领导随意问了一个偏门问题发现回答不合心意，便拍桌子认定“系统不可用”。</p>\n            <div class=\"pm-remedy\"><strong>FDE 防具：</strong>入场第一周便拉着客方业务骨干共同签字封存《50 条业务黄金评测题集》，以客观通过率作为裁判标准。</div>\n        </div>\n\n        <div class=\"pm-card\">\n            <span class=\"pm-tag\">死因 8 · 级联雪崩</span>\n            <h4>模型原厂 API 超时宕机引发雪崩停摆</h4>\n            <p><strong>病理：</strong>公网或云端 API 出现 504 Gateway Timeout，系统直接报 500 错误，导致客户产线工单积压卡死。</p>\n            <div class=\"pm-remedy\"><strong>FDE 防具：</strong>构建“有损服务（Graceful Degradation）”，超时自动退化为本地轻量规则引擎，保证业务永不中断。</div>\n        </div>\n\n        <div class=\"pm-card\">\n            <span class=\"pm-tag\">死因 9 · 影子沼泽</span>\n            <h4>影子 IT（Shadow IT）错配，在假中台里打转</h4>\n            <p><strong>病理：</strong>花三个月对接了客户宣传的“企业级数据湖”，上线后发现里面的数据半年没更新，员工全在看私人 Excel。</p>\n            <div class=\"pm-remedy\"><strong>FDE 防具：</strong>不听汇报，搬椅子坐在操作员旁边（影子工作法），直奔真实 System of Record (SoR)。</div>\n        </div>\n\n        <div class=\"pm-card\">\n            <span class=\"pm-tag\">死因 10 · 商业自杀</span>\n            <h4>按席位计费利益冲突，客户提效后主动退订</h4>\n            <p><strong>病理：</strong>按人头账号收费，客户用 AI 提效后把原本 50 人的审核组缩编为 10 人，第二年续约金额骤降 80%。</p>\n            <div class=\"pm-remedy\"><strong>FDE 防具：</strong>采用“按成果收费（Outcome-based Pricing）”，按处理单量或挽回损失分成，实现甲乙双方利益强绑定。</div>\n        </div>\n    </div>\n</div>\n"
        }
      ]
    },
    {
      "id": "campaigns",
      "title": "模块一：六大交付战役全景手册",
      "badge": "战役实操",
      "items": [
        {
          "id": "c-1",
          "title": "1.1 战役一：解决正确的问题与解剖 PoC 坟墓",
          "summary": "为什么绝大多数 AI 试点做着做着就死了？如何用 MVD 破局？",
          "content": "\n<div class=\"prose\">\n    <h3>一、概念验证坟墓（PoC Purgatory）的解剖病历</h3>\n    <p>企业级软件交付最可怕的结局不是客户在第一天拒绝你，而是<strong>双方热热闹闹地开工，做了 6 个月原型，最终没有一个人拍板买单，项目在无尽的推诿与冷处理中无疾而终</strong>——这就是行业内常说的“概念验证坟墓”。</p>\n    \n    <div class=\"callout warning\">\n        <strong>PoC 坟墓的三大病理特征：</strong>\n        <ul>\n            <li><strong>无终局指标：</strong>立项时只写了“探索大模型在智能合同审查中的应用”，没有量化指标。验收时客户业务负责人一句“我觉得还不够聪明”就能将项目永久搁置。</li>\n            <li><strong>缺乏内部冠军（Internal Champion）：</strong>对接人是一个没有预算权、也没有背负实际业务 KPI 的边缘技术研究员。项目做得再好，无法上达董事会。</li>\n            <li><strong>伪痛点挂帅：</strong>客户提出“我们想要一个能和员工闲聊企业文化的虚拟人”。这种只满足领导面子、无法削减成本或增加营收的需求，一旦遇到预算紧缩第一批被砍。</li>\n        </ul>\n    </div>\n\n    <h3>二、破局神器：MVD（最小可行部署）与训练营机制</h3>\n    <p>Palantir 解决 PoC 坟墓的杀手锏是 <strong>AIP 训练营（Bootcamp）模式</strong>，它彻底颠覆了长达数月的漫长试点：</p>\n    <div class=\"quote-box\">\n        <strong>训练营法则：</strong><br>\n        1. 客户必须带 <strong>真实业务数据与真实操作员</strong> 入场；<br>\n        2. 周期严格压缩在 <strong>1 到 5 天以内</strong>；<br>\n        3. 目标只有一个：<strong>在现场跑通一个最小可行部署（MVD），当场让客户业务决策者看到真实价值发生。</strong>\n    </div>\n    <p>通过这种高强度、确定性的闪电验证，Palantir 将 PoC 转付费合同的转化率从早期的 10% 暴拉至 <strong>75% 以上</strong>。</p>\n</div>\n"
        },
        {
          "id": "c-2",
          "title": "1.2 战役二：赢得客户、灯塔法则与警惕“需求蝗虫”",
          "summary": "挑选具有标杆行业信号的客户，坚决击退吸干团队又不产生复利的需求蝗虫。",
          "content": "\n<div class=\"prose\">\n    <h3>一、灯塔客户（Lighthouse Customer）的选择标准</h3>\n    <p>在开拓新行业或新领域时，第一个拿下谁，决定了未来两年的发展速度。优秀的 FDE 团队在进场前会严格审视客户属性：</p>\n    <ul>\n        <li><strong>高信号声誉（High Signal）：</strong>该客户是行业公认的标杆（如金融业的摩根士丹利、工业制造的空中客车）。一旦上线成功，其背书价值远超合同本身的金额。</li>\n        <li><strong>痛点剧烈（Acute Pain）：</strong>现有流程已经到了不改就会被监管重罚或被对手挤垮的生死边缘，改革阻力最小。</li>\n        <li><strong>高层坚定赞助（Executive Sponsorship）：</strong>有一号位或核心副总裁亲自站台，能够强力扫除跨部门数据调用的政治阻碍。</li>\n    </ul>\n\n    <h3>二、致命陷阱：警惕“需求蝗虫”（Scope Locust）</h3>\n    <div class=\"callout danger\">\n        <strong>什么是“需求蝗虫”客户？</strong><br>\n        这类客户通常预算充足、商务谈判热情极高，但在实际交付中会提出成百上千条极其奇葩、完全无法复用的定制化需求。他们会派出一整个委员会天天给 FDE 开会提修改意见，吸干公司最精锐工程师的所有时间与精力。但这些代码换到第二家客户那里，复用度为 0。\n    </div>\n    <p><strong>FDE 的战略定力：</strong>对于需求蝗虫客户，宁可丢单，也绝不能让其绑架整个产品演进路线。严格用 SOW（工作说明书）将需求划定在核心价值区。</p>\n</div>\n"
        },
        {
          "id": "c-3",
          "title": "1.3 战役三：激活部署、首日魔咒与热修复文化",
          "summary": "上线不等于激活！如何用 5 分钟极速破冰解除一线员工的抵触？",
          "content": "\n<div class=\"prose\">\n    <h3>一、企业软件的“首日魔咒”</h3>\n    <p>很多技术人员以为系统成功部署到客户服务器、接口返回 HTTP 200 就大功告成了。然而现实是残酷的：<strong>90% 的企业员工在面对新上线的 AI 工具时，首日打开一次后便将其彻底遗忘，继续用回原来熟悉的笨办法。</strong></p>\n    \n    <div class=\"callout tip\">\n        <strong>FDE 激活三板斧：</strong>\n        <ol>\n            <li><strong>首日 5 分钟即时正反馈（Instant Gratification）：</strong>绝不要让用户面对一个空荡荡的输入框。必须预置真实业务场景中最常见、最棘手的模板（如“点击一键生成昨日本省信贷异常分析报告”），让操作员只需点一次鼠标，即可在 5 秒内看到震撼的业务结果。</li>\n            <li><strong>影子工作法（Shadowing）：</strong>FDE 必须搬着笔记本直接坐到最一线的操作员（如客服、审核员）身旁，静静观察他们一整天的真实操作，记录他们在哪一步皱眉、在哪一步切屏。那些最微小的摩擦点（Friction Point），正是决定采纳率的关键。</li>\n            <li><strong>部署期热修复文化（Hotfix Velocity）：</strong>当一线用户在内网反馈“这个按钮位置不方便”或“这个字段没解析出来”时，FDE 的响应速度必须以<strong>小时</strong>计算。当场修好发版，这种“神级响应速度”能瞬间将怀疑者转化为最坚定的内部拥护者。</li>\n        </ol>\n    </div>\n</div>\n"
        },
        {
          "id": "c-4",
          "title": "1.4 战役四：守住续约、冠军流失与“有损服务”",
          "summary": "如何在客户关键人离职后保住阵地？面对极端异常时如何优雅退化？",
          "content": "\n<div class=\"prose\">\n    <h3>一、最危险的黑天鹅：内部冠军流失（Champion Churn）</h3>\n    <p>B2B 采购最残酷的规律是：<strong>买软件的高管与用软件的操作员不是同一批人，而且高管平均每 18~24 个月就会换岗或跳槽。</strong></p>\n    <p>如果你的项目高度依赖原赞助高管的个人信任（单点依赖），一旦该高管调任，继任者往往为了证明自己的新政，第一件事就是彻查并取消前任立项的所有外部采购。</p>\n    \n    <div class=\"callout warning\">\n        <strong>FDE 防翻车对策：</strong>\n        <ul>\n            <li><strong>向基层扎根：</strong>让系统真正嵌入每天 100 名基层员工的日常肌肉记忆中，做到“一旦停服，业务部门当天无法结账或下班”。</li>\n            <li><strong>建立季度量化价值账本（QBR Dashboard）：</strong>不要用口头汇报，定期向新任高管提交冰冷无情的财务事实：“过去一年，该系统为贵部门自动处理了 140 万份单据，抵御了 42 次合规风险，累计释放人力成本折合约 380 万元”。</li>\n        </ul>\n    </div>\n\n    <h3>二、工程防线：“有损服务”（Graceful Degradation）</h3>\n    <p>在面对企业高峰流量、大模型原厂 API 超时宕机、或客户底层网络断连时，系统绝不能直接弹出一行刺眼的 <code>Internal Server Error 500</code>。</p>\n    <p>FDE 必须设计多层退化兜底机制：<strong>当大模型不可用时，自动降级为基于规则与正则表达式的传统解析引擎；当外部向量库超时，降级为本地精确关键词搜索</strong>。宁可牺牲 10% 的智能化体验，也必须确保核心业务流永不中断。</p>\n</div>\n"
        },
        {
          "id": "c-5",
          "title": "1.5 战役五：扩大收入、按结果收费与存量深耕",
          "summary": "从一个边缘部门渗透进一张企业级大网，重塑 B2B 软件定价心理学。",
          "content": "\n<div class=\"prose\">\n    <h3>一、按结果收费（Outcome-Based Pricing）的降维打击</h3>\n    <p>传统的按人头席位收费（Per-Seat License）在 AI 时代正在崩塌——因为 AI 的本质是<strong>提高效率、减少人头</strong>。如果按席位收费，客户效率越高、使用人数越少，软件厂商赚的钱反而越少，这形成了利益冲突。</p>\n    <div class=\"callout tip\">\n        <strong>Anthropic / Palantir 式定价创新：</strong>\n        <ul>\n            <li><strong>不为软件买单，为“被解决的业务事件”买单：</strong>例如每成功自动处理并闭环一份复杂报关单收取 2 美元；每成功追回一笔疑似欺诈交易，抽取挽回资金的 5%。</li>\n            <li><strong>双赢结构：</strong>客户没有任何前期高额采购顾虑，只在实际产生业务增益时支付分成。厂商凭借极高的系统稳定性与准确率获得极度可观的利润空间。</li>\n        </ul>\n    </div>\n\n    <h3>二、存量深耕的“海星扩张战术”</h3>\n    <p>FDE 的突破口往往是客户内部最苦、最累、其他部门都不愿意碰的边缘脏活（例如退货物流异常标记）。一旦在这个点上打透并建立极高口碑，FDE 迅速顺藤摸瓜：</p>\n    <p>从退货单 ➔ 进销存数据 ➔ 采购供应链对账 ➔ 财务审计风控。<strong>最终将单个点状的 PoC 扩展为横跨企业三大核心部门的核心数据操作系统。</strong></p>\n</div>\n"
        },
        {
          "id": "c-6",
          "title": "1.6 战役六：规模化复制、Playbook 沉淀与产品化打磨",
          "summary": "打赢一场战役是偶然，打赢十场战役靠标准化打法手册。",
          "content": "\n<div class=\"prose\">\n    <h3>一、从“英雄主义”走向“工业化交付”</h3>\n    <p>优秀的 FDE 早期往往依靠极强的个人综合素质力挽狂澜。但如果一家公司全靠“特种兵个人英雄主义”，交付团队一旦扩张到 50 人以上就会发生严重的质量稀释与管理失控。</p>\n    \n    <div class=\"callout note\">\n        <strong>必须标准化的三大交付资产（Playbook）：</strong>\n        <ol>\n            <li><strong>行业数据本体模板（Vertical Ontology Kits）：</strong>针对金融、医疗、智能制造等特定垂直行业，预置标准的数据对象、关系图谱和常用工具集。</li>\n            <li><strong>标准审查通关包（Security & Compliance Fast-Pass）：</strong>将所有法务部门高频刁难的合规条款、网络架构图、渗透测试报告、DLP 审计预设打包成标准化文档库，将原本需要 3 个月的安全审查压缩至 3 天。</li>\n            <li><strong>自动化 Golden Test Set 生成流水线：</strong>入场后自动根据客户历史日志生成评测基线集，降低人工准备测试集的门槛。</li>\n        </ol>\n    </div>\n</div>\n"
        }
      ]
    },
    {
      "id": "engineering",
      "title": "模块二：无框架硬核工程手艺（全配双轨翻译看板）",
      "badge": "原生工程",
      "items": [
        {
          "id": "eng-1",
          "title": "2.1 生产级 ReAct 循环与状态机：为什么我们要删掉 LangChain？",
          "summary": "用纯原生代码构建可观察、可调试、带熔断保护与完整动态 Tool Spec 的 Agent 决策引擎。",
          "content": "\n<div class=\"prose\">\n    <div class=\"dual-track-card\">\n        <div class=\"dt-header\">🌐 双轨双语翻译看板 (Dual-Track Translation)</div>\n        <div class=\"dt-grid\">\n            <div class=\"dt-col\">\n                <span class=\"dt-badge tech\">技术人员视角 (Technical Spec)</span>\n                <p>重构 ReAct Agent 控制流，剥离第三方黑盒框架；引入原生 <code>inspect</code> 自动生成 Tool Spec、单次请求 Token 累加器与 <code>max_steps=6</code> 刚性熔断保护，彻底杜绝递归死循环。</p>\n            </div>\n            <div class=\"dt-col\">\n                <span class=\"dt-badge biz\">业务痛点映射 (Business Pain)</span>\n                <p>解决高并发与弱网场景下任务无限挂起、后台进程卡死导致的工单阻塞堆积，保障核心业务流程在任何不可抗力下 5 秒内返回明确状态。</p>\n            </div>\n            <div class=\"dt-col\">\n                <span class=\"dt-badge cxo\">CXO 财务账本与谈判话术</span>\n                <p><strong>“李总，我们彻底封死了死循环漏洞。单次任务的算力成本被硬性锁死在 0.08 元以内，系统可用性达到 99.9%，杜绝了因为单据卡死导致月度结算延期的运营事故。”</strong></p>\n            </div>\n        </div>\n    </div>\n\n    <h3>一、原生 Agent 状态机循环完整代码（100% 可直接执行）</h3>\n    <div class=\"code-container\">\n        <div class=\"code-header\">\n            <span>Python: 具备 inspect 原生内省与安全熔断的企业级 Agent</span>\n            <button class=\"copy-btn\" onclick=\"copyCode(this)\">复制代码</button>\n        </div>\n        <pre><code class=\"language-python\">import inspect\nimport json\nimport logging\nfrom typing import Dict, Any, List, Callable\n\nlogger = logging.getLogger(\"EnterpriseAgent\")\n\nclass ResilientEnterpriseAgent:\n    def __init__(self, client, tools: List[Callable], max_steps: int = 6, token_budget: int = 8000):\n        self.client = client\n        self.tool_map = {func.__name__: func for func in tools}\n        self.max_steps = max_steps\n        self.token_budget = token_budget\n\n    def _build_tool_spec(self, func: Callable) -> Dict[str, Any]:\n        \"\"\"使用 Python 原生 inspect 机制自动推断生成标准 OpenAI Tool Spec\"\"\"\n        sig = inspect.signature(func)\n        doc = inspect.getdoc(func) or \"No documentation provided.\"\n        properties = {}\n        required = []\n        \n        type_mapping = {int: \"integer\", float: \"number\", bool: \"boolean\", list: \"array\", dict: \"object\"}\n        for param_name, param in sig.parameters.items():\n            param_type = type_mapping.get(param.annotation, \"string\")\n            properties[param_name] = {\"type\": param_type, \"description\": f\"Field: {param_name}\"}\n            if param.default == inspect.Parameter.empty:\n                required.append(param_name)\n\n        return {\n            \"type\": \"function\",\n            \"function\": {\n                \"name\": func.__name__,\n                \"description\": doc,\n                \"parameters\": {\n                    \"type\": \"object\",\n                    \"properties\": properties,\n                    \"required\": required\n                }\n            }\n        }\n\n    def execute(self, user_intent: str, system_context: str) -> Dict[str, Any]:\n        history = [\n            {\"role\": \"system\", \"content\": system_context},\n            {\"role\": \"user\", \"content\": user_intent}\n        ]\n        \n        step_count = 0\n        total_tokens_consumed = 0\n        execution_trace = []\n\n        while step_count < self.max_steps:\n            step_count += 1\n            logger.info(f\"==> 执行第 {step_count}/{self.max_steps} 步推理循环\")\n\n            try:\n                response = self.client.chat.completions.create(\n                    model=\"gpt-4o\",\n                    messages=history,\n                    tools=[self._build_tool_spec(t) for t in self.tool_map.values()],\n                    tool_choice=\"auto\",\n                    temperature=0.1\n                )\n            except Exception as net_err:\n                logger.error(f\"模型调用网络异常: {net_err}\")\n                return {\"status\": \"FAILED\", \"reason\": \"API_TIMEOUT\", \"trace\": execution_trace}\n\n            msg = response.choices[0].message\n            history.append(msg)\n            \n            # 安全预算熔断拦截\n            if hasattr(response, 'usage') and response.usage:\n                total_tokens_consumed += response.usage.total_tokens\n                if total_tokens_consumed > self.token_budget:\n                    logger.warning(\"触发 Token 预算熔断拦截\")\n                    return {\"status\": \"ABORTED\", \"reason\": \"TOKEN_BUDGET_EXCEEDED\"}\n\n            # 无工具调用，表明已完成结论\n            if not msg.tool_calls:\n                return {\n                    \"status\": \"SUCCESS\",\n                    \"final_output\": msg.content,\n                    \"steps\": step_count,\n                    \"tokens\": total_tokens_consumed\n                }\n\n            # 受控执行工具并防御现场崩溃\n            for call in msg.tool_calls:\n                fn_name = call.function.name\n                call_id = call.id\n                raw_args = call.function.arguments\n\n                if fn_name not in self.tool_map:\n                    output = {\"error\": f\"Tool {fn_name} 未在沙箱中注册授权\"}\n                else:\n                    try:\n                        args = json.loads(raw_args)\n                        output = self.tool_map[fn_name](**args)\n                    except Exception as exec_err:\n                        logger.error(f\"工具 {fn_name} 现场运行崩溃: {exec_err}\")\n                        output = {\"error\": f\"工具执行失败: {str(exec_err)}\", \"retry_hint\": \"请检查输入参数格式\"}\n\n                execution_trace.append({\"step\": step_count, \"tool\": fn_name, \"status\": \"executed\"})\n                history.append({\n                    \"role\": \"tool\",\n                    \"tool_call_id\": call_id,\n                    \"content\": json.dumps(output, ensure_ascii=False)\n                })\n\n        return {\"status\": \"MAX_STEPS_REACHED\", \"trace\": execution_trace}\n</code></pre>\n    </div>\n</div>\n"
        },
        {
          "id": "eng-2",
          "title": "2.2 结构化输出（Structured Outputs）：基于 Pydantic 的刚性防御",
          "summary": "消除不可靠的字符串截取，让 LLM 与企业下游数据库实现 100% 格式对齐。",
          "content": "\n<div class=\"prose\">\n    <div class=\"dual-track-card\">\n        <div class=\"dt-header\">🌐 双轨双语翻译看板 (Dual-Track Translation)</div>\n        <div class=\"dt-grid\">\n            <div class=\"dt-col\">\n                <span class=\"dt-badge tech\">技术人员视角 (Technical Spec)</span>\n                <p>采用原厂约束解码（Constrained Decoding）与 Pydantic BaseModel 强类型 Schema 定义，对日期格式、字段命名、正负数范围做静态和动态二重拦截。</p>\n            </div>\n            <div class=\"dt-col\">\n                <span class=\"dt-badge biz\">业务痛点映射 (Business Pain)</span>\n                <p>杜绝因为大模型偶尔输出带 Markdown 解释、或日期格式从 2026-09 漂移成 2026/09 导致财务 ERP 解析报错退单的恶性事故。</p>\n            </div>\n            <div class=\"dt-col\">\n                <span class=\"dt-badge cxo\">CXO 财务账本与谈判话术</span>\n                <p><strong>“张总，这套 Schema 守门员让我们系统入库的格式准确率达到 100%，彻底消除了下游人工每天重新核对 200 笔异常订单的劳动，每年避免超 40 万元错账追索成本。”</strong></p>\n            </div>\n        </div>\n    </div>\n\n    <h3>一、代码实操：Pydantic 刚性结构化验证</h3>\n    <div class=\"code-container\">\n        <div class=\"code-header\">\n            <span>Python: 企业级强类型审查防御示例</span>\n            <button class=\"copy-btn\" onclick=\"copyCode(this)\">复制代码</button>\n        </div>\n        <pre><code class=\"language-python\">from pydantic import BaseModel, Field, field_validator\nfrom typing import List, Literal\n\nclass DiscrepancyItem(BaseModel):\n    field_name: str = Field(description=\"出现不一致的字段名称\")\n    contract_val: str = Field(description=\"合同原文表述\")\n    invoice_val: str = Field(description=\"发票记载数值\")\n    severity: Literal[\"HIGH\", \"MEDIUM\", \"LOW\"] = Field(description=\"风险等级\")\n\nclass SettlementAuditSchema(BaseModel):\n    batch_number: str = Field(description=\"严格格式: BATCH-YYYYMMDD-XXXX\")\n    vendor_tax_id: str = Field(description=\"18位统一社会信用代码\")\n    total_reconciled_amount: float = Field(ge=0, description=\"对账总金额，必须大于等于0\")\n    discrepancies: List[DiscrepancyItem] = Field(default_factory=list)\n    final_disposition: Literal[\"APPROVE\", \"REJECT\", \"ESCALATE_TO_HUMAN\"]\n\n    @field_validator(\"batch_number\")\n    def validate_batch_format(cls, v):\n        if not v.startswith(\"BATCH-\"):\n            raise ValueError(\"批次号前缀格式不符\")\n        return v\n\n# 原生调用保障 100% JSON Schema 一致性\nresponse = client.beta.chat.completions.parse(\n    model=\"gpt-4o\",\n    messages=[\n        {\"role\": \"system\", \"content\": \"进行结算对账严格审计。遵守所有字段规则。\"},\n        {\"role\": \"user\", \"content\": raw_unstructured_audit_text}\n    ],\n    response_format=SettlementAuditSchema\n)\nclean_record: SettlementAuditSchema = response.choices[0].message.parsed\nprint(f\"安全解析结果，最终决策: {clean_record.final_disposition}\")\n</code></pre>\n    </div>\n</div>\n"
        },
        {
          "id": "eng-3",
          "title": "2.3 Anthropic MCP（Model Context Protocol）企业实战协议",
          "summary": "如何用行业标准协议将企业数据源与工具无缝插拔？",
          "content": "\n<div class=\"prose\">\n    <div class=\"dual-track-card\">\n        <div class=\"dt-header\">🌐 双轨双语翻译看板 (Dual-Track Translation)</div>\n        <div class=\"dt-grid\">\n            <div class=\"dt-col\">\n                <span class=\"dt-badge tech\">技术人员视角 (Technical Spec)</span>\n                <p>基于 JSON-RPC 2.0 规范，将内网 GitLab、Jira、Postgres 数据库封装为标准 MCP Server，暴露统一的 Resources、Prompts 与 Tools 接口。</p>\n            </div>\n            <div class=\"dt-col\">\n                <span class=\"dt-badge biz\">业务痛点映射 (Business Pain)</span>\n                <p>过去每个系统、每次更换大模型都需要重新手写胶水代码；MCP 实现了数据源与 AI 引擎的解耦插拔，支持细粒度权限按需授权。</p>\n            </div>\n            <div class=\"dt-col\">\n                <span class=\"dt-badge cxo\">CXO 财务账本与谈判话术</span>\n                <p><strong>“王总，接入开放的 MCP 协议意味着贵司的所有数据接口只需开发一次。未来无论大模型市场是 OpenAI、Anthropic 还是国产开源模型胜出，这套资产永远通用，绝不沦为沉没成本。”</strong></p>\n            </div>\n        </div>\n    </div>\n\n    <h3>一、MCP 标准架构规范</h3>\n    <div class=\"callout note\">\n        <strong>三大核心资源定义：</strong>\n        <ul>\n            <li><strong>Resources（静态数据上下文）：</strong>类似于文件协议，提供只读的企业法规、API 规范上下文。</li>\n            <li><strong>Prompts（预制模板）：</strong>受控的提示词模板，供业务操作员直接唤醒标准化审查流程。</li>\n            <li><strong>Tools（可执行动作）：</strong>受安全审计日志保护的动态业务操作（如执行只读 SQL 查询）。</li>\n        </ul>\n    </div>\n</div>\n"
        },
        {
          "id": "eng-4",
          "title": "2.4 绝密基线：Air-Gapped 物理隔离网部署全景指南",
          "summary": "单向光闸、脱机私有化部署、零网络遥测防泄漏（DLP）实战规范。",
          "content": "\n<div class=\"prose\">\n    <div class=\"dual-track-card\">\n        <div class=\"dt-header\">🌐 双轨双语翻译看板 (Dual-Track Translation)</div>\n        <div class=\"dt-grid\">\n            <div class=\"dt-col\">\n                <span class=\"dt-badge tech\">技术人员视角 (Technical Spec)</span>\n                <p>构建自包含 Docker tar 离线镜像；排查源码与三方依赖中的静态外联请求；配置单向光闸（Data Diode）摆渡；使用 vLLM / AWQ 量化部署本地推理。</p>\n            </div>\n            <div class=\"dt-col\">\n                <span class=\"dt-badge biz\">业务痛点映射 (Business Pain)</span>\n                <p>军工、金融核心资产严禁连接公网，任何静默联网都会导致内网安全红牌告警并立刻中止合同。</p>\n            </div>\n            <div class=\"dt-col\">\n                <span class=\"dt-badge cxo\">CXO 财务账本与谈判话术</span>\n                <p><strong>“周总，我们的系统达到最高密级的物理脱机标准。核心数据在物理层面上根本没有通往外网的网线，完全符合人行监管与数据安全法，让您免受合规审查风险。”</strong></p>\n            </div>\n        </div>\n    </div>\n\n    <h3>一、Air-Gapped 离线部署四大纪律</h3>\n    <ol>\n        <li><strong>零动态依赖拉取：</strong>所有依赖必须打包为包含完整 C 绑定的本地 <code>.whl</code> 文件，严禁现场 <code>pip install</code>。</li>\n        <li><strong>单向光闸摆渡纪律：</strong>数据流向只进不出，更新补丁必须经过离线介质杀毒与多级保密审批。</li>\n        <li><strong>零外联遥测（Zero-Telemetry）：</strong>部署前全局搜索 <code>analytics</code>、<code>telemetry</code>、<code>sentry</code>、<code>update-check</code> 并彻底注释封杀。</li>\n        <li><strong>本地硬件压测：</strong>提前对 A100 / H800 / 国产算力卡进行显存预分配与最大并发压测，确定 SLA 吞吐底线。</li>\n    </ol>\n</div>\n"
        },
        {
          "id": "eng-5",
          "title": "2.5 Evals 驱动开发：RAGAS 体系与自动评测流水线",
          "summary": "把评测作为主骨架：Faithfulness、Relevance、Precision、Recall 数学定义与代码实操。",
          "content": "\n<div class=\"prose\">\n    <div class=\"dual-track-card\">\n        <div class=\"dt-header\">🌐 双轨双语翻译看板 (Dual-Track Translation)</div>\n        <div class=\"dt-grid\">\n            <div class=\"dt-col\">\n                <span class=\"dt-badge tech\">技术人员视角 (Technical Spec)</span>\n                <p>建立 Ragas 四维自动化评估基线，重点量化 Faithfulness（忠实度）与 Context Precision，每次 Prompt 或参数迭代跑批打分。</p>\n            </div>\n            <div class=\"dt-col\">\n                <span class=\"dt-badge biz\">业务痛点映射 (Business Pain)</span>\n                <p>业务主管凭借一两个偶发偏门案例质疑系统能力；缺乏客观标尺导致技术优化方向变成盲人摸象。</p>\n            </div>\n            <div class=\"dt-col\">\n                <span class=\"dt-badge cxo\">CXO 财务账本与谈判话术</span>\n                <p><strong>“陈总，我们用客观数学标尺锁定了系统质量。在 200 个黄金真实案件测试中，无幻觉真实度达到 98.4%，误判率低于人类资深审核员，这就是下周 UAT 签字的最佳底气。”</strong></p>\n            </div>\n        </div>\n    </div>\n\n    <h3>一、RAGAS 四维评估指标体系（真实学术计算逻辑）</h3>\n    <div class=\"table-container\">\n        <table class=\"data-table\">\n            <thead>\n                <tr>\n                    <th>评测维度</th>\n                    <th>核心评估意图</th>\n                    <th>真实底层算法 / 数学逻辑</th>\n                    <th>及格基准线</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr>\n                    <td><strong>Faithfulness (忠实度)</strong></td>\n                    <td>衡量输出内容是否 100% 来自检索到的上下文证据，严查无依据的幻觉</td>\n                    <td>将模型生成拆解为独立事实陈述（Statements），逐一通过 NLI 自然语言推理验证检索上下文是否 Entail（蕴含）该陈述：<code>|支持的事实| / |总事实陈述数|</code></td>\n                    <td><strong>&gt; 95%</strong> (金融/医疗必须 100%)</td>\n                </tr>\n                <tr>\n                    <td><strong>Answer Relevance (答案相关性)</strong></td>\n                    <td>衡量回答是否切中用户问题的核心，有无答非所问或废话</td>\n                    <td>使用 LLM 依据生成的回答<strong>反向生成 3 个合成问题</strong>，计算这 3 个合成问题向量与原始提问向量的平均余弦相似度（解决问答向量空间天然不匹配的问题）</td>\n                    <td><strong>&gt; 88%</strong></td>\n                </tr>\n                <tr>\n                    <td><strong>Context Precision (排序精度)</strong></td>\n                    <td>衡量检索返回的 Top-K 切片中，真正有价值的信息是否排在最前</td>\n                    <td>类似信息检索中的平均精度均值（Mean Average Precision，MAP）：<code>∑ (Precision@k * Relevance_k) / |总相关切片数|</code></td>\n                    <td><strong>&gt; 85%</strong></td>\n                </tr>\n                <tr>\n                    <td><strong>Context Recall (召回率)</strong></td>\n                    <td>衡量回答该问题所必需的客观事实，切片是否全部覆盖到位</td>\n                    <td><code>|检索内容中命中的黄金事实点数量| / |黄金基准事实点总数|</code></td>\n                    <td><strong>&gt; 90%</strong></td>\n                </tr>\n            </tbody>\n        </table>\n    </div>\n\n    <div class=\"code-hunt-block\">\n        <div class=\"code-hunt-header\">\n            <span>🔍 现场实战排错挑战：你能找出这 25 行代码中的 3 个致命隐患吗？</span>\n            <button class=\"copy-btn\" onclick=\"toggleCodeHuntSolution()\">揭示专家诊断</button>\n        </div>\n        <pre><code class=\"language-python\"># 现场客户提供的待上线脚本 snippet.py\nimport requests, json\n\ndef query_enterprise_agent(user_query):\n    # 隐患 A：缺少超时参数，遇弱网可能永久挂起导致线程池耗尽\n    resp = requests.post(\"http://api.internal/v1/chat/completions\", json={\"query\": user_query})\n    data = resp.json() # 隐患 B：未捕获 JSONDecodeError，下游报 502 时直接崩溃抛未处理异常\n    \n    # 隐患 C：向公网偷偷上传匿名打点，违背 Air-gap 绝密合规\n    requests.post(\"https://telemetry.open-stats.org/ping\", json={\"event\": \"query\"})\n    return data[\"choices\"][0][\"text\"]\n</code></pre>\n        <div id=\"code-hunt-solution\" class=\"hidden\" style=\"padding: 1rem; background: rgba(59, 130, 246, 0.1); border-top: 1px solid var(--border-subtle); font-size: 0.84rem;\">\n            <strong>【专家诊断与整改】：</strong><br>\n            1. <strong>致命挂起：</strong><code>requests.post</code> 必须显式设置 <code>timeout=(3.0, 15.0)</code> 连接与读取双超时；<br>\n            2. <strong>未捕获响应异常：</strong>先检查 <code>resp.status_code == 200</code>，再用 <code>try...except json.JSONDecodeError</code> 包裹；<br>\n            3. <strong>触发内网告警：</strong>彻底删除 <code>telemetry.open-stats.org</code> 外联上报，否则在单向光闸机房内将引发安全事故审查。\n        </div>\n    </div>\n</div>\n"
        }
      ]
    },
    {
      "id": "pbl-sandboxes",
      "title": "模块三：PBL 极限沙盒挑战与 Kata 训练场",
      "badge": "动手淬炼",
      "items": [
        {
          "id": "pbl-1",
          "title": "3.1 沙盒挑战 1：48小时极速搞定金融报表合规审查 Agent",
          "summary": "【PRD 挑战一】模拟真实复杂现场，克服缺失主键、扫描件反光与单向网络约束。",
          "content": "\n<div class=\"prose\">\n    <div class=\"challenge-banner\">\n        <span class=\"badge red\">PBL 极限实战 · 场景 1</span>\n        <h4>任务背景：某国有城商行信贷合规部（限时 48 小时）</h4>\n    </div>\n    <p><strong>业务痛点：</strong>信贷部每天接收上百家中小微企业提交的审计报告与完税证明。8 名专员人工审查，每份耗时 45 分钟，漏检率约 12%，贷款审批拖期长达 5 天。</p>\n    \n    <div class=\"callout warning\">\n        <strong>现场残酷约束：</strong>\n        <ul>\n            <li>客户内网严禁连接公网，仅提供本地配备单张 A100 GPU 的物理服务器；</li>\n            <li>历史财务报表大量为倾斜、存在印章遮挡的 PDF 扫描件；</li>\n            <li>必须在周五下午向信贷部总监进行现场实操演示（距当前仅剩 48 小时）。</li>\n        </ul>\n    </div>\n\n    <!-- 动态交互分支抉择沙盘 -->\n    <div class=\"branching-sandbox\" id=\"branch-pbl-1\">\n        <h4>⚔️ 决策十字路口：Day 1 上午进场，你的第一步动作是什么？</h4>\n        <div class=\"choice-group\">\n            <button class=\"choice-btn\" onclick=\"executePblChoice('pbl-1', 0)\">\n                A. 向行方信息部提工单，申请开通两周公网白名单并拉取 100GB 完整历史信贷数据\n            </button>\n            <button class=\"choice-btn\" onclick=\"executePblChoice('pbl-1', 1)\">\n                B. 绕开复杂审批，坐在合规组长工位旁观察其审核流程，并当场复制 30 份最折磨人的典型真实扫描件\n            </button>\n            <button class=\"choice-btn\" onclick=\"executePblChoice('pbl-1', 2)\">\n                C. 自己用 Python 在本地合成 50 份标准干净的假财务报表开始跑 Demo\n            </button>\n        </div>\n        <div id=\"pbl-1-outcome\" class=\"outcome-box hidden\"></div>\n    </div>\n</div>\n"
        },
        {
          "id": "pbl-2",
          "title": "3.2 沙盒挑战 2：工业车间离线排障与专家故障树诊断 Agent",
          "summary": "【PRD 挑战二】复杂工业现场：时序传感器数据、老旧设备图纸与零外网环境。",
          "content": "\n<div class=\"prose\">\n    <div class=\"challenge-banner\">\n        <span class=\"badge red\">PBL 极限实战 · 场景 2</span>\n        <h4>任务背景：大型重工制造基地动力车间（Air-Gap 隔离网）</h4>\n    </div>\n    <p><strong>业务痛点：</strong>数控重型铣床发生偶发性主轴振动报警，年轻技工翻看 2000 页纸质图纸往往需要停机排查 6 小时以上，每停机一小时产线损失超 5 万元。</p>\n    \n    <div class=\"callout warning\">\n        <strong>恶劣约束条件：</strong>\n        <ul>\n            <li>车间位于地下深井，手机完全无信号，厂区局域网与外网物理隔绝；</li>\n            <li>故障手册大部分为上世纪 90 年代的老旧扫描 TIFF 图纸，文字排版混杂着手绘装配电路图；</li>\n            <li>传感器报警数据每秒产生 500 个浮点数指标（温度、电流、振动频率）。</li>\n        </ul>\n    </div>\n\n    <!-- 动态交互分支抉择沙盘 -->\n    <div class=\"branching-sandbox\" id=\"branch-pbl-2\">\n        <h4>⚔️ 决策十字路口：面对每秒 500 个浮点数指标与 2000 页图纸，架构如何选型？</h4>\n        <div class=\"choice-group\">\n            <button class=\"choice-btn\" onclick=\"executePblChoice('pbl-2', 0)\">\n                A. 将传感器每秒原始高频数据全部拼接成长文本，直接丢给 128k 上下文的大模型做实时推理\n            </button>\n            <button class=\"choice-btn\" onclick=\"executePblChoice('pbl-2', 1)\">\n                B. 本地 Python 滑动窗口离线计算振动方差与均方根，仅把异常特征切片结合分块装配图构建本地 Multimodal RAG\n            </button>\n            <button class=\"choice-btn\" onclick=\"executePblChoice('pbl-2', 2)\">\n                C. 私自携带 4G 随身 WiFi 进入车间，把数据转发到云端商用大模型做处理\n            </button>\n        </div>\n        <div id=\"pbl-2-outcome\" class=\"outcome-box hidden\"></div>\n    </div>\n</div>\n"
        },
        {
          "id": "pbl-3",
          "title": "3.3 沙盒挑战 3：抗击“需求蝗虫”与高难 SOW 边界实战谈判",
          "summary": "【PRD 挑战三】真实商务博弈树：如何在不破坏客户关系的前提下砍掉 70% 无理定制？",
          "content": "\n<div class=\"prose\">\n    <div class=\"challenge-banner\">\n        <span class=\"badge red\">PBL 极限实战 · 场景 3</span>\n        <h4>任务背景：某跨国零售集团现场交付第 4 周</h4>\n    </div>\n    <p><strong>危机情境：</strong>一期系统原定下周二验收。周五下午副总带 5 个业务代表冲进会议室：“除了原定对账，你们必须在下周把跨境供应链关税预测和自动申报功能也做进去，否则我们下周绝不在 UAT 验收单上签字！”</p>\n\n    <!-- 动态交互分支抉择沙盘 -->\n    <div class=\"branching-sandbox\" id=\"branch-pbl-3\">\n        <h4>⚔️ 决策十字路口：面对突发性高压需求蔓延，作为主导 FDE 你该如何回应？</h4>\n        <div class=\"choice-group\">\n            <button class=\"choice-btn\" onclick=\"executePblChoice('pbl-3', 0)\">\n                A. “没问题赵总！为了客户满意度，我们团队这个周末通宵加急帮您赶出来！”\n            </button>\n            <button class=\"choice-btn\" onclick=\"executePblChoice('pbl-3', 1)\">\n                B. “赵总您违约了，原定 SOW 里根本没有这条，您不签字我们就通过法务发律师函。”\n            </button>\n            <button class=\"choice-btn\" onclick=\"executePblChoice('pbl-3', 2)\">\n                C. 三步法：接住远见 ➔ 锁定一期已实现的止血价值 ➔ 将关税申报升级为 Phase 2 专属立项并协助其申请预算\n            </button>\n        </div>\n        <div id=\"pbl-3-outcome\" class=\"outcome-box hidden\"></div>\n    </div>\n</div>\n"
        },
        {
          "id": "kata-arena",
          "title": "3.4 原子手艺 Kata：30分钟徒手写防御型 Agent 循环（含 5 级标尺与基准实现）",
          "summary": "【PRD 核心练习】脱离文档、手写生产级 Agent，附 5 级自测 Rubric 与逐行注解基准代码。",
          "content": "\n<div class=\"prose\">\n    <p><strong>训练目标：</strong>打开空白终端，30 分钟内徒手用 Python 编写可防御弱网和异常输入的企业级 Agent 控制流。</p>\n\n    <h3>一、FDE 专家级代码评分标尺 (5-Level Master Rubric)</h3>\n    <div class=\"table-container\">\n        <table class=\"data-table\">\n            <thead>\n                <tr>\n                    <th>段位级别</th>\n                    <th>核心代码特征</th>\n                    <th>生产可用性评价</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr>\n                    <td><strong>Level 1 (玩具级)</strong></td>\n                    <td>只调一次单轮 <code>client.chat.completions</code>，无状态保存与工具执行</td>\n                    <td>不可用于任何生产环境</td>\n                </tr>\n                <tr>\n                    <td><strong>Level 2 (脆弱级)</strong></td>\n                    <td>有 <code>while True</code> 循环和工具调用，但无 <code>try...except</code> 捕获，工具报错直接进程崩溃</td>\n                    <td>严重不可靠，存在宕机隐患</td>\n                </tr>\n                <tr>\n                    <td><strong>Level 3 (可用级)</strong></td>\n                    <td>具备 <code>max_turns</code> 循环轮数硬限制，能捕获工具异常并回传给模型纠偏</td>\n                    <td>勉强可用于低频内部辅助系统</td>\n                </tr>\n                <tr>\n                    <td><strong>Level 4 (防御级)</strong></td>\n                    <td>具备 Token 消耗累加器与预算熔断保护，支持超时熔断与网络抖动重试</td>\n                    <td>符合标准企业级交付门槛</td>\n                </tr>\n                <tr class=\"highlight-row\">\n                    <td><strong>Level 5 (大师级)</strong></td>\n                    <td>内置原生参数类型推断（无需硬编码 spec）、强类型 Pydantic 结构化解码守门员、全链路 Audit Trace 记录</td>\n                    <td><strong>顶级 FDE 标杆交付代码</strong></td>\n                </tr>\n            </tbody>\n        </table>\n    </div>\n\n    <h3>二、刻意练习自检清单</h3>\n    <div class=\"checklist-card\">\n        <label><input type=\"checkbox\" data-check-key=\"kata_max_turns\" onchange=\"updateChecklistProgress()\"> 1. 包含 <code>max_turns</code> 最大轮数硬限制，防止死循环无限消耗费用</label>\n        <label><input type=\"checkbox\" data-check-key=\"kata_exception\" onchange=\"updateChecklistProgress()\"> 2. 具备工具执行异常捕获，并在 tool message 中以友好方式回传错误原因供模型自行纠偏</label>\n        <label><input type=\"checkbox\" data-check-key=\"kata_token_limit\" onchange=\"updateChecklistProgress()\"> 3. 具备 Token 消耗累加器，当单次任务消耗超过预设阀值时立即安全熔断</label>\n        <label><input type=\"checkbox\" data-check-key=\"kata_pydantic\" onchange=\"updateChecklistProgress()\"> 4. 支持最终结论的 Pydantic 强类型格式化输出解析</label>\n    </div>\n</div>\n"
        }
      ]
    },
    {
      "id": "tools",
      "title": "模块四：交互式现场工具箱与双防线自检表",
      "badge": "现场核武",
      "items": [
        {
          "id": "m-jargon",
          "title": "4.1 FDE 交付现场 24+ 核心黑话词典（范冰原著完整收录）",
          "summary": "每词一句人话，彻底消除与硅谷及行业专家的沟通代沟。",
          "content": "\n<div class=\"prose\">\n    <div class=\"glossary-grid\">\n        <div class=\"glossary-item\">\n            <strong>本体（Ontology）</strong>\n            <p>把企业混乱的数据库表、业务逻辑和员工日常操作，翻译重组成大模型能够理解的统一语义层与对象关系网。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>训练营（Bootcamp）</strong>\n            <p>客户带着真实业务数据来，在 1 到 5 天内做出能用的端到端原型，高管现场敲定采购预算。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>回声 / 三角洲（Echo / Delta）</strong>\n            <p>Palantir 经典双人特种组合：Echo（业务领航员）负责读懂客户潜台词与组织政治；Delta（技术特种兵）负责现场敲代码解决技术死结。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>概念验证坟墓（PoC Purgatory）</strong>\n            <p>无限期、无清晰量化指标、无裁决拍板人的无休止试点，做着做着就死在半路上。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>最小可行部署（MVD）</strong>\n            <p>用最精简的工程投入，在最真实的客户环境里完整验证一次真实价值的发生。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>影子工作法（Shadowing）</strong>\n            <p>搬把椅子坐在真实业务用户身旁，静静观察并记录他度过完整的一天，洞察真实摩擦。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>灯塔客户（Lighthouse Customer）</strong>\n            <p>具有强烈行业风向标意义的标杆客户，其行业示范与公信力背书价值远超合同本身。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>需求蝗虫（Scope Locust）</strong>\n            <p>预算看似充裕但需求极度个性化杂乱、吸干团队全部精力却不产生任何可复用复利的客户。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>定制递减率（Decaying Customization）</strong>\n            <p>交付第 N 个客户时现场编写的代码量应显著低于第 1 个客户；如果不降反升，说明已经沦落为传统外包。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>有损服务（Graceful Degradation）</strong>\n            <p>在核心模型服务不可用时，系统自动降级为规则匹配或离线索引，保障客户核心业务绝不宕机中断。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>TTV（Time to Value）</strong>\n            <p>从 FDE 进场到客户获得第一次可衡量业务价值的时间，通常必须控制在 2~6 周内。</p>\n        </div>\n        <div class=\"glossary-item\">\n            <strong>NRR（Net Revenue Retention）</strong>\n            <p>净收入留存率。同一批老客户今年比去年多付还是少付，100% 为及格线，优秀达 130%+。</p>\n        </div>\n    </div>\n</div>\n"
        },
        {
          "id": "m-calc",
          "title": "4.2 交互式现场核武器：Cost of Inaction (CoI) 商业价值测算器",
          "summary": "输入客户实际业务数据，一键测算拖延上线的真实财务沉没损失（含 85% 自动化率折算）。",
          "content": "\n<div class=\"prose\">\n    <p>在向客户高层汇报时，谈“Prompt 调优和召回率”会被认为是技术炫技，谈<strong>“由于低效流程，贵司每天在无形中亏损多少钱”</strong>才能瞬间触动灵魂：</p>\n    \n    <div class=\"calculator-card\">\n        <div class=\"calc-grid\">\n            <div class=\"calc-field\">\n                <label>该业务线专职处理员工数（人）：</label>\n                <input type=\"number\" id=\"coi_staff\" value=\"30\" min=\"1\">\n            </div>\n            <div class=\"calc-field\">\n                <label>员工平均综合用工月成本（元/人/月）：</label>\n                <input type=\"number\" id=\"coi_salary\" value=\"16000\" min=\"1000\">\n            </div>\n            <div class=\"calc-field\">\n                <label>每日在重复机械性事务上的耗时比例（%）：</label>\n                <input type=\"number\" id=\"coi_pct\" value=\"45\" min=\"5\" max=\"100\">\n            </div>\n            <div class=\"calc-field\">\n                <label>过去一年因人工处理错误导致的违约/罚款/漏损总额（万元）：</label>\n                <input type=\"number\" id=\"coi_loss\" value=\"80\" min=\"0\">\n            </div>\n        </div>\n        <button class=\"action-btn\" onclick=\"executeCoICalculation()\">🚀 立即生成高管商业说服报告</button>\n\n        <div id=\"coi_output\" class=\"result-box hidden\">\n            <h4>📊 测算推演报告 (Executive Briefing)：</h4>\n            <div class=\"kpi-cards\">\n                <div class=\"kpi-card danger\">\n                    <span class=\"label\">每月纯低效人力沉没成本</span>\n                    <span class=\"val\" id=\"val_waste_monthly\">¥216,000</span>\n                </div>\n                <div class=\"kpi-card danger\">\n                    <span class=\"label\">企业每拖延 1 个月的综合不作为成本 (CoI)</span>\n                    <span class=\"val\" id=\"val_coi_monthly\">¥282,667</span>\n                </div>\n                <div class=\"kpi-card success\">\n                    <span class=\"label\">首年预计净释放商业价值（按 85% 自动化率折算）</span>\n                    <span class=\"val\" id=\"val_annual_gain\">¥2,883,200</span>\n                </div>\n            </div>\n            <div class=\"talk-track\">\n                <strong>💡 建议谈判话术：</strong>\n                <p>“张总，我们这个项目哪怕晚签约进场 2 个月，贵司在此期间因为重复劳动消耗和潜在合规错误造成的直接现金流损失就超过 56 万元。现在启动 48 小时 MVD 验证，您没有任何财务下行风险，却能立即止血。”</p>\n            </div>\n        </div>\n    </div>\n</div>\n"
        },
        {
          "id": "m-checklist",
          "title": "4.3 现场交付防波堤：SOW 边界与 Air-Gap 交付双清单",
          "summary": "【持久化已修复】采用稳定 Key 字典机制，逐一勾选确保零事故。",
          "content": "\n<div class=\"prose\">\n    <div class=\"dual-checklist\">\n        <div class=\"checklist-panel\">\n            <h4>📋 SOW 需求边界防御清单</h4>\n            <div class=\"check-group\">\n                <label><input type=\"checkbox\" data-check-key=\"sow_input_format\" onchange=\"updateChecklistProgress()\"> 1. 是否在合同中严格锁死输入数据类型（如仅支持文字类 PDF，不支持手写模糊复印件）？</label>\n                <label><input type=\"checkbox\" data-check-key=\"sow_acceptance_criteria\" onchange=\"updateChecklistProgress()\"> 2. 是否明确量化了验收指标（如“在 200 份标准集上准确率≥92% 即视为通过 UAT”）？</label>\n                <label><input type=\"checkbox\" data-check-key=\"sow_phase2_pool\" onchange=\"updateChecklistProgress()\"> 3. 是否设置了“Phase 2 待办池”，所有现场新增想法一律打入二期预算？</label>\n                <label><input type=\"checkbox\" data-check-key=\"sow_deadline\" onchange=\"updateChecklistProgress()\"> 4. 是否明确了客户配合人与数据提供的最后时限（防止客户拖延交付）？</label>\n            </div>\n        </div>\n        <div class=\"checklist-panel\">\n            <h4>🔒 Air-Gap 离线内网排雷清单</h4>\n            <div class=\"check-group\">\n                <label><input type=\"checkbox\" data-check-key=\"airgap_telemetry\" onchange=\"updateChecklistProgress()\"> 1. 是否全代码排查并移除了所有默认联网 Telemetry 统计代码？</label>\n                <label><input type=\"checkbox\" data-check-key=\"airgap_weights\" onchange=\"updateChecklistProgress()\"> 2. 容器镜像是否已固化所有本地模型权重与动态 C 动态库？</label>\n                <label><input type=\"checkbox\" data-check-key=\"airgap_cdn\" onchange=\"updateChecklistProgress()\"> 3. 前端 UI 是否完全剔除了外部公共 CDN 字体与 JS 引用？</label>\n                <label><input type=\"checkbox\" data-check-key=\"airgap_usb\" onchange=\"updateChecklistProgress()\"> 4. 离线移动存储介质是否已提前通过客户内网防病毒合规扫描？</label>\n            </div>\n        </div>\n    </div>\n</div>\n"
        }
      ]
    },
    {
      "id": "quizzes",
      "title": "模块五：实战决策考场与 10 题通关演练",
      "badge": "通关测验",
      "items": [
        {
          "id": "q-interactive",
          "title": "5.1 现场实战决策全景题库（带深度裁判与解析）",
          "summary": "10 道高保真现场困境单选/多选题，检验你的 FDE 综合决策段位。",
          "content": "\n<div class=\"prose\">\n    <div id=\"quiz-mount-point\">\n        <!-- 动态渲染题目 -->\n    </div>\n</div>\n"
        }
      ]
    },
    {
      "id": "dashboard",
      "title": "模块六：个人成长看板与交付战力雷达",
      "badge": "成长中枢",
      "items": [
        {
          "id": "dashboard-view",
          "title": "6.1 个人成长看板与 4 维交付战力雷达",
          "summary": "【战力评估引擎】四维雷达量化：商业对齐力、工程防御力、现场应变力、隔离合规力。",
          "content": "\n<div class=\"prose\">\n    <div id=\"dashboard-mount-point\">\n        <!-- 动态渲染看板与雷达图 -->\n    </div>\n</div>\n"
        }
      ]
    }
  ],
  "full_quizzes": [
    {
      "id": 1,
      "category": "commercial",
      "category_name": "商业对齐力",
      "q": "【商业博弈：面对 Scope Creep】在为一家银行交付合同比对 Agent 的第 3 周，业务主管要求在下周验收演示中顺便加上“对企业财报数据的自动提取与风控打分功能”。作为主导 FDE，以下哪种做法最专业？",
      "opts": [
        "A. 客户是上帝，熬夜加班把财报提取功能做出来，争取在演示中给领导一个巨大惊喜。",
        "B. 明确拒绝并指责客户违背契约，搬出法律条款告知这完全不在原定工作范围内。",
        "C. 认可业务价值，指出为了保障一期核心指标按时高质量验收上线，建议将财报风控列入 Phase 2 专属规划，并在 SOW 变更备忘录中做好记录。",
        "D. 让客户去找公司总部的销售重新谈合同，自己现场完全不过问。"
      ],
      "ans": 2,
      "exp": "优秀 FDE 必须兼顾‘客户关系维护’与‘项目防波堤’。无原则顺从会导致一期交付延误、质量崩塌；生硬拒绝破坏客户信任。最专业的做法是‘承接意图、锁定一期边界、导向二期商业合同’。"
    },
    {
      "id": 2,
      "category": "engineering",
      "category_name": "工程防御力",
      "q": "【架构防御：防下游系统崩溃】在将大语言模型生成的结算数据对接入客户核心 ERP（SAP）系统时，为了避免下游接口解析崩溃，以下哪项设计最具防御性？",
      "opts": [
        "A. 在 Prompt 里强调‘你必须输出标准 JSON，严禁输出 markdown 代码块’。",
        "B. 使用带有 Pydantic 强类型严格校验的 Structured Outputs，并在调用下游 API 前增加二次 Schema 校验守门员。",
        "C. 写一套复杂的正则表达式去截取字符串中的数字和括号。",
        "D. 遇到格式不匹配时，自动重试调用大模型 10 次直到格式正确。"
      ],
      "ans": 1,
      "exp": "Prompt 提示词是软约束，在极端并发下仍有概率漂移。基于约束解码（Constrained Decoding）与 Pydantic 强类型 Schema 是企业生产集成的生命线。"
    },
    {
      "id": 3,
      "category": "commercial",
      "category_name": "商业对齐力",
      "q": "【底层基因：Palantir 哲学】Palantir 强调的‘The Delta’在企业工程实践中本质是指什么？",
      "opts": [
        "A. 客户预算和公司报价之间的价格差额。",
        "B. 标准化通用产品与客户脏乱差的现实业务、老旧系统之间客观存在的最后 20%~30% 断层。",
        "C. 模型的理论准确率与实际准确率之间的数学误差。",
        "D. 销售承诺的功能和工程师实际交付功能之间的差距。"
      ],
      "ans": 1,
      "exp": "The Delta 是标准化通用软件与企业现实复杂性之间的客观物理鸿沟。FDE 的核心价值就是以极高的效率抹平它，并将现场沉淀出的共性模块反哺回 HQ 核心平台。"
    },
    {
      "id": 4,
      "category": "compliance",
      "category_name": "隔离合规力",
      "q": "【合规红线：物理隔离网】在 Air-Gapped（完全不联网的绝密机房）进行私有化部署时，以下哪项操作会导致致命灾难？",
      "opts": [
        "A. 提前将所有模型权重固化为本地量化格式（如 GGUF 或 AWQ）。",
        "B. 引入的三方开源库在 import 时默认尝试向外网发送版本检测或匿名 Telemetry 数据。",
        "C. 将前端资产全部本地打包，不调用外部公共 CDN 静态库。",
        "D. 将服务完整打包为独立的本地 Docker tar 镜像并使用私有 Registry 导入。"
      ],
      "ans": 1,
      "exp": "在单向光闸隔离网内，静默的外联请求会造成长时间超时卡死，更会触发客户安全运营中心（SOC）的违规外联红牌告警。"
    },
    {
      "id": 5,
      "category": "engineering",
      "category_name": "工程防御力",
      "q": "【评测标尺：RAGAS 体系】在客户反映‘机器人经常信口雌黄、编造政策法规’时，FDE 应当优先重点优化评估体系中的哪一项核心指标？",
      "opts": [
        "A. Answer Relevance（答案相关性）",
        "B. Latency（第一字输出延迟）",
        "C. Faithfulness（真实忠实度/无幻觉率）",
        "D. Context Precision（上下文排序精度）"
      ],
      "ans": 2,
      "exp": "Faithfulness 专门度量生成内容能被参考依据严格证明的比例，是抑制和诊断大模型幻觉的最核心标尺。"
    },
    {
      "id": 6,
      "category": "commercial",
      "category_name": "商业对齐力",
      "q": "【敏捷战役：MVD 理念】关于‘最小可行部署（MVD）’与传统‘Demo 演示’的区别，以下理解最准确的是？",
      "opts": [
        "A. Demo 是在干净的测试集上给客户展示可能，MVD 是在客户真实脏数据与内网环境里跑通一次确定的真实价值。",
        "B. Demo 代码量比 MVD 更多、功能更全面。",
        "C. MVD 只给基层看，Demo 只给领导看。",
        "D. 两者没有本质区别，只是换了个名词包装。"
      ],
      "ans": 0,
      "exp": "Demo 可以在理想环境伪造繁荣，但无法证明在真实生产环境中的可用性。MVD 是用最小工程投入在客户真实环境里击穿确定性。"
    },
    {
      "id": 7,
      "category": "crisis",
      "category_name": "现场应变力",
      "q": "【组织博弈：单点依赖】项目中力推 AI 项目的副总裁突然离职，新上任的高管对该项目态度冷淡。作为主导 FDE，以下哪种措施最有效？",
      "opts": [
        "A. 托关系打听新高管的私人喜好，送礼拉近私人关系。",
        "B. 准备一份详实的量化业务价值回顾报告（QBR），展示系统为业务带来的真实人效提升与挽回损失，并证明一线基层业务已对系统形成刚需依赖。",
        "C. 立即停止系统更新维护，消极对待。",
        "D. 给公司高层汇报，建议直接终止合作退出该客户。"
      ],
      "ans": 1,
      "exp": "对抗‘冠军流失（Champion Churn）’最强有力的护城河是‘无法辩驳的财务与业务事实’加上‘底层员工已沉淀的不可替代刚需’。"
    },
    {
      "id": 8,
      "category": "engineering",
      "category_name": "工程防御力",
      "q": "【工程鲁棒性：Agent 熔断】在设计生产级自主 Agent 时，为什么要严格设定 `max_turns` 和 Token 消耗预算？",
      "opts": [
        "A. 为了节约服务器电费。",
        "B. 当模型遇到死循环调用或解析错误时，防止费用无限失控激增与线程挂死雪崩。",
        "C. 大模型官方 API 规定每次任务不得超过 3 次调用。",
        "D. 纯属个人代码习惯，在生产环境中并不必要。"
      ],
      "ans": 1,
      "exp": "Agent 在遇到外部接口偶发异常时容易陷入‘尝试-失败-再尝试’的无尽循环，没有硬预算与轮数熔断会导致账单天价爆炸甚至把下游系统打崩。"
    },
    {
      "id": 9,
      "category": "commercial",
      "category_name": "商业对齐力",
      "q": "【商业模式：定价逻辑】为什么说 AI 时代传统的‘按人头席位计费（Per-Seat）’会产生利益冲突？",
      "opts": [
        "A. 因为客户不喜欢按年续费。",
        "B. 因为 AI 的核心价值是提高效率减少人手；按席位计费意味着客户效率越高、使用人头越少，软件商赚的钱反而越少。",
        "C. 因为大模型 API 价格每年都在降低。",
        "D. 因为按席位计费无法开具增值税专用发票。"
      ],
      "ans": 1,
      "exp": "按席位收费违背了 AI 替代/增强人力的经济学规律。按成果收费（Outcome-based Pricing，如按处理单量或挽回金额）才能实现甲乙双方利益完全绑定。"
    },
    {
      "id": 10,
      "category": "crisis",
      "category_name": "现场应变力",
      "q": "【组织进化：产品化咨询】如何判断一个 FDE 团队是在做‘高级外包’还是在践行真正的‘产品化咨询’？",
      "opts": [
        "A. 看工程师写代码时用的是 Python 还是 Java。",
        "B. 看向总部核心产品反哺通用模块的频率，以及新客户交付时现场定制代码所占比例（定制递减率）是否持续下降。",
        "C. 看客户现场支付的合同金额大小。",
        "D. 看团队出差的差旅补贴标准。"
      ],
      "ans": 1,
      "exp": "真正的 FDE 组织是‘飞轮效应’：从前线踩坑中淬炼共性，反哺 HQ 核心平台，使后续客户交付的成本递减、交付速度递增。"
    }
  ],
  "pbl_scenarios": {
    "pbl-1": {
      "title": "金融报表审查沙盘",
      "crossroads": [
        {
          "text": "向行方信息部提工单，申请开通两周公网白名单并拉取 100GB 完整历史信贷数据",
          "status": "FAIL",
          "trust": -30,
          "delay": 21,
          "outcome": "❌ 严重踩雷：安全委员会驳回白名单申请，并以‘数据合规意识淡薄’为由约谈行方对接人，立项冻结 3 周，PoC 破产。"
        },
        {
          "text": "绕开复杂审批，坐在合规组长工位旁观察其审核流程，并当场复制 30 份最折磨人的典型真实扫描件",
          "status": "SUCCESS",
          "trust": 45,
          "delay": 0,
          "outcome": "✅ 闪电战打法：4小时内避开繁琐审批，精准锁定包含反光、印章遮挡的核心 Golden Test Set，当晚跑通最小验证闭环！"
        },
        {
          "text": "自己用 Python 在本地合成 50 份标准干净的假财务报表开始跑 Demo",
          "status": "FAIL",
          "trust": -15,
          "delay": 5,
          "outcome": "⚠️ 沦为玩具：周五演示时业务骨干随手拿了一张真实的折角旧发票测试直接识别错位，总监评价：‘只能活在理想环境的玩具’。"
        }
      ]
    },
    "pbl-2": {
      "title": "工业地下离线排障沙盘",
      "crossroads": [
        {
          "text": "将传感器每秒原始高频数据全部拼接成长文本，直接丢给 128k 上下文的大模型做实时推理",
          "status": "FAIL",
          "trust": -20,
          "delay": 4,
          "outcome": "❌ 显存爆炸：本地单卡 A100 在第 3 秒报 CUDA OOM（显存溢出），推理时延高达 48 秒，完全无法应对每秒刷新的工业报警。"
        },
        {
          "text": "本地 Python 滑动窗口离线计算振动方差与均方根，仅把异常特征切片结合分块装配图构建本地 Multimodal RAG",
          "status": "SUCCESS",
          "trust": 40,
          "delay": 0,
          "outcome": "✅ 工业级工程架构：输入 Token 暴降 98%，毫秒级捕获异常波峰并在 1.2 秒内定位装配图纸轴承位，总工当场鼓掌签字！"
        },
        {
          "text": "私自携带 4G 随身 WiFi 进入车间，把数据转发到云端商用大模型做处理",
          "status": "FAIL",
          "trust": -50,
          "delay": 30,
          "outcome": "❌ 毁灭性事故：地下车间无蜂窝信号导致频繁超时，更触发保密厂区无线电监测告警，被厂保卫处当场驱逐出场。"
        }
      ]
    },
    "pbl-3": {
      "title": "抗击需求蝗虫谈判沙盘",
      "crossroads": [
        {
          "text": "“没问题赵总！为了客户满意度，我们团队这个周末通宵加急帮您赶出来！”",
          "status": "FAIL",
          "trust": -25,
          "delay": 14,
          "outcome": "❌ 交付灾难：通宵硬编码导致主干系统出现多处未测试的 Regression Bug，周二验收直接大崩溃，团队精疲力竭仍遭索赔。"
        },
        {
          "text": "“赵总您违约了，原定 SOW 里根本没有这条，您不签字我们就通过法务发律师函。”",
          "status": "FAIL",
          "trust": -40,
          "delay": 60,
          "outcome": "❌ 商务自杀：副总大怒并在集团高管会上投诉乙方法务态度恶劣，冻结全项目验收款并启动供应商清退流程。"
        },
        {
          "text": "三步法：接住远见 ➔ 锁定一期已实现的止血价值 ➔ 将关税申报升级为 Phase 2 专属立项并协助其申请预算",
          "status": "SUCCESS",
          "trust": 50,
          "delay": 0,
          "outcome": "✅ 资深特种兵战法：副总不仅欣然同意周二先在一期验收单上签字，还拉着 FDE 共同向集团执委会申请了 150 万元的二期专项预算！"
        }
      ]
    }
  }
};

if (typeof window !== 'undefined') {
  window.FDE_ALL_DATA = FDE_ALL_DATA;
}
