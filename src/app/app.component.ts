import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from './public/components/language-switcher/language-switcher.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { AuthService } from './users/services/auth.service';
import { filter } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';

interface MenuOption {
  icon: string;
  path: string;
  title: string;
  roles?: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    LanguageSwitcherComponent,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'CleanView';
  @ViewChild(MatSidenav, { static: true }) sidenav!: MatSidenav;
  showAuthButtons = true;
  showUserIcon = true;
  activeOption: string = '';
  isSidenavOpen = true;

  allOptions: MenuOption[] = [
    { icon: 'https://cdn-icons-png.flaticon.com/512/25/25694.png', path: '/home', title: 'homeTitle' },
    { icon: 'https://cdn-icons-png.flaticon.com/512/3917/3917028.png', path: '/controlPanel', title: 'controlPanelTitle', roles: ['empresa'] },
    {icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828970.png', path: '/rewards', title: 'rewards', roles: ['admin'] },
    { icon: 'https://cdn-icons-png.flaticon.com/512/2910/2910768.png', path: '/sustainableActions', title: 'sustainableActionsTitle', roles: ['empresa', 'admin'] },
    { icon: 'https://cdn-icons-png.flaticon.com/512/535/535239.png', path: '/collectionPoints', title: 'collectionPointsTitle', roles: ['empresa', 'admin'] },
    { icon: 'https://cdn-icons-png.flaticon.com/512/992/992700.png', path: '/reports', title: 'reportsTitle', roles: ['empresa', 'admin'] }
  ];

  otherOptions: MenuOption[] = [];

  constructor(
    private translate: TranslateService,
    private observer: BreakpointObserver,
    private router: Router,
    private authService: AuthService
  ) {
    // Configuración de traducción
    translate.setDefaultLang('en');
    translate.use('en');


  }

  ngOnInit(): void {
    this.observer.observe(['(max-width: 1280px)']).subscribe((response) => {
      if (response.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        //this.sidenav.open();
      }
    });

    this.authService.user$.subscribe(() => {
      this.updateMenu();
    });

    this.updateMenu();


    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;

      if (url === '/login' || url === '/register') {
        this.showAuthButtons = true;
        this.showUserIcon = false;
      } else {
        this.showAuthButtons = false;
        this.showUserIcon = true;
      }
    });
  }

  updateMenu() {
    const role = this.authService.getRole();
    this.otherOptions = this.allOptions.filter(option =>
      !option.roles || option.roles.includes(role!)
    );
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
    this.sidenav.toggle();
  }

  setActiveOption(option: string) {
    this.activeOption = option;
  }
  onSignIn() {
    this.router.navigate(['/login']);
  }

  onSignUp() {
    this.router.navigate(['/register']);
  }

}

