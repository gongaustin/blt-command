<template>
    <div class="show-table">
        <div class="show">
            <div class="ibox float-e-margins">
                <div class="ibox-title">
                    <h5>{{title}}</h5>
                    <a class="btn btn-primary btn-sm pull-right m-t-1" v-if="showButton != undefined ">
                        <el-button type="success" @click="$router.back()">返回</el-button>
                    </a>
                </div>
                <div class="ibox-content own-week">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['title','showButton']
}
</script>
<style scoped lang="less">
.ibox-title {
    border: none;
    border-color: #e7eaec;
    border-image: none;
    border-style: solid solid none;
    border-width: 4px 0 0;
    margin-bottom: 0;
    padding: 14px 15px 7px;
    min-height: 36px;
}

.show-table {
    width: 100%;
    position: relative;
    height: 100%;
    background: #fff;
    .show {
        height: 100%;
        width: 100%;
        background: #fff;
        overflow-y: auto;
        overflow-x: hidden;
        .ibox{
            height:  calc(~"100% - 60px");
            height: -webkit-calc(~"100% - 60px");
            position: relative;
        }
        h5 {
            color: rgb(103, 106, 108);
            line-height: 36px;
        }
    }
}
</style>
