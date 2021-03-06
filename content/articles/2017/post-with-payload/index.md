---
title: 一不小心POST了一个Payload
date: 2017-03-24
tags:
---

事情是这样的，那天我和同学正在测试接口，然后我写的方法是这样的：

```javascript
import axois from 'axios'
export default {
  UpdateImageUrl(data) {
    let url = '/api/image/updateUrl?id=' + data.id
    return axios.post(url, data)
  },
}
```

然而同学却一直很坚定的告诉我后台没有收到数据，于是我打开了开发工具的 Network，原本以为传错了什么参数，**然而却发现并没有什么问题**

仔细对了一下发出去的内容，确实没什么错，但是感觉它和平时我们 POST 数据的样子确实有一些区别。直觉告诉我问题一定是出在这里。

我们平时使用 POST 请求上传表单时，发出去的内容，抬头因该是`Form Data`，它的请求格式应该是类似于 GET 请求的 URL 格式，例如：

```
name=xiaoming&age=18
```

然而在这里，抬头却变成了 Request Payload。Google 了一下 Payload， 大意是 POST 请求时，所携带的有效数据。因为我们没有在指定 XHR 请求的`Content-Type`为`application/x-www-form-urlencode`，因此在发送 XHR 请求时不会对其中的内容进行处理成表单数据，而是直接把整个 JSON 对象传了上去。

所以有什么好的解决方法呢

一种是在 http 请求的头部指定 Content-Type，例如：

```javascript
import axios from 'axios'
function post(data){
    let url = '/api/fakeapi';
    return axios.post(url, data, {headers: {`Content-Type`: `application/x-www-form-urlencode`}})
}
```

或者是在发出请求前将 JSON 数据改为 urlencode 格式，例如：

```javascript
import axios from 'axios'
import qs from 'qs'
function post(data) {
  let url = '/api/fakeapi'
  return axios.post(url, qs.stringify(data))
}
```

嗯就说这么多吧。
