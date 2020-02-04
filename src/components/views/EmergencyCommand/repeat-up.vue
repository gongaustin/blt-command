<template>
	<tip-list title="下派事件列表" :class="{headclass:headclassBol}">
		<div class="public-form inner-container">
			<div class="clearfix search-header">
				<div>
					<my-tooltip text="事件状态"></my-tooltip>
					<el-radio-group v-model="radio3">
						<el-radio-button label="全部" @change.native="changeStatus('全部')"></el-radio-button>
						<el-radio-button label="待处理" @change.native="changeStatus('待处理')"></el-radio-button>
						<el-radio-button label="办结" @change.native="changeStatus('办结')"></el-radio-button>
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
						<el-button @click="reset" style="float:right;width:120px">重置</el-button>
						<el-button type="primary" @click="queryList()" style="float:right;margin-right:20px;width:120px">查询</el-button>
						<el-button type="primary" @click="addRepeat()" style="float:right;margin-right:20px;width:120px">新增</el-button>
					</div>
				</ul>
			</div>
			<el-table :data="tableData" style="width: 100%" border :cell-class-name="judgeRead">
				<el-table-column type="index" label="序号" width="70" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="title" label="任务名称" min-width="30%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="typeName" label="类型" min-width="18%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="deptCount" label="参与单位数" min-width="15%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="crtTime" label="创建时间" min-width="18%" show-overflow-tooltip>
				</el-table-column>
        <el-table-column prop="endTime" label="规定完成时间" min-width="18%" show-overflow-tooltip>
        </el-table-column>
				<el-table-column prop="statusName" label="状态" min-width="13%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column fixed="right" label="操作" min-width="13%">
					<template scope="row">
						<el-button @click="particular(row)" type="text" size="small">
							查看
						</el-button>
						<el-button v-if="row.row.isReplyed>0?false:true" @click="edit(row)" type="text" size="small">
							编辑
						</el-button>
						<el-button v-if="row.row.isReplyed>0?false:true" @click="cancel(row)" type="text" size="small">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="page" v-show="total">
				<el-pagination :current-page="searchFrom.current" :page-size="searchFrom.size" @size-change="handleSizeChange" @current-change="pageChange" layout="total,prev, pager, next,jumper" :total="total">
				</el-pagination>
			</div>
			<el-dialog @close="queryList()" title="下派添加" :visible.sync="showAdd" v-model="showAdd" size="600px">
				<add-repeat ref="addrepeat"></add-repeat>
			</el-dialog>

			<el-dialog @close="queryList()" title="事件详情列表" :visible.sync="showdetaillist" v-model="showdetaillist" size="600px">
				<detail-repeatList ref="detailrepeatlist" :showDialogId="showDialogId"></detail-repeatList>
			</el-dialog>
		</div>
	</tip-list>
</template>
<script>
	import tipList from '../../public/TidiList'
	import addRepeat from '../EmergencyCommand/repeatUpDialog/addRepeat.vue'
	import detailRepeatList from '../EmergencyCommand/repeatUpDialog/detailRepeatList.vue'

	export default {
		components: {
			tipList,
			addRepeat,
			detailRepeatList
		},
		created() {
			this.queryList()

			this.eventBus.$on('streetUpdate', () => {
				this.queryList(true)
			})
			this.eventBus.$on('streetAdd', () => {
				this.queryList(true)
			})
		},
		mounted() {

		},
		destroyed() {
			//移除监听
			$(window).unbind()
		},
		data() {
			return {
				radio3: '待处理',
				headclassBol: false,
				searchFrom: {
					current: 1, //页码
					size: 10, //每页条数
					keyword: '', //名称
					status: null
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
			judgeRead({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if(row.isRead && columnIndex == 1) {
					return 'activeTitle';
				}
			},
			changeStatus(type) {
				this.radio3 = type;
				this.searchFrom.current = 1;
				this.queryList();
			},
			queryList(type) {
				/*如果是点击查询，页码初始化为1*/
				if(type && this.searchFrom.current != 1) {
					this.searchFrom.current = 1
					return false
				}
				switch(this.radio3) {
					case '全部':
						this.searchFrom.status = null;
						break;
					case '待处理':
						this.searchFrom.status = 0;
						break;
					case '办结':
						this.searchFrom.status = 1;
						break;
				}
				this.ajax({
					url: 'under/upper/query/page',
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
					}
					if(result[i].type == 1) {
						result[i].typeName = '舆论引导';
					} else if(result[i].type == 2) {
						result[i].typeName = '网络评论';
					} else if(result[i].type == 3) {
						result[i].typeName = '处置情况';
					} else {
						result[i].typeName = result[i].type;
					}
				}
				return result;
			},
			addRepeat() {
				this.showAdd = true;
				setTimeout(() => {
					this.$refs.addrepeat.data = {
						title: '',
						type: '',
						website: '',
						attachment: '',
						startTime: '',
						endTime: '',
						deptIds: [],
						desc: ''
					}
					//清空缓存数据
					this.$refs.addrepeat.fileList = [];
          this.$refs.addrepeat.townIdAll = [];
          this.$refs.addrepeat.cityIdAll = [];
					this.$refs.addrepeat.townSelectedAll = [];
          this.$refs.addrepeat.citySelectedAll = [];

				}, 200)
			},
			/*查看详情*/
			particular(data) {
				/*当前选择的数据id*/
							this.showDialogId = data.row.id
							/*显示dialog*/
							this.showdetaillist = true
							setTimeout(() => {
								this.$refs.detailrepeatlist.getReportDetailList();
							}, 500)
			},
			/*编辑*/
			edit(row) {
				let townTotal = [];
				let cityTotal = [];
				this.showAdd = true;
				let _that = this;
				this.ajax({
					url: 'under/detail/byUnderId',
					type: 'get',
					data: {
						id: row.row.id
					},
					success: function(data) {
						console.log("data:"+data.attachments)
            _that.$refs.addrepeat.townIdAll = [];
            _that.$refs.addrepeat.cityIdAll = [];
            _that.$refs.addrepeat.townSelectedAll = [];
            _that.$refs.addrepeat.citySelectedAll = [];
						_that.$refs.addrepeat.fileList = _that.filterFilelist(data.attachments);
						let depts = data.depts;
						console.log("depts:"+depts)
            if(depts){
                depts.forEach(item => {
                    if(item.nature === 0){
                        _that.$refs.addrepeat.townIdAll.push(item.value);
                        _that.$refs.addrepeat.townSelectedAll.push({value:item.value,label:item.label})
                    }else{
                        _that.$refs.addrepeat.cityIdAll.push(item.value);
                        _that.$refs.addrepeat.citySelectedAll.push({value:item.value,label:item.label});
                    }
                })
            }

						this.$refs.addrepeat.data = data
						this.$refs.addrepeat.isEmr = data.isEmr;

					}
				});

				//				setTimeout(() => {
				//					if(data.row.deptIds) {
				//						data.row.deptIds = data.row.deptIds.split(',');
				//						data.row.deptIds.forEach(function(item, index) {
				//							data.row.deptIds[index] = parseInt(data.row.deptIds[index]);
				//						})
				//					}
				//					data.row.type = parseInt(data.row.type);
				//					this.$refs.addrepeat.data = data.row
				//				}, 500)
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
				this.$confirm('是否删除下派事件？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.ajax({
						url: 'under/upper/cancelUnder',
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
				this.radio3 = '待处理';
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
	}
</style>
