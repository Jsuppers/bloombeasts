/**
 * Edit this file directly to add/modify assets
 */

import type { AssetCatalog } from '../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType, ResourceType, ConditionType } from '../engine/types/abilities';

export const fireAssets: AssetCatalog = {
  version: "1.0.0",
  category: "fire",
  description: "Fire affinity cards and assets",
  data: [
    {
      id: "blazefinch",
      type: "beast",
      cardType: "Bloom",
      affinity: "fire",
      data: {
        id: "blazefinch",
        name: "Blazefinch",
        type: "Bloom",
        affinity: "Fire",
        cost: 1,
        baseAttack: 1,
        baseHealth: 2,
        abilities: [
          {
            name: "Quick Strike",
            trigger: AbilityTrigger.WhileOnField,
            effects: [
              {
                type: EffectType.RemoveSummoningSickness,
                target: AbilityTarget.Self
              }
            ]
          }
        ],
      },
      assets: [
        {
          type: "image",
          horizonAssetId: "3218250765004566",
          path: "assets/images/cards_fire_blazefinch.png"
        }
      ]
    },
    {
      id: "cinder-pup",
      type: "beast",
      cardType: "Bloom",
      affinity: "fire",
      data: {
        id: "cinder-pup",
        name: "Cinder Pup",
        type: "Bloom",
        affinity: "Fire",
        cost: 2,
        baseAttack: 2,
        baseHealth: 3,
        abilities: [
          {
            name: "Burning Passion",
            trigger: AbilityTrigger.OnAttack,
            effects: [
              {
                type: EffectType.DealDamage,
                target: AbilityTarget.Target,
                value: 1
              }
            ]
          }
        ],
      },
      assets: [
        {
          type: "image",
          horizonAssetId: "913214814369510",
          path: "assets/images/cards_fire_cinder-pup.png"
        }
      ]
    },
    {
      id: "charcoil",
      type: "beast",
      cardType: "Bloom",
      affinity: "fire",
      data: {
        id: "charcoil",
        name: "Charcoil",
        type: "Bloom",
        affinity: "Fire",
        cost: 2,
        baseAttack: 3,
        baseHealth: 4,
        abilities: [
          {
            name: "Flame Retaliation",
            trigger: AbilityTrigger.OnDamage,
            effects: [
              {
                type: "Retaliation",
                target: AbilityTarget.Attacker,
                value: 1
              }
            ]
          }
        ],
      },
      assets: [
        {
          type: "image",
          horizonAssetId: "785856391096811",
          path: "assets/images/cards_fire_charcoil.png"
        }
      ]
    },
    {
      id: "magmite",
      type: "beast",
      cardType: "Bloom",
      affinity: "fire",
      data: {
        id: "magmite",
        name: "Magmite",
        type: "Bloom",
        affinity: "Fire",
        cost: 3,
        baseAttack: 4,
        baseHealth: 6,
        abilities: [
          {
            name: "Hardened Shell",
            trigger: AbilityTrigger.WhileOnField,
            effects: [
              {
                type: EffectType.DamageReduction,
                target: AbilityTarget.Self,
                value: 1,
                duration: EffectDuration.WhileOnField
              }
            ]
          }
        ],
      },
      assets: [
        {
          type: "image",
          horizonAssetId: "25339017082348952",
          path: "assets/images/cards_fire_magmite.png"
        }
      ]
    },
    {
      id: "volcanic-scar",
      type: "habitat",
      affinity: "fire",
      data: {
        id: "volcanic-scar",
        name: "Volcanic Scar",
        type: "Habitat",
        affinity: "Fire",
        cost: 1,
        abilities: [
          {
            name: "Volcanic Eruption",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.DealDamage,
                target: "AllUnits",
                value: 1,
                condition: {
                  type: "affinity-not-matches",
                  value: "Fire"
                }
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: "image",
          horizonAssetId: "1878791053043603",
          path: "assets/images/cards_fire_volcanic-scar.png"
        },
        {
          type: "image",
          horizonAssetId: "1574158663591082",
          path: "assets/images/cards_fire_habitat-card.png"
        },
        {
          type: "image",
          horizonAssetId: "1863280224222620",
          path: "assets/images/cards_fire_habitat-card-playboard.png"
        }
      ]
    },
    {
      id: "fire-mission",
      type: "mission",
      affinity: "fire",
      name: "Fire Mission",
      description: "Fire affinity mission",
      assets: [
        {
          type: "image",
          horizonAssetId: "795064546836933",
          path: "assets/images/cards_fire_fire-mission.png"
        }
      ]
    },
    {
      id: "fire-chest-closed",
      type: "ui",
      category: "chest",
      name: "Fire Chest Closed",
      assets: [
        {
          type: "image",
          horizonAssetId: "1168387145201364",
          path: "assets/images/chest_fire-chest-closed.png"
        }
      ]
    },
    {
      id: "fire-chest-opened",
      type: "ui",
      category: "chest",
      name: "Fire Chest Opened",
      assets: [
        {
          type: "image",
          horizonAssetId: "3716217982005558",
          path: "assets/images/chest_fire-chest-opened.png"
        }
      ]
    },
    {
      id: "fire-icon",
      type: "ui",
      category: "icon",
      name: "Fire Icon",
      assets: [
        {
          type: "image",
          horizonAssetId: "2011015256402906",
          path: "assets/images/affinity_fire-icon.png"
        }
      ]
    },
    {
      id: "fire-habitat",
      type: "ui",
      category: "card-template",
      name: "Fire Habitat Card Template",
      description: "Template overlay for fire habitat cards",
      assets: [
        {
          type: "image",
          horizonAssetId: "1574158663591082",
          path: "assets/images/cards_fire_habitat-card.png"
        }
      ]
    }
  ]
};
