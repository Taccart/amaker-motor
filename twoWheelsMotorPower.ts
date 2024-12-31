import { CommonMove } from './commonMoves';
import { MotorPower, MotorPower_Stop } from './motorPower'

export class TwoWheelsMotorPower {

    public static MotorPower_North =
        new MotorPower({ FL: 1, FR: 1, BL: 1, BR: 1 });
    public static MotorPower_South =
        new MotorPower({ FL: -1, FR: -1, BL: -1, BR: -1 });
    public static MotorPower_CounterClockWise =
        new MotorPower({ FL: 1, FR: -1, BL: 1, BR: -1 });
    public static MotorPower_ClockWise =
        new MotorPower({ FL: -1, FR: 1, BL: -1, BR: 1 });

    public static getMove(move: CommonMove): MotorPower {
        switch (move) {
            case CommonMove.Stop:
                return MotorPower_Stop;
            case CommonMove.North:
                return TwoWheelsMotorPower.MotorPower_North
            case CommonMove.South:
                return TwoWheelsMotorPower.MotorPower_South
            case CommonMove.ClockWise:
                return TwoWheelsMotorPower.MotorPower_ClockWise
            case CommonMove.CounterClockWise:
                return TwoWheelsMotorPower.MotorPower_CounterClockWise
            default:
                console.debug(`getMove called with unknown move ${move} : returning a STOP`);
                return MotorPower_Stop
        }
    }
}
