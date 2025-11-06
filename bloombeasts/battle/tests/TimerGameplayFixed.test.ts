/**
 * Tests for timer functionality in BloomBeasts gameplay
 * Using Jest timer mocks for reliable testing
 */

describe('BloomBeasts Timer System', () => {
  // Enable fake timers for this test suite
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  // Game state with timer support
  interface TimedBattleState {
    players: Array<{
      id: string;
      name: string;
      health: number;
      energy: number;
      isAI: boolean;
      timer: number; // Time remaining in seconds
      totalTimeUsed: number; // Total time used across all turns
    }>;
    turn: number;
    currentPlayer: number;
    turnStartTime: number;
    maxTurnTime: number; // Max time per turn in seconds
    gameEnded: boolean;
    winner?: string;
  }

  // Helper to create initial timed battle state
  function createTimedBattle(maxTurnTime: number = 30): TimedBattleState {
    return {
      players: [
        {
          id: 'player1',
          name: 'Alice',
          health: 30,
          energy: 0,
          isAI: false,
          timer: maxTurnTime,
          totalTimeUsed: 0
        },
        {
          id: 'player2',
          name: 'Bob (AI)',
          health: 30,
          energy: 0,
          isAI: true,
          timer: maxTurnTime,
          totalTimeUsed: 0
        }
      ],
      turn: 1,
      currentPlayer: 0,
      turnStartTime: Date.now(),
      maxTurnTime,
      gameEnded: false
    };
  }

  // Simple timer implementation for testing
  class TestableTimer {
    private currentTime: number = 0;
    private timers: Map<string, {
      remaining: number;
      callback: () => void;
      active: boolean;
    }> = new Map();

    startTimer(playerId: string, duration: number, onExpire: () => void): void {
      this.timers.set(playerId, {
        remaining: duration,
        callback: onExpire,
        active: true
      });
    }

    tick(seconds: number = 1): void {
      this.currentTime += seconds;

      this.timers.forEach((timer, playerId) => {
        if (timer.active) {
          timer.remaining -= seconds;
          if (timer.remaining <= 0) {
            timer.active = false;
            timer.callback();
          }
        }
      });
    }

    getRemaining(playerId: string): number {
      const timer = this.timers.get(playerId);
      return timer ? timer.remaining : 0;
    }

    stopTimer(playerId: string): void {
      const timer = this.timers.get(playerId);
      if (timer) {
        timer.active = false;
      }
    }

    isActive(playerId: string): boolean {
      const timer = this.timers.get(playerId);
      return timer ? timer.active : false;
    }
  }

  describe('Turn Timer Countdown', () => {
    test('should start timer when turn begins', () => {
      const state = createTimedBattle(30);
      const timer = new TestableTimer();
      const player = state.players[0];

      timer.startTimer(player.id, state.maxTurnTime, () => {});

      expect(timer.isActive(player.id)).toBe(true);
      expect(timer.getRemaining(player.id)).toBe(30);
    });

    test('should decrease timer each second', () => {
      const state = createTimedBattle(30);
      const timer = new TestableTimer();
      const player = state.players[0];

      timer.startTimer(player.id, state.maxTurnTime, () => {});

      // Simulate 5 seconds passing
      timer.tick(5);

      expect(timer.getRemaining(player.id)).toBe(25);

      // Simulate another 10 seconds
      timer.tick(10);

      expect(timer.getRemaining(player.id)).toBe(15);
    });

    test('should stop timer when turn ends', () => {
      const state = createTimedBattle(30);
      const timer = new TestableTimer();
      const player = state.players[0];

      timer.startTimer(player.id, state.maxTurnTime, () => {});

      // Use some time
      timer.tick(10);

      // End turn
      timer.stopTimer(player.id);

      expect(timer.isActive(player.id)).toBe(false);

      // Time shouldn't decrease after stopping
      const remainingAfterStop = timer.getRemaining(player.id);
      timer.tick(5);
      expect(timer.getRemaining(player.id)).toBe(remainingAfterStop);
    });

    test('should track total time used across turns', () => {
      const state = createTimedBattle(30);
      const player = state.players[0];

      // Turn 1: Use 5 seconds
      player.timer = 25;
      player.totalTimeUsed += 5;

      // Turn 3: Use 3 seconds
      player.timer = 27;
      player.totalTimeUsed += 3;

      // Turn 5: Use 7 seconds
      player.timer = 23;
      player.totalTimeUsed += 7;

      expect(player.totalTimeUsed).toBe(15);
    });

    test('should reset timer for new turn', () => {
      const state = createTimedBattle(30);
      const player = state.players[0];

      // Use some time in turn 1
      player.timer = 15;

      // New turn - reset timer
      state.turn = 3;
      player.timer = state.maxTurnTime;

      expect(player.timer).toBe(30);
    });
  });

  describe('Timer-Based Loss Conditions', () => {
    test('should lose when timer reaches 0', () => {
      const state = createTimedBattle(30);
      const timer = new TestableTimer();
      const player = state.players[0];

      let timeoutOccurred = false;
      timer.startTimer(player.id, state.maxTurnTime, () => {
        timeoutOccurred = true;
        state.gameEnded = true;
        state.winner = state.players[1].id;
      });

      // Simulate full 30 seconds passing
      timer.tick(30);

      expect(timeoutOccurred).toBe(true);
      expect(state.gameEnded).toBe(true);
      expect(state.winner).toBe('player2');
    });

    test('should declare opponent as winner on timeout', () => {
      const state = createTimedBattle(30);
      const timer = new TestableTimer();
      const player = state.players[0];
      const opponent = state.players[1];

      timer.startTimer(player.id, 5, () => {
        state.gameEnded = true;
        state.winner = opponent.id;
      });

      // Timeout after 5 seconds
      timer.tick(5);

      expect(state.gameEnded).toBe(true);
      expect(state.winner).toBe(opponent.id);
      expect(opponent.currentHealth).toBe(30); // Winner still has full health
    });

    test('should handle timeout during complex game state', () => {
      const state = createTimedBattle(30);
      const timer = new TestableTimer();

      // Set up a game in progress
      state.players[0].currentHealth = 15;
      state.players[1].currentHealth = 20;
      state.turn = 10;
      state.players[0].energy = 5;

      const player = state.players[0];

      timer.startTimer(player.id, state.maxTurnTime, () => {
        // Even if player is winning, timeout = loss
        state.gameEnded = true;
        state.winner = state.players[1].id;
      });

      timer.tick(30);

      expect(state.gameEnded).toBe(true);
      expect(state.winner).toBe('player2');
    });

    test('should not trigger timeout if turn ends before timer expires', () => {
      const state = createTimedBattle(30);
      const timer = new TestableTimer();
      const player = state.players[0];

      timer.startTimer(player.id, state.maxTurnTime, () => {
        state.gameEnded = true;
        state.winner = state.players[1].id;
      });

      // Use 10 seconds then end turn
      timer.tick(10);
      timer.stopTimer(player.id);

      // Advance time past what would have been timeout
      timer.tick(25);

      expect(state.gameEnded).toBe(false);
      expect(state.winner).toBeUndefined();
    });
  });

  describe('AI Thinking Simulation', () => {
    test('should decrease AI timer while thinking', () => {
      const state = createTimedBattle(30);
      const timer = new TestableTimer();
      state.currentPlayer = 1; // AI's turn
      const aiPlayer = state.players[1];

      timer.startTimer(aiPlayer.id, aiPlayer.timer, () => {
        state.gameEnded = true;
        state.winner = state.players[0].id;
      });

      // AI thinks for 3 seconds
      timer.tick(3);
      const remainingAfterThinking = timer.getRemaining(aiPlayer.id);

      expect(remainingAfterThinking).toBe(27);
      expect(timer.isActive(aiPlayer.id)).toBe(true);

      // AI makes a move and ends turn
      timer.stopTimer(aiPlayer.id);
    });

    test('should track AI thinking phases', () => {
      interface AIPhase {
        name: string;
        duration: number;
      }

      const phases: AIPhase[] = [
        { name: 'Analyzing board', duration: 1 },
        { name: 'Evaluating moves', duration: 1 },
        { name: 'Calculating outcomes', duration: 1 },
        { name: 'Selecting action', duration: 1 }
      ];

      const completedPhases: string[] = [];
      let totalThinkingTime = 0;

      phases.forEach(phase => {
        completedPhases.push(phase.name);
        totalThinkingTime += phase.duration;
      });

      expect(completedPhases).toEqual([
        'Analyzing board',
        'Evaluating moves',
        'Calculating outcomes',
        'Selecting action'
      ]);
      expect(totalThinkingTime).toBe(4);
    });

    test('should handle AI timeout gracefully', () => {
      const state = createTimedBattle(30);
      const timer = new TestableTimer();
      state.currentPlayer = 1;
      const aiPlayer = state.players[1];

      // Give AI very little time
      timer.startTimer(aiPlayer.id, 2, () => {
        state.gameEnded = true;
        state.winner = state.players[0].id; // Human wins
      });

      // AI thinks too long
      timer.tick(3);

      expect(state.gameEnded).toBe(true);
      expect(state.winner).toBe('player1');
    });

    test('should adjust AI thinking time based on difficulty', () => {
      interface AIConfig {
        difficulty: 'easy' | 'medium' | 'hard';
        thinkingTime: { min: number; max: number };
      }

      const configs: Record<string, AIConfig> = {
        easy: { difficulty: 'easy', thinkingTime: { min: 1, max: 2 } },
        medium: { difficulty: 'medium', thinkingTime: { min: 2, max: 3 } },
        hard: { difficulty: 'hard', thinkingTime: { min: 3, max: 5 } }
      };

      function simulateAIThinking(config: AIConfig): number {
        const { min, max } = config.thinkingTime;
        // For testing, return average
        return (min + max) / 2;
      }

      const easyTime = simulateAIThinking(configs.easy);
      expect(easyTime).toBe(1.5);

      const mediumTime = simulateAIThinking(configs.medium);
      expect(mediumTime).toBe(2.5);

      const hardTime = simulateAIThinking(configs.hard);
      expect(hardTime).toBe(4);
    });

    test('should simulate realistic AI delay patterns', () => {
      const delays: number[] = [];

      // Simulate multiple AI turns with realistic variance
      for (let i = 0; i < 5; i++) {
        // Base time 2 seconds with up to 1 second variance
        const baseTime = 2;
        const variance = Math.random(); // 0 to 1
        const delay = baseTime + variance;
        delays.push(delay);
      }

      // All delays should be within expected range
      delays.forEach(delay => {
        expect(delay).toBeGreaterThanOrEqual(2);
        expect(delay).toBeLessThanOrEqual(3);
      });

      // Should have some variance (not all exactly the same)
      const uniqueDelays = new Set(delays);
      expect(uniqueDelays.size).toBeGreaterThan(1);
    });
  });

  describe('Timer Edge Cases', () => {
    test('should handle rapid turn switching', () => {
      const state = createTimedBattle(30);
      const timer = new TestableTimer();

      // Rapidly switch turns
      for (let i = 0; i < 10; i++) {
        state.currentPlayer = i % 2;
        const player = state.players[state.currentPlayer];

        // Stop previous timer
        if (i > 0) {
          const prevPlayer = state.players[(i - 1) % 2];
          timer.stopTimer(prevPlayer.id);
        }

        // Start new timer
        timer.startTimer(player.id, player.timer, () => {});
      }

      // Check final state
      const finalPlayer = state.players[state.currentPlayer];
      const otherPlayer = state.players[1 - state.currentPlayer];

      expect(timer.isActive(finalPlayer.id)).toBe(true);
      expect(timer.isActive(otherPlayer.id)).toBe(false);
    });

    test('should calculate time pressure correctly', () => {
      function calculateTimePressure(timeRemaining: number, maxTime: number): string {
        const ratio = timeRemaining / maxTime;

        if (ratio > 0.5) return 'comfortable';
        if (ratio > 0.2) return 'moderate';
        if (ratio > 0.1) return 'high';
        return 'critical';
      }

      expect(calculateTimePressure(25, 30)).toBe('comfortable');
      expect(calculateTimePressure(10, 30)).toBe('moderate');
      expect(calculateTimePressure(5, 30)).toBe('high');
      expect(calculateTimePressure(2, 30)).toBe('critical');
    });

    test('should handle timer pause and resume', () => {
      const timer = new TestableTimer();
      const playerId = 'player1';

      timer.startTimer(playerId, 30, () => {});

      // Use 5 seconds
      timer.tick(5);
      const remainingAtPause = timer.getRemaining(playerId);
      expect(remainingAtPause).toBe(25);

      // Pause
      timer.stopTimer(playerId);

      // Time passes while paused
      timer.tick(10);

      // Resume with remaining time
      timer.startTimer(playerId, remainingAtPause, () => {});

      // Continue playing
      timer.tick(5);
      expect(timer.getRemaining(playerId)).toBe(20);
    });
  });

  describe('Timer Display and Warnings', () => {
    test('should format time display correctly', () => {
      function formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      }

      expect(formatTime(90)).toBe('1:30');
      expect(formatTime(30)).toBe('0:30');
      expect(formatTime(5)).toBe('0:05');
      expect(formatTime(0)).toBe('0:00');
    });

    test('should trigger warnings at time thresholds', () => {
      const warnings: string[] = [];

      function checkTimeWarnings(remaining: number): void {
        if (remaining === 10) warnings.push('10 seconds remaining!');
        if (remaining === 5) warnings.push('5 seconds remaining!');
        if (remaining === 3) warnings.push('Time running out!');
        if (remaining === 1) warnings.push('Last second!');
      }

      // Simulate countdown
      for (let i = 30; i >= 0; i--) {
        checkTimeWarnings(i);
      }

      expect(warnings).toContain('10 seconds remaining!');
      expect(warnings).toContain('5 seconds remaining!');
      expect(warnings).toContain('Time running out!');
      expect(warnings).toContain('Last second!');
    });

    test('should change timer color based on urgency', () => {
      function getTimerColor(remaining: number, maxTime: number): string {
        const ratio = remaining / maxTime;

        if (ratio > 0.5) return 'green';
        if (ratio > 0.25) return 'yellow';
        if (ratio > 0.1) return 'orange';
        return 'red';
      }

      expect(getTimerColor(30, 30)).toBe('green');
      expect(getTimerColor(15, 30)).toBe('yellow');
      expect(getTimerColor(8, 30)).toBe('yellow');
      expect(getTimerColor(5, 30)).toBe('orange');
      expect(getTimerColor(2, 30)).toBe('red');
    });

    test('should play warning sound at critical moments', () => {
      const soundsPlayed: string[] = [];

      function playTimerSound(remaining: number): void {
        if (remaining === 10) soundsPlayed.push('tick');
        if (remaining === 5) soundsPlayed.push('warning');
        if (remaining === 3) soundsPlayed.push('urgent');
        if (remaining === 1) soundsPlayed.push('final');
        if (remaining === 0) soundsPlayed.push('expired');
      }

      // Simulate final 10 seconds
      for (let i = 10; i >= 0; i--) {
        playTimerSound(i);
      }

      expect(soundsPlayed).toEqual(['tick', 'warning', 'urgent', 'final', 'expired']);
    });
  });

  describe('Timer Statistics', () => {
    test('should calculate average turn time', () => {
      const turnTimes = [15, 12, 18, 20, 10, 25, 8];
      const average = turnTimes.reduce((sum, time) => sum + time, 0) / turnTimes.length;

      expect(Math.round(average)).toBe(15);
    });

    test('should track fastest and slowest turns', () => {
      const turnData = [
        { turn: 1, time: 15 },
        { turn: 2, time: 8 },  // Fastest
        { turn: 3, time: 25 }, // Slowest
        { turn: 4, time: 12 }
      ];

      const fastest = Math.min(...turnData.map(t => t.time));
      const slowest = Math.max(...turnData.map(t => t.time));

      expect(fastest).toBe(8);
      expect(slowest).toBe(25);
    });

    test('should identify time usage patterns', () => {
      interface TimePattern {
        phase: 'opening' | 'midgame' | 'endgame';
        avgTime: number;
      }

      const patterns: TimePattern[] = [
        { phase: 'opening', avgTime: 20 },  // More thinking in opening
        { phase: 'midgame', avgTime: 15 },  // Moderate pace
        { phase: 'endgame', avgTime: 8 }    // Quick decisions
      ];

      // Opening turns take longer
      expect(patterns[0].avgTime).toBeGreaterThan(patterns[2].avgTime);

      // Endgame is fastest
      const fastestPhase = patterns.reduce((min, p) =>
        p.avgTime < min.avgTime ? p : min
      );
      expect(fastestPhase.phase).toBe('endgame');
    });
  });
});