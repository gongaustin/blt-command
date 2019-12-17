<template id="systemUserNews">
    <div>
        <!--左侧内容-->
        <div style="width:70%;float: left;height: 100%;">
            <div style="height: 100%;">
                <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane name="first" class="inner-container">
                        <span slot="label" v-if="noreadtotalnum">
               <i class="el-icon-information"></i> 未读({{noreadtotalnum}})
            </span>
                        <span slot="label" v-if="!noreadtotalnum">
               <i class="el-icon-information"></i> 未读({{noreadtotal}})
            </span>
                        <div>
                            <el-button type="primary" @click="settingRead">标记为已读</el-button>
                            <el-button @click="allSettingRead">全部标记为已读</el-button>
                        </div>
                        <!--未读消息列表-->
                        <el-input placeholder="标题" v-model="searchFrom.title" style="margin-top:10px;">
                            <el-button slot="append" icon="search" @click="queryList(1,'title')"></el-button>
                        </el-input>
                        <template>
                            <el-table :data="noreadList" @selection-change="changeFun" height="655">
                                <el-table-column type="selection" width="55">
                                </el-table-column>
                                <el-table-column prop="title"  show-overflow-tooltip  width="180" label="消息标题">
                                </el-table-column>
                                <el-table-column prop="content" show-overflow-tooltip label="消息内容">
                                </el-table-column>
                                <el-table-column prop="createTime" label="日期" width="180">
                                </el-table-column>
                                <el-table-column fixed="right"  width="150" label="操作">
                                    <template scope="row">
                                        <el-button @click="readDetail(row)" type="text" size="small">阅读</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                        <div class="page" v-show="searchnoreadtotal">
                            <el-pagination :current-page.sync="noreadpage" :page-size="searchFrom.pageSize" @size-change="noreadpagehandleSizeChange" @current-change="noreadpageChange" layout="total,prev, pager, next,jumper" :total="searchnoreadtotal">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="second" class="inner-container">
                        <span slot="label">
              <i class="el-icon-message"></i> 全部({{readtotal}})
            </span>
                        <!--全部消息列表-->
                        <el-input placeholder="标题" v-model="searchFrom.title">
                            <el-button slot="append" icon="search" @click="queryList(0,'title')"></el-button>
                        </el-input>
                        <template v-if="secondBol">
                            <el-table :data="AllList" height="700">
                                <el-table-column prop="title" show-overflow-tooltip width="180" label="消息标题">
                                </el-table-column>
                                <el-table-column prop="content" show-overflow-tooltip label="消息内容">
                                </el-table-column>
                                <el-table-column prop="createTime" label="日期" width="180">
                                </el-table-column>
                                <el-table-column fixed="right" width="150" label="操作">
                                    <template scope="row">
                                        <el-button @click="readDetail(row)" type="text" size="small">阅读</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                        <div class="page" v-show="searchreadtotal">
                            <el-pagination :current-page.sync="readpage" :page-size="searchFrom.pageSize" @size-change="readpagehandleSizeChange" @current-change="readpageChange" layout="total,prev, pager, next,jumper" :total="searchreadtotal">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="third" class="inner-container">
                        <span slot="label">
              <i class="el-icon-document"></i> 已发送({{sendtotal}})
            </span>
                        <!--已读消息列表-->
                        <el-input placeholder="标题" v-model="searchFrom.title">
                            <el-button slot="append" icon="search" @click="queryList(2,'title')"></el-button>
                        </el-input>
                        <template v-if="thirdBol">
                            <el-table :data="sendList" height="700">
                                <el-table-column prop="title" show-overflow-tooltip width="180" label="消息标题">
                                </el-table-column>
                                <el-table-column prop="content" show-overflow-tooltip label="消息内容">
                                </el-table-column>
                                <el-table-column prop="createTime" label="日期" width="180">
                                </el-table-column>
                                <el-table-column fixed="right" width="150" label="操作">
                                    <template scope="row">
                                        <el-button @click="readsendDetail(row)" type="text" size="small">阅读</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                        <div class="page" v-show="searchsendtotal">
                            <el-pagination :current-page.sync="sendpage" :page-size="searchFrom.pageSize" @size-change="sendpagehandleSizeChange" @current-change="sendpageChange" layout="total,prev, pager, next,jumper" :total="searchsendtotal">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <!--右侧内容-->
        <div style="width:30%;float: left" v-show="showDetail">
            <!--添加或详细-->
            <h1 style="font-size: 20px;padding-top: 20px;padding-bottom: 20px;font-weight: 900" class="titleClass">{{noticeTitle}}</h1>
            <hr/>
            <pre style="margin-top: 20px;text-indent:20px;font-size: 14px;padding-bottom: 20px;height:60%;overflow:hidden;overflow-y:auto">{{noticeContent}}</pre>
            <hr/>
            <div style="float:right;margin-right: 30px;margin-top:10px;">{{noticedDate}}</div>
            <div style="clear:both">
                <el-button type="info" v-if="ishandle" style="float:right;margin-right: 50px;margin-top:10px" @click="toHandle">前往处理</el-button>
            </div>
        </div>
    </div>
</template>
<style>
</style>
<script>
import {
    mapMutations,
    mapState
} from 'vuex'
import store from '@/components/store/Store'
export default {
    data() {
            return {
                noreadList: [], //未读消息
                AllList: [], //全部，
                sendList: [], //已读
                showDetail: false,
                noreadtotal: 0, //未读总条数
                searchnoreadtotal: 0, //查询未读总条数
                readtotal: 0, //已读总条数
                searchreadtotal: 0, //查询已读总条数
                sendtotal: 0, //已发送总条数
                searchsendtotal: 0, //查询已发送总条数
                thirdBol: true,
                secondBol: true,
                activeName: "first",
                noticeTitle: "", //消息体标题
                noticeContent: "", //消息内容
                noticedDate: "", //消息体日期
                handelType: 0, //跳转处理的type 条件
                noreadpage: 1,
                readpage: 1,
                sendpage: 1,
                widthBol: false, //为了使表格数据显示正确
                ishandle:true,
                searchFrom: {
                    title: "",
                    page: 1, //页码
                    pageSize: 16, //每页条数
                    type: 0,
                },
                msgList:[]
            }
        },
        computed: {
            ...mapState(['noreadtotalnum']),
        },
        watch: {
            noreadtotalnum: function() {
                this.queryList(0);
            }
        },
        mounted() {
            this.queryList(0);
            this.queryList(1);
            this.queryList(2);
        },
        methods: {
            changeFun(val){
                this.msgList = val
            },
            settingRead() {
                var list = this.msgList.map(function(item){return item.id})
                this.ajax({
                    type:'post',
                    url: "SystemMessageUser/SettingRead",
                    data:{idItems:list.join(',')}
                }).then(data => {
                    this.noreadtotal = this.noreadtotal - 1;
                    this.queryList(1);
                    // Vue.prototype.noreadtotal = this.noreadtotal;
                });            },
            allSettingRead() {
                this.ajax({
                    url: "SystemMessageUser/AllSettingRead"
                }).then(data => {
                    this.noreadtotal = this.noreadtotal - 1;
                    this.queryList(1);
                    // Vue.prototype.noreadtotal = this.noreadtotal;
                });
            },
            readDetail(row) {
                this.noticeTitle = row.row.title;
                this.noticeContent = row.row.content;
                this.showDetail = true;
                this.noticedDate = row.row.createTime;
                this.handelType = row.row.messageType;
                 this.ishandle=true;
                if (row.row.isLook == false) {
                    this.ajax({
                        type: "post",
                        url: "SystemMessageUser/ReadMessage",
                        data: {
                            id: row.row.id
                        },
                    }).then(data => {
                        this.noreadtotal = this.noreadtotal - 1;
                        this.queryList(1);
                        // Vue.prototype.noreadtotal = this.noreadtotal;
                    });
                }
            },
            readsendDetail(row) {
                console.log(row);
                this.noticeTitle = row.row.title;
                this.noticeContent = row.row.content;
                this.showDetail = true;
                this.noticedDate = row.row.createTime;
                this.handelType = row.row.messageType;
                this.ishandle=false;
            },
            handleClick(tab) {
                this.searchFrom.title = undefined;
                this.showDetail = false;
                if (tab.name == "first") {
                    this.searchFrom.page = 1;
                    this.noreadpage = 1;
                    this.queryList(1);

                } else if (tab.name == "second") {
                    console.log(this.readpage);
                    this.searchFrom.page = 1;
                    this.readpage = 1;
                    this.queryList(0);
                    this.secondBol = true;
                } else {
                    this.searchFrom.page = 1;
                    this.sendpage = 1;
                    this.queryList(2);
                    this.thirdBol = true;
                }
            },

            /*查询数据*/
            queryList(type, searchtitle) {
                /*如果是点击查询，页码初始化为1*/
                this.searchFrom.type = type;
                // if (type && this.searchFrom.page != 1) {
                //         this.searchFrom.page = 1
                //          return false
                //    }
                // this.searchFrom.projectId=this.projectId;
                // console.log(this.searchFrom);
                this.ajax({
                    type: "get",
                    url: "SystemMessageUser/QueryMessage",
                    data: this.searchFrom,
                }).then(data => {
                    console.log(data);
                    console.log(searchtitle);
                    if (type == 1) {
                        if (!searchtitle) {
                            // console.log('11111111');
                            this.noreadtotal = data.total;
                            store.commit("NOTICENUM", this.noreadtotal);
                        }
                        this.searchnoreadtotal = data.total;
                        this.noreadList = data.row;
                    } else if (type == 0) {
                        if (!searchtitle) {
                            this.readtotal = data.total;
                        }
                        this.searchreadtotal = data.total;
                        this.AllList = data.row;
                    } else {
                        if (!searchtitle) {
                            this.sendtotal = data.total;
                        }
                        this.searchsendtotal = data.total;
                        this.sendList = data.row;
                    }
                })
            },
            /*未读页码改变查询数据*/
            noreadpageChange(val) {
                this.searchFrom.page = val
                    // this.searchFrom.pageSize = this.readpageSize
                this.queryList(1)
            },
            //未读页码显示
            noreadpagehandleSizeChange() {
                this.searchFrom.page = val
                    // this.searchFrom.pageSize = this.readpageSize
                this.queryList(1)
            },
            /*已读页码改变查询数据*/
            readpageChange(val) {
                this.searchFrom.page = val
                console.log(this.searchFrom);
                this.queryList(0)
            },
            //已读页码显示
            readpagehandleSizeChange() {
                this.searchFrom.page = val
                    // this.searchFrom.pageSize = this.readpageSize
                this.queryList(0)
            },
            /*已发送页码改变查询数据*/
            sendpageChange(val) {
                this.searchFrom.page = val
                this.queryList(2)
            },
            //已发送页码显示
            sendpagehandleSizeChange() {
                this.searchFrom.page = val
                this.queryList(2)
            },
            //前往处理事件
            toHandle() {
                console.log(this.handelType);
                if (this.handelType == "1") {
                    this.$router.push("/backlog/backlogList");
                } else if (this.handelType == "2") {
                    this.$router.push("/contract/backlogContract");
                } else if (this.handelType == "3") {
                    this.$router.push("/construction/constructionList");
                } else if (this.handelType == "5") {
                    this.$router.push("/backlog/depositRefund");
                } else {
                    this.$router.push("/informationPublish/backlogInformationPublish");
                }
            }
        },
}
</script>
<style scoped>
.titleClass {
    display: flex;
    justify-content: center;
}
</style>
