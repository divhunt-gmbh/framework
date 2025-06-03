// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const RenderMethods =
{
    Mount(target)
    {
        try
        {
            if(!this.element)
            {
                throw new Error('Cannot mount - render not processed');
            }
            
            if(this.lifecycle.mounted)
            {
                throw new Error('Already mounted');
            }
            
            /* Before mount */
            this.EmitBeforeMount();
            
            /* Insert into DOM */
            const element = this.ProcessResolveTarget(target);
            element.appendChild(this.element);
            
            /* After mount */
            this.EmitMount();
            this.EmitMounted();
            
            return this;
        }
        catch(error)
        {
            this.EmitError(error);
            return this;
        }
    },
    
    Unmount()
    {
        try
        {
            if(!this.lifecycle.mounted)
            {
                return this;
            }
            
            /* Before unmount */
            this.EmitBeforeUnmount();
            
            /* Remove from DOM */
            if(this.element && this.element.parentNode)
            {
                this.element.parentNode.removeChild(this.element);
            }
            
            /* After unmount */
            this.EmitUnmount();
            
            this.lifecycle.mounted = false;
            
            return this;
        }
        catch(error)
        {
            this.EmitError(error);
            return this;
        }
    },
    
    Destroy()
    {
        try
        {
            /* Unmount first */
            this.Unmount();
            
            /* Emit destroy */
            this.EmitDestroy();
            
            /* Clear references */
            this.element = null;
            this.nodes = {};
            this.refs = {};
            this.slots = {};
            
            return this;
        }
        catch(error)
        {
            this.EmitError(error);
            return this;
        }
    },




    /* State Management */
    
    Define(config)
    {
        return this.StateDefine(config);
    },
    
    /* Lifecycle Hooks */
    
    OnInit(callback)
    {
        return this.LifecycleOnInit(callback);
    },
    
    OnMount(callback)
    {
        return this.LifecycleOnMount(callback);
    },
    
    OnMounted(callback)
    {
        return this.LifecycleOnMounted(callback);
    },
    
    OnBeforeUpdate(callback)
    {
        return this.LifecycleOnBeforeUpdate(callback);
    },
    
    OnUpdate(callback)
    {
        return this.LifecycleOnUpdate(callback);
    },
    
    OnBeforeUnmount(callback)
    {
        return this.LifecycleOnBeforeUnmount(callback);
    },
    
    OnUnmount(callback)
    {
        return this.LifecycleOnUnmount(callback);
    },
    
    OnDestroy(callback)
    {
        return this.LifecycleOnDestroy(callback);
    },
    
    OnReady(callback)
    {
        return this.LifecycleOnReady(callback);
    },
    
    OnVisible(callback)
    {
        return this.LifecycleOnVisible(callback);
    },
    
    OnResize(callback)
    {
        return this.LifecycleOnResize(callback);
    },
    
    OnChange(callback)
    {
        return this.LifecycleOnChange(callback);
    },
    
    OnError(callback)
    {
        return this.LifecycleOnError(callback);
    },
    
    /* Slots */
    
    Slot(name = 'default', defaultContent = '')
    {
        return this.HelpersSlot(name, defaultContent);
    },
    
    /* Timers */
    
    SetTimeout(callback, delay)
    {
        return this.HelpersSetTimeout(callback, delay);
    },
    
    SetInterval(callback, delay)
    {
        return this.HelpersSetInterval(callback, delay);
    },
    
    ClearTimer(timer)
    {
        return this.HelpersClearTimer(timer);
    },
    
    /* Store Connection */
    
    Connect(storeName, callback)
    {
        return this.HelpersConnect(storeName, callback);
    },
    
    Disconnect(storeName)
    {
        return this.HelpersDisconnect(storeName);
    },
    
    /* CSS Helpers */
    
    Classes(...args)
    {
        return this.HelpersClasses(...args);
    },
    
    Styles(styles)
    {
        return this.HelpersStyles(styles);
    },
    
    /* Component Extension */
    
    Extends(baseName)
    {
        return this.ContextExtends(baseName);
    },
    
    /* Force Reload */
    
   Reload()
    {
        try
        {
            /* Check reload depth */
            this._reloadDepth++;
            
            if(this._reloadDepth > this._maxReloadDepth)
            {
                throw new Error(`Maximum reload depth (${this._maxReloadDepth}) exceeded`);
            }
            
            /* If not mounted, nothing to reload */
            if(!this.lifecycle.mounted)
            {
                this._reloadDepth = 0;
                return this;
            }
            
            /* Parent handles reload */
            if(this.parent)
            {
                this.GetRoot().Reload();
                return this;
            }
            
            /* Before update */
            this.EmitBeforeUpdate();
            
            /* Preserve state */
            const state = this.DOMPreserveState(this.element);
            
            /* Re-render */
            const html = this.ProcessRender();
            
            /* Compile new version */
            const compiled = this.Compile(html);
            
            /* Patch DOM */
            this.DOMPatchElement(this.element, compiled.element);
            
            /* Update references */
            this.nodes = compiled.nodes;
            this.time = compiled.time;
            
            /* Restore state */
            this.DOMRestoreState(this.element, state);
            
            /* After update */
            this.EmitUpdate();
            
            /* Reset depth */
            this._reloadDepth = 0;
            
            return this;
        }
        catch(error)
        {
            this._reloadDepth = 0;
            this.EmitError(error);
            return this;
        }
    },
};

export default RenderMethods;