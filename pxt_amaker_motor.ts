import { MotorPower, MotorPower_Stop } from './motorPower'
import { TwoWheelsMotorPower  } from './twoWheelsMotorPower'
import { MecanumWheelsMotorPower } from './fourMecanumMotorPower'
import { CommonMove } from './commonMoves'
import {  Servo } from './servo_motor';
/**
 * This is the main namespace for the aMaker Motor packages, that makes the link between pxt GUI and aMaker code.
 *  
 */
//% color=#023A00 icon="\uf1b9" block="aMaker Motor"
namespace pxt_amaker_motor {

    // Define the dictionary type
    interface ServoMap {
        [name: string]: Servo;
    }
    
    
    // Enum representing possible moves for a two-wheeled system
    //% color=#92FF73 group="Move"  icon="\u2699" block="Typical move directions "
    export enum pxtMoves{
        //% block="stop"
        Stop= CommonMove.Stop,
        //% icon="\u2191" block="north"
        North= CommonMove.North,
        //% icon="\u2197" block="north-east"
        NorthEast=CommonMove.NorthEast,
        //% icon="2192" block="east"
        East=CommonMove.East,
        //% icon="\u2198" block="south-east"
        SouthEast=  CommonMove.SouthEast,
        //% icon="\u2193" block="south"
        South= CommonMove.South,
        //% icon="\u2199"  block="south-west"
        SouthWest= CommonMove.SouthWest,
        //% icon="\u2190" block="west"
        West= CommonMove.West,
        //% icon="\u2196" block="north-west"
        NorthWest= CommonMove.NorthWest,
        //% icon="\u21BB" block="rotate clockwise"
        ClockWise=  CommonMove.ClockWise,  
        //% icon="\u21BA" block="rotate counter-clockwise"
        CounterClockWise= CommonMove.CounterClockWise
    }


    // Enum representing possible types of motors and wheels
    //% color=#92FF73 group="Move" icon="\u26ee" block="Model of wheels "
    export enum WheelModel {
        //% icon="\u1011A" block="two wheels (left and right sides)"
        TWO_WHEELS,
        //% icon="\u1011C" block="four mecanum wheels"
        FOUR_MECANUM_WHEELS
    }


    //% color=#C8FFC0 group="Servo"  block="get power for move %move|on wheels model %model"
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
        };
    }
    //% color=#C8FFC0 group="Servo" block="get power for move %move|on wheels model %model"
    export function attachServo(pin: number, servo: Servo) {
        if (pin < 0 || pin > 8) {
            console.error("Pin number must be between 0 and 8");
            return;
        }
        servoMap[pin] = servo;
        console.log(`Servo ${typeof(servo)} attached at pin ${pin}`);
    }

    //% color=#C8FFC0 group="Servo" block="get servo at pin %pin"
    export function getServo(pin: number): Servo {
        return servoMap[pin];
    }
}