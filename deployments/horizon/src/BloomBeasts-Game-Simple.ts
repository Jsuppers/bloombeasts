import * as hz from 'horizon/core';
import type { Player } from 'horizon/core';
import { UIComponent, View, Text, Pressable, UINode } from 'horizon/ui';

/**
 * SIMPLIFIED TEST VERSION - BloomBeasts UI
 * Use this to verify the Custom UI Panel is working before using the full version
 *
 * To use:
 * 1. Attach this component to a Custom UI Panel gizmo
 * 2. Press E to interact
 * 3. You should see a simple menu
 */
class BloomBeastsSimpleUI extends UIComponent {
  private currentScreen = 'menu';

  // No props needed for testing
  static propsDefinition = {};

  start() {
    super.start();
    console.log('=== SIMPLE BLOOMBEASTS UI TEST ===');
    console.log('If you see this, the script is running!');
    console.log('If you see the UI, the Custom UI Panel is working!');
  }

  initializeUI(): UINode {
    console.log('Creating simple UI...');

    return View({
      style: {
        width: 1280,
        height: 720,
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
      },
      children: [
        // Success indicator
        Text({
          text: '✅ Custom UI Panel Working!',
          style: {
            fontSize: 48,
            color: '#00FF00',
            fontWeight: 'bold',
            marginBottom: 40,
          },
        }),

        // Title
        Text({
          text: 'BLOOM BEASTS',
          style: {
            fontSize: 72,
            color: '#FFFFFF',
            fontWeight: 'bold',
            marginBottom: 20,
          },
        }),

        // Subtitle
        Text({
          text: 'Simple Test Version',
          style: {
            fontSize: 24,
            color: '#AAAAAA',
            marginBottom: 60,
          },
        }),

        // Test button
        Pressable({
          onClick: (player: Player) => {
            console.log('Button clicked!');
            console.log('Player:', player);
            console.log('World:', this.world);
          },
          style: {
            padding: 20,
            backgroundColor: '#4a90e2',
            borderRadius: 10,
          },
          children: [
            Text({
              text: 'Click Me to Test',
              style: {
                fontSize: 24,
                color: '#FFFFFF',
                fontWeight: 'bold',
              },
            }),
          ],
        }),

        // Instructions
        Text({
          text: 'If you see this UI and can click the button, everything is working!',
          style: {
            position: 'absolute',
            bottom: 40,
            left: 0,
            width: 1280,
            fontSize: 18,
            color: '#888888',
            textAlign: 'center',
          },
        }),

        // Debug info
        Text({
          text: 'Check console for logs',
          style: {
            position: 'absolute',
            bottom: 10,
            left: 0,
            width: 1280,
            fontSize: 14,
            color: '#666666',
            textAlign: 'center',
          },
        }),
      ],
    });
  }
}

// Register the simple test component
hz.UIComponent.register(BloomBeastsSimpleUI);

export { BloomBeastsSimpleUI };