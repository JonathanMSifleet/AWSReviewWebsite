import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', './../../shared-css/loginSignup.css']
})
export class SignupComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  signUp(postData: { username; firstName; email; password }) {
    console.log(
      postData.username,
      postData.firstName,
      postData.email,
      postData.password
    );
  }
}