# Script的属性

## type

type属性的值为MIME 类型, 全称叫做 `Multipurpose Internet Mail Extensions Type` , 多用途互联网邮件扩展类型, 也被叫做媒体类型, 大部分时候媒体类型是服务端通过http协议告知客户端(浏览器)的, 确切的说是服务端通过Content-Type这个响应头来告诉浏览器接收到的响应体的媒体类型到底是什么, 这个媒体类型决定了服务端返回的内容(响应体)究竟该如何被我们的浏览器处理。例如：

    Content-Type: text/html;


- text/javascript
  - 只有这个值会被当成可执行脚本，如果MIME类型不是JavaScript类型，则该元素所包含的内容会被当作数据块而不会被浏览器执行。

- module
  - 此值导致代码被视为 JavaScript 模块。其中的代码内容会延后处理。charset 和 defer 属性不会生效。与传统代码不同的是，模块代码需要使用 CORS 协议来跨源获取。

## defer 和 async

defer是为了向浏览器表明，该脚本是要在文档被解析后，但在触发 DOMContentLoaded 事件之前执行的。

包含 defer 属性的脚本将阻塞 DOMContentLoaded 事件触发，直到脚本完成加载并执行。

对于普通脚本，如果存在 async 属性，那么普通脚本会被并行请求，并尽快解析和执行。

对于模块脚本，如果存在 async 属性，那么脚本及其所有依赖都会在延缓队列中执行，因此它们会被并行请求，并尽快解析和执行。

该属性能够消除解析阻塞的 Javascript。解析阻塞的 Javascript 会导致浏览器必须加载并且执行脚本，之后才能继续解析。defer 在这一点上也有类似的作用。