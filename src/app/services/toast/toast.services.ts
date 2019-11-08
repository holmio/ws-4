import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToastButton } from '@ionic/core';

type Color = 'danger' | 'success' | 'warning';
export interface MyToastOption {
  message: string;
  color?: Color;
  cssClass?: string;
  duration?: number;
  closeButtonText?: string;
  showCloseButton?: boolean;
  position?: 'top' | 'bottom' | 'middle';
}
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(
    public toastController: ToastController,
  ) {

  }

  async show(toastOption: MyToastOption) {
    if (!toastOption.duration) {
      toastOption.duration = 3000;
    }
    if (!toastOption.position) {
      toastOption.position = 'top';
    }
    if (!toastOption.color) {
      toastOption.color = 'success';
    }
    const toast = await this.toastController.create(toastOption);
    toast.present();
  }
}
