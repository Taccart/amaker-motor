/**
 * Servo motor class
 * @param pin the pin to which the servo is connected
 */
export abstract class Servo {
    private pin: number;

    constructor(pin:number) {
        this.pin = pin;
    }
    /**
     * 
     * @param number the number to convert into a pulse. This number could be an angle or a speed depending on servo type
     */
    abstract getPulse(number: number): number;
}
abstract class AngularServo extends Servo {

    private minPulse: number;
    private maxPulse: number;

    constructor(pin: number, minPulse: number = 500, maxPulse: number = 2500) {
        super(pin);
        this.minPulse = minPulse;
        this.maxPulse = maxPulse;
    }

    public getPulse(degree: number): number {
        let v_us = (degree * 1800 / 180 + 600) // 0.6ms ~ 2.4ms
        return (v_us * 4096 / 20000)
    }
}
/**
 * Servo motor class for 270 degree rotation servos (sometimes gray ones)
 */
export class Angular270Servo extends AngularServo {
    constructor(pin: number, minPulse: number = 500, maxPulse: number = 2500) {
        super(pin, minPulse,maxPulse);
    }
    public getPulse(degree: number): number {
        if (degree > 135) degree = 135;
        else if (degree < -135) degree = -135;
        return super.getPulse(degree);
    }
}
/**
 * Servo motor class for 180 degree rotation servos (sometimes orange ones)
  
 */
export class Angular180Servo extends AngularServo {
    constructor(pin: number, minPulse: number = 500, maxPulse: number = 2500) {
        super(pin, minPulse, maxPulse);
    }
    public getPulse(degree: number): number {     
        if (degree > 90) degree = 90;
        else if (degree < -90) degree = -90;
        return super.getPulse(degree);
    }
}
/**
 * Servo motor class for continuous rotation servos (sometimes green ones)
 * @param pin the pin to which the servo is connected
 * @param pulse_max_ACW the pulse value for the maximum speed anti-clockwise
* @param pulse_min_ACW the pulse value for the minimum speed anti-clockwise
* @param pulse_stopped the pulse value for the stopped state
* @param pulse_min_CW the pulse value for the minimum speed clockwise
* @param pulse_max_CW the pulse value for the maximum speed clockwise
    * 
 */
export class ContinuousRotationServo extends Servo{

    private pulse_max_ACW: number;
    private pulse_min_ACW: number;
    private pulse_stopped: number;
    private pulse_min_CW: number;
    private pulse_max_CW: number;

    constructor(
        pin: number,
        pulse_max_ACW: number = 85,
        pulse_min_ACW: number = 285,
        pulse_stopped: number = 310,
        pulse_min_CW: number = 335,
        pulse_max_CW: number = 535
    ) {
        super(pin);
        this.pulse_max_ACW = pulse_max_ACW;
        this.pulse_min_ACW = pulse_min_ACW;
        this.pulse_stopped = pulse_stopped;
        this.pulse_min_CW = pulse_min_CW;
        this.pulse_max_CW = pulse_max_CW;
    }
    /**
     * convert a speed into a pulse value.
     * @param speed as a ratio, from -1 to 1
     * @returns pulse value for the servo
     */
    public getPulse(speed: number): number {

        if (speed < -1) speed = -1;
        else if (speed > 1) speed = 1;

        if (speed > 0) {
            return this.pulse_min_CW + speed  * (this.pulse_max_CW - this.pulse_min_CW);
        }
        else if (speed < 0) {
            return this.pulse_min_ACW + speed  * (this.pulse_max_ACW - this.pulse_min_ACW);
        }
        else {
            return this.pulse_stopped;
        }

    }

}