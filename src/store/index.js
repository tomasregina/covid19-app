import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
let sortingFunc = (a,b) => {
  const countryA = a.Country;
  const countryB = b.Country;

  let comparison = 0;
  console.log('a,b', countryA, countryB);
  if (countryA > countryB) {
    comparison = 1;
  }
  else if (countryA < countryB) {
    comparison = -1;
  }
  return comparison;
}
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    allData: [],
    countries: undefined
  },
  mutations: {
    setData (state, data) {
      state.allData.push(data)
    },
    clearData (state) {
      state.allData = []
    },
    getAllCountries (state, countries) {
      state.countries = countries;
    }
  },
  actions: {
    setData({ commit }, data) {
      commit('setData', data)
    },
    clearData({ commit }) {
      commit('clearData')
    },
    getAllCountries({ commit }) {
      Axios.get('https://api.covid19api.com/countries')
        .then(res => {
          const sortedCountries = (res.data).sort(this.sortingFunc);
          console.log('sorted', sortedCountries);
          commit('getAllCountries', sortedCountries);
        })

    }
  },
  getters: {
    getAllData(state) {
      return state.allData;
    },
    getAllCountries(state) {
      return state.countries;
    }
  },
  modules: {
  }
})
