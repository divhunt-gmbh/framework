// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import Addons from './mixins/addons.js';
import Generate from './mixins/generate.js';
import Request from './mixins/request.js';
import Data from './mixins/data.js';
import String from './mixins/string.js';
import Emitter from './mixins/emitter.js';
import Middleware from './mixins/middleware.js';
import Logger from './mixins/logger.js';
import Dependencies from './mixins/dependencies.js';
import Function from './mixins/function.js';
import Overrides from './mixins/overrides.js';
import DOM from './mixins/dom.js';
import Validate from './mixins/validate.js';
import Helper from './mixins/helper.js';

class Divhunt
{
    constructor()
    {
        this.emitters = {};
        this.middleware = {};

        this.addons =
        {
            data: {},
            callbacks:
            {
                add: [],
                remove: []
            }
        };

        this.dependencies = {
            items: {},
            callbacks: {
                add: [],
                remove: []
            }
        };

        this.logger =
        {
            levels:
            {
                error: 0,
                warn: 1,
                info: 2,
                http: 3,
                verbose: 4,
                debug: 5,
                silly: 6
            },
            level: 'error'
        };

        this.data =
        {
            schemas: {},
        };
    }
}

Object.assign(Divhunt.prototype, Addons);
Object.assign(Divhunt.prototype, Emitter);
Object.assign(Divhunt.prototype, Generate);
Object.assign(Divhunt.prototype, Request);
Object.assign(Divhunt.prototype, Data);
Object.assign(Divhunt.prototype, String);
Object.assign(Divhunt.prototype, Middleware);
Object.assign(Divhunt.prototype, Logger);
Object.assign(Divhunt.prototype, Dependencies);
Object.assign(Divhunt.prototype, Function);
Object.assign(Divhunt.prototype, Overrides);
Object.assign(Divhunt.prototype, DOM);
Object.assign(Divhunt.prototype, Validate);
Object.assign(Divhunt.prototype, Helper);

export default Divhunt;