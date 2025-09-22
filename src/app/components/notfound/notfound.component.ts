import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { faHome } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotfoundComponent {
  faHome = faHome
}
