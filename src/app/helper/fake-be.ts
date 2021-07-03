import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { KEY_STORAGE } from '../class/constant';
import { v4 as uuidv4 } from 'uuid';
let users = JSON.parse(localStorage.getItem(KEY_STORAGE.User_List) || 'null') || [];
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users/) && method === 'GET':
                    return getUserById();
                case url.match(/\/users/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users/) && method === 'DELETE':
                    return deleteUser();
                default:
                    return next.handle(request);
            }
        }

        function authenticate() {
            const { username, password } = body;

            const user = users.find((x: any) => x.username === username && atob(x.password) === password);
            if (!user) return error('Username or password is incorrect');
            user.token = 'fake-token';
            return ok(user);
        }

        function register() {
            const user = body

            if (users.find((x: any) => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }

            user.id = uuidv4();
            users.push(user);
            localStorage.setItem(KEY_STORAGE.User_List, JSON.stringify(users));
            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const user = users.find((x: any) => x.id === idFromUrl());
            return ok(user);
        }

        function updateUser() {
            if (!isLoggedIn()) return unauthorized();
            console.log(idFromUrl());

            let params = body;
            let user = users.find((x: any) => x.id === idFromUrl());

            if (!params.password) {
                delete params.password;
            }

            Object.assign(user, params);
            localStorage.setItem(KEY_STORAGE.User_List, JSON.stringify(users));

            return ok();
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter((x: any) => x.id !== idFromUrl());
            localStorage.setItem(KEY_STORAGE.User_List, JSON.stringify(users));
            return ok();
        }

        // helper functions

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message: any) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return urlParts[urlParts.length - 1];
        }
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
