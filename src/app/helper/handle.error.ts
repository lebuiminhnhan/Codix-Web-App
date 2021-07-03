import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { AuthenService } from '../services/authen.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenService: AuthenService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              })
                this.authenService.logout();
            }

            const error = err.error?.message || err.statusText;
            return throwError(error);
        }))
    }
}
