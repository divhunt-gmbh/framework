// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const RenderState =
{
    StateDefine(config)
    {
        const parsed = this.GetDivhunt().DataConfig(config);

        Object.entries(parsed).forEach(([key, definition]) =>
        {
            if(definition.value !== undefined)
            {
                this.State.raw[key] = definition.value;
            }
            else if(definition.type === 'array')
            {
                this.State.raw[key] = [];
            }
            else if(definition.type === 'object')
            {
                this.State.raw[key] = {};
            }
            else if(definition.type === 'string')
            {
                this.State.raw[key] = '';
            }
            else if(definition.type === 'number')
            {
                this.State.raw[key] = 0;
            }
            else if(definition.type === 'boolean')
            {
                this.State.raw[key] = false;
            }
            else
            {
                this.State.raw[key] = null;
            }
        });
        
        this.State.defined = parsed;

        return;
        
        /* Create proxy for reactivity if not exists */
        if(!this.state.proxy)
        {
            this.state.proxy = new Proxy(this.State.raw, {
                get: (target, prop) =>
                {
                    /* Track property access during render */
                    if(this.lifecycle.rendering && prop in target)
                    {
                        this.state.tracked.add(prop);
                    }
                    
                    return target[prop];
                },
                
                set: (target, prop, value) =>
                {
                    if(!(prop in this.state.defined))
                    {
                        return false;
                    }
                    
                    const oldValue = target[prop];
                    
                    /* Validate with DataDefine */
                    try
                    {
                        value = this.addon.divhunt.DataDefineOne(value, this.state.defined[prop]);
                    }
                    catch(error)
                    {
                        this.EmitError(new Error(`Invalid value for ${prop}: ${error.message}`));
                        return false;
                    }
                    
                    /* Skip if unchanged */
                    if(oldValue === value)
                    {
                        return true;
                    }
                    
                    target[prop] = value;
                    
                    /* Emit change event */
                    this.EmitChange(prop, value, oldValue);
                    
                    /* Queue reload if property is tracked */
                    if(this.state.tracked.has(prop) && this.lifecycle.mounted)
                    {
                        this.StateQueueReload();
                    }
                    
                    return true;
                }
            });
        }
        
        /* Define properties on instance */
        Object.keys(parsed).forEach(key =>
        {
            /* Skip if property already defined */
            if(this.hasOwnProperty(key))
            {
                return;
            }
            
            Object.defineProperty(this, key, {
                get: () => this.state.proxy[key],
                set: (value) => this.state.proxy[key] = value,
                enumerable: true,
                configurable: true
            });
        });
        
        /* Add computed properties */
        Object.entries(config).forEach(([key, value]) =>
        {
            if(typeof value === 'function')
            {
                /* Skip if property already defined */
                if(this.hasOwnProperty(key))
                {
                    return;
                }
                
                Object.defineProperty(this, key, {
                    get: () =>
                    {
                        if(this.lifecycle.rendering)
                        {
                            this.state.tracked.add(key);
                        }
                        return value.call(this.state.proxy);
                    },
                    enumerable: true,
                    configurable: true
                });
            }
        });
    },
    
    StateQueueReload()
    {
        if(this._reloadQueue)
        {
            return;
        }
        
        this._reloadQueue = requestAnimationFrame(() =>
        {
            this._reloadQueue = null;
            this.Reload();
        });
    },
    
    StateResetTracking()
    {
        this.State.tracked.clear();
    },

    SetState(updates)
    {
        Object.entries(updates).forEach(([key, value]) =>
        {
            if(key in this.state.defined)
            {
                this[key] = value;
            }
            else
            {
                this.addon.divhunt.LogWarn('Undefined state property', {key});
            }
        });

        return this;
    },
    
    SetStateValue(key, value)
    {
        if(key in this.state.defined)
        {
            this[key] = value;
        }
        else
        {
            this.addon.divhunt.LogWarn('Undefined state property', {key});
        }

        return this;
    },

        GetState()
    {
        const state = {};
        
        Object.keys(this.state.defined).forEach(key =>
        {
            state[key] = this[key];
        });
        
        return state;
    },
    
    GetStateValue(key)
    {
        return key in this.state.defined ? this[key] : undefined;
    },
    
    GetTracked()
    {
        return Array.from(this.state.tracked);
    },
    
    GetDefined()
    {
        return this.state.defined;
    },
};

export default RenderState;