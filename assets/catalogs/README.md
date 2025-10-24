# Asset Catalog System

This directory contains JSON-based asset catalogs that replace the dynamic asset generation system. Each catalog contains complete card definitions and asset mappings for different categories.

## Catalog Structure

Each catalog follows this structure:
- **version**: Catalog version for compatibility tracking
- **category**: The category of assets (fire, forest, sky, water, buff, trap, magic, common)
- **description**: Human-readable description
- **data**: Array of asset entries

## Asset Entry Types

### Beast Cards
```json
{
  "id": "card-id",
  "type": "beast",
  "cardType": "Bloom",
  "affinity": "fire|forest|sky|water",
  "data": {
    // Complete BloomBeastCard properties
    "id": "card-id",
    "name": "Card Name",
    "type": "Bloom",
    "affinity": "Fire",
    "cost": 2,
    "baseAttack": 3,
    "baseHealth": 2,
    "abilities": [...],
    "levelingConfig": {...}
  },
  "assets": [...]
}
```

### Habitat Cards
```json
{
  "id": "habitat-id",
  "type": "habitat",
  "affinity": "fire|forest|sky|water",
  "data": {
    // Complete HabitatCard properties
    "id": "habitat-id",
    "name": "Habitat Name",
    "type": "Habitat",
    "affinity": "Fire",
    "cost": 0,
    "abilities": [...]
  },
  "assets": [...]
}
```

### Magic/Trap/Buff Cards
```json
{
  "id": "card-id",
  "type": "magic|trap|buff",
  "data": {
    // Complete card properties based on type
    "id": "card-id",
    "name": "Card Name",
    "type": "Magic|Trap|Buff",
    "cost": 2,
    "abilities": [...],
    // Additional properties based on card type
  },
  "assets": [...]
}
```

## Abilities Structure

Abilities follow the StructuredAbility interface:

```json
{
  "name": "Ability Name",
  "trigger": "OnSummon|OnAttack|OnDamage|OnDestroy|Passive|etc",
  "effects": [
    {
      "type": "ModifyStats|DealDamage|Heal|DrawCards|etc",
      "target": "Self|Target|AllAllies|AllEnemies|etc",
      "value": 2,
      "duration": "Permanent|EndOfTurn|WhileOnField|etc"
    }
  ]
}
```

## Leveling Config Structure

For Bloom Beast cards:

```json
"levelingConfig": {
  "statGains": {
    "1": { "hp": 0, "atk": 0 },
    "2": { "hp": 1, "atk": 0 },
    "3": { "hp": 2, "atk": 1 },
    // ... up to level 9
  },
  "abilityUpgrades": {
    "4": { "abilities": [...] },
    "7": { "abilities": [...] },
    "9": { "abilities": [...] }
  }
}
```

## Files to Complete

### Affinity Catalogs
- [x] `forestAssets.json` - Forest affinity cards and assets
- [ ] `fireAssets.json` - Fire affinity cards and assets
- [ ] `skyAssets.json` - Sky affinity cards and assets
- [ ] `waterAssets.json` - Water affinity cards and assets

### Card Type Catalogs
- [ ] `buffAssets.json` - All buff cards
- [ ] `trapAssets.json` - All trap cards
- [ ] `magicAssets.json` - All magic cards

### Common Assets
- [x] `commonAssets.json` - UI elements, backgrounds, sounds

## Migration Steps

1. **Extract Card Data**: Copy all properties from TypeScript card definitions
2. **Map Assets**: Link each card to its image/sound assets
3. **Add Horizon IDs**: Replace `REPLACE_WITH_HORIZON_ID` with actual Horizon asset IDs
4. **Validate**: Use AssetValidator to ensure all required assets are present

## Horizon Asset ID Mapping

When deploying to Horizon, replace placeholder IDs with actual Horizon asset IDs:
- Image assets: Use Horizon texture/image asset IDs
- Audio assets: Use Horizon sound asset IDs

## Example: Completing Fire Assets

To complete `fireAssets.json`:

1. Find all Fire cards in `bloombeasts/engine/cards/fire/`
2. For each card (e.g., `blazefinch.ts`):
   - Copy the complete card definition
   - Convert TypeScript to JSON format
   - Include all abilities with proper structure
   - Add levelingConfig with all levels
   - Map to image assets in `shared/images/cards/Fire/`

3. Add Fire-specific UI elements:
   - Fire habitat cards
   - Fire mission card
   - Fire chests (opened/closed)
   - Fire affinity icon

## Testing

After creating catalogs, test with:

```typescript
import { AssetValidator } from '../../bloombeasts/AssetCatalogManager.example';

const validator = new AssetValidator();
const result = await validator.validateAssets();
console.log(result);
```

## Notes

- Keep all enums as strings (e.g., "Passive" not `AbilityTrigger.Passive`)
- Maintain exact property names from TypeScript interfaces
- Include all properties even if optional (use null if not applicable)
- Asset paths are relative to project root
- Horizon IDs will be provided by the Horizon world configuration