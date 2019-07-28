import { UserDetail, UserUpdate, AvatarUpdate } from './user.interface';

// GET
export class GetUserAction {
  static type = '[User] GetUserData';
  constructor(public uid: string) {}
}
export class GetUserSuccessAction {
  static type = '[User] GetUserSuccess';
  constructor(public user: UserDetail) {}
}
export class GetUserFailedAction {
  static type = '[User] GetUserFailed';
  constructor(public error: any) {}
}

// CREATE
export class SetUserAction {
  static type = '[User] SetUserData';
  constructor(public user: UserDetail) {}
}
export class SetUserSuccessAction {
  static type = '[User] SetUserSuccess';
  constructor(public user: UserDetail) {}
}
export class SetUserFailedAction {
  static type = '[User] SetUserFailed';
  constructor(public error: any) {}
}

// UPDATE
export class UpdateUserAction {
  static type = '[User] UpdateUserData';
  constructor(public user: UserUpdate) {}
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
  constructor(public avatar: AvatarUpdate) {}
}
export class UpdateAvatarUserSuccessAction {
  static type = '[User] UpdateAvatarUserSuccess';
}
export class UpdateAvatarUserFailedAction {
  static type = '[User] UpdateAvatarUserFailed';
  constructor(public error: any) {}
}

