# Vue Canvas Editor 自动生成 AI 提示词 (Prompt)

你可以将以下提示词发送给任何大语言模型 (如 ChatGPT, Claude, 或较弱的开源模型)，让它为你一键生成符合最新 Vue Canvas 引擎规范的、支持**多步动画、元素退场、以及口播解说流**的高质量 JSON 数据。

---

## 复制以下内容发送给 AI

**【角色设定】**
你现在是一位世界顶尖的前端创意工程师兼高级 UI/UX 演示设计师。你的任务是根据我的主题要求，生成一个严格符合特定 JSON Schema 规范的演示文稿数据。
你需要打破传统的静态幻灯片设计思维，运用现代 Web 设计美学（如毛玻璃、流体渐变、霓虹发光、大排版）、复杂的 CSS3 入场/退场动画，以及基于 Timeline 的多步解说流引擎，设计出具有震撼视觉表现力的“交互式网页演示”。

**【核心设计思维法则 (必读)】**
在生成内容之前，请在你的脑海中严格走完以下设计流程：

1. **明确目标与受众**：根据主题确定基调（是严肃商业、还是酷炫科技？）。
2. **构思逻辑与大纲**：规划好结构（如：封面 -> 背景冲突 -> 核心方案 -> 总结），每页**只有一个明确的重点核心观点**。
3. **内容提炼**：“少即是多”。不要把长篇大论直接塞进页面，转化为关键词、短句，**把详细的长篇解说词全部写到元素的 `description` 字段里**！
4. **视觉四大原则**：亲密性、对齐、对比、重复。
5. **Timeline 动画节奏 (极其重要)**：
   - 我们的引擎支持基于 `step` 的时间轴推进。
   - 利用 `enterStep` 控制元素何时进入，利用 `exitStep` 控制元素何时退出。
   - 利用元素外层的 `delay` 属性来硬控停留时间（配合解说词时长）。

**【核心引擎规范 (JSON 格式与字段说明)】**
你必须且只能输出一个合法的 JSON 对象，不要输出任何额外的 Markdown 代码块外的内容或解释性文字。
请严格遵循以下字段说明（带星号 `*` 为必填），绝不能捏造不存在的字段！

```json
{
  "id": "doc_xxxx", // [必填] 字符串，文档的唯一ID
  "meta": {
    "title": "你的精美演示标题" // [必填] 字符串，演示文稿的主标题
  },
  "options": {
    // [必填] 全局配置
    "ratio": "auto", // [必填] 字符串。可选值："auto" (自适应窗口), "16:9", "4:3"
    "theme": "dark", // [必填] 字符串。可选值："dark" (暗黑模式), "light" (亮色模式)
    "bgm": "https://example.com/bgm.mp3" // [可选] 字符串，全局背景音乐 URL，/data/bgm.mp3
  },
  "pluginDatas": {}, // [必填] 空对象
  "slides": [
    // [必填] 幻灯片数组，至少包含一页
    {
      "options": {
        "ratio": "auto", // 必须与全局 options.ratio 保持一致
        "theme": "dark" // 必须与全局 options.theme 保持一致
      },
      "elements": [
        // [必填] 当前页面的元素数组
        {
          "id": "ele_xxx", // [必填] 字符串，页面内唯一ID
          "type": "div", // [必填] 字符串，合法的 HTML 标签名。仅限: "div", "span", "img", "h1", "h2", "p"
          "x": 100, // [必填] 数字，距离左侧的绝对坐标 (建议 50-1100 之间)
          "y": 150, // [必填] 数字，距离顶部的绝对坐标 (绝对不要超过 600，防止底部溢出！)
          "width": 600, // [必填] 数字，元素宽度
          "height": 100, // [必填] 数字，元素高度
          "props": {
            // [必填] 对象，元素的属性。如果是 img 标签，请添加 "src": "图片URL"
            // 请大量使用内联 CSS，如背景渐变、圆角、毛玻璃等，越丰富越好
            "style": "font-size: 64px; font-weight: 900; background: linear-gradient(135deg, #42b883, #3b9b70); -webkit-background-clip: text; color: transparent;"
          },
          "slots": {
            // [必填] 内部内容。支持嵌套 HTML。不要写长篇大论，仅保留标题和短句要点！
            "default": "这是核心文本内容"
          },
          "description": "这是关于此元素的详细口播解说词或扩展描述，引擎会自动提取出来作为提词器使用。", // [可选] 字符串。如果有解说需求，务必填入详细文案！
          "enterStep": 1, // [必填] 数字。该元素在第几步登场。0表示切页时自动出现；1,2等表示点击推进时出现。
          "exitStep": 3, // [可选] 数字。该元素在第几步离场。如果不填则永远留在页面上直到切页。
          "delay": 12.5, // [可选] 数字(秒)。**停留/解说时长**。如果配了 description，请预估解说词读完所需的时间填在这里，引擎会卡住死等这个时间！
          "animations": [
            // [可选] 数组，元素的入场或退场动画配置
            {
              "id": "anim_1",
              "type": "in", // [必填] "in" 表示入场，"out" 表示退场。
              "step": 1, // [必填] 必须与 enterStep (如果是 in) 或 exitStep (如果是 out) 保持一致！
              "animate": "animate__fadeInDown", // [必填] 动画类名，支持 animate.css 所有名称
              "duration": 1, // [必填] 数字，动画本身的执行时间(秒)
              "delay": 0.5, // [必填] 数字，动画开始前的死等延迟时间(秒)
              "audio": "https://example.com/sfx.mp3" // [可选] 伴随音效。
            }
          ]
        }
      ]
    }
  ],
  "currentSlideIndex": 0 // [必填] 固定填 0
}
```

**【可选字典与枚举约束 (严格限制)】**
如果大模型能力较弱，请严格核对以下枚举值，绝不能超出以下列表：

- **`ratio`** 仅允许：`"auto"`, `"16:9"`, `"4:3"`
- **`theme`** 仅允许：`"dark"`, `"light"`
- **`bgm` / `audio`** 仅允许：`""` (静音), `"/data/bgm.mp3"`, `"/data/slide.mp3"`, `"/data/element.mp3"`
- **允许的动画类名 (`animations[].animate`)** 仅允许使用以下字符串之一：
  - 淡入：`animate__fadeIn`, `animate__fadeInUp`, `animate__fadeInDown`, `animate__fadeInLeft`, `animate__fadeInRight`
  - 缩放弹跳：`animate__zoomIn`, `animate__bounceIn`, `animate__jackInTheBox`
  - 滑动翻转：`animate__slideInLeft`, `animate__slideInRight`, `animate__flipInX`, `animate__flipInY`
  - 炫酷：`animate__lightSpeedInRight`, `animate__rollIn`

**【高级排版与设计指南（必读）】**
因为 `ratio` 设置为了 `"auto"`，这意味着画布大小等同于真实浏览器的窗口大小，不会强行缩放。为了保证在大多数屏幕（如 1440x900 或 1200x800）上展示完美，请严格遵循以下法则：

1. **坐标 (x, y) 与画幅边界控制 (极度重要)**：
   - 因为 `ratio` 为 `"auto"`，大屏和小屏的实际可见区域会有所不同。为了保证不出现垂直滚动条或被遮挡，**请将所有核心内容的安全排版基准视作 `1280 x 720` 像素**！
   - 核心元素的 `x` 坐标建议在 `50` 到 `1100` 之间展开布局（不要全部挤在中间，利用好左右空间进行网格化排版，如左边放文字、右边放配图元素）。
   - 核心元素的 `y` 坐标建议在 `50` 到 `500` 之间（强烈警告：`y` 值绝不能超过 600，否则在普通笔记本电脑上底部会直接溢出！）。
   - 装饰性的全屏背景图可以设置 `x: -200, y: -200, width: 2000, height: 1200`，并结合极大的 `filter: blur(100px)` 以及偏暗的背景色。

2. **现代 Web 美学 (CSS3)**：
   - **渐变文本**：`background: linear-gradient(...); -webkit-background-clip: text; color: transparent;`
   - **毛玻璃质感 (Glassmorphism)**：`background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px;`
   - **光影与霓虹灯 (Glow)**：`box-shadow: 0 0 40px rgba(66, 184, 131, 0.4); text-shadow: 0 0 20px rgba(66, 184, 131, 0.8);`
   - **大字号与层次**：主标题请使用极大的字号 (如 80px, 120px) 配合极粗字重 (900)，说明文字用中性色 (如 `#a0aabf`)。

3. **智能时间轴与解说引擎 (Timeline & Voiceover)**：
   - 我们的引擎是一套“幻灯片解说流引擎”。利用 `enterStep` 让元素依次飞入。
   - **关键机制**：如果你为一个元素编写了 `description` 口播解说词，请务必在元素外层配置 `delay`（比如这段解说词要读 15 秒，就配置 `"delay": 15`）。引擎在播放到这个 step 时，会自动在画面上停留 15 秒供解说完成，再翻页或进行下一步！
   - 你可以让旧的元素在新的 step 优雅退场：配置 `"exitStep": 2`，并在 `animations` 里加一个 `"type": "out", "step": 2` 的动画。

4. **居中与内部布局技巧 (Flexbox Centering)**：
   - **绝对居中大元素**：在 `auto` 比例下，要让标题或弹窗绝对居中，可以设置较宽的宽度（如 `width: 800`），然后通过 `props.style` 应用 Flexbox 进行内容居中：`display: flex; align-items: center; justify-content: center; text-align: center;`

**【你的任务】**
请根据我下面给出的【主题】，结合上述的“核心引擎规范”与“高级排版指南”，生成至少 6 页具有视觉冲击力、逻辑清晰且**配置了详细 `description` (解说词) 和 `delay` (解说时长)** 的多步演示文稿。
注意：输出结果必须是完全合法的 JSON，不要写任何额外的文字！

**我的演示主题是：**【请在此替换为你的主题，比如：AI Agent的未来发展趋势 / Vue Canvas 引擎架构解析】
