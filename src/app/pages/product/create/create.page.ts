import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, Actions, ofActionDispatched } from '@ngxs/store';
import { CATEGORIES, CURRENCIES } from 'src/app/util/app.constants';
import { SetProductAction, Product, SetProductSuccessAction } from 'src/app/store/product';
import { Platform, ActionSheetController, NavController } from '@ionic/angular';
import * as _ from 'lodash';
import { ToastService } from 'src/app/services/toast/toast.services';
import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit, OnDestroy {

  myGroup: FormGroup;
  categories = _.cloneDeep(CATEGORIES);
  currencies = _.cloneDeep(CURRENCIES);
  customActionSheetOptions: any = {
    header: '[T]Categorias',
    subHeader: '[T]Selecciona la categoria de tu producto',
    cssClass: '[T]category-sheet'
  };
  private catSelected: string[] = [];
  private imagesSelected: string[] = [];
  private sourceType: any;
  private destroy$ = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private platform: Platform,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private cdRef: ChangeDetectorRef,
    private actions: Actions,
    private navController: NavController,
    private toastService: ToastService,
    private translate: TranslateService,
    private imagePicker: ImagePicker,
  ) { }

  ngOnInit() {
    this.myGroup = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      localization: ['', Validators.required],
      currency: ['DZD', Validators.required],
    });

    this.actions.pipe(
      ofActionDispatched(SetProductSuccessAction),
      takeUntil(this.destroy$)
    ).subscribe((action) => {
      this.navController.navigateRoot('product/detail/' + action.uid);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.next(false);
  }

  categorySelected(event: { detail: { value: any; }; }) {
    this.catSelected = [...event.detail.value];
  }

  create() {
    if (this.catSelected.length === 0) {
      return this.toastService.show('[T]Selecciona categoria');
    }
    if (this.imagesSelected.length === 0) {
      return this.toastService.show('[T]Necesitas subir minimo una foto del producto');
    }
    const productInfo: Product = {
      category: this.catSelected,
      gallery: [...this.imagesSelected],
      ...this.myGroup.value
    };
    this.store.dispatch(new SetProductAction(productInfo));
  }

  /**
   * Method to delete the picture selected
   * @param index number of picture
   */
  deletePicture(index: number) {
    // If the picture deleted is the thumbnail then we generate a new thumbnail of the second picture of the gallery
    this.cdRef.detectChanges();
    this.imagesSelected.splice(index, 1);
    this.cdRef.detectChanges();
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
            this.selectFromGallery();
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

  private selectFromGallery() {
    if (this.platform.is('cordova')) {
      const configCamera: ImagePickerOptions = {
        width: 600,
        height: 600,
        quality: 70,
        maximumImagesCount: 4 - this.imagesSelected.length,
        outputType: 1,
      };

      this.imagePicker.getPictures(configCamera).then((pictures) => {
        for (const picture of  pictures) {
          const base64Image = 'data:image/jpeg;base64,' + picture;
          this.imagesSelected.push(base64Image);
          this.cdRef.detectChanges();
        }
      }, (err) => {
        this.toastService.show(this.translate.instant('TAKE_PICTURE_ERROR_CAMERA'), 'error');
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
        this.imagesSelected.push(base64Image);
        this.cdRef.detectChanges();
      }, (error) => {
        this.toastService.show(this.translate.instant('TAKE_PICTURE_ERROR_CAMERA'), 'error');
      });
    }
  }

}
