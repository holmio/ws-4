import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CATEGORIES, CURRENCIES } from 'src/app/util/app.constants';
import { SetProductAction } from 'src/app/store/product';
import { IonSelect, Platform, ActionSheetController } from '@ionic/angular';
import { parseCategoryList } from 'src/app/util/common';
import * as _ from 'lodash';
import { ToastService } from 'src/app/services/toast/toast.services';
import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  myGroup: FormGroup;
  categories = _.cloneDeep(CATEGORIES);
  currencies = _.cloneDeep(CURRENCIES);
  private catSelected: string[] = [];
  private imagesSelected: string[] = [];
  private sourceType: any;
  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private platform: Platform,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private cdRef: ChangeDetectorRef,
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
      category: ['ropa', Validators.required],
    });
  }

  categorySelected(event: { detail: { value: any; }; }) {
    this.catSelected = [...event.detail.value];
  }

  create() {
    this.myGroup.value.category = Object.assign(parseCategoryList(this.catSelected));
    if (this.catSelected.length === 0) {
      return;
    }
    this.store.dispatch(new SetProductAction(this.myGroup.value));
    console.log('Tienes que seleccionar categoria');
  }

  /**
   * Method to delete the picture selected
   * @param index number of picture
   */
  deletePicture(index: number) {
    // If the picture deleted is the thumbnail then we generate a new thumbnail of the second picture of the gallery
    this.imagesSelected.splice(index, 1);
    this.cdRef.detectChanges();
  }
  trackItem(index: number, picture: any) {
    return `${index}-${picture}`;
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
      }

      this.imagePicker.getPictures(configCamera).then((results) => {
        for (var i = 0; i < results.length; i++) {
          const base64Image = 'data:image/jpeg;base64,' + results[i];
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
      }
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
