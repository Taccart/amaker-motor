import { CommonMove } from './commonMoves';

// The MotorPower class represents the power levels for a two or four motor system.
// In case of two motors, we consider only the front ones. 
export class MotorPower {
    FL: number; // Front Left motor power
    FR: number; // Front Right motor power
    BL: number; // Back Left motor power
    BR: number; // Back Right motor power
    
    // Constructor to initialize motor power levels with normalization
    constructor({ FL, FR, BL, BR }: { FL: number; FR: number; BL: number; BR: number }) {
        this.FL = this.normalizePower(FL);
        this.FR = this.normalizePower(FR);
        this.BL = this.normalizePower(BL);
        this.BR = this.normalizePower(BR);
    }

    /**
     * Private method to normalize power levels to be within the range [-1, 1]
     * @param power number to normalize
     * @returns normalized number between -1 and 1
     */
    private normalizePower(power: number): number {
        if (power < -1) return 1;
        if (power > 1) return 1;
        return power;
    }

    /**
     * Public method to set motor power levels with normalization.
     * Powers should be between -1 and 1
        * @param FL Front Left motor power
        * @param FR Front Right motor power
        * @param BL optional Back Left motor power
        * @param BR optional Back Right motor power
        * 
    */
    public setPower(FL: number, FR: number, BL: number=0, BR: number=0): void {
        this.FL = this.normalizePower(FL);
        this.FR = this.normalizePower(FR);
        this.BL = this.normalizePower(BL);
        this.BR = this.normalizePower(BR);
    }

    // Public method to get the current motor power levels as an array
    public getPower(): number[] {
        return [this.FL, this.FR, this.BL, this.BR];
    }

    // Public method to multiply motor power levels by a factor with normalization
    public multiplyPower(factor: number): void {
        this.FL = this.normalizePower(this.FL * factor);
        this.FR = this.normalizePower(this.FR * factor);
        this.BL = this.normalizePower(this.BL * factor);
        this.BR = this.normalizePower(this.BR * factor);
    }
}
/**
 * The MotorPower_Stop class represents the power levels for a stop move.
 */
export const MotorPower_Stop = new MotorPower({ FL: 0, FR: 0, BL: 0, BR: 0 });



abstract class MotorSet {
    connectionPins: number[] = [];
 
    /**
     * Constructor to initialize motor power levels with normalization
     * @param connectionPins 
     */
    constructor(connectionPins: number[]) {
        if (connectionPins.length != 2 && connectionPins.length != 4) {
            console.error("MotorSet should define 2 or 4 motors connections.");
            return
        } 
        else this.connectionPins = connectionPins;
    }
    public static getMoveAsPower(move: CommonMove): MotorPower|undefined {
        console.error("getMoveAsPower should be implemented in the derived class.");
        return undefined;
    }
}




/**
 * The TwoFrontMotorPower class represents the power levels for a  left + right system (in front).
* 
 * */
export class TwoMotorSet extends MotorSet {
    constructor(connectionPins: number[]) {
        if (connectionPins.length != 2) {
            console.error("TwoMotorSet should define exactly 2 motors connections.");
            return
        } 
        else super(connectionPins);
    }
    public static MotorPower_North =
        new MotorPower({ FL: 1, FR: 1, BL: 0, BR: 0 });
    public static MotorPower_South =
        new MotorPower({ FL: -1, FR: -1, BL: 0, BR: 0 });
    public static MotorPower_CounterClockWise =
        new MotorPower({ FL: 1, FR: -1, BL: 0, BR: 0 });
    public static MotorPower_ClockWise =
        new MotorPower({ FL: -1, FR: 1, BL: 0, BR: 0 });

    public static  getMoveAsPower(move: CommonMove): MotorPower|undefined {
        switch (move) {
            case CommonMove.Stop:
                return MotorPower_Stop;
            case CommonMove.North:
                return TwoMotorSet.MotorPower_North
            case CommonMove.South:
                return TwoMotorSet.MotorPower_South
            case CommonMove.ClockWise:
                return TwoMotorSet.MotorPower_ClockWise
            case CommonMove.CounterClockWise:
                return TwoMotorSet.MotorPower_CounterClockWise
            default:
                console.debug(`getMove called with unknown move ${move}.`);
                return undefined
        }
    }
}



// The MecanumWheels class provides predefined motor power configurations for different moves
export class MecanumWheelsMotorPower extends MotorSet {
    
    constructor(connectionPins: number[]) {
        if (connectionPins.length != 4) {
            console.error("TwoMotorSet should define exactly 4 motors connections.");
            return
        } 
        else super(connectionPins);
    }

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
    public static getMoveAsPower(move: CommonMove):  MotorPower|undefined {
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
                console.debug(`getMove called with unknown move ${move} `);
                return undefined;
        }
    }
    
    /**
     * Very suspicious and experimental method to get the motor power configuration for a given move
     * @param lateral speed in the front-back (-1 to 1)
     * @param longitudinal speed  in the left-right (-1 to 1)
     * @param rotational  speed (-1 to 1) 
     * @returns 
     */
    public static getMecanumPower(lateral: number, longitudinal: number, rotational: number): MotorPower {
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