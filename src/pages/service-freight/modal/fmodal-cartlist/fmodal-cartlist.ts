import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the FmodalCartlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fmodal-cartlist',
  templateUrl: 'fmodal-cartlist.html',
})
export class FmodalCartlistPage {

  // orderInfo: {
  //   boxID?: string,
  //   boxAmount?: number,
  //   totalDeposit?: number,
  //   totalBalance?: number,
  //   giftsInfo?: Array<any>
  // } = {};

  orderInfo: {
    boxAmount: number,
    boxID: string,
    boxPic: string,
    boxDeposit: number,
    boxBalance: number,
    giftsInfo: Array<any>,
    totalDeposit: number,
    totalBalance: number,
  }

  myGifts: Array<any> = [];

  tempBoxAmount: number;
  tempGiftsAmount: {
    giftsInfo: Array<{
      key: string,
    }>
  };

  isGifts: boolean;
  isDisableIncrease: boolean = false;
  isDisableDecrease: boolean = false;

  isClickRevis: boolean = false;
  isClickNextStep: boolean = false;

  isClickRevisGifts: boolean = false;

  giftNumCtrl = {
    isDisableIncrease: false,
    isDisableDecrease: false
  }

  giftChoosenAmount: number = 0;

  constructor(
    public view: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    const data = JSON.parse(JSON.stringify(this.navParams.data))
    console.log('get')
    console.log(data)
    this.orderInfo = Object.assign({}, data)
    console.log(this.orderInfo)

    this.tempBoxAmount = this.orderInfo.boxAmount;
    this.tempGiftsAmount = JSON.parse(JSON.stringify(this.orderInfo));

    // gifts exits or not
    if(this.orderInfo.giftsInfo.length > 0) {
      this.isGifts = true;
      this.myGifts = this.orderInfo.giftsInfo;
    } else {
      this.isGifts = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FmodalCartlistPage');
  }

  isMyGift(gifts) {
    console.log('do my gifts')
    return gifts.filter(g => g.giftAmount > 0 )
  }

  reviseAmount() {
    this.isClickRevis = true;
    if(!this.isGifts) {
      this.isClickNextStep = true;
    }
  }

  reviseGifts() {
    this.isClickRevisGifts = true;

    this.isClickNextStep = true;

    // disable gift plus button in the begining
    this.giftNumCtrl.isDisableDecrease = true;
    this.giftNumCtrl.isDisableIncrease = true;

    this.orderInfo.giftsInfo.forEach(g => {
      g.giftAmount = 0;
    });

  }

  incBox() {
    this.orderInfo.boxAmount ++;
    this.isDisableDecrease = false;
    if(this.orderInfo.boxAmount == this.tempBoxAmount) {

    }
  }

  decBox() {
    if(this.orderInfo.boxAmount > 0) {
      this.orderInfo.boxAmount --;
      console.log(this.orderInfo.totalDeposit)
      console.log(this.orderInfo.boxDeposit)


      if(this.orderInfo.boxAmount == 0) {
        this.isDisableDecrease = true;
      }
    }
  }

  nextStep() {
    // disable input box number
    this.isDisableIncrease  = true;
    this.isDisableDecrease  = true;

    this.isClickNextStep = true;

    // disable gift plus button in the begining
    this.giftNumCtrl.isDisableDecrease = true;
    this.giftNumCtrl.isDisableIncrease = true;

    this.orderInfo.giftsInfo.forEach(g => {
      g.giftAmount = 0;
    });
  }

  ensureBtn() {
    this.isClickRevis = false;
    this.isClickNextStep = false;

    this.isClickRevisGifts = false;

    // reset all the status
    this.isDisableIncrease = false;
    this.isDisableDecrease = false;
    this.giftNumCtrl.isDisableIncrease = false;
    this.giftNumCtrl.isDisableIncrease = false;

    // change the limit amount with new box amount
    this.tempBoxAmount = this.orderInfo.boxAmount;
    this.tempGiftsAmount.giftsInfo.forEach(g => {
      let temp = this.orderInfo.giftsInfo.find(lg => lg.key === g.key );
      g['giftAmount'] = temp['giftAmount'];
    })

    this.orderInfo.totalDeposit = this.orderInfo.boxDeposit * this.orderInfo.boxAmount;
    this.orderInfo.totalBalance = this.orderInfo.boxBalance * this.orderInfo.boxAmount;

    this.giftChoosenAmount = 0;
  }

  disableNextStep() {
    if(this.orderInfo.boxAmount == this.tempBoxAmount) return true;
    return false;
  }

  disableEnsureBtn() {
    if(!this.isGifts) {
      if(this.orderInfo.boxAmount == this.tempBoxAmount) return true;
      return false;
    }
    if(this.giftChoosenAmount == this.orderInfo.boxAmount) return false;
    return true;
  }

  cancelBtn() {
    // rest to the orignal box amount
    this.orderInfo.boxAmount = this.tempBoxAmount;

    // rest gifts to the orignal amount
    this.orderInfo.giftsInfo.forEach(g => {
      let temp = this.tempGiftsAmount.giftsInfo.find(lg => lg.key === g.key );
      g['giftAmount'] = temp['giftAmount'];
    })

    // reset all the step button status
    this.isClickRevis = false;
    this.isClickNextStep = false;
    this.isClickRevisGifts = false;
    // reset all the input status
    this.isDisableIncrease = false;
    this.isDisableDecrease = false;
    this.giftNumCtrl.isDisableIncrease = false;
    this.giftNumCtrl.isDisableIncrease = false;

    this.giftChoosenAmount = 0;
  }

  incGift(i) {
    if(this.orderInfo.giftsInfo[i].giftAmount < this.orderInfo.boxAmount) {
      this.orderInfo.giftsInfo[i].giftAmount ++;
      this.giftChoosenAmount ++;
      this.giftNumCtrl.isDisableDecrease = false;
      if(this.orderInfo.giftsInfo[i].giftAmount == this.orderInfo.boxAmount) {
        this.giftNumCtrl.isDisableIncrease = true;
      }
    }
  }

  decGift(i) {
    if(this.orderInfo.giftsInfo[i].giftAmount > 0) {
      this.orderInfo.giftsInfo[i].giftAmount --;
      this.giftChoosenAmount --;
      this.giftNumCtrl.isDisableIncrease = false;
      // if(this.orderInfo.giftsInfo[i].giftAmount == 0) {
      //   this.giftNumCtrl.isDisableDecrease = true;
      // }
    }
  }



  closeModal() {
    this.view.dismiss(this.orderInfo);
    console.log('pass cartListModify!')
    console.log(this.orderInfo)
  }
}
