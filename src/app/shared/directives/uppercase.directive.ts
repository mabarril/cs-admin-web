import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[type=text], textarea',
  standalone: true
})
export class UppercaseDirective {

  constructor(
    private el: ElementRef,
    @Optional() @Self() private control: NgControl
  ) {}

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    
    // Ignora inputs que podem ser sensíveis a case seletivos ou que não devem ser mexidos implicitamente
    if (this.shouldIgnore(input)) {
        return;
    }

    const start = input.selectionStart;
    const end = input.selectionEnd;

    // Converte para uppercase
    const uppercaseValue = input.value.toUpperCase();

    // Atualiza o valor do elemento HTML (visual para inputs não reativos)
    input.value = uppercaseValue;

    // Atualiza o controle do formulário se existir (reativo ou template-driven)
    if (this.control && this.control.control) {
      this.control.control.setValue(uppercaseValue, { emitEvent: false });
    }

    // Restaura a posição do cursor (para que o .toUpperCase() não jogue o cursor pro final)
    if (input.setSelectionRange) {
        input.setSelectionRange(start, end);
    }
  }

  private shouldIgnore(input: HTMLInputElement | HTMLTextAreaElement): boolean {
    const ignoredTypes = ['email', 'password', 'url', 'number', 'tel', 'hidden'];
    if (input instanceof HTMLInputElement && ignoredTypes.includes(input.type)) {
        return true;
    }
    return false;
  }
}
