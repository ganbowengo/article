1. HTTP缓存
> HTTP缓存是指客户端向服务器发送请求时，先到浏览器中查看是否有可用资源副本，如果可用直接使用，否则向服务器获取
- 强缓存 - 返回的状态码为 200   
1.第一次请求时在***响应报文***中设置cache-control（在fire-fox中设置no-cache,no-store兼容）  
2.第一次请求时在***响应报文***中设置expires   
3.第一次请求时在***响应报文***中设置pragma（优先级高于cache-control）

header属性 | 可选值 | 优先级 | 优缺点
---------- | ------ | ------ | ------
pragma | no-cache：不直接使用缓存，新鲜度使用| 高 | 1.响应头不只支持该属性 2.HTTP1.1中废弃
cache-control| 1.no-cache:不论是否过期，都要校验，不直接使用缓存，新鲜度使用 2.no-store: 不使用缓存，直接下载新资源 3.max-age:缓存时间 4.public/private：是否只能被单个用户使用（默认private） 5.must-revalidate: 过期后，每次访问需要缓存校验|中|1.不适用HTTP1.0 2.缓存失效前，获取不到修改后的资源
expires | GMT 时间 绝对过期时间 | 低|1. 服务器与浏览器时间不一致会出现问题 2.缓存失效前，获取不到修改后的资源

- 协商缓存 - 返回的状态码为 304、200  
1.在第一次请求时在***响应报文***带有 etag（值是hash值）、last-modified（值是GMT格式的时间）   
2.在第二次请求时请求报文头部带上if-not-match（etag中的hash值）、if-modified-since（last-modified中的时间）在服务器端顺序比较if-not-match
中的hash值、if-modified-since中的时间，hash不同时请求新资源 响应200，否则返回304 告诉浏览器重定向到缓存

- HTTP缓存流程如下

![image](https://raw.githubusercontent.com/ganbowengo/imgs/master/articleImg/HTTP%E7%BC%93%E5%AD%98%E8%BF%87%E7%A8%8B1.webp)

![image](https://raw.githubusercontent.com/ganbowengo/imgs/master/articleImg/HTTP%E7%BC%93%E5%AD%98%E8%BF%87%E7%A8%8B2.webp)

- 参考资料
1. [HTTP缓存参考文章](https://www.jianshu.com/p/227cee9c8d15)
2. [HTTP缓存cache-control文章](https://segmentfault.com/a/1190000007317481)
3. 现在前端技术解析 第一章