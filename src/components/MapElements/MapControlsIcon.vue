<template>
  <div
    id="btnGroup"
    class="d-flex flex-column"
  >
    <v-btn 
      class="mb-4"
      rounded
      x-small
      height="40px"
      color="primary"
      dark
      @click="guide()"
      >
      <v-icon>mdi-information-variant</v-icon>
    </v-btn>
    <v-btn 
      class="mb-4"
      rounded
      x-small
      height="40px"
      color="primary"
      dark
      @click="$emit('fitTaiwan')"
      data-intro="這是地圖縮放工具 [全臺範圍]"
      data-step="4"
      >
      <v-icon>mdi-fullscreen</v-icon>
    </v-btn>
    <v-btn 
      class="mb-4"
      rounded
      x-small
      height="40px"
      color="primary"
      dark
      @click="$emit('zoomin')"
      data-intro="這是地圖縮放工具 [放大]"
      data-step="3"
      >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn 
      class="mb-4"
      rounded
      x-small
      height="40px"
      color="primary"
      dark
      @click="$emit('zoomout')"
      data-intro="這是地圖縮放工具 [縮小]"
      data-step="2"
      >
      <v-icon>mdi-minus</v-icon>
    </v-btn>
    <SelectLayer
      :layerOpt="layerOpt"
      :layerBase="layerBase"
      @changeOpacity="changeOpacity" 
    />
  </div>
</template>

<script>
import SelectLayer from '@/components/MapElements/SelectLayer.vue';
import introJs from 'intro.js'
import 'intro.js/introjs.css'
export default {
  components: { SelectLayer },
  props: {
    layerBase: Array,
    layerOpt: Array
  },
  methods: {
    changeOpacity(layerTitle) {
      this.$emit('changeOpacity', layerTitle)
    },
    guide () {
      introJs().setOptions({

      }).start();
    }
  }
}
</script>

<style>
#btnGroup {
  position: absolute;
  bottom: 50px;
  right: 20px;
  z-index: 10;
}
.introjs-tooltiptext {
  padding: 30px 30px 0px;
}
.introjs-tooltip-header {
  position: absolute;
  top: -10px;
  right: -15px;
}
</style>