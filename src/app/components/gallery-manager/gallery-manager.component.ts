import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/services/toast/toast.services';
import { isUrl } from 'src/app/util/common';

@Component({
  selector: 'app-gallery-manager',
  templateUrl: './gallery-manager.component.html',
  styleUrls: ['./gallery-manager.component.scss'],
})
export class GalleryManagerComponent implements OnInit {

  @Input() gallery: string[] = [];
  @Output() changeGallery = new EventEmitter<string[]>();
  @Output() changeImagesDeleted = new EventEmitter<string>();

  private sourceType: any;

  constructor(
    private platform: Platform,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private toastService: ToastService,
    private translate: TranslateService,
    private imagePicker: ImagePicker,
  ) { }

  ngOnInit() { }

  deletePicture(index: number) {
    // If the picture deleted is the avatar then we generate a new avatar of the second picture of the gallery
    if (isUrl(this.gallery[index])) {
      this.changeImagesDeleted.next(this.gallery[index]);
    }
    this.gallery.splice(index, 1);
  }

  /**
   * Present an action sheet to slelect the mode to upload the picture
   */
  async presentSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translate.instant('gallery.sheet.title'),
      buttons: [
        {
          text: this.translate.instant('gallery.sheet.button.library'),
          icon: 'image',
          handler: () => {
            this.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
            this.selectFromGallery();
          }
        },
        {
          text: this.translate.instant('gallery.sheet.button.camera'),
          icon: 'camera',
          handler: () => {
            this.sourceType = this.camera.PictureSourceType.CAMERA;
            this.takePicture();
          }
        },
        {
          text: this.translate.instant('general.cancel'),
          role: 'cancel',
          icon: 'close-circle',
        }
      ]
    });
    actionSheet.present();
  }

  private selectFromGallery() {
    if (this.platform.is('cordova')) {
      const configCamera: ImagePickerOptions = {
        width: 600,
        height: 600,
        quality: 70,
        maximumImagesCount: 4 - this.gallery.length,
        outputType: 1,
      };

      this.imagePicker.getPictures(configCamera).then((pictures) => {
        for (const picture of pictures) {
          const base64Image = 'data:image/jpeg;base64,' + picture;
          this.gallery.push(base64Image);
        }
        this.changeGallery.next(this.gallery);
      }, (err) => {
        this.toastService.show({ message: this.translate.instant('gallery.toast.get-picture.error'), color: 'danger' });
      });
    }
  }

  private takePicture() {
    if (this.platform.is('cordova')) {
      const configCamera: CameraOptions = {
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 400,
        targetHeight: 400,
        quality: 70,
        correctOrientation: true,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.sourceType,
      };
      this.camera.getPicture(configCamera).then((data) => {
        const base64Image = 'data:image/jpeg;base64,' + data;
        this.gallery.push(base64Image);
        this.changeGallery.next(this.gallery);
      }, (error) => {
        this.toastService.show({ message: this.translate.instant('gallery.toast.take-picture.error'), color: 'danger' });
      });
    }
  }

}
