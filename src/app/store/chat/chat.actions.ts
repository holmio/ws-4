import { Chat } from './chat.interface';

// GETTING PRODUCT
export class GetChatAction {
  static type = '[Chat] GetChat';
}
export class GetChatSuccessAction {
  static type = '[Chat] GetChatSuccess';
  constructor(public chat: Chat) { }
}
export class GetChatFailedAction {
  static type = '[Chat] GetChatFailed';
  constructor(public error: any) { }
}
