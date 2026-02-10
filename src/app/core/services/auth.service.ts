import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { UserProfile, UserRole } from '../models/user-profile.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private supabase = inject(SupabaseService);
    private router = inject(Router);

    private currentUserProfileSubject = new BehaviorSubject<UserProfile | null>(null);
    public currentUserProfile$ = this.currentUserProfileSubject.asObservable();

    constructor() {
        // Initialize user profile on service creation
        this.initializeUserProfile();
    }

    /**
     * Initialize user profile from current session
     */
    private initializeUserProfile(): void {
        this.supabase.user$.pipe(
            switchMap(user => {
                if (!user) {
                    this.currentUserProfileSubject.next(null);
                    return of(null);
                }
                return this.loadUserProfile(user.id);
            })
        ).subscribe();
    }

    /**
     * Load user profile from database
     */
    private loadUserProfile(userId: string): Observable<UserProfile | null> {
        return from(
            this.supabase.client
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single()
        ).pipe(
            map(({ data, error }) => {
                if (error || !data) {
                    console.error('Error loading user profile:', error);
                    return null;
                }
                this.currentUserProfileSubject.next(data as UserProfile);
                return data as UserProfile;
            }),
            catchError(err => {
                console.error('Error loading user profile:', err);
                this.currentUserProfileSubject.next(null);
                return of(null);
            })
        );
    }

    /**
     * Sign in with email and password
     */
    async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await this.supabase.signIn(email, password);

            if (error) {
                return { success: false, error: error.message };
            }

            // User profile will be loaded automatically by the subscription
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Erro ao fazer login' };
        }
    }

    /**
     * Sign out current user
     */
    async signOut(): Promise<void> {
        await this.supabase.signOut();
        this.currentUserProfileSubject.next(null);
        this.router.navigate(['/login']);
    }

    /**
     * Sign up new user (creates auth user, profile must be created by admin)
     */
    async signUp(email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await this.supabase.signUp(email, password);

            if (error) {
                return { success: false, error: error.message };
            }

            // Note: User profile should be created by admin with appropriate role
            return {
                success: true,
                error: 'Conta criada! Aguarde aprovação do administrador para acessar o sistema.'
            };
        } catch (err: any) {
            return { success: false, error: err.message || 'Erro ao criar conta' };
        }
    }

    /**
     * Request password reset
     */
    async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await this.supabase.resetPassword(email);

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Erro ao solicitar reset de senha' };
        }
    }

    /**
     * Update user password
     */
    async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await this.supabase.updatePassword(newPassword);

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Erro ao atualizar senha' };
        }
    }

    /**
     * Get current user profile
     */
    get currentUserProfile(): UserProfile | null {
        return this.currentUserProfileSubject.value;
    }

    /**
     * Check if user is authenticated
     */
    get isAuthenticated(): boolean {
        return this.currentUserProfile !== null && this.currentUserProfile.active;
    }

    /**
     * Check if user has specific role
     */
    hasRole(role: UserRole): boolean {
        return this.currentUserProfile?.role === role;
    }

    /**
     * Check if user has any of the specified roles
     */
    hasAnyRole(roles: UserRole[]): boolean {
        if (!this.currentUserProfile) return false;
        return roles.includes(this.currentUserProfile.role);
    }

    /**
     * Check if user is admin
     */
    get isAdmin(): boolean {
        return this.hasRole('admin');
    }

    /**
     * Get user's role
     */
    get userRole(): UserRole | null {
        return this.currentUserProfile?.role || null;
    }
}
