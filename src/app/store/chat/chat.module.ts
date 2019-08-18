import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { ChatState } from './chat.state';

@NgModule({
  imports: [
    AngularFireAuthModule,
    NgxsModule.forFeature([
      ChatState,
    ]),
  ],
})
export class ChatModule {
}
