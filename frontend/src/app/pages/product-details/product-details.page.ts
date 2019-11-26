import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {ProductService} from 'src/app/core/services/productService/product.service';

import {first} from 'rxjs/operators';

import {CategoryService} from 'src/app/core/services/categoryService/category.service';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.page.html',
    styleUrls: ['./product-details.page.scss']
})
export class ProductDetailsPage implements OnInit {
    private productId;
    private productInformation;

    private loremIpsum = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
labore et dolore magna aliquyam erat, sed diam voluptua.At vero eos et accusam et justo duo dolores et ea rebum.Stet
	clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consetetur
	sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.At
	vero eos et accusam et justo duo dolores et ea rebum.Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
	dolor sit amet.`;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService
    ) {
    }

    get product() {
        return this.productInformation;
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            if (params.get('productId') === null) {
                this.router.navigate(['/subcategory']);
            } else {
                this.productId = params.get('productId');
                this.displayProductInformation(this.productId);
            }
        });
    }

    displayProductInformation(productId: any) {
        this.productService
            .getSingleProduct(productId)
            .subscribe(
                data => {
                    this.productInformation = data;
                },

                err => {
                    console.log(err);
                }
            );
    }

    createMailLink() {
        return `mailto:${this.productInformation.mail || 'mail@adresse.ch'}?subject=Request%20for%20product%20${this.productInformation.name}`;
    }
}
