/**
 * Demonstration of the BloomBeasts Unified UI System
 * This shows how to switch between platforms with a simple import change
 */

// Example 1: Using Horizon Platform
console.log('\n========================================');
console.log('EXAMPLE 1: HORIZON PLATFORM');
console.log('========================================\n');

console.log('// Import from unified UI system');
console.log("import { Platform, setPlatform, View, Text, Pressable, DynamicList, Binding } from 'bloombeasts/ui';");
console.log('');
console.log('// Set platform to Horizon');
console.log('setPlatform(Platform.horizon);');
console.log('');
console.log('// Now all UI components use Horizon native SDK');
console.log(`const myUI = View({
  style: { backgroundColor: '#1a1a2e' },
  children: [
    Text({ content: 'Hello Horizon!' }),
    Pressable({
      onPress: () => console.log('Clicked!'),
      children: Text({ content: 'Click Me' })
    })
  ]
});`);

console.log('\n========================================');
console.log('EXAMPLE 2: WEB PLATFORM');
console.log('========================================\n');

console.log('// Same imports, just change the platform!');
console.log("import { Platform, setPlatform, View, Text, Pressable, DynamicList, Binding } from 'bloombeasts/ui';");
console.log('');
console.log('// Set platform to Web');
console.log('setPlatform(Platform.web);');
console.log('');
console.log('// Now all UI components use Web canvas rendering');
console.log(`const myUI = View({
  style: { backgroundColor: '#1a1a2e' },
  children: [
    Text({ content: 'Hello Web!' }),
    Pressable({
      onPress: () => console.log('Clicked!'),
      children: Text({ content: 'Click Me' })
    })
  ]
});`);

console.log('\n========================================');
console.log('EXAMPLE 3: USING DYNAMICLIST (NOW ON BOTH!)');
console.log('========================================\n');

console.log('// DynamicList now works on both platforms!');
console.log(`const cards = new Binding([
  { id: '1', name: 'Fire Beast', power: 10 },
  { id: '2', name: 'Water Beast', power: 8 },
  { id: '3', name: 'Forest Beast', power: 12 }
]);

const cardList = DynamicList({
  data: cards,
  renderItem: (card, index) => View({
    style: {
      backgroundColor: '#3a3a4e',
      borderRadius: 8,
      padding: 15,
      marginBottom: 10
    },
    children: [
      Text({
        content: card.name,
        style: { color: '#fff', fontSize: 18 }
      }),
      Text({
        content: \`Power: \${card.power}\`,
        style: { color: '#aaa', fontSize: 14 }
      })
    ]
  }),
  style: { flexDirection: 'column' }
});`);

console.log('\n========================================');
console.log('EXAMPLE 4: PLATFORM-SPECIFIC FEATURES');
console.log('========================================\n');

console.log('// Check platform capabilities');
console.log(`import { getPlatformCapabilities, isHorizon, isWeb } from 'bloombeasts/ui';

const capabilities = getPlatformCapabilities();

if (capabilities.hasVR) {
  console.log('VR is available on this platform!');
}

if (isHorizon()) {
  console.log('Running on Horizon - can use persistent storage');
}

if (isWeb()) {
  console.log('Running on Web - using canvas rendering');
}`);

console.log('\n========================================');
console.log('KEY BENEFITS');
console.log('========================================\n');

console.log('✅ Single import path: "bloombeasts/ui"');
console.log('✅ Switch platforms with just setPlatform(Platform.horizon) or setPlatform(Platform.web)');
console.log('✅ All UI code remains exactly the same');
console.log('✅ DynamicList now works on both platforms (polyfilled for Web)');
console.log('✅ Type-safe with full TypeScript support');
console.log('✅ Platform-specific features still accessible when needed');
console.log('✅ Easy to add more platforms in the future');

console.log('\n========================================');
console.log('MIGRATION GUIDE');
console.log('========================================\n');

console.log('Old Horizon code:');
console.log("  import { View, Text } from 'horizon/ui';");
console.log('');
console.log('New unified code:');
console.log("  import { Platform, setPlatform, View, Text } from 'bloombeasts/ui';");
console.log("  setPlatform(Platform.horizon);");
console.log('');
console.log('Old Web code:');
console.log("  import { View, Text } from '../ui';");
console.log('');
console.log('New unified code:');
console.log("  import { Platform, setPlatform, View, Text } from 'bloombeasts/ui';");
console.log("  setPlatform(Platform.web);");

console.log('\n✨ The unified UI system is ready to use!');