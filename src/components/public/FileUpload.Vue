<template>
    <div style="width:500px;height: 280px;">
      <el-upload
        class="upload-demo"
        v-bind:action="actionUrl"
        :on-preview="handlePreview"
        :on-success="onsuccess"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
      </el-upload>
      <!--<el-button type="primary">关闭</el-button>-->
    </div>
</template>
<style>
</style>
<script>
    export default {
        name: '',
        data () {
            return {
              actionUrl:"http://192.168.2.88:1772/Api/CommonFile/SaveFile?userId="+this.CurrentUser.id
            }
        },
      methods:{
            onsuccess(response, file, fileList)
            {
              this.$emit("fileSuccess", response);
            }
      }
    }
</script>
