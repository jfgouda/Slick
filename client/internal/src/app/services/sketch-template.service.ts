import { Injectable } from '@angular/core';
import { UserInput } from '../modules/sketch/data-models/user-input.model';

@Injectable()
export class SketchTemplateService {
    private userInput: UserInput;

    constructor() {
        this.userInput = null;
    }

    public setSketchTemplateUserInput(userInput: UserInput): void {
        this.userInput = userInput;
    }

    public getSketchTemplateUserInput(): UserInput {
        return this.userInput;
    }
}
