<template id="tipsSelPro">
    <div style="margin-top:12px;float:left;">
        <!--当前用户所在所有的项目-->
        <!--<el-popover ref="selectPop" placement="bottom-start" trigger="click" @show="loadProjectList">-->
        <el-select v-model="value" placeholder="请选择项目" @change="selected" id="ff">
            <el-option v-for="(item,index) in proList" :label="item.projectName" :value="item.id">
            </el-option>
        </el-select>
        <!--</el-popover>-->
        <!--<el-button v-popover:selectPop class="navbar-minimalize minimalize-styl-2 btn btn-primary tipSelProButton">
            <i class="fa fa-bars"></i>
        </el-button>-->
    </div>
</template>
<style scoped>
.tipSelProButton {
    margin: 15px 15px !important;
    border: 1px solde #18a689 !important;
    background-color: #18a689 !important;
    color: #fff !important;
    width: 40px;
    height: 32px;
}
</style>
<script>
export default {
    name: 'tipsSelPro',
    data() {
        //数据
        return {
            cureentUser: eval("(" + sessionStorage.getItem('CurrenUser') + ")"), //当前登录用户对象
            proList: null,
            value: '',
        }
    },
    mounted() {
        //初始化
        this.loadProjectList();
    },
    methods: {
        //操作
        loadProjectList() {
            this.ajax({
                //url:"Api/SystemProject/GetPorjectByUserId?staffId=null",//?staffId="+this.cureentUser.satffId
                url: "Api/SystemProject/GetPorjectList", //?staffId="+this.cureentUser.satffId
                type: "get",
                success: function(data) {
                    //返回数据
                    this.proList = data;
                    if (data.length > 0) {
                        if (sessionStorage.getItem('selProjectId') != null) {
                            this.value = sessionStorage.getItem('selProjectId');
                        } else {
                            this.value = data[0].id;
                        }
                    }
                }
            });
        },
        selected(value) {
            $("#selProId").val(value);
            $("#selProId").focus();
            //sessionStorage.removeItem('selProjectId');
            if (value != sessionStorage.getItem('selProjectId')) {
                sessionStorage.setItem('selProjectId', value);
                this.eventBus.$emit('ChangeProject');
            }
        }
    },
    watch: {
        //数据监听
    }
}
</script>
