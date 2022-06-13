<template>
  <div
    id="btnGroup"
    class="d-flex flex-column"
  >
    <v-btn class="mb-4" rounded x-small height="40px" color="primary" dark @click="$emit('fitTaiwan')">
      <v-icon>mdi-fullscreen</v-icon>
    </v-btn>
    <v-btn class="mb-4" rounded x-small height="40px" color="primary" dark @click="$emit('zoomin')">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn class="mb-4" rounded x-small height="40px" color="primary" dark @click="$emit('zoomout')">
      <v-icon>mdi-minus</v-icon>
    </v-btn>
    <SelectLayer :layerOpt="layerOpt" :layerBase="layerBase" @changeOpacity="changeOpacity" />
  </div>
</template>

<script>
import SelectLayer from '@/components/SelectLayer.vue';
export default {
  components: { SelectLayer },
  props: {
    layerBase: Array,
    layerOpt: Array
  },
  methods: {
    changeOpacity(layerTitle) {
      this.$emit('changeOpacity', layerTitle)
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
</style>