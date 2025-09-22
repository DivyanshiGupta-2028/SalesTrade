import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../../services/auth.service';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faChartBar,
  faReceipt,
  faFileInvoice,
  faUsers,
  faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';
interface NavLink {
  label: string;
  icon: IconDefinition;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-left-menu',
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl:'./left-menu.html',    
  styleUrls: ['./left-menu.scss']
})
export class LeftMenu  {
     @Input() showMenu = false;

  @Output() menuToggled = new EventEmitter<boolean>();
 faChartBar = faChartBar;
  faReceipt = faReceipt;
  faFileInvoice = faFileInvoice;
  faUsers = faUsers;
  faMoneyBillWave = faMoneyBillWave;
  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.menuToggled.emit(this.showMenu);
  }
}