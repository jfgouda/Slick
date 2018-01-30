import { Component, OnInit } from '@angular/core';
import { BCAService } from 'app/services/bca.service';
import { AlertService } from 'app/services';

@Component({
    moduleId: module.id,
    selector: 'app-bca-comment-list',    
    templateUrl: 'list-bca-comment.component.html'
})

export class ListBCACommentComponent implements OnInit {
    model: any = {};
    loading = false;

    constructor(
        private bcaService: BCAService,
        private alertService: AlertService) { }

    ngOnInit() { }

    ngOnDestroy() { }
}
