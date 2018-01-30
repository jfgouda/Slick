import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from 'app/shell/shell.routing';

// Load Shell module and components also the eagerly loaded module TemplateModule
import { AppShellComponent } from 'app/shell/components/shell/app.shell.component';
import { AppHeaderComponent } from 'app/shell/components/header/app.header.component';
import { AppNavigationComponent } from 'app/shell/components/navigation/app.navigation.component';

import { SharedModule } from 'app/shared/shared.module';
import { TemplateModule } from 'app/modules/template/template.module';
import { SecurityModule } from 'app/modules/security/security.module';
import { BCAModule } from 'app/modules/bca/bca.module';

import { throwIfAlreadyLoaded } from 'app/shell/shell-import-guard';
import { environment } from 'environments/environment';

@NgModule({
  imports: [CommonModule, AppRoutingModule, TemplateModule, SecurityModule, BCAModule, SharedModule],
  declarations: [AppShellComponent, AppNavigationComponent, AppHeaderComponent],
  exports: [AppShellComponent]
})
export class ShellModule {
  constructor( @Optional() @SkipSelf() parentModule: ShellModule) {
    console.log(`%c   © ${(new Date()).getFullYear()} Southern Company.     `, 'background: #eb1c24; color: white; font-size: 15px;');
    console.log(`%c   NGR Sketch: ${environment.version}   `, 'background: #00bef6; color: black; font-size: 15px;');
    throwIfAlreadyLoaded(parentModule, 'ShellModule');
  }
}