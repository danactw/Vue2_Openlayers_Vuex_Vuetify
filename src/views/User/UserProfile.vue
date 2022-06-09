<template>
  <v-sheet class="pa-4" outlined rounded elevation="4" id="create" height="100%">
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-container>
            <v-row justify="center">
              <v-col>
                <h1>User Profile</h1>
                <v-form>
                  <v-file-input accept="image/*" label="Attach profile picture"></v-file-input>
                  <v-row>
                    <v-col>
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="date"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="date"
                            label="Date of Birth"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="menu = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-text-field label="Contact Number" prepend-icon="mdi-phone"/>
                </v-form>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card >
          <v-container>
            <v-row justify="center">
              <v-col>
                <h1>Other Information</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis atque assumenda error debitis voluptatibus quasi saepe magnam at amet delectus quis ducimus et similique ut ea deserunt recusandae nam maxime aperiam enim, illum ullam libero? A, expedita. Voluptate, cumque minus! Voluptatem soluta expedita obcaecati esse repellat laudantium id. Vitae repudiandae, excepturi quasi minima omnis labore id voluptates ducimus aliquid facilis eum? Est dolores error, non voluptate quas sit aliquid voluptatem ab, molestias ea vitae similique.</p>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card :outlined="false" height="300" class="mt-4">
          <v-card-title>Memo</v-card-title>
          <v-card-text class="py-0">Add memo by clicking on the <v-icon small>mdi-wrench</v-icon>at the bottom right of the screen</v-card-text>
          <v-row class="px-4">
            <v-col v-for="n in count" :key="n" :cols="cols">
              <v-textarea class="yellow lighten-4 px-4"></v-textarea>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-speed-dial
      v-model="fab"
      bottom
      right
      direction="top"
      transition="slide-x-transition"
    >
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          color="blue darken-2"
          dark
          fab
        >
          <v-icon v-if="fab">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-wrench
          </v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="red">
        <v-icon>mdi-information-variant</v-icon>
      </v-btn>
      <v-btn fab dark small color="green" @click="count++" v-show="count<6">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn fab dark small color="indigo" @click="count--" v-show="count>=1">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </v-speed-dial>
  </v-sheet>
</template>

<script>
  export default {
    data: () => ({
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      fab: false,
      count: 0
    }),
    computed: {
      cols() { return 12/this.count },
    }
  }
</script>

<style>
  #create .v-speed-dial {
    position: absolute;
  }

  #create .v-btn--floating {
    position: relative;
  }
</style>