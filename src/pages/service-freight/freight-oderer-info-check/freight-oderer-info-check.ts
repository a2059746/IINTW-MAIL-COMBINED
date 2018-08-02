import { AngularFireDatabase } from 'angularfire2/database';
import { UploadimgProvider } from './../../../providers/uploadimg/uploadimg';
import { FireAuthProvider } from './../../../providers/fire-auth/fire-auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ViewController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import {
  FREIGHT_ORDERS_PATH,
  FREIGHT_ORDERSTATUS_PATH,
  getPathUsersFreightOrders,
} from '../freight.config';
/**
 * Generated class for the FreightOdererInfoCheckPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freight-oderer-info-check',
  templateUrl: 'freight-oderer-info-check.html',
})
export class FreightOdererInfoCheckPage {

  loadingClass: any;

  authInfo: {
    Name: any,
    Address: any,
    Phone: any,
  };


  // input value
  twAddress: any = '';
  foreignAddress: any = '';
  foreignPhone: any = '';
  receivingTime: any;
  payMethod: any;

  boxTWarea: any;
  vendorKey: any;
  chooseArea: any ;

  isCtrl = {
    loadingReady: false,
    isClickEditAddress: false,
    exText1: false,
    exText2: false,
    isAllDone: false,
    choosePhoto: false
  }

  choosePhotoUrl: any;

  constructor(
    public afData: AngularFireDatabase,
    public upload: UploadimgProvider,
    public viewCtrl: ViewController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    public AUTH: FireAuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.loadingPage();

    console.log('i am in user info check page')
    console.log(this.navParams.data);
    this.boxTWarea = this.navParams.get('boxTWarea')
    this.vendorKey = this.navParams.get('vendorKey')

    this.chooseArea = this.boxTWarea[0];

    this.AUTH.getState().take(1).subscribe((auth:any) => {
      this.authInfo = auth.info;
      console.log(this.authInfo);

      this.loadingClass.dismiss();
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FreightOdererInfoCheckPage');
  }

  /*** btn click ***/

  editAddress() {
    this.isCtrl.isClickEditAddress = true;
  }

  ensureAddress() {
    this.isCtrl.isClickEditAddress = false;
  }

  exClick1() {
    if(this.isCtrl.exText1) {
      this.isCtrl.exText1 = false;
    } else {
      this.isCtrl.exText1 = true;
    }
  }

  exClick2() {
    if(this.isCtrl.exText2) {
      this.isCtrl.exText2 = false;
    } else {
      this.isCtrl.exText2 = true;
    }
  }

  _Pay_State: any;
  _Box_State: any;

  submit() {
    if( (!this.twAddress) || (!this.foreignAddress && !this.isCtrl.choosePhoto) || (!this.foreignPhone) || (!this.receivingTime) || (!this.payMethod) ) {
      this.notFinishedToast();
      return;
    }

    const orderData = {
      myBoxes: this.navParams.get('orderInfo'),
      bName: this.authInfo.Name,
      bAddrArea: this.chooseArea,
      bAddrLast: this.twAddress,
      bPhone: this.authInfo.Phone,
      fAddress: this.foreignAddress,
      fPhone: this.foreignPhone,
      rTime: this.receivingTime,
      payMethod: this.payMethod,
    }

    if(this.payMethod == "cash_on_delivery") {
      this._Pay_State = '92'
      this._Box_State = '91'
    } else if(this.payMethod == "code_payment") {
      this._Pay_State = '86'
      this._Box_State = '50'
    }

    this.sendTransmitOrder(orderData).subscribe(() => {
      this.orderCompleted();
    })

  }



  sendTransmitOrder(order) {
    return Observable.create( observer => {

        this.AUTH.getState().take(1).subscribe(authState => {
          let Opath = getPathUsersFreightOrders(authState.uid);
          let orderData = {
            ...order,
            OrderPath: Opath,
            _State_ID: 10,
            _Pay_State: this._Pay_State,
            _Box_State: this._Box_State,
            _Color: null,
            _UserKey: authState.uid,
            _VendorKey: this.vendorKey,
            _Date: firebase.database.ServerValue.TIMESTAMP,
            TID: gTID(authState.phone),
          //  LoanPlan: order.LoanProgram.LoanPlan,
          //  LoanRate: order.LoanProgram.LoanRate,
          //  LoanProgram: null,
          };
          this.afData
            .list(`${FREIGHT_ORDERS_PATH}${this.vendorKey}`)
            .push(orderData)
            .then( res => {
              return this.afData.object(Opath + res.key)
                                .set(Object.assign(orderData,{ OrderPath: res.path.toString(), }));
            }).then( () => {
              observer.next(true);
            });
            /*
            if(!this.navParams.data.isReciverPatched) {
              this.afData
              .list(__PATH__USERSDATA_LOAN_BANKHISTORIES + authState.phone)
              .push({
                CUBank: order.CUBank,
                CUBankID: order.CUBankID,
                CUBankID_Br: order.CUBankID_Br,
                CUBankAc: order.CUBankAc,
                CUBankAc_N: order.CUBankAc_N,
              })
              .then(res => {});
            } */

        });


    });
  }

  uploadNumPlate() {
    this.upload.chooseImage(this.authInfo.Phone).subscribe(url => {
      this.isCtrl.isClickEditAddress = false;
      this.isCtrl.choosePhoto = true;
      this.choosePhotoUrl = url;
    })
  }

  isRadioValueChange() {
    console.log('time')
    console.log(this.receivingTime)
    console.log('payment method')
    console.log(this.payMethod)
  }

  //***  Modal ***/

  orderCompleted() {
    const modal = this.modal.create('FmodelCompleteOrderingPage', {
      payMethod: this.payMethod
    }, {
      cssClass: 'my-popup',
    })
    let targetView;

    // this.navCtrl.remove() --> when lazy loading, this way is not useful
    // this.navCtrl.popTo() --> when lazy loading, this way is not useful

    modal.present().then(() => {
      targetView = this.navCtrl.getViews().filter(view=> view.id == 'FreightVendorPage')
    });

    modal.onDidDismiss(() => {
      targetView.length ? this.navCtrl.popTo(targetView[0]) : this.navCtrl.pop()
    })

  }


  // *** Toast *** //

  notFinishedToast() {
    this.isCtrl.isAllDone = true;
    setTimeout(() => {
      this.isCtrl.isAllDone = false;
    }, 2500)
  }

  /*** londing ***/

  loadingPage() {
    this.loadingClass = this.loadingCtrl.create();

    this.loadingClass.onDidDismiss(() => {
      this.isCtrl.loadingReady = true;
    })

    this.loadingClass.present();
  }

  areaText() {
    let areaName = '';
    let lastIndex = this.boxTWarea.length - 1;

    this.boxTWarea.forEach((c, index) => {

      if(index == 0) {
        areaName = c;
      } else {
        areaName += '、';
        areaName += c;
      }
    })
    return areaName;
  }

}


function gTID(phone: string) {
  let t = new Date();
  // let r = Math.floor(Math.random() * 100) + 1
  return `F${t.getFullYear()}${pad(t.getMonth()+1)}${pad(t.getDate())}${pad(t.getHours())}${pad(t.getMinutes())}${pad(t.getSeconds())}${phone}`;
  // let t = new Date().toLocaleString('zn-TW', {year:'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false}).replace(/[\/\s\:]/g, '') + phone;
  // return s;
}
function pad(num, size = 2) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}
