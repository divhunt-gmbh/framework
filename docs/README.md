# Divhunt Framework Documentation

## Overview

The Divhunt Framework is a lightweight, extensible JavaScript framework built around an addon system with powerful data validation, event handling, and DOM manipulation capabilities.

## Documentation Structure

### 📋 [README.md](../README.md)
Main framework introduction, core concepts, and quick start guide.

### 🚀 [Installation](./installation.md)
- Server-side setup (Node.js)
- Browser integration
- Environment configuration
- Verification steps

### 🔧 [Addon System](./addons.md)
- Creating addons and fields
- Data validation and typing
- Item management
- Custom functions
- Events and mapping
- Complete examples

### ✅ [Data Validation](./data-validation.md)
- Schema definition and validation
- Primitive and complex types
- Nested objects and arrays
- Schema system and inheritance
- Error handling
- Practical validation examples

### 📡 [Events & Middleware](./events-middleware.md)
- Event system (emit, listen, remove)
- Built-in events (addon, DOM, browser)
- Middleware chains and interception
- Error handling in middleware
- Practical middleware examples

### 🌐 [DOM Manipulation](./dom.md)
- Element creation and patching
- State preservation (forms, scroll)
- Keyed children for efficient updates
- DOM utilities and observation
- Real-world DOM management examples

### 🛠️ [Utilities](./utilities.md)
- Generation utilities (IDs, hashes, strings)
- String manipulation and templates
- Helper functions (debounce, throttle, compose)
- Object and array utilities
- Validation utilities
- Function evaluation
- Logging system

### 📖 [API Reference](./api-reference.md)
- Complete method reference
- Class documentation
- Event constants
- Type definitions
- Configuration options

## Quick Navigation

### Core Concepts
```javascript
// Create addon
const users = divhunt.Addon('users', (addon) => {
    addon.Field('name', ['string', '', true]);
    addon.Field('email', ['string']);
});

// Add item
const user = users.Item({
    name: 'John Doe',
    email: 'john@example.com'
});

// Listen to events
divhunt.EmitOn('addon.item.add', (addon, item) => {
    console.log('Item added');
});
```

### Data Validation
```javascript
// Define schema
const schema = {
    user: {
        type: 'object',
        config: {
            name: ['string', '', true],
            age: ['number', 0]
        }
    }
};

// Validate data
const validated = divhunt.DataDefine(data, schema);
```

### DOM Manipulation
```javascript
// Create and patch elements
const element = divhunt.DOMCreate('<div>Hello</div>');
divhunt.DOMPatch(current, target);

// Preserve state
const state = divhunt.DOMPreserveState(element);
divhunt.DOMRestoreState(element, state);
```

### Utilities
```javascript
// String utilities
const sanitized = divhunt.StringSanitize('<script>alert("xss")</script>');
const template = divhunt.StringCompileTemplate('Hello {{name}}', { name: 'John' });

// Helper functions
const debounced = divhunt.HelperDebounce(fn, 300);
const unique = divhunt.HelperUnique(array, 'id');
```

## Getting Started

1. **Installation**: Start with [Installation](./installation.md) to set up the framework
2. **Core Concepts**: Read [Addon System](./addons.md) to understand the foundation
3. **Data Handling**: Learn [Data Validation](./data-validation.md) for robust data management
4. **Interactivity**: Explore [Events & Middleware](./events-middleware.md) for communication
5. **DOM Work**: Study [DOM Manipulation](./dom.md) for UI management
6. **Reference**: Use [API Reference](./api-reference.md) for complete method documentation

## Examples Repository

Each documentation file includes practical examples that demonstrate real-world usage patterns. The examples progress from basic concepts to complex implementations.

## Framework Philosophy

- **Addon-Centric**: Everything is built around the addon system
- **Type Safety**: Built-in validation ensures data integrity
- **Event-Driven**: Loose coupling through events and middleware
- **DOM Efficient**: Smart patching and state preservation
- **Utility Rich**: Comprehensive helpers for common tasks
- **Extensible**: Framework designed for customization and extension

## License

Licensed under the Divhunt Framework License. See LICENSE.txt for terms.