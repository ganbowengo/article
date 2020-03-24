<!--
 * @Descripttion: 
 * @Author: ganbowen
 * @Date: 2019-12-04 16:11:43
 * @LastEditors: ganbowen
 * @LastEditTime: 2020-03-24 14:57:22
 -->
1. xss（cross site script） 跨站脚本攻击 
2. SQL注入攻击
3. CSRF（cross site request forgrey） 跨站伪造请求
##### xss（cross site script） 跨站脚本攻击 
**基本概念**：xss通常是页面中插入了未验证的攻击性脚本导致。可分为三种：存储型（从数据库获取的数据中含有攻击脚本被解析到页面中）；反射型（从URL中获取的数据插入到页面）；MXSS（页面在渲染DOM时，将攻击脚本插入DOM属性中导致）

```vim
// 存储型 content从后台获取的数据 content = "<script>alert('中毒了')</script>"
<div>{{content}}</div>

// 渲染后输出内容
<div><script>alert('中毒了')</script></div>

//-------------------------------------------------------------------

// mxss型 content = "‘><script>alert('中毒了')</script>"
<div class=’test {{content}}‘>mxss</div>

// 渲染后输出内容
<div class=’test‘><script>alert('中毒了')</script>mxss</div>

//-------------------------------------------------------------------

// 反射型 如node服务端渲染 name = "<script>alert('中毒了')</script>"
let name = req.query['name']
this.body = `<div>${name}</div>`

// 渲染后输出内容
<div><script>alert('中毒了')</script></div>
```
**常用解决措施**：数据校验、将可能出现的攻击内容通过THML字符编码转义

```js
// html 字符转义编码
function htmlEncode(str) {
    let s = ''
    if (str.length === 0) return s
    s = str.replace(/&/g, '&amp;')
    s = s.replace(/</g, '&lt;')
    s = s.replace(/>/g, '&gt;')
    s = s.replace(/ /g, '&nbsp;')
    s = s.replace(/\'/g, '&#39;')
    s = s.replace(/\"/g, '&quot;')
    s = s.replace(/\n/g, '<br>')
    return s
}

```

##### SQL注入攻击
**基本概念**：页面提交数据到服务器端后，后端未进行数据校验就将数据直接拼接到SQL语句中，直接执行，从而受到攻击。

```js
let id = req.query['id']
let sql = `select * from user_table where id=${id}`

let data = exec(sql)
this.body = data

// 当 id = '100 or name=%user%'  中毒了
sql = select * from user_table where id=100 or name=%user%
```

**常用解决措施**：数据校验

##### CSRF（cross site request forgrey） 跨站伪造请求
**基本概念**：指非源站点按照源站点的数据格式伪造请求，提交非法数据给源站点，达到攻击目的
![csrf攻击原理](https://raw.githubusercontent.com/ganbowengo/imgs/master/articleImg/cross_site_request_forgrey.webp)
**攻击举例**：假设某银行网站A以GET请求来发起转账操作，转账的地址为 `www.xxx.com/transfer.do?bankNum=l000l&money=10000` ，参数accountNum表示转账的账户，参数money表示转账金额。
而网站B上，图片的地址栏中填的并不是图片的地址，而是前而所说的转账地址：`<img src="http://www.xxx.com/transfer.do?accountNum=l000l&money=10000">`
当你登录网站A后，没有登出，cookie有效，访问论坛B，发起GET请求，并带上cookie，达到转账的目的
假设是POST提交，B网站存在下面的代码，论坛B打开后，表单自动提交，达到转账的目的

```html
<form id="aaa" action="http://www.xxx.com/transfer.do" metdod="POST" display="none">
    <input type="text" name="accountNum" value="10001"/>
    <input type="text" name="money" value="10000"/>
</form>
<script>
    var form = document.forms('aaa');
    form.submit();
</script>
```
**常用解决措施**：
1. cookie设置为HttpOnly，浏览器没有cookie操作权限，避免攻击者获取并伪造cookie的情况，达到防御CSRF的目的。
2. 增加Token，在请求中放入攻击者所不能伪造的信息，并且该信总不存在于cookie之中。Token可以放在session中或通过Http请求投中的Authorization的特定认证字段传递，在服务端验证Token，攻击者就不能通过获取cookie中的信息轻易伪造请求通过服务端校验，达到防御CSRF的目的。
3. 通过Referer设置，（IE6或FF2等浏览器可以伪造referer），在HTTP请求的时候会在请求头中自动添加发起请求网站的地址，在服务端校验referer是不是有效的网站地址，如果攻击者在非源网站发起请求referer就不能通过校验，达到防御CSRF的目的。
> 有一些场景是不适合将来源 URL 暴露给服务器的,可以设置Origin 属性只包含了域名信息，并没有包含具体的 URL 路径，服务器的策略是优先判断 Origin，再根据实际情况判断是否使用 Referer 值。
4. 利用cookie的SameSite属性：
```
set-cookie: 1P_JAR=2019-10-20-06; expires=Tue, 19-Nov-2019 06:36:21 GMT; path=/; domain=.google.com; SameSite=none
// SameSite 选项通常有 Strict、Lax 和 None 三个值。
// Strict: 页面会完全禁止非源网站的请求带上Cookie
// Lax: 页面不会禁止非源网站的GET 但会禁止POST、img、iframe等标签的请求
// None: 没有限制
```

任何所谓的安全都是相对来说的，知识理论的破解时间增加，不容被攻击，要结合网站的实际情况，结合验证码等手段加强安全网站安全机制。
