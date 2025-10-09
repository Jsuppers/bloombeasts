/**
 * Asset Loading Manager
 * Handles loading and caching of game images
 */

export class AssetLoader {
    private images: Map<string, HTMLImageElement> = new Map();
    private loadingEl: HTMLElement | null;

    constructor() {
        this.loadingEl = document.getElementById('loading');
    }

    async loadAllAssets(): Promise<void> {
        try {
            // Load background images from root shared folder (absolute paths from server root)
            await this.loadImage('menu', '/shared/images/Menu.png');
            await this.loadImage('background', '/shared/images/Background.png');
            await this.loadImage('playboard', '/shared/images/Playboard.png');

            if (this.loadingEl) {
                this.loadingEl.classList.add('hidden');
            }
        } catch (error) {
            console.error('Failed to load assets:', error);
            if (this.loadingEl) {
                this.loadingEl.innerHTML =
                    '<div style="color: #ff6b6b;">Failed to load game assets. Please refresh.</div>';
            }
            throw error;
        }
    }

    async loadImage(key: string, src: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images.set(key, img);
                resolve();
            };
            img.onerror = () => {
                reject(new Error(`Failed to load image: ${src}`));
            };
            img.src = src;
        });
    }

    getImage(key: string): HTMLImageElement | undefined {
        return this.images.get(key);
    }

    hasImage(key: string): boolean {
        return this.images.has(key);
    }

    async loadCardImage(cardName: string, affinity?: string): Promise<HTMLImageElement | null> {
        const cacheKey = `card-${cardName}`;

        // Return cached image if available
        if (this.images.has(cacheKey)) {
            return this.images.get(cacheKey)!;
        }

        // Try to load the card image (absolute path from server root)
        // Remove spaces from card name to match file naming convention
        const sanitizedCardName = cardName.replace(/\s+/g, '');
        const affinityFolder = affinity || 'Shared';
        const imagePath = `/shared/images/cards/${affinityFolder}/${sanitizedCardName}.png`;

        try {
            await this.loadImage(cacheKey, imagePath);
            return this.images.get(cacheKey)!;
        } catch (error) {
            console.warn(`Failed to load card image: ${imagePath}`);
            return null;
        }
    }
}
