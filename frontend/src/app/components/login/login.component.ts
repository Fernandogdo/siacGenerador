import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthorizationService } from "app/services/login/authorization.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private elementRef: ElementRef,
    public authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
   
    // this.ngAfterViewInit()
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  // ngAfterViewInit() {
  //   this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
  //   "#003F72";
  // }

  signIn() {
    this.authorizationService.consultarUsuarioIngreso(this.loginForm.value)
  }

  resetForm(){
    this.loginForm.reset();
  }
}
