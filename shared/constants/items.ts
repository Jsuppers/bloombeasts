import { diamondEmoji, serumEmoji, tokenEmoji } from "./emojis";

export interface Item {
  id: string;
  name: string;
  text: string;
  emoji: string;
}

export const items: Item[] = [
  {
    id: 'token',
    name: 'Token',
    text: 'Money money money!',
    emoji: tokenEmoji,
  },
  {
    id: 'diamond',
    name: 'Diamond',
    text: 'This is shiny!',
    emoji: diamondEmoji,
  },
  {
    id: 'serum',
    name: 'Serum',
    text: 'This could be useful... it smells terrible though.',
    emoji: serumEmoji,
  },
];