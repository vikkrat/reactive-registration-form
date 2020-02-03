import { Injectable } from '@angular/core';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  url = 'http://localhost:3000/enroll';

  constructor(private http: HttpClient) { }

  register(userData) {
    return this.http.post(this.url, userData);
  }
}
