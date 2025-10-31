/**
 * Edit this file directly to add/modify assets
 */

import type { AssetCatalog } from '../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType } from '../engine/types/abilities';

export const magicAssets: AssetCatalog = {
  version: "1.0.0",
  category: "magic",
  description: "Magic cards and assets",
  data: [
    {
      id: "aether-swap",
      type: "magic",
      cardType: "Magic",
      data: {
        id: "aether-swap",
        name: "Aether Swap",
        type: "Magic",
        cost: 1,
        targetRequired: true,
        abilities: [
          {
            name: "Aether Swap",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.SwapPositions,
                target: AbilityTarget.Target
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: "image",
          horizonAssetId: "1846483789630405",
          path: "assets/images/cards_magic_aether-swap.png"
        }
      ]
    },
    {
      id: "cleansing-downpour",
      type: "magic",
      cardType: "Magic",
      data: {
        id: "cleansing-downpour",
        name: "Cleansing Downpour",
        type: "Magic",
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
          type: "image",
          horizonAssetId: "710755475386192",
          path: "assets/images/cards_magic_cleansing-downpour.png"
        }
      ]
    },
    {
      id: "elemental-burst",
      type: "magic",
      cardType: "Magic",
      data: {
        id: "elemental-burst",
        name: "Elemental Burst",
        type: "Magic",
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
          type: "image",
          horizonAssetId: "1585232092889726",
          path: "assets/images/cards_magic_elemental-burst.png"
        }
      ]
    },
    {
      id: "lightning-strike",
      type: "magic",
      cardType: "Magic",
      data: {
        id: "lightning-strike",
        name: "Lightning Strike",
        type: "Magic",
        cost: 2,
        targetRequired: true,
        abilities: [
          {
            name: "Lightning Strike",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.DealDamage,
                target: AbilityTarget.Target,
                value: 5,
                piercing: true
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: "image",
          horizonAssetId: "1155953239812167",
          path: "assets/images/cards_magic_lightning-strike.png"
        }
      ]
    },
    {
      id: "nectar-block",
      type: "magic",
      cardType: "Magic",
      data: {
        id: "nectar-block",
        name: "Nectar Block",
        type: "Magic",
        cost: 0,
        targetRequired: false,
        abilities: [
          {
            name: "Nectar Block",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: "GainResource",
                target: "Player",
                resource: "Nectar",
                value: 2,
                duration: "ThisTurn"
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: "image",
          horizonAssetId: "1092559439363693",
          path: "assets/images/cards_magic_nectar-block.png"
        }
      ]
    },
    {
      id: "nectar-drain",
      type: "magic",
      cardType: "Magic",
      data: {
        id: "nectar-drain",
        name: "Nectar Drain",
        type: "Magic",
        cost: 1,
        targetRequired: false,
        abilities: [
          {
            name: "Nectar Drain",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: "GainResource",
                target: "Player",
                resource: "Nectar",
                value: 2,
                duration: "ThisTurn"
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
          type: "image",
          horizonAssetId: "1754732031852523",
          path: "assets/images/cards_magic_nectar-drain.png"
        }
      ]
    },
    {
      id: "nectar-surge",
      type: "magic",
      cardType: "Magic",
      data: {
        id: "nectar-surge",
        name: "Nectar Surge",
        type: "Magic",
        cost: 1,
        targetRequired: false,
        abilities: [
          {
            name: "Nectar Surge",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: "GainResource",
                target: "Player",
                resource: "Nectar",
                value: 3,
                duration: "ThisTurn"
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
          type: "image",
          horizonAssetId: "1379310950488534",
          path: "assets/images/cards_magic_nectar-surge.png"
        }
      ]
    },
    {
      id: "overgrowth",
      type: "magic",
      cardType: "Magic",
      data: {
        id: "overgrowth",
        name: "Overgrowth",
        type: "Magic",
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
          type: "image",
          horizonAssetId: "1489977038895297",
          path: "assets/images/cards_magic_overgrowth.png"
        }
      ]
    },
    {
      id: "power-up",
      type: "magic",
      cardType: "Magic",
      data: {
        id: "power-up",
        name: "Power Up",
        type: "Magic",
        cost: 2,
        targetRequired: true,
        abilities: [
          {
            name: "Power Up",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.ModifyStats,
                target: AbilityTarget.Target,
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
          type: "image",
          horizonAssetId: "1140750044697552",
          path: "assets/images/cards_magic_power-up.png"
        }
      ]
    },
    {
      id: "purify",
      type: "magic",
      cardType: "Magic",
      data: {
        id: "purify",
        name: "Purify",
        type: "Magic",
        cost: 1,
        targetRequired: true,
        abilities: [
          {
            name: "Purify",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.Heal,
                target: AbilityTarget.Target,
                value: 3
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: "image",
          horizonAssetId: "681285418362907",
          path: "assets/images/cards_magic_purify.png"
        }
      ]
    }
  ]
};
