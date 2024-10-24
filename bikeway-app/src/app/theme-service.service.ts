import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'user-theme';
  private themeSubject = new BehaviorSubject<string>('dark'); // Default theme is dark
  theme$ = this.themeSubject.asObservable();

  constructor() {}

  // Toggle between light and dark theme
  toggleTheme() {
    const currentTheme = this.getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  // Set the theme and apply it to the document
  setTheme(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.themeSubject.next(theme); // Emit the new theme

  }

  // Retrieve the saved theme or default to light
  getTheme(): 'light' | 'dark' {
    return localStorage.getItem(this.THEME_KEY) as 'light' | 'dark' || 'light';
  }

  // Initialize the theme based on stored preference or system preference
  initTheme() {
    const storedTheme = this.getTheme();
    this.setTheme(storedTheme);
  }
}
