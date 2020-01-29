<template>
	<div class="diglog-info streetEdit projectDialog">
		<el-row>
			<el-col :span="24">
				<el-steps :active="stepData.step" align-center>
					<el-step title="启动应急指挥" :description="stepData.start"></el-step>
					<el-step title="时间研判" :description="stepData.prersh"></el-step>
					<el-step title="事件处置" :description="stepData.handling"></el-step>
					<el-step title="事件办结" :description="stepData.end"></el-step>
				</el-steps>
			</el-col>
		</el-row>
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
				<my-tooltip text="严重等级"></my-tooltip>
				<span>{{detailData.levelName}}</span>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<my-tooltip text="创建时间"></my-tooltip>
				<span>{{detailData.crtTime}}</span>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<my-tooltip text="网址"></my-tooltip>
        <span style="float: left">
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
				<el-table :data="tableData" style="width: 100%" border :cell-class-name="judgeRead">
					<el-table-column type="index" label="序号" width="60" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="deptName" label="参与单位" min-width="23%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="isHostUnit" label="角色" min-width="23%" show-overflow-tooltip>
						<template slot-scope="row">
							{{row.row.isHostUnit==0?'从参与人':'主参与人'}}
						</template>
					</el-table-column>
					<el-table-column prop="timeLimit" label="时限（小时）" min-width="14%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="statusName" label="进度" min-width="14%" show-overflow-tooltip>
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
			<detail-emergency ref="detail" :showDialogId="showDialogId" :detailDialogId="detailDialogId"></detail-emergency>
		</el-dialog>
	</div>
</template>
<script>
	import detailEmergency from '../../EmergencyCommand/emergencyUpDialog/detailEmergency.vue'

	export default {
		props: ['showDialogId'],
		components: {
			detailEmergency
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
				showDetail: false,
				stepData: {
					step: 1,
					start: '',
					prersh: '',
					handling: '',
					end: ''
				},
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
					url: 'emergency/upper/query/detail/list',
					type: 'get',
					data: {
						id: this.showDialogId
					}
				}).then(data => {
					this.tableData = this.formateProcessData(data.process);
					this.detailData = this.formateDetailData(data.detail);
				})

				this.ajax({
					url: 'emergency/query/phase',
					type: 'get',
					data: {
						id: this.showDialogId
					}
				}).then(data => {
					var index = 1;
					for(var i = 0; i < data.length; i++) {
						if(data[i].period == 'start') {
							this.stepData.start = data[i].time;
						} else if(data[i].period == 'prersh') {
							this.stepData.prersh = data[i].time;
						} else if(data[i].period == 'handling') {
							this.stepData.handling = data[i].time;
						} else if(data[i].period == 'end') {
							this.stepData.end = data[i].time;
						}
						if(data[i].time && data[i].time.length > 10) {
							if(data[i].sort > index) {
								index = data[i].sort;
							}
						}
					}
					this.stepData.step = index;
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
				if(data.level == 1) {
					data.levelName = '一般';
				} else if(data.level == 2) {
					data.levelName = '较大';
				} else if(data.level == 3) {
					data.levelName = '重大';
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
								this.$refs.detail.getRepeatDetail();
							}, 500);
						}
					})
				} else {
					this.detailDialogId = row.row.id;
					this.showDetail = true;
					setTimeout(() => {
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

	.el-step.is-horizontal .el-step__line {
		top: 16px !important;
	}
</style>
