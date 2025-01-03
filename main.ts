/*！
 * @file amaker-motor/main.ts
 * @brief aMaker fork of DFRobot's microbit motor drive makecode library.
 * @n [Get the original module here](http://www.dfrobot.com.cn/goods-1577.html)
 * @n This is the microbit special motor drive library, which realizes control 
 *    of the eight-channel steering gear, two-step motor .
 *
 * @copyright	[DFRobot](http://www.dfrobot.com), 2016
 * @copyright	GNU Lesser General Public License
 *
 * @author [email](1035868977@qq.com)
 * @version  V1.0.1
 * @date  2018-03-20
 */
/**
 *This is aMaker:motor to control motor, servos, continuous rotatio servos and movements control for mecanum wheels.
 It's tested with dfrobo  motor shield for micro:bit 
 */
import { MecanumWheelsMotorPower, MotorPower, MotorPower_Stop, TwoMotorSet } from './motorPower'
import { CommonMove } from './commonEnums'
import { Servo } from './servo_motor';
import { DFRobotBoardController } from './dfrobotBoardController';

/**
 * This is the main namespace for the aMaker Motor packages, that makes the link between pxt GUI and aMaker code.
 */
//% color=#F10A0A icon="\u26DA" block="aMaker Motor"
namespace amaker_motor {

    // Get the instance of the DFRobotBoardController
    let controller = DFRobotBoardController.getInstance();

    // Define the dictionary type
    interface FourMotors {
        pin_FL: number, // Front Left motor power
        pin_FR: number, // Front Right motor power
        pin_BL?: number, // Back Left motor power
        pin_BR?: number // Back Right motor power
    }

    // Enum representing possible moves for a two-wheeled system
    //% color=#5b5b5b group="Move" icon="\u2699" block="Typical move directions"
    export enum Move {
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
    //% color=#5b5b5b group="Move" icon="\u26ee" block="Model of wheels" advanced=true
    export enum WheelModel {
        //% icon="\u1011A" block="two wheels (left and right sides)"
        TWO_WHEELS,
        //% icon="\u1011C" block="four DC wheels (2 left and 2 right sides)"
        FOUR_WHEELS,
        //% icon="\u1011C" block="four mecanum wheels"
        FOUR_MECANUM_WHEELS,
        
    }
    /**
     * 
     * @param move 
     * @param model two or four wheels. Default is two wheels.
     * @returns 
     */
    //% color=#5b5b5b group="Servo" block="get power for move %move|on wheels model %model"
    export function getPower(move: Move, model: WheelModel = WheelModel.TWO_WHEELS): MotorPower|undefined {
        if (move == Move.Stop) {
            return MotorPower_Stop;
        }
        switch (model) {
            case WheelModel.TWO_WHEELS:
                return TwoMotorSet.getMoveAsPower(move as unknown as CommonMove)
            case WheelModel.FOUR_MECANUM_WHEELS:
                return MecanumWheelsMotorPower.getMoveAsPower(move as unknown as CommonMove)
            default:
                console.debug(`getMove called with unknown move ${move} for ${model}: returning a STOP`);
                return undefined
        }
    }

    /**
     * Attaches a servo to a specified pin.
     * @param pin The pin number (0 to 8) to which the servo is attached.
     * @param servo The servo object to attach.
     */
    //% color=##999999 group="Servo" block="attach servo at pin %pin"
    export function attachServoMotor(pin: number, servo: Servo): void {
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
    //% color=##999999 group="Servo" block="get servo at pin %pin"
    export function getServo(pin: number): Servo {
        return servoMap[pin];
    }

    
    /**
     * The motor map that contains the pins for the _by default_ four motors.
     */
    let motorMap: FourMotors;
    /**
     *  Attaches the motors to the specified pins.
     * @param FL front left motor pin
     * @param FR front right motor pin
    * @param BL back left motor pin
    * @param BR back right motor pin
     */
    //% color=#F10A0A group="DC Motor" block="attach motors at pins FL %FL|FR %FR|BL %BL|BR %BR"
    //% FL.min=0 FL.max=8 FR.min=0 FR.max=8 BL.min=0 BL.max=8 BR.min=0 BR.max=8
    export function attachDCMotors(FL: number, FR: number, BL?: number, BR?: number): void {
        if (BL != undefined && BR != undefined)
            motorMap = { pin_FL: FL, pin_FR: FR, pin_BL: BL, pin_BR: BR }
        else
            motorMap = { pin_FL: FL, pin_FR: FR }
    }
    
     //% color=#F10A0A group="DC Motor" block="run motors with given power %power"
    export function setDCMotorsPower(power: MotorPower): void {
        if (!motorMap) {
            console.error("Motors not attached. Please attach motors first using attachDCMotors(...).");
            return;
        }
        controller.motorRun(motorMap.pin_FL, power.FL);
        controller.motorRun(motorMap.pin_FR, power.FR);
        if (motorMap.pin_BL != undefined        )
            controller.motorRun(motorMap.pin_BL, power.BL);
        if (motorMap.pin_BR!=undefined)
        controller.motorRun(motorMap.pin_BR, power.BR);
    }



    /**
     * Runs the motor at the specified speed.
     * @param motor_pin The motor pin number.
     * @param speed The speed from -1 to 1.
     */
    //% color=#F10A0A advanced=true group="DC Motor" block="set DC motor at pin %motor_pin|speed %speed"
    //% speed.min=-1 speed.max=1  expert=true
    export function setMotorSpeed(motor_pin: number, speed: number): void {
        controller.motorRun(motor_pin, speed);
    }

    /**
     * Stops the motor at the specified pin.
     * @param motor_pin The motor pin number.
     */
    //% color=#F10A0A group="DC Motor" block="stop DC motor %motor_pin" expert=true
    export function stopDCMotor(motor_pin: number): void {
        controller.motorStop(motor_pin);
    }

    /**
     * Stops all motors.
     */
    //% color=#F10A0A group="DC Motor" block="stop all DC motors" expert=true
    export function stopAllDCMotors(): void {
        controller.motorStopAll();
    }
    
}
