<template>
  <v-card width="80%" class="mx-auto mt-10">
    <v-stepper v-model="$store.state.cartProgress">
      <v-stepper-header>
        <v-stepper-step :complete="$store.state.cartProgress > 1" step="1">
          Shopping Details
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="$store.state.cartProgress > 2" step="2">
          Payments
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3">
          Confirm
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <CartStep1 />
        <CartStep2 />
        <CartStep3 />
      </v-stepper-items>
    </v-stepper>
  </v-card>
</template>

<script>
import CartStep1 from '@/components/Cart/CartStep1.vue'
import CartStep2 from '@/components/Cart/CartStep2.vue';
import CartStep3 from '@/components/Cart/CartStep3.vue';
export default {
  components: { CartStep1, CartStep2, CartStep3 },
  data() {
    return {
    }
  }
}
</script>

<style>

</style>