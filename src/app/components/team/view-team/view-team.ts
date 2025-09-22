import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TeamService } from '../../../services/Team/team-service';

@Component({
  selector: 'app-view-team',
   standalone: true,
  imports: [CommonModule],
  templateUrl: './view-team.html',
  styleUrl: './view-team.scss'
})
export class ViewTeam implements OnInit {
  teamMembers: any[] = [];

  private teamService = inject(TeamService); // ✅ inject service (Angular 14+ syntax)

  ngOnInit(): void {
    this.teamService.getAllTeam().subscribe({
      next: (data) => this.teamMembers = data,
      error: (err) => console.error('Error fetching team:', err)
    });
  }
}
