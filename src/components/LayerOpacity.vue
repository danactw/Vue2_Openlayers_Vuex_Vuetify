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
/* for the thumb-label of the slider to display fully*/
.v-slider.v-slider--horizontal.theme--light{
  margin: 40px 0 0 0;
}
/* to eliminate the excessive padding for the v-slide*/
#app.v-application--is-ltr .v-list-group--sub-group .v-list-group__items .v-list-item{
  padding-left: 0px;
}
</style>