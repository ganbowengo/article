<!--
 * @Descripttion: 
 * @Author: ganbowen
 * @Date: 2019-12-08 15:05:53
 * @LastEditors: ganbowen
 * @LastEditTime: 2019-12-08 17:38:56
 -->
##### JavaScript的执行过程
1. JavaScript属于动态语言：一边编译一边执行
2. 编译阶段会把变量和函数存放到变量环境或词法环境，词法环境与变量环境组成执行上下文
3. 执行阶段JavaScript引擎会去变量环境或词法环境中查找定义的变量和函数
4. 编译阶段有两个相同的函数时，后者会覆盖前者
![JavaScript 执行流程细化图](https://raw.githubusercontent.com/ganbowengo/imgs/master/articleImg/JavaScript%E6%89%A7%E8%A1%8C%E8%BF%87%E7%A8%8B.png)

##### JavaScript的执行上下文与调用栈
1. 什么是执行上下文：
- 当JavaScript执行全局代码的时候回编译全局的代码并创建全局执行上下文，在整个页面的生命周期内只存在一个全局执行上下文。
- 当调用一个函数的时候，函数体内的代码会被编译，并创建函数执行上下文，一般在函数执行完毕之后（闭包除外），当前函数的执行上下文会被销毁。
- 当时用eval函数的时候，eval的代码也会被创建执行上下文。
2. 调用栈：调用栈就是用来管理函数调用关系（管理执行上下文的栈结构）的一种数据结构，栈结构。
- 开始执行的时候会将编译全局代码生成的全局执行上下文压入栈底，当前调用栈只存在一个执行上下文
- JavaScript引擎开始执行全局代码中的可以执行代码（全局代码的执行阶段），在全局代码的执行阶段发现`A函数`的调用
- 开始编译`A函数`，生成`A函数`的执行上下文，**压入**调用栈中
- `A函数`执行完成，将`A函数`的执行山下文从调用栈中**弹出**
- 全局代码继续执行阶段，重复上出过程。

举例：
```
// 当前代码的执行过程
var a = 2

function add(b, c) {
    return b + c
}

function addAll(b, c) {
    var d = 10
    result = add(b, c)
    return a + result + d
}

addAll(3, 6)
```
执行步骤：
1. 编译全局代码 生成可执行上下文与可执行代码 全局执行上下文**压入**调用栈中
```
// 可执行上下文
a = undefined
add = function() {...}
addAll = function() {...}
// 可执行代码
a = 2
addAll(3, 6)
```
2. 全局代码执行阶段`a`的赋值操作，addAll的调用操作
3. 编译addAll函数体中的代码 生成可执行上下文与可执行代码 addAll执行上下文**压入**调用栈中
```
// 可执行上下文
d = undefined
b = undefined
c = undefined
result = undefined
// 可执行代码
return a + result + d
```
4. addAll函数体中的代码执行阶段`d = 10`，`b = 3`，`c = 6`，`result = add(3, 6)`的赋值操作，add的调用操作
5. 编译add函数体中的代码 生成可执行上下文与可执行代码 add执行上下文**压入**调用栈
```
// 可执行上下文
b = undefined
c = undefined
// 可执行代码
return b + c
```
6. add函数体中的代码执行阶段，`b = 3,c = 6` 返回 `9`， add执行上下文**弹出**调用栈
7. addAll函数体中的代码执行阶段，`result = 9`的赋值操作完成，`return a + result + d` 返回 21，addAll执行上下文**弹出**调用栈
8. 整个 JavaScript 流程执行结束
> 调用栈是 JavaScript 引擎追踪函数执行的一个机制,
> dug 的时候可以打开浏览器的 `Sources`，选择JavaScript代码的页面，查看右边Call Stack 中的函数执行流程
> 也可以在代码添加console.trace()来打印当前的函数调用关系，也就是当前执行时调用栈存在的执行上下文
3. 栈溢出：调用栈瘦大小的，当入栈的执行上下文超过一定的数目，JavaScript引擎就会报错`Uncaught RangeError: Maximum call stack size exceeded`

##### JavaScript的块级作用域
1. ES中可以通过`let`、`const`关键字来实现跨级作用域，`let`、`const`声明的变量会在编译阶段放到词法环境中，var声明的变量都被放到变量环境中
- 在一个函数体的代码中存在一个块级作用域，函数体中的let声明的变量与函数体中块级作用域的let声明的变量在词法作用域中维护了一个栈，是JavaScript代码按照顺序执行压入的作用域块，相同命名的变量在同一个代码段中且不同的作用域中，是独立维护在同一个词法作用域中的。
- 当作用域的代码执行完之后，会从词法环境的栈中，将作用域中的信息从栈中弹出（指let、const声明的变量）
- 执行可执行代码的时候，从词法环境的栈从顶向下查询，再从变量环境查找，否在向上一级作用域按照同样的顺序查找，直到找到所需变量或方法

举例1：
```
function foo() {
    var a = 1
    let b = 2 
    {
        let b = 3
        var c = 4
        let d = 5 
        console.log(a) 
        console.log(b)
    }
    console.log(b) 
    console.log(c) 
    console.log(d)
}
foo()
```
1. 创建全局的执行上下文，可执行代码，执行到foo()
2. 编译foo函数，生成foo函数执行上下文，包括变量环境、词法环境，可执行代码
```
// 变量环境
a = undefined
c = undefined
// 词法环境 栈的形式
|b = undefined   | // 块级作用域
|d = undefined   |
|----------------|
|b = undefined   | // 函数作用域
|----------------|
// 可执行代码
    // 块级作用域
    b = 3
    c = 4
    d = 5 
    console.log(a) 
    console.log(b)
    // 函数作用域
    a = 1
    b = 2 
    console.log(b) 
    console.log(c) 
    console.log(d)
```
3. 执行阶段 变量赋值
```
// 变量环境
a = 1
c = 4
// 词法环境 栈的形式
|b = 3           | // 块级作用域
|d = 5           |
|----------------|
|b = 2           | // 函数作用域
|----------------|
// 可执行代码
    // 块级作用域
    console.log(a) 
    console.log(b)
    // 函数作用域
    console.log(b) 
    console.log(c) 
    console.log(d)
```
4. 输出变量，执行`console.log(a)` 在词法环境中没有找到，则去变量环境中找，输出`1`。
5. 输出变量，执行`console.log(b)` 在词法环境中从栈顶找，在块级作用域中找到，输出`3`，块级作用执行完成，将词法环境中的块级作用弹出，当前的词法环境中只存在函数作用域的`b = 2`。
6. 输出变量，执行`console.log(b)` 在词法环境中找到，输出`2`，将词法环境中的块级作用弹出，当前的词法环境的栈中为空。
7. 输出变量，执行`console.log(c)` 在词法环境中没有找到，则去变量环境中找，输出`4`。
8. 输出变量，执行`console.log(d)` 在词法环境中没有找到，变量环境也没有找到，报错：`Uncaught ReferenceError: d is not defined`。
9. foo函数执行完成，从调用栈中弹出foo函数的执行上下文。

举例2：
```
let myname= 'youta'
{ 
    console.log(myname) 
    let myname= 'youtag'
}
```
1. 当前会编译的时候会创建一个全局的执行上下文，包括变量环境、词法环境，可执行代码

```
// 变量环境 为空
// 词法环境 栈的形式
|myname= 'youtag'| // 块级作用域
|----------------|
|myname= 'youta' | // 全局作用域
|----------------|
// 可执行代码
console.log(myname)
```
2. 执行阶段，`console.log(myname)`，因为当前可执行代码在块级作用域，所以在块级作用域查询myname，但是当前的myname没有进行初始话，所以会报错`Uncaught ReferenceError: Cannot access 'myname' before initialization`
【分析原因】：在块作用域内，let声明的变量被提升，但变量只是创建被提升，初始化并没有被提升，在初始化之前使用变量，就会形成一个暂时性死区。
> 拓展：
> var的创建和初始化被提升，赋值不会被提升。
> let的创建被提升，初始化和赋值不会被提升。
> function的创建、初始化和赋值均会被提升。

##### JavaScript的作用域链
1. 词法作用域是指作用域是由代码中**函数声明的位置**来决定的，所以词法作用域是静态的作用域，通过它就能够预测代码在执行过程中如何查找标识符，也就是说词法作用域是代码编译阶段就决定好的，和函数是怎么调用的没有关系。
2. 作用域链：JavaScript 引擎执行代码查询变量和函数的一级一级的向上层的作用查找的链条。
> 每个执行上下文的变量环境中，都包含了一个外部引用，用来指向外部的执行上下文，我们把这个外部引用称为 outer,当一段代码使用了一个变量时，JavaScript 引擎首先会在“当前的执行上下文”中查找该变量，如果在当前的变量环境中没有查找到，那么 JavaScript 引擎会继续在 outer 所指向的执行上下文中查找

##### JavaScript的闭包
1. 闭包：在 JavaScript 中，根据词法作用域的规则，内部函数A总是可以访问其外部函数B中声明的变量，当通过调用一个外部函数返回一个内部函数后，即使该外部函数已经执行结束了，但是内部函数引用外部函数的变量依然保存在内存中，我们就把这些变量的集合称为闭包，外部函数的变量不能只能通过内部函数来访问，其他的任何地方都不能访问该集合，当前集合就是内部函数的专属变量包。

```
function foo() {
    var myName = "gan"
    let test1 = 1
    const test2 = 2
    var innerBar = {
        getName: function () {
            console.log(test1)
            return myName
        },
        setName: function (newName) {
            myName = newName
        }
    }
    return innerBar
}
var bar = foo()
bar.setName("bowen")
bar.getName()
console.log(bar.getName())

/**
 * 对象bar中的函数`getName`、`setName`调用foo函数中的test1 和 myName，
 * 在foo函数执行完成之后 当前两个变量不会再内存中销毁，则当前的变量集合会形成闭包
 * foo(closure)
 */
```
> dug 的时候可以打开浏览器的 `Sources`，选择JavaScript代码的页面，查看右边Scope，可以查看到当前执行行坐在的作用域
