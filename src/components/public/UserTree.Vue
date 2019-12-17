<template>
    <div  style="width:420px;height:100px;">
      <el-tabs v-model="activeTabs" @tab-click="cutTabs">
          <el-tab-pane label="按系统组织" name="sysTree">
              <el-tree :data="sysUser" show-checkbox node-key="id" ref="systree" highlight-current :props="defaultProps"  style="height:420px;width:240px;overflow:scroll;">
              </el-tree>
          </el-tab-pane>
          <el-tab-pane label="按项目组织" name="proTree">
              <el-tree :data="proUser" show-checkbox node-key="id" ref="protree" highlight-current :props="defaultProps"  style="height:420px;width:240px;overflow:scroll;">
              </el-tree>
          </el-tab-pane>
        <el-tab-pane label="按人员角色" name="StaffTree">
          <el-tree :data="staffUser" show-checkbox node-key="id" ref="stafftree" highlight-current :props="defaultProps"  style="height:420px;width:240px;overflow:scroll;">
              </el-tree>
        </el-tab-pane>
      </el-tabs>
      <div class="buttons" style="float: right;height: 45px;padding-top: 10px;">
        <el-button @click="closeDialog">确定</el-button>
      </div>
    </div>
</template>
<style scoped>
  .el-tree--highlight-current{
    overflow: auto !important;
    width:auto !important;
  }
</style>
<script>
  export default {
    data() {
      return {
        //userData: {},
        sysUser:[],
        proUser:[],
        staffUser:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        activeTabs:"sysTree",
      };
    },
    mounted(){
      //获取用户树形列表
      this.ajax({
      // url: 'Api/SystemStaff/GetStaffOrgsTree?userId=2CC6E65B-C9D9-46FF-8FAD-86DE289C83F3',
      //url: 'Api/SystemStaff/GetStaffTree?staffId='+this.CurrentUser.staffId,
      url: 'Api/SystemStaff/GetStaffTree?staffId='+eval("(" + sessionStorage.getItem('CurrenUser') + ")").staffId,
      success: function(data) {
          if(data.sysTreeList.length>0) {
            this.sysUser = data.sysTreeList;
          }
          if(data.proTreeList.length>0) {
            this.proUser = data.proTreeList;
          }
          if(data.staffRoleTree.length>0) {
            this.staffUser = data.staffRoleTree;
          }
      }
    });
    },
    methods: {
      closeDialog()
      {
        this.$emit("DailogOp", false);
        this.$emit("checkUser",  this.resultNode());
      },
      cutTabs(tab,event)
      {
        //重置为未选择状态
        if(this.activeTabs=="sysTree")    
        {
          this.$refs.protree.setCheckedKeys([]);
          this.$refs.stafftree.setCheckedKeys([]);
        }
        else if(this.activeTabs=="proTree")
        {
          this.$refs.systree.setCheckedKeys([]);
          this.$refs.stafftree.setCheckedKeys([]);
        }
        else if(this.activeTabs=="StaffTree")
        {
          this.$refs.protree.setCheckedKeys([]);
          this.$refs.systree.setCheckedKeys([]);
        }        
        this.activeTabs=tab.name;
        this.$emit("checkUser", []);
      },
      resultNode()
      {
        //处理选中的数据
        if(this.activeTabs=="sysTree")    
        {
          return this.$refs.systree.getCheckedNodes();
        }
        else if(this.activeTabs=="proTree")
        {
          return this.$refs.protree.getCheckedNodes();
        }
        else if(this.activeTabs=="StaffTree")
        {
          return this.$refs.stafftree.getCheckedNodes();
        }
      }
    }
  };
</script>

