/**
 * Button Popup Component
 * Simple popup that shows buttons for user choices
 */

import type { UIMethodMappings } from '../../../../bloombeasts/BloomBeastsGame';
import { createPopup, type PopupButton } from '../../common/Popup';
import type { ButtonColor } from '../../common/Button';

export interface ButtonPopupProps {
  title: string;
  message?: string;
  buttons: {
    text: string;
    onClick: () => void;
    color?: 'default' | 'red' | 'green';
  }[];
  playSfx?: (sfxId: string) => void;
}

/**
 * Create a button popup using the common Popup component
 */
export function createButtonPopup(ui: UIMethodMappings, props: ButtonPopupProps): any {
  const { title, message, buttons, playSfx } = props;

  // Convert button format to PopupButton format
  const popupButtons: PopupButton[] = buttons.map((button) => ({
    label: button.text,
    onClick: button.onClick,
    color: (button.color as ButtonColor) || 'default',
  }));

  return createPopup({
    ui,
    title,
    description: message,
    buttons: popupButtons,
    playSfx,
    width: 450,
    height: 280,
  });
}
