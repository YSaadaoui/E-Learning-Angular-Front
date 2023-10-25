import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, exhaustMap, take } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private authService:AuthService ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   return this.authService.user.pipe(take(1),exhaustMap(user=>{
    if(!user){
      return next.handle(req)
    }
    console.log(user)
    console.log(user._expiration)
    console.log(user.token)
    const modifiedRequest=req.clone({headers: new HttpHeaders({'Authorization':"Bearer " + user.token})})
    return next.handle(modifiedRequest);
  }))
  }
}
