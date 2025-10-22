/**
 * Unified Battle Screen Component
 * Works on both Horizon and Web platforms
 */

import { View, Text, Pressable, Binding } from '../index';
import { COLORS } from '../../../shared/styles/colors';
import { DIMENSIONS } from '../../../shared/styles/dimensions';
import { UINodeType } from './ScreenUtils';

export interface BattleScreenProps {
  battleState: any;
  message: any;
  onAction?: (action: string) => void;
  onNavigate?: (screen: string) => void;
}

/**
 * Unified Battle Screen that works on both platforms
 * This is a simplified placeholder - full battle logic to be implemented
 */
export class BattleScreen {
  private battleState: any;
  private message: any;
  private onAction?: (action: string) => void;
  private onNavigate?: (screen: string) => void;

  constructor(props: BattleScreenProps) {
    this.battleState = props.battleState;
    this.message = props.message;
    this.onAction = props.onAction;
    this.onNavigate = props.onNavigate;
  }

  /**
   * Create the unified battle UI
   */
  createUI(): UINodeType {
    return View({
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
        Text({
          content: '⚔️ Battle Arena ⚔️',
          style: {
            fontSize: DIMENSIONS.fontSize.hero,
            fontWeight: 'bold',
            color: COLORS.textPrimary,
            marginBottom: 30
          }
        }),

        // Battle state
        View({
          style: {
            backgroundColor: COLORS.surface,
            borderRadius: 12,
            padding: 30,
            marginBottom: 30,
            minWidth: 400,
            alignItems: 'center'
          },
          children: [
            Text({
              content: this.battleState,
              style: {
                fontSize: DIMENSIONS.fontSize.xl,
                fontWeight: 'bold',
                color: COLORS.warning,
                marginBottom: 10,
                textTransform: 'uppercase'
              }
            }),
            Text({
              content: this.message,
              style: {
                fontSize: DIMENSIONS.fontSize.lg,
                color: COLORS.textSecondary,
                textAlign: 'center'
              }
            })
          ]
        }),

        // Action buttons
        View({
          style: {
            flexDirection: 'row',
            gap: 20,
            marginBottom: 30
          },
          children: [
            Pressable({
              onPress: () => this.onAction?.('attack'),
              style: {
                backgroundColor: COLORS.error,
                borderRadius: 8,
                padding: 15,
                minWidth: 120
              },
              children: Text({
                content: '⚔️ Attack',
                style: {
                  fontSize: DIMENSIONS.fontSize.lg,
                  fontWeight: 'bold',
                  color: '#fff',
                  textAlign: 'center'
                }
              })
            }),
            Pressable({
              onPress: () => this.onAction?.('defend'),
              style: {
                backgroundColor: COLORS.info,
                borderRadius: 8,
                padding: 15,
                minWidth: 120
              },
              children: Text({
                content: '🛡️ Defend',
                style: {
                  fontSize: DIMENSIONS.fontSize.lg,
                  fontWeight: 'bold',
                  color: '#fff',
                  textAlign: 'center'
                }
              })
            }),
            Pressable({
              onPress: () => this.onAction?.('special'),
              style: {
                backgroundColor: COLORS.warning,
                borderRadius: 8,
                padding: 15,
                minWidth: 120
              },
              children: Text({
                content: '✨ Special',
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
        Pressable({
          onPress: () => this.onNavigate?.('menu'),
          style: {
            backgroundColor: COLORS.surface,
            borderRadius: 8,
            padding: 12
          },
          children: Text({
            content: '← Exit Battle',
            style: {
              fontSize: DIMENSIONS.fontSize.md,
              color: COLORS.textSecondary
            }
          })
        })
      ]
    });
  }
}