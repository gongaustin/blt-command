<template>
	<div class="diglog-info streetEdit projectDialog">
		<el-row>
			<el-col :span="24">
				<my-tooltip text="任务名称"></my-tooltip>
				<span style="font-size: 18px;font-weight: bold;">{{detailData.title}}</span>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<my-tooltip text="参与单位"></my-tooltip>
				<span style="font-size: 18px;font-weight: bold;">{{detailData.deptName}}</span>
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
<!--						 <template slot-scope="scope">-->
<!--					        <el-popover trigger="hover" placement="top">-->
<!--					          <p>{{ scope.row.content }}</p>-->
<!--					          <div slot="reference" class="name-wrapper">-->
<!--					            <p>{{ scope.row.content}}</p>-->
<!--					          </div>-->
<!--					        </el-popover>-->
<!--					      </template>-->
					</el-table-column>
					<el-table-column prop="optTypeName" label="处理" min-width="7%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="uname" label="用户名" min-width="11%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="website" label="网址" min-width="12%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="crtTime" label="时间" min-width="18%" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="attachments" label="文档上传" min-width="20%" show-overflow-tooltip>
						<template slot-scope="row">
							<p style="color: #57a3f3;cursor: pointer;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"  href="javascript:;" v-for="item in row.row.attachments" @click="downloadFile(item.url)">{{item.fileName}};</p>
						</template>
					</el-table-column>
					<el-table-column fixed="right"  prop="name" label="操作" min-width="12%" show-overflow-tooltip>
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
			<el-button v-show="turnVisible" size="small" type="danger" @click="turnDown" style="width:80px">驳回</el-button>
			<el-button v-show="finsihVisible" size="small" type="primary" @click="finishHandle" style="width:80px;margin-left:10px">办结</el-button>
		</div>

		<el-dialog title="驳回" :visible.sync="showTurn" v-model="showTurn" size="400px" append-to-body>
			<turn-down ref="turn" :detailDialogId="detailDialogId"></turn-down>
		</el-dialog>
		<el-dialog title="办结" :visible.sync="showFinish" v-model="showFinish" size="400px" append-to-body>
			<finish-report ref="finish" :detailDialogId="detailDialogId"></finish-report>
		</el-dialog>
	</div>
</template>
<script>
	import turnDown from '../../EmergencyCommand/repeatUpDialog/turnDown.vue'
	import finishReport from '../../EmergencyCommand/repeatUpDialog/finishReport.vue'

	export default {
		props: ['detailDialogId'],
		components: {
			turnDown,
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
				detailData: {
					deptName:'',
					title:''
				},
				showTurn: false,
				showFinish: false,
				turnVisible: false,
				finsihVisible: false,
			}
		},
		methods: {
			getRepeatDetail() {
				this.ajax({
					url: 'under/upper/query/detail/one',
					type: 'get',
					data:{
						id:this.detailDialogId
					}
				}).then(data => {
					this.tableData = this.formateProcessData(data);
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
					if(i==data.length-1){
						if(data[i].optType==1){
							this.unChecked();
						}else if(data[i].optType==2){
							this.haveChecked();
						}else if(data[i].optType==5){
							this.finishChecked();
						}
					}
				}
				return data;
			},
			unChecked() { //未审核显示按钮组
				this.turnVisible = true;
				this.finsihVisible = true;
			},
			haveChecked() { //已审核显示按钮组
				this.turnVisible = false;
				this.finsihVisible = false;
			},
			finishChecked() { //已办结显示按钮组
				this.turnVisible = false;
				this.finsihVisible = false;
			},
			turnDown() { //驳回
				this.showTurn = true;
				setTimeout(() => {
					this.$refs.turn.formdata = {
						id:this.detailDialogId,
						content: '',
					};
				}, 200);
			},
			finishHandle() { //办结
				this.showFinish = true;
				setTimeout(() => {
					this.$refs.finish.formdata = {
						id:this.detailDialogId,
						grade: 100,
            underTimeGrade:100,
					};
				}, 200);
			},
			moidfyVisible(row) { //操作按钮是否显示
				if(row.$index == this.tableData.length - 1) {
					if(row.row.optType == 2) {
						return true;
					}
				}
				return false;
			},
			modify(row) { //修改审核
				switch(row.row.optType) {
					case 2:
						this.showTurn = true;
						setTimeout(() => {
							this.$refs.turn.formdata = row.row;
						}, 200);
						break;
					case 1:
						this.showFinish = true;
						setTimeout(() => {
							this.$refs.finish.formdata = row.row;
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
						url: 'under/upper/cancel',
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

	/*提示文字的类名*/
	.el-tooltip__popper {
    max-width:30%;
    background-color: #9ea6b9;

	}

	.el-table .cell {
		height: 23px;
	}

	.el-table_3_column_18  .cell {
		height: auto !important;
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
