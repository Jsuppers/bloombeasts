/**
 * Loading Screen
 * Simple loading screen using the new UI component system
 */

import { View, Text, UINode, Binding } from '../ui';

export class LoadingScreen {
    private loadingText: Binding<string>;

    constructor() {
        this.loadingText = new Binding('Loading...');
    }

    /**
     * Create the loading screen UI
     */
    createUI(): UINode {
        return View({
            style: {
                width: '100%',
                height: '100%',
                backgroundColor: '#1a1a2e',
                justifyContent: 'center',
                alignItems: 'center',
            },
            children: [
                View({
                    style: {
                        padding: 40,
                        backgroundColor: '#16213e',
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: '#0f3460',
                    },
                    children: [
                        Text({
                            text: this.loadingText,
                            style: {
                                fontSize: 32,
                                color: '#00d9ff',
                                fontFamily: 'Arial',
                                textAlign: 'center',
                            },
                        }),
                    ],
                }),
            ],
        });
    }

    /**
     * Update loading text
     */
    setLoadingText(text: string): void {
        this.loadingText.set(text);
    }

    /**
     * Set loading progress (0-100)
     */
    setProgress(progress: number): void {
        this.loadingText.set(`Loading... ${Math.round(progress)}%`);
    }
}
