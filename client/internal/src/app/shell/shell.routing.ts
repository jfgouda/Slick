import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { TemplateComponent } from 'app/modules/template/template.component';
import { LoginComponent } from 'app/modules/security/login/login.component';
import { RegisterComponent } from 'app/modules/security/register/register.component';
import { AuthGuard } from 'app/modules/security/_guard/auth.guard';
import { ListBCAComponent } from 'app/modules/bca/list/list-bca.component';
import { EditBCAComponent } from 'app/modules/bca/edit/edit-bca.component';
import { CreateBCAComponent } from 'app/modules/bca/create/create-bca.component';
import { ViewBCAComponent } from 'app/modules/bca/view/view-bca.component';
import { ListBCACommentComponent } from 'app/modules/bca/comment/list/list-bca-comment.component';

const routes: Routes = [
  { path: '', redirectTo: 'template', pathMatch: 'full', canActivate: [AuthGuard] },

  { path: 'bca/list', component: ListBCAComponent, canActivate: [AuthGuard] },
  { path: 'bca/edit/:id', component: EditBCAComponent, canActivate: [AuthGuard] },
  { path: 'bca/create', component: CreateBCAComponent, canActivate: [AuthGuard] },  
  { path: 'bca/view/:id', component: ViewBCAComponent },
  { path: 'bca/view/:id/comment', component: ListBCACommentComponent }, 


  { path: 'secure/login', component: LoginComponent },
  { path: 'secure/register', component: RegisterComponent },

  { path: 'template', component: TemplateComponent, canActivate: [AuthGuard] },
  { path: 'sketch', loadChildren: 'app/modules/sketch/sketch.module#SketchModule', canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  // All lazy loaded modules will be downloaded when app finish bootstrapping. 
  // To load modules on demand, remove PreloadAllModules or implement custom preloadingStrategy`
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })], //useHash: true
  exports: [RouterModule],
})
export class AppRoutingModule { }