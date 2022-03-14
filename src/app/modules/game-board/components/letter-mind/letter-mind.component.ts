import {Component, HostListener, OnInit} from '@angular/core';
import {LetterMindService} from '../../../../_services/letter-mind.service';

export class Letter {
  public state: number = 0;

  constructor(public char: string) {
  }

  get cssClass(): string[] {
    switch (this.state) {
      case 0:
        return [];
      case 1:
        return ['exists'];
      case 2:
        return ['correct'];
    }

    return [];
  }
}

@Component({
  selector: 'app-letter-mind',
  templateUrl: './letter-mind.component.html',
  styleUrls: ['./letter-mind.component.scss']
})
export class LetterMindComponent implements OnInit {

  public solution: string[] = [];
  public wordList: string[][] = [];
  public length = 5;
  public lineIdx: number = 0;
  public letterIdx: number = 0;

  public keyboard: string[][] = [
    ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['done', 'y', 'x', 'c', 'v', 'b', 'n', 'm', 'arrow_back']
  ];

  constructor(public lms: LetterMindService) {
  }

  classForLine(idx: number): string[] {
    const ret: string[] = ['letterPanel'];
    if (idx === this.lineIdx) {
      ret.push('current');
    }
    return ret;
  }

  classForKey(key: string): string[] {
    const ret = ['key'];
    let check = -1;
    for (let y = 0; y < this.lineIdx; y++) {
      for (let x = 0; x < this.solution.length; x++) {
        if (this.wordList[y][x] === key) {
          check = check == -1 ? 0 : check;
          switch (this.checkLetter(this.wordList[y], x)) {
            case 1:
              check = check < 2 ? 1 : check;
              break;
            case 2:
              check = 2;
              break;
          }
        }
      }
    }

    switch (check) {
      case 0:
        ret.push('missing');
        break;
      case 1:
        ret.push('exists');
        break;
      case 2:
        ret.push('correct');
        break;
    }
    return ret;
  }

  /**
   * Checks the state of the letter at position letterIdx in the word
   * @param word word to check against solution.
   * @param idx index of letter in word.
   * @returns 0: no match
   *          1: exists in word, but position is false
   *          2: correct letter in correct position
   */
  checkLetter(word: string[], idx: number): number {
    if (this.solution[idx] === word[idx]) {
      return 2;
    }
    for (let i = 0; i < this.solution.length; i++) {
      if (this.solution[i] === word[idx] && this.solution[i] !== word[i]) {
        return 1;
      }
    }
    return 0;
  }

  classForLetter(word: string[], lineIdx: number, letterIdx: number): string[] {
    const ret: string[] = ['letter'];
    if (lineIdx === this.lineIdx && letterIdx === this.letterIdx) {
      ret.push('current');
    }

    if (lineIdx !== this.lineIdx) {
      switch (this.checkLetter(word, letterIdx)) {
        case 1:
          ret.push('exists');
          break;
        case 2:
          ret.push('correct');
          break;
      }
    }
    return ret;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key >= 'a' && event.key <= 'z') {
      this.keyClick(event.key);
    } else if (event.key === 'Enter') {
      this.keyClick('done');
    } else if (event.key === 'Backspace') {
      this.keyClick('arrow_back');
    }
  }

  ngOnInit(): void {
    this.lms.getLetters(5).subscribe(letters => {
      this.solution = letters;
      this.wordList = [];
      for (let idx = 0; idx < 6; idx++) {
        const word = [];
        for (let i = 0; i < this.solution.length; i++) {
          word.push('');
        }
        this.wordList.push(word);
      }
      console.log(this.solution);
    });
  }

  keyClick(key: string): void {
    switch (key) {
      case 'done':
        let doCheck = true;
        for (const letter of this.wordList[this.lineIdx]) {
          if (letter === '') {
            doCheck = false;
          }
        }
        if (doCheck) {
          if (this.lineIdx < this.wordList.length - 1) {
            this.lineIdx++;
            for (let i = 0; i < this.wordList[this.lineIdx - 1].length; i++) {
              if (this.checkLetter(this.wordList[this.lineIdx - 1], i) === 2) {
                this.wordList[this.lineIdx][i] = this.wordList[this.lineIdx - 1][i];
              }
            }
          }
        }
        break;
      case 'arrow_back':
        this.wordList[this.lineIdx][this.letterIdx] = '';
        if (this.letterIdx > 0)
          this.letterIdx--;
        else this.letterIdx = this.wordList[this.lineIdx].length - 1;
        this.wordList[this.lineIdx][this.letterIdx] = '';
        break;
      default:
        this.wordList[this.lineIdx][this.letterIdx] = key;
        if (this.letterIdx < this.wordList[this.lineIdx].length - 1) {
          this.letterIdx++;
        } else {
          this.letterIdx = 0;
        }
        break;
    }
  }
}
