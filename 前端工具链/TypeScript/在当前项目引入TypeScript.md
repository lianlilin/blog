# 在当前项目引入TypeScript

## 背景
一个用于vue3的库，1.0版本是用js写的，因业务迭代本身需要重构，正好借此机会引入ts。

## 过程

### 安装typescript
```js
npm install -D typescript
```

### 适配eslint
装完这个写一个ts文件，发现项目中会有eslint报错，这是因为eslint默认不支持对ts文件的解析。

需要安装插件：

```
@typescript-eslint/parser @typescript-eslint/eslint-plugin
```

parser的目的是将代码转换为eslint能理解的AST语法树，plugin是一系列检查规则的合集。

- [Eslint 核心概念 & 自定义 plugin 开发](https://zhuanlan.zhihu.com/p/486351487)

### 解决安装报错
安装这两个库的时候遇到一些报错，报错信息如下

```
# npm resolution error report

2021-05-22T14:02:27.205Z

While resolving: ymsh@1.0.0

Found: postcss@7.0.35

node_modules/postcss

postcss@"^7.0.35" from the root project

Could not resolve dependency:

peer postcss@"^8.0.0" from postcss-cli@8.3.1

node_modules/postcss-cli

postcss-cli@"^8.3.1" from the root project

Fix the upstream dependency conflict, or retry

this command with --force, or --legacy-peer-deps

to accept an incorrect (and potentially broken) dependency resolution.
... ...
```
经过排查是因为当前node版本以及对应的npm版本较高，而高版本的npm对不同库对同一个npm包依赖的版本有冲突时检测更严格，解决思路：
- 强制覆盖已有依赖，安装时加上--force参数
- 忽略冲突，不覆盖已有依赖。安装时加上--legacy-peer-deps参数
- 降低npm版本

这里选择降低npm版本（因为正好装了nvm，其实也等于--legacy-peer-deps）

- [npm install:Could not resolve dependency：peer... 原因和解决方案，长期更新npm相关错误问题！](https://blog.51cto.com/u_15328720/4032010)

安装之后发现还是有eslint报错，经过排查发现是在babel.config.js中少了`@babel/preset-typescript`，配上就好了。

# 一些思考

## eslint、babel、ts的关系
eslint用于检查语法规范，但是有的新语法它不认识，所以需要babel帮助，而babel也不认识ts，所以需要@babel/preset-typescript


# 相关资源
- [type-challenges](https://github.com/type-challenges/type-challenges)