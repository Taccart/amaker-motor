import { CommonMove } from './commonMoves';
import { MotorPower, MotorPower_Stop } from './motorPower'

// Enum representing possible moves for a Mecanum-wheeled system


// The MecanumWheels class provides predefined motor power configurations for different moves
export class MecanumWheelsMotorPower {

    /*
     * Particularity of Mecanum Wheels: they allow a vehicle to move in any direction without changing its orientation.
     * Each wheel has a series of rollers attached at an angle, typically 45 degrees, to the wheel's axis.
     * By varying the speed and direction of each wheel, the vehicle can move forward, backward, sideways, and diagonally,
     * as well as rotate in place. This provides a high degree of maneuverability, making Mecanum wheels ideal for
     * applications where precise movement is required, such as robotics and automated guided vehicles (AGVs).
     */

    // Predefined motor power configurations
    public static Mecanum_Stop = MotorPower_Stop;
    public static Mecanum_RotateCW = new MotorPower({ FL: 1, FR: 1, BL: -1, BR: -1 });
    public static Mecanum_RotateCCW = new MotorPower({ FL: -1, FR: -1, BL: 1, BR: 1 });
    public static Mecanum_North = new MotorPower({ FL: 1, FR: 1, BL: 1, BR: 1 });
    public static Mecanum_NorthEast = new MotorPower({ FL: 0, FR: 1, BL: 0, BR: 1 });
    public static Mecanum_East = new MotorPower({ FL: -1, FR: 1, BL: -1, BR: 1 });
    public static Mecanum_SouthEast = new MotorPower({ FL: -1, FR: 0, BL: -1, BR: 0 });
    public static Mecanum_South = new MotorPower({ FL: -1, FR: -1, BL: -1, BR: -1 });
    public static Mecanum_SouthWest = new MotorPower({ FL: 0, FR: -1, BL: -1, BR: 0 });
    public static Mecanum_West = new MotorPower({ FL: 1, FR: -1, BL: 1, BR: -1 });
    public static Mecanum_NorthWest = new MotorPower({ FL: 1, FR: 0, BL: 1, BR: 0 });

    // Method to get the motor power configuration for a given move
    public static getMove(move: CommonMove): MotorPower {
        switch (move) {
            case CommonMove.Stop:
                return MecanumWheelsMotorPower.Mecanum_Stop;
            case CommonMove.North:
                return MecanumWheelsMotorPower.Mecanum_North;
            case CommonMove.NorthEast:
                return MecanumWheelsMotorPower.Mecanum_NorthEast;
            case CommonMove.East:
                return MecanumWheelsMotorPower.Mecanum_East;
            case CommonMove.SouthEast:
                return MecanumWheelsMotorPower.Mecanum_SouthEast;
            case CommonMove.South:
            case CommonMove.SouthWest:
                return MecanumWheelsMotorPower.Mecanum_SouthWest;
            case CommonMove.West:
                return MecanumWheelsMotorPower.Mecanum_West;
            case CommonMove.NorthWest:
                return MecanumWheelsMotorPower.Mecanum_NorthWest;
            case CommonMove.ClockWise:
                return MecanumWheelsMotorPower.Mecanum_RotateCW;
            case CommonMove.CounterClockWise:
                return MecanumWheelsMotorPower.Mecanum_RotateCCW;
            default:
                console.debug(`getMove called with unknown move ${move} : returning a STOP`);
                return MotorPower_Stop;
        }
    }

    public static getFreeMecanumMove(lateral: number, longitudinal: number, rotational: number): MotorPower {
        if (lateral < -1) lateral = -1; else if (lateral > 1) lateral = 1;
        if (longitudinal < -1) longitudinal = -1; else if (longitudinal > 1) longitudinal = 1;
        if (rotational < -1) rotational = -1; else if (rotational > 1) rotational = 1;
        let r = Math.abs(lateral) + Math.abs(longitudinal) + Math.abs(rotational)
        if (r == 0)
            return MotorPower_Stop;
        return new MotorPower({
            FL: (lateral + longitudinal + rotational) / r,
            FR: (lateral - longitudinal - rotational) / r,
            BL: (lateral - longitudinal + rotational) / r,
            BR: (lateral + longitudinal - rotational) / r
        })
    }
}
