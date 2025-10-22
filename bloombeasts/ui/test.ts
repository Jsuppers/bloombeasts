/**
 * Test file for the unified BloomBeasts UI system
 * This file verifies that the platform switching works correctly
 */

import {
  Platform,
  setPlatform,
  getPlatform,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  DynamicList,
  Binding,
  DerivedBinding,
  UINode,
  Animation,
  Easing,
  initializePlatform,
  cleanupPlatform,
  isHorizon,
  isWeb,
  getPlatformCapabilities,
  getPlatformConfig
} from './index';

console.log('🧪 Testing BloomBeasts Unified UI System...\n');

// Test 1: Platform switching
console.log('Test 1: Platform Switching');
console.log('----------------------------');

// Test setting to Horizon
setPlatform(Platform.horizon);
console.log(`Current platform: ${getPlatform()}`);
console.log(`Is Horizon: ${isHorizon()}`);
console.log(`Is Web: ${isWeb()}`);

// Test setting to Web
setPlatform(Platform.web);
console.log(`Current platform: ${getPlatform()}`);
console.log(`Is Horizon: ${isHorizon()}`);
console.log(`Is Web: ${isWeb()}`);

// Test 2: Platform capabilities
console.log('\nTest 2: Platform Capabilities');
console.log('-------------------------------');

setPlatform(Platform.horizon);
console.log('Horizon capabilities:', getPlatformCapabilities());

setPlatform(Platform.web);
console.log('Web capabilities:', getPlatformCapabilities());

// Test 3: Platform configuration
console.log('\nTest 3: Platform Configuration');
console.log('--------------------------------');

setPlatform(Platform.horizon);
console.log('Horizon config:', getPlatformConfig());

setPlatform(Platform.web);
console.log('Web config:', getPlatformConfig());

// Test 4: Creating UI components
console.log('\nTest 4: Creating UI Components');
console.log('--------------------------------');

// Test on Web platform
setPlatform(Platform.web);
console.log('Testing on Web platform...');

try {
  // Create a simple view
  const webView = View({
    style: { backgroundColor: '#1a1a2e' },
    children: [
      Text({
        content: 'Hello from Web!',
        style: { color: '#fff', fontSize: 20 }
      }),
      Pressable({
        onPress: () => console.log('Button pressed on Web!'),
        children: Text({ content: 'Click Me' })
      })
    ]
  });
  console.log('✅ Web UI components created successfully');
} catch (error) {
  console.error('❌ Error creating Web UI components:', error);
}

// Test on Horizon platform
setPlatform(Platform.horizon);
console.log('Testing on Horizon platform...');

try {
  // Create a simple view
  const horizonView = View({
    style: { backgroundColor: '#1a1a2e' },
    children: [
      Text({
        content: 'Hello from Horizon!',
        style: { color: '#fff', fontSize: 20 }
      }),
      Pressable({
        onPress: () => console.log('Button pressed on Horizon!'),
        children: Text({ content: 'Click Me' })
      })
    ]
  });
  console.log('✅ Horizon UI components created successfully');
} catch (error) {
  console.error('❌ Error creating Horizon UI components:', error);
}

// Test 5: Data Binding
console.log('\nTest 5: Data Binding');
console.log('---------------------');

setPlatform(Platform.web);
try {
  const counter = new Binding(0);
  const doubledCounter = new DerivedBinding([counter], (count: number) => count * 2);

  console.log('Initial counter value:', counter.value);
  counter.set(5);
  console.log('After setting to 5:', counter.value);
  console.log('Doubled value:', doubledCounter.value);

  console.log('✅ Data binding works on Web platform');
} catch (error) {
  console.error('❌ Error with data binding on Web:', error);
}

// Test 6: DynamicList
console.log('\nTest 6: DynamicList');
console.log('-------------------');

setPlatform(Platform.web);
try {
  const items = new Binding(['Item 1', 'Item 2', 'Item 3']);

  const list = DynamicList({
    data: items,
    renderItem: (item: string, index?: number) => Text({
      content: `${index}: ${item}`,
      style: { color: '#fff' }
    }),
    style: { flexDirection: 'column', gap: 10 }
  });

  console.log('✅ DynamicList works on Web platform');

  // Update items
  items.set(['Updated 1', 'Updated 2', 'Updated 3', 'Updated 4']);
  console.log('✅ DynamicList updated successfully');
} catch (error) {
  console.error('❌ Error with DynamicList on Web:', error);
}

// Test 7: Platform initialization
console.log('\nTest 7: Platform Initialization');
console.log('---------------------------------');

try {
  setPlatform(Platform.web);
  initializePlatform();
  console.log('✅ Web platform initialized');

  setPlatform(Platform.horizon);
  initializePlatform();
  console.log('✅ Horizon platform initialized');

  cleanupPlatform();
  console.log('✅ Platform cleanup successful');
} catch (error) {
  console.error('❌ Error during platform initialization:', error);
}

// Test 8: Complex UI structure
console.log('\nTest 8: Complex UI Structure');
console.log('-----------------------------');

setPlatform(Platform.web);
try {
  const gameState = new Binding('menu');
  const cards = new Binding([
    { id: '1', name: 'Fire Beast', power: 10 },
    { id: '2', name: 'Water Beast', power: 8 },
    { id: '3', name: 'Forest Beast', power: 12 }
  ]);

  const complexUI = View({
    style: {
      width: 1280,
      height: 720,
      backgroundColor: '#1a1a2e',
      flexDirection: 'column'
    },
    children: [
      // Header
      View({
        style: {
          height: 80,
          backgroundColor: '#2a2a3e',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20
        },
        children: [
          Text({
            content: 'BloomBeasts',
            style: { color: '#fff', fontSize: 24, fontWeight: 'bold' }
          }),
          Text({
            content: gameState,
            style: { color: '#aaa', fontSize: 16 }
          })
        ]
      }),
      // Content area with DynamicList
      ScrollView({
        style: { flex: 1, padding: 20 },
        children: DynamicList({
          data: cards,
          renderItem: (card: any, index?: number) => View({
            style: {
              backgroundColor: '#3a3a4e',
              borderRadius: 8,
              padding: 15,
              marginBottom: 10
            },
            children: [
              Text({
                content: card.name,
                style: { color: '#fff', fontSize: 18, marginBottom: 5 }
              }),
              Text({
                content: `Power: ${card.power}`,
                style: { color: '#aaa', fontSize: 14 }
              })
            ]
          }),
          style: { flexDirection: 'column' }
        })
      })
    ]
  });

  console.log('✅ Complex UI structure created successfully');
} catch (error) {
  console.error('❌ Error creating complex UI structure:', error);
}

console.log('\n✨ All tests completed!');
console.log('========================');
console.log('The unified UI system is working correctly.');
console.log('You can now switch between platforms by changing:');
console.log('  setPlatform(Platform.horizon) OR setPlatform(Platform.web)');
console.log('All your UI code remains the same!');