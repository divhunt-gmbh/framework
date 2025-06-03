// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const DOM =
{
    DOMCreate(html, callbacks = {})
    {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html.trim();
        
        let element;
        
        if(wrapper.childNodes.length === 1)
        {
            element = wrapper.firstChild;
        }
        else
        {
            element = document.createDocumentFragment();
            while(wrapper.firstChild)
            {
                element.appendChild(wrapper.firstChild);
            }
        }
        
        if(callbacks.created)
        {
            callbacks.created(element);
        }
        
        this.Emit('dom.create', element);
        
        return element;
    },
    
    DOMPatch(current, target, callbacks = {})
    {
        if(current === target)
        {
            return current;
        }
        
        if(!current || !target || current.nodeType !== target.nodeType || current.nodeName !== target.nodeName)
        {
            if(current && current.parentNode)
            {
                callbacks.replace && callbacks.replace(current, target);
                this.Emit('dom.replace', current, target);
                current.parentNode.replaceChild(target.cloneNode(true), current);
                return target;
            }
            return target;
        }
        
        if(current.nodeType === Node.TEXT_NODE)
        {
            if(current.textContent !== target.textContent)
            {
                const oldText = current.textContent;
                callbacks.text && callbacks.text(current, oldText, target.textContent);
                this.Emit('dom.text', current, oldText, target.textContent);
                current.textContent = target.textContent;
            }
            return current;
        }
        
        if(current.nodeType === Node.ELEMENT_NODE)
        {
            this.DOMPatchAttributes(current, target, callbacks);
            this.DOMPatchChildren(current, target, callbacks);
        }
        
        callbacks.patched && callbacks.patched(current);
        
        return current;
    },
    
    DOMPatchAttributes(current, target, callbacks = {})
    {
        const currentAttrs = new Map();
        const targetAttrs = new Map();
        
        for(let i = 0; i < current.attributes.length; i++)
        {
            const attr = current.attributes[i];
            currentAttrs.set(attr.name, attr.value);
        }
        
        for(let i = 0; i < target.attributes.length; i++)
        {
            const attr = target.attributes[i];
            targetAttrs.set(attr.name, attr.value);
        }
        
        targetAttrs.forEach((value, name) =>
        {
            const oldValue = currentAttrs.get(name);
            if(oldValue !== value)
            {
                callbacks.attribute && callbacks.attribute(current, name, value, oldValue);
                this.Emit('dom.attribute.set', current, name, value, oldValue);
                current.setAttribute(name, value);
            }
        });
        
        currentAttrs.forEach((value, name) =>
        {
            if(!targetAttrs.has(name))
            {
                callbacks.attributeRemove && callbacks.attributeRemove(current, name, value);
                this.Emit('dom.attribute.remove', current, name, value);
                current.removeAttribute(name);
            }
        });
    },
    
    DOMPatchChildren(current, target, callbacks = {})
    {
        const currentKeyed = this.DOMGetKeyedChildren(current);
        const targetKeyed = this.DOMGetKeyedChildren(target);
        
        if(currentKeyed.size || targetKeyed.size)
        {
            this.DOMPatchKeyedChildren(current, target, currentKeyed, targetKeyed, callbacks);
            return;
        }
        
        const currentChildren = Array.from(current.childNodes);
        const targetChildren = Array.from(target.childNodes);
        
        const maxLength = Math.max(currentChildren.length, targetChildren.length);
        
        for(let i = 0; i < maxLength; i++)
        {
            const currentChild = currentChildren[i];
            const targetChild = targetChildren[i];
            
            if(!targetChild)
            {
                callbacks.childRemove && callbacks.childRemove(current, currentChild, i);
                this.Emit('dom.child.remove', current, currentChild, i);
                current.removeChild(currentChild);
            }
            else if(!currentChild)
            {
                const newChild = targetChild.cloneNode(true);
                callbacks.childAdd && callbacks.childAdd(current, newChild, i);
                this.Emit('dom.child.add', current, newChild, i);
                current.appendChild(newChild);
            }
            else
            {
                this.DOMPatch(currentChild, targetChild, callbacks);
            }
        }
    },
    
    DOMPatchKeyedChildren(current, target, currentKeyed, targetKeyed, callbacks = {})
    {
        const handled = new Set();
        
        targetKeyed.forEach((targetChild, key) =>
        {
            const currentChild = currentKeyed.get(key);
            
            if(currentChild)
            {
                const targetIndex = Array.from(target.children).indexOf(targetChild);
                const currentIndex = Array.from(current.children).indexOf(currentChild);
                
                if(currentIndex !== targetIndex)
                {
                    const referenceNode = current.children[targetIndex];
                    callbacks.childMove && callbacks.childMove(current, currentChild, currentIndex, targetIndex, key);
                    this.Emit('dom.child.move', current, currentChild, currentIndex, targetIndex, key);
                    current.insertBefore(currentChild, referenceNode);
                }
                
                this.DOMPatch(currentChild, targetChild, callbacks);
                handled.add(currentChild);
            }
            else
            {
                const targetIndex = Array.from(target.children).indexOf(targetChild);
                const referenceNode = current.children[targetIndex];
                const newElement = targetChild.cloneNode(true);
                
                callbacks.childAdd && callbacks.childAdd(current, newElement, targetIndex, key);
                this.Emit('dom.child.add', current, newElement, targetIndex, key);
                
                if(referenceNode)
                {
                    current.insertBefore(newElement, referenceNode);
                }
                else
                {
                    current.appendChild(newElement);
                }
            }
        });
        
        currentKeyed.forEach((currentChild, key) =>
        {
            if(!targetKeyed.has(key) && !handled.has(currentChild))
            {
                callbacks.childRemove && callbacks.childRemove(current, currentChild, null, key);
                this.Emit('dom.child.remove', current, currentChild, null, key);
                current.removeChild(currentChild);
            }
        });
    },
    
    DOMGetKeyedChildren(element)
    {
        const keyed = new Map();
        
        for(let i = 0; i < element.children.length; i++)
        {
            const child = element.children[i];
            const key = child.getAttribute('dh-key');
            
            if(key)
            {
                keyed.set(key, child);
            }
        }
        
        return keyed;
    },
    
    DOMPreserveState(element, callbacks = {})
    {
        const state = {
            scroll: {},
            focus: null,
            selection: null,
            values: {}
        };
        
        const scrollables = element.querySelectorAll('[data-preserve-scroll]');
        
        scrollables.forEach(el =>
        {
            const id = el.getAttribute('data-preserve-scroll');

            state.scroll[id] = {
                top: el.scrollTop,
                left: el.scrollLeft
            };
        });
        
        if(document.activeElement && element.contains(document.activeElement))
        {
            state.focus = this.DOMGetElementPath(document.activeElement, element);
        }
        
        const inputs = element.querySelectorAll('input, textarea, select');

        inputs.forEach((input, index) =>
        {
            if(input.type === 'checkbox' || input.type === 'radio')
            {
                state.values[index] = input.checked;
            }
            else
            {
                state.values[index] = input.value;
            }
        });
        
        callbacks.preserved && callbacks.preserved(state);
        this.Emit('dom.state.preserve', element, state);
        
        return state;
    },
    
    DOMRestoreState(element, state, callbacks = {})
    {
        Object.entries(state.scroll).forEach(([id, position]) =>
        {
            const el = element.querySelector(`[data-preserve-scroll="${id}"]`);
            
            if(el)
            {
                el.scrollTop = position.top;
                el.scrollLeft = position.left;
            }
        });
        
        if(state.focus)
        {
            const focusEl = this.DOMGetElementByPath(state.focus, element);

            if(focusEl && typeof focusEl.focus === 'function')
            {
                focusEl.focus();
            }
        }
        
        const inputs = element.querySelectorAll('input, textarea, select');

        inputs.forEach((input, index) =>
        {
            if(index in state.values)
            {
                if(input.type === 'checkbox' || input.type === 'radio')
                {
                    input.checked = state.values[index];
                }
                else
                {
                    input.value = state.values[index];
                }
            }
        });
        
        callbacks.restored && callbacks.restored(state);
        this.Emit('dom.state.restore', element, state);
    },
    
    DOMGetElementPath(element, root)
    {
        const path = [];
        let current = element;
        
        while(current && current !== root)
        {
            const parent = current.parentNode;
            const index = Array.from(parent.children).indexOf(current);
            path.unshift(index);
            current = parent;
        }
        
        return path;
    },
    
    DOMGetElementByPath(path, root)
    {
        let current = root;
        
        for(let index of path)
        {
            if(!current || !current.children[index])
            {
                return null;
            }
            current = current.children[index];
        }
        
        return current;
    },
    
    DOMWalk(element, callback, depth = 0)
    {
        if(callback(element, depth) === false)
        {
            return;
        }
        
        if(element.childNodes)
        {
            for(let i = 0; i < element.childNodes.length; i++)
            {
                this.DOMWalk(element.childNodes[i], callback, depth + 1);
            }
        }
    },
    
    DOMFind(element, selector, callbacks = {})
    {
        const results = element.querySelectorAll(selector);
        
        callbacks.found && callbacks.found(results);
        this.Emit('dom.find', element, selector, results);
        
        return results;
    },
    
    DOMObserve(element, options = {}, callbacks = {})
    {
        const observer = new MutationObserver(mutations =>
        {
            callbacks.mutate && callbacks.mutate(mutations);
            this.Emit('dom.mutate', element, mutations);
        });
        
        observer.observe(element, {
            childList: options.children !== false,
            attributes: options.attributes !== false,
            characterData: options.text !== false,
            subtree: options.subtree !== false,
            attributeOldValue: options.attributeOldValue !== false,
            characterDataOldValue: options.textOldValue !== false
        });
        
        return observer;
    }
};

export default DOM;