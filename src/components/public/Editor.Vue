<template>
  <div class="rtf-content"  style="height:280px;width:98%;">
    <quill-editor v-model="newsContent"  style="height:240px;" ></quill-editor>
  </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor';
export default {
  data: function(){
    return {
      newsContent:"",
    }
  },
  components: {
    quillEditor
  },
  methods: {
    ClearNewsContent(){
      this.newsContent = "";
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #quill-container {
    height: 280px;
  }
</style>
