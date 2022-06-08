<template>
  <v-card width="80%" class="mx-auto mt-10">
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">
          Shopping Details
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2">
          Payments
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3">
          Confirm
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">


          <v-btn
            color="primary"
            @click="e1 = 2"
          >
            Continue
          </v-btn>

          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-card>
</template>

<script>
  export default {
    data () {
      return {
        e1: 1,
      }
    },
  }
</script>

<style>

</style>