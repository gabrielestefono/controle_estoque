import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private formBuilder: FormBuilder){}

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
    console.log(
      this.loginForm.value
    )
  }

  onSubmitregisterForm(){
    console.log(
      this.registerForm.value
    )
  }
}
