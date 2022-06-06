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
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import InputRadio from '@/components/InputRadio.vue';
import InputCheckbox from '@/components/InputCheckbox.vue';

export default {
    data() {
        return {
            mapContainer: null,
            map: null,
            interactionsType: ['Draw', 'Translate', 'Modify', 'Scale and Rotate'],
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
            drawStyle: new Style({
                fill: new Fill({
                    color: "rgba(255, 255, 255, 0.2)",
                }),
                stroke: new Stroke({
                    color: "#ffcc33",
                    width: 2,
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                        color: "#ffcc33",
                    }),
                }),
            }),
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
            const newFeature = new VectorLayer({
                source: source,
                style: this.drawStyle,
            });
            let draw;
            function addInteractions() {
                draw = new Draw({
                    source: newFeature.getSource(),
                    type: "Polygon",
                });
                if (map.value)
                    map.value.addInteraction(draw);
            }
            addInteractions();
            const select = new Select({
                wrapX: false,
            });
            const translate = new Translate({
                features: select.getFeatures(),
            });
            const modify = new Modify({
                features: select.getFeatures(),
            });
            const snap = new Snap({
                source: newFeature.getSource(),
                pixelTolerance: 15
            });
            this.map = new Map({
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                    newFeature,
                    USLayer
                ],
                target: "map",
                view: new View({
                    center: [0, 0],
                    zoom: 2,
                }),
            });
            this.map.addInteraction(select);
            // this.map.addInteraction(draw)
            this.map.addInteraction(translate);
            this.map.addInteraction(modify);
            this.map.addInteraction(snap);
        }
    },
    mounted() {
        this.initMap();
    },
    components: { InputRadio, InputRadio, InputCheckbox }
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