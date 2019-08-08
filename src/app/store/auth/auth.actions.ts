import { User } from '../user/user.interface';


// LOGIN

export class CheckSessionAction {
  static type = '[Auth] CheckSession';
}
export class LoginWithGoogleAction {
  static type = '[Auth] LoginWithGoogle';
}
export class LoginWithFacebookAction {
  static type = '[Auth] LoginWithFacebook';
}
export class LoginWithEmailAndPasswordAction {
  static type = '[Auth] LoginWithEmailAndPassword';
  constructor(public email: string, public password: string) {}
}
export class LogoutAction {
  static type = '[Auth] Logout';
}
export class LogoutSuccessAction {
  static type = '[Auth] LogoutSuccess';
}

export class LoginSuccessAction {
  static type = '[Auth] LoginSuccess';
  constructor(public uid: string) {}
}
export class LoginFailedAction {
  static type = '[Auth] LoginFailed';
  constructor(public error: any) {}
}

// REGISTER

export class RegisterWithEmailAndPasswordAction {
  static type = '[Auth] RegisterWithEmailAndPassword';
  constructor(public name: string, public email: string, public password: string) {}
}
export class RegisterSuccessAction {
  static type = '[Auth] RegisterSuccess';
  constructor(public user: User) {}
}
export class RegisternFailedAction {
  static type = '[Auth] RegisterFailed';
  constructor(public error: any) {}
}