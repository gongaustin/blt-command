import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import cookies from 'js-cookie'
import qs from 'qs'

let baseURL
if(process.env.NODE_ENV === 'production'){
  baseURL = proCommonUrl
}else{
  baseURL = devCommonUrl
}

// 创建axios实例
var service = axios.create({
  baseURL: baseURL, // api的base_url
  timeout: 15000                  // 请求超时时间
})
service.defaults.responseType = 'json'
service.defaults.transformRequest = [function(data) {
  //  数据序列化
  return qs.stringify(data)
}
]

// request拦截器
service.interceptors.request.use(config => {
  if (cookies.get('token')) {
    // config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers.Authorization = cookies.get('token') // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    var res = response.data
    if (res.code !== 200) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          location.reload()
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log(error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
