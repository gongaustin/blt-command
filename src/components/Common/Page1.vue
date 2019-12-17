<template>
    <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.page" :page-sizes="pageSizes" :page-size="pageInfo.pageSize" layout="total, prev, pager, next, jumper" :total="totalNum">
        </el-pagination>
    </div>
</template>
<script>
export default {
    props: ['totalNum'],
    methods: {
        handleSizeChange(val) {
            this.pageInfo.pageSize = val;
            this.Refresh();
        },
        handleCurrentChange(val) {
            this.pageInfo.page = val;
            this.Refresh();
        },
        Refresh() {
            this.$parent.pageInfo = JSON.parse(JSON.stringify(this.pageInfo));//注意：这里自动找父级赋值，如果父级组件不是table，请使用下面的获取方法GetPageInfo()
            this.$emit("Refresh");
        },
        GetPageInfo(){//获取分页页数和每页条数
            return this.pageInfo;
        },
        InitPageInfo(){//初始化分页信息
            this.pageInfo.page = 1,
            this.pageInfo.pageSize = 15;
        }
    },
    data() {
        return {
            pageInfo: {
                page: 1,
                pageSize: 15
            }
        };
    }
}
</script>
<style type="text/css">
.el-pagination button.disabled {
    color: #232121;
}

.block {
    text-align: center;
    /*padding-right: 8%;*/
    margin-top: 1%;
}
</style>
