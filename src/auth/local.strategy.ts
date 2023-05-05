import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    this.logger.log(`Validating user : ${username}`);
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  authenticate(req, options: any) {
    const authHeader: string = req.headers?.authorization;

    // Validate it is using Basic Authentication
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return super.authenticate(req, options);
    }

    // Extract username and password
    const token: string = authHeader.replace('Basic ', '');
    const [username, password] = Buffer.from(token, 'base64')
      .toString()
      .split(':');

    // Delegate authentication to passport local strategy
    const newBody = { ...req.body, username, password };
    super.authenticate({ ...req, body: newBody }, options);
  }
}
