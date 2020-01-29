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
			<el-col :span="12">
				<my-tooltip text="角色"></my-tooltip>
				<span>{{detailData.isHostUnit==0?'从参与人':'主参与人'}}</span>
			</el-col>
			<el-col :span="12">
				<my-tooltip text="创建时间"></my-tooltip>
				<span>{{detailData.crtTime}}</span>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<my-tooltip text="时限（小时）"></my-tooltip>
				<span>{{detailData.timeLimit}}</span>
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
				<my-tooltip text="审核流程"></my-tooltip>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<el-table :data="tableData" style="width: 100%" border>
					<el-table-column type="index" label="序号" width="60" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="content" label="描述" min-width="28%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="optTypeName" label="处理" min-width="10%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="crtTime" label="时间" min-width="20%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="attachments" label="文档上传" min-width="25%" show-overflow-tooltip>
						<template slot-scope="row">
							<a style="color: #57a3f3;" href="javascript:;" v-for="item in row.row.attachments" @click="downloadFile(item.url)">{{item.fileName}};</a>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" min-width="15%">
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
			<feedback-emergency ref="feedback" :showDialogId="showDialogId"></feedback-emergency>
		</el-dialog>
	</div>
</template>
<script>
	import feedbackEmergency from '../../EmergencyCommand/emergencyDownDialog/feedbackEmergency.vue'

	export default {
		props: ['showDialogId'],
		components: {
			feedbackEmergency
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
				backVisible: true,
				stepData:{
					step:1,
					start:'',
					prersh:'',
					handling:'',
					end:''
				},
			}
		},
		methods: {
			getRepeatDetail() {
				this.ajax({
					url: 'emergency/lower/query/detail',
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
					var index=1;
					for(var i=0;i<data.length;i++){
						if(data[i].period=='start'){
							this.stepData.start=data[i].time;
						}else if(data[i].period=='prersh'){
							this.stepData.prersh=data[i].time;
						}else if(data[i].period=='handling'){
							this.stepData.handling=data[i].time;
						}else if(data[i].period=='end'){
							this.stepData.end=data[i].time;
						}
						if(data[i].time && data[i].time.length>10){
							if(data[i].sort>index){
								index=data[i].sort;
							}
						}
					}
					this.stepData.step=index;
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
				if(data.level == 1) {
					data.levelName = '一般';
				} else if(data.level == 2) {
					data.levelName = '较大';
				} else if(data.level == 3) {
					data.levelName = '重大';
				}
				return data;
			},
			feedBack() { //
				this.showFeedback = true;
				setTimeout(() => {
					this.$refs.feedback.data = {
						title: this.detailData.title,
						attachment: '',
						content: ''
					};
					this.$refs.feedback.fileList=[];
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
					row.row.title = this.detailData.title;
					this.$refs.feedback.data = row.row;
				}, 200);
			},
			cancel(row) { //撤销审核
				this.$confirm('是否撤销审核？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.ajax({
						url: 'emergency/lower/cancel',
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

	.el-step.is-horizontal .el-step__line{
		top: 16px !important;
	}
</style>
