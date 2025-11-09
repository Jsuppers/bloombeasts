/**
 * Sky Affinity Assets - Refactored using catalogBuilder
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
const skyCards = [
  defineCard(
    "aero-moth",
    {
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
    } as BloomBeastCard,
    "assets/images/cards_sky_aero-moth.png",
    "1857788838498496"
  ),

  defineCard(
    "cirrus-floof",
    {
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
    } as BloomBeastCard,
    "assets/images/cards_sky_cirrus-floof.png",
    "849446287592530"
  ),

  defineCard(
    "gale-glider",
    {
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
    } as BloomBeastCard,
    "assets/images/cards_sky_gale-glider.png",
    "1854780382097596"
  ),

  defineCard(
    "star-bloom",
    {
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
    } as BloomBeastCard,
    "assets/images/cards_sky_star-bloom.png",
    "737222956003560"
  ),
];

/**
 * Build the catalog from cards using the builder
 * This eliminates ~100 lines of boilerplate!
 */
const skyCatalog = createCatalog(Affinity.Sky, skyCards);

/**
 * Add special assets (Habitat with multiple images, UI elements)
 * These don't fit the simple card pattern, so we add them manually
 */
export const skyAssets: AssetCatalog = {
  ...skyCatalog,
  data: [
    ...skyCatalog.data,

    // Habitat card with multiple asset images
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
      } as HabitatCard,
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

    // UI Assets
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
