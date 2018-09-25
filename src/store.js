import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loading: true
    },
    mutations: {
        changeLoading(state, status) {
            console.log('mutation', status)
            state.loading = status;
        }
    },
    actions: {

    }
});