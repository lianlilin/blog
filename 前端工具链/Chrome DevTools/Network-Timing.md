# Network面板下的Timing

可以用于查看某条请求各模块的耗时情况。

# 指标含义


- Queueing: 浏览器把请求进行排队
    - 当前有优先级更高的请求
    - HTTP1.0和HTTP1.1对同一个域名限制最大链接数为6
    - 浏览器配置磁盘缓存
- Stalled: 请求有可能因为Queueing中描述的任何一个原因被阻塞
- Proxy negotiation: 浏览器和代理服务器协商请求
- DNS Lookup: DNS查询
- Initial connection: 浏览器正在建立链接，包括TCP握手、重试、SSL
- SSL: SSL
- Request sent: 浏览器开始发送请求
- ServiceWorker Preparation. The browser is starting up the service worker.
- Request to ServiceWorker. The request is being sent to the service worker.
- Waiting for server: 等待服务器返回第一个字节， Time For First Byte，包含一次往返延迟和服务器准备时间
- Content Download: 浏览器开始从网络或者service worker接收响应，是读取response body花费的时间，如果超过预期可能是因为网速、浏览器阻塞
- Receiving Push. The browser is receiving data for this response via HTTP/2 Server Push.
- Reading Push. The browser is reading the local data previously received.
