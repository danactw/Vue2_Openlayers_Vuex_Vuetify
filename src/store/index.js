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
      selectedOptionalLayers: ['Tile Debug'],
    }
  },
  getters: {
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
