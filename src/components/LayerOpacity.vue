<template>
  <v-list-item>
    <v-slider
      v-model="$store.state.map[model]"
      step="0.1"
      min="0"
      max="1"
      thumb-label
      ticks
    ></v-slider>
  </v-list-item>
</template>

<script>
export default {
  props: {
    model: String
  }
}
</script>

<style>
.v-slider.v-slider--horizontal{
  margin-left: 0;
  margin-right: 50px;
}
.v-application--is-ltr .v-list-item .v-list-item__icon:first-child{
  margin-right: 10px;
}
</style>