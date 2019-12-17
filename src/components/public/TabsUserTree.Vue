<template>
    <div >
     <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
  </el-tabs>
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
        userData: {},
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    mounted(){
      //获取用户树形列表
      this.ajax({
      url: 'Api/SystemStaff/GetStaffOrgsTree?userId=2CC6E65B-C9D9-46FF-8FAD-86DE289C83F3',
      success: function(data) {
          if(data.length>0) {
            this.userData = data;
          }
      }
    });
    },
    methods: {
      closeDialog()
      {
        this.$emit("DailogOp", false);
      },
      nodeCheckChange(data, checked, indeterminate)
      {
        if(!this.selectState) {
          this.selectState = true;
          var nodes=this.$refs.tree.getCheckedNodes(true);
          this.$emit("checkUser", nodes);
        }
        if(indeterminate==true&&data.attributes.isStaff==true)
        {
          var nodes=this.$refs.tree.getCheckedNodes(true);
          this.$emit("checkUser", nodes);
        }
        //取消选中
        if(!checked&&data.attributes.isStaff==true)
        {
          var nodes=this.$refs.tree.getCheckedNodes(true);
          this.$emit("checkUser", nodes);
        }

        if(checked&&indeterminate==false&&data.attributes.isStaff==true)
        {
          var nodes=this.$refs.tree.getCheckedNodes(true);
          this.$emit("checkUser", nodes);
        }
      }
    }
  };
</script>

