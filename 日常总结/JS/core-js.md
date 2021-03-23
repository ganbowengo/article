# core-js
1. core-js 提供基础垫片能力
2. core-js-pure 提供不污染全局变量的垫片能力
3. core-js-compact 维护一个browerslist垫片需求数据，可以通过babel的浏览器环境设置，按需加载垫片
4. core-js-builder 结合core-js-compact与core-js，有效的排除core-js中不需要的部分，生成新的core-js代码
5. core-js-bundle 提供不污染全局变量的垫片能力

### 关于ployfill工程化的实现 
> 趋于完美的准则：代码性侵入小，自动化、工程化程度高，业务影响低

1. 按浏览器级别实现按需引入
```javascript
// useBuiltIns: 'entry' + targets + compact 
// 实现对应浏览器的按需引入
{
  "presets": [
    ["@babel/env", {
      useBuiltIns: 'entry',
      targets: { chrome: 44 }
    }]
  ]
}
```
2. 按照代码的AST语法分析 + 浏览器级别实现按需引入，实现页面级引入
```javascript
// useBuiltIns: 'usage' + targets + compact
// 实现多页应用中、只为对应的页面引入对应的ployfill
{
  "presets": [
    ["@babel/env", {
      useBuiltIns: 'usage',
      targets: { chrome: 44 }
    }]
  ]
}
```
