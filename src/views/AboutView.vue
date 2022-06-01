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
      <v-radio-group v-model="currentBaseLayer" v-show="showBaseLayer">      
        <v-radio
          v-for="baseLayer in baseLayersTitle"
          :key="baseLayer"
          :label="baseLayer"
          :value="baseLayer"
        ></v-radio>
      </v-radio-group>
      </v-list>
      <v-list v-show="currentBaseLayer === 'Bing Map'">
        <v-list-item>
          <v-select
            v-model="currentBingMap"
            :items="BingMapstyles"
            label="Bing Map"
            single-line
          ></v-select>
          </v-list-item>
      </v-list>
      <v-list>
        <v-subheader class="text-h6">Base Layer Opacity</v-subheader>
        <v-list-item v-show="showBaseLayer">
            <v-slider
              v-model="baseLayerOpacity"
              step="0.1"
              min="0"
              max="1"
              thumb-label
              ticks
            ></v-slider>
          </v-list-item>
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

export default {
  data() {
    return {
      mapContainer: null,
      map: null,
      showBaseLayer:false,
      baseLayers: [],
      baseLayersTitle: [],
      currentBaseLayer: "OSM Standard",
      baseLayerOpacity:1,
      BingMapstyles: [ 'RoadOnDemand', 'AerialWithLabelsOnDemand', 'CanvasDark' ],
      BingMaps: [],
      currentBingMap: 'RoadOnDemand'
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
      this.map = new Map({
        layers: [
          baseLayerGroup
        ],
        target: 'map',
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      })
    },
  },
  watch: {
    currentBaseLayer () {
      this.map.getLayers().getArray()[0].getLayers().getArray().forEach(layer => {
        if (layer.get('title') === this.currentBaseLayer) {
          if (layer.get('title') === 'Bing Map') {
            this.BingMaps.forEach(style => {
              style.setVisible(style.getSource().getImagerySet()==='RoadOnDemand')
              style.setOpacity(1)
            })
          } else {
            layer.setVisible(true)
            layer.setOpacity(1)
          }
          this.baseLayerOpacity = 1
        } else layer.setVisible(false)
      })
    },
    baseLayerOpacity() {
      this.map.getLayers().getArray()[0].getLayers().getArray().forEach(layer => {
        if (layer.get('title') === this.currentBaseLayer) layer.setOpacity(this.baseLayerOpacity)
      })
    },
    currentBingMap() {
      this.BingMaps.forEach(style => {
        style.setVisible(style.getSource().getImagerySet()===this.currentBingMap)
        style.setOpacity(1)
        this.baseLayerOpacity = 1
      })
    }
  },
  mounted() {
    this.initMap()
  }
}
</script>

<style>
.map {
  width: 100vw;
  height: 100vh;
}
.v-subheader.baseLayer{
  cursor: pointer;
}
</style>