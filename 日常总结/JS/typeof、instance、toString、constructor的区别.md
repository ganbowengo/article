<!--
 * @Descripttion: 
 * @Author: ganbowen
 * @Date: 2020-01-18 14:30:00
 * @LastEditors  : ganbowen
 * @LastEditTime : 2020-01-18 14:59:09
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

##### constructor