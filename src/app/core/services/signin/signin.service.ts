import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SigninService {
 constructor(private readonly http:HttpClient){

 }

 login(data:any):Observable<any>{

  return this.http.post("https://ecommerce.routemisr.com/api/v1/auth/signin",data)
 }
}
