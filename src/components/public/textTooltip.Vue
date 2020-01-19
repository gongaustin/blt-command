<template>
    <div>
    <!--     <el-tooltip class="item" effect="dark" :content="text" placement="top-start" v-if="text.length > this.textLength">
            <span class="desc" :style="{ width:textWidth + 'px'}">
                {{text.substr(0,textLength) + '...'}}
                </span>
        </el-tooltip> -->
        <span v-if="text.length > this.textLength" style=" width:150px;float:left;line-height:15px; padding-right:10px;margin-top:6px;text-align:right;font-size:14px;">
            {{this.text}}:
        </span>
        <span class="desc center spanWidth" style="font-size:14px" v-else>
                {{text}}{{semicolon == false?':':''}}
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
            default: '30%',
            type: String
        }
    },
    filters: {
          capitalize: function (val) {
            // console.log(val);
            if (val==2){
                return 'letter-spacing:6px'
            }
            else if (val==3){
                return 'letter-spacing:5px'
            }
            else if (val==4){
               return 'letter-spacing:4px'
             }
            else if(val==5){
                return 'letter-spacing:1px'
             }else if(val==6){
                 return "letter-spacing:0px"
             }
         }
        }

}
</script>
<style lang="less" scoped>
// span.desc {
//     // width:90px;
//     display: inline-block;
//     float: left;
//     margin-right: 5px;
// }
// // .letterSpace{
// //     letter-spacing:2px;
// // }
 .spanWidth{
    display:inline-block;
    width:100px;
    float:left;
    text-align:right;
    padding-right:10px;
    height: 36px;
    line-height:36px;
    font-weight: bold;
 }
// span.desc.center {
//     text-align: justify;
//     text-justify: distribute-all-lines;
//     /*ie6-8*/
//     text-align-last: justify;
//     /* ie9*/
//     -moz-text-align-last: justify;
//     /*ff*/
//     -webkit-text-align-last: justify;
//     /*chrome 20+*/
//     height: 36px;

//     line-height:36px;
//     // overflow: hidden;
// }

// @media screen and (-webkit-min-device-pixel-ratio:0) {
//     /* chrome*/
//     // span.desc.center:after {
//     //     content: ".";
//     //     display: inline-block;
//     //     width: 100%;
//     //     overflow: hidden;
//     //     height: 0;

//     // }
// }
</style>
