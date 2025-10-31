/**
 * Edit this file directly to add/modify assets
 */

import type { AssetCatalog } from '../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType, ResourceType, ConditionType } from '../engine/types/abilities';

export const waterAssets: AssetCatalog = {
  version: "1.0.0",
  category: "water",
  description: "Water affinity cards and assets",
  data: [
    {
      id: "aqua-pebble",
      type: "beast",
      cardType: "Bloom",
      affinity: "water",
      data: {
        id: "aqua-pebble",
        name: "Aqua Pebble",
        type: "Bloom",
        affinity: "Water",
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
          type: "image",
          horizonAssetId: "2542562209453452",
          path: "assets/images/cards_water_aqua-pebble.png"
        }
      ]
    },
    {
      id: "bubblefin",
      type: "beast",
      cardType: "Bloom",
      affinity: "water",
      data: {
        id: "bubblefin",
        name: "Bubblefin",
        type: "Bloom",
        affinity: "Water",
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
          type: "image",
          horizonAssetId: "2957682524429594",
          path: "assets/images/cards_water_bubblefin.png"
        }
      ]
    },
    {
      id: "dewdrop-drake",
      type: "beast",
      cardType: "Bloom",
      affinity: "water",
      data: {
        id: "dewdrop-drake",
        name: "Dewdrop Drake",
        type: "Bloom",
        affinity: "Water",
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
          type: "image",
          horizonAssetId: "1232407695362881",
          path: "assets/images/cards_water_dewdrop-drake.png"
        }
      ]
    },
    {
      id: "kelp-cub",
      type: "beast",
      cardType: "Bloom",
      affinity: "water",
      data: {
        id: "kelp-cub",
        name: "Kelp Cub",
        type: "Bloom",
        affinity: "Water",
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
                target: AbilityTarget.Target,
                duration: "StartOfNextTurn"
              }
            ]
          }
        ],
      },
      assets: [
        {
          type: "image",
          horizonAssetId: "2278603722605464",
          path: "assets/images/cards_water_kelp-cub.png"
        }
      ]
    },
    {
      id: "deep-sea-grotto",
      type: "habitat",
      affinity: "water",
      data: {
        id: "deep-sea-grotto",
        name: "Deep Sea Grotto",
        type: "Habitat",
        affinity: "Water",
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
          type: "image",
          horizonAssetId: "594002380404766",
          path: "assets/images/cards_water_deep-sea-grotto.png"
        },
        {
          type: "image",
          horizonAssetId: "1356075539231203",
          path: "assets/images/cards_water_habitat-card.png"
        },
        {
          type: "image",
          horizonAssetId: "805465575687502",
          path: "assets/images/cards_water_habitat-card-playboard.png"
        }
      ]
    },
    {
      id: "water-mission",
      type: "mission",
      affinity: "water",
      name: "Water Mission",
      description: "Water affinity mission",
      assets: [
        {
          type: "image",
          horizonAssetId: "1204438218330106",
          path: "assets/images/cards_water_water-mission.png"
        }
      ]
    },
    {
      id: "water-chest-closed",
      type: "ui",
      category: "chest",
      name: "Water Chest Closed",
      assets: [
        {
          type: "image",
          horizonAssetId: "1502977104283894",
          path: "assets/images/chest_water-chest-closed.png"
        }
      ]
    },
    {
      id: "water-chest-opened",
      type: "ui",
      category: "chest",
      name: "Water Chest Opened",
      assets: [
        {
          type: "image",
          horizonAssetId: "817919940747617",
          path: "assets/images/chest_water-chest-opened.png"
        }
      ]
    },
    {
      id: "water-icon",
      type: "ui",
      category: "icon",
      name: "Water Icon",
      assets: [
        {
          type: "image",
          horizonAssetId: "803389222302576",
          path: "assets/images/affinity_water-icon.png"
        }
      ]
    },
    {
      id: "water-habitat",
      type: "ui",
      category: "card-template",
      name: "Water Habitat Card Template",
      description: "Template overlay for water habitat cards",
      assets: [
        {
          type: "image",
          horizonAssetId: "1356075539231203",
          path: "assets/images/cards_water_habitat-card.png"
        }
      ]
    }
  ]
};
