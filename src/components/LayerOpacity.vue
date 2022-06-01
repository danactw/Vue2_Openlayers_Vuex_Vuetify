<template>
  <v-list>
    <v-subheader class="text-h6"> {{ title }} </v-subheader>
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
  </v-list>
</template>

<script>
export default {
  props: {
    title: String,
    model: String
  }
}
</script>

<style>

</style>