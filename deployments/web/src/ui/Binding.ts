/**
 * Core Binding System
 * Mimics Horizon's Binding API for dynamic UI updates
 */

type BindingChangeCallback = (value?: any) => void;

/**
 * Base class for value-based bindings
 */
export abstract class ValueBindingBase<T> {
    protected _callbacks: Set<BindingChangeCallback> = new Set();

    /**
     * Get the current value
     */
    abstract get(playerId?: string): T;

    /**
     * Subscribe to changes in this binding
     */
    subscribe(callback: BindingChangeCallback): () => void {
        this.callbacks.add(callback);
        return () => this._callbacks.delete(callback);
    }

    /**
     * Notify all subscribers of a change
     */
    protected notify(): void {
        // Call callbacks with the new value as per Horizon Binding API
        const currentValue = (this as any).get ? (this as any).get() : undefined;
        this._callbacks.forEach(cb => cb(currentValue));
    }

    protected get callbacks(): Set<BindingChangeCallback> {
        return this._callbacks;
    }
}

/**
 * Represents a container for a variable value used by UI components.
 * When the value is updated, UI components using it are automatically re-rendered.
 */
export class Binding<T> extends ValueBindingBase<T> {
    private _value: T;
    private _playerValues: Map<string, T> = new Map();

    constructor(value: T) {
        super();
        this._value = value;
    }

    /**
     * Updates the value of the Binding and triggers re-render
     */
    set(value: T | ((prev: T) => T), players?: string[]): void {
        const newValue = typeof value === 'function'
            ? (value as (prev: T) => T)(this._value)
            : value;

        if (players) {
            // Set player-specific values
            players.forEach(playerId => {
                this._playerValues.set(playerId, newValue);
            });
        } else {
            // Set global value and clear player-specific values
            this._value = newValue;
            this._playerValues.clear();
        }

        this.notify();
    }

    /**
     * Get the current value (global or player-specific)
     */
    get(playerId?: string): T {
        if (playerId && this._playerValues.has(playerId)) {
            return this._playerValues.get(playerId)!;
        }
        return this._value;
    }


    /**
     * Getter for accessing value directly (compatibility with unified system)
     */
    get value(): T {
        return this._value;
    }
    /**
     * Reset player-specific values back to global value
     */
    reset(players?: string[]): void {
        if (players) {
            players.forEach(playerId => {
                this._playerValues.delete(playerId);
            });
        } else {
            this._playerValues.clear();
        }
        this.notify();
    }

    /**
     * Derive a new value from this binding
     */
    derive<R>(mapFn: (value: T) => R): DerivedBinding<R, any> {
        return new DerivedBinding([this] as any, (arg: any) => mapFn(arg)) as any;
    }

    /**
     * Derive a new value from multiple bindings
     */
    static derive<R, A extends unknown[]>(
        dependencies: [...Dependencies<A>],
        mapFn: (...args: A) => R
    ): DerivedBinding<R, A> {
        return new DerivedBinding(dependencies, mapFn);
    }
}

type Dependencies<A extends unknown[]> = {
    [I in keyof A]: Binding<A[I]>;
};

/**
 * Derived Binding computes its value from other Bindings
 */
export class DerivedBinding<T, A extends unknown[]> extends ValueBindingBase<T> {
    private _dependencies: [...Dependencies<A>];
    private _mapFn: (...args: A) => T;
    private _unsubscribers: (() => void)[] = [];

    constructor(dependencies: [...Dependencies<A>], mapFn: (...args: A) => T) {
        super();
        this._dependencies = dependencies;
        this._mapFn = mapFn;

        // Subscribe to all dependencies
        this._unsubscribers = dependencies.map(dep =>
            dep.subscribe(() => this.notify())
        );
    }

    /**
     * Get the derived value
     */
    get(playerId?: string): T {
        const values = this._dependencies.map(dep => dep.get(playerId)) as A;
        return this._mapFn(...values);
    }

    /**
     * Cleanup subscriptions
     */
    destroy(): void {
        this._unsubscribers.forEach(unsub => unsub());
        this._unsubscribers = [];
    }
}

/**
 * A Binding that supports animations when setting values.
 * Only supports number values.
 */
export class AnimatedBinding extends ValueBindingBase<number> {
    private _value: number;
    private _playerValues: Map<string, number> = new Map();
    private _animationId: number | null = null;
    private _targetValue: number | null = null;

    constructor(value: number) {
        super();
        this._value = value;
    }

    /**
     * Updates the value, optionally with animation
     * TODO: Implement full animation support
     */
    set(
        value: number | ((prev: number) => number) | any, // 'any' for Animation object placeholder
        onEnd?: (finished: boolean) => void,
        players?: string[]
    ): void {
        const newValue = typeof value === 'function'
            ? (value as (prev: number) => number)(this._value)
            : typeof value === 'number'
            ? value
            : value; // For now, treat Animation objects as direct values (placeholder)

        if (players) {
            players.forEach(playerId => {
                this._playerValues.set(playerId, newValue);
            });
        } else {
            this._value = newValue;
            this._playerValues.clear();
        }

        this.notify();

        // Placeholder: Always call onEnd immediately with finished=true
        if (onEnd) {
            onEnd(true);
        }
    }

    /**
     * Get the current value
     */
    get(playerId?: string): number {
        if (playerId && this._playerValues.has(playerId)) {
            return this._playerValues.get(playerId)!;
        }
        return this._value;
    }

    /**
     * Reset player-specific values
     */
    reset(players?: string[]): void {
        if (players) {
            players.forEach(playerId => {
                this._playerValues.delete(playerId);
            });
        } else {
            this._playerValues.clear();
        }
        this.notify();
    }

    /**
     * Stop any running animation
     * TODO: Implement when animation support is added
     */
    stopAnimation(players?: string[]): void {
        // Placeholder
        if (this._animationId !== null) {
            cancelAnimationFrame(this._animationId);
            this._animationId = null;
        }
    }

    /**
     * Interpolate the animated binding to a new range
     * TODO: Implement full interpolation support
     */
    interpolate<T extends number | string>(
        inputRange: number[],
        outputRange: T[]
    ): AnimatedInterpolation<T> {
        return new AnimatedInterpolation(this, inputRange, outputRange);
    }
}

/**
 * Interpolated value from an AnimatedBinding
 */
export class AnimatedInterpolation<T extends number | string> extends ValueBindingBase<T> {
    private _dependency: AnimatedBinding;
    private _inputRange: number[];
    private _outputRange: T[];
    private _unsubscriber: (() => void) | null = null;

    constructor(dependency: AnimatedBinding, inputRange: number[], outputRange: T[]) {
        super();
        this._dependency = dependency;
        this._inputRange = inputRange;
        this._outputRange = outputRange;

        // Subscribe to dependency changes
        this._unsubscriber = dependency.subscribe(() => this.notify());
    }

    /**
     * Get the interpolated value
     * TODO: Implement proper interpolation
     */
    get(playerId?: string): T {
        const inputValue = this._dependency.get(playerId);

        // Simple linear interpolation for now
        const segmentIndex = this._inputRange.findIndex((val, i) =>
            i < this._inputRange.length - 1 && inputValue >= val && inputValue <= this._inputRange[i + 1]
        );

        if (segmentIndex === -1) {
            return this._outputRange[0];
        }

        return this._outputRange[segmentIndex];
    }

    destroy(): void {
        if (this._unsubscriber) {
            this._unsubscriber();
            this._unsubscriber = null;
        }
    }
}

/**
 * Type representing a bindable value (value or binding)
 */
export type Bindable<T> = T | ValueBindingBase<T>;

/**
 * Extract the actual value from a Bindable
 */
export function resolveBindable<T>(bindable: Bindable<T>, playerId?: string): T {
    // Check for .get method (works with both direct instances and Proxy wrappers)
    if (bindable && typeof (bindable as any).get === 'function') {
        return (bindable as ValueBindingBase<T>).get(playerId);
    }
    // Also keep instanceof check for direct instances
    if (bindable instanceof ValueBindingBase) {
        return bindable.get(playerId);
    }
    return bindable;
}
