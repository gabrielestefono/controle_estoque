import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService
  ){}

  loginForm = this.formBuilder.group({
    email: ["", Validators.required],
    senha: ["", Validators.required],
  })

  registerForm = this.formBuilder.group({
    name: ["", Validators.required],
    email: ["", Validators.required],
    senha: ["", Validators.required],
  })

  public loginCard = true;

  onSubmitLoginForm(){
    if(this.loginForm.value && this.loginForm.valid){
      this.userService.authUser({
        email: this.loginForm.value.email!,
        password: this.loginForm.value.senha!,
      }).subscribe({
        next: response => {
          if(response){
            this.cookieService.set("jwt_token", response?.token);
            this.loginForm.reset();
          }
        },
        error: error => console.log(error)
      })
    }
  }

  onSubmitregisterForm(){
    if(this.registerForm.valid && this.registerForm.value){
      this.userService.signUpUser({
        name: this.registerForm.value.name!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.senha!,
      }).subscribe({
        next: response => {
          if(response){
            alert("O usuário foi criado com sucesso!");
            this.registerForm.reset();
            this.loginCard = true;
          }
        },
        error: error => console.log(error)
      })
    }
  }
}
