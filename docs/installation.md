# Installation

## Server-side (Node.js)

### Basic Setup

```javascript
import Divhunt from './lib/framework/load.js';

const divhunt = new Divhunt();
```

### With Process Handlers

The framework automatically sets up process handlers for graceful shutdown:

```javascript
import divhunt from './lib/framework/load.js';

// SIGINT and SIGTERM handlers are automatically registered
// They will call divhunt.Middleware('sigint') and divhunt.Middleware('sigterm')
```

## Browser

### Direct Include

```html
<script src="lib/framework/browser.js"></script>
<script>
    // window.divhunt is automatically available
    console.log(window.divhunt);
</script>
```

### With Events

```html
<script src="lib/framework/browser.js"></script>
<script src="lib/framework/events.js"></script>
<script>
    // Automatic event listeners for:
    // - document ready/load
    // - window resize/scroll
    // - visibility changes
    // - orientation changes
    // - online/offline status
</script>
```

## Environment Setup

### Node.js Project

```json
{
    "type": "module",
    "imports": {
        "#framework/*": "./lib/framework/*"
    }
}
```

### Usage with Imports

```javascript
import divhunt from '#framework/load.js';

// Or specific parts
import Divhunt from '#framework/src/divhunt.js';
```

## Configuration

### Logger Levels

```javascript
divhunt.LogLevel('debug'); // error, warn, info, http, verbose, debug, silly
```

### Custom Overrides

```javascript
// Override console.log with timestamps
divhunt.OverrideLog();
```

## Verification

```javascript
// Check if framework is loaded
console.log(divhunt.GenerateUID()); // Should generate a random ID

// Test addon creation
const test = divhunt.Addon('test');
console.log('Framework loaded successfully');
```