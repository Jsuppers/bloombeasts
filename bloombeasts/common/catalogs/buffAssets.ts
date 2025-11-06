/**
 * Buff Assets Catalog
 * Source of truth for buff cards and assets
 * Edit this file directly to add/modify assets
 */

import type { AssetCatalog } from '../../AssetCatalogManager';
import { AssetReferenceType, AssetEntryType, UICategory, CatalogCategory, AffinityLowercase } from '../../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType, ResourceType } from '../engine/types/abilities';
import { CardType, Affinity } from '../engine/types/core';

export const buffAssets: AssetCatalog = {
  version: "1.0.0",
  category: CatalogCategory.Buff,
  description: "Buff cards and assets",
  data: [
    {
      id: "battle-fury",
      type: AssetEntryType.Buff,
      cardType: "Buff",
      data: {
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
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1514404306279605",
          path: "assets/images/cards_buff_battle-fury.png"
        }
      ]
    },
    {
      id: "mystic-shield",
      type: AssetEntryType.Buff,
      cardType: "Buff",
      data: {
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
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "787965707330770",
          path: "assets/images/cards_buff_mystic-shield.png"
        }
      ]
    },
    {
      id: "natures-blessing",
      type: AssetEntryType.Buff,
      cardType: "Buff",
      affinity: AffinityLowercase.Forest,
      data: {
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
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "4100038783597004",
          path: "assets/images/cards_buff_natures-blessing.png"
        }
      ]
    },
    {
      id: "swift-wind",
      type: AssetEntryType.Buff,
      cardType: "Buff",
      affinity: AffinityLowercase.Sky,
      data: {
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
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "657351040536713",
          path: "assets/images/cards_buff_swift-wind.png"
        }
      ]
    }
  ]
};
