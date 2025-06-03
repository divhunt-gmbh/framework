// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const RenderDOM =
{
    DOMCreateElement(html)
    {
        const div = document.createElement('div');
        div.innerHTML = html.trim();
        return div;
    },
    
    DOMPatchElement(current, target)
    {
        return this.addon.divhunt.DOMPatch(current, target);
    },
    
    DOMPreserveState(element)
    {
        const state = {};
        const inputs = element.querySelectorAll('input, textarea, select');
        const scrollables = element.querySelectorAll('[data-preserve-scroll]');

        inputs.forEach((target, index) =>
        {
            state['input-' + index] = {
                value: target.value,
                checked: target.checked,
                selected: target.selectedIndex
            };
        });

        scrollables.forEach((target, index) =>
        {
            state['scroll-' + index] = {
                top: target.scrollTop,
                left: target.scrollLeft
            };
        });
        
        return state;
    },
    
    DOMRestoreState(element, state)
    {
        const inputs = element.querySelectorAll('input, textarea, select');
        const scrollables = element.querySelectorAll('[data-preserve-scroll]');

        inputs.forEach((target, index) =>
        {
            const saved = state['input-' + index];

            if(saved)
            {
                if(target.type === 'checkbox' || target.type === 'radio')
                {
                    target.checked = saved.checked;
                }
                else if(target.tagName === 'SELECT')
                {
                    target.selectedIndex = saved.selected;
                }
                else
                {
                    target.value = saved.value;
                }
            }
        });
        
        scrollables.forEach((target, index) =>
        {
            const saved = state['scroll-' + index];

            if(saved)
            {
                target.scrollTop = saved.top;
                target.scrollLeft = saved.left;
            }
        });
    }
};

export default RenderDOM;