<template>
  <div>
    <v-navigation-drawer app clipped>
      <v-list>
        <v-list-group no-action sub-group value="true">
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
          <v-btn class="ml-4 mt-4" @click="undo">Undo</v-btn>
          <v-btn class="ml-4 mt-4" @click="clearAll">Clear All</v-btn>
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
      // interactionsType: ['Draw', 'Modify', 'Translate', 'Scale and Rotate'],
      interactionsType: ['Draw', 'Modify', 'Translate'],
      draw: null,
      translate: null,
      modify: null,
      snap: null,
      startDrawingMsg: 'Click to start drawing',
      hingMsg: '',
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
      hintStyle: new Style({
        text: new Text({
          font: '12px Calibri,sans-serif',
          fill: new Fill({
            color: 'rgba(255, 255, 255, 1)',
          }),
          backgroundFill: new Fill({
            color: 'rgba(0, 0, 0, 0.4)',
          }),
          padding: [2, 2, 2, 2],
          textAlign: 'left',
          offsetX: 15,
        }),
      }),
      outputStyle: new Style({
        text: new Text({
          font: '14px Calibri,sans-serif',
          fill: new Fill({
            color: 'rgba(255, 255, 255, 1)',
          }),
          backgroundFill: new Fill({
            color: 'rgba(0, 0, 0, 0.7)',
          }),
          padding: [3, 3, 3, 3],
          textBaseline: 'bottom',
          offsetY: -15,
        }),
        image: new RegularShape({
          radius: 8,
          points: 3,
          angle: Math.PI,
          displacement: [0, 10],
          fill: new Fill({
            color: 'rgba(0, 0, 0, 0.7)',
          }),
        }),
      }),
      segmentStyle: new Style({
        text: new Text({
          font: '12px Calibri,sans-serif',
          fill: new Fill({
            color: 'rgba(255, 255, 255, 1)',
          }),
          backgroundFill: new Fill({
            color: 'rgba(0, 0, 0, 0.4)',
          }),
          padding: [2, 2, 2, 2],
          textBaseline: 'bottom',
          offsetY: -12,
        }),
        image: new RegularShape({
          radius: 6,
          points: 3,
          angle: Math.PI,
          displacement: [0, 8],
          fill: new Fill({
            color: 'rgba(0, 0, 0, 0.4)',
          }),
        }),
      }),
      segmentStyles: []
    };
  },
  computed: {
    continueMsg() {
      let action1, action2
      if (this.$store.state.map.selectedDrawType === 'Polygon(freehand)') {
        action1 = 'continue'
        action2 = 'and double click to stop'
      }
      else if (this.$store.state.map.selectedDrawType === 'LineString') {
        action1 = 'continue'
        action2 = 'and double click to stop'
      }
      else {
        action1 = 'stop'
        action2 = ''
      }
      return `Click to ${action1} drawing ${this.$store.state.map.selectedDrawType} ${action2}`
    }
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
          center: [-11292106.545934848, 4861222.107992905],
          zoom: 4,
        }),
      });
      this.map.addInteraction(select);
      this.addDraw()
    },
    styleFunction(feature, showHint) {
      const geometry = feature.getGeometry();
      const type = geometry.getType();
      console.log(type);
      const style = [this.vectorStyle[type]]
      let drawType, measureOutput, measureOutputCoord, segmentOutputCoord
      switch (this.$store.state.map.selectedDrawType) {
        case 'Point':
          drawType = 'Point'
          break;
        case 'LineString':
          drawType = 'LineString'
          break;
        case 'Circle':
          drawType = 'Circle'
          break;
        default:
          drawType = 'Polygon'
          break;
      }
      if ( type === drawType && this.$store.state.map.selectedAddtional.includes('Measure')) {
        if (drawType === 'LineString') {
          measureOutput = this.formatLength(geometry)
          measureOutputCoord = new Point(geometry.getLastCoordinate())
          segmentOutputCoord = geometry
        } else if (drawType === 'Polygon') {
          measureOutput = this.formatArea(geometry)
          measureOutputCoord = geometry.getInteriorPoint()
          segmentOutputCoord = new LineString(geometry.getCoordinates()[0])
        }
        this.outputStyle.setGeometry(measureOutputCoord);
        this.outputStyle.getText().setText(measureOutput);
        if (this.$store.state.map.selectedDrawType !== 'Point') style.push(this.outputStyle)
      }
      if ( segmentOutputCoord && this.$store.state.map.selectedAddtional.includes('Measure Segment Length') ) this.showSegment(segmentOutputCoord, style)
      if ( showHint && type === 'Point' ) {
        this.hintStyle.getText().setText(this.hingMsg);
        style.push(this.hintStyle);
      }
      return style
    },
    addDraw() {
      const showHint = true
      this.hingMsg = this.startDrawingMsg
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
        style: feature => this.styleFunction(feature, showHint),
        geometryFunction: geometryFunction
      })
      this.draw.on('drawstart', this.drawStart)
      this.draw.on('drawend', this.drawEnd)
      this.map.addInteraction(this.draw)
    },
    drawStart() {
      this.hingMsg = this.continueMsg
      if (this.$store.state.map.selectedAddtional.includes('Clear Previous Feature')) this.newFeature.getSource().clear()
    },
    drawEnd() {
      this.hingMsg = this.startDrawingMsg
    },
    removeAllInteractions () {
      this.map.removeInteraction(this.draw)
      this.map.removeInteraction(this.translate)
      this.map.removeInteraction(this.modify)
      this.map.removeInteraction(this.snap)
    },
    formatLength(line) {
      const length = getLength(line);
      let output;
      if (length > 100) {
        output = `${Math.round((length / 1000) * 100) / 100} km`;
      } else {
        output = `${Math.round(length * 100) / 100} m`;
      }
      return output
    },
    formatArea(polygon) {
      const area = getArea(polygon);
      let output;
      if (area > 10000) {
        output = `${Math.round((area / 1000000) * 100) / 100} km\xB2`;
      } else {
        output = `${Math.round(area * 100) / 100} m\xB2`;
      }
      return output;
    },
    undo() {
      const feature = this.newFeature.getSource().getFeatures().pop()
      this.newFeature.getSource().removeFeature(feature)
    },
    clearAll() {
      this.newFeature.getSource().clear()
    },
    showSegment (segmentOutputCoord, style) {
      let count = 0
      segmentOutputCoord.forEachSegment(function (a, b) {
        const segment = new LineString([a, b]);
        const label = this.formatLength(segment);
        if (this.segmentStyles.length - 1 < count) {
          this.segmentStyles.push(this.segmentStyle.clone());
        }
        const segmentPoint = new Point(segment.getCoordinateAt(0.5));
        this.segmentStyles[count].setGeometry(segmentPoint);
        this.segmentStyles[count].getText().setText(label);
        style.push(this.segmentStyles[count]);
        count++;
      });
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

<style scoped>
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

button {
  width: max-content;
}
</style>