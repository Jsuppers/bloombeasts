/**
 * BaseScreen
 */

import type { UIMethodMappings } from '../../types/ui/UIMethodMappings';
import { UINodeType } from '../../common/ui/ScreenUtils';

export interface BaseScreenProps {
  ui: UIMethodMappings;
  onNavigate?: (screen: string) => void;
  onRenderNeeded?: () => void;
  playSfx?: (sfxId: string) => void;
}

export abstract class BaseScreen {
  protected ui: UIMethodMappings;
  protected onNavigate?: (screen: string) => void;
  protected onRenderNeeded?: () => void;
  protected playSfx?: (sfxId: string) => void;

  constructor(props: BaseScreenProps) {
    this.ui = props.ui;
    this.onNavigate = props.onNavigate;
    this.onRenderNeeded = props.onRenderNeeded;
    this.playSfx = props.playSfx;
  }

  /**
   * Create the screen's UI - must be implemented by subclasses
   */
  abstract createUI(): UINodeType;

  /**
   * Full-screen background image
   */
  protected createFullScreenBackground(assetId: string = 'background'): UINodeType {
    return this.ui.Image({
      source: this.ui.assetIdToImageSource?.(assetId) || null,
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
      },
    });
  }

  /**
   * Root container that wraps all screen content
   */
  protected createRootContainer(children: any[]): UINodeType {
    return this.ui.View({
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
      },
      children,
    });
  }

  /**
   * Standard container background (used in Cards, Settings, Upgrade, etc.)
   */
  protected createContainerBackground(
    assetId: string = 'cards-container',
    position: { left: number; top: number; width: number; height: number } = {
      left: 40,
      top: 40,
      width: 980,
      height: 640,
    }
  ): UINodeType {
    return this.ui.Image({
      source: this.ui.assetIdToImageSource?.(assetId) || null,
      style: {
        position: 'absolute',
        ...position,
      },
    });
  }

  /**
   * Content area inside container (used in Cards, Settings, Upgrade, etc.)
   */
  protected createContentArea(
    children: any[],
    position: { left: number; top: number; width: number; height: number } = {
      left: 70,
      top: 70,
      width: 920,
      height: 580,
    }
  ): UINodeType {
    return this.ui.View({
      style: {
        position: 'absolute',
        ...position,
      },
      children,
    });
  }

  /**
   * Standard "Back to Menu" button configuration
   */
  protected getBackButton() {
    return {
      label: 'Back',
      onClick: () => this.onNavigate?.('menu'),
      disabled: false,
    };
  }

  /**
   * Navigate to a screen with optional sound
   */
  protected navigate(screen: string, playSound: boolean = true) {
    if (playSound && this.playSfx) {
      this.playSfx('sfx-menu-button-select');
    }
    this.onNavigate?.(screen);
  }

  /**
   * Trigger a re-render
   */
  protected triggerRender() {
    this.onRenderNeeded?.();
  }

  /**
   * Cleanup - override if needed
   */
  dispose(): void {
    // Override in subclasses if cleanup is needed
  }
}
