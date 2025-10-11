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
            await this.loadImage('sideMenu', '/shared/images/SideMenu.png');
            await this.loadImage('sideMenuGreenButton', '/shared/images/SideMenuGreenButton.png');
            await this.loadImage('sideMenuStandardButton', '/shared/images/SideMenuStandardButton.png');

            // Load menu animation frames
            for (let i = 1; i <= 10; i++) {
                await this.loadImage(`menuFrame${i}`, `/shared/images/menu/Frame${i}.png`);
            }

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

    async loadCardImage(cardName: string, affinity?: string, cardType?: string): Promise<HTMLImageElement | null> {
        const cacheKey = `card-${cardName}`;

        // Return cached image if available
        if (this.images.has(cacheKey)) {
            return this.images.get(cacheKey)!;
        }

        // Remove spaces from card name to match file naming convention
        const sanitizedCardName = cardName.replace(/\s+/g, '');

        // Determine the folder based on card type
        let folder: string;
        if (cardType === 'Magic') {
            folder = 'Magic';
        } else if (cardType === 'Trap') {
            folder = 'Trap';
        } else {
            // Default to affinity-based folder for Bloom and other cards
            folder = affinity || 'Shared';
        }

        const imagePath = `/shared/images/cards/${folder}/${sanitizedCardName}.png`;

        try {
            await this.loadImage(cacheKey, imagePath);
            return this.images.get(cacheKey)!;
        } catch (error) {
            console.warn(`Failed to load card image: ${imagePath}`);
            return null;
        }
    }

    async loadBeastImage(cardName: string, affinity?: string): Promise<HTMLImageElement | null> {
        const cacheKey = `beast-${cardName}`;

        // Return cached image if available
        if (this.images.has(cacheKey)) {
            return this.images.get(cacheKey)!;
        }

        // For now, beast images are the same as card images
        // In the future, this could load separate beast artwork
        // Try to load from cards folder first (current structure)
        const sanitizedCardName = cardName.replace(/\s+/g, '');
        const affinityFolder = affinity || 'Shared';
        const cardImagePath = `/shared/images/cards/${affinityFolder}/${sanitizedCardName}.png`;

        try {
            await this.loadImage(cacheKey, cardImagePath);
            return this.images.get(cacheKey)!;
        } catch (error) {
            // Try beasts folder as fallback for future assets
            const beastImagePath = `/shared/images/beasts/${affinityFolder}/${sanitizedCardName}.png`;
            try {
                await this.loadImage(cacheKey, beastImagePath);
                return this.images.get(cacheKey)!;
            } catch (error2) {
                console.warn(`Failed to load beast image: ${cardImagePath}`);
                return null;
            }
        }
    }

    async loadBaseCardImage(affinity?: string): Promise<HTMLImageElement | null> {
        const cacheKey = `basecard`;

        // Return cached image if available
        if (this.images.has(cacheKey)) {
            return this.images.get(cacheKey)!;
        }

        // BaseCard.png is in the root of the cards folder
        const imagePath = `/shared/images/cards/BaseCard.png`;

        try {
            await this.loadImage(cacheKey, imagePath);
            return this.images.get(cacheKey)!;
        } catch (error) {
            console.warn(`Failed to load base card image: ${imagePath}`);
            return null;
        }
    }

    async loadAffinityIcon(affinity: string): Promise<HTMLImageElement | null> {
        const cacheKey = `affinity-${affinity}`;

        // Return cached image if available
        if (this.images.has(cacheKey)) {
            return this.images.get(cacheKey)!;
        }

        // Affinity icons have "Icon" suffix (e.g., ForestIcon.png)
        const imagePath = `/shared/images/affinity/${affinity}Icon.png`;

        try {
            await this.loadImage(cacheKey, imagePath);
            return this.images.get(cacheKey)!;
        } catch (error) {
            console.warn(`Failed to load affinity icon: ${imagePath}`);
            return null;
        }
    }

    async loadMagicCardTemplate(): Promise<HTMLImageElement | null> {
        const cacheKey = `magic-card-template`;

        // Return cached image if available
        if (this.images.has(cacheKey)) {
            return this.images.get(cacheKey)!;
        }

        // MagicCard.png template for inventory/hand display
        const imagePath = `/shared/images/cards/MagicCard.png`;

        try {
            await this.loadImage(cacheKey, imagePath);
            return this.images.get(cacheKey)!;
        } catch (error) {
            console.warn(`Failed to load magic card template: ${imagePath}`);
            return null;
        }
    }

    async loadTrapCardTemplate(): Promise<HTMLImageElement | null> {
        const cacheKey = `trap-card-template`;

        // Return cached image if available
        if (this.images.has(cacheKey)) {
            return this.images.get(cacheKey)!;
        }

        // TrapCard.png template for inventory/hand display
        const imagePath = `/shared/images/cards/TrapCard.png`;

        try {
            await this.loadImage(cacheKey, imagePath);
            return this.images.get(cacheKey)!;
        } catch (error) {
            console.warn(`Failed to load trap card template: ${imagePath}`);
            return null;
        }
    }

    async loadMagicCardPlayboardTemplate(): Promise<HTMLImageElement | null> {
        const cacheKey = `magic-card-playboard-template`;

        // Return cached image if available
        if (this.images.has(cacheKey)) {
            return this.images.get(cacheKey)!;
        }

        // MagicCardPlayboard.png template for playboard display
        const imagePath = `/shared/images/cards/MagicCardPlayboard.png`;

        try {
            await this.loadImage(cacheKey, imagePath);
            return this.images.get(cacheKey)!;
        } catch (error) {
            console.warn(`Failed to load magic card playboard template: ${imagePath}`);
            return null;
        }
    }

    async loadTrapCardPlayboardTemplate(): Promise<HTMLImageElement | null> {
        const cacheKey = `trap-card-playboard-template`;

        // Return cached image if available
        if (this.images.has(cacheKey)) {
            return this.images.get(cacheKey)!;
        }

        // TrapCardPlayboard.png template for all face-down trap cards
        const imagePath = `/shared/images/cards/TrapCardPlayboard.png`;

        try {
            await this.loadImage(cacheKey, imagePath);
            return this.images.get(cacheKey)!;
        } catch (error) {
            console.warn(`Failed to load trap card playboard template: ${imagePath}`);
            return null;
        }
    }
}
