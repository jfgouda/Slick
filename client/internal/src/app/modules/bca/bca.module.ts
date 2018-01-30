import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { SharedModule } from 'app/shared/shared.module';
import { BCAService } from 'app/services/bca.service';
import { ConnectivityService } from 'app/services/connectivity.service';
import { ListBCAComponent } from 'app/modules/bca/list/list-bca.component';
import { CreateBCAComponent } from 'app/modules/bca/create/create-bca.component';
import { EditBCAComponent } from 'app/modules/bca/edit/edit-bca.component';
import { ViewBCAComponent } from 'app/modules/bca/view/view-bca.component';
import { ListBCACommentComponent } from 'app/modules/bca/comment/list/list-bca-comment.component';
import { CreateBCACommentComponent } from 'app/modules/bca/comment/create/create-bca-comment.component';

const routes: Routes = [
    { path: '', component: ListBCAComponent },
    { path: 'bca/list', component: ListBCAComponent },
    { path: 'bca/create', component: CreateBCAComponent },
    { path: 'bca/edit/:id', component: EditBCAComponent },
    { path: 'bca/view/:id', component: ViewBCAComponent },
    { path: 'bca/view/:id/comment', component: ListBCACommentComponent },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DataTablesModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ListBCAComponent, CreateBCAComponent, EditBCAComponent, ViewBCAComponent, ViewBCAComponent, ListBCACommentComponent, CreateBCACommentComponent],
    providers: [BCAService, ConnectivityService]
})
export class BCAModule { }