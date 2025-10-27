# Reactive Programming Patterns with Horizon Bindings

This document captures key learnings and best practices for building reactive UI components with Horizon's binding system.

## Core Principles

### 1. Horizon Bindings Have No `.get()` Method

**Problem:**
```typescript
// ❌ This doesn't work in Horizon!
const value = this.myBinding.get();
```

**Solution:**
Use tracked values for event handlers:
```typescript
// ✅ Track value in a variable
private myValue: string = '';

constructor() {
  // Derive to keep it in sync
  this.myBinding = new this.ui.Binding('initial');
}

onClick: (newValue: string) => {
  this.myValue = newValue;
  this.myBinding.set(newValue);
  // Use tracked value like this instead of .get()
  console.log(this.myValue);
}
```
Note: only if really needed, prefer passing down the binding and using derive where needed.

### 2. Avoid Deep Binding Nesting (Max 2 Levels)

**Problem:**
```typescript
// ❌ This exceeds Horizon's nesting limit!
const level1 = ui.Binding.derive([sourceBinding], ...);
const level2 = ui.Binding.derive([level1], ...);
const level3 = ui.Binding.derive([level2], ...); // ERROR!
```

**Error Message:**
```
TypeError: dep.addDependent is not a function
```

**Solution:**
Always derive from source bindings:
```typescript
// ✅ All bindings derive from source bindings only
const dependencies = [cardsBinding, scrollOffsetBinding, deckCardIdsBinding];

const cardNameBinding = ui.Binding.derive(dependencies, (...args) => {
  const cards = args[0];
  const offset = args[1];
  const deckIds = args[2];
  // ... compute value
  return result;
});

const cardLevelBinding = ui.Binding.derive(dependencies, (...args) => {
  const cards = args[0];
  const offset = args[1];
  // ... compute value
  return result;
});

// Each binding derives from the SAME source bindings
// No chaining!
```

### 3. Store Derived Bindings to Prevent Garbage Collection

**Problem:**
```typescript
// ❌ Binding gets garbage collected and stops reacting!
constructor() {
  this.ui.Binding.derive([this.source], (value) => {
    this.trackedValue = value;
    return value;
  });
}
```

**Solution:**
```typescript
// ✅ Store the binding reference
private valueTracker: any;

constructor() {
  this.valueTracker = this.ui.Binding.derive([this.source], (value) => {
    this.trackedValue = value;
    return value;
  });
}
```

### 4. Only `ui.Pressable` Supports `onClick`, Not `ui.View`

**Problem:**
```typescript
// ❌ onClick silently does nothing!
ui.View({
  onClick: () => console.log('clicked'),
  children: [...]
})
```

**Solution:**
```typescript
// ✅ Use Pressable for clickable elements
if (onClick) {
  return ui.Pressable({
    onClick: () => onClick(data),
    children: [...]
  });
} else {
  return ui.View({
    children: [...]
  });
}
```

## Advanced Patterns

### Pattern 1: Dual-Mode Reactive Component

Support both slot-based (grids) and ID-based (popups) selection:

```typescript
export interface ReactiveComponentProps {
  cardsBinding: any; // Source binding
  deckCardIdsBinding?: any; // Source binding

  // Slot-based mode (for grids)
  scrollOffsetBinding?: any;
  slotIndex?: number;
  cardsPerPage?: number;

  // ID-based mode (for popups)
  cardIdBinding?: any;

  onClick?: (id: string) => void;
}

export function createReactiveComponent(ui: UIMethodMappings, props: ReactiveComponentProps) {
  const { cardsBinding, scrollOffsetBinding, slotIndex, cardsPerPage, cardIdBinding } = props;

  // Determine mode
  const isIdMode = cardIdBinding !== undefined;
  const isSlotMode = slotIndex !== undefined && cardsPerPage !== undefined && scrollOffsetBinding !== undefined;

  // Build dependencies array based on mode
  let dependencies: any[];
  if (isIdMode && cardIdBinding) {
    dependencies = [cardsBinding, cardIdBinding];
  } else if (isSlotMode && scrollOffsetBinding) {
    dependencies = [cardsBinding, scrollOffsetBinding];
  } else {
    dependencies = [cardsBinding];
  }

  // Helper to get data based on mode
  const getData = (args: any[]) => {
    const items = args[0];

    if (isIdMode && cardIdBinding) {
      const id = args[1];
      return items.find(item => item.id === id) || null;
    } else if (isSlotMode && slotIndex !== undefined && cardsPerPage !== undefined) {
      const offset = args[1];
      const pageStart = offset * cardsPerPage;
      const index = pageStart + slotIndex;
      return index < items.length ? items[index] : null;
    }

    return null;
  };

  // Create all property bindings using the same dependencies
  const nameBinding = ui.Binding.derive(dependencies, (...args) => {
    const data = getData(args);
    return data?.name || '';
  });

  const levelBinding = ui.Binding.derive(dependencies, (...args) => {
    const data = getData(args);
    return data?.level || 0;
  });

  // ... more bindings

  return ui.View({
    children: [
      ui.Text({ text: nameBinding }),
      ui.Text({ text: levelBinding }),
      // ... more elements
    ]
  });
}
```

### Pattern 2: Tracked Values for Event Handlers

When you need to read binding values in event handlers:

```typescript
export function createReactiveComponent(ui: UIMethodMappings, props: Props) {
  // Track the current data for click handler
  let trackedData: Data | null = null;

  // Create bindings that also track the value
  const nameBinding = ui.Binding.derive([sourceBinding], (...args) => {
    const data = getData(args);
    trackedData = data; // Track for onClick
    return data?.name || '';
  });

  // Use tracked value in onClick
  return ui.Pressable({
    onClick: () => {
      if (trackedData && onClick) {
        onClick(trackedData.id);
      }
    },
    children: [
      ui.Text({ text: nameBinding })
    ]
  });
}
```

### Pattern 3: Flexible Side Content with Reactive Props

Pass bindings to render functions for maximum flexibility:

```typescript
export interface PopupProps {
  dataIdBinding: any;
  dataBinding: any;
  onClose: () => void;
  sideContent?: (ui: UIMethodMappings, deps: {
    dataIdBinding: any;
    dataBinding: any;
  }) => UINodeType[];
}

export function createPopup(ui: UIMethodMappings, props: PopupProps) {
  const { dataIdBinding, dataBinding, onClose, sideContent } = props;

  return ui.View({
    children: [
      // Main content here
      createReactiveComponent(ui, {
        dataBinding,
        dataIdBinding,
      }),

      // Side content gets access to bindings
      ui.View({
        children: sideContent ? sideContent(ui, { dataIdBinding, dataBinding }) : []
      })
    ]
  });
}

// Usage:
createPopup(ui, {
  dataIdBinding: this.selectedId,
  dataBinding: this.items,
  onClose: () => this.closePopup(),
  sideContent: (ui, { dataIdBinding, dataBinding }) => [
    // Create buttons that derive their state from bindings
    ui.Pressable({
      onClick: () => this.handleAction(),
      children: [
        ui.Text({
          text: ui.Binding.derive(
            [dataIdBinding, dataBinding],
            (id, items) => {
              const item = items.find(i => i.id === id);
              return item?.isActive ? 'Deactivate' : 'Activate';
            }
          )
        })
      ]
    })
  ]
});
```

## Common Mistakes to Avoid

### ❌ Mistake 1: Chaining Derived Bindings
```typescript
// DON'T do this!
const derived1 = ui.Binding.derive([source], ...);
const derived2 = ui.Binding.derive([derived1], ...); // Will hit nesting limit!
```

### ❌ Mistake 2: Not Storing Tracker Bindings
```typescript
// DON'T do this!
constructor() {
  ui.Binding.derive([this.data], (value) => {
    this.trackedValue = value; // Gets garbage collected!
  });
}
```

### ❌ Mistake 3: Using `.get()` in Horizon
```typescript
// DON'T do this in Horizon!
onClick: () => {
  const value = this.binding.get(); // Doesn't exist!
}
```

### ❌ Mistake 4: Using onClick on View
```typescript
// DON'T do this!
ui.View({
  onClick: () => {}, // Silently ignored!
  children: [...]
})
```

## Best Practices Summary

1. **Always derive from source bindings** - never chain derived bindings
2. **Store all derived bindings** - prevent garbage collection
3. **Use tracked values for event handlers** - since `.get()` doesn't exist
4. **Use `ui.Pressable` for clickable elements** - `ui.View` doesn't support `onClick`
5. **Create reusable helpers** - like `getData()` to centralize selection logic
6. **Pass bindings to render functions** - for maximum flexibility
7. **Keep dependencies arrays consistent** - all related bindings should use same dependencies
8. **Use TypeScript optional checks** - avoid non-null assertions (`!`)

## Example: Complete Reactive Screen

```typescript
export class ReactiveScreen {
  private ui: UIMethodMappings;
  private items: any; // Source binding from parent
  private selectedId: any; // Binding<string | null>
  private scrollOffset: any; // Binding<number>

  // Tracked values for event handlers
  private scrollOffsetValue: number = 0;

  constructor(props: Props) {
    this.ui = props.ui;
    this.items = props.items; // Source binding
    this.selectedId = new this.ui.Binding<string | null>(null);
    this.scrollOffset = new this.ui.Binding(0);
  }

  createUI(): UINodeType {
    return this.ui.View({
      children: [
        // Grid using slot-based mode
        this.createGrid(),

        // Popup using ID-based mode (conditionally rendered)
        ...(this.ui.UINode ? [this.ui.UINode.if(
          this.ui.Binding.derive(
            [this.selectedId],
            (id) => id !== null ? true : false
          ),
          this.createPopup()
        )] : []),
      ]
    });
  }

  private createGrid(): UINodeType {
    const itemsPerPage = 8;

    return this.ui.View({
      children: Array.from({ length: itemsPerPage }, (_, i) =>
        createReactiveComponent(this.ui, {
          dataBinding: this.items,
          scrollOffsetBinding: this.scrollOffset,
          slotIndex: i,
          itemsPerPage: itemsPerPage,
          onClick: (id) => this.selectedId.set(id)
        })
      )
    });
  }

  private createPopup(): UINodeType {
    return createReactivePopup(this.ui, {
      dataIdBinding: this.selectedId,
      dataBinding: this.items,
      onClose: () => this.selectedId.set(null),
      sideContent: (ui, deps) => this.createPopupButtons(deps)
    });
  }

  private createPopupButtons(deps: { dataIdBinding: any; dataBinding: any }): UINodeType[] {
    const { dataIdBinding, dataBinding } = deps;

    // Track ID for onClick handler
    let currentId: string | null = null;
    const idTracker = this.ui.Binding.derive(
      [dataIdBinding],
      (id) => {
        currentId = id;
        return id;
      }
    );

    return [
      this.ui.Pressable({
        onClick: () => {
          if (currentId) {
            this.handleAction(currentId);
          }
        },
        children: [
          this.ui.Text({
            text: this.ui.Binding.derive(
              [dataIdBinding, dataBinding],
              (id, items) => {
                const item = items.find(i => i.id === id);
                return item?.isActive ? 'Deactivate' : 'Activate';
              }
            )
          })
        ]
      })
    ];
  }

  private handleAction(id: string): void {
    // Handle action
    this.selectedId.set(null);
  }
}
```

This pattern ensures:
- ✅ No binding nesting issues
- ✅ Fully reactive UI
- ✅ Clean, maintainable code
- ✅ Works on both Horizon and Web platforms
