/**
 * Magic Assets Catalog - Refactored using catalogBuilder
 *
 * This file uses the catalog builder utility to eliminate boilerplate.
 * Edit card definitions below, and the builder handles all the wrapper structure.
 */

import type { AssetCatalog } from '../../AssetCatalogManager';
import { CatalogCategory, AssetEntryType, AssetReferenceType } from '../../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType, ResourceType } from '../engine/types/abilities';
import { CardType } from '../engine/types/core';
import { defineCard } from './catalogBuilder';
import type { MagicCard } from '../engine/types/core';

/**
 * Magic card definitions
 */
const magicCards = [
  defineCard("aether-swap", {
    id: "aether-swap", name: "Aether Swap", type: CardType.Magic, cost: 1, targetRequired: false,
    abilities: [{ name: "Aether Swap", trigger: AbilityTrigger.OnSummon,
      effects: [{ type: EffectType.ReturnToHand, target: AbilityTarget.AllAllies, value: 1 }] }]
  } as MagicCard, "assets/images/cards_magic_aether-swap.png", "1846483789630405"),

  defineCard("cleansing-downpour", {
    id: "cleansing-downpour", name: "Cleansing Downpour", type: CardType.Magic, cost: 2, targetRequired: false,
    abilities: [{ name: "Cleansing Downpour", trigger: AbilityTrigger.OnSummon,
      effects: [{ type: EffectType.DrawCards, target: AbilityTarget.Player, value: 1 }] }]
  } as MagicCard, "assets/images/cards_magic_cleansing-downpour.png", "710755475386192"),

  defineCard("elemental-burst", {
    id: "elemental-burst", name: "Elemental Burst", type: CardType.Magic, cost: 3, targetRequired: false,
    abilities: [{ name: "Elemental Burst", trigger: AbilityTrigger.OnSummon,
      effects: [{ type: EffectType.DealDamage, target: AbilityTarget.AllEnemies, value: 2 }] }]
  } as MagicCard, "assets/images/cards_magic_elemental-burst.png", "1585232092889726"),

  defineCard("lightning-strike", {
    id: "lightning-strike", name: "Lightning Strike", type: CardType.Magic, cost: 2, targetRequired: false,
    abilities: [{ name: "Lightning Strike", trigger: AbilityTrigger.OnSummon,
      effects: [{ type: EffectType.DealDamage, target: AbilityTarget.LowestHealthEnemy, value: 5, piercing: true }] }]
  } as MagicCard, "assets/images/cards_magic_lightning-strike.png", "1155953239812167"),

  defineCard("nectar-block", {
    id: "nectar-block", name: "Energy Block", type: CardType.Magic, cost: 0, targetRequired: false,
    abilities: [{ name: "Energy Block", trigger: AbilityTrigger.OnSummon,
      effects: [{ type: EffectType.GainResource, target: AbilityTarget.Player, resource: ResourceType.Energy, value: 2, duration: EffectDuration.ThisTurn }] }]
  } as MagicCard, "assets/images/cards_magic_energy-block.png", "1092559439363693"),

  defineCard("nectar-drain", {
    id: "nectar-drain", name: "Energy Drain", type: CardType.Magic, cost: 1, targetRequired: false,
    abilities: [{ name: "Energy Drain", trigger: AbilityTrigger.OnSummon,
      effects: [
        { type: EffectType.GainResource, target: AbilityTarget.Player, resource: ResourceType.Energy, value: 2, duration: EffectDuration.ThisTurn },
        { type: EffectType.DrawCards, target: AbilityTarget.Player, value: 1 }
      ] }]
  } as MagicCard, "assets/images/cards_magic_energy-drain.png", "1754732031852523"),

  defineCard("nectar-surge", {
    id: "nectar-surge", name: "Energy Surge", type: CardType.Magic, cost: 1, targetRequired: false,
    abilities: [{ name: "Energy Surge", trigger: AbilityTrigger.OnSummon,
      effects: [
        { type: EffectType.GainResource, target: AbilityTarget.Player, resource: ResourceType.Energy, value: 3, duration: EffectDuration.ThisTurn },
        { type: EffectType.DrawCards, target: AbilityTarget.Player, value: 1 }
      ] }]
  } as MagicCard, "assets/images/cards_magic_energy-surge.png", "1379310950488534"),

  defineCard("overgrowth", {
    id: "overgrowth", name: "Overgrowth", type: CardType.Magic, cost: 3, targetRequired: false,
    abilities: [{ name: "Overgrowth", trigger: AbilityTrigger.OnSummon,
      effects: [{ type: EffectType.ModifyStats, target: AbilityTarget.AllAllies, stat: StatType.Both, value: 2, duration: EffectDuration.Permanent }] }]
  } as MagicCard, "assets/images/cards_magic_overgrowth.png", "1489977038895297"),

  defineCard("power-up", {
    id: "power-up", name: "Power Up", type: CardType.Magic, cost: 2, targetRequired: false,
    abilities: [{ name: "Power Up", trigger: AbilityTrigger.OnSummon,
      effects: [{ type: EffectType.ModifyStats, target: AbilityTarget.RandomAlly, stat: StatType.Both, value: 3, duration: EffectDuration.Permanent }] }]
  } as MagicCard, "assets/images/cards_magic_power-up.png", "1140750044697552"),

  defineCard("purify", {
    id: "purify", name: "Purify", type: CardType.Magic, cost: 1, targetRequired: false,
    abilities: [{ name: "Purify", trigger: AbilityTrigger.OnSummon,
      effects: [{ type: EffectType.Heal, target: AbilityTarget.RandomAlly, value: 3 }] }]
  } as MagicCard, "assets/images/cards_magic_purify.png", "681285418362907"),
];

/**
 * Build the catalog manually since Magic cards don't have affinity
 */
export const magicAssets: AssetCatalog = {
  version: "1.0.0",
  category: CatalogCategory.Magic,
  description: "Magic cards and assets",
  data: magicCards.map((card) => ({
    id: card.id,
    type: AssetEntryType.Magic,
    cardType: "Magic",
    data: card.cardData,
    assets: [{
      type: AssetReferenceType.Image,
      ...(card.horizonAssetId ? { horizonAssetId: card.horizonAssetId } : {}),
      path: card.imagePath,
    }]
  }))
};
