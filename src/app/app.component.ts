import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../services/auth.service';

// import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // rootPage: any = HomePage;  //=> com a inclusão do @IonicPage() na Classe HomePage, podemos 
  //                                  atribuir ao rootPage uma string com o nome da classe sem precisar importá-la e passar sua referência
  rootPage: string = 'HomePage';

  pages: Array<{title: string, component: string}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public auth: AuthService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [ //=> itens do menu de navegação (toda tela que deverá estar no menu deve ser adicionada aqui)
      // { title: 'Home', component: HomePage } //=> podemos passar também a referência do 
      //                                              component uma string com o nome da classe sem precisar importá-la
      { title: 'Profile', component: 'ProfilePage' },
      { title: 'Categorias', component: 'CategoriasPage' },
      { title: 'Logout', component: '' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page : {title: string, component: string}) {
    switch( page.title ) {
      case 'Logout':
        this.auth.logout();
        this.nav.setRoot('HomePage');
        break;
      default:
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
        break;
    }
  }
}
