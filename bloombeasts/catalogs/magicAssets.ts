/**
 * Edit this file directly to add/modify assets
 */

import type { AssetCatalog } from '../AssetCatalogManager';
import { AssetReferenceType, AssetEntryType, UICategory, CatalogCategory, AffinityLowercase } from '../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType, ResourceType } from '../engine/types/abilities';
import { CardType } from '../engine/types/core';

export const magicAssets: AssetCatalog = {
  version: "1.0.0",
  category: CatalogCategory.Magic,
  description: "Magic cards and assets",
  data: [
    {
      id: "aether-swap",
      type: AssetEntryType.Magic,
      cardType: "Magic",
      data: {
        id: "aether-swap",
        name: "Aether Swap",
        type: CardType.Magic,
        cost: 1,
        targetRequired: false,
        abilities: [
          {
            name: "Aether Swap",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.ReturnToHand,
                target: AbilityTarget.AllAllies,
                value: 1
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1846483789630405",
          path: "assets/images/cards_magic_aether-swap.png"
        }
      ]
    },
    {
      id: "cleansing-downpour",
      type: AssetEntryType.Magic,
      cardType: "Magic",
      data: {
        id: "cleansing-downpour",
        name: "Cleansing Downpour",
        type: CardType.Magic,
        cost: 2,
        targetRequired: false,
        abilities: [
          {
            name: "Cleansing Downpour",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.DrawCards,
                target: "Player",
                value: 1
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "710755475386192",
          path: "assets/images/cards_magic_cleansing-downpour.png"
        }
      ]
    },
    {
      id: "elemental-burst",
      type: AssetEntryType.Magic,
      cardType: "Magic",
      data: {
        id: "elemental-burst",
        name: "Elemental Burst",
        type: CardType.Magic,
        cost: 3,
        targetRequired: false,
        abilities: [
          {
            name: "Elemental Burst",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.DealDamage,
                target: AbilityTarget.AllEnemies,
                value: 2
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1585232092889726",
          path: "assets/images/cards_magic_elemental-burst.png"
        }
      ]
    },
    {
      id: "lightning-strike",
      type: AssetEntryType.Magic,
      cardType: "Magic",
      data: {
        id: "lightning-strike",
        name: "Lightning Strike",
        type: CardType.Magic,
        cost: 2,
        targetRequired: false,
        abilities: [
          {
            name: "Lightning Strike",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.DealDamage,
                target: AbilityTarget.LowestHealthEnemy,
                value: 5,
                piercing: true
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1155953239812167",
          path: "assets/images/cards_magic_lightning-strike.png"
        }
      ]
    },
    {
      id: "nectar-block",
      type: AssetEntryType.Magic,
      cardType: "Magic",
      data: {
        id: "nectar-block",
        name: "Energy Block",
        type: CardType.Magic,
        cost: 0,
        targetRequired: false,
        abilities: [
          {
            name: "Energy Block",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.GainResource,
                target: "Player",
                resource: ResourceType.Energy,
                value: 2,
                duration: EffectDuration.ThisTurn
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1092559439363693",
          path: "assets/images/cards_magic_energy-block.png"
        }
      ]
    },
    {
      id: "nectar-drain",
      type: AssetEntryType.Magic,
      cardType: "Magic",
      data: {
        id: "nectar-drain",
        name: "Energy Drain",
        type: CardType.Magic,
        cost: 1,
        targetRequired: false,
        abilities: [
          {
            name: "Energy Drain",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.GainResource,
                target: "Player",
                resource: ResourceType.Energy,
                value: 2,
                duration: EffectDuration.ThisTurn
              },
              {
                type: EffectType.DrawCards,
                target: "Player",
                value: 1
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1754732031852523",
          path: "assets/images/cards_magic_energy-drain.png"
        }
      ]
    },
    {
      id: "nectar-surge",
      type: AssetEntryType.Magic,
      cardType: "Magic",
      data: {
        id: "nectar-surge",
        name: "Energy Surge",
        type: CardType.Magic,
        cost: 1,
        targetRequired: false,
        abilities: [
          {
            name: "Energy Surge",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.GainResource,
                target: "Player",
                resource: ResourceType.Energy,
                value: 3,
                duration: EffectDuration.ThisTurn
              },
              {
                type: EffectType.DrawCards,
                target: "Player",
                value: 1
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1379310950488534",
          path: "assets/images/cards_magic_energy-surge.png"
        }
      ]
    },
    {
      id: "overgrowth",
      type: AssetEntryType.Magic,
      cardType: "Magic",
      data: {
        id: "overgrowth",
        name: "Overgrowth",
        type: CardType.Magic,
        cost: 3,
        targetRequired: false,
        abilities: [
          {
            name: "Overgrowth",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.ModifyStats,
                target: AbilityTarget.AllAllies,
                stat: StatType.Both,
                value: 2,
                duration: EffectDuration.Permanent
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1489977038895297",
          path: "assets/images/cards_magic_overgrowth.png"
        }
      ]
    },
    {
      id: "power-up",
      type: AssetEntryType.Magic,
      cardType: "Magic",
      data: {
        id: "power-up",
        name: "Power Up",
        type: CardType.Magic,
        cost: 2,
        targetRequired: false,
        abilities: [
          {
            name: "Power Up",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.ModifyStats,
                target: AbilityTarget.RandomAlly,
                stat: StatType.Both,
                value: 3,
                duration: EffectDuration.Permanent
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1140750044697552",
          path: "assets/images/cards_magic_power-up.png"
        }
      ]
    },
    {
      id: "purify",
      type: AssetEntryType.Magic,
      cardType: "Magic",
      data: {
        id: "purify",
        name: "Purify",
        type: CardType.Magic,
        cost: 1,
        targetRequired: false,
        abilities: [
          {
            name: "Purify",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.Heal,
                target: AbilityTarget.RandomAlly,
                value: 3
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "681285418362907",
          path: "assets/images/cards_magic_purify.png"
        }
      ]
    }
  ]
};
