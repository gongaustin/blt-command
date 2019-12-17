<template>
    <div>
        <el-tooltip class="item" effect="dark" :content="text" placement="top-start" v-if="text.length > this.textLength">
            <span class="desc" :style="{ width:textWidth + 'px'}">
                {{text.substr(0,textLength) + '...'}}
                </span>
        </el-tooltip>
       <!--  <span v-if="text.length" style="width:90px;float:left;margin-right:15px;line-height:15px;margin-top:6px">
            {{this.text}}:
        </span> -->
        <span class="desc center" :style="{ width:textWidth + 'px'}" v-else>
                {{text}}
        </span>
    </div>
</template>
<script>
export default {
    props: {
        /*显示的文本值*/
        text: {
            default: '',
            type: String
        },
        /*显示文本字符串的最大长度，超过即隐藏*/
        textLength: {
            default:6,
            type: Number
        },
        /*是否显示':'分号*/
        semicolon: {
            default: false,
            type: Boolean
        },
        /*文本盒子的最大宽度*/
        textWidth: {
            default: '90px',
            type: String
        }
    }
}
</script>
<style lang="less" scoped>
span.desc {
    width:90px;
    display: inline-block;
    float: left;
    // margin-right: 8px;
}

span.desc.center {
    text-align: justify;
    text-justify: distribute-all-lines;
    /*ie6-8*/
    text-align-last: justify;
    /* ie9*/
    -moz-text-align-last: justify;
    /*ff*/
    -webkit-text-align-last: justify;
    /*chrome 20+*/
    height: 36px;
    // overflow: hidden;
}

@media screen and (-webkit-min-device-pixel-ratio:0) {
    /* chrome*/
    span.desc.center:after {
        content: ".";
        display: inline-block;
        width: 100%;
        overflow: hidden;
        height: 0;
    }
}
</style>
