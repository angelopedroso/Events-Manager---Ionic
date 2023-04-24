import { Injectable, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer!: Renderer2;
  private _darkMode = new BehaviorSubject<boolean>(true);

  public readonly darkMode$ = this._darkMode.asObservable();

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public toggleDarkMode(theme: string): void {
    localStorage.setItem('isDarkMode', String(this._darkMode.value));

    this.renderer.setAttribute(document.body, 'color-theme', theme);

    this._darkMode.next(!this._darkMode.value);
  }
}
