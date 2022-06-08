<template>
  <v-app>
    <v-app-bar app clipped-left height="55">
      <v-container>
        <v-row>
          <v-col>
            <v-toolbar-title>Openlayers</v-toolbar-title>
          </v-col>
          <v-col>
            <v-row>
              <v-col v-for="(link, index) in routerLinks" :key="index">
                <v-btn  :to="{ name: link.path }" rounded plain> {{ link.title }} </v-btn>
              </v-col>
              <v-col>
                <v-menu offset-y nudge-bottom="10">
                  <template v-slot:activator="{ on, attrs }">        
                    <v-avatar size="36px" v-on="on" v-bind="attrs">
                      <v-icon color="grey darken-2">mdi-account</v-icon>
                    </v-avatar>
                  </template>
                  <v-card>
                    <v-list-item-content class="justify-center">
                      <div class="mx-auto text-center">
                        <v-avatar color="orange" class="mb-3">
                          <span class="white--text text-h5">{{ user.initials }}</span>
                        </v-avatar>
                        <h3>{{ user.fullName }}</h3>
                        <p class="text-caption mt-1">{{ user.email }}</p>
                        <div v-for="(link, index) in dropDowns" :key="index">
                          <v-divider class="my-3"></v-divider>
                          <v-btn  :to="{ name: link.path }" depressed plain rounded>{{ link.title }}</v-btn>
                        </div>
                      </div>
                    </v-list-item-content>
                  </v-card>
                </v-menu>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
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
        { path: 'VectorMap', title: 'Vector Map'},
      ],
      dropDowns: [
        { path: 'UserAuth', title: 'Sign up / Login in'},
        { path: 'UserProfile', title: 'User Profile'},
        { path: 'ShoppingCart', title: 'Shopping Cart'},
        { path: 'OrderTracking', title: 'Order Tracking'},
      ],
      user: {
        initials: 'UN',
        fullName: 'User Name',
        email: 'user@gmail.com',
      },
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
@media (min-width: 1264px) {
  .v-toolbar__content .container {
    max-width: 100%;
  }
}
</style>