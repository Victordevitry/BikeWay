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

  constructor(private router: Router, private cdr: ChangeDetectorRef, private themeService: ThemeService) {}

  ngAfterViewInit(): void {
    this.isDarkTheme = this.themeService.getTheme() === 'dark'; // Set initial theme state
    this.checkLoginStatus();

    // Listen to theme changes
    this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark'; // Update theme state
      this.cdr.detectChanges(); // Trigger change detection
    });

    // Listen to router events to check login status when navigating between pages
    this.router.events.subscribe(() => {
      this.checkLoginStatus();
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  checkLoginStatus(): void {
    const userData = localStorage.getItem('user');
    this.isLoggedIn = !!userData; // Update isLoggedIn status based on user data

    // Trigger change detection to update the view
    this.cdr.detectChanges();
  }
}
