/**
 * Edit this file directly to add/modify assets
 */

import type { AssetCatalog } from '../AssetCatalogManager';
import { AssetReferenceType, AssetEntryType, UICategory, CatalogCategory, AffinityLowercase } from '../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType, ResourceType, ConditionType } from '../engine/types/abilities';
import { CardType, Affinity } from '../engine/types/core';

export const forestAssets: AssetCatalog = {
  version: "1.0.0",
  category: CatalogCategory.Forest,
  description: "Forest affinity cards and assets",
  data: [
    {
      id: "rootling",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Forest,
      data: {
        id: "rootling",
        name: "Rootling",
        displayName: "Rootling",
        type: CardType.Beast,
        affinity: Affinity.Forest,
        cost: 1,
        baseAttack: 1,
        baseHealth: 3,
        abilities: [
          {
            name: "Deep Roots",
            trigger: AbilityTrigger.WhileOnField,
            effects: [
              {
                type: EffectType.CannotBeTargeted,
                target: AbilityTarget.Self,
                by: [
                  "magic"
                ]
              }
            ]
          }
        ],
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1170317305016635",
          path: "assets/images/cards_forest_rootling.png",
          description: "Rootling card artwork"
        }
      ]
    },
    {
      id: "leaf-sprite",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Forest,
      data: {
        id: "leaf-sprite",
        name: "Leaf Sprite",
        displayName: "Leaf Sprite",
        type: CardType.Beast,
        affinity: Affinity.Forest,
        cost: 1,
        baseAttack: 1,
        baseHealth: 2,
        abilities: [
          {
            name: "Nimble",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.DrawCards,
                target: AbilityTarget.Player,
                value: 1
              }
            ]
          }
        ],
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1733091247346351",
          path: "assets/images/cards_forest_leaf-sprite.png",
          description: "Leaf Sprite card artwork"
        }
      ]
    },
    {
      id: "mosslet",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Forest,
      data: {
        id: "mosslet",
        name: "Mosslet",
        displayName: "Mosslet",
        type: CardType.Beast,
        affinity: Affinity.Forest,
        cost: 2,
        baseAttack: 2,
        baseHealth: 2,
        abilities: [
          {
            name: "Growth",
            trigger: AbilityTrigger.OnOwnEndOfTurn,
            effects: [
              {
                type: EffectType.ModifyStats,
                target: AbilityTarget.Self,
                stat: StatType.Both,
                value: 1,
                duration: EffectDuration.Permanent
              }
            ]
          }
        ],
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1344114090714721",
          path: "assets/images/cards_forest_mosslet.png",
          description: "Mosslet card artwork"
        }
      ]
    },
    {
      id: "mushroomancer",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Forest,
      data: {
        id: "mushroomancer",
        name: "Mushroomancer",
        displayName: "Mushroomancer",
        type: CardType.Beast,
        affinity: Affinity.Forest,
        cost: 3,
        baseAttack: 3,
        baseHealth: 4,
        abilities: [
          {
            name: "Sporogenesis",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.DealDamage,
                target: AbilityTarget.AllEnemies,
                value: 2
              }
            ]
          }
        ],
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1393693032328550",
          path: "assets/images/cards_forest_mushroomancer.png",
          description: "Mushroomancer card artwork"
        }
      ]
    },
    {
      id: "ancient-forest",
      type: AssetEntryType.Habitat,
      affinity: AffinityLowercase.Forest,
      data: {
        id: "ancient-forest",
        name: "Ancient Forest",
        displayName: "Ancient Forest",
        type: CardType.Habitat,
        affinity: Affinity.Forest,
        cost: 0,
        abilities: [
          {
            name: "Forest Sanctuary",
            trigger: AbilityTrigger.WhileOnField,
            effects: [
              {
                type: EffectType.ModifyStats,
                target: AbilityTarget.AllAllies,
                stat: StatType.Health,
                value: 1,
                duration: EffectDuration.WhileOnField
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1625867191715184",
          path: "assets/images/cards_forest_ancient-forest.png",
          description: "Ancient Forest habitat card artwork"
        },
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "715084184317947",
          path: "assets/images/cards_forest_habitat-card.png",
          description: "Forest habitat card template"
        },
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "805969505504149",
          path: "assets/images/cards_forest_habitat-card-playboard.png",
          description: "Forest habitat card playboard"
        }
      ]
    },
    {
      id: "forest-mission",
      type: AssetEntryType.Mission,
      affinity: AffinityLowercase.Forest,
      name: "Forest Mission",
      description: "Forest affinity mission",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1351984712974001",
          path: "assets/images/cards_forest_forest-mission.png",
          description: "Forest mission card"
        }
      ]
    },
    {
      id: "forest-chest-closed",
      type: AssetEntryType.UI,
      category: UICategory.Chest,
      name: "Forest Chest Closed",
      description: "Forest chest in closed state",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "678586941962889",
          path: "assets/images/chest_forest-chest-closed.png"
        }
      ]
    },
    {
      id: "forest-chest-opened",
      type: AssetEntryType.UI,
      category: UICategory.Chest,
      name: "Forest Chest Opened",
      description: "Forest chest in opened state",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1859963367965524",
          path: "assets/images/chest_forest-chest-opened.png"
        }
      ]
    },
    {
      id: "forest-icon",
      type: AssetEntryType.UI,
      category: UICategory.Icon,
      name: "Forest Icon",
      description: "Forest affinity icon",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1869425844004279",
          path: "assets/images/affinity_forest-icon.png"
        }
      ]
    },
    {
      id: "forest-habitat",
      type: AssetEntryType.UI,
      category: UICategory.CardTemplate,
      name: "Forest Habitat Card Template",
      description: "Template overlay for forest habitat cards",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "715084184317947",
          path: "assets/images/cards_forest_habitat-card.png"
        }
      ]
    }
  ]
};
