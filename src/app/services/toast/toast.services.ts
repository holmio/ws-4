import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

type Color = 'danger' | 'success' | 'warning'

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(
    public toastController: ToastController,
  ) {

  }
  
  async show (message: string, color?: Color, cssClass?: string, duration: number = 3000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      position: 'top',
      cssClass: cssClass
    });
    toast.present();
  }
}
