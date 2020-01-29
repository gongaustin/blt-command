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
        <span style="float: left" id="content">
        <a style="color: #57a3f3;" href="javascript:;" v-for="item in (detailData.website ||'').split(/\n|;|；|,|，/)" @click="downloadFile(item)">{{item}} <br>

        </a>
        </span>
<!--				<span>{{detailData.website}}</span>-->
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<my-tooltip text="文档上传"></my-tooltip>
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
				<my-tooltip text="处理进度"></my-tooltip>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<el-table :data="tableData" style="width: 100%" border  :cell-class-name="judgeRead">
					<el-table-column type="index" label="序号" width="60" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="deptName" label="参与单位" min-width="36%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="statusName" label="进度" min-width="36%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="name" label="操作" show-overflow-tooltip min-width="15%">
						<template slot-scope="row">
							<el-button @click="particular(row)" type="text" size="small">
								查看
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
		</el-row>

		<el-dialog title="下派事件详情" :visible.sync="showDetail" v-model="showDetail" size="800px" append-to-body>
			<detail-repeat ref="detail" :detailDialogId="detailDialogId"></detail-repeat>
		</el-dialog>
	</div>
</template>
<script>
	import detailRepeat from '../../EmergencyCommand/repeatUpDialog/detailRepeat.vue'

	export default {
		props: ['showDialogId'],
		components: {
			detailRepeat
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
				showDetail: false
			}
		},
		methods: {
			judgeRead({row, column, rowIndex, columnIndex}){
				if(row.isRead && columnIndex==1){
					return 'activeTitle';
				}
			},
			getReportDetailList() {
				this.ajax({
					url: 'under/upper/query/detail/list',
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
					switch(data[i].status) {
						case 0:
							data[i].statusName = '未审核';
							break;
						case 1:
							data[i].statusName = '待处理';
							break;
						case 2:
							data[i].statusName = '办结';
							break;
					}
				}
				return data;
			},
			formateDetailData(data) {
				if(data.status == 0) {
					data.statusName = '待处理';
				} else if(data.status == 1) {
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
			particular(row) { //修改审核
				if(row.row.isRead) {
					this.ajax({
						url: 'read',
						type: 'post',
						data: {
							taskId: row.row.id
						},
						success: function(result) {
							this.detailDialogId = row.row.id;
							this.showDetail = true;
							setTimeout(() => {
								this.$refs.detail.detailData = {
									title: this.detailData.title,
									deptName: row.row.deptName
								}
								this.$refs.detail.getRepeatDetail();
							}, 500);
						}
					})
				} else {
					this.detailDialogId = row.row.id;
					this.showDetail = true;
					setTimeout(() => {
						this.$refs.detail.detailData = {
							title: this.detailData.title,
							deptName: row.row.deptName
						}
						this.$refs.detail.getRepeatDetail();
					}, 500);
				}

			},
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
