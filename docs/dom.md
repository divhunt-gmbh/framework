# DOM Manipulation

The framework provides efficient DOM manipulation utilities with state preservation and event handling.

## Creating Elements

### Basic Element Creation

```javascript
// Create element from HTML string
const element = divhunt.DOMCreate('<div class="card">Hello World</div>');

// With callbacks
const element = divhunt.DOMCreate('<div>Content</div>', {
    created: (element) => {
        console.log('Element created:', element);
    }
});
```

### Complex Element Creation

```javascript
const cardHTML = `
    <div class="card">
        <h3 class="card-title">Title</h3>
        <p class="card-content">Content goes here</p>
        <button class="card-action">Action</button>
    </div>
`;

const card = divhunt.DOMCreate(cardHTML, {
    created: (element) => {
        // Add event listeners
        const button = element.querySelector('.card-action');
        button.addEventListener('click', () => {
            console.log('Card action clicked');
        });
    }
});

document.body.appendChild(card);
```

## DOM Patching

### Basic Patching

```javascript
const current = document.getElementById('my-element');
const target = divhunt.DOMCreate('<div id="my-element">New content</div>');

// Patch current element to match target
divhunt.DOMPatch(current, target);
```

### Patching with Callbacks

```javascript
divhunt.DOMPatch(current, target, {
    patched: (element) => {
        console.log('Element patched:', element);
    },
    replace: (oldElement, newElement) => {
        console.log('Element replaced');
    },
    text: (element, oldText, newText) => {
        console.log('Text changed:', oldText, '->', newText);
    },
    attribute: (element, name, value, oldValue) => {
        console.log('Attribute changed:', name, oldValue, '->', value);
    },
    attributeRemove: (element, name, value) => {
        console.log('Attribute removed:', name);
    },
    childAdd: (parent, child, index) => {
        console.log('Child added at index:', index);
    },
    childRemove: (parent, child, index) => {
        console.log('Child removed from index:', index);
    },
    childMove: (parent, child, oldIndex, newIndex) => {
        console.log('Child moved:', oldIndex, '->', newIndex);
    }
});
```

## State Preservation

### Preserving Form State

```javascript
// Before making changes
const state = divhunt.DOMPreserveState(containerElement);

// Make DOM changes...
divhunt.DOMPatch(containerElement, newContent);

// Restore form values, scroll positions, etc.
divhunt.DOMRestoreState(containerElement, state);
```

### Custom State Preservation

```javascript
const state = divhunt.DOMPreserveState(element, {
    preserved: (state) => {
        console.log('State preserved:', state);
    }
});

// State includes:
// - Form input values
// - Scroll positions (elements with data-preserve-scroll)
// - Focus state
// - Selection state

divhunt.DOMRestoreState(element, state, {
    restored: (state) => {
        console.log('State restored:', state);
    }
});
```

### Scroll Position Preservation

```javascript
// Mark elements for scroll preservation
const scrollableHTML = `
    <div class="container" data-preserve-scroll="main">
        <div class="sidebar" data-preserve-scroll="sidebar">
            <!-- Content -->
        </div>
    </div>
`;

const element = divhunt.DOMCreate(scrollableHTML);

// Scroll positions will be preserved/restored automatically
```

## Element Utilities

### Finding Elements

```javascript
// Find elements with callbacks
const results = divhunt.DOMFind(container, '.card', {
    found: (elements) => {
        console.log('Found', elements.length, 'cards');
    }
});
```

### Walking DOM Tree

```javascript
// Walk through all nodes
divhunt.DOMWalk(container, (node, depth) => {
    console.log('Node at depth', depth, ':', node.nodeName);
    
    // Return false to skip this branch
    if (node.classList && node.classList.contains('skip')) {
        return false;
    }
});
```

### Element Path Utilities

```javascript
// Get path from element to root
const path = divhunt.DOMGetElementPath(element, rootElement);

// Get element by path
const foundElement = divhunt.DOMGetElementByPath(path, rootElement);
```

## Keyed Children

### Working with Lists

```javascript
// Elements with dh-key attributes are treated specially
const listHTML = `
    <ul>
        <li dh-key="item-1">Item 1</li>
        <li dh-key="item-2">Item 2</li>
        <li dh-key="item-3">Item 3</li>
    </ul>
`;

const newListHTML = `
    <ul>
        <li dh-key="item-2">Item 2</li>
        <li dh-key="item-4">Item 4</li>
        <li dh-key="item-1">Item 1</li>
    </ul>
`;

const currentList = divhunt.DOMCreate(listHTML);
const newList = divhunt.DOMCreate(newListHTML);

// Efficient patching with key-based matching
divhunt.DOMPatch(currentList, newList, {
    childMove: (parent, child, oldIndex, newIndex, key) => {
        console.log(`Moved ${key} from ${oldIndex} to ${newIndex}`);
    }
});
```

## Mutation Observation

### Basic Observation

```javascript
const observer = divhunt.DOMObserve(element, {
    children: true,
    attributes: true,
    text: true,
    subtree: true
}, {
    mutate: (mutations) => {
        mutations.forEach(mutation => {
            console.log('Mutation:', mutation.type);
        });
    }
});

// Stop observing
observer.disconnect();
```

### Custom Observation Options

```javascript
const observer = divhunt.DOMObserve(element, {
    children: true,          // Watch for child node changes
    attributes: true,        // Watch for attribute changes
    text: true,             // Watch for text content changes
    subtree: true,          // Watch entire subtree
    attributeOldValue: true, // Include old attribute values
    textOldValue: true      // Include old text values
}, {
    mutate: (mutations) => {
        mutations.forEach(mutation => {
            switch (mutation.type) {
                case 'childList':
                    console.log('Children changed');
                    break;
                case 'attributes':
                    console.log('Attribute changed:', mutation.attributeName);
                    break;
                case 'characterData':
                    console.log('Text changed');
                    break;
            }
        });
    }
});
```

## Practical Examples

### Dynamic Content Updates

```javascript
class ContentManager {
    constructor(container) {
        this.container = container;
        this.currentContent = null;
    }
    
    updateContent(newHTML) {
        // Preserve current state
        const state = divhunt.DOMPreserveState(this.container);
        
        // Create new content
        const newContent = divhunt.DOMCreate(newHTML);
        
        // Patch existing content
        if (this.currentContent) {
            divhunt.DOMPatch(this.currentContent, newContent, {
                patched: () => {
                    // Restore state after patching
                    divhunt.DOMRestoreState(this.container, state);
                }
            });
        } else {
            this.container.appendChild(newContent);
            this.currentContent = newContent;
        }
    }
}

// Usage
const manager = new ContentManager(document.getElementById('content'));

manager.updateContent(`
    <div class="updated-content">
        <h2>New Title</h2>
        <input type="text" value="Preserved value">
        <div data-preserve-scroll="content">
            <!-- Scrollable content -->
        </div>
    </div>
`);
```

### Form State Management

```javascript
class FormManager {
    constructor(form) {
        this.form = form;
        this.setupStatePreservation();
    }
    
    setupStatePreservation() {
        // Observe form changes
        this.observer = divhunt.DOMObserve(this.form, {
            subtree: true,
            childList: true
        }, {
            mutate: () => {
                // Preserve state when form structure changes
                this.preservedState = divhunt.DOMPreserveState(this.form);
            }
        });
    }
    
    updateForm(newFormHTML) {
        const newForm = divhunt.DOMCreate(newFormHTML);
        
        divhunt.DOMPatch(this.form, newForm, {
            patched: () => {
                if (this.preservedState) {
                    divhunt.DOMRestoreState(this.form, this.preservedState);
                }
            }
        });
    }
    
    destroy() {
        this.observer.disconnect();
    }
}
```

### List Management

```javascript
class ListManager {
    constructor(container) {
        this.container = container;
        this.items = new Map();
    }
    
    addItem(id, html) {
        const itemHTML = `<li dh-key="${id}">${html}</li>`;
        const item = divhunt.DOMCreate(itemHTML);
        
        this.items.set(id, item);
        this.updateList();
    }
    
    removeItem(id) {
        this.items.delete(id);
        this.updateList();
    }
    
    updateItem(id, html) {
        if (this.items.has(id)) {
            const newItemHTML = `<li dh-key="${id}">${html}</li>`;
            const newItem = divhunt.DOMCreate(newItemHTML);
            this.items.set(id, newItem);
            this.updateList();
        }
    }
    
    updateList() {
        const listHTML = `<ul>${Array.from(this.items.values()).map(item => item.outerHTML).join('')}</ul>`;
        const newList = divhunt.DOMCreate(listHTML);
        
        if (this.container.firstChild) {
            divhunt.DOMPatch(this.container.firstChild, newList, {
                childMove: (parent, child, oldIndex, newIndex, key) => {
                    console.log(`Item ${key} moved from ${oldIndex} to ${newIndex}`);
                }
            });
        } else {
            this.container.appendChild(newList);
        }
    }
}

// Usage
const listManager = new ListManager(document.getElementById('dynamic-list'));

listManager.addItem('item-1', 'First Item');
listManager.addItem('item-2', 'Second Item');
listManager.updateItem('item-1', 'Updated First Item');
listManager.removeItem('item-2');
```