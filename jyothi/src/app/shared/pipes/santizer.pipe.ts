import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'santizer'
})
export class SantizerPipe implements PipeTransform {
  constructor(
    private santizer:DomSanitizer
  ) {}
  transform(value: string) {
    if(!value){
      return value;
    }
    return this.santizer.bypassSecurityTrustResourceUrl(value);
  }

}
