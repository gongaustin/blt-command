<template>
    <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.page" :page-sizes="pageSizes" :page-size="pageInfo.pageSize" layout="total,  jumper" :total="totalNum">
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
            this.$parent.pageInfo = JSON.parse(JSON.stringify(this.pageInfo));
            this.$emit("Refresh");
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
    text-align: right;
    padding-right: 8%;
    margin-top: 1%;
}
</style>
