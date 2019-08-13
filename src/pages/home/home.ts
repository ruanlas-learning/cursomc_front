import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';
// https://ionicframework.com/blog/navigating-lifecycle-events/

// ionic generate page <NomeDaPagina>  ==> cria uma nova estrutura de página contendo o "controller"

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds: CredenciaisDTO = {
    email: "",
    senha: ""
  };

  constructor(
    public navCtrl: NavController, 
    public menu: MenuController,
    public auth: AuthService) {

  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  ionViewDidEnter() {
    this.auth.refreshToken()
              .subscribe(
                response => {
                  // console.log(response.headers.get('Authorization'));
                  let authorizationValue = response.headers.get('Authorization');
                  this.auth.successfulLogin(authorizationValue);
                  this.navCtrl.setRoot('CategoriasPage');
                },
                error => {

                }
              );
  }

  login() {
    // this.navCtrl.push('CategoriasPage');
    // console.log(this.creds)
    this.auth.authenticate(this.creds)
              .subscribe(
                response => {
                  // console.log(response.headers.get('Authorization'));
                  let authorizationValue = response.headers.get('Authorization');
                  this.auth.successfulLogin(authorizationValue);
                  this.navCtrl.setRoot('CategoriasPage');
                },
                error => {

                }
              );
    // this.navCtrl.setRoot('CategoriasPage');
  }
}
