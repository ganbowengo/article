<!--
 * @Descripttion: 
 * @Author: ganbowen
 * @Date: 2020-01-18 14:30:00
 * @LastEditors  : ganbowen
 * @LastEditTime : 2020-01-22 21:01:17
 -->
##### typeof 
typeof 操作符返回一个字符串，表示未经计算的操作数的类型，可以准确判断出String、Boolean、Number、Function、Symbol、Undefined，可以将Array、Object、new * 判断返回一个 'object'
```
// typeof '37' === 'string';
// typeof true === 'boolean';
// typeof 37 === 'number';
// typeof NaN === 'number'; 
// typeof Symbol() === 'symbol';
// typeof function() {} === 'function';
// typeof undefined === 'undefined';
// typeof [] === 'object';
// typeof {} === 'object';
// typeof new * === 'object';
```
##### instanceof 
instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
```
function C(){} 
function D(){} 

let o = new C()
o instanceof C  // 判断C的prototype属性是不是在o的原型链上
o.__proto__ === C.prototype ?
o.__proto__.__proto__ === C.prototype ? 


// 利用函数实现 instanceof
function instanceof(L, R){
    let RPro = R.prototype
    let LPro = L.__proto__
    while(true) {
        if(LPro === null) {
            return false
        }
        if(LPro === RPro){
            return true
        }
        LPro = LPro.__proto__
    }
}
```

##### toString 
可以通过使用Object.prototype.toString.call(obj)来检测对象类型。
[toString的原理详细介绍](https://www.jb51.net/article/79941.htm)
- ES3 的步骤:
1. 获取this的指向的`[[class]]`属性 - 内置10个class
> "Array", "Boolean", "Date", "Error", "Function", "Math", "Number", "Object", "RegExp", "String"
2. 将第1步的结果拼接成`[object '']`的结果
3. 返回第2步的结果
- ES5 的步骤:
1. 判断是不是null 或者 undefined 返回相应的[object Null] 或 [object Undefined]
> "Array", "Boolean", "Date", "Error", "Function", "Math", "Number", "Object", "RegExp", "String", "Arguments", "JSON"
2. 获取toObject(this)的值，并将返回值的内部属性`[[class]]`的值设置为class
3. 将第2步的结果拼接成`[object 'class']`的结果
- ES6 的步骤:
`[[class]]`内部属性被`[[NativeBrand]]`取代，`[[NativeBrand]]`内部属性仅用来区分区分特定类型的ECMAScript原生对象.

属性值 | 对应类型
---|---
NativeFunction|	Function objects
NativeArray|	Array objects
StringWrapper|	String objects
BooleanWrapper|	Boolean objects
NumberWrapper	|Number objects
NativeMath	|The Math object
NativeDate	|Date objects
NativeRegExp	|RegExp objects
NativeError|	Error objects
NativeJSON	|The JSON object
NativeArguments	|Arguments objects
NativePrivateName|	Private Name objects
利用伪代码来描述执行步骤
```
function toString(this) {
    this === null ? return [object Null]
    this === undefined ? return [object Undefined]
    NativeBrand = {
        NativeFunction:	"Function",
        NativeArray: "Array",
        StringWrapper: "String",
        BooleanWrapper: "Boolean",
        NumberWrapper: "Number",
        NativeMath:	"Math",
        NativeDate:	"Date",
        NativeRegExp: "RegExp",
        NativeError: "Error",
        NativeJSON: "JSON",
        NativeArguments: "Arguments"
    }
    tag 
    O = toObject(this)
    if(O.[[NativeBrand]]){
        tag = NativeBrand[O.[[NativeBrand]]]
    } else {
        hasTag = O.[[HasProperty]](@@toStringTag)
        if(!hasTag) {
            tag = 'Object'
        } else {
            tag = O.[[Get]](@@toStringTag)
        }
    }
    return `[object ${tag}]`
}
```
```
Object.prototype.toString.call(1) [object Number]
Object.prototype.toString.call('2') [object String]
Object.prototype.toString.call(true) [object Boolean]
Object.prototype.toString.call(new Symbol()) [object Symbol]
Object.prototype.toString.call(undefined) [object Undefined]

Object.prototype.toString.call({}) [object Object]
Object.prototype.toString.call([]) [object Array]
Object.prototype.toString.call(new Date()) [object Date]
Object.prototype.toString.call(null) [object Null]
Object.prototype.toString.call(/s/) [object RegExp]
Object.prototype.toString.call(new Map()) [object Map]
Object.prototype.toString.call(new Set()) [object Set]
Object.prototype.toString.call(new String('1')) [object String]
Object.prototype.toString.call(new Number(1)) [object Number]
Object.prototype.toString.call(new Boolean(true)) [object Boolean]
Object.prototype.toString.call(new TypeError()) [object Error]
Object.prototype.toString.call(function() {}) [object Function]
```

##### constructor
constructor返回一个指向创建了该对象原型的函数引用。
```
function C() {}
let O = new C()
O.constructor === C
O.constructor === C.prototype.constructor  // true

function D() {}
C.prototype = new D()
let a = new C()
a.constructor === D.prototype.constructor // true

a instanceof C // true
a instanceof D // true
```

##### in
> prop in object
prop 属性名称
object 检查它（或其原型链）是否包含具有指定名称的属性的对象。


