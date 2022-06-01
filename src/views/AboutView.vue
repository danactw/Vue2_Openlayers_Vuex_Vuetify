<template>
  <div>
    <v-navigation-drawer app clipped>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Application
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item-group
          v-model="currentBaseLayer"
          active-class=""
        >
          <v-list-item
            v-for="baseLayer in baseLayersTitle"
            :key="baseLayer"
            link
          >
            <template v-slot:default="{ active }">
              <v-list-item-action>
                <v-checkbox :input-value="active"></v-checkbox>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title> {{ baseLayer }} </v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
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

export default {
  data() {
    return {
      mapContainer: null,
      map: null,
      baseLayers: [],
      baseLayersTitle: [],
      currentBaseLayer: 0
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
      this.baseLayers = [OSMStandard, OSMHumanitarian, CartoDBBase, StamenWater ]
      const baseLayerGroup = new LayerGroup({
          layers: this.baseLayers
      });
      this.baseLayers.forEach(layer => this.baseLayersTitle.push(layer.get('title')))
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
    }
  },
  mounted() {
    this.initMap()
  },
  
}
</script>

<style>
.map {
  width: 100vw;
  height: 100vh;
}
</style>