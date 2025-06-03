# Data Validation

The framework provides powerful schema-based data validation with support for complex nested structures.

## Basic Types

### Primitive Types

```javascript
// String validation
divhunt.DataDefineOne('hello', { type: 'string' });

// Number validation
divhunt.DataDefineOne(42, { type: 'number' });

// Boolean validation
divhunt.DataDefineOne(true, { type: 'boolean' });

// Object validation
divhunt.DataDefineOne({}, { type: 'object' });

// Array validation
divhunt.DataDefineOne([], { type: 'array' });

// Function validation
divhunt.DataDefineOne(() => {}, { type: 'function' });
```

### Union Types

```javascript
// Accept string or number
divhunt.DataDefineOne('hello', { type: 'string|number' });
divhunt.DataDefineOne(42, { type: 'string|number' });
```

## Advanced Validation

### Required Fields

```javascript
const config = {
    name: { type: 'string', required: true },
    email: { type: 'string', required: true },
    age: { type: 'number' }
};

const data = {
    name: 'John',
    email: 'john@example.com'
};

divhunt.DataDefine(data, config); // Valid
```

### Default Values

```javascript
const config = {
    name: { type: 'string', value: 'Anonymous' },
    status: { type: 'string', value: 'active' },
    count: { type: 'number', value: 0 }
};

const data = { name: 'John' };
const result = divhunt.DataDefine(data, config);
// result = { name: 'John', status: 'active', count: 0 }
```

### Nested Objects

```javascript
const config = {
    user: {
        type: 'object',
        config: {
            name: { type: 'string', required: true },
            email: { type: 'string', required: true },
            profile: {
                type: 'object',
                config: {
                    bio: { type: 'string' },
                    website: { type: 'string' }
                }
            }
        }
    }
};

const data = {
    user: {
        name: 'John Doe',
        email: 'john@example.com',
        profile: {
            bio: 'Software developer',
            website: 'https://johndoe.com'
        }
    }
};

divhunt.DataDefine(data, config);
```

### Array Validation

```javascript
// Simple array
const simpleConfig = {
    tags: { type: 'array' }
};

// Array with item validation
const itemConfig = {
    tags: {
        type: 'array',
        each: { type: 'string' }
    }
};

// Array of objects
const objectConfig = {
    users: {
        type: 'array',
        each: {
            type: 'object',
            config: {
                name: { type: 'string', required: true },
                age: { type: 'number' }
            }
        }
    }
};

const data = {
    users: [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
    ]
};

divhunt.DataDefine(data, objectConfig);
```

## Configuration Formats

### Array Format (Shorthand)

```javascript
// [type, defaultValue, required]
addon.Field('name', ['string', '', true]);
addon.Field('age', ['number', 0]);
addon.Field('active', ['boolean', true, false]);
```

### Object Format (Full)

```javascript
addon.Field('user', {
    type: 'object',
    required: true,
    config: {
        name: ['string', '', true],
        email: ['string', '', true]
    }
});
```

## Schema System

### Creating Schemas

```javascript
divhunt.DataSchema('user', {
    name: ['string', '', true],
    email: ['string', '', true],
    age: ['number', 0],
    profile: {
        type: 'object',
        config: {
            bio: ['string'],
            website: ['string']
        }
    }
});
```

### Using Schemas

```javascript
// Reference schema with @
const config = {
    user: '@user',
    admin: '@user'
};

// Schema with options
const configWithOptions = {
    user: '@user --skip=age',           // Skip age field
    guest: '@user --optional'           // Make all fields optional
};
```

### Schema Inheritance

```javascript
divhunt.DataSchema('baseUser', {
    name: ['string', '', true],
    email: ['string', '', true]
});

divhunt.DataSchema('adminUser', {
    '@baseUser': true,
    role: ['string', 'admin'],
    permissions: ['array']
});
```

## Error Handling

```javascript
try {
    const config = {
        email: { type: 'string', required: true },
        age: { type: 'number', required: true }
    };
    
    const data = { email: 'invalid-email' };
    
    divhunt.DataDefine(data, config);
} catch (error) {
    console.error(error.message);
    // "Error in field 'age': Expected number."
}
```

## Type Checking

```javascript
// Check if value matches type
divhunt.DataTypeMatch('hello', 'string');        // true
divhunt.DataTypeMatch(42, 'number');             // true
divhunt.DataTypeMatch('42', 'string|number');    // true
divhunt.DataTypeMatch([], 'array');              // true
divhunt.DataTypeMatch({}, 'object');             // true
```

## Practical Examples

### User Registration

```javascript
const registrationSchema = {
    username: { type: 'string', required: true },
    email: { type: 'string', required: true },
    password: { type: 'string', required: true },
    profile: {
        type: 'object',
        config: {
            firstName: { type: 'string', required: true },
            lastName: { type: 'string', required: true },
            dateOfBirth: { type: 'string' },
            interests: {
                type: 'array',
                each: { type: 'string' }
            }
        }
    },
    preferences: {
        type: 'object',
        value: {},
        config: {
            newsletter: { type: 'boolean', value: false },
            notifications: { type: 'boolean', value: true }
        }
    }
};

const userData = {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'secretpassword',
    profile: {
        firstName: 'John',
        lastName: 'Doe',
        interests: ['programming', 'music']
    }
};

const validatedUser = divhunt.DataDefine(userData, registrationSchema);
```

### API Response Validation

```javascript
const apiResponseSchema = {
    success: { type: 'boolean', required: true },
    data: {
        type: 'object',
        config: {
            users: {
                type: 'array',
                each: {
                    type: 'object',
                    config: {
                        id: { type: 'number', required: true },
                        name: { type: 'string', required: true },
                        email: { type: 'string', required: true },
                        createdAt: { type: 'string' }
                    }
                }
            },
            pagination: {
                type: 'object',
                config: {
                    page: { type: 'number', value: 1 },
                    limit: { type: 'number', value: 10 },
                    total: { type: 'number', required: true }
                }
            }
        }
    },
    message: { type: 'string', value: 'Success' }
};
```