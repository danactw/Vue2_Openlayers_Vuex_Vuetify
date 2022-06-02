<template>
  <v-app>
    <v-app-bar app clipped-left height="55">
      <v-toolbar-title>Openlayers</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-for="(link, index) in routerLinks" :key="index" :to="{ name: link.path }" rounded plain> {{ link.title }} </v-btn>
    </v-app-bar>

    <v-main >
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      routerLinks: [
        { path: 'Home', title: 'Main Map'},
        { path: 'About', title: 'Map'},
        // { path: 'DrawMap', title: 'Draw Map'},
        // { path: 'InteractionsMap', title: 'Interactions Map'},
        // { path: 'SwipeMap', title: 'Swipe Map'},
        // { path: 'ClusterMap', title: 'Cluster Map'},
        // { path: 'VectorMap', title: 'Vector Map'},
      ],
    }
  }
}

</script>