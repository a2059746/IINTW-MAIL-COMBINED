import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreightOrderingPage } from './freight-ordering';

@NgModule({
  declarations: [
    FreightOrderingPage,
  ],
  imports: [
    IonicPageModule.forChild(FreightOrderingPage),
  ],
})
export class FreightOrderingPageModule {}
