<!--
 * @Descripttion:
 * @Author: ganbowen
 * @Date: 2020-02-07 14:23:22
 * @LastEditors  : ganbowen
 * @LastEditTime : 2020-02-07 17:48:19
 -->

##### npm 版本

npm 版本描述：【主要版本.次要版本.补丁版本】

> 主要版本: 有重大变动，不向下兼容时变更
> 次要版本: 有新功能添加，向下兼容时变更
> 补丁版本: 修复 bug 时变更

1. 使用`~`表示版本范围

| 版本   | 可取范围                 | 描述                                                             |
| ------ | ------------------------ | ---------------------------------------------------------------- |
| ~2.3.4 | 2.3.4<= XXX 且 XXX<2.4.0 | 主版本、次版本、补丁版本都存在时，范围控制在补丁版本可到的最大值 |
| ~2.3   | 2.3.0<= XXX 且 XXX<2.4.0 | 主版本、次版本都存在时，范围控制在补丁版本可到的最大值           |
| ~2     | 2.0.0<= XXX 且 XXX<3.0.0 | 只有主版本存在时，范围控制在次版本、补丁版本可到的最大值         |

2. 使用`^`表示版本范围

| 版本   | 可取范围                 | 描述                                                                                                       |
| ------ | ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| ^2.3.4 | 2.3.4<= XXX 且 XXX<3.0.0 | 主版本不为 0，范围控制在次版本、补丁版本可到达最大值                                                       |
| ^0.3.4 | 0.3.4<= XXX 且 XXX<0.4.0 | 主版本为 0，范围控制在补丁版本可到达最大值                                                                 |
| ^0.0.4 | 0.0.4<= XXX 且 XXX<0.0.5 | 主版本为 0、次版本为 0，不能变更                                                                           |
| ^2.3   | 2.3.0<= XXX 且 XXX<3.0.0 | 主版本不为 0，补丁版本缺失，默认为 0，范围控制在次版本、补丁版本可到达最大值                               |
| ^2     | 2.0.0<= XXX 且 XXX<3.0.0 | 主版本不为 0，次版本、补丁版本缺失，默认为 0，范围控制在次版本、补丁版本可到达最大值                       |
| ^0     | 0.0.1<= XXX 且 XXX<1.0.0 | 主版本为 0，次版本、补丁版本缺失，次版本默认为 0，补丁版本默认为 1，范围控制在次版本、补丁版本可到达最大值 |

##### npm 包版本锁定

1. 通过 npm 提供的命令来锁定 `npm shrinkwrap` 来生成 `npm-shrinkwrap.json` 文件

```js
npm shrinkwrap
npm i vue@2.5.2 -S      // 记录保存到npm-shrinkwrap.json中
npm uni vue -S          // 删除到npm-shrinkwrap.json中的记录 -S -D 省略不能删除
npm up vue@2.6.0 -S     // npm-shrinkwrap.json中的记录不更新
```

2. npm 版本高于 5.0.0 之后自动生成`package-lock.json`文件
> 缺点: `package-lock.json`文件不能发包，只能通过将`package-lock.json`修改为`npm-shrinkwrap.json`之后在发包，锁定版本

```js
npm i vue@2.5.2 -S      // 记录保存到package-lock.json中
npm uni vue -S          // 删除到package-lock.json中的记录 -S -D 可以省略
npm up vue@2.6.0 -S     // package-lock.json中的记录不更新
```

3. yarn 版本管理 自动生成`yarn.lock`

```js
yarn add vue@2.5.2      // 记录保存到yarn.lock
yarn remove vue         // 删除到yarn.lock中的记录
yarn upgrade vue@2.6.0  // yarn.lock中的记录更新
```

npm 包发布流程
1. 在npm官网申请npm账户
2. 在本地添加npm用户 `npm adduser`
```
UserName:...
Password:...
Email:...
```
3. 查看本地用户 `npm whoami`
4. 包目录下配置好package.json
5. 包目录下执行 `npm publish` npm会根据package.json里面的version来发布包版本
> 首次发布 `npm publish --access=public`
6. 删除包`npm unpublish --force` pm会根据package.json里面的version来删除包版本
> 更新包的时候需要先修改package中的version中的信息 `npm version 2.0.0`这样会在log中添加一个commit信息，可以通过`npm version 2.0.0 -m "Upgrade to %s for reasons"`来自定义提交信息，`%s` 就是修改后的版本号

相关文章
- [npm库搭建、自动发布](https://segmentfault.com/a/1190000018939927)
- [npm发布流程](https://blog.csdn.net/weixin_41424247/article/details/87118792)