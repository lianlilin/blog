# 背景

- egg.js
- nest.js
- koa
- ThinkJS
- express.js
- ……
- next.js
- nuxt.js

你就说多不多吧，脑瓜子又嗡嗡的吧……

# 各个框架的基本情况

## express.js
老牌nodejs框架

## koa.js
可以视为为了替代express而出现，目前版本是koa2，相比于koa1主要是异步写法的区别。

## nest.js
对ts支持比较友好，新发布的框架中增长最快，底层基于express或者Fastif（可通过配置开启）。

## egg.js
阿里开源的框架，底层基于koa2。

- [知乎： 如何评价阿里开源的企业级 Node.js 框架 egg？](https://github.com/atian25/blog/issues/18)

## ThinkJs
齐舞团开源的框架，底层基于koa2，但是现在维护的一般，最近的一次更新是2018.06.20，凉了。

## next.js

与react强绑定，不太适合做专门的后端应用。

## Nuxt.js

与vue强绑定，不太适合做专门的后端应用。

# 总结
- express.js和koa.js都是比较偏向底层的web框架
- nest.js和egg.js都是基于底层框架做的上层封装，算是企业级应用框架
- next.js和nuxt.js都是和特定的前端框架绑定的