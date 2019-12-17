<template>
	<div class="home">
		<el-menu class="navbar-default navbar-static-side clearfix menu" :class="{menuclass:!menu}">
			<div class="logo" :class="{menuclass:!menu}">
				<i class="el-icon-menu" @click="showMenu" style="float:left;line-height:50px;margin-left:23px;cursor:pointer"></i>
				<span v-show="menu" style="float:left;margin-left:20px;">欢迎--{{currentUser.nature}}</span>
			</div>
			<mainMenu></mainMenu>
		</el-menu>
		<div class="content">
			<header style="background-color: #354656;">
				<div class="navbar-header clearfix" style="float: left; width: 100%;">

					<!--<p style="display:inline-block;font-size: 24px !important;margin-left:20px;margin-bottom: 0;height:50px;line-height:50px;color:#000;">柒采舆情</p>-->
					<div class="sysList">
						<ul>
							<li @click='toSys' style="cursor: pointer;">用户中心</li>
							<li @click='toCom' class="active" >应急指挥</li>
						</ul>
					</div>
					<ul class="nav navbar-top-links navbar-right" style="float: right;">
						<li class="user" style="color:white">
							<div class="notice" v-show="false" style="float:left;font-size:16px;width:80px;" @click="noticeDialog">
								<a>
									<img src="../../../static/img/ld.png" height="48" width="48">
									<i style="font-size:12px;color:red" class="noreadtotal" v-if="noreadtotalnum||noreadtotalnum==0">{{noreadtotalnum}}</i>
									<i style="font-size:12px;color:red" class="noreadtotal" v-if="!noreadtotalnum&&noreadtotalnum!=0">{{noreadtotal}}</i>
								</a>
							</div>
							<!-- <img src="../../assets/img/user.png" height="32" width="32" style='float:left;margin-top:15px'> -->
							<el-dropdown @command="handleCommand" trigger="click">
								<span class="el-dropdown-link" style="color: #999c9e; cursor: pointer">
<!--                                  <el-tooltip class="item" effect="dark" :content="currentUser.staffName" placement="top-start" :style="currentUser.staffName|getStyle"> -->
                                 <span style="color:white;">
                                     <!-- {{currentUser.staffName}} -->
                                     <img src="../../assets/img/set.png" height="48" width="48" style='margin-top: -3px'>
                                 </span>
								<!-- </el-tooltip> -->
								<!-- <i class="el-icon-caret-bottom el-icon--right"></i> -->
								</span>
								<el-dropdown-menu slot="dropdown">
									<!--    <el-dropdown-item>设置</el-dropdown-item> -->
									<el-dropdown-item divided command="modifyPassword">修改密码</el-dropdown-item>
									<el-dropdown-item divided command="quit">退出</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</li>
					</ul>
				</div>
			</header>
			<div class="view ">
				<!--                 <div class="view-header">
                    <b>演示</b>
                </div> -->
				<div class="view-content">
					<router-view></router-view>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import mainMenu from './mainMenu.vue'
	import tidiTip from '../public/tidiTip.vue'
	import tipsSelPro from '../public/TipSelectProject.vue'
	import store from '@/components/store/Store'
	import Cookies from 'js-cookie'

	import {
		mapMutations,
		mapState
	} from 'vuex'

	export default {
		components: {
			tidiTip,
			tipsSelPro,
			mainMenu,
		},
		data() {
			return {
				flag: false,
				tidiState: false,
				showDialog: false,
				showDialogId: '',
				menu: true, //菜单是否显示
				noreadtotal: 0, //推送数据总数
				messageBol: true,
				searchFrom: {
					title: "",
					page: 1, //页码
					pageSize: 15, //每页条数
					type: 1,
				},
				// noticeNumChange:0,//消息推送数据
				currentUser: JSON.parse(this.getItem("logindata")) == null ? "" : JSON.parse(this.getItem("logindata"))
				// currentUser:this.CurrentUser.staffName,
			}
		},
		//过滤器调节下拉菜单样式
		filters: {
			getStyle(val) {
				if(val.length < 6) {
					return {
						width: 50 + 'px'
					}
				} else {
					return {
						width: 70 + 'px'
					}
				}
			}
		},
		computed: {
			...mapState(['noreadtotalnum', 'routeState']),
		},
		watch: {
			routeState: function() {
				this.menu = this.routeState;
			}
		},
		mounted() {
			// this.ajax({
			//     url: "SystemMessageUser/QueryTotal",
			// }).then(data => {
			//     this.noreadtotal = data;
			//     // Vue.prototype.noreadtotal=data;
			//     // console.log(Vue.prototype.noreadtotal);
			// });
			// this.notice();
			// this.ajax({
			//     type: "get",
			//     url: "SystemMessageUser/QueryMessage",
			//     data: this.searchFrom,
			// }).then(data => {
			//     store.commit("NOTICENUM", data.total);
			// });
		},
		methods: {
			bodyStyle() {
				if(!this.flag) {

					this.flag = !this.flag
					$('body').addClass('mini-navbar')
				} else {
					this.flag = !this.flag
					$('body').removeClass('mini-navbar')
				}
			},
			handleCommand(command) {
				if(command == 'quit') {
					this.$confirm('您确定要退出？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						//						this.$router.push({
						//							path: '/login'
						//						});
						Cookies.set('perms', null, -1);
						Cookies.set('token', null, -1);
						window.location.href = backLoginUrl;



						sessionStorage.removeItem("CurrenUser"); //当前登录用户
						sessionStorage.removeItem("token"); //token
						sessionStorage.removeItem('selProjectId'); //项目Id
						sessionStorage.removeItem("routers"); //路由
						this.$message({
							type: 'success',
							message: '退出成功!'
						});
					});
				} else if(command == 'modifyPassword') {
					this.$router.push('/modifyPassword')
				}
			},
			showTidi: function() {
				if(this.tidiState == true) {
					this.tidiState = false;
				} else {
					this.tidiState = true
				}
			},
			noticeDialog() { //消息跳转
				this.$router.push("/notice");
			},
			notice() { //消息推送
				//Set the hubs URL for the connection
				$.connection.hub.url = this.Huburl;
				// Declare a proxy to reference the hub.
				var chat = $.connection.myHub;
				// Create a function that the hub can call to broadcast messages.
				chat.client.ReplyMessage = (message) => {
					console.log(11111111);
					this.noreadtotal += 1;
					store.commit("NOTICENUM", this.noreadtotal);
					if(this.messageBol) {
						this.messageBol = false;
						this.$notify.info({
							message: '您有新消息',
							showClose: true,
							duration: 2000,
							offset: 30,
							onClose: () => {
								this.messageBol = true;
							}
						});
					}

					// Vue.prototype.noreadtotal=this.noreadtotal;
					// Html encode display name and message.
					// var encodedMsg = $('<div />').text(message).html();
					// Add the message to the page.
					// $('#discussion').append('<li><strong></strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');
				};

				// Get the user name and store it to prepend to messages.
				// $('#displayname').val(prompt('Enter your name:', ''));
				// Set initial focus to message input box.
				// $('#message').focus();
				// Start the connection.
				let id = JSON.parse(this.getItem("CurrenUser")).id;
				$.connection.hub.qs = {
					"userId": id
				};
				$.connection.hub.start();
				$.connection.hub.disconnected(function() {
					setTimeout(function() {
						$.connection.hub.start().done((data) => {
							// alert('111111111111')
							// var chat = $.connection.myHub;
							let id = JSON.parse(this.getItem("CurrenUser")).id;
							$.connection.hub.qs = {
								"userId": id
							};
						})
					}, 2000)
				})
			},
			//显示菜单
			showMenu() {
				if(this.menu) {
					this.menu = false;
					store.commit("ROUTESTATE", this.menu);
				} else {
					this.menu = true;
					store.commit("ROUTESTATE", this.menu);
				}
			},
			//隐藏菜单
			hiddenMenu() {},
			toSys() {
				var authority = this.hasAuthority();
				if(!authority.system) {
					this.$message({
						message: '警告, 您还没有权限！请联系管理员配置角色！',
						type: 'warning'
					});
					return;
				}

				var url = systemUrl;
				if(window.location.href.indexOf(url) < 0) {
					window.location.href = url;
				}
			},
			toCom() {
				var authority = this.hasAuthority();
				if(!authority.emergency) {
					this.$message({
						message: '警告, 您还没有权限！请联系管理员配置角色！',
						type: 'warning'
					});
					return;
				}

				var url = commandUrl;
				if(window.location.href.indexOf(url) < 0) {
					window.location.href = url;
				}
			},
			hasAuthority() {
				let perms = JSON.parse(Cookies.set('perms'));
				console.log(perms);
				var system = 0;
				var emergency = 0;
				for(var i = 0; i < perms.length; i++) {
					if(perms[i].indexOf('system') != -1) {
						system++;
					}
					if(perms[i].indexOf('emergency') != -1) {
						emergency++;
					}
				}
				return {
					system: system,
					emergency: emergency
				}
			},
		}
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	.item {
		display: inline-block;
		float: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.notice {
		position: relative;
	}

	.noreadtotal {
		position: absolute;
		top: -3px;
		left: 45px;
		font-weight: 600;
	}

	.home {
		width: 100%;
		height: 100%;
	}

	.logo {
		font-size: 16px;
		text-align: center;
		line-height: 50px;
		height: 50px;
		color: #fff;
		width: 240px;
		background: #354656;
	}

	header {
		height: 50px;
		// background: #eee;
	}

	.user {
		float: right;
		width: 130px;
		height: 100%;
		overflow: hidden;
		text-align: center;
		line-height: 40px;
		font-size: 24px;
		margin-right: 0;
	}

	span {
		color: #fff;
	}

	img {
		height: 21px;
		width: auto;
		vertical-align: middle;
	}

	.menu {
		float: left;
		width: 240px;
		height: 100%;
		background: #4D5E70;
		overflow: hidden;
		transition: 0.3s;
	}

	.menuclass {
		width: 64px;
		transition: 0.3s;
	}

	.content {
		height: 100%;
		overflow: hidden;
		// overflow-y: auto;
		overflow-x: auto;
	}

	.content .view {
		/*margin: 5px 20px 0px 20px;*/
		height: calc(~ "100% - 50px");
		background: #fff;
		border-radius: 5px;
		.view-header {
			background-color: #fff;
			border-color: #e7eaec;
			-webkit-border-image: none;
			-o-border-image: none;
			border-image: none;
			border-style: solid solid none;
			border-width: 4px 0 0;
			color: inherit;
			margin-bottom: 0;
			height: 48px;
			line-height: 48px;
			border-bottom: 1px solid #e7eaec;
			text-indent: 20px;
			b {
				display: inline-block;
				font-size: 14px;
				margin: 0 0 7px;
				padding: 0;
				text-overflow: ellipsis;
				float: left;
			}
		}
		.view-content {
			// min-width:1620px;
			// width:%;
			height: 100%;
			// overflow: hidden;
			// min-width:1400px;
		}
	}
</style>
<style>
	/*.view .box{
    width:100% !important;
}*/

	.inner-container::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
		border-radius: 10px;
		background-color: #f5f5f5;
	}
	/*定义滑块，内阴影及圆角*/

	.inner-container::-webkit-scrollbar-thumb {
		/*width: 10px;*/
		height: 20px;
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 6px rgba(213, 217, 222, .1);
		/*background-color: ;*/
	}
	/*@media screen and (min-height:950px) and (max-height: 1000px) {
    .inner-container {
        height: 780px;
        overflow: hidden;
        overflow-y: scroll
    }
   /* .inner-container::-webkit-scrollbar {
        display: none;
    }*/
	/*}*/

	@media screen and (min-height:920px) and (max-height: 940px) {
		/* .inner-container {
        height: 730px;
        overflow: hidden;
        overflow-y: scroll;
        padding-bottom: 15px;
    }*/
		/*  .inner-container::-webkit-scrollbar {
        display: none;
        border-radius: 10px;
    }*/
	}

	@media screen and (min-height:894px) and (max-height: 919px) {
		/* .inner-container {
        height: 720px;
        overflow: hidden;
        overflow-y: scroll;
        padding-bottom: 15px;
    }*/
		/* .inner-container::-webkit-scrollbar {
        display: none;
    }*/
	}

	@media screen and (min-height:671px) and (max-height: 893px) {
		/* @media screen and (min-width:1400px) and (max-width: 1900px){*/
		/*   .inner-container {
        height: 600px;
        overflow: hidden;
        overflow-y: scroll;
        padding-bottom: 15px;
    }*/
		/*  .inner-container::-webkit-scrollbar {
        display: none;
    }*/
	}
	/*@media screen and (min-width:1200px) and (max-width: 1400px){
          .inner-container {
        height: 660px;
        overflow: hidden;
        overflow-y: scroll
    }

    }

}*/

	@media screen and (min-height:620px) and (max-height: 670px) {
		/*.inner-container {
        height: 450px;
        overflow: hidden;
        overflow-y: scroll;
        padding-bottom: 15px;
    }*/
		/* .inner-container::-webkit-scrollbar {
        display: none;
    }*/
	}

	@media screen and (min-height:580px) and (max-height: 620px) {
		/*.inner-container {
        height: 440px;
        overflow: hidden;
        overflow-y: scroll;
        padding-bottom: 15px;
    }*/
		/*   .inner-container::-webkit-scrollbar {
        display: none;
    }*/
	}

	@media screen and (max-height:580px) {
		/* .inner-container {
        height: 300px;
        overflow: hidden;
        overflow-y: scroll;
        padding-bottom: 15px;
    }*/
		/*  .inner-container::-webkit-scrollbar {
        display: none;
    }*/
	}

	@media (max-width: 10000px) {
		body {
			/*width: 1200px;*/
			/*margin-bottom: 15px;*/
			/*overflow-x: scroll;*/
			/*overflow-y: hidden;*/
			/*-webkit-overflow-scrolling: touch;*/
			/*-ms-overflow-style: -ms-autohiding-scrollbar;*/
			/*border: 1px solid #ddd;*/
		}
		/*}*/
		.view {
			/*width:100%;*/
			height: 100%;
			/*overflow-x:auto;*/
			/*overflow-y:auto;*/
		}
		.view-content {
			/*min-width: 1634px;*/
			/*height:100%;*/
		}
		.view::-webkit-scrollbar-track {
			-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
			border-radius: 10px;
			background-color: #f5f5f5;
		}
		/*定义滑块，内阴影及圆角*/
		.view::-webkit-scrollbar-thumb {
			/*width: 10px;*/
			height: 5px;
			border-radius: 10px;
			-webkit-box-shadow: inset 0 0 6px rgba(213, 217, 222, .1);
			/*background-color: ;*/
		}
		.el-table__body-wrapper::-webkit-scrollbar {
			height: 8px;
		}
		.el-table__body-wrapper::-webkit-scrollbar-track {
			-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
			border-radius: 10px;
			background-color: #f5f5f5;
		}
		/*定义滑块，内阴影及圆角*/
		.el-table__body-wrapper::-webkit-scrollbar-thumb {
			/*width: 10px;*/
			height: 5px;
			border-radius: 10px;
			-webkit-box-shadow: inset 0 0 6px rgba(213, 217, 222, .1);
		}

		.sysList {
			font-size: 16px;
			height: 50px;
			line-height: 45px;
			float: left
		}
		.sysList li {
			list-style: none;
			float: left;
			margin: 0px 15px;
			color: #fff;
		}
		.sysList li.active {
			border-bottom: 3px solid #fff;
			cursor: pointer;
		}
	}
</style>
