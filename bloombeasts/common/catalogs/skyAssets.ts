/**
 * Edit this file directly to add/modify assets
 */

import type { AssetCatalog } from '../../AssetCatalogManager';
import { AssetReferenceType, AssetEntryType, UICategory, CatalogCategory, AffinityLowercase } from '../../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType, ResourceType, ConditionType } from '../engine/types/abilities';
import { CardType, Affinity } from '../engine/types/core';

export const skyAssets: AssetCatalog = {
  version: "1.0.0",
  category: CatalogCategory.Sky,
  description: "Sky affinity cards and assets",
  data: [
    {
      id: "aero-moth",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Sky,
      data: {
        id: "aero-moth",
        name: "Aero Moth",
        type: CardType.Beast,
        affinity: Affinity.Sky,
        cost: 2,
        baseAttack: 3,
        baseHealth: 3,
        abilities: [
          {
            name: "Wing Flutter",
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
          horizonAssetId: "1857788838498496",
          path: "assets/images/cards_sky_aero-moth.png"
        }
      ]
    },
    {
      id: "cirrus-floof",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Sky,
      data: {
        id: "cirrus-floof",
        name: "Cirrus Floof",
        type: CardType.Beast,
        affinity: Affinity.Sky,
        cost: 2,
        baseAttack: 1,
        baseHealth: 6,
        abilities: [
          {
            name: "Lightness",
            trigger: AbilityTrigger.WhileOnField,
            effects: [
              {
                type: EffectType.CannotBeTargeted,
                target: AbilityTarget.Self,
                by: [
                  "high-cost-units"
                ],
                costThreshold: 3
              }
            ]
          }
        ],
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "849446287592530",
          path: "assets/images/cards_sky_cirrus-floof.png"
        }
      ]
    },
    {
      id: "gale-glider",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Sky,
      data: {
        id: "gale-glider",
        name: "Gale Glider",
        type: CardType.Beast,
        affinity: Affinity.Sky,
        cost: 1,
        baseAttack: 2,
        baseHealth: 2,
        abilities: [
          {
            name: "First Wind",
            trigger: AbilityTrigger.WhileOnField,
            effects: [
              {
                type: EffectType.AttackModification,
                target: AbilityTarget.Self,
                modification: "attack-first"
              }
            ]
          }
        ],
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1854780382097596",
          path: "assets/images/cards_sky_gale-glider.png"
        }
      ]
    },
    {
      id: "star-bloom",
      type: AssetEntryType.Beast,
      cardType: "Beast",
      affinity: AffinityLowercase.Sky,
      data: {
        id: "star-bloom",
        name: "Star Bloom",
        type: CardType.Beast,
        affinity: Affinity.Sky,
        cost: 3,
        baseAttack: 4,
        baseHealth: 5,
        abilities: [
          {
            name: "Aura",
            trigger: AbilityTrigger.WhileOnField,
            effects: [
              {
                type: EffectType.ModifyStats,
                target: AbilityTarget.AllAllies,
                stat: StatType.Attack,
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
          horizonAssetId: "737222956003560",
          path: "assets/images/cards_sky_star-bloom.png"
        }
      ]
    },
    {
      id: "clear-zenith",
      type: AssetEntryType.Habitat,
      affinity: AffinityLowercase.Sky,
      data: {
        id: "clear-zenith",
        name: "Clear Zenith",
        type: CardType.Habitat,
        affinity: Affinity.Sky,
        cost: 1,
        titleColor: "#000000",
        abilities: [
          {
            name: "Sky Vision",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.DrawCards,
                target: AbilityTarget.Player,
                value: 1
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1941325056416004",
          path: "assets/images/cards_sky_clear-zenith.png"
        },
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "724533667339482",
          path: "assets/images/cards_sky_habitat-card.png"
        },
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "674037762415336",
          path: "assets/images/cards_sky_habitat-card-playboard.png"
        }
      ]
    },
    {
      id: "sky-mission",
      type: AssetEntryType.Mission,
      affinity: AffinityLowercase.Sky,
      name: "Sky Mission",
      description: "Sky affinity mission",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1076415204381099",
          path: "assets/images/cards_sky_sky-mission.png"
        }
      ]
    },
    {
      id: "sky-chest-closed",
      type: AssetEntryType.UI,
      category: UICategory.Chest,
      name: "Sky Chest Closed",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1988442925266143",
          path: "assets/images/chest_sky-chest-closed.png"
        }
      ]
    },
    {
      id: "sky-chest-opened",
      type: AssetEntryType.UI,
      category: UICategory.Chest,
      name: "Sky Chest Opened",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "766596743048030",
          path: "assets/images/chest_sky-chest-opened.png"
        }
      ]
    },
    {
      id: "sky-icon",
      type: AssetEntryType.UI,
      category: UICategory.Icon,
      name: "Sky Icon",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "2078365889573892",
          path: "assets/images/affinity_sky-icon.png"
        }
      ]
    },
    {
      id: "sky-habitat",
      type: AssetEntryType.UI,
      category: UICategory.CardTemplate,
      name: "Sky Habitat Card Template",
      description: "Template overlay for sky habitat cards",
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "724533667339482",
          path: "assets/images/cards_sky_habitat-card.png"
        }
      ]
    }
  ]
};
