import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit {
  isLoggedIn: boolean = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.checkLoginStatus();

    // Listen to router events to check login status when navigating between pages
    this.router.events.subscribe(() => {
      this.checkLoginStatus();
    });
  }

  checkLoginStatus(): void {
    const userData = localStorage.getItem('user');
    this.isLoggedIn = !!userData; // Update isLoggedIn status based on user data

    // Trigger change detection to update the view
    this.cdr.detectChanges();
  }
}
