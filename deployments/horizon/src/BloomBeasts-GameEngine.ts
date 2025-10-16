/**
 * BloomBeasts Game Engine
 *
 * This is the core game engine export for Meta Horizon deployment.
 * It automatically re-exports everything from the engine using existing index files.
 *
 * This file will be bundled by Rollup into a single BloomBeasts-GameEngine.ts file
 * that can be used as a module in Meta Horizon worlds.
 *
 * MAINTENANCE: This file uses wildcard exports from existing index files.
 * When you add/remove features in the engine, they'll automatically be included/excluded.
 * No manual maintenance required!
 */

// ==================== Global Type Declarations for Meta Horizon ====================
// These ambient declarations provide types for Meta Horizon's runtime environment

// Console interface with all methods used by the engine
declare global {
  interface Console {
    log(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
    group(...args: unknown[]): void;
    groupCollapsed(...args: unknown[]): void;
    groupEnd(): void;
    table(data: unknown): void;
    time(label?: string): void;
    timeEnd(label?: string): void;
    assert(condition?: boolean, ...data: unknown[]): void;
  }

  // Timer functions (in Meta Horizon, use this.async.setTimeout in practice)
  type TimerHandler = (...args: any[]) => any;
  function setTimeout(callback: TimerHandler, timeout?: number, ...args: unknown[]): number;
  function setInterval(callback: TimerHandler, timeout?: number, ...args: unknown[]): number;
  function clearInterval(id: number): void;
  function clearTimeout(id: number): void;

  // Canvas types for rendering
  type CanvasTextAlign = "start" | "end" | "left" | "right" | "center";
  type CanvasTextBaseline = "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";

  interface CanvasRenderingContext2D {
    fillStyle: string | CanvasGradient | CanvasPattern;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    lineWidth: number;
    lineCap: string;
    lineJoin: string;
    miterLimit: number;
    lineDashOffset: number;
    font: string;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
    direction: string;
    globalAlpha: number;
    globalCompositeOperation: string;
    imageSmoothingEnabled: boolean;
    shadowBlur: number;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;

    fillRect(x: number, y: number, w: number, h: number): void;
    strokeRect(x: number, y: number, w: number, h: number): void;
    clearRect(x: number, y: number, w: number, h: number): void;
    fillText(text: string, x: number, y: number, maxWidth?: number): void;
    strokeText(text: string, x: number, y: number, maxWidth?: number): void;
    measureText(text: string): TextMetrics;
    beginPath(): void;
    closePath(): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    rect(x: number, y: number, w: number, h: number): void;
    fill(): void;
    stroke(): void;
    clip(): void;
    save(): void;
    restore(): void;
    scale(x: number, y: number): void;
    rotate(angle: number): void;
    translate(x: number, y: number): void;
    transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    resetTransform(): void;
    drawImage(image: unknown, dx: number, dy: number): void;
    drawImage(image: unknown, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: unknown, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
  }

  interface TextMetrics {
    width: number;
    actualBoundingBoxLeft?: number;
    actualBoundingBoxRight?: number;
    actualBoundingBoxAscent?: number;
    actualBoundingBoxDescent?: number;
  }

  interface CanvasGradient {
    addColorStop(offset: number, color: string): void;
  }

  interface CanvasPattern {}
}

// ==================== Complete Engine (Auto-exported) ====================
// This exports all types, systems, cards, and utilities automatically
export * from '../../../bloombeasts/engine';

// ==================== Game Manager ====================
export { GameManager } from '../../../bloombeasts/gameManager';

// ==================== Card Collection ====================
export { CardCollectionManager } from '../../../bloombeasts/systems/CardCollectionManager';

// ==================== Additional Systems ====================
export { GameEngine } from '../../../bloombeasts/engine/systems/GameEngine';
export { Logger } from '../../../bloombeasts/engine/utils/Logger';
export { StatModifierManager } from '../../../bloombeasts/engine/utils/StatModifierManager';
export { generateAbilityDescription } from '../../../bloombeasts/engine/utils/abilityDescriptionGenerator';
export { getCardDescription } from '../../../bloombeasts/engine/utils/cardDescriptionGenerator';
export { CardBuilder } from '../../../bloombeasts/engine/cards/CardBuilder';

// ==================== Battle Systems (for Mission Mode) ====================
export { BattleStateManager } from '../../../bloombeasts/screens/missions/BattleStateManager';
export { OpponentAI } from '../../../bloombeasts/screens/missions/OpponentAI';

// ==================== Platform Interface ====================
export type {
  PlatformInterface,
  AssetLoadResult,
  InputCallback,
  RenderContext
} from '../../../bloombeasts/engine/types/platform';
