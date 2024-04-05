class ElementRender {
    static create<T extends CoreComponent>(tag: string | (new (componentProps: InferProps<T>) => T), props: any, ...children: any[]): HTMLElement | DocumentFragment {
        if (typeof tag === 'string') {
            const native = this.createNativeElement(tag, props, ...children);
            return native;
        } else {
            return this.createCustomElement(tag, props, ...children);
        }
    }

    private static createNativeElement(tag: string, props: any, ...children: any[]): HTMLElement {
        const element = document.createElement(tag);
        const container = element;

        // Destructure dataset from props and assign the rest to propsToAssign because dataset object is not directly assignable to element.
        const { dataset, ...propsToAssign } = props || {};

        Object.assign(element, propsToAssign);

        if (dataset) {
            Object.keys(dataset).forEach(key => {
                element.dataset[key] = dataset[key];
            });
        }

        children.forEach(child => {
            if (Array.isArray(child)) {
                if (child.length == 0) return;
                child.forEach(subChild => {
                    if (['string', 'number'].includes(typeof subChild)) {
                        const textNode = document.createTextNode(subChild);
                        container.appendChild(textNode);
                    } else {
                        container.appendChild(subChild);
                    }
                });
            } else if (['string', 'number'].includes(typeof child)) {
                const textNode = document.createTextNode(child);
                container.appendChild(textNode);

            } else if (typeof child === 'object') {
                container.appendChild(child);
            }
        });
        return element;
    }

    private static createCustomElement<T extends CoreComponent>(component: new (componentProps: InferProps<T>) => T, props: any, ...children: any[]): HTMLElement | DocumentFragment {
        if (component.name === 'createFragment')
            return this.createFragment(children);

        const element = new component(props);
        Object.assign(element, props);
        element.props.children = children;

        return element;
    }

    static createFragment(children: any[]): DocumentFragment {
        const fragment = document.createDocumentFragment();
        children.forEach(child => {
            if (Array.isArray(child)) {
                child.forEach(subChild => {
                    if (['string', 'number'].includes(typeof subChild)) {
                        const textNode = document.createTextNode(subChild);
                        fragment.appendChild(textNode);
                    } else {
                        fragment.appendChild(subChild);
                    }
                });
            } else if (['string', 'number'].includes(typeof child)) {
                const textNode = document.createTextNode(child);
                fragment.appendChild(textNode);

            } else if (typeof child === 'object') {
                fragment.appendChild(child);
            }
        });
        return fragment;
    }
}

export default ElementRender;