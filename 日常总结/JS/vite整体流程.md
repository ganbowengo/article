vite源码整体流程分析：

```bash
# 执行的过程
npm run dev
# 1. 执行vite
# 2. 执行vite项目下的bin目录下vite文件
# 3. 执行node下载的cli文件中的 cli的命令行命令
# 4. 执行 runServe 
# 5. createServer 创建 server 服务
# 6. 启动 server 服务
```

##### 1. createServer 函数
1. 获取config参数 root 默认为当前任务执行的绝对路径

```javascript
    const {
    root = process.cwd(),
    configureServer = [],
    resolvers = [],
    alias = {},
    transforms = [],
    vueCustomBlockTransforms = {},
    optimizeDeps = {},
    enableEsbuild = true,
    assetsInclude
  } = config
```

2. 创建koa 服务实例

```javascript
  const app = new Koa<State, Context>()
  const server = resolveServer(config, app.callback())
```

3. chokidar 监听文件变化

```javascript
    const watcher = chokidar.watch(root, {
        ignored: ['**/node_modules/**', '**/.git/**'],
        // #610
        awaitWriteFinish: {
          stabilityThreshold: 100,
          pollInterval: 10
        }
    }) as HMRWatcher
```

4. createResolver 处理alias别名、对已请求的文件或者请求进行缓存

```javascript
      const resolver = createResolver(root, resolvers, alias, assetsInclude)
```

5. 将服务器信息绑定到koa的context内

```javascript
    const context: ServerPluginContext = {
        root,
        app,
        server,
        watcher,
        resolver,
        config,
        port: config.port || 3000
    }
    
    app.use((ctx, next) => {
        Object.assign(ctx, context)
        ctx.read = cachedRead.bind(null, ctx)
        return next()
    })

```

6. cors 配置跨域

```javascript
    if (config.cors) {
        app.use(require('@koa/cors')(typeof config.cors === 'boolean' ? {} : config.cors));
    }
```

7. 注册中间件

```javascript
    
    const resolvedPlugins = [
        // rewrite and source map plugins take highest priority and should be run
        // after all other middlewares have finished
        sourceMapPlugin,
        moduleRewritePlugin,
        htmlRewritePlugin,
        // user plugins
        ...toArray(configureServer),
        envPlugin,
        moduleResolvePlugin,
        proxyPlugin,
        clientPlugin,
        hmrPlugin,
        ...(transforms.length || Object.keys(vueCustomBlockTransforms).length
          ? [
              createServerTransformPlugin(
                transforms,
                vueCustomBlockTransforms,
                resolver
              )
            ]
          : []),
        vuePlugin,
        cssPlugin,
        enableEsbuild ? esbuildPlugin : null,
        jsonPlugin,
        assetPathPlugin,
        webWorkerPlugin,
        wasmPlugin,
        serveStaticPlugin
    ]
    resolvedPlugins.forEach((m) => m && m(context))
```

8. optimizer实现启动前的预优化

```javascript
    const listen = server.listen.bind(server)
    server.listen = (async (port: number, ...args: any[]) => {
        if (optimizeDeps.auto !== false) {
          await require('../optimizer').optimizeDeps(config)
        }
        return listen(port, ...args)
    }) as any
```
