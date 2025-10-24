# Bloom Beasts Card Game - TypeScript Implementation

A comprehensive TypeScript implementation of the Bloom Beasts card game, featuring a sophisticated leveling system, perk mechanics, and four unique starter decks.

## Project Structure

```
scripts/
└── bloombeasts/     # Game logic (separate from UI)
    ├── types/           # TypeScript type definitions
    │   ├── core.ts      # Core card and game types
    │   ├── leveling.ts  # Leveling and progression types
    │   └── game.ts      # Game state and action types
    │
    ├── systems/         # Game system implementations
    │   ├── LevelingSystem.ts  # XP, level-ups, stat progression
    │   └── PerkSystem.ts      # Perk selection and application
    │
    ├── data/            # Card and perk data
    │   ├── sharedCards.ts     # Core cards (14 shared)
    │   ├── forestDeck.ts      # Forest affinity cards
    │   ├── fireDeck.ts        # Fire affinity cards
    │   ├── waterDeck.ts       # Water affinity cards
    │   ├── skyDeck.ts         # Sky affinity cards
    │   └── perks.ts           # Potency and Mastery perks
    │
    ├── constants/       # Game constants
    │   └── leveling.ts  # XP requirements, stat gains
    │
    ├── utils/           # Utility functions
    │   ├── deckBuilder.ts     # Deck construction and management
    │   └── cardHelpers.ts     # Card queries and filters
    │
    ├── examples/        # Usage examples
    │   ├── basicGameFlow.ts   # Leveling & combat demo
    │   └── deckAnalysis.ts    # Deck statistics
    │
    ├── index.ts         # Main export file
    └── README.md        # This file
```

## Key Features

### Leveling System
- **XP Gain**: Beasts gain XP through combat victories or nectar sacrifice
- **Level Progression**: Level 1-9 with increasing XP requirements (2-9 XP per level)
- **Stat Gains**: Cumulative HP and ATK bonuses at each level
- **Perk Unlocks**:
  - Level 4: Potency Perks (generic utility)
  - Level 7: Mastery Perks (affinity-specific power)

### Perk System

#### Tier 1: Potency Perks (Level 4)
- **Potent Strike**: +1 ATK vs different affinities
- **Iron Will**: Cannot be destroyed by magic effects
- **Swift Reposition**: Move after attacking
- **Nectar Harvest**: Gain temporary nectar on kill

#### Tier 2: Mastery Perks (Level 7)
- **Sustained Bloom** (Forest): Enhanced healing in Ancient Forest
- **Wildfire** (Fire): Double burn counter application
- **Deep Freeze** (Water): ATK reduction in Deep Sea Grotto
- **Celestial Guidance** (Sky): Draw card on summon in Clear Zenith
- **Apex Form** (Generic): Gain Guard ability

### Starter Decks (30 cards each)
1. **Forest**: The Growth Deck - Defensive growth and resource denial
2. **Fire**: The Aggro Deck - Direct damage and burn effects
3. **Water**: The Control Deck - Defense, healing, and control
4. **Sky**: The Utility Deck - Mobility and card advantage

## Usage Examples

### Building a Deck

```typescript
import { buildForestDeck, shuffleDeck, validateDeck } from './bloombeasts/utils/deckBuilder';

// Build a starter deck
const forestDeck = buildForestDeck();
console.log(`${forestDeck.name} - ${forestDeck.totalCards} cards`);

// Shuffle the deck
const shuffledCards = shuffleDeck(forestDeck.cards);

// Validate deck
const validation = validateDeck(forestDeck.cards);
if (validation.valid) {
  console.log('Deck is valid!');
}
```

### Leveling a Beast

```typescript
import { LevelingSystem } from './bloombeasts/systems/LevelingSystem';
import { MOSSLET } from './bloombeasts/data/forestDeck';

// Create a beast instance
const mosslet = LevelingSystem.createBeastInstance(MOSSLET, 'mosslet-001', 0);

// Add combat XP
let leveledMosslet = LevelingSystem.addCombatXP(mosslet);

// Add nectar XP
leveledMosslet = LevelingSystem.addNectarXP(leveledMosslet, 1);

// Check level and stats
console.log(`Level: ${leveledMosslet.currentLevel}`);
console.log(`ATK: ${leveledMosslet.currentAttack}, HP: ${leveledMosslet.currentHealth}`);
```

### Assigning Perks

```typescript
import { PerkSystem } from './bloombeasts/systems/PerkSystem';

// Check if perk selection is needed
if (PerkSystem.needsPotencyPerkSelection(beast)) {
  // Get available perks
  const availablePerks = PerkSystem.getAvailablePotencyPerks();

  // Assign a perk
  beast = PerkSystem.assignPotencyPerk(beast, 'PotentStrike');
}

// Check assigned perks
const perks = PerkSystem.getAssignedPerks(beast);
console.log('Potency Perk:', perks.potency?.name);
```

### Querying Cards

```typescript
import { filterByType, filterByAffinity, getBloomBeasts } from './bloombeasts/utils/cardHelpers';
import { getAllStarterDecks } from './bloombeasts/utils/deckBuilder';

const allDecks = getAllStarterDecks();
const forestCards = allDecks[0].cards;

// Filter by type
const magicCards = filterByType(forestCards, 'Magic');

// Get all beasts
const beasts = getBloomBeasts(forestCards);

// Filter by affinity
const forestBeasts = filterByAffinity(forestCards, 'Forest');
```

## Type Safety

All game elements are fully typed with TypeScript, providing:
- Compile-time type checking
- IntelliSense support
- Clear interfaces for game logic
- Type-safe card operations

## Card Data Format

Each card includes:
- Unique ID and name
- Type (Resource, Magic, Trap, Bloom, Habitat)
- Cost in Nectar
- Abilities and effects
- Image generation prompts (for Midjourney/AI art)

## Next Steps

To extend this implementation:
1. Add combat system logic
2. Implement habitat shift mechanics
3. Create game state management
4. Build UI/rendering layer
5. Add multiplayer networking
6. Implement AI opponents

## License

All rights reserved. Bloom Beasts card game system.
