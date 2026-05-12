# toilets.json — 数据集核对说明

> 这份说明配合 `toilets.json` 使用。共 30 条记录。所有条目都经过网页搜索核实了关键事实（设计师、年份、地点），但仍有些细节需要你亲自二次确认才能上线。

---

## 1. 数据分布

| 维度 | 数量 |
|---|---|
| **总数** | 30 条 |
| **亚洲** | 17（日本 14 + 新加坡 1 + 印度 1 + 土耳其 1） |
| **欧洲** | 10（英国 3 + 法国 1 + 挪威 5 + 意大利 1） |
| **北美** | 2（美国） |
| **大洋洲** | 1（新西兰） |
| **南美 / 非洲** | 0 |

**为什么分布这么偏？** 真正有据可查、上过 Dezeen/ArchDaily/Wikipedia 的"设计师署名公共厕所"在全球分布极不均匀：日本的 Tokyo Toilet 项目一家独占 17 个，挪威的 National Scenic Routes 项目又集中产出了一批观景厕所。其他地区即使有，多半也是商业空间（餐厅/酒店/商场）里的设计厕所，而非真正意义上的"公共"厕所。我没法编造南美/非洲的案例来凑数字平衡，建议你：
1. 上线时如实呈现这个分布（这本身就是个有趣的观察点）
2. 在 About 页说明"欢迎投稿你身边的案例"，慢慢补全

---

## 2. 信心分级

### 🟢 高信心（直接可用，已网页核实）
- 所有 **Tokyo Toilet 项目** 的 12 条（1–12）：设计师、年份、地点都从官方网站 tokyotoilet.jp 和 Nippon Foundation 直接确认
- **Ichihara Toilet in Nature**（13）：Sou Fujimoto 2012，多篇建筑媒体确认
- **Hundertwasser Toilets**（30）：Wikipedia + Heritage New Zealand 官方文件
- **Sketch London 蛋形厕所**（15）：India Mahdavi 2003 多源核实
- **Don't Miss a Sec**（16）：Galerie Peter Kilchmann 作品页 + 多家媒体
- **Uritrottoir**（17）：Faltazi 官网 + Dezeen 等多源
- **挪威 5 条**（18–22）：Visit Norway 官方 + 各事务所网站
- **Bryant Park**（26）：Wikipedia 详尽词条
- **"America" 金马桶**（27）：Guggenheim + 多源
- **Sulabh Museum**（29）：长期运营，多源
- **Ephesus / Pompeii Latrines**（23, 25）：基础史实
- **Marina Bay Sands**（28）：RAS 官网

### 🟡 中等信心（已核实主要事实，部分细节需你核对）
- **Tofuku-ji Tōsu**（14）：作为日本现存最古老的禅宗寺院厕所，是 Important Cultural Property——但具体建造年份在不同资料里在 1394 到 1425 之间略有差异，我用了 1425。**建议你访问 Tofuku-ji 官网或致信寺方确认具体年份**
- **Hampton Court "Great House of Easement"**（24）：作为亨利八世时期的厕所是史实，但"同时容纳 28 人"这个数字在不同来源里在 14 到 28 之间不等。**建议核对 Historic Royal Palaces 官方说明**

---

## 3. 每条记录都需要你做的事

### 📷 图片（最大的工作量）

我把 `images` 和 `coverImage` 字段填的都是**占位路径** `/images/<id>/cover.jpg`，**真实图片需要你自己找并放进项目的 `/public/images/<id>/` 文件夹里**。

**图片来源建议**：

| 类型 | 推荐渠道 | 注意事项 |
|---|---|---|
| Tokyo Toilet 项目（1–12） | tokyotoilet.jp、Nippon Foundation 官网新闻稿 | 摄影师都是 Satoshi Nagare，使用前 **必须** 申请使用许可 |
| Ichihara（13） | Sou Fujimoto Architects 官网 | 摄影师 Iwan Baan，**必须** 申请许可或使用 CC 来源，或用image2自己生成 |
| Tofuku-ji（14） | Wikimedia Commons | 搜索 "Tofuku-ji"，过滤 CC-BY 协议 |
| Sketch（15） | Sketch 官网 press kit / 自己去拍 /image2生成 | 生成是最稳妥的 |
| Don't Miss a Sec（16） | Galerie Peter Kilchmann + Getty Images | Getty 要付费 |
| Uritrottoir（17） | Faltazi 官网 press materials | 申请使用 |
| 挪威 5 条（18–22） | Norwegian Scenic Routes 媒体库 nasjonaleturistveger.no | 多数允许媒体使用，注明出处 |
| Pompeii / Ephesus / Hampton Court 历史厕所 | **Wikimedia Commons** 是首选 | 大量 CC-BY 和 CC-BY-SA 图片 |
| Bryant Park（26） | Bryant Park Corporation press images | 申请使用 |
| Cattelan 金马桶（27） | Guggenheim Museum 新闻档案 | 仅编辑用途 |
| Marina Bay Sands（28） | MBS 官方 press images | 申请使用 |
| Sulabh Museum（29） | Sulabh 官网 + Wikimedia Commons | 部分 CC 可用 |
| Hundertwasser（30） | Wikimedia Commons 大量 CC 图 | 容易找 |

> ⚠️ **图片版权是最容易踩坑的环节**。最稳妥的路径：**优先用 Wikimedia Commons CC-BY/CC0 图片**。其次去 Unsplash / Pexels 搜（但这些平台上著名厕所的图不多）。再次是写邮件给版权方申请许可。**永远不要直接抓 Instagram/小红书/微博的图**。

### 📍 坐标（建议复核）

我提供的 `coordinates` 是基于地名的近似值，**精确到小数点后 4 位（约 10m）的需要你用 Google Maps 复核**：

1. 打开 Google Maps，搜厕所名字或地点
2. 右键厕所所在位置 → 复制 lat/lng
3. 替换 `coordinates.lat` 和 `coordinates.lng`

特别需要复核的：
- Tokyo Toilet 系列：tokyotoilet.jp 每个厕所页面都有官方地图
- 挪威观景厕所：可能在 Google Maps 上没有精确点位，参考 nasjonaleturistveger.no

### 🕒 开放时间和费用（最容易过时）

- Sketch（15）：餐厅营业时间会变，**上线前访问 sketch.london 确认**
- Hampton Court（24）：Historic Royal Palaces 季节调整开放时间
- Ephesus / Pompeii：考古遗址夏冬时间不同
- Sulabh Museum（29）：印度公共假期较多，建议加一句"call ahead"
- Bryant Park（26）：跟随公园季节开放时间

### ⚠️ 必须核对的事实点

| 条目 | 注意事项 |
|---|---|
| 1, 2（Ban 透明厕所） | 完工日期都是 2020-08-05（已确认） |
| 14（Tofuku-ji） | 年份 1425 是估值；更严谨可写 "Muromachi period (early 15th century)" |
| 24（Hampton Court） | "28 人同时使用"这个数字可能要写得保守一点，比如 "up to 28" |
| 27（Cattelan） | 这件作品 2019 年在 Blenheim Palace 被盗，至今未找回——你的描述提到了这点，没问题 |

---

## 4. 字段命名 vs PRD 的一致性

我严格按 PRD 第 4 节的字段写。已经包含的字段：
- `id` `name` `nameLocal` `city` `country` `countryCode` `region`
- `coordinates {lat, lng}`
- `designStyles[]` `features[]`
- `designer` `architectFirm` `yearBuilt`
- `tagline`（全部 ≤ 80 字符 ✓）
- `story`
- `visitorTips[]`
- `openingHours` `fee` `accessibility`
- `images[]` `coverImage`
- `sources[]`

如果你后续给 Claude Code 用，让它生成 TypeScript 类型时把 `nameLocal` 设为可选 `string | null`，因为部分欧洲条目我设为 `null`。

---

## 5. designStyles 和 features 的取值

我用的取值（建议你的 TypeScript 类型用 union literal 而非 string）：

**designStyles** 实际使用的值：
- `"Minimalist"` `"Traditional"` `"Futuristic"` `"Brutalist"` `"Whimsical"` `"Heritage"`

**features** 实际使用的值：
- `"Scenic View"` `"Eco-friendly"` `"Art Installation"` `"Smart Tech"` `"Accessible"` `"Historic"`

和 PRD 第 3 节 F2 完全一致。

---

## 6. 让 Claude Code 验证导入

把数据塞进项目后，让 Claude Code 跑一遍：

```
请检查 data/toilets.json：
1. JSON 语法有效
2. 所有 id 唯一且符合 kebab-case
3. 所有 region 是 PRD 第 4 节定义的 6 个枚举值之一
4. 所有 designStyles 和 features 数组都符合 PRD 第 5 节列表
5. 所有 coordinates.lat 在 -90 到 90、lng 在 -180 到 180
6. 所有 yearBuilt 是数字
7. 所有 tagline 在 80 字符以内
8. coverImage 在 images 数组里能找到对应的 src
报告问题清单，不要直接改。
```

这一步能帮你在写代码前就抓住所有数据级别的错误。

---

## 7. 你应该如何使用这份数据

1. **不要把这份数据当成"最终成品"**——它是 80% 准确的草稿，省了你 80% 的研究时间
2. **把每条 sources 数组里的 URL 都点进去看一遍**——这是最高效的事实核对方式
3. **图片找齐前，先用占位图把网站跑通**——可以用 https://placehold.co/1600x900 这种 URL，确保布局 OK
4. **想增删条目就直接编辑 JSON**，不需要数据库、不需要 CMS。这是 MVP 阶段的核心优势

---

**下一步：** 把 `toilets.json` 放到项目的 `data/` 目录下，进入 PRD 的 Phase 4.2 数据模型阶段。
