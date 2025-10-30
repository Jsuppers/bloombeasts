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
        levelingConfig: {
          statGains: {
            "1": {
              hp: 0,
              atk: 0
            },
            "2": {
              hp: 0,
              atk: 1
            },
            "3": {
              hp: 0,
              atk: 3
            },
            "4": {
              hp: 1,
              atk: 5
            },
            "5": {
              hp: 1,
              atk: 6
            },
            "6": {
              hp: 2,
              atk: 8
            },
            "7": {
              hp: 2,
              atk: 9
            },
            "8": {
              hp: 3,
              atk: 11
            },
            "9": {
              hp: 3,
              atk: 13
            }
          },
          abilityUpgrades: {
            "4": {
              abilities: [
                {
                  name: "Ember Strike",
                  trigger: AbilityTrigger.OnAttack,
                  effects: [
                    {
                      type: EffectType.AttackModification,
                      target: AbilityTarget.Self,
                      modification: "triple-damage",
                      condition: {
                        type: "IsDamaged"
                      }
                    }
                  ]
                }
              ]
            },
            "7": {
              abilities: [
                {
                  name: "Lightning Speed",
                  trigger: AbilityTrigger.WhileOnField,
                  effects: [
                    {
                      type: EffectType.RemoveSummoningSickness,
                      target: AbilityTarget.Self
                    },
                    {
                      type: EffectType.AttackModification,
                      target: AbilityTarget.Self,
                      modification: "attack-twice"
                    }
                  ]
                }
              ]
            },
            "9": {
              abilities: [
                {
                  name: "Phoenix Form",
                  trigger: AbilityTrigger.WhileOnField,
                  effects: [
                    {
                      type: EffectType.AttackModification,
                      target: AbilityTarget.Self,
                      modification: "attack-twice"
                    }
                  ]
                },
                {
                  name: "Annihilation",
                  trigger: AbilityTrigger.OnAttack,
                  effects: [
                    {
                      type: EffectType.AttackModification,
                      target: AbilityTarget.Self,
                      modification: "instant-destroy",
                      condition: {
                        type: "IsDamaged"
                      }
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
                type: EffectType.ApplyCounter,
                target: AbilityTarget.Target,
                counter: "Burn",
                value: 1
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
                  name: "Inferno Bite",
                  trigger: AbilityTrigger.OnAttack,
                  effects: [
                    {
                      type: EffectType.ApplyCounter,
                      target: AbilityTarget.Target,
                      counter: "Burn",
                      value: 2
                    }
                  ]
                }
              ]
            },
            "7": {
              abilities: [
                {
                  name: "Flame Burst",
                  trigger: AbilityTrigger.OnSummon,
                  cost: {
                    type: "Discard",
                    value: 1
                  },
                  effects: [
                    {
                      type: EffectType.ApplyCounter,
                      target: AbilityTarget.AllEnemies,
                      counter: "Burn",
                      value: 2
                    }
                  ]
                }
              ]
            },
            "9": {
              abilities: [
                {
                  name: "Wildfire Aura",
                  trigger: AbilityTrigger.OnAttack,
                  effects: [
                    {
                      type: EffectType.ApplyCounter,
                      target: AbilityTarget.Target,
                      counter: "Burn",
                      value: 3
                    }
                  ]
                },
                {
                  name: "Apocalypse Flame",
                  trigger: AbilityTrigger.OnSummon,
                  effects: [
                    {
                      type: EffectType.ApplyCounter,
                      target: AbilityTarget.AllEnemies,
                      counter: "Burn",
                      value: 3
                    },
                    {
                      type: EffectType.DealDamage,
                      target: "OpponentGardener",
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
              hp: 5,
              atk: 4
            },
            "6": {
              hp: 6,
              atk: 5
            },
            "7": {
              hp: 8,
              atk: 6
            },
            "8": {
              hp: 9,
              atk: 7
            },
            "9": {
              hp: 11,
              atk: 8
            }
          },
          abilityUpgrades: {
            "4": {
              abilities: [
                {
                  name: "Burning Retaliation",
                  trigger: AbilityTrigger.OnDamage,
                  effects: [
                    {
                      type: "Retaliation",
                      target: AbilityTarget.Attacker,
                      value: 2
                    },
                    {
                      type: EffectType.ApplyCounter,
                      target: AbilityTarget.Attacker,
                      counter: "Burn",
                      value: 1
                    }
                  ]
                }
              ]
            },
            "7": {
              abilities: [
                {
                  name: "Smoke Screen",
                  trigger: AbilityTrigger.OnDamage,
                  effects: [
                    {
                      type: "Immunity",
                      target: AbilityTarget.Self,
                      immuneTo: [
                        "Magic",
                        "Trap"
                      ],
                      duration: EffectDuration.WhileOnField
                    },
                    {
                      type: EffectType.ApplyCounter,
                      target: AbilityTarget.Target,
                      counter: "Soot",
                      value: 2
                    }
                  ]
                }
              ]
            },
            "9": {
              abilities: [
                {
                  name: "Blazing Vengeance",
                  trigger: AbilityTrigger.OnDamage,
                  effects: [
                    {
                      type: "Immunity",
                      target: AbilityTarget.Self,
                      immuneTo: [
                        "Magic",
                        "Trap"
                      ],
                      duration: EffectDuration.WhileOnField
                    },
                    {
                      type: EffectType.ApplyCounter,
                      target: AbilityTarget.Attacker,
                      counter: "Burn",
                      value: 3
                    }
                  ]
                },
                {
                  name: "Infernal Reflection",
                  trigger: AbilityTrigger.OnDamage,
                  effects: [
                    {
                      type: "Retaliation",
                      target: AbilityTarget.Attacker,
                      value: "reflected"
                    },
                    {
                      type: EffectType.ApplyCounter,
                      target: AbilityTarget.Attacker,
                      counter: "Burn",
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
        levelingConfig: {
          statGains: {
            "1": {
              hp: 0,
              atk: 0
            },
            "2": {
              hp: 2,
              atk: 1
            },
            "3": {
              hp: 3,
              atk: 2
            },
            "4": {
              hp: 5,
              atk: 3
            },
            "5": {
              hp: 7,
              atk: 4
            },
            "6": {
              hp: 9,
              atk: 5
            },
            "7": {
              hp: 11,
              atk: 6
            },
            "8": {
              hp: 13,
              atk: 7
            },
            "9": {
              hp: 15,
              atk: 9
            }
          },
          abilityUpgrades: {
            "4": {
              abilities: [
                {
                  name: "Molten Armor",
                  trigger: AbilityTrigger.WhileOnField,
                  effects: [
                    {
                      type: EffectType.DamageReduction,
                      target: AbilityTarget.Self,
                      value: 2,
                      duration: EffectDuration.WhileOnField
                    }
                  ]
                }
              ]
            },
            "7": {
              abilities: [
                {
                  name: "Eruption",
                  trigger: AbilityTrigger.OnDestroy,
                  effects: [
                    {
                      type: EffectType.DealDamage,
                      target: "OpponentGardener",
                      value: 5
                    },
                    {
                      type: EffectType.DealDamage,
                      target: AbilityTarget.AllEnemies,
                      value: 2
                    }
                  ]
                }
              ]
            },
            "9": {
              abilities: [
                {
                  name: "Obsidian Carapace",
                  trigger: AbilityTrigger.WhileOnField,
                  effects: [
                    {
                      type: EffectType.DamageReduction,
                      target: AbilityTarget.Self,
                      value: 3,
                      duration: EffectDuration.WhileOnField
                    },
                    {
                      type: "Retaliation",
                      target: AbilityTarget.Attacker,
                      value: 2
                    }
                  ]
                },
                {
                  name: "Cataclysm",
                  trigger: AbilityTrigger.OnDestroy,
                  effects: [
                    {
                      type: EffectType.DealDamage,
                      target: "OpponentGardener",
                      value: 8
                    },
                    {
                      type: "Destroy",
                      target: AbilityTarget.AllEnemies,
                      condition: {
                        type: "HealthBelow",
                        value: 4,
                        comparison: "Less"
                      }
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
          horizonAssetId: "1762741407742835",
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
      missionNumber: 1,
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
          horizonAssetId: "1762741407742835",
          path: "assets/images/cards_fire_habitat-card.png"
        }
      ]
    }
  ]
};
