/**
 * Edit this file directly to add/modify assets
 */

import type { AssetCatalog } from '../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType, ResourceType, ConditionType } from '../engine/types/abilities';

export const forestAssets: AssetCatalog = {
  version: "1.0.0",
  category: "forest",
  description: "Forest affinity cards and assets",
  data: [
    {
      id: "rootling",
      type: "beast",
      cardType: "Bloom",
      affinity: "forest",
      data: {
        id: "rootling",
        name: "Rootling",
        displayName: "Rootling",
        type: "Bloom",
        affinity: "Forest",
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
              hp: 2,
              atk: 1
            },
            "4": {
              hp: 3,
              atk: 2
            },
            "5": {
              hp: 4,
              atk: 3
            },
            "6": {
              hp: 5,
              atk: 4
            },
            "7": {
              hp: 6,
              atk: 5
            },
            "8": {
              hp: 7,
              atk: 6
            },
            "9": {
              hp: 8,
              atk: 7
            }
          },
          abilityUpgrades: {
            "4": {
              abilities: [
                {
                  name: "Abundant Nourish",
                  trigger: AbilityTrigger.OnDestroy,
                  effects: [
                    {
                      type: EffectType.GainResource,
                      target: AbilityTarget.Player,
                      resource: ResourceType.Nectar,
                      value: 2
                    }
                  ]
                }
              ]
            },
            "7": {
              abilities: [
                {
                  name: "Ancient Roots",
                  trigger: AbilityTrigger.WhileOnField,
                  effects: [
                    {
                      type: EffectType.CannotBeTargeted,
                      target: AbilityTarget.Self,
                      by: [
                        "magic",
                        "trap"
                      ]
                    }
                  ]
                }
              ]
            },
            "9": {
              abilities: [
                {
                  name: "Eternal Roots",
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
                  name: "Harvest Feast",
                  trigger: AbilityTrigger.OnDestroy,
                  effects: [
                    {
                      type: EffectType.GainResource,
                      target: AbilityTarget.Player,
                      resource: ResourceType.Nectar,
                      value: 2
                    },
                    {
                      type: EffectType.DrawCards,
                      target: AbilityTarget.Player,
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
          horizonAssetId: "1170317305016635",
          path: "assets/images/cards_forest_rootling.png",
          description: "Rootling card artwork"
        }
      ]
    },
    {
      id: "leaf-sprite",
      type: "beast",
      cardType: "Bloom",
      affinity: "forest",
      data: {
        id: "leaf-sprite",
        name: "Leaf Sprite",
        displayName: "Leaf Sprite",
        type: "Bloom",
        affinity: "Forest",
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
              hp: 1,
              atk: 1
            },
            "4": {
              hp: 1,
              atk: 2
            },
            "5": {
              hp: 2,
              atk: 3
            },
            "6": {
              hp: 3,
              atk: 4
            },
            "7": {
              hp: 4,
              atk: 5
            },
            "8": {
              hp: 5,
              atk: 6
            },
            "9": {
              hp: 6,
              atk: 7
            }
          },
          abilityUpgrades: {
            "4": {
              abilities: [
                {
                  name: "Swiftness",
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
            "7": {
              abilities: [
                {
                  name: "Evasive",
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
              ]
            },
            "9": {
              abilities: [
                {
                  name: "Sprint",
                  trigger: AbilityTrigger.OnSummon,
                  effects: [
                    {
                      type: EffectType.RemoveSummoningSickness,
                      target: AbilityTarget.Self
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
          horizonAssetId: "1733091247346351",
          path: "assets/images/cards_forest_leaf-sprite.png",
          description: "Leaf Sprite card artwork"
        }
      ]
    },
    {
      id: "mosslet",
      type: "beast",
      cardType: "Bloom",
      affinity: "forest",
      data: {
        id: "mosslet",
        name: "Mosslet",
        displayName: "Mosslet",
        type: "Bloom",
        affinity: "Forest",
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
              hp: 1,
              atk: 1
            },
            "4": {
              hp: 2,
              atk: 2
            },
            "5": {
              hp: 3,
              atk: 3
            },
            "6": {
              hp: 4,
              atk: 4
            },
            "7": {
              hp: 5,
              atk: 5
            },
            "8": {
              hp: 6,
              atk: 6
            },
            "9": {
              hp: 7,
              atk: 7
            }
          },
          abilityUpgrades: {
            "4": {
              abilities: [
                {
                  name: "Rapid Growth",
                  trigger: AbilityTrigger.OnOwnEndOfTurn,
                  effects: [
                    {
                      type: EffectType.ModifyStats,
                      target: AbilityTarget.Self,
                      stat: StatType.Both,
                      value: 2,
                      duration: EffectDuration.Permanent
                    }
                  ]
                }
              ]
            },
            "7": {
              abilities: [
                {
                  name: "Mossy Armor",
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
              ]
            },
            "9": {
              abilities: [
                {
                  name: "Overgrowth",
                  trigger: AbilityTrigger.OnOwnEndOfTurn,
                  effects: [
                    {
                      type: EffectType.ModifyStats,
                      target: AbilityTarget.Self,
                      stat: StatType.Both,
                      value: 3,
                      duration: EffectDuration.Permanent
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
          horizonAssetId: "1344114090714721",
          path: "assets/images/cards_forest_mosslet.png",
          description: "Mosslet card artwork"
        }
      ]
    },
    {
      id: "mushroomancer",
      type: "beast",
      cardType: "Bloom",
      affinity: "forest",
      data: {
        id: "mushroomancer",
        name: "Mushroomancer",
        displayName: "Mushroomancer",
        type: "Bloom",
        affinity: "Forest",
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
              hp: 2,
              atk: 1
            },
            "4": {
              hp: 3,
              atk: 2
            },
            "5": {
              hp: 4,
              atk: 3
            },
            "6": {
              hp: 5,
              atk: 4
            },
            "7": {
              hp: 6,
              atk: 5
            },
            "8": {
              hp: 7,
              atk: 6
            },
            "9": {
              hp: 8,
              atk: 7
            }
          },
          abilityUpgrades: {
            "4": {
              abilities: [
                {
                  name: "Virulent Spores",
                  trigger: AbilityTrigger.OnSummon,
                  effects: [
                    {
                      type: EffectType.DealDamage,
                      target: AbilityTarget.AllEnemies,
                      value: 3
                    }
                  ]
                }
              ]
            },
            "7": {
              abilities: [
                {
                  name: "Spore Burst",
                  trigger: AbilityTrigger.OnDestroy,
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
            "9": {
              abilities: [
                {
                  name: "Fungal Network",
                  trigger: AbilityTrigger.OnOwnEndOfTurn,
                  effects: [
                    {
                      type: EffectType.DealDamage,
                      target: AbilityTarget.AllEnemies,
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
          horizonAssetId: "1393693032328550",
          path: "assets/images/cards_forest_mushroomancer.png",
          description: "Mushroomancer card artwork"
        }
      ]
    },
    {
      id: "ancient-forest",
      type: "habitat",
      affinity: "forest",
      data: {
        id: "ancient-forest",
        name: "Ancient Forest",
        displayName: "Ancient Forest",
        type: "Habitat",
        affinity: "Forest",
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
          type: "image",
          horizonAssetId: "1625867191715184",
          path: "assets/images/cards_forest_ancient-forest.png",
          description: "Ancient Forest habitat card artwork"
        },
        {
          type: "image",
          horizonAssetId: "787776974149741",
          path: "assets/images/cards_forest_habitat-card.png",
          description: "Forest habitat card template"
        },
        {
          type: "image",
          horizonAssetId: "805969505504149",
          path: "assets/images/cards_forest_habitat-card-playboard.png",
          description: "Forest habitat card playboard"
        }
      ]
    },
    {
      id: "forest-mission",
      type: "mission",
      affinity: "forest",
      name: "Forest Mission",
      description: "Forest affinity mission",
      assets: [
        {
          type: "image",
          horizonAssetId: "1351984712974001",
          path: "assets/images/cards_forest_forest-mission.png",
          description: "Forest mission card"
        }
      ]
    },
    {
      id: "forest-chest-closed",
      type: "ui",
      category: "chest",
      name: "Forest Chest Closed",
      description: "Forest chest in closed state",
      assets: [
        {
          type: "image",
          horizonAssetId: "678586941962889",
          path: "assets/images/chest_forest-chest-closed.png"
        }
      ]
    },
    {
      id: "forest-chest-opened",
      type: "ui",
      category: "chest",
      name: "Forest Chest Opened",
      description: "Forest chest in opened state",
      assets: [
        {
          type: "image",
          horizonAssetId: "1859963367965524",
          path: "assets/images/chest_forest-chest-opened.png"
        }
      ]
    },
    {
      id: "forest-icon",
      type: "ui",
      category: "icon",
      name: "Forest Icon",
      description: "Forest affinity icon",
      assets: [
        {
          type: "image",
          horizonAssetId: "1869425844004279",
          path: "assets/images/affinity_forest-icon.png"
        }
      ]
    },
    {
      id: "forest-habitat",
      type: "ui",
      category: "card-template",
      name: "Forest Habitat Card Template",
      description: "Template overlay for forest habitat cards",
      assets: [
        {
          type: "image",
          horizonAssetId: "787776974149741",
          path: "assets/images/cards_forest_habitat-card.png"
        }
      ]
    }
  ]
};
