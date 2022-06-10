<template>
  <v-menu 
    top 
    offset-y 
    :nudge-top="10"
    max-width="600"
    max-height="600"
    :close-on-content-click="false" 
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        id="selectLayerBtn"
        color="primary"
        dark
        v-bind="attrs"
        v-on="on"
        rounded x-small height="40px"
      >
        <v-icon>mdi-layers</v-icon>
      </v-btn>
    </template>
    <v-card class="pa-4" id="selectLayer">
      <!-- 底圖選項 -->
      <v-card-title>底圖選項(擇一)</v-card-title>
      <v-row v-for="layer in layerBase" :key="layer.title">
        <v-col cols="3" align-self="center">
          <v-img
            max-height="150"
            max-width="250"
            :src="layer.img"
          ></v-img>
        </v-col>
        <v-col>
          <v-radio-group v-model="$store.state.homeMap.currentBaseLayer">
            <v-radio
              :label="layer.label"
              :value="layer.title"
              dense
            ></v-radio>
            <template v-slot:append>                
              <v-card-text>
                {{ layer.description }}
              </v-card-text>
            </template>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-divider class="mt-10"></v-divider>
      <!-- 影像圖層選項 -->
      <v-card-title>影像圖層選項</v-card-title>
      <v-row v-for="layer in layerOpt" :key="layer.title">
        <v-col cols="3" align-self="start">
          <v-img
            max-height="150"
            max-width="250"
            :src="layer.img"
          ></v-img>
        </v-col>
        <v-col>
          <v-checkbox
            v-model="$store.state.homeMap.selectedOptionalLayers"
            :label="layer.label"
            :value="layer.title"
            dense
          >
            <template v-slot:append>
              <v-row class="flex-column">
                <v-col>                  
                  <v-card-text>
                    {{ layer.description }}
                  </v-card-text>
                </v-col>
                <v-col>
                  <v-card flat width="300">
                    <v-card-text class="d-flex">
                      不透明度
                      <v-slider
                        v-model="layer.opacity"
                        step="0.1"
                        min="0"
                        max="1"
                        thumb-label
                        ticks
                        @change="changeOpacity(layer.title)"
                        :disabled="!$store.state.homeMap.selectedOptionalLayers.includes(layer.title)"
                      ></v-slider>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>

<script>
import { throws } from 'assert'

export default {
  props: {
    layerBase: Array,
    layerOpt: Array
  },
  methods: {
    changeOpacity(layerTitle) {
      this.layerOpt.forEach(layer => {
        if (layer.title === layerTitle) this.$emit('changeOpacity', {layerTitle, layerOpacity: layer.opacity})
      })
    }
  }
}
</script>

<style>
/* #selectLayerBtn {
  position: absolute;
  bottom: 35px;
  right: 10px;
  z-index: 10;
} */
#selectLayer .v-input--selection-controls {
  margin-top: -10px;
}
#selectLayer .v-input--selection-controls.v-input {
  flex-direction: column;
}
#selectLayer .v-card__text {
  padding: 0 16px;
}
#selectLayer .col {
  padding: 5px 12px;
}
#selectLayer .v-slider--horizontal {
  min-height: 20px;
}
</style>