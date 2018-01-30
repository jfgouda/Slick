import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SketchComponent } from './sketch.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from 'app/modules/security/_guard/auth.guard';

const routes: Routes = [
  { path: '', component: SketchComponent, canActivate: [AuthGuard] },
  { path: 'sketch', component: SketchComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SketchComponent]
})
export class SketchModule { }
