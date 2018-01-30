import { AuthGuard } from './_guard/auth.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'app/shared/shared.module';
import { LoginComponent } from 'app/modules/security/login/login.component';
import { RegisterComponent } from 'app/modules/security/register/register.component';

import { AppConfig } from 'app/app.config';
import { AlertService, AuthenticationService, UserService } from 'app/services';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'secure/login', component: LoginComponent },
    { path: 'secure/register', component: RegisterComponent },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [LoginComponent, RegisterComponent],
    providers: [
        AppConfig,
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService
    ]
})
export class SecurityModule { }