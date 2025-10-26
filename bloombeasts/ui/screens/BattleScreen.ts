/**
 * Unified Battle Screen Component
 * Works on both Horizon and Web platforms
 * Exactly mimics the UI from deployments/web/src/screens/battleScreen.ts
 */

import { COLORS } from '../styles/colors';
import type { UIMethodMappings } from '../../../bloombeasts/BloomBeastsGame';
import type { AsyncMethods } from '../types/bindings';
import { DIMENSIONS, GAPS } from '../styles/dimensions';
import { standardCardDimensions, sideMenuButtonDimensions } from '../constants/dimensions';
import { sideMenuPositions } from '../constants/positions';
import type { SimplePosition, BattleBoardAssetPositions } from '../constants/positions';
import { nectarEmoji, deckEmoji } from '../constants/emojis';
import type { BattleDisplay, ObjectiveDisplay } from '../../../bloombeasts/gameManager';
import { UINodeType } from './ScreenUtils';
import { createSideMenu, createTextRow } from './common/SideMenu';
import { createCardComponent, CARD_DIMENSIONS } from './common/CardRenderer';
import { createCardDetailPopup } from './common/CardDetailPopup';

// BattleScreen-specific constants
const gameDimensions = {
  panelWidth: 1280,
  panelHeight: 720,
};

const buffCardDimensions = {
  width: 128,
  height: 130,
};

const trapCardDimensions = {
  width: 85,
  height: 85,
};

const habitatShiftCardDimensions = {
  width: 100,
  height: 100,
};

const playboardImagePositions: SimplePosition = {
  x: 64,
  y: 72,
};

const battleBoardAssetPositions: BattleBoardAssetPositions = {
  playerOne: {
    beastOne: { x: 64, y: 72 },
    beastTwo: { x: 284, y: 72 },
    beastThree: { x: 504, y: 72 },
    buffOne: { x: 724, y: 72 },
    buffTwo: { x: 861, y: 72 },
    trapOne: { x: 725, y: 212 },
    trapTwo: { x: 814, y: 212 },
    trapThree: { x: 903, y: 212 },
    health: { x: 915, y: 324 },
  },
  playOneInfoPosition: { x: 1015, y: 88 },
  playerTwo: {
    beastOne: { x: 64, y: 363 },
    beastTwo: { x: 284, y: 363 },
    beastThree: { x: 504, y: 363 },
    buffOne: { x: 724, y: 514 },
    buffTwo: { x: 861, y: 514 },
    trapOne: { x: 725, y: 420 },
    trapTwo: { x: 814, y: 420 },
    trapThree: { x: 903, y: 420 },
    health: { x: 915, y: 378 },
  },
  playerTwoInfoPosition: { x: 1015, y: 379 },
  habitatZone: { x: 725, y: 310 },
  cardTextPositions: {
    cost: { x: 20, y: 10, size: DIMENSIONS.fontSize.xxl + 2, textAlign: 'center', textBaseline: 'top' },
    affinity: { x: 175, y: 7 },
    beastImage: { x: 12, y: 13 },
    level: { x: 105, y: 182, size: DIMENSIONS.fontSize.xs, textAlign: 'center', textBaseline: 'top' },
    experienceBar: { x: 44, y: 182 },
    name: { x: 105, y: 13, size: DIMENSIONS.fontSize.md, textAlign: 'center', textBaseline: 'top' },
    ability: { x: 21, y: 212, size: DIMENSIONS.fontSize.xs, textAlign: 'left', textBaseline: 'top' },
    attack: { x: 20, y: 176, size: DIMENSIONS.fontSize.xxl + 2, textAlign: 'center', textBaseline: 'top' },
    health: { x: 188, y: 176, size: DIMENSIONS.fontSize.xxl + 2, textAlign: 'center', textBaseline: 'top' },
    icons: {
      attack: { x: 17, y: 44, size: DIMENSIONS.fontSize.xxl + 2, textAlign: 'center', textBaseline: 'top' },
      ability: { x: 157, y: 44, size: DIMENSIONS.fontSize.xxl + 2, textAlign: 'center', textBaseline: 'top' },
    }
  },
};

export interface BattleScreenProps {
  ui: UIMethodMappings;
  async: AsyncMethods;
  battleState?: any; // Can be BindingInterface<string> OR BindingInterface<BattleDisplay>
  message?: any; // BindingInterface<string> for simple messages
  battleDisplay?: any; // Direct BattleDisplay binding for full battle data
  onAction?: (action: string) => void;
  onNavigate?: (screen: string) => void;
  onRenderNeeded?: () => void;
}

/**
 * Unified Battle Screen that exactly replicates web deployment's battle UI
 */
export class BattleScreen {
  // UI methods (injected)
  private ui: UIMethodMappings;
  private async: AsyncMethods;

  // State bindings
  private battleState: any; // Simple string state
  private message: any; // Simple message
  private battleDisplay: any; // Full BattleDisplay binding
  private showHand: any;
  private handScrollOffset: any;
  private turnTimer: any;
  private selectedCardDetail: any;
  private isPlayerTurn: any; // Initialize to false - will be set when battle data arrives
  private endTurnButtonText: any; // Binding for button text that updates reactively

  // Targeting state for cards that require targets
  private targetingCardIndex: number | null = null;
  private targetingCard: any | null = null;

  // Temporary card display (for showing played cards)
  private playedCardDisplay: any | null = null;
  private playedCardTimeout: number | null = null;

  // Timer management
  private timerInterval: number | null = null;

  // Configuration
  private cardsPerRow = 5;
  private rowsPerPage = 1;

  // Render guard to prevent infinite loops
  private isRendering = false;
  private needsRerender = false;

  // Callbacks
  private onAction?: (action: string) => void;
  private onNavigate?: (screen: string) => void;
  private onRenderNeeded?: () => void;

  constructor(props: BattleScreenProps) {
    this.ui = props.ui;
    this.async = props.async;

    // Initialize bindings after ui is set
    this.showHand = new this.ui.Binding(true);
    this.handScrollOffset = new this.ui.Binding(0);
    this.turnTimer = new this.ui.Binding(60);
    this.selectedCardDetail = new this.ui.Binding<any | null>(null);
    this.isPlayerTurn = new this.ui.Binding(false);
    this.endTurnButtonText = new this.ui.Binding('Enemy Turn');

    // console.log('[BattleScreen] Constructor called, props:', {
    //   hasBattleDisplay: !!props.battleDisplay,
    //   battleDisplayType: props.battleDisplay ? typeof props.battleDisplay : 'undefined',
    //   battleDisplayGet: props.battleDisplay && typeof props.battleDisplay.get === 'function' ? props.battleDisplay.get() : 'no get method'
    // });

    // Handle both simple and full battle modes
    this.battleState = props.battleState;
    this.message = props.message;
    this.battleDisplay = props.battleDisplay;

    this.onAction = props.onAction;
    this.onNavigate = props.onNavigate;
    this.onRenderNeeded = props.onRenderNeeded;

    // Subscribe to state changes that need re-rendering
    // Use safeRender to prevent infinite loops
    this.showHand.subscribe(() => this.safeRender());
    this.handScrollOffset.subscribe(() => this.safeRender());
    this.selectedCardDetail.subscribe(() => this.safeRender());
    this.isPlayerTurn.subscribe(() => {
      // Update button text when turn changes
      // console.log('[BattleScreen] isPlayerTurn changed to:', this.isPlayerTurn.get());
      this.updateEndTurnButtonText();
      this.safeRender();
    });
    this.turnTimer.subscribe(() => {
      // Update button text when timer changes
      this.updateEndTurnButtonText();
      // Trigger re-render for timer countdown
      this.safeRender();
    });

    // Subscribe to battleDisplay changes to update isPlayerTurn
    if (this.battleDisplay) {
      // console.log('[BattleScreen] Setting up battleDisplay subscription');
      // console.log('[BattleScreen] battleDisplay binding instance:', this.battleDisplay);
      // console.log('[BattleScreen] Initial battleDisplay.get():', this.battleDisplay.get());

      this.battleDisplay.subscribe((state: any) => {
        // console.log('[BattleScreen] ==========================================');
        // console.log('[BattleScreen] BattleDisplay subscription fired!');
        // console.log('[BattleScreen] state parameter:', state);
        // console.log('[BattleScreen] this.battleDisplay.get():', this.battleDisplay?.get());
        // console.log('[BattleScreen] state.turnPlayer:', state?.turnPlayer);
        // console.log('[BattleScreen] state object keys:', state ? Object.keys(state) : 'state is null');
        // console.log('[BattleScreen] ==========================================');
        const newIsPlayerTurn = state?.turnPlayer === 'player';
        // console.log('[BattleScreen] Checking turn: state?.turnPlayer === "player"?', newIsPlayerTurn);

        if (this.isPlayerTurn.get() !== newIsPlayerTurn) {
          // console.log('[BattleScreen] BattleDisplay changed, updating isPlayerTurn to:', newIsPlayerTurn);
          this.isPlayerTurn.set(newIsPlayerTurn);

          // Start/stop timer based on turn changes
          if (newIsPlayerTurn) {
            // console.log('[BattleScreen] Subscription detected player turn, calling startTurnTimer()');
            this.startTurnTimer();
          } else {
            // console.log('[BattleScreen] Subscription detected opponent turn, calling stopTurnTimer()');
            this.stopTurnTimer();
          }
        } else {
          // console.log('[BattleScreen] isPlayerTurn unchanged, still:', newIsPlayerTurn);
        }
      });

      // Initialize isPlayerTurn from current state
      const state = this.battleDisplay.get();
      // console.log('[BattleScreen] ==========================================');
      // console.log('[BattleScreen] Constructor: Checking initial battleDisplay state');
      // console.log('[BattleScreen] state exists?', !!state);
      // console.log('[BattleScreen] state:', state);
      // console.log('[BattleScreen] ==========================================');
      if (state) {
        // console.log('[BattleScreen] Initial battleDisplay state:', {
        //   turnPlayer: state.turnPlayer,
        //   currentTurn: state.currentTurn,
        //   activePlayer: state.activePlayer,
        //   keys: Object.keys(state)
        // });

        this.isPlayerTurn.set(state.turnPlayer === 'player');

        // Start timer after a short delay to avoid render loop
        if (state.turnPlayer === 'player') {
          // console.log('[BattleScreen] Player turn detected in constructor, scheduling timer start');
          this.async.setTimeout(() => {
            // console.log('[BattleScreen] Timer start timeout fired, calling startTurnTimer()');
            this.startTurnTimer();
          }, 100);
        } else {
          // console.log('[BattleScreen] NOT player turn in constructor, turnPlayer is:', state.turnPlayer);
        }
      } else {
        // console.log('[BattleScreen] No initial state in constructor, will wait for subscription');
      }
    }
  }

  /**
   * Safe render wrapper to prevent infinite loops
   */
  private safeRender(): void {
    if (this.isRendering) {
      // Already rendering, schedule for after current render completes
      this.needsRerender = true;
      return;
    }
    this.onRenderNeeded?.();
  }

  /**
   * Create the complete battle UI
   */
  createUI(): UINodeType {
    // console.log('[BattleScreen] createUI called');
    this.isRendering = true;
    this.needsRerender = false;
    // Check if we have full battle display data
    if (this.battleDisplay) {
      const state = this.battleDisplay.get();
      // console.log('[BattleScreen] Battle display state:', state ? 'Present' : 'Null');
      if (!state) {
        // console.log('[BattleScreen] No battle display data, showing loading state');
        return this.createLoadingState();
      }

      // console.log('[BattleScreen] Creating full battle UI with data:', {
      //   playerHealth: state.playerHealth,
      //   opponentHealth: state.opponentHealth,
      //   currentTurn: state.currentTurn,
      //   turnPlayer: state.turnPlayer,
      //   isPlayerTurn: this.isPlayerTurn.get(),
      //   timerValue: this.turnTimer.get()
      // });

      // Mark rendering as complete
      this.finishRender();

      // Full battle UI
      return this.ui.View({
        style: {
          width: gameDimensions.panelWidth,
          height: gameDimensions.panelHeight,
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Layer 1: Background image (full screen)
          this.createBackground(),

          // Layer 2: Playboard overlay
          this.createPlayboard(),

          // Layer 3: Battle zones (beasts, traps, buffs, habitat)
          this.createBattleZones(state),

          // Layer 4: Player/Opponent info displays
          this.createInfoDisplays(state),

          // Layer 5: Side menu with controls
          this.createBattleSideMenu(state),

          // Layer 6: Player hand overlay (conditionally shown)
          this.createPlayerHand(state),

          // Layer 7: Card detail popup (if active)
          state.cardPopup ? this.createCardPopup(state.cardPopup) : null,

          // Layer 7.25: Selected card detail popup (from clicking buff/trap cards)
          this.selectedCardDetail.get() ? createCardDetailPopup(this.ui, {
            cardDetail: {
              card: this.selectedCardDetail.get(),
              isInDeck: false,
              buttons: ['Close']
            },
            onButtonClick: (buttonId: string) => {
              // console.log('[BattleScreen] Closing selected card detail, buttonId:', buttonId);
              this.selectedCardDetail.set(null);
              this.onRenderNeeded?.();
            }
          }) : null,

          // Layer 7.5: Played card popup (temporary 2-second display)
          this.playedCardDisplay ? this.createPlayedCardPopup(this.playedCardDisplay) : null,

          // Layer 8: Attack animation overlays
          this.createAttackAnimations(state),
        ].filter(Boolean),
      });
    }

    // Simple placeholder mode (for compatibility with BloomBeastsGame)
    // console.log('[BattleScreen] No battleDisplay binding, using simple mode');
    return this.createSimpleBattleUI();
  }

  /**
   * Create simple battle UI (placeholder mode for BloomBeastsGame compatibility)
   */
  private createSimpleBattleUI(): UINodeType {
    const battleState = this.battleState?.get() || 'initializing';
    const message = this.message?.get() || 'Preparing for battle...';

    // Mark rendering as complete
    this.finishRender();

    return this.ui.View({
      style: {
        width: DIMENSIONS.panel.width,
        height: DIMENSIONS.panel.height,
        backgroundColor: COLORS.background,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40
      },
      children: [
        // Battle title
        this.ui.Text({
          text: '⚔️ Battle Arena ⚔️',
          style: {
            fontSize: DIMENSIONS.fontSize.hero,
            fontWeight: 'bold',
            color: COLORS.textPrimary,
            marginBottom: 30
          }
        }),

        // Battle state
        this.ui.View({
          style: {
            backgroundColor: COLORS.surface,
            borderRadius: 12,
            padding: 30,
            marginBottom: 30,
            minWidth: 400,
            alignItems: 'center'
          },
          children: [
            this.ui.Text({
              text: battleState,
              style: {
                fontSize: DIMENSIONS.fontSize.xl,
                fontWeight: 'bold',
                color: COLORS.warning,
                marginBottom: 10
              }
            }),
            this.ui.Text({
              text: message,
              style: {
                fontSize: DIMENSIONS.fontSize.lg,
                color: COLORS.textSecondary,
                textAlign: 'center'
              }
            })
          ]
        }),

        // Action buttons
        this.ui.View({
          style: {
            flexDirection: 'row',
            marginBottom: 30
          },
          children: [
            this.ui.Pressable({
              onClick: () => this.onAction?.('attack'),
              style: {
                backgroundColor: COLORS.error,
                borderRadius: 8,
                padding: 15,
                minWidth: 120,
                marginRight: 20
              },
              children: this.ui.Text({
                text: '⚔️ Attack',
                style: {
                  fontSize: DIMENSIONS.fontSize.lg,
                  fontWeight: 'bold',
                  color: '#fff',
                  textAlign: 'center'
                }
              })
            }),
            this.ui.Pressable({
              onClick: () => this.onAction?.('defend'),
              style: {
                backgroundColor: COLORS.info,
                borderRadius: 8,
                padding: 15,
                minWidth: 120
              },
              children: this.ui.Text({
                text: '🛡️ Defend',
                style: {
                  fontSize: DIMENSIONS.fontSize.lg,
                  fontWeight: 'bold',
                  color: '#fff',
                  textAlign: 'center'
                }
              })
            }),
            this.ui.Pressable({
              onClick: () => this.onAction?.('special'),
              style: {
                backgroundColor: COLORS.warning,
                borderRadius: 8,
                padding: 15,
                minWidth: 120
              },
              children: this.ui.Text({
                text: '✨ Special',
                style: {
                  fontSize: DIMENSIONS.fontSize.lg,
                  fontWeight: 'bold',
                  color: '#fff',
                  textAlign: 'center'
                }
              })
            })
          ]
        }),

        // Back button
        this.ui.Pressable({
          onClick: () => this.onNavigate?.('menu'),
          style: {
            backgroundColor: COLORS.surface,
            borderRadius: 8,
            padding: 12
          },
          children: this.ui.Text({
            text: '← Exit Battle',
            style: {
              fontSize: DIMENSIONS.fontSize.md,
              color: COLORS.textSecondary
            }
          })
        })
      ]
    });
  }

  /**
   * Create loading state placeholder
   */
  private createLoadingState(): UINodeType {
    // Mark rendering as complete
    this.finishRender();

    return this.ui.View({
      style: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
      },
      children: this.ui.Text({
        text: 'Loading Battle...',
        style: {
          fontSize: DIMENSIONS.fontSize.xl,
          color: COLORS.textPrimary,
        },
      }),
    });
  }

  /**
   * Create full-screen background
   */
  private createBackground(): UINodeType {
    return this.ui.Image({
      imageId: 'background',
      style: {
        position: 'absolute',
        width: gameDimensions.panelWidth,
        height: gameDimensions.panelHeight,
        top: 0,
        left: 0,
      },
    });
  }

  /**
   * Create playboard overlay image
   */
  private createPlayboard(): UINodeType {
    return this.ui.Image({
      imageId: 'playboard',
      style: {
        position: 'absolute',
        width: 1073,
        height: 572,
        left: playboardImagePositions.x,
        top: playboardImagePositions.y,
      },
    });
  }

  /**
   * Create all battle zones (beasts, traps, buffs, habitat)
   */
  private createBattleZones(state: BattleDisplay): UINodeType {
    return this.ui.View({
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
      },
      children: [
        // Player battlefield (bottom)
        ...this.createBeastField('player', state.playerField, state),

        // Opponent battlefield (top)
        ...this.createBeastField('opponent', state.opponentField, state),

        // Player trap zone
        ...this.createTrapZone('player', state.playerTrapZone),

        // Opponent trap zone
        ...this.createTrapZone('opponent', state.opponentTrapZone),

        // Player buff zone
        ...this.createBuffZone('player', state.playerBuffZone),

        // Opponent buff zone
        ...this.createBuffZone('opponent', state.opponentBuffZone),

        // Habitat zone (center)
        state.habitatZone ? this.createHabitatZone(state.habitatZone) : null,
      ].filter(Boolean),
    });
  }

  /**
   * Create beast field for a player
   */
  private createBeastField(
    player: 'player' | 'opponent',
    beasts: any[],
    state: BattleDisplay
  ): UINodeType[] {
    const positions = player === 'player'
      ? battleBoardAssetPositions.playerTwo
      : battleBoardAssetPositions.playerOne;
    const slots = [positions.beastOne, positions.beastTwo, positions.beastThree];

    return beasts.map((beast, index) => {
      if (!beast || !slots[index]) return null;

      const pos = slots[index];
      const isSelected = player === 'player' && state.selectedBeastIndex === index;
      const isAttacking = state.attackAnimation?.attackerPlayer === player &&
                         state.attackAnimation?.attackerIndex === index;
      const isTarget = state.attackAnimation?.targetPlayer === player &&
                      state.attackAnimation?.targetIndex === index;

      // Check if this beast is a valid target in targeting mode
      const isTargetable = player === 'opponent' && this.targetingCardIndex !== null;

      return this.ui.View({
        style: {
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: standardCardDimensions.width,
          height: standardCardDimensions.height,
        },
        children: [
          // Beast card component wrapped in Pressable for click handling
          this.ui.Pressable({
            onClick: () => {
              // console.log(`[BattleScreen] Beast card clicked: ${player}-${index}`);

              // Check if we're in targeting mode
              if (this.targetingCardIndex !== null && player === 'opponent') {
                // Show card popup first, then play with target
                const cardIndex = this.targetingCardIndex;
                const card = this.targetingCard;

                // Exit targeting mode
                this.targetingCardIndex = null;
                this.targetingCard = null;

                if (card && (card.type === 'Magic' || card.type === 'Buff')) {
                  this.showPlayedCard(card, () => {
                    // console.log(`[BattleScreen] Playing card ${cardIndex} targeting opponent beast ${index} after popup`);
                    this.onAction?.(`play-card-${cardIndex}-target-${index}`);
                  });
                } else {
                  // Play immediately for other card types
                  // console.log(`[BattleScreen] Playing card ${cardIndex} targeting opponent beast ${index}`);
                  this.onAction?.(`play-card-${cardIndex}-target-${index}`);
                }
              } else {
                // Normal behavior (view card or select for attack)
                this.onAction?.(`view-field-card-${player}-${index}`);
              }
            },
            style: {
              width: standardCardDimensions.width,
              height: standardCardDimensions.height,
            },
            children: createCardComponent(this.ui, {
              card: { ...beast, type: 'Bloom' },
              // Don't pass onClick to avoid nested Pressables
            }),
          }),

          // Targeting highlight (green for valid targets)
          isTargetable ? this.ui.View({
            style: {
              position: 'absolute',
              top: -5,
              left: -5,
              right: -5,
              bottom: -5,
              borderWidth: 3,
              borderColor: '#00ff00',
              borderRadius: 8,
            },
          }) : null,

          // Selection highlight
          isSelected ? this.ui.View({
            style: {
              position: 'absolute',
              top: -5,
              left: -5,
              right: -5,
              bottom: -5,
              borderWidth: 5,
              borderColor: '#FFD700',
              borderRadius: 12,
            },
          }) : null,

          // Attack animation overlay
          (isAttacking || isTarget) ? this.ui.View({
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isAttacking ? 'rgba(0, 255, 0, 0.4)' : 'rgba(255, 0, 0, 0.4)',
              borderRadius: 12,
            },
          }) : null,

          // Action icons overlay
          this.createBeastActionIcons(beast, pos),
        ].filter(Boolean),
      });
    }).filter(Boolean);
  }

  /**
   * Create action icons for beast cards
   */
  private createBeastActionIcons(beast: any, pos: { x: number; y: number }): UINodeType | null {
    if (!beast.summoningSickness) {
      return this.ui.View({
        style: {
          position: 'absolute',
          left: 17,
          top: 44,
          width: 26,
          height: 26,
        },
        children: this.ui.Image({
          imageId: 'icon-attack',
          style: { width: 26, height: 26 },
        }),
      });
    }
    return null;
  }

  /**
   * Create trap zone for a player
   */
  private createTrapZone(player: 'player' | 'opponent', traps: any[]): UINodeType[] {
    const positions = player === 'player'
      ? battleBoardAssetPositions.playerTwo
      : battleBoardAssetPositions.playerOne;
    const trapSlots = [positions.trapOne, positions.trapTwo, positions.trapThree];

    return traps.map((trap, index) => {
      if (!trap || !trapSlots[index]) return null;

      const pos = trapSlots[index];

      return this.ui.View({
        style: {
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: trapCardDimensions.width,
          height: trapCardDimensions.height,
        },
        children: [
          // Trap card playboard image (face-down, hidden for both players)
          this.ui.Image({
            imageId: 'trap-card-playboard',
            style: {
              width: trapCardDimensions.width,
              height: trapCardDimensions.height,
            },
          }),

          // Click handler for player's traps to view details
          player === 'player' ? this.ui.Pressable({
            onClick: () => {
              console.log('[BattleScreen] Player trap clicked, showing detail');
              this.selectedCardDetail.set(trap);
              this.onRenderNeeded?.();
            },
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            },
            children: null,
          }) : null,
        ].filter(Boolean),
      });
    }).filter(Boolean);
  }

  /**
   * Create buff zone for a player
   */
  private createBuffZone(player: 'player' | 'opponent', buffs: any[]): UINodeType[] {
    const positions = player === 'player'
      ? battleBoardAssetPositions.playerTwo
      : battleBoardAssetPositions.playerOne;
    const buffSlots = [positions.buffOne, positions.buffTwo];

    return buffs.map((buff, index) => {
      if (!buff || !buffSlots[index]) return null;

      const pos = buffSlots[index];

      return this.ui.View({
        style: {
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: buffCardDimensions.width,
          height: buffCardDimensions.height,
        },
        children: [
          // Buff card playboard template (face-up, showing the buff on the field)
          this.ui.Image({
            imageId: 'buff-card-playboard',
            style: {
              width: buffCardDimensions.width,
              height: buffCardDimensions.height,
            },
          }),

          // Buff card artwork image (100x100) centered inside the playboard
          this.ui.Image({
            imageId: buff.id?.replace(/-\d+-\d+$/, '') || buff.name.toLowerCase().replace(/\s+/g, '-'),
            style: {
              position: 'absolute',
              top: (buffCardDimensions.height - 100) / 2,
              left: (buffCardDimensions.width - 100) / 2,
              width: 100,
              height: 100,
            },
          }),

          // Golden glow effect for active buffs
          this.ui.View({
            style: {
              position: 'absolute',
              top: -3,
              left: -3,
              right: -3,
              bottom: -3,
              borderWidth: 3,
              borderColor: '#FFD700',
              borderRadius: 8,
              shadowColor: '#FFD700',
              shadowRadius: 8,
            },
          }),

          // Click handler for viewing buff details (works for both player and opponent)
          this.ui.Pressable({
            onClick: () => {
              console.log(`[BattleScreen] Buff card clicked: ${player}-${index}, showing detail`);
              this.selectedCardDetail.set(buff);
              this.onRenderNeeded?.();
            },
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            },
            children: null,
          }),
        ],
      });
    }).filter(Boolean);
  }

  /**
   * Create habitat zone
   */
  private createHabitatZone(habitat: any): UINodeType {
    const pos = battleBoardAssetPositions.habitatZone;

    return this.ui.View({
      style: {
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: habitatShiftCardDimensions.width,
        height: habitatShiftCardDimensions.height,
      },
      children: [
        // Habitat card playboard template
        this.ui.Image({
          imageId: 'habitat-playboard',
          style: {
            width: habitatShiftCardDimensions.width,
            height: habitatShiftCardDimensions.height,
          },
        }),

        // Habitat artwork image (70x70) centered inside the playboard
        this.ui.Image({
          imageId: habitat.id?.replace(/-\d+-\d+$/, '') || habitat.name.toLowerCase().replace(/\s+/g, '-'),
          style: {
            position: 'absolute',
            top: (habitatShiftCardDimensions.height - 70) / 2,
            left: (habitatShiftCardDimensions.width - 70) / 2,
            width: 70,
            height: 70,
          },
        }),

        // Green glow effect for active habitat
        this.ui.View({
          style: {
            position: 'absolute',
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            borderWidth: 4,
            borderColor: '#4caf50',
            borderRadius: 8,
            shadowColor: '#4caf50',
            shadowRadius: 10,
          },
        }),

        // Counter badges
        habitat.counters && habitat.counters.length > 0
          ? this.createCounterBadges(habitat.counters, pos)
          : null,

        // Click handler for viewing habitat details
        this.ui.Pressable({
          onClick: () => {
            console.log('[BattleScreen] Habitat card clicked, showing detail');
            this.selectedCardDetail.set({ ...habitat, type: 'Habitat' });
            this.onRenderNeeded?.();
          },
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
          children: null,
        }),
      ].filter(Boolean),
    });
  }

  /**
   * Create counter badges for habitat
   */
  private createCounterBadges(counters: any[], basePos: { x: number; y: number }): UINodeType {
    const counterMap = new Map<string, number>();
    counters.forEach((counter: any) => {
      const current = counterMap.get(counter.type) || 0;
      counterMap.set(counter.type, current + counter.amount);
    });

    const counterConfigs: Record<string, { emoji: string; color: string }> = {
      'Spore': { emoji: '🍄', color: '#51cf66' },
    };

    const badges = Array.from(counterMap.entries()).map(([type, amount], index) => {
      if (amount <= 0) return null;

      const config = counterConfigs[type] || { emoji: '●', color: '#868e96' };
      const badgeSize = 28;
      const badgeSpacing = 32;
      const offsetX = habitatShiftCardDimensions.width - 10 - (index * badgeSpacing);

      return this.ui.View({
        style: {
          position: 'absolute',
          right: 10 + (index * badgeSpacing),
          top: 5,
          width: badgeSize,
          height: badgeSize,
          backgroundColor: config.color,
          borderRadius: badgeSize / 2,
          borderWidth: 2,
          borderColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        },
        children: this.ui.Text({
          text: `${config.emoji} ${amount}`,
          style: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
          },
        }),
      });
    }).filter(Boolean);

    return this.ui.View({
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      children: badges,
    });
  }

  /**
   * Create player and opponent info displays
   */
  private createInfoDisplays(state: BattleDisplay): UINodeType {
    console.log('[BattleScreen] createInfoDisplays called with health:', {
      playerHealth: state.playerHealth,
      opponentHealth: state.opponentHealth
    });
    const opponentHealthPos = battleBoardAssetPositions.playerOne.health;
    const playerHealthPos = battleBoardAssetPositions.playerTwo.health;
    const opponentInfoPos = battleBoardAssetPositions.playOneInfoPosition;
    const playerInfoPos = battleBoardAssetPositions.playerTwoInfoPosition;

    const isOpponentHealthTarget = state.attackAnimation?.targetPlayer === 'health' &&
                                   state.attackAnimation?.attackerPlayer === 'player';
    const isPlayerHealthTarget = state.attackAnimation?.targetPlayer === 'health' &&
                                state.attackAnimation?.attackerPlayer === 'opponent';

    return this.ui.View({
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
      },
      children: [
        // Opponent health
        this.ui.View({
          style: {
            position: 'absolute',
            left: opponentHealthPos.x - 40,
            top: opponentHealthPos.y - 15,
            width: 80,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isOpponentHealthTarget ? 'rgba(255, 0, 0, 0.4)' : 'transparent',
            borderRadius: 4,
          },
          children: [
            this.ui.Text({
              text: `${state.opponentHealth}/${state.opponentMaxHealth}`,
              style: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
              },
            }),
            // Make clickable if a beast is selected for direct attack
            state.selectedBeastIndex !== null ? this.ui.Pressable({
              onClick: () => {
                console.log(`[BattleScreen] Opponent health clicked, attacking with beast ${state.selectedBeastIndex}`);
                this.onAction?.(`attack-player-${state.selectedBeastIndex}`);
              },
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              },
              children: null,
            }) : null,
          ].filter(Boolean),
        }),

        // Player health
        this.ui.View({
          style: {
            position: 'absolute',
            left: playerHealthPos.x - 40,
            top: playerHealthPos.y - 15,
            width: 80,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isPlayerHealthTarget ? 'rgba(255, 0, 0, 0.4)' : 'transparent',
            borderRadius: 4,
          },
          children: this.ui.Text({
            text: `${state.playerHealth}/${state.playerMaxHealth}`,
            style: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'center',
            },
          }),
        }),

        // Opponent info
        this.ui.View({
          style: {
            position: 'absolute',
            left: opponentInfoPos.x,
            top: opponentInfoPos.y,
          },
          children: [
            this.ui.Text({
              text: 'Opponent',
              style: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: 5,
              },
            }),
            this.ui.Text({
              text: `${nectarEmoji} ${state.opponentNectar}/10`,
              style: {
                fontSize: 18,
                color: '#fff',
                marginBottom: 5,
              },
            }),
            this.ui.Text({
              text: `${deckEmoji} ${state.opponentDeckCount}/30`,
              style: {
                fontSize: 18,
                color: '#fff',
              },
            }),
          ],
        }),

        // Player info
        this.ui.View({
          style: {
            position: 'absolute',
            left: playerInfoPos.x,
            top: playerInfoPos.y,
          },
          children: [
            this.ui.Text({
              text: 'Player',
              style: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: 5,
              },
            }),
            this.ui.Text({
              text: `${nectarEmoji} ${state.playerNectar}/10`,
              style: {
                fontSize: 18,
                color: '#fff',
                marginBottom: 5,
              },
            }),
            this.ui.Text({
              text: `${deckEmoji} ${state.playerDeckCount}/30`,
              style: {
                fontSize: 18,
                color: '#fff',
              },
            }),
          ],
        }),
      ],
    });
  }

  /**
   * Create battle-specific side menu
   */
  private createBattleSideMenu(state: BattleDisplay): UINodeType {
    // Timer is now managed via battleDisplay subscriptions, not during render
    // This prevents infinite render loops

    const showDeathmatch = state.currentTurn >= 30;
    const deathmatchDamage = Math.floor((state.currentTurn - 30) / 5) + 1;

    return this.ui.View({
      style: {
        position: 'absolute',
        left: sideMenuPositions.x,
        top: sideMenuPositions.y,
        width: 127,
        height: 465,
      },
      children: [
        // Side menu background
        this.ui.Image({
          imageId: 'side-menu',
          style: {
            position: 'absolute',
            width: 127,
            height: 465,
          },
        }),

        // Forfeit button (at header position)
        this.ui.Pressable({
          onClick: () => {
            console.log('[BattleScreen] Forfeit button clicked');
            this.onAction?.('btn-forfeit');
          },
          style: {
            position: 'absolute',
            left: sideMenuPositions.headerStartPosition.x - sideMenuPositions.x,
            top: sideMenuPositions.headerStartPosition.y - sideMenuPositions.y,
            width: sideMenuButtonDimensions.width,
            height: sideMenuButtonDimensions.height,
          },
          children: [
            // Button background image
            this.ui.Image({
              imageId: 'standard-button',
              style: {
                position: 'absolute',
                width: sideMenuButtonDimensions.width,
                height: sideMenuButtonDimensions.height,
              },
            }),
            // Button text centered over image
            this.ui.View({
              style: {
                position: 'absolute',
                width: sideMenuButtonDimensions.width,
                height: sideMenuButtonDimensions.height,
                justifyContent: 'center',
                alignItems: 'center',
              },
              children: this.ui.Text({
                text: 'Forfeit',
                style: {
                  fontSize: DIMENSIONS.fontSize.md,
                  fontWeight: 'bold',
                  color: '#fff',
                  textAlign: 'center',
                },
              }),
            }),
          ],
        }),

        // Battle info text
        this.ui.View({
          style: {
            position: 'absolute',
            left: sideMenuPositions.textStartPosition.x - sideMenuPositions.x,
            top: sideMenuPositions.textStartPosition.y - sideMenuPositions.y,
          },
          children: [
            this.ui.Text({
              text: 'Battle',
              style: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: 5,
              },
            }),
            this.ui.Text({
              text: `Turn ${state.currentTurn}`,
              style: {
                fontSize: 18,
                color: '#fff',
                marginBottom: 5,
              },
            }),
            showDeathmatch ? this.ui.Text({
              text: `Deathmatch! -${deathmatchDamage} HP`,
              style: {
                fontSize: 16,
                color: '#ff6b6b',
                fontWeight: 'bold',
              },
            }) : null,
          ].filter(Boolean),
        }),

        // End Turn button with timer - uses derived bindings for reactive updates
        this.ui.Pressable({
          onClick: () => {
            const currentIsPlayerTurn = this.isPlayerTurn.get();
            console.log('[BattleScreen] End Turn button clicked, isPlayerTurn:', currentIsPlayerTurn);
            if (currentIsPlayerTurn) {
              this.stopTurnTimer();
              console.log('[BattleScreen] Calling onAction with btn-end-turn');
              this.onAction?.('end-turn');
            } else {
              console.log('[BattleScreen] End Turn clicked but not player turn');
            }
          },
          disabled: this.isPlayerTurn.derive((ipt: boolean) => !ipt),
          style: {
            position: 'absolute',
            left: sideMenuPositions.buttonStartPosition.x - sideMenuPositions.x,
            top: sideMenuPositions.buttonStartPosition.y - sideMenuPositions.y,
            width: sideMenuButtonDimensions.width,
            height: sideMenuButtonDimensions.height,
            opacity: this.isPlayerTurn.derive((ipt: boolean) => ipt ? 1 : 0.5),
          },
          children: [
            // Button background image - green when player turn, standard when opponent turn
            this.ui.Image({
              imageId: this.isPlayerTurn.derive((ipt: boolean) => ipt ? 'green-button' : 'standard-button'),
              style: {
                position: 'absolute',
                width: sideMenuButtonDimensions.width,
                height: sideMenuButtonDimensions.height,
              },
            }),
            // Button text centered over image
            this.ui.View({
              style: {
                position: 'absolute',
                width: sideMenuButtonDimensions.width,
                height: sideMenuButtonDimensions.height,
                justifyContent: 'center',
                alignItems: 'center',
              },
              children: (() => {
                const buttonText = this.endTurnButtonText.get();
                console.log('[BattleScreen] Rendering button text:', buttonText);
                return this.ui.Text({
                  text: this.endTurnButtonText,
                  style: {
                    fontSize: DIMENSIONS.fontSize.md,
                    fontWeight: 'bold',
                    color: '#fff',
                    textAlign: 'center',
                  },
                });
              })(),
            }),
          ],
        }),
      ],
    });
  }

  /**
   * Create player hand overlay - matches canvas version exactly
   */
  private createPlayerHand(state: BattleDisplay): UINodeType | null {
    if (!state.playerHand || state.playerHand.length === 0) return null;

    const showFull = this.showHand.get();
    const scrollOffset = this.handScrollOffset.get();

    // Match canvas version dimensions exactly
    const cardWidth = standardCardDimensions.width;  // 210
    const cardHeight = standardCardDimensions.height; // 280
    const cardsPerRow = 5;
    const rowsPerPage = 1;
    const spacing = 10;
    const startX = 50;
    const overlayWidth = 1210;
    const overlayHeight = showFull ? 300 : 60;
    const overlayY = gameDimensions.panelHeight - overlayHeight; // 720 - overlayHeight
    const startY = overlayY + 10;

    // Calculate visible cards
    const cardsPerPage = cardsPerRow * rowsPerPage;
    const startIndex = scrollOffset * cardsPerPage;
    const endIndex = Math.min(startIndex + cardsPerPage, state.playerHand.length);
    const visibleCards = state.playerHand.slice(startIndex, endIndex);
    const totalPages = Math.ceil(state.playerHand.length / cardsPerPage);

    return this.ui.View({
      style: {
        position: 'absolute',
        left: 40,
        top: overlayY,
        width: overlayWidth,
        height: overlayHeight,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderWidth: 3,
        borderColor: '#4a8ec2',
      },
      children: [
        // Render cards (always render, even when minimized)
        ...visibleCards.map((card, i) => {
          const actualIndex = startIndex + i;
          const col = i % cardsPerRow;
          const row = Math.floor(i / cardsPerRow);
          const x = startX + col * (cardWidth + spacing);
          const y = startY + row * (cardHeight + spacing);
          const canAfford = card.cost <= state.playerNectar;

          return this.ui.View({
            style: {
              position: 'absolute',
              left: x - 40, // Relative to overlay left edge
              top: y - overlayY, // Relative to overlay top edge
              width: cardWidth,
              height: cardHeight,
            },
            children: [
              // Card component with click handler
              this.ui.Pressable({
                onClick: () => {
                  console.log(`[BattleScreen] Card clicked: ${actualIndex}, card: ${card.name}`);
                  console.log('[BattleScreen] Card targetRequired:', card.targetRequired);

                  // Check if card requires a target
                  if (card.targetRequired) {
                    // Enter targeting mode
                    console.log('[BattleScreen] Entering targeting mode for card:', card.name);
                    this.targetingCardIndex = actualIndex;
                    this.targetingCard = card;
                    this.onRenderNeeded?.();
                  } else {
                    // Show card popup for magic/buff cards, then play
                    if (card.type === 'Magic' || card.type === 'Buff') {
                      this.showPlayedCard(card, () => {
                        console.log('[BattleScreen] Playing card without target after popup');
                        this.onAction?.(`play-card-${actualIndex}`);
                      });
                    } else {
                      // Play card immediately (Bloom, Trap, etc.)
                      console.log('[BattleScreen] Playing card without target');
                      this.onAction?.(`play-card-${actualIndex}`);
                    }
                  }
                },
                style: {
                  width: cardWidth,
                  height: cardHeight,
                },
                children: createCardComponent(this.ui, {
                  card: card,
                }),
              }),

              // Dim overlay if not affordable (matches canvas version exactly)
              !canAfford ? this.ui.View({
                style: {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
              }) : null,
            ].filter(Boolean),
          });
        }),

        // Toggle button - matches canvas version exactly (60x50, at overlayWidth - 50, overlayY + 10)
        this.ui.Pressable({
          onClick: () => {
            console.log('[BattleScreen] Toggle button clicked, showFull:', showFull);
            const newShowHand = !showFull;
            this.showHand.set(newShowHand);
            console.log('[BattleScreen] Set showHand to:', newShowHand);
            // Trigger re-render by calling the action
            this.onAction?.('toggle-hand');
            console.log('[BattleScreen] Called toggle-hand action');
          },
          style: {
            position: 'absolute',
            left: overlayWidth - 50,
            top: 10,
            width: 60,
            height: 50,
            backgroundColor: '#4a8ec2',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
          },
          children: this.ui.Text({
            text: showFull ? 'X' : '↑',
            style: {
              fontSize: 24,
              fontWeight: 'bold',
              color: '#fff',
            },
          }),
        }),

        // Scroll buttons (only when showing full hand)
        ...(showFull ? [
          // Up button (positioned below toggle button)
          this.ui.Pressable({
            onClick: () => {
              this.handScrollOffset.set(Math.max(0, scrollOffset - 1));
              // Trigger re-render
              this.onAction?.('scroll-hand');
            },
            disabled: scrollOffset <= 0,
            style: {
              position: 'absolute',
              left: overlayWidth - 50,
              top: 10 + 50 + 10, // Below toggle button
              width: 60,
              height: 50,
              backgroundColor: scrollOffset > 0 ? '#4a8ec2' : '#666',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: scrollOffset > 0 ? 1 : 0.5,
            },
            children: this.ui.Text({
              text: '⬆',
              style: {
                fontSize: 24,
                fontWeight: 'bold',
                color: '#fff',
              },
            }),
          }),

          // Down button (positioned below up button)
          this.ui.Pressable({
            onClick: () => {
              this.handScrollOffset.set(Math.min(totalPages - 1, scrollOffset + 1));
              // Trigger re-render
              this.onAction?.('scroll-hand');
            },
            disabled: scrollOffset >= totalPages - 1 || state.playerHand.length <= cardsPerPage,
            style: {
              position: 'absolute',
              left: overlayWidth - 50,
              top: 10 + 50 + 10 + 50 + 10, // Below up button
              width: 60,
              height: 50,
              backgroundColor: (scrollOffset < totalPages - 1 && state.playerHand.length > cardsPerPage) ? '#4a8ec2' : '#666',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: (scrollOffset < totalPages - 1 && state.playerHand.length > cardsPerPage) ? 1 : 0.5,
            },
            children: this.ui.Text({
              text: '↓',
              style: {
                fontSize: 24,
                fontWeight: 'bold',
                color: '#fff',
              },
            }),
          }),
        ] : []),
      ].filter(Boolean),
    });
  }

  /**
   * Create card popup overlay
   */
  private createCardPopup(popup: any): UINodeType {
    return this.ui.View({
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      },
      children: [
        // Card detail popup
        createCardDetailPopup(this.ui, {
          cardDetail: {
            card: popup.card,
            isInDeck: false,
            buttons: popup.showCloseButton ? ['Close'] : []
          },
          onButtonClick: () => this.onAction?.('btn-card-close'),
        }),
      ],
    });
  }

  /**
   * Create attack animation overlays
   */
  private createAttackAnimations(state: BattleDisplay): UINodeType | null {
    // Attack animations are handled directly in the beast field rendering
    // This is a placeholder for any additional animation effects
    return null;
  }

  /**
   * Start the turn timer
   */
  private startTurnTimer(): void {
    console.log('[BattleScreen] ========== startTurnTimer() called ==========');
    console.log('[BattleScreen] Current timerInterval:', this.timerInterval);

    // Don't start if already running
    if (this.timerInterval !== null) {
      console.log('[BattleScreen] Timer already running, skipping start');
      return;
    }

    console.log('[BattleScreen] Starting timer from 60');
    this.turnTimer.set(60);
    this.updateEndTurnButtonText(); // Initialize button text

    console.log('[BattleScreen] Creating setInterval with 1000ms delay');
    this.timerInterval = this.async.setInterval(() => {
      const current = this.turnTimer.get();
      console.log('[BattleScreen] ⏰ Timer tick:', current);

      if (current <= 0) {
        console.log('[BattleScreen] Timer reached 0, ending turn');
        this.stopTurnTimer();
        this.onAction?.('end-turn');
      } else {
        this.turnTimer.set(current - 1);
        console.log('[BattleScreen] Timer updated to:', current - 1);
        // Timer binding update will trigger updateEndTurnButtonText via subscription
        // which will update endTurnButtonText binding and trigger re-render via turnTimer subscription
      }
    }, 1000);

    console.log('[BattleScreen] setInterval created, timerInterval ID:', this.timerInterval);
    console.log('[BattleScreen] ========== startTurnTimer() complete ==========');
  }

  /**
   * Stop the turn timer
   */
  private stopTurnTimer(): void {
    if (this.timerInterval) {
      this.async.clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Update the end turn button text based on turn and timer
   */
  private updateEndTurnButtonText(): void {
    const isPlayerTurn = this.isPlayerTurn.get();
    const timerValue = this.turnTimer.get();
    const newText = isPlayerTurn ? `(${timerValue})` : 'Enemy Turn';

    console.log('[BattleScreen] updateEndTurnButtonText:', {
      isPlayerTurn,
      timerValue,
      newText,
      currentText: this.endTurnButtonText.get()
    });

    this.endTurnButtonText.set(newText);
  }

  /**
   * Finish render and trigger re-render if needed
   */
  private finishRender(): void {
    this.isRendering = false;
    if (this.needsRerender) {
      console.log('[BattleScreen] Re-render needed after current render');
      this.needsRerender = false;
      // Use setTimeout to break out of the current call stack
      this.async.setTimeout(() => this.onRenderNeeded?.(), 0);
    }
  }

  /**
   * Cleanup resources
   */
  /**
   * Create played card popup (shows for 2 seconds when card is played)
   */
  private createPlayedCardPopup(card: any): UINodeType {
    return createCardDetailPopup(this.ui, {
      cardDetail: {
        card: card,
        isInDeck: false,
        buttons: []
      },
      onButtonClick: (buttonId: string) => {
        // User can close early by clicking
        if (this.playedCardTimeout) {
          this.async.clearTimeout(this.playedCardTimeout);
          this.playedCardTimeout = null;
        }
        this.playedCardDisplay = null;
        this.onRenderNeeded?.();
      }
    });
  }

  /**
   * Show a played card popup for 2 seconds, then execute callback
   */
  private showPlayedCard(card: any, onComplete: () => void): void {
    console.log('[BattleScreen] Showing played card popup:', card.name);

    // Clear any existing timeout
    if (this.playedCardTimeout) {
      this.async.clearTimeout(this.playedCardTimeout);
    }

    // Set the played card
    this.playedCardDisplay = card;
    this.onRenderNeeded?.();

    // After 2 seconds, hide the popup and execute the action
    this.playedCardTimeout = this.async.setTimeout(() => {
      this.playedCardDisplay = null;
      this.onRenderNeeded?.();
      onComplete();
    }, 2000);
  }

  public cleanup(): void {
    this.stopTurnTimer();
    this.showHand.set(true);
    this.handScrollOffset.set(0);
    this.selectedCardDetail.set(null);

    // Clear played card timeout
    if (this.playedCardTimeout) {
      this.async.clearTimeout(this.playedCardTimeout);
      this.playedCardTimeout = null;
    }
    this.playedCardDisplay = null;
  }
}