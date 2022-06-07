<template>
  <div id="map" class="map" ref="mapContainer"></div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import { Tile as TileLayer } from 'ol/layer';

export default {
  data() {
    return {
      mapContainer: null,
      map: null
    }
  },
  methods: {
    initMap() {
      this.map = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          })
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
  }
}
</script>

<style>
</style>