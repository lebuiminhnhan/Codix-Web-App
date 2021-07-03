import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/class/user.model';
import { AuthenService } from 'src/app/services/authen.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  user!: User;
  disabled = true;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenService: AuthenService
  ) { }

  ngOnInit() {
    this.initForm();
    this.form.disable();
    this.authenService.user.subscribe(x => {
      if (x) {
        this.user = new User(x);
        this.f.username.setValue(this.user.userName);
        this.f.password.setValue(this.user.password);
        this.f.phone.setValue(this.user.phone);
        this.f.email.setValue(this.user.email);
        this.f.country.setValue(this.user.country);
      }
    });
  }

  enableEdit() {
    this.disabled = false;
    this.form.enable();
  }

  cancelEdit() {
    this.disabled = true;
    this.form.disable();
  }

  initForm() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(40)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      comfirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.maxLength(15)],
      email: ['', [Validators.required, Validators.maxLength(40), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      country: ['VN'],
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.form.controls.password.setValue(btoa(this.form.controls.password.value));
    this.form.controls.comfirmPassword.setValue(btoa(this.form.controls.comfirmPassword.value));
    this.authenService.update(this.user.id, this.form.value)
      .subscribe(
        data => {
          Swal.fire({
            icon: 'success',
            title: 'User has been updated',
            showConfirmButton: false,
            timer: 1500
          });
          this.cancelEdit();
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Update failed',
            showConfirmButton: false,
            timer: 1500
          })
          this.loading = false;
        });
  }

}
