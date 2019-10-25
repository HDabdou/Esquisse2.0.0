import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Screen1Component } from './screen1.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Screen1RoutingModule } from './screen1-routing.module';
import { MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatSortModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [Screen1Component],
  imports: [
    CommonModule,
    FormsModule,
    Screen1RoutingModule,
    MatGridListModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatGridListModule,
    
    MatCardModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ModalModule.forRoot(),
    FlexLayoutModule.withConfig({addFlexToParent: false})
  ],
  exports: [
    MatSortModule,]
})
export class Screen1Module { }
