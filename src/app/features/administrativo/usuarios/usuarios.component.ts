import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { ProfileService } from '../../../core/services/profile.service';
import { UserProfile, UserRole } from '../../../core/models/user-profile.model';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [NgClass, DatePipe],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {
  private profileService = inject(ProfileService);
  
  usuarios = signal<UserProfile[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.loading.set(true);
    this.profileService.listProfiles().subscribe((data: UserProfile[]) => {
      this.usuarios.set(data);
      this.loading.set(false);
    });
  }

  toggleActive(user: UserProfile) {
    const novoStatus = !user.active;
    this.profileService.updateProfile(user.id, { active: novoStatus }).subscribe(res => {
      if (res) {
        this.usuarios.update(users => users.map(u => u.id === user.id ? { ...u, active: novoStatus } : u));
      }
    });
  }

  changeRole(user: UserProfile, event: Event) {
    const newRole = (event.target as HTMLSelectElement).value as UserRole;
    if (newRole === user.role) return;

    if (confirm('Tem certeza que deseja mudar o cargo deste usuário?')) {
        this.profileService.updateProfile(user.id, { role: newRole }).subscribe(res => {
            if (res) {
                this.usuarios.update(users => users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
            } else {
                // Return to original value on error (optimistic ui reset)
                this.carregarUsuarios();
            }
        });
    } else {
        (event.target as HTMLSelectElement).value = user.role;
    }
  }
}
