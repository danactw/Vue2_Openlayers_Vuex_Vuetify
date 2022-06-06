<template>
  <div>
    <v-alert
      elevation="2"
      type="info"
    >
      web page under construction. Please go to 
      <v-btn :to="{ name: 'About' }" plain>MainMap</v-btn>
    </v-alert>
    <hello-world />
  </div>
</template>

<script>
  import HelloWorld from '../components/HelloWorld'

  export default {
    name: 'Home',

    components: {
      HelloWorld,
    },
  }
</script>
