import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/class/user.model';
import { AuthenService } from 'src/app/services/authen.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user!: User;

  constructor(private authenService: AuthenService) {
  }

  ngOnInit() {
    this.authenService.user.subscribe(x =>
      {
        this.user = new User(x);
      });
  }

}
