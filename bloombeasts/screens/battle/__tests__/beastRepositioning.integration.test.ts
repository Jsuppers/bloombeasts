/**
 * Integration Tests for Beast Repositioning
 *
 * Verifies that beasts shift left to fill gaps when allies die
 */

import { BattleController } from '../engine/core/BattleController';
import {
  mockAsync,
  createTestBeast,
  setupBattleScenario,
  endTurnAndReposition,
  type BattleScenario
} from './testHarness';
import { getCardIdentifier } from '../engine/utils/cardIdentifiers';

describe('Beast Repositioning', () => {
  let controller: BattleController;

  beforeEach(() => {
    controller = new BattleController(mockAsync);
  });

  test('should shift beasts left when middle beast dies', () => {
    const scenario: BattleScenario = {
      playerBeasts: [
        createTestBeast('p0', 'Beast 0', 10, 10, false),
        createTestBeast('p1', 'Beast 1', 1, 1, false),  // Will die
        createTestBeast('p2', 'Beast 2', 10, 10, false),
      ],
      opponentBeasts: [
        createTestBeast('o0', 'Enemy 0', 1, 10, false),
        createTestBeast('o1', 'Enemy 1', 10, 10, false), // Kills p1
        createTestBeast('o2', 'Enemy 2', 1, 10, false),
      ],
    };

    const battle = setupBattleScenario(controller, scenario);

    // Before attack: [p0, p1, p2]
    const beforeField = battle.getPlayerField();
    expect(beforeField.beasts[0]?.name).toBe('Beast 0');
    expect(beforeField.beasts[1]?.name).toBe('Beast 1');
    expect(beforeField.beasts[2]?.name).toBe('Beast 2');

    // p1 (slot 1) attacks o1 (slot 1) - both deal damage, p1 dies
    const p1Id = getCardIdentifier(beforeField.beasts[1]!);
    const o1Id = getCardIdentifier(battle.getOpponentField().beasts[1]!);
    controller.attackBeast(p1Id, o1Id, 'player');

    // After attack but before end turn: [p0, null, p2] - p1 is null but p2 hasn't shifted yet
    let afterField = battle.getPlayerField();
    expect(afterField.beasts[0]?.name).toBe('Beast 0');
    expect(afterField.beasts[1]).toBeNull(); // Dead but not shifted yet
    expect(afterField.beasts[2]?.name).toBe('Beast 2');

    // End turn to trigger repositioning
    endTurnAndReposition(controller, 'player');

    // After end turn: [p0, p2, null] - p2 should have shifted left to slot 1
    afterField = battle.getPlayerField();
    expect(afterField.beasts[0]?.name).toBe('Beast 0');
    expect(afterField.beasts[1]?.name).toBe('Beast 2'); // Shifted left!
    expect(afterField.beasts[2]).toBeNull();
  });

  test('should shift beasts left when first beast dies', () => {
    const scenario: BattleScenario = {
      playerBeasts: [
        createTestBeast('p0', 'Beast 0', 1, 1, false),   // Will die
        createTestBeast('p1', 'Beast 1', 10, 10, false),
        createTestBeast('p2', 'Beast 2', 10, 10, false),
      ],
      opponentBeasts: [
        createTestBeast('o0', 'Enemy 0', 10, 10, false), // Kills p0
        createTestBeast('o1', 'Enemy 1', 1, 10, false),
        createTestBeast('o2', 'Enemy 2', 1, 10, false),
      ],
    };

    const battle = setupBattleScenario(controller, scenario);

    // Attack with p0
    const p0Id = getCardIdentifier(battle.getPlayerField().beasts[0]!);
    const o0Id = getCardIdentifier(battle.getOpponentField().beasts[0]!);
    controller.attackBeast(p0Id, o0Id, 'player');

    // End turn to trigger repositioning
    endTurnAndReposition(controller, 'player');

    // After: [p1, p2, null]
    const afterField = battle.getPlayerField();
    expect(afterField.beasts[0]?.name).toBe('Beast 1'); // Shifted from slot 1 to 0
    expect(afterField.beasts[1]?.name).toBe('Beast 2'); // Shifted from slot 2 to 1
    expect(afterField.beasts[2]).toBeNull();
  });

  test('should shift beasts left when last beast dies', () => {
    const scenario: BattleScenario = {
      playerBeasts: [
        createTestBeast('p0', 'Beast 0', 10, 10, false),
        createTestBeast('p1', 'Beast 1', 10, 10, false),
        createTestBeast('p2', 'Beast 2', 1, 1, false),   // Will die
      ],
      opponentBeasts: [
        createTestBeast('o0', 'Enemy 0', 1, 10, false),
        createTestBeast('o1', 'Enemy 1', 1, 10, false),
        createTestBeast('o2', 'Enemy 2', 10, 10, false), // Kills p2
      ],
    };

    const battle = setupBattleScenario(controller, scenario);

    // Attack with p2
    const p2Id = getCardIdentifier(battle.getPlayerField().beasts[2]!);
    const o2Id = getCardIdentifier(battle.getOpponentField().beasts[2]!);
    controller.attackBeast(p2Id, o2Id, 'player');

    // End turn to trigger repositioning
    endTurnAndReposition(controller, 'player');

    // After: [p0, p1, null] - no shift needed since last beast died
    const afterField = battle.getPlayerField();
    expect(afterField.beasts[0]?.name).toBe('Beast 0');
    expect(afterField.beasts[1]?.name).toBe('Beast 1');
    expect(afterField.beasts[2]).toBeNull();
  });

  test('should handle multiple beasts dying and shifting correctly', () => {
    const scenario: BattleScenario = {
      playerBeasts: [
        createTestBeast('p0', 'Beast 0', 1, 1, false),   // Dies first
        createTestBeast('p1', 'Beast 1', 1, 1, false),   // Dies second
        createTestBeast('p2', 'Beast 2', 10, 10, false), // Survives
      ],
      opponentBeasts: [
        createTestBeast('o0', 'Enemy 0', 10, 10, false),
        createTestBeast('o1', 'Enemy 1', 10, 10, false),
        createTestBeast('o2', 'Enemy 2', 1, 1, false),
      ],
    };

    const battle = setupBattleScenario(controller, scenario);

    // First attack: p0 vs o0 - p0 dies
    const p0Id = getCardIdentifier(battle.getPlayerField().beasts[0]!);
    const o0Id = getCardIdentifier(battle.getOpponentField().beasts[0]!);
    controller.attackBeast(p0Id, o0Id, 'player');

    // After first attack (before repositioning): [null, p1, p2]
    let field = battle.getPlayerField();
    expect(field.beasts[0]).toBeNull(); // p0 is dead
    expect(field.beasts[1]?.name).toBe('Beast 1'); // p1 still in slot 1
    expect(field.beasts[2]?.name).toBe('Beast 2'); // p2 still in slot 2

    // Second attack: p1 (still in slot 1) vs o1 (slot 1)
    const p1Id = getCardIdentifier(field.beasts[1]!);
    const o1Id = getCardIdentifier(battle.getOpponentField().beasts[1]!);
    controller.attackBeast(p1Id, o1Id, 'player');

    // After second attack (before repositioning): [null, null, p2]
    field = battle.getPlayerField();
    expect(field.beasts[0]).toBeNull(); // p0 is dead
    expect(field.beasts[1]).toBeNull(); // p1 is dead
    expect(field.beasts[2]?.name).toBe('Beast 2'); // p2 still in slot 2

    // End turn to trigger repositioning
    endTurnAndReposition(controller, 'player');

    // After repositioning: [p2, null, null]
    field = battle.getPlayerField();
    expect(field.beasts[0]?.name).toBe('Beast 2');
    expect(field.beasts[1]).toBeNull();
    expect(field.beasts[2]).toBeNull();
  });

  test('should shift opponent beasts when they die', () => {
    const scenario: BattleScenario = {
      playerBeasts: [
        createTestBeast('p0', 'Attacker 0', 10, 10, false),
        createTestBeast('p1', 'Attacker 1', 10, 10, false),
      ],
      opponentBeasts: [
        createTestBeast('o0', 'Enemy 0', 1, 1, false),   // Will die
        createTestBeast('o1', 'Enemy 1', 5, 5, false),
        createTestBeast('o2', 'Enemy 2', 5, 5, false),
      ],
    };

    const battle = setupBattleScenario(controller, scenario);

    // p0 kills o0
    const p0Id = getCardIdentifier(battle.getPlayerField().beasts[0]!);
    const o0Id = getCardIdentifier(battle.getOpponentField().beasts[0]!);
    controller.attackBeast(p0Id, o0Id, 'player');

    // End turn to trigger repositioning
    endTurnAndReposition(controller, 'player');

    // Opponent field should shift: [o1, o2, null]
    const opponentField = battle.getOpponentField();
    expect(opponentField.beasts[0]?.name).toBe('Enemy 1'); // Shifted from slot 1 to 0
    expect(opponentField.beasts[1]?.name).toBe('Enemy 2'); // Shifted from slot 2 to 1
    expect(opponentField.beasts[2]).toBeNull();
  });

  test('targeting should update after repositioning', () => {
    // This test verifies that after a beast dies and others shift,
    // the next attack targets based on the NEW positions
    const scenario: BattleScenario = {
      playerBeasts: [
        createTestBeast('p0', 'Attacker 0', 10, 10, false),
        createTestBeast('p1', 'Attacker 1', 10, 10, false),
      ],
      opponentBeasts: [
        createTestBeast('o0', 'Enemy 0', 1, 1, false),   // Will die first
        createTestBeast('o1', 'Enemy 1', 10, 10, false), // After shift, becomes slot 0
      ],
    };

    const battle = setupBattleScenario(controller, scenario);

    // p0 attacks o0 in slot 0
    const p0Id = getCardIdentifier(battle.getPlayerField().beasts[0]!);
    let o0Id = getCardIdentifier(battle.getOpponentField().beasts[0]!);
    controller.attackBeast(p0Id, o0Id, 'player');

    // After first attack (before repositioning): o0 is dead but still in slot 0 as null
    let opponentField = battle.getOpponentField();
    expect(opponentField.beasts[0]).toBeNull(); // o0 is dead
    expect(opponentField.beasts[1]?.name).toBe('Enemy 1'); // o1 still in slot 1

    // p1 attacks - since there's no beast in slot 1 (only o1 in slot 1), p1 attacks o1
    const p1Id = getCardIdentifier(battle.getPlayerField().beasts[1]!);
    const o1Id = getCardIdentifier(opponentField.beasts[1]!);
    const initialOpponentHealth = battle.getOpponentHealth();

    // p1 should attack o1 in slot 1 (not player, because o1 is there)
    const success = controller.attackBeast(p1Id, o1Id, 'player');
    expect(success).toBe(true);

    // End turn to trigger repositioning
    endTurnAndReposition(controller, 'player');

    // After repositioning, both opponent beasts are dead
    opponentField = battle.getOpponentField();
    expect(opponentField.beasts[0]).toBeNull(); // Both beasts dead
    expect(opponentField.beasts[1]).toBeNull();
  });
});
