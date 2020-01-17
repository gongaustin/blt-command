<template>
	<div>
		<el-form ref="form" style="width:100%;height: 100%;" :rules="rules" :model="formdata" label-width="100px" label-position="right">
			<!--<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="任务名称：" prop="title">
						<el-input v-model="data.title"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
				</el-col>
			</el-row>-->
			<el-row :gutter="20">
				<el-col :span="24">
					<el-form-item label="文档上传:">
						<el-upload class="upload-demo" :action="UpLoadFileUrl" :headers="Headers" :on-success="handleSuccess" :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :limit="6" :on-exceed="handleExceed" :file-list="fileList">
							<el-button size="small" type="primary">点击上传</el-button>
							<!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
						</el-upload>
					</el-form-item>
				</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="填写说明:">
            <label>处置情况请以正式文件形式通过[文档]上传，下方填写内容对结果做简单描述，限300字以内</label>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="处置内容： " prop="content">
						<el-input v-model="formdata.content" style="width:360px" type="textarea" :rows="4"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
				</el-col>
			</el-row>
		</el-form>
		<div style="text-align:left; margin-left:100px;">
			<el-button type="primary" @click="feedbackReport()" style="width:130px">保存</el-button>
			<el-button @click="Hiden()" style="width:130px;margin-left:20px">取消</el-button>
		</div>
	</div>
</template>
<script>
	export default {
		props: ['showDialogId'],
		created() {
			this.UpLoadFileUrl = UpLoadFileUrl;
			this.Headers = {
				'Authorization': this.getItem("token")
			};
		},
		mounted() {

		},
		watch: {},
		data() {
			return {
				UpLoadFileUrl: '',
				Headers: {},
				formdata: {
					content: '',
					attachment: ''
				},
				fileList: [],
				rules: {
					content: [{
						required: true,
						message: '处置内容不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			handleRemove(file, fileList) {
				if(file.status == 'success') {
					for(var i = 0; i < this.fileList.length; i++) {
						if(this.fileList[i].name == file.name) {
							this.fileList.splice(i, 1);
						}
					}
				}
			},
			handleSuccess(response, file, fileList) {
				if(response.code == 200) {
					this.fileList.push({
						name: response.data.fileName,
						id: response.data.id
					})
				}
			},
			handleExceed(files, fileList) {
				this.$message.warning("当前限制选择 6 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件");
			},
			beforeAvatarUpload(file) {
				var maxsize = 50 * 1024 * 1024; //20M

				var fileSuffix=file.name.substring(file.name.lastIndexOf('.')+1);

				const isJPG = fileSuffix === 'jpg';
				const isJPEG = fileSuffix === 'jpeg';
				const isPNG = fileSuffix === 'png';
				const isGIF = fileSuffix === 'gif';

				const isDOC = fileSuffix === 'doc';
				const isDOCX = fileSuffix === 'docx';

				const isPPT = fileSuffix === 'ppt';
				const isPPTX = fileSuffix === 'pptx';

				const isXLS = fileSuffix === 'xls';
				const isXLSX = fileSuffix === 'xlsx';

				const isPDF = fileSuffix === 'pdf';
				const isTXT = fileSuffix === 'txt';
				const isWPS = fileSuffix === 'wps';
				const isMP3 = fileSuffix === 'mp3';
				const isMP4 = fileSuffix === 'mp4';
				const isMPEG = fileSuffix === 'mpeg';
				const isMPG = fileSuffix === 'mpg';
				const isMPP = fileSuffix === 'mpp';
				const isOGG = fileSuffix === 'ogg';

        const isRAR = fileSuffix === 'rar';
        const isZIP = fileSuffix === 'zip';

				const isLt2M = file.size <= maxsize;
				if(isJPG || isJPEG || isPNG || isGIF || isDOC || isDOCX || isPPT || isPPTX || isXLS || isXLSX || isPDF || isTXT || isWPS || isMP3 || isMP4 || isMPEG || isMPG || isMPP || isOGG || isRAR || isZIP) {

				} else {
					this.$message.error('仅支持.jpg、.ipeg、.png、.gif、.doc、.docx、.ppt、.pptx、.xls、.xlsx、.pdf、.txt、.wps、.mp3、.mp4、.mpeg、.mpg、.mpp、.ogg、.rar、.zip格式！');
				}
				if(!isLt2M) {
					this.$message.error('上传文件不能超过50M！');
				}
				return(isJPG || isJPEG || isPNG || isGIF || isDOC || isDOCX || isPPT || isPPTX || isXLS || isXLSX || isPDF || isTXT || isWPS || isMP3 || isMP4 || isMPEG || isMPG || isMPP || isOGG || isRAR || isZIP) && isLt2M
			},
			feedbackReport() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						let apiaction = this.formdata.taskId == undefined ? "reported/lower/feedback" : "reported/lower/modify";
						this.formdata.id = this.formdata.taskId == undefined ? this.showDialogId : this.formdata.id;
						this.formdata.attachment = this.formateFilePath();
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
			formateFilePath() {
				var ids = [];
				for(var i = 0; i < this.fileList.length; i++) {
					ids.push(this.fileList[i].id);
				}
				return ids.join(',');
			},
			Hiden() {
				this.formdata={
					content: '',
					attachment: ''
				};
				this.fileList= [];
				this.$parent.$parent.showFeedback = false;
				this.$parent.$parent.getReportDetail();
			}
		},
		components: {

		}
	}
</script>
<style lang="less">
	.streetEdit .el-form-item__error {
		top: 35px;
		left: 100px;
	}

	.streetEdit .el-form-item {
		min-height: 50px;
		margin-bottom: 5px;
	}
</style>
<style scoped lang="less">
	.zui-noFloat .el-col {
		float: none;
		display: inline-block;
		margin-right: -4px;
		vertical-align: top;
	}

	.projectDialog .desc-input {
		width: 60%;
		float: left;
	}

	.wheel-container {
		height: 450px;
		overflow-y: scroll;
		overflow-x: hidden;
	}

	/*.el-button--primary {
		margin-top: 20px;
	}*/
</style>
