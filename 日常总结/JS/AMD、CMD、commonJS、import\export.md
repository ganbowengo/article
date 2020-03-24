<!--
 * @Descripttion:
 * @Author: ganbowen
 * @Date: 2020-01-11 19:18:52
 * @LastEditors: ganbowen
 * @LastEditTime: 2020-03-24 11:07:16
 -->

#### 模块化利器

##### AMD

AMD(Asynchronous Module Definition)翻译为异步模块定义，是一个规范，主要使用 requireJS，在加载模块及模块依赖的时候都采用异步模式，避免了渲染阻塞。requireJS 用 require.config()指定引用路径等，用 define()定义模块，用 require()加载模块,**对于依赖的模块，AMD是提前执行**
> AMD在加载模块完成后就会执行该模块，所有模块都加载执行完后会进入require的回调函数，执行主逻辑，这样的效果就是依赖模块的执行顺序和书写顺序不一定一致，看网络速度，哪个先下载下来，哪个先执行，但是主逻辑一定在所有依赖加载完成后才执行。
> AMD推崇依赖前置 在使用的之前require

```js
define([module-name?], [array-of-dependencies?],[module-factory-or-object]);
//  module-name 定义的模块的名称，通常省略 String
//  array-of-dependencies  定义的模块依赖的其他模块,也可以是文件的路径（相对于当前的HTML），可以省略 Array
//  module-factory-or-object 模块的主题实现内容
```

引入模块使用方式：

```js
// 在页面引入requirejs，并且设置data-main入口文件，当require加载完成后回调加载scripts/main文件
<script data-main="scripts/main" src="js/require.js"></script>

/** main.js 入口文件/主模块 **/
/*
    1、在没有使用data-main和config的情况下，baseUrl默认为当前页面的目录
    2、在有data-main的情况下，main.js前面的部分就是baseUrl，比如上面的js/
    3、在有config的情况下，baseUrl以config配置的为准
    上述三种方式，优先级由低到高排列
　　RequireJS以一个相对于baseUrl的地址来加载所有的代码。页面顶层script标签含有一个特殊的属性data-main，require.js使用它来启动脚本加载过程，而baseUrl一般设置到与该属性相一致的目录
*/
// 首先用config()指定各模块路径和引用名
require.config({
  baseUrl: "js/lib",
  paths: {
    "jquery": "jquery.min",  //实际路径为js/lib/jquery.min.js
    "underscore": "underscore.min",
  }
});
// 引入相关依赖 当依赖加载成功之后会回调 后面的function 并将依赖通过参数的形式传入回调函数
require(["jquery","underscore"],function($,_){
  // some code here
});

```

定义模块使用方式：

```js
// moduleA.js
define('moduleA',['moduleB'],function(moduleB){
    return moduleB.add(1, 2)
})

// moduleB.js
define(function(){
    return {
        add: function(a, b){
            return a + b
        }
    }
})
```

模块懒加载

```js
// requireJS 会提前加载所有的依赖模块，如果一个模块 a 在没有点击的时候不需要，那么提前加载是很消耗性能的，可以通过下面的方式在使用相关模块的时候在加载模块 a
// main.js
define(function(){
    console.log('main');
    document.onclick = function(){
        require(['a'],function(a){
            a.test();
        });
    }
});
//a.js
define(function(){
　　console.log('a');
    return {
        test : function(){
            console.log('a.test');
        }
    }
})
```

##### CMD

CMD(Common Module Definition)表示通用模块定义，该规范是国内发展出来的，由阿里的玉伯提出。CMD 有个浏览器的实现 SeaJS，都是 javascript 的模块化解决方案。**对于依赖的模块，CMD是延迟执行**
> CMD加载完某个依赖模块后并不执行，只是下载而已，在所有依赖模块加载完成后进入主逻辑，遇到require语句的时候才执行对应的模块，这样模块的执行顺序和书写顺序是完全一致的。
> CMD推崇依赖就近 在使用的时候再require

```js
define(id?, deps?, factory);
//  id 表示模块标识 通常省略 String
//  数组 deps 是模块依赖 通常省略 Array
//  factory是一个函数，表示是模块的构造方法 factory 方法在执行时，默认会传入三个参数：require、exports 和 module
```

引入模块使用方式：

```js
// 在页面引入seaJS，seaJS则通过sea.use()来设置。
// seajs.use(id, callback?) callback可省略
// seaJS默认路径是seaJS文件的所处目录，比如seaJS文件所处路径是'demo'目录下，进行如下入口设置后 
<script src="sea.js"></script>
<script>
    seajs.use('js/main');  // main.js的目录为'demo/js/main.js'。
</script>

// -------------------------------------------------------------

//设置base
<script src="sea.js"></script>
<script>
    seajs.config({
        base: 'js'
    });
    seajs.use("main"); // main.js的目录为'demo/js/main.js'。
</script>

// 当模块标识很长时，可以使用 alias 来简化
seajs.config({
    alias: {
        'jquery': 'jquery/jquery/1.10.1/jquery',
        'app/biz': 'http://path/to/app/biz.js',
    }
});

// 当目录比较深，或需要跨目录调用模块时，可以使用 paths 来简化书写
seajs.config({
    paths: {
        'gallery': 'https://a.alipayobjects.com/gallery',
        'app': 'path/to/app',
    }
});

// -------------------------------------------------------------

// require.async 异步加载 a 模块 如果只是通过require来加载，任何时候都会对 a 进行同步加载（预加载）
// exports 可以导出模块内容 也可以直接通过return的方式直接导出模块内容
// module 存储了与当前模块相关联的一些属性和方法
// 三个参数可以省略 但是不能再回调函数内部重新赋值使用

定义、导入模块使用方式：
// main.js  
define(function(require, exports, module){
    document.onclick = function(){
        require.async('./a',function(a){
            a.test();
        });
    }
});
//a.js
define(function(require, exports, module){
    console.log('a');
    exports.test = function(){
        console.log('a.test');
    }
})
```

##### commonJS
node 的模块化引入，通常用在服务端，可以通过使用打包工具Browserify，对CommonJS进行格式转换，使其在浏览器端进行

引入、导出模块
```js
module.exports = {} // 导出模块的接口
exports.add = function() {} 

// 1、url以“/”开头，则表示加载的是一个位于绝对路径的模块文件。比如，require('/home/marco/foo.js')将加载/home/marco/foo.js
// 2、url以“./”开头，则表示加载的是一个位于相对路径（跟当前执行脚本的位置相比）的模块文件。比如，require('./circle')将加载当前脚本同一目录的circle.js
// 3、url不以“./“或”/“开头，则表示加载的是一个默认提供的核心模块（位于Node的系统安装目录中），或者一个位于各级node_modules目录的已安装模块（全局安装或局部安装）

require(url) // 引入模块
```

> 在编译的过程中，Node对获取的JavaScript文件内容进行了头尾包装。在头部添加了(function(exports, require, module, filename, dirname) {\n，在尾部添加了\n});

```js
// 一个正常的JavaScript文件会被包装成如下的样子 每个模块文件之间都进行了作用域隔离
(function (exports, require, module,  filename,  dirname) {
    var math = require('math');
    exports.area = function (radius) {
        return Math.PI * radius * radius;
    };
});
```
##### import/export
ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。
import命令用于输入其他模块提供的功能；使用import命令的时候，用户需要知道所要加载的变量名或函数名
export default命令，为模块指定默认输出，对应的import语句不需要使用大括号
```js
export { a, b }
import { a, b } from ''

// 一个文件只能有一个导出
export default function add() {}
import add from ''
// 修改引入的名称
import { a as A, b } from ''
import add as Count from ''

//------ myFunc.js ------  
export default function() {...};  
  
//------ lib.js ------  
export * from 'myFunc';  
export function each() {...};  
  
//------ main.js ------  
import myFunc,{ each } from 'lib'; 
```

[AMD 及 requireJS](https://www.cnblogs.com/xiaohuochai/p/6847942.html)
[CMD 及 SeaJS](https://www.cnblogs.com/xiaohuochai/p/6879432.html)
