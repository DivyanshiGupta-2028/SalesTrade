import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LicenseService } from 'src/app/services/Licenses/licenseservice.service';
import { UserBarControl } from '../../user-bar-control/user-bar-control';

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [CommonModule, UserBarControl],
  templateUrl: './view-user.html',
  styleUrl: './view-user.scss'
})
export class ViewUser implements OnInit {
pageTitle = 'My Summary';
  pageSubtitle = '';
  showBackFlag = true;
  firstName: string = '';
  constructor(private route: ActivatedRoute, private licenseService: LicenseService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'];
      if (userId) {
        this.licenseService.getUserDetail(userId).subscribe(userProfile => {
  this.pageSubtitle = `${userProfile.firstName} ${userProfile.lastName}`;
});
}
    });
  }
}
