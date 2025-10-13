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
import { mission11 } from './mission11';
import { mission12 } from './mission12';
import { mission13 } from './mission13';
import { mission14 } from './mission14';
import { mission15 } from './mission15';
import { mission16 } from './mission16';
import { mission17 } from './mission17';
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
  mission11,
  mission12,
  mission13,
  mission14,
  mission15,
  mission16,
  mission17,
];

export const getMissionById = (id: string): Mission | undefined => {
  return missions.find(mission => mission.id === id);
};

export const getAvailableMissions = (playerLevel: number): Mission[] => {
  // Return all missions - allow the UI to decide which ones are playable
  // This ensures all 17 missions are visible in the mission select screen
  return missions;
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
  mission11,
  mission12,
  mission13,
  mission14,
  mission15,
  mission16,
  mission17,
};
