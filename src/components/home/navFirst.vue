    <template>
    <li :class="show?'active':''">
        <a href="javascript:;" @click="showAll">
        <i :class="['fa', ico?ico:'fa-flask']" ></i> 
        <span class="nav-label">
            <slot name="title"></slot>
        </span>
        <!-- <span v-show="showNameicon"> -->
        <span class="fa arrow" v-show="showNameicon" v-if="children != undefined">
        <!-- </span> -->
        </span>
        </a>
        <transition v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter" v-on:before-leave="beforeLeave" v-on:leave="leave" v-on:after-leave="afterLeave" >
            <ul class="nav nav-second-level" v-show="show">
                <slot @selected="selectedBack" v-if="showNameicon"></slot>
            </ul>
        </transition>
    </li>
</template>
<script>
import navSecond from './navSecond.vue'
import store from '@/components/store/Store'
import {
    mapMutations,
    mapState
} from 'vuex'
import {
    addClass,
    removeClass
} from '../../util/dom.js'
export default {
    props: ['children', 'index','ico'],
    components: {
        navSecond
    },
    data() {
        return {
            showNameicon:true,
            show: false,
        }
    },
    computed:{
         ...mapState(['routeState']),
    },
    watch: {
         routeState:function(){
            this.showNameicon= this.routeState;
            // this.show= this.routeState;
        },
        show(newval) {
            if (newval == true) {
                // console.log(this);
                this.eventBus.$emit('change', this)
                if (!this.children) {
                    this.$router.replace(this.index)
                }
            }
        }
    },
    methods: {
        //点击菜单展开
        showAll(){
            // console.log(1234214);
            this.show=!this.show;
            store.commit("ROUTESTATE", true);
        },
        beforeEnter(el) {
            addClass(el, 'my-collapse-transition');
            if (!el.dataset) el.dataset = {};
            el.dataset.oldPaddingTop = el.style.paddingTop;
            el.dataset.oldPaddingBottom = el.style.paddingBottom;
            el.style.height = '0';
            el.style.paddingTop = 0;
            el.style.paddingBottom = 0;
        },
        enter(el) {
            el.dataset.oldOverflow = el.style.overflow;
            if (el.scrollHeight !== 0) {
                el.style.height = el.scrollHeight + 'px';
                el.style.paddingTop = el.dataset.oldPaddingTop;
                el.style.paddingBottom = el.dataset.oldPaddingBottom;
            } else {
                el.style.height = '';
                el.style.paddingTop = el.dataset.oldPaddingTop;
                el.style.paddingBottom = el.dataset.oldPaddingBottom;
            }
            el.style.overflow = 'hidden';
        },

        afterEnter(el) {
            // for safari: remove class then reset height is necessary
            removeClass(el, 'my-collapse-transition');
            el.style.height = '';
            el.style.overflow = el.dataset.oldOverflow;
        },

        beforeLeave(el) {
            if (!el.dataset) el.dataset = {};
            el.dataset.oldPaddingTop = el.style.paddingTop;
            el.dataset.oldPaddingBottom = el.style.paddingBottom;
            el.dataset.oldOverflow = el.style.overflow;

            el.style.height = el.scrollHeight + 'px';
            el.style.overflow = 'hidden';
        },

        leave(el) {
            if (el.scrollHeight !== 0) {
                // for safari: add class after set height, or it will jump to zero height suddenly, weired
                addClass(el, 'my-collapse-transition');
                el.style.height = 0;
                el.style.paddingTop = 0;
                el.style.paddingBottom = 0;
            }
        },

        afterLeave(el) {
            removeClass(el, 'my-collapse-transition');
            el.style.height = '';
            el.style.overflow = el.dataset.oldOverflow;
            el.style.paddingTop = el.dataset.oldPaddingTop;
            el.style.paddingBottom = el.dataset.oldPaddingBottom;
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.my-collapse-transition {
    transition: 0.3s;
}
</style>
