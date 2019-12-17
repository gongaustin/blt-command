<template>
    <div class='pageDiv'>
        <el-select v-model="pageInfo.pageSize" placeholder="请选择" style="width:70px">
            <el-option v-for="item in pageSizes" :label="item.num" :value="item.num">
            </el-option>
        </el-select>
        <el-button type="primary" icon="arrow-left" @click="PrePage"></el-button>
        <el-radio-group v-model="pageInfo.page" class='currentPageClass'>
            <el-radio-button v-for="item in pages" :label="item.pageNum"></el-radio-button>
        </el-radio-group>
        <el-button type="primary" icon="arrow-right" @click="NextPage"></el-button>
    </div>
</template>
<script>
export default {
    mounted() {
            //this.RefreshPage();
        },
        props: ['totalNum'],
        data() {
            return {
                pageInfo: {
                    page: 1,
                    pageSize: 15
                },
                oldPageInfo: {
                    page: 1,
                    pageSize: 15
                },
                pages: []
            }
        },
        methods: {
            RefreshPage() {
                this.pages = [];
                let pageTotal = parseInt(this.totalNum / this.pageInfo.pageSize) + ((this.totalNum % this.pageInfo.pageSize) > 0 ? 1 : 0);

                if (this.pageInfo.page >= 4 && pageTotal > 5) {
                    this.pages.push({
                        pageNum: 1
                    });
                    if (this.pageInfo.page >= 5) {
                        this.pages.push({
                            pageNum: "..."
                        });
                    }
                }
                let pageData = this.GetPage(this.pageInfo.page,pageTotal);
                for (let index = pageData.pre; index <= pageData.next; index++) {
                    this.pages.push({
                        pageNum: index
                    });
                }
                if (this.pages[this.pages.length - 1].pageNum != pageTotal) {
                    if (this.pages[this.pages.length - 1].pageNum != pageTotal - 1) {
                        this.pages.push({
                            pageNum: "...."
                        });
                    }
                    this.pages.push({
                        pageNum: pageTotal
                    });
                }
            },
            PrePage() {
                if (this.pageInfo.page > 1) {
                    this.pageInfo.page--;
                }
            },
            NextPage() {
                if (this.pageInfo.page < this.pages[this.pages.length - 1].pageNum) {
                    this.pageInfo.page++;
                }
            },
            GetPage(page,pageTotal) {
                let pre = page - 2;
                let next = page + 2;
                if (pre <= 0 || pageTotal <= 5) {
                    return {
                        pre: 1,
                        next: pageTotal <= 5?pageTotal:5
                    }
                } else if (next >= pageTotal) {
                    return {
                        pre: pageTotal - 4,
                        next: pageTotal
                    }
                }else{
                    return {
                        pre: pre,
                        next: next
                    }
                }
            },
            HandelePage() {
                if (this.oldPageInfo.pageSize != this.pageInfo.pageSize) {
                    this.pageInfo.page = 1;
                }
                if (this.$parent.pageInfo != undefined) {
                    this.$parent.pageInfo = JSON.parse(JSON.stringify(this.pageInfo));
                }
                this.oldPageInfo = JSON.parse(JSON.stringify(this.pageInfo));
                this.RefreshPage();
            }
        },
        watch: {
            totalNum: function(newVal) {
                this.RefreshPage();
            },
            pageInfo: {
                handler: function(newVal) {
                    if (this.pageInfo.page != "..." && this.pageInfo.page != "....") {
                        this.HandelePage();
                        this.$emit("Refresh");
                    }
                },
                deep: true
            }
        }
}
</script>
<style type="text/css">
.pageDiv {
    position: absolute;
    right: 0px;
    bottom: 5%;
    text-align: center;
    width: 100%;
}

.currentPageClass {
    position: relative;
    top: -5px;
}
</style>
