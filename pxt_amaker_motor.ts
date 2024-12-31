import { MotorPower, MotorPower_Stop } from './dc_motors'
import { TwoWheelsMotorPower } from './twoWheelsMotorPower'
import { MecanumWheelsMotorPower } from './fourMecanumMotorPower'
import { CommonMove } from './commonMoves'
import { Servo } from './servo_motor';
import { DFRobotBoardController } from './dfrobotBoardController';

/**
 * This is the main namespace for the aMaker Motor packages, that makes the link between pxt GUI and aMaker code.
 */
//% color=#023A00 icon="\uf1b9" block="aMaker Motor"
namespace pxt_amaker_motor {

    // Define the dictionary type
    interface ServoMap {
        [pin: number]: Servo;
    }

    // Define the servo map
    let servoMap: ServoMap = {};

    // Define the dictionary type
    interface FourMotors {
        pin_FL: number, // Front Left motor power
        pin_FR: number, // Front Right motor power
        pin_BL: number, // Back Left motor power
        pin_BR: number // Back Right motor power
    }

    // Define the motor map
    let motorMap: FourMotors;

    // Get the instance of the DFRobotBoardController
    let controller = DFRobotBoardController.getInstance();

    // Enum representing possible moves for a two-wheeled system
    //% color=#92FF73 group="Move" icon="\u2699" block="Typical move directions"
    export enum pxtMoves {
        //% block="stop"
        Stop = CommonMove.Stop,
        //% icon="\u2191" block="north"
        North = CommonMove.North,
        //% icon="\u2197" block="north-east"
        NorthEast = CommonMove.NorthEast,
        //% icon="\u2192" block="east"
        East = CommonMove.East,
        //% icon="\u2198" block="south-east"
        SouthEast = CommonMove.SouthEast,
        //% icon="\u2193" block="south"
        South = CommonMove.South,
        //% icon="\u2199" block="south-west"
        SouthWest = CommonMove.SouthWest,
        //% icon="\u2190" block="west"
        West = CommonMove.West,
        //% icon="\u2196" block="north-west"
        NorthWest = CommonMove.NorthWest,
        //% icon="\u21BB" block="rotate clockwise"
        ClockWise = CommonMove.ClockWise,
        //% icon="\u21BA" block="rotate counter-clockwise"
        CounterClockWise = CommonMove.CounterClockWise
    }

    // Enum representing possible types of motors and wheels
    //% color=#92FF73 group="Move" icon="\u26ee" block="Model of wheels"
    export enum WheelModel {
        //% icon="\u1011A" block="two wheels (left and right sides)"
        TWO_WHEELS,
        //% icon="\u1011C" block="four mecanum wheels"
        FOUR_MECANUM_WHEELS
    }

    //% color=#C8FFC0 group="Servo" block="get power for move %move|on wheels model %model"
    export function getPower(move: pxtMoves, model: WheelModel): MotorPower {
        if (move == pxtMoves.Stop) {
            return MotorPower_Stop;
        }
        switch (model) {
            case WheelModel.TWO_WHEELS:
                return TwoWheelsMotorPower.getMove(move as unknown as CommonMove)
            case WheelModel.FOUR_MECANUM_WHEELS:
                return MecanumWheelsMotorPower.getMove(move as unknown as CommonMove)
            default:
                console.debug(`getMove called with unknown move ${move} for ${model}: returning a STOP`);
                return new MotorPower({ FL: 0, FR: 0, BL: 0, BR: 0 })
        }
    }

    /**
     * Attaches a servo to a specified pin.
     * @param pin The pin number (0 to 8) to which the servo is attached.
     * @param servo The servo object to attach.
     */
    //% color=#C8FFC0 group="Servo" block="attach servo at pin %pin"
    export function attachServo(pin: number, servo: Servo): void {
        if (pin < 0 || pin > 8) {
            console.error("Pin number must be between 0 and 8");
            return;
        }
        servoMap[pin] = servo;
        console.log(`Servo attached at pin ${pin}`);
    }

    /**
     * Gets the servo attached to a specified pin.
     * @param pin The pin number (0 to 8) from which to get the servo.
     * @returns The servo object attached to the specified pin.
     */
    //% color=#C8FFC0 group="Servo" block="get servo at pin %pin"
    export function getServo(pin: number): Servo {
        return servoMap[pin];
    }

    /**
     * Runs the motor at the specified speed.
     * @param motor_pin The motor pin number.
     * @param speed The speed from -1 to 1.
     */
    //% color=#C8FFC0 group="Motor" block="run motor at pin %motor_pin"
    //% speed.min=-1 speed.max=1
    export function setMotorSpeed(motor_pin: number, speed: number): void {
        controller.motorRun(motor_pin, speed);
    }

    /**
     * Stops the motor at the specified pin.
     * @param motor_pin The motor pin number.
     */
    //% color=#C8FFC0 group="Motor" block="stop motor %motor_pin"
    export function stopMotor(motor_pin: number): void {
        controller.motorStop(motor_pin);
    }

    /**
     * Stops all motors.
     */
    //% color=#C8FFC0 group="Motor" block="stop all motors"
    export function stopAllMotors(): void {
        controller.motorStopAll();
    }

    /**
     * Runs the motors with the specified power.
     * @param power The power object containing the power values for each motor.
     */
    //% color=#C8FFC0 group="Motor" block="run motors with movement power %power"
    export function setMotorsPower(power: MotorPower): void {
        controller.motorRun(motorMap.pin_FL, power.FL);
        controller.motorRun(motorMap.pin_FR, power.FR);
        controller.motorRun(motorMap.pin_BL, power.BL);
        controller.motorRun(motorMap.pin_BR, power.BR);
    }
}
