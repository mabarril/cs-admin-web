import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';
import { UserProfile } from '../models/user-profile.model';
import { of, BehaviorSubject } from 'rxjs';

describe('AuthService', () => {
    let service: AuthService;
    let supabaseSpy: jasmine.SpyObj<SupabaseService>;
    let profileSpy: jasmine.SpyObj<ProfileService>;
    let routerSpy: jasmine.SpyObj<Router>;

    let mockUserSubject: BehaviorSubject<any>;

    beforeEach(() => {
        mockUserSubject = new BehaviorSubject<any>(null);

        supabaseSpy = jasmine.createSpyObj('SupabaseService', ['signIn', 'signOut', 'signUp', 'resetPassword', 'updatePassword'], {
            user$: mockUserSubject.asObservable()
        });
        profileSpy = jasmine.createSpyObj('ProfileService', ['getProfile']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: SupabaseService, useValue: supabaseSpy },
                { provide: ProfileService, useValue: profileSpy },
                { provide: Router, useValue: routerSpy }
            ]
        });

        service = TestBed.inject(AuthService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should load user profile if user is authenticated at startup', () => {
        const mockProfile: UserProfile = {
            id: '123',
            full_name: 'Test User',
            role: 'admin',
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        profileSpy.getProfile.and.returnValue(of(mockProfile));

        // Simulate login event from Supabase
        mockUserSubject.next({ id: '123', email: 'test@test.com' });

        expect(profileSpy.getProfile).toHaveBeenCalledWith('123');
        expect(service.isAuthenticated()).toBeTrue();
        expect(service.isAdmin()).toBeTrue();
        expect(service.hasRole('admin')).toBeTrue();
    });

    it('should set profile to null if user logs out', async () => {
        supabaseSpy.signOut.and.resolveTo();
        await service.signOut();

        expect(supabaseSpy.signOut).toHaveBeenCalled();
        expect(service.isAuthenticated()).toBeFalse();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should call sign-in on supabase and return success', async () => {
        supabaseSpy.signIn.and.resolveTo({ session: {} } as any);

        const result = await service.signIn('test@test.com', 'pwd');

        expect(supabaseSpy.signIn).toHaveBeenCalledWith('test@test.com', 'pwd');
        expect(result.success).toBeTrue();
    });

    it('should handle sign-in errors gracefully', async () => {
        supabaseSpy.signIn.and.rejectWith({ message: 'Invalid credentials' });

        const result = await service.signIn('test@test.com', 'wrongpwd');

        expect(result.success).toBeFalse();
        expect(result.error).toBe('Invalid credentials');
    });
});
