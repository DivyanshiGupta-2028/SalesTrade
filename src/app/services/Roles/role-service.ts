import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private roles: string[] = [];

  constructor(private http: HttpClient) {}

  loadUserRoles(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<string[]>(`/api/Roles/GetRolesByUserId/${userId}`)
        .subscribe({
          next: (data) => {
            this.roles = data;
            resolve();
          },
          error: (err) => reject(err)
        });
    });
  }

  getUserRoles(): string[] {
    return this.roles;
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  setRoles(roles: string[]) {
    this.roles = roles;
  }

  getRoles(): string[] {
    return this.roles;
  }


}
