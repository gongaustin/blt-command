<template>
	<tip-list title="应急指挥事件列表" :class="{headclass:headclassBol}">
		<div class="public-form inner-container">
			<div class="clearfix search-header">
				<div>
					<my-tooltip text="严重等级"></my-tooltip>
					<el-radio-group v-model="level">
						<el-radio-button label="全部" @change.native="changeLevel('全部')"></el-radio-button>
						<el-radio-button label="一般" @change.native="changeLevel('一般')"></el-radio-button>
						<el-radio-button label="较大" @change.native="changeLevel('较大')"></el-radio-button>
						<el-radio-button label="重大" @change.native="changeLevel('重大')"></el-radio-button>
					</el-radio-group>

				</div>
				<div style="margin-top: 5px;">
					<my-tooltip text="状态"></my-tooltip>
					<el-radio-group v-model="status">
						<el-radio-button label="全部" @change.native="changeStatus('全部')"></el-radio-button>
						<el-radio-button label="待处理" @change.native="changeStatus('待处理')"></el-radio-button>
						<el-radio-button label="办结" @change.native="changeStatus('办结')"></el-radio-button>
						<el-radio-button label="待分派" @change.native="changeStatus('待分派')"></el-radio-button>
					</el-radio-group>
				</div>
				<ul class="input list clearfix">
					<li style="padding: 5px 0 5px 0;">
						<my-tooltip text="事件名称"></my-tooltip>
						<div class="box" style="padding-left: 100px;">
							<el-input v-model="searchFrom.keyword" placeholder="请输入事件名称"></el-input>
						</div>
					</li>
					<div style="padding:5px 0px 0px 0px;float:left">
						<el-button @click="reset" style="float:left;width:120px;margin-left:20px;">重置</el-button>
						<el-button type="primary" @click="queryList()" style="float:left;margin-left:20px;width:120px">查询</el-button>
						<el-button type="primary" @click="addRepeat()" style="float:left;margin-left:20px;width:120px">新增</el-button>
					</div>
				</ul>
			</div>
			<el-table :data="tableData" style="width: 100%" border  :cell-class-name="judgeRead">
				<el-table-column type="index" label="序号" width="70" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="title" label="任务名称" min-width="20%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="levelName" label="严重等级" min-width="12%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="hostDeptName" label="主办单位" min-width="12%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="followDeptName" label="从办单位" min-width="13%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="crtTime" label="创建时间" min-width="12%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="statusName" label="状态" min-width="12%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column fixed="right" label="操作" min-width="13%">
					<template scope="row">
						<el-button v-if="row.row.status==3?false:true" @click="particular(row)" type="text" size="small">
							查看
						</el-button>
						<el-button v-if="row.row.isReplyed>0 || row.row.status==3?false:true" @click="edit(row)" type="text" size="small">
							编辑
						</el-button>
						<el-button v-if="row.row.isReplyed>0 || row.row.status==3?false:true" @click="cancel(row)" type="text" size="small">
							删除
						</el-button>
						<el-button v-if="row.row.status!=3?false:true" @click="convert(row)" type="text" size="small">
							转换
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="page" v-show="total">
				<el-pagination :current-page="searchFrom.current" :page-size="searchFrom.size" @size-change="handleSizeChange" @current-change="pageChange" layout="total,prev, pager, next,jumper" :total="total">
				</el-pagination>
			</div>
			<el-dialog @close="queryList()" title="应急指挥添加" :visible.sync="showAdd" v-model="showAdd" size="600px">
				<add-emergency ref="addemergency"></add-emergency>
			</el-dialog>

			<el-dialog @close="queryList()" title="事件详情列表" :visible.sync="showdetaillist" v-model="showdetaillist" size="600px">
				<detail-emergencyList ref="detailemergencylist" :showDialogId="showDialogId"></detail-emergencyList>
			</el-dialog>
		</div>
	</tip-list>
</template>
<script>
	import tipList from '../../public/TidiList'
	import addEmergency from '../EmergencyCommand/emergencyUpDialog/addEmergency.vue'
	import detailEmergencyList from '../EmergencyCommand/emergencyUpDialog/detailEmergencyList.vue'

	export default {
		components: {
			tipList,
			addEmergency,
			detailEmergencyList
		},
		created() {
			this.queryList()

//			this.eventBus.$on('streetUpdate', () => {
//				this.queryList(true)
//			})
//			this.eventBus.$on('streetAdd', () => {
//				this.queryList(true)
//			})

			if(this.$route.query.id) {
				var queryData = this.$route.query;
				this.showAdd = true
				setTimeout(() => {
					this.$refs.addemergency.data = this.formateData([queryData])[0];
				}, 500)
			}
		},
		mounted() {

		},
		destroyed() {
			//移除监听
			$(window).unbind()
		},
		data() {
			return {
				level: '全部',
				status: '全部',
				headclassBol: false,
				searchFrom: {
					current: 1, //页码
					size: 10, //每页条数
					keyword: '', //名称
					status: null,
					level: null
				},
				total: 0, //总条数
				tableData: [],
				typeList: [],
				showEdit: false,
				showDialogId: '', //显示对于dialogID,
				showAdd: false,
				showdetaillist: false
			}
		},
		methods: {
			judgeRead({row, column, rowIndex, columnIndex}){
				if(row.isRead && columnIndex==1){
					return 'activeTitle';
				}
			},
			changeLevel(level) {
				this.level = level;
				this.searchFrom.current=1;
				this.queryList();
			},
			changeStatus(status) {
				this.status = status;
				this.searchFrom.current=1;
				this.queryList();
			},
			queryList(type) {
				/*如果是点击查询，页码初始化为1*/
				if(type && this.searchFrom.current != 1) {
					this.searchFrom.current = 1
					return false
				}
				switch(this.level) {
					case '全部':
						this.searchFrom.level = null;
						break;
					case '一般':
						this.searchFrom.level = 1;
						break;
					case '较大':
						this.searchFrom.level = 2;
						break;
					case '重大':
						this.searchFrom.level = 3;
						break;
				}

				switch(this.status) {
					case '全部':
						this.searchFrom.status = null;
						break;
					case '待处理':
						this.searchFrom.status = 0;
						break;
					case '办结':
						this.searchFrom.status = 1;
						break;
					case '待分派':
						this.searchFrom.status = 3;
						break;
				}
				this.ajax({
					url: 'emergency/upper/query/page',
					type: 'get',
					data: this.searchFrom
				}).then(data => {
					this.total = data.total
					this.tableData = this.formateData(data.records);
				})
			},
			formateData(result) {
				for(var i = 0; i < result.length; i++) {
					if(result[i].status == 0) {
						result[i].statusName = '待处理';
					} else if(result[i].status == 1) {
						result[i].statusName = '办结';
					} else if(result[i].status == 3) {
						result[i].statusName = '待分派';
					}

					if(result[i].level == 1) {
						result[i].levelName = '一般';
					} else if(result[i].level == 2) {
						result[i].levelName = '较大';
					} else {
						result[i].levelName = '重大';
					}
					result[i].followDeptName = '';
					result[i].followDepartments = [];
					if(result[i].followDeptInfo) {
						var follows = result[i].followDeptInfo.split(',');
						for(var j = 0; j < follows.length; j++) {
							if(follows[j]) {
								var follownames = follows[j].split(';');
								if(follownames[0]) {
									result[i].followDeptName += follownames[0] + '  ';
									result[i].followDepartments.push({
										label: follownames[0],
										value: parseInt(follownames[1]),
										interval: parseInt(follownames[2])
									})
								}
							}
						}
					}
					result[i].hostDeptName = '';
					result[i].hostDepartments = [];
					if(result[i].hostDeptInfo) {
						var hosts = result[i].hostDeptInfo.split(',');
						for(var j = 0; j < hosts.length; j++) {
							if(hosts[j]) {
								var hostnames = hosts[j].split(';');
								if(hostnames[0]) {
									result[i].hostDeptName += hostnames[0] + '  ';
									result[i].hostDepartments.push({
										label: hostnames[0],
										value: parseInt(hostnames[1]),
										interval: parseInt(hostnames[2])
									})
								}
							}
						}
					}
				}
				return result;
			},
			addRepeat() {
				this.showAdd = true;
				setTimeout(() => {
					this.$refs.addemergency.data = {
						title: '',
						level: '',
						website: '',
						attachment: '',
						hostDepartments: [],
						followDepartments: [],
						desc: ''
					}
					this.$refs.addemergency.fileList = [];
				}, 500)
			},
			/*查看详情*/
			particular(data) {
				/*当前选择的数据id*/
				this.showDialogId = data.row.id
				/*显示dialog*/
				this.showdetaillist = true
				setTimeout(() => {
					this.$refs.detailemergencylist.getReportDetailList();
				}, 500)
			},
			/*编辑*/
			edit(row) {
				/*显示dialog*/
				this.showAdd = true

				this.ajax({
					url: 'emergency/detail/byEmergencyId',
					type: 'get',
					data: {
						id: row.row.id
					},
					success: function(data) {
						this.$refs.addemergency.fileList = this.filterFilelist(data.attachments);

						data.followDeptName = '';
						data.followDepartments = [];
						if(data.followDeptInfo) {
							var follows = data.followDeptInfo.split(',');
							for(var j = 0; j < follows.length; j++) {
								if(follows[j]) {
									var follownames = follows[j].split(';');
									if(follownames[0]) {
										data.followDeptName += follownames[0] + '  ';
										data.followDepartments.push({
											label: follownames[0],
											value: parseInt(follownames[1]),
											interval: parseInt(follownames[2])
										})
									}
								}
							}
						}
						data.hostDeptName = '';
						data.hostDepartments = [];
						if(data.hostDeptInfo) {
							var hosts = data.hostDeptInfo.split(',');
							for(var j = 0; j < hosts.length; j++) {
								if(hosts[j]) {
									var hostnames = hosts[j].split(';');
									if(hostnames[0]) {
										data.hostDeptName += hostnames[0] + '  ';
										data.hostDepartments.push({
											label: hostnames[0],
											value: parseInt(hostnames[1]),
											interval: parseInt(hostnames[2])
										})
									}
								}
							}
						}
						console.log(data)
						this.$refs.addemergency.data = data
					}
				});

				//				setTimeout(() => {
				//					this.$refs.addemergency.data = data.row
				//				}, 500)
			},
			convert(row){
				this.showAdd = true
				setTimeout(()=>{
					this.$refs.addemergency.data = row.row;
				},500)

			},
			filterFilelist(data) {
				var fileList = [];
				for(var i = 0; i < data.length; i++) {
					fileList.push({
						name: data[i].fileName,
						id: data[i].id
					})
				}
				return fileList;
			},
			cancel(row) { //撤销审核
				this.$confirm('是否删除应急指挥事件？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.ajax({
						url: 'emergency/upper/cancelEmergency',
						type: 'post',
						data: {
							id: row.row.id
						},
						success: function(data) {
							if(this.tableData.length == 1 && this.total > 1) {
								this.searchFrom.current = this.searchFrom.current - 1;
							}
							this.queryList();
						}
					});
				}).catch(() => {

				});
			},
			pageChange(val) {
				this.searchFrom.current = val
				this.queryList()
			},
			//输入页码跳转
			handleSizeChange() {
				this.searchFrom.current = val
				this.queryList()
			},
			reset() { //查询框重置
				this.searchFrom.keyword = '';
				this.level = '全部';
				this.status = '全部';
				this.queryList();
			}
		}
	}
</script>
<style lang="less" scoped>
	.headclass {
		width: 99%;
	}

	.public-form {
		.search-header {
			position: relative;
			.search-btn {
				position: absolute;
				top: 4px;
				right: 0;
			}
		}
		ul.input {
			float: left;
			// padding-right: 200px;
			// margin-left:-25px;
			width: 100%;
			li {
				float: left;
				width: 25%;
				padding: 5px 0 5px 20px;
				margin-bottom: 5px;
				span {
					float: left;
					width: 80px;
					line-height: 36px;
					display: block;
					text-indent: 5px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.box {
					width: 100%;
					padding-left: 160px;
				}
			}
		}
	}
</style>
<style lang="less">
	.public-form {
		.desc {
			overflow: hidden;
			text-overflow: ellipsis;
			word-break: break-all;
			white-space: nowrap;
		}
		.el-form-item__label {
			overflow: hidden;
			text-overflow: ellipsis;
			word-break: break-all;
			white-space: nowrap;
		}
		.el-textarea__inner {
			height: 87px;
		}
		.el-date-editor.el-input {
			width: 100%;
		}
		.el-select {
			width: 100%;
		}
		.el-dialog__title {
			font-size: 24px;
		}

    .el-tooltip__popper{
      max-width:30%;
      background-color: #9ea6b9;
    }
	}
</style>
