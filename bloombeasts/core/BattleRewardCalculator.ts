/**
 * BattleRewardCalculator - Calculates and applies battle rewards with boost multipliers
 * Extracted from BloomBeastsGame to separate concerns
 */

import { COIN_BOOST, EXP_BOOST, LUCK_BOOST } from '../common/constants/upgrades';

export interface BoostMap {
  [boostId: string]: number;
}

export interface BattleRewards {
  xpGained: number;
  beastXP: number;
  coinsReceived: number;
  cardsReceived: any[];
  itemsReceived?: any[];
  bonusRewards?: string[];
}

/**
 * Calculates battle rewards and applies boost multipliers
 */
export class BattleRewardCalculator {
  /**
   * Calculate and apply boost multipliers to rewards
   * Returns modified rewards object with bonus information
   */
  calculateRewards(baseRewards: BattleRewards, boosts: BoostMap): BattleRewards {
    const rewards = { ...baseRewards };

    const coinBoostLevel = boosts[COIN_BOOST.id] || 0;
    const expBoostLevel = boosts[EXP_BOOST.id] || 0;
    const luckBoostLevel = boosts[LUCK_BOOST.id] || 0;

    let coinBoostPercent = 0;
    let expBoostPercent = 0;
    let luckBoostPercent = 0;

    // Calculate and apply coin boost
    if (coinBoostLevel > 0 && COIN_BOOST.values && rewards.coinsReceived) {
      coinBoostPercent = COIN_BOOST.values[coinBoostLevel - 1];
      const multiplier = (coinBoostPercent / 100) + 1;
      rewards.coinsReceived = Math.floor(rewards.coinsReceived * multiplier);
    }

    // Calculate and apply exp boost
    if (expBoostLevel > 0 && EXP_BOOST.values) {
      expBoostPercent = EXP_BOOST.values[expBoostLevel - 1];
      const multiplier = (expBoostPercent / 100) + 1;
      rewards.xpGained = Math.floor(rewards.xpGained * multiplier);
      rewards.beastXP = Math.floor(rewards.beastXP * multiplier);
    }

    // Calculate luck boost (affects drop chances - already rolled, so no effect on this implementation)
    if (luckBoostLevel > 0 && LUCK_BOOST.values) {
      luckBoostPercent = LUCK_BOOST.values[luckBoostLevel - 1];
      // Luck boost would affect drop chances, but rewards are already generated
      // This is shown for informational purposes
    }

    // Add boost info to rewards for display
    if (!rewards.bonusRewards) {
      rewards.bonusRewards = [];
    }
    if (coinBoostPercent > 0) {
      rewards.bonusRewards.push(`Coin Boost: +${coinBoostPercent}%`);
    }
    if (expBoostPercent > 0) {
      rewards.bonusRewards.push(`EXP Boost: +${expBoostPercent}%`);
    }
    if (luckBoostPercent > 0) {
      rewards.bonusRewards.push(`Luck Boost: +${luckBoostPercent}%`);
    }

    return rewards;
  }

  /**
   * Get boost levels from player data
   */
  getBoostMap(playerBoosts?: { [boostId: string]: number }): BoostMap {
    return {
      [COIN_BOOST.id]: playerBoosts?.[COIN_BOOST.id] || 0,
      [EXP_BOOST.id]: playerBoosts?.[EXP_BOOST.id] || 0,
      [LUCK_BOOST.id]: playerBoosts?.[LUCK_BOOST.id] || 0,
    };
  }
}
