/**
 * UIRenderer
 * Renders a UI component tree to a canvas
 */

import { UINode, ViewProps, TextProps, ImageProps, PressableProps, ScrollViewProps, ConditionalProps } from './components';
import { resolveBindable, Bindable, ValueBindingBase } from './Binding';
import { ViewStyle, TextStyle, ImageStyle, DimensionValue } from './types';

/**
 * Layout information for a rendered node
 */
export type LayoutBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};

/**
 * Resolved style values
 */
type ResolvedStyle = {
    [K in keyof ViewStyle]?: any;
};

/**
 * Click region for interactivity
 */
type ClickRegion = {
    box: LayoutBox;
    onClick?: (relativeX?: number, relativeY?: number) => void;
    onEnter?: () => void;
    onExit?: () => void;
};

/**
 * UIRenderer renders a component tree to canvas
 */
export class UIRenderer {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private clickRegions: ClickRegion[] = [];
    private hoveredRegion: ClickRegion | null = null;
    private bindings: Set<ValueBindingBase<any>> = new Set();
    private imageCache: Map<string, HTMLImageElement> = new Map();

    // Animation support
    private animationFrameId: number | null = null;
    private lastRenderTime: number = 0;
    private currentRoot: UINode | null = null;
    private hasActiveAnimations: boolean = false;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.setupEventListeners();
    }

    /**
     * Set image for rendering (called by platform with loaded images)
     */
    setImage(key: string, img: HTMLImageElement): void {
        this.imageCache.set(key, img);
    }

    /**
     * Set multiple images at once
     */
    setImages(images: Map<string, HTMLImageElement>): void {
        this.imageCache = images;
    }

    /**
     * Render a UI tree
     */
    render(root: UINode): void {
        // Store the root for re-rendering during animation
        this.currentRoot = root;

        // Perform the actual render
        this.performRender(root);

        // Start animation loop if not already running
        if (!this.animationFrameId) {
            this.startAnimationLoop();
        }
    }

    /**
     * Perform the actual rendering
     */
    private performRender(root: UINode): void {
        // Clear previous state
        this.clickRegions = [];
        this.hasActiveAnimations = false; // Reset animation detection

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render the tree
        const containerBox: LayoutBox = {
            x: 0,
            y: 0,
            width: this.canvas.width,
            height: this.canvas.height,
        };

        this.renderNode(root, containerBox);
    }

    /**
     * Render a single node
     */
    private renderNode(node: UINode | undefined | null, parentBox: LayoutBox): LayoutBox | null {
        // Handle null/undefined nodes gracefully
        if (!node) {
            return null;
        }

        // Debug: Log node type
        if (node.type === 'image') {
            console.log('🖼️ renderNode: Found image node!', node);
        }

        switch (node.type) {
            case 'view':
                return this.renderView(node as UINode<ViewProps>, parentBox);
            case 'text':
                return this.renderText(node as UINode<TextProps>, parentBox);
            case 'image':
                return this.renderImage(node as UINode<ImageProps>, parentBox);
            case 'pressable':
                return this.renderPressable(node as UINode<PressableProps>, parentBox);
            case 'scrollview':
                return this.renderScrollView(node as UINode<ScrollViewProps>, parentBox);
            case 'conditional':
                return this.renderConditional(node as UINode<ConditionalProps>, parentBox);
            default:
                console.warn(`Unknown node type: ${node?.type}`);
                return null;
        }
    }

    /**
     * Render a View component
     */
    private renderView(node: UINode<ViewProps>, parentBox: LayoutBox): LayoutBox {
        const style = this.resolveStyle(node.props.style || {});
        const box = this.calculateLayout(style, parentBox);


        console.log('renderView - box:', box, 'style.backgroundColor:', style.backgroundColor);

        // Draw background
        if (style.backgroundColor) {
            this.ctx.fillStyle = style.backgroundColor;
            this.ctx.fillRect(box.x, box.y, box.width, box.height);
            console.log('Drew background at', box);
        }

        // Draw borders
        this.drawBorders(box, style);

        // Render children
        console.log('Rendering children for View, children:', node.children);
        this.renderChildren(node.children, box, style);

        return box;
    }

    /**
     * Render a Text component
     */
    private renderText(node: UINode<TextProps>, parentBox: LayoutBox): LayoutBox {
        const style = this.resolveStyle(node.props.style || {}) as TextStyle;
        const text = this.resolveAndTrack<string>(node.props.text);
        // Debug log for timer text
        if (text && (text.includes('(') || text.includes('Enemy Turn'))) {
            console.log('[UIRenderer] Rendering timer text:', text);
        }
        const box = this.calculateLayout(style, parentBox);


        // Handle undefined or null text
        if (text === undefined || text === null) {
            return box;
        }
        // Set text style
        const fontSize = (style.fontSize as number) || 16;
        const fontFamily = style.fontFamily || 'Arial';
        const fontWeight = style.fontWeight || 'normal';
        this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        this.ctx.fillStyle = (style.color as string) || '#000000';
        this.ctx.textAlign = (style.textAlign as CanvasTextAlign) || 'left';
        this.ctx.textBaseline = 'top';

        // Handle text wrapping if needed
        const lines = this.wrapText(text, box.width, node.props.numberOfLines);

        // Calculate vertical alignment
        const lineHeight = (style.lineHeight as number) || fontSize * 1.2;
        const totalHeight = lines.length * lineHeight;
        let startY = box.y;

        if (style.textAlignVertical === 'center') {
            startY = box.y + (box.height - totalHeight) / 2;
        } else if (style.textAlignVertical === 'bottom') {
            startY = box.y + box.height - totalHeight;
        }

        // Draw text
        lines.forEach((line, i) => {
            let x = box.x;
            if (style.textAlign === 'center') {
                x = box.x + box.width / 2;
            } else if (style.textAlign === 'right') {
                x = box.x + box.width;
            }

            this.ctx.fillText(line, x, startY + i * lineHeight);
        });

        return box;
    }

    /**
     * Render an Image component
     */
    private renderImage(node: UINode<ImageProps>, parentBox: LayoutBox): LayoutBox {
        const style = this.resolveStyle(node.props.style || {});
        const box = this.calculateLayout(style, parentBox);

        let currentImageId: string | null = null;

        // Priority: binding > imageId
        if (node.props.binding) {
            // Mark that we have active animations (needs continuous rendering)
            this.hasActiveAnimations = true;

            // Handle BaseBinding - call .get() to get current value
            if (typeof node.props.binding.get === 'function') {
                currentImageId = node.props.binding.get();
            }
        } else if (node.props.imageId) {
            // Handle imageId (string or platform binding)
            const imageId = this.resolveAndTrack<string | null>(node.props.imageId);
            currentImageId = imageId;
        }

        if (currentImageId) {
            const img = this.imageCache.get(currentImageId);

            if (img && img.complete) {
                // Draw the image
                this.ctx.drawImage(img, box.x, box.y, box.width, box.height);
            } else {
                // Draw placeholder if image not loaded
                this.ctx.fillStyle = '#333';
                this.ctx.fillRect(box.x, box.y, box.width, box.height);
                this.ctx.fillStyle = '#666';
                this.ctx.font = '14px sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('Loading...', box.x + box.width / 2, box.y + box.height / 2);
            }
        } else {
            // Draw placeholder if no image ID provided
            this.ctx.fillStyle = '#cccccc';
            this.ctx.fillRect(box.x, box.y, box.width, box.height);
        }

        return box;
    }

    /**
     * Render a Pressable component
     */
    private renderPressable(node: UINode<PressableProps>, parentBox: LayoutBox): LayoutBox {
        const style = this.resolveStyle(node.props.style || {});
        const box = this.calculateLayout(style, parentBox);
        const disabled = this.resolveAndTrack<boolean>(node.props.disabled || false);

        console.log('🔘 Pressable:', {
            box,
            disabled,
            hasOnClick: !!node.props.onClick,
            parentBox
        });

        // Register click region
        if (!disabled) {
            console.log('✅ Click region registered:', box);
            this.clickRegions.push({
                box,
                onClick: node.props.onClick,
                onEnter: node.props.onEnter,
                onExit: node.props.onExit,
            });
        }

        // Draw background
        if (style.backgroundColor) {
            this.ctx.fillStyle = style.backgroundColor;
            this.ctx.fillRect(box.x, box.y, box.width, box.height);
        }

        // Draw borders
        this.drawBorders(box, style);

        // Render children
        this.renderChildren(node.children, box, style);

        return box;
    }

    /**
     * Render a ScrollView component
     */
    private renderScrollView(node: UINode<ScrollViewProps>, parentBox: LayoutBox): LayoutBox {
        // For now, render as a regular view
        // TODO: Implement scrolling functionality
        const style = this.resolveStyle(node.props.style || {});
        const box = this.calculateLayout(style, parentBox);

        // Draw background
        if (style.backgroundColor) {
            this.ctx.fillStyle = style.backgroundColor;
            this.ctx.fillRect(box.x, box.y, box.width, box.height);
        }

        // Render children
        this.renderChildren(node.children, box, style);

        return box;
    }

    /**
     * Render a conditional component
     */
    private renderConditional(node: UINode<ConditionalProps>, parentBox: LayoutBox): LayoutBox | null {
        const condition = this.resolveAndTrack<boolean>(node.props.condition);
        const component = condition ? node.props.trueComponent : node.props.falseComponent;

        if (!component) return null;

        const children = Array.isArray(component) ? component : [component];
        return this.renderChildren(children, parentBox, {});
    }

    /**
     * Render children nodes
     */
    private renderChildren(children: any, parentBox: LayoutBox, parentStyle: ResolvedStyle): LayoutBox {
        console.log('renderChildren called with:', { children, isBinding: children instanceof ValueBindingBase, isArray: Array.isArray(children) });

        // Resolve children if it's a binding
        let childArray: UINode[] = [];

        if (children instanceof ValueBindingBase) {
            // Track the binding for re-render on change
            this.trackBinding(children);
            const value = children.get();
            console.log('Children is a binding, resolved value:', value);
            childArray = Array.isArray(value) ? value : (value ? [value] : []);
        } else if (Array.isArray(children)) {
            childArray = children;
        } else if (children) {
            childArray = [children];
        }

        // Resolve any bindings in the child array
        childArray = childArray.map(child => {
            if (child instanceof ValueBindingBase) {
                this.trackBinding(child);
                return child.get();
            }
            return child;
        });

        // Filter out null/undefined children
        childArray = childArray.filter(child => child != null);

        console.log('Filtered child array:', childArray, 'length:', childArray.length);

        if (childArray.length === 0) {
            console.log('No children to render, returning parentBox');
            return parentBox;
        }

        const flexDirection = parentStyle.flexDirection || 'column';
        const isRow = flexDirection === 'row' || flexDirection === 'row-reverse';

        console.log('renderChildren - flexbox layout:', { isRow, childCount: childArray.length });

        // TWO-PASS LAYOUT:
        // Pass 1: Calculate sizes for all children
        const childSizes: { width: number | 'auto'; height: number | 'auto'; flex: number; isFixedSize: boolean; isAbsolute: boolean }[] = [];
        let totalFixedSize = 0;
        let totalFlex = 0;

        childArray.forEach(child => {
            // Skip conditional nodes - they handle their own layout
            if (child.type === 'conditional') {
                childSizes.push({
                    width: 'auto',
                    height: 'auto',
                    flex: 0,
                    isFixedSize: false,
                    isAbsolute: true  // Treat as absolute to skip flex layout
                });
                return;
            }

            const childStyle = this.resolveStyle(child.props.style || {});
            const flex = childStyle.flex || 0;

            // Skip absolutely positioned children - they don't participate in flex layout
            if (childStyle.position === 'absolute') {
                childSizes.push({
                    width: 'auto',
                    height: 'auto',
                    flex: 0,
                    isFixedSize: false,
                    isAbsolute: true
                });
                return;
            }

            // Check if dimensions are explicitly fixed (numbers only, not percentages)
            const widthValue = childStyle.width;
            const heightValue = childStyle.height;

            const hasFixedWidth = typeof widthValue === 'number';
            const hasFixedHeight = typeof heightValue === 'number';

            let width = this.resolveDimension(widthValue, parentBox.width, 'auto');
            let height = this.resolveDimension(heightValue, parentBox.height, 'auto');

            // Determine if this child has a fixed size in the flex direction
            const isFixedSize = isRow ? hasFixedWidth : hasFixedHeight;

            childSizes.push({
                width,
                height,
                flex,
                isFixedSize,
                isAbsolute: false
            });

            // Only count EXPLICITLY fixed sizes (not percentages or auto)
            if (flex === 0 && isFixedSize) {
                totalFixedSize += isRow ? (typeof width === 'number' ? width : 0) : (typeof height === 'number' ? height : 0);
            } else if (flex > 0) {
                totalFlex += flex;
            }
        });

        // Calculate remaining space for flex and non-fixed children
        const availableSpace = isRow ? parentBox.width : parentBox.height;
        const remainingSpace = Math.max(0, availableSpace - totalFixedSize);

        // Count non-fixed, non-flex, non-absolute children that need to share space
        const nonFixedNonFlexCount = childSizes.filter(s => !s.isFixedSize && s.flex === 0 && !s.isAbsolute).length;
        const totalSharers = totalFlex + nonFixedNonFlexCount;
        const spacePerSharer = totalSharers > 0 ? remainingSpace / totalSharers : 0;

        console.log('Flexbox calc:', {
            availableSpace,
            totalFixedSize,
            remainingSpace,
            totalFlex,
            nonFixedNonFlexCount,
            totalSharers,
            spacePerSharer
        });

        // Pass 2: Render children with calculated sizes
        let currentX = parentBox.x;
        let currentY = parentBox.y;

        childArray.forEach((child, index) => {
            const sizeInfo = childSizes[index];

            // Absolute children don't participate in flex layout
            if (sizeInfo.isAbsolute) {
                // Render with full parent box
                this.renderNode(child, parentBox);
                return;
            }

            let childWidth = typeof sizeInfo.width === 'number' ? sizeInfo.width : parentBox.width;
            let childHeight = typeof sizeInfo.height === 'number' ? sizeInfo.height : parentBox.height;

            // Apply flex sizing
            if (sizeInfo.flex > 0) {
                if (isRow) {
                    childWidth = spacePerSharer * sizeInfo.flex;
                    childHeight = parentBox.height;
                } else {
                    childWidth = parentBox.width;
                    childHeight = spacePerSharer * sizeInfo.flex;
                }
            } else if (!sizeInfo.isFixedSize) {
                // Non-fixed, non-flex children share remaining space equally
                if (isRow) {
                    childWidth = spacePerSharer;
                    childHeight = parentBox.height;
                } else {
                    childWidth = parentBox.width;
                    childHeight = spacePerSharer;
                }
            }

            const childParentBox: LayoutBox = {
                x: currentX,
                y: currentY,
                width: Math.max(0, childWidth),
                height: Math.max(0, childHeight),
            };

            console.log(`Child ${index}:`, { flex: sizeInfo.flex, isFixedSize: sizeInfo.isFixedSize, isAbsolute: sizeInfo.isAbsolute, childParentBox });

            const childBox = this.renderNode(child, childParentBox);

            if (childBox) {
                if (isRow) {
                    currentX += childBox.width;
                } else {
                    currentY += childBox.height;
                }
            }
        });

        return parentBox;
    }

    /**
     * Calculate layout box for a node
     */
    private calculateLayout(style: ResolvedStyle, parentBox: LayoutBox): LayoutBox {
        // Resolve dimensions
        let width = this.resolveDimension(style.width, parentBox.width, 'auto');
        let height = this.resolveDimension(style.height, parentBox.height, 'auto');

        // If flex is set, use the available space (parentBox already accounts for this)
        if (style.flex !== undefined && style.flex > 0) {
            if (width === 'auto') width = parentBox.width;
            if (height === 'auto') height = parentBox.height;
        }

        let x = parentBox.x;
        let y = parentBox.y;

        // Handle positioning
        if (style.position === 'absolute') {
            if (style.left !== undefined) {
                const leftOffset = this.resolveDimension(style.left, parentBox.width, 0);
                x = parentBox.x + (typeof leftOffset === 'number' ? leftOffset : 0);
            }
            if (style.top !== undefined) {
                const topOffset = this.resolveDimension(style.top, parentBox.height, 0);
                y = parentBox.y + (typeof topOffset === 'number' ? topOffset : 0);
            }
        }

        // Apply margins (only affect position, not size for now)
        const marginLeft = this.resolveDimension(style.marginLeft || style.margin, parentBox.width, 0);
        const marginTop = this.resolveDimension(style.marginTop || style.margin, parentBox.height, 0);

        const finalWidth = width === 'auto' ? parentBox.width : (typeof width === 'number' ? width : parentBox.width);
        const finalHeight = height === 'auto' ? parentBox.height : (typeof height === 'number' ? height : parentBox.height);

        const ml = typeof marginLeft === 'number' ? marginLeft : 0;
        const mt = typeof marginTop === 'number' ? marginTop : 0;

        const result = {
            x: x + ml,
            y: y + mt,
            width: finalWidth,
            height: finalHeight,
        };

        console.log('calculateLayout:', {
            styleWidth: style.width,
            styleHeight: style.height,
            styleFlex: style.flex,
            parentBox,
            result
        });

        return result;
    }

    /**
     * Resolve a dimension value (number, percentage, or 'auto')
     */
    private resolveDimension(value: DimensionValue | undefined, parentSize: number, defaultValue: number | 'auto'): number | 'auto' {
        if (value === undefined) return defaultValue;
        if (typeof value === 'number') return value;
        if (value === 'auto') return 'auto';

        // Handle percentage strings
        if (typeof value === 'string' && value.endsWith('%')) {
            const percentage = parseFloat(value) / 100;
            return parentSize * percentage;
        }

        return defaultValue;
    }

    /**
     * Resolve style values (handle bindings)
     */
    private resolveStyle(style: any): ResolvedStyle {
        const resolved: any = {};

        for (const key in style) {
            const value = style[key];
            if (value instanceof ValueBindingBase) {
                // Track binding for re-render
                this.trackBinding(value);
                resolved[key] = value.get();
            } else {
                resolved[key] = value;
            }
        }

        return resolved as ResolvedStyle;
    }

    /**
     * Track a binding (for potential future use, but don't auto-rerender)
     * The main application (main.ts) handles re-rendering via top-level playerData subscription
     */
    private trackBinding(binding: ValueBindingBase<any>): void {
        if (!this.bindings.has(binding)) {
            this.bindings.add(binding);
            // Don't subscribe - let the app-level binding (playerData) handle re-renders
        }
    }

    /**
     * Resolve a bindable and track it if it's a binding
     */
    private resolveAndTrack<T>(bindable: any, playerId?: string): T {
        if (bindable && typeof bindable.get === 'function') {
            this.trackBinding(bindable);
            return bindable.get(playerId);
        }
        return bindable;
    }

    /**
     * Draw borders
     */
    private drawBorders(box: LayoutBox, style: ResolvedStyle): void {
        const borderWidth = style.borderWidth || 0;
        const borderColor = style.borderColor || '#000000';
        const borderRadius = style.borderRadius || 0;

        if (borderWidth > 0) {
            this.ctx.strokeStyle = borderColor;
            this.ctx.lineWidth = borderWidth;

            if (borderRadius > 0) {
                this.roundRect(box.x, box.y, box.width, box.height, borderRadius);
                this.ctx.stroke();
            } else {
                this.ctx.strokeRect(box.x, box.y, box.width, box.height);
            }
        }
    }

    /**
     * Draw rounded rectangle
     */
    private roundRect(x: number, y: number, width: number, height: number, radius: number): void {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    /**
     * Wrap text to fit within a width
     */
    private wrapText(text: string, maxWidth: number, maxLines?: number): string[] {
        // Guard against undefined or null text
        if (!text) return [];

        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = this.ctx.measureText(testLine);

            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;

                if (maxLines && lines.length >= maxLines) {
                    break;
                }
            } else {
                currentLine = testLine;
            }
        }

        if (currentLine && (!maxLines || lines.length < maxLines)) {
            lines.push(currentLine);
        }

        return lines;
    }

    /**
     * Setup event listeners for interactivity
     */
    /**
     * Start animation loop for animated images
     */
    private startAnimationLoop(): void {
        const animate = (currentTime: number) => {
            // Re-render if enough time has passed (target: ~30 FPS for smooth animation)
            if (!this.lastRenderTime || currentTime - this.lastRenderTime >= 33) {
                this.lastRenderTime = currentTime;
                if (this.currentRoot) {
                    this.performRender(this.currentRoot);
                }
            }

            // Only continue the loop if we have active animations
            if (this.hasActiveAnimations) {
                this.animationFrameId = requestAnimationFrame(animate);
            } else {
                // Stop the loop - no animations active
                this.animationFrameId = null;
            }
        };

        this.animationFrameId = requestAnimationFrame(animate);
    }

    /**
     * Stop animation loop
     */
    private stopAnimationLoop(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    private setupEventListeners(): void {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    /**
     * Handle click events
     */
    private handleClick(e: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        console.log(`👆 Canvas clicked at (${x.toFixed(0)}, ${y.toFixed(0)}), ${this.clickRegions.length} regions`);

        // Find clicked region (reverse order for z-index)
        let foundRegion = false;
        for (let i = this.clickRegions.length - 1; i >= 0; i--) {
            const region = this.clickRegions[i];
            const inBox = this.isPointInBox(x, y, region.box);

            if (inBox) {
                console.log(`🎯 Hit region ${i}:`, region.box);
                foundRegion = true;
                if (region.onClick) {
                    console.log('🖱️ Calling onClick handler');
                    // Calculate relative position within the box (0 to 1)
                    const relativeX = (x - region.box.x) / region.box.width;
                    const relativeY = (y - region.box.y) / region.box.height;
                    region.onClick(relativeX, relativeY);
                } else {
                    console.log('⚠️ Region has no onClick handler');
                }
                break;
            }
        }

        if (!foundRegion) {
            console.log('❌ No click region found at this position');
        }
    }

    /**
     * Handle mouse move events
     */
    private handleMouseMove(e: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let newHoveredRegion: ClickRegion | null = null;

        // Find hovered region
        for (let i = this.clickRegions.length - 1; i >= 0; i--) {
            const region = this.clickRegions[i];
            if (this.isPointInBox(x, y, region.box)) {
                newHoveredRegion = region;
                break;
            }
        }

        // Handle enter/exit
        if (newHoveredRegion !== this.hoveredRegion) {
            if (this.hoveredRegion && this.hoveredRegion.onExit) {
                this.hoveredRegion.onExit();
            }
            if (newHoveredRegion && newHoveredRegion.onEnter) {
                newHoveredRegion.onEnter();
            }
            this.hoveredRegion = newHoveredRegion;
        }

        // Update cursor
        this.canvas.style.cursor = newHoveredRegion ? 'pointer' : 'default';
    }

    /**
     * Check if a point is inside a box
     */
    private isPointInBox(x: number, y: number, box: LayoutBox): boolean {
        return x >= box.x && x <= box.x + box.width &&
               y >= box.y && y <= box.y + box.height;
    }

    /**
     * Cleanup
     */
    destroy(): void {
        // Cleanup (nothing to do since we don't subscribe to bindings)
    }
}
