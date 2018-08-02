import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the FreightVendorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freight-vendor',
  templateUrl: 'freight-vendor.html',
})
export class FreightVendorPage {
  vendor: {
    Name: string,
    key: string
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController
  ) {
      this.vendor = this.navParams.get('vendor')
      if(!this.vendor) {
        let alert = this.alertCtrl.create({
          title: '錯誤',
          subTitle: '此廠商不存在',
          buttons: [{
            text: '返回',
            handler: () => {
              this.navCtrl.pop();
            }
          }]
        });
        alert.present()
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FreightVendorPage');
  }

  goBoxsPage() {
    const data = {
      key: this.vendor.key
    }
    this.navCtrl.push('FreightVendorboxsPage', data)
  }

  goGiftsPage() {
    const data = {
      key: this.vendor.key
    }
    this.navCtrl.push('FreightVendorgiftsPage', data)
  }

}
