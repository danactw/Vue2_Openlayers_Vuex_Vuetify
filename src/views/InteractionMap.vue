<template>
  <div>
    <v-navigation-drawer app clipped>
      <v-list>
        <v-list-group no-action sub-group>
          <template v-slot:activator>
            <v-list-item-title class="text-h6">Interactions</v-list-item-title>
          </template>
          <v-list-item>
            <InputRadio :items="interactionsType" model="selectedinteraction" />
          </v-list-item>
        </v-list-group>
        <v-list-group no-action sub-group v-show="$store.state.map.selectedinteraction==='Draw'">
          <template v-slot:activator>
            <v-list-item-title class="text-h6">Draw Type</v-list-item-title>
          </template>
          <v-list-item>
            <InputRadio :items="drawType" model="selectedDrawType" />
          </v-list-item>
          <div v-show="$store.state.map.selectedDrawType==='Regular Polygon'">
            <v-list-item-title class="text-h6 ml-4">Number of sides</v-list-item-title>
            <input class="ml-4" type="number" min="3" max="32" v-model="RegularPolygonSize" />
          </div>
        </v-list-group>
        <v-list-group no-action sub-group v-show="$store.state.map.selectedinteraction==='Draw'">
          <template v-slot:activator>
            <v-list-item-title class="text-h6">Additional</v-list-item-title>
          </template>
          <InputCheckbox 
            class="ml-4"
            v-for="(item, index) in addtional"
            :key="index"
            :item="item"
            model="selectedAddtional"
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
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Draw, Modify, Select, Translate, Snap } from 'ol/interaction';
import { Circle as CircleStyle, Fill, Stroke, Style, Text, RegularShape } from 'ol/style';
import { createRegularPolygon, createBox} from 'ol/interaction/Draw';
import { getLength, getArea } from 'ol/sphere';
import { Point, LineString } from 'ol/geom';
import InputRadio from '@/components/InputRadio.vue';
import InputCheckbox from '@/components/InputCheckbox.vue';

export default {
  data() {
    return {
      mapContainer: null,
      map: null,
      newFeature: null,
      interactionsType: ['Draw', 'Translate', 'Modify', 'Scale and Rotate'],
      draw: null,
      translate: null,
      modify: null,
      snap: null,
      drawType: ['Point', 'LineString', 'Circle', 'Regular Polygon', 'Rectangle', 'Polygon(freehand)'],
      RegularPolygonSize: 3,
      addtional: ['Measure', 'Measure Segment Length', 'Clear Previous Feature'],
      geojsonObject: {
        "type": "FeatureCollection",
        "crs": {
          "type": "name",
          "properties": {
            "name": "EPSG:3857",
          },
        },
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [-5000000, 6000000],
                  [-5000000, 8000000],
                  [-3000000, 8000000],
                  [-3000000, 6000000],
                  [-5000000, 6000000],
                ],
              ],
            },
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [-2000000, 6000000],
                  [-2000000, 8000000],
                  [0, 8000000],
                  [0, 6000000],
                  [-2000000, 6000000],
                ],
              ],
            },
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [1000000, 6000000],
                  [1000000, 8000000],
                  [3000000, 8000000],
                  [3000000, 6000000],
                  [1000000, 6000000],
                ],
              ],
            },
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [-2000000, -1000000],
                  [-1000000, 1000000],
                  [0, -1000000],
                  [-2000000, -1000000],
                ],
              ],
            },
          },
        ],
      },
      vectorStyle: {
        'Point': new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({
              color: '#ffcc33',
            }),
          })
        }),
        'LineString': new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 2
          })
        }),
        'Polygon': new Style({
          fill: new Fill({
            color: 'rgba(0, 153, 0, 0.3)'
          }),
          stroke: new Stroke({
            color: 'rgba(0, 153, 0,1)',
            width: 2
          }),
        }),
        'Circle': new Style({
          fill: new Fill({
            color: 'rgba(255, 128, 128,0.5)'
          }),
          stroke: new Stroke({
            color: 'rgba(255, 128, 128,1)',
            width: 2
          }),
        })
      },
    };
  },
  methods: {
    initMap() {
      const source = new VectorSource({
        features: new GeoJSON().readFeatures(this.geojsonObject),
      });
      const USLayer = new VectorLayer({
        source: new VectorSource({
          url: "https://openlayers.org/data/vector/us-states.json",
          format: new GeoJSON(),
          wrapX: false,
        })
      });
      this.newFeature = new VectorLayer({
        source: source,
        style: feature => this.styleFunction(feature),
      });
      const select = new Select({
        wrapX: false,
      });
      this.translate = new Translate({
        features: select.getFeatures(),
      });
      this.modify = new Modify({
        features: select.getFeatures(),
      });
      this.snap = new Snap({
        source: this.newFeature.getSource(),
        pixelTolerance: 15
      });
      this.map = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          this.newFeature,
          USLayer
        ],
        target: "map",
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });
      this.map.addInteraction(select);
      this.map.addInteraction(this.translate);
    },
    styleFunction(feature, showHint) {
      const geometry = feature.getGeometry();
      const type = geometry.getType();
      const style = [this.vectorStyle[type]]
      // let drawType, measureOutput, measureOutputCoord, segmentOutputCoord;
      return style
    },
    addDraw() {
      let type, geometryFunction
      switch (this.$store.state.map.selectedDrawType) {
        case 'Point':
          type = 'Point'
          break;
        case 'LineString':
          type = 'LineString'
          break;
        case 'Polygon(freehand)':
          type = 'Polygon'
          break;
        case 'Rectangle':
          type = 'Circle'
          geometryFunction = createBox()
          break;
        case 'Circle':
          type = 'Circle'
          break;
        case 'Regular Polygon':
          type = 'Circle'
          geometryFunction = createRegularPolygon(Number(this.RegularPolygonSize))
          break;
      }
      this.draw = new Draw({
        type: type,
        source: this.newFeature.getSource(),
        style: feature => this.styleFunction(feature),
        geometryFunction: geometryFunction
      })
      // this.draw.on('drawstart', drawStart)
      // this.draw.on('drawend', drawEnd)
      this.map.addInteraction(this.draw)
    },
    removeAllInteractions () {
      this.map.removeInteraction(this.draw)
      this.map.removeInteraction(this.translate)
      this.map.removeInteraction(this.modify)
      this.map.removeInteraction(this.snap)
    }
  },
  mounted() {
    this.initMap()
  },
  created() {
    this.$store.watch(
      state => state.map.selectedinteraction,
      (newValue, oldValue) => {
        this.removeAllInteractions()
        switch(newValue) {
          case 'Draw':
            this.addDraw()
            break;
          case 'Translate':
            this.map.addInteraction(this.translate);
            break;
          case 'Modify':
            this.map.addInteraction(this.modify);
            this.map.addInteraction(this.snap);
            break;
        }
      }
    ),
    this.$store.watch(
      state => state.map.selectedDrawType,
      () => {
        this.map.removeInteraction(this.draw)
        this.addDraw()
      }
    )
  },
  watch: {
    RegularPolygonSize() {
      this.map.removeInteraction(this.draw)
      this.addDraw()
    }
  },
  components: { InputRadio, InputCheckbox }
}
</script>

<style>
.v-slider.v-slider--horizontal.theme--light{
  margin: 40px 0 0 0;
}
button, input, select, textarea {
  display: inline-block;
  border: 1px solid grey;
  border-radius: 10px;
  width: 70px;
  height: 40px;
  font-size: 20px;
  text-align: center;
}
</style>