<template>
    <div class="view-box">
        <div class="view-box-header">
            <b>{{title}}</b>
        </div>
        <div class="view-box-content">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    props: ['title'],
}
</script>
<style lang="less" scoped>
.view-box {
    height: 100%;
}

.view-box-header {
    background-color: #fff;
    border-color: #e7eaec;
    -webkit-border-image: none;
    -o-border-image: none;
    border-image: none;
    border-style: solid solid none;
    border-width: 4px 0 0;
    color: inherit;
    margin-bottom: 0;
    height: 48px;
    border-bottom: 1px solid #e7eaec;
    text-indent: 30px;
    b {
        display: inline-block;
        font-size: 14px;
        padding: 0;
        text-overflow: ellipsis;
        float: left;
        line-height: 44px;
    }
}

.view-box-content {
    height: calc(~"100% - 48px");
    overflow: scroll;
    width: 100%;
    padding: 15px;
}
</style>
