# tsconfig.json

如果一个目录下存在一个tsconfig.json文件，那么它意味着这个目录是TypeScript项目的根目录。 tsconfig.json文件中指定了用来编译这个项目的`根文件`和`编译选项`。


## 指定要编译哪些ts文件

可以用过`files` `include` `exclude`这三个属性来指定要被编译的ts文件。

`files`指定一个包含相对或绝对文件路径的列表。 `include`和`exclude`属性指定一个文件glob匹配模式列表。 

如果`files`和`include`都没有指定，默认包含当前目录和子目录下所有的ts文件（排除`exclude`指定的文件）。

## 继承已有的配置

可以通过`extends`从另一个配置文件里继承配置。

## 编译选项

通过`compilerOptions`来配置编译选项。

- module: 指定生成哪个模块系统的代码
  - "None"， "CommonJS"， "AMD"， "System"， "UMD"， "ES6"或 "ES2015"。
- target：指定ECMAScript目标版本 "ES3"（默认）， "ES5"， "ES6"/ "ES2015"， "ES2016"， "ES2017"或 "ESNext"。