import { FireAuthProvider, UserInfoType } from './../../../providers/fire-auth/fire-auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Observable/combineLatest';
import 'rxjs/add/operator/take';

@IonicPage()
@Component({
  selector: 'page-freight-ordering-buyer-info',
  templateUrl: 'freight-ordering-buyer-info.html',
})
export class FreightOrderingBuyerInfoPage {


  user: UserInfoType;
  order: {
    Name: string,
    Phone: string,
    Address: string,
    orderInfo: {},
    totalDeposit: number,
    totalBalance: number
  } = {
    Name: '',
    Phone: '',
    Address: '',
    orderInfo: {},
    totalDeposit: 0,
    totalBalance: 0
  }

  status = {
    isLoadResources: false,
    isInputCompleted: false,
    isEnsureName: false,
    isEnsureAddress: false,
    isClickEditAddress: false,

    payMethod: 0
  }

  alertMessage: string = '';

  constructor(
    public loadingCtrl: LoadingController,
    public AUTH: FireAuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.loadingPage()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FreightOrderingBuyerInfoPage');
  }

  ionViewDidEnter() {
    this.loadmyResources();

  }

  loadmyResources() {
    let order = this.navParams.data;

    this.AUTH.getState().take(1).subscribe(auth => {
      console.log('begin to take my data')
      this.user = auth.info;

      this.order.Name = this.user.Name;
      this.order.Phone = this.user.Phone;
      this.order.Address = this.user.Adress;
      this.order.orderInfo = order.orderInfo;
      this.order.totalDeposit = order.totalDeposit;
      this.order.totalBalance = order.totalBalance;

      console.log(this.user)
      console.log(this.order)

      this.loadingClass.dismiss();
    })
  }

  resetStatus() {
    this.status.isLoadResources = false;
    this.status.isInputCompleted = false;

    this.status.payMethod = 0;
  }

  // *** Button Click ***//
  submit() {
    console.log('name:' + this.order.Name)
    console.log('address:' + this.order.Address)
    console.log('method:' + this.status.payMethod)
    if( (!this.order.Name) || (!this.order.Address) || (!this.status.payMethod) ) {
      this.boxToast();
      return;
    }
  }

  editAddress() {
    this.status.isClickEditAddress = true;
  }

  ensureAddress() {
    this.status.isClickEditAddress = false;
  }

  // *** Toast *** //
  boxToast() {
    this.status.isInputCompleted = true;
    setTimeout(() => {
      this.status.isInputCompleted = false;
    }, 2500)
  }

  // *** Loading ***//
  loadingClass: any;
  loadingPage() {
    this.loadingClass = this.loadingCtrl.create();

    this.loadingClass.onDidDismiss(() => {
      this.status.isLoadResources = true;
    })

    this.loadingClass.present();
  }
}
