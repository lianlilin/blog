# 背景

我们通过window上的onerror来上报页面中的一些可能的异常，一般情况下，onerror中会包含引发错误的原因及调用栈，便于定位问题。例如：

```js
// @see https://developer.mozilla.org/zh-CN/docs/Web/API/Window/error_event
error: Uncaught SyntaxError: Missing initializer in const declaration
```

但是有时候我们捕获到一些错误信息如下：

```js
{
    "error":"errorevent",
    "colno":0,
    "lineno":0,
    "message":"Script error.",
    "errorType":"ErrorEvent"
}
```
让人抓狂的是，这类错误没有提供错误堆栈，完全无从下手排查。

# 产生Script Error的原因


## 同源策略引起

受到浏览器同源策略的限制，当跨域的脚本执行错误时，抛出的错误信息就是『Script Error』。

## 为什么错误信息也会受到同源策略限制

一般我们知道ajax请求会受到同源策略限制，但是为什么错误信息也会受到同源策略的限制呢？同样是出于安全考虑。例如网站通常根据用户登录与否返回不同数据，当你访问某个恶意网站时候，如果页面嵌入了`<script src="yourbank.com/index.html">`，那么错误信息有可能透露出你是否登录了此页面，从而做出更具备针对性的钓鱼网站。


- [浏览器的同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)
- [i-know-if-youre-logged-in-anywhere](https://blog.jeremiahgrossman.com/2006/12/i-know-if-youre-logged-in-anywhere.html)

# 如何处理

## CORS

最简单的办法就是开启跨域资源共享CORS，大概分为两步:
- 静态资源添加HTTP响应头`Access-Control-Allow-Origin`属性，即允许跨域访问
- script标签等添加`crossorigin="anonymous"`，代表告知浏览器以匿名的方式获取目标脚本，即不发送cookie等信息

这样`window.onerror`就能捕获跨域脚本的报错信息。

## try catch

浏览器不会对 try catch进行跨域拦截，所以可以在调用跨域脚本内的API时，可以通过try catch进行拦截，然后再将错误throw出来，此时throw是同域代码，这样可以间接的拿到报错的详细信息。例如：

```js
const originAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (type, listener, options) {
  const wrappedListener = function (...args) {
    try {
      return listener.apply(this, args);
    }
    catch (err) {
      throw err;
    }
  }
  return originAddEventListener.call(this, type, wrappedListener, options);
}
```

但是此方案只能捕获事件内的异常，但是如果是第三方脚本的同步代码发生异常呢？

## Content Security Policy与 Content-Security-Policy-Report-Only

内容安全策略（CSP）是一个额外的安全层，可以用于『定制同源策略』，例如：

```
Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com
```

上述配置意味着：

- 各种内容默认仅允许从文档所在的源获取
- 图片可以从任何地方加载 (注意“*”通配符)
- 多媒体文件仅允许从 media1.com 和 media2.com 加载（不允许从这些站点的子域名）
- 可运行脚本仅允许来自于 userscripts.example.com

对于不支持CSP的浏览器，默认为网页内容使用标准的同源策略。


但是有时候直接上CSP比较容易出坑，比如你禁止了某个核心脚本的访问，导致页面挂掉，此时可以将CSP部署为`仅报告`模式，此时CSP不是强制性的，但是会将违规行为上报给一个指定的URI地址。


HTTP **Content-Security-Policy-Report-Only**响应头允许 web 开发人员通过监测 (但不强制执行) 政策的影响来尝试政策。这些违反报告由 JSON 文档组成通过一个 HTTP POST 请求发送到指定的 URI。报告的信息格式如下：

```json
{
  "csp-report": {
    "document-uri": "http://example.com/signup.html",
    "referrer": "",
    "blocked-uri": "http://example.com/css/style.css",
    "violated-directive": "style-src cdn.example.com",
    "original-policy": "default-src 'none'; style-src cdn.example.com; report-uri /_/csp-reports",
    "disposition": "report"
  }
}
```

这样可以通过配置 CSP Report Only 上报跨域脚本，对相关信息进行分析，然后对预期之外的跨域脚本进行限制，对埋点等配置CROS。

- [如何根治 Script Error](https://blog.csdn.net/qq_32198115/article/details/126996050)
- [Content Security Policy (CSP)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)
- [Content-Security-Policy-Report-Only](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only)