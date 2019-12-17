<template>
    <li :class="show?'activeColor':''" @click="show=!show">
        <a class="J_menuItem" href="javascript:;">
            <slot name="title"></slot>
        </a>
    </li>
</template>
<script>

export default {
    props: ['index'],
    data() {
        return {
            show: false
        }
    },
    watch: {
        show(newval) {
            if (newval == true) {
                this.eventBus.$emit('third-change', this)
                this.$router.replace(this.index)
            }

        }
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.activeColor>a {
    color: #fff;
}
</style>
