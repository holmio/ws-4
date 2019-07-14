import { UserDetail } from './user.interface';


// Actions
export class GetUserAction {
  static type = '[User] GetUserData';
  constructor(public uid: string) {}
}
export class SetUserAction {
  static type = '[User] SetUserData';
  constructor(public user: UserDetail) {}
}


// Events
export class GetUserSuccessAction {
  static type = '[User] GetUserSuccess';
  constructor(public user: UserDetail) {}
}
export class GetUserFailedAction {
  static type = '[User] GetUserFailed';
  constructor(public error: any) {}
}
export class SetUserSuccessAction {
  static type = '[User] SetUserSuccess';
  constructor(public user: UserDetail) {}
}
export class SetUserFailedAction {
  static type = '[User] SetUserFailed';
  constructor(public error: any) {}
}
