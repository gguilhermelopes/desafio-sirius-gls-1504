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

  findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
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
    return this.prisma.$transaction(async (transaction) => {
      const user = await transaction.user.create({
        data: data.user,
      });

      const refreshSession = await transaction.refreshSession.create({
        data: {
          ...data.refreshSession,
          userId: user.id,
        },
      });

      return { refreshSession, user };
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

  findActiveSessionById(id: string) {
    return this.prisma.refreshSession.findFirst({
      where: {
        id,
        revokedAt: null,
      },
    });
  }

  findActiveSessionsByUserId(userId: string) {
    return this.prisma.refreshSession.findMany({
      where: {
        userId,
        revokedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  revokeSession(id: string) {
    return this.prisma.refreshSession.updateMany({
      where: {
        id,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  rotateRefreshSession(data: {
    currentSessionId: string;
    newSession: {
      userId: string;
      tokenHash: string;
      expiresAt: Date;
      userAgent?: string;
      ip?: string;
    };
  }) {
    return this.prisma.$transaction(async (transaction) => {
      const revokedSession = await transaction.refreshSession.updateMany({
        where: {
          id: data.currentSessionId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      if (revokedSession.count === 0) {
        return null;
      }

      return transaction.refreshSession.create({
        data: data.newSession,
      });
    });
  }
}
