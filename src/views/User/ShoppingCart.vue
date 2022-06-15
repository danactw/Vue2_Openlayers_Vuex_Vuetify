<template>
  <v-card width="80%" class="mx-auto mt-5">
    <v-stepper v-model="$store.state.cartProgress">
      <v-stepper-header>
        <v-stepper-step 
          step="1"
          editable
          :complete="$store.state.cartProgress > 1" 
          @click="$store.state.cartProgress = 1" >
          檢視明細
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step 
          step="2"
          editable
          :complete="$store.state.cartProgress > 2"
          @click="$store.state.cartProgress = 2"
        >
          填寫訂單資訊
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3">
          付款方式
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