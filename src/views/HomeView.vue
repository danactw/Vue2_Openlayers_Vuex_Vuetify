<template>
  <div id="home">
    <SelectLayer :layerOpt="optionalLayersInfo" :layerBase="baseLayersInfo" @changeOpacity="changeOpacity" />
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
import { Tile as TileLayer, Graticule } from 'ol/layer';
import LayerGroup from 'ol/layer/Group';
import { OSM, XYZ, Stamen, TileDebug, TileArcGISRest, TileWMS } from 'ol/source';
import Overlay from 'ol/Overlay';
import Circle from 'ol/geom/Circle';
import { Stroke } from 'ol/style';
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
      drawCircle: null,
      baseLayers: null,
      baseLayersInfo: [],
      optionalLayers: null,
      optionalLayersInfo: []
    }
  },
  methods: {
    initMap() {
      // Base Layers
      const OSMStandard = new TileLayer({
        source: new OSM(),
        visible: true,
        opacity: 1,
        zIndex: 0,
        title: "OSM Standard",
        label: "開放街圖",
        img: 'https://picsum.photos/id/11/150/150',
        description: '是自由而且開源的全球地圖，於2004年由英國的 Steve Coast 發起，採用類似 Wiki 的協作編輯以及開放的授權與格式。'
      });
      const StamenWater = new TileLayer({
        source: new Stamen({
            layer: "watercolor"
        }),
        visible: false,
        opacity: 1,
        zIndex: 0,
        title: "OSM Humanitarian",
        label: "水彩風地圖",
        img: 'https://picsum.photos/id/11/150/150',
        description: '類手工繪製的風格地圖，整體以暖色調為主軸，應用了高亮度筆刷和不規則邊緣呈現出紙張的紋理。'
      });
      this.baseLayers = [ OSMStandard, StamenWater ]
      const baseLayerGroup = new LayerGroup({
          layers: this.baseLayers
      });
      this.baseLayers.forEach( layer=> {
        this.baseLayersInfo.push({title: layer.get('title'), label: layer.get('label'), img: layer.get('img'), description: layer.get('description')})
      })
      // Optional Layers
      const ATIS_MNC = new TileLayer({
        source: new TileWMS({
          url: 'https://gis.afasi.gov.tw/map/viewMap/wms',
          params: {
            LAYERS: 'ATIS_MNC',
            FORMAT: 'image/gif',
            VERSION: '1.1.0'
          },
          transition: 0
        }),
        visible: false,
        opacity: 1,
        title: "ATIS_MNC",
        label: "全臺鑲嵌無雲正射影像",
        img: 'https://picsum.photos/id/11/150/150',
        description: '應用5000圖幅框與正射影像詮釋資料進行「雲量」、「拍攝日期」條件式空間比對之成果，將各圖幅最新版次及無雲之正射影像拼接而成的主題圖組。'
      })
      const tileDebug = new TileLayer({
        source: new TileDebug(),
        visible: true,
        opacity: 1,
        zIndex: 0,
        title: "Tile Debug",
        label: "Tile Debug",
        img: 'https://picsum.photos/id/11/150/150',
        description: 'Tile Debug'
      });
      const tileArcGIS = new TileLayer({
        source: new TileArcGISRest({
          url: "https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Population_World/MapServer"
        }),
        visible: false,
        opacity: 1,
        zIndex: 0,
        title: "Tile ArcGIS",
        label: "Tile ArcGIS",
        img: 'https://picsum.photos/id/11/150/150',
        description: 'Tile ArcGIS'
      });
      const graticule = new Graticule({
        // the style to use for the lines, optional.
        strokeStyle: new Stroke({
          color: 'rgba(255,120,0,0.9)',
          width: 2,
          lineDash: [0.5, 4],
        }),
        visible: false,
        opacity: 1,
        zIndex: 0,
        showLabels: true,
        wrapX: false,
        title: 'Graticule',
        label: "Graticule",
        img: 'https://picsum.photos/id/11/150/150',
        description: 'Graticule'
      })
      this.optionalLayers = [ ATIS_MNC, tileDebug, tileArcGIS, graticule ]
      const optionalLayerGroup = new LayerGroup({
          layers: this.optionalLayers
      });
      this.optionalLayers.forEach( layer => {
        this.optionalLayersInfo.push({title: layer.get('title'), label: layer.get('label'), img: layer.get('img'), description: layer.get('description'), opacity: layer.get('opacity')})
      })
      this.drawCircle = new Circle({

      })
      this.map = new Map({
        layers: [ baseLayerGroup, optionalLayerGroup ],
        target: 'map',
        view: new View({
          center: [13471657.33321689, 2725618.3248579176],
          zoom: 6,
        }),
      })
    },
    changeOpacity(info) {
      this.optionalLayers.forEach( layer => {
        if (info.layerTitle === layer.get('title')) {
          layer.setOpacity(Number(info.layerOpacity))
        }
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
    ),
    // switch Base Layer
    this.$store.watch(
      state => state.homeMap.currentBaseLayer,
      (newValue, oldValue) => {
        this.map.getLayerGroup().getLayersArray().forEach(layer => {
          layer.setVisible(layer.get('title') === newValue)
        })
      },
    );
    // toggle Optional Layers
    this.$store.watch(
      state => state.homeMap.selectedOptionalLayers,
      (newValue, oldValue) => {
        this.optionalLayers.forEach(layer => {
          if (newValue.includes(layer.get('title'))) {
            layer.setVisible(true)
            layer.setOpacity(1)
            this.optionalLayersInfo.forEach(item => {
              if (item.title===layer.get('title'))
              item.opacity = 1
            })
          } else layer.setVisible(false)
        })
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