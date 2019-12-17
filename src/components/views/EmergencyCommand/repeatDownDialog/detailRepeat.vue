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
				<my-tooltip text="类型"></my-tooltip>
				<span>{{detailData.typeName}}</span>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="12">
				<my-tooltip text="开始时间"></my-tooltip>
				<span>{{detailData.startTime}}</span>
			</el-col>
			<el-col :span="12">
				<my-tooltip text="结束时间"></my-tooltip>
				<span>{{detailData.endTime}}</span>
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
				<my-tooltip text="参与单位"></my-tooltip>
				<span>{{detailData.joinDeptName}}</span>
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
					<el-table-column prop="content" label="描述" min-width="20%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="optTypeName" label="处理" min-width="7%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="uname" label="用户名" min-width="11%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="website" label="网址" min-width="12%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="crtTime" label="时间" min-width="18%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="attachments" label="佐证材料" min-width="20%" show-overflow-tooltip>
						<template slot-scope="row">
							<a style="color: #57a3f3;" href="javascript:;" v-for="item in row.row.attachments" @click="downloadFile(item.url)">{{item.fileName}};</a>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" min-width="12%">
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
			<el-button v-show="backVisible" size="small" type="primary" @click="feedBack" style="width:80px">处置</el-button>
		</div>

		<el-dialog title="下派处置" :visible.sync="showFeedback" v-model="showFeedback" size="400px" append-to-body>
			<feedback-repeat ref="feedback" :showDialogId="showDialogId"></feedback-repeat>
		</el-dialog>
	</div>
</template>
<script>
	import feedbackRepeat from '../../EmergencyCommand/repeatDownDialog/feedbackRepeat.vue'

	export default {
		props: ['showDialogId'],
		components: {
			feedbackRepeat
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
				detailDialogId: '',
				showFeedback: false,
				backVisible: true
			}
		},
		methods: {
			getRepeatDetail() {
				this.ajax({
					url: 'under/lower/query/detail',
					type: 'get',
					data: {
						id: this.showDialogId
					}
				}).then(data => {
					this.tableData = this.formateProcessData(data.process);
					this.detailData = this.formateDetailData(data.detail);
				})
			},
			formateProcessData(data) {
				for(var i = 0; i < data.length; i++) {
					switch(data[i].optType) {
						case 1:
							data[i].optTypeName = '处置';
							break;
						case 2:
							data[i].optTypeName = '驳回';
							break;
						case 3:
							data[i].optTypeName = '持续跟进';
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
					this.backVisible = false;
					data.statusName = '未审核';
				} else if(data.status == 1) {
					this.backVisible = true;
					data.statusName = '待处理';
				} else if(data.status == 2) {
					this.backVisible = false;
					data.statusName = '办结';
				}
				if(data.type == 1) {
					data.typeName = '舆论引导';
				} else if(data.type == 2) {
					data.typeName = '网络评论';
				} else if(data.type == 3) {
					data.typeName = '处置情况';
				} else {
					data.typeName = data.type;
				}
				return data;
			},
			feedBack() { //
				this.showFeedback = true;
				setTimeout(() => {
					this.$refs.feedback.data = {
						title: this.detailData.title,
						uname: '',
						website: '',
						attachment: '',
						content: ''
					};
				}, 200);
			},
			moidfyVisible(row) { //操作按钮是否显示
				if(row.$index == this.tableData.length - 1) {
					if(row.row.optType == 1) {
						return true;
					}
				}
				return false;
			},
			modify(row) { //修改审核
				this.showFeedback = true;
				setTimeout(() => {

					this.ajax({
						url: 'under/reply/detail',
						type: 'post',
						data: {
							id: row.row.id
						},
						success: function(data) {
							this.$refs.feedback.fileList=this.filterFilelist(data.attachments);
							data.title = this.detailData.title;
							this.$refs.feedback.data = data;
						}
					});

					//this.$refs.feedback.data = row.row;
				}, 200);
			},
			filterFilelist(data){
				var fileList=[];
				for(var i=0;i<data.length;i++){
					fileList.push({
						name: data[i].fileName,
						id: data[i].id
					})
				}
				return fileList;
			},
			cancel(row) { //撤销审核
				this.$confirm('是否撤销审核？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.ajax({
						url: 'under/lower/cancel',
						type: 'post',
						data: {
							id: row.row.id
						},
						success: function(data) {
							this.getRepeatDetail();
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

	.el-table--fit {
		width: 94% !important;
		margin-left: 3%;
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
