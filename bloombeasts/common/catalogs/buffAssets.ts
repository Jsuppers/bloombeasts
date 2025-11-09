/**
 * Buff Assets Catalog - Refactored using catalogBuilder
 *
 * This file uses the catalog builder utility to eliminate boilerplate.
 * Edit card definitions below, and the builder handles all the wrapper structure.
 */

import { CatalogCategory } from '../../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType, ResourceType } from '../engine/types/abilities';
import { CardType, Affinity } from '../engine/types/core';
import { defineCard, createNonAffinityCatalog } from './catalogBuilder';
import type { BuffCard } from '../engine/types/core';

/**
 * Buff card definitions
 */
const buffCards = [
  defineCard(
    "battle-fury",
    {
      id: "battle-fury",
      name: "Battle Fury",
      type: CardType.Buff,
      cost: 3,
      abilities: [
        {
          name: "Battle Fury",
          trigger: AbilityTrigger.WhileOnField,
          effects: [
            {
              type: EffectType.ModifyStats,
              target: AbilityTarget.AllAllies,
              stat: StatType.Attack,
              value: 2,
              duration: EffectDuration.WhileOnField
            }
          ]
        }
      ]
    } as BuffCard,
    "assets/images/cards_buff_battle-fury.png",
    "1514404306279605"
  ),

  defineCard(
    "mystic-shield",
    {
      id: "mystic-shield",
      name: "Mystic Shield",
      type: CardType.Buff,
      cost: 3,
      abilities: [
        {
          name: "Mystic Shield",
          trigger: AbilityTrigger.WhileOnField,
          effects: [
            {
              type: EffectType.ModifyStats,
              target: AbilityTarget.AllAllies,
              stat: StatType.Health,
              value: 2,
              duration: EffectDuration.WhileOnField
            }
          ]
        }
      ]
    } as BuffCard,
    "assets/images/cards_buff_mystic-shield.png",
    "787965707330770"
  ),

  defineCard(
    "natures-blessing",
    {
      id: "natures-blessing",
      name: "Nature's Blessing",
      type: CardType.Buff,
      affinity: Affinity.Forest,
      cost: 4,
      abilities: [
        {
          name: "Nature's Blessing",
          trigger: AbilityTrigger.OnOwnStartOfTurn,
          effects: [
            {
              type: EffectType.Heal,
              target: AbilityTarget.AllAllies,
              value: 1
            }
          ]
        }
      ]
    } as BuffCard,
    "assets/images/cards_buff_natures-blessing.png",
    "4100038783597004"
  ),

  defineCard(
    "swift-wind",
    {
      id: "swift-wind",
      name: "Swift Wind",
      type: CardType.Buff,
      affinity: Affinity.Sky,
      cost: 2,
      abilities: [
        {
          name: "Swift Wind",
          trigger: AbilityTrigger.OnOwnStartOfTurn,
          effects: [
            {
              type: EffectType.GainResource,
              target: AbilityTarget.Player,
              resource: ResourceType.Energy,
              value: 1
            }
          ]
        }
      ]
    } as BuffCard,
    "assets/images/cards_buff_swift-wind.png",
    "657351040536713"
  ),
];

/**
 * Build the catalog using the builder - eliminates boilerplate and affinity mapping duplication
 */
export const buffAssets = createNonAffinityCatalog(
  CatalogCategory.Buff,
  buffCards
);
