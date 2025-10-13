/**
 * Click Region Manager
 * Handles clickable regions on the canvas and hover effects
 */

export interface ClickableRegion {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    callback: (clickX?: number, clickY?: number) => void;
}

export class ClickRegionManager {
    private regions: ClickableRegion[] = [];
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        // Click handler
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Check regions in reverse order (newest/top-most first)
            for (let i = this.regions.length - 1; i >= 0; i--) {
                const region = this.regions[i];
                if (this.isPointInRegion(x, y, region)) {
                    region.callback(x, y);
                    break;
                }
            }
        });

        // Hover effect
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            let hovering = false;
            // Check regions in reverse order (newest/top-most first)
            for (let i = this.regions.length - 1; i >= 0; i--) {
                const region = this.regions[i];
                if (this.isPointInRegion(x, y, region)) {
                    hovering = true;
                    break;
                }
            }

            this.canvas.style.cursor = hovering ? 'pointer' : 'default';
        });
    }

    private isPointInRegion(x: number, y: number, region: ClickableRegion): boolean {
        return (
            x >= region.x &&
            x <= region.x + region.width &&
            y >= region.y &&
            y <= region.y + region.height
        );
    }

    addRegion(region: ClickableRegion): void {
        this.regions.push(region);
    }

    clearRegions(): void {
        this.regions = [];
    }

    getRegions(): ClickableRegion[] {
        return this.regions;
    }
}
