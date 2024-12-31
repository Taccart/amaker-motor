import { MotorPower, MotorPower_Stop } from './motorPower'
import { TwoWheelsMotorPower } from './twoWheelsMotorPower'
import { MecanumWheelsMotorPower } from './fourMecanumMotorPower'
import { CommonMove } from './commonMoves'
import { Servo,Angular180Servo,Angular270Servo,ContinuousRotationServo } from './servo_motor';
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
        pin_FL:number, // Front Left motor power
        pin_FR:number, // Front Right motor power
        pin_BL:number,// Back Left motor power
        pin_BR:number // Back Right motor power
    }
    // Define the servo map
    let motorMap: FourMotors;

    
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
    export function attachMotors(FL: number, FR: number, BL: number, BR: number): void {
        motorMap = {
            pin_FL: FL,
            pin_FR: FR,
            pin_BL: BL,
            pin_BR: BR
        };
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
    //% color=#C8FFC0 group="Servo" block="set angle %angle| for servo at pin %pin"
    export function setServoAngle(servoPin: number, angle: number) {
        let servo = getServo(servoPin);
        if (!servo) {
            console.error("No Servo attached to pin " + servoPin);
            return null;
        } else
            if (!(servo instanceof Angular180Servo || servo instanceof Angular270Servo)) {
                
                console.error("Not an agular Servo attached to pin " + servoPin + "");
                return null;

            }
            controller.setServoValue(servoPin,servo.getPulse(angle))
    }

    
    //% color=#C8FFC0 group="Servo" block="set speed %speed|for servo at pin %servoPin"
    //% speed.min=-1 speed.max=1
    export function setServoSpeed(servoPin: number, speed: number) {
        let servo = getServo(servoPin);

        if (!servo) {
            console.error("No Servo attached to pin " + servoPin);
            return null;
        } else
            if (!(servo instanceof ContinuousRotationServo)) {
                
                console.error("Not a continuous rotation Servo attached to pin " + servoPin + "");
                return null;

            }
        controller.setServoValue(servoPin,servo.getPulse(speed))

    }

    //% color=#C8FFC0 group="Motor" block="run motor at pin %servoPin"
    //% speed.min=-1 speed.max=1
    export function setMotorSpeed(motor_pin: number, speed: number): void {
        controller.motorRun(motor_pin, speed);
    }

    //% color=#C8FFC0 group="Motor" block="stop motor %motor"
    export function stopMotor(motor_pin: number): void {
        controller.motorStop(motor_pin);
    }

    //% color=#C8FFC0 group="Motor" block="stop all motors"
    export function stopAllMotors(): void {
        controller.motorStopAll();
    }


    //% color=#C8FFC0 group="Motor" block="run motors with movement power %power"
    export function setMotorsPower(power: MotorPower):void {
        controller.motorRun(motorMap.pin_FL, power.FL);
        controller.motorRun(motorMap.pin_FR, power.FR);
        controller.motorRun(motorMap.pin_BL, power.BL);
        controller.motorRun(motorMap.pin_BR, power.BR);
    }
}
