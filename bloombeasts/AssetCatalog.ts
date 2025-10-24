/**
 * Asset Catalog - Dynamically Generated Asset IDs
 *
 * This file generates asset IDs from game data (cards, etc.)
 * Platforms must provide mappings for these IDs to actual assets.
 *
 * NO platform-specific code should be in this file!
 */

import { getAllCards } from './engine/cards';
import type { AnyCard, BloomBeastCard } from './engine/types/core';

/**
 * Get all card IDs that need image assets
 */
export function getCardImageAssetIds(): string[] {
  const cards = getAllCards();
  return cards.map(card => card.id);
}

/**
 * Get affinity icon asset IDs
 */
export function getAffinityIconAssetIds(): string[] {
  return ['Forest', 'Water', 'Fire', 'Sky'];
}

/**
 * Get card template asset IDs
 */
export function getCardTemplateAssetIds(): string[] {
  return ['base-card', 'magic-card', 'trap-card', 'buff-card'];
}

/**
 * Get card rendering asset IDs (for CardRenderer)
 * These are the IDs that CardRenderer expects for rendering cards
 */
export function getCardRenderingAssetIds(): string[] {
  const cards = getAllCards();
  const assetIds: string[] = [
    'cardsContainer',  // Cards page background
    'baseCard',        // Base card frame template
    'magicCard',       // Magic card type overlay
    'trapCard',        // Trap card type overlay
    'buffCard',        // Buff card type overlay
  ];

  // Add individual card artwork for each card
  for (const card of cards) {
    if (card.type === 'Bloom') {
      // Bloom cards use beast artwork
      assetIds.push(`beast-${card.name}`);
    } else {
      // Other cards use card artwork
      assetIds.push(`card-${card.name}`);
    }
  }

  return assetIds;
}

/**
 * Get habitat template asset IDs (affinity-specific)
 */
export function getHabitatTemplateAssetIds(): string[] {
  return ['forest-habitat', 'water-habitat', 'fire-habitat', 'sky-habitat'];
}

/**
 * Get UI icon asset IDs
 */
export function getUIIconAssetIds(): string[] {
  return ['icon-play', 'icon-cards', 'icon-missions', 'icon-settings', 'icon-shop'];
}

/**
 * Get UI element asset IDs (buttons, bars, menus, etc.)
 */
export function getUIElementAssetIds(): string[] {
  return [
    'standardButton',
    'greenButton',
    'sideMenu',
    'experienceBar',
    // Menu animation frames (1-10)
    ...Array.from({ length: 10 }, (_, i) => `menuFrame${i + 1}`)
  ];
}

/**
 * Get background image asset IDs
 */
export function getBackgroundAssetIds(): string[] {
  return ['background', 'menu-bg', 'cards-bg', 'mission-select-bg', 'menu'];
}

/**
 * Get all image asset IDs
 */
export function getAllImageAssetIds(): string[] {
  return [
    ...getCardImageAssetIds(),
    ...getAffinityIconAssetIds(),
    ...getCardTemplateAssetIds(),
    ...getCardRenderingAssetIds(),
    ...getHabitatTemplateAssetIds(),
    ...getUIIconAssetIds(),
    ...getUIElementAssetIds(),
    ...getBackgroundAssetIds()
  ];
}

/**
 * Sound Asset IDs - Enum for type safety
 * These match the IDs in commonAssets.json
 */
export enum SoundAssetIds {
  // Music
  BACKGROUND_MUSIC = 'background-music',
  BATTLE_MUSIC = 'battle-music',

  // SFX
  MENU_BUTTON_SELECT = 'menu-button-select',
  PLAY_CARD = 'play-card',
  ATTACK = 'attack-sfx',
  TRAP_ACTIVATED = 'trap-activated',
  LOW_HEALTH = 'low-health',
  WIN = 'win-sfx',
  LOSE = 'lose-sfx',
}

/**
 * Legacy sound ID mappings for backwards compatibility
 * Maps old string IDs to new SoundAssetIds
 */
export const LEGACY_SOUND_ID_MAP: Record<string, SoundAssetIds> = {
  // Music (old format)
  'BackgroundMusic.mp3': SoundAssetIds.BACKGROUND_MUSIC,
  'BattleMusic.mp3': SoundAssetIds.BATTLE_MUSIC,

  // SFX (old format with paths)
  'sfx/menuButtonSelect.wav': SoundAssetIds.MENU_BUTTON_SELECT,
  'sfx/playCard.wav': SoundAssetIds.PLAY_CARD,
  'sfx/attack.wav': SoundAssetIds.ATTACK,
  'sfx/trapCardActivated.wav': SoundAssetIds.TRAP_ACTIVATED,
  'sfx/lowHealthSound.wav': SoundAssetIds.LOW_HEALTH,
  'sfx/win.wav': SoundAssetIds.WIN,
  'sfx/lose.wav': SoundAssetIds.LOSE,

  // SFX (old format without extension/path)
  'menuButtonSelect': SoundAssetIds.MENU_BUTTON_SELECT,
  'playCard': SoundAssetIds.PLAY_CARD,
  'attack': SoundAssetIds.ATTACK,
};

/**
 * Get sound effect asset IDs
 */
export function getSoundEffectAssetIds(): string[] {
  return [
    SoundAssetIds.MENU_BUTTON_SELECT,
    SoundAssetIds.PLAY_CARD,
    SoundAssetIds.ATTACK,
    SoundAssetIds.TRAP_ACTIVATED,
    SoundAssetIds.LOW_HEALTH,
    SoundAssetIds.WIN,
    SoundAssetIds.LOSE,
  ];
}

/**
 * Get music asset IDs
 */
export function getMusicAssetIds(): string[] {
  return [
    SoundAssetIds.BACKGROUND_MUSIC,
    SoundAssetIds.BATTLE_MUSIC,
  ];
}

/**
 * Get all sound asset IDs
 */
export function getAllSoundAssetIds(): string[] {
  return [
    ...getSoundEffectAssetIds(),
    ...getMusicAssetIds()
  ];
}

/**
 * Normalize a sound ID (convert legacy IDs to new format)
 */
export function normalizeSoundId(soundId: string): string {
  return LEGACY_SOUND_ID_MAP[soundId] || soundId;
}


// Types for asset maps that platforms must provide
export type ImageAssetMap = Record<string, any>;
export type SoundAssetMap = Record<string, any>; // More flexible to support both catalog IDs and paths
