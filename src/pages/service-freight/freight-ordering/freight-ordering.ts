import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController, ModalOptions, ToastController, AlertController } from 'ionic-angular';

import { FREIGHT_GIFTS_PATH } from '../freight.config';
import 'rxjs/add/operator/take';
/**
 * Generated class for the FreightOrderingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-freight-ordering',
  templateUrl: 'freight-ordering.html',
})
export class FreightOrderingPage {
  vendorBox;
  boxList: object[] = [];
  vendorGifts: object[] = [];
  selectBoxInfo: {} = {FBSize:'', FBDeposit:'', FBBlance:''} ;
  isSelectBox: boolean = false;
  boxNumber: number = 0;
  isBoxNumber: boolean = false;
  boxGifts: object[] = [];
  selectGiftInfo: {} = {FGName: ''}
  selectGiftNumber: number = 1;
  isSelectGift: boolean = false;
  tableList: Array<any> = [];
  isTableList: boolean = false;
  totalDeposit: number = 0;
  totalBalance: number = 0;
  boxValue = '';

  isEnsureBoxes = false;
  giftRemaning: number;
  isGiftRemain: boolean = true;

  giftSelectModalData = {};
  giftsChoosenAmount: number = 0;

  constructor(
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public db: AngularFireDatabase,
    public modal: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    console.log('in order page: below is what i get')
    console.log(this.navParams.data)
    this.vendorBox = this.navParams.data;
    if(!this.vendorBox) {
      alert('錯誤!此廠商不存在')
      this.navCtrl.setRoot('FreightVendorlistPage')
    }

    this.boxList = this.vendorBox['boxList'];

    this.db.list(FREIGHT_GIFTS_PATH + this.vendorBox.vid).snapshotChanges().take(1).map(snaps => snaps.map(snap => ({
      ...snap.payload.val(),
      key: snap.payload.key
     }))).subscribe(list => {
      this.vendorGifts = list || [];
      console.log('vendorGifts')
      console.log(this.vendorGifts)
      if(this.vendorBox['boxName']) {
        this.boxValue = this.vendorBox['boxName'];

        let boxID = this.boxValue; //the option value of the selected box
        let boxIndex = this.boxList.findIndex(item => item['FBKey'] == boxID);

        // find the info of the selected box
        if(boxIndex >= 0) {
          console.log('selectBox')
          console.log(this.isSelectBox)
          this.isSelectBox = true;
          this.selectBoxInfo = JSON.parse(JSON.stringify(this.boxList[boxIndex])) || [];

          // find the gifts of the selected box from the vendor's gifts
          if(this.selectBoxInfo['FBGifts']) {
            this.boxGifts = [];
            this.selectBoxInfo['FBGifts'].forEach((boxGid) => {
              let gift = this.vendorGifts.find((g) => g['key'] == boxGid);
              this.boxGifts.push(gift);
            })
            console.log('boxGifts');
            console.log(this.boxGifts)
          }
        }
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FreightOrderingPage');
  }

  ionViewDidEnter() {
    //  /FREIGHT_GIFTS_PATH/%%廠商ID%%/%%箱子ID%%/ ...
    console.log('vid')
    console.log(this.vendorBox.vid)
    this.db.list(FREIGHT_GIFTS_PATH + this.vendorBox.vid).snapshotChanges().take(1).map(snaps => snaps.map(snap => ({
      ...snap.payload.val(),
      key: snap.payload.key
     }))).subscribe(list => {
      this.vendorGifts = list || [];
      console.log('vendorGifts')
      console.log(this.vendorGifts)
    })

  }

  increaseBox() {
    this.boxNumber ++;
    this.isBoxNumber = true;
  }

  decreaseBox() {
    if(this.boxNumber > 0) {
      this.boxNumber --;
    } else {
      this.isBoxNumber = false;
    }
  }

  selectBox() {
    console.log('select another box, ngModel changes')
    this.boxNumber = 0; // if the selected value changed, set the input number to 0
    let boxID = this.boxValue; //the option value of the selected box
    let boxIndex = this.boxList.findIndex(item => item['FBKey'] == boxID);

    // find the info of the selected box
    if(boxIndex >= 0) {
      console.log('selectBox')
      console.log(this.isSelectBox)
      this.isSelectBox = true;
      this.selectBoxInfo = JSON.parse(JSON.stringify(this.boxList[boxIndex])) || [];

      // find the gifts of the selected box from the vendor's gifts
      if(this.selectBoxInfo['FBGifts']) {
        this.boxGifts = [];
        this.selectBoxInfo['FBGifts'].forEach((boxGid) => {
          let gift = this.vendorGifts.find((g) => g['key'] == boxGid);
          this.boxGifts.push(gift);
        })
        console.log('boxGifts');
        console.log(this.boxGifts)
      }
    }
  }

  disableNumberInput() {
    if(!this.isSelectBox) {
      return true;
    }
    return this.isEnsureBoxes;
  }

  // selectGift(e) {
  //   let giftID = e.target.value;
  //   let giftIndex = this.boxGifts.findIndex(i => i['FGKey'] == giftID);
  //   if(giftIndex >= 0) {
  //     this.isSelectGift = true;
  //     this.selectGiftInfo = this.boxGifts[giftID] || [];
  //   }
  // }

  ensureBoxes() {
    if(this.isSelectBox && this.boxNumber > 0) {
      this.isEnsureBoxes = true;
      this.giftRemaning = this.boxNumber;

      if(!(this.selectBoxInfo['FBGifts'])) {
        this.giftRemaning = 0;
      }
    }
    this.selectBoxToast();
    this.inputNumberToast();
  }

  resetBoxes() {
    this.isEnsureBoxes = false;
    // reset modalData
    this.giftSelectModalData = {};
    // reset selectButton form "查看贈品" to "選擇贈品"
    this.isGiftRemain = true;

    this.giftsChoosenAmount = 0;
  }

  addList() {
    if(!this.isEnsureBoxes) {
      this.boxToast();
      return;
    } else if (this.giftRemaning > 0) {
      this.giftToast();
      return;
    }
    console.log('isSelectBox:' + this.isSelectBox)
    console.log('isBoxNumber:' + this.isBoxNumber)
    if(this.giftRemaning == 0) {
      let boxID = this.selectBoxInfo['FBKey'];
      let tableList = this.tableList;
      let index = tableList.findIndex(item => item['boxID'] == boxID )
      if(index >= 0) {
        tableList[index]['boxAmount'] += this.boxNumber;
        tableList[index]['totalDeposit'] += (this.selectBoxInfo['FBDeposit'] * this.boxNumber);
        tableList[index]['totalBalance'] += (this.selectBoxInfo['FBBlance'] * this.boxNumber);
        this.totalDeposit += (this.selectBoxInfo['FBDeposit'] * this.boxNumber);
        this.totalBalance += (this.selectBoxInfo['FBBlance'] * this.boxNumber);
        if(this.giftSelectModalData['gifts']){
          if(this.giftSelectModalData['gifts'].length > 0) {
            this.giftSelectModalData['gifts'].forEach(item => {
              let tmp = tableList[index]['giftsInfo'].find(i => i.FGKey == item.FGKey);
              tmp['giftAmount'] += item['giftAmount']
            })
          }
        }
      } else {
        this.totalDeposit += this.selectBoxInfo['FBDeposit'] * this.boxNumber;
        this.totalBalance += this.selectBoxInfo['FBBlance'] * this.boxNumber;
        this.tableList.push({
          boxID: boxID,
          boxPic: this.selectBoxInfo['FBPics'],
          boxDeposit: this.selectBoxInfo['FBDeposit'],
          boxBalance: this.selectBoxInfo['FBBlance'],
          totalDeposit: (this.selectBoxInfo['FBDeposit'] * this.boxNumber),
          totalBalance: (this.selectBoxInfo['FBBlance'] * this.boxNumber),
          boxAmount: this.boxNumber,
          giftsInfo: this.giftSelectModalData['gifts'] || []
        })
      }
      this.isTableList = true;

      // rest input
      this.boxValue = '';
      this.selectBoxInfo['FBSize'] = '';
      this.selectBoxInfo['FBDeposit'] = '';
      this.selectBoxInfo['FBBlance'] = '';
      this.boxNumber = 0;
      this.isSelectBox = false;
      this.isEnsureBoxes = false;
      this.giftSelectModalData = {};
      this.isGiftRemain = true;
      this.giftsChoosenAmount = 0;
    }
  }

  selectGiftModal() {
    const myOptions: ModalOptions = {
      cssClass: 'my-popup'
    }

    let totalGiftAmount = this.boxNumber;
    let gifts = this.boxGifts;

    console.log('giftSelectModalData')
    console.log(this.giftSelectModalData)

    console.log("what's wrong with my value?")
    console.log(this.boxGifts)

    if(!this.giftSelectModalData['gifts'] && this.isGiftRemain) {
      console.log('1')
      this.boxGifts.forEach(item => {
        item['giftAmount'] = 0
      })
    } else if(this.giftSelectModalData['gifts']) {
      console.log('2')
      this.boxGifts.forEach(bItem => {
        let theGift = this.giftSelectModalData['gifts'].find(mItem => mItem['key'] == bItem['key']);
        bItem['giftAmount'] = theGift['giftAmount']
      })
    }

    const myData = {
      totalGiftAmount: totalGiftAmount,
      gifts: this.boxGifts,
      giftsChoosenAmount: this.giftsChoosenAmount || 0
    }

    console.log('myData')
    console.log(myData)

    const selectGift = this.modal.create('FmodalSelectgiftPage', myData, myOptions);
    selectGift.present();

    selectGift.onDidDismiss(data => {
      console.log('dismiss data')
      console.log(data)

      if(data) {
        this.giftSelectModalData = data;
        this.giftsChoosenAmount = data['giftsChoosenAmount']
        this.giftRemaning = this.boxNumber - this.giftsChoosenAmount;
        console.log('remaning: ' + this.giftRemaning)
        if( this.giftRemaning == 0 ) {
          this.isGiftRemain = false;
        }
      }
    })
  }

  toCartList(item) {
    const listModal = this.modal.create('FmodalCartlistPage', item);
    console.log('pass')
    console.log(item)
    listModal.present();

    listModal.onDidDismiss(data => {
      console.log('get cartList modified data successfully')
      console.log(data)
      console.log('this is my orignal list data')
      console.log(this.tableList)

      // update data
      let boxIndex = this.tableList.findIndex(i => i.boxID == data.boxID);

      this.totalDeposit += ((data.boxAmount - this.tableList[boxIndex]['boxAmount']) * data.boxDeposit)
      this.totalBalance += ((data.boxAmount - this.tableList[boxIndex]['boxAmount']) * data.boxBalance)

      if(data.boxAmount == 0) {
        this.tableList.splice(boxIndex, 1);
        if(this.tableList.length < 1) {
          this.isTableList = false;
        }
      } else {
        this.tableList[boxIndex]['boxAmount'] = data.boxAmount;
        this.tableList[boxIndex]['totalDeposit'] = data.totalDeposit;
        this.tableList[boxIndex]['totalBalance'] = data.totalBalance;
        this.tableList[boxIndex]['giftsInfo'].forEach(ti => {
          let temp = data.giftsInfo.find(di => (di.key == ti.key));
          ti.giftAmount = temp.giftAmount;
        })
      }
    })
  }

  deletSelectedItem(i) {
    console.log('delete')
    this.totalDeposit -= this.tableList[i]['totalDeposit'];
    this.totalBalance -= this.tableList[i]['totalBalance'];
    this.tableList.splice(i, 1);
    if(this.tableList.length < 1) {
      this.isTableList = false;
    }
  }

  // *** Alert *** //

  deleteConfirm(i) {
    let confirm = this.alertCtrl.create({
      title: '確定要刪除此筆訂單？',
      message: '刪除後必須再重新新增',
      buttons: [
        {
          text: '返回',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '刪除',
          handler: () => {
            this.deletSelectedItem(i);
          }
        }
      ]
    });
    confirm.present()
  }

  toEnsuerIdPage() {
    const data = {
      orderInfo: this.tableList,
      totalDeposit: this.totalDeposit,
      totalBalance: this.totalBalance
    }
    console.log('push order')
    console.log(data)
    this.navCtrl.push('FreightOrderingBuyerInfoPage', data)
  }

  // *** Toast *** //
  // click 新增購買
  isEnsureBox = false;
  isEnsureGift = false;
  boxToast() {
    this.isEnsureBox = true;
    setTimeout(() => {
      this.isEnsureBox = false;
    }, 2500)
  }
  giftToast() {
    this.isEnsureGift = true;
    setTimeout(() => {
      this.isEnsureGift = false;
    }, 2500)
  }
  // click 卻定箱子與數量
  isEnsureBoxSelected = false;
  isEnsureInputNumber = false;
  selectBoxToast() {
    if(this.boxValue=='') {
      this.isEnsureBoxSelected = true;
      setTimeout(() => {
        this.isEnsureBoxSelected = false;
      }, 2500)
    }
  }
  inputNumberToast() {
    if((this.boxNumber == 0 || !this.boxNumber) && this.boxValue != '') {
      this.isEnsureInputNumber = true;
      setTimeout(() => {
        this.isEnsureInputNumber = false;
      }, 2500)
    }
  }

}
