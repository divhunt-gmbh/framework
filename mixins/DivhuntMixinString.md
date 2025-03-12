# DivhuntMixinString

The `DivhuntMixinString` module provides string manipulation utilities for the Divhunt framework, handling common operations like templating, sanitization, and formatting.

## Core Methods

### StringSanitize
Escapes HTML entities to prevent XSS attacks.
```javascript
StringSanitize('<script>alert("XSS")</script>');
// "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"
```

### StringCompileTemplate
Handles template strings with `{{ }}` syntax using data object values.
```javascript
StringCompileTemplate('Hello {{ name }}!', { name: 'John' });
// "Hello John!"

StringCompileTemplate('User: {{ user.name }}', { user: { name: 'Alice' } });
// "User: Alice"
```

### StringTruncate
Shortens text to a specified length with optional suffix.
```javascript
StringTruncate('This is a very long text', 10);
// "This is a..."
```

### StringCapitalize
Makes the first letter uppercase.
```javascript
StringCapitalize('hello');
// "Hello"
```

### StringToCamelCase
Converts text to camelCase format.
```javascript
StringToCamelCase('hello world');
// "helloWorld"
```

### StringStripHtml
Removes HTML tags from text.
```javascript
StringStripHtml('<p>Hello <strong>world</strong></p>');
// "Hello world"
```

### StringSlugify
Creates URL-friendly slugs.
```javascript
StringSlugify('Hello World!');
// "hello-world"
```

### StringFormatNumber
Formats numbers with thousand separators and decimals.
```javascript
StringFormatNumber(1234.56);
// "1,234.56"

StringFormatNumber(1234.56, 0);
// "1,235"
```

### StringExtractUnit
Parses CSS measurement values.
```javascript
StringExtractUnit('100px');
// { value: 100, unit: "px" }

StringExtractUnit('50%');
// { value: 50, unit: "%" }
```

### StringHasTemplateKey
Checks if a template contains a specific variable.
```javascript
StringHasTemplateKey('Hello {{ name }}', 'name');
// true

StringHasTemplateKey('Hello {{ user.name }}', 'user');
// true
```
