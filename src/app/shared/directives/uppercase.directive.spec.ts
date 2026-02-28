import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UppercaseDirective } from './uppercase.directive';


// Componente simulado para testes
@Component({
    template: `
    <input type="text" id="reactiveInput" [formControl]="myControl" />
    <input type="text" id="templateInput" [(ngModel)]="myModel" />
    <input type="text" id="plainInput" />
    <input type="email" id="emailInput" />
    <textarea id="textArea"></textarea>
  `,
    standalone: true,
    imports: [UppercaseDirective, FormsModule, ReactiveFormsModule]
})
class TestComponent {
    myControl = new FormControl('');
    myModel = '';
}

describe('UppercaseDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent, UppercaseDirective]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    function getInputElement(id: string): HTMLInputElement {
        return fixture.debugElement.query(By.css(`#${id}`)).nativeElement;
    }

    function getTextAreaElement(id: string): HTMLTextAreaElement {
        return fixture.debugElement.query(By.css(`#${id}`)).nativeElement;
    }

    it('deve converter input em caixa alta em formulários reativos', () => {
        const input = getInputElement('reactiveInput');
        input.value = 'joão da silva';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(input.value).toBe('JOÃO DA SILVA');
        expect(component.myControl.value).toBe('JOÃO DA SILVA');
    });

    it('deve converter input em caixa alta em template-driven forms', () => {
        const input = getInputElement('templateInput');
        input.value = 'teste template';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(input.value).toBe('TESTE TEMPLATE');
    });

    it('deve converter campos de textarea', () => {
        const textarea = getTextAreaElement('textArea');
        textarea.value = 'observacao longa aqui';
        textarea.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(textarea.value).toBe('OBSERVACAO LONGA AQUI');
    });

    it('não deve converter o valor caso o tipo do input seja email', () => {
        const input = getInputElement('emailInput');
        input.value = 'teste@email.com';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(input.value).toBe('teste@email.com');
    });
});
