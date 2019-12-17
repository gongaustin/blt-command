<template>
    <div id="app" class="scrollHidden"  >
        <transition name="slide-fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>

export default {
    name: 'app',
    data(){
        return{
            loading:"",
        }
    },
    mounted(){
        //加载中监听
        this.eventBus.$on('loadstart', () => {
            this.loading = this.$loading({
              lock: true,
              spinner: 'el-icon-loading',
              background:'rgba(0, 0, 0, 0.7)',
              text: '拼命加载中...',
              customClass:'loadClass',
            });
        })
        this.eventBus.$on('loadover', () => {
            setTimeout(() => {
                  this.loading.close();
                }, 200);

        })


        //     //加载中监听
        // this.eventBus.$on('loadstart', () => {
        //     this.loading = true
        // })
        // this.eventBus.$on('loadover', () => {
        //     setTimeout(() => { //同步请求load关不掉，所以定时器
        //         this.loading = false
        //     }, 100)
        // })
    },
    data() {
        return {
            loading: false
        }
    }
}
// string 布尔 number undefined null
</script>
<style lang="less">
@import './assets/css/init.css';
html,
body,
#app {
    height: 100%;
    background-color: #f3f3f4;
}
.loadClass{
    background:rgba(0, 0, 0, 0.7) !important;
}
.el-upload-list__item {
    transition: all .5s cubic-bezier(.55, 0, .1, 1);
    font-size: 14px;
    color: #48576a;
    line-height: 1.2;
    // margin-top: 5px;
    box-sizing: border-box;
    border-radius: 4px;
    width: 100%;
    position: relative;
    top: -10px;
}

// .el-upload-list{
//     margin: 0;
//     padding: 0;
//     list-style: none;
//     margin-top: -15px;
// }
.scrollHidden {
    overflow: hidden;
}

.el-loading-mask {
    left: 0 !important;
    top: 0 !important;
    height: 100% !important;
    width: 100% !important;
}

.slide-fade-enter-active {
    transition: all 0.3s ease;
    transform: scale(1);
}

.slide-fade-leave {
    transform: scale(1);
}

.slide-fade-leave-active {
    transition: all .3s ease;
    transform: scale(0.5);
}

.slide-fade-enter {
    transform: scale(0.5);
}

.show-table table {
    border-collapse: collapse;
    width: 100%;
}

.show-table table tbody tr td,
.show-table table tbody tr th {
    background: #ffffff;
    vertical-align: middle;
    border: 1px solid #eee;
    border-collapse: collapse;
    padding: 5px;
}

.the-overflow .el-table__body-wrapper {
    overflow-x: hidden;
}

// 分页设置
.page {
    text-align: center;
    margin-top: 20px;
}

.big-area {
    margin-top: 15px;
    // padding: 5px;
    >span {
        display: inline-block;
        width: 110px;
        float: left;
        line-height: 30px;
        // text-indent: 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    >.big-area-input {
        width: 100%;
        padding-left: 100px;
    }
}

// .public-form {
//     .el-form-item__error {
//         left: 110px;
//         .el-select {
//             width: 100%;
//         }
//     }
// }

/* dialog显示样式 */

.bordered {
    border-top: dotted 1px black;
    border-bottom: solid 2px black;
}

.diglog-info {
    .content {
        // margin-bottom: 10px;
        line-height: 36px;
        &:after {
            content: ".";
            display: block;
            height: 0;
            clear: both;
            visibility: hidden;
        }
        // div.desc-input {
        //     overflow: hidden;
        //     height: 100%;
        // }
    }
}


/* 自适应输入框 */

// ul.input {
//     >li {
//         height: 60px;
//         .el-form-item__content >span {
//             float: left;
//             width: 110px;
//             line-height: 36px;
//             display: block;
//             // text-indent: 5px;
//             overflow: hidden;
//             white-space: nowrap;
//             text-overflow: ellipsis;
//         }
//         .box {
//             width: 100%;
//             padding-left: 110px;
//         }
//     }
// }
// @media (min-width: 1351px) {
//     ul.input {
//         float: left;
//         width: 100%;
//         >li {
//             float: left;
//             width: 20%;
//             padding: 0 0px 0px 15px;
//         }
//     }
// }
// @media (max-width: 1350px) {
//     ul.input {
//         >li {
//             float: left;
//             width: 33.3% !important;
//             padding: 0 5px;
//         }
//     }
// }
// @media (max-width: 1100px) {
//     ul.input {
//         >li {
//             float: left;
//             width: 50% !important;
//             padding: 0 5px;
//         }
//     }
// }
// @media (max-width: 900px) {
//     ul.input {
//         >li {
//             float: left;
//             width: 100% !important;
//             padding: 0 5px;
//         }
//     }
// }
@media (max-width: 1360px) {
   .textareaClass {
    display: block !important;
    float: left !important;
    width: 60% !important;
    height: 40px !important;
 }
 .desc-input{
    width: 60% !important;
 }
}
@media (min-width: 1361px) {
   .textareaClass {
    display: block !important;
    float: left !important;
    width: 60% !important;
    height: 40px !important;
}
 .desc-input{
    width: 60% !important;
 }

}
//  .textareaClass {
//     display: block !important;
//     float: left !important;
//     width: 70% !important;
//     height: 40px !important;
// }
.el-dialog--small {
    min-width: 800px !important;
    min-height: 680px !important;
}

.el-dialog--large {
    min-width: 1200px !important;
    min-height: 700px !important;
    width: 80%;
}

.el-table th>.cell {
    font-weight: 600;
}

.el-checkbox__inner {
    width: 14px !important;
    height: 14px !important;
}

.el-tag .el-icon-close {
    right: 10px !important;
}

.ivu-timeline-item-content {
    padding: 1px 1px 10px 24px !important;
    top: 0px !important;
}

.wrap .right-box[data-v-ab11b82a] {
    padding-top: 5px !important;
}

.el-table__fixed-right .el-table__fixed-body-wrapper,
.el-table__fixed-right .el-table__fixed-footer-wrapper,
.el-table__fixed-right .el-table__fixed-header-wrapper {
    border-right: 1px solid #dfe6ec !important;
}
</style>
