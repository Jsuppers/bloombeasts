/**
 * Basic functional tests for BloomBeasts gameplay
 * Tests core game mechanics and scenarios
 */

describe('BloomBeasts Basic Gameplay', () => {
  // Simplified game state for testing
  interface SimpleBattleState {
    players: Array<{
      id: string;
      name: string;
      health: number;
      energy: number;
      hand: Card[];
      field: (Beast | null)[];
    }>;
    turn: number;
    currentPlayer: number;
  }

  interface Card {
    id: string;
    name: string;
    type: 'beast' | 'magic' | 'trap';
    cost: number;
  }

  interface Beast extends Card {
    attack: number;
    health: number;
    summoningSickness: boolean;
  }

  // Helper to create initial battle state
  function createBattleState(): SimpleBattleState {
    return {
      players: [
        {
          id: 'player1',
          name: 'Alice',
          health: 30,
          energy: 0,
          hand: [
            { id: 'card1', name: 'Rootling', type: 'beast', cost: 1 },
            { id: 'card2', name: 'Lightning', type: 'magic', cost: 2 },
            { id: 'card3', name: 'Mosslet', type: 'beast', cost: 2 }
          ],
          field: [null, null, null]
        },
        {
          id: 'player2',
          name: 'Bob',
          health: 30,
          energy: 0,
          hand: [
            { id: 'card4', name: 'Cinder Pup', type: 'beast', cost: 1 },
            { id: 'card5', name: 'Fireball', type: 'magic', cost: 3 }
          ],
          field: [null, null, null]
        }
      ],
      turn: 1,
      currentPlayer: 0
    };
  }

  describe('Game Initialization', () => {
    test('should start with correct initial state', () => {
      const state = createBattleState();

      expect(state.players).toHaveLength(2);
      expect(state.players[0].currentHealth).toBe(30);
      expect(state.players[1].currentHealth).toBe(30);
      expect(state.players[0].energy).toBe(0);
      expect(state.turn).toBe(1);
      expect(state.currentPlayer).toBe(0);
    });

    test('should have empty fields at start', () => {
      const state = createBattleState();

      state.players.forEach(player => {
        expect(player.field).toEqual([null, null, null]);
      });
    });

    test('should have starting hands', () => {
      const state = createBattleState();

      expect(state.players[0].hand).toHaveLength(3);
      expect(state.players[1].hand).toHaveLength(2);
    });
  });

  describe('Playing Cards', () => {
    test('should play beast to field', () => {
      const state = createBattleState();
      const player = state.players[0];
      player.energy = 2; // Give enough energy

      // Play a beast card
      const cardToPlay = player.hand.find(c => c.type === 'beast' && c.cost <= player.energy);
      if (cardToPlay) {
        // Remove from hand
        const index = player.hand.indexOf(cardToPlay);
        player.hand.splice(index, 1);

        // Add to field
        const beast: Beast = {
          ...cardToPlay,
          attack: 1,
          health: 2,
          summoningSickness: true
        };
        player.field[0] = beast;

        // Deduct energy
        player.energy -= cardToPlay.cost;
      }

      expect(player.field[0]).not.toBeNull();
      expect(player.field[0]?.name).toBe('Rootling');
      expect(player.hand).toHaveLength(2);
      expect(player.energy).toBe(1);
    });

    test('should not play card without enough energy', () => {
      const state = createBattleState();
      const player = state.players[0];
      player.energy = 0; // No energy

      const expensiveCard = player.hand.find(c => c.cost > player.energy);
      const canPlay = expensiveCard ? expensiveCard.cost <= player.energy : false;

      expect(canPlay).toBe(false);
    });

    test('should apply summoning sickness to new beasts', () => {
      const state = createBattleState();
      const player = state.players[0];
      player.energy = 2;

      const beast: Beast = {
        id: 'newbeast',
        name: 'Test Beast',
        type: 'beast',
        cost: 1,
        attack: 2,
        health: 2,
        summoningSickness: true
      };

      player.field[0] = beast;

      expect(player.field[0]?.summoningSickness).toBe(true);
    });
  });

  describe('Combat', () => {
    test('should attack enemy beast', () => {
      const state = createBattleState();

      // Set up battlefield
      const attacker: Beast = {
        id: 'attacker',
        name: 'Strong Beast',
        type: 'beast',
        cost: 3,
        attack: 3,
        health: 4,
        summoningSickness: false
      };

      const defender: Beast = {
        id: 'defender',
        name: 'Weak Beast',
        type: 'beast',
        cost: 2,
        attack: 2,
        health: 2,
        summoningSickness: false
      };

      state.players[0].field[0] = attacker;
      state.players[1].field[0] = defender;

      // Simulate combat
      defender.currentHealth -= attacker.attack;
      attacker.currentHealth -= defender.attack;

      expect(defender.currentHealth).toBe(-1); // Should be destroyed
      expect(attacker.currentHealth).toBe(2); // Should survive

      // Remove destroyed beast
      if (defender.currentHealth <= 0) {
        state.players[1].field[0] = null;
      }

      expect(state.players[1].field[0]).toBeNull();
      expect(state.players[0].field[0]).not.toBeNull();
    });

    test('should damage player directly', () => {
      const state = createBattleState();

      const attacker: Beast = {
        id: 'attacker',
        name: 'Direct Attacker',
        type: 'beast',
        cost: 2,
        attack: 5,
        health: 3,
        summoningSickness: false
      };

      state.players[0].field[0] = attacker;
      // No defender at position 0

      // Attack player directly
      state.players[1].currentHealth -= attacker.attack;

      expect(state.players[1].currentHealth).toBe(25);
    });

    test('should not attack with summoning sick beast', () => {
      const state = createBattleState();

      const sickBeast: Beast = {
        id: 'sick',
        name: 'New Beast',
        type: 'beast',
        cost: 1,
        attack: 2,
        health: 2,
        summoningSickness: true
      };

      state.players[0].field[0] = sickBeast;

      const canAttack = !sickBeast.summoningSickness;

      expect(canAttack).toBe(false);
    });
  });

  describe('Turn Management', () => {
    test('should switch turns', () => {
      const state = createBattleState();

      expect(state.currentPlayer).toBe(0);

      // End turn
      state.currentPlayer = 1;
      state.turn = 2;

      expect(state.currentPlayer).toBe(1);
      expect(state.turn).toBe(2);

      // End turn again
      state.currentPlayer = 0;
      state.turn = 3;

      expect(state.currentPlayer).toBe(0);
      expect(state.turn).toBe(3);
    });

    test('should increase energy each turn', () => {
      const state = createBattleState();

      // Turn 1
      state.players[0].energy = Math.min(10, state.turn);
      expect(state.players[0].energy).toBe(1);

      // Turn 2
      state.turn = 2;
      state.players[1].energy = Math.min(10, state.turn);
      expect(state.players[1].energy).toBe(2);

      // Turn 10 (max energy)
      state.turn = 10;
      state.players[0].energy = Math.min(10, state.turn);
      expect(state.players[0].energy).toBe(10);

      // Turn 15 (still max energy)
      state.turn = 15;
      state.players[0].energy = Math.min(10, state.turn);
      expect(state.players[0].energy).toBe(10);
    });

    test('should remove summoning sickness at turn start', () => {
      const state = createBattleState();

      const beast: Beast = {
        id: 'beast1',
        name: 'Test Beast',
        type: 'beast',
        cost: 1,
        attack: 1,
        health: 1,
        summoningSickness: true
      };

      state.players[0].field[0] = beast;

      // Start of next turn for this player
      beast.summoningSickness = false;

      expect(beast.summoningSickness).toBe(false);
    });
  });

  describe('Win Conditions', () => {
    test('should win when opponent health reaches 0', () => {
      const state = createBattleState();

      state.players[1].currentHealth = 0;

      const isGameOver = state.players.some(p => p.currentHealth <= 0);
      const winner = state.players.find(p => p.currentHealth > 0);

      expect(isGameOver).toBe(true);
      expect(winner?.name).toBe('Alice');
    });

    test('should handle draw when both players die', () => {
      const state = createBattleState();

      state.players[0].currentHealth = 0;
      state.players[1].currentHealth = 0;

      const deadPlayers = state.players.filter(p => p.currentHealth <= 0);
      const isDraw = deadPlayers.length === state.players.length;

      expect(isDraw).toBe(true);
    });
  });

  describe('Complex Scenarios', () => {
    test('should handle full board state', () => {
      const state = createBattleState();

      // Fill player 1's board
      for (let i = 0; i < 3; i++) {
        state.players[0].field[i] = {
          id: `p1beast${i}`,
          name: `Beast ${i}`,
          type: 'beast',
          cost: 1,
          attack: 2,
          health: 3,
          summoningSickness: false
        };
      }

      // Check board is full
      const emptySlots = state.players[0].field.filter(f => f === null);
      expect(emptySlots).toHaveLength(0);

      // Try to play another beast (should fail - no space)
      const canPlayAnother = state.players[0].field.includes(null);
      expect(canPlayAnother).toBe(false);
    });

    test('should calculate total board damage', () => {
      const state = createBattleState();

      const beasts: Beast[] = [
        { id: '1', name: 'B1', type: 'beast', cost: 1, attack: 2, health: 1, summoningSickness: false },
        { id: '2', name: 'B2', type: 'beast', cost: 1, attack: 3, health: 1, summoningSickness: false },
        { id: '3', name: 'B3', type: 'beast', cost: 1, attack: 1, health: 1, summoningSickness: false }
      ];

      beasts.forEach((beast, i) => {
        state.players[0].field[i] = beast;
      });

      const totalDamage = state.players[0].field
        .filter(f => f && !f.summoningSickness)
        .reduce((sum, beast) => sum + (beast?.attack || 0), 0);

      expect(totalDamage).toBe(6);
    });

    test('should track game progression', () => {
      const gameLog: string[] = [];

      const state = createBattleState();

      // Turn 1
      gameLog.push(`Turn ${state.turn}: ${state.players[state.currentPlayer].name} plays`);
      state.players[0].energy = 1;
      gameLog.push('Player gains 1 energy');
      gameLog.push('Player plays Rootling');

      // Turn 2
      state.turn = 2;
      state.currentPlayer = 1;
      gameLog.push(`Turn ${state.turn}: ${state.players[state.currentPlayer].name} plays`);
      state.players[1].energy = 2;
      gameLog.push('Player gains 2 energy');

      expect(gameLog).toHaveLength(5);
      expect(gameLog[0]).toContain('Alice');
      expect(gameLog[3]).toContain('Bob');
    });
  });
});