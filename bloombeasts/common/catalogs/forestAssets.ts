/**
 * Forest Affinity Assets - Refactored using catalogBuilder
 *
 * This file is now ~60% smaller thanks to the catalog builder utility.
 * Edit card definitions below, and the builder handles all the boilerplate.
 */

import type { AssetCatalog } from '../../AssetCatalogManager';
import { AssetReferenceType, AssetEntryType, UICategory, AffinityLowercase } from '../../AssetCatalogManager';
import { AbilityTrigger, AbilityTarget, EffectType, EffectDuration, StatType } from '../engine/types/abilities';
import { CardType, Affinity } from '../engine/types/core';
import { createCatalog, defineCard } from './catalogBuilder';
import type { BloomBeastCard, HabitatCard } from '../engine/types/core';

/**
 * Card definitions - Just the data, no boilerplate
 */
const forestCards = [
  defineCard(
    "rootling",
    {
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
    } as BloomBeastCard,
    "assets/images/cards_forest_rootling.png",
    "1170317305016635"
  ),

  defineCard(
    "leaf-sprite",
    {
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
    } as BloomBeastCard,
    "assets/images/cards_forest_leaf-sprite.png",
    "1733091247346351"
  ),

  defineCard(
    "mosslet",
    {
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
    } as BloomBeastCard,
    "assets/images/cards_forest_mosslet.png",
    "1344114090714721"
  ),

  defineCard(
    "mushroomancer",
    {
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
    } as BloomBeastCard,
    "assets/images/cards_forest_mushroomancer.png",
    "1393693032328550"
  ),
];

/**
 * Build the catalog from cards using the builder
 * This eliminates ~100 lines of boilerplate!
 */
const forestCatalog = createCatalog(Affinity.Forest, forestCards);

/**
 * Add special assets (Habitat with multiple images, UI elements)
 * These don't fit the simple card pattern, so we add them manually
 */
export const forestAssets: AssetCatalog = {
  ...forestCatalog,
  data: [
    ...forestCatalog.data,

    // Habitat card with multiple asset images
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
      } as HabitatCard,
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

    // UI Assets
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
