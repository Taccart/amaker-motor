// The MotorPower class represents the power levels for a four-motor system.
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

    // Private method to normalize power levels to be within the range [0, 1]
    private normalizePower(power: number): number {
        if (power < 0) return 0;
        if (power > 1) return 1;
        return power;
    }

    // Public method to set motor power levels with normalization
    public setPower(FL: number, FR: number, BL: number, BR: number): void {
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

export const MotorPower_Stop = new MotorPower({ FL: 0, FR: 0, BL: 0, BR: 0 });