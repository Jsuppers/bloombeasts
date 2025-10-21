/**
 * UI Components
 * Mimics Horizon's component API (View, Text, Image, Pressable)
 */

import { Bindable } from './Binding';
import { ViewStyle, TextStyle, ImageStyle, Callback } from './types';

/**
 * Base Props for all components
 */
export type BaseProps = {
    style?: any; // Will be narrowed by specific component types
};

/**
 * UINode represents a UI element
 */
export class UINode<TProps extends BaseProps = BaseProps> {
    public readonly type: string;
    public readonly props: Readonly<TProps>;
    public children: any; // Can be UINode[], DerivedBinding, or other reactive values

    constructor(type: string, props: Readonly<TProps>, children: any = []) {
        this.type = type;
        this.props = props;
        this.children = children;
    }

    /**
     * Conditional rendering
     */
    static if(
        condition: Bindable<boolean>,
        trueComponent?: UIChildren,
        falseComponent?: UIChildren
    ): UINode<ConditionalProps> {
        return new UINode('conditional', {
            condition,
            trueComponent,
            falseComponent,
        } as ConditionalProps);
    }
}

/**
 * Children can be single node or array of nodes, or a binding that produces them
 */
export type UIChildren = UINode | UINode[] | undefined | any; // any for bindings

/**
 * Normalize children - pass through as-is, will be resolved during rendering
 */
function normalizeChildren(children?: UIChildren): any {
    // Don't normalize here - let the renderer handle bindings
    // This allows derived bindings to work properly
    return children;
}

// ============= View Component =============

export type ViewProps = {
    children?: UIChildren;
    style?: ViewStyle;
};

export function View(props: Readonly<ViewProps>): UINode<ViewProps> {
    return new UINode('view', props, normalizeChildren(props.children));
}

// ============= Text Component =============

export type TextProps = {
    text: Bindable<string>;
    numberOfLines?: number;
    style?: TextStyle;
};

export function Text(props: Readonly<TextProps>): UINode<TextProps> {
    return new UINode('text', props);
}

// ============= Image Component =============

export type ImageSource = {
    uri?: string;
    asset?: any; // For texture assets
};

export type ImageProps = {
    source?: Bindable<ImageSource | null>;
    style?: ImageStyle;
};

export function Image(props: Readonly<ImageProps>): UINode<ImageProps> {
    return new UINode('image', props);
}

// ============= Pressable Component =============

export type PressableProps = {
    children?: UIChildren;
    disabled?: Bindable<boolean>;
    onClick?: Callback;
    onEnter?: Callback;
    onExit?: Callback;
    onPress?: Callback;
    onRelease?: Callback;
    propagateClick?: boolean;
    style?: ViewStyle;
};

export function Pressable(props: Readonly<PressableProps>): UINode<PressableProps> {
    return new UINode('pressable', props, normalizeChildren(props.children));
}

// ============= ScrollView Component =============

export type ScrollViewProps = ViewProps & {
    contentContainerStyle?: ViewStyle;
    horizontal?: boolean;
};

export function ScrollView(props: Readonly<ScrollViewProps>): UINode<ScrollViewProps> {
    return new UINode('scrollview', props, normalizeChildren(props.children));
}

// ============= Conditional Props =============

export type ConditionalProps = BaseProps & {
    condition: Bindable<boolean>;
    trueComponent?: UIChildren;
    falseComponent?: UIChildren;
};
