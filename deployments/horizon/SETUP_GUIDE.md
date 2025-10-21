# BloomBeasts Horizon Setup Guide

## Problem: Custom UI Not Showing (No "E" to Interact)

If you don't see the interaction prompt, the Custom UI Panel isn't configured properly. Follow these steps:

## Step 1: Add Custom UI Panel Gizmo

1. **In Horizon Worlds Editor:**
   - Press `Tab` to open the **Gizmo Menu**
   - Go to **Scripting** category
   - Add a **Custom UI Panel** gizmo to your world
   - Position it where you want players to see the UI

2. **Configure Panel Size:**
   - Select the Custom UI Panel
   - Set dimensions to **1280 x 720** (our panel size)
   - Or use **16:9 aspect ratio**

## Step 2: Attach the UI Component

1. **Select the Custom UI Panel** in the world
2. **Open Properties Panel** (right side)
3. **In the Script section:**
   - Click **Add Script**
   - Find and select: `BloomBeastsUI`
   - Click **Attach**

## Step 3: Configure Asset Props

The BloomBeastsUI component needs 100+ asset props. You need to:

### Option A: Manual Assignment (Not Recommended)
Manually drag each image/audio asset to the corresponding prop slot.

### Option B: Use Asset Groups (Recommended)
1. Create asset folders in Horizon:
   - `images/ui/` - UI elements
   - `images/cards/` - Card images
   - `images/icons/` - Icon images
   - `audio/music/` - Music files
   - `audio/sfx/` - Sound effects

2. Upload assets with exact names matching props:
   - `img_Background` → Upload as "Background"
   - `img_cards_Fire_Blazefinch` → Upload as "cards/Fire/Blazefinch"
   - etc.

## Step 4: Set Up Persistent Variables

1. **In Horizon Editor**, go to **World Settings**
2. **Find Persistent Variables V2**
3. **Create a Player Variable Group**:
   - Name: `BloomBeastsPlayerData` (or any name)
   - Scope: **Player** (not World!)
4. **Add Variable**:
   - Name: **`bloomBeastsData`** (exact name!)
   - Type: **Object** or **Any**
   - Default: `{}` (empty object)

## Step 5: Test the Setup

1. **Publish/Test your world**
2. **Walk up to the Custom UI Panel**
3. You should see **"Press E to interact"**
4. **Press E** to open the UI
5. **Check console** for logs:
   ```
   BloomBeastsUI starting...
   Props available: [number] assets
   initializeUI called - creating UI structure
   ```

## Troubleshooting

### Issue: Still no "E" to interact
**Solutions:**
- Make sure Custom UI Panel is in an accessible location
- Check that BloomBeastsUI script is attached
- Try moving closer to the panel
- Restart the world/editor

### Issue: "E" shows but UI is blank
**Solutions:**
- Check console for errors
- Verify assets are loaded (`Props available: X`)
- Make sure at least `img_Background` is assigned

### Issue: Errors about persistent variables
**Solutions:**
- The UI will work without persistence (using defaults)
- Double-check variable name is exactly: `bloomBeastsData`
- Ensure it's a **Player** variable, not World variable

### Issue: Props assignment is tedious
**Alternative approach:**
You can modify the component to work with fewer props initially:

1. Test with just core UI elements:
   - `img_Background`
   - `img_Menu`
   - `img_SideMenu`
   - `img_StandardButton`

2. The rest will use fallback colors/shapes
3. Add more assets gradually

## Quick Test Without Assets

To verify the component works without all assets:

1. Attach BloomBeastsUI to Custom UI Panel
2. Don't assign any asset props
3. Press E to interact
4. You should see:
   - Black background
   - Green debug text: "BloomBeasts UI Loading..."
   - White text: "BLOOM BEASTS" (menu screen)
   - Colored fallback buttons

If you see this, the component is working! You can then add assets one by one.

## Expected Console Output (Successful Setup)

```
[User] BloomBeastsUI starting...
[User] World object: [World Entity]
[User] Props available: 110 assets
[User] initializeUI called - creating UI structure
[User] Platform initialize called, world: [World Entity]
[User] Current player: [Player Entity]
[User] Loading player data for: [Player]
[User] Loaded via world.data.player.get: [data or null]
[User] Platform initialized successfully
```

## Visual Setup Checklist

- [ ] Custom UI Panel gizmo added to world
- [ ] Panel positioned and scaled (1280x720 or 16:9)
- [ ] BloomBeastsUI script attached to panel
- [ ] Player persistent variable `bloomBeastsData` created
- [ ] At least basic UI assets uploaded (optional for testing)
- [ ] World published/tested
- [ ] "E" interaction prompt appears near panel
- [ ] UI opens when pressing E
- [ ] Console shows initialization logs

## Next Steps After Setup Works

Once you see the UI:
1. Navigate using side menu buttons (Missions, Cards, Settings)
2. Check that navigation changes screens
3. Verify player stats show correctly
4. Test card pagination (if cards screen works)
5. Check that data persists across sessions

Need help? Check the console output and compare with expected logs above.