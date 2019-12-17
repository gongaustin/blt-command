<template>
	<li :class="show?'active':''">
		<a href="javascript:;" @click="routergo">
			<slot name="title">
			</slot>
			<el-badge is-dot class="item">
				<span class="fa arrow" v-if="children != undefined">
				</span>
			</el-badge>
		</a>
		<transition @enter="enter" v-on:before-enter="beforeEnter" @leave="leave">
			<ul class="nav nav-third-level collapse" v-show="show">
				<slot></slot>
			</ul>
		</transition>

	</li>
</template>
<script>
	import navThird from './navThird.vue'
	import {
		addClass,
		removeClass
	} from '../../util/dom.js'
	export default {
		props: ['children', 'index'],
		components: {
			navThird
		},
		data() {
			return {
				show: false
			}
		},
		watch: {
			show(newval) {
				if(newval == true) {
					this.eventBus.$emit('second-change', this)
					if(!this.children) {
						this.$router.replace(this.index)
					}
				}
			}
		},
		methods: {
			routergo() {
				console.log(this.index)
				this.show = !this.show;
				this.$router.replace(this.index)
			},
			beforeEnter(el) {
				addClass(el, 'my-collapse-transition');
				if(!el.dataset) el.dataset = {};

				el.dataset.oldPaddingTop = el.style.paddingTop;
				el.dataset.oldPaddingBottom = el.style.paddingBottom;

				el.style.height = '0';
				el.style.paddingTop = 0;
				el.style.paddingBottom = 0;
			},

			enter(el) {
				el.dataset.oldOverflow = el.style.overflow;
				if(el.scrollHeight !== 0) {
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
				if(!el.dataset) el.dataset = {};
				el.dataset.oldPaddingTop = el.style.paddingTop;
				el.dataset.oldPaddingBottom = el.style.paddingBottom;
				el.dataset.oldOverflow = el.style.overflow;

				el.style.height = el.scrollHeight + 'px';
				el.style.overflow = 'hidden';
			},

			leave(el) {
				if(el.scrollHeight !== 0) {
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
<style scoped lang="less">
	.nav-second-level>li a {
		height: inherit !important;
	}
	
	.el-badge{
		display: none;
	}
</style>