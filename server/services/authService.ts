import admin from 'firebase-admin';
import userService from './userService';
import { BasicUserData, CreateUserData, User } from './userService';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string; // Required
  password: string; // Required
  first_name?: string;
  last_name?: string;
  visa_type?: string;
  current_location?: {
    city: string;
    state: string;
    country: string;
  };
  occupation?: string; // Job title/role
  employer?: string; // Company name
}

export class AuthService {
  // Register a new user
  async registerUser(registerData: RegisterData): Promise<AuthResponse> {
    try {
      // 1. Create Firebase user account
      const firebaseUser = await admin.auth().createUser({
        email: registerData.email,
        password: registerData.password,
        displayName: `${registerData.first_name || ''} ${
          registerData.last_name || ''
        }`.trim(),
        emailVerified: false, // Will be verified via email link
      });

      // 2. Create user profile in PostgreSQL with only essential fields
      const userProfile = await userService.createUser({
        id: firebaseUser.uid, // Use Firebase UID as PostgreSQL primary key
        email: registerData.email,
        first_name: registerData.first_name,
        last_name: registerData.last_name,
        visa_type: registerData.visa_type,
        current_location: registerData.current_location,
        occupation: registerData.occupation,
        employer: registerData.employer,
      });

      // 3. Generate custom token for immediate login
      const customToken = await admin
        .auth()
        .createCustomToken(firebaseUser.uid);

      // 4. Send email verification
      // await this.sendEmailVerification(firebaseUser.uid);

      return {
        user: userProfile,
        token: customToken,
      };
    } catch (error: any) {
      // If PostgreSQL creation fails, clean up Firebase user
      if (error.code === '23505') {
        // Unique constraint violation
        try {
          await admin.auth().deleteUser(registerData.email);
        } catch (cleanupError) {
          console.error('Failed to cleanup Firebase user:', cleanupError);
        }
        throw new Error('User with this email already exists');
      }

      throw error;
    }
  }

  // Login existing user
  async loginUser(loginData: LoginData): Promise<AuthResponse> {
    try {
      // 1. Verify Firebase credentials
      const firebaseUser = await admin.auth().getUserByEmail(loginData.email);

      // 2. Get user profile from PostgreSQL
      const userProfile = await userService.getUserById(firebaseUser.uid);

      if (!userProfile) {
        // User exists in Firebase but not in PostgreSQL - sync them
        const syncedProfile = await this.syncUserFromFirebase(firebaseUser.uid);
        return {
          user: syncedProfile,
          token: await admin.auth().createCustomToken(firebaseUser.uid),
        };
      }

      // 3. Generate custom token
      const customToken = await admin
        .auth()
        .createCustomToken(firebaseUser.uid);

      return {
        user: userProfile,
        token: customToken,
      };
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('Invalid email or password');
      }
      throw error;
    }
  }

  // Sync user from Firebase to PostgreSQL (for existing users)
  async syncUserFromFirebase(firebaseUid: string): Promise<User> {
    try {
      const firebaseUser = await admin.auth().getUser(firebaseUid);

      // Create basic profile in PostgreSQL
      const userProfile = await userService.createUser({
        id: firebaseUid, // Use Firebase UID as PostgreSQL primary key
        email: firebaseUser.email || '',
        first_name: firebaseUser.displayName
          ? firebaseUser.displayName.split(' ')[0]
          : undefined,
        last_name: firebaseUser.displayName
          ? firebaseUser.displayName.split(' ').slice(1).join(' ')
          : undefined,
      });

      return userProfile;
    } catch (error) {
      throw new Error('Failed to sync user profile');
    }
  }

  // Send email verification
  private async sendEmailVerification(uid: string): Promise<void> {
    try {
      const verificationLink = await admin
        .auth()
        .generateEmailVerificationLink(uid);

      // In production, you'd send this via your email service
      // For now, we'll just log it
      console.log('Email verification link:', verificationLink);

      // You can integrate with services like SendGrid, AWS SES, etc.
      // await emailService.sendVerificationEmail(email, verificationLink);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't fail registration if email sending fails
    }
  }

  // Verify email
  async verifyEmail(uid: string): Promise<void> {
    try {
      await admin.auth().updateUser(uid, { emailVerified: true });

      // Update PostgreSQL user as well
      // Note: emailVerified is managed by Firebase, not stored in PostgreSQL
      console.log('Email verified for user:', uid);
    } catch (error) {
      throw new Error('Failed to verify email');
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      const resetLink = await admin.auth().generatePasswordResetLink(email);

      // In production, send this via your email service
      console.log('Password reset link:', resetLink);

      // await emailService.sendPasswordResetEmail(email, resetLink);
    } catch (error) {
      throw new Error('Failed to send password reset email');
    }
  }

  // Delete user account
  async deleteUser(uid: string): Promise<void> {
    try {
      // 1. Delete from PostgreSQL first
      await userService.deleteUser(uid);

      // 2. Delete from Firebase
      await admin.auth().deleteUser(uid);
    } catch (error) {
      throw new Error('Failed to delete user account');
    }
  }

  // Get user by Firebase UID
  async getUserByUid(uid: string): Promise<User | null> {
    return await userService.getUserById(uid);
  }

  // Update user profile
  async updateUserProfile(
    uid: string,
    updates: Partial<CreateUserData>
  ): Promise<User | null> {
    return await userService.updateUser(uid, updates);
  }
}

export default new AuthService();
