<!--
 * @Descripttion:
 * @Author: ganbowen
 * @Date: 2020-03-23 10:38:19
 * @LastEditors: ganbowen
 * @LastEditTime: 2020-03-23 15:56:45
 -->

##### call

定义：`call()` 方法使用一个指定的 `this` 值和单独给出的一个或多个参数来调用一个函数。
参数：`function.call(thisArg, arg1, arg2, ...)`

- `thisArg` 指定的`this`值，可以为 null 或 undefined，会指向全局对象
- `arg1, arg2, ...` 调用函数传入的参数列表

实现：

```js
Function.prototype.call = function(thisArg) {
  let args = Array.prototype.slice.apply(arguments, [1]);
  thisArg = thisArg || window || global;
  thisArg.fn = this;
  let result = thisArg.fn(...args);
  delete thisArg.fn;
  return result;
};
```

##### apply

定义：`apply()` 方法调用一个具有给定`this`值的函数，以及作为一个数组（或类似数组对象）提供的参数。
参数：`func.apply(thisArg, [argsArray])`

- `thisArg` 指定的`this`值，可以为 null 或 undefined，会指向全局对象
- `[argsArray]` 调用函数传入的参数数组

实现：

```js
Function.prototype.apply = function(thisArg, args) {
  let args = args || [];
  thisArg = thisArg || window || global;
  thisArg.fn = this;
  let result = thisArg.fn(...args);
  delete thisArg.fn;
  return result;
};
```

##### bind

定义：`bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。
参数：`function.bind(thisArg[, arg1[, arg2[, ...]]])`

- `thisArg` 指定的`this`值，当使用 `bind` 在`setTimeout` 中创建一个函数（作为回调提供）时，作为 `thisArg` 传递的任何原始值都将转换为`object`(装箱操作)。 `bind` 函数的参数列表为空，执行作用域的 `this` 将被视为新函数的`thisArg`。
- `arg1, arg2, ...` 当目标函数被调用时，被预置入绑定函数的参数列表中的参数。

实现：

```js
Function.prototype.bind = function(thisArgs) {
  const slice = Array.prototype.slice;
  let args = slice.call(arguments, 1);
  let thisFunc = this;
  return function() {
    let args = args.cancat(slice.call(arguments, 1));
    return thisFunc.apply(thisArgs, args);
  };
};
```

##### 相同及区别

1. 参数
   - 当`this`没有指定的时候，`call\apply` 指向全局作用域，`bind` 指向当前执行作用域
   - `bind\call`的参数以列表的形式，独立传入，`apply`需要将参数以数组的形式出入。
2. 执行
   - `call\apply`调用后立即执行，返回`this`指向的函数的返回值，`bind`返回一个函数，并将`bind`传入的参数预制到将要执行函数中
