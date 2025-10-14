import { diamondEmoji, serumEmoji, tokenEmoji } from "./emojis";

export interface Item {
  id: string;
  name: string;
  text: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const items: Item[] = [
  {
    id: 'token',
    name: 'Token',
    text: 'Money money money!',
    emoji: tokenEmoji,
    rarity: 'common',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    text: 'This is shiny!',
    emoji: diamondEmoji,
    rarity: 'rare',
  },
  {
    id: 'serum',
    name: 'Serum',
    text: 'This could be useful... it smells terrible though.',
    emoji: serumEmoji,
    rarity: 'epic',
  },
];