<template>
	<el-form ref="form" style="width:100%;height: 100%;" :model="formdata" :rules="rules" label-width="100px" label-position="right">
		<el-row :gutter="20">
			<el-col :span="24">
				<el-form-item label="自行处理：" prop="content">
					<el-input v-model="formdata.content" style="width:360px" type="textarea" :rows="4"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
		<el-form-item style="margin-top: 30px">
			<el-button style="width:120px" type="primary" @click="OnSubmit">确定</el-button>
			<el-button style="width:120px" @click="Hiden">取消</el-button>
		</el-form-item>
	</el-form>
</template>
<script>
	export default {
		components: {},
		mounted() {},
		props: ['showDialogId'],
		data() {
			return {
				formdata: {
					content: ''
				},
				rules: {
					content: [{
						required: true,
						message: '处理方式不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			OnSubmit() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						let apiaction=this.formdata.taskId==undefined?"reported/upper/doitself":"reported/upper/modify";
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
				this.formdata.content='';
				this.$parent.$parent.showSelf = false;
				this.$parent.$parent.getReportDetail();
			}
		},
		watch: {}
	}
</script>