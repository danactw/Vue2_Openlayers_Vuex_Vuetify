<template>
  <div>
    <v-navigation-drawer app clipped>
      <v-list>        
        <v-list-group no-action sub-group>
          <template v-slot:activator>
            <v-list-item-title class="text-h6">Projection</v-list-item-title>
          </template>
          <v-list-item>
            <v-radio-group v-model="$store.state.map.currentProjection" >      
              <v-radio
                v-for="item in projectionsTitle"
                :key="item"
                :label="item"
                :value="item"
              ></v-radio>
            </v-radio-group>
          </v-list-item>
          <v-list-item v-show="$store.state.map.currentProjection==='EPSG:4326'">
            <v-list-item-content>
              <v-list-item-title class="text-subtitle-1">Center</v-list-item-title>
              <v-select
                class="mx-4 "
                v-model="currentCenter"
                :items="centerOptions"
                single-line
              ></v-select>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-group no-action sub-group>
          <template v-slot:activator>
            <v-list-item-title class="text-h6">Base Layer</v-list-item-title>
          </template>
          <v-list-item>
            <InputRadio 
              class="ml-2"
              :items="baseLayersTitle" 
              model="currentBaseLayer" 
            />
          </v-list-item>
          <v-list-item v-if="$store.state.map.currentBaseLayer === 'Bing Map'">
            <v-select
              class="mx-4"
              v-model="currentBingMap"
              :items="BingMapstyles"
              label="Bing Map"
              single-line
            ></v-select>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="block">Base Layer Opacity</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <LayerOpacity model="baseLayerOpacity"/>
          </v-list-item>
        </v-list-group>
        <v-list-group no-action sub-group v-show="$store.state.map.currentProjection==='EPSG:4326'">
          <template v-slot:activator>
            <v-list-item-title class="text-h6">Optional Layer</v-list-item-title>
          </template>
          <v-list-item @click="$store.state.map.selectedOptionalLayers = []">
            <v-list-item-icon>
              <v-icon v-text="'mdi-autorenew'"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'Clear All'"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
            <InputCheckbox 
              class="ml-4"
              v-for="(item, index) in optionalLayersTitle" 
              :key="index" 
              :item="item" 
              model="selectedOptionalLayers" 
              show="true" />
        </v-list-group>
        <v-list-group no-action sub-group>
          <template v-slot:activator>
            <v-list-item-title class="text-h6">Map Controls</v-list-item-title>
          </template>
          <v-list-item @click="$store.state.map.selectedMapControls = mapControlsName">
            <v-list-item-icon>
              <v-icon v-text="'mdi-autorenew'"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'Show All'"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <InputCheckbox 
            class="ml-4"
            v-for="(item, index) in mapControlsName" 
            :key="index" 
            :item="item" 
            model="selectedMapControls" 
            show="true"
          />
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <div id="map" class="map" ref="mapContainer"></div>
  </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Graticule } from 'ol/layer';
import LayerGroup from 'ol/layer/Group';
import { OSM, XYZ, BingMaps, Stamen, TileDebug, TileArcGISRest } from 'ol/source';
import { defaults, FullScreen, OverviewMap, ScaleLine, ZoomSlider, ZoomToExtent, Attribution } from 'ol/control';
import {register} from 'ol/proj/proj4';
import { Stroke } from 'ol/style';
import LayerOpacity from '@/components/LayerOpacity.vue'
import InputRadio from '@/components/InputRadio.vue';
import InputCheckbox from '@/components/InputCheckbox.vue';

export default {
  components: { LayerOpacity, InputRadio, InputCheckbox },
  data() {
    return {
      mapContainer: null,
      map: null,
      projections: [],
      projectionsTitle: [],
      projectionCenters: [],
      centerOptions: [],
      currentCenter: 'world',
      baseLayers: [],
      baseLayersTitle: [],
      BingMapstyles: [ 'RoadOnDemand', 'AerialWithLabelsOnDemand', 'CanvasDark' ],
      BingMaps: [],
      currentBingMap: 'RoadOnDemand',
      optionalLayers:[],
      optionalLayersTitle: [],
      mapControls: [],
      mapControlsName: []
    }
  },
  methods: {
    resetMapControls () {
      this.mapControls.forEach(control => {
        this.mapControlsName.push(control.constructor.name)
      })
      this.$store.state.map.selectedMapControls = this.mapControlsName.map(x=>x)
    },
    initMap () {
      // Projections
      proj4.defs("EPSG:3825","+proj=tmerc +lat_0=0 +lon_0=119 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
      proj4.defs("EPSG:3828","+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=aust_SA +units=m +no_defs");
      register(proj4)

      const view4326 = new View({
        center: [0,0],
        zoom: 2,
        projection: 'EPSG:4326',
        title: 'world'
      })
      const view3825 = new View({
        center: [449777.06920345523, 2627333.8306399807],
        zoom: 8,
        projection: 'EPSG:3825',
        extent: [-2999133.104097694, 964675.7340995013, 3315454.588596386, 4723103.034050384]
      })
      const view3828 = new View({
        center: [248543.19482292834, 2627444.4109558077],
        zoom: 8,
        projection: 'EPSG:3828',
        extent: [-2204326.3713591076, 1600739.6787269707, 2284692.1803829246, 4323813.554926154]
      })
      this.projections = [view4326, view3825, view3828]
      this.projections.forEach(projection => {
        this.projectionsTitle.push(projection.getProjection().getCode())
      })
      //Center & Extent
      const world = view4326
      const EU = new View({
        center: [13.485321538601092, 52.45287376584504],
        zoom: 6,
        projection: 'EPSG:4326',
        extent: [-20.29271371580824, 26.54340080769108, 53.84996605236901, 74.19590677224758],
        title: 'EU'
      })
      const US = new View({
        center: [-100.92362186261362, 38.13459946835709],
        zoom: 5,
        projection: 'EPSG:4326',
        extent: [-161.3272028668083, -8.82588222486288, -26.021063763766108, 77.91309264537576],
        title: 'US'
      })
      const China = new View({
        center: [106.5275015413533, 29.54261117376565],
        zoom: 5,
        projection: 'EPSG:4326',
        extent: [61.78506214514829, 6.01902547010458, 142.69036471860034, 57.383376800420855],
        title: 'China'
      })
      this.projectionCenters = [world, EU, US, China]

      this.projectionCenters.forEach(center => {
        this.centerOptions.push(center.get('title'))
      })
      // Base Layers
      const OSMStandard = new TileLayer({
        source: new OSM(),
        visible: true,
        opacity: 1,
        zIndex: 0,
        title: "OSM Standard"
      });
      const OSMHumanitarian = new TileLayer({
        source: new OSM({
            url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        }),
        visible: false,
        opacity: 0,
        zIndex: 0,
        title: "OSM Humanitarian"
      });
      const CartoDBBase = new TileLayer({
        source: new XYZ({
          url: "https://{1-4}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png",
          attributions: "@ CARTO"
        }),
        visible: false,
        opacity: 0,
        zIndex: 0,
        title: "CartoDB Base"
      });
      const StamenWater = new TileLayer({
        source: new Stamen({
            layer: "watercolor"
        }),
        visible: false,
        opacity: 0,
        zIndex: 0,
        title: "Stamen Water"
      });
      for (let i = 0; i < this.BingMapstyles.length ; i++ ) {
        this.BingMaps.push(
          new TileLayer({
            source: new BingMaps({
              key: "Ak6hRbflYvuARcql-hA_RTu20jkC6UQGDi4PLkJ1vOHrD30DD-1et3-N3DSohoPA",
              imagerySet: this.BingMapstyles[i]
            }),
            visible: false,
            opacity: 0,
            zIndex: 0,
            title: "Bing Map"
          })
        )
      }
      this.baseLayers = [OSMStandard, OSMHumanitarian, CartoDBBase, StamenWater, ...this.BingMaps ]
      const baseLayerGroup = new LayerGroup({
          layers: this.baseLayers
      });
      this.baseLayers.forEach(layer => {
        if (!this.baseLayersTitle.includes(layer.get('title'))) this.baseLayersTitle.push(layer.get('title'))
      })
      // Optional Layers
      const tileDebug = new TileLayer({
        source: new TileDebug(),
        visible: false,
        opacity: 0,
        zIndex: 0,
        title: "Tile Debug"
      });
      const tileArcGIS = new TileLayer({
        source: new TileArcGISRest({
          url: "https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Population_World/MapServer"
        }),
        visible: false,
        opacity: 0,
        zIndex: 0,
        title: "Tile ArcGIS"
      });
      const graticule = new Graticule({
        // the style to use for the lines, optional.
        strokeStyle: new Stroke({
          color: 'rgba(255,120,0,0.9)',
          width: 2,
          lineDash: [0.5, 4],
        }),
        visible: true,
        opacity: 0,
        zIndex: 0,
        showLabels: true,
        wrapX: false,
        title: 'Graticule'
      })
      this.optionalLayers = [ tileDebug, tileArcGIS, graticule ]
      const optionalLayerGroup = new LayerGroup({
          layers: this.optionalLayers
      });
      this.optionalLayers.forEach(layer => {
        this.optionalLayersTitle.push(layer.get('title'))
      })

      // Controls
      const attribution = new Attribution({
        collapsible: true
      });
      const fullScreen = new FullScreen({
        tipLabel: "Full Screen"
      });
      const overviewMap = new OverviewMap({
        collapsed: false,
        layers: [
          new TileLayer({
            source: new OSM(),
          })
        ],
        tipLabel: "Toggle Overview",
        rotateWithView: true,
      })
      const scaleLine = new ScaleLine({
        bar: true,
        text: true,
        steps: 2,
        minWidth: 100
      });
      const zoomSlider = new ZoomSlider();
      const zoomExtent = new ZoomToExtent();
      this.mapControls = [attribution, fullScreen, overviewMap, scaleLine, zoomSlider, zoomExtent]

      this.map = new Map({
        layers: [ baseLayerGroup, optionalLayerGroup ],
        target: 'map',
        view: view4326,
      })
    },
  },
  watch: {
    currentBingMap() {
      this.BingMaps.forEach(style => {
        style.setVisible(style.getSource().getImagerySet()===this.currentBingMap)
        style.setOpacity(1)
        this.$store.state.map.baseLayerOpacity = 1
      })
    },
    currentCenter() {
      this.projectionCenters.forEach(center => {
        if (this.currentCenter === center.get('title')) this.map.setView(center)
      })
    }
  },
  mounted() {
    this.initMap()
    this.resetMapControls()
  },
  created() {
    //switch Projection
    this.$store.watch(
      state => state.map.currentProjection,
      (newValue, oldValue) => {
        this.projections.forEach(projection => {
          const epsg = projection.getProjection().getCode()
          if (newValue === epsg) {
            this.map.setView(projection)
            this.$store.state.map.selectedOptionalLayers = []
            this.$store.state.map.baseLayerOpacity = 1
            this.currentCenter = 'world'
            if (newValue !== "EPSG:4326") {
              const index = this.$store.state.map.selectedMapControls.indexOf('OverviewMap')
              if (index !== -1) this.$store.state.map.selectedMapControls.splice(index, 1)
            } else this.$store.state.map.selectedMapControls = this.mapControlsName
          }
        })
      },
    );
    // change Base Layer Opacity
    this.$store.watch(
      state => state.map.baseLayerOpacity,
      (newValue, oldValue) => {
        this.map.getLayers().getArray()[0].getLayers().getArray().forEach(layer => {
          if (layer.get('title') === this.$store.state.map.currentBaseLayer) layer.setOpacity(newValue)
        })
      },
    );
    // switch Base Layer
    this.$store.watch(
      state => state.map.currentBaseLayer,
      (newValue, oldValue) => {
        this.map.getLayers().getArray()[0].getLayers().getArray().forEach(layer => {
          if (layer.get('title') === newValue) {
            if (layer.get('title') === 'Bing Map') {
              this.BingMaps.forEach(style => {
                style.setVisible(style.getSource().getImagerySet()==='RoadOnDemand')
                style.setOpacity(1)
              })
            } else {
              layer.setVisible(true)
              layer.setOpacity(1)
            }
            this.$store.state.map.baseLayerOpacity = 1
          } else layer.setVisible(false)
        })
      },
    );
    // toggle Optional Layers
    this.$store.watch(
      state => state.map.selectedOptionalLayers,
      (newValue, oldValue) => {
        this.optionalLayers.forEach(layer => {
          if (newValue.includes(layer.get('title'))) {
            layer.setVisible(true)
            layer.setOpacity(1)
          } else layer.setVisible(false)
        })
      }
    ),
    // select Map Controls to be displayed
    this.$store.watch(
      state => state.map.selectedMapControls,
      (newValue, oldValue) => {
        this.mapControls.forEach(control => {
          if (newValue.includes(control.constructor.name)) this.map.addControl(control)
          else this.map.removeControl(control)
        })
      }
    )
  }
}
</script>

<style>
.map {
  width: calc(100vw - 256px);
  height: calc(100vh - 55px);
  margin: auto;
}
/* to avoid the overviewMap overlay with the scaleLine*/
.ol-overviewmap.ol-unselectable.ol-control {
  bottom: 60px;
}
/* to eliminate the excessive padding for the v-list located in the sidebar*/
#app.v-application--is-ltr .v-list-group--sub-group .v-list-group__header{
  padding: 0;
}
#app.v-application--is-ltr .v-list-group--no-action.v-list-group--sub-group > .v-list-group__items > .v-list-item{
  padding-left: 10px;
}
</style>