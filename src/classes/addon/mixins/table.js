// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const AddonTable =
{
    Table(name = null)
    {
        if(name === null)
        {
            return this.TableGet();
        }
        else
        {
            return this.TableSet(name);
        }
    },

    TableSet(name)
    {
        this.table.name = name;
    },

    TableGet()
    {
        return this.table;
    },

    TableOn(type, callback)
    {
        if(type in this.table.callbacks)
        {
            this.table.callbacks.on(type, callback);
        }
    }
};

export default AddonTable;
