<template>
	<div>
		<el-form ref="form" style="width:100%;height: 100%;" :rules="rules" :model="data" label-width="100px" label-position="right">
			<el-row :gutter="10">
				<el-col :span="12">
					<el-form-item label="舆情标题：" prop="title">
						<el-input v-model="data.title"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
				</el-col>
			</el-row>

			<!--<el-row :gutter="10">
				<el-col :span="12">
					<el-form-item label="类型：" prop="type">
						<el-input v-model="data.type"></el-input>
					</el-form-item>
				</el-col>
			</el-row>-->
			<!--单选事件类型-->
			<el-row :gutter="10">
				<el-form-item label="应急与否：" prop="isEmr">
					<el-col :span="24">
						<el-radio-group v-model="isEmr">
							<el-radio :label='1'>应急事件</el-radio>
							<el-radio :label='0'>非应急事件</el-radio>
						</el-radio-group>
					</el-col>
				</el-form-item>
			</el-row>

			<el-row :gutter="10">
				<el-col :span="16">
					<el-form-item label="网址： " prop="website">
						<el-input v-model="data.website" type="textarea" :rows="2" placeholder="请输入网址,多个网址请换行隔开  "></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
				</el-col>
			</el-row>
			<el-row :gutter="10">
				<el-col :span="8">
					<el-form-item label="开始时间：" prop="startTime">
						<div class="block">
							<el-date-picker v-model="data.startTime" type="datetime" placeholder="选择开始时间" style="width: 100%;" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
							</el-date-picker>
						</div>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="结束时间：" prop="endTime">
						<div class="block">
							<el-date-picker v-model="data.endTime" type="datetime" placeholder="选择结束时间" style="width: 100%;" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
							</el-date-picker>
						</div>
					</el-form-item>
				</el-col>
			</el-row>

			<!--单选事件类型-->
			<el-row :gutter="10">
				<el-form-item label="添加方式：" prop="way">
					<el-col :span="24">
						<el-radio-group v-model="way">
							<el-radio :label='1'>选择</el-radio>
							<el-radio :label='0'>手填</el-radio>
						</el-radio-group>
					</el-col>
				</el-form-item>
			</el-row>

			<!--选择添加-->
			<el-row v-show="way == 1" :gutter="10">
				<el-form-item label="事件类型：" prop="eventId">
					<el-col :span="12">
						<el-button type="primary" @click="addEvent()" style="float:left;margin-right:20px;width:120px">点击选择</el-button><el-tag v-show="data.type != ''" style="height: 40px; line-height: 40px;" closable @close="handleTypeClose(tag)">{{data.type}}</el-tag>
					</el-col>
				</el-form-item>
			</el-row>
			<!--手动添加-->
			<el-row v-show="way == 0" :gutter="10">
				<el-form-item label="事件类型：" prop="type">
					<el-col :span="12">
						<el-input v-model="data.type" ></el-input>
					</el-col>
				</el-form-item>
			</el-row>
      <el-row :gutter="10">
        <el-col :span="24">

          <el-form-item label ="" >
            <label>----------------请选择参与单位----------------</label>
          </el-form-item>

        </el-col>
      </el-row>
			<el-row :gutter="10">
				<el-col :span="24">
					<el-form-item label="街道/镇： " prop="deptIds">
						<!-- 添加镇（街道）按钮 -->
						<el-button type="primary" @click="addTown()" style="float:left;margin-right:20px;width:120px">点击选择</el-button>
               <el-tag class="tagClass" v-for="(tag,index) in townSelectedAll" :key="index" closable @close="handleTownClose(tag)" :type="tag.value">
               {{tag.label}}
            </el-tag>
               <el-button v-if="townSelectedAll.length>0" @click="clearTownAll" plain>全部删除</el-button>
            <!--            <el-tag v-show="townIdAll.id != ''" v-for="item in data" v-bind:value="item.id" style="height: 40px; line-height: 40px;">{{item.deptName}}</el-tag>-->
<!--						<el-button type="primary" @click="addCity()" style="float:left;margin-right:20px;width:120px">添加市级单位</el-button>-->

						<!--市级各部门-->
						<!--<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChangeDept">全选：市级各部门</el-checkbox>-->
						<!--<el-checkbox-group v-model="data.deptIds" @change="handleCheckAllChangeDept">-->
						<!--<el-checkbox v-for="item in departments" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>-->
						<!--</el-checkbox-group>-->
					</el-form-item>
				</el-col>
			</el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="市级单位： " prop="deptIds">
            <!-- 添加镇（街道）按钮 -->
            <el-button type="primary" @click="addCity()" style="float:left;margin-right:20px;width:120px">点击选择</el-button>
               <el-tag class="tagClass" v-for="(tag,index) in citySelectedAll" :key="index" closable @close="handleCityClose(tag)" :type="tag.value">
               {{tag.label}}
          </el-tag>
               <el-button v-if="citySelectedAll.length>0" @click="clearCityAll" plain>全部删除</el-button>
<!--            <el-tag v-show="cityIdAll.id != ''" v-for="item in data" v-bind:value="cityIdAll.id" style="height: 40px; line-height: 40px;">{{item.deptName}}</el-tag>-->

            <!--市级各部门-->
            <!--<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChangeDept">全选：市级各部门</el-checkbox>-->
            <!--<el-checkbox-group v-model="data.deptIds" @change="handleCheckAllChangeDept">-->
            <!--<el-checkbox v-for="item in departments" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>-->
            <!--</el-checkbox-group>-->
          </el-form-item>
        </el-col>
      </el-row>
			<el-row :gutter="10">
				<el-col :span="16">
					<el-form-item label="任务描述： " prop="desc">
						<el-input v-model="data.desc" type="textarea" :rows="2"></el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="10">
				<el-col :span="24">
					<el-form-item label="附件:">
						<el-upload class="upload-demo" list-type="picture" :on-preview="handlePreview" :action="UpLoadFileUrl" :headers="Headers" :on-success="handleSuccess" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" :limit="6" :on-exceed="handleExceed" :file-list="fileList">
							<el-button size="small" type="primary">点击上传</el-button><label>（若没有网址，上传截图凭证)</label>
							<!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
						</el-upload>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div style="text-align:left; margin-left:160px;">
			<el-button type="primary" @click="addRepeat()" style="width:130px">确定派件</el-button>
			<el-button @click="Hiden()" style="width:130px; margin-left:20px">取消</el-button>
		</div>
		<!-- 添加事件类型的模态框 -->
		<el-dialog title="选择事件类型" :visible.sync="showEvent" v-model="showEvent" size="600px" append-to-body>
			<el-tree onselectstart="return false" :data="eventList" :props="defaultProps" @node-click="eventNodeClick"></el-tree>
			<div class="town-footer">
				<el-button @click="eventSave()" type="primary" style="width:130px">确定</el-button>
				<el-button @click="eventHide()" style="width:130px;margin-left:20px">取消</el-button>
			</div>
		</el-dialog>
		<!-- 添加镇（街道）的模态框 -->
		<el-dialog title="添加镇（街道）" :visible.sync="showTown" v-model="showTown" size="600px" append-to-body>
			<div style="text-align:left;">
				<el-checkbox :indeterminate="isIndeterminateTown" v-model="checkAllTown" @change="handleCheckAllTownChange">全选</el-checkbox>
				<el-checkbox-group v-model="townIdAll" @change="handleCheckedTownChange">
          <el-checkbox style="vertical-align:middle;align-content:center;width:25%" v-for="(item,index) in townData" :key="index" :label="item.value"><h4>{{item.label}}</h4></el-checkbox>
				</el-checkbox-group>
				</div>
		</el-dialog>
		<!-- 添加市级单位的模态框 -->
		<el-dialog title="添加市级单位" :visible.sync="showCity" v-model="showCity" size="600px" append-to-body>
			<div style="text-align:left;">
				<el-checkbox :indeterminate="isIndeterminateCity" v-model="checkAllCity" @change="handleCheckAllCityChange">全选</el-checkbox>
				<el-checkbox-group v-model="cityIdAll" @change="handleCheckedCityChange">
          <el-checkbox style="vertical-align:middle;align-content:center;width:25%" v-for="item in cityData" :key="item.value" :label="item.value"><h4>{{item.label}}</h4></el-checkbox>
				</el-checkbox-group>
				<!--<div class="town-footer">
					<el-button @click="citySave()" type="primary" style="width:130px">保存</el-button>
					<el-button @click="cityHide()" style="width:130px;margin-left:20px">取消</el-button>
				</div>-->
			</div>
		</el-dialog>
		<!--点击查看列表图片的模态框-->
		<el-dialog :visible.sync="imgVisible" append-to-body>
			<img :src="imgSrc" />
		</el-dialog>
	</div>
</template>
<script>
	export default {
		created() {
			this.UpLoadFileUrl = UpLoadFileUrl;
			this.Headers = {
				'Authorization': this.getItem("token")
			};
		},
		mounted() {

		},
		data() {
			return {
				imgSrc: '',
				imgVisible: false,
				// 镇街道
				checkAllTown: false,
				townData: [],
        tempTown: {
              checkboxGroup5: [], //选择的城镇单位
        },
        detailTownData: [],
				townId: [],
				showTown: false,
				isIndeterminateTown: true,
				townIdAll: [],
        townSelectedAll: [],
				// 市级单位
				checkAllCity: false,
				cityData: [],
        tempCity: {
              checkboxGroup5: [], //选择的市级单位
          },
        detailCityData: [],
				cityId: [],
				showCity: false,
				isIndeterminateCity: true,
				cityIdAll: [],
        citySelectedAll: [],
				UpLoadFileUrl: '',
				Headers: {},
				//事件类型显示隐藏
				showEvent: false,
				//事件类型树节点
				eventList: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				//表单
				isEmr: 0,
				way: 1,
				data: {
					title: '',
					type: '',
					website: '',
					startTime: '',
					attachment: '',
					endTime: '',
					deptIds: [],
					isEmr: null,
					desc: '',
					eventId: null,
				},
				fileList: [],
				typeoptions: [{
					value: 1,
					label: '舆论引导'
				}, {
					value: 2,
					label: '网络评论'
				}, {
					value: 3,
					label: '处置情况'
				}, {
					value: 4,
					label: '其他'
				}],
				rules: {
					title: [{
						required: true,
						message: '舆情标题不能为空',
						trigger: 'blur'
					}],
					// type: [{
					// 	required: true,
					// 	message: '类型不能为空',
					// 	trigger: 'blur'
					// }],
					//					website: [{
					//						required: true,
					//						message: '网站不能为空',
					//						trigger: 'blur'
					//					}],
					startTime: [{
						required: true,
						message: '开始时间不能为空',
						trigger: 'blur'
					}],
					endTime: [{
						required: true,
						message: '结束时间不能为空',
						trigger: 'blur'
					}]
					// deptIds: [{
					// 	required: true,
					// 	message: '参与者不能为空',
					// 	trigger: 'blur'
					// }]
				},
				pickerBeginDateBefore: {
					disabledDate: (time) => {
						let beginDateVal = this.data.endTime;
						if(beginDateVal) {
							return time.getTime() > beginDateVal;
						}
					}
				},
				pickerBeginDateAfter: {
					disabledDate: (time) => {
						let beginDateVal = this.data.startTime;
						if(beginDateVal) {
							return time.getTime() < beginDateVal;
						}
					}
				},
			}
		},
		methods: {
			//点击列表查看图片
			handlePreview(file) {
				console.log(file)
				let data = file.url;
				let ext = data.substring(data.lastIndexOf('.'));
				if(ext == '.png' || ext == '.jpg' || ext == '.jpeg' || ext == '.gif' || ext == '.bmp') {
					this.imgSrc = file.url;
					this.imgVisible = true;
				}

			},
			//添加舆情事件获取数据
			addEvent() {
				this.ajax({
					url: "under/selectMattersType",
					type: 'get',
					dataType: 'json',
					success: function(data) {
						this.eventList = data;
					}
				});
				this.showEvent = true;
			},
			//事件类型节点的点击回调
			eventNodeClick(data) {
				if(data.level == 2) {
					this.data.eventId = data.id
					this.data.type = data.label;
				}
			},
			eventSave() {
				this.showEvent = false;
			},
			eventHide() {
				this.data.eventId = null;
				this.showEvent = false;
			},
			// 镇街道
			addTown() {
				this.ajax({
					url: "under/upper/getDepts",
					type: 'post',
					data: {
						nature: 0
					},
					success: function(data) {
						console.log(data)
						this.townData = [];
						this.townId = [];
						for(var i = 0; i < data.length; i++) {
							this.townData.push({
								label: data[i].deptName,
								value: data[i].id
							})
							this.townId.push(data[i].id)
						}

					}
				});
				this.showTown = true;
			},
			handleCheckAllTownChange(val) {
				this.townIdAll = val ? this.townId : [];
				this.townSelectedAll = val ? this.townData : [];
				this.isIndeterminateTown = false;
			},
			handleCheckedTownChange(value) {
			  this.townSelectedAll = [];
				this.townIdAll = value;
          this.townIdAll.forEach(item => {
              this.townData.forEach(itemSecond => {
                  if (item === itemSecond.value) {
                      this.townSelectedAll.push(itemSecond)
                  }
              })
          })

        let tempTownSelected = this.delRepeat(this.townSelectedAll);
        this.townSelectedAll = tempTownSelected;
				let checkedCount = value.length;
				this.checkAllTown = checkedCount === this.townId.length;
				this.isIndeterminateTown = checkedCount > 0 && checkedCount < this.townId.length;
			},
//			townSave() {
//				this.showTown = false;
//			},
//			townHide() {
//				this.townIdAll = [];
//				this.showTown = false;
//			},
			// 市级单位
			addCity() {
				this.ajax({
					url: "under/upper/getDepts",
					type: 'post',
					data: {
						nature: 1
					},
					success: function(data) {
						console.log(data)
						this.cityData = [];
						this.cityId = [];
						for(var i = 0; i < data.length; i++) {
							this.cityData.push({
								label: data[i].deptName,
								value: data[i].id
							})
							this.cityId.push(data[i].id)
						}
					}
				});
				this.showCity = true;
			},
			handleCheckAllCityChange(val) {
				this.cityIdAll = val ? this.cityId : [];
				this.citySelectedAll = val ? this.cityData : [];
				this.isIndeterminateCity = false;
			},
			handleCheckedCityChange(value) {
			  this.citySelectedAll = [];
				this.cityIdAll = value;
          this.cityIdAll.forEach(item => {
              this.cityData.forEach(itemSecond => {
                  if (item === itemSecond.value) {
                      this.citySelectedAll.push(itemSecond)
                  }
              })
          })
          let tempCitySelected = this.delRepeat(this.citySelectedAll);
          this.citySelectedAll = tempCitySelected;
				// console.log(value)
				let checkedCount = value.length;
				this.checkAllCity = checkedCount === this.cityId.length;
				this.isIndeterminateCity = checkedCount > 0 && checkedCount < this.cityId.length;
			},
//			citySave() {
//				this.showCity = false;
//			},
//			cityHide() {
//				this.cityIdAll = [];
//				this.showCity = false;
//			},
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
				var maxsize = 50 * 1024 * 1024; //20M

				var fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);

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
			addRepeat() {
				let that = this;
				this.$refs['form'].validate((valid) => {
					if(valid) {
						let town = [];
						let city = [];
						let townTotal = [];
						let cityTotal = [];
						let apiaction = this.data.id == undefined ? "under/upper/create" : "under/upper/modifyUnder";
						console.log(this.townIdAll,this.cityIdAll)

						this.townData.map(item => {
							townTotal.push(item.value);
						})
						for(var j = 0; j < that.townIdAll.length; j++) {
							if(townTotal.indexOf(that.townIdAll[j].value) != -1 ) {
								town.push(that.townIdAll[j])
								that.townIdAll = town;
							}
						}
						console.log(townTotal)
						this.cityData.map(item => {
							cityTotal.push(item.value);
						})

						for(var j = 0; j < that.cityIdAll.length; j++) {
							if(cityTotal.indexOf(that.cityIdAll[j].value) != -1) {
								town.push(that.cityIdAll[j])
								that.cityIdAll = city;
							}
						}
						console.log(cityTotal)
						let ids = this.townIdAll.concat(this.cityIdAll)
//						ids = Array.from(new Set(ids))
						console.log(ids)
						this.data.deptIds = ids;
						let dataId = [];
						let attachmentId = that.fileList;
						attachmentId.map(item => {
							dataId.push(item.id);
						})
						this.data.attachment = dataId.join(',');
						this.data.isEmr = this.isEmr;
						this.ajax({
							url: apiaction,
							type: 'post',
							data: this.data,
							traditional: true,
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
					type: '',
					website: '',
					startTime: '',
					attachment:'',
					endTime: '',
					deptIds: [],
					desc: '',
					isEmr: null,
					eventId: null
				};
				this.isEmr = 0;
				this.townIdAll = [];
				this.cityIdAll = [];
				this.fileList = [];
				this.$parent.$parent.$parent.showAdd = false;
			},
// tag使用

        clearTownAll() { //全部清空数据
			      this.townIdAll = []
            this.townSelectedAll = []
            this.tempTown.checkboxGroup5 = []
        },

        clearCityAll() { //全部清空数据
            this.cityIdAll = []
            this.citySelectedAll = []
            this.tempCity.checkboxGroup5 = []
        },
        // 数组去重
        delRepeat(arr) { //数组对象去重
            return Object.values(
                arr.reduce((obj, next) => {
                    var key = JSON.stringify(next);
                    return (obj[key] = next), obj;
                }, {}),
            );
			},
        handleTownClose(tag)
        {
          let changeTownTags = this.townSelectedAll;
          this.townSelectedAll = changeTownTags.filter(item => {
              if(tag.value != item.value){
                  return true;
              }
          })
          this.townIdAll = this.townSelectedAll.map(e => e.value);
        },
        handleCityClose(tag)
        {
            let changeCityTags = this.citySelectedAll;
            this.citySelectedAll = changeCityTags.filter(item => {
                if(tag.value != item.value){
                    return true;
                }
            })
            this.cityIdAll = this.citySelectedAll.map(e => e.value);
        },
        handleTypeClose(tag){
            this.data.eventId = null;
            this.data.type = '';
        }
		},


		components: {

		},


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

	.town-footer {
		margin-top: 20px;
	}


  /*tag使用*/
  .tempArea {
    /*width: 100%;*/
  }
  .tagClass{
    margin-right: 10px;
  }



</style>
