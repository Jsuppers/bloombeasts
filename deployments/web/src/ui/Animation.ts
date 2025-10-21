/**
 * Animation System (Placeholder)
 * Mimics Horizon's Animation API - full implementation to be added later
 */

/**
 * Easing functions for animations
 */
export class Easing {
    static get linear(): Easing { return new Easing('linear'); }
    static get ease(): Easing { return new Easing('ease'); }
    static get easeIn(): Easing { return new Easing('ease-in'); }
    static get easeOut(): Easing { return new Easing('ease-out'); }
    static get easeInOut(): Easing { return new Easing('ease-in-out'); }
    static get quad(): Easing { return new Easing('quad'); }
    static get cubic(): Easing { return new Easing('cubic'); }
    static get sin(): Easing { return new Easing('sin'); }
    static get circle(): Easing { return new Easing('circle'); }
    static get exp(): Easing { return new Easing('exp'); }
    static get bounce(): Easing { return new Easing('bounce'); }
    static get back(): Easing { return new Easing('back'); }

    static bezier(x1: number, y1: number, x2: number, y2: number): Easing {
        return new Easing(`bezier(${x1},${y1},${x2},${y2})`);
    }

    static elastic(bounciness: number): Easing {
        return new Easing(`elastic(${bounciness})`);
    }

    static poly(n: number): Easing {
        return new Easing(`poly(${n})`);
    }

    static in(easing: Easing): Easing {
        return new Easing(`in(${easing._type})`);
    }

    static out(easing: Easing): Easing {
        return new Easing(`out(${easing._type})`);
    }

    static inOut(easing: Easing): Easing {
        return new Easing(`inOut(${easing._type})`);
    }

    private _type: string;

    private constructor(type: string) {
        this._type = type;
    }

    get type(): string {
        return this._type;
    }
}

/**
 * Configuration for timing animations
 */
export type TimingAnimationConfig = {
    duration?: number;
    easing?: Easing;
};

/**
 * Animation class for defining animations
 * Placeholder - to be fully implemented later
 */
export abstract class Animation {
    /**
     * Create a timing animation
     */
    static timing(
        value: number | ((prev: number) => number),
        config?: TimingAnimationConfig
    ): Animation {
        return new TimingAnimation(value, config);
    }

    /**
     * Run animations in sequence
     */
    static sequence(...animations: Animation[]): Animation {
        return new SequenceAnimation(animations);
    }

    /**
     * Repeat an animation
     */
    static repeat(animation: Animation, iterations?: number): Animation {
        return new RepeatAnimation(animation, iterations);
    }

    /**
     * Delay before starting an animation
     */
    static delay(time: number, animation: Animation): Animation {
        return new DelayAnimation(time, animation);
    }

    /**
     * Get the final value of this animation
     * Placeholder implementation
     */
    abstract getFinalValue(startValue: number): number;
}

class TimingAnimation extends Animation {
    constructor(
        private value: number | ((prev: number) => number),
        private config?: TimingAnimationConfig
    ) {
        super();
    }

    getFinalValue(startValue: number): number {
        return typeof this.value === 'function'
            ? this.value(startValue)
            : this.value;
    }
}

class SequenceAnimation extends Animation {
    constructor(private animations: Animation[]) {
        super();
    }

    getFinalValue(startValue: number): number {
        return this.animations.reduce(
            (value, anim) => anim.getFinalValue(value),
            startValue
        );
    }
}

class RepeatAnimation extends Animation {
    constructor(
        private animation: Animation,
        private iterations?: number
    ) {
        super();
    }

    getFinalValue(startValue: number): number {
        // For repeat, just return the animation's final value
        return this.animation.getFinalValue(startValue);
    }
}

class DelayAnimation extends Animation {
    constructor(
        private time: number,
        private animation: Animation
    ) {
        super();
    }

    getFinalValue(startValue: number): number {
        return this.animation.getFinalValue(startValue);
    }
}
