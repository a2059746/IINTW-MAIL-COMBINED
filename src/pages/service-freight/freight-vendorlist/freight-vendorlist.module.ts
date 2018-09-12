import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreightVendorlistPage } from './freight-vendorlist';
import { HttpClientModule } from '@angular/common/http';
import { FreightService } from '../freight.service';

@NgModule({
  declarations: [
    FreightVendorlistPage,
  ],
  imports: [
    IonicPageModule.forChild(FreightVendorlistPage),
    HttpClientModule,
  ],
  providers: [
    FreightService,
  ],
})
export class FreightVendorlistPageModule {}
