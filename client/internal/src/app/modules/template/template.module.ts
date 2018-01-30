import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateComponent } from './template.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from 'app/modules/security/_guard/auth.guard';


const routes: Routes = [
  { path: '', component: TemplateComponent, canActivate: [AuthGuard] },
  { path: 'template', component: TemplateComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TemplateComponent]
})
export class TemplateModule { }