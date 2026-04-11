import { registerAs } from '@nestjs/config';
import { envSchema } from './env.schema';

export default registerAs('app', () => envSchema.parse(process.env));
