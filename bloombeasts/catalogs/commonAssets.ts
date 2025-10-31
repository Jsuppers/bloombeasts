/**
 * Common Assets Catalog
 * Source of truth for UI elements, backgrounds, and shared assets
 * Edit this file directly to add/modify assets
 */

import type { AssetCatalog } from '../AssetCatalogManager';

export const commonAssets: AssetCatalog = {
  version: "1.0.0",
  category: "common",
  description: "Common UI elements, backgrounds, and shared assets",
  data: [
    {
      id: "background",
      type: "ui",
      category: "background",
      name: "Main Background",
      description: "Main game background",
      assets: [
        {
          type: "image",
          horizonAssetId: "1341821670869568",
          path: "assets/images/bg_background.png"
        }
      ]
    },
    {
      id: "menu",
      type: "ui",
      category: "background",
      name: "Menu Background",
      description: "Menu screen background",
      assets: [
        {
          type: "image",
          horizonAssetId: "1341821670869568",
          path: "assets/images/misc_menu.png"
        }
      ]
    },
    {
      id: "playboard",
      type: "ui",
      category: "background",
      name: "Playboard",
      description: "Battle playboard background",
      assets: [
        {
          type: "image",
          horizonAssetId: "802255839066806",
          path: "assets/images/misc_playboard.png"
        }
      ]
    },
    {
      id: "cards-container",
      type: "ui",
      category: "container",
      name: "Cards Container",
      description: "Cards collection screen container",
      assets: [
        {
          type: "image",
          horizonAssetId: "1360422829007789",
          path: "assets/images/misc_cards-container.png"
        }
      ]
    },
    {
      id: "mission-container",
      type: "ui",
      category: "container",
      name: "Mission Container",
      description: "Mission selection container",
      assets: [
        {
          type: "image",
          horizonAssetId: "828431839717203",
          path: "assets/images/misc_mission-container.png"
        }
      ]
    },
    {
      id: "standard-button",
      type: "ui",
      category: "button",
      name: "Standard Button",
      description: "Default button style (175x72)",
      assets: [
        {
          type: "image",
          horizonAssetId: "1976060856578244",
          path: "assets/images/ui_button_standard_default.png"
        }
      ]
    },
    {
      id: "green-button",
      type: "ui",
      category: "button",
      name: "Green Button",
      description: "Green variant button (175x72)",
      assets: [
        {
          type: "image",
          horizonAssetId: "3694695314172287",
          path: "assets/images/ui_button_standard_green.png"
        }
      ]
    },
    {
      id: "red-button",
      type: "ui",
      category: "button",
      name: "Red Button",
      description: "Red variant button (175x72)",
      assets: [
        {
          type: "image",
          horizonAssetId: "1607838330179321",
          path: "assets/images/ui_button_standard_red.png"
        }
      ]
    },
    {
      id: "yellow-button",
      type: "ui",
      category: "button",
      name: "Yellow Button",
      description: "Yellow variant button (175x72)",
      assets: [
        {
          type: "image",
          horizonAssetId: "1977156269826109",
          path: "assets/images/ui_button_standard_yellow.png"
        }
      ]
    },
    {
      id: "long-green-button",
      type: "ui",
      category: "button",
      name: "Long Green Button",
      description: "Long green button variant",
      assets: [
        {
          type: "image",
          horizonAssetId: "1842026620010613",
          path: "assets/images/misc_long-green-button.png"
        }
      ]
    },
    {
      id: "small-button",
      type: "ui",
      category: "button",
      name: "Small Button",
      description: "Small button variant (89x89)",
      assets: [
        {
          type: "image",
          horizonAssetId: "726833263789403",
          path: "assets/images/ui_button_small.png"
        }
      ]
    },
    {
      id: "container-side-menu",
      type: "ui",
      category: "container",
      name: "Side Menu Container",
      description: "Side menu panel container (225x497)",
      assets: [
        {
          type: "image",
          horizonAssetId: "4238983773013268",
          path: "assets/images/ui_container_side-menu.png"
        }
      ]
    },
    {
      id: "player-stats-container",
      type: "ui",
      category: "container",
      name: "Player Stats Container",
      description: "Container for player stats display",
      assets: [
        {
          type: "image",
          horizonAssetId: "2596874604027595",
          path: "assets/images/ui_container_player-stats.png"
        }
      ]
    },
    {
      id: "experience-bar",
      type: "ui",
      category: "other",
      name: "Experience Bar",
      description: "XP progress bar",
      assets: [
        {
          type: "image",
          horizonAssetId: "1151343029773719",
          path: "assets/images/cards_experience-bar.png"
        }
      ]
    },
    {
      id: "base-card",
      type: "ui",
      category: "frame",
      name: "Base Card Frame",
      description: "Default card frame template",
      assets: [
        {
          type: "image",
          horizonAssetId: "1559448588566044",
          path: "assets/images/cards_base-card.png"
        }
      ]
    },
    {
      id: "magic-card",
      type: "ui",
      category: "frame",
      name: "Magic Card Frame",
      description: "Magic card frame template",
      assets: [
        {
          type: "image",
          horizonAssetId: "2581420452257174",
          path: "assets/images/cards_magic-card.png"
        }
      ]
    },
    {
      id: "magic-card-playboard",
      type: "ui",
      category: "frame",
      name: "Magic Card Playboard",
      description: "Magic card on playboard",
      assets: [
        {
          type: "image",
          horizonAssetId: "2991234734402522",
          path: "assets/images/cards_magic-card-playboard.png"
        }
      ]
    },
    {
      id: "trap-card",
      type: "ui",
      category: "frame",
      name: "Trap Card Frame",
      description: "Trap card frame template",
      assets: [
        {
          type: "image",
          horizonAssetId: "3122347641277336",
          path: "assets/images/cards_trap-card.png"
        }
      ]
    },
    {
      id: "trap-card-playboard",
      type: "ui",
      category: "frame",
      name: "Trap Card Playboard",
      description: "Trap card on playboard",
      assets: [
        {
          type: "image",
          horizonAssetId: "1724877334843483",
          path: "assets/images/cards_trap-card-playboard.png"
        }
      ]
    },
    {
      id: "buff-card",
      type: "ui",
      category: "frame",
      name: "Buff Card Frame",
      description: "Buff card frame template",
      assets: [
        {
          type: "image",
          horizonAssetId: "3182045765293902",
          path: "assets/images/cards_buff-card.png"
        }
      ]
    },
    {
      id: "buff-card-playboard",
      type: "ui",
      category: "frame",
      name: "Buff Card Playboard",
      description: "Buff card on playboard",
      assets: [
        {
          type: "image",
          horizonAssetId: "2628573627486992",
          path: "assets/images/cards_buff-card-playboard.png"
        }
      ]
    },
    {
      id: "menu-frame-1",
      type: "ui",
      category: "frame",
      name: "Menu Frame 1",
      description: "Menu animation frame 1",
      assets: [
        {
          type: "image",
          horizonAssetId: "1186506656766961",
          path: "assets/images/menu_frame-1.png"
        }
      ]
    },
    {
      id: "menu-frame-2",
      type: "ui",
      category: "frame",
      name: "Menu Frame 2",
      description: "Menu animation frame 2",
      assets: [
        {
          type: "image",
          horizonAssetId: "816845231314389",
          path: "assets/images/menu_frame-2.png"
        }
      ]
    },
    {
      id: "menu-frame-3",
      type: "ui",
      category: "frame",
      name: "Menu Frame 3",
      description: "Menu animation frame 3",
      assets: [
        {
          type: "image",
          horizonAssetId: "2012665279305528",
          path: "assets/images/menu_frame-3.png"
        }
      ]
    },
    {
      id: "menu-frame-4",
      type: "ui",
      category: "frame",
      name: "Menu Frame 4",
      description: "Menu animation frame 4",
      assets: [
        {
          type: "image",
          horizonAssetId: "803392912558689",
          path: "assets/images/menu_frame-4.png"
        }
      ]
    },
    {
      id: "menu-frame-5",
      type: "ui",
      category: "frame",
      name: "Menu Frame 5",
      description: "Menu animation frame 5",
      assets: [
        {
          type: "image",
          horizonAssetId: "1141897134114548",
          path: "assets/images/menu_frame-5.png"
        }
      ]
    },
    {
      id: "menu-frame-6",
      type: "ui",
      category: "frame",
      name: "Menu Frame 6",
      description: "Menu animation frame 6",
      assets: [
        {
          type: "image",
          horizonAssetId: "1962288661350650",
          path: "assets/images/menu_frame-6.png"
        }
      ]
    },
    {
      id: "menu-frame-7",
      type: "ui",
      category: "frame",
      name: "Menu Frame 7",
      description: "Menu animation frame 7",
      assets: [
        {
          type: "image",
          horizonAssetId: "781356411339489",
          path: "assets/images/menu_frame-7.png"
        }
      ]
    },
    {
      id: "menu-frame-8",
      type: "ui",
      category: "frame",
      name: "Menu Frame 8",
      description: "Menu animation frame 8",
      assets: [
        {
          type: "image",
          horizonAssetId: "844985438202497",
          path: "assets/images/menu_frame-8.png"
        }
      ]
    },
    {
      id: "menu-frame-9",
      type: "ui",
      category: "frame",
      name: "Menu Frame 9",
      description: "Menu animation frame 9",
      assets: [
        {
          type: "image",
          horizonAssetId: "1340487887747224",
          path: "assets/images/menu_frame-9.png"
        }
      ]
    },
    {
      id: "menu-frame-10",
      type: "ui",
      category: "frame",
      name: "Menu Frame 10",
      description: "Menu animation frame 10",
      assets: [
        {
          type: "image",
          horizonAssetId: "1866001547625853",
          path: "assets/images/menu_frame-10.png"
        }
      ]
    },
    {
      id: "icon-attack",
      type: "ui",
      category: "icon",
      name: "Attack Icon",
      description: "Attack indicator icon",
      assets: [
        {
          type: "image",
          horizonAssetId: "818969787355942",
          path: "assets/images/icon_attack.png"
        }
      ]
    },
    {
      id: "icon-coin",
      type: "ui",
      category: "icon",
      name: "Coin Icon",
      description: "Coin currency icon",
      assets: [
        {
          type: "image",
          horizonAssetId: "4103662979871750",
          path: "assets/images/icon_coin.png"
        }
      ]
    },
    {
      id: "icon-serum",
      type: "ui",
      category: "icon",
      name: "Serum Icon",
      description: "Serum item icon",
      assets: [
        {
          type: "image",
          horizonAssetId: "1152818320384366",
          path: "assets/images/icon_serum.png"
        }
      ]
    },
    // Counter icons removed - counter system deprecated
    {
      id: "lose-image",
      type: "ui",
      category: "other",
      name: "Lose Image",
      description: "Game over/lose screen image",
      assets: [
        {
          type: "image",
          horizonAssetId: "2155452308310801",
          path: "assets/images/misc_lose-image.png"
        }
      ]
    },
    {
      id: "sfx-menu-button-select",
      type: "ui",
      category: "other",
      name: "Menu Button Select SFX",
      description: "Sound for menu button selection",
      assets: [
        {
          type: "audio",
          horizonAssetId: "3481449071995903",
          path: "assets/audio/sfx_menu-button-select.wav"
        }
      ]
    },
    {
      id: "sfx-play-card",
      type: "ui",
      category: "other",
      name: "Play Card SFX",
      description: "Sound for playing a card",
      assets: [
        {
          type: "audio",
          horizonAssetId: "673115269189210",
          path: "assets/audio/sfx_play-card.wav"
        }
      ]
    },
    {
      id: "sfx-attack",
      type: "ui",
      category: "other",
      name: "Attack SFX",
      description: "Sound for attack action",
      assets: [
        {
          type: "audio",
          horizonAssetId: "1718962638781724",
          path: "assets/audio/sfx_attack.wav"
        }
      ]
    },
    {
      id: "sfx-trap-card-activated",
      type: "ui",
      category: "other",
      name: "Trap Activated SFX",
      description: "Sound for trap activation",
      assets: [
        {
          type: "audio",
          horizonAssetId: "1180175093968172",
          path: "assets/audio/sfx_trap-card-activated.wav"
        }
      ]
    },
    {
      id: "sfx-low-health",
      type: "ui",
      category: "other",
      name: "Low Health SFX",
      description: "Warning sound for low health",
      assets: [
        {
          type: "audio",
          horizonAssetId: "828372796357589",
          path: "assets/audio/sfx_low-health.wav"
        }
      ]
    },
    {
      id: "sfx-win",
      type: "ui",
      category: "other",
      name: "Win SFX",
      description: "Victory sound effect",
      assets: [
        {
          type: "audio",
          horizonAssetId: "4241684452770634",
          path: "assets/audio/sfx_win.wav"
        }
      ]
    },
    {
      id: "sfx-lose",
      type: "ui",
      category: "other",
      name: "Lose SFX",
      description: "Defeat sound effect",
      assets: [
        {
          type: "audio",
          horizonAssetId: "1323050035978393",
          path: "assets/audio/sfx_lose.wav"
        }
      ]
    },
    {
      id: "sfx-upgrade",
      type: "ui",
      category: "other",
      name: "Upgrade SFX",
      description: "Sound for purchasing upgrades",
      assets: [
        {
          type: "audio",
          horizonAssetId: "PLACEHOLDER_ID",
          path: "assets/audio/sfx_upgrade.wav"
        }
      ]
    },
    {
      id: "sfx-upgrade-rooster",
      type: "ui",
      category: "other",
      name: "Upgrade Rooster SFX",
      description: "Sound for purchasing rooster upgrade",
      assets: [
        {
          type: "audio",
          horizonAssetId: "PLACEHOLDER_ID",
          path: "assets/audio/sfx_upgrade_rooster.wav"
        }
      ]
    },
    {
      id: "music-background",
      type: "ui",
      category: "other",
      name: "Background Music",
      description: "Main background music",
      assets: [
        {
          type: "audio",
          horizonAssetId: "802288129374217",
          path: "assets/audio/music_background.mp3"
        }
      ]
    },
    {
      id: "music-battle",
      type: "ui",
      category: "other",
      name: "Battle Music",
      description: "Battle scene music",
      assets: [
        {
          type: "audio",
          horizonAssetId: "668023946362739",
          path: "assets/audio/music_battle.mp3"
        }
      ]
    },
    {
      id: "upgrade-coin-boost",
      type: "ui",
      category: "upgrade",
      name: "Coin Boost Upgrade",
      description: "Coin boost upgrade icon",
      assets: [
        {
          type: "image",
          horizonAssetId: "1059820639487262",
          path: "assets/images/upgrade_coin-boost.png"
        }
      ]
    },
    {
      id: "upgrade-container-card",
      type: "ui",
      category: "upgrade",
      name: "Container Card Upgrade",
      description: "Container card upgrade icon",
      assets: [
        {
          type: "image",
          horizonAssetId: "3158472954326260",
          path: "assets/images/upgrade_container-card.png"
        }
      ]
    },
    {
      id: "upgrade-exp-boost",
      type: "ui",
      category: "upgrade",
      name: "Experience Boost Upgrade",
      description: "Experience boost upgrade icon",
      assets: [
        {
          type: "image",
          horizonAssetId: "662687460055242",
          path: "assets/images/upgrade_exp-boost.png"
        }
      ]
    },
    {
      id: "upgrade-luck-boost",
      type: "ui",
      category: "upgrade",
      name: "Luck Boost Upgrade",
      description: "Luck boost upgrade icon",
      assets: [
        {
          type: "image",
          horizonAssetId: "2054672501734665",
          path: "assets/images/upgrade_luck-boost.png"
        }
      ]
    },
    {
      id: "upgrade-rooster",
      type: "ui",
      category: "upgrade",
      name: "Rooster Upgrade",
      description: "Rooster upgrade icon",
      assets: [
        {
          type: "image",
          horizonAssetId: "1504708944108154",
          path: "assets/images/upgrade_rooster.png"
        }
      ]
    },
    {
      id: "upgrade-upgraded-box",
      type: "ui",
      category: "upgrade",
      name: "Upgraded Box",
      description: "Upgraded box icon",
      assets: [
        {
          type: "image",
          horizonAssetId: "814844064745019",
          path: "assets/images/upgrade_upgraded-box.png"
        }
      ]
    }
  ]
};
