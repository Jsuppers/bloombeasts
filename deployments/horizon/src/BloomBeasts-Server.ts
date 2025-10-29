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

// Import types from standalone bundle
import { BloomBeasts } from './BloomBeasts-GameEngine-Standalone';
type PlayerData = BloomBeasts.PlayerData;

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

  /**
   * Initialize server script
   */
  start() {
    console.log('[Server] BloomBeasts Server starting...');
    // Create NetworkEvents
    this.saveDataEvent = new NetworkEvent<SavePlayerDataPayload>('bloombeasts:savePlayerData');
    this.loadDataEvent = new NetworkEvent<LoadPlayerDataPayload>('bloombeasts:loadPlayerData');
    this.loadDataResponseEvent = new NetworkEvent<LoadPlayerDataResponse>('bloombeasts:loadPlayerDataResponse');

    this.connectNetworkEvent(this.entity, this.saveDataEvent, (payload: SavePlayerDataPayload) => {
      console.log('[Server] Received save request for player index:', payload.playerIndex);
      this.savePlayerData(payload.playerIndex, payload.data);
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

      if (result === null || result === 0 || result === undefined) {
        console.log('[Server] No saved data for player:', player.name);
        return null;
      }

      if (typeof result !== 'object' || Object.keys(result).length === 0) {
        console.log('[Server] Empty or invalid data for player:', player.name);
        return null;
      }

      console.log('[Server] ✅ Loaded player data for:', player.name);
      return result as unknown as PlayerData;
    } catch (error) {
      console.error('[Server] ❌ Failed to load player data:', error);
      return null;
    }
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
