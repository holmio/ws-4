import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(
    public toastController: ToastController,
  ) {

  }
  async show (message: string, cssClass?: string, duration: number = 3000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'top',
      cssClass: cssClass
    });
    toast.present();
  }
}
