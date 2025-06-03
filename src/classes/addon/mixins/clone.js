// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import DivhuntAddon from '../class.js';

const AddonClone = {
    Clone()
    {
        try
        {
            const clone = new DivhuntAddon(this.divhunt(), this.name + '_clone');

            clone.__fields = {};

            Object.values(this.__fields).forEach(field =>
            {
                clone.__fields[field.name] = {
                    name: field.name,
                    define: field.define,
                    get: [],
                    set: []
                };

                field.get.forEach(handler =>
                {
                    clone.__fields[field.name].get.push(handler);
                });

                field.set.forEach(handler =>
                {
                    clone.__fields[field.name].set.push(handler);
                });
            });

            clone.__fields_callbacks = {
                add: [...this.__fields_callbacks.add],
                remove: [...this.__fields_callbacks.remove]
            };

            clone.__items = {};
            clone.__items_id = this.__items_id;

            Object.values(this.__items).forEach(item =>
            {
                const itemData = Object.assign({}, item.GetData());
                delete itemData.id;

                const newItem = clone.ItemAdd(itemData, null, false);
            });

            clone.__items_callbacks = {
                add: [...this.__items_callbacks.add],
                get: [...this.__items_callbacks.get],
                set: [...this.__items_callbacks.set],
                remove: [...this.__items_callbacks.remove]
            };

            clone.__functions = {};

            Object.entries(this.__functions).forEach(([name, func]) => {
                clone.__functions[name] = {
                    callback: func.callback,
                    before: [...(func.before || [])],
                    after: [...(func.after || [])],
                    trigger: func.trigger
                };
            });

            try
            {
                this.divhunt.Hook('addon.clone', this, clone);
            }
            catch (hookError)
            {
                console.error('Error in addon.clone hook', hookError);
            }

            return clone;
        }
        catch (error)
        {
            console.error("Error in Clone method:", error);
            throw error;
        }
    }
};

export default AddonClone;
