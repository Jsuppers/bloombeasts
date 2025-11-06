/**
 * Edit this file directly to add/modify assets
 */

import type { AssetCatalog } from '../AssetCatalogManager';
import { AssetReferenceType, AssetEntryType, UICategory, CatalogCategory, AffinityLowercase } from '../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType, ResourceType, ConditionType } from '../engine/types/abilities';
import { CardType, Affinity } from '../engine/types/core';

export const fireAssets: AssetCatalog = {
  version: "1.0.0",
  category: CatalogCategory.Fire,
  description: "Fire affinity cards and assets",
  data: [
    {
      id: "blazefinch",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Fire,
      data: {
        id: "blazefinch",
        name: "Blazefinch",
        type: CardType.Beast,
        affinity: Affinity.Fire,
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
          type: AssetReferenceType.Image,
          horizonAssetId: "3218250765004566",
          path: "assets/images/cards_fire_blazefinch.png"
        }
      ]
    },
    {
      id: "cinder-pup",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Fire,
      data: {
        id: "cinder-pup",
        name: "Cinder Pup",
        type: CardType.Beast,
        affinity: Affinity.Fire,
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
                target: AbilityTarget.AttackedEnemy,
                value: 1
              }
            ]
          }
        ],
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "913214814369510",
          path: "assets/images/cards_fire_cinder-pup.png"
        }
      ]
    },
    {
      id: "charcoil",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Fire,
      data: {
        id: "charcoil",
        name: "Charcoil",
        type: CardType.Beast,
        affinity: Affinity.Fire,
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
          type: AssetReferenceType.Image,
          horizonAssetId: "785856391096811",
          path: "assets/images/cards_fire_charcoil.png"
        }
      ]
    },
    {
      id: "magmite",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Fire,
      data: {
        id: "magmite",
        name: "Magmite",
        type: CardType.Beast,
        affinity: Affinity.Fire,
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
          type: AssetReferenceType.Image,
          horizonAssetId: "25339017082348952",
          path: "assets/images/cards_fire_magmite.png"
        }
      ]
    },
    {
      id: "volcanic-scar",
      type: AssetEntryType.Habitat,
      affinity: AffinityLowercase.Fire,
      data: {
        id: "volcanic-scar",
        name: "Volcanic Scar",
        type: CardType.Habitat,
        affinity: Affinity.Fire,
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
          type: AssetReferenceType.Image,
          horizonAssetId: "1878791053043603",
          path: "assets/images/cards_fire_volcanic-scar.png"
        },
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1574158663591082",
          path: "assets/images/cards_fire_habitat-card.png"
        },
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1863280224222620",
          path: "assets/images/cards_fire_habitat-card-playboard.png"
        }
      ]
    },
    {
      id: "fire-mission",
      type: AssetEntryType.Mission,
      affinity: AffinityLowercase.Fire,
      name: "Fire Mission",
      description: "Fire affinity mission",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "795064546836933",
          path: "assets/images/cards_fire_fire-mission.png"
        }
      ]
    },
    {
      id: "fire-chest-closed",
      type: AssetEntryType.UI,
      category: UICategory.Chest,
      name: "Fire Chest Closed",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1168387145201364",
          path: "assets/images/chest_fire-chest-closed.png"
        }
      ]
    },
    {
      id: "fire-chest-opened",
      type: AssetEntryType.UI,
      category: UICategory.Chest,
      name: "Fire Chest Opened",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "3716217982005558",
          path: "assets/images/chest_fire-chest-opened.png"
        }
      ]
    },
    {
      id: "fire-icon",
      type: AssetEntryType.UI,
      category: UICategory.Icon,
      name: "Fire Icon",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "2011015256402906",
          path: "assets/images/affinity_fire-icon.png"
        }
      ]
    },
    {
      id: "fire-habitat",
      type: AssetEntryType.UI,
      category: UICategory.CardTemplate,
      name: "Fire Habitat Card Template",
      description: "Template overlay for fire habitat cards",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1574158663591082",
          path: "assets/images/cards_fire_habitat-card.png"
        }
      ]
    }
  ]
};
