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
        <v-card v-show="$store.state.map.selectedVectorLayer === 'Eco-Regions' ">
          <v-card-title
            class="text-h6"
            v-text="'ecoRegionInfo'"
          ></v-card-title>
          <v-card-text>
            <p><strong>BIOME_NAME:</strong><br/> {{ ecoRegionInfo.BIOME_NAME }}</p>
            <p><strong>ECO_NAME:</strong><br/> {{ ecoRegionInfo.ECO_NAME }}</p>
            <p><strong>REALM:</strong><br/> {{ ecoRegionInfo.REALM }}</p>
          </v-card-text>
        </v-card>
      </v-list>
    </v-navigation-drawer>
    <div id="map" class="map" ref="mapContainer"></div>
    <v-card ref="BMOverlay" color="#fa0" class="pa-2">{{ baseMapOverlayMsg }}</v-card>
    <v-card ref="clusterOverlay" color="#fa0" class="pa-2" >
      <span> {{ currentCoordinate.Long }} </span><br/>
      <span> {{ currentCoordinate.Lat }} </span>
    </v-card>
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
      ecoRegionsStyle: new Style({
        fill: new Fill({
          color: "rgba(102, 204, 255, 0.2)"
        }),
        stroke: new Stroke({
          color: "rgb(51, 153, 255)",
          width: 1
        })
      }),
      ecoRegionInfo: {},
      ecoRegionhighlight: null,
      ecoRegionsOverlay: null,
      baseMapOverlay: null,
      baseMapOverlayMsg: '',
      clusters: null,
      features: null,
      minDistance: 20,
      distance: 70,
      count: 2000,
      currentCoordinate: {},
      clusterOverlay: null
    };
  },
  methods: {
    initMap() {
      this.features = new Array(this.count)
      const X = 18000000
      const Y = 8000000
      for (let i = 0; i < this.count; ++i) {
        const coordinates = [2 * X * Math.random() - X, 2 * Y * Math.random() - Y];
        this.features[i] = new Feature(new Point(coordinates));
      }
      const clusterSource = new Cluster({
        distance: parseInt(this.distance, 10),
        minDistance: parseInt(this.minDistance, 10),
        source: new VectorSource({
          features: this.features,
        }),
      });
      this.clusters = new VectorLayer({
        title: 'Cluster',
        source: clusterSource,
        style: feature => this.clusterStyle(feature),
        visible: true
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
      this.ecoRegionsOverlay = new VectorLayer({
        source: new VectorSource(),
        map: this.map,
        style: new Style({
          stroke: new Stroke({
            color: "rgba(255, 255, 255, 1)",
            width: 3,
          }),
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.3)"
          })
        }),
      })
      this.vectorLayers = [this.clusters, vectorBaseMap, ecoRegions];
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
    },
    clusterStyle(feature) {
      const size = feature.get('features').length;
      const radius = size < 20 ? 10 : size/2
      const opacity = (size/20).toFixed(1)
      const styleCache = {}
      let style = styleCache[size];
      if (!style) {
          style = new Style({
            image: new CircleStyle({
              radius: radius,
              stroke: new Stroke({
                color: '#fff',
              }),
              fill: new Fill({
                color: `rgb(255, 153, 51, ${opacity})`,
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
    showEcoRegionInfo (e) {
      const feature = this.map.forEachFeatureAtPixel(e.pixel, feature => feature);
      this.ecoRegionInfo["BIOME_NAME"] = feature ? feature.getProperties().BIOME_NAME : "";
      this.ecoRegionInfo["ECO_NAME"] = feature ? feature.getProperties().ECO_NAME : "";
      this.ecoRegionInfo["REALM"] = feature ? feature.getProperties().REALM : "";
      if (feature !== this.ecoRegionhighlight) {
        if (this.ecoRegionhighlight)
          this.ecoRegionsOverlay.getSource().removeFeature(this.ecoRegionhighlight);
        if (feature)
          this.ecoRegionsOverlay.getSource().addFeature(feature);
        this.ecoRegionhighlight = feature;
      }
    },
    showBaseMapOverlay (e) {
      this.baseMapOverlay.setPosition(undefined);
      const feature = this.map.getFeaturesAtPixel(e.pixel)[0];
      const currentCoord = e.coordinate;
      this.baseMapOverlay.setPosition(currentCoord);
      if (feature) {
        this.baseMapOverlayMsg = feature.getProperties().layer;
      }
    },
    clearAll() {
      this.map.removeOverlay(this.baseMapOverlay);
      this.map.removeOverlay(this.clusterOverlay);
      this.map.removeLayer(this.ecoRegionsOverlay);
    },
    clusterZoomIn (e) {
      this.clusterOverlay.setPosition(undefined) 
      this.clusters.getFeatures(e.pixel).then(clickedFeatures => {
        if (clickedFeatures.length) {
          const features = clickedFeatures[0].get('features');
          const extent = boundingExtent(
            features.map((r) => r.getGeometry().getCoordinates())
          );
          if (features.length > 20) {
            this.map.getView().fit(extent, {duration: 1000, padding: [50, 50, 50, 50], maxZoom: 4});
          } else if (features.length > 10) {
            this.map.getView().fit(extent, {duration: 1000, padding: [50, 50, 50, 50], maxZoom: 5});
          } else if (features.length >= 2){
            this.map.getView().fit(extent, {duration: 2000, padding: [50, 50, 50, 50]});
          } else {
            const coordinate = e.coordinate
            const lonLat = toLonLat(coordinate).map(item=>item.toFixed(2))
            // this.map.getView().centerOn(coordinate, this.map.getSize(), [570,300])
            this.currentCoordinate = {Long: `Longitude: ${lonLat[0]}`, Lat: `Latitude: ${lonLat[1]}`}  
            this.clusterOverlay.setPosition(coordinate) 
          }
        }
      })
    }
  },
  mounted() {
    this.initMap()
    this.baseMapOverlay = new Overlay({
        element: this.$refs.BMOverlay.$el,
        positioning: "center-left",
        offset: [15, 0]
    })
    this.clusterOverlay = new Overlay({
        element: this.$refs.clusterOverlay.$el,
        positioning: "center-left",
        offset: [15, 0]
    }),
    this.map.addOverlay(this.clusterOverlay)
    this.map.on('click', e => this.clusterZoomIn(e))
  },
  components: { InputRadio },
  created() {
    this.$store.watch(
      state => state.map.selectedVectorLayer,
      (newValue,oldValue) => {
        this.vectorLayers.forEach(layer => layer.setVisible(layer.get('title') === newValue))
        this.clearAll()
        this.map.getView().setZoom(2)
        this.map.getView().setCenter([0,0])
        switch(newValue) {
          case 'Cluster':
            this.map.addOverlay(this.clusterOverlay)
            this.map.on('click', e => this.clusterZoomIn(e))
            break;
          case 'Base Map':
            this.map.addOverlay(this.baseMapOverlay)
            this.map.on('pointermove', e => this.showBaseMapOverlay(e))
            break;
          case 'Eco-Regions':
            this.map.addLayer(this.ecoRegionsOverlay)
            this.map.on('click', e => this.showEcoRegionInfo(e))
            break;
          case '':
            break;
        }
      }
    ),
    this.$set(this.ecoRegionInfo, 'BIOME_NAME', ''),
    this.$set(this.ecoRegionInfo, 'ECO_NAME', ''),
    this.$set(this.ecoRegionInfo, 'REALM', '')
    this.$set(this.currentCoordinate, 'Long', '')
    this.$set(this.currentCoordinate, 'Lat', '')
  }
}
</script>

<style>
.BMOverlay {
  background-color: rgb(255, 230, 179);
  border-radius: 10px;
  padding: 5px;
}
</style>