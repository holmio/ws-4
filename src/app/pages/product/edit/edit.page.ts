import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Select, Store, Actions, ofActionDispatched, ofActionSuccessful } from '@ngxs/store';
import { ProductState, Product, UpdateProductAction, UpdateProductSuccessAction } from 'src/app/store/product';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil, take } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isUrl } from 'src/app/util/common';
import { APP_CONST } from 'src/app/util/app.constants';
import * as _ from 'lodash';
import { NavController, ActionSheetController, Platform } from '@ionic/angular';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/services/toast/toast.services';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit, OnDestroy {

  @Select(ProductState.loading) loading$: Observable<boolean>;
  @Select(ProductState.getProduct) product$: Observable<Product>;
  myGroup: FormGroup;
  categories = _.cloneDeep(APP_CONST.categories);
  currencies = _.cloneDeep(APP_CONST.currencies);
  gallery: string[] = [];
  imagesToDelete: string[] = [];
  private sourceType: any;
  private destroy$ = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private imagePicker: ImagePicker,
    private actionSheetCtrl: ActionSheetController,
    private cdRef: ChangeDetectorRef,
    private toastService: ToastService,
    private platform: Platform,
    private camera: Camera,
    private translate: TranslateService,
    private store: Store,
    private navController: NavController,
    private actions: Actions
  ) {
  }

  ngOnInit() {

    this.product$.pipe(
      filter(data => !!data),
      take(1),
    ).subscribe(product => {
      // Filter categories
      this.categories.filter(category => {
        if (product.category.hasOwnProperty(category.value)) {
          category.selected = true;
        }
      });
      this.gallery = [...product.gallery];
      this.myGroup = this.formBuilder.group({
        name: [product.name || '', Validators.required],
        price: [product.price || '', Validators.required],
        description: [product.description || '', Validators.required],
        currency: [product.currency || 'DZD', Validators.required],
        category: [product.category || '', Validators.required],
        isEnabled: [product.isEnabled || false, Validators.required],
        isSold: [product.isSold || false, Validators.required],
      });
    });

    this.actions.pipe(
      ofActionSuccessful(UpdateProductSuccessAction),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      setTimeout(() => {
        this.navController.back();
      }, 100);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  update() {
    const finalProduct: Product = {
      ...this.getDirtyValues(this.myGroup) as any,
      gallery: [...this.gallery],
    };
    setTimeout(() => {
      this.store.dispatch(new UpdateProductAction(finalProduct, this.imagesToDelete));
    }, 100);
  }

  /**
   * Method to delete the picture selected
   * @param index number of picture
   */
  deletePicture(index: number) {
    // If the picture deleted is the thumbnail then we generate a new thumbnail of the second picture of the gallery
    this.cdRef.detectChanges();
    // To delete old picture from gallery is it necessary to have the url not base64
    if(isUrl(this.gallery[index])) {
      this.imagesToDelete.push(this.gallery[index]);
    }
    this.gallery.splice(index, 1);
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
        maximumImagesCount: 4 - this.gallery.length,
        outputType: 1,
      };

      this.imagePicker.getPictures(configCamera).then((pictures) => {
        for (const picture of pictures) {
          const base64Image = 'data:image/jpeg;base64,' + picture;
          this.gallery.push(base64Image);
          this.cdRef.detectChanges();
        }
      }, (err) => {
        this.toastService.show(this.translate.instant('TAKE_PICTURE_ERROR_CAMERA'), 'danger');
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
        this.cdRef.detectChanges();
      }, (error) => {
        this.toastService.show(this.translate.instant('TAKE_PICTURE_ERROR_CAMERA'), 'danger');
      });
    }
  }

  private getDirtyValues(form: any) {
    const dirtyValues = {};

    Object.keys(form.controls)
      .forEach(key => {
        const currentControl = form.controls[key];

        if (currentControl.dirty) {
          if (currentControl.controls) {
            dirtyValues[key] = this.getDirtyValues(currentControl);
          } else {
            dirtyValues[key] = currentControl.value;
          }
        }
      });

    return dirtyValues;
  }

}
