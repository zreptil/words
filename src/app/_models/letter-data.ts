export class LetterData {
  public state: number;

  constructor(public char: string) {
    this.state = 0;
  }

  public get cssClass(): string[] {
    switch (this.state) {
      case 0:
        return ['letter'];
      case 1:
        return ['letter', 'exists'];
      case 2:
        return ['letter', 'correct'];
    }

    return ['letter'];
  }
}

