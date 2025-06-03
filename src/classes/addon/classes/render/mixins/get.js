// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const RenderGet =
{
    GetName()
    {
        return this.Name;
    },

    GetCallback()
    {
        return this.Callback;
    },
    
    GetAddon()
    {
        return this.Addon;
    },

    GetDivhunt()
    {
        return this.Addon.divhunt;
    },
    
    GetData()
    {
        return this.Data;
    },
    
    GetAttributes()
    {
        return this.Attributes;
    },
    
    GetParent()
    {
        return this.Parent;
    },
    
    GetItem()
    {
        return this.Item;
    },
    
    GetElement()
    {
        return this.Element;
    },
    
    GetNodes()
    {
        return this.Nodes;
    },
    
    GetRefs()
    {
        return this.Refs;
    },
    
    GetRef(name)
    {
        return this.Refs[name] || undefined;
    },
    
    GetSlots()
    {
        return this.Slots;
    },
    
    GetSlot(name = 'default')
    {
        return this.Slots[name] || null;
    },
    
    GetReady()
    {
        return this.Ready;
    }
}

export default RenderGet;