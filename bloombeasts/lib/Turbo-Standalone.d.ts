/**
 * TURBO - TURn-Based Operations
 * Standalone TypeScript Bundle
 *
 * This file contains the complete Turbo library in a single standalone TypeScript file.
 * All code is wrapped in the Turbo namespace to avoid global scope pollution.
 *
 * Usage:
 *   // Access types and classes via the Turbo namespace
 *   const game = new Turbo.GameController(rules);
 *   const ai = new Turbo.RandomAI(config);
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated: 2025-11-05T20:11:51.717Z
 * Files: 16
 *
 * @version 2.0.0
 * @license MIT
 */
declare namespace Turbo {
    /**
     * Core game interfaces with proper type safety
     */
    /**
     * Base game state interface
     */
    export interface IGameState<TState extends Record<string, unknown> = Record<string, unknown>> {
        /** Game-specific state managed by the implementation */
        gameData: TState;
        /** Current turn information */
        turnInfo: ITurnInfo;
        /** Players in the game */
        players: IPlayer[];
        /** Current game phase */
        phase: GamePhase;
        /** Whether the game is complete */
        isComplete: boolean;
        /** Winner ID if game is complete */
        winnerId?: string;
    }
    /**
     * Player interface
     */
    export interface IPlayer {
        readonly id: string;
        readonly name: string;
        readonly type: PlayerType;
        metadata?: Record<string, unknown>;
    }
    /**
     * Player type enumeration
     */
    export enum PlayerType {
        HUMAN = "human",
        AI = "ai"
    }
    /**
     * Turn information
     */
    export interface ITurnInfo {
        turnNumber: number;
        currentPlayerId: string;
        movesThisTurn: number;
        maxMovesPerTurn?: number;
        timeStarted: number;
    }
    /**
     * Game phase enumeration
     */
    export enum GamePhase {
        NOT_STARTED = "not_started",
        SETUP = "setup",
        PLAYING = "playing",
        PAUSED = "paused",
        COMPLETED = "completed"
    }
    /**
     * Game action interface
     */
    export interface IGameAction<TActionData extends Record<string, unknown> = Record<string, unknown>> {
        readonly type: string;
        readonly playerId: string;
        readonly data: TActionData;
        readonly timestamp?: number;
    }
    /**
     * Action validation result
     */
    export interface IActionValidation {
        readonly isValid: boolean;
        readonly reason?: string;
        readonly suggestions?: string[];
    }
    /**
     * Action execution result
     */
    export interface IActionResult<TState extends Record<string, unknown> = Record<string, unknown>> {
        readonly success: boolean;
        readonly newState?: IGameState<TState>;
        readonly error?: Error;
        readonly sideEffects?: ISideEffect[];
    }
    /**
     * Side effect from an action
     */
    export interface ISideEffect {
        readonly type: string;
        readonly description: string;
        readonly data?: Record<string, unknown>;
    }
    /**
     * Game configuration
     */
    export interface IGameConfig {
        readonly players: IPlayer[];
        readonly seed?: string;
        readonly timeLimit?: number;
        readonly customRules?: Record<string, unknown>;
    }
    /**
     * Game controller interface
     */
    export interface IGameController<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>> {
        initialize(config: IGameConfig): void;
        getState(): IGameState<TState>;
        executeAction(action: IGameAction<TAction>): IActionResult<TState>;
        endTurn(): void;
        isGameOver(): boolean;
        getWinner(): string | undefined;
        reset(): void;
    }
    /**
     * Game rules interface - defines the rules and logic of a specific game
     */
    /**
     * Interface for implementing game-specific rules
     */
    export interface IGameRules<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>> {
        /**
         * Initialize the game state
         */
        createInitialState(config: IGameConfig): IGameState<TState>;
        /**
         * Validate if an action can be performed
         */
        validateAction(action: IGameAction<TAction>, state: IGameState<TState>): IActionValidation;
        /**
         * Execute an action and return the new state
         */
        executeAction(action: IGameAction<TAction>, state: IGameState<TState>): IActionResult<TState>;
        /**
         * Get all valid actions for the current state
         */
        getValidActions(state: IGameState<TState>): IGameAction<TAction>[];
        /**
         * Check if the game has ended
         */
        checkEndCondition(state: IGameState<TState>): {
            isEnded: boolean;
            winnerId?: string;
            reason?: string;
        };
        /**
         * Calculate score for a player
         */
        calculateScore?(state: IGameState<TState>, playerId: string): number;
        /**
         * Get the next phase based on current state
         */
        getNextPhase?(currentPhase: string, state: IGameState<TState>): string;
    }
    /**
     * Turn order strategy interface
     */
    export interface ITurnOrderStrategy {
        /**
         * Determine the next player
         */
        getNextPlayer(currentPlayerId: string, players: string[]): string;
        /**
         * Reset turn order (e.g., for a new round)
         */
        reset?(): void;
    }
    /**
     * Common turn order strategies
     */
    export class TurnOrderStrategies {
        /**
         * Sequential turn order
         */
        static sequential(): ITurnOrderStrategy;
        /**
         * Random turn order
         */
        static random(): ITurnOrderStrategy;
        /**
         * Custom turn order with predefined sequence
         */
        static custom(sequence: string[]): ITurnOrderStrategy;
    }
    /**
     * AI player interfaces
     */
    /**
     * Base AI player interface
     */
    export interface IAIPlayer<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>> {
        /**
         * Choose an action based on current state
         */
        chooseAction(state: IGameState<TState>, availableActions: IGameAction<TAction>[]): Promise<IGameAction<TAction> | null>;
        /**
         * Evaluate the state (higher is better for this player)
         */
        evaluateState(state: IGameState<TState>): number;
        /**
         * Get AI difficulty level
         */
        getDifficulty(): AILevel;
        /**
         * Set AI difficulty level
         */
        setDifficulty(level: AILevel): void;
    }
    /**
     * AI difficulty levels
     */
    export enum AILevel {
        EASY = "easy",
        MEDIUM = "medium",
        HARD = "hard",
        EXPERT = "expert"
    }
    /**
     * AI configuration
     */
    export interface IAIConfig {
        playerId: string;
        difficulty: AILevel;
        thinkingTime?: {
            min: number;
            max: number;
        };
        randomSeed?: string;
        maxDepth?: number;
        evaluationFunction?: (state: IGameState) => number;
    }
    /**
     * Monte Carlo Tree Search node
     */
    export interface IMCTSNode<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>> {
        state: IGameState<TState>;
        action: IGameAction<TAction> | null;
        parent: IMCTSNode<TState, TAction> | null;
        children: IMCTSNode<TState, TAction>[];
        visits: number;
        totalValue: number;
        isLeaf(): boolean;
        addChild(child: IMCTSNode<TState, TAction>): void;
        getBestChild(explorationConstant: number): IMCTSNode<TState, TAction> | null;
    }
    /**
     * Efficient deep cloning utility using structured cloning when available
     */
    /**
     * Deep clone an object using the most efficient method available
     */
    export function deepClone<T>(obj: T): T;
    /**
     * Create a shallow clone of an object
     */
    export function shallowClone<T extends Record<string, unknown>>(obj: T): T;
    /**
     * Game state management with history and undo/redo support
     */
    /**
     * Manages game state with history tracking
     */
    export class GameStateManager<TState extends Record<string, unknown> = Record<string, unknown>> {
        private currentState;
        private history;
        private redoStack;
        private readonly maxHistorySize;
        constructor(maxHistorySize?: number);
        /**
         * Set the current state
         */
        setState(state: IGameState<TState>): void;
        /**
         * Get current state (returns a clone to prevent mutations)
         */
        getCurrentState(): IGameState<TState> | null;
        /**
         * Get state history
         */
        getHistory(): IGameState<TState>[];
        /**
         * Check if undo is possible
         */
        canUndo(): boolean;
        /**
         * Undo to previous state
         */
        undo(): boolean;
        /**
         * Check if redo is possible
         */
        canRedo(): boolean;
        /**
         * Redo to next state
         */
        redo(): boolean;
        /**
         * Create a checkpoint
         */
        createCheckpoint(): string;
        /**
         * Restore from checkpoint
         */
        restoreCheckpoint(checkpointId: string): boolean;
        /**
         * Reset state manager
         */
        reset(): void;
        private checkpoints;
    }
    /**
     * Turn management system
     */
    /**
     * Manages turn order and player rotation
     */
    export class TurnManager {
        private players;
        private currentPlayerIndex;
        private turnOrderStrategy;
        constructor(strategy?: ITurnOrderStrategy);
        /**
         * Initialize with players
         */
        initialize(players: IPlayer[]): void;
        /**
         * Get current player
         */
        getCurrentPlayer(): IPlayer;
        /**
         * Get next player
         */
        getNextPlayer(): string;
        /**
         * Set turn order strategy
         */
        setStrategy(strategy: ITurnOrderStrategy): void;
        /**
         * Get all players
         */
        getPlayers(): IPlayer[];
        /**
         * Get player by ID
         */
        getPlayer(playerId: string): IPlayer | undefined;
        /**
         * Reset turn manager
         */
        reset(): void;
    }
    /**
     * Type-safe event bus for game events
     */
    type EventHandler<T = unknown> = (data: T) => void | Promise<void>;
    /**
     * Type-safe event emitter
     */
    export class EventBus<TEvents extends Record<string, unknown>> {
        private listeners;
        private onceListeners;
        /**
         * Subscribe to an event
         */
        on<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): () => void;
        /**
         * Subscribe to an event once
         */
        once<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): void;
        /**
         * Emit an event
         */
        emit<K extends keyof TEvents>(event: K, data: TEvents[K]): void;
        /**
         * Emit an event asynchronously
         */
        emitAsync<K extends keyof TEvents>(event: K, data: TEvents[K]): Promise<void>;
        /**
         * Remove all listeners for an event
         */
        removeAllListeners(event?: keyof TEvents): void;
        /**
         * Get listener count for an event
         */
        listenerCount(event: keyof TEvents): number;
        /**
         * Check if there are any listeners for an event
         */
        hasListeners(event: keyof TEvents): boolean;
    }
    /**
     * Game event definitions
     */
    /**
     * Game events type map
     */
    export interface GameEvents<TState extends Record<string, unknown> = Record<string, unknown>> {
        [key: string]: unknown;
        gameStarted: {
            state: IGameState<TState>;
            config: IGameConfig;
        };
        gameEnded: {
            winnerId?: string;
            reason?: string;
            state: IGameState<TState>;
        };
        gameReset: Record<string, never>;
        turnStarted: {
            playerId: string;
            turnNumber: number;
        };
        turnEnded: {
            playerId: string;
            turnNumber: number;
        };
        actionExecuted: {
            action: IGameAction;
            result: IActionResult<TState>;
            state: IGameState<TState>;
        };
        actionUndone: {
            state: IGameState<TState>;
        };
        actionRedone: {
            state: IGameState<TState>;
        };
        sideEffect: ISideEffect;
        phaseChanged: {
            oldPhase: string;
            newPhase: string;
            state: IGameState<TState>;
        };
        error: {
            error: Error;
            context?: string;
        };
    }
    /**
     * Main game controller - manages game flow and state
     */
    /**
     * Core game controller implementation
     */
    export class GameController<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>> implements IGameController<TState, TAction> {
        private readonly rules;
        private readonly stateManager;
        private readonly turnManager;
        private readonly eventBus;
        private readonly aiPlayers;
        private config;
        constructor(rules: IGameRules<TState, TAction>);
        /**
         * Initialize a new game
         */
        initialize(config: IGameConfig): void;
        /**
         * Get current game state
         */
        getState(): IGameState<TState>;
        /**
         * Execute a game action
         */
        executeAction(action: IGameAction<TAction>): IActionResult<TState>;
        /**
         * End the current turn
         */
        endTurn(): void;
        /**
         * Check if the game is over
         */
        isGameOver(): boolean;
        /**
         * Get the winner
         */
        getWinner(): string | undefined;
        /**
         * Reset the game
         */
        reset(): void;
        /**
         * Subscribe to game events
         */
        on<K extends keyof GameEvents<TState>>(event: K, handler: (data: GameEvents<TState>[K]) => void): () => void;
        /**
         * Get available actions for the current state
         */
        getAvailableActions(): IGameAction<TAction>[];
        /**
         * Register an AI player
         */
        registerAI(playerId: string, ai: IAIPlayer<TState, TAction>): void;
        /**
         * Unregister an AI player
         */
        unregisterAI(playerId: string): void;
        /**
         * Check if a player is controlled by AI
         */
        isAIPlayer(playerId: string): boolean;
        /**
         * Execute AI turn for the current player
         */
        executeAITurn(): Promise<void>;
        /**
         * Get the complete winner information, checking if complete
         */
        isComplete(): boolean;
        /**
         * Perform an action (legacy method name for compatibility)
         */
        performAction(action: IGameAction<TAction>): IActionResult<TState>;
        /**
         * Get action history
         */
        getActionHistory(): IGameState<TState>[];
        /**
         * Undo last action
         */
        undo(): boolean;
        /**
         * Redo previously undone action
         */
        redo(): boolean;
        private validateConfig;
        private handleGameEnd;
    }
    /**
     * Base AI implementation with common functionality
     */
    /**
     * Abstract base class for AI players
     */
    export abstract class BaseAI<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>> implements IAIPlayer<TState, TAction> {
        protected readonly playerId: string;
        protected difficulty: AILevel;
        protected thinkingTime: {
            min: number;
            max: number;
        };
        protected randomSeed?: string;
        constructor(config: IAIConfig);
        abstract chooseAction(state: IGameState<TState>, availableActions: IGameAction<TAction>[]): Promise<IGameAction<TAction> | null>;
        abstract evaluateState(state: IGameState<TState>): number;
        getDifficulty(): AILevel;
        setDifficulty(level: AILevel): void;
        /**
         * Simulate thinking delay for better UX
         */
        protected simulateThinking(): Promise<void>;
        /**
         * Add randomness based on difficulty
         */
        protected addNoise(value: number, maxNoise: number): number;
        /**
         * Get default thinking times by difficulty
         */
        private getDefaultThinkingTime;
        /**
         * Get noise factor based on difficulty (more noise = more mistakes)
         */
        private getDifficultyNoiseFactor;
        /**
         * Check if this is the AI's turn
         */
        protected isMyTurn(state: IGameState<TState>): boolean;
        /**
         * Get opponent IDs
         */
        protected getOpponentIds(state: IGameState<TState>): string[];
    }
    /**
     * Random AI - chooses actions randomly
     */
    /**
     * AI that chooses random actions
     */
    export class RandomAI<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>> extends BaseAI<TState, TAction> {
        constructor(config: IAIConfig);
        chooseAction(_state: IGameState<TState>, availableActions: IGameAction<TAction>[]): Promise<IGameAction<TAction> | null>;
        evaluateState(_state: IGameState<TState>): number;
    }
    /**
     * Greedy AI - chooses action with best immediate value
     */
    /**
     * AI that chooses the action with best immediate value
     */
    export abstract class GreedyAI<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>> extends BaseAI<TState, TAction> {
        constructor(config: IAIConfig);
        /**
         * Evaluate an action's immediate value
         * Must be implemented by specific game AI
         */
        abstract evaluateAction(action: IGameAction<TAction>, state: IGameState<TState>): number;
        chooseAction(state: IGameState<TState>, availableActions: IGameAction<TAction>[]): Promise<IGameAction<TAction> | null>;
    }
    /**
     * Minimax AI with alpha-beta pruning
     */
    /**
     * AI using minimax algorithm with alpha-beta pruning
     */
    export abstract class MinimaxAI<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>> extends BaseAI<TState, TAction> {
        protected maxDepth: number;
        constructor(config: IAIConfig);
        /**
         * Simulate an action and return resulting state
         * Must be implemented by specific game AI
         */
        abstract simulateAction(action: IGameAction<TAction>, state: IGameState<TState>): IGameState<TState>;
        /**
         * Get available actions for a given state and player
         * Must be implemented by specific game AI
         */
        abstract getActionsForState(state: IGameState<TState>, playerId: string): IGameAction<TAction>[];
        /**
         * Check if the game is over in given state
         * Must be implemented by specific game AI
         */
        abstract isTerminalState(state: IGameState<TState>): boolean;
        chooseAction(state: IGameState<TState>, availableActions: IGameAction<TAction>[]): Promise<IGameAction<TAction> | null>;
        /**
         * Minimax algorithm with alpha-beta pruning
         */
        private minimax;
        /**
         * Get search depth based on difficulty
         */
        private getDepthByDifficulty;
    }
    /**
     * AI using Monte Carlo Tree Search
     */
    export abstract class MCTSAI<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>> extends BaseAI<TState, TAction> {
        protected iterations: number;
        protected explorationConstant: number;
        constructor(config: IAIConfig);
        /**
         * Simulate a random playout from given state
         * Must be implemented by specific game AI
         */
        abstract simulatePlayout(state: IGameState<TState>): number;
        /**
         * Get available actions for a given state and player
         * Must be implemented by specific game AI
         */
        abstract getActionsForState(state: IGameState<TState>, playerId: string): IGameAction<TAction>[];
        /**
         * Simulate an action and return resulting state
         * Must be implemented by specific game AI
         */
        abstract simulateAction(action: IGameAction<TAction>, state: IGameState<TState>): IGameState<TState>;
        /**
         * Check if the game is over in given state
         * Must be implemented by specific game AI
         */
        abstract isTerminalState(state: IGameState<TState>): boolean;
        chooseAction(state: IGameState<TState>, availableActions: IGameAction<TAction>[]): Promise<IGameAction<TAction> | null>;
        /**
         * Expand node by adding all possible children
         */
        private expand;
        /**
         * Backpropagate value up the tree
         */
        private backpropagate;
        /**
         * Get iterations based on difficulty
         */
        private getIterationsByDifficulty;
    }
    /**
     * Random number generation utilities with seeding support
     */
    /**
     * Seeded random number generator using xorshift algorithm
     */
    export class SeededRandom {
        private seed;
        constructor(seed: string | number);
        /**
         * Generate a random number between 0 and 1
         */
        next(): number;
        /**
         * Generate a random integer between min and max (inclusive)
         */
        nextInt(min: number, max: number): number;
        /**
         * Generate a random boolean
         */
        nextBoolean(probability?: number): boolean;
        /**
         * Shuffle an array
         */
        shuffle<T>(array: T[]): T[];
        /**
         * Pick a random element from an array
         */
        pick<T>(array: T[]): T | undefined;
        /**
         * Pick multiple random elements without replacement
         */
        pickMultiple<T>(array: T[], count: number): T[];
        /**
         * Generate a normally distributed random number (Box-Muller transform)
         */
        gaussian(mean?: number, stdDev?: number): number;
        private hashString;
    }
    /**
     * Weighted random selector
     */
    export class WeightedRandom<T> {
        private items;
        private totalWeight;
        constructor(items: Array<{
            item: T;
            weight: number;
        }>);
        /**
         * Select a random item based on weights
         */
        select(random?: () => number): T | undefined;
        /**
         * Update weight for an item
         */
        updateWeight(item: T, newWeight: number): void;
        /**
         * Add a new item with weight
         */
        add(item: T, weight: number): void;
        /**
         * Remove an item
         */
        remove(item: T): boolean;
    }
    /**
     * TURBO - TURn-Based Operations
     * A modern, type-safe TypeScript library for turn-based game logic
     *
     * @version 2.0.0
     */
    export const VERSION = "2.0.0";
}
