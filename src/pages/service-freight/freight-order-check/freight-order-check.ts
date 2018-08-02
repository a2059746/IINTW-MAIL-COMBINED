import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

/**
 * Generated class for the FreightOrderCheckPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freight-order-check',
  templateUrl: 'freight-order-check.html',
})
export class FreightOrderCheckPage {

  data: any;

  orderInfo: Array<{
    FBKey: string,
    FBPics: string,
    FBSize: string,
    TWAreaAllow: Array<any>,
    BindCountry: Array<any>,
    FBDeposit: number,
    FBBlance: number,
    boxChoosenAmount: number,
    giftsInfo: Array<{
      giftAmount: number,
      giftKey: string
    }>
  }>;

  giftsInfo: any;
  totalGiftsPrice = 0;
  loadingClass: any;

  isCtrl = {
    loadingReady: false,
  }

  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    //this.loadingPage()

    this.data = this.navParams.data
    if( !this.data ) {
      alert('錯誤!')
      this.navCtrl.setRoot('FreightVendorlistPage')
    }
    console.log(this.data)
    this.orderInfo = this.data.orderInfo;
    this.giftsInfo = this.data.giftsInfo;

    console.log('order Info')
    console.log(this.orderInfo)
    console.log('gifts Info')
    console.log(this.giftsInfo)

    this.orderInfo.forEach(a => {
      a.giftsInfo.forEach(b => {
        if(b.giftAmount > 0) {
          this.totalGiftsPrice += (b.giftAmount * this.giftsInfo.find(c => c.key == b.giftKey).FGPrice)
        }
      })
    })


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FreightOrderCheckPage');
  }

  ionViewDidEnter() {

  }

  /*** render function ***/

  twAreaAllow(i) {
    let areaName = '';
    let lastIndex = this.orderInfo[i].TWAreaAllow.length - 1;
    // console.log('lastIndex:' + lastIndex)
    this.orderInfo[i].TWAreaAllow.forEach((c, index) => {
      // console.log('bcName:'+bcName)
      // console.log('country:'+c)
      if(index == 0) {
        areaName = c;
      } else {
        areaName += '、';
        areaName += c;
      }
    })
    return areaName;
  }

  bindCountry(i) {
    let bcName = '';
    let lastIndex = this.orderInfo[i].BindCountry.length - 1;
    // console.log('lastIndex:' + lastIndex)
    this.orderInfo[i].BindCountry.forEach((c, index) => {
      // console.log('bcName:'+bcName)
      // console.log('country:'+c)
      if(index == 0) {
        bcName = c;
      } else {
        bcName += '、';
        bcName += c;
      }
    })
    return bcName;
  }



  gifts(i): Array<{}> {
    let temp = [];
    this.orderInfo[i].giftsInfo.forEach(a => {
      if(a.giftAmount > 0) {
        temp.push({
          info: this.giftsInfo.find(b => b.key == a.giftKey),
          amount: a.giftAmount
        })
      }
    })
    return temp;
  }

  /*** btn click ***/

  reviseOrder() {
    this.navCtrl.pop();
  }

  submit() {

    const data = {
      orderInfo: this.orderInfo,
      boxTWarea: this.data.boxTWarea,
      vendorKey: this.data.vendorKey,
      totalGiftsPrice: this.totalGiftsPrice
    };

    this.navCtrl.push('FreightOdererInfoCheckPage', data);
  }

  /*** londing ***/

  loadingPage() {
    this.loadingClass = this.loadingCtrl.create();

    this.loadingClass.onDidDismiss(() => {
      this.isCtrl.loadingReady = true;
    })

    this.loadingClass.present();
  }

}
