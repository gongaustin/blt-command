<template>
	<el-form ref="form" style="width:100%;height: 100%;" :model="formdata" :rules="rules" label-width="100px" label-position="right">
		<el-row :gutter="20">
			<el-col :span="24">
				<el-form-item label="驳回理由：" prop="content">
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
		props: ['detailDialogId'],
		data() {
			return {
				formdata: {
					id:'',
					content: ''
				},
				rules: {
					content: [{
						required: true,
						message: '驳回理由不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			OnSubmit() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						let apiaction=this.formdata.taskId==undefined?"emergency/upper/reject":"emergency/upper/modify";
						this.formdata.id = this.formdata.taskId == undefined ? this.detailDialogId : this.formdata.id;
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
				this.formdata.id='';
				this.formdata.content='';
				this.$parent.$parent.showTurn = false;
				this.$parent.$parent.getRepeatDetail();
			}
		},
		watch: {}
	}
</script>