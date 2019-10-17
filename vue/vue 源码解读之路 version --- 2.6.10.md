### vue 源码解读之路 version --- 2.6.10

问题：
通过直接在HTML中引入vue，通过debugger的方式查看vue引入、new Vue的过程发生了什么

##### 1.直接引入Vue、import Vue 初始化Vue的
- initMixin(Vue);
- stateMixin(Vue);
- eventsMixin(Vue);
- lifecycleMixin(Vue);
- renderMixin(Vue);
- initGlobalAPI(Vue);
- 其他的Vue的prototype上的原型方法及变量、platform设置config
##### 2. new Vue()执行的流程
- 执行function Vue方法 调用 this._init()【initMixin 中定义】方法
- 在_init() 方法中初始化vm.$options 这里注意 vm.constructor 是在1的步骤中初始化的参数及函数
- initProxy(vm)  
>     初始化vm._renderProxy   
>     支持Proxy的浏览器 在proxy中添加has或get拦截器 
>     否则初始化为vm本身 production环境直接初始化 为vm
- 初始化生命周期initLifecycle(vm)   其实只是初始化了一些内置的属性：
>     vm.$parent = parent;
>     vm.$root = parent ? parent.$root : vm;
>     vm.$children = [];
>     vm.$refs = {};
>     vm._watcher = null;
>     vm._inactive = null;
>     vm._directInactive = false;
>     vm._isMounted = false;
>     vm._isDestroyed = false;
>     vm._isBeingDestroyed = false;


- 初始化事件 分为浏览器的事件（v-on 直接绑定在HTML标签上）、 vue事件（v-on 绑定在组件上），在模板编译阶段会将组件标签的v-on事件传递给子组件，子组件被实例化,将事件保存 到vm.$options._parentListeners  如果已经存在事件 则要更新事件
- 初始化render函数 
- 触发beforeCreated钩子函数
- 初始化inject
- 初始化initState()  注意 这个步骤 是将props data computed 中的数转为 getter setter
>     初始化 initProps（）通过defineReactive  转为getter setter的形式
>     初始化 initMethods（）
>     初始化 initData（）通过observe新建Observer 转为getter setter的形式
>     初始化 initComputed（）  会将computed中的数 建立一个Watcher 然后通过Watcher中的get方法调用  getter 然后收集依赖
>     初始化 initWatch（）建立一个Watcher 然后通过Watcher中的get方法调用  getter 然后收集依赖
- 初始化 initProvide（）
- 触发created钩子函数
- 调用mount函数 （有两个mount函数=> 后者为前者的封装 后者主要完成代码块的生成渲染函数） 初始化$optinos.render 的渲染函数
- new Watcher调用mountConponent函数  
>     调用beforeMounted钩子函数
>     调用vm._render 函数执行render中保存的渲染函数
>     _c=> _createElement 生成vnode (生成过程中遇到组件 则调用createComponent 函数来生成组件的vnode)
>     watcher 触发update事件调用flushSchedulerQueue()刷新watcher队列 
>     触发beforeUpdate 钩子函数
>     修改重置watcher的状态标志
>     调用updated 钩子函数
- 调用_update
>     调用__patch__ 比较新vnode与oldnode的差别生成新的vnode
>     调用createElm将vnode生成dom 遇到组件的vnode 则调用createComponent方法来实例化组件 重复new Vue组件 options传入父组件的$options
>     将生成的dom 挂载到 vm的$el属性上(子组件挂载在$parent.$el上)
- 触发mounted钩子函数