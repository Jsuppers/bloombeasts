/**
 * Production Entry Point for Web Deployment
 * Uses the standalone BloomBeasts namespace (simulates Meta Horizon environment)
 *
 * This file simulates how the game runs in Meta Horizon with a standalone bundle.
 * The BloomBeasts namespace is loaded globally via script tag in index-prod.html.
 */

import { WebPlatformNew } from './platform.new';

// Access BloomBeasts from globalThis
declare global {
    var BloomBeasts: {
        GameManager: new (platform: any) => {
            initialize(): Promise<void>;
        };
    };
}

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Bloom Beasts - Web Version (Production Mode)');
    console.log('Running with NEW UI System (simulating Meta Horizon)...');

    // Create platform implementation (NEW UI SYSTEM!)
    const platform = new WebPlatformNew();

    // Initialize and start the game using the BloomBeasts namespace
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

        // Then create and initialize game manager from the BloomBeasts namespace
        const gameManager = new BloomBeasts.GameManager(platform);
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
