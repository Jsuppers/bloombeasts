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
            await this.loadImage('sideMenuRedButton', '/shared/images/SideMenuRedButton.png');
            await this.loadImage('sideMenuStandardButton', '/shared/images/SideMenuStandardButton.png');
            await this.loadImage('cardsContainer', '/shared/images/CardsContainer.png');
            await this.loadImage('CardsContainer', '/shared/images/CardsContainer.png');

            // Load mission images
            await this.loadImage('ForestMission', '/shared/images/cards/Forest/ForestMission.png');
            await this.loadImage('WaterMission', '/shared/images/cards/Water/WaterMission.png');
            await this.loadImage('FireMission', '/shared/images/cards/Fire/FireMission.png');
            await this.loadImage('SkyMission', '/shared/images/cards/Sky/SkyMission.png');
            await this.loadImage('BossMission', '/shared/images/cards/BossMission.png');

            // Load beast images for missions (Forest beasts - missions 1-4)
            await this.loadImage('Rootling', '/shared/images/cards/Forest/Rootling.png');
            await this.loadImage('Mushroomancer', '/shared/images/cards/Forest/Mushroomancer.png');
            await this.loadImage('Mosslet', '/shared/images/cards/Forest/Mosslet.png');
            await this.loadImage('Leaf Sprite', '/shared/images/cards/Forest/LeafSprite.png');

            // Load Water beasts - missions 5-8
            await this.loadImage('Bubblefin', '/shared/images/cards/Water/Bubblefin.png');
            await this.loadImage('Dewdrop Drake', '/shared/images/cards/Water/DewdropDrake.png');
            await this.loadImage('Kelp Cub', '/shared/images/cards/Water/KelpCub.png');
            await this.loadImage('Aqua Pebble', '/shared/images/cards/Water/AquaPebble.png');

            // Load Fire beasts - missions 9-12
            await this.loadImage('Magmite', '/shared/images/cards/Fire/Magmite.png');
            await this.loadImage('Cinder Pup', '/shared/images/cards/Fire/CinderPup.png');
            await this.loadImage('Charcoil', '/shared/images/cards/Fire/Charcoil.png');
            await this.loadImage('Blazefinch', '/shared/images/cards/Fire/Blazefinch.png');

            // Load Sky beasts - missions 13-16
            await this.loadImage('Cirrus Floof', '/shared/images/cards/Sky/CirrusFloof.png');
            await this.loadImage('Gale Glider', '/shared/images/cards/Sky/GaleGlider.png');
            await this.loadImage('Star Bloom', '/shared/images/cards/Sky/StarBloom.png');
            await this.loadImage('Aero Moth', '/shared/images/cards/Sky/AeroMoth.png');

            // Load Boss beast - mission 17
            await this.loadImage('The Bloom Master', '/shared/images/cards/TheBloomMaster.png');

            // Load action icons
            await this.loadImage('attackIcon', '/shared/images/icons/attack.png');
            await this.loadImage('abilityIcon', '/shared/images/icons/ability.png');

            // Load experience bar
            await this.loadImage('experienceBar', '/shared/images/cards/ExperienceBar.png');

            // Load mission complete popup images
            await this.loadImage('MissionCompleteContainer', '/shared/images/MissionCompleteContainer.png');
            await this.loadImage('LongGreenButton', '/shared/images/LongGreenButton.png');

            // Load chest images (all affinities, closed and opened)
            await this.loadImage('ForestChestClosed', '/shared/images/chests/ForestChestClosed.png');
            await this.loadImage('ForestChestOpened', '/shared/images/chests/ForestChestOpened.png');
            await this.loadImage('WaterChestClosed', '/shared/images/chests/WaterChestClosed.png');
            await this.loadImage('WaterChestOpened', '/shared/images/chests/WaterChestOpened.png');
            await this.loadImage('FireChestClosed', '/shared/images/chests/FireChestClosed.png');
            await this.loadImage('FireChestOpened', '/shared/images/chests/FireChestOpened.png');
            await this.loadImage('SkyChestClosed', '/shared/images/chests/SkyChestClosed.png');
            await this.loadImage('SkyChestOpened', '/shared/images/chests/SkyChestOpened.png');

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

        // Remove spaces and apostrophes from card name to match file naming convention
        const sanitizedCardName = cardName.replace(/[\s']/g, '');

        // Determine the folder based on card type
        let folder: string;
        if (cardType === 'Magic') {
            folder = 'Magic';
        } else if (cardType === 'Trap') {
            folder = 'Trap';
        } else if (cardType === 'Buff') {
            folder = 'Buff';
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
        const sanitizedCardName = cardName.replace(/[\s']/g, '');
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

    async loadBuffCardTemplate(): Promise<HTMLImageElement | null> {
        const cacheKey = `buff-card-template`;

        // Return cached image if available
        if (this.images.has(cacheKey)) {
            return this.images.get(cacheKey)!;
        }

        // BuffCard.png template for inventory/hand display
        const imagePath = `/shared/images/cards/BuffCard.png`;

        try {
            await this.loadImage(cacheKey, imagePath);
            return this.images.get(cacheKey)!;
        } catch (error) {
            console.warn(`Failed to load buff card template: ${imagePath}`);
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

    async loadBuffCardPlayboardTemplate(): Promise<HTMLImageElement | null> {
        const cacheKey = `buff-card-playboard-template`;

        // Return cached image if available
        if (this.images.has(cacheKey)) {
            return this.images.get(cacheKey)!;
        }

        // BuffCardPlayboard.png template for playboard display
        const imagePath = `/shared/images/cards/BuffCardPlayboard.png`;

        try {
            await this.loadImage(cacheKey, imagePath);
            return this.images.get(cacheKey)!;
        } catch (error) {
            console.warn(`Failed to load buff card playboard template: ${imagePath}`);
            return null;
        }
    }

    async loadHabitatCardTemplate(affinity: string): Promise<HTMLImageElement | null> {
        const cacheKey = `habitat-card-template-${affinity}`;

        // Return cached image if available
        if (this.images.has(cacheKey)) {
            return this.images.get(cacheKey)!;
        }

        // HabitatCard.png template for inventory/hand display (in affinity folder)
        const imagePath = `/shared/images/cards/${affinity}/HabitatCard.png`;

        try {
            await this.loadImage(cacheKey, imagePath);
            return this.images.get(cacheKey)!;
        } catch (error) {
            console.warn(`Failed to load habitat card template: ${imagePath}`);
            return null;
        }
    }

    async loadHabitatCardPlayboardTemplate(affinity: string): Promise<HTMLImageElement | null> {
        const cacheKey = `habitat-card-playboard-template-${affinity}`;

        // Return cached image if available
        if (this.images.has(cacheKey)) {
            return this.images.get(cacheKey)!;
        }

        // HabitatCardPlayboard.png template for playboard display (in affinity folder)
        const imagePath = `/shared/images/cards/${affinity}/HabitatCardPlayboard.png`;

        try {
            await this.loadImage(cacheKey, imagePath);
            return this.images.get(cacheKey)!;
        } catch (error) {
            console.warn(`Failed to load habitat card playboard template: ${imagePath}`);
            return null;
        }
    }

    async loadHabitatImage(cardName: string, affinity: string): Promise<HTMLImageElement | null> {
        const cacheKey = `habitat-${cardName}-${affinity}`;

        // Return cached image if available
        if (this.images.has(cacheKey)) {
            return this.images.get(cacheKey)!;
        }

        // Remove spaces and apostrophes from card name to match file naming convention
        const sanitizedCardName = cardName.replace(/[\s']/g, '');

        // Habitat images are in the affinity folder
        const imagePath = `/shared/images/cards/${affinity}/${sanitizedCardName}.png`;

        try {
            await this.loadImage(cacheKey, imagePath);
            return this.images.get(cacheKey)!;
        } catch (error) {
            console.warn(`Failed to load habitat image: ${imagePath}`);
            return null;
        }
    }

    /**
     * Unified method to load all necessary images for a card
     * @param card The card object containing type, name, affinity, etc.
     * @param renderType 'default' for hand/inventory, 'battle' for playboard
     * @returns Object containing all necessary images for rendering the card
     */
    async loadCardAssets(
        card: any,
        renderType: 'default' | 'battle' = 'default'
    ): Promise<{
        mainImage: HTMLImageElement | null;
        baseCardImage: HTMLImageElement | null;
        templateImage: HTMLImageElement | null;
        affinityIcon: HTMLImageElement | null;
    }> {
        const result = {
            mainImage: null as HTMLImageElement | null,
            baseCardImage: null as HTMLImageElement | null,
            templateImage: null as HTMLImageElement | null,
            affinityIcon: null as HTMLImageElement | null,
        };

        switch (card.type) {
            case 'Bloom':
                // Load beast image
                result.mainImage = await this.loadBeastImage(card.name, card.affinity);
                // Only Bloom cards need the base card frame
                result.baseCardImage = await this.loadBaseCardImage(card.affinity);
                // Load affinity icon if available
                if (card.affinity) {
                    result.affinityIcon = await this.loadAffinityIcon(card.affinity);
                }
                break;

            case 'Magic':
                // Load magic card image
                result.mainImage = await this.loadCardImage(card.name, card.affinity, 'Magic');
                // Load appropriate template based on render type
                if (renderType === 'battle') {
                    result.templateImage = await this.loadMagicCardPlayboardTemplate();
                } else {
                    result.templateImage = await this.loadMagicCardTemplate();
                    // Magic cards in hand/inventory don't need base card
                }
                break;

            case 'Trap':
                // Load appropriate template based on render type
                if (renderType === 'battle') {
                    // For battlefield, traps are face-down - only need template, not the actual card image
                    result.templateImage = await this.loadTrapCardPlayboardTemplate();
                } else {
                    // For hand/inventory, load the actual trap card image
                    result.mainImage = await this.loadCardImage(card.name, card.affinity, 'Trap');
                    result.templateImage = await this.loadTrapCardTemplate();
                    // Trap cards in hand/inventory don't need base card
                }
                break;

            case 'Buff':
                // Load buff card image
                result.mainImage = await this.loadCardImage(card.name, card.affinity, 'Buff');
                // Load appropriate template based on render type
                if (renderType === 'battle') {
                    result.templateImage = await this.loadBuffCardPlayboardTemplate();
                } else {
                    result.templateImage = await this.loadBuffCardTemplate();
                    // Buff cards in hand/inventory don't need base card
                }
                break;

            case 'Habitat':
                // Load habitat image
                if (card.affinity) {
                    result.mainImage = await this.loadHabitatImage(card.name, card.affinity);
                    // Load appropriate template based on render type
                    if (renderType === 'battle') {
                        result.templateImage = await this.loadHabitatCardPlayboardTemplate(card.affinity);
                    } else {
                        result.templateImage = await this.loadHabitatCardTemplate(card.affinity);
                        // Habitat cards in hand/inventory don't need base card
                    }
                }
                break;

            default:
                // For any other card types, just load the card image
                result.mainImage = await this.loadCardImage(card.name, card.affinity, card.type);
                break;
        }

        return result;
    }

    /**
     * Get all loaded images as a plain object
     * Used for passing to rendering components
     */
    getAllImages(): Record<string, HTMLImageElement> {
        const imagesObj: Record<string, HTMLImageElement> = {};
        this.images.forEach((img, key) => {
            imagesObj[key] = img;
        });
        return imagesObj;
    }
}
