import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PointHistory, TransactionType, UserPoint } from "./point.model";
import { UserPointTable } from "../database/userpoint.table";
import { PointHistoryTable } from "../database/pointhistory.table";
import { PointBody as PointDto } from "./point.dto";
import { RequestQueue } from "../utils/requestqueue";


@Injectable()
export class PointService {
  private userTaskQueues: { [userId: number]: RequestQueue } = {};

  constructor(
    private readonly userDb: UserPointTable,
    private readonly historyDb: PointHistoryTable,
  ) {}

  private getQueueForUser(userId: number): RequestQueue {
    if (!this.userTaskQueues[userId]) {
      this.userTaskQueues[userId] = new RequestQueue();
    }
    return this.userTaskQueues[userId];
  }

  async chargePoint(userId: number, amount: number): Promise<UserPoint> {
    const queue = this.getQueueForUser(userId);
    return queue.enqueue(() => this.performCharge(userId, amount));
  }
  async usePoint(userId: number, amount: number): Promise<UserPoint> {
    const queue = this.getQueueForUser(userId);
    return queue.enqueue(() => this.performUse(userId, amount));
  }

  async getPoint(userId:number):Promise<UserPoint> {
    if (isNaN(userId)) {
      throw new BadRequestException(`Invalid user ID: ${userId}`);
    }
    const userPoint = await this.userDb.selectById(userId)
    if (!userPoint) {
      throw new NotFoundException(`User Id ${userId} not found`)
    }
    return userPoint
  }

  async getAllHistory(userId:number):Promise<PointHistory[]> {
    if (isNaN(userId)) {
      throw new BadRequestException(`Invalid user ID: ${userId}`);
    }
    return await this.historyDb.selectAllByUserId(userId)
  }

  private async performCharge(userId: number, amount: number): Promise<UserPoint> {
    if (amount < 0) {
        throw new BadRequestException(`Negative number input not allowed`);
    }
    const userPoint = await this.userDb.selectById(userId);
    if (!userPoint) {
        throw new NotFoundException(`User ID ${userId} not found`);
    }
    const sumPoint = userPoint.point + amount;
    if (amount >= 10000000) {
        throw new BadRequestException(`Point number is too high`)
    }
    await this.userDb.insertOrUpdate(userId, sumPoint)
    await this.historyDb.insert(userId, amount, TransactionType.CHARGE, Date.now())
    return { id: userId, point: sumPoint, updateMillis: Date.now() }
  }


  private async performUse(userId: number, amount: number): Promise<UserPoint> {
    if (amount < 0) {
        throw new BadRequestException(`Negative number input not allowed`);
    }

    const userPoint = await this.userDb.selectById(userId);
    if (!userPoint) {
        throw new NotFoundException(`User ID ${userId} not found`);
    }

    let sumPoint = userPoint.point - amount;
    if (sumPoint < 0) {
        throw new BadRequestException(`Insufficient points`);
    }

    await this.userDb.insertOrUpdate(userId, sumPoint);
    await this.historyDb.insert(userId, -amount, TransactionType.USE, Date.now());

    return { id: userId, point: sumPoint, updateMillis: Date.now() }
  }

  // 기타 메소드 (getPointById, getHistoryByUserId 등) 추가
}