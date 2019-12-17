<template>
  <div class="public-form inner-container">
    <div class="clearfix search-header">
      <div style="margin-top: 5px;">
        <my-tooltip text="时间范围"></my-tooltip>
        <el-date-picker v-model="searchFrom.startTime" type="date" format="yyyy-MM-dd" placeholder="开始时间"></el-date-picker>
        至
        <el-date-picker v-model="searchFrom.endTime" type="date" format="yyyy-MM-dd" placeholder="结束时间"></el-date-picker>
      </div>
      <div style="margin-top: 5px;">
        <my-tooltip text="上报统计"></my-tooltip>
        <el-row :gutter="0">
          <el-col :span="12" >
            <div style="height: 120px; width: 100%;margin: 20px 0;" id="chartA"></div>
          </el-col>
        </el-row>
      </div>
    </div>

  </div>
</template>
<script>
    import echarts from 'echarts'
    export default {
        props: ['showDialogId'],
        components: {},
        created() {

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
                    id: '',
                    startTime: '',
                    endTime: ''
                },
                total: 0, //总条数
                tableData: [],

                //showDialogId: '', //显示对于dialogID,

            }
        },
        methods: {

            queryList(type) {
                /*如果是点击查询，页码初始化为1*/
                if(type && this.searchFrom.current != 1) {
                    this.searchFrom.current = 1
                    return false
                }
                this.searchFrom.id = this.showDialogId;
                this.searchFrom.startTime = this.formatedate(this.searchFrom.startTime);
                this.searchFrom.endTime = this.formatedate(this.searchFrom.endTime);
                this.ajax({
                    url: 'score/upper/collect/one',
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
                this.searchFrom.keyword = ''; //名称
                this.searchFrom.startTime = ''; //名称
                this.searchFrom.endTime = ''; //名称

                this.queryList();
            },
            clearData() {
                this.searchFrom.keyword = ''; //名称
                this.searchFrom.startTime = ''; //名称
                this.searchFrom.endTime = ''; //名称
            },
            initChartA(data) {
                //if(!data.length)return;
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
        width: 40%;
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
</style>
