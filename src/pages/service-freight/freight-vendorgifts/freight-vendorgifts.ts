import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { FREIGHT_BOXS_PATH } from '../freight.config';
import { FREIGHT_GIFTS_PATH } from '../freight.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Observable/combineLatest';
import 'rxjs/add/operator/take';
/**
 * Generated class for the FreightVendorgiftsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freight-vendorgifts',
  templateUrl: 'freight-vendorgifts.html',
})
export class FreightVendorgiftsPage {

  loadingClass: any;

  data: any;

  vendorKey: any;

  vendorGifts: Array<{
    key: any
    FGKey: any,
    FGName: any,
    FGPics: any,
    FGPrice: any,
  }> = []

  choosenBox: Array<{
    FBKey: string,
    boxChoosenAmount: any,
    FBGifts: Array<any>
    giftsInfo: Array<{
      giftKey: any,
      giftAmount: any,
    }>,
    hasChoosenGift: number
  }> = []

  totalChoosenBoxes: number;
  totalGiftsCanChoosed: number;
  totalGiftsHasChoosed: number;

  isCtrl = {
    loadingReady: false
  }

  constructor(
    public loadingCtrl: LoadingController,
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.loadingPage()

    this.data = this.navParams.data
    if( !this.data ) {
      alert('錯誤!')
      this.navCtrl.setRoot('FreightVendorlistPage')
    }
    console.log(this.data);

    //initialization
    this.totalChoosenBoxes = 0;
    this.totalGiftsCanChoosed = 0;
    this.totalGiftsHasChoosed = 0;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FreightVendorgiftsPage');
  }

  ionViewDidEnter() {

    this.vendorKey = this.data.vid;
    this.choosenBox = this.data.choosenBox;
    console.log('vendor Id:' + this.vendorKey)
    console.log('choosenBox')
    console.log(this.choosenBox)

    this.db.list(FREIGHT_GIFTS_PATH + this.vendorKey).snapshotChanges()
    .map(snaps => snaps.map(snap => ({
      ...snap.payload.val(),
      key: snap.payload.key
    }))).take(1).subscribe((list:any) => {
      console.log('Vendor Gifts:')
      console.log(list)
      this.vendorGifts = list;

      if(!this.isCtrl.loadingReady) {
        this.choosenBox.map(a => a.hasChoosenGift = 0);

        this.choosenBox.forEach(a => {
          // set gift choosen amount = 0
          a.giftsInfo = [];
          a.FBGifts.forEach((b:any) => {
            a.giftsInfo.push({
              giftKey: b,
              giftAmount: 0
            })
          })
          // count totalBoxes
          this.totalChoosenBoxes += parseInt(a.boxChoosenAmount);

          // count total Gifts can be choosen
          this.totalGiftsCanChoosed += (a.boxChoosenAmount * 1)
        })
      }

      console.log('new choosenBox')
      console.log(this.choosenBox)

      this.loadingClass.dismiss();
    })

  }


  /*** render function ***/

  gifts(bi): Array<{}> {
    let temp = [];
    this.choosenBox[bi].giftsInfo.forEach(a => {
      temp.push( this.vendorGifts.find(b => b.key == a.giftKey) )
    })
    return temp;
  }

  /*** btn click ***/

  increaseGift(bi, gi) {
    this.choosenBox[bi].giftsInfo[gi].giftAmount ++;
    this.choosenBox[bi].hasChoosenGift ++;
    this.totalGiftsHasChoosed ++;
  }

  decreaseGift(bi, gi) {
    this.choosenBox[bi].giftsInfo[gi].giftAmount --;
    this.choosenBox[bi].hasChoosenGift --;
    this.totalGiftsHasChoosed --;
  }

  restAmount() {
    this.choosenBox.forEach(a => {
      a.giftsInfo.map(b => b.giftAmount = 0)
      a.hasChoosenGift = 0;
    })
    this.totalGiftsHasChoosed = 0;

  }

  nextPage() {
    // if(this.totalGiftsHasChoosed != this.totalGiftsCanChoosed) {
    //   this.notFinishedToast();
    //   return;
    // }
    this.navCtrl.push('FreightOrderCheckPage', {
      orderInfo: this.choosenBox,
      giftsInfo: this.vendorGifts,
      boxTWarea: this.data.boxTWarea,
      vendorKey: this.vendorKey
    });
  }


  // *** Toast *** //
  // isEnsureChoosenDone = false;
  // notFinishedToast() {
  //   this.isEnsureChoosenDone = true;
  //   setTimeout(() => {
  //     this.isEnsureChoosenDone = false;
  //   }, 2500)
  // }


  /*** londing ***/

  loadingPage() {
    this.loadingClass = this.loadingCtrl.create();

    this.loadingClass.onDidDismiss(() => {
      this.isCtrl.loadingReady = true;
    })

    this.loadingClass.present();
  }



}
