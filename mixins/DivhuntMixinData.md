# DivhuntMixinData

The `DivhuntMixinData` module is a core part of the Divhunt framework that provides robust data definition and validation functionality. It helps ensure that data structures conform to expected types and formats, with fallback to default values when necessary.

## Key Features

- Type validation for data properties
- Default value handling
- Support for nested objects
- Primitive value fallbacks

## Core Methods

### DataDefine

Defines a data structure with type validation and default values for multiple properties at once.

```javascript
DataDefine(data, config)
```

- `data`: The object to define properties on
- `config`: Configuration object defining property types and default values

### DataDefineOne

Defines a single data property with type validation and a default value.

```javascript
DataDefineOne(value, config)
```

- `value`: The current value to validate
- `config`: Type definition or default value

### DataTypeMatch

Checks if a value matches the specified type string.

```javascript
DataTypeMatch(value, typeString)
```

- `value`: The value to check
- `typeString`: String representation of expected types (e.g., 'string|number')

### DataPrimitiveValue

Ensures a value matches the expected primitive type, returning a default if not.

```javascript
DataPrimitiveValue(value, primitiveValue)
```

- `value`: The value to check
- `primitiveValue`: The default value to return if types don't match

## Usage Examples

### Basic Usage

```javascript
import Divhunt from 'divhunt';

const app = new Divhunt();

// Create a data object with validation
const userData = {};

app.DataDefine(userData, {
  name: ['string', ''],
  age: ['number', 0],
  isActive: ['boolean', false]
});

console.log(userData);
// Output: { name: '', age: 0, isActive: false }

// Later update with valid and invalid data
userData.name = 'John Doe';  // Valid string
userData.age = '30';         // Invalid type for age

// Re-validate the object
app.DataDefine(userData, {
  name: ['string', ''],
  age: ['number', 0],
  isActive: ['boolean', false]
});

console.log(userData);
// Output: { name: 'John Doe', age: 0, isActive: false }
// Note: age is reset to default because '30' is not a number
```

### Complex Object Structures

```javascript
const userProfile = {};

app.DataDefine(userProfile, {
  personal: () => ({
    firstName: ['string', ''],
    lastName: ['string', ''],
    contact: () => ({
      email: ['string', ''],
      phone: ['string', '']
    })
  }),
  preferences: () => ({
    theme: ['string', 'light'],
    notifications: ['boolean', true]
  })
});

console.log(userProfile);
/* Output:
{
  personal: {
    firstName: '',
    lastName: '',
    contact: {
      email: '',
      phone: ''
    }
  },
  preferences: {
    theme: 'light',
    notifications: true
  }
}
*/
```

### Using with Addons

```javascript
// Create a new addon
const userAddon = app.AddonAdd('users');

// Define fields for the addon
userAddon.FieldAdd('name', ['string', '']);
userAddon.FieldAdd('email', ['string', '']);
userAddon.FieldAdd('settings', () => ({
  darkMode: ['boolean', false],
  fontSize: ['number', 14]
}));

// Add an item with some data
const user = userAddon.ItemAdd({
  name: 'Alice',
  email: 'alice@example.com',
  settings: {
    darkMode: true
  }
});

console.log(user);
/* Output:
{
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  settings: {
    darkMode: true,
    fontSize: 14  // Default value used
  }
}
*/
```

### Handling Multiple Types

```javascript
const config = {
  value: ['string|number', 0]  // Accept either string or number
};

const data1 = { value: 42 };
const data2 = { value: 'text' };
const data3 = { value: true };

app.DataDefine(data1, config);  // { value: 42 } - Valid number
app.DataDefine(data2, config);  // { value: 'text' } - Valid string
app.DataDefine(data3, config);  // { value: 0 } - Invalid, reset to default
```

## Best Practices

1. Use `DataDefine` for complex objects with multiple properties
2. Define types with strings like 'string', 'number', 'boolean', 'array', 'object'
3. For optional types, use the pipe syntax: 'string|number'
4. Always provide sensible default values that match the expected type
5. Use function notation for nested objects to ensure proper initialization
6. Reapply validation when receiving external data to ensure integrity
