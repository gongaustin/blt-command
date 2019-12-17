<template>
    <div style="margin-top:50px;" class="tidi-tip">
        <el-popover ref="popover4" placement="bottom-end" width="300" trigger="click" style="padding:0;">
            <div class="dtidi" style="width:100%;border-bottom: 1px solid #ccc;height: 35px;line-height:35px;font-size:16px;background:#03ab89;color:#fefefe;padding-left:2px;">
                <span style="padding-left:10px;">通知内容</span><span style="padding-left:190px;">
          <i class="el-icon-check" title="全部标记为已读" @click="clearTidi"></i>
        </span>
            </div>
            <div style="width:100%;height:auto;">
                <ul style="max-height:345px;overflow: auto;width:560px;min-height:30px;" id="tidiList">
                    <li style="margin-left:110px;line-height:15px;margin-top:8px;" nodate="true">- 没有新消息 -</li>
                </ul>
                <!--@click="showTidi"-->
                <router-link class="tidiMore" to="SystemUserNews">
                    查看全部
                </router-link>
            </div>
        </el-popover>
        <el-button v-popover:popover4 style="margin-top:-50px;margin-top: -50px;background: #eeeeee;border: none;" @click="toggleBlink"><i class="fa fa-bell" style="color:#999c9e;" id="tidiBlink"></i>
            <span class="label label-primary" style="position: absolute;top:13px;margin-left:-12px;font-size:10px;padding:1px 5px;line-height:12px;" id="tidiCount">0</span>
        </el-button>
    </div>
</template>
<style lang="less">
.tidi-tip {
    .el-popover {
        padding: 0px !important;
    }
    .popper__arrow {
        top: -10px !important;
    }
    /*.dtidi{

  }*/
    .tidiListli {
        display: block;
        height: 70px;
        border-bottom: 1px solid #eee;
        margin-right: 260px;
        background: #fff;
        color: #7d8289;
        margin-top: 2px;
        width: 300px;
    }
    .tidiListli:hover {
        background: #f7f7f7;
    }
    .tidiListA {
        color: #1b1c1c;
        font-size: 14px;
    }
    .tidiListLiTitle {
        padding-left: 10px;
        font-size: 14px;
        padding-top: 4px;
        /*padding:5px;*/
        /*white-space:nowrap;overflow:hidden;text-overflow:ellipsis;*/
    }
    .tidiListLiUser {
        width: auto;
        float: right;
        padding-right: 10px;
        text-align: right;
    }
    .tidiListLiContent {
        text-indent: 2em;
        padding: 1px;
        line-height: 22px;
        height: 45px;
        padding-left: 10px;
        word-wrap: break-word;
        padding-right: 10px;
        /*white-space:nowrap;overflow:hidden;text-overflow:ellipsis;*/
    }
    .tidiListLiTimea {
        float: right;
        text-align: right;
        height: 20px;
        margin-top: -18px;
        padding-right: 12px;
    }
    .tidiListLiTimeb {
        padding-right: 2px;
        margin-top: 16px;
    }
    .tidiMore {
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
        float: right;
        background: #f7f7f7;
        text-align: center;
        width: 100%;
        line-height: 15px;
        padding: 13px 0px;
        z-index: 99999;
        position: absolute;
        border-top: 1px solid #eee;
        color: #505966;
    }
    .tidiMore:hover {
        background: #f1f1f1;
        text-decoration: none;
    }
}
</style>
<script>
export default {
    methods: {
        toggleBlink: function() {
            var tdNum = $("#tidiCount").text();
            if (tdNum == 0) {
                $("#tidiCount").text(0);
                $("#tidiList").html("");
                $("#tidiList").append("<li style='margin-left:110px;line-height:15px;margin-top:8px;'  nodate='true'>- 没有新消息 -</li>");
            }
            $("#tidiBlink").removeClass("blink");
        },
        clearTidi: function() {
            window.chat.server.reviewNews(window.newsIds, window.newsUserList);
            $("#tidiCount").text(0);
            $("#tidiList").html("");
            $("#tidiList").append("<li style='margin-left:110px;line-height:15px;margin-top:8px;'  nodate='true'>- 没有新消息 -</li>");
            $("#tidiBlink").removeClass("blink");
        }
    },
    data() {
        return {
            //tNum:window.tidiCount,//消息数量
            //dt:window.tidiDataJson
        };
    }
}
</script>
