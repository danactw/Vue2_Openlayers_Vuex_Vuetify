<template>
  <div>
    <v-navigation-drawer app clipped>
      <v-list
        dense
        nav
      >
      <v-hover>
        <v-subheader class="text-h6 baseLayer" @click="showBaseLayer=!showBaseLayer">Base Layer</v-subheader>
      </v-hover>
      <InputRadio 
        class="ml-2"
        :items="baseLayersTitle" 
        model="currentBaseLayer" 
        v-show="showBaseLayer"
      />
      <v-select
        v-show="$store.state.map.currentBaseLayer === 'Bing Map'"
        v-model="currentBingMap"
        :items="BingMapstyles"
        label="Bing Map"
        single-line
      ></v-select>
      </v-list>
      <v-list v-show="showBaseLayer">
        <v-subheader class="text-h6">Base Layer Opacity</v-subheader>
        <LayerOpacity model="baseLayerOpacity"/>
      </v-list>
      <v-list>
        <v-hover>
          <v-subheader class="text-h6 optionalLayer" @click="showOptionalLayer=!showOptionalLayer">Optional Layer</v-subheader>
        </v-hover>
        <v-list-item-group v-show="showOptionalLayer">
          <v-list-item @click="clearOptionalLayers">
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
        </v-list-item-group>
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
      showBaseLayer:false,
      baseLayers: [],
      baseLayersTitle: [],
      BingMapstyles: [ 'RoadOnDemand', 'AerialWithLabelsOnDemand', 'CanvasDark' ],
      BingMaps: [],
      currentBingMap: 'RoadOnDemand',
      showOptionalLayer: false,
      optionalLayers:[],
      optionalLayersTitle: []
    }
  },
  methods: {
    initMap () {
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

      this.map = new Map({
        layers: [ baseLayerGroup, optionalLayerGroup ],
        target: 'map',
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      })
    },
    clearOptionalLayers () {
      this.optionalLayers.forEach(layer => {
        layer.setVisible(false)
        this.$store.state.map.selectedOptionalLayers = []
      })
    }
  },
  watch: {
    currentBingMap() {
      this.BingMaps.forEach(style => {
        style.setVisible(style.getSource().getImagerySet()===this.currentBingMap)
        style.setOpacity(1)
        this.$store.state.map.baseLayerOpacity = 1
      })
    },
  },
  mounted() {
    this.initMap()
  },
  created() {
    this.$store.watch(
      state => state.map.baseLayerOpacity,
      (newValue, oldValue) => {
        this.map.getLayers().getArray()[0].getLayers().getArray().forEach(layer => {
          if (layer.get('title') === this.$store.state.map.currentBaseLayer) layer.setOpacity(newValue)
        })
      },
    );
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
    )
  }
}
</script>

<style>
.map {
  width: 100vw;
  height: 100vh;
}
.v-subheader.baseLayer,
.v-subheader.optionalLayer{
  cursor: pointer;
}
</style>