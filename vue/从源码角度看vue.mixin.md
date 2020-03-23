<!--
 * @Descripttion:
 * @Author: ganbowen
 * @Date: 2020-03-18 18:08:46
 * @LastEditors: ganbowen
 * @LastEditTime: 2020-03-23 16:02:49
 -->

##### mixin

区分为全局混入与组件内部混入

- Vue.mixin() 全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。插件作者可以使用混入，向组件注入自定义的行为。
- mixins 选项接收一个混入对象的数组。这些混入对象可以像正常的实例对象一样包含实例选项，这些选项将会被合并到最终的选项中，Mixin 钩子按照传入顺序依次调用，并在调用组件自身的钩子之前被调用。

```js
Vue.mixin({}); // 全局混入需要极其小心
new Vue({
  mixins: [mixin]
});
```

> 注意： mixin 中存在钩子函数时，混入时先执行 mixins 中的钩子函数，再执行实例中的钩子函数；其他的同名函数发生冲突时，以实例为主为主。

##### 源码角度看 mixin

源码版本： `"version": "2.6.11"`，mixin 的所在文件在`/src/core/global-api/mixin.js`

```js
import { mergeOptions } from "../util/index";

export function initMixin(Vue: GlobalAPI) {
  Vue.mixin = function(mixin: Object) {
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
}
```

简单的封装，其核心都在`mergeOptions`函数中，即`/src/core/util/options.js`文件中定义

```js
export function mergeOptions(
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  if (process.env.NODE_ENV !== "production") {
    //  非生产环境校验组件的名称
    checkComponents(child);
  }

  if (typeof child === "function") {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  const options = {};
  let key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    const strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options;
}
```

流程大致如下：

1. 非生产环境校验组件的名称
2. `child`是`function`类型，这里的`function`是第 4 步中的`extends`扩展的 vue 构造函数，合并`child`的`options`
3. 规范化`props`，`Inject`，`Directives`
4. 检查传入`child`是否有`extends`的扩展，有则先递归合并 extend，在判断是否存在`mixins`，有则递归合并
5. 新创建一个`options`对象，使用`mergeField`合并两个对象的属性和方法，存入`options`，并返回`options`

接下来看`mergeField`函数：

```js
function mergeField(key) {
  const strat = strats[key] || defaultStrat;
  options[key] = strat(parent[key], child[key], vm, key);
}
```

通过`strats[key]`来选取`starts`中存入的对应的合并函数，一种典型的策略模式使用

```js
const strats = config.optionMergeStrategies;
// src/core/config.js 中的optionMergeStrategies赋值
optionMergeStrategies: Object.create(null);
```

接下来可以继续给`starts`进行赋值：

1. `el` || `propsData`

```js
if (process.env.NODE_ENV !== "production") {
  strats.el = strats.propsData = function(parent, child, vm, key) {
    if (!vm) {
      warn(
        `option "${key}" can only be used during instance ` +
          "creation with the `new` keyword."
      );
    }
    return defaultStrat(parent, child);
  };
}
```

注意`el`的合并只有在开发环境下才进行，并且采用`defaultStrat(parent, child)`函数进行

```js
const defaultStrat = function(parentVal: any, childVal: any): any {
  return childVal === undefined ? parentVal : childVal;
};
```

可以看到是直接替换掉`parentVal`，并且是替换规则是优先保留组件自身 > 组件 mixins > 全局 mixin。

2. data

```js
strats.data = function(
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    if (childVal && typeof childVal !== "function") {
      process.env.NODE_ENV !== "production" &&
        warn(
          'The "data" option should be a function ' +
            "that returns a per-instance value in component " +
            "definitions.",
          vm
        );

      return parentVal;
    }
    return mergeDataOrFn(parentVal, childVal);
  }

  return mergeDataOrFn(parentVal, childVal, vm);
};
```

可以看到主要是通过`mergeDataOrFn`的函数进行合并

```js
export function mergeDataOrFn(
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal;
    }
    if (!parentVal) {
      return childVal;
    }
    return function mergedDataFn() {
      return mergeData(
        typeof childVal === "function" ? childVal.call(this, this) : childVal,
        typeof parentVal === "function" ? parentVal.call(this, this) : parentVal
      );
    };
  } else {
    return function mergedInstanceDataFn() {
      // instance merge
      const instanceData =
        typeof childVal === "function" ? childVal.call(vm, vm) : childVal;
      const defaultData =
        typeof parentVal === "function" ? parentVal.call(vm, vm) : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData);
      } else {
        return defaultData;
      }
    };
  }
}
```

当前函数需要区分传递`vm`与没有传递`vm`的情况，没有`vm`时分别校验，是不是函数，是函数则调用函数，将返回值当做`mergeData`的参数传入，开始合并；有`vm`的时候返回分别判断`childVal`、`parentVal`，调用`mergeData`函数。

Vue 开始构造实例时，会调用`mergeOptions`会传入`vm`，当使用 Vue.mixin 的全局混入时候，不会传入`vm`，分别对应上述两种情况。

```js
function mergeData(to: Object, from: ?Object): Object {
  if (!from) return to;
  let key, toVal, fromVal;

  const keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from);

  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === "__ob__") continue;
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to;
}
```

`mergeData`函数遍历要合并的对象`from`，如果原`to`中不存在，则将调用`set`方法合并，如果目标`to`对象包含当前属性并且当前值为纯对象时，递归调用`mergeData`函数

```js
// src/observer/index.js
export function set(target: Array<any> | Object, key: any, val: any): any {
    ...
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key)
        target.splice(key, 1, val)
        return val
    }
    if (key in target && !(key in Object.prototype)) {
        target[key] = val
        return val
    }
    const ob = (target: any).__ob__
    if (target._isVue || (ob && ob.vmCount)) {
        ...
        return val
    }
    if (!ob) {
        target[key] = val
        return val
    }
    defineReactive(ob.value, key, val)
    ob.dep.notify()
    return val
}
```

`set` 函数先判断入参是不是数组，如果是数组则直接赋值，再判断 key 是否在`target`中存在，如果存在则直接复制，接下来判断`target`是否是响应式数据，如果是，开发环境报异常，如果不是响应式直接复制返回，其他环境下则将数据转为响应式，触发 dep.notify()

3. 生命周期-Hooks

```js
function mergeHook(
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> {
  const res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
      ? childVal
      : [childVal]
    : parentVal;
  return res ? dedupeHooks(res) : res;
}

function dedupeHooks(hooks) {
  const res = [];
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook;
});

// src/shared/constants.js
export const LIFECYCLE_HOOKS = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestroy",
  "destroyed",
  "activated",
  "deactivated",
  "errorCaptured",
  "serverPrefetch"
];
```

即将生命周期函数合并成一个数组，并返回。

4. watch

```js
strats.watch = function(
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) parentVal = undefined;
  if (childVal === nativeWatch) childVal = undefined;
  /* istanbul ignore if */
  if (!childVal) return Object.create(parentVal || null);
  if (process.env.NODE_ENV !== "production") {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) return childVal;
  const ret = {};
  extend(ret, parentVal);
  for (const key in childVal) {
    let parent = ret[key];
    const child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child)
      ? child
      : [child];
  }
  return ret;
};
```

将所有的同名`watch`合并到一个数组中，出发时一次执行。

5. props、methods、computed、inject

```js
strats.props = strats.methods = strats.inject = strats.computed = function(
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  if (childVal && process.env.NODE_ENV !== "production") {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) return childVal;
  const ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) extend(ret, childVal);
  return ret;
};
```

上述四种采用相同合并策略，同名时后来者覆盖前者，组件覆盖`mixin`。

6. provide
   调用`mergeDataOrFn`函数，同`data`的合并方式

##### 自定义选项合并策略

1. 向 Vue.config.optionMergeStrategies 添加一个函数，在自定义函数中自定义合并规则，等同向`starts`赋值，实例中存在对应的`key`合并时，调用对应的规则。
