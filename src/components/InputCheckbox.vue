<template>
  <div>
    <v-checkbox
      v-model="$store.state.map[model]"
      :label="item"
      :value="item"
      hide-details
    ></v-checkbox>
  </div>
</template>

<script>
export default {
  props: {
    item: String,
    model: String,
  }
}
</script>

<style>

</style>