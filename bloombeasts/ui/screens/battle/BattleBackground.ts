/**
 * Battle background and playboard rendering
 */

import type { BattleComponentProps } from './types';
import { gameDimensions } from './types';
import type { UINodeType } from '../ScreenUtils';

export class BattleBackground {
  private ui: BattleComponentProps['ui'];

  constructor(props: BattleComponentProps) {
    this.ui = props.ui;
  }

  /**
   * Create full-screen background
   */
  createBackground(): UINodeType {
    return this.ui.Image({
      source: this.ui.Binding.derive(
        [this.ui.assetsLoadedBinding],
        (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('background') : null
      ),
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
  createPlayboard(): UINodeType {
    return this.ui.Image({
      source: this.ui.Binding.derive(
        [this.ui.assetsLoadedBinding],
        (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('playboard') : null
      ),
      style: {
        position: 'absolute',
        width: gameDimensions.panelWidth,
        height: gameDimensions.panelHeight,
        top: 0,
        left: 0,
      },
    });
  }
}
