<template>
	<div>
		<el-form ref="form" style="width:100%;height: 100%;" :rules="rules" :model="data" label-width="100px" label-position="right">
			<el-row :gutter="10">
				<el-col :span="12">
					<el-form-item label="任务名称：" prop="title">
						<el-input v-model="data.title"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
				</el-col>
			</el-row>

			<el-row :gutter="10">
				<el-col :span="12">
					<el-form-item label="严重等级：" prop="level">
						<el-select v-model="data.level" placeholder="请选择">
							<el-option v-for="item in leveloptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="填写说明:">
            <label>处置情况请以正式文件形式通过[文档]上传，下方填写内容对结果做简单描述，限300字以内</label>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="文档上传:">
            <el-upload class="upload-demo" :action="UpLoadFileUrl" :headers="Headers" :on-success="handleSuccess" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" :limit="6" :on-exceed="handleExceed" :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button><label>（若没有网址，上传截图凭证)</label>
              <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

			<el-row :gutter="10">
				<el-col :span="16">
					<el-form-item label="网址： " prop="website">
						<el-input v-model="data.website" placeholder="请输入网址  "></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
				</el-col>
			</el-row>
			<el-row :gutter="10">
				<el-col :span="24">
					<el-form-item label="主办单位： " prop="hostDepartments">
						<el-tag v-for="tag in data.hostDepartments" :key="tag.value" closable @close="handleHostClose(tag)">
							{{tag.label}}（{{tag.interval}}小时）
						</el-tag>
						<el-button class="button-new-tag" size="small" @click="chooseHost">+ 添加</el-button>
					</el-form-item>
				</el-col>
			</el-row>



			<el-row :gutter="10">
				<el-col :span="24">
					<el-form-item label="从办单位： " prop="followDepartments">
						<el-tag v-for="tag in data.followDepartments" :key="tag.value" closable @close="handleFollowClose(tag)">
							{{tag.label}}（{{tag.interval}}小时）
						</el-tag>
						<el-button class="button-new-tag" size="small" @click="chooseFollow">+ 添加</el-button>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="10">
				<el-col :span="24">
					<el-form-item label="任务描述： " prop="desc">
						<el-input v-model="data.desc" style="width:480px" type="textarea" :rows="4"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div style="text-align:left; margin-left:100px;">
			<el-button type="primary" @click="addEmergency()" style="width:130px">保存</el-button>
			<el-button @click="Hiden()" style="width:130px;margin-left:20px">取消</el-button>
		</div>

		<el-dialog title="选择单位" :visible.sync="showChoose" v-model="showChoose" size="800px" append-to-body>
			<choose-dept ref="dept"></choose-dept>
		</el-dialog>
	</div>
</template>
<script>
	import chooseDept from '../../EmergencyCommand/emergencyUpDialog/chooseDept.vue'

	export default {
		components: {
			chooseDept
		},
		created() {
			this.UpLoadFileUrl = UpLoadFileUrl;
			this.Headers = { 'Authorization': this.getItem("token") };
			this.ajax({
				url: "under/upper/getDepts",
				type: 'post',
				success: function(data) {
					for(var i = 0; i < data.length; i++) {
						var options = {
							label: data[i].deptName,
							value: data[i].id
						}
						//this.hostDepartments.push(options);
						//this.followDepartments.push(options);
						this.allDepartments.push(options);

					}
				}
			});
		},
		mounted() {

		},
		watch: {},
		data() {
			return {
				showChoose: false,
//				hostDepartments: [],
//				followDepartments: [],
				allDepartments: [],
				UpLoadFileUrl: '',
				Headers:{},
				data: {
					title: '',
					level: '',
					website: '',
					attachment: '',
					hostDepartments: [],
					followDepartments: [],
					desc: ''
				},
				fileList: [],
				leveloptions: [{
					value: 1,
					label: '一般'
				}, {
					value: 2,
					label: '较大'
				}, {
					value: 3,
					label: '重大'
				}],
				rules: {
					title: [{
						required: true,
						message: '事件名称不能为空',
						trigger: 'blur'
					}],
					level: [{
						required: true,
						message: '类型不能为空',
						trigger: 'blur'
					}],
//					website: [{
//						required: true,
//						message: '网站不能为空',
//						trigger: 'blur'
//					}],
					hostDepartments: [{
						required: true,
						message: '主办单位不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			handleHostClose(tag) {
				var index=0;
				for(var i=0;i<this.data.hostDepartments.length;i++){
					if(this.data.hostDepartments[i].value==tag.value){
						index=i;
					}
				}
				this.data.hostDepartments.splice(index,1);
			},
			handleFollowClose(tag) {
				var index=0;
				for(var i=0;i<this.data.followDepartments.length;i++){
					if(this.data.followDepartments[i].value==tag.value){
						index=i;
					}
				}
				this.data.followDepartments.splice(index,1);
			},
			chooseHost() {
				this.showChoose = true;
				setTimeout(() => {
					this.$refs.dept.type = 1;
					this.$refs.dept.deptOptions = this.filterDept();
				}, 200)

			},
			chooseFollow() {
				this.showChoose = true;
				setTimeout(() => {
					this.$refs.dept.type = 2;
					this.$refs.dept.deptOptions = this.filterDept();
				}, 200)

			},
			filterDept(){
				var tempDepartments=[];
				for(var i = 0; i < this.allDepartments.length; i++) {
					var equl = true;
					for(var j = 0; j < this.data.hostDepartments.length; j++) {
						if(this.allDepartments[i].value == this.data.hostDepartments[j].value) {
							equl = false;
						}
					}
					for(var j = 0; j < this.data.followDepartments.length; j++) {
						if(this.allDepartments[i].value == this.data.followDepartments[j].value) {
							equl = false;
						}
					}
					if(equl) {
						tempDepartments.push(this.allDepartments[i]);
					}
				}
				return tempDepartments;
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
			addEmergency() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						this.data.hostDeptIds = this.splitDept(this.data.hostDepartments);
						this.data.followDeptIds = this.splitDept(this.data.followDepartments);
						//this.data.hostDepartments=[];
						//this.data.followDepartments=[];
						let apiaction=this.data.id==undefined?"emergency/upper/create":"emergency/upper/modifyEmergency";
						if(this.data.status==3){
							apiaction="emergency/reported/convert/emergency"
						}
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
			splitDept(data){
				var result=[];
				for(var i=0;i<data.length;i++){
					result.push(data[i].value+';'+data[i].interval);
				}
				return result.join(',');
			},
			formatedate(time) {
				var d = new Date(time);
				if(!d.getFullYear()) {
					return null;
				}
				return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + '00:00:00';
			},
			Hiden() {
				this.data = {
					title: '',
					level: '',
					website: '',
					attachment: '',
					hostDepartments: [],
					followDepartments: [],
					desc: ''
				};
				this.fileList=[];
				this.$parent.$parent.$parent.showAdd = false;
			}
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

	.el-checkbox+.el-checkbox {
		margin-left: 15px;
	}

	.el-checkbox {
		margin-left: 15px;
	}
</style>
