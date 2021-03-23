# Axios
### 1.  拦截器思想
1. 任务注册
2. 任务编排
3. 任务调度

```js
...

function Axios (instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
    };
}

...

Axios.prototype.request = function request (config) {
    ...
    // Hook up interceptors middleware
    // 维护任务队列
    var chain = [dispatchRequest, undefined];
    var promise = Promise.resolve(config);
    
    // 注册请求拦截器 添加到request之前
    this.interceptors.request.forEach(function unshiftRequestInterceptors (interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    
    // 注册响应拦截器 添加到request之后
    this.interceptors.response.forEach(function pushResponseInterceptors (interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    // 任务调度 开始执行通过 promise 的链形式调用
    while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
};

```

### 2.  适配器思想
1. Adapter 同时支持 Node环境 与 XMLHttpRequest环境
2. 适配器满足入参兼容、出参兼容

```js

// dispatchRequest.js
...
module.exports = function dispatchRequest(config) {
    ...
    var adapter = config.adapter || defaults.adapter;
    // 核心请求方法
    return adapter(config).then(function onAdapterResolution(response) {
        ...
        return response;
    }, function onAdapterRejection(reason) {
        ...
        return Promise.reject(reason);
    });
};

// defaults.js
...
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    // 浏览器环境使用 xhr 方式发送请求
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    // node环境使用 http 方式发送请求
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
    adapter: getDefaultAdapter(),
    ...
};

```
3. xhr实现

```js

module.exports = function xhrAdapter(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        if (utils.isFormData(requestData)) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }
    
        var request = new XMLHttpRequest();
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
    
        // Listen for ready state
        request.onreadystatechange = function handleLoad() {
            ...
            // 适配器思想体现 统一返回格式
            settle(resolve, reject, response);
            request = null;
        };
    
        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
            ...
        };
    
        // Handle low level network errors
        request.onerror = function handleError() {
            ...
        };
    
        // Handle timeout
        request.ontimeout = function handleTimeout() {
            ...
        };
    
        ...
        // Send the request
        request.send(requestData);
    });
};

```

4. http实现

```js
module.exports = function httpAdapter(config) {
    return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
        ...
        var isHttpsRequest = isHttps.test(protocol);
        var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
        // 适配器思想体现 统一入参
        var options = {
            path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
            method: config.method.toUpperCase(),
            headers: headers,
            agent: agent,
            agents: { http: config.httpAgent, https: config.httpsAgent },
            auth: auth
        };
        ...
        // transport 需要做重定向、https处理
        var transport = http;
        ... 
    
        // Create the request
        var req = transport.request(options, function handleResponse(res) {
            ...
            if (config.responseType === 'stream') {
                response.data = stream;
                // 适配器思想体现 统一返回格式
                settle(resolve, reject, response);
            } else {
                stream.on('data', function handleStreamData(chunk) {
                    ...
                });
        
                stream.on('error', function handleStreamError(err) {
                    ...
                });
        
                stream.on('end', function handleStreamEnd() {
                    ...
                    // 适配器思想体现 统一返回格式
                    settle(resolve, reject, response);
                });
            }
        });
    
        // Handle errors
        req.on('error', function handleRequestError(err) {
            ...
        });
    
        ...
        // Send the request
        if (utils.isStream(data)) {
            data.on('error', function handleStreamError(err) {
                reject(enhanceError(err, config, null, req));
            }).pipe(req);
        } else {
            req.end(data);
        }
    });
};

```

### 3.  安全思想
1. CSRF 跨站仿造请求
2. 防御方式：双重cookie方式实现防御
> 1. 用户访问页面，后端向请求域中注入一个 cookie，一般该 cookie 值为加密随机字符串；
> 2. 在前端通过 Ajax 请求数据时，取出上述 cookie，添加到 URL 参数或者请求 header 中；
> 3. 后端接口验证请求中携带的 cookie 值是否合法，不合法（不一致），则拒绝请求。

```js

// lib/defaults.js
var defaults = {
    adapter: getDefaultAdapter(),
    ...
    xsrfCookieName: 'XSRF-TOKEN', // 注入的cookie值
    xsrfHeaderName: 'X-XSRF-TOKEN' // 存入header中的验证字段
};

// xhr 中 xsrf 防御实现
// 添加 xsrf header
if (utils.isStandardBrowserEnv()) {
    // 获取cookie中的指定字段
    var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;
    // 存入header的对应xsrf防御字段中
    if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
    }
}
```
