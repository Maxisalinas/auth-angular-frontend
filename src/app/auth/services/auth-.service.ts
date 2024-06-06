import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { User, LoginResponse, AuthStatus, CheckTokenResponse, RegisterValues } from '../interfaces';
import { Router } from '@angular/router';



@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly baseUrl: string = environment.backendBaseUrl;
    private http = inject(HttpClient);
    private router = inject( Router );

    private _currentUser = signal<User | null>(null);
    private _authStatus = signal<AuthStatus>( AuthStatus.checking);

    public currentUser = computed( () => this._currentUser() );
    public authStatus = computed( () => this._authStatus() );

    constructor() {
        this.checkAuthStatus().subscribe();
     }

    private setAuthentication( user: User, token: string ):boolean {
        this._currentUser.set( user );
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token);
        return true;
    }

    login( email: string, password: string ): Observable<boolean> { 

        const url = `${this.baseUrl}/auth/login`;
        const body = { email, password };

        return this.http.post<LoginResponse>(url, body)
            .pipe(
                map( ({user, token}) => this.setAuthentication( user, token )),
                catchError( err => throwError( () => err.error.message) ),
            )
    } 

    checkAuthStatus(): Observable<boolean> {

        const url = `${this.baseUrl}/auth/check-token`  

        const token = localStorage.getItem('token');

        if(!token) {
            this.logout();
            return of(false);
        }

        const headers = new HttpHeaders().set( 'Authorization', `Bearer ${ token }` );

        return this.http.get<CheckTokenResponse>(url, { headers })
            .pipe(
                map( ({ token, user }) => this.setAuthentication( user, token ) ),
                catchError( () => {
                    this._authStatus.set(AuthStatus.notAuthenticated);
                    return of(false)
                }), 
            )
    }

    logout() {
        localStorage.removeItem('token');
        this._currentUser.set(null);
        this._authStatus.set(AuthStatus.notAuthenticated);
    }

    register( registerFormValues: RegisterValues  ): Observable<boolean> {

        const url = `${ this.baseUrl }/auth/register`;
        const body = registerFormValues;

        return this.http.post<boolean>( url, body )
            .pipe(
                map( () => true ),
                catchError( err => throwError( () => err.error.message) ),
            )
    }
}
