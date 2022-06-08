<template>
  <v-card width="500" class="mx-auto mt-10 pa-4">
    <v-tabs v-model="tabs" grow>
      <v-tab>Sign Up</v-tab>
      <v-tab>Log In</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <v-card>
          <v-card-text>
            <v-form>
              <v-text-field label="Username" prepend-icon="mdi-account-circle"/>
              <v-text-field label="Email" type="email" prepend-icon="mdi-email"/>
              <v-text-field 
                label="Comfirm Password"
                :type="showPassword ? 'text' : 'password' "
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword=!showPassword"
              />
              <v-text-field 
                label="Password"
                :type="showPassword ? 'text' : 'password' "
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword=!showPassword"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn class="mx-auto">Sign Up</v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card>
          <v-card-text>
            <v-form>
              <v-text-field label="Email" type="email" prepend-icon="mdi-email"/>
              <v-text-field 
                label="Password"
                :type="showPassword ? 'text' : 'password' "
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword=!showPassword"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn class="mx-auto">Log In</v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
  export default {
    data () {
      return {
        tabs: null,
        showPassword: false
      }
    },
  }
</script>

<style>

</style>