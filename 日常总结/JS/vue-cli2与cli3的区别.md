<!--
 * @Descripttion:
 * @Author: ganbowen
 * @Date: 2020-02-10 09:37:53
 * @LastEditors  : ganbowen
 * @LastEditTime : 2020-02-11 10:07:03
 -->

##### 主要变化

- 安装命令及构建命令不一样

```
# 2.0
npm install -g vue-cli

# 3.0
npm install -g @vue-cli

# 2.0
vue init <template> <project>

# 3.0 兼容2.0 的创建方式
vue create <project>
# 支持UI化界面
vue ui
#  使用旧版（2.X）创建
npm install -g @vue/cli-init
# 'vue init'的运行效果与‘vue-cli@2.x’相同
vue init webpack projectname
```

- 目录不一样、配置方式不一样

1. config 与 build 目录删除，自定义的配置需要自定义 vue.config.js
2. static 目录删除，由 public 目录代替

- 新增功能特性

1. 快速原型开发 - 可以单独运行`.vue`文件 `vue serve & vue build`
2. 图形化配置界面
3. cli 插件 使用 `vue add`来添加
4. 预定义设置，在创建 vue-cli 项目的时候会有一些预定义的依赖或配置项如 eslint、vuex、vue-router 等在~/.vuerc 文件中会有对预定义配置文件的定义，再次创建项目的时候就会自动生成配置的项目

```
// .vuerc
{
  "useTaobaoRegistry": true,
  "packageManager": "yarn",
  "presets": { // 预设配置添加的地方，可添加多个预设配置
    "my_sets": { // 名为‘my_sets’的预设配置
      "useConfigFiles": true,
      "router": true,
      "vuex": true,
      "cssPreprocessor": "sass",
      "plugins": {
        "@vue/cli-plugin-babel": {},
        "@vue/cli-plugin-eslint": {
          "config": "airbnb",
          "lintOn": ["save", "commit"]
        }
      }
    }
  }
}
```
再次运行的时候就会出现两个预定义设置 default 与 my_sets可以选择
