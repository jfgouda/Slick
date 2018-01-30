import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BCAService } from 'app/services/bca.service';
import { AlertService } from 'app/services';
import { BCA } from 'app/modules/bca/_model/bca';

import * as jQuery from 'jquery';
declare const $: any;

@Component({
    moduleId: module.id,
    selector: 'app-bca-edit',
    templateUrl: 'edit-bca.component.html'
})

export class EditBCAComponent implements OnInit {
    id: number;
    bca: any;
    private sub: any;

    constructor(
        private route: ActivatedRoute,
        private bcaService: BCAService,
        private alertService: AlertService) {
        this.bca = new BCA();
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.getBCA();
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getBCA() {
        let root = this;
        root.blockUI(true);

        root.bcaService.getBCAById(this.id)
            .finally(() => {
                root.blockUI(false);
            }).subscribe(
            data => {
                root.bca = data;
            },
            error => root.alertService.error(error));
    }

    updateBCA() {
        let root = this;
        root.blockUI(true);

        root.bcaService.updateBCA(root.bca)
            .finally(() => {
                root.blockUI(false);
            }).subscribe(
            data => {
                root.bca = data;
            },
            error => root.alertService.error(error));
    }

    blockUI(blocked: boolean) {
        if (!blocked) {
            $("#contentPanel").unblock();
            return;
        }
        $("#contentPanel").block({
            message: '<i class="icon-spinner2 spinner"></i>',
            overlayCSS: {
                backgroundColor: '#fff',
                opacity: 0.8,
                cursor: 'wait',
                'box-shadow': '0 0 0 1px #ddd'
            },
            css: {
                border: 0,
                padding: 0,
                backgroundColor: 'none'
            }
        });
    }
}
