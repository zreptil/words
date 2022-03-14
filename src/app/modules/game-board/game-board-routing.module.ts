import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LetterMindComponent} from './components/letter-mind/letter-mind.component';

const routes: Routes = [
  {path: '', component: LetterMindComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameBoardRoutingModule {
}
