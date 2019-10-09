import { Component, OnDestroy, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/services/toast/toast.services';
import { Product } from 'src/app/store/product';
import { GetMyProductsAndFavoritesAction, UpdateAvatarUserAction, UserState } from 'src/app/store/user';
import { User } from 'src/app/store/user/user.interface';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit, OnDestroy {

  @Select(UserState.geUser) user$: Observable<User | undefined>;
  @Select(UserState.getMyProducts) products$: Observable<Product | undefined>;
  @Select(UserState.getFavoriteProducts) favorites$: Observable<Product | undefined>;
  selectSegment = 'products';
  messages$: Observable<any>;
  private sourceType: any;
  constructor(
    private platform: Platform,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private toastService: ToastService,
    private translate: TranslateService,
    private store: Store,
  ) { }

  ngOnInit() {
    this.store.dispatch(new GetMyProductsAndFavoritesAction());
  }

  ngOnDestroy(): void {
  }

  takePicture() {
    if (this.platform.is('cordova')) {
      const configCamera: CameraOptions = {
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 400,
        targetHeight: 400,
        quality: 70,
        allowEdit: true,
        cameraDirection: 1,
        correctOrientation: true,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.sourceType,
      };
      this.camera.getPicture(configCamera).then((data) => {
        const base64Image = 'data:image/jpeg;base64,' + data;
        this.store.dispatch(new UpdateAvatarUserAction(base64Image));
      }, (error) => {
        this.toastService.show({ message: this.translate.instant('TAKE_PICTURE_ERROR_CAMERA'), color: 'danger' });
      });
    }
  }

  /**
   * Present an action sheet to slelect the mode to upload the picture
   */
  async presentSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translate.instant('TAKE_PICTURE_SELECT_METHOD_OF_IMAGE_TITEL'),
      buttons: [
        {
          text: this.translate.instant('TAKE_PICTURE_BUTTON_IMAGE'),
          icon: 'image',
          handler: () => {
            this.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
            this.takePicture();
          }
        },
        {
          text: this.translate.instant('TAKE_PICTURE_BUTTON_CAMERA'),
          icon: 'camera',
          handler: () => {
            this.sourceType = this.camera.PictureSourceType.CAMERA;
            this.takePicture();
          }
        },
        {
          text: this.translate.instant('COMMON_BUTTON_CANCEL'),
          role: 'cancel',
          icon: 'close-circle',
        }
      ]
    });
    actionSheet.present();
  }

}
