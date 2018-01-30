import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { ShellService } from 'app/services/shell.service';
import { SketchTemplateService } from 'app/services';
import { ShellModule } from 'app/shell/shell.module';
import { AppShellComponent } from 'app/shell/components/shell/app.shell.component';

@NgModule({
  declarations: [],
  imports: [BrowserModule, FormsModule, HttpModule, HttpClientModule, ShellModule],
  providers: [SketchTemplateService, ShellService],
  bootstrap: [AppShellComponent]
})
export class AppModule { }