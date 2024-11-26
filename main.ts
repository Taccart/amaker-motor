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
 *This is aMaker:motor user motor and steering control function.
 */
//% weight=10 color=#1a61a9 icon="\uf013" block="aMaker-motor"
namespace amaker_motor {
    const PCA9685_ADDRESS = 0x40
    const MODE1 = 0x00
    const PRESCALE = 0xFE
    const LED0_ON_L = 0x06

    export const servo_value_max_backward = 85
    export const servo_value_min_backward =285
    export const servo_value_stopped = 310
    export const servo_value_min_forward = 335
    export const servo_value_max_forward = 535


    /**
     * The user can select ththise 8 steering gear controller.
     */
    export enum Servos {
        S1 = 0x08,
        S2 = 0x07,
        S3 = 0x06,
        S4 = 0x05,
        S5 = 0x04,
        S6 = 0x03,
        S7 = 0x02,
        S8 = 0x01
    }

    const  allServos  : amaker_motor.Servos[] = [Servos.S1,Servos.S2,Servos.S3,Servos.S4,Servos.S5,Servos.S6,Servos.S7,Servos.S8]
    
    /**
     * MecanumWheelsValue  is a placeholder for mecanum
     */
    export class MecanumWheelsValue   {
        // Those values are empiric. Maybe could we allow to change them.
        //                                     backward | stop | forward
        // we want to handle speeds as     -100 ...  -1 |    0 |   1 ... 100
        // and this is converted as servo    85 ... 285 |  310 | 335 ... 535
        
        public speeds:number[]
            
        public toServoValues () : MecanumWheelsValue {
            return new MecanumWheelsValue( {
                FL:this.toContinuousRotationValue(this.speeds[0]),
                FR:this.toContinuousRotationValue(this.speeds[1]),
                BL:this.toContinuousRotationValue(this.speeds[2]),
                BR:this.toContinuousRotationValue(this.speeds[3]) }
            )
        }
        /**
         * Normalize speed to a range between -100 and 100 and return the corresponding value for continuous rotation servo
         * @param {number} speed - number betwen -100 and 100. Negative = counter clockwise, positive = clockwise. 
         * @returns 
         */
        public toContinuousRotationValue(speed: number ) : number {
                        
            if (speed<-100)     speed=-100;
            else if (speed>100) speed=100;
            
            if (speed >0)        {
                return amaker_motor.servo_value_min_forward + speed/100*(amaker_motor.servo_value_max_forward-amaker_motor.servo_value_min_forward);
            }
            else if (speed <0)   {
                return amaker_motor.servo_value_min_backward + speed/100* (amaker_motor.servo_value_max_backward-amaker_motor.servo_value_min_backward);
            }
            else                 { 
                return amaker_motor.servo_value_stopped; }

        }
        public constructor (
            fields? :{
                FL?:number,
                FR?:number,
                BL?:number,
                BR?:number;
            }) { 
                if (fields) {
                    this.speeds=[fields.FL,fields.FR,fields.BL,fields.BR];
                }
            }
        
    };

	
/**
 * builds a MecanumMove using given lateral (left-right), longitudinal (forward-backward) and rotational  arguments
 * @param {number} lat - lateral movement -100>100
 * @param {number} lon - longitudinal movement -100>100
 * @param {number} rot - rotational movement -100>100
 * @return {MecanumMove} The new MecanumMove
  */
    export function getMecanumMove(lat:number, lon:number, rot:number): MecanumWheelsValue {
        
        if (lat<-100) lat=-100; else  if (lat>100) lat=100;
        if (lon<-100) lon=-100; else  if (lon>100) lon=100;
        if (rot<-100) rot=-100; else  if (rot>100) rot=100;
        let r =Math.abs(lat)+Math.abs(lon)+Math.abs(rot)
        if (r==0) 
            return CommonMecanumMoves.NoMove;
        return new MecanumWheelsValue ({
            FL:(lat+lon+rot)/r, 
            FR:(lat-lon-rot)/r,
            BL:(lat-lon+rot)/r,
            BR:(lat+lon-rot)/r})
    }
    /**
     * Common Mecanum moves. Cosider cartinal points as direction on a map where North means forward.
     */
    const  CommonMecanumMoves = {
        NoMove     :new MecanumWheelsValue ({FL:0, FR:0, BL:0, BR:0}),
        //rotation :: same value for front wheels and same value for rear wheels
        RotateCW   : new MecanumWheelsValue ({FL:  1,FR:  1, BL: -1,BR:-1}),
        RotateCCW  : new MecanumWheelsValue ({FL: -1,FR: -1, BL:  1,BR: 1}),
        //move : same value left wheels and same value for right wheels
        North      : new MecanumWheelsValue ({FL:  1,FR:  1, BL:  1,BR: 1}),
        NorthEast  : new MecanumWheelsValue ({FL:  0,FR:  1, BL:  0,BR: 1}),
        East       : new MecanumWheelsValue ({FL: -1,FR:  1, BL: -1,BR: 1}),
        SouthEast  : new MecanumWheelsValue ({FL: -1,FR:  0, BL: -1,BR: 0}),
        South      : new MecanumWheelsValue ({FL: -1,FR: -1, BL: -1,BR:-1}),
        SouthWest  : new MecanumWheelsValue ({FL:  0,FR: -1, BL: -1,BR: 0}),
        West       : new MecanumWheelsValue ({FL:  1,FR: -1, BL:  1,BR:-1}),
        NorthWest  : new MecanumWheelsValue ({FL:  1,FR:  0, BL:  1,BR: 0}),
        
    }
    
    
    /**
     * The user selects the 4-way dc motor.
     */
    export enum Motors {
        M1 = 0x1,
        M2 = 0x2,
        M3 = 0x3,
        M4 = 0x4
    }

    /**
     * The user defines the motor rotation direction.
     */
    export enum Dir {
        //% blockId="CW" block="CW"
        CW = 1,
        //% blockId="CCW" block="CCW"
        CCW = -1,
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
    * Steering gear control function.
    * S1~S8.
    * 0°~180°.
    */
    //% blockId=motor_servo block="ServoPosition|%index|degree|%degree"
    //% weight=100
    //% degree.min=0 degree.max=180
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=4
    export function servoPosition(index: Servos, degree: number): void {
        if (!initialized) {
            initPCA9685()
        }
        // 50hz
        let v_us = (degree * 1800 / 180 + 600) // 0.6ms ~ 2.4ms
        let value = v_us * 4096 / 20000
        setPwm(index + 7, 0, value)
    }

    /**
    * Steering gear control function.
    * S1~S8.
    * -100~100.
    */
    //% blockId=motor_ServoContinuousRotation block="ServoSpeed|%index|speed|%speed"
    //% weight=110
    //% speed.min=-100 speed.max=100
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=4
    export function servoSpeed(index: Servos, speed: number): void {
        if (!initialized) {
            initPCA9685()
        }
	
	if (speed<0) {setPwm(index + 7, 0, speed*2+289)}
	else if (speed>0) {setPwm(index + 7, 0, speed*2+319)}
	else {setPwm(index + 7, 0, speed)}
    }

    /**
	 * Steering gear control function.
     * S1~S8.
     * -100~100.
	*/
    //% blockId=motor_ServoContinuousRotation block="ServoValue|%index|val|%val"
    //% weight=120
    //% val.min=0 val.max=4096
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=4
    export function servoValue(index: Servos, val: number): void {
        if (!initialized) {
            initPCA9685()
        }

        setPwm(index + 7, 0, val)
    }
	
    /**
	 * Execute a motor
     * M1~M4.
     * speed(0~255).
    */
    //% weight=90
    //% blockId=motor_MotorRun block="Motor|%index|dir|%Dir|speed|%speed"
    //% speed.min=0 speed.max=255
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function MotorRun(index: Motors, direction: Dir, speed: number): void {
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
        if (index > 4 || index <= 0)
            return
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
    //% weight=20
    //% blockId=motor_motorStop block="Motor stop|%index"
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2 
    export function motorStop(index: Motors) {
        setPwm((4 - index) * 2, 0, 0);
        setPwm((4 - index) * 2 + 1, 0, 0);
    }

    /**
	 * Stop all motors
    */
    //% weight=10
    //% blockId=motor_motorStopAll block="Motor Stop All"
    export function motorStopAll(): void {
        for (let idx = 1; idx <= 4; idx++) {
            motorStop(idx);
        }
    }
}

