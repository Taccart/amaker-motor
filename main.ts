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
//% weight=10 color=#1a61a9 icon="\u26DA" block="aMaker-motor"
//% groups=['aMaker', 'servo', 'motor', 'mecanum']
namespace amaker_motor {
    const PCA9685_ADDRESS = 0x40
    const MODE1 = 0x00
    const PRESCALE = 0xFE
    const LED0_ON_L = 0x06

    export let servo_value_max_backward = 85
    export let servo_value_min_backward = 285
    export let servo_value_stopped = 310
    export let servo_value_min_forward = 335
    export let servo_value_max_forward = 535




    /**
     * Mapping for servo numbers to connector on board
     */
    //% block  advanced=true
    export enum Servo {
        //% blockId="Servo_1" block="S1"
        S1 = 0x08,
        //% blockId="Servo_2" block="S2"
        S2 = 0x07,
        //% blockId="Servo_3" block="S3"
        S3 = 0x06,
        //% blockId="Servo_4" block="S4"
        S4 = 0x05,
        //% blockId="Servo_5" block="S5"
        S5 = 0x04,
        //% blockId="Servo_6" block="S6"
        S6 = 0x03,
        //% blockId="Servo_7" block="S7"
        S7 = 0x02,
        //% blockId="Servo_8" block="S8"
        S8 = 0x01
    }
/**
     * The user selects the 4-way dc motor.
     */
    //% block advanced=true
    export enum Motors {
        //% blockId="Motor_1" block="M1"
        M1 = 0x1,
        //% blockId="Motor_2" block="M2"
        M2 = 0x2,
        //% blockId="Motor_3" block="M3"
        M3 = 0x3,
        //% blockId="Motor_4" block="M4"
        M4 = 0x4
    }

    /**
     * The user defines the motor rotation direction.
     */
    //% block advanced=true
    export enum Dir {
        //% blockId="CW" block="CW"
        CW = 1,
        //% blockId="CCW" block="CCW"
        CCW = -1,
    }

    /**
     * Array of all servos
     */
    //% block advanced=true
    export const Servos: amaker_motor.Servo[] = [Servo.S1, Servo.S2, Servo.S3, Servo.S4, Servo.S5, Servo.S6, Servo.S7, Servo.S8]
    //% block  advanced=true
    /**
        * Normalize speed to a range between -100 and 100 and return the corresponding value for continuous rotation servo
        * @param {number} speed - number betwen -100 and 100. Negative = counter clockwise, positive = clockwise. 
        * @returns value for servo
        */
    //% block
    //% speed.min=-100 speed.max=100 speed.defl=10
    export  function toContinuousRotationValue(speed: number): number {

        if (speed < -100) speed = -100;
        else if (speed > 100) speed = 100;

        if (speed > 0) {
            return amaker_motor.servo_value_min_forward + speed / 100 * (amaker_motor.servo_value_max_forward - amaker_motor.servo_value_min_forward);
        }
        else if (speed < 0) {
            return amaker_motor.servo_value_min_backward + speed / 100 * (amaker_motor.servo_value_max_backward - amaker_motor.servo_value_min_backward);
        }
        else {
            return amaker_motor.servo_value_stopped;
        }

    }


    /**
     * MecanumWheelsValue  is a data structure for mecanum wheels , placed in Front left and right and back left and right.
     */
    //% block  advanced=true
    export class MecanumWheelsValue {
        // Those values are empiric. Maybe could we allow to change them.
        //                                     backward | stop | forward
        // we want to handle speeds as     -100 ...  -1 |    0 |   1 ... 100
        // and this is converted as servo    85 ... 285 |  310 | 335 ... 535

        private speeds: number[] // array of FL, FR, BR, BR
        private values : number[] // array of FL, FR, BR, BR
        

        public constructor(
            fields?: {
                FL?: number,
                FR?: number,
                BL?: number,
                BR?: number;
            }) {
            if (fields) {
                this.speeds = [ fields.FL, fields.FR, fields.BL, fields.BR];
                this.values=[
                    amaker_motor.toContinuousRotationValue(this.speeds[0]),
                    amaker_motor.toContinuousRotationValue(this.speeds[1]),
                    amaker_motor.toContinuousRotationValue(this.speeds[2]),
                    amaker_motor.toContinuousRotationValue(this.speeds[3])
               ]
            }
        }
        /**
         * 
         * @returns array of servo values for front left, right, back left, right servos
         */
        public getServoValues(): number[] { return  this.values  }
        /**
         * 
         * @returns array of speeds for front left, right, back left, right servos as given in constructor
         */
        public getSpeeds(): number[] { return this.speeds }

    };

    /** Common moves with mecanum wheels
     * 
     */
    //% blockId="Mecanum_NoMove" block="Mecanum Stop (no move)" advanced=true  
    export const Mecanum_NoMove    = new MecanumWheelsValue({ FL:  0, FR:  0, BL:  0, BR:  0 })
    //% blockId="Mecanum_RotateCW" block="Mecanum Rotate Clockwise" advanced=true  
    export const Mecanum_RotateCW  = new MecanumWheelsValue({ FL:  1, FR:  1, BL: -1, BR: -1 })
    //% blockId="Mecanum_RotateCCW" block="Mecanum Rotate Counter Clockwise" advanced=true  
    export const Mecanum_RotateCCW = new MecanumWheelsValue({ FL: -1, FR: -1, BL:  1, BR:  1 })
    //% blockId="Mecanum_North" block="Mecanum North" advanced=true  
    export const Mecanum_North     = new MecanumWheelsValue({ FL:  1, FR:  1, BL:  1, BR:  1 })
    //% blockId="Mecanum_NorthEast" block="Mecanum North-East" advanced=true  
    export const Mecanum_NorthEast = new MecanumWheelsValue({ FL:  0, FR:  1, BL:  0, BR:  1 })
    //% blockId="Mecanum_East" block="Mecanum East" advanced=true  
    export const Mecanum_East      = new MecanumWheelsValue({ FL: -1, FR:  1, BL: -1, BR:  1 })
    //% blockId="Mecanum_SouthEast" block="Mecanum South-East" advanced=true  
    export const Mecanum_SouthEast = new MecanumWheelsValue({ FL: -1, FR:  0, BL: -1, BR:  0 })
    //% blockId="Mecanum_South" block="Mecanum South" advanced=true  
    export const Mecanum_South     = new MecanumWheelsValue({ FL: -1, FR: -1, BL: -1, BR: -1 })
    //% blockId="Mecanum_SouthWest" block="Mecanum South-West" advanced=true  
    export const Mecanum_SouthWest = new MecanumWheelsValue({ FL:  0, FR: -1, BL: -1, BR:  0 })
    //% blockId="Mecanum_West" block="Mecanum West" advanced=true  
    export const Mecanum_West      = new MecanumWheelsValue({ FL:  1, FR: -1, BL:  1, BR: -1 })
    //% blockId="Mecanum_NorthWest" block="Mecanum North-West" advanced=true  
    export const Mecanum_NorthWest = new MecanumWheelsValue({ FL:  1, FR:  0, BL:  1, BR:  0 })
    


    /**
     * builds a MecanumMove using given lateral (left-right), longitudinal (forward-backward) and rotational  arguments
     * @param {number} lateral - lateral movement -100>100
     * @param {number} longitudinal - longitudinal movement -100>100
     * @param {number} rotational - rotational movement -100>100
     * @return {MecanumMove} The new MecanumMove
      */
    //% block
    //% weight=100
    //% lateral_speed.min=-100 lateral_speed.max=100 lateral_speed.defl=0
    //% logitudinal_speed.min=-100 logitudinal_speed.max=100
    //% rotation_speed.min=-100 rotation_speed.max=100 rotation_speed.defl=0
    export function getMecanumMove(lateral: number, longitudinal: number, rotational: number): MecanumWheelsValue {

        if (lateral < -100) lateral = -100; else if (lateral > 100) lateral = 100;
        if (longitudinal < -100) longitudinal = -100; else if (longitudinal > 100) longitudinal = 100;
        if (rotational < -100) rotational = -100; else if (rotational > 100) rotational = 100;
        let r = Math.abs(lateral) + Math.abs(longitudinal) + Math.abs(rotational)
        if (r == 0)
            return Mecanum_NoMove;
        return new MecanumWheelsValue({
            FL: (lateral + longitudinal + rotational) / r,
            FR: (lateral - longitudinal - rotational) / r,
            BL: (lateral - longitudinal + rotational) / r,
            BR: (lateral + longitudinal - rotational) / r
        })
    }

    /**
    * Send Mecanum wheel movement to continuous rotation servos
    * S1~S8.
    * 0°~180°.
    */
    //% block
    export function setMecanumServos( mecanumMove :MecanumWheelsValue, mecanumServos:Servo[]) {
        let s = mecanumMove.getServoValues()
        for (let i = 0; i < 4; i++) { servoSpeed(mecanumServos[i], s[i]) }
    }



    

    let initialized = false

    function i2cWrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cCmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cRead(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function initPCA9685(): void {
        i2cWrite(PCA9685_ADDRESS, MODE1, 0x00)
        setFreq(50);
        initialized = true
    }

    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval;//Math.floor(prescaleval + 0.5);
        let oldmode = i2cRead(PCA9685_ADDRESS, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cWrite(PCA9685_ADDRESS, MODE1, newmode); // go to sleep
        i2cWrite(PCA9685_ADDRESS, PRESCALE, prescale); // set the prescaler
        i2cWrite(PCA9685_ADDRESS, MODE1, oldmode);
        control.waitMicros(5000);
        i2cWrite(PCA9685_ADDRESS, MODE1, oldmode | 0xa1);
    }

    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15)
            return;

        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);
    }





    /**
    * Servo control function.
    * S1~S8.
    * 0°~180°.
    */
    //% blockId=motor_servo block="ServoPosition|%index|degree|%degree"
    //% weight=100
    //% degree.min=0 degree.max=180 degree.defl=90
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=4
    export function servoPosition(index: Servo, degree: number): void {
        if (!initialized) {
            initPCA9685()
        }
        // 50hz
        let v_us = (degree * 1800 / 180 + 600) // 0.6ms ~ 2.4ms
        let value = v_us * 4096 / 20000
        this.servoValue ( value)
    }

    /**
    * Continuous rotation servo control function.
    * S1~S8.
    * -100~100.
    */
    //% blockId=motor_ServoContinuousRotation block="ServoSpeed|%index|speed|%speed"
    //% weight=110
    //% speed.min=-100 speed.max=100 speed.defl=10
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=4
    export function servoSpeed(index: Servo, speed: number): void {
        this.servoValue(index,this.mecanumServos(speed))
       
    }

    /**
     * Steering gear control function.
     * S1~S8.
     * -100~100.
    */
    //% block
    //% val.min=0 val.max=4096
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=4
    export function servoValue(index: Servo, val: number): void {
        if (!initialized) {
            initPCA9685()
        }

        setPwm(index + 7, 0, val)
    }

    /**
     * Run motor
     * M1~M4.
     * speed(0~255).
    */
    //% weight=90
    //% block
    //% speed.min=0 speed.max=255
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function MotorRun(index: Motors, direction: Dir, speed: number): void {
        if (index > 4 || index <= 0)
            return
        if (!initialized) {
            initPCA9685()
        }
        speed = speed * 16 * direction; // map 255 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= -4096) {
            speed = -4095
        }

        let pn = (4 - index) * 2
        let pp = (4 - index) * 2 + 1
        if (speed >= 0) {
            setPwm(pp, 0, speed)
            setPwm(pn, 0, 0)
        } else {
            setPwm(pp, 0, 0)
            setPwm(pn, 0, -speed)
        }
    }



    /**
     * Stop the dc motor.
    */
    //% block
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2 
    export function motorStop(index: Motors) {
        setPwm((4 - index) * 2, 0, 0);
        setPwm((4 - index) * 2 + 1, 0, 0);
    }

    /**
     * Stop all motors
    */
    //% block
    export function motorStopAll(): void {
        for (let idx = 1; idx <= 4; idx++) {
            motorStop(idx);
        }
    }
}

