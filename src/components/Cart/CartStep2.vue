<template>
  <v-stepper-content step="2">
    <v-form>
      <v-row>
        <v-col>
          <v-text-field
            ref="orderby"
            v-model="orderInfo.orderby"
            :rules="[v => !!v || '訂購（申請）人 為必填欄位！']"
            label="訂購（申請）人"
            placeholder="John Doe"
            filled
            dense
            required
            single-line
          ></v-text-field>
        </v-col>
        <v-col>
          <v-select
            ref="application"
            v-model="orderInfo.application"
            :rules="[v => !!v || '請選擇一項申請目的！']"
            :items="[
              {id: '1', name: '參考'},
              {id: '2', name: '證明'},
              {id: '3', name: '學術研究'},
              {id: '4', name: '政府計畫'},
              {id: '5', name: '建築、工程規劃'}
            ]"
            item-text="name"
            item-value="id"
            label="申請目的"
            outlined
            single-line
            dense
            required
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            ref="recipe"
            v-model="orderInfo.recipe"
            :rules="[v => !!v || '收據抬頭 為必填欄位！']"
            label="收據抬頭"
            filled
            dense
            required
            single-line
          ></v-text-field>
        </v-col>
        <v-col>
          <v-radio-group v-model="copyTitle" :mandatory="false" row class="mt-1">
            <v-radio label="同訂購人" value="orderby"></v-radio>
            <!-- <v-radio label="同收件人" value="recipient"></v-radio> -->
            <v-radio label="使用測試資料" value="demo"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            ref="contactPerson"
            v-model="orderInfo.contactPerson"
            :rules="[v => !!v || '聯絡人 / 單位 為必填欄位！']"
            label="聯絡人 / 單位"
            filled
            dense
            required
            single-line
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            ref="taxid"
            v-model="orderInfo.taxid"
            :rules="[v => !!v || '統一編號 為必填欄位！']"
            label="統一編號"
            filled
            dense
            required
            single-line
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            ref="mobile"
            v-model="orderInfo.mobile"
            :rules="phoneRule"
            label="聯絡電話（手機）"
            filled
            dense
            required
            single-line
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            ref="landline"
            v-model="orderInfo.landline"
            :rules="phoneRule"
            label="聯絡電話（市話）"
            filled
            dense
            required
            single-line
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            ref="email"
            v-model="orderInfo.email"
            :rules="emailRule"
            label="電子郵件 Email"
            filled
            dense
            required
            single-line
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="d-block" no-gutters>
        <p class="mb-0 title">取件方式</p>
        <v-radio-group v-model="deliverID" c1lass="mt-2">      
          <v-radio
            v-for="delivertype in deliverConfig"
            :key="delivertype.id"
            :value="delivertype.id"
          >
            <template v-slot:label>
              <div>
                {{ delivertype.name }}<strong class="primary--text"> {{ delivertype.comment }}</strong
                >
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-row>
      <v-row no-gutters>
        <v-card width="100%" :disabled="deliverID==='1'">
          <v-row no-gutters>
            <v-col>
              <v-card-title class="justify-space-between pa-0">
                <span class="title">收件資訊</span>
                <v-checkbox 
                  class="pa-0 mt-6" 
                  v-model="storeReceiptInfo"
                  label="儲存收件人資訊"
                ></v-checkbox>
              </v-card-title>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col cols="6">
              <v-text-field
                ref="recipient"
                v-model="receiptInfo.recipient"
                :rules="[v => !!v || '收件人 / 單位 為必填欄位！']"
                label="收件人 / 單位"
                filled
                dense
                required
                single-line
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                v-model="receiptInfo.city"
                :items="cities"
                label="縣市"
                return-object
                filled
                dense
                single-line
                hide-details
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                v-model="receiptInfo.district"
                :items="districts"
                label="行政區"
                return-object
                filled
                dense
                single-line
                hide-details
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                v-model="receiptInfo.postalCode"
                :items="[postalCode]"
                label="郵遞區號"
                return-object
                filled
                dense
                single-line
                hide-details
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="receiptInfo.street"
                label="詳細地址(不接受郵政信箱)"
                single-line
                hide-details
                dense
                filled
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </v-row>
      <v-row>
        <v-col>
          <v-btn 
            block
            color="primary"
            @click="$store.state.cartProgress = 3" 
          >
            [下一步] 填寫訂單資訊
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-stepper-content>
</template>

<script>
export default {
  data() {
    return {
      orderInfo: {
        orderby: '',
        application: '',
        recipe: '',
        contactPerson: '',
        taxid: '',
        mobile: '',
        landline: '',
        email: '',
        deliver: '',
        recipient: '',
        address: ''
      },
      copyTitle: null,
      demo: {
        orderby: '北極星',
        application: '2',
        recipe: '北極星測繪科技有限公司',
        contactPerson: '北極星',
        mobile: '0912345678',
        email: 'abc@rs-survey.com'
      },
      deliverConfig: [
        { id: '1', name: '現場自取', comment: '(下方"收件資訊"免填)' },
        { id: '2', name: '宅配', comment: "(運費請於圖資送達時自行支付予宅配業者，結帳前請再次確認'收件資訊'中內容是否正確無誤)" }
      ],
      deliverID: '1',
      storeReceiptInfo: false,
      addressInfo: [],
      receiptInfo: {
        recipient: '',
        city: '',
        district: '',
        postalCode: '',
        street: ''
      }
    }
  },
  computed: {
    form () {
      return {
        orderby: this.orderInfo.orderby,
        application: this.orderInfo.application,
        recipe: this.orderInfo.recipe,
        contactPerson: this.orderInfo.contactPerson,
        taxid: this.orderInfo.taxid,
        mobile: this.orderInfo.mobile,
        landline: this.orderInfo.landline,
        email: this.orderInfo.email,
        deliver: this.orderInfo.deliver,
        recipient: this.orderInfo.recipient,
        address: this.orderInfo.address
      }
    },
  },
  computed: {
    emailRule () {
      return [
        v => !!v || 'E-mail 為必填欄位！',
        v => /.+@.+\..+/.test(v) || 'E-mail 格式有誤'
      ]
    },
    phoneRule () {
      return [
        this.orderInfo.mobile !== '' || this.orderInfo.mobile !== '' || '請至少填入一組聯絡方式！'
      ]
    },
    cities() {
      const city = []
      this.addressInfo.map(place => city.push(place.city))
      return city
    },
    districts() {
      const district = []
      this.addressInfo.filter(place => {
        if(place.city===this.receiptInfo.city) {
          place.districts.forEach(place => district.push(place.name))
        }
      })
      return district
    },
    postalCode() {
      return this.addressInfo.filter(place => place.city===this.receiptInfo.city)[0]?.districts.filter(place => place.name === this.receiptInfo.district)[0]?.zip
    }
  },
  watch: {
    copyTitle (val) {
      if (val === 'demo') {
        Object.keys(this.demo).map(key => {
          this.orderInfo[key] = this.demo[key]
        })
      } else if (val === 'orderby') this.orderInfo.recipe = this.orderInfo.orderby
    }

  },
  methods: {
    resetForm () {
      this.errorMessages = []
      this.formHasErrors = false
      Object.keys(this.form).forEach(f => {
        this.$refs[f].reset()
      })
    },
    submit () {
      this.formHasErrors = false
      Object.keys(this.form).forEach(f => {
        if (!this.form[f]) this.formHasErrors = true
        this.$refs[f].validate(true)
      })
    },
    fetchAddress() {
      const url = 'https://gist.githubusercontent.com/abc873693/2804e64324eaaf26515281710e1792df/raw/a1e1fc17d04b47c564bbd9dba0d59a6a325ec7c1/taiwan_districts.json'
      fetch(url)
        .then(res => res.json())
        .then(data => {
          data.forEach(city => {
            this.addressInfo.push({city: city.name, districts: city.districts})
          });
        })
    }
  },
  mounted() {
    this.fetchAddress()
  }
}
</script>

<style>

</style>