<template>
  <v-radio-group v-model="$store.state.map[model]" >      
    <v-radio
      v-for="item in items"
      :key="item"
      :label="item"
      :value="item"
    ></v-radio>
  </v-radio-group>
</template>

<script>
export default {
  props: {
    items: Array,
    model: String
  }
}
</script>

<style>

</style>