<template>
  <v-app>
    <AppNav />
    <NavDrawer v-show="$store.state.showNavDrawer"/>
    <v-main >
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import AppNav from './components/NavBar/AppNav.vue';
import NavDrawer from './components/NavBar/NavDrawer.vue';
export default {
  components: { AppNav, NavDrawer }
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
@media (min-width: 1264px) {
  .v-toolbar__content .container {
    max-width: 100%;
  }
}
</style>