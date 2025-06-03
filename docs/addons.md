# Addon System

The addon system is the core of the Divhunt framework. Addons provide structure, validation, and functionality for your data and components.

## Creating Addons

### Basic Addon

```javascript
const users = divhunt.Addon('users');
```

### Addon with Configuration

```javascript
const users = divhunt.Addon('users', (addon) => {
    addon.Field('name', ['string']);
    addon.Field('email', ['string']);
    addon.Field('age', ['number', 0]);
});
```

## Fields

Fields define the structure and validation for addon items.

### Basic Field Types

```javascript
addon.Field('name', ['string']);           // String field
addon.Field('age', ['number']);            // Number field
addon.Field('active', ['boolean']);        // Boolean field
addon.Field('data', ['object']);           // Object field
addon.Field('tags', ['array']);            // Array field
addon.Field('callback', ['function']);     // Function field
```

### Field with Default Value

```javascript
addon.Field('status', ['string', 'active']);
addon.Field('count', ['number', 0]);
addon.Field('enabled', ['boolean', true]);
```

### Required Fields

```javascript
addon.Field('email', ['string', null, true]); // Required string
```

### Field with Validation

```javascript
addon.Field('email', ['string'], null, (value, prevValue, item) => {
    if (!value.includes('@')) {
        throw new Error('Invalid email format');
    }
    return value.toLowerCase();
});
```

### Complex Field Types

```javascript
// Union types
addon.Field('id', ['string|number']);

// Object with schema
addon.Field('address', ['object'], null, null, false, {
    street: ['string'],
    city: ['string'],
    zipCode: ['string']
});

// Array with item validation
addon.Field('tags', ['array'], null, null, false, {
    each: ['string']
});
```

## Items

Items are instances of data within an addon.

### Creating Items

```javascript
const user = users.Item({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
});
```

### Getting Items

```javascript
const user = users.ItemGet(1); // Get by ID
const allUsers = users.Items(); // Get all items
```

### Item Operations

```javascript
// Get field value
const name = user.Get('name');
const multipleFields = user.Get(['name', 'email']);

// Set field value
user.Set('name', 'Jane Doe');
user.SetData({
    name: 'Jane Doe',
    age: 31
});

// Remove item
user.Remove();
```

## Functions

Add custom functionality to addons.

### Basic Functions

```javascript
users.Fn('findByEmail', function(email) {
    return Object.values(this.Items()).find(user => 
        user.Get('email') === email
    );
});

// Use the function
const user = users.Fn('findByEmail', 'john@example.com');
```

### Function Shortcuts

```javascript
users.Fn('getActive', function() {
    return Object.values(this.Items()).filter(user => 
        user.Get('active')
    );
});

// Alternative syntax
users.Fn('getInactive', () => {
    return Object.values(users.Items()).filter(user => 
        !user.Get('active')
    );
});
```

## Events

Addons emit events for various operations.

### Listening to Events

```javascript
// Listen to item addition
users.ItemOn('add', (item) => {
    console.log('User added:', item.Get('name'));
});

// Listen to field addition
users.FieldOn('add', (field) => {
    console.log('Field added:', field.name);
});

// Global addon events
divhunt.EmitOn('addon.add', (addon) => {
    console.log('Addon created:', addon.GetName());
});
```

## Advanced Features

### Mapping Fields

```javascript
addon.Field('email', ['string'], null, null, true); // Enable mapping

// Access by mapped value
const user = users.ItemGet('john@example.com', 'email');
```

### Field Callbacks

```javascript
addon.Field('slug', ['string'], 
    // Get callback
    (value, item) => {
        return value || item.Get('title').toLowerCase().replace(/\s+/g, '-');
    },
    // Set callback
    (value, prevValue, item) => {
        return value.toLowerCase().replace(/\s+/g, '-');
    }
);
```

### Item Store

Each item has a temporary store for non-persistent data:

```javascript
item.StoreSet('tempData', { loading: true });
const tempData = item.StoreGet('tempData');
item.StoreRemove('tempData');
item.StoreClear();
```

## Complete Example

```javascript
const blog = divhunt.Addon('blog', (addon) => {
    addon.Field('title', ['string', '', true]);
    addon.Field('slug', ['string'], 
        (value, item) => value || item.Get('title').toLowerCase().replace(/\s+/g, '-'),
        (value) => value.toLowerCase().replace(/\s+/g, '-')
    );
    addon.Field('content', ['string', '', true]);
    addon.Field('published', ['boolean', false]);
    addon.Field('author', ['object'], null, null, false, {
        name: ['string'],
        email: ['string']
    });
    addon.Field('tags', ['array'], null, null, false, {
        each: ['string']
    });
    
    // Custom functions
    addon.Fn('getPublished', function() {
        return Object.values(this.Items()).filter(post => 
            post.Get('published')
        );
    });
    
    addon.Fn('getByTag', function(tag) {
        return Object.values(this.Items()).filter(post => 
            post.Get('tags').includes(tag)
        );
    });
});

// Listen to events
blog.ItemOn('add', (post) => {
    console.log('New post:', post.Get('title'));
});

// Create posts
const post = blog.Item({
    title: 'Getting Started with Divhunt',
    content: 'This is a comprehensive guide...',
    author: {
        name: 'Jane Smith',
        email: 'jane@example.com'
    },
    tags: ['tutorial', 'framework']
});

// Use custom functions
const published = blog.Fn('getPublished');
const tutorials = blog.Fn('getByTag', 'tutorial');
```