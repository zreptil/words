import { Injectable } from '@angular/core';
import {MenuItemData} from '../_models/menu-item-data';

@Injectable({
  providedIn: 'root'
})
export class GlobalVarsService {

  public menuItems: MenuItemData[] = [];

  constructor() { }

  /**
   * Fügt die Einträge der übergebenen Liste mit dem angegebenen
   * Separator zu einem String zusammen, wobei NULL-Werte verworfen werden.
   * @param list Liste der zusammenzuführenden Texte.
   * @param separator Separator, der zwischen den Texten eingefügt wird.
   * @param lastseparator Separator, der zwischen dem letzten und vorletzten Text eingefügt wird.
   */
  public join(list: string[], separator: string, lastseparator?: string): string {
    const entries = list.filter(elem => {
      return elem != null && elem.trim() !== '';
    });

    let ret = '';
    if (lastseparator === undefined) {
      lastseparator = separator;
    }
    entries.forEach((value, idx) => {
      if (idx === 0) {
        ret = value;
      } else if (idx < entries.length - 1) {
        ret += separator + value;
      } else {
        ret += lastseparator + value;
      }
    });

    return ret;
  }

}
