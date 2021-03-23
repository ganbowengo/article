# babel 

> Babel 做到的是编译降级

1. `@babel/cli` 是 Babel 提供的命令行，负责获取配置内容，之后调用babel-core进行编译
2. `@babel/standalone` 可以在非 Node.js 环境（比如浏览器环境）自动编译含有 text/babel 或 text/jsx 的 type 值的 script 标签，并进行编译
3. `@babel/core` 是 Babel 实现转换的核心，根据配置进行源码转换
4. `@babel/parser` 是 Babel 用来对 JavaScript 语言解析的解析器，核心方法parse 生成AST
5. `@babel/traverse ` 是对 AST 进行遍历 服务
6. `@babel/types` 提供了对具体的 AST 节点的修改能力
7. `@babel/generator` 对新的 AST 进行聚合并生成 JavaScript 代码
8. `@babel/preset-env` 配置需要支持的目标环境，实现babel的降级编译，通过`@babel/polyfill`完成补丁接入
9. `@babel/plugin-transform-runtime` 实现复用babel注入的helper 函数的复用，缩小代码体积
10. `@babel/runtime` 含有 Babel 编译所需的一些运行时 helpers 函数，供业务代码引入模块化的 Babel helpers 函数，同时提供 `regenerator-runtime`，对 generator 和 async 函数进行编译降级。
> 1. `@babel/plugin-transform-runtime` 需要和 @babel/runtime 配合使用
> 2. `@babel/plugin-transform-runtime` 用于编译时，作为 devDependencies 使用
> 3. `@babel/plugin-transform-runtime` 将业务代码编译，引用 @babel/runtime 提供的 helpers，达到缩减编译产出体积的目的
> 4.` @babel/runtime` 用于运行时，作为 dependencies 使用
11. `@babel/plugin` babel插件的合集
> presets 与 plugins，plugins先执行，并按照从前向后的顺序执行，presets按照从后向前的顺序执行
12. `@babel/plugin-syntax-*` 是 Babel 的语法插件。提供给`@babel/parser`使用
13. `@babel/plugin-proposal-*` 用于编译转换在提议阶段的语言特性。
14. `@babel/plugin-transform-*` 是 Babel 的转换插件。
15. `@babel/template` 封装了基于 AST 的模板能力，可以将字符串代码转换为 AST。