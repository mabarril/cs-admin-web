import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { UserProfile, UserRole } from '../models/user-profile.model';

@Injectable({
    providedIn: 'root'
})
export class UserProfileService {
    private supabase = inject(SupabaseService);

    /**
     * Get user profile by ID
     */
    getProfile(userId: string): Observable<UserProfile | null> {
        return from(
            this.supabase.client
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single()
        ).pipe(
            map(({ data, error }) => {
                if (error) {
                    console.error('Error fetching user profile:', error);
                    return null;
                }
                return data as UserProfile;
            })
        );
    }

    /**
     * Get all user profiles
     */
    getAllProfiles(): Observable<UserProfile[]> {
        return from(
            this.supabase.client
                .from('user_profiles')
                .select('*')
                .order('full_name')
        ).pipe(
            map(({ data, error }) => {
                if (error) {
                    console.error('Error fetching user profiles:', error);
                    return [];
                }
                return data as UserProfile[];
            })
        );
    }

    /**
     * Get profiles by role
     */
    getProfilesByRole(role: UserRole): Observable<UserProfile[]> {
        return from(
            this.supabase.client
                .from('user_profiles')
                .select('*')
                .eq('role', role)
                .order('full_name')
        ).pipe(
            map(({ data, error }) => {
                if (error) {
                    console.error('Error fetching profiles by role:', error);
                    return [];
                }
                return data as UserProfile[];
            })
        );
    }

    /**
     * Get active profiles
     */
    getActiveProfiles(): Observable<UserProfile[]> {
        return from(
            this.supabase.client
                .from('user_profiles')
                .select('*')
                .eq('active', true)
                .order('full_name')
        ).pipe(
            map(({ data, error }) => {
                if (error) {
                    console.error('Error fetching active profiles:', error);
                    return [];
                }
                return data as UserProfile[];
            })
        );
    }

    /**
     * Create new user profile (admin only)
     */
    async createProfile(profile: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await this.supabase.client
                .from('user_profiles')
                .insert([profile]);

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Erro ao criar perfil' };
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await this.supabase.client
                .from('user_profiles')
                .update(updates)
                .eq('id', userId);

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Erro ao atualizar perfil' };
        }
    }

    /**
     * Deactivate user profile (soft delete)
     */
    async deactivateProfile(userId: string): Promise<{ success: boolean; error?: string }> {
        return this.updateProfile(userId, { active: false });
    }

    /**
     * Activate user profile
     */
    async activateProfile(userId: string): Promise<{ success: boolean; error?: string }> {
        return this.updateProfile(userId, { active: true });
    }

    /**
     * Delete user profile (hard delete - admin only)
     */
    async deleteProfile(userId: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await this.supabase.client
                .from('user_profiles')
                .delete()
                .eq('id', userId);

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Erro ao deletar perfil' };
        }
    }
}
