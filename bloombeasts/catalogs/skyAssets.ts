/**
 * Auto-generated TypeScript catalog from skyAssets.json
 * DO NOT EDIT MANUALLY - Run npm run generate:catalogs to regenerate
 */

import type { AssetCatalog } from '../AssetCatalogManager';

export const skyAssets: AssetCatalog = {
  "version": "1.0.0",
  "category": "sky",
  "description": "Sky affinity cards and assets",
  "data": [
    {
      "id": "aero-moth",
      "type": "beast",
      "cardType": "Bloom",
      "affinity": "sky",
      "data": {
        "id": "aero-moth",
        "name": "Aero Moth",
        "type": "Bloom",
        "affinity": "Sky",
        "cost": 2,
        "baseAttack": 3,
        "baseHealth": 3,
        "abilities": [
          {
            "name": "Wing Flutter",
            "trigger": "OnSummon",
            "effects": [
              {
                "type": "DrawCards",
                "target": "PlayerGardener",
                "value": 1
              }
            ]
          }
        ],
        "levelingConfig": {
          "statGains": {
            "1": {
              "hp": 0,
              "atk": 0
            },
            "2": {
              "hp": 1,
              "atk": 1
            },
            "3": {
              "hp": 2,
              "atk": 2
            },
            "4": {
              "hp": 3,
              "atk": 3
            },
            "5": {
              "hp": 4,
              "atk": 4
            },
            "6": {
              "hp": 5,
              "atk": 5
            },
            "7": {
              "hp": 6,
              "atk": 6
            },
            "8": {
              "hp": 7,
              "atk": 7
            },
            "9": {
              "hp": 8,
              "atk": 8
            }
          },
          "abilityUpgrades": {
            "4": {
              "abilities": [
                {
                  "name": "Hypnotic Wings",
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
            "7": {
              "abilities": [
                {
                  "name": "Hypnotic Wings",
                  "trigger": "OnSummon",
                  "effects": [
                    {
                      "type": "DrawCards",
                      "target": "PlayerGardener",
                      "value": 2
                    }
                  ]
                },
                {
                  "name": "Cyclone",
                  "trigger": "OnAttack",
                  "effects": [
                    {
                      "type": "SwapPositions",
                      "target": "AllEnemies"
                    }
                  ]
                }
              ]
            },
            "9": {
              "abilities": [
                {
                  "name": "Rainbow Cascade",
                  "trigger": "OnSummon",
                  "effects": [
                    {
                      "type": "DrawCards",
                      "target": "PlayerGardener",
                      "value": 3
                    },
                    {
                      "type": "ModifyStats",
                      "target": "AllAllies",
                      "stat": "Attack",
                      "value": 1,
                      "duration": "Permanent"
                    },
                    {
                      "type": "ModifyStats",
                      "target": "AllAllies",
                      "stat": "Health",
                      "value": 1,
                      "duration": "Permanent"
                    }
                  ]
                },
                {
                  "name": "Chaos Storm",
                  "trigger": "OnAttack",
                  "effects": [
                    {
                      "type": "SwapPositions",
                      "target": "AllEnemies"
                    },
                    {
                      "type": "ReturnToHand",
                      "target": "RandomEnemy",
                      "value": 1
                    },
                    {
                      "type": "DrawCards",
                      "target": "PlayerGardener",
                      "value": 2
                    }
                  ]
                }
              ]
            }
          }
        }
      },
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "1857788838498496",
          "path": "assets/images/cards_sky_aero-moth.png"
        }
      ]
    },
    {
      "id": "cirrus-floof",
      "type": "beast",
      "cardType": "Bloom",
      "affinity": "sky",
      "data": {
        "id": "cirrus-floof",
        "name": "Cirrus Floof",
        "type": "Bloom",
        "affinity": "Sky",
        "cost": 2,
        "baseAttack": 1,
        "baseHealth": 6,
        "abilities": [
          {
            "name": "Lightness",
            "trigger": "Passive",
            "effects": [
              {
                "type": "CannotBeTargeted",
                "target": "Self",
                "by": [
                  "high-cost-units"
                ],
                "costThreshold": 3
              }
            ]
          }
        ],
        "levelingConfig": {
          "statGains": {
            "1": {
              "hp": 0,
              "atk": 0
            },
            "2": {
              "hp": 3,
              "atk": 0
            },
            "3": {
              "hp": 5,
              "atk": 0
            },
            "4": {
              "hp": 7,
              "atk": 1
            },
            "5": {
              "hp": 10,
              "atk": 1
            },
            "6": {
              "hp": 12,
              "atk": 2
            },
            "7": {
              "hp": 14,
              "atk": 3
            },
            "8": {
              "hp": 17,
              "atk": 3
            },
            "9": {
              "hp": 20,
              "atk": 4
            }
          },
          "abilityUpgrades": {
            "4": {
              "abilities": [
                {
                  "name": "Storm Shield",
                  "trigger": "OnOwnStartOfTurn",
                  "effects": [
                    {
                      "type": "TemporaryHP",
                      "target": "AllAllies",
                      "value": 2
                    }
                  ]
                }
              ]
            },
            "7": {
              "abilities": [
                {
                  "name": "Ethereal Form",
                  "trigger": "Passive",
                  "effects": [
                    {
                      "type": "CannotBeTargeted",
                      "target": "Self",
                      "by": [
                        "attacks"
                      ]
                    }
                  ]
                }
              ]
            },
            "9": {
              "abilities": [
                {
                  "name": "Celestial Protector",
                  "trigger": "Passive",
                  "effects": [
                    {
                      "type": "CannotBeTargeted",
                      "target": "Self",
                      "by": [
                        "all"
                      ]
                    },
                    {
                      "type": "DamageReduction",
                      "target": "AllAllies",
                      "value": 1,
                      "duration": "WhileOnField"
                    }
                  ]
                },
                {
                  "name": "Divine Barrier",
                  "trigger": "OnOwnStartOfTurn",
                  "effects": [
                    {
                      "type": "TemporaryHP",
                      "target": "AllAllies",
                      "value": 3
                    },
                    {
                      "type": "Immunity",
                      "target": "AllAllies",
                      "immuneTo": [
                        "NegativeEffects"
                      ],
                      "duration": "ThisTurn"
                    }
                  ]
                }
              ]
            }
          }
        }
      },
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "849446287592530",
          "path": "assets/images/cards_sky_cirrus-floof.png"
        }
      ]
    },
    {
      "id": "gale-glider",
      "type": "beast",
      "cardType": "Bloom",
      "affinity": "sky",
      "data": {
        "id": "gale-glider",
        "name": "Gale Glider",
        "type": "Bloom",
        "affinity": "Sky",
        "cost": 1,
        "baseAttack": 2,
        "baseHealth": 2,
        "abilities": [
          {
            "name": "First Wind",
            "trigger": "Passive",
            "effects": [
              {
                "type": "AttackModification",
                "target": "Self",
                "modification": "attack-first"
              }
            ]
          }
        ],
        "levelingConfig": {
          "statGains": {
            "1": {
              "hp": 0,
              "atk": 0
            },
            "2": {
              "hp": 0,
              "atk": 2
            },
            "3": {
              "hp": 0,
              "atk": 3
            },
            "4": {
              "hp": 1,
              "atk": 5
            },
            "5": {
              "hp": 1,
              "atk": 7
            },
            "6": {
              "hp": 2,
              "atk": 9
            },
            "7": {
              "hp": 2,
              "atk": 10
            },
            "8": {
              "hp": 3,
              "atk": 12
            },
            "9": {
              "hp": 3,
              "atk": 14
            }
          },
          "abilityUpgrades": {
            "4": {
              "abilities": [
                {
                  "name": "Wind Dance",
                  "trigger": "OnAttack",
                  "effects": [
                    {
                      "type": "MoveUnit",
                      "target": "Self",
                      "destination": "any-slot"
                    }
                  ]
                }
              ]
            },
            "7": {
              "abilities": [
                {
                  "name": "Storm Blade",
                  "trigger": "Passive",
                  "effects": [
                    {
                      "type": "AttackModification",
                      "target": "Self",
                      "modification": "attack-first"
                    },
                    {
                      "type": "ModifyStats",
                      "target": "Self",
                      "stat": "Attack",
                      "value": 2,
                      "duration": "NextAttack"
                    }
                  ]
                }
              ]
            },
            "9": {
              "abilities": [
                {
                  "name": "Tempest Strike",
                  "trigger": "Passive",
                  "effects": [
                    {
                      "type": "AttackModification",
                      "target": "Self",
                      "modification": "attack-first"
                    },
                    {
                      "type": "AttackModification",
                      "target": "Self",
                      "modification": "triple-damage"
                    },
                    {
                      "type": "AttackModification",
                      "target": "Self",
                      "modification": "cannot-counterattack"
                    }
                  ]
                },
                {
                  "name": "Hurricane Assault",
                  "trigger": "OnAttack",
                  "effects": [
                    {
                      "type": "AttackModification",
                      "target": "Self",
                      "modification": "attack-twice"
                    },
                    {
                      "type": "MoveUnit",
                      "target": "Self",
                      "destination": "any-slot"
                    }
                  ]
                }
              ]
            }
          }
        }
      },
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "1854780382097596",
          "path": "assets/images/cards_sky_gale-glider.png"
        }
      ]
    },
    {
      "id": "star-bloom",
      "type": "beast",
      "cardType": "Bloom",
      "affinity": "sky",
      "data": {
        "id": "star-bloom",
        "name": "Star Bloom",
        "type": "Bloom",
        "affinity": "Sky",
        "cost": 3,
        "baseAttack": 4,
        "baseHealth": 5,
        "abilities": [
          {
            "name": "Aura",
            "trigger": "Passive",
            "effects": [
              {
                "type": "ModifyStats",
                "target": "AllAllies",
                "stat": "Attack",
                "value": 1,
                "duration": "WhileOnField"
              }
            ]
          }
        ],
        "levelingConfig": {
          "statGains": {
            "1": {
              "hp": 0,
              "atk": 0
            },
            "2": {
              "hp": 1,
              "atk": 1
            },
            "3": {
              "hp": 2,
              "atk": 2
            },
            "4": {
              "hp": 4,
              "atk": 3
            },
            "5": {
              "hp": 6,
              "atk": 4
            },
            "6": {
              "hp": 8,
              "atk": 5
            },
            "7": {
              "hp": 10,
              "atk": 6
            },
            "8": {
              "hp": 12,
              "atk": 7
            },
            "9": {
              "hp": 14,
              "atk": 9
            }
          },
          "abilityUpgrades": {
            "4": {
              "abilities": [
                {
                  "name": "Radiant Aura",
                  "trigger": "Passive",
                  "effects": [
                    {
                      "type": "ModifyStats",
                      "target": "AllAllies",
                      "stat": "Attack",
                      "value": 2,
                      "duration": "WhileOnField"
                    }
                  ]
                }
              ]
            },
            "7": {
              "abilities": [
                {
                  "name": "Cosmic Guidance",
                  "trigger": "Activated",
                  "maxUsesPerTurn": 1,
                  "effects": [
                    {
                      "type": "SearchDeck",
                      "target": "PlayerGardener",
                      "searchFor": "any",
                      "quantity": 1
                    }
                  ]
                }
              ]
            },
            "9": {
              "abilities": [
                {
                  "name": "Astral Dominance",
                  "trigger": "Passive",
                  "effects": [
                    {
                      "type": "ModifyStats",
                      "target": "AllAllies",
                      "stat": "Attack",
                      "value": 3,
                      "duration": "WhileOnField"
                    },
                    {
                      "type": "ModifyStats",
                      "target": "AllAllies",
                      "stat": "Health",
                      "value": 2,
                      "duration": "WhileOnField"
                    }
                  ]
                },
                {
                  "name": "Universal Harmony",
                  "trigger": "Activated",
                  "effects": [
                    {
                      "type": "DrawCards",
                      "target": "PlayerGardener",
                      "value": 3
                    },
                    {
                      "type": "SearchDeck",
                      "target": "PlayerGardener",
                      "searchFor": "any",
                      "quantity": 2
                    },
                    {
                      "type": "ModifyStats",
                      "target": "AllAllies",
                      "stat": "Attack",
                      "value": 2,
                      "duration": "Permanent"
                    },
                    {
                      "type": "ModifyStats",
                      "target": "AllAllies",
                      "stat": "Health",
                      "value": 2,
                      "duration": "Permanent"
                    }
                  ]
                }
              ]
            }
          }
        }
      },
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "737222956003560",
          "path": "assets/images/cards_sky_star-bloom.png"
        }
      ]
    },
    {
      "id": "clear-zenith",
      "type": "habitat",
      "affinity": "sky",
      "data": {
        "id": "clear-zenith",
        "name": "Clear Zenith",
        "type": "Habitat",
        "affinity": "Sky",
        "cost": 1,
        "titleColor": "#000000",
        "abilities": [
          {
            "name": "Sky Vision",
            "trigger": "OnSummon",
            "effects": [
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
          "horizonAssetId": "1941325056416004",
          "path": "assets/images/cards_sky_clear-zenith.png"
        },
        {
          "type": "image",
          "horizonAssetId": "1140855177628973",
          "path": "assets/images/cards_sky_habitat-card.png"
        },
        {
          "type": "image",
          "horizonAssetId": "674037762415336",
          "path": "assets/images/cards_sky_habitat-card-playboard.png"
        }
      ]
    },
    {
      "id": "sky-mission",
      "type": "mission",
      "affinity": "sky",
      "missionNumber": 4,
      "name": "Sky Mission",
      "description": "Sky affinity mission",
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "1076415204381099",
          "path": "assets/images/cards_sky_sky-mission.png"
        }
      ]
    },
    {
      "id": "sky-chest-closed",
      "type": "ui",
      "category": "chest",
      "name": "Sky Chest Closed",
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "1988442925266143",
          "path": "assets/images/chest_sky-chest-closed.png"
        }
      ]
    },
    {
      "id": "sky-chest-opened",
      "type": "ui",
      "category": "chest",
      "name": "Sky Chest Opened",
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "766596743048030",
          "path": "assets/images/chest_sky-chest-opened.png"
        }
      ]
    },
    {
      "id": "sky-icon",
      "type": "ui",
      "category": "icon",
      "name": "Sky Icon",
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "2078365889573892",
          "path": "assets/images/affinity_sky-icon.png"
        }
      ]
    },
    {
      "id": "sky-habitat",
      "type": "ui",
      "category": "card-template",
      "name": "Sky Habitat Card Template",
      "description": "Template overlay for sky habitat cards",
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "1140855177628973",
          "path": "assets/images/cards_sky_habitat-card.png"
        }
      ]
    }
  ]
};
