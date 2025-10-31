/**
 * Boss Assets Catalog
 * Source of truth for boss cards and assets
 * Edit this file directly to add/modify boss assets
 */

import type { AssetCatalog } from '../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType } from '../engine/types/abilities';

export const bossAssets: AssetCatalog = {
  version: "1.0.0",
  category: "boss",
  description: "Boss cards and assets",
  data: [
    {
      id: "cluck-norris",
      type: "beast",
      cardType: "Bloom",
      affinity: "boss",
      data: {
        id: "cluck-norris",
        name: "Cluck Norris",
        type: "Bloom",
        affinity: "Boss",
        cost: 0,
        baseAttack: 99,
        baseHealth: 99,
        abilities: [
          {
            name: "Legendary Rooster",
            trigger: AbilityTrigger.WhileOnField,
            effects: [
              {
                type: EffectType.ModifyStats,
                target: AbilityTarget.Self,
                stat: StatType.Attack,
                value: 10,
                duration: EffectDuration.WhileOnField
              },
              {
                type: EffectType.ModifyStats,
                target: AbilityTarget.Self,
                stat: StatType.Health,
                value: 10,
                duration: EffectDuration.WhileOnField
              }
            ]
          }
        ],
        levelingConfig: {
          statGains: {
            "1": { hp: 0, atk: 0 },
            "2": { hp: 0, atk: 0 },
            "3": { hp: 0, atk: 0 },
            "4": { hp: 0, atk: 0 },
            "5": { hp: 0, atk: 0 },
            "6": { hp: 0, atk: 0 },
            "7": { hp: 0, atk: 0 },
            "8": { hp: 0, atk: 0 },
            "9": { hp: 0, atk: 0 }
          },
          abilityUpgrades: {}
        }
      },
      assets: [
        {
          type: "image",
          horizonAssetId: "1358389912362012",
          path: "assets/images/cards_boss_cluck-norris.png"
        }
      ]
    },
    {
      id: "boss-icon",
      type: "ui",
      category: "icon",
      name: "Boss Icon",
      assets: [
        {
          type: "image",
          horizonAssetId: "808398125136052",
          path: "assets/images/affinity_boss-icon.png"
        }
      ]
    },
    {
      id: "boss-mission",
      type: "mission",
      affinity: "boss",
      name: "Cluck Norris",
      description: "Boss mission",
      assets: [
        {
          type: "image",
          horizonAssetId: "1358389912362012",
          path: "assets/images/cards_boss-mission.png"
        }
      ]
    }
  ]
};
