/**
 * Edit this file directly to add/modify assets
 */

import type { AssetCatalog } from '../../AssetCatalogManager';
import { AssetReferenceType, AssetEntryType, UICategory, CatalogCategory, AffinityLowercase } from '../../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration } from '../engine/types/abilities';
import { TrapTrigger, CardType } from '../engine/types/core';

export const trapAssets: AssetCatalog = {
  version: "1.0.0",
  category: CatalogCategory.Trap,
  description: "Trap cards and assets",
  data: [
    {
      id: "bear-trap",
      type: AssetEntryType.Trap,
      cardType: "Trap",
      data: {
        id: "bear-trap",
        name: "Bear Trap",
        type: CardType.Trap,
        cost: 1,
        activation: {
          trigger: TrapTrigger.OnAttack
        },
        abilities: [
          {
            name: "Bear Trap",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.DealDamage,
                target: AbilityTarget.Attacker,
                value: 3
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1518992622460625",
          path: "assets/images/cards_trap_bear-trap.png"
        }
      ]
    },
    {
      id: "emergency-bloom",
      type: AssetEntryType.Trap,
      cardType: "Trap",
      data: {
        id: "emergency-bloom",
        name: "Emergency Bloom",
        type: CardType.Trap,
        cost: 1,
        activation: {
          trigger: TrapTrigger.OnDestroy
        },
        abilities: [
          {
            name: "Emergency Bloom",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.DrawCards,
                target: AbilityTarget.Player,
                value: 2
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "2247657455738264",
          path: "assets/images/cards_trap_emergency-bloom.png"
        }
      ]
    },
    {
      id: "habitat-lock",
      type: AssetEntryType.Trap,
      cardType: "Trap",
      data: {
        id: "habitat-lock",
        name: "Habitat Lock",
        type: CardType.Trap,
        cost: 1,
        activation: {
          trigger: TrapTrigger.OnHabitatPlay
        },
        abilities: [
          {
            name: "Habitat Lock",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.NullifyEffect,
                target: AbilityTarget.PlayedCard
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "609610328807674",
          path: "assets/images/cards_trap_habitat-lock.png"
        }
      ]
    },
    {
      id: "habitat-shield",
      type: AssetEntryType.Trap,
      cardType: "Trap",
      data: {
        id: "habitat-shield",
        name: "Habitat Shield",
        type: CardType.Trap,
        cost: 2,
        activation: {
          trigger: TrapTrigger.OnHabitatPlay
        },
        abilities: [
          {
            name: "Habitat Shield",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.NullifyEffect,
                target: AbilityTarget.PlayedCard
              },
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
          horizonAssetId: "1362245262078336",
          path: "assets/images/cards_trap_habitat-shield.png"
        }
      ]
    },
    {
      id: "magic-shield",
      type: AssetEntryType.Trap,
      cardType: "Trap",
      data: {
        id: "magic-shield",
        name: "Magic Shield",
        type: CardType.Trap,
        cost: 1,
        activation: {
          trigger: TrapTrigger.OnMagicPlay
        },
        abilities: [
          {
            name: "Magic Shield",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.NullifyEffect,
                target: AbilityTarget.PlayedCard
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1239098601311749",
          path: "assets/images/cards_trap_magic-sheild.png"
        }
      ]
    },
    {
      id: "thorn-snare",
      type: AssetEntryType.Trap,
      cardType: "Trap",
      data: {
        id: "thorn-snare",
        name: "Thorn Snare",
        type: CardType.Trap,
        cost: 2,
        activation: {
          trigger: TrapTrigger.OnAttack
        },
        abilities: [
          {
            name: "Thorn Snare",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.PreventAttack,
                target: AbilityTarget.Attacker,
                duration: EffectDuration.Instant
              },
              {
                type: EffectType.DealDamage,
                target: AbilityTarget.Attacker,
                value: 2
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "4210265565909373",
          path: "assets/images/cards_trap_thorn-snare.png"
        }
      ]
    },
    {
      id: "vaporize",
      type: AssetEntryType.Trap,
      cardType: "Trap",
      data: {
        id: "vaporize",
        name: "Vaporize",
        type: CardType.Trap,
        cost: 2,
        activation: {
          trigger: TrapTrigger.OnBeastPlay,
          condition: {
            type: "CostBelow",
            value: 4
          }
        },
        abilities: [
          {
            name: "Vaporize",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.Destroy,
                target: AbilityTarget.PlayedCard
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "1903759173890506",
          path: "assets/images/cards_trap_vaporize.png"
        }
      ]
    },
    {
      id: "xp-harvest",
      type: AssetEntryType.Trap,
      cardType: "Trap",
      data: {
        id: "xp-harvest",
        name: "XP Harvest",
        type: CardType.Trap,
        cost: 1,
        activation: {
          trigger: TrapTrigger.OnDestroy
        },
        abilities: [
          {
            name: "XP Harvest",
            trigger: AbilityTrigger.OnSummon,
            effects: [
              {
                type: EffectType.DealDamage,
                target: AbilityTarget.Attacker,
                value: 2
              }
            ]
          }
        ]
      },
      assets: [
        {
          type: AssetReferenceType.Image,
          horizonAssetId: "807213335392971",
          path: "assets/images/cards_trap_xpharvest.png"
        }
      ]
    }
  ]
};
