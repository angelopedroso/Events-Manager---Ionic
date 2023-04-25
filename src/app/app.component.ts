import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/services/theme.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Organizadores', url: '/organizadores', icon: 'person' },
    { title: 'Eventos', url: '/eventos', icon: 'diamond' },
    { title: 'Participantes', url: '/participantes', icon: 'people' },
  ];

  appDashboard = { title: 'Dashboard', url: '/home', icon: 'home' };

  public labels = ['Modo Escuro'];

  public isDarkMode!: boolean;

  constructor(private readonly _themeService: ThemeService) {}

  ngOnInit(): void {
    this._themeService.darkMode$.subscribe((isDarkMode: boolean) => {
      this.isDarkMode = isDarkMode;
    });

    if (localStorage.getItem('@eventManager:isDarkMode') === 'true') {
      this._themeService.toggleDarkMode('dark');
    }
  }

  public toggleDarkMode(): void {
    this._themeService.toggleDarkMode(this.getTheme());
  }

  public getTheme(): string {
    return this.isDarkMode ? 'dark' : 'light';
  }
}
