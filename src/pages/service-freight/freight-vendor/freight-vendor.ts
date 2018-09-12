import { FreightService } from './../freight.service';
import { Vendor } from './../freight.interface';
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
  vendor: Vendor;
  vendor_intro: string = '';
  constructor(
    private freightService: FreightService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController
  ) {
      this.vendor = this.navParams.get('vendor');
      console.log(this.vendor);
      this.freightService.getVendorIntro(this.vendor.v_id, 'chinese').take(1).subscribe(res => {
        this.vendor_intro = res.result.vi_intro;
      })
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

    }
    this.navCtrl.push('FreightVendorboxsPage', data)
  }

  backBtn() {
    this.navCtrl.pop();
  }
}
