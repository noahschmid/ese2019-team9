import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../core/services/authService/auth.service';
import {ProductService} from '../../../core/services/productService/product.service';
import {ProgressIndicatorService} from '../../../core/services/progressIndicatorService/progress-indicator.service';

@Component({
  selector: 'app-user-products',
  templateUrl: './user-products.component.html',
  styleUrls: ['./user-products.component.scss'],
})
export class UserProductsComponent implements OnInit {
  userId;
  products = [];
  valuesToHide = ['_id', 'id', 'category', 'seller', 'reviews', 'verified', 'image', 'toRevise', 'rating'];
  additionalValues = ['category', 'verified', 'rating', 'toRevise'];

  constructor(
      private authService: AuthService,
      private productService: ProductService,
      private progressIndicatorService: ProgressIndicatorService
  ) { }

  ngOnInit() {
    this.getUserProducts();
  }

  getUserProducts() {
    this.userId = this.authService.getId();
    this.productService.getProductsByUserId(this.userId).subscribe(data => {
      this.products = data;
    }, err => {
      console.log(err);
      this.progressIndicatorService.presentToast('Products could not be updated', 3500, 'danger');
    });
  }

  deleteProduct(productId: string) {
    this.productService.deleteProduct(productId).subscribe(data => {
      this.progressIndicatorService.presentToast('Product successfully deleted', 3500, 'success');
      this.reloadProducts();
    }, err => {
      console.log(err);
      this.progressIndicatorService.presentToast('Product could not be deleted', 3500, 'danger');
    });
  }

  reloadProducts() {
    this.getUserProducts();
  }
}
