import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { ImageUtilService } from '../../services/image-util.service';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;
  picture: string;
  cameraOn: boolean = false;
  // profileImage: string;
  profileImage;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public camera: Camera,
    public imageUtil: ImageUtilService,
    public sanitizer: DomSanitizer) {
      
      this.profileImage = 'assets/imgs/avatar-blank.png';
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ProfilePage');
    this.loadData();
  }

  loadData() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email){
      this.clienteService.findByEmail(localUser.email)
        .subscribe(
          response => {
            this.cliente = response as ClienteDTO;
            this.getImageIfExists();
          },
          error => {
            if (error.status == 403){
              this.navCtrl.setRoot('HomePage');
            }
          }
        );
    }else{
      this.navCtrl.setRoot('HomePage');
    }
  }

  getImageIfExists() {
    this.clienteService.getImageFromBucket(this.cliente.id)
      .subscribe(
        response => {
          this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
          this.imageUtil.blobToDataURL(response)
            .then(
              dataUrl => {
                let imageUrlTemp : string = dataUrl as string;
                this.profileImage = this.sanitizer.bypassSecurityTrustUrl(imageUrlTemp);
              }
            );
        },
        error => {
          this.profileImage = 'assets/imgs/avatar-blank.png';
        }
      );
  }

  getCameraPicture() {

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      // encodingType: this.camera.EncodingType.JPEG,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then(
      (imageData) => {
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.picture = 'data:image/png;base64,' + imageData;
        this.cameraOn = false;
      },
      (error) => {
        this.cameraOn = false;
      });
  }

  getGalleryPicture() {

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      // encodingType: this.camera.EncodingType.JPEG,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then(
      (imageData) => {
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.picture = 'data:image/png;base64,' + imageData;
        this.cameraOn = false;
      },
      (error) => {
        this.cameraOn = false;
      });
  }

  sendPicture() {
    this.clienteService.uploadPicture(this.picture)
      .subscribe(
        response => {
          this.picture = null;
          // this.loadData();
          this.getImageIfExists();
        },
        error => {

        }
      );
  }

  cancel() {
    this.picture = null;
  }
}
