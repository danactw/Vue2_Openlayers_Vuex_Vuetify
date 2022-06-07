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
        { path: 'Home', title: 'Home'},
        { path: 'About', title: 'Main Map'},
        { path: 'InteractionMap', title: 'Interaction Map'},
        // { path: 'SwipeMap', title: 'Swipe Map'},
        { path: 'VectorMap', title: 'Vector Map'},
      ],
    }
  }
}

</script>

<style>
.map {
  width: calc(100vw - 256px);
  height: calc(100vh - 55px);
  margin: auto;
}
/* to avoid the overviewMap overlay with the scaleLine*/
.ol-overviewmap.ol-unselectable.ol-control {
  bottom: 60px;
}
/* to eliminate the excessive padding for the v-list located in the sidebar*/
#app.v-application--is-ltr .v-list-group--sub-group .v-list-group__header{
  padding: 0;
}
#app.v-application--is-ltr .v-list-group--no-action.v-list-group--sub-group > .v-list-group__items > .v-list-item{
  padding-left: 10px;
}
</style>