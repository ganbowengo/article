<!--
 * @Descripttion:
 * @Author: ganbowen
 * @Date: 2020-02-25 14:38:15
 * @LastEditors: ganbowen
 * @LastEditTime: 2020-03-16 18:23:55
 -->

#### defindProperty

ES5 提供的 Object.defineProperty 方法，用来新增或修改一个对象的属性或方法，并返回这个对象

> Object.defineProperty(obj, prop, descriptor)
> 参数:
>
> - obj 原对象
> - prop 属性名或方法名
> - descriptor 被定义或修改的描述符
>   返回值: obj 原对象

descriptor 中可以分为数据描述符和存取描述符

- 数据描述符
  - value ： 该属性对应的值。默认 undefined
  - writable ： 是否可修改。默认 false
- 存取描述符
  - get ： 一个给属性提供 getter 的方法，默认 undefined
  - set ： 一个给属性提供 setter 的方法，默认 undefined
- 存取描述符且数据描述符
  - configurable ： 是否可以修改 `描述符`，默认 false
  - enumerable ： 是否可枚举。默认 false

> 注意： 数据描述符 与 存取描述符，同时只能存在一种，即以下两种组合
>
> 1. configurable\enumerable\get\set
> 2. configurable\enumerable\value\writable

#### Proxy

ES6 提供的内置对象 Proxy，可以用 Proxy 生成代理对象，可以重新定义更多的方法、可与 Reflect 搭配使用

> let newObj = new Proxy(target, hanlder)
> 参数:
>
> - target 原对象
> - hanlder 配置对象，对于每一个被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作。 如果为 {} 没有拦截效果

Proxy 可以代理操作 13 中方法，[详见](https://es6.ruanyifeng.com/#docs/proxy)

#### Proxy 与 defineProperty 对比

1. defineProperty，无法监听数组变化
2. defineProperty 只能劫持对象的属性，需要遍历整个对象，重写 getter、setter
3. Proxy 直接可以监听数组变化，无序遍历，性能更高
4. Proxy 直接可以劫持整个对象
5. Proxy 可以劫持更多方法(13 种)
