import { Component, OnInit, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth-.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styles: '',
})
export class DashboardLayoutComponent {

  private authService = inject( AuthService );
  
 
  get user() {
    return this.authService.currentUser();
  }

  onLogout() {
    this.authService.logout();
  }


}
