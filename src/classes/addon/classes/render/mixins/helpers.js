// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const RenderHelpers =
{
    /* Slots */
    
    HelpersSlot(name = 'default', defaultContent = '')
    {
        return this.slots[name] || defaultContent;
    },
    
    /* Timer Management */
    
    HelpersSetTimeout(callback, delay)
    {
        const timer = setTimeout(() =>
        {
            this.timers.delete(timer);
            callback.call(this);
        }, delay);
        
        this.timers.add(timer);
        return timer;
    },
    
    HelpersSetInterval(callback, delay)
    {
        const timer = setInterval(() =>
        {
            callback.call(this);
        }, delay);
        
        this.timers.add(timer);
        return timer;
    },
    
    HelpersClearTimer(timer)
    {
        if(this.timers.has(timer))
        {
            clearTimeout(timer);
            clearInterval(timer);
            this.timers.delete(timer);
        }
    },
    
    /* Store Connection */
    
    HelpersConnect(storeName, callback)
    {
        const store = this.addon.divhunt.Store(storeName);
        if(!store)
        {
            this.addon.divhunt.LogWarn('Store not found', {storeName});
            return this;
        }
        
        const handler = (data) =>
        {
            callback.call(this, data);
            if(this.lifecycle.mounted)
            {
                this.StateQueueReload();
            }
        };
        
        /* Initial data */
        handler(store.GetData());
        
        /* Subscribe to changes */
        const unsubscribe = store.Subscribe(handler);
        this.connections.set(storeName, unsubscribe);
        
        /* Emit connection */
        this.EmitConnect(store);
        
        return this;
    },
    
    HelpersDisconnect(storeName)
    {
        const unsubscribe = this.connections.get(storeName);
        if(unsubscribe)
        {
            unsubscribe();
            this.connections.delete(storeName);
            this.EmitDisconnect(storeName);
        }
        
        return this;
    },
    
    /* CSS Helpers */
    
    HelpersClasses(...args)
    {
        const classes = [];
        
        args.forEach(arg =>
        {
            if(!arg) return;
            
            if(typeof arg === 'string')
            {
                classes.push(arg);
            }
            else if(Array.isArray(arg))
            {
                classes.push(...arg.filter(Boolean));
            }
            else if(typeof arg === 'object')
            {
                Object.entries(arg).forEach(([key, value]) =>
                {
                    if(value) classes.push(key);
                });
            }
        });
        
        return classes.join(' ');
    },
    
    HelpersStyles(styles)
    {
        if(typeof styles === 'string')
        {
            return styles;
        }
        
        if(typeof styles === 'object')
        {
            return Object.entries(styles)
                .filter(([key, value]) => value !== null && value !== undefined)
                .map(([key, value]) =>
                {
                    key = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    return `${key}: ${value}`;
                })
                .join('; ');
        }
        
        return '';
    }
};

export default RenderHelpers;