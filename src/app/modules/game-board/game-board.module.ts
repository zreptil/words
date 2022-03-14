import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LetterMindComponent} from './components/letter-mind/letter-mind.component';
import {GameBoardRoutingModule} from './game-board-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';

@NgModule({
  declarations: [
    LetterMindComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GameBoardRoutingModule,
    MaterialModule
  ]
})
export class GameBoardModule { }
