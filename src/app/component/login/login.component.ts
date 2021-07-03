import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KEY_STORAGE } from 'src/app/class/constant';
import { AuthenService } from 'src/app/services/authen.service';
import { StorageService } from 'src/app/services/storage.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string | undefined;
    rememberMe = false;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private storageService: StorageService,
        private authenService: AuthenService
    ) {
      console.log(this.authenService.userValue);

        if (this.authenService.userValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      const rememberMeStore = JSON.parse(this.storageService.getItem(KEY_STORAGE.Remember_Me) || 'null');
      if (rememberMeStore) {
        this.loginForm.controls.username.setValue(rememberMeStore.username);
        this.loginForm.controls.password.setValue(rememberMeStore.password);
      }
    }

    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        if (this.rememberMe) {
          const rememberObj = {
            username: this.f.username.value,
            password: this.f.password.value
          }
          this.storageService.setItem(KEY_STORAGE.Remember_Me, JSON.stringify(rememberObj));
        } else {
          this.storageService.removeItem(KEY_STORAGE.Remember_Me);
        }
        this.authenService.login(this.f.username.value, this.f.password.value)
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Login failed',
                    showConfirmButton: false,
                    timer: 1500
                  })
                  console.log(error);

                    this.loading = false;
                });
    }
}
