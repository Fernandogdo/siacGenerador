import { Component} from '@angular/core';
import { LoadingService } from './services/loading/loading.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading$ = this.loader.loading$;

  constructor(
    private loader: LoadingService
  ){
  
  }

}

