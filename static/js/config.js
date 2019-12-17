//文件上传路径
// const emrUrl = 'http://new.sevencai.com';
//测试环境
const emrUrl = 'http://new.sevencai.cn';
const UpLoadFileUrl = emrUrl+':8000/ucenter/upload/file/'
//修改密码接口
const modifyPasswordUrl = emrUrl+':8000/ucenter/'
//const UpLoadFileUrl = 'http://192.168.2.60:8001/emergency/upload/file'
//接口路径们
const proCommonUrl = emrUrl+':8001/emergency/'
//const devCommonUrl = 'http://120.24.241.113:8001/emergency/'
const devCommonUrl = emrUrl+':8001/emergency/'
const backLoginUrl = 'http://localhost:8081/#/login?backUrl=http://localhost:8082/#/'
// const backLoginUrl = emrUrl+'/ucenter/#/login?backUrl='+emrUrl+'/emergency'

const systemUrl = emrUrl+'/ucenter/#/';
const commandUrl = emrUrl+'/emergency/#/';


function formatDataDate(data, field) {
	data.forEach((item, index) => {
		item.ctime = formatDate(item[field]);
	})
	return data;
}

function formatDate(timestr) { //格式化时间
	var fmt = "yyyy-MM-dd hh:mm:ss";
	var date = new Date(timestr);
	var o = {
		"M+": date.getMonth() + 1, //月份
		"d+": date.getDate(), //日
		"h+": date.getHours(), //小时
		"m+": date.getMinutes(), //分
		"s+": date.getSeconds(), //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
