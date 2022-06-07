<template>
  <div>
    <v-navigation-drawer app clipped>
      <v-list>
        <v-list-group no-action sub-group value="true">
          <template v-slot:activator>
            <v-list-item-title class="text-h6">Vector Layers</v-list-item-title>
          </template>
          <v-list-item>
            <InputRadio :items="vectorLayersTitle" model="selectedVectorLayer"/>
          </v-list-item>
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
import LayerGroup from 'ol/layer/Group';
import { Tile as TileLayer, Vector as VectorLayer , VectorTile as VectorTileLayer } from 'ol/layer';
import VectorImageLayer from 'ol/layer/VectorImage';
import { Cluster, OSM, Vector as VectorSource, VectorTile as VectorTileSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import { GeoJSON, MVT } from 'ol/format';
import { boundingExtent } from 'ol/extent';
import { toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay';
import InputRadio from '@/components/InputRadio.vue';

export default {
  data() {
    return {
      mapContainer: null,
      map: null,
      vectorLayers: [],
      vectorLayersTitle: [],
      countriesStyle: new Style({
        stroke: new Stroke({
          color: "gray",
          width: 1,
        }),
        fill: new Fill({
          color: "rgba(20,20,20,0.5)",
        }),
      }),
      ecoRegionsStyle: new Style({
        fill: new Fill({
          color: "rgba(102, 204, 255, 0.2)"
        }),
        stroke: new Stroke({
          color: "rgb(51, 153, 255)",
          width: 1
        })
      })
    };
  },
  methods: {
    initMap() {
      const countries = new VectorTileLayer({
        declutter: true,
        source: new VectorTileSource({
          maxZoom: 15,
          format: new MVT({
            idProperty: "iso_a3",
          }),
          url: "https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/" +
            "ne:ne_10m_admin_0_countries@EPSG:900913@pbf/{z}/{x}/{-y}.pbf",
        }),
        style: this.countriesStyle,
        visible: true,
        title: "Countries"
      });
      const vectorBaseMap = new VectorTileLayer({
        source: new VectorTileSource({
          format: new MVT(),
          url: "https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer/tile/{z}/{y}/{x}.pbf",
        }),
        visible: false,
        title: "Base Map"
      });
      const ecoRegions = new VectorImageLayer({
        imageRatio: 2,
        source: new VectorSource({
          url: "https://openlayers.org/data/vector/ecoregions.json",
          format: new GeoJSON(),
        }),
        style: this.selectedEcoRegionsStyle,
        visible: false,
        title: "Eco-Regions"
      });
      this.vectorLayers = [countries, vectorBaseMap, ecoRegions];
      this.vectorLayers.forEach(layer => {
        this.vectorLayersTitle.push(layer.get("title"));
      });
      const vectorLayerGroup = new LayerGroup({
        layers: this.vectorLayers
      });
      this.map = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayerGroup
        ],
        target: "map",
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });
    },
    selectedEcoRegionsStyle(feature) {
      const color = feature.get("COLOR") || "#eeeeee";
      this.ecoRegionsStyle.getFill().setColor(color);
      return this.ecoRegionsStyle;
    }
  },
  mounted() {
    this.initMap();
  },
  components: { InputRadio },
  created() {
    this.$store.watch(
    state => state.map.selectedVectorLayer,
    (newValue,oldValue) => {
      this.vectorLayers.forEach(layer => {
        layer.setVisible(layer.get('title') === newValue)
      })
    }
  )
  }
}
</script>

<style>
</style>