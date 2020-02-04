import Vue from 'vue'
import Router from 'vue-router'
import home from '../components/home/home' //
import ElementUI from 'element-ui' //饿了么PC组件库
import 'element-ui/lib/theme-chalk/index.css' //饿了么PC组件库样式\
import Cookies from 'js-cookie'
import fetch from '../components/Common/fetch'
Vue.use(Router)
Vue.use(ElementUI)
var loginurl = backLoginUrl

var routers = [{
		hiddenMenu: true, //隐藏菜单栏
		path: '/login', //登录页    /login
		meta: {
			showName: '登录页'
		},
		redirect: loginurl,
		//level: 0,
//		component: resolve => {
//			require(['../components/login/login'], resolve)
//		},
	},
	{
		hiddenMenu: true, //隐藏菜单栏
		path: '/modifyPassword', //登录页    /login
		meta: {
			showName: '修改密码'
		},
		component: resolve => {
			require(['../components/home/modifyPassword'], resolve)
		}
	},
	{
		hiddenMenu: true,
		path: '/',
		redirect: '/login',
	},
	{
		key: 'emergency:manage',
		path: '/emergency',
		hiddenMenu: false,
		ico: 'fa-cog',
		meta: {
			showName: '应急指挥',
		},
		component: home,
		children: [{
			key: 'emergency:manage:upper:report',
			path: 'report-up',
			ico: 'fa-user',
			meta: {
				showName: '收件',
			},
			component: resolve => {
				require(['../components/views/EmergencyCommand/report-up.vue'], resolve)
				//require(['../components/System/CommonDictionaryView/CommonDictionary.vue'], resolve)
			}
		}, {
			key: 'emergency:manage:lower:report',
			path: 'report-down',
			ico: 'fa-user',
			meta: {
				showName: '上报',
			},
			component: resolve => {
				require(['../components/views/EmergencyCommand/report-down.vue'], resolve)
				//require(['../components/System/CommonDictionaryView/CommonDictionary.vue'], resolve)
			}
		}, {
			key: 'emergency:manage:upper:under',
			path: 'repeat-up',
			ico: 'fa-user',
			meta: {
				showName: '下派',
			},
			component: resolve => {
				require(['../components/views/EmergencyCommand/repeat-up.vue'], resolve)
				//require(['../components/System/CommonDictionaryView/CommonDictionary.vue'], resolve)
			}
		}, {
			key: 'emergency:manage:lower:under',
			path: 'repeat-down',
			ico: 'fa-user',
			meta: {
				showName: '收件',
			},
			component: resolve => {
				require(['../components/views/EmergencyCommand/repeat-down.vue'], resolve)
				//require(['../components/System/CommonDictionaryView/CommonDictionary.vue'], resolve)
			}
		}, {
			key: 'emergency:manage:upper:list',
			path: 'emergency-up',
			ico: 'fa-user',
			meta: {
				showName: '应急指挥管理',
			},
			component: resolve => {
				require(['../components/views/EmergencyCommand/emergency-up.vue'], resolve)
				//require(['../components/System/CommonDictionaryView/CommonDictionary.vue'], resolve)
			}
		}, {
			key: 'emergency:manage:lower:list',
			path: 'emergency-down',
			ico: 'fa-user',
			meta: {
				showName: '应急指挥任务',
			},
			component: resolve => {
				require(['../components/views/EmergencyCommand/emergency-down.vue'], resolve)
				//require(['../components/System/CommonDictionaryView/CommonDictionary.vue'], resolve)
			}
		}, {
			key: 'emergency:manage:upper:score',
			path: 'performance-up',
			ico: 'fa-user',
			meta: {
				showName: '绩效得分汇总',
			},
			component: resolve => {
				require(['../components/views/EmergencyCommand/performance-up.vue'], resolve)
				//require(['../components/System/CommonDictionaryView/CommonDictionary.vue'], resolve)
			}
		}, {
			key: 'emergency:manage:lower:score',
			path: 'performance-down',
			ico: 'fa-user',
			meta: {
				showName: '绩效',
			},
			component: resolve => {
				require(['../components/views/EmergencyCommand/performance-down.vue'], resolve)
				//require(['../components/System/CommonDictionaryView/CommonDictionary.vue'], resolve)
			}
		}]
	},
	{
		path: '*',
		hiddenMenu: true, //隐藏菜单栏
		redirect: ''
	}
];

if(Cookies.get("perms") && Cookies.get("perms") != 'null') {
	var firstpage = '';
	outloop://定义跳出标记
	for(var i = 0; i < routers.length; i++) {
		if(routers[i].children != undefined) {
			var perms = JSON.parse(Cookies.get("perms"));
			for(var j = 0; j < perms.length; j++) {
				for(var k = 0; k < routers[i].children.length; k++) {
					if(perms[j] === routers[i].children[k].key) {
						firstpage=routers[i].path+'/'+routers[i].children[k].path;
						break outloop;//跳出到指定标记
					}
				}
			}
		}
	}

	if(!firstpage){
		firstpage='/login';
	}
	routers[2].redirect = firstpage;
}

var router = new Router({
	routes: routers
})

/*如果存在session缓存且不是管理员就走缓存的页面信息*/
if(Cookies.get("perms") && Cookies.get("perms") != 'null') {

	let persStr = Cookies.get("perms");
	let perms = JSON.parse(persStr)
	SetMenuList(perms)
} else {
	//	if(Cookies.get("token") && Cookies.get("token") != 'null') {
	//		fetch('http://192.168.2.60:8000/ucenter/user/currentUser?').then(resp => {
	//			let perms = resp.data.perms;
	//			Cookies.set('perms', JSON.stringify(perms))
	//			SetMenuList(perms);
	//		})
	//	}
	window.location.href = loginurl;
}

function checkHasPerm(key, perms) {
	let hasPerm = false;
	for(let perm of perms) {
		if(key === perm) {
			hasPerm = true;
			break
		}
	}
	return hasPerm;
}

function SetAssemMenuList(data, menuList, perms) {

	var list = [];
	//拼装菜单
	for(var item of data) {
		if(item.hiddenMenu) {
			continue;
		}
		if(!checkHasPerm(item.key, perms)) {
			continue;
		}
		let menuItem = {
			path: item.path,
			meta: {
				showName: item.meta.showName
			},
			ico: item.icon,
			component: home,
		}
		menuItem.children = [];
		if(item.children != undefined) {
			SetMenuChildren(item.children, menuItem, perms);
		} else {
			menuItem.meta.onlyOne = true
		}
		menuList.push(menuItem);
	}
}

function SetMenuChildren(children, menuList, perms) {
	if(children.length > 0) {
		for(var item of children) {
			if(item.hiddenMenu) {
				continue;
			}
			if(!checkHasPerm(item.key, perms)) {
				continue;
			}
			let menuItem = {
				path: item.path,
				meta: {
					showName: item.meta.showName
				},
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
				SetMenuChildren(item.children, menuItem);
			}
		}

	}
}

function SetMenuList(perms) {
	menuList = [];
	menuList.push(routers[0]);
	menuList.push(routers[1]);
	menuList.push(routers[2]);
	SetAssemMenuList(routers, menuList, perms);
	router.options.routes = menuList;
}

var menuList = []
var fn = Vue.prototype
fn.projectType = []
// fn.projectIdList = []
router.beforeEach(async(to, from, next) => {
	/*获得项目类型-end*/
	//判断当前用户是否有权限
	if(Cookies.get("CurrenUser")) {
		if(to.redirectedFrom == "/*" || to.matched.length == 0) {
			if(Cookies.get("routers") != null) {
				if(Cookies.get("routers").indexOf(to.path) == -1) {
					//layer.msg("无效操作"); //在路由地址乱填的情况下，这里做了简单提醒
					next(from);
				} else {
					next();
				}
			} else {
				next();
			}
		} else {
			next();
		}
	} else {
		window.location.href = loginurl;
		// if(to.path != "/login") {
		// 	next("/login");
		// } else {
		// 	next();
		// }
	}
})
router.afterEach((to, from, next) => {
	document.title = '柒采舆情-' + to.meta.showName
	/*如果按了后退键，左边的菜单也要显示到对应位置*/
	Vue.prototype.eventBus.$emit('all-change')
})
export default router;
export {
	routers
}
