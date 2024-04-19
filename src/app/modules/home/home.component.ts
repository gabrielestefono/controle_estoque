import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router
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
            this.router.navigate(['/dashboard'])
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso!',
              detail: `Bem vindo de volta, ${response.name}!`,
              life: 2000
            });
          }
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao fazer login!`,
            life: 2000
          });
          console.log(error);
        }
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
            this.registerForm.reset();
            this.loginCard = true;
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso!',
              detail: `Usuário criado com sucesso!`,
              life: 2000
            });
          }
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao criar usuário!`,
            life: 2000
          });
          console.log(error);
        }
      })
    }
  }
}
