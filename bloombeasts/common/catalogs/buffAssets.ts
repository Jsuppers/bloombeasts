/**
 * Buff Assets Catalog - Refactored using catalogBuilder
 *
 * This file uses the catalog builder utility to eliminate boilerplate.
 * Edit card definitions below, and the builder handles all the wrapper structure.
 */

import type { AssetCatalog } from '../../AssetCatalogManager';
import { CatalogCategory, AffinityLowercase } from '../../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType, ResourceType } from '../engine/types/abilities';
import { CardType, Affinity } from '../engine/types/core';
import { defineCard } from './catalogBuilder';
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
 * Build the catalog manually since Buff cards don't have a single affinity
 */
export const buffAssets: AssetCatalog = {
  version: "1.0.0",
  category: CatalogCategory.Buff,
  description: "Buff cards and assets",
  data: buffCards.map((card) => {
    const cardData = card.cardData;
    const affinity = 'affinity' in cardData && cardData.affinity !== undefined
      ? (() => {
          // Map Affinity enum to AffinityLowercase enum
          const affinityMap: Partial<Record<Affinity, AffinityLowercase>> = {
            [Affinity.Fire]: AffinityLowercase.Fire,
            [Affinity.Water]: AffinityLowercase.Water,
            [Affinity.Forest]: AffinityLowercase.Forest,
            [Affinity.Sky]: AffinityLowercase.Sky,
            [Affinity.Boss]: AffinityLowercase.Boss,
          };
          return affinityMap[cardData.affinity as Affinity];
        })()
      : undefined;

    return {
      id: card.id,
      type: "buff" as any,
      cardType: "Buff",
      ...(affinity ? { affinity } : {}),
      data: cardData,
      assets: [
        {
          type: "image" as any,
          ...(card.horizonAssetId ? { horizonAssetId: card.horizonAssetId } : {}),
          path: card.imagePath,
        }
      ]
    };
  })
};
