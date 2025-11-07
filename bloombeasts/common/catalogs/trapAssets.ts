/**
 * Trap Assets Catalog - Refactored using catalogBuilder
 *
 * This file uses the catalog builder utility to eliminate boilerplate.
 * Edit card definitions below, and the builder handles all the wrapper structure.
 */

import type { AssetCatalog } from '../../AssetCatalogManager';
import { CatalogCategory, AssetEntryType, AssetReferenceType } from '../../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration } from '../engine/types/abilities';
import { TrapTrigger, CardType } from '../engine/types/core';
import { defineCard } from './catalogBuilder';
import type { TrapCard } from '../engine/types/core';

/**
 * Trap card definitions
 */
const trapCards = [
  defineCard("bear-trap", {
    id: "bear-trap", name: "Bear Trap", type: CardType.Trap, cost: 1,
    activation: { trigger: TrapTrigger.OnAttack },
    abilities: [{ name: "Bear Trap", trigger: AbilityTrigger.OnSummon,
      effects: [{ type: EffectType.DealDamage, target: AbilityTarget.Attacker, value: 3 }] }]
  } as TrapCard, "assets/images/cards_trap_bear-trap.png", "1518992622460625"),

  defineCard("emergency-bloom", {
    id: "emergency-bloom", name: "Emergency Bloom", type: CardType.Trap, cost: 1,
    activation: { trigger: TrapTrigger.OnDestroy },
    abilities: [{ name: "Emergency Bloom", trigger: AbilityTrigger.OnSummon,
      effects: [{ type: EffectType.DrawCards, target: AbilityTarget.Player, value: 2 }] }]
  } as TrapCard, "assets/images/cards_trap_emergency-bloom.png", "2247657455738264"),

  defineCard("habitat-lock", {
    id: "habitat-lock", name: "Habitat Lock", type: CardType.Trap, cost: 1,
    activation: { trigger: TrapTrigger.OnHabitatPlay },
    abilities: [{ name: "Habitat Lock", trigger: AbilityTrigger.OnSummon,
      effects: [{ type: EffectType.NullifyEffect, target: AbilityTarget.PlayedCard }] }]
  } as TrapCard, "assets/images/cards_trap_habitat-lock.png", "609610328807674"),

  defineCard("habitat-shield", {
    id: "habitat-shield", name: "Habitat Shield", type: CardType.Trap, cost: 2,
    activation: { trigger: TrapTrigger.OnHabitatPlay },
    abilities: [{ name: "Habitat Shield", trigger: AbilityTrigger.OnSummon,
      effects: [
        { type: EffectType.NullifyEffect, target: AbilityTarget.PlayedCard },
        { type: EffectType.DrawCards, target: AbilityTarget.Player, value: 1 }
      ] }]
  } as TrapCard, "assets/images/cards_trap_habitat-shield.png", "1362245262078336"),

  defineCard("magic-shield", {
    id: "magic-shield", name: "Magic Shield", type: CardType.Trap, cost: 1,
    activation: { trigger: TrapTrigger.OnMagicPlay },
    abilities: [{ name: "Magic Shield", trigger: AbilityTrigger.OnSummon,
      effects: [{ type: EffectType.NullifyEffect, target: AbilityTarget.PlayedCard }] }]
  } as TrapCard, "assets/images/cards_trap_magic-sheild.png", "1239098601311749"),

  defineCard("thorn-snare", {
    id: "thorn-snare", name: "Thorn Snare", type: CardType.Trap, cost: 2,
    activation: { trigger: TrapTrigger.OnAttack },
    abilities: [{ name: "Thorn Snare", trigger: AbilityTrigger.OnSummon,
      effects: [
        { type: EffectType.PreventAttack, target: AbilityTarget.Attacker, duration: EffectDuration.Instant },
        { type: EffectType.DealDamage, target: AbilityTarget.Attacker, value: 2 }
      ] }]
  } as TrapCard, "assets/images/cards_trap_thorn-snare.png", "4210265565909373"),

  defineCard("vaporize", {
    id: "vaporize", name: "Vaporize", type: CardType.Trap, cost: 2,
    activation: { trigger: TrapTrigger.OnBeastPlay, condition: { type: "CostBelow" as any, value: 4 } },
    abilities: [{ name: "Vaporize", trigger: AbilityTrigger.OnSummon,
      effects: [{ type: EffectType.Destroy, target: AbilityTarget.PlayedCard }] }]
  } as TrapCard, "assets/images/cards_trap_vaporize.png", "1903759173890506"),

  defineCard("xp-harvest", {
    id: "xp-harvest", name: "XP Harvest", type: CardType.Trap, cost: 1,
    activation: { trigger: TrapTrigger.OnDestroy },
    abilities: [{ name: "XP Harvest", trigger: AbilityTrigger.OnSummon,
      effects: [{ type: EffectType.DealDamage, target: AbilityTarget.Attacker, value: 2 }] }]
  } as TrapCard, "assets/images/cards_trap_xpharvest.png", "807213335392971"),
];

/**
 * Build the catalog manually since Trap cards don't have affinity
 */
export const trapAssets: AssetCatalog = {
  version: "1.0.0",
  category: CatalogCategory.Trap,
  description: "Trap cards and assets",
  data: trapCards.map((card) => ({
    id: card.id,
    type: AssetEntryType.Trap,
    cardType: "Trap",
    data: card.cardData,
    assets: [{
      type: AssetReferenceType.Image,
      ...(card.horizonAssetId ? { horizonAssetId: card.horizonAssetId } : {}),
      path: card.imagePath,
    }]
  }))
};
