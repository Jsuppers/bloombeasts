/**
 * Boss Assets Catalog - Refactored using catalogBuilder
 *
 * This file uses the catalog builder utility to eliminate boilerplate.
 * Edit card definitions below, and the builder handles all the wrapper structure.
 */

import type { AssetCatalog } from '../../AssetCatalogManager';
import { AssetReferenceType, AssetEntryType, UICategory, AffinityLowercase } from '../../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType } from '../engine/types/abilities';
import { CardType, Affinity } from '../engine/types/core';
import { createCatalog, defineCard } from './catalogBuilder';
import type { BloomBeastCard } from '../engine/types/core';

/**
 * Boss card definitions
 */
const bossCards = [
  defineCard(
    "cluck-norris",
    {
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
    } as BloomBeastCard,
    "assets/images/cards_boss_cluck-norris.png",
    "1358389912362012"
  ),
];

/**
 * Build the catalog from cards using the builder
 */
const bossCatalog = createCatalog(Affinity.Boss, bossCards);

/**
 * Add UI assets
 */
export const bossAssets: AssetCatalog = {
  ...bossCatalog,
  data: [
    ...bossCatalog.data,

    // UI Assets
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
