<template>
	<div>
		<el-form ref="form" style="width:100%;height: 100%;" :model="formdata" :rules="rules" label-width="100px" label-position="right">
			<el-row :gutter="20">
				<el-col :span="24">
					<el-form-item label="单位：" prop="deptid">
						<!--<el-input v-model="formdata.content" style="width:360px" type="textarea" :rows="4"></el-input>-->

						<el-select v-model="formdata.deptid" placeholder="请选择">
							<el-option v-for="item in deptOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="24">
					<el-form-item label="时限：" prop="interval">
						<el-input v-model.number="formdata.interval" style="width:360px"></el-input>小时
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item style="margin-top: 30px">
				<el-button style="width:120px" type="primary" @click="OnSubmit">确定</el-button>
				<el-button style="width:120px" @click="Hiden">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	export default {
		components: {},
		mounted() {},
		data() {
			var check = (rule, value, callback) => {
				if(!value) {
					callback()
				} else if(!Number.isInteger(value)) {
					callback(new Error('请输入数值'))
				} else {
					callback()
				}
			}
			return {
				formdata: {
					deptid: null,
					interval: ''
				},
				deptOptions: [],
				type: 1, //1代表主办单位，2代表从办单位
				rules: {
					deptid: [{
						required: true,
						message: '单位不能为空',
						trigger: 'blur'
					}],
					interval: [{
						required: true,
						message: '时限不能为空',
						trigger: 'blur'
					}, {
						validator: check,
						type: 'number',
						message: '时限必须为数字值'
					}]
				}
			}
		},
		methods: {
			OnSubmit() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						if(this.type == 1) {
							this.$parent.$parent.data.hostDepartments.push({
								label: this.findLabel(this.formdata.deptid),
								value: this.formdata.deptid,
								interval:this.formdata.interval
							})
						} else if(this.type == 2) {
							this.$parent.$parent.data.followDepartments.push({
								label: this.findLabel(this.formdata.deptid),
								value: this.formdata.deptid,
								interval:this.formdata.interval
							})
						}
						this.Hiden();
					} else {
						return false;
					}
				});
			},
			findLabel(id){
				for(var i=0;i<this.deptOptions.length;i++){
					if(this.deptOptions[i].value==id){
						return this.deptOptions[i].label;
					}
				}
			},
			Hiden() {
				this.formdata={
					deptid: null,
					interval: ''
				}
				this.$parent.$parent.showChoose = false;
			}
		},
		watch: {}
	}
</script>