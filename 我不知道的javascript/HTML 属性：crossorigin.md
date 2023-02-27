# 背景

在看vue.config.js配置文件中发现一条属性是`crossorigin`，描述如下：

```js
crossorigin

Type: string

Default: undefined

设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。

需要注意的是该选项仅影响由 html-webpack-plugin 在构建时注入的标签 - 直接写在模版 (public/index.html) 中的标签不受影响。

```

# HTML 属性：crossorigin

## 作用
提供对 CORS 的支持，定义该元素如何处理跨源请求，从而实现对该元素获取数据的 CORS 请求的配置

## 生效标签
crossorigin 属性在 \<audio>、\<img>、\<link>、\<script> 和 \<video> 元素中有效

## 合法值
- anonymous: 请求使用了 CORS 标头，且证书标志被设置为 'same-origin'。没有通过 cookies、客户端 SSL 证书或 HTTP 认证交换用户凭据，除非目的地是同一来源。
    - 意思大概是『匿名获取文件』，即浏览器请求某个资源时不会将任何潜在的用户标识信息，即cookies等传输到服务器

- use-credentials: 请求使用了 CORS 标头，且证书标志被设置为 'include'。总是包含用户凭据。

- "": 将属性名称设置为空值，如 crossorigin 或 crossorigin=""，与设置为 anonymous 的效果一样。

不合法的关键字或空字符串会视为 anonymous 关键字。