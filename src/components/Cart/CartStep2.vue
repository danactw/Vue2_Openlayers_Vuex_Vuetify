<template>
  <v-stepper-content step="2">
    <v-form ref="orderForm" v-model="formValidity" @submit.prevent="submitForm">
      <v-row>
        <v-col>
          <v-text-field
            ref="orderby"
            v-model="orderInfo.orderby"
            :rules="[v => !!v || '訂購（申請）人 為必填欄位！']"
            label="(必填) 訂購（申請）人"
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
            label="(必填) 申請目的"
            outlined
            single-line
            dense
            required
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field
            ref="recipe"
            v-model="orderInfo.recipe"
            :rules="[v => !!v || '收據抬頭 為必填欄位！']"
            label="(必填) 收據抬頭"
            filled
            dense
            required
            single-line
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-radio-group v-model="copyTitle" :mandatory="false" row class="mt-1">
            <v-radio label="同訂購人" value="orderby"></v-radio>
            <!-- <v-radio label="同收件人" value="recipient"></v-radio> -->
            <v-radio label="使用測試資料" value="demo"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="3" class="d-flex justify-end">
          <v-btn class="mr-2" @click="resetForm">清除資料</v-btn>
          <v-btn @click="validateForm">顯示必填欄位</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            ref="contactPerson"
            v-model="orderInfo.contactPerson"
            :rules="[v => !!v || '聯絡人 / 單位 為必填欄位！']"
            label="(必填) 聯絡人 / 單位"
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
            label="(擇一) 聯絡電話-手機"
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
            label="(擇一) 聯絡電話-市話"
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
            label="(必填) 電子郵件 Email"
            filled
            dense
            required
            single-line
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="d-block" no-gutters>
        <p class="mb-0 title">取件方式</p>
        <v-radio-group 
          v-model="deliverID" 
          c1lass="mt-2" 
          :rules="[v => !!v || '取件方式 為必填欄位！']"
        >      
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
        <v-card width="100%" v-show="deliverID==='2'">
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
                :rules="receiptInfoRule"
                label="收件人 / 單位"
                filled
                dense
                required
                single-line
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                v-model="receiptInfo.city"
                :rules="receiptInfoRule"
                :items="cities"
                label="縣市"
                return-object
                filled
                dense
                single-line
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                v-model="receiptInfo.district"
                :rules="receiptInfoRule"
                :items="districts"
                label="行政區 (請先選擇縣市)"
                return-object
                filled
                dense
                single-line
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                v-model="receiptInfo.postalCode"
                :items="[postalCode]"
                label="郵遞區號 (選擇縣市與行政區後會自動產生)"
                return-object
                filled
                dense
                single-line
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="receiptInfo.street"
                :rules="receiptInfoRule"
                label="詳細地址(不接受郵政信箱)"
                single-line
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
            type="submit"
            @click="$store.state.cartProgress = 3" 
            :disabled="!formValidity"
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
      formValidity: false,
      orderInfo: {
        orderby: '',
        application: '',
        recipe: '',
        contactPerson: '',
        taxid: '',
        mobile: '',
        landline: '',
        email: ''
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
      addressInfoConfig: [],
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
    emailRule () {
      return [
        v => !!v || 'E-mail 為必填欄位！',
        v => /.+@.+\..+/.test(v) || 'E-mail 格式有誤'
      ]
    },
    phoneRule () {
      return [
        this.orderInfo.mobile !== '' || this.orderInfo.landline !== '' || '請至少填入一組聯絡方式！'
      ]
    },
    receiptInfoRule () {
      return [
        v => this.deliverID === '1' ? true : !!v || '此欄位為必填欄位！'
      ]
    },
    cities() {
      const city = []
      this.addressInfoConfig.map(place => city.push(place.city))
      return city
    },
    districts() {
      const district = []
      this.addressInfoConfig.filter(place => {
        if(place.city===this.receiptInfo.city) {
          place.districts.forEach(place => district.push(place.name))
        }
      })
      return district
    },
    postalCode() {
      return this.addressInfoConfig.filter(place => place.city===this.receiptInfo.city)[0]?.districts.filter(place => place.name === this.receiptInfo.district)[0]?.zip
    }
  },
  watch: {
    copyTitle (val) {
      if (val === 'demo') {
        Object.keys(this.demo).map(key => {
          this.orderInfo[key] = this.demo[key]
        })
      } else if (val === 'orderby') this.orderInfo.recipe = this.orderInfo.orderby
    },
    postalCode () {
      this.receiptInfo.postalCode = this.postalCode
    },
    deliverID () {
      this.$refs.orderForm.resetValidation()
    },
  },
  methods: {
    fetchAddress() {
      const url = 'https://gist.githubusercontent.com/abc873693/2804e64324eaaf26515281710e1792df/raw/a1e1fc17d04b47c564bbd9dba0d59a6a325ec7c1/taiwan_districts.json'
      fetch(url)
        .then(res => res.json())
        .then(data => {
          data.forEach(city => {
            this.addressInfoConfig.push({city: city.name, districts: city.districts})
          });
        })
    },
    resetForm () {
      this.$refs.orderForm.reset()
    },
    validateForm () {
      this.$refs.orderForm.validate()
    },
    submitForm () {
      let address = `${this.receiptInfo.city} ${this.receiptInfo.district} ${this.receiptInfo.street}`
      let deliver = this.deliverConfig[Number(this.deliverID)-1].name
      this.$store.state.orderedInfo = { ...this.orderInfo, deliver, recipient: this.receiptInfo.recipient, postalCode: this.receiptInfo.postalCode, address}
    }
  },
  mounted() {
    this.fetchAddress()
  }
}
</script>

<style>
.v-messages {
  min-height: 0;
}
</style>