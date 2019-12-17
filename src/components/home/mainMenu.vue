<template>
	<ul class="nav" id="side-menu">
		<!-- 一级路由 -->
		<nav-first v-for="el,index in $router.options.routes" :key="index" :children="el.meta.onlyOne? undefined : el.children && el.children.length > 0" :ico="el.ico" :index="el.meta.onlyOne?el.path  + '/' + (el.children && el.children.length > 0 && el.children[0].path) : el.path" v-if="!el.hiddenMenu">
			<template slot="title" v-if="showNamebol">
				{{el.meta.showName}}
			</template>
			<nav-second :id='item.path' v-for="item,secondIndex in el.children" :key="secondIndex" :children="item.children && item.children.length > 0" v-if="!item.hiddenMenu && !el.meta.onlyOne" :index="el.path + '/' + item.path">
				<template slot="title" v-if="showNamebol">
					{{item.meta.showName}}
				</template>
				<nav-third v-if="item.children && item.children.length && !element.hiddenMenu" :key="thirdIndex" v-for="element, thirdIndex in item.children" :index="el.path + '/' + item.path + '/' + element.path">
					<template slot="title" v-if="showNamebol">{{element.meta.showName}}</template>
				</nav-third>
			</nav-second>
		</nav-first>
		<!-- 两级路由 -->
		<!--             <nav-first children>
                <template slot="title">姓名</template>
                <nav-second>
                    <template slot="title">姓名2</template>
                </nav-second>
            </nav-first> -->
		<!-- 三级路由 -->
		<!--             <nav-first children>
                <template slot="title">姓名</template>
                <nav-second children>
                    <template slot="title">姓名2</template>
                    <nav-third>
                        <template slot="title">姓名3</template>
                    </nav-third>
                </nav-second>
            </nav-first> -->
	</ul>
</template>
<script>
	import navFirst from './navFirst.vue'
	import navSecond from './navSecond.vue'
	import navThird from './navThird.vue'
	import store from '@/components/store/Store'
	import {
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		components: {
			navFirst,
			navSecond,
			navThird
		},
		data() {
			return {
				showNamebol: true,
			}
		},
		computed: {
			...mapState(['routeState']),
		},
		watch: {
			routeState: function() {
				this.showNamebol = this.routeState;
			}
		},
		mounted() {
			//判断当前路由处于哪一个菜单下，对应的菜单显示
			this.init();
			this.eventBus.$on('all-change', () => {
				this.init()
			})
			this.eventBus.$on('change', el => { //同级显示隐藏
				this.$children.forEach(item => {
					// console.log(el);
					if(item != el) {
						item.show = false
						item.$children.forEach(element => {
							element.show = false
							element.$children.forEach(child => { //三级高亮隐藏
								child.show = false
							})
						})
					}
				})
			})
			this.eventBus.$on('second-change', el => { //二级高亮隐藏
				this.$children.forEach(item => {
					item.$children.forEach(element => {
						element.show = false
						element.$children.forEach(child => { //三级高亮隐藏
							child.show = false
						})
					})
				})
				el.show = true
			})
			//后面路由有三级再处理
			this.eventBus.$on('third-change', el => { //三级高亮隐藏
				this.$children.forEach(item => {
					item.$children.forEach(element => {
						// element.show = false
						element.$children.forEach(child => { //三级高亮隐藏
							child.show = false
						})
					})
				})
				el.show = true
			})
		},
		methods: {
			init() {
				let path = this.$route.path
				this.$children.forEach(el => { //循环json，第一级菜单
					if(el.$children && el.$children.length > 0) {
						el.$children.forEach(item => { //第二级菜单循环
							//                      if (item.$children && item.$children.length > 0) {
							//                          item.$children.forEach(element => { //第三级菜单循环
							//                              if (element.index == path) {
							//                                  this.$nextTick(() => {
							//                                      element.show = true
							//                                  })
							//                                  element.$parent.show = true
							//                                  element.$parent.$parent.show = true
							//                              }
							//                          })
							//                      } else { //只存在二级菜单
							//                          if (item.index == path) {
							//                              item.show = true
							//                              item.$parent.show = true
							//                          }
							//                      }
							if(item.index == path) {
								item.show = true
								item.$parent.show = true
							}
						})
					} else { //只存在一级菜单
						el.index == path ? el.show = true : ''
					}
				})
			}
		}
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.nav {
		height: 100%;
		/*overflow:hidden;*/
		/*width: 220px;*/
		overflow-y: auto;
		padding-bottom: 60px;
	}
	/* .nav::-webkit-scrollbar-track{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    border-radius: 10px;
    background-color: #f5f5f5;
    }*/
	/*定义滑块，内阴影及圆角*/
	
	.nav::-webkit-scrollbar-thumb {
		/*width: 10px;*/
		height: 20px;
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 6px rgba(213, 217, 222, .1);
		/*background-color: ;*/
	}
</style>