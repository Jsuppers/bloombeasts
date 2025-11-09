/**
 * Water Affinity Assets - Refactored using catalogBuilder
 *
 * This file is now ~60% smaller thanks to the catalog builder utility.
 * Edit card definitions below, and the builder handles all the boilerplate.
 */

import type { AssetCatalog } from '../../AssetCatalogManager';
import { AssetReferenceType, AssetEntryType, UICategory, AffinityLowercase } from '../../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType, ConditionType, Comparison } from '../engine/types/abilities';
import { CardType, Affinity } from '../engine/types/core';
import { createCatalog, defineCard } from './catalogBuilder';
import type { BloomBeastCard, HabitatCard } from '../engine/types/core';

/**
 * Card definitions - Just the data, no boilerplate
 */
const waterCards = [
  defineCard(
    "aqua-pebble",
    {
      id: "aqua-pebble",
      name: "Aqua Pebble",
      type: CardType.Beast,
      affinity: Affinity.Water,
      cost: 1,
      baseAttack: 1,
      baseHealth: 4,
      abilities: [
        {
          name: "Tide Flow",
          trigger: AbilityTrigger.OnAllySummon,
          effects: [
            {
              type: EffectType.ModifyStats,
              target: AbilityTarget.Self,
              stat: StatType.Attack,
              value: 1,
              duration: EffectDuration.EndOfTurn,
              condition: {
                type: ConditionType.AffinityMatches,
                value: "Water"
              }
            }
          ]
        }
      ],
    } as BloomBeastCard,
    "assets/images/cards_water_aqua-pebble.png",
    "2542562209453452"
  ),

  defineCard(
    "bubblefin",
    {
      id: "bubblefin",
      name: "Bubblefin",
      type: CardType.Beast,
      affinity: Affinity.Water,
      cost: 2,
      baseAttack: 2,
      baseHealth: 5,
      abilities: [
        {
          name: "Emerge",
          trigger: AbilityTrigger.WhileOnField,
          effects: [
            {
              type: EffectType.CannotBeTargeted,
              target: AbilityTarget.Self,
              by: [
                "trap"
              ]
            }
          ]
        }
      ],
    } as BloomBeastCard,
    "assets/images/cards_water_bubblefin.png",
    "2957682524429594"
  ),

  defineCard(
    "dewdrop-drake",
    {
      id: "dewdrop-drake",
      name: "Dewdrop Drake",
      type: CardType.Beast,
      affinity: Affinity.Water,
      cost: 3,
      baseAttack: 3,
      baseHealth: 6,
      abilities: [
        {
          name: "Mist Screen",
          trigger: AbilityTrigger.WhileOnField,
          effects: [
            {
              type: EffectType.AttackModification,
              target: AbilityTarget.Self,
              modification: "attack-first",
              condition: {
                type: ConditionType.UnitsOnField,
                value: 1,
                comparison: Comparison.Equal
              }
            }
          ]
        }
      ],
    } as BloomBeastCard,
    "assets/images/cards_water_dewdrop-drake.png",
    "1232407695362881"
  ),

  defineCard(
    "kelp-cub",
    {
      id: "kelp-cub",
      name: "Kelp Cub",
      type: CardType.Beast,
      affinity: Affinity.Water,
      cost: 2,
      baseAttack: 3,
      baseHealth: 3,
      abilities: [
        {
          name: "Entangle",
          trigger: AbilityTrigger.OnAttack,
          effects: [
            {
              type: EffectType.PreventAttack,
              target: AbilityTarget.AttackedEnemy,
              duration: EffectDuration.StartOfNextTurn
            }
          ]
        }
      ],
    } as BloomBeastCard,
    "assets/images/cards_water_kelp-cub.png",
    "2278603722605464"
  ),
];

/**
 * Build the catalog from cards using the builder
 * This eliminates ~100 lines of boilerplate!
 */
const waterCatalog = createCatalog(Affinity.Water, waterCards);

/**
 * Add special assets (Habitat with multiple images, UI elements)
 * These don't fit the simple card pattern, so we add them manually
 */
export const waterAssets: AssetCatalog = {
  ...waterCatalog,
  data: [
    ...waterCatalog.data,

    // Habitat card with multiple asset images
    {
      id: "deep-sea-grotto",
      type: AssetEntryType.Habitat,
      affinity: AffinityLowercase.Water,
      data: {
        id: "deep-sea-grotto",
        name: "Deep Sea Grotto",
        type: CardType.Habitat,
        affinity: Affinity.Water,
        cost: 1,
        abilities: [
          {
            name: "Aquatic Empowerment",
            trigger: AbilityTrigger.WhileOnField,
            effects: [
              {
                type: EffectType.ModifyStats,
                target: AbilityTarget.AllAllies,
                stat: StatType.Attack,
                value: 1,
                duration: EffectDuration.WhileOnField,
                condition: {
                  type: ConditionType.AffinityMatches,
                  value: "Water"
                }
              }
            ]
          }
        ]
      } as HabitatCard,
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "594002380404766",
          path: "assets/images/cards_water_deep-sea-grotto.png"
        },
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1356075539231203",
          path: "assets/images/cards_water_habitat-card.png"
        },
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "805465575687502",
          path: "assets/images/cards_water_habitat-card-playboard.png"
        }
      ]
    },

    // UI Assets
    {
      id: "water-mission",
      type: AssetEntryType.Mission,
      affinity: AffinityLowercase.Water,
      name: "Water Mission",
      description: "Water affinity mission",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1204438218330106",
          path: "assets/images/cards_water_water-mission.png"
        }
      ]
    },
    {
      id: "water-chest-closed",
      type: AssetEntryType.UI,
      category: UICategory.Chest,
      name: "Water Chest Closed",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1502977104283894",
          path: "assets/images/chest_water-chest-closed.png"
        }
      ]
    },
    {
      id: "water-chest-opened",
      type: AssetEntryType.UI,
      category: UICategory.Chest,
      name: "Water Chest Opened",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "817919940747617",
          path: "assets/images/chest_water-chest-opened.png"
        }
      ]
    },
    {
      id: "water-icon",
      type: AssetEntryType.UI,
      category: UICategory.Icon,
      name: "Water Icon",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "803389222302576",
          path: "assets/images/affinity_water-icon.png"
        }
      ]
    },
    {
      id: "water-habitat",
      type: AssetEntryType.UI,
      category: UICategory.CardTemplate,
      name: "Water Habitat Card Template",
      description: "Template overlay for water habitat cards",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1356075539231203",
          path: "assets/images/cards_water_habitat-card.png"
        }
      ]
    }
  ]
};
