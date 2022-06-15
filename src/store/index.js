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
    clickedCoordinateX: 0,
    clickedCoordinateY: 0,
    clickedPositionX: 0,
    clickedPositionY: 0,
    showMenu: false,
    homeMap: {
      currentBaseLayer: 'OSM Standard',
      selectedOptionalLayers: [],
      updateRadius: 0,
    },
    cartProgress: 1,
    itemsToBuy: [
      {
        filename: "Frozen Yogurt",
        image: 159,
        shootingdate: 2022/1/1,
        cloudrate: 24,
        formatStatus: [
          {id:1 , pricing: 600, label: '紙圖', checked: false, quantity: 0},
          {id:2 , pricing: 1200, label: '實體檔案', checked: true, quantity: 1},
        ]
      },
      {
        filename: "Eclair",
        image: 159,
        shootingdate: 2022/1/1,
        cloudrate: 24,
        formatStatus: [
          {id:1 , pricing: 600, label: '紙圖', checked: true, quantity: 1},
          {id:2 , pricing: 1200, label: '實體檔案', checked: true, quantity: 2},
        ]
      },
      {
        filename: "95204027_081128d_Yogurt",
        image: 159,
        shootingdate: 2022/1/1,
        cloudrate: 24,
        formatStatus: [
          {id:1 , pricing: 600, label: '紙圖', checked: false, quantity: 0},
          {id:2 , pricing: 1200, label: '實體檔案', checked: true, quantity: 1},
        ]
      },
      {
        filename: "95204027_081128d_27",
        image: 159,
        shootingdate: 2022/1/1,
        cloudrate: 24,
        formatStatus: [
          {id:1 , pricing: 600, label: '紙圖', checked: true, quantity: 1},
          {id:2 , pricing: 1200, label: '實體檔案', checked: true, quantity: 2},
        ]
      },
      {
        filename: "95204027_081128d_27~0126_rgb",
        image: 159,
        shootingdate: 2022/1/1,
        cloudrate: 24,
        formatStatus: [
          {id:1 , pricing: 600, label: '紙圖', checked: false, quantity: 0},
          {id:2 , pricing: 1200, label: '實體檔案', checked: true, quantity: 2},
        ]
      },
      {
        filename: "95204027_091030d_27~0107_rgb",
        image: 159,
        shootingdate: 2022/1/1,
        cloudrate: 24,
        formatStatus: [
          {id:1 , pricing: 600, label: '紙圖', checked: true, quantity: 1},
          {id:2 , pricing: 1200, label: '實體檔案', checked: true, quantity: 2},
        ]
      },
    ],
    freight: 0,
    cartBadge: 0,
    orderedInfo: {}
  },
  getters: {
    getCartSubtotal (state) {
      let subtotal = 0
      state.itemsToBuy.forEach(item => {
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
