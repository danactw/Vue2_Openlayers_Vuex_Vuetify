<template>
  <div id="home">
    <SelectLayer/>
    <div id="map" class="map" ref="mapContainer"></div>
    <div ref="mapInfoPopup" id="home">
      <mapInfoPopup v-show="$store.state.showInfo"/>
      <map-menu-popup v-show="$store.state.showMenu"/>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer } from 'ol/layer';
import { OSM, Vector as VectorSource, TileWMS } from 'ol/source'
import Overlay from 'ol/Overlay';
import Circle from 'ol/geom/Circle';
import MapInfoPopup from '../components/MapInfoPopup.vue'
import MapMenuPopup from '@/components/MapMenuPopup.vue';
import SelectLayer from '@/components/SelectLayer.vue';

export default {
  components: { MapInfoPopup, MapMenuPopup, SelectLayer },
  data() {
    return {
      mapContainer: null,
      map: null,
      mapInfoOverlay: null,
      drawCircle: null
    }
  },
  methods: {
    initMap() {
      this.drawCircle = new Circle({

      })
      this.map = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          })
        ],
        target: 'map',
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      })
    }
  },
  mounted() {
    this.initMap()
    this.mapInfoOverlay = new Overlay({
      element: this.$refs.mapInfoPopup,
      positioning: 'bottom-center',
      offset: [-45,0]
    })
    this.map.on('click', (e) => {
      this.$store.state.showInfo = true
      this.$store.state.showMenu = false
      this.map.addOverlay(this.mapInfoOverlay)
      this.mapInfoOverlay.setPosition(e.coordinate)
      this.$store.state.clickedCoordinateX = e.coordinate[0]
      this.$store.state.clickedCoordinateY = e.coordinate[1]
      this.$store.state.clickedPositionX = this.map.getSize()[0]/2
      this.$store.state.clickedPositionY = this.map.getSize()[1]/2
    })
  },
  created() {
    this.$store.watch(
      state => state.showMenu,
      (newValue,oldValue) => {
        const X = this.$store.state.clickedCoordinateX
        const Y = this.$store.state.clickedCoordinateY
        if (newValue===true) this.map.getView().setCenter([X, Y])
      }
    )
  }
}
</script>

<style scoped>
.map {
  width: 100vw;
  height: calc(100vh - 55px);
  overflow: hidden;
}
#home {
  position: relative;
}
</style>