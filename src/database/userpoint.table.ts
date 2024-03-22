import { Injectable } from "@nestjs/common";
import { randomInt } from "crypto";
import { UserPoint } from "src/point/point.model";

/**
 * 해당 Table 클래스는 변경하지 않고 공개된 API 만을 사용해 데이터를 제어합니다.
 */
@Injectable()
export class UserPointTable {
    private readonly table: Map<number, UserPoint> = new Map()
    // 사용자 ID를 키로 하고 UserPoint 객체를 값으로 하는 Map을 사용해서 포인트 정보를 저장합니다.

    selectById(id: number): Promise<UserPoint> {
        // 주어진 ID에 해당하는 사용자 포인트 정보를 비동기적으로 조회(결과를 기다리는 동안 다른 작업을 할 수 있다)
        this.isValidId(id)
        return new Promise((r) => 
            setTimeout(() => {
                r(this.table.get(id) ?? { id: id, point: 0, updateMillis: Date.now() })
            }, randomInt(200))
        )
    }
    
    insertOrUpdate(id: number, amount: number): Promise<UserPoint> {
        this.isValidId(id)
        return new Promise((r) =>
            setTimeout(() => {
                console.log(`포인트 : ${amount}`)
                const userPoint = { id: id, point: amount, updateMillis: Date.now() }
                this.table.set(id, userPoint)
                r(userPoint)
            }, randomInt(300))
        )
    }
    

    private isValidId(id: number) {
        if (Number.isInteger(id) && id > 0) return
        throw new Error("올바르지 않은 ID 값 입니다.")
    }
}