// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const RenderSet =
{
    SetData(data)
    {
        this.Data = data;
        return this;
    },
    
    SetAttributes(attributes)
    {
        this.Attributes = attributes;
        return this;
    },
    
    SetParent(parent)
    {
        this.Parent = parent;
        return this;
    },
    
    SetItem(item)
    {
        this.Item = item;
        return this;
    },

    SetSlots(slots)
    {
        this.Slots = slots;

        return this;
    },
    
    SetSlot(name, content)
    {
        this.Slots[name] = content;

        return this;
    },

    SetRefs(refs)
    {
        this.Refs = refs;
        
        return this;
    },
    
    SetRef(name, element)
    {
        if(element && element.nodeType)
        {
            this.Refs[name] = element;
        }

        return this;
    },
};

export default RenderSet;