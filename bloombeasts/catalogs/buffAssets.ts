/**
 * Buff Assets Catalog
 * Source of truth for buff cards and assets
 * Edit this file directly to add/modify assets
 */

import type { AssetCatalog } from '../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType, ResourceType } from '../engine/types/abilities';

export const buffAssets: AssetCatalog = {
  version: "1.0.0",
  category: "buff",
  description: "Buff cards and assets",
  data: [
    {
      id: "battle-fury",
      type: "buff",
      cardType: "Buff",
      data: {
        id: "battle-fury",
        name: "Battle Fury",
        type: "Buff",
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
          type: "image",
          horizonAssetId: "1514404306279605",
          path: "assets/images/cards_buff_battle-fury.png"
        }
      ]
    },
    {
      id: "mystic-shield",
      type: "buff",
      cardType: "Buff",
      data: {
        id: "mystic-shield",
        name: "Mystic Shield",
        type: "Buff",
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
          type: "image",
          horizonAssetId: "787965707330770",
          path: "assets/images/cards_buff_mystic-shield.png"
        }
      ]
    },
    {
      id: "natures-blessing",
      type: "buff",
      cardType: "Buff",
      affinity: "forest",
      data: {
        id: "natures-blessing",
        name: "Nature's Blessing",
        type: "Buff",
        affinity: "Forest",
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
          type: "image",
          horizonAssetId: "4100038783597004",
          path: "assets/images/cards_buff_natures-blessing.png"
        }
      ]
    },
    {
      id: "swift-wind",
      type: "buff",
      cardType: "Buff",
      affinity: "sky",
      data: {
        id: "swift-wind",
        name: "Swift Wind",
        type: "Buff",
        affinity: "Sky",
        cost: 2,
        abilities: [
          {
            name: "Swift Wind",
            trigger: AbilityTrigger.OnOwnStartOfTurn,
            effects: [
              {
                type: EffectType.GainResource,
                target: AbilityTarget.PlayerGardener,
                resource: ResourceType.Nectar,
                value: 1
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: "image",
          horizonAssetId: "657351040536713",
          path: "assets/images/cards_buff_swift-wind.png"
        }
      ]
    }
  ]
};
