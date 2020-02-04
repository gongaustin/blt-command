<template>
    <div class="common-search">
        <el-form label-width="90px" :inline="true" :model="searchForm" class="demo-form-inline">
            <el-row>
                <el-col :lg="6" :md="8" :sm="12">
                    <el-form-item label="登记日期">
                        <el-date-picker v-model="searchForm.date" type="daterange" :picker-options="pickerOptions2" placeholder="选择时间范围" align="right">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :lg="6" :md="8" :sm="12">
                    <el-form-item label="工程名称">
                        <el-input v-model="searchForm.projectName" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :lg="6" :md="8" :sm="12">
                    <el-form-item label="工程地址">
                        <el-input v-model="searchForm.area" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :lg="6" :md="8" :sm="12">
                    <el-form-item label="建设单位">
                        <el-input v-model="searchForm.projectName" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :lg="6" :md="8" :sm="12">
                    <el-form-item label="项目编号">
                        <el-input v-model="searchForm.projectName" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :lg="6" :md="8" :sm="12">
                    <el-form-item label="项目名称">
                        <el-input v-model="searchForm.projectName" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :lg="6" :md="8" :sm="12">
                    <el-form-item label="作业室">
                        <el-select v-model="value" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :lg="6" :md="8" :sm="12">
                    <el-form-item label="作业组">
                        <el-select v-model="value" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :lg="6" :md="8" :sm="12">
                    <el-form-item label="联系人">
                        <el-input v-model="searchForm.projectName" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :lg="6" :md="8" :sm="12">
                    <el-form-item label="联系电话">
                        <el-input v-model="searchForm.projectName" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :lg="6" :md="8" :sm="12">
                    <el-form-item label="工程负责人">
                        <el-input v-model="searchForm.projectName" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :lg="6" :md="8" :sm="12">
                    <el-form-item label="地铁控规">
                        <el-checkbox v-model="checked">备选项</el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :lg="6" :md="8" :sm="12">
                    <el-form-item label="新增项目">
                        <el-checkbox v-model="checked">备选项</el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :lg="6" :md="8" :sm="12">
                    <el-form-item label="合同编号">
                        <el-input v-model="searchForm.projectName" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :lg="6" :md="8" :sm="12">
                    <el-form-item label="合同类型">
                        <el-select v-model="value" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :lg="6" :md="8" :sm="12">
                    <el-form-item label="查询">
                        <el-button type="primary">查询</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            searchForm: {

            },
            checked: '',
            pickerOptions2: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        var end = new Date();
                        var start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        var end = new Date();
                        var start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        var end = new Date();
                        var start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
            value4: '',
            options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
        };
    }
}
</script>
<style lang="less">
.common-search {
    .el-form label {
        text-align: justify !important;
        display: inline-block !important;
        width: 85px;
    }
    .el-form label:after {
        content: " ";
        display: inline-block;
        padding-left: 100%;
    }
    .el-form-item {
        margin-bottom: 10px;
    }
    .el-form-item__content {
        width: 220px;
    }
}
</style>
