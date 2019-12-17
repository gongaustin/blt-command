<template>
	<el-form ref="form" :model="formdata" style="width:100%;height: 100%;" label-width="100px" label-position="right">
		<el-row :gutter="20">
			<el-col :span="24">
				<div class="block">
					<el-form-item label="综合评分：">
            <el-input-number v-model="formdata.grade" placeholder="请输入分数(0-100)" :max="100" :min="0"></el-input-number>
					</el-form-item>
				</div>
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
					grade: 100,
				}
			}
		},
		methods: {
			OnSubmit() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						var data={
							id:this.detailDialogId,
							score:this.formdata.grade
						}
						this.ajax({
							url: "emergency/upper/end",
							type: 'post',
							data: data,
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
				this.ClearData();
				this.$parent.$parent.showFinish = false;
				this.$parent.$parent.getRepeatDetail();
			},
			ClearData() {
				this.formdata.grade = 100;
			}
		},
		watch: {}
	}
</script>
<style>
	.el-rate__icon{
		font-size: 36px !important;
	}
</style>
