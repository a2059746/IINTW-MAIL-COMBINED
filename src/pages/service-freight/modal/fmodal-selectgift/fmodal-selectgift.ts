import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the FmodalSelectgiftPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fmodal-selectgift',
  templateUrl: 'fmodal-selectgift.html',
})
export class FmodalSelectgiftPage {
  data: {};
  totalGiftAmount: number = 5;
  gifts: Array<any>;
  giftsChoosenAmount: number = 0;
  isChooseDone: boolean = false;
  isWarning: boolean = false;
  isSubmit

  constructor(
    public view: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    console.log('in modal')

    // this.data = this.navParams.data;
    this.data = JSON.parse(JSON.stringify(this.navParams.data))
    this.totalGiftAmount = this.data['totalGiftAmount'];
    this.giftsChoosenAmount = this.data['giftsChoosenAmount'] || 0;
    if(this.giftsChoosenAmount == this.totalGiftAmount) {
      this.isChooseDone = true;
    }
    this.gifts = this.data['gifts'];
    // if(this.inputAmount.length > 0) {

    // }

    // this.gifts.forEach((e) => {
    //   this.inputAmount.push(0)
    // })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FmodalSelectgiftPage');
  }

  increaseBox(i) {
    if(this.giftsChoosenAmount < this.totalGiftAmount) {
      this.gifts[i]['giftAmount'] ++;
      console.log(this.gifts[i]['FGName'])
      this.giftsChoosenAmount ++;
      if(this.giftsChoosenAmount == this.totalGiftAmount) {
        this.isChooseDone = true;
        this.isWarning = false;
      }
    }
  }

  decreaseBox(i) {
    if(this.gifts[i]['giftAmount'] > 0 && this.giftsChoosenAmount > 0) {
      this.isChooseDone = false;
      this.gifts[i]['giftAmount']  --;
      console.log(this.gifts[i]['FGName']);
      this.giftsChoosenAmount --;
    } else {
      //this.isBoxNumber = false;
    }
  }

  disableIncInput() {
    if(this.giftsChoosenAmount == this.totalGiftAmount) {
      return true;
    } else {
      return false;
    }
  }

  disableDecInput(i:any = 0) {
    if(this.giftsChoosenAmount == 0) {
      return true;
    } else if(this.gifts[i]['giftAmount'] == 0) {
      return true;
    } else {
      return false;
    }
  }

  submitData() {
    if(this.giftsChoosenAmount != this.totalGiftAmount) {
      this.isWarning = true;
      return;
    }
    const data = {
      gifts: this.gifts,
      giftsChoosenAmount: this.giftsChoosenAmount
    }
    console.log('submit data')
    console.log(data)
    this.closeModal(data);
  }

  closeModal(data :any = undefined) {
    this.view.dismiss(data)
  }
}
