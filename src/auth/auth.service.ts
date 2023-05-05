import { Injectable } from '@nestjs/common';
import { Auth } from './entities/auth.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth.name) private authModel: Model<Auth>) {}

  async validateUser(username: string, password: string): Promise<boolean> {
    const auth = await this.authModel.findOne({ username });

    try {
      const isValid = await bcrypt.compare(password, auth.password);
      return !!isValid;
    } catch (err) {
      return false;
    }
  }
}
