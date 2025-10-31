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
        levelingConfig: {
          statGains: {
            "1": {
              hp: 0,
              atk: 0
            },
            "2": {
              hp: 1,
              atk: 0
            },
            "3": {
              hp: 3,
              atk: 0
            },
            "4": {
              hp: 4,
              atk: 1
            },
            "5": {
              hp: 6,
              atk: 2
            },
            "6": {
              hp: 7,
              atk: 3
            },
            "7": {
              hp: 9,
              atk: 4
            },
            "8": {
              hp: 10,
              atk: 5
            },
            "9": {
              hp: 12,
              atk: 6
            }
          },
          abilityUpgrades: {
            "4": {
              abilities: [
                {
                  name: "Tidal Surge",
                  trigger: "OnAllySummon",
                  effects: [
                    {
                      type: EffectType.ModifyStats,
                      target: AbilityTarget.Self,
                      stat: StatType.Attack,
                      value: 2,
                      duration: EffectDuration.EndOfTurn,
                      condition: {
                        type: "AffinityMatches",
                        value: "Water"
                      }
                    }
                  ]
                }
              ]
            },
            "7": {
              abilities: [
                {
                  name: "Rejuvenation",
                  trigger: AbilityTrigger.OnOwnEndOfTurn,
                  effects: [
                    {
                      type: EffectType.Heal,
                      target: AbilityTarget.AllAllies,
                      value: 2
                    }
                  ]
                }
              ]
            },
            "9": {
              abilities: [
                {
                  name: "Tsunami Force",
                  trigger: "OnAllySummon",
                  effects: [
                    {
                      type: EffectType.ModifyStats,
                      target: AbilityTarget.Self,
                      stat: StatType.Attack,
                      value: 3,
                      duration: EffectDuration.Permanent,
                      condition: {
                        type: "AffinityMatches",
                        value: "Water"
                      }
                    }
                  ]
                },
                {
                  name: "Fountain of Life",
                  trigger: AbilityTrigger.OnOwnEndOfTurn,
                  effects: [
                    {
                      type: EffectType.Heal,
                      target: AbilityTarget.AllAllies,
                      value: "Full"
                    }
                  ]
                }
              ]
            }
          }
        }
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
        levelingConfig: {
          statGains: {
            "1": {
              hp: 0,
              atk: 0
            },
            "2": {
              hp: 2,
              atk: 0
            },
            "3": {
              hp: 4,
              atk: 0
            },
            "4": {
              hp: 6,
              atk: 1
            },
            "5": {
              hp: 8,
              atk: 2
            },
            "6": {
              hp: 10,
              atk: 3
            },
            "7": {
              hp: 12,
              atk: 4
            },
            "8": {
              hp: 14,
              atk: 5
            },
            "9": {
              hp: 16,
              atk: 6
            }
          },
          abilityUpgrades: {
            "4": {
              abilities: [
                {
                  name: "Tidal Shield",
                  trigger: AbilityTrigger.OnDamage,
                  effects: [
                    {
                      type: EffectType.ModifyStats,
                      target: AbilityTarget.Attacker,
                      stat: StatType.Attack,
                      value: -2,
                      duration: EffectDuration.EndOfTurn
                    }
                  ]
                }
              ]
            },
            "7": {
              abilities: [
                {
                  name: "Deep Dive",
                  trigger: AbilityTrigger.WhileOnField,
                  effects: [
                    {
                      type: EffectType.CannotBeTargeted,
                      target: AbilityTarget.Self,
                      by: [
                        "trap",
                        "magic"
                      ]
                    }
                  ]
                }
              ]
            },
            "9": {
              abilities: [
                {
                  name: "Ocean Sanctuary",
                  trigger: AbilityTrigger.WhileOnField,
                  effects: [
                    {
                      type: EffectType.CannotBeTargeted,
                      target: AbilityTarget.Self,
                      by: [
                        "magic",
                        "trap",
                        "abilities"
                      ]
                    }
                  ]
                },
                {
                  name: "Crushing Depths",
                  trigger: AbilityTrigger.OnDamage,
                  effects: [
                    {
                      type: EffectType.ModifyStats,
                      target: AbilityTarget.Attacker,
                      stat: StatType.Attack,
                      value: -3,
                      duration: EffectDuration.Permanent
                    },
                    {
                      type: EffectType.Heal,
                      target: AbilityTarget.Self,
                      value: 2
                    }
                  ]
                }
              ]
            }
          }
        }
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
        levelingConfig: {
          statGains: {
            "1": {
              hp: 0,
              atk: 0
            },
            "2": {
              hp: 1,
              atk: 1
            },
            "3": {
              hp: 2,
              atk: 2
            },
            "4": {
              hp: 4,
              atk: 3
            },
            "5": {
              hp: 6,
              atk: 4
            },
            "6": {
              hp: 8,
              atk: 5
            },
            "7": {
              hp: 10,
              atk: 6
            },
            "8": {
              hp: 12,
              atk: 7
            },
            "9": {
              hp: 14,
              atk: 8
            }
          },
          abilityUpgrades: {
            "4": {
              abilities: [
                {
                  name: "Deluge",
                  trigger: AbilityTrigger.OnAttack,
                  cost: {
                    type: ResourceType.Nectar,
                    value: 1
                  },
                  effects: [
                    {
                      type: EffectType.DealDamage,
                      target: AbilityTarget.Opponent,
                      value: 3
                    }
                  ]
                }
              ]
            },
            "7": {
              abilities: [
                {
                  name: "Fog Veil",
                  trigger: AbilityTrigger.WhileOnField,
                  effects: [
                    {
                      type: EffectType.AttackModification,
                      target: AbilityTarget.Self,
                      modification: "attack-first"
                    },
                    {
                      type: EffectType.DamageReduction,
                      target: AbilityTarget.Self,
                      value: 1,
                      duration: EffectDuration.WhileOnField
                    }
                  ]
                }
              ]
            },
            "9": {
              abilities: [
                {
                  name: "Storm Guardian",
                  trigger: AbilityTrigger.WhileOnField,
                  effects: [
                    {
                      type: EffectType.AttackModification,
                      target: AbilityTarget.Self,
                      modification: "attack-first"
                    },
                    {
                      type: EffectType.DamageReduction,
                      target: AbilityTarget.Self,
                      value: 2,
                      duration: EffectDuration.WhileOnField
                    }
                  ]
                },
                {
                  name: "Maelstrom",
                  trigger: AbilityTrigger.OnAttack,
                  effects: [
                    {
                      type: EffectType.DealDamage,
                      target: AbilityTarget.Opponent,
                      value: 5
                    },
                    {
                      type: EffectType.DealDamage,
                      target: AbilityTarget.RandomEnemy,
                      value: 1
                    }
                  ]
                }
              ]
            }
          }
        }
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
        levelingConfig: {
          statGains: {
            "1": {
              hp: 0,
              atk: 0
            },
            "2": {
              hp: 1,
              atk: 1
            },
            "3": {
              hp: 2,
              atk: 2
            },
            "4": {
              hp: 3,
              atk: 3
            },
            "5": {
              hp: 4,
              atk: 4
            },
            "6": {
              hp: 5,
              atk: 5
            },
            "7": {
              hp: 6,
              atk: 6
            },
            "8": {
              hp: 7,
              atk: 7
            },
            "9": {
              hp: 8,
              atk: 8
            }
          },
          abilityUpgrades: {
            "4": {
              abilities: [
                {
                  name: "Binding Vines",
                  trigger: AbilityTrigger.OnAttack,
                  effects: [
                    {
                      type: "PreventAttack",
                      target: AbilityTarget.Target,
                      duration: "StartOfNextTurn"
                    },
                    {
                      type: "PreventAbilities",
                      target: AbilityTarget.Target,
                      duration: "StartOfNextTurn"
                    }
                  ]
                }
              ]
            },
            "7": {
              abilities: [
                {
                  name: "Deep Anchor",
                  trigger: AbilityTrigger.WhileOnField,
                  effects: [
                    {
                      type: "Immunity",
                      target: AbilityTarget.Self,
                      immuneTo: [
                        "Magic",
                        "Trap",
                        "Abilities"
                      ],
                      duration: EffectDuration.WhileOnField
                    }
                  ]
                }
              ]
            },
            "9": {
              abilities: [
                {
                  name: "Strangling Grasp",
                  trigger: AbilityTrigger.OnAttack,
                  effects: [
                    {
                      type: "PreventAttack",
                      target: AbilityTarget.Target,
                      duration: EffectDuration.Permanent
                    },
                    {
                      type: "PreventAbilities",
                      target: AbilityTarget.Target,
                      duration: EffectDuration.Permanent
                    }
                  ]
                },
                {
                  name: "Immovable Force",
                  trigger: AbilityTrigger.WhileOnField,
                  effects: [
                    {
                      type: "Immunity",
                      target: AbilityTarget.Self,
                      immuneTo: [
                        "Damage",
                        "Targeting",
                        "NegativeEffects"
                      ],
                      duration: EffectDuration.WhileOnField
                    },
                    {
                      type: "Retaliation",
                      target: AbilityTarget.Self,
                      value: 1
                    }
                  ]
                }
              ]
            }
          }
        }
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
          horizonAssetId: "797144049734620",
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
          horizonAssetId: "797144049734620",
          path: "assets/images/cards_water_habitat-card.png"
        }
      ]
    }
  ]
};
