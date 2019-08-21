import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

/**
 * Generated class for the ProdutosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items : ProdutoDTO[] = [];

  page : number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ProdutosPage');
    this.loadData();
  }

  loadData() {
    let categoria_id = this.navParams.get('categoria_id');
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(categoria_id, this.page, 10)
        .subscribe(
          response => {
            // this.items = response['content'];
            let start = this.items.length;
            this.items = this.items.concat(response['content']); //adicionando a nova lista retornada com a lista da página anterior
            let end = this.items.length - 1;
            this.loadImageUrls(start, end);
            loader.dismiss();
            console.log(this.page);
            console.log(this.items);
          },
          error => {
            loader.dismiss();
          }
        );
  }

  presentLoading() {
    let loader = this.loadingCtrl.create(
      {
        content: "Aguarde..."
      }
    );
    loader.present();
    return loader;
  }

  doRefresh(refresher) {
    this.page = 0;
    this.items = [];
    
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {

    this.page++;
    this.loadData();

    setTimeout(
      () => {
        infiniteScroll.complete();
      }, 1000);
  }

  loadImageUrls(start: number, end: number) {
    for (var i = start; i <= end; i++) {
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(
          response => {
            item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
          },
          error => {

          }
        );
    }
  }

  showDetail(produto_id : string) {
    this.navCtrl.push('ProdutoDetailPage', { produto_id : produto_id });
  }

}
