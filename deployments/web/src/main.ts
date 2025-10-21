/**
 * Main Entry Point for Web Deployment
 * Initializes the game and connects platform callbacks
 */

import { WebPlatformNew } from './platform.new';
import { GameManager } from '../../../bloombeasts/gameManager';

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Bloom Beasts - Web Version');
    console.log('Initializing game with NEW UI System...');

    // Create platform implementation (NEW UI SYSTEM!)
    const platform = new WebPlatformNew();

    // Initialize and start the game
    try {
        // First, load all platform assets
        console.log('Loading assets...');
        await platform.initialize();
        console.log('Assets loaded!');

        // Hide the HTML loading overlay after initialization
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) {
            loadingDiv.classList.add('hidden');
        }

        // Then create and initialize game manager
        const gameManager = new GameManager(platform);
        await gameManager.initialize();
        console.log('Game initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        await platform.showDialog(
            'Error',
            'Failed to start the game. Please refresh and try again.\n\nError: ' + errorMessage,
            ['OK']
        );
    }
});
