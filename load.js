// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

import Divhunt from './src/divhunt.js';

const divhunt = new Divhunt()

process.on('SIGINT', async () => 
{
    await divhunt.Middleware('sigint');
    process.exit(0);
});

process.on('SIGTERM', async () => 
{
    await divhunt.Middleware('sigterm');
    process.exit(0);
});

export default divhunt;