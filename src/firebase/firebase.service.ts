import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fbadmin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { User } from 'src/auth/model/models';

@Injectable()
export class FirebaseService {
  private logger: Logger;

  constructor(private readonly configService: ConfigService) {
    this.logger = new Logger('Firebase');

    try {
      const credPath = this.configService.get<string>(
        'FIREBASE_ADMIN_CREDENTIALS_PATH',
      );
      if (!credPath) {
        throw new Error('Firebase Admin credential file path is not set');
      }

      const credFilePath = path.resolve(credPath);
      const serviceAccount = JSON.parse(fs.readFileSync(credFilePath, 'utf8'));

      fbadmin.initializeApp({
        credential: fbadmin.credential.cert(serviceAccount),
      });
    } catch (err) {
      this.logger.error('Error on initializing Firebase: ', err);
      throw err;
    }
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const authService = fbadmin.auth();
      const userInfo = await authService.verifyIdToken(token);

      return new User(userInfo.uid, userInfo.email, null, userInfo.role);
    } catch (err) {
      this.logger.error('Error on Token Verification:', err);
      throw err;
    }
  }

  async createUser(
    email: string,
    password: string,
    role: string,
  ): Promise<User> {
    try {
      const authService = fbadmin.auth();
      const newUser = await authService.createUser({
        email: email,
        password: password,
      });

      await authService.setCustomUserClaims(newUser.uid, { role: role });
      return new User(newUser.uid, email, password, role);
    } catch (err) {
      this.logger.error('Error on User Creation:', err);
      throw err;
    }
  }

  async getUserRole(userId: string): Promise<string> {
    try {
      const authService = fbadmin.auth();
      const user = await authService.getUser(userId);
      if (!user.customClaims?.role) {
        return '';
      }

      return user.customClaims.role;
    } catch (err) {
      this.logger.error('Error on Getting User Role:', err);
      throw err;
    }
  }

  /* Its not recommended to Verify Password in the Backend when using firebase,
     Login with Email and Password will happen in the cliend-side and token verification
     Will be done in the backend.
     Otherwise we can handle Password verifiction by storing user credentials in the Database.
     This Login method is just for testing purposes */
  async loginUser(email: string, password: string): Promise<string> {
    try {
      let app: FirebaseApp;
      if (!getApps().length || getApps().length == 0) {
        const clientCredPath = this.configService.get<string>(
          'FIREBASE_CLIENT_CREDENTIALS_PATH',
        );
        if (!clientCredPath) {
          throw new Error('Firebase Client credential file path is not set');
        }

        const credFilePath = path.resolve(clientCredPath);
        const clientConfig = JSON.parse(fs.readFileSync(credFilePath, 'utf8'));

        app = initializeApp(clientConfig);
      } else {
        app = getApp();
      }

      const auth = getAuth(app);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = result.user.getIdToken();

      return token;
    } catch (err) {
      this.logger.error('Error on Logging User in:', err);
      throw err;
    } finally {
    }
  }
}
