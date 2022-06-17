<template>
  <div id="mapContainer">
    <SearchNotification />
    <MapControlsIcon :layerOpt="optionalLayersInfo" :layerBase="baseLayersInfo" @changeOpacity="changeOpacity" @fitTaiwan="fitTaiwan" @zoomin="zoomin" @zoomout="zoomout" />
    <div id="map" class="map" ref="mapContainer"></div>
    <div ref="mapInfoPopup" id="home">
      <mapInfoPopup v-show="$store.state.showInfo"/>
      <map-menu-popup v-show="$store.state.showMenu"/>
    </div>
    <v-snackbar 
      v-model="snackbar"
      light
      left
    >{{ snackbarText }}</v-snackbar>
    <v-footer 
      padless
      absolute
      color="transparent"
    >
      <v-col
        class="text-center"
        align-self="center"
        cols="12"
      >
        <span>
          {{ new Date().getFullYear() }} — <strong>農林航空測量所</strong> &nbsp;
        </span>
        <v-btn
          rounded
          small
        >
          {{ mousePosition }} <span class="grey--text">(EPSG:4326)</span>
        </v-btn>
        <span>
        </span>
      </v-col>
    </v-footer>
  </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import LayerGroup from 'ol/layer/Group';
import { Tile as TileLayer, Vector as VectorLayer, Graticule } from 'ol/layer';
import { OSM, Stamen, TileDebug, TileArcGISRest, TileWMS, Vector as VectorSource, Cluster } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style';
import { defaults, ScaleLine } from 'ol/control';
import Overlay from 'ol/Overlay';
import Feature from 'ol/Feature';
import { Circle, Point } from 'ol/geom';
import { toLonLat } from 'ol/proj';
import { toStringXY } from 'ol/coordinate';
import { getPointResolution } from 'ol/proj';
import { containsExtent } from 'ol/extent';
import MapInfoPopup from '../components/MapElements/MapInfoPopup.vue'
import MapMenuPopup from '@/components/MapElements/MapMenuPopup.vue';
import MapControlsIcon from '@/components/MapElements/MapControlsIcon.vue';
import SearchNotification from '../components/SearchResults/SearchNotification.vue';

export default {
  components: { MapInfoPopup, MapMenuPopup, MapControlsIcon, SearchNotification },
  data() {
    return {
      mapContainer: null,
      map: null,
      mapInfoOverlay: null,
      drawCircle: null,
      baseLayers: null,
      baseLayersInfo: [],
      optionalLayers: null,
      optionalLayersInfo: [],
      mousePosition: '0,0',
      vector: null,
      circleFeature: null,
      feature: null,
      radius: null,
      snackbarText: '地理屬性標記已清除！',
      snackbar: false,
      clusters: null,
      clusterFeatures: []
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
        visible: false,
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
      const scaleLine = new ScaleLine({
        units: 'metric',
        minWidth: 50
      });
      // DrawCircle
      this.vector = new VectorLayer({
        source: new VectorSource({}),
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255,0.5)'
          }),
          stroke: new Stroke({
            color: 'rgba(255, 0, 0, 0.8)',
            width: 2
          }),
        }),
      })
      // cluster map
      const count = 200;
      this.clusterFeatures = new Array(count);
      const e = 4500000;
      for (let i = 0; i < count; ++i) {
        const coordinates = [e * Math.random() / 2 + 2.8 * e, e * Math.random() / 2 + 0.3 * e];
        this.clusterFeatures[i] = new Feature(new Point(coordinates));
      }
      const clusterSource = new Cluster({
        source: new VectorSource({
          features: this.clusterFeatures,
        }),
      });
      const styleCache = {};
      this.clusters = new VectorLayer({
        source: clusterSource,
        style: function (feature) {
          const size = feature.get('features').length;
          let style = styleCache[size];
          if (!style) {
            style = new Style({
              image: new CircleStyle({
                radius: 10,
                stroke: new Stroke({
                  color: '#fff',
                }),
                fill: new Fill({
                  color: '#3399CC',
                }),
              }),
              text: new Text({
                text: size.toString(),
                fill: new Fill({
                  color: '#fff',
                }),
              }),
            });
            styleCache[size] = style;
          }
          return style;
        },
      });

      this.map = new Map({
        layers: [ baseLayerGroup, optionalLayerGroup, this.clusters, this.vector ],
        target: 'map',
        view: new View({
          center: [13471657.33321689, 2725618.3248579176],
          zoom: 6,
        }),
        controls: defaults({zoom: false}).extend([scaleLine])
      })
      // this.map.addControl(new Attribution({
      //   collapsible: true
      // }))
    },
    changeOpacity(info) {
      this.optionalLayers.forEach( layer => {
        if (info.layerTitle === layer.get('title')) {
          layer.setOpacity(Number(info.layerOpacity))
        }
      })
    },
    zoomin() {
      this.map.getView().setZoom(this.map.getView().getZoom()+1)
    },
    zoomout() {
      this.map.getView().setZoom(this.map.getView().getZoom()-1)
    },
    fitTaiwan() {
      this.map.getView().fit([13003979.213346737, 2448310.2757384996, 14032671.756348401, 2979709.662656437])
    },
  },
  mounted() {
    this.initMap()
    this.mapInfoOverlay = new Overlay({
      element: this.$refs.mapInfoPopup,
      positioning: 'bottom-center',
      offset: [-45,0]
    })
    this.map.on('click', (e) => {
      this.vector.getSource().clear()
      this.$store.state.showInfo = true
      this.$store.state.showMenu = false
      this.map.addOverlay(this.mapInfoOverlay)
      this.mapInfoOverlay.setPosition(e.coordinate)
      this.$store.state.clickedCoordinateX = e.coordinate[0]
      this.$store.state.clickedCoordinateY = e.coordinate[1]
      this.$store.state.clickedPositionX = this.map.getSize()[0]/2
      this.$store.state.clickedPositionY = this.map.getSize()[1]/2
      this.circleFeature = new Feature({
        geometry: new Circle(e.coordinate,50*1000/getPointResolution('EPSG:3857', 1, e.coordinate))
      })
      this.vector.getSource().addFeature(this.circleFeature)
      this.clusterFeatures.forEach(feature => {
        console.log(containsExtent(this.circleFeature.getGeometry().getExtent(), feature.getGeometry().getExtent() ))
      })
    })
    this.map.on('pointermove', e => {
      this.mousePosition = toStringXY(toLonLat(e.coordinate),2)
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
          this.$store.state.homeMap.selectedOptionalLayers = []
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
          } else {
            layer.setVisible(false)
            layer.setOpacity(1)
            this.optionalLayersInfo.forEach(item => {
              if (item.title===layer.get('title'))
              item.opacity = 1
            })
          }
        })
      }
    ),
    this.$store.watch(
      state => state.homeMap.updateRadius,
      (newValue, oldValue) => {
        switch (newValue) {
          case 0:
            this.radius = 50
            break;
          case 1:
            this.radius = 100
            break;
          case 2:
            this.radius = 200
            break;
          case 3:
            this.radius = 500
            break;
          case 4:
            this.radius = 1000
            break;
          case 5:
            this.radius = 1500
            break;
        }
        const center = this.circleFeature.getGeometry().getCenter()
        this.circleFeature.getGeometry().setRadius(this.radius*1000/getPointResolution('EPSG:3857', 1, center))
      }
    ),
    this.$store.watch(
      state => state.showMenu,
      (newValue, oldValue) => {
        if (newValue===false) {
          this.vector.getSource().clear()
          this.$store.state.homeMap.updateRadius = 0
          this.snackbar = true
        }
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
#mapContainer {
  position: relative;
}
#mapContainer .v-expansion-panels {
  position: absolute;
  width: 30%;
}
</style>