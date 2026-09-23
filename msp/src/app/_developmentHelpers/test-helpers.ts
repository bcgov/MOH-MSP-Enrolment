import { ComponentFixture, tick, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {
  DateComponent, DuplicateCheckDirective, NameComponent, PageSectionComponent, PhnComponent,
  RadioComponent, SinComponent, ValidateNameDirective
} from 'moh-common-lib-angular';
import { Type } from '@angular/core';

// Helpers for unit tests

export function tickAndDetectChanges(fixture: ComponentFixture<any>) {
  tick();
  fixture.detectChanges();
}



// Create unit test module for testing component
export function createTestingModule<T>( cmp: Type<T>,
                                        template: string,
                                        ...directives: Type<any>[] ): ComponentFixture<T> {

  TestBed.configureTestingModule({
    declarations: [
      cmp,
      ...directives
    ],
    imports: [
      BrowserModule,
      FormsModule,
      DateComponent,
      NameComponent,
      PageSectionComponent,
      PhnComponent,
      RadioComponent,
      SinComponent,
      DuplicateCheckDirective,
      ValidateNameDirective
    ],
    providers: [
      { provide: ComponentFixtureAutoDetect, useValue: true }
    ]
  }).overrideComponent(cmp, {
    set: {
      template: template
    }
});

TestBed.compileComponents();

  return TestBed.createComponent( cmp );
}
