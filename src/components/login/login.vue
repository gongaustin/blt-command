<template>
	<div>
		<div class="header">
			<img src="../../../static/img/logo.png">
		</div>
		<div class="main">
			<div class="main-center">
				<div class="text-panel">
					<div class="logo-line">
						<span class="logo-text">柒采舆情管理系统</span>
					</div>
					<h2>全面采集 深度分析</h2>
					<h3>准确预警 应急指挥</h3>
				</div>
				<form action="/a/login" method="post">
					<div class="login-panel">
						<div class="title">登录</div>
						<div class="content">
							<div class="login-input">
								<span class="user"></span>
								<input type="text" name="username" @keyup.enter="login" v-model="user.username">
							</div>
							<div class="login-input">
								<span class="password"></span>
								<input type="password" name="password" v-model="user.password" @keyup.enter="login">
							</div>
							<div class="remember-me">
								<input id="remember" type="checkbox" v-model="user.checked" class="login-checkbox">
								<label for="remember" class="remember"></label>
								<label for="remember">记住我</label>
							</div>
							<input type="button" @click="login" value="登 录" class="login-button">
						</div>
					</div>
				</form>
			</div>
		</div>
		<div class="footer">
			<span>© 2016 柒采舆情</span>
			<span>by：成都布林特信息技术有限公司</span>
		</div>
	</div>
</template>
<script>
	import home from '../home/home'

	import {
		routers
	} from '../../router/index.js'

	export default {
		name: 'hello',
		data() {
			return {
				user: {
					username: null, //账号
					password: null, //密码
					checked: true
				},
				AssmmenuList: [],
				role: 0, //0代表前台登录，1代表后台登录

			}
		},
		created() {
			//下级
			//this.setItem('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MjQ3NzI5MzQsInVzZXIiOiIxNix0aWFucGVuZyJ9.lDRaMs3_9vCUrlJZ-eLd-0NwD3xl9eSugGNG8c1R7ec');

			//上级
			this.setItem('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MjQ2MDA1MjEsInVzZXIiOiIxLGFkbWluIn0.5gXc6Weg7pGAA5L4TrmIgS0G2Nv8MnH0SXvtYmBJk5w');

			var token = this.getItem('token');
			console.log(token)
			if(token) {
				this.getMenu();
			} else {
				if(this.getCookie('username') && this.getCookie('password')) {
					this.user = {
						username: this.getCookie('username'), //账号
						password: this.getCookie('password'), //密码
						checked: true
					}
				}
			}

		},
		methods: {
			async login() {
				if(this.user.username == null || this.user.username == '') {
					this.$message.error('请输入账号');
					return;
				}
				if(this.user.password == null || this.user.password == '') {
					this.$message.error('请输入密码');
					return;
				}
				this.ajaxLogin({ //统计
					url: 'login',
					type: 'get',
					data: this.user,
					timeout: 5000,
				}).then(data => {
					this.setItem('token', data.token);
					//var userData = data.user;

					if(this.user.checked) {
						this.setCookie('username',this.user.username,7);
						this.setCookie('password',this.user.username,7);
					} else {
						this.deleteCookie('username');
						this.deleteCookie('password');
					}

					this.getMenu();
				})
			},
			getMenu() {
				/*获取token*/
				this.ajax({
					url: "menu/getCurrentUserMenus",
					type: 'get',
					success: data => {
						this.setItem("CurrenUser", '{"isSuper":false,"id":1}');
						this.AssmmenuList = [];
						/*登录页面的路由信息默认加入*/
						this.AssmmenuList.push(this.$router.options.routes[0]);
						/*加入配置路由信息*/
						this.SetAssemMenuList(data, this.AssmmenuList);
						/*替换默认的路由信息*/
						this.$router.options.routes = this.AssmmenuList;
						/*保存菜单，页面刷新的时候还是显示对应角色能够看到的页面*/
						this.setItem('routers', data);
						if(!data.length) { //如果没有配置角色
							this.$message({
								message: '警告, 您还没有权限！请联系管理员配置角色！',
								type: 'warning'
							});
						} else if(data[0].children && data[0].children.length > 0) {
							if(data[0].children[0].children.length) { //默认走菜单的第一个路径
								/*增加页面重定向*/
								this.AssmmenuList.push({
									path: '*',
									hiddenMenu: true, //隐藏菜单栏
									redirect: data[0].children[0].children[0].uri
								})
								this.$router.push(data[0].children[0].children[0].uri);
							} else {
								/*增加页面重定向*/
								this.AssmmenuList.push({
									path: '*',
									hiddenMenu: true, //隐藏菜单栏
									redirect: data[0].children[0].uri
								})
								this.$router.push(data[0].children[0].uri);
							}
							this.$router.replace(data[0].uri + '/' + data[0].children[0].uri)
							this.$message({
								message: '登录成功',
								type: 'success'
							});
						}
					}
				});
			},
			SetAssemMenuList(data, menuList) {
				var list = [];
				//拼装菜单
				for(var item of data) {
					//var menuData = item.attributes.data;

					let menuItem = {
						path: item.uri,
						meta: {
							showName: item.name
						},
						//level: (menuData.level - 1),
						ico: item.icon,
						component: home,
					}
					menuItem.children = [];
					if(item.children != undefined) {
						this.SetMenuChildren(item.children, menuItem);
					} else {
						menuItem.meta.onlyOne = true
					}
					menuList.push(menuItem);
				}

			},
			SetMenuChildren(children, menuList) {
				if(children.length > 0) {
					for(var item of children) {
						//var menuData = item;
						let menuItem = {
							path: item.uri,
							meta: {
								showName: item.name
							},
							//ico: menuData.icon,
							component: resolve => {
								require([item.pathUrl], resolve)
							},
						}
						if(menuItem.children == undefined) {
							if(item.children != undefined) {
								if(item.children.length > 0) {
									menuItem.children = [];
								}
							}
						}
						menuList.children.push(menuItem);
						if(item.children != undefined) {
							this.SetMenuChildren(item.children, menuItem);
						}
					}

				}
			}
		}
	}
</script>
<style scoped lang="less">
	* {
		margin: 0;
		padding: 0;
		font-family: "微软雅黑", sans-serif;
	}

	.header {
		width: 1180px;
		padding: 20px 0;
		margin: 0 auto
	}

	.main {
		width: auto;
		background: #2880e4 url(../../../static/img/bg.jpg) center no-repeat;
		color: #666666;
		min-width: 1180px;
	}

	.main>.main-center {
		width: 1180px;
		margin: 0 auto;
		height: 500px;
		position: relative;
	}

	.footer {
		text-align: center;
		font-size: 12px;
		line-height: 36px;
		color: #666666;
	}

	.login-panel {
		width: 350px;
		height: 360px;
		background-color: #FFF;
		left: 780px;
		top: 70px;
		position: relative;
		padding: 45px 25px 0 25px;
		box-sizing: border-box;
	}

	.login-panel>.title {
		font-weight: bold;
		margin-bottom: 5px;
		font-size: 16px;
	}

	.login-panel>.content {
		padding: 20px 0;
	}

	.login-panel>.content>.login-input {
		height: 40px;
		width: 296px;
		border: 2px solid #dddddd;
		font-size: 16px;
		line-height: 36px;
		margin-bottom: 20px;
		color: #AAA;
		position: relative;
	}

	.login-panel>.content>.login-input>input {
		margin: 0;
		padding: 0;
		left: 40px;
		top: 0;
		position: absolute;
		height: 40px;
		width: 250px;
		border: 0;
		font-size: 16px;
		padding-left: 5px;
	}

	.login-panel>.content>.login-input>.user {
		display: inline-block;
		height: 40px;
		width: 40px;
		background: url(../../../static/img/input-user.png) no-repeat;
	}

	.login-panel>.content>.login-input>.password {
		display: inline-block;
		height: 40px;
		width: 40px;
		background: url(../../../static/img/input-password.png) no-repeat;
	}

	.remember-me {
		font-size: 12px;
		margin-bottom: 20px;
	}

	.login-checkbox {
		display: none;
	}

	.login-checkbox+.remember {
		background-color: #FFF;
		border: 2px solid #dddddd;
		padding: 6px;
		border-radius: 0;
		display: inline-block;
		position: relative;
		vertical-align: bottom;
	}

	.login-checkbox+.remember:active {
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px 1px 3px rgba(0, 0, 0, 0.1);
	}

	.login-checkbox:checked+.remember {
		border: 2px solid #dddddd;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05), inset 15px 10px -12px rgba(255, 255, 255, 0.1);
		color: #243441;
	}

	.login-checkbox:checked+.remember:after {
		content: '\2714';
		position: absolute;
		top: -3px;
		left: 2px;
		color: #AAAAAA;
		text-align: center;
		font-size: 12px;
		vertical-align: text-top;
	}

	.login-button {
		background-color: #05d357;
		height: 40px;
		width: 299px;
		border: 0;
		border-radius: 4px;
		color: #FFFFFF;
		font-size: 14px;
		font-weight: bold;
	}

	.login-button:hover {
		background-color: #5ad397;
		height: 40px;
		width: 299px;
		border: 0;
		border-radius: 4px;
		color: #FFFFFF;
		font-weight: bold;
	}

	.login-button:focus {
		background-color: #5ad397;
		height: 40px;
		width: 298px;
		border: 0;
		border-radius: 4px;
		color: #FFFFFF;
		font-weight: bold;
	}

	.text-panel {
		top: 75px;
		width: 650px;
		position: absolute;
	}

	.text-panel .logo-text {
		font-size: 48px;
		color: #FFFFFF;
	}

	.info-text {
		float: right;
	}

	.info-text-en {
		margin-top: 10px;
		font-size: 24px;
		color: #FFFFFF;
	}

	.info-text-zh {
		margin-top: -3px;
		font-size: 36px;
		color: #FFFFFF;
	}

	.text-panel>h2 {
		color: #FFFFFF;
		margin-top: 96px;
		font-size: 30px;
		font-weight: 500;
	}

	.text-panel>h3 {
		color: #FFFFFF;
		margin-top: 35px;
		font-size: 18px;
		font-weight: 500;
	}

	.text-panel>h4 {
		color: #FFFFFF;
		margin-top: 45px;
		font-size: 16px;
		font-weight: 500;
	}

	.text-panel>h5 {
		color: #FFFFFF;
		margin-top: 12px;
		font-size: 16px;
		font-weight: 500;
	}

	.validate-input {
		margin: 0;
		height: 34px;
		width: 100px;
		border: 2px solid #dddddd;
		font-size: 16px;
		padding-left: 5px;
		top: -10px;
		position: relative
	}
</style>
