/**
 * Generate test files from JSON catalog data
 */

const fs = require('fs');
const path = require('path');

const catalogMap = {
  'forest': 'forestAssets',
  'fire': 'fireAssets',
  'water': 'waterAssets',
  'sky': 'skyAssets',
  'magic': 'magicAssets',
  'trap': 'trapAssets',
  'buff': 'buffAssets',
  'common': 'commonAssets'
};

function escapeString(str) {
  return str.replace(/'/g, "\\'");
}

function generateBloomBeastTest(card, catalogName) {
  const cardId = card.id;
  const cardConstName = cardId.toUpperCase().replace(/-/g, '_');
  const cardName = escapeString(card.name);
  const affinityName = escapeString(card.affinity);

  if (!card.abilities || card.abilities.length === 0) {
    console.log(`  Warning: ${cardId} has no abilities`);
    card.abilities = [{ name: 'Unknown', trigger: 'Passive', effects: [] }];
  }

  const abilityName = escapeString(card.abilities[0].name);

  return `/**
 * Tests for ${cardName} - ${affinityName} card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const ${cardConstName} = loadCardFromJSON('${cardId}', '${catalogName}');

describe('${cardName} Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(${cardConstName});
    });

    test('should have correct card properties', () => {
      expect(${cardConstName}.id).toBe('${cardId}');
      expect(${cardConstName}.name).toBe('${cardName}');
      expect(${cardConstName}.type).toBe('Bloom');
      expect(${cardConstName}.affinity).toBe('${affinityName}');
      expect(${cardConstName}.cost).toBe(${card.cost});
      expect(${cardConstName}.baseAttack).toBe(${card.baseAttack});
      expect(${cardConstName}.baseHealth).toBe(${card.baseHealth});
    });
  });

  describe('Base Ability - ${abilityName}', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(${cardConstName}.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(${cardConstName}.abilities[0].name).toBe('${abilityName}');
    });

    test('should have correct trigger', () => {
      expect(${cardConstName}.abilities[0].trigger).toBe('${card.abilities[0].trigger}');
    });

    test('should have correct effects', () => {
      expect(${cardConstName}.abilities[0].effects).toBeDefined();
      expect(${cardConstName}.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(${cardConstName});
    });

    test('should have stat gains for all levels', () => {
      expect(${cardConstName}.levelingConfig).toBeDefined();
      expect(${cardConstName}.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(${cardConstName}.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(${cardConstName});
    });
  });
${generateAbilityUpgradeTests(card, cardConstName)}
});
`;
}

function generateAbilityUpgradeTests(card, cardConstName) {
  if (!card.levelingConfig?.abilityUpgrades) return '';

  let tests = '';
  const upgrades = card.levelingConfig.abilityUpgrades;

  Object.keys(upgrades).forEach(level => {
    const upgrade = upgrades[level];
    if (upgrade.abilities && upgrade.abilities.length > 0) {
      const ability = upgrade.abilities[0];
      const upgradeName = escapeString(ability.name);

      tests += `
  describe('Level ${level} Upgrade - ${upgradeName}', () => {
    test('should have upgraded ability at level ${level}', () => {
      const upgrade = ${cardConstName}.levelingConfig?.abilityUpgrades?.[${level}];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = ${cardConstName}.levelingConfig?.abilityUpgrades?.[${level}];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('${upgradeName}');
    });

    test('should have correct trigger', () => {
      const upgrade = ${cardConstName}.levelingConfig?.abilityUpgrades?.[${level}];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('${ability.trigger}');
    });
  });
`;
    }
  });

  return tests;
}

function generateMagicCardTest(card, catalogName) {
  const cardId = card.id;
  const cardConstName = cardId.toUpperCase().replace(/-/g, '_');
  const cardName = escapeString(card.name);

  if (!card.abilities || card.abilities.length === 0) {
    console.log(`  Warning: ${cardId} has no abilities`);
    card.abilities = [{ name: 'Unknown', effects: [] }];
  }

  const abilityName = escapeString(card.abilities[0].name);

  return `/**
 * Tests for ${cardName} - Magic card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateMagicCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const ${cardConstName} = loadCardFromJSON('${cardId}', '${catalogName}');

describe('${cardName} Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(${cardConstName});
    });

    test('should have correct card properties', () => {
      expect(${cardConstName}.id).toBe('${cardId}');
      expect(${cardConstName}.name).toBe('${cardName}');
      expect(${cardConstName}.type).toBe('Magic');
      expect(${cardConstName}.cost).toBe(${card.cost});
    });
  });

  describe('Ability - ${abilityName}', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(${cardConstName}.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(${cardConstName}.abilities[0].name).toBe('${abilityName}');
    });

    test('should have correct effects', () => {
      expect(${cardConstName}.abilities[0].effects).toBeDefined();
      expect(${cardConstName}.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
`;
}

function generateTrapCardTest(card, catalogName) {
  const cardId = card.id;
  const cardConstName = cardId.toUpperCase().replace(/-/g, '_');
  const cardName = escapeString(card.name);

  if (!card.abilities || card.abilities.length === 0) {
    console.log(`  Warning: ${cardId} has no abilities`);
    card.abilities = [{ name: 'Unknown', effects: [] }];
  }

  const abilityName = escapeString(card.abilities[0].name);

  return `/**
 * Tests for ${cardName} - Trap card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateTrapCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const ${cardConstName} = loadCardFromJSON('${cardId}', '${catalogName}');

describe('${cardName} Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid trap card structure', () => {
      validateTrapCard(${cardConstName});
    });

    test('should have correct card properties', () => {
      expect(${cardConstName}.id).toBe('${cardId}');
      expect(${cardConstName}.name).toBe('${cardName}');
      expect(${cardConstName}.type).toBe('Trap');
      expect(${cardConstName}.cost).toBe(${card.cost});
    });

    test('should have activation trigger', () => {
      expect(${cardConstName}.activation).toBeDefined();
      expect(${cardConstName}.activation.trigger).toBeDefined();
    });
  });

  describe('Ability - ${abilityName}', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(${cardConstName}.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(${cardConstName}.abilities[0].name).toBe('${abilityName}');
    });

    test('should have correct effects', () => {
      expect(${cardConstName}.abilities[0].effects).toBeDefined();
      expect(${cardConstName}.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
`;
}

function generateBuffCardTest(card, catalogName) {
  const cardId = card.id;
  const cardConstName = cardId.toUpperCase().replace(/-/g, '_');
  const cardName = escapeString(card.name);

  return `/**
 * Tests for ${cardName} - Buff card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateBuffCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const ${cardConstName} = loadCardFromJSON('${cardId}', '${catalogName}');

describe('${cardName} Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid buff card structure', () => {
      validateBuffCard(${cardConstName});
    });

    test('should have correct card properties', () => {
      expect(${cardConstName}.id).toBe('${cardId}');
      expect(${cardConstName}.name).toBe('${cardName}');
      expect(${cardConstName}.type).toBe('Buff');
      expect(${cardConstName}.cost).toBe(${card.cost});
    });
  });

  describe('Abilities', () => {
    test('should have at least one ability', () => {
      expect(${cardConstName}.abilities).toBeDefined();
      expect(${cardConstName}.abilities.length).toBeGreaterThan(0);
    });

    test('should have valid first ability', () => {
      validateStructuredAbility(${cardConstName}.abilities[0] as StructuredAbility);
    });
  });
});
`;
}

function generateHabitatCardTest(card, catalogName) {
  const cardId = card.id;
  const cardConstName = cardId.toUpperCase().replace(/-/g, '_');
  const cardName = escapeString(card.name);
  const affinityName = escapeString(card.affinity);

  return `/**
 * Tests for ${cardName} - Habitat card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateHabitatCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const ${cardConstName} = loadCardFromJSON('${cardId}', '${catalogName}');

describe('${cardName} Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid habitat card structure', () => {
      validateHabitatCard(${cardConstName});
    });

    test('should have correct card properties', () => {
      expect(${cardConstName}.id).toBe('${cardId}');
      expect(${cardConstName}.name).toBe('${cardName}');
      expect(${cardConstName}.type).toBe('Habitat');
      expect(${cardConstName}.affinity).toBe('${affinityName}');
      expect(${cardConstName}.cost).toBe(${card.cost});
    });
  });

  describe('Abilities', () => {
    test('should have at least one ability', () => {
      expect(${cardConstName}.abilities).toBeDefined();
      expect(${cardConstName}.abilities.length).toBeGreaterThan(0);
    });
  });
});
`;
}

// Main processing
console.log('Generating tests from JSON catalogs...\n');

for (const [catalogName, fileName] of Object.entries(catalogMap)) {
  const catalogPath = path.join(__dirname, 'assets', 'catalogs', `${fileName}.json`);

  if (!fs.existsSync(catalogPath)) {
    console.log(`Skipping ${catalogName} - file not found`);
    continue;
  }

  const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
  console.log(`Processing ${catalogName} catalog...`);

  // Create test directory
  const testDir = path.join(__dirname, 'bloombeasts', 'engine', 'cards', '__tests__', catalogName);
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  catalogData.data.forEach(entry => {
    const card = entry.data;

    // Skip if no card data
    if (!card || !card.type) {
      console.log(`  Skipping entry - no valid card data`);
      return;
    }

    let testContent = '';

    // Generate appropriate test based on card type
    if (card.type === 'Bloom') {
      testContent = generateBloomBeastTest(card, catalogName);
    } else if (card.type === 'Magic') {
      testContent = generateMagicCardTest(card, catalogName);
    } else if (card.type === 'Trap') {
      testContent = generateTrapCardTest(card, catalogName);
    } else if (card.type === 'Buff') {
      testContent = generateBuffCardTest(card, catalogName);
    } else if (card.type === 'Habitat') {
      testContent = generateHabitatCardTest(card, catalogName);
    } else {
      console.log(`  Skipping ${card.id} - unknown type ${card.type}`);
      return;
    }

    const testFilePath = path.join(testDir, `${card.id}.test.ts`);
    fs.writeFileSync(testFilePath, testContent, 'utf-8');
    console.log(`  ✓ Generated ${card.id}.test.ts`);
  });
}

console.log('\nDone! Test files generated in bloombeasts/engine/cards/__tests__/');
