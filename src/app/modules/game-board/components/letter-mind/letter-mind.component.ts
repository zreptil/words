import {Component, HostListener, OnInit} from '@angular/core';
import {LetterMindService} from '../../../../_services/letter-mind.service';
import {LetterData} from '../../../../_models/letter-data';
import {GlobalVarsService} from '../../../../_services/global-vars.service';
import {MenuItemData} from '../../../../_models/menu-item-data';

@Component({
  selector: 'app-letter-mind',
  templateUrl: './letter-mind.component.html',
  styleUrls: ['./letter-mind.component.scss']
})
export class LetterMindComponent implements OnInit {
  // 'https://www.buchstaben.com/woerter-suchen?letters=&use_all_letters=one&start=&end=&contains=&entry_order_for_contains=any_order&contains_not=&entry_order_for_not_contains=any_order&pattern=&part_of_speech=&min_length=5&max_length=5&umlauts=allow'
  public solution: string[] = [];
  public wordList: LetterData[][] = [];
  public length = 5;
  public lineIdx: number = 0;
  public letterIdx: number = 0;

  public keyboard: string[][] = [
    ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä'],
    ['done', 'y', 'x', 'c', 'v', 'b', 'n', 'm', 'arrow_back']
  ];

  private wortsucheMenu: MenuItemData = {title: 'Wortsuche', url: ''};

  constructor(public gv: GlobalVarsService,
              public lms: LetterMindService) {
    gv.menuItems = [this.wortsucheMenu];
  }

  ngOnInit(): void {
    this.init();
  }

  fillWortsucheMenuItem(): void {
    console.log(this);
    const pattern: string[] = [];
    let missing = '';
    let contains = '';
    for(const letter of this.wordList[this.wordList.length-1]) {
      pattern.push(letter.char===''?'_':letter.char);
    }
    for (const line of this.keyboard) {
      for(const c of line) {
        if(c.length == 1)
        { if(this.classForKey(c).indexOf('missing') >= 0) {
          missing += c;
        } if(this.classForKey(c).indexOf('exists') >= 0) {
          contains += c;
        }
        }
      }
    }
    this.wortsucheMenu.url = `https://www.buchstaben.com/woerter-suchen?letters=&use_all_letters=one&start=&end=&contains=${contains}&entry_order_for_contains=any_order&contains_not=${missing}&entry_order_for_not_contains=any_order&pattern=${this.gv.join(pattern, '')}&part_of_speech=&min_length=5&max_length=5&umlauts=allow`;
  }

  init(): void {
    this.lms.getLetters(this.length).subscribe(letters => {
      this.solution = letters;
      // this.solution = ['g','e','b','e','t'];
      const word: LetterData[] = [];
      for (let i = 0; i < this.solution.length; i++) {
        word.push(new LetterData(''));
      }
      this.wordList = [word];
      console.log(this.solution);
    });
    this.lineIdx = 0;
    this.letterIdx = 0;
  }

  classForLine(idx: number): string[] {
    const ret: string[] = ['letterPanel', `wid${this.length}`];
    if (idx === this.lineIdx) {
      ret.push('current');
    }
    return ret;
  }

  classForKey(key: string): string[] {
    const ret = ['key'];
    let check = -1;
    for (let y = 0; y < this.lineIdx; y++) {
      const word = this.wordList[y];
      for (const letter of word) {
        if (letter.char === key) {
          if (letter.state === 2) {
            check = 2;
          } else if (letter.state === 1) {
            check = check < 2 ? 1 : check;
          } else if (letter.state === 0 && check < 0) {
            check = 0;
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
   * Update the state of the letters in the word
   * @param word word to check against solution.
   * @param idx index of letter in word.
   * @returns true, if solved, false if not solved
   */
  updateWord(word: LetterData[]): boolean {
    let ret = true;
    const check: string[] = [];
    for (let x = 0; x < this.solution.length; x++) {
      if (word[x].char === this.solution[x]) {
        word[x].state = 2;
        check.push('@');
      } else {
        word[x].state = 0;
        ret = false;
        check.push(this.solution[x]);
      }
    }

    for (let i = 0; i < word.length; i++) {
      if (word[i].state === 0) {
        if (check[i] === word[i].char) {
          word[i].state = 2;
          check[i] = '@';
        } else {
          const idx = check.indexOf(word[i].char);
          if (idx >= 0) {
            word[i].state = 1;
            check[idx] = '@';
          }
        }
      }
    }
    return ret;
  }

  classForLetter(letter: LetterData, lineIdx: number, letterIdx: number): string[] {
    const ret = ['letter'];
    if (lineIdx === this.lineIdx && letterIdx === this.letterIdx) {
      ret.push('current');
    }

    switch (letter.state) {
      case 1:
        ret.push('exists');
        break;
      case 2:
        ret.push('correct');
        break;
    }
    return ret;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key >= 'a' && event.key <= 'z') {
      this.keyClick(event.key);
    } else if ('äöü'.indexOf(event.key) >= 0) {
      this.keyClick(event.key);
    } else if (event.key === 'Enter') {
      this.keyClick('done');
    } else if (event.key === 'Backspace') {
      this.keyClick('arrow_back');
    } else if (event.key === 'ArrowRight') {
      this.keyClick('right');
    } else if (event.key === 'ArrowLeft') {
      this.keyClick('left');
    } else if (event.key === 'Delete') {
      this.keyClick('delete');
    } else if (event.key === '+') {
      this.keyClick('+');
    } else if (event.key === '-') {
      this.keyClick('-');
    }
    this.fillWortsucheMenuItem();
  }

  moveLetterIdx(diff: number): void {
    const word = this.wordList[this.lineIdx];
    this.letterIdx += diff;
    if (this.letterIdx < 0) this.letterIdx = word.length - 1;
    if (this.letterIdx >= word.length) this.letterIdx = 0;
    if (word[this.letterIdx].state === 2) this.moveLetterIdx(diff);
  }

  keyClick(key: string): void {
    if (this.lineIdx < 0) {
      if (key === 'done') {
        this.init();
      }
      return;
    }
    switch (key) {
      case 'done':
        let doCheck = true;
        for (const letter of this.wordList[this.lineIdx]) {
          if (letter.char === '') {
            doCheck = false;
          }
        }
        if (doCheck) {
          if (!this.updateWord(this.wordList[this.lineIdx])) {
            const word: LetterData[] = [];
            for (let i = 0; i < this.solution.length; i++) {
              word.push(new LetterData(''));
            }
            this.wordList.push(word);
            for (let i = 0; i < this.wordList[this.lineIdx].length; i++) {
              if (this.wordList[this.lineIdx][i].state === 2) {
                this.wordList[this.lineIdx + 1][i] = this.wordList[this.lineIdx][i];
              }
            }
            this.lineIdx = this.wordList.length - 1;
            this.letterIdx = this.wordList[this.lineIdx].findIndex(l => l.state === 0);
          } else {
            this.lineIdx = -1;
          }
        }
        break;
      case 'left':
        this.moveLetterIdx(-1);
        break;
      case 'right':
        this.moveLetterIdx(1);
        break;
      case 'arrow_back':
        this.wordList[this.lineIdx][this.letterIdx].char = '';
        this.keyClick('left');
        break;
      case 'delete':
        this.wordList[this.lineIdx][this.letterIdx].char = '';
        break;
      case '+':
        if (this.lineIdx === 0 && this.length < 10) {
          this.length++;
          this.init();
        }
        break;
      case '-':
        if (this.lineIdx === 0 && this.length > 4) {
          this.length--;
          this.init();
        }
        break;
      default:
        this.wordList[this.lineIdx][this.letterIdx].char = key;
        this.moveLetterIdx(1);
        break;
    }
  }
}
