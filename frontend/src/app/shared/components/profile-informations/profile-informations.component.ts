import {Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import {UserService} from 'src/app/core/services/userService/user.service';
import {ProgressIndicatorService} from 'src/app/core/services/progressIndicatorService/progress-indicator.service';

@Component({
    selector: 'app-profile-informations',
    templateUrl: './profile-informations.component.html',
    styleUrls: ['./profile-informations.component.scss'],
})
export class ProfileInformationsComponent implements OnInit {
    @ViewChild('grid', {static: false}) grid;
    @ViewChild('updateButton', {static: false}) updateButton;
    @Input() user;
    @Input() changeable: boolean = false;
    @Input() valuesToHide: [];
    hasChanged = false;
    KEYSTRINGS_COLUMN = 0;
    VALUES_COLUMN = 1;
    EDIT_ICON_COLUMN = 2;
    INPUT_COLUMN = 3;
    SAVE_ICON_COLUMN = 4;
    KEYS_COLUMN = 5;
    keysToName: Map<string, string> = new Map([
        ['_id', 'Id'],
        ['email', 'E-Mail address'],
        ['verifiedEmail', 'E-Mail verified'],
        ['country', 'Country'],
        ['phone', 'Phone number'],
        ['website', 'Website'],
        ['sex', 'Sex'],
        ['name', 'Name'],
        ['address', 'Address']
    ]);

    valuesToName: Map<boolean, string> = new Map([
        [true, 'Yes'],
        [false, 'No']
    ]);

    userData = [];

    constructor(private userService: UserService, private progressIndicatorService: ProgressIndicatorService) {
    }

    ngOnInit() {
        // @ts-ignore
        this.userData = Object.keys(this.user).filter(value => this.valuesToHide.indexOf(value) === -1);
        this.userData.sort();
    }

    getKeyString(key: string): string {
        return (this.keysToName.has(key)) ? this.keysToName.get(key) : key.charAt(0).toUpperCase() + key.slice(1);
    }

    getValueString(key: string) {
        const value = this.user[key.toString()];
        return (typeof value === 'boolean') ? this.valuesToName.get(value) : value;
    }

    onClickEdit() {
        const allRows = this.grid.el.children;
        for (let i = 0; i < allRows.length; i++) {
            allRows[i].children[this.VALUES_COLUMN].classList.add('hidden');
            allRows[i].children[this.EDIT_ICON_COLUMN].classList.add('hidden');
            allRows[i].children[this.INPUT_COLUMN].classList.remove('hidden');
            allRows[i].children[this.SAVE_ICON_COLUMN].classList.remove('hidden');
        }
    }

    onChangedInput() {
        if (!this.hasChanged) {
            this.grid.el.classList.add('warning');
            this.updateButton.el.classList.remove('hidden');
        }
        this.hasChanged = true;
    }

    onClickSave() {
        const body = this.getAllChangedRows();
        this.progressIndicatorService.presentLoading('Updating...');
        this.userService.updateUser(this.user._id, body).subscribe((data) => {
            this.displaySuccessSignifiers();
            this.updateComponent();
        }, (err) => {
            this.displayFailureSignifiers();
            console.log(err);
        });
    }

    getAllChangedRows(): string {
        const allRows = this.grid.el.children;
        let body = `{"userId":"${this.user._id}"`;
        for (let i = 0; i < allRows.length; i++) {
            const columns = allRows[i].children;
            const key = columns[this.KEYS_COLUMN].innerText.trim();
            const oldValue = this.user[key];
            const newValue = columns[this.INPUT_COLUMN].firstElementChild.value.trim();
            if (oldValue !== newValue) {
                body += `,"${key}":"${newValue}"`;
            }
        }
        body += '}';
        return body;
    }

    displaySuccessSignifiers() {
        this.progressIndicatorService.dismissLoadingIndicator();
        this.progressIndicatorService.presentToast('User was updated', 2000);
        this.grid.el.classList.remove('warning');
        this.grid.el.classList.add('success');
        this.updateButton.el.classList.add('hidden');
        setTimeout(() => {
            this.grid.el.classList.remove('success');
        }, 1500);
    }

    displayFailureSignifiers() {
        this.progressIndicatorService.dismissLoadingIndicator();
        this.progressIndicatorService.presentToast('User could not be updated :(', 2000, 'danger');
        this.grid.el.classList.remove('warning');
        this.grid.el.classList.add('error');
        setTimeout(() => {
            this.grid.el.classList.remove('error');
        }, 1500);
    }

    updateComponent() {
        this.retrieveNewUserInformation();
        const allRows = this.grid.el.children;
        for (let i = 0; i < allRows.length; i++) {
            allRows[i].children[this.VALUES_COLUMN].classList.remove('hidden');
            allRows[i].children[this.EDIT_ICON_COLUMN].classList.remove('hidden');
            allRows[i].children[this.INPUT_COLUMN].classList.add('hidden');
            allRows[i].children[this.SAVE_ICON_COLUMN].classList.add('hidden');
        }
    }

    retrieveNewUserInformation() {
        this.userService.getSingleUser(this.user._id).subscribe(
            (data) => {
                this.user = data;
                // @ts-ignore
                this.userData = Object.keys(this.user).filter(value => this.valuesToHide.indexOf(value) === -1);
                this.userData.sort();
            },
            (err) => {
                console.log(err);
            }
        );
    }
}
