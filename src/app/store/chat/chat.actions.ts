import { Channel } from './chat.interface';

// SEND MESSAGE
export class SendMessageAction {
  static type = '[Chat] SendMessage';
  constructor(public message: string) { }
}
export class SendMessageSuccessAction {
  static type = '[Chat] SendMessageSuccess';
}
export class SendMessageFailedAction {
  static type = '[Chat] SendMessageFailed';
  constructor(public error: any) { }
}

// GET CHANNELS LIST
export class GetChannelsAction {
  static type = '[Chat] GetChannels';
}
export class GetChannelsSuccessAction {
  static type = '[Chat] GetChannelsSuccess';
  constructor(public channels: Channel[]) { }
}
export class GetChannelsFailedAction {
  static type = '[Chat] GetChannelsFailed';
  constructor(public error: any) { }
}


// SET CHANNEL
export class SetChannelAction {
  static type = '[Chat] SetChannel';
  constructor(public message: string) { }
}
export class SetChannelSuccessAction {
  static type = '[Chat] SetChannelSuccess';
  constructor(public channel: Channel) { }
}
export class SetChannelFailedAction {
  static type = '[Chat] SetChannelFailed';
  constructor(public error: any) { }
}

// GET CHANNEL
export class GetChannelAction {
  static type = '[Chat] GetChannel';
  constructor(public uid: string) { }
}
export class GetChannelSuccessAction {
  static type = '[Chat] GetChannelSuccess';
  constructor(public channel: Channel) { }
}
export class GetChannelFailedAction {
  static type = '[Chat] GetChannelFailed';
  constructor(public error: any) { }
}


// UPDATE CHANNEL
export class UpdateChannelAction {
  static type = '[Chat] UpdateChannel';
}
export class UpdateChannelSuccessAction {
  static type = '[Chat] UpdateChannelSuccess';
}
export class UpdateChannelFailedAction {
  static type = '[Chat] UpdateChannelFailed';
  constructor(public error: any) { }
}

export class DistroyChatAction {
  static type = '[Chat] DistroyChat';
}