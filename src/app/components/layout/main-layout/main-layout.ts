import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';


@Component({
  selector: 'app-main-layout',
  standalone: true,
 imports: [CommonModule, RouterModule, Header],
  templateUrl: './main-layout.html',
  styleUrl:'./main-layout.scss'
})
export class MainLayout {
 showSidebar = false;

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }
}
