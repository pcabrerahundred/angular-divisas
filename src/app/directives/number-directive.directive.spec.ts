import { NumberDirectiveDirective } from './number-directive.directive';
import { ElementRef } from '@angular/core';

describe('NumberDirectiveDirective', () => {
  it('should create an instance', () => {
    const directive = new NumberDirectiveDirective(this.ElementRef);
    expect(directive).toBeTruthy();
  });
});
