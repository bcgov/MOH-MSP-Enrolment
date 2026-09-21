import { MspCoreModule } from './msp-core.module';

describe('CoreModule', () => {
  beforeEach(() => {
    new MspCoreModule();
  });

  it('should create an instance', () => {
    expect(MspCoreModule).toBeTruthy();
  });
});
