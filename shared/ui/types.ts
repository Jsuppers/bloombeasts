/**
 * Shared UI component type definitions for BloomBeasts
 * These types define the structure of UI components in a platform-agnostic way
 */

/**
 * Base style properties that work across platforms
 */
export type BaseStyle = {
  backgroundColor?: string;
  color?: string;
  padding?: number;
  margin?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  width?: number | string;
  height?: number | string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
};

/**
 * Button component definition
 */
export type ButtonDef = {
  id: string;
  label: string;
  style?: BaseStyle;
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'success' | 'secondary' | 'disabled';
};

/**
 * Text component definition
 */
export type TextDef = {
  text: string;
  style?: BaseStyle;
  numberOfLines?: number;
};

/**
 * Stat badge component definition
 */
export type StatBadgeDef = {
  label: string;
  value: string | number;
  style?: BaseStyle;
};

/**
 * Mission card component definition
 */
export type MissionCardDef = {
  id: string;
  name: string;
  level: number;
  difficulty: string;
  isAvailable: boolean;
  isCompleted: boolean;
  style?: BaseStyle;
};

/**
 * Card thumbnail component definition
 */
export type CardThumbnailDef = {
  id: string;
  name: string;
  affinity?: string;
  rarity?: string;
  baseAttack?: number;
  baseHealth?: number;
  isInDeck?: boolean;
  count?: number;
  style?: BaseStyle;
};

/**
 * Dialog component definition
 */
export type DialogDef = {
  title: string;
  message: string;
  buttons: string[];
  style?: BaseStyle;
};

/**
 * Container/View component definition
 */
export type ViewDef = {
  style?: BaseStyle & {
    flexDirection?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
    gap?: number;
  };
  children?: any[]; // Platform-specific children
};

/**
 * Image component definition
 */
export type ImageDef = {
  source: string | null;
  width?: number;
  height?: number;
  style?: BaseStyle;
};
