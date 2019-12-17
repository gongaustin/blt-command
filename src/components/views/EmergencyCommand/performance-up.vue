<template>
	<tip-list title="绩效得分汇总" :class="{headclass:headclassBol}">
		<div class="public-form inner-container">
			<div class="clearfix search-header">
        <el-button size="small" @click="queryUnder()" type="primary" style="float:right;width:120px;height:40px;font-size: medium;margin-left: 10px">下派图形情况</el-button>
        <el-button size="small" @click="queryReport()" type="primary" style="float:right;width:120px;height:40px;font-size: medium;margin-left: 10px">上报图形情况</el-button>
        <el-button size="small" @click="queryScore()" type="primary" style="float:right;width:120px;height:40px;font-size: medium;margin-left: 10px">年度数据统计</el-button>
				<!--<div>
					<my-tooltip text="单位"></my-tooltip>
					<el-select v-model="searchFrom.id" placeholder="请选择">
						<el-option v-for="item in departments" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>

				</div>-->
				<!--<div style="margin-top: 5px;">
					<my-tooltip text="时间范围"></my-tooltip>
					<el-date-picker v-model="searchFrom.startTime" type="date" format="yyyy-MM-dd" placeholder="开始时间"></el-date-picker>
					至
					<el-date-picker v-model="searchFrom.endTime" type="date" format="yyyy-MM-dd" placeholder="结束时间"></el-date-picker>
				</div>-->
				<!--<ul class="input list clearfix">
					<li style="padding: 5px 0 5px 0;">
						<my-tooltip text="单位名称"></my-tooltip>
						<div class="box" style="padding-left: 150px;">
							<el-input v-model="searchFrom.keyword" placeholder="请输入单位名称"></el-input>
						</div>
					</li>
					<div style="padding:5px 0px 0px 0px;float:left">
						<el-button @click="reset" style="float:left;width:120px;margin-left:20px;">重置</el-button>
						<el-button type="primary" @click="queryList()" style="float:left;margin-left:20px;width:120px">查询</el-button>
					</div>
				</ul>-->
			</div>
			<el-table :data="tableData" style="width: 100%;margin-top: 15px" border>
				<el-table-column type="index" label="序号" width="70" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="deptName" label="单位" min-width="20%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="taskCount" label="任务数" min-width="30%" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="avgScore" label="平均分" min-width="30%" show-overflow-tooltip>
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
			<el-dialog @close="clearData" :title="currentDeptName" :visible.sync="showdetail" v-model="showdetail" size="600px">
				<detail-performance ref="detailscore" :showDialogId="showDialogId"></detail-performance>
			</el-dialog>

      <!-- 年度统计的模态框 -->
      <el-dialog title="年度统计" :visible.sync="showYearStatistics" v-model="showYearStatistics" size="600px" append-to-body>
        <div style="text-align:left;">
          <div class="medium">
            <label>统计时间段：</label><label style="color: red">{{beginDate}} - {{nowDate}}</label>
            <el-button size="small" @click="exportExcel()" type="primary" style="float:right;width:120px;height:40px;font-size: medium;margin-bottom: 15px">导出全部数据</el-button>
          </div>
          <div class="table">
            <el-table :data="tableScoreData" style="width: 100%;margin-top: 10px" border>
            <el-table-column type="index" label="序号" width="70" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="deptName" label="单位/街道/镇" min-width="15%" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="reportCount" label="上报数量" min-width="15%" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="underCount" label="下派数量" min-width="15%" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="taskCount" label="总任务数" min-width="15%" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="score" label="满意度总分" min-width="15%" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="agingScore" label="时效总分" min-width="15%" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="totalScore" label="权衡总分" min-width="15%" show-overflow-tooltip>
            </el-table-column>
          </el-table>
          </div>
          <div class="page" v-show="total">
            <el-pagination :current-page="scoreFrom.current" :page-size="scoreFrom.size" @size-change="handleScoreSizeChange" @current-change="pageScoreChange" layout="total,prev, pager, next,jumper" :total="total">
            </el-pagination>
          </div>

        </div>
      </el-dialog>


      <!-- 上报情况统计的模态框 -->
<!--      <el-dialog title="上报情况" :visible.sync="showReportStatistics" v-model="showReportStatistics" size="600px" append-to-body>-->
<!--        <div style="text-align:left;">-->
<!--          <div class="medium">-->
<!--            <label>统计时间段：</label><label style="color: red">{{beginDate}} - {{nowDate}}</label>-->
<!--          </div>-->


<!--        </div>-->
<!--      </el-dialog>-->

      <el-dialog title="上报图形统计" :visible.sync="showReportStatistics" v-model="showReportStatistics" size="600px">
        <report-statics ref="detailreport"></report-statics>
      </el-dialog>

      <!-- 下派情况统计的模态框 -->
<!--      <el-dialog title="下派情况" :visible.sync="showUnderStatistics" v-model="showUnderStatistics" size="600px" append-to-body>-->
<!--        <div style="text-align:left;">-->
<!--          <div class="medium">-->
<!--            <label>统计时间段：</label><label style="color: red">{{beginDate}} - {{nowDate}}</label>-->
<!--          </div>-->


<!--        </div>-->
<!--      </el-dialog>-->

      <el-dialog title="下派图形统计" :visible.sync="showUnderStatistics" v-model="showUnderStatistics" size="600px">
        <statics-under ref="detailreport"> </statics-under>
      </el-dialog>

		</div>
	</tip-list>
</template>
<script>
	import tipList from '../../public/TidiList'
	import detailPerformance from '../EmergencyCommand/performanceUpDialog/detailPerformance.vue'
  import ReportStatics from "./performanceUpDialog/reportStatics";
  import StaticsUnder from "./performanceUpDialog/staticsUnder";

	export default {
		components: {
        StaticsUnder,
        ReportStatics,
			tipList,
			detailPerformance
		},
		created() {
			this.queryList()

			this.ajax({
				url: "under/upper/getDepts",
				type: 'post',
				success: function(data) {
					for(var i = 0; i < data.length; i++) {
						this.departments.push({
							label: data[i].deptName,
							value: data[i].id
						})
					}
				}
			});
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
//					keyword: '', //名称
//					id: '',
//					startTime: '',
//					endTime: ''
				},
        scoreFrom: {
              current: 1, //页码
              size: 10, //每页条数
//					keyword: '', //名称
//					id: '',
//					startTime: '',
//					endTime: ''
          },
        showYearStatistics: false,
        showReportStatistics: false,
        showUnderStatistics: false,
        beginDate:'',
        nowDate:'',
				currentDeptName:'',
				total: 0, //总条数
				tableData: [],
        excelData: [],
        tableScoreData: [],
				showdetail: false,
				departments: [],
				showDialogId: '', //显示对于dialogID
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
					url: 'score/upper/collect/page',
					type: 'get',
					data: this.searchFrom
				}).then(data => {
					this.total = data.total
					this.tableData = data.records;
				})
			},
			formatedate(time) {
				var d = new Date(time);
				if(!d.getFullYear()) {
					return '';
				}
				return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + '00:00:00';
			},
			/*查看详情*/
			particular(data) {
				this.currentDeptName=data.row.deptName;
				/*当前选择的数据id*/
				this.showDialogId = data.row.id
				/*显示dialog*/
				this.showdetail = true
				setTimeout(() => {
					this.$refs.detailscore.queryList();
				}, 500)
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
				this.searchFrom.id='';
					this.queryList();
			},
			clearData(){
				this.$refs.detailscore.clearData();
			},
       //***********************************年度数据统计***********************************************
       queryScore() {
            var nowDate = new Date();
            this.beginDate = nowDate.getFullYear()+'年01月01日';
            this.nowDate = nowDate.getFullYear()+'年'+(nowDate.getMonth()+1)+'月'+nowDate.getDate()+'日';
            this.ajax({
                url: 'score/upper/year/statistics',
                type: 'get',
                data: this.scoreFrom
            }).then(data => {
                this.total = data.total
                this.tableScoreData = data.records;
            })
            this.showYearStatistics = true;

        },

        pageScoreChange(val) {
            this.scoreFrom.current = val
            this.queryScore()
        },
        //输入页码跳转
        handleScoreSizeChange() {
            this.scoreFrom.current = val
            this.queryScore()
        },

        exportExcel(){

            //excel数据导出
            require.ensure([], () => {
                const {
                    export_json_to_excel
                } = require('../../../assets/js/Export2Excel');
                const tHeader = ['排名','单位/街道/镇', '上报数量', '下派数量','总任务数', '满意度总分', '时效总分','权衡总分（0.8*满意度总分+0.2*时效总分）'];
                const filterVal = ['range','deptName', 'reportCount', 'underCount', 'taskCount','score','agingScore', 'totalScore'];
                this.ajax({
                    url: 'score/upper/year/statistics',
                    type: 'get',
                    data: {current:1,size:9999}
                }).then(data => {
                    this.excelData = data.records;
                    const list = this.excelData;
                    const data1 = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data1, '列表excel');
                })

            })

        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
        //***********************************上报数据统计***********************************************

        queryReport(){
			    this.showReportStatistics = true;
        },

        //***********************************下派数据统计***********************************************

        queryUnder(){
          this.showUnderStatistics = true;
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
	.public-form .el-select{
		width: 228px !important;
	}
</style>
