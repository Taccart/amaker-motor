/**
 * This is the aMaker club class used to control the DFRobot board with PCA9685 controller
* DFRobot board reference: https://www.dfrobot.com/product-1738.html
*/
export class DFRobotBoardController {
    private static instance: DFRobotBoardController;

    private PCA9685_ADDRESS: number = 0x40
    private MODE1: number = 0x00
    private PRESCALE: number = 0xFE
    private LED0_ON_L: number = 0x06

    public static ServoPins: number[] = [0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01];
    public static MotorPins: number[] = [0x1, 0x2, 0x3, 0x4];

    private initialized = false
    private constructor() {
        // Private constructor to prevent direct instantiation
    }

    public static getInstance(): DFRobotBoardController {
        if (!DFRobotBoardController.instance) {
            DFRobotBoardController.instance = new DFRobotBoardController();
        }
        return DFRobotBoardController.instance;
    }


    private i2cWrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    private i2cCmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    private i2cRead(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    public initPCA9685(address: number = this.PCA9685_ADDRESS, mode: number = this.MODE1): void {
        this.i2cWrite(address, mode, 0x00)
        this.setFreq(50);
        this.initialized = true
    }

    private setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.floor(prescaleval + 0.5);
        let oldmode = this.i2cRead(this.PCA9685_ADDRESS, this.MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        this.i2cWrite(this.PCA9685_ADDRESS, this.MODE1, newmode); // go to sleep
        this.i2cWrite(this.PCA9685_ADDRESS, this.PRESCALE, prescale); // set the prescaler
        this.i2cWrite(this.PCA9685_ADDRESS, this.MODE1, oldmode);
        control.waitMicros(5000);
        this.i2cWrite(this.PCA9685_ADDRESS, this.MODE1, oldmode | 0xa1);
    }

    public setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15)
            return;
        let buf = pins.createBuffer(5);
        buf[0] = this.LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(this.PCA9685_ADDRESS, buf);
    }
    /**
     * 
     * @param index motor number is  1, 2, 3 or 4
     * @param speed from +1 to 1 
     * @returns 
     */
    public motorRun(motor_number: number, speed: number): void {
        if (motor_number > 4 || motor_number <= 0)
            return
        if (!this.initialized) {
            this.initPCA9685()
        }
        // map speen from -1 to 1  into a value from  -4095 to 4095
        if (speed > 1) {
            speed = 4095
        } else
            if (speed < -1) {
                speed = -4095
            } else
                speed = speed * 4095;


        let pn = (4 - motor_number) * 2
        let pp = (4 - motor_number) * 2 + 1
        if (speed >= 0) {
            this.setPwm(pp, 0, speed)
            this.setPwm(pn, 0, 0)
        } else {
            this.setPwm(pp, 0, 0)
            this.setPwm(pn, 0, -speed)
        }
    }
    public motorStop(index: number) {
        this.motorRun(index, 0);
    }

    public motorStopAll() {
        for (let m in DFRobotBoardController.MotorPins) this.motorRun(parseInt(m), 0)
    }

    public setServoValue(index: number, val: number): void {
        if (!this.initialized) {
            this.initPCA9685()
        }
        this.setPwm(index + 7, 0, val)
    }

}
