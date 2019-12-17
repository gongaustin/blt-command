<template>
    <div>
        <el-select v-model="selectId" clearable :change="GetSelectData()">
            <el-option v-for="item in result" :label="item.text" :value="item.id">
            </el-option>
        </el-select>
    </div>
</template>
<script>
export default {
    mounted() {
            this.ajax({
                url: this.url,
                success: function(data) {
                    console.log(data);
                    // this.$parent.form.model[this.dataId] = this.selectId = data[0].id
                    this.$parent.form.model[this.dataVal] = this.GetTileByIdForSelectBox(this.result, this.selectId);
                    this.result = data;
                }
            });
        },
        props: ['id', 'dataId', 'dataVal', 'url'],
        data() {
            return {
                result: [],
                selectId: null
            }
        }, methods: {
            GetSelectData() {
                this.$parent.form.model[this.dataId] = this.selectId;
                this.$parent.form.model[this.dataVal] = this.GetTileByIdForSelectBox(this.result, this.selectId);
            }
        }, watch: {
            id: function(newVal) {
                this.selectId = newVal;
            },
            selectId(val){
                for(let i = 0; i < this.result.length; i++){
                    if(this.result[i].id == val){
                        this.$emit('sure',this.result[i].text)
                        break;
                    }
                }
            }
        }
}
</script>
<style>
.el-select {
    width: 180px;
}
</style>
