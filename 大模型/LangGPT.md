# LangGPT: 提示设计框架

## 背景
- 提出了双层结构的提示设计框架 LangGPT，以提高提示的通用性和可复用性。我们还在 LangGPT 的基础上编写了详细的提示设计规则，从而降低了提示设计的学习成本，使 LLM 能够自动生成高质量的提示语。此外，我们提供了基于 LangGPT 的常见场景的通用提示模板，进一步简化了提示设计成本。
- 通过实验证明，基于 LangGPT 设计的提示可以更好地引导 LLM 执行任务。同时，我们举例说明了 LangGPT 可以帮助 LLM 生成高质量的提示。
- 建立了一个基于 LangGPT 的在线社区，提供使用文档和提示设计界面。此外，收集和分享优秀的提示案例也促进了 LLM 应用的交流。我们在社区中进行了用户体验调查，验证了 LangGPT 的易用性和可复用性。

## 设计原则

### 自然语言与编程语言的区别
自然语言更模糊、更灵活，而编程语言更规范、更精确。LLM本质上执行大量计算，与机器有许多相似之处。

## 提示词设计规则

- 提示应具有规范化的格式。
- 提示的结构应该是可扩展的
- 具体要求必须明确、完整
- 语言要灵活

## 面向大语言模型的自然语言编程框架

