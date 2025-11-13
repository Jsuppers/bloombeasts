/**
 * BloomBeasts Server Script
 *
 * Runs in DEFAULT MODE on the server to handle:
 * - Player join/leave tracking
 * - UI Gizmo ownership assignment
 * - Persistent storage operations (save/load player data)
 * - NetworkEvent communication with client scripts
 */

import * as hz from 'horizon/core';
import { Component, Player, NetworkEvent } from 'horizon/core';

// Import types and utilities from standalone bundle
import { BloomBeasts } from './BloomBeasts-GameEngine-Standalone';
type PlayerData = BloomBeasts.PlayerData;

// Import shared utility for creating default player data
const createDefaultPlayerData = BloomBeasts.createDefaultPlayerData;

// Leaderboard constants
const WORLD_VAR_LEADERBOARD = 'BloomBeastsData:leaderboard';
const MAX_LEADERBOARD_ENTRIES = 10;

/**
 * NetworkEvent payload types for communication with client
 * Note: Must have index signature to satisfy SerializableState constraint
 */
type SavePlayerDataPayload = {
  playerIndex: number;
  data: any; // Use 'any' to satisfy SerializableState (PlayerData will be serialized as JSON)
  [key: string]: any;
};

type LoadPlayerDataPayload = {
  playerIndex: number;
  [key: string]: any;
};

type LoadPlayerDataResponse = {
  playerIndex: number;
  data: any; // Use 'any' to satisfy SerializableState (PlayerData | null will be serialized as JSON)
  [key: string]: any;
};

type LeaderboardEntry = {
  playerName: string;
  score: number;
  level?: number; // For experience leaderboard
  timestamp: number;
  playerIndex: number;
};

type LeaderboardData = {
  topExperience: LeaderboardEntry[];
  fastestCluckNorris: LeaderboardEntry[];
};

type LeaderboardSubmitPayload = {
  playerName: string;
  type: 'experience' | 'cluckNorris';
  score: number;
  level?: number;
  [key: string]: any;
};

type LeaderboardDataPayload = {
  data: LeaderboardData;
  [key: string]: any;
};

/**
 * Server Script - Handles persistent storage and UI assignment
 */
class BloomBeastsServer extends Component {
  static propsDefinition = {
    // UI Gizmo entity to assign to players
    uiGizmo: { type: hz.PropTypes.Entity },
  };

  // NetworkEvents for client-server communication
  private saveDataEvent!: NetworkEvent<SavePlayerDataPayload>;
  private loadDataEvent!: NetworkEvent<LoadPlayerDataPayload>;
  private loadDataResponseEvent!: NetworkEvent<LoadPlayerDataResponse>;

  // Leaderboard NetworkEvents
  private leaderboardSubmitEvent!: NetworkEvent<LeaderboardSubmitPayload>;
  private leaderboardDataEvent!: NetworkEvent<LeaderboardDataPayload>;

  // Cache leaderboard data
  private leaderboard: LeaderboardData | null = null;

  /**
   * Initialize server script
   */
  start() {
    console.log('[Server] BloomBeasts Server starting...');
    // Create NetworkEvents
    this.saveDataEvent = new NetworkEvent<SavePlayerDataPayload>('bloombeasts:savePlayerData');
    this.loadDataEvent = new NetworkEvent<LoadPlayerDataPayload>('bloombeasts:loadPlayerData');
    this.loadDataResponseEvent = new NetworkEvent<LoadPlayerDataResponse>('bloombeasts:loadPlayerDataResponse');

    // Create Leaderboard NetworkEvents
    this.leaderboardSubmitEvent = new NetworkEvent<LeaderboardSubmitPayload>('leaderboard_score_submit');
    this.leaderboardDataEvent = new NetworkEvent<LeaderboardDataPayload>('leaderboard_data_update');

    // Load initial leaderboard data
    this.loadLeaderboardData();

    this.connectNetworkEvent(this.entity, this.saveDataEvent, (payload: SavePlayerDataPayload) => {
      console.log('[Server] Received save request for player index:', payload.playerIndex);
  
      const player = this.world.getPlayerFromIndex(payload.playerIndex);
      const uiGizmo = this.props.uiGizmo as hz.Entity;
      const currentOwner = uiGizmo.owner.get();
      // Only save data if the player is the current owner of the UI gizmo to prevent users from saving data for other players
      if (player && currentOwner === player) {
        this.savePlayerData(payload.playerIndex, payload.data);
      }
    });

    // Listen for load data requests from clients
    this.connectNetworkEvent(this.entity, this.loadDataEvent, (payload: LoadPlayerDataPayload) => {
      console.log('[Server] Received load request for player index:', payload.playerIndex);
      const data = this.loadPlayerData(payload.playerIndex);

      // Send response back to client
      const player = this.world.getPlayerFromIndex(payload.playerIndex);
      const uiGizmo = this.props.uiGizmo as hz.Entity;
      const currentOwner = uiGizmo.owner.get();
      if (player && currentOwner === player) {
        this.sendNetworkEvent(uiGizmo, this.loadDataResponseEvent, {
            playerIndex: payload.playerIndex,
            data: data
          },
        );
        console.log('[Server] Sent load response to player index:', payload.playerIndex);
      }
    });

    // Listen for leaderboard score submissions
    this.connectNetworkEvent(this.entity, this.leaderboardSubmitEvent, (payload: LeaderboardSubmitPayload, sender?: Player) => {
      console.log('[Server] Received leaderboard submission:', payload.type, 'score:', payload.score, 'from:', payload.playerName);

      // Get player index from sender if available
      const playerIndex = sender ? sender.index.get() : -1;

      // Validate and add the score to leaderboard
      this.handleLeaderboardSubmit(payload, playerIndex);
    });

    // Listen for players joining
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterWorld,
      (player: Player) => {
        console.log('[Server] Player entered world:', player.name);
        this.handlePlayerJoin(player);
      }
    );

    console.log('[Server] ✅ Server initialized and listening for players');
  }

  /**
   * Handle player joining the world
   */
  private handlePlayerJoin(player: Player): void {
    const playerIndex = player.index.get();
    console.log('[Server] Handling join for player:', player.name, 'index:', playerIndex);

    // Check if UI gizmo is assigned
    const uiGizmo = this.props.uiGizmo as hz.Entity;
    if (!uiGizmo) {
      console.error('[Server] ❌ UI Gizmo not assigned in properties!');
      return;
    }

    // Check current owner of UI gizmo
    const currentOwner = uiGizmo.owner.get();

    if (!currentOwner || currentOwner === this.world.getServerPlayer()) {
      // UI gizmo is unassigned or owned by server - assign to player
      console.log('[Server] Transferring UI gizmo ownership to player:', player.name);

      // Transfer ownership - this will restart the UI script on player's client
      // The client's receiveOwnership() method will be called automatically
      uiGizmo.owner.set(player);

      console.log('[Server] ✅ UI ownership transferred to player:', player.name);

      // Send current leaderboard data to the new player
      if (this.leaderboard) {
        this.async.setTimeout(() => {
          console.log('[Server] Sending initial leaderboard data to player:', player.name);
          this.sendNetworkEvent(uiGizmo, this.leaderboardDataEvent, {
            data: this.leaderboard
          });
        }, 2000); // Small delay to ensure client is ready
      }
    } else {
      console.log('[Server] UI gizmo already assigned to:', currentOwner.name);
      // TODO: Handle multiple players - need multiple UI gizmos or different strategy
    }
  }

  /**
   * Save player data to persistent storage
   */
  private savePlayerData(playerIndex: number, data: PlayerData): void {
    const player = this.world.getPlayerFromIndex(playerIndex);

    if (!player) {
      console.error('[Server] ❌ Player not found for index:', playerIndex);
      return;
    }

    if (!this.world.persistentStorage) {
      console.error('[Server] ❌ Persistent storage not available');
      return;
    }

    try {
      const varKey = 'BloomBeastsData:playerData';

      this.world.persistentStorage.setPlayerVariable(
        player,
        varKey,
        data as any
      );

      console.log('[Server] ✅ Player data saved for:', player.name);
    } catch (error) {
      console.error('[Server] ❌ Failed to save player data:', error);
    }
  }

  /**
   * Load player data from persistent storage
   */
  private loadPlayerData(playerIndex: number): PlayerData | null {
    const player = this.world.getPlayerFromIndex(playerIndex);

    if (!player) {
      console.error('[Server] ❌ Player not found for index:', playerIndex);
      return null;
    }

    if (!this.world.persistentStorage) {
      console.error('[Server] ❌ Persistent storage not available');
      return null;
    }

    try {
      const varKey = 'BloomBeastsData:playerData';

      const result = this.world.persistentStorage.getPlayerVariable(
        player,
        varKey
      );

      if (result === null || result === 0 || result === undefined ||
          (typeof result === 'object' && Object.keys(result).length === 0)) {
        console.log('[Server] No saved data for player:', player.name, '- creating default data');

        // Create default player data with Horizon player name
        const defaultData = createDefaultPlayerData(player.name.get());

        // Save it to persistent storage
        this.world.persistentStorage.setPlayerVariable(
          player,
          varKey,
          defaultData as any
        );

        console.log('[Server] ✅ Created and saved default player data for:', player.name);
        return defaultData;
      }

      const playerData = result as unknown as PlayerData;

      // Sync player name with Horizon player name if different
      if (playerData.name !== player.name.get()) {
        console.log(`[Server] Syncing player name from "${playerData.name}" to "${player.name}"`);
        playerData.name = player.name.get();

        // Save the updated name
        this.world.persistentStorage.setPlayerVariable(
          player,
          varKey,
          playerData as any
        );
      }

      console.log('[Server] ✅ Loaded player data for:', player.name);
      return playerData;
    } catch (error) {
      console.error('[Server] ❌ Failed to load player data:', error);
      return null;
    }
  }

  /**
   * Load leaderboard data from persistent storage
   */
  private loadLeaderboardData(): void {
    if (!this.world.persistentStorageWorld) {
      console.error('[Server] ❌ World persistent storage not available');
      return;
    }

    try {
      const savedData = this.world.persistentStorageWorld.getWorldVariable(WORLD_VAR_LEADERBOARD);

      if (!savedData || typeof savedData !== 'object') {
        console.log('[Server] No existing leaderboard data, creating empty leaderboard');
        this.leaderboard = {
          topExperience: [],
          fastestCluckNorris: []
        };
        // Save initial empty leaderboard
        this.saveLeaderboardData();
      } else {
        this.leaderboard = savedData as LeaderboardData;
        console.log('[Server] ✅ Loaded leaderboard data with',
          this.leaderboard.topExperience.length, 'experience entries and',
          this.leaderboard.fastestCluckNorris.length, 'Cluck Norris entries');
      }
    } catch (error) {
      console.error('[Server] ❌ Failed to load leaderboard data:', error);
      this.leaderboard = {
        topExperience: [],
        fastestCluckNorris: []
      };
    }
  }

  /**
   * Save leaderboard data to persistent storage
   */
  private async saveLeaderboardData(): Promise<void> {
    if (!this.world.persistentStorageWorld || !this.leaderboard) {
      console.error('[Server] ❌ Cannot save: World storage or leaderboard not available');
      return;
    }

    try {
      await this.world.persistentStorageWorld.setWorldVariableAcrossAllInstancesAsync(
        WORLD_VAR_LEADERBOARD,
        this.leaderboard as any
      );
      console.log('[Server] ✅ Leaderboard data saved');

      // Broadcast updated leaderboard to all connected clients
      this.broadcastLeaderboardUpdate();
    } catch (error) {
      console.error('[Server] ❌ Failed to save leaderboard data:', error);
    }
  }

  /**
   * Handle leaderboard score submission
   */
  private handleLeaderboardSubmit(payload: LeaderboardSubmitPayload, playerIndex: number): void {
    if (!this.leaderboard) {
      console.error('[Server] ❌ Leaderboard not initialized');
      return;
    }

    // Basic validation
    if (!payload.playerName || typeof payload.score !== 'number') {
      console.error('[Server] ❌ Invalid submission data');
      return;
    }

    // Additional validation for score ranges
    if (payload.type === 'experience') {
      // Experience should be positive and reasonable (max ~1M)
      if (payload.score < 0) {
        console.error('[Server] ❌ Invalid experience score:', payload.score);
        return;
      }
    } else if (payload.type === 'cluckNorris') {
      // Cluck Norris time should be positive and reasonable (1 second to 1 hour)
      if (payload.score < 0) {
        console.error('[Server] ❌ Invalid Cluck Norris time:', payload.score);
        return;
      }
    }

    const entry: LeaderboardEntry = {
      playerName: payload.playerName.substring(0, 50), // Limit name length
      score: payload.score,
      level: payload.level,
      timestamp: Date.now(),
      playerIndex: playerIndex
    };

    // Add to appropriate leaderboard
    if (payload.type === 'experience') {
      this.updateExperienceLeaderboard(entry);
    } else if (payload.type === 'cluckNorris') {
      this.updateCluckNorrisLeaderboard(entry);
    }

    // Save to persistent storage
    this.saveLeaderboardData();
  }

  /**
   * Update experience leaderboard (highest scores)
   */
  private updateExperienceLeaderboard(entry: LeaderboardEntry): void {
    if (!this.leaderboard) return;

    // Check if player already has an entry
    const existingIndex = this.leaderboard.topExperience.findIndex(
      e => e.playerIndex === entry.playerIndex || e.playerName === entry.playerName
    );

    if (existingIndex !== -1) {
      // Update only if new score is higher
      if (entry.score > this.leaderboard.topExperience[existingIndex].score) {
        this.leaderboard.topExperience[existingIndex] = entry;
        console.log('[Server] Updated experience score for:', entry.playerName);
      } else {
        console.log('[Server] Existing score is higher, not updating for:', entry.playerName);
        return;
      }
    } else {
      // Add new entry
      this.leaderboard.topExperience.push(entry);
      console.log('[Server] Added new experience entry for:', entry.playerName);
    }

    // Sort by score (descending) and keep top entries
    this.leaderboard.topExperience.sort((a, b) => b.score - a.score);
    this.leaderboard.topExperience = this.leaderboard.topExperience.slice(0, MAX_LEADERBOARD_ENTRIES);
  }

  /**
   * Update Cluck Norris leaderboard (fastest times - lower is better)
   */
  private updateCluckNorrisLeaderboard(entry: LeaderboardEntry): void {
    if (!this.leaderboard) return;

    // Check if player already has an entry
    const existingIndex = this.leaderboard.fastestCluckNorris.findIndex(
      e => e.playerIndex === entry.playerIndex || e.playerName === entry.playerName
    );

    if (existingIndex !== -1) {
      // Update only if new time is faster (lower)
      if (entry.score < this.leaderboard.fastestCluckNorris[existingIndex].score) {
        this.leaderboard.fastestCluckNorris[existingIndex] = entry;
        console.log('[Server] Updated Cluck Norris time for:', entry.playerName);
      } else {
        console.log('[Server] Existing time is faster, not updating for:', entry.playerName);
        return;
      }
    } else {
      // Add new entry
      this.leaderboard.fastestCluckNorris.push(entry);
      console.log('[Server] Added new Cluck Norris entry for:', entry.playerName);
    }

    // Sort by time (ascending - fastest first) and keep top entries
    this.leaderboard.fastestCluckNorris.sort((a, b) => a.score - b.score);
    this.leaderboard.fastestCluckNorris = this.leaderboard.fastestCluckNorris.slice(0, MAX_LEADERBOARD_ENTRIES);
  }

  /**
   * Broadcast updated leaderboard to all connected clients
   */
  private broadcastLeaderboardUpdate(): void {
    if (!this.leaderboard) return;

    const uiGizmo = this.props.uiGizmo as hz.Entity;
    if (!uiGizmo) {
      console.error('[Server] ❌ Cannot broadcast: UI Gizmo not available');
      return;
    }

    // Send to all clients via the UI gizmo
    this.sendNetworkEvent(uiGizmo, this.leaderboardDataEvent, {
      data: this.leaderboard
    });

    console.log('[Server] 📢 Broadcasted leaderboard update to clients');
  }

  /**
   * Cleanup
   */
  dispose() {
    console.log('[Server] Server script disposing...');
  }
}

// Register the server script with Horizon
hz.Component.register(BloomBeastsServer);
