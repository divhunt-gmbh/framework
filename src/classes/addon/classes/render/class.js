// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import RenderGet from './mixins/get.js';
import RenderSet from './mixins/set.js';
import RenderContext from './mixins/context.js';
import RenderCompile from './mixins/compile.js';
import RenderDOM from './mixins/dom.js';
import RenderProcess from './mixins/process.js';
import RenderState from './mixins/state.js';
import RenderHelpers from './mixins/helpers.js';
import RenderMethods from './mixins/methods.js';
import RenderEvents from './mixins/events.js';

class DivhuntAddonRender
{
    constructor(addon, name, callback)
    {
        this.Addon = addon;
        this.Name = name;
        this.Callback = callback;
        this.Mode = 'sync';
        this.Priority = 'normal';
        
        this.Data = {};
        this.Attributes = {};
        this.Parent = null;
        this.Item = null;
        
        this.Element = null;
        this.Nodes = {};
        this.Html = '';
        this.Time = 0;
        
        this.Events = {
            init: [],
            render: [],
            mount: [],
            mounted: [],
            update: [],
            unmount: [],
            destroy: [],
            change: [],
            error: [],
            ready: [],
            visible: [],
            resize: [],
            connect: [],
            disconnect: [],
            compile: [],
            ready: []
        };

        this.Lifecycle = {
            ready: false,
            initialized: false,
            rendered: false,
            mounted: false,
            destroyed: false,
            rendering: false
        };
        
        this.State = {
            raw: {},
            defined: {},
            tracked: new Set(),
            proxy: null
        };
        
        this.Slots = {};
        this.Refs = {};
        this.Connections = new Map();
        this.Timers = new Set();
        
        this._reloadQueue = null;
        this._reloadDepth = 0;
        this._maxReloadDepth = 10;
        this._visibilityObserver = undefined;
        this._resizeObserver = undefined;
    }
}

Object.assign(DivhuntAddonRender.prototype, RenderGet);
Object.assign(DivhuntAddonRender.prototype, RenderSet);
Object.assign(DivhuntAddonRender.prototype, RenderContext);
Object.assign(DivhuntAddonRender.prototype, RenderCompile);
Object.assign(DivhuntAddonRender.prototype, RenderDOM);
Object.assign(DivhuntAddonRender.prototype, RenderProcess);
Object.assign(DivhuntAddonRender.prototype, RenderState);
Object.assign(DivhuntAddonRender.prototype, RenderHelpers);
Object.assign(DivhuntAddonRender.prototype, RenderMethods);
Object.assign(DivhuntAddonRender.prototype, RenderEvents);

export default DivhuntAddonRender;