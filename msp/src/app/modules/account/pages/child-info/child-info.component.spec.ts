
// NOTE (msp Angular 19 migration): this describe's only test was already
// commented out pre-migration, and its beforeEach never actually ran under
// the old test runner either (nothing invoked it without a live `it()`).
// Jasmine 5's runner hard-fails on an empty describe (no `it()` at all),
// which would abort the whole suite, so the block stays commented out here
// rather than adding a smoke test - fixture creation itself throws NG0301
// ("bs-modal" export name not found), a pre-existing TestBed wiring gap in
// this component's own spec, unrelated to the library swap. Flagged for
// Amber to restore proper coverage.
//
// describe('ChildInfoComponent', () => {
//   let component: ChildInfoComponent;
//   let fixture: ComponentFixture<ChildInfoComponent>;
//
//   beforeEach(waitForAsync(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         ChildInfoComponent,
//         AddChildComponent,
//         RemoveChildComponent,
//         UpdateChildComponent,
//         AccountPersonalInformationComponent,
//         ChildMovingInformationComponent
//       ],
//       imports: [
//         FormsModule,
//         MspCoreModule,
//         RouterTestingModule, AddressComponent, DateComponent, PageSectionComponent, RadioComponent],
//       providers: [
//         MspAccountMaintenanceDataService,
//         ProcessService,
//         MspDataService
//       ]
//     })
//     .compileComponents();
//   }));
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(ChildInfoComponent);
//     component = fixture.componentInstance;
//     spyOn(component._processService, 'setStep').and.returnValue(null);
//     fixture.detectChanges();
//   });
//
//   it('should display the Modal title and body', () => {
//     const titleEl = fixture.debugElement.query(By.css('.modal-title'));
//     expect(titleEl).toBeTruthy();
//
//     const bodyEl = fixture.debugElement.query(By.css('.modal-body'));
//     expect(bodyEl).toBeTruthy();
//   });
// });
