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
						<el-radio-button label="未审核" @change.native="changeStatus('未审核')"></el-radio-button>
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
					</div>
				</ul>
			</div>
			<el-table :data="tableData" style="width: 100%" border :cell-class-name="judgeRead">
				<el-table-column type="index" label="序号" width="70" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="title" label="任务名称" min-width="20%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="levelName" label="严重等级" min-width="18%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="timeLimit" label="时限（小时）" min-width="12%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="crtTime" label="创建时间" min-width="18%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="statusName" label="状态" min-width="18%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column fixed="right" label="操作" min-width="13%">
					<template scope="row">
						<el-button @click="particular(row)" type="text" size="small">
							查看
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="page" v-show="total">
				<el-pagination :current-page="searchFrom.current" :page-size="searchFrom.size" @size-change="handleSizeChange" @current-change="pageChange" layout="total,prev, pager, next,jumper" :total="total">
				</el-pagination>
			</div>

			<el-dialog @close="queryList()" title="事件详情列表" :visible.sync="showdetaillist" v-model="showdetaillist" size="600px">
				<detail-emergency ref="detailemergency" :showDialogId="showDialogId"></detail-emergency>
			</el-dialog>
		</div>
	</tip-list>
</template>
<script>
	import tipList from '../../public/TidiList'
	import detailEmergency from '../EmergencyCommand/emergencyDownDialog/detailEmergency.vue'

	export default {
		components: {
			tipList,
			detailEmergency
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
				this.searchFrom.current = 1;
				this.queryList();
			},
			changeStatus(type) {
				this.status = type;
				this.searchFrom.current = 1;
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
					case '未审核':
						this.searchFrom.status = 0;
						break;
					case '待处理':
						this.searchFrom.status = 1;
						break;
					case '办结':
						this.searchFrom.status = 2;
						break;
				}
				this.ajax({
					url: 'emergency/lower/query/page',
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
						result[i].statusName = '未审核';
					} else if(result[i].status == 1) {
						result[i].statusName = '待处理';
					} else if(result[i].status == 2) {
						result[i].statusName = '办结';
					}
					if(result[i].level == 1) {
						result[i].levelName = '一般';
					} else if(result[i].level == 2) {
						result[i].levelName = '较大';
					} else {
						result[i].levelName = '重大';
					}
				}
				return result;
			},
			addRepeat() {
				this.showAdd = true;
			},
			/*查看详情*/
			particular(data) {
				if(data.row.isRead) {
					this.ajax({
						url: 'read',
						type: 'post',
						data: {
							id: data.row.id,
							type: 3
						},
						success: function(result) {
							this.showDialogId = data.row.id
							this.showdetaillist = true
							setTimeout(() => {
								this.$refs.detailemergency.getRepeatDetail();
							}, 500)
						}
					})
				} else {
					this.showDialogId = data.row.id
					this.showdetaillist = true
					setTimeout(() => {
						this.$refs.detailemergency.getRepeatDetail();
					}, 500)
				}

			},
			/*编辑*/
			edit(data) {
				/*当前选择的数据id*/
				this.showDialogId = data.row.id
				/*显示dialog*/
				this.showEdit = true
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
	}
</style>
