<template>
	<div>
		<el-form ref="form" style="width:100%;height: 100%;" :rules="rules" :model="data" label-width="100px" label-position="right">
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="任务名称：" prop="title">
						<el-input v-model="data.title"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="类型：" prop="type">
            <el-input v-model="data.type"></el-input>
<!--						<el-select v-model="data.type" placeholder="请选择">

							<el-option v-for="item in typeoptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>-->
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="网址： " prop="website">
						<el-input v-model="data.website" placeholder="请输入网址  "></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="24">
					<el-form-item label="文档上传:">
						<el-upload class="upload-demo" list-type="picture" :on-preview="handlePreview" :action="UpLoadFileUrl" :headers="Headers" :on-success="handleSuccess" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" :limit="6" :on-exceed="handleExceed" :file-list="fileList">
							<el-button size="small" type="primary">点击上传</el-button><label>（若没有网址，上传截图凭证)</label>
							<!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
						</el-upload>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="任务描述： " prop="desc">
						<el-input v-model="data.desc" style="width:360px" type="textarea" :rows="4"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
				</el-col>
			</el-row>
		</el-form>
		<div style="text-align:left; margin-left:100px;">
			<el-button type="primary" @click="addReport()" style="width:130px">保存</el-button>
			<el-button @click="Hiden()" style="width:130px;margin-left:20px">取消</el-button>
		</div>
		<!--点击查看列表图片的模态框-->
		<el-dialog :visible.sync="imgVisible" append-to-body>
			<img :src="imgSrc" />
		</el-dialog>
	</div>
</template>
<script>
	export default {
		props: ['showDialogId'],
		created() {
			this.UpLoadFileUrl = UpLoadFileUrl;
			this.Headers = { 'Authorization': this.getItem("token") };
		},
		mounted() {

		},
		watch: {},
		data() {
			return {
				imgVisible: false,
				imgSrc: '',
				UpLoadFileUrl: '',
				Headers:{},
				data: {
					title: '',
					type: '',
					website: '',
					attachment: '',
					desc: ''
				},
				fileList: [],
				typeoptions: [{
					value: 1,
					label: '本地舆情'
				}, {
					value: 2,
					label: '舆情隐患'
				}, {
					value: 3,
					label: '意识形态'
				}, {
					value: 4,
					label: '其他'
				}],
				rules: {
					title:[{
						required: true,
						message: '事件名称不能为空',
						trigger: 'blur'
					}],
					// type:[{
					// 	required: true,
					// 	message: '类型不能为空',
					// 	trigger: 'blur'
					// }],
//					website:[{
//						required: true,
//						message: '网站不能为空',
//						trigger: 'blur'
//					}],
				}
			}
		},
		methods: {
			//点击列表查看图片
			handlePreview(file) {
				let data = file.url;
				let ext = data.substring(data.lastIndexOf('.'), data.length);
				if(ext == '.png' || ext == '.jpg' || ext == '.jpeg' || ext == '.gif' || ext == '.bmp') {
					this.imgSrc = file.url;
					this.imgVisible = true;
				}

			},
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
						id: response.data.id,
						url: response.data.url
					})
				}
			},
			handleExceed(files, fileList) {
				this.$message.warning("当前限制选择 6 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件");
			},
			beforeAvatarUpload(file) {
				var maxsize = 50 * 1024 * 1024; //30M

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
			addReport(){
				this.$refs['form'].validate((valid) => {
					if(valid) {
						let apiaction=this.data.id==undefined?"reported/lower/create":"reported/lower/modifyReport";
						this.data.attachment=this.formateFilePath();
						this.ajax({
							url: apiaction,
							type: 'post',
							data: this.data,
							success: function(data) {
								this.Hiden();
							}
						});
					} else {
						return false;
					}
				});
			},
			formateFilePath(){
				var ids=[];
				for(var i=0;i<this.fileList.length;i++){
					ids.push(this.fileList[i].id);
				}
				return ids.join(',');
			},
			Hiden() {
				this.data = {
					title: '',
					type: '',
					website: '',
					attachment: '',
					desc: ''
				};
				this.fileList=[];
				this.$parent.$parent.$parent.showadd = false;
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

	/*.el-form-item{
		margin-bottom: 12px;
	}*/
</style>
