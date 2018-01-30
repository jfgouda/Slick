import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BCAService } from 'app/services/bca.service';
import { AlertService } from 'app/services';
import { BCA } from 'app/modules/bca/_model/bca';

import * as jQuery from 'jquery';
declare const $: any;

@Component({
    moduleId: module.id,
    selector: 'app-bca-create',
    templateUrl: 'create-bca.component.html'
})

export class CreateBCAComponent implements OnInit {
    id: number;
    bca: any;

    constructor(
        private route: ActivatedRoute,
        private bcaService: BCAService,
        private alertService: AlertService) {
        this.bca = new BCA();
    }

    ngOnInit() { }

    ngOnDestroy() { }

    createBCA() {
        let root = this;
        root.blockUI(true);

        root.bcaService.createBCA(root.bca)
            .finally(() => {
                root.blockUI(false);
            }).subscribe(
            data => {
                root.bca = data;
            },
            error => {
                root.alertService.error(error);
            });
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
