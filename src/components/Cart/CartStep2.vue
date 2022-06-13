<template>
  <v-stepper-content step="2">
    <p>step2</p>
    <div class="d-flex justify-space-between mt-4" >
      <v-btn text color="primary" @click="$store.state.cartProgress = 1">
        回上一步
      </v-btn>
      <v-btn
        color="primary"
        @click="$store.state.cartProgress = 3"
      >
        結帳
      </v-btn>
    </div>
  </v-stepper-content>
</template>

<script>
export default {

}
</script>

<style>

</style>