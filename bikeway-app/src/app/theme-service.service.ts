import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'user-theme';
  private themeSubject = new BehaviorSubject<string>('dark');
  theme$ = this.themeSubject.asObservable();

  constructor() {}

  toggleTheme() {
    const currentTheme = this.getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.themeSubject.next(theme);

  }

  getTheme(): 'light' | 'dark' {
    return localStorage.getItem(this.THEME_KEY) as 'light' | 'dark' || 'light';
  }

  initTheme() {
    const storedTheme = this.getTheme();
    this.setTheme(storedTheme);
  }
}
