import { Chat, Message, ChatDetail } from './chat.interface';

// GET CHAT
export class GetChatAction {
  static type = '[Chat] GetChat';
  constructor(public uid: string) { }
}
export class GetChatSuccessAction {
  static type = '[Chat] GetChatSuccess';
  constructor(public chat: Chat) { }
}
export class GetChatFailedAction {
  static type = '[Chat] GetChatFailed';
  constructor(public error: any) { }
}

// SET CHAT
export class SetChatAction {
  static type = '[Chat] SetChat';
  constructor(public chat: Chat) { }
}
export class SetChatSuccessAction {
  static type = '[Chat] SetChatSuccess';
}
export class SetChatFailedAction {
  static type = '[Chat] SetChatFailed';
  constructor(public error: any) { }
}

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

// GET CHATS DETAIL
export class GetChatsDetailAction {
  static type = '[Chat] GetChatsDetail';
}
export class GetChatsDetailSuccessAction {
  static type = '[Chat] GetChatsDetailSuccess';
  constructor(public chatsDetail: ChatDetail[]) { }
}
export class GetChatsDetailFailedAction {
  static type = '[Chat] GetChatsDetailFailed';
  constructor(public error: any) { }
}
