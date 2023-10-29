# eslint

## 用途
eslint通过静态分析快速的发现或者修复代码中的问题，并且修复是语法敏感的，不会遇到传统的查找替换算法引入的问题，可以通过配置文件自定义规则结合内置的默认规则精确的满足项目需要。

## 核心概念

### rules
- 规则是 ESLint 的核心构建块。规则会验证你的代码是否符合预期，以及如果不符合预期该怎么做。规则还可以包含针对该规则的额外配置项。

- 比如 semi 规则会让你指定 JavaScript 语句结尾是否应该要有分号（;）。你可以通过设置规则来要求语句结尾总时要或绝不要有分号。

- ESLint 包括数百个可以使用的内置规则。此外你也可以创建自定义规则或使用别人用插件创建的规则。

### parser

- ESLint 解析器将代码转换为 ESLint 可以评估的抽象语法树（AST, abstract syntax tree）。默认情况下，ESLint 使用内置的与标准 JavaScript运行时和版本兼容的 Espree 解析器。
- 自定义解析器让 ESLint 可以解析非标准的 JavaScript 语法。通常自定义解析器会被包含在可共享配置或插件中，这样你就不需要直接使用它们了。
  - 比如用于让 ESLint 可以解析 TypeScript 代码的 @typescript-eslint/parser 解析器就被包含在 typescript-eslint 项目中。
  - 对于JS的实验性（例如新功能）和非标准（例如 Flow 或 TypeScript 类型）语法是不支持检测的，那么我们在实际项目开发的时候想要对这些法语进行支持，则通过@babel/eslint-parser解析器即可，@babel/eslint-parser 是一个解析器，它允许 ESLint 在 Babel 转换的源代码上运行

### plugins

最后我们知道一条规则对应一种检查，那么eslint不可能提供所有的规则来覆盖我们的语法，这时候eslint提供了plugin，允许自定义plugin定义语法检查规则。

- @babel/eslint-plugin是和@babel/eslint-parser配套的plugin，parser用来解析语法，plugin则是对应语法需要应用的规则

### extends

extends的作用就是封装一份常用的eslint配置并当成npm包来使用，需要用到的项目安装对应的npm包。


## 参考文献

- [@ecomfe/eslint-config（EFE 团队使用的 ESLint 配置）](https://github.com/ecomfe/eslint-config)
- [ESlint](https://zh-hans.eslint.org/)
- [Eslint 核心概念 & 自定义 plugin 开发](https://zhuanlan.zhihu.com/p/486351487)

