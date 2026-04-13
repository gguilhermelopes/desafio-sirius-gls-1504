import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  createUser(data: { name: string; email: string; passwordHash: string }) {
    return this.prisma.user.create({
      data,
    });
  }

  createUserWithRefreshSession(data: {
    user: { name: string; email: string; passwordHash: string };
    refreshSession: {
      tokenHash: string;
      expiresAt: Date;
      userAgent?: string;
      ip?: string;
    };
  }) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: data.user,
      });

      await tx.refreshSession.create({
        data: {
          ...data.refreshSession,
          userId: user.id,
        },
      });

      return user;
    });
  }

  createRefreshSession(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    userAgent?: string;
    ip?: string;
  }) {
    return this.prisma.refreshSession.create({
      data,
    });
  }
}
