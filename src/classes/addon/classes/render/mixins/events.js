// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const RenderEvents =
{
    EventOn(event, callback)
    {
        if(!(event in this.Events))
        {
            throw new Error('Event ' + event + ' doesn\'t exist.');
        }

        const run = {
            init:    () => this.Lifecycle.initialized,
            mount:   () => this.Lifecycle.mounted,
            mounted: () => this.Lifecycle.mounted,
            ready:   () => this.Lifecycle.ready
        };

        if(run[event] && run[event]())
        {
            callback.call(this);
        }
        else
        {
            this.Events[event].push(callback);
        }
        
        return this;
    },

    EventEmit(event, ...args)
    {
        if(!(event in this.Events))
        {
            throw new Error('Event ' + event + ' doesn\'t exist.');
        }

        const skip = {
            init:    () => this.Lifecycle.initialized,
            mount:   () => this.Lifecycle.mounted,
            destroy: () => this.Lifecycle.destroyed,
            ready:   () => this.Lifecycle.ready
        };

        if(skip[event] && skip[event]())
        {
            return this;
        }

        this.Events[event].forEach(callback => callback.call(this, ...args));

        const after = {
            init:    () => { this.Lifecycle.initialized = true; },
            mount:   () => { this.Lifecycle.mounted = true; },
            render:  () => { this.Lifecycle.rendered = true; },
            ready:   () => { this.Lifecycle.ready = true; },
            destroy: () => { this.Lifecycle.destroyed = true; this.LifecycleCleanup(); },
            mounted: () => { this.EventEmit('ready'); },
            error:   () => { throw args[0] || 'Unknown error'; }
        };

        if(after[event])
        {
            after[event]();
        }

        return this;
    },

    EventOff(event, callback)
    {
         if(!(event in this.Events))
        {
            throw new Error('Event ' + event + ' doesn\'t exist.');
        }

        if(!callback)
        {
            this.EventHandlers[event] = [];
            return this;
        }

        const index = this.EventHandlers[event].indexOf(callback);
        if(index > -1)
        {
            this.EventHandlers[event].splice(index, 1);
        }

        return this;
    },

    EventOnce(event, callback)
    {
        const onceWrapper = (...args) =>
        {
            callback.call(this, ...args);
            this.EventOff(event, onceWrapper);
        };

        return this.EventOn(event, onceWrapper);
    },

    EventInitObserver(type)
    {
        const observerName = '_' + type + 'Observer';
        
        if(this[observerName])
        {
            return;
        }
        
        this.EventOn('mount', () =>
        {
            if(type === 'visibility')
            {
                this[observerName] = new IntersectionObserver(entries =>
                {
                    entries.forEach(entry =>
                    {
                        if(entry.isIntersecting)
                        {
                            this.EventEmit('visible', entry);
                        }
                    });
                }, {threshold: 0.1});
            }
            else if(type === 'resize')
            {
                this[observerName] = new ResizeObserver(entries =>
                {
                    entries.forEach(entry => this.EventEmit('resize', entry));
                });
            }
            
            this[observerName].observe(this.element);
        });
    },
    
    EventCleanup()
    {
        this.ClearTimers();
        
        ['_visibilityObserver', '_resizeObserver'].forEach(observer =>
        {
            if(this[observer])
            {
                this[observer].disconnect();
            }
        });
        
        this.ClearConnections();
        
        if(this._reloadQueue)
        {
            cancelAnimationFrame(this._reloadQueue);
            this._reloadQueue = null;
        }
    }
};

export default RenderEvents;