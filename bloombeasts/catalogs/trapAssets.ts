/**
 * Auto-generated TypeScript catalog from trapAssets.json
 * DO NOT EDIT MANUALLY - Run npm run generate:catalogs to regenerate
 */

import type { AssetCatalog } from '../AssetCatalogManager';

export const trapAssets: AssetCatalog = {
  "version": "1.0.0",
  "category": "trap",
  "description": "Trap cards and assets",
  "data": [
    {
      "id": "bear-trap",
      "type": "trap",
      "cardType": "Trap",
      "data": {
        "id": "bear-trap",
        "name": "Bear Trap",
        "type": "Trap",
        "cost": 1,
        "activation": {
          "trigger": "OnAttack"
        },
        "abilities": [
          {
            "name": "Bear Trap",
            "trigger": "OnSummon",
            "effects": [
              {
                "type": "DealDamage",
                "target": "Attacker",
                "value": 3
              }
            ]
          }
        ]
      },
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "1518992622460625",
          "path": "assets/images/cards_trap_bear-trap.png"
        }
      ]
    },
    {
      "id": "emergency-bloom",
      "type": "trap",
      "cardType": "Trap",
      "data": {
        "id": "emergency-bloom",
        "name": "Emergency Bloom",
        "type": "Trap",
        "cost": 1,
        "activation": {
          "trigger": "OnDestroy"
        },
        "abilities": [
          {
            "name": "Emergency Bloom",
            "trigger": "OnSummon",
            "effects": [
              {
                "type": "DrawCards",
                "target": "PlayerGardener",
                "value": 2
              }
            ]
          }
        ]
      },
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "2247657455738264",
          "path": "assets/images/cards_trap_emergency-bloom.png"
        }
      ]
    },
    {
      "id": "habitat-lock",
      "type": "trap",
      "cardType": "Trap",
      "data": {
        "id": "habitat-lock",
        "name": "Habitat Lock",
        "type": "Trap",
        "cost": 1,
        "activation": {
          "trigger": "OnHabitatPlay"
        },
        "abilities": [
          {
            "name": "Habitat Lock",
            "trigger": "OnSummon",
            "effects": [
              {
                "type": "NullifyEffect",
                "target": "Target"
              }
            ]
          }
        ]
      },
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "609610328807674",
          "path": "assets/images/cards_trap_habitat-lock.png"
        }
      ]
    },
    {
      "id": "habitat-shield",
      "type": "trap",
      "cardType": "Trap",
      "data": {
        "id": "habitat-shield",
        "name": "Habitat Shield",
        "type": "Trap",
        "cost": 2,
        "activation": {
          "trigger": "OnHabitatPlay"
        },
        "abilities": [
          {
            "name": "Habitat Shield",
            "trigger": "OnSummon",
            "effects": [
              {
                "type": "NullifyEffect",
                "target": "Target"
              },
              {
                "type": "DrawCards",
                "target": "PlayerGardener",
                "value": 1
              }
            ]
          }
        ]
      },
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "1362245262078336",
          "path": "assets/images/cards_trap_habitat-shield.png"
        }
      ]
    },
    {
      "id": "magic-shield",
      "type": "trap",
      "cardType": "Trap",
      "data": {
        "id": "magic-shield",
        "name": "Magic Shield",
        "type": "Trap",
        "cost": 1,
        "activation": {
          "trigger": "OnMagicPlay"
        },
        "abilities": [
          {
            "name": "Magic Shield",
            "trigger": "OnSummon",
            "effects": [
              {
                "type": "NullifyEffect",
                "target": "Target"
              }
            ]
          }
        ]
      },
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "1239098601311749",
          "path": "assets/images/cards_trap_magic-sheild.png"
        }
      ]
    },
    {
      "id": "thorn-snare",
      "type": "trap",
      "cardType": "Trap",
      "data": {
        "id": "thorn-snare",
        "name": "Thorn Snare",
        "type": "Trap",
        "cost": 2,
        "activation": {
          "trigger": "OnAttack"
        },
        "abilities": [
          {
            "name": "Thorn Snare",
            "trigger": "OnSummon",
            "effects": [
              {
                "type": "PreventAttack",
                "target": "Attacker",
                "duration": "Instant"
              },
              {
                "type": "DealDamage",
                "target": "Attacker",
                "value": 2
              }
            ]
          }
        ]
      },
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "4210265565909373",
          "path": "assets/images/cards_trap_thorn-snare.png"
        }
      ]
    },
    {
      "id": "vaporize",
      "type": "trap",
      "cardType": "Trap",
      "data": {
        "id": "vaporize",
        "name": "Vaporize",
        "type": "Trap",
        "cost": 2,
        "activation": {
          "trigger": "OnBloomPlay",
          "condition": {
            "type": "CostBelow",
            "value": 4
          }
        },
        "abilities": [
          {
            "name": "Vaporize",
            "trigger": "OnSummon",
            "effects": [
              {
                "type": "Destroy",
                "target": "Target"
              }
            ]
          }
        ]
      },
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "1903759173890506",
          "path": "assets/images/cards_trap_vaporize.png"
        }
      ]
    },
    {
      "id": "xp-harvest",
      "type": "trap",
      "cardType": "Trap",
      "data": {
        "id": "xp-harvest",
        "name": "XP Harvest",
        "type": "Trap",
        "cost": 1,
        "activation": {
          "trigger": "OnDestroy"
        },
        "abilities": [
          {
            "name": "XP Harvest",
            "trigger": "OnSummon",
            "effects": [
              {
                "type": "RemoveCounter",
                "target": "Attacker",
                "counter": "XP"
              }
            ]
          }
        ]
      },
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "807213335392971",
          "path": "assets/images/cards_trap_xpharvest.png"
        }
      ]
    }
  ]
};
