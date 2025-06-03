// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const RenderCompile =
{
    Compile(html)
    {
        const start = performance.now();
        const element = this.DOMCreateElement(html);
        
        if(element.nodeType === Node.ELEMENT_NODE)
        {
            Object.entries(this.GetAttributes()).forEach(([key, value]) =>
            {
                element.setAttribute(key, value);
            });
            
            element.classList.add('r' + this.GetDivhunt().GenerateHash(this.GetAddon().GetName() + '-' + this.GetName()));
        }
        
        const compile = {
            element,
            nodes: {},
            time: 0,
            walk: true,
            children: true
        };
        
        this.GetDivhunt().Emit('addon.render.compile.before', this, compile, element, '0');
        
        if(compile.walk)
        {
            this.CompileWalkNodes(element, '0', compile);
        }
        
        this.CompileRefs(compile);
        
        this.GetDivhunt().Emit('addon.render.compile.after', this, compile, element, '0');
        
        compile.time = performance.now() - start;
        console.log('Addon rendered within ' + compile.time + 'ms');
        
        return compile;
    },
    
    CompileWalkNodes(node, identifier, compile)
    {
        if(!compile.walk || !node)
        {
            return;
        }
        
        compile.nodes[identifier] = node;
        
        this.GetDivhunt().Emit('addon.render.compile.node', this, compile, node, identifier);
        
        if(compile.children && node.nodeType === Node.ELEMENT_NODE && node.hasChildNodes())
        {
            const children = Array.from(node.childNodes);

            children.forEach((child, index) =>
            {
                this.CompileWalkNodes(child, identifier + '-' + index, compile);
            });
        }
    },
    
    CompileRefs(compile)
    {
        if(compile.element.nodeType !== Node.ELEMENT_NODE)
        {
            return;
        }
        
        const refs = compile.element.querySelectorAll('[dh-ref]');

        refs.forEach(element =>
        {
            const name = element.getAttribute('dh-ref');

            if(name)
            {
                this.SetRef(name, element);
                element.removeAttribute('dh-ref');
            }
        });
    }
};

export default RenderCompile;