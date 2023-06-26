# 一个页面从输入URL到加载显示完成都发生了什么

## 浏览器的进程
浏览器是多进程的，有一个主控进程，每一个tab页面都会新开一个渲染进程。
- 插件进程
- GPU进程
- 浏览器渲染进程（内核）
- 等等

每一个tab页面可以看做是浏览器的一个渲染进程，这个进程本身是多线程的，主要有：
- GUI线程
    - 负责渲染浏览器界面，解析HTML，CSS，构建DOM树和render树，布局、绘制等
    - 需要repaint或者reflow时，该线程就会执行
    - GUI线程和js线程是互斥的
- JS引擎线程
    - 也就是js内核，处理js脚本，运行程序（例如大V8）
    - 一直等着任务队列中任务的到来然后加以处理
    - 一个渲染进程中只有一个js线程
    - 因为和GUI线程互斥，所以js执行过长，会阻塞页面渲染
- 事件触发线程
    - 是一个单独的线程，并不属于js引擎
    - 当遇到setTimeOut、鼠标点进、AJAX请求等，会将对应的任务添加到事件线程
    - 因为js引擎单线程的原因，队列中的事件需要排队等待处理
- 定时器线程
    - 传说中的setInterval与setTimeout所在线程
    - 浏览器定时计数器并不是由JavaScript引擎计数的,（因为JavaScript引擎是单线程的, 如果处于阻塞线程状态就会影响记计时的准确）
    - 注意，W3C在HTML标准中规定，规定要求setTimeout中低于4ms的时间间隔算为4ms。
- 网络请求线程
    - 在XMLHttpRequest在连接后是通过浏览器新开一个线程请求
    - 将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入事件队列中。再由JavaScript引擎执行。

### 浏览器为什么要是多进程的
- 避免单个page crash影响整个浏览器
- 避免第三方插件crash影响整个浏览器
- 多进程充分利用多核优势
- 方便使用沙盒模型隔离插件等进程，提高浏览器稳定性

### 解析URL

输入URL后，会首先进行解析：
- protocol
- host
- path
- query
- fragment

### 如何解决js单线程面对CPU密集型计算的问题

- js引擎是单线程的，而且JS执行时间过长会阻塞页面
- 所以后来有了Web Worker



## 从开启网络线程到发出完整的http请求

### DNS查询
- 如果浏览器有缓存，直接使用浏览器缓存，否则使用本机缓存，再没有的话就是用host
- 如果本地没有，就向dns域名服务器查询（当然，中间可能还会经过路由，也有缓存等），查询到对应的IP
- 需要知道dns解析是很耗时的，因此如果解析域名过多，会让首屏加载变得过慢，可以考虑dns-prefetch优化

### tcp/ip

### OSI七层网络模型
- 应用层
    - DNS、HTTP、SMTP等
    - 在应用层交互的数据单元称之为报文
- 表示层
    - 数据的表示、安全、压缩。（在五层模型里面已经合并到了应用层）
    - 格式有，JPEG、ASCll、EBCDIC、加密格式等 
- 会话层
    - 建立、管理、终止会话。（在五层模型里面已经合并到了应用层）
    - 对应主机进程，指本地主机与远程主机正在进行的会话
- 传输层
    - 定义传输数据的协议端口号，以及流控和差错校验。
    - 协议有：TCP UDP，数据包一旦离开网卡即进入网络传输层
- 网络层
    - 进行逻辑地址寻址，实现不同网络之间的路径选择。
    - 协议有：ICMP IGMP IP（IPV4 IPV6）
- 数据链路层
    - 建立逻辑连接、进行硬件地址寻址、差错校验等功能。（由底层网络定义协议）
将比特组合成字节进而组合成帧，用MAC地址访问介质，错误发现但不能纠正。
- 物理层
    - 建立、维护、断开物理连接。（由底层网络定义协议）

TCP/IP 层级模型结构，应用层之间的协议通过逐级调用传输层（Transport layer）、网络层（Network Layer）和物理数据链路层（Physical Data Link）而可以实现应用层的应用程序通信互联。

### 三次握手和四次挥手

- SYN, syn
- seq
- ACK, ack

```
客户端：hello，你是server么？
服务端：hello，我是server，你是client么
客户端：yes，我是client
```

```
主动方：我已经关闭了向你那边的主动通道了，只能被动接收了
被动方：收到通道关闭的信息
被动方：那我也告诉你，我这边向你的主动通道也关闭了
主动方：最后收到数据，之后双方无法通信
```

### tcp/ip的并发限制

浏览器对同一域名下并发的tcp连接是有限制的，在http1.0中一个资源下载就对应一个tcp/ip连接。针对这个瓶颈有了
- 雪碧图
- 小图内联
- 使用多个域名
- ……

在 HTTP/2 中引入了多路复用的技术，这个技术可以只通过一个 TCP 连接就可以传输所有的请求数据。
多路复用很好的解决了浏览器限制同一个域名下的请求数量的问题，同时也接更容易实现全速传输，毕竟新开一个 TCP 连接都需要慢慢提升传输速度。

### get和post的区别

get和post虽然本质都是tcp/ip，二者在http层面的差异之外，在tcp/ip层面也有区别。

- ?

## 从服务器接收到请求到对应后台接收到请求

### 负载均衡
用户发起的请求都指向调度服务器（反向代理服务器，譬如安装了nginx控制负载均衡），然后调度服务器根据实际的调度算法，分配不同的请求给对应集群中的服务器执行，然后调度器等待实际服务器的HTTP响应，并将它反馈给用户
### 后台处理

- 一般有的后端是有统一的验证的，如安全拦截，跨域验证

- 如果这一步不符合规则，就直接返回了相应的http报文（如拒绝请求等）

- 然后当验证通过后，才会进入实际的后台代码，此时是程序接收到请求，然后执行（譬如查询数据库，大量计算等等）

- 等程序执行完毕后，就会返回一个http响应包（一般这一步也会经过多层封装）

- 然后就是将这个包从后端发送到前端，完成交互

### http报文

通用头部

- Request Url: 请求的web服务器地址

- Request Method: 请求方式
（Get、POST、OPTIONS、PUT、HEAD、DELETE、CONNECT、TRACE）

- Status Code: 请求的返回状态码，如200代表成功

```
1xx——指示信息，表示请求已接收，继续处理
2xx——成功，表示请求已被成功接收、理解、接受
3xx——重定向，要完成请求必须进行更进一步的操作
4xx——客户端错误，请求有语法错误或请求无法实现
5xx——服务器端错误，服务器未能实现合法的请求
```

- Remote Address: 请求的远程服务器地址（会转为IP）

请求/响应头部

```
Accept: 接收类型，表示浏览器支持的MIME类型
（对标服务端返回的Content-Type）
Accept-Encoding：浏览器支持的压缩类型,如gzip等,超出类型不能接收
Content-Type：客户端发送出去实体内容的类型
Cache-Control: 指定请求和响应遵循的缓存机制，如no-cache
If-Modified-Since：对应服务端的Last-Modified，用来匹配看文件是否变动，只能精确到1s之内，http1.0中
Expires：缓存控制，在这个时间内不会请求，直接使用缓存，http1.0，而且是服务端时间
Max-age：代表资源在本地缓存多少秒，有效时间内不会请求，而是使用缓存，http1.1中
If-None-Match：对应服务端的ETag，用来匹配文件内容是否改变（非常精确），http1.1中
Cookie: 有cookie并且同域访问时会自动带上
Connection: 当浏览器与服务器通信时对于长连接如何进行处理,如keep-alive
Host：请求的服务器URL
Origin：最初的请求是从哪里发起的（只会精确到端口）,Origin比Referer更尊重隐私
Referer：该页面的来源URL(适用于所有类型的请求，会精确到详细页面地址，csrf拦截常用到这个字段)
User-Agent：用户客户端的一些必要信息，如UA头部等
```

常用的响应头部

```
Access-Control-Allow-Headers: 服务器端允许的请求Headers
Access-Control-Allow-Methods: 服务器端允许的请求方法
Access-Control-Allow-Origin: 服务器端允许的请求Origin头部（譬如为*）
Content-Type：服务端返回的实体内容的类型
Date：数据从服务器发送的时间
Cache-Control：告诉浏览器或其他客户，什么环境可以安全的缓存文档
Last-Modified：请求资源的最后修改时间
Expires：应该在什么时候认为文档已经过期,从而不再缓存它
Max-age：客户端的本地资源应该缓存多少秒，开启了Cache-Control后有效
ETag：请求变量的实体标签的当前值
Set-Cookie：设置和页面关联的cookie，服务器通过这个头部把cookie传给客户端
Keep-Alive：如果客户端有keep-alive，服务端也会有响应（如timeout=38）
Server：服务器的一些相关信息
```

一般来说，请求头和响应头是匹配分析的，例如：
- 跨域请求时，请求头部的Origin要匹配响应头部的Access-Control-Allow-Origin，否则会报跨域错误
- 在使用缓存时，请求头部的If-Modified-Since、If-None-Match分别和响应头部的Last-Modified、ETag对应



### cookie及优化手段

Cookie是一段不超过4KB的小型文本数据，由一个名称（Name）、一个值（Value）和其它几个用于控制Cookie有效期、安全性、使用范围的可选属性组成。

因为cookie的特性，不能用于存储敏感信息（用户名、密码等）。对于同域名的资源请求，浏览器会默认带上本地cookie，这样对于不需要cookie信息的静态资源服务来说会降低性能。所以很多网站会将静态资源放在单独的域名下

- 例如对于www.baidu.com的访问中会发现很多静态资源来自b.bdstatic.com

但是域名拆分过多，也有问题，因为建立DNS连接也是一件成本不低的事情，这时候可以用到`dns-prefetch`技术，也就是让浏览器在空闲时提前解析dns域名。

### gzip压缩

gzip一般出现在请求头或者响应头中，例如：

- Accept-Encoding: gzip, deflate, br
- Content-Encoding: gzip

它是一种压缩压缩格式，对文本文件大约有60%~70%的压缩率，一般依赖服务端开启，以及浏览器支持才有效。

### 长连接与短连接

- http1.0中，默认使用短连接，即一次http请求，就建立一次tcp/ip连接

- http1.1开始，默认使用长连接，使用长连接时在请求头中会有`Connection: keep-alive`，长连接的情况下，tcp/ip连接不会立刻关闭，而是等待下次复用
    - 不会永远保持，一般在服务器中配置持续时间
    - 长连接需要服务端和客户端都支持


### http2.0

- http1.1每请求一个资源都需要开启一个tcp/ip连接，但是tcp/ip本身有并发数限制，所以资源多了速度会慢
- http2.0中，一个tcp/ip请求可以请求多个资源
- 所以类似于雪碧图、静态资源多域名拆分这样针对http1.1的优化方案就无需用到了

- ?怎么判断是不是http2.0？

http具备以下特性
- 多路复用（即一个tcp/ip连接可以请求多个资源）
- 首部压缩（http头部压缩，减少体积）
- 二进制分帧（在应用层跟传送层之间增加了一个二进制分帧层，改进传输性能，实现低延迟和高吞吐量）
- 服务器端推送（服务端可以对客户端的一个请求发出多个响应，可以主动通知客户端）
- 请求优先级（如果流被赋予了优先级，它就会基于这个优先级来处理，由服务器决定需要多少资源来处理该请求。）

### https

https就是安全版本的http，譬如一些支付等操作基本都是基于https的，因为http请求的安全系数太低了。

简单来看，https与http的区别就是： 在请求前，会建立ssl链接，确保接下来的通信都是加密的，无法被轻易截取分析

## 解析页面

@see [重排（reflow）与重绘（repaint）](https://www.bilibili.com/read/cv17332629/ )

@see [浏览器的渲染过程](https://github.com/includeios/document/issues/6)

浏览器拿到内容后，渲染大致上有
- 解析html，构建DOM树
- 解析CSS，构建CSS规则树
- 合并DOM数和CSS规则，生成render树
- 布局render树（Layout/reflow），负责各元素尺寸、位置的计算
- 绘制render树（paint），绘制页面像素信息
- 浏览器将各层信息发送给GPU，GPU会将各层合成（composite），显示在屏幕上

![测试](./images/浏览器处理.png)

### layout与repaint

- Layout，也称为Reflow，即回流。一般意味着元素的内容、结构、位置或尺寸发生了变化，需要重新计算样式和渲染树
- Repaint，即重绘。意味着元素发生的改变只是影响了元素的一些外观之类的时候（例如，背景色，边框颜色，文字颜色等），此时只需要应用新样式绘制这个元素就可以了

可能触发reflow的属性有（元素的尺寸、位置）：

- 盒子模型相关属性会触发重排
  - width
  - height
  - padding
  - margin
  - .....
- 定位属性及浮动也会触发重排
  - position
  - float
  - clear
  - .....
- 改变节点内部文字结构也会触发重排
  - text-align
  - overflow-y
  - font-weight

可能触发repaint的属性有（元素的颜色、背景、边框等，但是几何尺寸没有变）：
- color
- border-style
- background
- box-shadow
- ……

回流一定会导致重绘的发生，而且一个节点的回流可能导致子节点或兄弟节点的回流，所以需要尽量避免回流(重绘也需要尽量避免)。

### RenderObject 与 RenderLayer

- Render 树上的每一个节点被称为：RenderObject
  -  RenderObject几乎与DOM一一对应
  - html、script等节点会忽略
  - display: none的元素会忽略
  - Render 树是衔接浏览器排版引擎和渲染引擎之间的桥梁，它是排版引擎的输出，渲染引擎的输入。

- 浏览器渲染引擎并不是直接使用Render树进行绘制，为了方便处理Positioning,Clipping,Overflow-scroll,CSS Transfrom/Opacrity/Animation/Filter,Mask or Reflection,Z-indexing等属性，浏览器需要生成另外一棵树：Layer树

- 浏览器会为一些特定的RenderObject生成对应的RenderLayer
    - 是否根节点
    - 是否透明
    - 是否溢出
    - 是否css滤镜
    - ……
- 当满足上面其中一个条件时，这个RrenderObject就会被浏览器选中生成对应的RenderLayer。其它的节点会从属与父节点的RenderLayer。最终，每个RrenderObject都会直接或者间接的属于一个RenderLayer。
- Layer 树决定了网页绘制的层次顺序，而从属于RenderLayer 的 RrenderObject决定了这个 Layer 的内容，所有的 RenderLayer 和 RrenderObject 一起就决定了网页在屏幕上最终呈现出来的内容。

### Compsite
- Chrome拥有两套不同的渲染路径：硬件加速路径和旧软件路径。
- 硬件加速路径会将一些图层的合成交给GPU处理，比CPU处理更快，而我们的RenderLayout（有些地方又称作PaintLayers）并不能作为GPU的输入，这里会将RenderLayout再转换成GraphicsLayers
- 浏览器也是根据“某些规则”，选中一些特殊的RenderLayout节点，这些节点将被称为Compositing Layers，Compositing Layers与其他的普通节点不一样的是他们拥有自己的GraphicsLayer，而那些没有被选中的节点，会和父层公用一个GraphicsLayer。
    - 3D 或透视变换(perspective transform) CSS 属性
    - 使用加速视频解码的 元素 拥有 3D
    - (WebGL) 上下文或加速的 2D 上下文的 元素
    - 对自己的 opacity 做 CSS动画或使用一个动画变换的元素
    - ……

### 外链资源下载

- 图片不会阻塞DOM加载，也不会阻塞页面渲染，但图片会延迟onload事件的触发
    - 视频、字体和图片其实是一样的，也不会阻塞 DOM 的加载和渲染。(存疑，真的是这样吗)
- CSS 不会阻塞 DOM 的解析，但是会阻塞DOM的渲染
    - CSS 阻塞 DOM 的渲染只阻塞定义在 CSS 后面的 DOM
- CSS 会阻塞定义在其之后 JS 的执行
- JS 会阻塞定义在其之后的 DOM 的加载
    - defer
        - 对于 defer 的 script，浏览器会继续解析 html，且同时并行下载脚本，等 DOM 构建完成后，才会开始执行脚本，所以它不会造成阻塞
        - defer 脚本下载完成后，执行时间一定是 DOMContentLoaded 事件触发之前执行
        - 多个 defer 的脚本执行顺序严格按照定义顺序进行，而不是先下载好的先执行
    - async
        - 对于 async 的 script，浏览器会继续解析 html，且同时并行下载脚本，一旦脚本下载完成会立刻执行
        - async 脚本的执行 和 DOMContentLoaded 的触发顺序无法明确谁先谁后，因为脚本可能在 DOM 构建完成时还没下载完，也可能早就下载好了
        - 多个 async，按照谁先下载完成谁先执行的原则进行，所以当它们之间有顺序依赖的时候特别容易出错。
- 动态插入的脚本不会阻塞页面解析
    - 动态插入的脚本在加载完成后会立即执行，这和 async 一致
    - 如果需要保证多个插入的动态脚本的执行顺序，则可以设置 script.async = false，此时动态脚本的执行顺序将按照插入顺序执行和 defer 一样。

### DOMContentLoaded 和 onload
- onload：当页面所有资源（包括 CSS、JS、图片、字体、视频等）都加载完成才触发，而且它是绑定到 window 对象上
    - 动态脚本阻塞onload吗？？
- DOMContentLoaded：当 HTML 已经完成解析，并且构建出了 DOM，但此时外部资源比如样式和脚本可能还没加载完成，并且该事件需要绑定到 document 对象上
    - 对于 async 脚本和动态脚本(加载 & 执行)不会阻塞 DOMContentLoaded 触发
    - 如果 script 标签中包含 defer，那么这一块脚本将不会影响 HTML 文档的解析，而是等到 HTML 解析完成后才会执行。而 DOMContentLoaded 只有在 defer 脚本执行结束后才会被触发。 
    - 等 DOM 构建完成之后 defer 脚本执行，但脚本执行之前需要等待 CSSOM 构建完成。在 DOM、CSSOM 构建完毕，defer 脚本执行完成之后，DOMContentLoaded 事件触发。
    - 外链的css不会阻塞 DOMContentLoaded 触发
        - 当外部样式后面有脚本（async 脚本和动态脚本除外）的时候，外部样式就会阻塞 DOMContentLoaded 的触发。

# 参考文档

- [从浏览器多进程到JS单线程，JS运行机制最全面的一次梳理](https://segmentfault.com/a/1190000012925872#comment-area)
- [从输入URL到页面加载的过程？如何由一道题完善自己的前端知识体系！](http://www.dailichun.com/2018/03/12/whenyouenteraurl.html)