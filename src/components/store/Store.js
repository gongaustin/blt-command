import Vuex from 'vuex'
import Vue from "vue";
Vue.use(Vuex);
var NOTICENUM = "NOTICENUM";
var NOTICEFUC = "NOTICEFUC";
var ROUTESTATE = "ROUTESTATE";
 var store =  new Vuex.Store({
    state: {
        noreadtotalnum:0,
        noticefuc:function(){},
        routeState:true,
    },
    mutations:{
        [NOTICENUM](state, data) {
            state.noreadtotalnum = data;
            console.log(state.noreadtotalnum);
        },
        [ROUTESTATE](state, data) {
            state.routeState = data;
            console.log(state.routeState);
        }
    },

});
export {store as default};