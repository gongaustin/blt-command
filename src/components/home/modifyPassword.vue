<template>
	<div>
		<h1 style="font-size: 20px;padding-top: 20px;padding-bottom: 60px;font-weight: 900" class="titleClass">修改密码</h1>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm formClass">
			<el-form-item label="原始密码" prop="oldpass">
				<el-input type="password" v-model="ruleForm.oldpass" placeholder="请输入原始密码" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="新密码" prop="pass">
				<el-input type="password" v-model="ruleForm.pass" auto-complete="off" placeholder="请输入新密码"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="checkPass">
				<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="确认新密码"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
				<el-button @click="resetForm('ruleForm')">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import Cookies from 'js-cookie'
	export default {
		data() {

			var validatePass = (rule, value, callback) => {
				if(value === '' || !/^\w{1,}$/.test(value)) {
					callback(new Error('请输入数字字母下划线！'));
				} else if(this.ruleForm.pass == this.ruleForm.oldpass) {
					callback(new Error('不能与原密码一致！'));
				} else {
					if(this.ruleForm.checkPass !== '') {
						this.$refs.ruleForm.validateField('checkPass');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入密码'));
				} else if(value !== this.ruleForm.pass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				ruleForm: {
					pass: '',
					checkPass: '',
					oldpass: ''
				},
				rules: {
					pass: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					checkPass: [{
						validator: validatePass2,
						trigger: 'blur'
					}],
					oldpass: [{
						required: true,
						message: '请输入原始密码',
						trigger: 'blur'
					}],
				},
				addForm: {
					newPassword: "",
					oldPassword: '',
				},
			};
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.addForm.newPassword = this.ruleForm.pass;
						this.addForm.oldPassword = this.ruleForm.oldpass;

						var _this = this;
						$.ajax({
							url: modifyPasswordUrl + 'user/modify/password',
							type: 'post',
							dataType: 'json',
							timeout: 10000,
							headers: {
								'Authorization': _this.getItem("token")
							},
							data: _this.addForm,
							success: function(result) {
								if(result.code == 500) {
									_this.$message({
										message: result.msg,
										type: 'error'
									});
									return
								} else {
									Cookies.set('perms', null, -1);
									Cookies.set('token', null, -1);
									_this.$message({
										message: '密码修改成功',
										type: 'success'
									});
									window.location.href = backLoginUrl;
								}
							},
							error: function(xhr, type, error) {
								_this.$message({
									message: '网络错误！',
									type: 'error'
								});
							}
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>
<style scoped>
	.titleClass {
		display: flex;
		justify-content: center;
	}
	
	.formClass {
		width: 25%;
		margin: auto;
	}
</style>