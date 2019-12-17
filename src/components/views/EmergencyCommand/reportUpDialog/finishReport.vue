<template>
  <el-form
    ref="form"
    :model="formdata"
    style="width:100%;height: 100%;"
    label-width="100px"
    label-position="right"
  >
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="block">
          <el-form-item label="综合评分：">
            <el-input-number
              v-model="formdata.grade"
              placeholder="请输入分数(0-100)"
              :max="100"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="意见：">
            <el-input type="textarea" :rows="3" placeholder="请输入意见" v-model="formdata.opinion"></el-input>
          </el-form-item>
        </div>
      </el-col>
    </el-row>
    <el-form-item style="margin-top: 30px">
      <el-button style="width:120px" type="primary" @click="OnSubmit">确定</el-button>
      <el-button style="width:120px" @click="Hiden">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  components: {},
  mounted() {},
  props: ["showDialogId"],
  data() {
    return {
      formdata: {
		grade: 100,
		opinion: ''
      }
    };
  },
  methods: {
    OnSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          var data = {
            id: this.showDialogId,
			score: this.formdata.grade,
			opinion: this.formdata.opinion
          };
          this.ajax({
            url: "reported/upper/end",
            type: "post",
            data: data,
            success: function(data) {
              this.Hiden();
            }
          });
        } else {
          return false;
        }
      });
    },
    Hiden() {
      this.ClearData();
      this.$parent.$parent.showFinish = false;
      this.$parent.$parent.getReportDetail();
    },
    ClearData() {
      this.formdata.grade = 100;
    }
  },
  watch: {}
};
</script>
<style>
.el-rate__icon {
  font-size: 36px !important;
}
</style>
