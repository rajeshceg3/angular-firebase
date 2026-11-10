import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularFireModule.initializeApp(environment.firebase)],
      declarations: [AppComponent, HelloComponent],
    }).compileComponents();
  });

  it('creates the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('names the running Angular major version', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.name).toMatch(/^Angular \d+$/);
  });

  it('renders the hello component with the app name', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('hello h1')?.textContent).toContain('Hello Angular');
  });
});
