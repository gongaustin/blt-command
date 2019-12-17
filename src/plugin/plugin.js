import app from '../main.js'
let loadingIndex = 0 //加载次数
/*文字组件*/
import textTooltip from '../components/public/textTooltip'
import protextTooltip from '../components/public/proTextTooltip'
import chooseTooltip from '../components/public/chooseTooltip'
import Cookies from 'js-cookie'

const plugin = {
	install(vue) {
		vue.component('my-tooltip', textTooltip)
		vue.component('pro-tooltip', protextTooltip)
		vue.component('choose-tooltip', chooseTooltip)
		let fn = vue.prototype
		/*event通信挂原型*/
		fn.eventBus = new vue()
		fn.textareaDisabledBol = true
		/*默认ajax地址*/
		if(process.env.NODE_ENV === 'development') {
			fn.CommonUrl = devCommonUrl
		} else {
			fn.CommonUrl = proCommonUrl
		}
		/*分页能够显示多少条*/
		fn.pageSizes = [10, 20, 30]
		fn.ajax = function(data) {
			//考虑到可能会有必须依赖于jQuery的插件和需要使用jQuery的人员所以直接上jQuery xhr来请求
			/*
			      组件里面两种使用方式
			      一：
			      this.ajax({
			          url: '',
			          ...,
			          success: function(data){
			              成功之后的事情...
			          }
			      })
			      二：
			      this.ajax({
			          url: '',
			          ...各种配置
			          ！这里没有success函数
			      }).then(data => {
			          这里就是success成功的回调
			      })
			      考虑到可能可能会用async await es7的语法或者喜欢promise的方法
			       */
			return new Promise((resolve, reject) => {
				loadingIndex <= 0 ? loadingIndex = 1 : loadingIndex++
					//http请求即显示加载中
					this.$nextTick(() => { //刷新页面再进入，需要等到dom渲染完成才执行emit，否则事件无法触发
						// alert(31423);
						fn.eventBus.$emit('loadstart')
					})
				data.success = data.success || function() {}
				let _this = this,
					send_data = {
						url: fn.CommonUrl,
						type: 'post', //默认get方式
						dataType: 'json',
						data: {},
						timeout: 10000, //超时设置
						headers: {
							'Authorization': fn.getItem("token")
						},
						// contentType: 'application/json',
						success: function(result) {
							loadingIndex--
							if(loadingIndex <= 0) {
								fn.eventBus.$emit('loadover')
							}
							if(result && (result.status == 200 || result.code == 200)) {
								data.success.call(_this, result.data)

								fn.ajaxMessage()

								resolve(result.data) //执行回调
								if(data.showMessage) {
									app.$message({
										message: data.showMessage,
										type: 'success'
									})
								}
							} else if(result && result.code == 401) {
								app.$router.replace({
									path: '/login'
								});
								sessionStorage.removeItem("token")
							} else if(result && result.code == 403) {
								app.$alert(result.message, '提示', {
									confirmButtonText: '确定',
									callback: action => {
										app.$router.replace({
											path: '*'
										});
									}
								});
							} else {
								app.$message.error(result.msg + (result.data == null ? "" : ":" + result.data));
							}
						},
						error: function(xhr, type, error) {

							loadingIndex--

							if(xhr.status == 401) {
								app.$message.error('你已被挤下线，请退出重新登录')
								fn.setCookie('perms', null, -1);
								fn.setCookie('token', null, -1);
								window.location.href = backLoginUrl;
								//sessionStorage.removeItem("token")
							}

							if(!window.noLogin) {
								// let result = xhr.responseJSON;
								//                                  let result = eval("(" + xhr.responseText + ")");
								if(type == 'error')
									app.$message.error('网络错误')
								//alert('网络错误');
								if(type === 'timeout')
									app.$message.error('网络连接超时')
								//                                  if (result != null) {
								//                                      console.log(result);
								//                                      app.$message.error(result.message + (result.data == null ? "" : ":" + result.data));
								//                                  }
								if(loadingIndex <= 0) {
									fn.eventBus.$emit('loadover')
								}
								fn.eventBus.$emit('loadover')
								reject()
							}
						}
					}
				for(let name in data) {
					if(name == 'success') continue
					else if(name == 'url') {
						// console.log(data[name]+data[name].indexOf('?') >= 0);
						if(data[name].indexOf('?') >= 0) {
							send_data[name] += data[name] + "&time=" + Date.parse(new Date());
						} else {
							send_data[name] += data[name] + "?time=" + Date.parse(new Date())
						}
					} else send_data[name] = data[name]
				}
				//console.log(send_data)
				$.ajax(send_data)
			})
		}
		fn.ajaxMessage = function() {
			$.ajax({
				type: "get",
				url: modifyPasswordUrl + "user/menuReadStatus",
				dataType: 'json',
				timeout: 10000, //超时设置
				headers: {
					'Authorization': fn.getItem("token")
				},
				success: function(result) {
					if(result.code == 200) {
						if(result.data['emergency:manage:upper:report'] > 0) {
							$('#report-up .el-badge').css('display', 'inline-block')
						} else {
							$('#report-up .el-badge').css('display', 'none')
						}
						if(result.data['emergency:manage:lower:report'] > 0) {
							$('#report-down .el-badge').css('display', 'inline-block')
						} else {
							$('#report-down .el-badge').css('display', 'none')
						}
						if(result.data['emergency:manage:upper:under'] > 0) {
							$('#repeat-up .el-badge').css('display', 'inline-block')
						} else {
							$('#repeat-up .el-badge').css('display', 'none')
						}
						if(result.data['emergency:manage:lower:under'] > 0) {
							$('#repeat-down .el-badge').css('display', 'inline-block')
						} else {
							$('#repeat-down .el-badge').css('display', 'none')
						}
						if(result.data['emergency:manage:upper:list'] > 0) {
							$('#emergency-up .el-badge').css('display', 'inline-block')
						} else {
							$('#emergency-up .el-badge').css('display', 'none')
						}
						if(result.data['emergency:manage:lower:list'] > 0) {
							$('#emergency-down .el-badge').css('display', 'inline-block')
						} else {
							$('#emergency-down .el-badge').css('display', 'none')
						}
					}
				},
				error: function() {
					app.$message.error('网络连接超时')
				}
			});
		}

		//登录接口
		fn.ajaxLogin = function(data) {
			return new Promise((resolve, reject) => {
				loadingIndex <= 0 ? loadingIndex = 1 : loadingIndex++
					app.$nextTick(() => {
						//http请求即显示加载中
						fn.eventBus.$emit('loadstart')
					})
				let _this = this,
					send_data = {
						url: fn.CommonUrl,
						type: 'post', //默认get方式
						success: (result) => {
							loadingIndex--
							if(result && (result.status == 200 || result.code == 200)) {
								result = result.data
								fn.setItem("CurrenUser", result);
								if(data.showMessage) {
									app.$message({
										message: data.showMessage,
										type: data.showMessageType || 'success'
									})
								}
								resolve(result)
							} else {
								app.$message.error(result.data == null ? "账号或密码有误！" : result.msg + ":" + result.data);
							}
							if(loadingIndex <= 0) {
								fn.eventBus.$emit('loadover')
							}
						},
						error: function(xhr, type, error) {
							loadingIndex--
							let result = eval("(" + xhr.responseText + ")");
							if(type === 'timeout') {
								app.$message.error('网络连接超时');
							}
							if(type === "error") {
								console.log(xhr.responseText)
							}
							if(result && result.error_description) {
								//vue.$message.error(result.error_description);
								app.$message.error(result.error_description);
							}
							if(loadingIndex <= 0) {
								fn.eventBus.$emit('loadover')
							}
							fn.eventBus.$emit('loadover')
							reject()
						}
					}
				for(let name in data) {
					if(name == 'success') continue
					else if(name == 'url') {
						send_data[name] += data[name]
						console.log(send_data[name])
					} else send_data[name] = data[name]
				}
				$.ajax(send_data)
			})
		}
		String.prototype.format = function(args) {
			var result = this;
			if(arguments.length > 0) {
				if(arguments.length == 1 && typeof(args) == "object") {
					for(var key in args) {
						if(args[key] != undefined) {
							var reg = new RegExp("({" + key + "})", "g");
							result = result.replace(reg, args[key]);
						}
					}
				} else {
					for(var i = 0; i < arguments.length; i++) {
						//var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出

						var reg = new RegExp("({)" + i + "(})", "g");
						result = result.replace(reg, arguments[i] == undefined ? "" : arguments[i]);
					}
				}
			}
			return result;
		}
		fn.GetTileByIdForSelectBox = function(dataList, id) {
			for(let i = 0; i < dataList.length; i++) {
				if(dataList[i].id == id) {
					return dataList[i].title;
				}
			}
		}
		/*列表显示项目类型id*/
		fn.showTypeName = (id, arr) => {
			arr = arr ? arr : fn.projectType;
			for(let i = 0; i < arr.length; i++) {
				if(id == arr[i].value) {
					return arr[i].label
				}
			}
		}
		/*设置与读取sessionStorage*/
		fn.setItem = (name, data, option) => {
			let strData = typeof data === 'string' ? data : JSON.stringify(data);
			Cookies.set(name, strData, option)
			//sessionStorage.setItem(name, typeof data == 'string' ? data : JSON.stringify(data))
		}
		fn.getItem = name => {
			return Cookies.get(name)
			// return sessionStorage.getItem(name)
		}
		//表单方式直接下载文件
		//url表示要下载的文件路径,如:htpp://127.0.0.1/test.rar
		fn.downloadFile = (fileurl) => {
			//			var form = $("<form>"); //定义form表单,通过表单发送请求
			//			form.attr("style", "display:none"); //设置为不显示
			//			form.attr("target", "");
			//			form.attr("method", "get"); //设置请求类型  
			//			form.attr("action", fileurl); //设置请求路径
			//			$("body").append(form); //添加表单到页面(body)中
			//			form.submit(); //表单提交
			window.open(fileurl, '_blank')
		}
		//设置cookie值
		fn.setCookie = (cname, cvalue, exdays) => {
			var d = new Date();
			d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
			var expires = "expires=" + d.toGMTString();
			document.cookie = cname + "=" + cvalue + "; " + expires;
		}
		//获取cookie值
		fn.getCookie = (cname) => {
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i = 0; i < ca.length; i++) {
				var c = ca[i].trim();
				if(c.indexOf(name) == 0) {
					return c.substring(name.length, c.length);
				}
			}
			return "";
		}
		//检查cookie是否存在
		fn.checkCookie = (cname) => {
			var user = fn.getCookie(cname);
			if(user != "") return true;
			return false;
		}
		//删除cookie
		fn.deleteCookie = (cname) => {
			fn.setCookie(name, null, -1);
		}
	}

}

export default plugin