// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const RenderContext =
{
    ContextGetContext()
    {
        return {
            name: this.name,
            data: this.data,
            attributes: this.attributes,
            parent: this.parent,
            item: this.item,
            mode: this.mode,
            priority: this.priority,
            addon: this.addon,
            divhunt: this.addon.divhunt
        };
    },
    
    ContextExtends(baseName)
    {
        const baseRender = this.addon.FnGet('render.' + baseName);
        if(!baseRender)
        {
            throw new Error(`Base render "${baseName}" not found`);
        }
        
        /* Create base context */
        const baseContext = new this.constructor(this.addon, baseName, baseRender.callback);
        baseContext.SetData(this.data);
        baseContext.SetAttributes(this.attributes);
        baseContext.SetParent(this.parent);
        baseContext.SetItem(this.item);
        
        /* Execute base callback to setup */
        baseRender.callback.call(baseContext, this.data);
        
        /* Merge states */
        if(baseContext.state.defined)
        {
            Object.assign(this.state.defined, baseContext.state.defined);
        }
        
        /* Merge events */
        Object.entries(baseContext.events).forEach(([event, callbacks]) =>
        {
            this.events[event].unshift(...callbacks);
        });
        
        return this;
    }
};

export default RenderContext;