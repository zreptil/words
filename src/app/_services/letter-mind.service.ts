import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LetterMindService {

  constructor(public http: HttpClient) {
  }

  getLetters(length: number): Observable<string[]> {
    return this.http.get(`http://test.reptilefarm.ddns.net/words.php?length=${length}`,
      {responseType: 'text'}).pipe(
      map(
      response => {
      const ret = [];
      for (let idx = 0; idx < response.length; idx++) {
        ret.push(response.substring(idx, idx + 1));
      }
      return ret;
    }));
  }
}
