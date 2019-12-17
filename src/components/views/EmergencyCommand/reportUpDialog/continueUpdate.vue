<template>
	<div>
		<el-form ref="form" style="width:100%;height: 100%;" :model="formdata" :rules="rules" label-width="100px" label-position="right">
			<el-row :gutter="20">
				<el-col :span="10">
					<el-form-item label="处置时间间隔：" prop="feedbackIntervalDay">
						<el-input v-model.number="formdata.feedbackIntervalDay" style="width:180px"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					天，直至办结
				</el-col>
			</el-row>

			<el-row :gutter="20">
				<el-col :span="24">
					<el-form-item label="描述：" prop="content">
						<el-input v-model="formdata.content" style="width:360px" type="textarea" :rows="4"></el-input>
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
		created() {},
		props: ['showDialogId'],
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
				rules: {
					feedbackIntervalDay: [{
						required: true,
						message: '时间间隔不能为空',
						trigger: 'blur'
					}, {
						validator: check,
						type: 'number',
						message: '时间间隔必须为数字值'
					}],
					content:[{
						required: true,
						message: '描述不能为空',
						trigger: 'blur'
					}],
				},
				formdata: {
					feedbackIntervalDay: '',
					content:''
				}
			}
		},
		methods: {
			OnSubmit() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						let apiaction = this.formdata.taskId == undefined ? "reported/upper/followup" : "reported/upper/modify";
						this.formdata.id = this.formdata.taskId == undefined ? this.showDialogId : this.formdata.id;
						this.ajax({
							url: apiaction,
							type: 'post',
							data: this.formdata,
							success: function(data) {
								this.Hiden();
							}
						});
					} else {
						return false;
					}
				});
			},
			Hiden() {
				this.formdata.feedbackIntervalDay='';
				this.formdata.content='';
				this.$parent.$parent.showContinue = false;
				this.$parent.$parent.getReportDetail();
			}
		},
		watch: {}
	}
</script>
<style>
	.el-form-item__label {
		width: 140px !important;
	}

	.el-form-item__content {
		margin-left: 160px !important;
	}

	.el-col-12 {
		line-height: 40px;
	}
</style>
