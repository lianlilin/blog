# TypeScript与babel

babel用来编译一些高级语法，ts用来为js提供类型支持。

tsc 不支持很多还在草案阶段的语法，这些语法都是通过 babel 插件来支持的，所以很多项目的工具链是用 tsc 编译一遍 ts 代码，之后再由 babel 编译一遍。这样编译链路长，而且生成的代码也不够精简。

所以，typescript 找 babel 团队合作，在 babel7 中支持了 typescript 的编译，可以通过插件来指定 ts 语法的编译，比如`@babel/preset-typescript`。

但是babel天然无法编译ts，因为ts编译中需要解析多个文件拿到整个工程的信息，而babel的编译过程只针对单个文件，所以babel做不了tsc的类型检查。

所以babel中的ts插件，做的事情就是：parse ts代码成ast，但是不会做类型检查，会直接把类型信息去掉，然后输出目标代码。

综上所述推荐的做法是：
- 仍然使用babel做代码编译
- 用`tsc --noEmit`做类型检查（noEmit代表不生成输出文件）
