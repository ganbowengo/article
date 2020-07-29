<!--
 * @Descripttion:
 * @Author: ganbowen
 * @Date: 2020-03-18 18:09:35
 * @LastEditors: ganbowen
 * @LastEditTime: 2020-07-29 17:32:55
 -->

##### webpack 多页面实践路线

1. 新建工程

```bash
mkdir my-project
cd my-project
npm init || yarn init #按提示输入 或者直接回车

# 生成一个package.json 文件 包含基础的项目信息
```

2. 添加 webpack 运行配置

   1. `package.json`中添加 `scripts` 执行脚本，区分开发环境与生产环境

   ```
      "scripts": {
        "dev": "webpack-dev-server --progress --config config/webpack.config.dev",
        "build": "webpack --progress --config config/webpack.config.pro",
      }
   ```

   2. 新建`config`文件，并按照`scripts`中的命令 新建文件夹
   3. 安装依赖 `yarn add webpack webpack-cli webpack-dev-server`

3. 初始化项目目录

```bash
# Project architecture
-- config                          # 项目配置文件
    -- webpack.config.dev          # 开发webpack配置
    -- webpack.config.pro          # 生产webpack配置
    -- webpack.config.base         # 公共webpack配置
-- public                          # 项目公共静态资源
-- src
    -- common                      # 基础组件库 跨模块使用
    -- module                      # 模块分类
        -- example                 # 全局公用样式目录
            -- common              # 模块使用 公共资源js、css等
            -- components          # 模块对应子功能页面
            -- router              # 模块路由
            -- index               # 模块入口文件
    -- public                      # 全局资源目录
        -- css                     # 全局公用样式目录
        -- image                   # 全局image管理目录
        -- js                      # 全局API公用资源目录
        -- utils                   # 全局工具类函数、js类库资源目录
-- index.html                      # 项目HTML模板文件
```

4. 配置 webpack 打包文件

   1. 在 `webpack.config.base`中配置入口 `entry` 及 出口 `output`，并通过`webpack-merge` 合并到`dev`,`pro`文件中,`yarn add webpack-merge`

   ```js
   /*
    读取module 文件下的入口文件，动态生成entry
    entry = {
        [module_name1]: [module_public1],
        [module_name2]: [module_public2],
        ...
    }
   */
   const fs = require("fs");
   const path = require("path");
   const files = fs.readdirSync(path.resolve(__dirname, "..", "src/module"));
   // 打包入口
   const entrys = () => {
     let map = {};
     files.forEach((filename) => {
       map[filename] = [
         path.join(__dirname, `../src/module/${filename}/index.js`),
       ];
     });
     return map;
   };
   // 设置出口
   const output = {
     path: path.resolve(__dirname, "..", "dist"),
     filename: "static/js/[name]-[hash:8].js",
     chunkFilename: "static/js/[name]-[hash:8].js",
   };
   ```

   ...不想写了
   ...移步[webpack.v4-template](https://github.com/ganbowengo/webpack.v4-template)
