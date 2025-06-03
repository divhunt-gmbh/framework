# API Reference

Complete reference for the Divhunt Framework API.

## Core Classes

### Divhunt

Main framework class with all functionality mixed in.

```javascript
const divhunt = new Divhunt();
```

### DivhuntAddon

Addon class for creating structured data containers.

```javascript
const addon = divhunt.Addon('name', callback);
```

### DivhuntAddonItem

Individual item within an addon.

```javascript
const item = addon.Item(data);
```

## Addon Management

### Addon Creation

```javascript
divhunt.Addon(name, callback?)
divhunt.AddonAdd(name, callback?, triggerCallbacks?)
divhunt.AddonGet(name, callback?)
divhunt.Addons()
divhunt.AddonRemove(name, triggerCallbacks?)
divhunt.AddonsRemove(triggerCallbacks?)
divhunt.AddonOn(event, callback)
divhunt.AddonReady(name, callback, instant?)
```

### Addon Methods

```javascript
addon.GetName()
addon.Field(name, define?, get?, set?, map?, triggerCallbacks?)
addon.Fields()
addon.FieldAdd(name, define?, get?, set?, map?, triggerCallbacks?)
addon.FieldGet(name)
addon.FieldRemove(name, triggerCallbacks?)
addon.FieldOn(event, callback)

addon.Item(data, map?, callback?, triggerCallbacks?)
addon.Items()
addon.ItemAdd(data, callback?, triggerCallbacks?)
addon.ItemGet(id, map?, callback?)
addon.ItemRemove(id, triggerCallbacks?)
addon.ItemsRemove(triggerCallbacks?)
addon.ItemOn(event, callback)

addon.Fn(name, ...args)
addon.FnAdd(name, callback)
addon.FnGet(name)
addon.FnRun(name, ...args)
addon.FnRemove(name)
addon.FnOn(event, callback)

addon.Remove(triggerCallbacks?)
addon.Clone()
```

### Item Methods

```javascript
item.Get(key, triggerCallbacks?)
item.GetData(triggerCallbacks?)
item.Set(key, value, triggerCallbacks?)
item.SetData(data, triggerCallbacks?)
item.Remove(triggerCallbacks?)
item.Fn(name, ...args)

item.StoreGet(key?)
item.StoreSet(key, value)
item.StoreHas(key)
item.StoreRemove(key)
item.StoreClear()
```

## Data Validation

### Schema Definition

```javascript
divhunt.DataSchema(name, config?)
divhunt.DataConfig(config)
divhunt.DataParseConfig(config)
```

### Data Validation

```javascript
divhunt.DataDefine(data, config, depth?)
divhunt.DataDefineOne(value, config, depth?)
divhunt.DataTypeMatch(value, type)
divhunt.DataPrimitiveValue(value, defaultValue?)
```

### Validation Helpers

```javascript
divhunt.DataValidateObject(object, name?)
divhunt.DataValidateString(string, name?)
```

## Event System

### Event Management

```javascript
divhunt.Emit(name, ...args)
divhunt.EmitOn(name, callback)
divhunt.EmitOnce(name, callback)
divhunt.EmitOff(name, id)
```

## Middleware System

### Middleware Management

```javascript
divhunt.Middleware(name, value)
divhunt.MiddlewareIntercept(name, callback)
```

## DOM Manipulation

### Element Creation

```javascript
divhunt.DOMCreate(html, callbacks?)
```

### DOM Patching

```javascript
divhunt.DOMPatch(current, target, callbacks?)
divhunt.DOMPatchAttributes(current, target, callbacks?)
divhunt.DOMPatchChildren(current, target, callbacks?)
divhunt.DOMPatchKeyedChildren(current, target, currentKeyed, targetKeyed, callbacks?)
```

### State Preservation

```javascript
divhunt.DOMPreserveState(element, callbacks?)
divhunt.DOMRestoreState(element, state, callbacks?)
```

### DOM Utilities

```javascript
divhunt.DOMFind(element, selector, callbacks?)
divhunt.DOMWalk(element, callback, depth?)
divhunt.DOMObserve(element, options?, callbacks?)
divhunt.DOMGetKeyedChildren(element)
divhunt.DOMGetElementPath(element, root)
divhunt.DOMGetElementByPath(path, root)
```

## Generation Utilities

```javascript
divhunt.GenerateHash(name)
divhunt.GenerateUID()
divhunt.GenerateString(length?, charset?)
divhunt.GenerateTID()
divhunt.GenerateCommand(string)
```

## String Utilities

### Safety

```javascript
divhunt.StringSanitize(input)
```

### Templates

```javascript
divhunt.StringHasTemplateKey(template, key)
divhunt.StringCompileTemplate(template, data)
```

### Manipulation

```javascript
divhunt.StringExtractUnit(string, unit?)
divhunt.StringTruncate(string, length?, append?)
divhunt.StringCapitalize(string)
divhunt.StringToCamelCase(string)
divhunt.StringStripHtml(html)
divhunt.StringSlugify(string)
divhunt.StringFormatNumber(number, decimals?, decPoint?, thousandsSep?)
```

## Helper Utilities

### Function Helpers

```javascript
divhunt.HelperDebounce(callback, delay?)
divhunt.HelperThrottle(callback, delay?)
divhunt.HelperMemoize(fn)
divhunt.HelperPipe(...fns)
divhunt.HelperCompose(...fns)
```

### Async Helpers

```javascript
divhunt.HelperSleep(ms)
divhunt.HelperRetry(fn, retries?, delay?)
```

### Object Helpers

```javascript
divhunt.HelperPick(obj, keys)
divhunt.HelperOmit(obj, keys)
divhunt.HelperDeepClone(obj)
divhunt.HelperDeepMerge(target, ...sources)
divhunt.HelperIsObject(item)
divhunt.HelperIsEmpty(value)
```

### Array Helpers

```javascript
divhunt.HelperGroupBy(array, key)
divhunt.HelperChunk(array, size)
divhunt.HelperFlatten(array, depth?)
divhunt.HelperUnique(array, key?)
```

### Regex Helper

```javascript
divhunt.HelperRegex(pattern, defaultFlags?)
```

## Validation Utilities

```javascript
divhunt.ValidateEmail(email)
divhunt.ValidatePassword(password, options?)
```

## Function Evaluation

```javascript
divhunt.Function(expression, data?)
divhunt.FunctionExpressionValid(expression)
```

## Logging System

### Logger Configuration

```javascript
divhunt.LogLevel(level)
```

### Logging Methods

```javascript
divhunt.Log(level, message, meta?)
divhunt.LogError(message, meta?, error?, slice?, throwError?)
divhunt.LogWarn(message, meta?)
divhunt.LogInfo(message, meta?)
divhunt.LogVerbose(message, meta?)
divhunt.LogDebug(message, meta?)
divhunt.LogSilly(message, meta?)
```

## Dependencies

### Dependency Management

```javascript
divhunt.Dependency(name, value?)
divhunt.Dependencies()
divhunt.DependencyGet(name, object?)
divhunt.DependencyAdd(name, value, triggerCallbacks?)
divhunt.DependencyHas(name)
divhunt.DependencyRemove(name, triggerCallbacks?)
divhunt.DependencyOn(event, callback)
```

## Request System

```javascript
divhunt.Request(name, value)
divhunt.RequestCatch(name, callback)
```

## Overrides

```javascript
divhunt.OverrideLog()
```

## Event Constants

### Built-in Events

#### Addon Events
- `addon.add` - Addon created
- `addon.remove` - Addon removed
- `addon.item.add` - Item added to addon
- `addon.item.remove` - Item removed from addon
- `addon.item.get` - Item value retrieved
- `addon.item.set` - Item value changed
- `addon.field.add` - Field added to addon
- `addon.field.remove` - Field removed from addon
- `addon.function.add` - Function added to addon
- `addon.function.remove` - Function removed from addon
- `addon.function.before` - Before function execution
- `addon.function.after` - After function execution

#### DOM Events (Browser)
- `document.ready` - DOM ready
- `document.load` - Page loaded
- `document.visibility` - Visibility changed
- `window.resize` - Window resized
- `window.scroll` - Window scrolled
- `window.beforeunload` - Before page unload
- `window.focus` - Window focused
- `window.blur` - Window blurred
- `window.orientation` - Orientation changed
- `navigator.online` - Network online
- `navigator.offline` - Network offline

#### Log Events
- `log` - Log message emitted

#### Dependency Events
- `dependency.add` - Dependency added
- `dependency.remove` - Dependency removed

### Middleware Points

#### Process Handlers
- `sigint` - SIGINT signal received
- `sigterm` - SIGTERM signal received

## Type Definitions

### Field Definition Format

```javascript
// Array format: [type, defaultValue?, required?, getter?, setter?]
['string', 'default', true]

// Object format
{
    type: 'string',
    value: 'default',
    required: true,
    config: {}, // For object/array validation
    each: {}    // For array item validation
}
```

### Data Types

- `string` - String values
- `number` - Numeric values
- `boolean` - Boolean values
- `object` - Object values
- `array` - Array values
- `function` - Function values
- `string|number` - Union types (pipe-separated)

### Log Levels

- `error` (0) - Error messages
- `warn` (1) - Warning messages
- `info` (2) - Information messages
- `http` (3) - HTTP-related messages
- `verbose` (4) - Verbose output
- `debug` (5) - Debug information
- `silly` (6) - Very detailed output

### Password Validation Options

```javascript
{
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
    specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}
```