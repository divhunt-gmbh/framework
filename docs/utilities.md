# Utilities

The framework provides a comprehensive set of utility functions for common operations.

## Generation Utilities

### Unique Identifiers

```javascript
// Generate random UID (9 characters)
const uid = divhunt.GenerateUID();
// Output: "a3k8n9m2x"

// Generate hash from string
const hash = divhunt.GenerateHash('my-string');
// Output: "a1b2c3d4"

// Generate random string
const randomStr = divhunt.GenerateString(10);
// Output: "aBc3DeF7Gh"

// Generate with custom charset
const customStr = divhunt.GenerateString(8, '0123456789');
// Output: "47829156"

// Generate timestamp-based ID
const tid = divhunt.GenerateTID();
// Output: 1703123456789123456
```

### Command Parsing

```javascript
// Parse command with options
const command = divhunt.GenerateCommand('create user --admin --name=john');
// Output: { 
//   name: 'create', 
//   options: [
//     { name: 'admin', value: null },
//     { name: 'name', value: 'john' }
//   ]
// }

// Simple command
const simple = divhunt.GenerateCommand('help');
// Output: { name: 'help', options: [] }
```

## String Utilities

### Safety and Sanitization

```javascript
// Sanitize HTML
const safe = divhunt.StringSanitize('<script>alert("xss")</script>');
// Output: "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"

// Sanitize objects
const safeObj = divhunt.StringSanitize({ message: '<b>Hello</b>' });
// Output: "{\"message\":\"&lt;b&gt;Hello&lt;/b&gt;\"}"
```

### Template Processing

```javascript
// Compile templates
const template = 'Hello {{user.name}}, you have {{user.messages}} messages';
const data = {
    user: {
        name: 'John',
        messages: 5
    }
};

const result = divhunt.StringCompileTemplate(template, data);
// Output: "Hello John, you have 5 messages"

// Check if template has key
const hasKey = divhunt.StringHasTemplateKey(template, 'user.name');
// Output: true
```

### String Manipulation

```javascript
// Truncate string
const truncated = divhunt.StringTruncate('This is a very long string', 10);
// Output: "This is..."

const customTruncated = divhunt.StringTruncate('Long text', 8, '…');
// Output: "Long te…"

// Capitalize
const capitalized = divhunt.StringCapitalize('hello world');
// Output: "Hello world"

// Convert to camelCase
const camelCase = divhunt.StringToCamelCase('hello-world test_case');
// Output: "helloWorldTestCase"

// Create slug
const slug = divhunt.StringSlugify('Hello World! This is a Test');
// Output: "hello-world-this-is-a-test"

// Strip HTML
const plain = divhunt.StringStripHtml('<p>Hello <strong>world</strong>!</p>');
// Output: "Hello world!"
```

### Unit Extraction

```javascript
// Extract value and unit
const size = divhunt.StringExtractUnit('100px');
// Output: { value: 100, unit: 'px' }

const percentage = divhunt.StringExtractUnit('50%');
// Output: { value: 50, unit: '%' }

const noUnit = divhunt.StringExtractUnit('42', 'em');
// Output: { value: 42, unit: 'em' }
```

### Number Formatting

```javascript
// Format numbers
const formatted = divhunt.StringFormatNumber(1234567.89);
// Output: "1,234,567.89"

const custom = divhunt.StringFormatNumber(1234567.89, 1, '.', ' ');
// Output: "1 234 567.9"
```

## Helper Utilities

### Function Utilities

```javascript
// Debounce function calls
const debouncedFn = divhunt.HelperDebounce(() => {
    console.log('Called after delay');
}, 300);

// Throttle function calls
const throttledFn = divhunt.HelperThrottle(() => {
    console.log('Called at most once per interval');
}, 1000);

// Memoize expensive operations
const memoizedFn = divhunt.HelperMemoize((x, y) => {
    console.log('Computing...');
    return x + y;
});

// Function composition
const add = x => x + 1;
const multiply = x => x * 2;
const composed = divhunt.HelperCompose(multiply, add);
// composed(5) = 12 (add first, then multiply)

const piped = divhunt.HelperPipe(add, multiply);
// piped(5) = 12 (add first, then multiply)
```

### Async Utilities

```javascript
// Sleep/delay
await divhunt.HelperSleep(1000); // Wait 1 second

// Retry with backoff
const result = await divhunt.HelperRetry(async () => {
    // Some operation that might fail
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Failed');
    return response.json();
}, 3, 1000); // Retry 3 times with 1s delay
```

### Object Utilities

```javascript
const obj = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
    phone: '123-456-7890'
};

// Pick specific properties
const picked = divhunt.HelperPick(obj, ['name', 'email']);
// Output: { name: 'John', email: 'john@example.com' }

// Omit specific properties
const omitted = divhunt.HelperOmit(obj, ['phone', 'age']);
// Output: { name: 'John', email: 'john@example.com' }

// Deep clone
const cloned = divhunt.HelperDeepClone(obj);

// Deep merge
const merged = divhunt.HelperDeepMerge(
    { user: { name: 'John' } },
    { user: { age: 30 }, settings: { theme: 'dark' } }
);
// Output: { user: { name: 'John', age: 30 }, settings: { theme: 'dark' } }

// Check if empty
divhunt.HelperIsEmpty('');        // true
divhunt.HelperIsEmpty([]);        // true
divhunt.HelperIsEmpty({});        // true
divhunt.HelperIsEmpty(null);      // true
divhunt.HelperIsEmpty('hello');   // false
```

### Array Utilities

```javascript
const users = [
    { name: 'John', age: 30, role: 'admin' },
    { name: 'Jane', age: 25, role: 'user' },
    { name: 'Bob', age: 35, role: 'admin' }
];

// Group by property
const grouped = divhunt.HelperGroupBy(users, 'role');
// Output: {
//   admin: [{ name: 'John', ... }, { name: 'Bob', ... }],
//   user: [{ name: 'Jane', ... }]
// }

// Group with function
const ageGroups = divhunt.HelperGroupBy(users, user => 
    user.age >= 30 ? 'senior' : 'junior'
);

// Chunk array
const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
const chunks = divhunt.HelperChunk(numbers, 3);
// Output: [[1, 2, 3], [4, 5, 6], [7, 8]]

// Flatten array
const nested = [[1, 2], [3, [4, 5]], 6];
const flattened = divhunt.HelperFlatten(nested, 2);
// Output: [1, 2, 3, 4, 5, 6]

// Get unique values
const duplicates = [1, 2, 2, 3, 3, 3];
const unique = divhunt.HelperUnique(duplicates);
// Output: [1, 2, 3]

// Unique by property
const uniqueUsers = divhunt.HelperUnique(users, 'role');
// Output: [{ name: 'John', role: 'admin' }, { name: 'Jane', role: 'user' }]
```

### Regular Expressions

```javascript
// Create regex from string
const regex1 = divhunt.HelperRegex('hello');
// Output: /hello/

const regex2 = divhunt.HelperRegex('/hello/gi');
// Output: /hello/gi

const regex3 = divhunt.HelperRegex('hello', 'i');
// Output: /hello/i

// Invalid regex returns null
const invalid = divhunt.HelperRegex('[invalid');
// Output: null
```

## Validation Utilities

### Email Validation

```javascript
// Validate email addresses
divhunt.ValidateEmail('user@example.com');     // true
divhunt.ValidateEmail('invalid.email');        // false
divhunt.ValidateEmail('user@domain');          // false
divhunt.ValidateEmail('user..name@domain.com'); // false
```

### Password Validation

```javascript
// Basic password validation
const result = divhunt.ValidatePassword('MyPassword123!');
// Output: { valid: true, errors: [] }

// Custom validation options
const customResult = divhunt.ValidatePassword('weak', {
    minLength: 8,
    maxLength: 50,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
    specialChars: '!@#$%^&*'
});
// Output: { 
//   valid: false, 
//   errors: [
//     'Password must be at least 8 characters long',
//     'Password must contain at least one uppercase letter',
//     'Password must contain at least one number',
//     'Password must contain at least one special character'
//   ]
// }

// Disable requirements
const lenientResult = divhunt.ValidatePassword('simple', {
    requireUppercase: false,
    requireNumbers: false,
    requireSpecial: false
});
```

## Function Evaluation

### Safe Expression Evaluation

```javascript
// Evaluate safe expressions
const result1 = divhunt.Function('x + y', { x: 5, y: 3 });
// Output: 8

const result2 = divhunt.Function('user.name.toUpperCase()', {
    user: { name: 'john' }
});
// Output: "JOHN"

// Conditional expressions
const result3 = divhunt.Function('age >= 18 ? "adult" : "minor"', { age: 25 });
// Output: "adult"

// Math operations
const result4 = divhunt.Function('Math.max(a, b, c)', { a: 1, b: 5, c: 3 });
// Output: 5
```

### Expression Validation

```javascript
// Check if expression is safe
divhunt.FunctionExpressionValid('x + y');           // true
divhunt.FunctionExpressionValid('eval("code")');    // false
divhunt.FunctionExpressionValid('alert("test")');   // false
divhunt.FunctionExpressionValid('x; y');           // false (semicolon not allowed)
```

## Logging System

### Basic Logging

```javascript
// Set log level
divhunt.LogLevel('debug');

// Log messages
divhunt.LogError('Something went wrong', { userId: 123 });
divhunt.LogWarn('This is a warning');
divhunt.LogInfo('Information message');
divhunt.LogDebug('Debug information');

// Log with error object
try {
    throw new Error('Test error');
} catch (error) {
    divhunt.LogError('Operation failed', { operation: 'test' }, error);
}
```

### Custom Log Handling

```javascript
// Listen to log events
divhunt.EmitOn('log', (meta) => {
    if (meta.allowed) {
        // Send to external logging service
        sendToLogService({
            level: meta.level,
            message: meta.message,
            timestamp: meta.timestamp,
            metadata: meta
        });
    }
});
```

## Practical Examples

### Data Processing Pipeline

```javascript
class DataProcessor {
    constructor() {
        this.pipeline = [];
    }
    
    addStep(fn) {
        this.pipeline.push(fn);
        return this;
    }
    
    async process(data) {
        return divhunt.HelperPipe(...this.pipeline)(data);
    }
}

// Usage
const processor = new DataProcessor()
    .addStep(data => data.map(item => ({ ...item, processed: true })))
    .addStep(data => divhunt.HelperGroupBy(data, 'category'))
    .addStep(data => divhunt.HelperDeepClone(data));

const result = await processor.process(inputData);
```

### Template Engine

```javascript
class SimpleTemplate {
    constructor(template) {
        this.template = template;
        this.filters = new Map();
    }
    
    addFilter(name, fn) {
        this.filters.set(name, fn);
        return this;
    }
    
    render(data) {
        let result = this.template;
        
        // Apply filters
        this.filters.forEach((filter, name) => {
            const regex = new RegExp(`{{(.*?)\\|${name}}}`, 'g');
            result = result.replace(regex, (match, expression) => {
                const value = divhunt.Function(expression.trim(), data);
                return filter(value);
            });
        });
        
        // Apply regular template compilation
        return divhunt.StringCompileTemplate(result, data);
    }
}

// Usage
const template = new SimpleTemplate('Hello {{user.name|uppercase}}, {{user.email|truncate}}')
    .addFilter('uppercase', str => str.toUpperCase())
    .addFilter('truncate', str => divhunt.StringTruncate(str, 20));

const output = template.render({
    user: {
        name: 'john doe',
        email: 'very.long.email.address@example.com'
    }
});
```

### Form Validator

```javascript
class FormValidator {
    constructor() {
        this.rules = new Map();
    }
    
    addRule(field, validator) {
        this.rules.set(field, validator);
        return this;
    }
    
    validate(data) {
        const errors = {};
        
        this.rules.forEach((validator, field) => {
            const value = data[field];
            const result = validator(value);
            
            if (result !== true) {
                errors[field] = Array.isArray(result) ? result : [result];
            }
        });
        
        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    }
}

// Usage
const validator = new FormValidator()
    .addRule('email', (value) => {
        if (!value) return 'Email is required';
        if (!divhunt.ValidateEmail(value)) return 'Invalid email format';
        return true;
    })
    .addRule('password', (value) => {
        const result = divhunt.ValidatePassword(value);
        return result.valid ? true : result.errors;
    });

const result = validator.validate({
    email: 'invalid-email',
    password: 'weak'
});
```