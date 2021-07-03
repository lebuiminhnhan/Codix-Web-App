import { Component } from '@angular/core';
import { User } from './class/user.model';
import { AuthenService } from './services/authen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user: User | undefined;

    constructor(private authenService: AuthenService) {
        this.authenService.user.subscribe(x => this.user = x);
    }

    get isLogin () {
      return !this.authenService.userValue;
    }

    logout() {
        this.authenService.logout();
    }
}
