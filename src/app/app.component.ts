import { Component } from '@angular/core';
import {GlobalVarsService} from './_services/global-vars.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'words';

  constructor(public gv: GlobalVarsService) {

  }
}
