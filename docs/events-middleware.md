# Events & Middleware

The framework provides a powerful event system and middleware chain for decoupled communication and operation interception.

## Event System

### Basic Events

```javascript
// Listen to events
const listenerId = divhunt.EmitOn('user.created', (user) => {
    console.log('User created:', user.name);
});

// Emit events
divhunt.Emit('user.created', { name: 'John Doe', email: 'john@example.com' });

// Remove listener
divhunt.EmitOff('user.created', listenerId);
```

### One-time Events

```javascript
// Listen once and automatically remove
divhunt.EmitOnce('app.initialized', () => {
    console.log('App is ready!');
});

divhunt.Emit('app.initialized');
```

### Built-in Events

The framework emits various built-in events:

```javascript
// Addon events
divhunt.EmitOn('addon.add', (addon) => {
    console.log('Addon created:', addon.GetName());
});

divhunt.EmitOn('addon.remove', (addon) => {
    console.log('Addon removed:', addon.GetName());
});

// Item events
divhunt.EmitOn('addon.item.add', (addon, item) => {
    console.log('Item added to', addon.GetName());
});

divhunt.EmitOn('addon.item.remove', (addon, item) => {
    console.log('Item removed from', addon.GetName());
});

// Field events
divhunt.EmitOn('addon.field.add', (addon, field) => {
    console.log('Field added:', field.name);
});

// Function events
divhunt.EmitOn('addon.function.add', (addon, func) => {
    console.log('Function added:', func.name);
});
```

### Browser Events (when using events.js)

```javascript
// Document events
divhunt.EmitOn('document.ready', () => {
    console.log('DOM ready');
});

divhunt.EmitOn('document.load', () => {
    console.log('Page loaded');
});

// Window events
divhunt.EmitOn('window.resize', (dimensions) => {
    console.log('Window resized:', dimensions.width, dimensions.height);
});

divhunt.EmitOn('window.scroll', (position) => {
    console.log('Scrolled to:', position.x, position.y);
});

// Visibility events
divhunt.EmitOn('document.visibility', (state) => {
    console.log('Visibility changed:', state.hidden, state.state);
});

// Network events
divhunt.EmitOn('navigator.online', () => {
    console.log('Back online');
});

divhunt.EmitOn('navigator.offline', () => {
    console.log('Gone offline');
});
```

## Middleware System

### Basic Middleware

```javascript
// Intercept operations
divhunt.MiddlewareIntercept('user.create', async (context) => {
    console.log('Before user creation:', context.value);
    
    // Modify the operation
    context.value.createdAt = new Date().toISOString();
    
    // Continue to next middleware
    await context.next();
    
    console.log('After user creation:', context.value);
});

// Trigger middleware
const result = await divhunt.Middleware('user.create', {
    name: 'John Doe',
    email: 'john@example.com'
});
```

### Middleware Chain

```javascript
// First middleware
divhunt.MiddlewareIntercept('data.process', async (context) => {
    console.log('Middleware 1: Start');
    context.value.step1 = true;
    await context.next();
    console.log('Middleware 1: End');
});

// Second middleware
divhunt.MiddlewareIntercept('data.process', async (context) => {
    console.log('Middleware 2: Start');
    context.value.step2 = true;
    await context.next();
    console.log('Middleware 2: End');
});

// Third middleware
divhunt.MiddlewareIntercept('data.process', async (context) => {
    console.log('Middleware 3: Processing');
    context.value.processed = true;
    await context.next();
});

// Execute chain
const result = await divhunt.Middleware('data.process', { data: 'test' });
```

### Error Handling in Middleware

```javascript
divhunt.MiddlewareIntercept('risky.operation', async (context) => {
    try {
        // Risky operation
        context.value.result = await someRiskyOperation(context.value);
        await context.next();
    } catch (error) {
        context.errors.push(error.message);
        console.error('Middleware error:', error.message);
        // Don't call next() to stop the chain
    }
});
```

### Conditional Middleware

```javascript
divhunt.MiddlewareIntercept('user.update', async (context) => {
    // Only process if user is admin
    if (context.value.user.role === 'admin') {
        context.value.permissions = 'all';
        await context.next();
    } else {
        context.errors.push('Insufficient permissions');
    }
});
```

## Built-in Middleware Points

### Process Handlers

```javascript
// Graceful shutdown
divhunt.MiddlewareIntercept('sigint', async (context) => {
    console.log('Received SIGINT, cleaning up...');
    // Cleanup operations
    await cleanup();
    await context.next();
});

divhunt.MiddlewareIntercept('sigterm', async (context) => {
    console.log('Received SIGTERM, shutting down...');
    // Shutdown operations
    await shutdown();
    await context.next();
});
```

### Logging Middleware

```javascript
divhunt.MiddlewareIntercept('log', async (context) => {
    const meta = context.value;
    
    // Add timestamp
    meta.timestamp = new Date().toISOString();
    
    // Format message
    if (meta.level === 'error') {
        meta.formatted = `❌ ${meta.message}`;
    } else if (meta.level === 'warn') {
        meta.formatted = `⚠️  ${meta.message}`;
    } else {
        meta.formatted = `ℹ️  ${meta.message}`;
    }
    
    await context.next();
});
```

## Practical Examples

### User Management System

```javascript
const users = divhunt.Addon('users', (addon) => {
    addon.Field('name', ['string', '', true]);
    addon.Field('email', ['string', '', true]);
    addon.Field('role', ['string', 'user']);
});

// Event listeners
users.ItemOn('add', (user) => {
    divhunt.Emit('user.created', user.GetData());
});

divhunt.EmitOn('user.created', (userData) => {
    console.log('Sending welcome email to:', userData.email);
});

// Middleware for user creation
divhunt.MiddlewareIntercept('user.create', async (context) => {
    // Validate email
    if (!context.value.email.includes('@')) {
        context.errors.push('Invalid email format');
        return;
    }
    
    // Hash password if provided
    if (context.value.password) {
        context.value.password = await hashPassword(context.value.password);
    }
    
    // Set timestamps
    context.value.createdAt = new Date().toISOString();
    context.value.updatedAt = new Date().toISOString();
    
    await context.next();
});

// Usage
async function createUser(userData) {
    const result = await divhunt.Middleware('user.create', userData);
    
    if (result.errors.length > 0) {
        throw new Error(result.errors.join(', '));
    }
    
    return users.Item(result.value);
}
```

### Application Lifecycle

```javascript
// Startup events
divhunt.EmitOn('app.starting', () => {
    console.log('Application starting...');
});

divhunt.EmitOn('app.ready', () => {
    console.log('Application ready!');
});

// Initialization middleware
divhunt.MiddlewareIntercept('app.init', async (context) => {
    console.log('Loading configuration...');
    context.value.config = await loadConfig();
    await context.next();
});

divhunt.MiddlewareIntercept('app.init', async (context) => {
    console.log('Connecting to database...');
    context.value.db = await connectDatabase(context.value.config.db);
    await context.next();
});

divhunt.MiddlewareIntercept('app.init', async (context) => {
    console.log('Starting servers...');
    context.value.servers = await startServers(context.value.config.servers);
    await context.next();
});

// Bootstrap application
async function bootstrap() {
    divhunt.Emit('app.starting');
    
    const result = await divhunt.Middleware('app.init', {});
    
    if (result.errors.length > 0) {
        console.error('Bootstrap failed:', result.errors);
        process.exit(1);
    }
    
    divhunt.Emit('app.ready');
    return result.value;
}
```

### Data Processing Pipeline

```javascript
// Multi-stage data processing
divhunt.MiddlewareIntercept('data.pipeline', async (context) => {
    console.log('Stage 1: Validation');
    if (!context.value.data) {
        context.errors.push('No data provided');
        return;
    }
    await context.next();
});

divhunt.MiddlewareIntercept('data.pipeline', async (context) => {
    console.log('Stage 2: Transformation');
    context.value.data = await transformData(context.value.data);
    await context.next();
});

divhunt.MiddlewareIntercept('data.pipeline', async (context) => {
    console.log('Stage 3: Enrichment');
    context.value.data = await enrichData(context.value.data);
    await context.next();
});

divhunt.MiddlewareIntercept('data.pipeline', async (context) => {
    console.log('Stage 4: Storage');
    context.value.result = await storeData(context.value.data);
    await context.next();
});
```