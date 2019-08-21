import { User } from './user.interface';

// GET
export class GetUserAction {
  static type = '[User] GetUser';
  constructor(public uid: string) {}
}
export class GetUserSuccessAction {
  static type = '[User] GetUserSuccess';
  constructor(public user: User) {}
}
export class GetUserFailedAction {
  static type = '[User] GetUserFailed';
  constructor(public error: any) {}
}

// CREATE
export class SetUserAction {
  static type = '[User] SetUserData';
  constructor(public user: User) {}
}
export class SetUserSuccessAction {
  static type = '[User] SetUserSuccess';
  constructor(public user: User) {}
}
export class SetUserFailedAction {
  static type = '[User] SetUserFailed';
  constructor(public error: any) {}
}

// UPDATE
export class UpdateUserAction {
  static type = '[User] UpdateUserData';
  constructor(public user: User) {}
}
export class UpdateUserSuccessAction {
  static type = '[User] UpdateUserSuccess';
}
export class UpdateUserFailedAction {
  static type = '[User] UpdateUserFailed';
  constructor(public error: any) {}
}

// UPDATE AVATAR
export class UpdateAvatarUserAction {
  static type = '[User] UpdateAvatarUserData';
  constructor(public file: string) {}
}
export class UpdateAvatarUserSuccessAction {
  static type = '[User] UpdateAvatarUserSuccess';
}
export class UpdateAvatarUserFailedAction {
  static type = '[User] UpdateAvatarUserFailed';
  constructor(public error: any) {}
}

export class GetMyProductsAction {
  static type = '[Products] GetMyProducts and Favorites';
}