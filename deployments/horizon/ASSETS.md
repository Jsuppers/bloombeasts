# BloomBeasts Asset Setup for Meta Horizon

This guide explains how to configure the BloomBeasts game assets in Meta Horizon World Builder.

## Overview

The `BloomBeastsUI` component uses **Props** to load all game assets. The component has **109 Props** (99 images + 10 audio files) that match the assets from the web version.

**Asset Build Process:**
1. Run `npm run build:props` to flatten assets from `shared/images` and `shared/audio` into `dist/props/`
2. This creates flattened filenames (e.g., `cards/Fire/CinderPup.png` → `cards_Fire_CinderPup.png`)
3. Upload all files from `dist/props/images` and `dist/props/audio` to Meta Horizon's asset library
4. Assign each asset to the corresponding Prop in the Properties panel

When you attach this component to an entity in your world, you'll see all 109 asset properties in the Properties panel where you can assign references to your uploaded assets.

## Asset Properties (109 Total)

All asset properties in the `BloomBeastsUI` component are prefixed to organize them:
- `img_*` - Image assets (99 total)
- `audio_*` - Audio assets (10 total)

### UI Elements (11)
- `img_Background` - Main game background
- `img_CardsContainer` - Cards collection container
- `img_GreenButton` - Green action button
- `img_LongGreenButton` - Wide green button
- `img_LoseImage` - Loss screen image
- `img_Menu` - Main menu background
- `img_MissionContainer` - Mission selection container
- `img_Playboard` - Battle board background
- `img_RedButton` - Red/danger button
- `img_SideMenu` - Side panel frame
- `img_StandardButton` - Standard gray button

### Affinity Icons (4)
- `img_affinity_FireIcon`
- `img_affinity_ForestIcon`
- `img_affinity_SkyIcon`
- `img_affinity_WaterIcon`

### Card Templates & Base Cards (10)
- `img_cards_BaseCard`
- `img_cards_BossMission`
- `img_cards_BuffCard`
- `img_cards_BuffCardPlayboard`
- `img_cards_ExperienceBar`
- `img_cards_MagicCard`
- `img_cards_MagicCardPlayboard`
- `img_cards_TheBloomMaster`
- `img_cards_TrapCard`
- `img_cards_TrapCardPlayboard`

### Buff Cards (4)
- `img_cards_Buff_BattleFury`
- `img_cards_Buff_MysticShield`
- `img_cards_Buff_NaturesBlessing`
- `img_cards_Buff_SwiftWind`

### Fire Cards (9)
- `img_cards_Fire_Blazefinch`
- `img_cards_Fire_Charcoil`
- `img_cards_Fire_CinderPup`
- `img_cards_Fire_FireMission`
- `img_cards_Fire_HabitatCard`
- `img_cards_Fire_HabitatCardPlayboard`
- `img_cards_Fire_Magmite`
- `img_cards_Fire_VolcanicScar`

### Forest Cards (9)
- `img_cards_Forest_AncientForest`
- `img_cards_Forest_ForestMission`
- `img_cards_Forest_HabitatCard`
- `img_cards_Forest_HabitatCardPlayboard`
- `img_cards_Forest_LeafSprite`
- `img_cards_Forest_Mosslet`
- `img_cards_Forest_Mushroomancer`
- `img_cards_Forest_Rootling`

### Magic Cards (10)
- `img_cards_Magic_AetherSwap`
- `img_cards_Magic_CleansingDownpour`
- `img_cards_Magic_ElementalBurst`
- `img_cards_Magic_LightningStrike`
- `img_cards_Magic_NectarBlock`
- `img_cards_Magic_NectarDrain`
- `img_cards_Magic_NectarSurge`
- `img_cards_Magic_Overgrowth`
- `img_cards_Magic_PowerUp`
- `img_cards_Magic_Purify`

### Sky Cards (9)
- `img_cards_Sky_AeroMoth`
- `img_cards_Sky_CirrusFloof`
- `img_cards_Sky_ClearZenith`
- `img_cards_Sky_GaleGlider`
- `img_cards_Sky_HabitatCard`
- `img_cards_Sky_HabitatCardPlayboard`
- `img_cards_Sky_SkyMission`
- `img_cards_Sky_StarBloom`

### Trap Cards (8)
- `img_cards_Trap_BearTrap`
- `img_cards_Trap_EmergencyBloom`
- `img_cards_Trap_HabitatLock`
- `img_cards_Trap_HabitatShield`
- `img_cards_Trap_MagicSheild`
- `img_cards_Trap_ThornSnare`
- `img_cards_Trap_Vaporize`
- `img_cards_Trap_XPHarvest`

### Water Cards (9)
- `img_cards_Water_AquaPebble`
- `img_cards_Water_Bubblefin`
- `img_cards_Water_DeepSeaGrotto`
- `img_cards_Water_DewdropDrake`
- `img_cards_Water_HabitatCard`
- `img_cards_Water_HabitatCardPlayboard`
- `img_cards_Water_KelpCub`
- `img_cards_Water_WaterMission`

### Chests (8)
- `img_chests_FireChestClosed`
- `img_chests_FireChestOpened`
- `img_chests_ForestChestClosed`
- `img_chests_ForestChestOpened`
- `img_chests_SkyChestClosed`
- `img_chests_SkyChestOpened`
- `img_chests_WaterChestClosed`
- `img_chests_WaterChestOpened`

### Icons (2)
- `img_icons_ability`
- `img_icons_attack`

### Menu Frames (10)
- `img_menu_Frame1` through `img_menu_Frame10`

### Audio Files (10)
- `audio_BackgroundMusic` - Main menu music (MP3)
- `audio_BattleMusic` - Combat music (MP3)
- `audio_sfx_attack` - Attack sound effect (WAV)
- `audio_sfx_lose` - Loss sound (WAV)
- `audio_sfx_lowHealthSound` - Low health warning (WAV)
- `audio_sfx_menuButtonSelect` - Button click (WAV)
- `audio_sfx_playCard` - Card play sound (WAV)
- `audio_sfx_sfx_sounds_button6` - UI sound (WAV)
- `audio_sfx_trapCardActivated` - Trap activation (WAV)
- `audio_sfx_win` - Victory sound (OGG)

## Setup Instructions

### Step 1: Build Flattened Assets

From the project root directory:

```bash
npm run build:props
```

This will:
- Copy all images from `shared/images` to `dist/props/images`
- Copy all audio from `shared/audio` to `dist/props/audio`
- Flatten directory structures (e.g., `cards/Fire/CinderPup.png` → `cards_Fire_CinderPup.png`)
- Generate `dist/props/manifest.json` with a complete asset list

### Step 2: Upload Assets to Horizon

1. In Meta Horizon World Builder, go to **Assets > Images**
2. Upload all files from `dist/props/images` (99 images)
3. Go to **Assets > Audio** and upload all files from `dist/props/audio` (10 audio files)
4. Keep track of the uploaded asset names/IDs for reference

### Step 3: Attach Component to Entity

1. Create or select an entity in your world (can be an invisible entity)
2. In the **Components** panel, click **Add Component**
3. Select **BloomBeastsUI** from the script components list

### Step 4: Configure Asset Properties

1. With the entity selected, open the **Properties** panel
2. You'll see all **109 asset properties** organized by prefix (`img_*` and `audio_*`)
3. For each property:
   - Click the property field
   - Select the corresponding asset from your uploaded assets
   - The property names match the flattened filenames (with `.png`, `.mp3`, etc. removed)
   - Example: `img_cards_Fire_CinderPup` maps to `cards_Fire_CinderPup.png`

**Tips:**
- Use the search function in the Properties panel to quickly find assets
- Properties are organized by category (UI Elements, Fire Cards, etc.)
- You can assign assets gradually - missing assets will result in missing UI elements but won't break the game

### Step 5: Test

1. Click **Play** in World Builder to test your world
2. The game should load with all your configured assets
3. If assets don't appear, check the console for errors and verify all properties are set

## Asset Requirements

### Image Formats

All images are in PNG format with transparency support (RGBA color mode).

### Audio Formats

- Background/battle music: MP3 format
- Sound effects: WAV or OGG format

### Optimization

- Compress images to reduce world size (all assets are already optimized)
- Total uncompressed size: ~50MB for all assets
- Meta Horizon may further compress assets upon upload

## Troubleshooting

### Assets Not Appearing

1. **Check Properties**: Ensure all required properties have been assigned in the Properties panel
2. **Verify Upload**: Confirm assets were successfully uploaded to Horizon's asset library
3. **Check Console**: Look for error messages in the Horizon console
4. **Refresh**: Try reloading the world or restarting World Builder

### Asset Quality Issues

1. **Resolution**: Ensure images meet recommended dimensions
2. **Compression**: Balance file size vs quality
3. **Alpha Channel**: Verify transparency is preserved in PNG files

### Performance Issues

1. **File Size**: Keep individual images under 1MB when possible
2. **Total Assets**: Monitor total asset size for your world
3. **Optimization**: Use tools like TinyPNG to compress images

## Asset Architecture

The game now includes **all card artwork** as Props, matching the web version:

- **Individual Card Images**: Each beast, magic, trap, and buff card has its own artwork
- **Card Templates**: Base templates for card types (for fallback or future use)
- **Playboard Variants**: Separate images for cards when displayed on the battle board
- **Mission Backgrounds**: Unique images for each mission type
- **Chest Assets**: Opened and closed states for all affinity chests
- **Menu Frames**: 10 frame images for animated UI elements

This comprehensive approach ensures visual parity with the web version and allows for rich card artwork display.

## Using the Flattened Assets

After running `npm run build:props`, all assets are in a flat structure:

```
dist/props/
├── images/ (99 files)
│   ├── Background.png
│   ├── cards_Fire_CinderPup.png
│   ├── cards_Fire_Blazefinch.png
│   ├── affinity_FireIcon.png
│   └── ... (95 more images)
└── audio/ (10 files)
    ├── BackgroundMusic.mp3
    ├── BattleMusic.mp3
    ├── sfx_attack.wav
    └── ... (7 more audio files)
```

The `manifest.json` file lists all assets with their counts and metadata for reference.

## Notes

- **109 Props Total**: This is a large number but necessary to match the web version's visual fidelity
- **Gradual Configuration**: You can assign assets gradually; missing assets won't break the game
- **Per-Entity Configuration**: Props are configured per-entity, allowing multiple instances with different asset sets
- **Naming Convention**: Property names match flattened filenames without extensions (e.g., `cards_Fire_CinderPup.png` → `img_cards_Fire_CinderPup`)
- **Search Friendly**: Use Meta Horizon's search function in the Properties panel to quickly find specific assets
