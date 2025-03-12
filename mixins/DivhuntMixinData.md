# DivhuntMixinData

The `DivhuntMixinData` module provides data validation and default value handling for the Divhunt framework. It helps ensure data structures conform to expected types with fallback values when needed.

## Core Methods

### DataDefine

```javascript
DataDefine(data, config)
```

Validates and sets default values for multiple properties within an object.

### DataDefineOne

```javascript
DataDefineOne(value, config)
```

Validates a single value against a type definition or default.

## Usage Examples

### Basic Usage

```javascript
import Divhunt from 'divhunt';

const app = new Divhunt();
const userData = {};

// Define with type validation and defaults
app.DataDefine(userData, {
  name: ['string', ''],
  age: ['number', 0],
  isActive: ['boolean', false]
});

// Result: { name: '', age: 0, isActive: false }
```

### Direct Value Defaults

```javascript
// Using direct values (no type validation)
app.DataDefine(userData, {
  username: 'guest',
  role: 'user',
  loginCount: 0
});

// Result: { username: 'guest', role: 'user', loginCount: 0 }
```

### Nested Objects

```javascript
app.DataDefine(profile, {
  // Using function for nested objects
  personal: () => ({
    firstName: ['string', ''],
    contact: () => ({
      email: ['string', '']
    })
  }),
  // Direct object
  preferences: {
    theme: 'light'
  }
});

/* Result:
{
  personal: {
    firstName: '',
    contact: {
      email: ''
    }
  },
  preferences: {
    theme: 'light'
  }
}
*/
```

### Type Validation

```javascript
const data = { value: true };

// Accept string OR number (pipe syntax)
app.DataDefine(data, {
  value: ['string|number', 0]
});

// Result: { value: 0 } (boolean is invalid, falls back to default)
```

### Mixed Approach

```javascript
app.DataDefine(product, {
  // Type validation with defaults
  name: ['string', 'Unnamed'],
  price: ['number', 0],
  // Direct values
  category: 'General',
  isAvailable: true
});
```

## Key Features

- **Type Validation**: Validates against types: 'string', 'number', 'boolean', 'array', 'object'
- **Multiple Types**: Allows 'string|number' pipe syntax for accepting multiple types
- **Default Values**: Falls back to default values when types don't match
- **Direct Defaults**: Use direct values when simple defaults are needed without validation
- **Nested Structures**: Support for complex nested object structures
