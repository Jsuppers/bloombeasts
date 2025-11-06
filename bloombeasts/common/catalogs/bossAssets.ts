/**
 * Boss Assets Catalog
 * Source of truth for boss cards and assets
 * Edit this file directly to add/modify boss assets
 */

import type { AssetCatalog } from '../../AssetCatalogManager';
import { AssetReferenceType, AssetEntryType, UICategory, CatalogCategory, AffinityLowercase } from '../../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType } from '../engine/types/abilities';
import { CardType, Affinity } from '../engine/types/core';

export const bossAssets: AssetCatalog = {
  version: "1.0.0",
  category: CatalogCategory.Boss,
  description: "Boss cards and assets",
  data: [
    {
      id: "cluck-norris",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Boss,
      data: {
        id: "cluck-norris",
        name: "Cluck Norris",
        type: CardType.Beast,
        affinity: Affinity.Boss,
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
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1358389912362012",
          path: "assets/images/cards_boss_cluck-norris.png"
        }
      ]
    },
    {
      id: "boss-icon",
      type: AssetEntryType.UI,
      category: UICategory.Icon,
      name: "Boss Icon",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "808398125136052",
          path: "assets/images/affinity_boss-icon.png"
        }
      ]
    },
    {
      id: "boss-mission",
      type: AssetEntryType.Mission,
      affinity: AffinityLowercase.Boss,
      name: "Cluck Norris",
      description: "Boss mission",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1358389912362012",
          path: "assets/images/cards_boss-mission.png"
        }
      ]
    }
  ]
};
