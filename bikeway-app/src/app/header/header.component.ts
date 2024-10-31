import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../theme-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements AfterViewInit {
  isLoggedIn: boolean = false;
  isDarkTheme: boolean = false;
  username: string | null = null;
  isMenuOpen: boolean = false;



  constructor(private router: Router, private cdr: ChangeDetectorRef, private themeService: ThemeService) { }

  ngAfterViewInit(): void {
    this.isDarkTheme = this.themeService.getTheme() === 'dark';
    this.checkLoginStatus();
    this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
      this.cdr.detectChanges();
    });
    this.router.events.subscribe(() => {
      this.checkLoginStatus();
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  checkLoginStatus(): void {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    this.isLoggedIn = !!userData && Object.keys(userData).length > 0;
    this.username = this.isLoggedIn ? userData?.username : 'Account';
    this.cdr.detectChanges();
  }
}
