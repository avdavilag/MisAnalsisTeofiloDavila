import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {


  transform(value: string, args: string): any {
    if (args && value) {
      value = String(value);
      if (value.toUpperCase().includes(args.toUpperCase())) {
        return value.toUpperCase().replace(args.toUpperCase(), "<span class='highlight-text'>" + args.toUpperCase() + "</span>")
      }
    }
    return value

  }

}
