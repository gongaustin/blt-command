<template>
	<div>
		<el-form ref="form" style="width:100%;height: 100%;" :rules="rules" :model="data" label-width="100px" label-position="right">
			<el-row :gutter="10">
				<el-col :span="12">
					<el-form-item label="任务名称：" prop="title">
						{{data.title}}
					</el-form-item>
				</el-col>
				<el-col :span="12">
				</el-col>
			</el-row>
			<el-row :gutter="10">
				<el-col :span="24">
					<el-form-item label="文档上传:">
						<el-upload class="upload-demo" :action="UpLoadFileUrl" :headers="Headers" :on-success="handleSuccess" :on-remove="handleRemove" :limit="6" :before-upload="beforeAvatarUpload" :on-exceed="handleExceed" :file-list="fileList">
							<el-button size="small" type="primary">点击上传</el-button>
							<!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
						</el-upload>
					</el-form-item>
				</el-col>
			</el-row>
        <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="填写说明:">
            <label>处置情况请以正式文件形式通过[文档]上传，下方填写内容对结果做简单描述，限50字以内</label>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row :gutter="10">
				<el-col :span="24">
					<el-form-item label="处置内容： " prop="content">
						<el-input v-model="data.content" style="width:480px" type="textarea" maxlength="50" :rows="4"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div style="text-align:left; margin-left:100px;">
			<el-button type="primary" @click="feedbackEmergency()" style="width:130px">确定</el-button>
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
				data: {
					title: '',
					attachment: '',
					content: ''
				},
				fileList: [],
				rules: {
					content: [{
						required: true,
						message: '描述不能为空',
						trigger: 'blur'
					}],
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

				var isJPG = fileSuffix === 'jpg';
				var isJPEG = fileSuffix === 'jpeg';
				var isPNG = fileSuffix === 'png';
				var isGIF = fileSuffix === 'gif';

				var isDOC = fileSuffix === 'doc';
				var isDOCX = fileSuffix === 'docx';

				var isPPT = fileSuffix === 'ppt';
				var isPPTX = fileSuffix === 'pptx';

				var isXLS = fileSuffix === 'xls';
				var isXLSX = fileSuffix === 'xlsx';

				var isPDF = fileSuffix === 'pdf';
				var isTXT = fileSuffix === 'txt';
				var isWPS = fileSuffix === 'wps';
				var isMP3 = fileSuffix === 'mp3';
				var isMP4 = fileSuffix === 'mp4';
				var isMPEG = fileSuffix === 'mpeg';
				var isMPG = fileSuffix === 'mpg';
				var isMPP = fileSuffix === 'mpp';
				var isOGG = fileSuffix === 'ogg';

        var isRAR = fileSuffix === 'rar';
        var isZIP = fileSuffix === 'zip';

				var isLt2M = file.size <= maxsize;
				if(isJPG || isJPEG || isPNG || isGIF || isDOC || isDOCX || isPPT || isPPTX || isXLS || isXLSX || isPDF || isTXT || isWPS || isMP3 || isMP4 || isMPEG || isMPG || isMPP || isOGG || isRAR || isZIP) {

				} else {
					this.$message.error('仅支持.jpg、.ipeg、.png、.gif、.doc、.docx、.ppt、.pptx、.xls、.xlsx、.pdf、.txt、.wps、.mp3、.mp4、.mpeg、.mpg、.mpp、.ogg、.rar、.zip格式！');
				}
				if(!isLt2M) {
					this.$message.error('上传文件不能超过50M！');
				}
				return(isJPG || isJPEG || isPNG || isGIF || isDOC || isDOCX || isPPT || isPPTX || isXLS || isXLSX || isPDF || isTXT || isWPS || isMP3 || isMP4 || isMPEG || isMPG || isMPP || isOGG|| isRAR || isZIP) && isLt2M
			},
			feedbackEmergency() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						let apiaction = this.data.id == undefined ? "emergency/lower/feedback" : "emergency/lower/modify";
						this.data.id = this.data.id == undefined ? this.showDialogId : this.data.id;
						this.data.attachment = this.formateFilePath();
						this.ajax({
							url: apiaction,
							type: 'post',
							data: this.data,
							success: function(data) {
								this.Hiden();
								this.$parent.$parent.getRepeatDetail();
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
				this.data = {
					title: '',
					attachment: '',
					content: ''
				};
				this.fileList = [];
				this.$parent.$parent.showFeedback = false;
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

	.el-checkbox+.el-checkbox {
		margin-left: 15px;
	}

	.el-checkbox {
		margin-left: 15px;
	}
</style>
