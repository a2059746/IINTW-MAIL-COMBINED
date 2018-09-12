import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreightVendorPage } from './freight-vendor';
import { FreightService } from '../freight.service';

@NgModule({
  declarations: [
    FreightVendorPage,
  ],
  imports: [
    IonicPageModule.forChild(FreightVendorPage),
  ],
  providers: [
    FreightService
  ]
})
export class FreightVendorPageModule {}
