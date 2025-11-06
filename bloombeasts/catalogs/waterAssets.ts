/**
 * Edit this file directly to add/modify assets
 */

import type { AssetCatalog } from '../AssetCatalogManager';
import { AssetReferenceType, AssetEntryType, UICategory, CatalogCategory, AffinityLowercase } from '../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType, ResourceType, ConditionType } from '../engine/types/abilities';
import { CardType, Affinity } from '../engine/types/core';

export const waterAssets: AssetCatalog = {
  version: "1.0.0",
  category: CatalogCategory.Water,
  description: "Water affinity cards and assets",
  data: [
    {
      id: "aqua-pebble",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Water,
      data: {
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
            trigger: "OnAllySummon",
            effects: [
              {
                type: EffectType.ModifyStats,
                target: AbilityTarget.Self,
                stat: StatType.Attack,
                value: 1,
                duration: EffectDuration.EndOfTurn,
                condition: {
                  type: "AffinityMatches",
                  value: "Water"
                }
              }
            ]
          }
        ],
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "2542562209453452",
          path: "assets/images/cards_water_aqua-pebble.png"
        }
      ]
    },
    {
      id: "bubblefin",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Water,
      data: {
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
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "2957682524429594",
          path: "assets/images/cards_water_bubblefin.png"
        }
      ]
    },
    {
      id: "dewdrop-drake",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Water,
      data: {
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
                  type: "UnitsOnField",
                  value: 1,
                  comparison: "Equal"
                }
              }
            ]
          }
        ],
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1232407695362881",
          path: "assets/images/cards_water_dewdrop-drake.png"
        }
      ]
    },
    {
      id: "kelp-cub",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Water,
      data: {
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
                type: "PreventAttack",
                target: AbilityTarget.AttackedEnemy,
                duration: "StartOfNextTurn"
              }
            ]
          }
        ],
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "2278603722605464",
          path: "assets/images/cards_water_kelp-cub.png"
        }
      ]
    },
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
                  type: "AffinityMatches",
                  value: "Water"
                }
              }
            ]
          }
        ]
      },
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
