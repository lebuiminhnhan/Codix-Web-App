export class User {
  id!: string;
  userName!: string;
  password!: string;
  country!: string;
  email!: string;
  phone!: number;
  token: any;
  constructor(init: any) {
    Object.assign(this, init);
    this.userName = init?.username;
  }
}

