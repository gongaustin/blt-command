<template>
	<div class="diglog-info streetEdit projectDialog">
		<el-row>
			<el-col :span="24">
				<my-tooltip text="任务名称"></my-tooltip>
				<span style="font-size: 18px;font-weight: bold;">{{detailData.title}}</span>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="12">
				<my-tooltip text="状态"></my-tooltip>
				<span>{{detailData.statusName}}</span>
			</el-col>
			<el-col :span="12">
				<my-tooltip text="创建时间"></my-tooltip>
				<span>{{detailData.crtTime}}</span>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="12">
				<my-tooltip text="上报单位"></my-tooltip>
				<span>{{detailData.deptName}}</span>
			</el-col>
			<el-col :span="12">
				<my-tooltip text="类型"></my-tooltip>
				<span>{{detailData.typeName}}</span>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<my-tooltip text="网址"></my-tooltip>
				<span>{{detailData.website}}</span>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<my-tooltip text="佐证材料"></my-tooltip>
				<a style="color: #57a3f3;" href="javascript:;" v-for="item in detailData.attachments" @click="downloadFile(item.url)">{{item.fileName}};</a>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<my-tooltip text="描述"></my-tooltip>
				<span>{{detailData.desc}}</span>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<my-tooltip text="审核流程"></my-tooltip>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<el-table :data="tableData" style="width: 100%" border>
					<el-table-column type="index" label="序号" width="60" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="contentName" label="描述" min-width="25%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="optTypeName" label="处理" min-width="10%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="crtTime" label="时间" min-width="20%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="attachments" label="佐证材料" min-width="25%" show-overflow-tooltip>
						<template slot-scope="row">
							<a style="color: #57a3f3;" href="javascript:;" v-for="item in row.row.attachments" @click="downloadFile(item.url)">{{item.fileName}};</a>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="操作" show-overflow-tooltip min-width="15%">
						<template slot-scope="row" v-if="moidfyVisible(row)">
							<el-button @click="modify(row)" type="text" size="small">
								修改
							</el-button>
							<el-button @click="cancel(row)" type="text" size="small">
								撤销
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
		</el-row>
		<div style="text-align:left; margin-left:30px;">
			<el-button v-show="continueVisible" size="small" type="primary" @click="continueFollowUp" style="width:80px">持续跟进</el-button>
			<el-button v-show="handleVisible" size="small" type="primary" @click="dealSelf" style="width:80px;margin-left:10px">自行处理</el-button>
			<el-button v-show="finsihVisible" size="small" type="primary" @click="finishHandle" style="width:80px;margin-left:10px">办结</el-button>
			<!--<el-button v-show="commandVisible" size="small" type="danger" @click="emergencyCommand" style="width:80px;margin-left:10px">应急指挥</el-button>-->
		</div>

		<el-dialog title="持续跟进" :visible.sync="showContinue" v-model="showContinue" size="400px" append-to-body>
			<continue-update ref="continue" :showDialogId="showDialogId"></continue-update>
		</el-dialog>
		<el-dialog title="自行处理" :visible.sync="showSelf" v-model="showSelf" size="400px" append-to-body>
			<handle-self ref="handle" :showDialogId="showDialogId"></handle-self>
		</el-dialog>
		<el-dialog title="办结" :visible.sync="showFinish" v-model="showFinish" size="400px" append-to-body>
			<finish-report ref="finish" :showDialogId="showDialogId"></finish-report>
		</el-dialog>
	</div>
</template>
<script>
	import continueUpdate from '../../EmergencyCommand/reportUpDialog/continueUpdate.vue'
	import handleSelf from '../../EmergencyCommand/reportUpDialog/handleSelf.vue'
	import finishReport from '../../EmergencyCommand/reportUpDialog/finishReport.vue'

	export default {
		props: ['showDialogId'],
		components: {
			continueUpdate,
			handleSelf,
			finishReport
		},
		created() {
			this.UpLoadFileUrl = UpLoadFileUrl;
		},
		mounted() {

		},
		watch: {
			dialogVisible(val) {
				this.$emit('update:showDialog', val)
			}
		},
		data() {
			return {
				dialogVisible: false,
				tableData: [],
				detailData: {},
				showContinue: false,
				showSelf: false,
				showFinish: false,
				continueVisible: true,
				handleVisible: true,
				finsihVisible: true,
				commandVisible: true
			}
		},
		methods: {
			getReportDetail() {
				this.ajax({
					url: 'reported/upper/query/detail',
					type: 'get',
					data: {
						id: this.showDialogId
					}
				}).then(data => {
					this.tableData = this.formateProcessData(data.process);
					this.detailData = this.formateDetailData(data.detail);
//					if(status && status == 3) {
//						this.finishChecked();
//					}
				})
			},
			formateProcessData(data) {
				for(var i = 0; i < data.length; i++) {
					data[i].contentName = data[i].content;
					switch(data[i].optType) {
						case 1:
							data[i].optTypeName = '处置';
							break;
						case 2:
							data[i].optTypeName = '驳回';
							break;
						case 3:
							data[i].optTypeName = '持续跟进';
							data[i].contentName = '处置的时间每隔' + data[i].feedbackIntervalDay + '天，直至办结。' + data[i].content;
							break;
						case 4:
							data[i].optTypeName = '自行处理';
							break;
						case 5:
							data[i].optTypeName = '办结';
							break;
					}
				}
				return data;
			},
			formateDetailData(data) {
				if(data.status == 0) {
					this.unChecked();
					data.statusName = '未审核';
				} else if(data.status == 1) {
					this.haveChecked();
					data.statusName = '已审核';
				} else if(data.status == 2) {
					this.finishChecked();
					data.statusName = '办结';
				}else if(data.status == 3) {
					this.finishChecked();
					data.statusName = '待分派';
				}
				if(data.type == 1) {
					data.typeName = '本地舆情';
				} else if(data.type == 2) {
					data.typeName = '舆情隐患';
				} else if(data.type == 3) {
					data.typeName = '意识形态';
				} else {
					data.typeName = data.type;
				}
				return data;
			},
			unChecked() { //未审核显示按钮组
				this.continueVisible = true;
				this.handleVisible = true;
				this.finsihVisible = true;
				this.commandVisible = true;
			},
			haveChecked() { //已审核显示按钮组
				this.continueVisible = false;
				this.handleVisible = false;
				this.finsihVisible = true;
				this.commandVisible = true;
			},
			finishChecked() { //已办结显示按钮组
				this.continueVisible = false;
				this.handleVisible = false;
				this.finsihVisible = false;
				this.commandVisible = false;
			},
			continueFollowUp() { //持续跟进

				this.showContinue = true;
				setTimeout(() => {
					this.$refs.continue.formdata = {
						feedbackIntervalDay: '',
						desc: ''
					};
				}, 200);
			},
			dealSelf() { //自行处理
				this.showSelf = true;
				setTimeout(() => {
					this.$refs.handle.formdata = {
						content: '',
					};
				}, 200);
			},
			finishHandle() { //办结
				this.showFinish = true;
			},
			emergencyCommand() {
				this.$confirm('确定转为应急指挥？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.ajax({
						url: 'reported/convet/emergency',
						type: 'post',
						data: {
							id: this.showDialogId
						},
						success: function(data) {
							//							this.$router.push({path:'/emergency/emergency-up',query:data});
							this.$parent.hide();
						}
					});

				}).catch(() => {

				});
			},
			moidfyVisible(row) { //操作按钮是否显示
				if(!this.continueVisible && !this.handleVisible && !this.finsihVisible && !this.commandVisible) {
					return false;
				}

				if(row.$index == this.tableData.length - 1) {
					if(this.detailData.status == 1) {
						return true;
					}
				}
				return false;
			},
			modify(row) { //修改审核
				switch(row.row.optType) {
					case 3:
						this.showContinue = true;
						setTimeout(() => {
							this.$refs.continue.formdata = row.row;
						}, 200);
						break;
					case 4:
						this.showSelf = true;
						setTimeout(() => {
							this.$refs.handle.formdata = row.row;
						}, 200);
						break;
				}
			},
			cancel(row) { //撤销审核
				this.$confirm('是否撤销审核？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.ajax({
						url: 'reported/upper/cancel',
						type: 'post',
						data: {
							id: row.row.id
						},
						success: function(data) {
							this.getReportDetail();
						}
					});
				}).catch(() => {

				});
			}
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

	.el-button--primary {
		margin-top: 20px;
	}
	/*.el-form-item{
		margin-bottom: 12px;
	}*/

	.el-table--fit {
		width: 94% !important;
		margin-left:3%;
	}

	.mycontainer {
		height: 600px;
		overflow-y: auto;
	}

	.el-col-24 {
		line-height: 36px;
	}

	.el-col-12 {
		line-height: 36px;
	}
</style>
