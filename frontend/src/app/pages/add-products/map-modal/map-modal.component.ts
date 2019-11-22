import {Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-map-modal',
    templateUrl: './map-modal.component.html',
    styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('map', {static: false}) mapElementRef: ElementRef;
    clickListener: any;
    googleMaps: any;

    constructor(private modalCtrl: ModalController,
                private renderer: Renderer2) {
    }

    ngOnInit() { }

    onCancel() {
        this.modalCtrl.dismiss();
        this.modalCtrl.dismiss();
    }

    ngAfterViewInit() {
        this.getGoogleMaps().then(googleMaps => {
            this.googleMaps = googleMaps;
            const mapEl = this.mapElementRef.nativeElement;
            console.log('help89');
            const map = new googleMaps.Map(mapEl, {
                center: {lat: -34.397, lng: 150.644 },
                zoom: 16
            });
            console.log(map);
            this.googleMaps.event.addListenerOnce(map, 'idle', () => {
                this.renderer.addClass(mapEl, 'visible');
            });
            this.clickListener = map.addListener('click', event => {
              const selectedCoords = {lat: event.latLng.lat(), lng: event.latLng.lng()};
              this.modalCtrl.dismiss(selectedCoords);
            });
        }).catch(err => {
            console.log(err);
        });
    }

    ngOnDestroy() {
        this.googleMaps.event.removeListener(this.clickListener);
    }

    private getGoogleMaps(): Promise<any> {
        const win = window as any;
        const googleModule = win.google;
        if (googleModule && googleModule.maps) {
            console.log('help99');
            return Promise.resolve(googleModule.maps);
        }
        console.log('help100');
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://maps.googleapis.com/maps/api/js?key=' + environment.googleMapsAPIKey;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
            script.onload = () => {
                const loadedGoogleModule = win.google;
                if (loadedGoogleModule && loadedGoogleModule.maps) {
                    resolve(loadedGoogleModule.maps);
                } else {
                    reject('Google maps SDK not available');
                }
            };
        });
    }
}
