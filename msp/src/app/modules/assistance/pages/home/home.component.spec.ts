
// NOTE (msp Angular 19 migration): this describe's only test was already
// commented out pre-migration and Jasmine tolerated the resulting empty
// describe silently. Jasmine 5's runner hard-fails on an empty describe, so
// rather than leave it silently broken, it stays fully commented here.
// Restoring the test surfaces "NullInjectorError: No provider for
// RendererFactory2" from ngx-bootstrap's BsModalService (injected directly
// by AssistanceHomeComponent) inside this isolated TestBed - adding
// BrowserModule/BrowserAnimationsModule did not resolve it. Pre-existing
// TestBed wiring gap unrelated to the library swap; flagged for Amber.
//
// describe('HomeComponent', () => {
//   let component: AssistanceHomeComponent;
//   let fixture: ComponentFixture<AssistanceHomeComponent>;
//   const activatedRouteStub = () => ({
//     route: {
//       snapshot: {
//         routeConfig: {
//           path: ''
//         }
//       }
//     }
//   });
//
//   beforeEach(waitForAsync(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         AssistanceHomeComponent,
//         AssistRatesModalComponent
//       ],
//       imports: [
//         MspCoreModule,
//         FormsModule,
//         RouterTestingModule
//       ],
//       providers: [
//         MspDataService,
//         { provide: ActivatedRoute, useFactory: activatedRouteStub }
//       ]
//     })
//     .compileComponents();
//   }));
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(AssistanceHomeComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
