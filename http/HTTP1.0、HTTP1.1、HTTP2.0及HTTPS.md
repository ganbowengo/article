<!--
 * @Descripttion:
 * @Author: ganbowen
 * @Date: 2020-03-17 14:30:17
 * @LastEditors: ganbowen
 * @LastEditTime: 2020-03-17 16:30:36
 -->

##### HTTP

http，超文本传输协议，建在 TCP 协议之上的应用层协议

##### HTTP1.0 与 HTTP1.1 的区别

1. 缓存策略
   - HTTP1.0
     1. Pragma:no-cache、Last-Modified/If-Modified-Since、expires
   - HTTP1.1
     1. 引入 Cache-Control（不适用 1.0）、Etag/If-None-Match、Last-Modified/If-Modified-Since 等更多可供选择的缓存头来控制缓存策略。
2. 持久连接
   - HTTP1.0
     1. 默认短连接，每个 HTTP 请求资源都要建立 TCP 连接，三次握手与四次挥手的消耗过大
   - HTTP1.1
     1. http1.1 支持长连接，引入 Connection：keep-alive；支持管道机制，可以在一个 TCP 连接上传送多个 HTTP 请求与响应，减少连接消耗
3. 带宽优化及网络连接的使用
   - HTTP1.0
     1. 每次传递头域与请求体 body
   - HTTP1.1
     1. http1.1 加入新的状态码 100，客户端可以只发送一个只带头域的请求试探 server，server 同意发送 body 之后再传输 body，否则返回 401
     2. 请求头重新增 Range，响应头新增 Content-Range，来分割响应数据，达到实现短笛续传的目的，状态码为 206
4. host 头处理
   - HTTP1.0
     1. 默认每台服务器唯一 Id，请求头中不传递 host
   - HTTP1.1
     1. http1.1 中请求消息和响应消息都支持 Host 头域，辨识请求的主机的 IP 和端口号（虚拟主机），没有 host 时，状态码会报 400
5. 新增错误通知
   HTTP1.1 新增 24 个错误状态响应码，如 409（Conflict）表示请求的资源与资源的当前状态发生冲突；410（Gone）表示服务器上的某个资源被永久性的删除

##### HTTP1.* 与 HTTP2.0 的区别
1. 二进制格式传输
   + HTTP1.* 的解析是基于文本
   + HTTP2.0 的解析是基于二进制格式，实现方便且健壮。
2. 多路复用
   + HTTP1.* 每次发送一个请求，单线程排队进行，线头阻塞
   + HTTP2.0 多路复用，每次发送多个，可并行请求，每个请求带一个requestId
3. 头部压缩
   + HTTP2.0 采用头部压缩，通讯双方各cache一份header fields表，避免重复header的传输
4. 服务端推送
   + HTTP2.0支持服务端推送，当请求的资源中需要获取其他相应资源时，会将对应的资源一起发送到请求端，减少发起请求的操作，降低消耗

##### HTTP与HTTPS的区别
1. 连接默认端口
   + http 80
   + https 443
2. 协议层不同
   + HTTP : HTTP -> TCP 
   + HTTPS : HTTP -> SSL/TLS -> TCP 
3. HTTPS需要申请CA证书
4. HTTP在搜索引擎中SEO更好

##### HTTPS的加密
HTTPS的加密依赖于TLS/SSL协议，TLS/SSL的功能实现主要依赖于三类基本算法，非对称加密，对称加密，散列函数 Hash
   + 非对称加密的作用：身份验证、密钥协商。加密解密的效率低，安全性高。私钥永远在服务端。
   + 对称加密的作用： 信息加密。加密解密的效率高。
   + 散列函数 Hash的作用： 校验完整性。将传输信息的摘要内容采用不可逆的方式加密，防止信息篡改并校验信息完整性。同时将加密后的内容解密后重新计算摘要，生成散列函数，两者对比。
> HTTPS请求流程：在请求验证时（一般为第一个请求）会将证书（公钥）发送给客户端，客户端收到证书，会校验证书的可靠性（与权威机构证书信息比对），然后生成对称秘钥，使用证书加密后发送给服务端，服务端接受到对称秘钥保存起来，之后两者间的通讯，使用对称秘钥来加密解密，不同节点之间采用的对称秘钥是不相同的。但是证书是相同的（即非对称秘钥）。

##### 相应文章资料:
[HTTP与HTTPS详解](https://juejin.im/post/5af557a3f265da0b9265a498#heading-15)
[HTTP/1.0、HTTP/1.1、HTTP/2、HTTPS](https://zhuanlan.zhihu.com/p/43787334)
[HTTPS的加密过程](https://blog.csdn.net/qq_32998153/article/details/80022489)