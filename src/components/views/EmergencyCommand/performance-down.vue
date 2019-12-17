<template>
	<tip-list title="绩效" :class="{headclass:headclassBol}">
		<div class="public-form inner-container">
			<div class="clearfix search-header">
				<div style="margin-top: 5px;">
					<my-tooltip text="时间范围"></my-tooltip>
					<el-date-picker v-model="searchFrom.startTime" type="date" format="yyyy-MM-dd" placeholder="开始时间"></el-date-picker>
					至
					<el-date-picker v-model="searchFrom.endTime" type="date" format="yyyy-MM-dd" placeholder="结束时间"></el-date-picker>
				</div>
				<div style="margin-top: 5px;">
					<my-tooltip text="得分统计"></my-tooltip>
					<el-row :gutter="0">
						<el-col :span="12">
							<div style="height: 120px; width: 100%;margin: 20px 0;" id="chartA"></div>
						</el-col>
					</el-row>
				</div>
				<ul class="input list clearfix">
					<li style="padding: 5px 0 5px 0;">
						<my-tooltip text="任务名称"></my-tooltip>
						<div class="box" style="padding-left: 100px;">
							<el-input v-model="searchFrom.keyword" placeholder="请输入任务名称"></el-input>
						</div>
					</li>
					<div style="padding:5px 0px 0px 0px;float:left">
						<el-button @click="reset" style="float:left;width:120px;margin-left:20px;">重置</el-button>
						<el-button type="primary" @click="queryList()" style="float:left;margin-left:20px;width:120px">查询</el-button>
					</div>
				</ul>
			</div>
			<el-table :data="tableData" style="width: 100%" border>
				<el-table-column type="index" label="序号" width="70" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="title" label="任务" min-width="25%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="typeName" label="类型" min-width="18%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="endTime" label="办结时间" min-width="18%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="score" label="满意度得分" min-width="15%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="agingScore" label="时效得分" min-width="20%" show-overflow-tooltip>
				</el-table-column>
			</el-table>
			<div class="page" v-show="total">
				<el-pagination :current-page="searchFrom.current" :page-size="searchFrom.size" @size-change="handleSizeChange" @current-change="pageChange" layout="total,prev, pager, next,jumper" :total="total">
				</el-pagination>
			</div>
		</div>
	</tip-list>
</template>
<script>
	import tipList from '../../public/TidiList'
	import echarts from 'echarts'
	export default {
		components: {
			tipList
		},
		created() {
			this.queryList();
		},
		mounted() {

		},
		destroyed() {
			//移除监听
			$(window).unbind()
		},
		data() {
			return {
				headclassBol: false,
				searchFrom: {
					current: 1, //页码
					size: 10, //每页条数
					keyword: '', //名称
					startTime: '',
					endTime: ''
				},
				total: 0, //总条数
				tableData: [],
				showDialogId: '', //显示对于dialogID,

			}
		},
		methods: {

			queryList(type) {
				/*如果是点击查询，页码初始化为1*/
				if(type && this.searchFrom.current != 1) {
					this.searchFrom.current = 1
					return false
				}

				this.searchFrom.startTime = this.formatedate(this.searchFrom.startTime);
				this.searchFrom.endTime = this.formatedate(this.searchFrom.endTime);
				this.ajax({
					url: 'score/lower/collect/page',
					type: 'get',
					data: this.searchFrom
				}).then(data => {
					this.total = data.total
					this.tableData = this.formateData(data.records);
					this.initChartA(data.records);
				})
			},
			formateData(data) {
				for(var i = 0; i < data.length; i++) {
					switch(data[i].type) {
						case 1:
							data[i].typeName = '上报事件';
							break;
						case 2:
							data[i].typeName = '下派事件';
							break;
						case 3:
							data[i].typeName = '应急指挥事件';
							break;
					}
				}
				return data;
			},
			formatedate(time) {
				var d = new Date(time);
				if(!d.getFullYear()) {
					return '';
				}
				return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + '00:00:00';
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
				this.searchFrom.keyword = '', //名称
					this.searchFrom.startTime = ''; //名称
				this.searchFrom.endTime = ''; //名称
				this.queryList();
			},
			initChartA(data) {
				if(!data.length)return;
				var score=0;
				var agingScore=0;
				for(var i=0;i<data.length;i++){
					score+=data[i].score;
					agingScore+=data[i].agingScore;
				}
				
				var series = [{
					value: score,
					name: '满意度'
				}, {
					value: agingScore,
					name: '时效'
				}];
				
				var chartA = echarts.init(document.getElementById('chartA'));
				var colors = ['rgb(46,199,201)', 'rgb(182,162,222)', 'rgb(90,177,239)'];
				chartA.setOption({
					color: colors,
					title: {
						text: '',
						x: 'center',
						textStyle: {
							color: "rgb(127,127,127)",
							fontSize: 24,
						}
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)",
						textStyle: {
							//color: "black",
							fontSize: "18",
						}
					},
					legend: {
						orient: 'vertical',
						x: 'right',
						data: ['满意度', '时效'],
						textStyle: {
							color: "rgb(152,152,152)",
							fontSize: "16",
						}
					},
					calculable: true,
					series: [{
						name: '得分统计',
						type: 'pie',
						radius: '50',
						center: ['50%', '50%'],
						label: {
							normal: {
								textStyle: {
									fontWeight: 'normal',
									fontSize: 16
								}
							}
						},
						data: series
					}]
				})
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
		.el-dialog__title {
			font-size: 24px;
		}
	}
	.public-form .el-date-editor.el-input{
		width: 220px !important;
	}
</style>