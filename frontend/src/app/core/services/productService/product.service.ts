import {
    Injectable
} from '@angular/core';
import {
    HttpClient,
    HttpHeaders
} from '@angular/common/http';
import {
    map
} from 'rxjs/operators';
import {
    AuthService
} from '../authService/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService
    ) {}

    productsEndpoint = 'https://moln-api.herokuapp.com/product';
    addProductsEndpoint = 'https://moln-api.herokuapp.com/product/add';
    userProductsEndpoint = 'https://moln-api.herokuapp.com/product/user';
    reviewEndpoint = 'https://moln-api.herokuapp.com/review/'

    getAllProducts() {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', 'Bearer: ' + token);
        return this.httpClient.get(this.productsEndpoint, {
            headers: headers
        });
    }

    getProductsById(id: string) {
        let products = [];
        return new Promise((resolve, reject) => {
            this.getAllProducts().subscribe(data => {
                    // filter allProducts so only the verified products of the respective category are presented
                    // @ts-ignore
                    products = data.filter(prod => prod.category._id === id).filter(prod => prod.verified);
                    resolve(products);
                },
                error => {
                    reject(error);
                });
        });
    }

    getSingleProduct(productId: any) {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', 'Bearer: ' + token);
        return this.httpClient.get(this.productsEndpoint + `/${productId}`, {
            headers: headers
        })
    }

    addNewProduct(name: string, category: string, price: number) {
        return this.httpClient.post(this.productsEndpoint + '/add', {
                name,
                category,
                price
            })
            .pipe(map(res => {
                return res;
            }));
    }

    deleteProduct(productId: string) {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', 'Bearer: ' + token);
        return this.httpClient.delete(this.productsEndpoint + `/${productId}`, {
            headers: headers
        });
    }

    updateProduct(productId: string, body: string) {
        body = JSON.parse(body);
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', 'Bearer: ' + token);
        return this.httpClient.patch(this.productsEndpoint + `/${productId}`, body, {
            headers
        });
    }

    verifyProduct(productId: string) {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', 'Bearer: ' + token);
        return this.httpClient.patch(this.productsEndpoint + `/${productId}`, {
            verified: true
        }, {
            headers
        });
    }

    reviseProduct(productId: string) {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', 'Bearer: ' + token);
        return this.httpClient.patch(this.productsEndpoint + `/${productId}`, {
            toRevise: true
        }, {
            headers
        });
    }

    addProduct(val: any, img: any) {
        const formData = new FormData();
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', 'Bearer: ' + token);
        headers.set('Content-Type', null);
        headers.set('Accept', 'multipart/form-data');
        Object.keys(val).forEach(key => {
            formData.append(key, val[key]);
        });
        formData.append('image', img);
        return this.httpClient.post(this.addProductsEndpoint, formData, {
            headers
        });
    }

    getProductsByUserId(userId: string) {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', 'Bearer: ' + token);
        return this.httpClient.get < [] > (this.userProductsEndpoint + `/${userId}`, {
            headers
        });
    }

    addReview(body: any) {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', 'Bearer: ' + token);

        return this.httpClient.post(this.reviewEndpoint + '/add', body, {
                headers
            })
            .pipe(map(res => {
                return res;
            }));
    }
}