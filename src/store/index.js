import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    map: {
      currentProjection: "EPSG:4326",
      currentBaseLayer: "OSM Standard",
      baseLayerOpacity: 1,
      selectedOptionalLayers: [],
      selectedMapControls: [],
      selectedinteraction: 'Draw',
      selectedDrawType: 'LineString',
      selectedAddtional: ['Measure'],
      selectedVectorLayer: 'Cluster'
    },
    showNavDrawer: false,
    showInfo: false,
    clickedCoordinate: null,
    clickedPositionX: 0,
    clickedPositionY: 0,
    showMenu: false,
    homeMap: {
      currentBaseLayer: 'OSM Standard',
      selectedOptionalLayers: [],
      updateRadius: 2,
    },
    search: false,
    searchExpend: [],
    searchResults: [],
    showMiniCart: false,
    itemsInMiniCart: [],
    cartProgress: 1,
    itemsInCart:[],
    orderedInfo: {},
    freight: 0,
  },
  getters: {
    getCartSubtotal (state) {
      let subtotal = 0
      state.itemsInCart.forEach(item => {
        let itemTotal = item.formatStatus.reduce((acc, cur) => {
          acc += cur.quantity*cur.pricing
          return acc
        },0 )
        subtotal += itemTotal
      })
      return subtotal
    },
    getCartTotal (state, getters) {
      return getters.getCartSubtotal + state.freight
    },
    cartBadge (state) {
      return state.itemsInCart.length
    }
  },
  mutations: {
    TOGGLE_showNavDrawer(state) {
      state.showNavDrawer = !state.showNavDrawer
    }
  },
  actions: {
  },
  modules: {
  }
})
