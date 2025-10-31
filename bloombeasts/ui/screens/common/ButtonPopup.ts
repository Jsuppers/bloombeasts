/**
 * Button Popup Component
 * Simple popup that shows buttons for user choices
 */

import type { UIMethodMappings } from '../../../../bloombeasts/BloomBeastsGame';
import { createPopup, type PopupButton } from '../../common/Popup';
import type { ButtonColor } from '../../common/Button';
import { BindingType } from '../../types/BindingManager';
import type { BindingManager } from '../../types/BindingManager';

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
 * Derives content from ForfeitPopup binding
 */
export function createButtonPopup(ui: UIMethodMappings, bindingManager: any): any {
  // Get the playSfx function from current binding state
  const currentProps = bindingManager.getSnapshot(BindingType.ForfeitPopup);
  const playSfx = currentProps?.playSfx;

  // Derive title
  const title = bindingManager.derive([BindingType.ForfeitPopup], (props: any) => {
    return props?.title || '';
  });

  // Derive message
  const message = bindingManager.derive([BindingType.ForfeitPopup], (props: any) => {
    return props?.message || '';
  });

  // Create buttons that capture click handlers at click time
  const popupButtons: PopupButton[] = [
    {
      label: bindingManager.derive([BindingType.ForfeitPopup], (props: any) => {
        return props?.buttons?.[0]?.text || 'Yes';
      }) as any,
      onClick: () => {
        const props = bindingManager.getSnapshot(BindingType.ForfeitPopup);
        if (props?.buttons?.[0]?.onClick) {
          props.buttons[0].onClick();
        }
      },
      color: bindingManager.derive([BindingType.ForfeitPopup], (props: any) => {
        return (props?.buttons?.[0]?.color || 'default') as ButtonColor;
      }) as any,
    },
    {
      label: bindingManager.derive([BindingType.ForfeitPopup], (props: any) => {
        return props?.buttons?.[1]?.text || 'No';
      }) as any,
      onClick: () => {
        const props = bindingManager.getSnapshot(BindingType.ForfeitPopup);
        if (props?.buttons?.[1]?.onClick) {
          props.buttons[1].onClick();
        }
      },
      color: bindingManager.derive([BindingType.ForfeitPopup], (props: any) => {
        return (props?.buttons?.[1]?.color || 'default') as ButtonColor;
      }) as any,
    },
  ];

  return createPopup({
    ui,
    title: title as any,
    description: message as any,
    buttons: popupButtons,
    playSfx, // Direct function reference, not a binding
    width: 450,
    height: 280,
  });
}
