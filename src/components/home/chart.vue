<template>
	<div class="chart-container">
		<el-row :gutter="0">
			<el-col :span="12">
				<div class="grid-content bg-purple" id="chartA"></div>
			</el-col>
			<el-col :span="12">
				<div class="grid-content bg-purple" id="chartB"></div>
			</el-col>
			<el-col :span="12">
				<div class="grid-content bg-purple" id="chartC"></div>
			</el-col>
			<el-col :span="12">
				<div class="grid-content bg-purple" id="chartD"></div>
			</el-col>
		</el-row>

	</div>
</template>
<script>
	import echarts from 'echarts'
	export default {
		components: {},
		data() {
			return {

			}
		},
		created() {
			this.ajax({
				url: 'statistics/projectPropertyCount',
			}).then(data => {
				var series = [{
					value: 0,
					name: '产业化项目'
				}, {
					value: 0,
					name: '基础设施'
				}, {
					value: 0,
					name: '功能平台'
				}];
				for(var i = 0; i < data.length; i++) {
					if(data[i].property == 14) {
						series[0].value = data[i].count;
					} else if(data[i].property == 15) {
						series[1].value = data[i].count;
					} else if(data[i].property == 16) {
						series[2].value = data[i].count;
					}
				}
				this.initChartA(series);
			})
			this.ajax({
				url: 'statistics/projectFinishStatusCount',
			}).then(data => {
				var series = [{
					value: data[0].overdue,
					name: '逾期'
				}, {
					value: data[0].willOverdue,
					name: '即将逾期'
				}, {
					value: data[0].unOverdue,
					name: '正常'
				}];
				this.initChartB(series);
			})
			this.ajax({
				url: 'statistics/projectInvestmentCount',
			}).then(data => {
				var series = [{
					value: data[0].totleInvestment,
					name: '总投资'
				}, {
					value: data[0].planInvestment,
					name: '年度投资'
				}];
				this.initChartC(series);
			})
			this.ajax({
				url: 'statistics/projectIsImportantCount',
			}).then(data => {
				var series = [{
					value: data[0].isImportant,
					name: '重大项目'
				}, {
					value: data[0].unImportant,
					name: '一般项目'
				}];
				this.initChartD(series);
			})

		},
		computed: {

		},
		watch: {

		},
		mounted() {

		},
		methods: {
			initChartA(series) {
				var chartA = echarts.init(document.getElementById('chartA'));
				var colors = ['rgb(39,114,123)', 'rgb(243,164,59)', 'rgb(96,192,221)'];
				chartA.setOption({
					color: colors,
					title: {
						text: '三大项目统计',
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
						x: 'left',
						data: ['产业化项目', '基础设施', '功能平台'],
						textStyle: {
							color: "rgb(152,152,152)",
							fontSize: "16",
						}
					},
					calculable: true,
					series: [{
						name: '项目类型',
						type: 'pie',
						radius: '55%',
						center: ['50%', '60%'],
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
			initChartB(series) {
				var chartB = echarts.init(document.getElementById('chartB'));
				var colors = ['rgb(39,114,123)', 'rgb(243,164,59)', 'rgb(96,192,221)'];
				chartB.setOption({
					color: colors,
					title: {
						text: '项目进度统计',
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
						x: 'left',
						data: ['逾期', '即将逾期', '正常'],
						textStyle: {
							color: "rgb(152,152,152)",
							fontSize: "16",
						}
					},
					calculable: true,
					series: [{
						name: '进展情况',
						type: 'pie',
						radius: '55%',
						center: ['50%', '60%'],
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
			initChartC(series) {
				var chartC = echarts.init(document.getElementById('chartC'));
				var colors = ['rgb(39,114,123)', 'rgb(243,164,59)', 'rgb(96,192,221)'];
				chartC.setOption({
					color: colors,
					title: {
						text: '园区投资统计',
						x: 'center',
						textStyle: {
							color: "rgb(127,127,127)",
							fontSize: 24,
						}
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%) 万元",
						textStyle: {
							//color: "black",
							fontSize: "18",
						}
					},
					legend: {
						orient: 'vertical',
						x: 'left',
						data: ['总投资', '年度投资'],
						textStyle: {
							color: "rgb(152,152,152)",
							fontSize: "16",
						}
					},
					calculable: true,
					series: [{
						name: '投资情况',
						type: 'pie',
						radius: '55%',
						center: ['50%', '60%'],
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
			initChartD(series) {
				var chartD = echarts.init(document.getElementById('chartD'));
				var colors = ['rgb(39,114,123)', 'rgb(243,164,59)', 'rgb(96,192,221)'];
				chartD.setOption({
					color: colors,
					title: {
						text: '园区重大项目',
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
						x: 'left',
						data: ['重大项目', '一般项目'],
						textStyle: {
							color: "rgb(152,152,152)",
							fontSize: "16",
						}
					},
					calculable: true,
					series: [{
						name: '项目类型',
						type: 'pie',
						radius: '55%',
						center: ['50%', '60%'],
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
			}
		}
	}
</script>
<style scoped lang="less">
	.chart-container {
		width: 100%;
		height: 100%;
	}
	
	.el-row {
		width: 100%;
		height: 100%;
		margin-bottom: 20px;
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.el-col {
		border-radius: 4px;
		height: 50%;
	}
	
	.bg-purple-dark {
		background: #99a9bf;
	}
	
	.bg-purple {
		/*background: #d3dce6;*/
	}
	
	.bg-purple-light {
		background: #e5e9f2;
	}
	
	.grid-content {
		width: 100%;
		height: 100%;
		padding: 64px;
		border: 1px solid #dedede;
	}
	
	.row-bg {
		padding: 10px 0;
		background-color: #f9fafc;
	}
</style>