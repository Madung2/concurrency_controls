import { Module } from "@nestjs/common";
import { PointHistoryTable } from "./pointhistory.table";
import { UserPointTable } from "./userpoint.table";


// 의존성을 자동으로 주입
@Module({
    providers: [UserPointTable, PointHistoryTable],
    exports: [UserPointTable, PointHistoryTable]
})
export class DatabaseModule {}