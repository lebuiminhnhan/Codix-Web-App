import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from 'src/app/services/authen.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenService: AuthenService
  ) {
      if (this.authenService.userValue) {
          this.router.navigate(['/']);
      }
  }

  ngOnInit() {
      this.form = this.formBuilder.group({
        username: ['', [Validators.required, Validators.maxLength(40)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        comfirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        phone: ['', Validators.maxLength(15)],
        email: ['', [Validators.required, Validators.maxLength(40), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
        country: ['VN'],
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
      this.submitted = true;
      if (this.form.invalid) {
          return;
      }

      this.loading = true;
      this.form.controls.password.setValue(btoa(this.form.controls.password.value));
      this.form.controls.comfirmPassword.setValue(btoa(this.form.controls.comfirmPassword.value));
      this.authenService.register(this.form.value)
          .subscribe(
              data => {
                Swal.fire({
                  icon: 'success',
                  title: 'User has been saved',
                  showConfirmButton: false,
                  timer: 1500
                })
                  this.router.navigate(['../login'], { relativeTo: this.route });
              },
              error => {
                Swal.fire({
                  icon: 'error',
                  title: 'Regiser failed',
                  showConfirmButton: false,
                  timer: 1500
                })
                  this.loading = false;
              });
  }

}
