// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const Function =
{
    Function(expression, data = {})
    {
        if (!this.FunctionExpressionValid(expression))
        {
            return this.LogError('Invalid expression.', {expression}, new Error('Expression evaluation failed.'));
        }
        
        try
        {
            const FunctionConstructor = typeof window !== 'undefined' ? window.Function : global.Function;

            const keys = Object.keys(data);
            const values = Object.values(data);
            
            const fnBody = `return ${expression};`;
            const evaluator = new FunctionConstructor(...keys, fnBody);
            
            return evaluator(...values);
        }
        catch (error)
        {
            this.LogError('Expression evaluation failed.', {expression}, error);
        }
    },
    
    FunctionExpressionValid(expression)
    {
        if (expression.includes(';') || 
            expression.includes('`') || 
            expression.includes('=>') ||
            expression.includes('return '))
        {
            return false;
        }
        
        const safePattern = /^[a-zA-Z0-9_\[\]\.\'"+-\/*%<>=!&|\s()?,:\d]*$/;

        if (!safePattern.test(expression))
        {
            return false;
        }
        
        const dangerousKeywords = [
            'eval', 'Function', 'setTimeout', 'setInterval', 'execScript',
            'constructor', 'prototype', '__proto__', 'global', 'process',
            'require', 'import', 'export', 'module', 'window', 'document',
            'localStorage', 'sessionStorage', 'fetch', 'XMLHttpRequest',
            '__dirname', '__filename', 'Buffer', 'Promise', 'arguments',
            'callee', 'caller', 'debugger', 'new', 'this', 'delete',
            'bind', 'apply', 'call', 'Reflect', 'Proxy', 'revoke'
        ];
        
        return !dangerousKeywords.some(keyword => 
        {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            return regex.test(expression);
        });
    }
};

export default Function;