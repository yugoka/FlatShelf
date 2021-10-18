import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isSideMenuShown: false
  },
  mutations: {
    toggleSideMenu(state, sideBarStatus) {
      state.isSideMenuShown = sideBarStatus
    },
  },
  actions: {
    //dispatchとかはいらないのでcontext.commitだけ引数に取る
    toggleSideMenu({ commit, state }, sideBarStatus = null ) {
      if (sideBarStatus === null || sideBarStatus === undefined) {
        commit('toggleSideMenu', !state.isSideMenuShown);
      } else {
        commit('toggleSideMenu', sideBarStatus);
      }
    }
  }
})

export default store