/**
 * Central export for all mission definitions
 */

import { mission01 } from './mission01';
import { mission02 } from './mission02';
import { mission03 } from './mission03';
import { mission04 } from './mission04';
import { mission05 } from './mission05';
import { mission06 } from './mission06';
import { mission07 } from './mission07';
import { mission08 } from './mission08';
import { mission09 } from './mission09';
import { mission10 } from './mission10';
import { Mission } from '../types';

export const missions: Mission[] = [
  mission01,
  mission02,
  mission03,
  mission04,
  mission05,
  mission06,
  mission07,
  mission08,
  mission09,
  mission10,
];

export const getMissionById = (id: string): Mission | undefined => {
  return missions.find(mission => mission.id === id);
};

export const getAvailableMissions = (playerLevel: number): Mission[] => {
  return missions.filter(mission => {
    // Mission is available if player level is within 2 levels of mission level
    // or if the mission has been completed before
    return mission.unlocked ||
           mission.timesCompleted > 0 ||
           Math.abs(playerLevel - mission.level) <= 2;
  });
};

export const getCompletedMissions = (): Mission[] => {
  return missions.filter(mission => mission.timesCompleted > 0);
};

export {
  mission01,
  mission02,
  mission03,
  mission04,
  mission05,
  mission06,
  mission07,
  mission08,
  mission09,
  mission10,
};