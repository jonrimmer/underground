(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const directives = new WeakMap();
    const isDirective = (o) => {
        return typeof o === 'function' && directives.has(o);
    };
    //# sourceMappingURL=directive.js.map

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * True if the custom elements polyfill is in use.
     */
    const isCEPolyfill = window.customElements !== undefined &&
        window.customElements.polyfillWrapFlushCallback !==
            undefined;
    /**
     * Removes nodes, starting from `startNode` (inclusive) to `endNode`
     * (exclusive), from `container`.
     */
    const removeNodes = (container, startNode, endNode = null) => {
        let node = startNode;
        while (node !== endNode) {
            const n = node.nextSibling;
            container.removeChild(node);
            node = n;
        }
    };
    //# sourceMappingURL=dom.js.map

    /**
     * @license
     * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * A sentinel value that signals that a value was handled by a directive and
     * should not be written to the DOM.
     */
    const noChange = {};
    /**
     * A sentinel value that signals a NodePart to fully clear its content.
     */
    const nothing = {};
    //# sourceMappingURL=part.js.map

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * An expression marker with embedded unique key to avoid collision with
     * possible text in templates.
     */
    const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
    /**
     * An expression marker used text-positions, multi-binding attributes, and
     * attributes with markup-like text values.
     */
    const nodeMarker = `<!--${marker}-->`;
    const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
    /**
     * Suffix appended to all bound attribute names.
     */
    const boundAttributeSuffix = '$lit$';
    /**
     * An updateable Template that tracks the location of dynamic parts.
     */
    class Template {
        constructor(result, element) {
            this.parts = [];
            this.element = element;
            let index = -1;
            let partIndex = 0;
            const nodesToRemove = [];
            const _prepareTemplate = (template) => {
                const content = template.content;
                // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
                // null
                const walker = document.createTreeWalker(content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
                // Keeps track of the last index associated with a part. We try to delete
                // unnecessary nodes, but we never want to associate two different parts
                // to the same index. They must have a constant node between.
                let lastPartIndex = 0;
                while (walker.nextNode()) {
                    index++;
                    const node = walker.currentNode;
                    if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                        if (node.hasAttributes()) {
                            const attributes = node.attributes;
                            // Per
                            // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                            // attributes are not guaranteed to be returned in document order.
                            // In particular, Edge/IE can return them out of order, so we cannot
                            // assume a correspondance between part index and attribute index.
                            let count = 0;
                            for (let i = 0; i < attributes.length; i++) {
                                if (attributes[i].value.indexOf(marker) >= 0) {
                                    count++;
                                }
                            }
                            while (count-- > 0) {
                                // Get the template literal section leading up to the first
                                // expression in this attribute
                                const stringForPart = result.strings[partIndex];
                                // Find the attribute name
                                const name = lastAttributeNameRegex.exec(stringForPart)[2];
                                // Find the corresponding attribute
                                // All bound attributes have had a suffix added in
                                // TemplateResult#getHTML to opt out of special attribute
                                // handling. To look up the attribute value we also need to add
                                // the suffix.
                                const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                                const attributeValue = node.getAttribute(attributeLookupName);
                                const strings = attributeValue.split(markerRegex);
                                this.parts.push({ type: 'attribute', index, name, strings });
                                node.removeAttribute(attributeLookupName);
                                partIndex += strings.length - 1;
                            }
                        }
                        if (node.tagName === 'TEMPLATE') {
                            _prepareTemplate(node);
                        }
                    }
                    else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                        const data = node.data;
                        if (data.indexOf(marker) >= 0) {
                            const parent = node.parentNode;
                            const strings = data.split(markerRegex);
                            const lastIndex = strings.length - 1;
                            // Generate a new text node for each literal section
                            // These nodes are also used as the markers for node parts
                            for (let i = 0; i < lastIndex; i++) {
                                parent.insertBefore((strings[i] === '') ? createMarker() :
                                    document.createTextNode(strings[i]), node);
                                this.parts.push({ type: 'node', index: ++index });
                            }
                            // If there's no text, we must insert a comment to mark our place.
                            // Else, we can trust it will stick around after cloning.
                            if (strings[lastIndex] === '') {
                                parent.insertBefore(createMarker(), node);
                                nodesToRemove.push(node);
                            }
                            else {
                                node.data = strings[lastIndex];
                            }
                            // We have a part for each match found
                            partIndex += lastIndex;
                        }
                    }
                    else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                        if (node.data === marker) {
                            const parent = node.parentNode;
                            // Add a new marker node to be the startNode of the Part if any of
                            // the following are true:
                            //  * We don't have a previousSibling
                            //  * The previousSibling is already the start of a previous part
                            if (node.previousSibling === null || index === lastPartIndex) {
                                index++;
                                parent.insertBefore(createMarker(), node);
                            }
                            lastPartIndex = index;
                            this.parts.push({ type: 'node', index });
                            // If we don't have a nextSibling, keep this node so we have an end.
                            // Else, we can remove it to save future costs.
                            if (node.nextSibling === null) {
                                node.data = '';
                            }
                            else {
                                nodesToRemove.push(node);
                                index--;
                            }
                            partIndex++;
                        }
                        else {
                            let i = -1;
                            while ((i = node.data.indexOf(marker, i + 1)) !==
                                -1) {
                                // Comment node has a binding marker inside, make an inactive part
                                // The binding won't work, but subsequent bindings will
                                // TODO (justinfagnani): consider whether it's even worth it to
                                // make bindings in comments work
                                this.parts.push({ type: 'node', index: -1 });
                            }
                        }
                    }
                }
            };
            _prepareTemplate(element);
            // Remove text binding nodes after the walk to not disturb the TreeWalker
            for (const n of nodesToRemove) {
                n.parentNode.removeChild(n);
            }
        }
    }
    const isTemplatePartActive = (part) => part.index !== -1;
    // Allows `document.createComment('')` to be renamed for a
    // small manual size-savings.
    const createMarker = () => document.createComment('');
    /**
     * This regex extracts the attribute name preceding an attribute-position
     * expression. It does this by matching the syntax allowed for attributes
     * against the string literal directly preceding the expression, assuming that
     * the expression is in an attribute-value position.
     *
     * See attributes in the HTML spec:
     * https://www.w3.org/TR/html5/syntax.html#attributes-0
     *
     * "\0-\x1F\x7F-\x9F" are Unicode control characters
     *
     * " \x09\x0a\x0c\x0d" are HTML space characters:
     * https://www.w3.org/TR/html5/infrastructure.html#space-character
     *
     * So an attribute is:
     *  * The name: any character except a control character, space character, ('),
     *    ("), ">", "=", or "/"
     *  * Followed by zero or more space characters
     *  * Followed by "="
     *  * Followed by zero or more space characters
     *  * Followed by:
     *    * Any character except space, ('), ("), "<", ">", "=", (`), or
     *    * (") then any non-("), or
     *    * (') then any non-(')
     */
    const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
    //# sourceMappingURL=template.js.map

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * An instance of a `Template` that can be attached to the DOM and updated
     * with new values.
     */
    class TemplateInstance {
        constructor(template, processor, options) {
            this._parts = [];
            this.template = template;
            this.processor = processor;
            this.options = options;
        }
        update(values) {
            let i = 0;
            for (const part of this._parts) {
                if (part !== undefined) {
                    part.setValue(values[i]);
                }
                i++;
            }
            for (const part of this._parts) {
                if (part !== undefined) {
                    part.commit();
                }
            }
        }
        _clone() {
            // When using the Custom Elements polyfill, clone the node, rather than
            // importing it, to keep the fragment in the template's document. This
            // leaves the fragment inert so custom elements won't upgrade and
            // potentially modify their contents by creating a polyfilled ShadowRoot
            // while we traverse the tree.
            const fragment = isCEPolyfill ?
                this.template.element.content.cloneNode(true) :
                document.importNode(this.template.element.content, true);
            const parts = this.template.parts;
            let partIndex = 0;
            let nodeIndex = 0;
            const _prepareInstance = (fragment) => {
                // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
                // null
                const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
                let node = walker.nextNode();
                // Loop through all the nodes and parts of a template
                while (partIndex < parts.length && node !== null) {
                    const part = parts[partIndex];
                    // Consecutive Parts may have the same node index, in the case of
                    // multiple bound attributes on an element. So each iteration we either
                    // increment the nodeIndex, if we aren't on a node with a part, or the
                    // partIndex if we are. By not incrementing the nodeIndex when we find a
                    // part, we allow for the next part to be associated with the current
                    // node if neccessasry.
                    if (!isTemplatePartActive(part)) {
                        this._parts.push(undefined);
                        partIndex++;
                    }
                    else if (nodeIndex === part.index) {
                        if (part.type === 'node') {
                            const part = this.processor.handleTextExpression(this.options);
                            part.insertAfterNode(node.previousSibling);
                            this._parts.push(part);
                        }
                        else {
                            this._parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
                        }
                        partIndex++;
                    }
                    else {
                        nodeIndex++;
                        if (node.nodeName === 'TEMPLATE') {
                            _prepareInstance(node.content);
                        }
                        node = walker.nextNode();
                    }
                }
            };
            _prepareInstance(fragment);
            if (isCEPolyfill) {
                document.adoptNode(fragment);
                customElements.upgrade(fragment);
            }
            return fragment;
        }
    }
    //# sourceMappingURL=template-instance.js.map

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * The return type of `html`, which holds a Template and the values from
     * interpolated expressions.
     */
    class TemplateResult {
        constructor(strings, values, type, processor) {
            this.strings = strings;
            this.values = values;
            this.type = type;
            this.processor = processor;
        }
        /**
         * Returns a string of HTML used to create a `<template>` element.
         */
        getHTML() {
            const endIndex = this.strings.length - 1;
            let html = '';
            for (let i = 0; i < endIndex; i++) {
                const s = this.strings[i];
                // This exec() call does two things:
                // 1) Appends a suffix to the bound attribute name to opt out of special
                // attribute value parsing that IE11 and Edge do, like for style and
                // many SVG attributes. The Template class also appends the same suffix
                // when looking up attributes to create Parts.
                // 2) Adds an unquoted-attribute-safe marker for the first expression in
                // an attribute. Subsequent attribute expressions will use node markers,
                // and this is safe since attributes with multiple expressions are
                // guaranteed to be quoted.
                const match = lastAttributeNameRegex.exec(s);
                if (match) {
                    // We're starting a new bound attribute.
                    // Add the safe attribute suffix, and use unquoted-attribute-safe
                    // marker.
                    html += s.substr(0, match.index) + match[1] + match[2] +
                        boundAttributeSuffix + match[3] + marker;
                }
                else {
                    // We're either in a bound node, or trailing bound attribute.
                    // Either way, nodeMarker is safe to use.
                    html += s + nodeMarker;
                }
            }
            return html + this.strings[endIndex];
        }
        getTemplateElement() {
            const template = document.createElement('template');
            template.innerHTML = this.getHTML();
            return template;
        }
    }
    //# sourceMappingURL=template-result.js.map

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const isPrimitive = (value) => {
        return (value === null ||
            !(typeof value === 'object' || typeof value === 'function'));
    };
    /**
     * Sets attribute values for AttributeParts, so that the value is only set once
     * even if there are multiple parts for an attribute.
     */
    class AttributeCommitter {
        constructor(element, name, strings) {
            this.dirty = true;
            this.element = element;
            this.name = name;
            this.strings = strings;
            this.parts = [];
            for (let i = 0; i < strings.length - 1; i++) {
                this.parts[i] = this._createPart();
            }
        }
        /**
         * Creates a single part. Override this to create a differnt type of part.
         */
        _createPart() {
            return new AttributePart(this);
        }
        _getValue() {
            const strings = this.strings;
            const l = strings.length - 1;
            let text = '';
            for (let i = 0; i < l; i++) {
                text += strings[i];
                const part = this.parts[i];
                if (part !== undefined) {
                    const v = part.value;
                    if (v != null &&
                        (Array.isArray(v) ||
                            // tslint:disable-next-line:no-any
                            typeof v !== 'string' && v[Symbol.iterator])) {
                        for (const t of v) {
                            text += typeof t === 'string' ? t : String(t);
                        }
                    }
                    else {
                        text += typeof v === 'string' ? v : String(v);
                    }
                }
            }
            text += strings[l];
            return text;
        }
        commit() {
            if (this.dirty) {
                this.dirty = false;
                this.element.setAttribute(this.name, this._getValue());
            }
        }
    }
    class AttributePart {
        constructor(comitter) {
            this.value = undefined;
            this.committer = comitter;
        }
        setValue(value) {
            if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
                this.value = value;
                // If the value is a not a directive, dirty the committer so that it'll
                // call setAttribute. If the value is a directive, it'll dirty the
                // committer if it calls setValue().
                if (!isDirective(value)) {
                    this.committer.dirty = true;
                }
            }
        }
        commit() {
            while (isDirective(this.value)) {
                const directive = this.value;
                this.value = noChange;
                directive(this);
            }
            if (this.value === noChange) {
                return;
            }
            this.committer.commit();
        }
    }
    class NodePart {
        constructor(options) {
            this.value = undefined;
            this._pendingValue = undefined;
            this.options = options;
        }
        /**
         * Inserts this part into a container.
         *
         * This part must be empty, as its contents are not automatically moved.
         */
        appendInto(container) {
            this.startNode = container.appendChild(createMarker());
            this.endNode = container.appendChild(createMarker());
        }
        /**
         * Inserts this part between `ref` and `ref`'s next sibling. Both `ref` and
         * its next sibling must be static, unchanging nodes such as those that appear
         * in a literal section of a template.
         *
         * This part must be empty, as its contents are not automatically moved.
         */
        insertAfterNode(ref) {
            this.startNode = ref;
            this.endNode = ref.nextSibling;
        }
        /**
         * Appends this part into a parent part.
         *
         * This part must be empty, as its contents are not automatically moved.
         */
        appendIntoPart(part) {
            part._insert(this.startNode = createMarker());
            part._insert(this.endNode = createMarker());
        }
        /**
         * Appends this part after `ref`
         *
         * This part must be empty, as its contents are not automatically moved.
         */
        insertAfterPart(ref) {
            ref._insert(this.startNode = createMarker());
            this.endNode = ref.endNode;
            ref.endNode = this.startNode;
        }
        setValue(value) {
            this._pendingValue = value;
        }
        commit() {
            while (isDirective(this._pendingValue)) {
                const directive = this._pendingValue;
                this._pendingValue = noChange;
                directive(this);
            }
            const value = this._pendingValue;
            if (value === noChange) {
                return;
            }
            if (isPrimitive(value)) {
                if (value !== this.value) {
                    this._commitText(value);
                }
            }
            else if (value instanceof TemplateResult) {
                this._commitTemplateResult(value);
            }
            else if (value instanceof Node) {
                this._commitNode(value);
            }
            else if (Array.isArray(value) ||
                // tslint:disable-next-line:no-any
                value[Symbol.iterator]) {
                this._commitIterable(value);
            }
            else if (value === nothing) {
                this.value = nothing;
                this.clear();
            }
            else {
                // Fallback, will render the string representation
                this._commitText(value);
            }
        }
        _insert(node) {
            this.endNode.parentNode.insertBefore(node, this.endNode);
        }
        _commitNode(value) {
            if (this.value === value) {
                return;
            }
            this.clear();
            this._insert(value);
            this.value = value;
        }
        _commitText(value) {
            const node = this.startNode.nextSibling;
            value = value == null ? '' : value;
            if (node === this.endNode.previousSibling &&
                node.nodeType === 3 /* Node.TEXT_NODE */) {
                // If we only have a single text node between the markers, we can just
                // set its value, rather than replacing it.
                // TODO(justinfagnani): Can we just check if this.value is primitive?
                node.data = value;
            }
            else {
                this._commitNode(document.createTextNode(typeof value === 'string' ? value : String(value)));
            }
            this.value = value;
        }
        _commitTemplateResult(value) {
            const template = this.options.templateFactory(value);
            if (this.value instanceof TemplateInstance &&
                this.value.template === template) {
                this.value.update(value.values);
            }
            else {
                // Make sure we propagate the template processor from the TemplateResult
                // so that we use its syntax extension, etc. The template factory comes
                // from the render function options so that it can control template
                // caching and preprocessing.
                const instance = new TemplateInstance(template, value.processor, this.options);
                const fragment = instance._clone();
                instance.update(value.values);
                this._commitNode(fragment);
                this.value = instance;
            }
        }
        _commitIterable(value) {
            // For an Iterable, we create a new InstancePart per item, then set its
            // value to the item. This is a little bit of overhead for every item in
            // an Iterable, but it lets us recurse easily and efficiently update Arrays
            // of TemplateResults that will be commonly returned from expressions like:
            // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
            // If _value is an array, then the previous render was of an
            // iterable and _value will contain the NodeParts from the previous
            // render. If _value is not an array, clear this part and make a new
            // array for NodeParts.
            if (!Array.isArray(this.value)) {
                this.value = [];
                this.clear();
            }
            // Lets us keep track of how many items we stamped so we can clear leftover
            // items from a previous render
            const itemParts = this.value;
            let partIndex = 0;
            let itemPart;
            for (const item of value) {
                // Try to reuse an existing part
                itemPart = itemParts[partIndex];
                // If no existing part, create a new one
                if (itemPart === undefined) {
                    itemPart = new NodePart(this.options);
                    itemParts.push(itemPart);
                    if (partIndex === 0) {
                        itemPart.appendIntoPart(this);
                    }
                    else {
                        itemPart.insertAfterPart(itemParts[partIndex - 1]);
                    }
                }
                itemPart.setValue(item);
                itemPart.commit();
                partIndex++;
            }
            if (partIndex < itemParts.length) {
                // Truncate the parts array so _value reflects the current state
                itemParts.length = partIndex;
                this.clear(itemPart && itemPart.endNode);
            }
        }
        clear(startNode = this.startNode) {
            removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
        }
    }
    /**
     * Implements a boolean attribute, roughly as defined in the HTML
     * specification.
     *
     * If the value is truthy, then the attribute is present with a value of
     * ''. If the value is falsey, the attribute is removed.
     */
    class BooleanAttributePart {
        constructor(element, name, strings) {
            this.value = undefined;
            this._pendingValue = undefined;
            if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
                throw new Error('Boolean attributes can only contain a single expression');
            }
            this.element = element;
            this.name = name;
            this.strings = strings;
        }
        setValue(value) {
            this._pendingValue = value;
        }
        commit() {
            while (isDirective(this._pendingValue)) {
                const directive = this._pendingValue;
                this._pendingValue = noChange;
                directive(this);
            }
            if (this._pendingValue === noChange) {
                return;
            }
            const value = !!this._pendingValue;
            if (this.value !== value) {
                if (value) {
                    this.element.setAttribute(this.name, '');
                }
                else {
                    this.element.removeAttribute(this.name);
                }
            }
            this.value = value;
            this._pendingValue = noChange;
        }
    }
    /**
     * Sets attribute values for PropertyParts, so that the value is only set once
     * even if there are multiple parts for a property.
     *
     * If an expression controls the whole property value, then the value is simply
     * assigned to the property under control. If there are string literals or
     * multiple expressions, then the strings are expressions are interpolated into
     * a string first.
     */
    class PropertyCommitter extends AttributeCommitter {
        constructor(element, name, strings) {
            super(element, name, strings);
            this.single =
                (strings.length === 2 && strings[0] === '' && strings[1] === '');
        }
        _createPart() {
            return new PropertyPart(this);
        }
        _getValue() {
            if (this.single) {
                return this.parts[0].value;
            }
            return super._getValue();
        }
        commit() {
            if (this.dirty) {
                this.dirty = false;
                // tslint:disable-next-line:no-any
                this.element[this.name] = this._getValue();
            }
        }
    }
    class PropertyPart extends AttributePart {
    }
    // Detect event listener options support. If the `capture` property is read
    // from the options object, then options are supported. If not, then the thrid
    // argument to add/removeEventListener is interpreted as the boolean capture
    // value so we should only pass the `capture` property.
    let eventOptionsSupported = false;
    try {
        const options = {
            get capture() {
                eventOptionsSupported = true;
                return false;
            }
        };
        // tslint:disable-next-line:no-any
        window.addEventListener('test', options, options);
        // tslint:disable-next-line:no-any
        window.removeEventListener('test', options, options);
    }
    catch (_e) {
    }
    class EventPart {
        constructor(element, eventName, eventContext) {
            this.value = undefined;
            this._pendingValue = undefined;
            this.element = element;
            this.eventName = eventName;
            this.eventContext = eventContext;
            this._boundHandleEvent = (e) => this.handleEvent(e);
        }
        setValue(value) {
            this._pendingValue = value;
        }
        commit() {
            while (isDirective(this._pendingValue)) {
                const directive = this._pendingValue;
                this._pendingValue = noChange;
                directive(this);
            }
            if (this._pendingValue === noChange) {
                return;
            }
            const newListener = this._pendingValue;
            const oldListener = this.value;
            const shouldRemoveListener = newListener == null ||
                oldListener != null &&
                    (newListener.capture !== oldListener.capture ||
                        newListener.once !== oldListener.once ||
                        newListener.passive !== oldListener.passive);
            const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
            if (shouldRemoveListener) {
                this.element.removeEventListener(this.eventName, this._boundHandleEvent, this._options);
            }
            if (shouldAddListener) {
                this._options = getOptions(newListener);
                this.element.addEventListener(this.eventName, this._boundHandleEvent, this._options);
            }
            this.value = newListener;
            this._pendingValue = noChange;
        }
        handleEvent(event) {
            if (typeof this.value === 'function') {
                this.value.call(this.eventContext || this.element, event);
            }
            else {
                this.value.handleEvent(event);
            }
        }
    }
    // We copy options because of the inconsistent behavior of browsers when reading
    // the third argument of add/removeEventListener. IE11 doesn't support options
    // at all. Chrome 41 only reads `capture` if the argument is an object.
    const getOptions = (o) => o &&
        (eventOptionsSupported ?
            { capture: o.capture, passive: o.passive, once: o.once } :
            o.capture);
    //# sourceMappingURL=parts.js.map

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * Creates Parts when a template is instantiated.
     */
    class DefaultTemplateProcessor {
        /**
         * Create parts for an attribute-position binding, given the event, attribute
         * name, and string literals.
         *
         * @param element The element containing the binding
         * @param name  The attribute name
         * @param strings The string literals. There are always at least two strings,
         *   event for fully-controlled bindings with a single expression.
         */
        handleAttributeExpressions(element, name, strings, options) {
            const prefix = name[0];
            if (prefix === '.') {
                const comitter = new PropertyCommitter(element, name.slice(1), strings);
                return comitter.parts;
            }
            if (prefix === '@') {
                return [new EventPart(element, name.slice(1), options.eventContext)];
            }
            if (prefix === '?') {
                return [new BooleanAttributePart(element, name.slice(1), strings)];
            }
            const comitter = new AttributeCommitter(element, name, strings);
            return comitter.parts;
        }
        /**
         * Create parts for a text-position binding.
         * @param templateFactory
         */
        handleTextExpression(options) {
            return new NodePart(options);
        }
    }
    const defaultTemplateProcessor = new DefaultTemplateProcessor();
    //# sourceMappingURL=default-template-processor.js.map

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * The default TemplateFactory which caches Templates keyed on
     * result.type and result.strings.
     */
    function templateFactory(result) {
        let templateCache = templateCaches.get(result.type);
        if (templateCache === undefined) {
            templateCache = {
                stringsArray: new WeakMap(),
                keyString: new Map()
            };
            templateCaches.set(result.type, templateCache);
        }
        let template = templateCache.stringsArray.get(result.strings);
        if (template !== undefined) {
            return template;
        }
        // If the TemplateStringsArray is new, generate a key from the strings
        // This key is shared between all templates with identical content
        const key = result.strings.join(marker);
        // Check if we already have a Template for this key
        template = templateCache.keyString.get(key);
        if (template === undefined) {
            // If we have not seen this key before, create a new Template
            template = new Template(result, result.getTemplateElement());
            // Cache the Template for this key
            templateCache.keyString.set(key, template);
        }
        // Cache all future queries for this TemplateStringsArray
        templateCache.stringsArray.set(result.strings, template);
        return template;
    }
    const templateCaches = new Map();
    //# sourceMappingURL=template-factory.js.map

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const parts = new WeakMap();
    /**
     * Renders a template to a container.
     *
     * To update a container with new values, reevaluate the template literal and
     * call `render` with the new result.
     *
     * @param result a TemplateResult created by evaluating a template tag like
     *     `html` or `svg`.
     * @param container A DOM parent to render to. The entire contents are either
     *     replaced, or efficiently updated if the same result type was previous
     *     rendered there.
     * @param options RenderOptions for the entire render tree rendered to this
     *     container. Render options must *not* change between renders to the same
     *     container, as those changes will not effect previously rendered DOM.
     */
    const render = (result, container, options) => {
        let part = parts.get(container);
        if (part === undefined) {
            removeNodes(container, container.firstChild);
            parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
            part.appendInto(container);
        }
        part.setValue(result);
        part.commit();
    };
    //# sourceMappingURL=render.js.map

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    // IMPORTANT: do not change the property name or the assignment expression.
    // This line will be used in regexes to search for lit-html usage.
    // TODO(justinfagnani): inject version number at build time
    (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.0.0');
    /**
     * Interprets a template literal as an HTML template that can efficiently
     * render to and update a container.
     */
    const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);
    //# sourceMappingURL=lit-html.js.map

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const walkerNodeFilter = 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */;
    /**
     * Removes the list of nodes from a Template safely. In addition to removing
     * nodes from the Template, the Template part indices are updated to match
     * the mutated Template DOM.
     *
     * As the template is walked the removal state is tracked and
     * part indices are adjusted as needed.
     *
     * div
     *   div#1 (remove) <-- start removing (removing node is div#1)
     *     div
     *       div#2 (remove)  <-- continue removing (removing node is still div#1)
     *         div
     * div <-- stop removing since previous sibling is the removing node (div#1,
     * removed 4 nodes)
     */
    function removeNodesFromTemplate(template, nodesToRemove) {
        const { element: { content }, parts } = template;
        const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
        let partIndex = nextActiveIndexInTemplateParts(parts);
        let part = parts[partIndex];
        let nodeIndex = -1;
        let removeCount = 0;
        const nodesToRemoveInTemplate = [];
        let currentRemovingNode = null;
        while (walker.nextNode()) {
            nodeIndex++;
            const node = walker.currentNode;
            // End removal if stepped past the removing node
            if (node.previousSibling === currentRemovingNode) {
                currentRemovingNode = null;
            }
            // A node to remove was found in the template
            if (nodesToRemove.has(node)) {
                nodesToRemoveInTemplate.push(node);
                // Track node we're removing
                if (currentRemovingNode === null) {
                    currentRemovingNode = node;
                }
            }
            // When removing, increment count by which to adjust subsequent part indices
            if (currentRemovingNode !== null) {
                removeCount++;
            }
            while (part !== undefined && part.index === nodeIndex) {
                // If part is in a removed node deactivate it by setting index to -1 or
                // adjust the index as needed.
                part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
                // go to the next active part.
                partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                part = parts[partIndex];
            }
        }
        nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
    }
    const countNodes = (node) => {
        let count = (node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */) ? 0 : 1;
        const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
        while (walker.nextNode()) {
            count++;
        }
        return count;
    };
    const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
        for (let i = startIndex + 1; i < parts.length; i++) {
            const part = parts[i];
            if (isTemplatePartActive(part)) {
                return i;
            }
        }
        return -1;
    };
    /**
     * Inserts the given node into the Template, optionally before the given
     * refNode. In addition to inserting the node into the Template, the Template
     * part indices are updated to match the mutated Template DOM.
     */
    function insertNodeIntoTemplate(template, node, refNode = null) {
        const { element: { content }, parts } = template;
        // If there's no refNode, then put node at end of template.
        // No part indices need to be shifted in this case.
        if (refNode === null || refNode === undefined) {
            content.appendChild(node);
            return;
        }
        const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
        let partIndex = nextActiveIndexInTemplateParts(parts);
        let insertCount = 0;
        let walkerIndex = -1;
        while (walker.nextNode()) {
            walkerIndex++;
            const walkerNode = walker.currentNode;
            if (walkerNode === refNode) {
                insertCount = countNodes(node);
                refNode.parentNode.insertBefore(node, refNode);
            }
            while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
                // If we've inserted the node, simply adjust all subsequent parts
                if (insertCount > 0) {
                    while (partIndex !== -1) {
                        parts[partIndex].index += insertCount;
                        partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                    }
                    return;
                }
                partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
            }
        }
    }
    //# sourceMappingURL=modify-template.js.map

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    // Get a key to lookup in `templateCaches`.
    const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
    let compatibleShadyCSSVersion = true;
    if (typeof window.ShadyCSS === 'undefined') {
        compatibleShadyCSSVersion = false;
    }
    else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
        console.warn(`Incompatible ShadyCSS version detected.` +
            `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and` +
            `@webcomponents/shadycss@1.3.1.`);
        compatibleShadyCSSVersion = false;
    }
    /**
     * Template factory which scopes template DOM using ShadyCSS.
     * @param scopeName {string}
     */
    const shadyTemplateFactory = (scopeName) => (result) => {
        const cacheKey = getTemplateCacheKey(result.type, scopeName);
        let templateCache = templateCaches.get(cacheKey);
        if (templateCache === undefined) {
            templateCache = {
                stringsArray: new WeakMap(),
                keyString: new Map()
            };
            templateCaches.set(cacheKey, templateCache);
        }
        let template = templateCache.stringsArray.get(result.strings);
        if (template !== undefined) {
            return template;
        }
        const key = result.strings.join(marker);
        template = templateCache.keyString.get(key);
        if (template === undefined) {
            const element = result.getTemplateElement();
            if (compatibleShadyCSSVersion) {
                window.ShadyCSS.prepareTemplateDom(element, scopeName);
            }
            template = new Template(result, element);
            templateCache.keyString.set(key, template);
        }
        templateCache.stringsArray.set(result.strings, template);
        return template;
    };
    const TEMPLATE_TYPES = ['html', 'svg'];
    /**
     * Removes all style elements from Templates for the given scopeName.
     */
    const removeStylesFromLitTemplates = (scopeName) => {
        TEMPLATE_TYPES.forEach((type) => {
            const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));
            if (templates !== undefined) {
                templates.keyString.forEach((template) => {
                    const { element: { content } } = template;
                    // IE 11 doesn't support the iterable param Set constructor
                    const styles = new Set();
                    Array.from(content.querySelectorAll('style')).forEach((s) => {
                        styles.add(s);
                    });
                    removeNodesFromTemplate(template, styles);
                });
            }
        });
    };
    const shadyRenderSet = new Set();
    /**
     * For the given scope name, ensures that ShadyCSS style scoping is performed.
     * This is done just once per scope name so the fragment and template cannot
     * be modified.
     * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
     * to be scoped and appended to the document
     * (2) removes style elements from all lit-html Templates for this scope name.
     *
     * Note, <style> elements can only be placed into templates for the
     * initial rendering of the scope. If <style> elements are included in templates
     * dynamically rendered to the scope (after the first scope render), they will
     * not be scoped and the <style> will be left in the template and rendered
     * output.
     */
    const prepareTemplateStyles = (renderedDOM, template, scopeName) => {
        shadyRenderSet.add(scopeName);
        // Move styles out of rendered DOM and store.
        const styles = renderedDOM.querySelectorAll('style');
        // If there are no styles, skip unnecessary work
        if (styles.length === 0) {
            // Ensure prepareTemplateStyles is called to support adding
            // styles via `prepareAdoptedCssText` since that requires that
            // `prepareTemplateStyles` is called.
            window.ShadyCSS.prepareTemplateStyles(template.element, scopeName);
            return;
        }
        const condensedStyle = document.createElement('style');
        // Collect styles into a single style. This helps us make sure ShadyCSS
        // manipulations will not prevent us from being able to fix up template
        // part indices.
        // NOTE: collecting styles is inefficient for browsers but ShadyCSS
        // currently does this anyway. When it does not, this should be changed.
        for (let i = 0; i < styles.length; i++) {
            const style = styles[i];
            style.parentNode.removeChild(style);
            condensedStyle.textContent += style.textContent;
        }
        // Remove styles from nested templates in this scope.
        removeStylesFromLitTemplates(scopeName);
        // And then put the condensed style into the "root" template passed in as
        // `template`.
        insertNodeIntoTemplate(template, condensedStyle, template.element.content.firstChild);
        // Note, it's important that ShadyCSS gets the template that `lit-html`
        // will actually render so that it can update the style inside when
        // needed (e.g. @apply native Shadow DOM case).
        window.ShadyCSS.prepareTemplateStyles(template.element, scopeName);
        if (window.ShadyCSS.nativeShadow) {
            // When in native Shadow DOM, re-add styling to rendered content using
            // the style ShadyCSS produced.
            const style = template.element.content.querySelector('style');
            renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
        }
        else {
            // When not in native Shadow DOM, at this point ShadyCSS will have
            // removed the style from the lit template and parts will be broken as a
            // result. To fix this, we put back the style node ShadyCSS removed
            // and then tell lit to remove that node from the template.
            // NOTE, ShadyCSS creates its own style so we can safely add/remove
            // `condensedStyle` here.
            template.element.content.insertBefore(condensedStyle, template.element.content.firstChild);
            const removes = new Set();
            removes.add(condensedStyle);
            removeNodesFromTemplate(template, removes);
        }
    };
    /**
     * Extension to the standard `render` method which supports rendering
     * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
     * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
     * or when the webcomponentsjs
     * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
     *
     * Adds a `scopeName` option which is used to scope element DOM and stylesheets
     * when native ShadowDOM is unavailable. The `scopeName` will be added to
     * the class attribute of all rendered DOM. In addition, any style elements will
     * be automatically re-written with this `scopeName` selector and moved out
     * of the rendered DOM and into the document `<head>`.
     *
     * It is common to use this render method in conjunction with a custom element
     * which renders a shadowRoot. When this is done, typically the element's
     * `localName` should be used as the `scopeName`.
     *
     * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
     * custom properties (needed only on older browsers like IE11) and a shim for
     * a deprecated feature called `@apply` that supports applying a set of css
     * custom properties to a given location.
     *
     * Usage considerations:
     *
     * * Part values in `<style>` elements are only applied the first time a given
     * `scopeName` renders. Subsequent changes to parts in style elements will have
     * no effect. Because of this, parts in style elements should only be used for
     * values that will never change, for example parts that set scope-wide theme
     * values or parts which render shared style elements.
     *
     * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
     * custom element's `constructor` is not supported. Instead rendering should
     * either done asynchronously, for example at microtask timing (for example
     * `Promise.resolve()`), or be deferred until the first time the element's
     * `connectedCallback` runs.
     *
     * Usage considerations when using shimmed custom properties or `@apply`:
     *
     * * Whenever any dynamic changes are made which affect
     * css custom properties, `ShadyCSS.styleElement(element)` must be called
     * to update the element. There are two cases when this is needed:
     * (1) the element is connected to a new parent, (2) a class is added to the
     * element that causes it to match different custom properties.
     * To address the first case when rendering a custom element, `styleElement`
     * should be called in the element's `connectedCallback`.
     *
     * * Shimmed custom properties may only be defined either for an entire
     * shadowRoot (for example, in a `:host` rule) or via a rule that directly
     * matches an element with a shadowRoot. In other words, instead of flowing from
     * parent to child as do native css custom properties, shimmed custom properties
     * flow only from shadowRoots to nested shadowRoots.
     *
     * * When using `@apply` mixing css shorthand property names with
     * non-shorthand names (for example `border` and `border-width`) is not
     * supported.
     */
    const render$1 = (result, container, options) => {
        const scopeName = options.scopeName;
        const hasRendered = parts.has(container);
        const needsScoping = container instanceof ShadowRoot &&
            compatibleShadyCSSVersion && result instanceof TemplateResult;
        // Handle first render to a scope specially...
        const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
        // On first scope render, render into a fragment; this cannot be a single
        // fragment that is reused since nested renders can occur synchronously.
        const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
        render(result, renderContainer, Object.assign({ templateFactory: shadyTemplateFactory(scopeName) }, options));
        // When performing first scope render,
        // (1) We've rendered into a fragment so that there's a chance to
        // `prepareTemplateStyles` before sub-elements hit the DOM
        // (which might cause them to render based on a common pattern of
        // rendering in a custom element's `connectedCallback`);
        // (2) Scope the template with ShadyCSS one time only for this scope.
        // (3) Render the fragment into the container and make sure the
        // container knows its `part` is the one we just rendered. This ensures
        // DOM will be re-used on subsequent renders.
        if (firstScopeRender) {
            const part = parts.get(renderContainer);
            parts.delete(renderContainer);
            if (part.value instanceof TemplateInstance) {
                prepareTemplateStyles(renderContainer, part.value.template, scopeName);
            }
            removeNodes(container, container.firstChild);
            container.appendChild(renderContainer);
            parts.set(container, part);
        }
        // After elements have hit the DOM, update styling if this is the
        // initial render to this container.
        // This is needed whenever dynamic changes are made so it would be
        // safest to do every render; however, this would regress performance
        // so we leave it up to the user to call `ShadyCSSS.styleElement`
        // for dynamic changes.
        if (!hasRendered && needsScoping) {
            window.ShadyCSS.styleElement(container.host);
        }
    };
    //# sourceMappingURL=shady-render.js.map

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
     * replaced at compile time by the munged name for object[property]. We cannot
     * alias this function, so we have to use a small shim that has the same
     * behavior when not compiling.
     */
    window.JSCompiler_renameProperty =
        (prop, _obj) => prop;
    const defaultConverter = {
        toAttribute(value, type) {
            switch (type) {
                case Boolean:
                    return value ? '' : null;
                case Object:
                case Array:
                    // if the value is `null` or `undefined` pass this through
                    // to allow removing/no change behavior.
                    return value == null ? value : JSON.stringify(value);
            }
            return value;
        },
        fromAttribute(value, type) {
            switch (type) {
                case Boolean:
                    return value !== null;
                case Number:
                    return value === null ? null : Number(value);
                case Object:
                case Array:
                    return JSON.parse(value);
            }
            return value;
        }
    };
    /**
     * Change function that returns true if `value` is different from `oldValue`.
     * This method is used as the default for a property's `hasChanged` function.
     */
    const notEqual = (value, old) => {
        // This ensures (old==NaN, value==NaN) always returns false
        return old !== value && (old === old || value === value);
    };
    const defaultPropertyDeclaration = {
        attribute: true,
        type: String,
        converter: defaultConverter,
        reflect: false,
        hasChanged: notEqual
    };
    const microtaskPromise = Promise.resolve(true);
    const STATE_HAS_UPDATED = 1;
    const STATE_UPDATE_REQUESTED = 1 << 2;
    const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
    const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
    const STATE_HAS_CONNECTED = 1 << 5;
    /**
     * Base element class which manages element properties and attributes. When
     * properties change, the `update` method is asynchronously called. This method
     * should be supplied by subclassers to render updates as desired.
     */
    class UpdatingElement extends HTMLElement {
        constructor() {
            super();
            this._updateState = 0;
            this._instanceProperties = undefined;
            this._updatePromise = microtaskPromise;
            this._hasConnectedResolver = undefined;
            /**
             * Map with keys for any properties that have changed since the last
             * update cycle with previous values.
             */
            this._changedProperties = new Map();
            /**
             * Map with keys of properties that should be reflected when updated.
             */
            this._reflectingProperties = undefined;
            this.initialize();
        }
        /**
         * Returns a list of attributes corresponding to the registered properties.
         * @nocollapse
         */
        static get observedAttributes() {
            // note: piggy backing on this to ensure we're finalized.
            this.finalize();
            const attributes = [];
            // Use forEach so this works even if for/of loops are compiled to for loops
            // expecting arrays
            this._classProperties.forEach((v, p) => {
                const attr = this._attributeNameForProperty(p, v);
                if (attr !== undefined) {
                    this._attributeToPropertyMap.set(attr, p);
                    attributes.push(attr);
                }
            });
            return attributes;
        }
        /**
         * Ensures the private `_classProperties` property metadata is created.
         * In addition to `finalize` this is also called in `createProperty` to
         * ensure the `@property` decorator can add property metadata.
         */
        /** @nocollapse */
        static _ensureClassProperties() {
            // ensure private storage for property declarations.
            if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
                this._classProperties = new Map();
                // NOTE: Workaround IE11 not supporting Map constructor argument.
                const superProperties = Object.getPrototypeOf(this)._classProperties;
                if (superProperties !== undefined) {
                    superProperties.forEach((v, k) => this._classProperties.set(k, v));
                }
            }
        }
        /**
         * Creates a property accessor on the element prototype if one does not exist.
         * The property setter calls the property's `hasChanged` property option
         * or uses a strict identity check to determine whether or not to request
         * an update.
         * @nocollapse
         */
        static createProperty(name, options = defaultPropertyDeclaration) {
            // Note, since this can be called by the `@property` decorator which
            // is called before `finalize`, we ensure storage exists for property
            // metadata.
            this._ensureClassProperties();
            this._classProperties.set(name, options);
            // Do not generate an accessor if the prototype already has one, since
            // it would be lost otherwise and that would never be the user's intention;
            // Instead, we expect users to call `requestUpdate` themselves from
            // user-defined accessors. Note that if the super has an accessor we will
            // still overwrite it
            if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
                return;
            }
            const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
            Object.defineProperty(this.prototype, name, {
                // tslint:disable-next-line:no-any no symbol in index
                get() {
                    // tslint:disable-next-line:no-any no symbol in index
                    return this[key];
                },
                set(value) {
                    // tslint:disable-next-line:no-any no symbol in index
                    const oldValue = this[name];
                    // tslint:disable-next-line:no-any no symbol in index
                    this[key] = value;
                    this.requestUpdate(name, oldValue);
                },
                configurable: true,
                enumerable: true
            });
        }
        /**
         * Creates property accessors for registered properties and ensures
         * any superclasses are also finalized.
         * @nocollapse
         */
        static finalize() {
            if (this.hasOwnProperty(JSCompiler_renameProperty('finalized', this)) &&
                this.finalized) {
                return;
            }
            // finalize any superclasses
            const superCtor = Object.getPrototypeOf(this);
            if (typeof superCtor.finalize === 'function') {
                superCtor.finalize();
            }
            this.finalized = true;
            this._ensureClassProperties();
            // initialize Map populated in observedAttributes
            this._attributeToPropertyMap = new Map();
            // make any properties
            // Note, only process "own" properties since this element will inherit
            // any properties defined on the superClass, and finalization ensures
            // the entire prototype chain is finalized.
            if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
                const props = this.properties;
                // support symbols in properties (IE11 does not support this)
                const propKeys = [
                    ...Object.getOwnPropertyNames(props),
                    ...(typeof Object.getOwnPropertySymbols === 'function') ?
                        Object.getOwnPropertySymbols(props) :
                        []
                ];
                // This for/of is ok because propKeys is an array
                for (const p of propKeys) {
                    // note, use of `any` is due to TypeSript lack of support for symbol in
                    // index types
                    // tslint:disable-next-line:no-any no symbol in index
                    this.createProperty(p, props[p]);
                }
            }
        }
        /**
         * Returns the property name for the given attribute `name`.
         * @nocollapse
         */
        static _attributeNameForProperty(name, options) {
            const attribute = options.attribute;
            return attribute === false ?
                undefined :
                (typeof attribute === 'string' ?
                    attribute :
                    (typeof name === 'string' ? name.toLowerCase() : undefined));
        }
        /**
         * Returns true if a property should request an update.
         * Called when a property value is set and uses the `hasChanged`
         * option for the property if present or a strict identity check.
         * @nocollapse
         */
        static _valueHasChanged(value, old, hasChanged = notEqual) {
            return hasChanged(value, old);
        }
        /**
         * Returns the property value for the given attribute value.
         * Called via the `attributeChangedCallback` and uses the property's
         * `converter` or `converter.fromAttribute` property option.
         * @nocollapse
         */
        static _propertyValueFromAttribute(value, options) {
            const type = options.type;
            const converter = options.converter || defaultConverter;
            const fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
            return fromAttribute ? fromAttribute(value, type) : value;
        }
        /**
         * Returns the attribute value for the given property value. If this
         * returns undefined, the property will *not* be reflected to an attribute.
         * If this returns null, the attribute will be removed, otherwise the
         * attribute will be set to the value.
         * This uses the property's `reflect` and `type.toAttribute` property options.
         * @nocollapse
         */
        static _propertyValueToAttribute(value, options) {
            if (options.reflect === undefined) {
                return;
            }
            const type = options.type;
            const converter = options.converter;
            const toAttribute = converter && converter.toAttribute ||
                defaultConverter.toAttribute;
            return toAttribute(value, type);
        }
        /**
         * Performs element initialization. By default captures any pre-set values for
         * registered properties.
         */
        initialize() {
            this._saveInstanceProperties();
        }
        /**
         * Fixes any properties set on the instance before upgrade time.
         * Otherwise these would shadow the accessor and break these properties.
         * The properties are stored in a Map which is played back after the
         * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
         * (<=41), properties created for native platform properties like (`id` or
         * `name`) may not have default values set in the element constructor. On
         * these browsers native properties appear on instances and therefore their
         * default value will overwrite any element default (e.g. if the element sets
         * this.id = 'id' in the constructor, the 'id' will become '' since this is
         * the native platform default).
         */
        _saveInstanceProperties() {
            // Use forEach so this works even if for/of loops are compiled to for loops
            // expecting arrays
            this.constructor
                ._classProperties.forEach((_v, p) => {
                if (this.hasOwnProperty(p)) {
                    const value = this[p];
                    delete this[p];
                    if (!this._instanceProperties) {
                        this._instanceProperties = new Map();
                    }
                    this._instanceProperties.set(p, value);
                }
            });
        }
        /**
         * Applies previously saved instance properties.
         */
        _applyInstanceProperties() {
            // Use forEach so this works even if for/of loops are compiled to for loops
            // expecting arrays
            // tslint:disable-next-line:no-any
            this._instanceProperties.forEach((v, p) => this[p] = v);
            this._instanceProperties = undefined;
        }
        connectedCallback() {
            this._updateState = this._updateState | STATE_HAS_CONNECTED;
            // Ensure connection triggers an update. Updates cannot complete before
            // connection and if one is pending connection the `_hasConnectionResolver`
            // will exist. If so, resolve it to complete the update, otherwise
            // requestUpdate.
            if (this._hasConnectedResolver) {
                this._hasConnectedResolver();
                this._hasConnectedResolver = undefined;
            }
            else {
                this.requestUpdate();
            }
        }
        /**
         * Allows for `super.disconnectedCallback()` in extensions while
         * reserving the possibility of making non-breaking feature additions
         * when disconnecting at some point in the future.
         */
        disconnectedCallback() {
        }
        /**
         * Synchronizes property values when attributes change.
         */
        attributeChangedCallback(name, old, value) {
            if (old !== value) {
                this._attributeToProperty(name, value);
            }
        }
        _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
            const ctor = this.constructor;
            const attr = ctor._attributeNameForProperty(name, options);
            if (attr !== undefined) {
                const attrValue = ctor._propertyValueToAttribute(value, options);
                // an undefined value does not change the attribute.
                if (attrValue === undefined) {
                    return;
                }
                // Track if the property is being reflected to avoid
                // setting the property again via `attributeChangedCallback`. Note:
                // 1. this takes advantage of the fact that the callback is synchronous.
                // 2. will behave incorrectly if multiple attributes are in the reaction
                // stack at time of calling. However, since we process attributes
                // in `update` this should not be possible (or an extreme corner case
                // that we'd like to discover).
                // mark state reflecting
                this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
                if (attrValue == null) {
                    this.removeAttribute(attr);
                }
                else {
                    this.setAttribute(attr, attrValue);
                }
                // mark state not reflecting
                this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
            }
        }
        _attributeToProperty(name, value) {
            // Use tracking info to avoid deserializing attribute value if it was
            // just set from a property setter.
            if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
                return;
            }
            const ctor = this.constructor;
            const propName = ctor._attributeToPropertyMap.get(name);
            if (propName !== undefined) {
                const options = ctor._classProperties.get(propName) || defaultPropertyDeclaration;
                // mark state reflecting
                this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
                this[propName] =
                    // tslint:disable-next-line:no-any
                    ctor._propertyValueFromAttribute(value, options);
                // mark state not reflecting
                this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
            }
        }
        /**
         * Requests an update which is processed asynchronously. This should
         * be called when an element should update based on some state not triggered
         * by setting a property. In this case, pass no arguments. It should also be
         * called when manually implementing a property setter. In this case, pass the
         * property `name` and `oldValue` to ensure that any configured property
         * options are honored. Returns the `updateComplete` Promise which is resolved
         * when the update completes.
         *
         * @param name {PropertyKey} (optional) name of requesting property
         * @param oldValue {any} (optional) old value of requesting property
         * @returns {Promise} A Promise that is resolved when the update completes.
         */
        requestUpdate(name, oldValue) {
            let shouldRequestUpdate = true;
            // if we have a property key, perform property update steps.
            if (name !== undefined && !this._changedProperties.has(name)) {
                const ctor = this.constructor;
                const options = ctor._classProperties.get(name) || defaultPropertyDeclaration;
                if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
                    // track old value when changing.
                    this._changedProperties.set(name, oldValue);
                    // add to reflecting properties set
                    if (options.reflect === true &&
                        !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
                        if (this._reflectingProperties === undefined) {
                            this._reflectingProperties = new Map();
                        }
                        this._reflectingProperties.set(name, options);
                    }
                    // abort the request if the property should not be considered changed.
                }
                else {
                    shouldRequestUpdate = false;
                }
            }
            if (!this._hasRequestedUpdate && shouldRequestUpdate) {
                this._enqueueUpdate();
            }
            return this.updateComplete;
        }
        /**
         * Sets up the element to asynchronously update.
         */
        async _enqueueUpdate() {
            // Mark state updating...
            this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
            let resolve;
            const previousUpdatePromise = this._updatePromise;
            this._updatePromise = new Promise((res) => resolve = res);
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await previousUpdatePromise;
            // Make sure the element has connected before updating.
            if (!this._hasConnected) {
                await new Promise((res) => this._hasConnectedResolver = res);
            }
            // Allow `performUpdate` to be asynchronous to enable scheduling of updates.
            const result = this.performUpdate();
            // Note, this is to avoid delaying an additional microtask unless we need
            // to.
            if (result != null &&
                typeof result.then === 'function') {
                await result;
            }
            resolve(!this._hasRequestedUpdate);
        }
        get _hasConnected() {
            return (this._updateState & STATE_HAS_CONNECTED);
        }
        get _hasRequestedUpdate() {
            return (this._updateState & STATE_UPDATE_REQUESTED);
        }
        get hasUpdated() {
            return (this._updateState & STATE_HAS_UPDATED);
        }
        /**
         * Performs an element update.
         *
         * You can override this method to change the timing of updates. For instance,
         * to schedule updates to occur just before the next frame:
         *
         * ```
         * protected async performUpdate(): Promise<unknown> {
         *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
         *   super.performUpdate();
         * }
         * ```
         */
        performUpdate() {
            // Mixin instance properties once, if they exist.
            if (this._instanceProperties) {
                this._applyInstanceProperties();
            }
            if (this.shouldUpdate(this._changedProperties)) {
                const changedProperties = this._changedProperties;
                this.update(changedProperties);
                this._markUpdated();
                if (!(this._updateState & STATE_HAS_UPDATED)) {
                    this._updateState = this._updateState | STATE_HAS_UPDATED;
                    this.firstUpdated(changedProperties);
                }
                this.updated(changedProperties);
            }
            else {
                this._markUpdated();
            }
        }
        _markUpdated() {
            this._changedProperties = new Map();
            this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
        }
        /**
         * Returns a Promise that resolves when the element has completed updating.
         * The Promise value is a boolean that is `true` if the element completed the
         * update without triggering another update. The Promise result is `false` if
         * a property was set inside `updated()`. This getter can be implemented to
         * await additional state. For example, it is sometimes useful to await a
         * rendered element before fulfilling this Promise. To do this, first await
         * `super.updateComplete` then any subsequent state.
         *
         * @returns {Promise} The Promise returns a boolean that indicates if the
         * update resolved without triggering another update.
         */
        get updateComplete() {
            return this._updatePromise;
        }
        /**
         * Controls whether or not `update` should be called when the element requests
         * an update. By default, this method always returns `true`, but this can be
         * customized to control when to update.
         *
         * * @param _changedProperties Map of changed properties with old values
         */
        shouldUpdate(_changedProperties) {
            return true;
        }
        /**
         * Updates the element. This method reflects property values to attributes.
         * It can be overridden to render and keep updated element DOM.
         * Setting properties inside this method will *not* trigger
         * another update.
         *
         * * @param _changedProperties Map of changed properties with old values
         */
        update(_changedProperties) {
            if (this._reflectingProperties !== undefined &&
                this._reflectingProperties.size > 0) {
                // Use forEach so this works even if for/of loops are compiled to for
                // loops expecting arrays
                this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));
                this._reflectingProperties = undefined;
            }
        }
        /**
         * Invoked whenever the element is updated. Implement to perform
         * post-updating tasks via DOM APIs, for example, focusing an element.
         *
         * Setting properties inside this method will trigger the element to update
         * again after this update cycle completes.
         *
         * * @param _changedProperties Map of changed properties with old values
         */
        updated(_changedProperties) {
        }
        /**
         * Invoked when the element is first updated. Implement to perform one time
         * work on the element after update.
         *
         * Setting properties inside this method will trigger the element to update
         * again after this update cycle completes.
         *
         * * @param _changedProperties Map of changed properties with old values
         */
        firstUpdated(_changedProperties) {
        }
    }
    /**
     * Marks class as having finished creating properties.
     */
    UpdatingElement.finalized = true;
    //# sourceMappingURL=updating-element.js.map

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const legacyCustomElement = (tagName, clazz) => {
        window.customElements.define(tagName, clazz);
        // Cast as any because TS doesn't recognize the return type as being a
        // subtype of the decorated class when clazz is typed as
        // `Constructor<HTMLElement>` for some reason.
        // `Constructor<HTMLElement>` is helpful to make sure the decorator is
        // applied to elements however.
        // tslint:disable-next-line:no-any
        return clazz;
    };
    const standardCustomElement = (tagName, descriptor) => {
        const { kind, elements } = descriptor;
        return {
            kind,
            elements,
            // This callback is called once the class is otherwise fully defined
            finisher(clazz) {
                window.customElements.define(tagName, clazz);
            }
        };
    };
    /**
     * Class decorator factory that defines the decorated class as a custom element.
     *
     * @param tagName the name of the custom element to define
     */
    const customElement = (tagName) => (classOrDescriptor) => (typeof classOrDescriptor === 'function') ?
        legacyCustomElement(tagName, classOrDescriptor) :
        standardCustomElement(tagName, classOrDescriptor);
    const standardProperty = (options, element) => {
        // When decorating an accessor, pass it through and add property metadata.
        // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
        // stomp over the user's accessor.
        if (element.kind === 'method' && element.descriptor &&
            !('value' in element.descriptor)) {
            return Object.assign({}, element, { finisher(clazz) {
                    clazz.createProperty(element.key, options);
                } });
        }
        else {
            // createProperty() takes care of defining the property, but we still
            // must return some kind of descriptor, so return a descriptor for an
            // unused prototype field. The finisher calls createProperty().
            return {
                kind: 'field',
                key: Symbol(),
                placement: 'own',
                descriptor: {},
                // When @babel/plugin-proposal-decorators implements initializers,
                // do this instead of the initializer below. See:
                // https://github.com/babel/babel/issues/9260 extras: [
                //   {
                //     kind: 'initializer',
                //     placement: 'own',
                //     initializer: descriptor.initializer,
                //   }
                // ],
                // tslint:disable-next-line:no-any decorator
                initializer() {
                    if (typeof element.initializer === 'function') {
                        this[element.key] = element.initializer.call(this);
                    }
                },
                finisher(clazz) {
                    clazz.createProperty(element.key, options);
                }
            };
        }
    };
    const legacyProperty = (options, proto, name) => {
        proto.constructor
            .createProperty(name, options);
    };
    /**
     * A property decorator which creates a LitElement property which reflects a
     * corresponding attribute value. A `PropertyDeclaration` may optionally be
     * supplied to configure property features.
     *
     * @ExportDecoratedItems
     */
    function property(options) {
        // tslint:disable-next-line:no-any decorator
        return (protoOrDescriptor, name) => (name !== undefined) ?
            legacyProperty(options, protoOrDescriptor, name) :
            standardProperty(options, protoOrDescriptor);
    }
    //# sourceMappingURL=decorators.js.map

    /**
    @license
    Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
    This code may only be used under the BSD style license found at
    http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
    http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
    found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
    part of the polymer project is also subject to an additional IP rights grant
    found at http://polymer.github.io/PATENTS.txt
    */
    const supportsAdoptingStyleSheets = ('adoptedStyleSheets' in Document.prototype) &&
        ('replace' in CSSStyleSheet.prototype);
    const constructionToken = Symbol();
    class CSSResult {
        constructor(cssText, safeToken) {
            if (safeToken !== constructionToken) {
                throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
            }
            this.cssText = cssText;
        }
        // Note, this is a getter so that it's lazy. In practice, this means
        // stylesheets are not created until the first element instance is made.
        get styleSheet() {
            if (this._styleSheet === undefined) {
                // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
                // is constructable.
                if (supportsAdoptingStyleSheets) {
                    this._styleSheet = new CSSStyleSheet();
                    this._styleSheet.replaceSync(this.cssText);
                }
                else {
                    this._styleSheet = null;
                }
            }
            return this._styleSheet;
        }
        toString() {
            return this.cssText;
        }
    }
    const textFromCSSResult = (value) => {
        if (value instanceof CSSResult) {
            return value.cssText;
        }
        else {
            throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
        }
    };
    /**
     * Template tag which which can be used with LitElement's `style` property to
     * set element styles. For security reasons, only literal string values may be
     * used. To incorporate non-literal values `unsafeCSS` may be used inside a
     * template string part.
     */
    const css = (strings, ...values) => {
        const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
        return new CSSResult(cssText, constructionToken);
    };
    //# sourceMappingURL=css-tag.js.map

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    // IMPORTANT: do not change the property name or the assignment expression.
    // This line will be used in regexes to search for LitElement usage.
    // TODO(justinfagnani): inject version number at build time
    (window['litElementVersions'] || (window['litElementVersions'] = []))
        .push('2.0.1');
    /**
     * Minimal implementation of Array.prototype.flat
     * @param arr the array to flatten
     * @param result the accumlated result
     */
    function arrayFlat(styles, result = []) {
        for (let i = 0, length = styles.length; i < length; i++) {
            const value = styles[i];
            if (Array.isArray(value)) {
                arrayFlat(value, result);
            }
            else {
                result.push(value);
            }
        }
        return result;
    }
    /** Deeply flattens styles array. Uses native flat if available. */
    const flattenStyles = (styles) => styles.flat ? styles.flat(Infinity) : arrayFlat(styles);
    class LitElement extends UpdatingElement {
        /** @nocollapse */
        static finalize() {
            super.finalize();
            // Prepare styling that is stamped at first render time. Styling
            // is built from user provided `styles` or is inherited from the superclass.
            this._styles =
                this.hasOwnProperty(JSCompiler_renameProperty('styles', this)) ?
                    this._getUniqueStyles() :
                    this._styles || [];
        }
        /** @nocollapse */
        static _getUniqueStyles() {
            // Take care not to call `this.styles` multiple times since this generates
            // new CSSResults each time.
            // TODO(sorvell): Since we do not cache CSSResults by input, any
            // shared styles will generate new stylesheet objects, which is wasteful.
            // This should be addressed when a browser ships constructable
            // stylesheets.
            const userStyles = this.styles;
            const styles = [];
            if (Array.isArray(userStyles)) {
                const flatStyles = flattenStyles(userStyles);
                // As a performance optimization to avoid duplicated styling that can
                // occur especially when composing via subclassing, de-duplicate styles
                // preserving the last item in the list. The last item is kept to
                // try to preserve cascade order with the assumption that it's most
                // important that last added styles override previous styles.
                const styleSet = flatStyles.reduceRight((set, s) => {
                    set.add(s);
                    // on IE set.add does not return the set.
                    return set;
                }, new Set());
                // Array.from does not work on Set in IE
                styleSet.forEach((v) => styles.unshift(v));
            }
            else if (userStyles) {
                styles.push(userStyles);
            }
            return styles;
        }
        /**
         * Performs element initialization. By default this calls `createRenderRoot`
         * to create the element `renderRoot` node and captures any pre-set values for
         * registered properties.
         */
        initialize() {
            super.initialize();
            this.renderRoot = this.createRenderRoot();
            // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
            // element's getRootNode(). While this could be done, we're choosing not to
            // support this now since it would require different logic around de-duping.
            if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
                this.adoptStyles();
            }
        }
        /**
         * Returns the node into which the element should render and by default
         * creates and returns an open shadowRoot. Implement to customize where the
         * element's DOM is rendered. For example, to render into the element's
         * childNodes, return `this`.
         * @returns {Element|DocumentFragment} Returns a node into which to render.
         */
        createRenderRoot() {
            return this.attachShadow({ mode: 'open' });
        }
        /**
         * Applies styling to the element shadowRoot using the `static get styles`
         * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
         * available and will fallback otherwise. When Shadow DOM is polyfilled,
         * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
         * is available but `adoptedStyleSheets` is not, styles are appended to the
         * end of the `shadowRoot` to [mimic spec
         * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
         */
        adoptStyles() {
            const styles = this.constructor._styles;
            if (styles.length === 0) {
                return;
            }
            // There are three separate cases here based on Shadow DOM support.
            // (1) shadowRoot polyfilled: use ShadyCSS
            // (2) shadowRoot.adoptedStyleSheets available: use it.
            // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
            // rendering
            if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
                window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map((s) => s.cssText), this.localName);
            }
            else if (supportsAdoptingStyleSheets) {
                this.renderRoot.adoptedStyleSheets =
                    styles.map((s) => s.styleSheet);
            }
            else {
                // This must be done after rendering so the actual style insertion is done
                // in `update`.
                this._needsShimAdoptedStyleSheets = true;
            }
        }
        connectedCallback() {
            super.connectedCallback();
            // Note, first update/render handles styleElement so we only call this if
            // connected after first update.
            if (this.hasUpdated && window.ShadyCSS !== undefined) {
                window.ShadyCSS.styleElement(this);
            }
        }
        /**
         * Updates the element. This method reflects property values to attributes
         * and calls `render` to render DOM via lit-html. Setting properties inside
         * this method will *not* trigger another update.
         * * @param _changedProperties Map of changed properties with old values
         */
        update(changedProperties) {
            super.update(changedProperties);
            const templateResult = this.render();
            if (templateResult instanceof TemplateResult) {
                this.constructor
                    .render(templateResult, this.renderRoot, { scopeName: this.localName, eventContext: this });
            }
            // When native Shadow DOM is used but adoptedStyles are not supported,
            // insert styling after rendering to ensure adoptedStyles have highest
            // priority.
            if (this._needsShimAdoptedStyleSheets) {
                this._needsShimAdoptedStyleSheets = false;
                this.constructor._styles.forEach((s) => {
                    const style = document.createElement('style');
                    style.textContent = s.cssText;
                    this.renderRoot.appendChild(style);
                });
            }
        }
        /**
         * Invoked on each update to perform rendering tasks. This method must return
         * a lit-html TemplateResult. Setting properties inside this method will *not*
         * trigger the element to update.
         */
        render() {
        }
    }
    /**
     * Ensure this class is marked as `finalized` as an optimization ensuring
     * it will not needlessly try to `finalize`.
     */
    LitElement.finalized = true;
    /**
     * Render method used to render the lit-html TemplateResult to the element's
     * DOM.
     * @param {TemplateResult} Template to render.
     * @param {Element|DocumentFragment} Node into which to render.
     * @param {String} Element name.
     * @nocollapse
     */
    LitElement.render = render$1;
    //# sourceMappingURL=lit-element.js.map

    /**
     * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baagøe.
     * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
     */
    const FRAC = 2.3283064365386963e-10; /* 2^-32 */
    class RNG {
        constructor() {
            this._seed = 0;
            this._s0 = 0;
            this._s1 = 0;
            this._s2 = 0;
            this._c = 0;
        }
        getSeed() { return this._seed; }
        /**
         * Seed the number generator
         */
        setSeed(seed) {
            seed = (seed < 1 ? 1 / seed : seed);
            this._seed = seed;
            this._s0 = (seed >>> 0) * FRAC;
            seed = (seed * 69069 + 1) >>> 0;
            this._s1 = seed * FRAC;
            seed = (seed * 69069 + 1) >>> 0;
            this._s2 = seed * FRAC;
            this._c = 1;
            return this;
        }
        /**
         * @returns Pseudorandom value [0,1), uniformly distributed
         */
        getUniform() {
            let t = 2091639 * this._s0 + this._c * FRAC;
            this._s0 = this._s1;
            this._s1 = this._s2;
            this._c = t | 0;
            this._s2 = t - this._c;
            return this._s2;
        }
        /**
         * @param lowerBound The lower end of the range to return a value from, inclusive
         * @param upperBound The upper end of the range to return a value from, inclusive
         * @returns Pseudorandom value [lowerBound, upperBound], using ROT.RNG.getUniform() to distribute the value
         */
        getUniformInt(lowerBound, upperBound) {
            let max = Math.max(lowerBound, upperBound);
            let min = Math.min(lowerBound, upperBound);
            return Math.floor(this.getUniform() * (max - min + 1)) + min;
        }
        /**
         * @param mean Mean value
         * @param stddev Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
         * @returns A normally distributed pseudorandom value
         */
        getNormal(mean = 0, stddev = 1) {
            let u, v, r;
            do {
                u = 2 * this.getUniform() - 1;
                v = 2 * this.getUniform() - 1;
                r = u * u + v * v;
            } while (r > 1 || r == 0);
            let gauss = u * Math.sqrt(-2 * Math.log(r) / r);
            return mean + gauss * stddev;
        }
        /**
         * @returns Pseudorandom value [1,100] inclusive, uniformly distributed
         */
        getPercentage() {
            return 1 + Math.floor(this.getUniform() * 100);
        }
        /**
         * @returns Randomly picked item, null when length=0
         */
        getItem(array) {
            if (!array.length) {
                return null;
            }
            return array[Math.floor(this.getUniform() * array.length)];
        }
        /**
         * @returns New array with randomized items
         */
        shuffle(array) {
            let result = [];
            let clone = array.slice();
            while (clone.length) {
                let index = clone.indexOf(this.getItem(clone));
                result.push(clone.splice(index, 1)[0]);
            }
            return result;
        }
        /**
         * @param data key=whatever, value=weight (relative probability)
         * @returns whatever
         */
        getWeightedValue(data) {
            let total = 0;
            for (let id in data) {
                total += data[id];
            }
            let random = this.getUniform() * total;
            let id, part = 0;
            for (id in data) {
                part += data[id];
                if (random < part) {
                    return id;
                }
            }
            // If by some floating-point annoyance we have
            // random >= total, just return the last id.
            return id;
        }
        /**
         * Get RNG state. Useful for storing the state and re-setting it via setState.
         * @returns Internal state
         */
        getState() { return [this._s0, this._s1, this._s2, this._c]; }
        /**
         * Set a previously retrieved state.
         */
        setState(state) {
            this._s0 = state[0];
            this._s1 = state[1];
            this._s2 = state[2];
            this._c = state[3];
            return this;
        }
        /**
         * Returns a cloned RNG
         */
        clone() {
            let clone = new RNG();
            return clone.setState(this.getState());
        }
    }
    var RNG$1 = new RNG().setSeed(Date.now());

    /**
     * @class Abstract display backend module
     * @private
     */
    class Backend {
        getContainer() { return null; }
        setOptions(options) { this._options = options; }
    }

    class Canvas extends Backend {
        constructor() {
            super();
            this._ctx = document.createElement("canvas").getContext("2d");
        }
        schedule(cb) { requestAnimationFrame(cb); }
        getContainer() { return this._ctx.canvas; }
        setOptions(opts) {
            super.setOptions(opts);
            const style = (opts.fontStyle ? `${opts.fontStyle} ` : ``);
            const font = `${style} ${opts.fontSize}px ${opts.fontFamily}`;
            this._ctx.font = font;
            this._updateSize();
            this._ctx.font = font;
            this._ctx.textAlign = "center";
            this._ctx.textBaseline = "middle";
        }
        clear() {
            this._ctx.fillStyle = this._options.bg;
            this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
        }
        eventToPosition(x, y) {
            let canvas = this._ctx.canvas;
            let rect = canvas.getBoundingClientRect();
            x -= rect.left;
            y -= rect.top;
            x *= canvas.width / rect.width;
            y *= canvas.height / rect.height;
            if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
                return [-1, -1];
            }
            return this._normalizedEventToPosition(x, y);
        }
    }

    /**
     * Always positive modulus
     * @param x Operand
     * @param n Modulus
     * @returns x modulo n
     */
    function mod(x, n) {
        return (x % n + n) % n;
    }
    function clamp(val, min = 0, max = 1) {
        if (val < min)
            return min;
        if (val > max)
            return max;
        return val;
    }

    /**
     * @class Hexagonal backend
     * @private
     */
    class Hex extends Canvas {
        constructor() {
            super();
            this._spacingX = 0;
            this._spacingY = 0;
            this._hexSize = 0;
        }
        draw(data, clearBefore) {
            let [x, y, ch, fg, bg] = data;
            let px = [
                (x + 1) * this._spacingX,
                y * this._spacingY + this._hexSize
            ];
            if (this._options.transpose) {
                px.reverse();
            }
            if (clearBefore) {
                this._ctx.fillStyle = bg;
                this._fill(px[0], px[1]);
            }
            if (!ch) {
                return;
            }
            this._ctx.fillStyle = fg;
            let chars = [].concat(ch);
            for (let i = 0; i < chars.length; i++) {
                this._ctx.fillText(chars[i], px[0], Math.ceil(px[1]));
            }
        }
        computeSize(availWidth, availHeight) {
            if (this._options.transpose) {
                availWidth += availHeight;
                availHeight = availWidth - availHeight;
                availWidth -= availHeight;
            }
            let width = Math.floor(availWidth / this._spacingX) - 1;
            let height = Math.floor((availHeight - 2 * this._hexSize) / this._spacingY + 1);
            return [width, height];
        }
        computeFontSize(availWidth, availHeight) {
            if (this._options.transpose) {
                availWidth += availHeight;
                availHeight = availWidth - availHeight;
                availWidth -= availHeight;
            }
            let hexSizeWidth = 2 * availWidth / ((this._options.width + 1) * Math.sqrt(3)) - 1;
            let hexSizeHeight = availHeight / (2 + 1.5 * (this._options.height - 1));
            let hexSize = Math.min(hexSizeWidth, hexSizeHeight);
            // compute char ratio
            let oldFont = this._ctx.font;
            this._ctx.font = "100px " + this._options.fontFamily;
            let width = Math.ceil(this._ctx.measureText("W").width);
            this._ctx.font = oldFont;
            let ratio = width / 100;
            hexSize = Math.floor(hexSize) + 1; // closest larger hexSize
            // FIXME char size computation does not respect transposed hexes
            let fontSize = 2 * hexSize / (this._options.spacing * (1 + ratio / Math.sqrt(3)));
            // closest smaller fontSize
            return Math.ceil(fontSize) - 1;
        }
        _normalizedEventToPosition(x, y) {
            let nodeSize;
            if (this._options.transpose) {
                x += y;
                y = x - y;
                x -= y;
                nodeSize = this._ctx.canvas.width;
            }
            else {
                nodeSize = this._ctx.canvas.height;
            }
            let size = nodeSize / this._options.height;
            y = Math.floor(y / size);
            if (mod(y, 2)) { /* odd row */
                x -= this._spacingX;
                x = 1 + 2 * Math.floor(x / (2 * this._spacingX));
            }
            else {
                x = 2 * Math.floor(x / (2 * this._spacingX));
            }
            return [x, y];
        }
        /**
         * Arguments are pixel values. If "transposed" mode is enabled, then these two are already swapped.
         */
        _fill(cx, cy) {
            let a = this._hexSize;
            let b = this._options.border;
            const ctx = this._ctx;
            ctx.beginPath();
            if (this._options.transpose) {
                ctx.moveTo(cx - a + b, cy);
                ctx.lineTo(cx - a / 2 + b, cy + this._spacingX - b);
                ctx.lineTo(cx + a / 2 - b, cy + this._spacingX - b);
                ctx.lineTo(cx + a - b, cy);
                ctx.lineTo(cx + a / 2 - b, cy - this._spacingX + b);
                ctx.lineTo(cx - a / 2 + b, cy - this._spacingX + b);
                ctx.lineTo(cx - a + b, cy);
            }
            else {
                ctx.moveTo(cx, cy - a + b);
                ctx.lineTo(cx + this._spacingX - b, cy - a / 2 + b);
                ctx.lineTo(cx + this._spacingX - b, cy + a / 2 - b);
                ctx.lineTo(cx, cy + a - b);
                ctx.lineTo(cx - this._spacingX + b, cy + a / 2 - b);
                ctx.lineTo(cx - this._spacingX + b, cy - a / 2 + b);
                ctx.lineTo(cx, cy - a + b);
            }
            ctx.fill();
        }
        _updateSize() {
            const opts = this._options;
            const charWidth = Math.ceil(this._ctx.measureText("W").width);
            this._hexSize = Math.floor(opts.spacing * (opts.fontSize + charWidth / Math.sqrt(3)) / 2);
            this._spacingX = this._hexSize * Math.sqrt(3) / 2;
            this._spacingY = this._hexSize * 1.5;
            let xprop;
            let yprop;
            if (opts.transpose) {
                xprop = "height";
                yprop = "width";
            }
            else {
                xprop = "width";
                yprop = "height";
            }
            this._ctx.canvas[xprop] = Math.ceil((opts.width + 1) * this._spacingX);
            this._ctx.canvas[yprop] = Math.ceil((opts.height - 1) * this._spacingY + 2 * this._hexSize);
        }
    }

    /**
     * @class Rectangular backend
     * @private
     */
    class Rect extends Canvas {
        constructor() {
            super();
            this._spacingX = 0;
            this._spacingY = 0;
            this._canvasCache = {};
        }
        setOptions(options) {
            super.setOptions(options);
            this._canvasCache = {};
        }
        draw(data, clearBefore) {
            if (Rect.cache) {
                this._drawWithCache(data);
            }
            else {
                this._drawNoCache(data, clearBefore);
            }
        }
        _drawWithCache(data) {
            let [x, y, ch, fg, bg] = data;
            let hash = "" + ch + fg + bg;
            let canvas;
            if (hash in this._canvasCache) {
                canvas = this._canvasCache[hash];
            }
            else {
                let b = this._options.border;
                canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                canvas.width = this._spacingX;
                canvas.height = this._spacingY;
                ctx.fillStyle = bg;
                ctx.fillRect(b, b, canvas.width - b, canvas.height - b);
                if (ch) {
                    ctx.fillStyle = fg;
                    ctx.font = this._ctx.font;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    let chars = [].concat(ch);
                    for (let i = 0; i < chars.length; i++) {
                        ctx.fillText(chars[i], this._spacingX / 2, Math.ceil(this._spacingY / 2));
                    }
                }
                this._canvasCache[hash] = canvas;
            }
            this._ctx.drawImage(canvas, x * this._spacingX, y * this._spacingY);
        }
        _drawNoCache(data, clearBefore) {
            let [x, y, ch, fg, bg] = data;
            if (clearBefore) {
                let b = this._options.border;
                this._ctx.fillStyle = bg;
                this._ctx.fillRect(x * this._spacingX + b, y * this._spacingY + b, this._spacingX - b, this._spacingY - b);
            }
            if (!ch) {
                return;
            }
            this._ctx.fillStyle = fg;
            let chars = [].concat(ch);
            for (let i = 0; i < chars.length; i++) {
                this._ctx.fillText(chars[i], (x + 0.5) * this._spacingX, Math.ceil((y + 0.5) * this._spacingY));
            }
        }
        computeSize(availWidth, availHeight) {
            let width = Math.floor(availWidth / this._spacingX);
            let height = Math.floor(availHeight / this._spacingY);
            return [width, height];
        }
        computeFontSize(availWidth, availHeight) {
            let boxWidth = Math.floor(availWidth / this._options.width);
            let boxHeight = Math.floor(availHeight / this._options.height);
            /* compute char ratio */
            let oldFont = this._ctx.font;
            this._ctx.font = "100px " + this._options.fontFamily;
            let width = Math.ceil(this._ctx.measureText("W").width);
            this._ctx.font = oldFont;
            let ratio = width / 100;
            let widthFraction = ratio * boxHeight / boxWidth;
            if (widthFraction > 1) { /* too wide with current aspect ratio */
                boxHeight = Math.floor(boxHeight / widthFraction);
            }
            return Math.floor(boxHeight / this._options.spacing);
        }
        _normalizedEventToPosition(x, y) {
            return [Math.floor(x / this._spacingX), Math.floor(y / this._spacingY)];
        }
        _updateSize() {
            const opts = this._options;
            const charWidth = Math.ceil(this._ctx.measureText("W").width);
            this._spacingX = Math.ceil(opts.spacing * charWidth);
            this._spacingY = Math.ceil(opts.spacing * opts.fontSize);
            if (opts.forceSquareRatio) {
                this._spacingX = this._spacingY = Math.max(this._spacingX, this._spacingY);
            }
            this._ctx.canvas.width = opts.width * this._spacingX;
            this._ctx.canvas.height = opts.height * this._spacingY;
        }
    }
    Rect.cache = false;

    /**
     * @class Tile backend
     * @private
     */
    class Tile extends Canvas {
        constructor() {
            super();
            this._colorCanvas = document.createElement("canvas");
        }
        draw(data, clearBefore) {
            let [x, y, ch, fg, bg] = data;
            let tileWidth = this._options.tileWidth;
            let tileHeight = this._options.tileHeight;
            if (clearBefore) {
                if (this._options.tileColorize) {
                    this._ctx.clearRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                }
                else {
                    this._ctx.fillStyle = bg;
                    this._ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                }
            }
            if (!ch) {
                return;
            }
            let chars = [].concat(ch);
            let fgs = [].concat(fg);
            let bgs = [].concat(bg);
            for (let i = 0; i < chars.length; i++) {
                let tile = this._options.tileMap[chars[i]];
                if (!tile) {
                    throw new Error(`Char "${chars[i]}" not found in tileMap`);
                }
                if (this._options.tileColorize) { // apply colorization
                    let canvas = this._colorCanvas;
                    let context = canvas.getContext("2d");
                    context.globalCompositeOperation = "source-over";
                    context.clearRect(0, 0, tileWidth, tileHeight);
                    let fg = fgs[i];
                    let bg = bgs[i];
                    context.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
                    if (fg != "transparent") {
                        context.fillStyle = fg;
                        context.globalCompositeOperation = "source-atop";
                        context.fillRect(0, 0, tileWidth, tileHeight);
                    }
                    if (bg != "transparent") {
                        context.fillStyle = bg;
                        context.globalCompositeOperation = "destination-over";
                        context.fillRect(0, 0, tileWidth, tileHeight);
                    }
                    this._ctx.drawImage(canvas, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                }
                else { // no colorizing, easy
                    this._ctx.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                }
            }
        }
        computeSize(availWidth, availHeight) {
            let width = Math.floor(availWidth / this._options.tileWidth);
            let height = Math.floor(availHeight / this._options.tileHeight);
            return [width, height];
        }
        computeFontSize() {
            throw new Error("Tile backend does not understand font size");
        }
        _normalizedEventToPosition(x, y) {
            return [Math.floor(x / this._options.tileWidth), Math.floor(y / this._options.tileHeight)];
        }
        _updateSize() {
            const opts = this._options;
            this._ctx.canvas.width = opts.width * opts.tileWidth;
            this._ctx.canvas.height = opts.height * opts.tileHeight;
            this._colorCanvas.width = opts.tileWidth;
            this._colorCanvas.height = opts.tileHeight;
        }
    }

    function fromString(str) {
        let cached, r;
        if (str in CACHE) {
            cached = CACHE[str];
        }
        else {
            if (str.charAt(0) == "#") { // hex rgb
                let matched = str.match(/[0-9a-f]/gi) || [];
                let values = matched.map((x) => parseInt(x, 16));
                if (values.length == 3) {
                    cached = values.map((x) => x * 17);
                }
                else {
                    for (let i = 0; i < 3; i++) {
                        values[i + 1] += 16 * values[i];
                        values.splice(i, 1);
                    }
                    cached = values;
                }
            }
            else if ((r = str.match(/rgb\(([0-9, ]+)\)/i))) { // decimal rgb
                cached = r[1].split(/\s*,\s*/).map((x) => parseInt(x));
            }
            else { // html name
                cached = [0, 0, 0];
            }
            CACHE[str] = cached;
        }
        return cached.slice();
    }
    /**
     * Add two or more colors
     */
    function add(color1, ...colors) {
        let result = color1.slice();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < colors.length; j++) {
                result[i] += colors[j][i];
            }
        }
        return result;
    }
    /**
     * Add two or more colors, MODIFIES FIRST ARGUMENT
     */
    function add_(color1, ...colors) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < colors.length; j++) {
                color1[i] += colors[j][i];
            }
        }
        return color1;
    }
    /**
     * Multiply (mix) two or more colors
     */
    function multiply(color1, ...colors) {
        let result = color1.slice();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < colors.length; j++) {
                result[i] *= colors[j][i] / 255;
            }
            result[i] = Math.round(result[i]);
        }
        return result;
    }
    /**
     * Multiply (mix) two or more colors, MODIFIES FIRST ARGUMENT
     */
    function multiply_(color1, ...colors) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < colors.length; j++) {
                color1[i] *= colors[j][i] / 255;
            }
            color1[i] = Math.round(color1[i]);
        }
        return color1;
    }
    /**
     * Interpolate (blend) two colors with a given factor
     */
    function interpolate(color1, color2, factor = 0.5) {
        let result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    }
    const lerp = interpolate;
    /**
     * Interpolate (blend) two colors with a given factor in HSL mode
     */
    function interpolateHSL(color1, color2, factor = 0.5) {
        let hsl1 = rgb2hsl(color1);
        let hsl2 = rgb2hsl(color2);
        for (let i = 0; i < 3; i++) {
            hsl1[i] += factor * (hsl2[i] - hsl1[i]);
        }
        return hsl2rgb(hsl1);
    }
    const lerpHSL = interpolateHSL;
    /**
     * Create a new random color based on this one
     * @param color
     * @param diff Set of standard deviations
     */
    function randomize(color, diff) {
        if (!(diff instanceof Array)) {
            diff = Math.round(RNG$1.getNormal(0, diff));
        }
        let result = color.slice();
        for (let i = 0; i < 3; i++) {
            result[i] += (diff instanceof Array ? Math.round(RNG$1.getNormal(0, diff[i])) : diff);
        }
        return result;
    }
    /**
     * Converts an RGB color value to HSL. Expects 0..255 inputs, produces 0..1 outputs.
     */
    function rgb2hsl(color) {
        let r = color[0] / 255;
        let g = color[1] / 255;
        let b = color[2] / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;
        if (max == min) {
            s = 0; // achromatic
        }
        else {
            let d = max - min;
            s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return [h, s, l];
    }
    function hue2rgb(p, q, t) {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
    /**
     * Converts an HSL color value to RGB. Expects 0..1 inputs, produces 0..255 outputs.
     */
    function hsl2rgb(color) {
        let l = color[2];
        if (color[1] == 0) {
            l = Math.round(l * 255);
            return [l, l, l];
        }
        else {
            let s = color[1];
            let q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
            let p = 2 * l - q;
            let r = hue2rgb(p, q, color[0] + 1 / 3);
            let g = hue2rgb(p, q, color[0]);
            let b = hue2rgb(p, q, color[0] - 1 / 3);
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
    }
    function toRGB(color) {
        let clamped = color.map(x => clamp(x, 0, 255));
        return `rgb(${clamped.join(",")})`;
    }
    function toHex(color) {
        let clamped = color.map(x => clamp(x, 0, 255).toString(16).padStart(2, "0"));
        return `#${clamped.join("")}`;
    }
    const CACHE = {
        "black": [0, 0, 0],
        "navy": [0, 0, 128],
        "darkblue": [0, 0, 139],
        "mediumblue": [0, 0, 205],
        "blue": [0, 0, 255],
        "darkgreen": [0, 100, 0],
        "green": [0, 128, 0],
        "teal": [0, 128, 128],
        "darkcyan": [0, 139, 139],
        "deepskyblue": [0, 191, 255],
        "darkturquoise": [0, 206, 209],
        "mediumspringgreen": [0, 250, 154],
        "lime": [0, 255, 0],
        "springgreen": [0, 255, 127],
        "aqua": [0, 255, 255],
        "cyan": [0, 255, 255],
        "midnightblue": [25, 25, 112],
        "dodgerblue": [30, 144, 255],
        "forestgreen": [34, 139, 34],
        "seagreen": [46, 139, 87],
        "darkslategray": [47, 79, 79],
        "darkslategrey": [47, 79, 79],
        "limegreen": [50, 205, 50],
        "mediumseagreen": [60, 179, 113],
        "turquoise": [64, 224, 208],
        "royalblue": [65, 105, 225],
        "steelblue": [70, 130, 180],
        "darkslateblue": [72, 61, 139],
        "mediumturquoise": [72, 209, 204],
        "indigo": [75, 0, 130],
        "darkolivegreen": [85, 107, 47],
        "cadetblue": [95, 158, 160],
        "cornflowerblue": [100, 149, 237],
        "mediumaquamarine": [102, 205, 170],
        "dimgray": [105, 105, 105],
        "dimgrey": [105, 105, 105],
        "slateblue": [106, 90, 205],
        "olivedrab": [107, 142, 35],
        "slategray": [112, 128, 144],
        "slategrey": [112, 128, 144],
        "lightslategray": [119, 136, 153],
        "lightslategrey": [119, 136, 153],
        "mediumslateblue": [123, 104, 238],
        "lawngreen": [124, 252, 0],
        "chartreuse": [127, 255, 0],
        "aquamarine": [127, 255, 212],
        "maroon": [128, 0, 0],
        "purple": [128, 0, 128],
        "olive": [128, 128, 0],
        "gray": [128, 128, 128],
        "grey": [128, 128, 128],
        "skyblue": [135, 206, 235],
        "lightskyblue": [135, 206, 250],
        "blueviolet": [138, 43, 226],
        "darkred": [139, 0, 0],
        "darkmagenta": [139, 0, 139],
        "saddlebrown": [139, 69, 19],
        "darkseagreen": [143, 188, 143],
        "lightgreen": [144, 238, 144],
        "mediumpurple": [147, 112, 216],
        "darkviolet": [148, 0, 211],
        "palegreen": [152, 251, 152],
        "darkorchid": [153, 50, 204],
        "yellowgreen": [154, 205, 50],
        "sienna": [160, 82, 45],
        "brown": [165, 42, 42],
        "darkgray": [169, 169, 169],
        "darkgrey": [169, 169, 169],
        "lightblue": [173, 216, 230],
        "greenyellow": [173, 255, 47],
        "paleturquoise": [175, 238, 238],
        "lightsteelblue": [176, 196, 222],
        "powderblue": [176, 224, 230],
        "firebrick": [178, 34, 34],
        "darkgoldenrod": [184, 134, 11],
        "mediumorchid": [186, 85, 211],
        "rosybrown": [188, 143, 143],
        "darkkhaki": [189, 183, 107],
        "silver": [192, 192, 192],
        "mediumvioletred": [199, 21, 133],
        "indianred": [205, 92, 92],
        "peru": [205, 133, 63],
        "chocolate": [210, 105, 30],
        "tan": [210, 180, 140],
        "lightgray": [211, 211, 211],
        "lightgrey": [211, 211, 211],
        "palevioletred": [216, 112, 147],
        "thistle": [216, 191, 216],
        "orchid": [218, 112, 214],
        "goldenrod": [218, 165, 32],
        "crimson": [220, 20, 60],
        "gainsboro": [220, 220, 220],
        "plum": [221, 160, 221],
        "burlywood": [222, 184, 135],
        "lightcyan": [224, 255, 255],
        "lavender": [230, 230, 250],
        "darksalmon": [233, 150, 122],
        "violet": [238, 130, 238],
        "palegoldenrod": [238, 232, 170],
        "lightcoral": [240, 128, 128],
        "khaki": [240, 230, 140],
        "aliceblue": [240, 248, 255],
        "honeydew": [240, 255, 240],
        "azure": [240, 255, 255],
        "sandybrown": [244, 164, 96],
        "wheat": [245, 222, 179],
        "beige": [245, 245, 220],
        "whitesmoke": [245, 245, 245],
        "mintcream": [245, 255, 250],
        "ghostwhite": [248, 248, 255],
        "salmon": [250, 128, 114],
        "antiquewhite": [250, 235, 215],
        "linen": [250, 240, 230],
        "lightgoldenrodyellow": [250, 250, 210],
        "oldlace": [253, 245, 230],
        "red": [255, 0, 0],
        "fuchsia": [255, 0, 255],
        "magenta": [255, 0, 255],
        "deeppink": [255, 20, 147],
        "orangered": [255, 69, 0],
        "tomato": [255, 99, 71],
        "hotpink": [255, 105, 180],
        "coral": [255, 127, 80],
        "darkorange": [255, 140, 0],
        "lightsalmon": [255, 160, 122],
        "orange": [255, 165, 0],
        "lightpink": [255, 182, 193],
        "pink": [255, 192, 203],
        "gold": [255, 215, 0],
        "peachpuff": [255, 218, 185],
        "navajowhite": [255, 222, 173],
        "moccasin": [255, 228, 181],
        "bisque": [255, 228, 196],
        "mistyrose": [255, 228, 225],
        "blanchedalmond": [255, 235, 205],
        "papayawhip": [255, 239, 213],
        "lavenderblush": [255, 240, 245],
        "seashell": [255, 245, 238],
        "cornsilk": [255, 248, 220],
        "lemonchiffon": [255, 250, 205],
        "floralwhite": [255, 250, 240],
        "snow": [255, 250, 250],
        "yellow": [255, 255, 0],
        "lightyellow": [255, 255, 224],
        "ivory": [255, 255, 240],
        "white": [255, 255, 255]
    };

    var color = /*#__PURE__*/Object.freeze({
        fromString: fromString,
        add: add,
        add_: add_,
        multiply: multiply,
        multiply_: multiply_,
        interpolate: interpolate,
        lerp: lerp,
        interpolateHSL: interpolateHSL,
        lerpHSL: lerpHSL,
        randomize: randomize,
        rgb2hsl: rgb2hsl,
        hsl2rgb: hsl2rgb,
        toRGB: toRGB,
        toHex: toHex
    });

    function clearToAnsi(bg) {
        return `\x1b[0;48;5;${termcolor(bg)}m\x1b[2J`;
    }
    function colorToAnsi(fg, bg) {
        return `\x1b[0;38;5;${termcolor(fg)};48;5;${termcolor(bg)}m`;
    }
    function positionToAnsi(x, y) {
        return `\x1b[${y + 1};${x + 1}H`;
    }
    function termcolor(color$1) {
        const SRC_COLORS = 256.0;
        const DST_COLORS = 6.0;
        const COLOR_RATIO = DST_COLORS / SRC_COLORS;
        let rgb = fromString(color$1);
        let r = Math.floor(rgb[0] * COLOR_RATIO);
        let g = Math.floor(rgb[1] * COLOR_RATIO);
        let b = Math.floor(rgb[2] * COLOR_RATIO);
        return r * 36 + g * 6 + b * 1 + 16;
    }
    class Term extends Backend {
        constructor() {
            super();
            this._offset = [0, 0];
            this._cursor = [-1, -1];
            this._lastColor = "";
        }
        schedule(cb) { setTimeout(cb, 1000 / 60); }
        setOptions(options) {
            super.setOptions(options);
            let size = [options.width, options.height];
            let avail = this.computeSize();
            this._offset = avail.map((val, index) => Math.floor((val - size[index]) / 2));
        }
        clear() {
            process.stdout.write(clearToAnsi(this._options.bg));
        }
        draw(data, clearBefore) {
            // determine where to draw what with what colors
            let [x, y, ch, fg, bg] = data;
            // determine if we need to move the terminal cursor
            let dx = this._offset[0] + x;
            let dy = this._offset[1] + y;
            let size = this.computeSize();
            if (dx < 0 || dx >= size[0]) {
                return;
            }
            if (dy < 0 || dy >= size[1]) {
                return;
            }
            if (dx !== this._cursor[0] || dy !== this._cursor[1]) {
                process.stdout.write(positionToAnsi(dx, dy));
                this._cursor[0] = dx;
                this._cursor[1] = dy;
            }
            // terminals automatically clear, but if we're clearing when we're
            // not otherwise provided with a character, just use a space instead
            if (clearBefore) {
                if (!ch) {
                    ch = " ";
                }
            }
            // if we're not clearing and not provided with a character, do nothing
            if (!ch) {
                return;
            }
            // determine if we need to change colors
            let newColor = colorToAnsi(fg, bg);
            if (newColor !== this._lastColor) {
                process.stdout.write(newColor);
                this._lastColor = newColor;
            }
            // write the provided symbol to the display
            let chars = [].concat(ch);
            process.stdout.write(chars[0]);
            // update our position, given that we wrote a character
            this._cursor[0]++;
            if (this._cursor[0] >= size[0]) {
                this._cursor[0] = 0;
                this._cursor[1]++;
            }
        }
        computeFontSize() { throw new Error("Terminal backend has no notion of font size"); }
        eventToPosition(x, y) { return [x, y]; }
        computeSize() { return [process.stdout.columns, process.stdout.rows]; }
    }

    /**
     * @namespace
     * Contains text tokenization and breaking routines
     */
    const RE_COLORS = /%([bc]){([^}]*)}/g;
    // token types
    const TYPE_TEXT = 0;
    const TYPE_NEWLINE = 1;
    const TYPE_FG = 2;
    const TYPE_BG = 3;
    /**
     * Convert string to a series of a formatting commands
     */
    function tokenize(str, maxWidth) {
        let result = [];
        /* first tokenization pass - split texts and color formatting commands */
        let offset = 0;
        str.replace(RE_COLORS, function (match, type, name, index) {
            /* string before */
            let part = str.substring(offset, index);
            if (part.length) {
                result.push({
                    type: TYPE_TEXT,
                    value: part
                });
            }
            /* color command */
            result.push({
                type: (type == "c" ? TYPE_FG : TYPE_BG),
                value: name.trim()
            });
            offset = index + match.length;
            return "";
        });
        /* last remaining part */
        let part = str.substring(offset);
        if (part.length) {
            result.push({
                type: TYPE_TEXT,
                value: part
            });
        }
        return breakLines(result, maxWidth);
    }
    /* insert line breaks into first-pass tokenized data */
    function breakLines(tokens, maxWidth) {
        if (!maxWidth) {
            maxWidth = Infinity;
        }
        let i = 0;
        let lineLength = 0;
        let lastTokenWithSpace = -1;
        while (i < tokens.length) { /* take all text tokens, remove space, apply linebreaks */
            let token = tokens[i];
            if (token.type == TYPE_NEWLINE) { /* reset */
                lineLength = 0;
                lastTokenWithSpace = -1;
            }
            if (token.type != TYPE_TEXT) { /* skip non-text tokens */
                i++;
                continue;
            }
            /* remove spaces at the beginning of line */
            while (lineLength == 0 && token.value.charAt(0) == " ") {
                token.value = token.value.substring(1);
            }
            /* forced newline? insert two new tokens after this one */
            let index = token.value.indexOf("\n");
            if (index != -1) {
                token.value = breakInsideToken(tokens, i, index, true);
                /* if there are spaces at the end, we must remove them (we do not want the line too long) */
                let arr = token.value.split("");
                while (arr.length && arr[arr.length - 1] == " ") {
                    arr.pop();
                }
                token.value = arr.join("");
            }
            /* token degenerated? */
            if (!token.value.length) {
                tokens.splice(i, 1);
                continue;
            }
            if (lineLength + token.value.length > maxWidth) { /* line too long, find a suitable breaking spot */
                /* is it possible to break within this token? */
                let index = -1;
                while (1) {
                    let nextIndex = token.value.indexOf(" ", index + 1);
                    if (nextIndex == -1) {
                        break;
                    }
                    if (lineLength + nextIndex > maxWidth) {
                        break;
                    }
                    index = nextIndex;
                }
                if (index != -1) { /* break at space within this one */
                    token.value = breakInsideToken(tokens, i, index, true);
                }
                else if (lastTokenWithSpace != -1) { /* is there a previous token where a break can occur? */
                    let token = tokens[lastTokenWithSpace];
                    let breakIndex = token.value.lastIndexOf(" ");
                    token.value = breakInsideToken(tokens, lastTokenWithSpace, breakIndex, true);
                    i = lastTokenWithSpace;
                }
                else { /* force break in this token */
                    token.value = breakInsideToken(tokens, i, maxWidth - lineLength, false);
                }
            }
            else { /* line not long, continue */
                lineLength += token.value.length;
                if (token.value.indexOf(" ") != -1) {
                    lastTokenWithSpace = i;
                }
            }
            i++; /* advance to next token */
        }
        tokens.push({ type: TYPE_NEWLINE }); /* insert fake newline to fix the last text line */
        /* remove trailing space from text tokens before newlines */
        let lastTextToken = null;
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            switch (token.type) {
                case TYPE_TEXT:
                    lastTextToken = token;
                    break;
                case TYPE_NEWLINE:
                    if (lastTextToken) { /* remove trailing space */
                        let arr = lastTextToken.value.split("");
                        while (arr.length && arr[arr.length - 1] == " ") {
                            arr.pop();
                        }
                        lastTextToken.value = arr.join("");
                    }
                    lastTextToken = null;
                    break;
            }
        }
        tokens.pop(); /* remove fake token */
        return tokens;
    }
    /**
     * Create new tokens and insert them into the stream
     * @param {object[]} tokens
     * @param {int} tokenIndex Token being processed
     * @param {int} breakIndex Index within current token's value
     * @param {bool} removeBreakChar Do we want to remove the breaking character?
     * @returns {string} remaining unbroken token value
     */
    function breakInsideToken(tokens, tokenIndex, breakIndex, removeBreakChar) {
        let newBreakToken = {
            type: TYPE_NEWLINE
        };
        let newTextToken = {
            type: TYPE_TEXT,
            value: tokens[tokenIndex].value.substring(breakIndex + (removeBreakChar ? 1 : 0))
        };
        tokens.splice(tokenIndex + 1, 0, newBreakToken, newTextToken);
        return tokens[tokenIndex].value.substring(0, breakIndex);
    }

    /** Default with for display and map generators */
    let DEFAULT_WIDTH = 80;
    /** Default height for display and map generators */
    let DEFAULT_HEIGHT = 25;
    const DIRS = {
        4: [[0, -1], [1, 0], [0, 1], [-1, 0]],
        8: [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]],
        6: [[-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1], [-2, 0]]
    };
    const KEYS = {
        /** Cancel key. */
        VK_CANCEL: 3,
        /** Help key. */
        VK_HELP: 6,
        /** Backspace key. */
        VK_BACK_SPACE: 8,
        /** Tab key. */
        VK_TAB: 9,
        /** 5 key on Numpad when NumLock is unlocked. Or on Mac, clear key which is positioned at NumLock key. */
        VK_CLEAR: 12,
        /** Return/enter key on the main keyboard. */
        VK_RETURN: 13,
        /** Reserved, but not used. */
        VK_ENTER: 14,
        /** Shift key. */
        VK_SHIFT: 16,
        /** Control key. */
        VK_CONTROL: 17,
        /** Alt (Option on Mac) key. */
        VK_ALT: 18,
        /** Pause key. */
        VK_PAUSE: 19,
        /** Caps lock. */
        VK_CAPS_LOCK: 20,
        /** Escape key. */
        VK_ESCAPE: 27,
        /** Space bar. */
        VK_SPACE: 32,
        /** Page Up key. */
        VK_PAGE_UP: 33,
        /** Page Down key. */
        VK_PAGE_DOWN: 34,
        /** End key. */
        VK_END: 35,
        /** Home key. */
        VK_HOME: 36,
        /** Left arrow. */
        VK_LEFT: 37,
        /** Up arrow. */
        VK_UP: 38,
        /** Right arrow. */
        VK_RIGHT: 39,
        /** Down arrow. */
        VK_DOWN: 40,
        /** Print Screen key. */
        VK_PRINTSCREEN: 44,
        /** Ins(ert) key. */
        VK_INSERT: 45,
        /** Del(ete) key. */
        VK_DELETE: 46,
        /***/
        VK_0: 48,
        /***/
        VK_1: 49,
        /***/
        VK_2: 50,
        /***/
        VK_3: 51,
        /***/
        VK_4: 52,
        /***/
        VK_5: 53,
        /***/
        VK_6: 54,
        /***/
        VK_7: 55,
        /***/
        VK_8: 56,
        /***/
        VK_9: 57,
        /** Colon (:) key. Requires Gecko 15.0 */
        VK_COLON: 58,
        /** Semicolon (;) key. */
        VK_SEMICOLON: 59,
        /** Less-than (<) key. Requires Gecko 15.0 */
        VK_LESS_THAN: 60,
        /** Equals (=) key. */
        VK_EQUALS: 61,
        /** Greater-than (>) key. Requires Gecko 15.0 */
        VK_GREATER_THAN: 62,
        /** Question mark (?) key. Requires Gecko 15.0 */
        VK_QUESTION_MARK: 63,
        /** Atmark (@) key. Requires Gecko 15.0 */
        VK_AT: 64,
        /***/
        VK_A: 65,
        /***/
        VK_B: 66,
        /***/
        VK_C: 67,
        /***/
        VK_D: 68,
        /***/
        VK_E: 69,
        /***/
        VK_F: 70,
        /***/
        VK_G: 71,
        /***/
        VK_H: 72,
        /***/
        VK_I: 73,
        /***/
        VK_J: 74,
        /***/
        VK_K: 75,
        /***/
        VK_L: 76,
        /***/
        VK_M: 77,
        /***/
        VK_N: 78,
        /***/
        VK_O: 79,
        /***/
        VK_P: 80,
        /***/
        VK_Q: 81,
        /***/
        VK_R: 82,
        /***/
        VK_S: 83,
        /***/
        VK_T: 84,
        /***/
        VK_U: 85,
        /***/
        VK_V: 86,
        /***/
        VK_W: 87,
        /***/
        VK_X: 88,
        /***/
        VK_Y: 89,
        /***/
        VK_Z: 90,
        /***/
        VK_CONTEXT_MENU: 93,
        /** 0 on the numeric keypad. */
        VK_NUMPAD0: 96,
        /** 1 on the numeric keypad. */
        VK_NUMPAD1: 97,
        /** 2 on the numeric keypad. */
        VK_NUMPAD2: 98,
        /** 3 on the numeric keypad. */
        VK_NUMPAD3: 99,
        /** 4 on the numeric keypad. */
        VK_NUMPAD4: 100,
        /** 5 on the numeric keypad. */
        VK_NUMPAD5: 101,
        /** 6 on the numeric keypad. */
        VK_NUMPAD6: 102,
        /** 7 on the numeric keypad. */
        VK_NUMPAD7: 103,
        /** 8 on the numeric keypad. */
        VK_NUMPAD8: 104,
        /** 9 on the numeric keypad. */
        VK_NUMPAD9: 105,
        /** * on the numeric keypad. */
        VK_MULTIPLY: 106,
        /** + on the numeric keypad. */
        VK_ADD: 107,
        /***/
        VK_SEPARATOR: 108,
        /** - on the numeric keypad. */
        VK_SUBTRACT: 109,
        /** Decimal point on the numeric keypad. */
        VK_DECIMAL: 110,
        /** / on the numeric keypad. */
        VK_DIVIDE: 111,
        /** F1 key. */
        VK_F1: 112,
        /** F2 key. */
        VK_F2: 113,
        /** F3 key. */
        VK_F3: 114,
        /** F4 key. */
        VK_F4: 115,
        /** F5 key. */
        VK_F5: 116,
        /** F6 key. */
        VK_F6: 117,
        /** F7 key. */
        VK_F7: 118,
        /** F8 key. */
        VK_F8: 119,
        /** F9 key. */
        VK_F9: 120,
        /** F10 key. */
        VK_F10: 121,
        /** F11 key. */
        VK_F11: 122,
        /** F12 key. */
        VK_F12: 123,
        /** F13 key. */
        VK_F13: 124,
        /** F14 key. */
        VK_F14: 125,
        /** F15 key. */
        VK_F15: 126,
        /** F16 key. */
        VK_F16: 127,
        /** F17 key. */
        VK_F17: 128,
        /** F18 key. */
        VK_F18: 129,
        /** F19 key. */
        VK_F19: 130,
        /** F20 key. */
        VK_F20: 131,
        /** F21 key. */
        VK_F21: 132,
        /** F22 key. */
        VK_F22: 133,
        /** F23 key. */
        VK_F23: 134,
        /** F24 key. */
        VK_F24: 135,
        /** Num Lock key. */
        VK_NUM_LOCK: 144,
        /** Scroll Lock key. */
        VK_SCROLL_LOCK: 145,
        /** Circumflex (^) key. Requires Gecko 15.0 */
        VK_CIRCUMFLEX: 160,
        /** Exclamation (!) key. Requires Gecko 15.0 */
        VK_EXCLAMATION: 161,
        /** Double quote () key. Requires Gecko 15.0 */
        VK_DOUBLE_QUOTE: 162,
        /** Hash (#) key. Requires Gecko 15.0 */
        VK_HASH: 163,
        /** Dollar sign ($) key. Requires Gecko 15.0 */
        VK_DOLLAR: 164,
        /** Percent (%) key. Requires Gecko 15.0 */
        VK_PERCENT: 165,
        /** Ampersand (&) key. Requires Gecko 15.0 */
        VK_AMPERSAND: 166,
        /** Underscore (_) key. Requires Gecko 15.0 */
        VK_UNDERSCORE: 167,
        /** Open parenthesis (() key. Requires Gecko 15.0 */
        VK_OPEN_PAREN: 168,
        /** Close parenthesis ()) key. Requires Gecko 15.0 */
        VK_CLOSE_PAREN: 169,
        /* Asterisk (*) key. Requires Gecko 15.0 */
        VK_ASTERISK: 170,
        /** Plus (+) key. Requires Gecko 15.0 */
        VK_PLUS: 171,
        /** Pipe (|) key. Requires Gecko 15.0 */
        VK_PIPE: 172,
        /** Hyphen-US/docs/Minus (-) key. Requires Gecko 15.0 */
        VK_HYPHEN_MINUS: 173,
        /** Open curly bracket ({) key. Requires Gecko 15.0 */
        VK_OPEN_CURLY_BRACKET: 174,
        /** Close curly bracket (}) key. Requires Gecko 15.0 */
        VK_CLOSE_CURLY_BRACKET: 175,
        /** Tilde (~) key. Requires Gecko 15.0 */
        VK_TILDE: 176,
        /** Comma (,) key. */
        VK_COMMA: 188,
        /** Period (.) key. */
        VK_PERIOD: 190,
        /** Slash (/) key. */
        VK_SLASH: 191,
        /** Back tick (`) key. */
        VK_BACK_QUOTE: 192,
        /** Open square bracket ([) key. */
        VK_OPEN_BRACKET: 219,
        /** Back slash (\) key. */
        VK_BACK_SLASH: 220,
        /** Close square bracket (]) key. */
        VK_CLOSE_BRACKET: 221,
        /** Quote (''') key. */
        VK_QUOTE: 222,
        /** Meta key on Linux, Command key on Mac. */
        VK_META: 224,
        /** AltGr key on Linux. Requires Gecko 15.0 */
        VK_ALTGR: 225,
        /** Windows logo key on Windows. Or Super or Hyper key on Linux. Requires Gecko 15.0 */
        VK_WIN: 91,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_KANA: 21,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_HANGUL: 21,
        /** 英数 key on Japanese Mac keyboard. Requires Gecko 15.0 */
        VK_EISU: 22,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_JUNJA: 23,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_FINAL: 24,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_HANJA: 25,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_KANJI: 25,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_CONVERT: 28,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_NONCONVERT: 29,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_ACCEPT: 30,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_MODECHANGE: 31,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_SELECT: 41,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_PRINT: 42,
        /** Linux support for this keycode was added in Gecko 4.0. */
        VK_EXECUTE: 43,
        /** Linux support for this keycode was added in Gecko 4.0.	 */
        VK_SLEEP: 95
    };

    const BACKENDS = {
        "hex": Hex,
        "rect": Rect,
        "tile": Tile,
        "term": Term
    };
    const DEFAULT_OPTIONS = {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        transpose: false,
        layout: "rect",
        fontSize: 15,
        spacing: 1,
        border: 0,
        forceSquareRatio: false,
        fontFamily: "monospace",
        fontStyle: "",
        fg: "#ccc",
        bg: "#000",
        tileWidth: 32,
        tileHeight: 32,
        tileMap: {},
        tileSet: null,
        tileColorize: false
    };
    /**
     * @class Visual map display
     */
    class Display {
        constructor(options = {}) {
            this._data = {};
            this._dirty = false; // false = nothing, true = all, object = dirty cells
            this._options = {};
            options = Object.assign({}, DEFAULT_OPTIONS, options);
            this.setOptions(options);
            this.DEBUG = this.DEBUG.bind(this);
            this._tick = this._tick.bind(this);
            this._backend.schedule(this._tick);
        }
        /**
         * Debug helper, ideal as a map generator callback. Always bound to this.
         * @param {int} x
         * @param {int} y
         * @param {int} what
         */
        DEBUG(x, y, what) {
            let colors = [this._options.bg, this._options.fg];
            this.draw(x, y, null, null, colors[what % colors.length]);
        }
        /**
         * Clear the whole display (cover it with background color)
         */
        clear() {
            this._data = {};
            this._dirty = true;
        }
        /**
         * @see ROT.Display
         */
        setOptions(options) {
            Object.assign(this._options, options);
            if (options.width || options.height || options.fontSize || options.fontFamily || options.spacing || options.layout) {
                if (options.layout) {
                    let ctor = BACKENDS[options.layout];
                    this._backend = new ctor();
                }
                this._backend.setOptions(this._options);
                this._dirty = true;
            }
            return this;
        }
        /**
         * Returns currently set options
         */
        getOptions() { return this._options; }
        /**
         * Returns the DOM node of this display
         */
        getContainer() { return this._backend.getContainer(); }
        /**
         * Compute the maximum width/height to fit into a set of given constraints
         * @param {int} availWidth Maximum allowed pixel width
         * @param {int} availHeight Maximum allowed pixel height
         * @returns {int[2]} cellWidth,cellHeight
         */
        computeSize(availWidth, availHeight) {
            return this._backend.computeSize(availWidth, availHeight);
        }
        /**
         * Compute the maximum font size to fit into a set of given constraints
         * @param {int} availWidth Maximum allowed pixel width
         * @param {int} availHeight Maximum allowed pixel height
         * @returns {int} fontSize
         */
        computeFontSize(availWidth, availHeight) {
            return this._backend.computeFontSize(availWidth, availHeight);
        }
        computeTileSize(availWidth, availHeight) {
            let width = Math.floor(availWidth / this._options.width);
            let height = Math.floor(availHeight / this._options.height);
            return [width, height];
        }
        /**
         * Convert a DOM event (mouse or touch) to map coordinates. Uses first touch for multi-touch.
         * @param {Event} e event
         * @returns {int[2]} -1 for values outside of the canvas
         */
        eventToPosition(e) {
            let x, y;
            if ("touches" in e) {
                x = e.touches[0].clientX;
                y = e.touches[0].clientY;
            }
            else {
                x = e.clientX;
                y = e.clientY;
            }
            return this._backend.eventToPosition(x, y);
        }
        /**
         * @param {int} x
         * @param {int} y
         * @param {string || string[]} ch One or more chars (will be overlapping themselves)
         * @param {string} [fg] foreground color
         * @param {string} [bg] background color
         */
        draw(x, y, ch, fg, bg) {
            if (!fg) {
                fg = this._options.fg;
            }
            if (!bg) {
                bg = this._options.bg;
            }
            let key = `${x},${y}`;
            this._data[key] = [x, y, ch, fg, bg];
            if (this._dirty === true) {
                return;
            } // will already redraw everything 
            if (!this._dirty) {
                this._dirty = {};
            } // first!
            this._dirty[key] = true;
        }
        /**
         * Draws a text at given position. Optionally wraps at a maximum length. Currently does not work with hex layout.
         * @param {int} x
         * @param {int} y
         * @param {string} text May contain color/background format specifiers, %c{name}/%b{name}, both optional. %c{}/%b{} resets to default.
         * @param {int} [maxWidth] wrap at what width?
         * @returns {int} lines drawn
         */
        drawText(x, y, text, maxWidth) {
            let fg = null;
            let bg = null;
            let cx = x;
            let cy = y;
            let lines = 1;
            if (!maxWidth) {
                maxWidth = this._options.width - x;
            }
            let tokens = tokenize(text, maxWidth);
            while (tokens.length) { // interpret tokenized opcode stream
                let token = tokens.shift();
                switch (token.type) {
                    case TYPE_TEXT:
                        let isSpace = false, isPrevSpace = false, isFullWidth = false, isPrevFullWidth = false;
                        for (let i = 0; i < token.value.length; i++) {
                            let cc = token.value.charCodeAt(i);
                            let c = token.value.charAt(i);
                            // Assign to `true` when the current char is full-width.
                            isFullWidth = (cc > 0xff00 && cc < 0xff61) || (cc > 0xffdc && cc < 0xffe8) || cc > 0xffee;
                            // Current char is space, whatever full-width or half-width both are OK.
                            isSpace = (c.charCodeAt(0) == 0x20 || c.charCodeAt(0) == 0x3000);
                            // The previous char is full-width and
                            // current char is nether half-width nor a space.
                            if (isPrevFullWidth && !isFullWidth && !isSpace) {
                                cx++;
                            } // add an extra position
                            // The current char is full-width and
                            // the previous char is not a space.
                            if (isFullWidth && !isPrevSpace) {
                                cx++;
                            } // add an extra position
                            this.draw(cx++, cy, c, fg, bg);
                            isPrevSpace = isSpace;
                            isPrevFullWidth = isFullWidth;
                        }
                        break;
                    case TYPE_FG:
                        fg = token.value || null;
                        break;
                    case TYPE_BG:
                        bg = token.value || null;
                        break;
                    case TYPE_NEWLINE:
                        cx = x;
                        cy++;
                        lines++;
                        break;
                }
            }
            return lines;
        }
        /**
         * Timer tick: update dirty parts
         */
        _tick() {
            this._backend.schedule(this._tick);
            if (!this._dirty) {
                return;
            }
            if (this._dirty === true) { // draw all
                this._backend.clear();
                for (let id in this._data) {
                    this._draw(id, false);
                } // redraw cached data 
            }
            else { // draw only dirty 
                for (let key in this._dirty) {
                    this._draw(key, true);
                }
            }
            this._dirty = false;
        }
        /**
         * @param {string} key What to draw
         * @param {bool} clearBefore Is it necessary to clean before?
         */
        _draw(key, clearBefore) {
            let data = this._data[key];
            if (data[4] != this._options.bg) {
                clearBefore = true;
            }
            this._backend.draw(data, clearBefore);
        }
    }
    Display.Rect = Rect;
    Display.Hex = Hex;
    Display.Tile = Tile;
    Display.Term = Term;

    class EventQueue {
        /**
         * @class Generic event queue: stores events and retrieves them based on their time
         */
        constructor() {
            this._time = 0;
            this._events = [];
            this._eventTimes = [];
        }
        /**
         * @returns {number} Elapsed time
         */
        getTime() { return this._time; }
        /**
         * Clear all scheduled events
         */
        clear() {
            this._events = [];
            this._eventTimes = [];
            return this;
        }
        /**
         * @param {?} event
         * @param {number} time
         */
        add(event, time) {
            let index = this._events.length;
            for (let i = 0; i < this._eventTimes.length; i++) {
                if (this._eventTimes[i] > time) {
                    index = i;
                    break;
                }
            }
            this._events.splice(index, 0, event);
            this._eventTimes.splice(index, 0, time);
        }
        /**
         * Locates the nearest event, advances time if necessary. Returns that event and removes it from the queue.
         * @returns {? || null} The event previously added by addEvent, null if no event available
         */
        get() {
            if (!this._events.length) {
                return null;
            }
            let time = this._eventTimes.splice(0, 1)[0];
            if (time > 0) { /* advance */
                this._time += time;
                for (let i = 0; i < this._eventTimes.length; i++) {
                    this._eventTimes[i] -= time;
                }
            }
            return this._events.splice(0, 1)[0];
        }
        /**
         * Get the time associated with the given event
         * @param {?} event
         * @returns {number} time
         */
        getEventTime(event) {
            let index = this._events.indexOf(event);
            if (index == -1) {
                return undefined;
            }
            return this._eventTimes[index];
        }
        /**
         * Remove an event from the queue
         * @param {?} event
         * @returns {bool} success?
         */
        remove(event) {
            let index = this._events.indexOf(event);
            if (index == -1) {
                return false;
            }
            this._remove(index);
            return true;
        }
        ;
        /**
         * Remove an event from the queue
         * @param {int} index
         */
        _remove(index) {
            this._events.splice(index, 1);
            this._eventTimes.splice(index, 1);
        }
        ;
    }

    class Scheduler {
        /**
         * @class Abstract scheduler
         */
        constructor() {
            this._queue = new EventQueue();
            this._repeat = [];
            this._current = null;
        }
        /**
         * @see ROT.EventQueue#getTime
         */
        getTime() { return this._queue.getTime(); }
        /**
         * @param {?} item
         * @param {bool} repeat
         */
        add(item, repeat) {
            if (repeat) {
                this._repeat.push(item);
            }
            return this;
        }
        /**
         * Get the time the given item is scheduled for
         * @param {?} item
         * @returns {number} time
         */
        getTimeOf(item) {
            return this._queue.getEventTime(item);
        }
        /**
         * Clear all items
         */
        clear() {
            this._queue.clear();
            this._repeat = [];
            this._current = null;
            return this;
        }
        /**
         * Remove a previously added item
         * @param {?} item
         * @returns {bool} successful?
         */
        remove(item) {
            let result = this._queue.remove(item);
            let index = this._repeat.indexOf(item);
            if (index != -1) {
                this._repeat.splice(index, 1);
            }
            if (this._current == item) {
                this._current = null;
            }
            return result;
        }
        /**
         * Schedule next item
         * @returns {?}
         */
        next() {
            this._current = this._queue.get();
            return this._current;
        }
    }

    /**
     * @class Simple fair scheduler (round-robin style)
     */
    class Simple extends Scheduler {
        add(item, repeat) {
            this._queue.add(item, 0);
            return super.add(item, repeat);
        }
        next() {
            if (this._current && this._repeat.indexOf(this._current) != -1) {
                this._queue.add(this._current, 0);
            }
            return super.next();
        }
    }

    /**
     * @class Speed-based scheduler
     */
    class Speed extends Scheduler {
        /**
         * @param {object} item anything with "getSpeed" method
         * @param {bool} repeat
         * @param {number} [time=1/item.getSpeed()]
         * @see ROT.Scheduler#add
         */
        add(item, repeat, time) {
            this._queue.add(item, time !== undefined ? time : 1 / item.getSpeed());
            return super.add(item, repeat);
        }
        /**
         * @see ROT.Scheduler#next
         */
        next() {
            if (this._current && this._repeat.indexOf(this._current) != -1) {
                this._queue.add(this._current, 1 / this._current.getSpeed());
            }
            return super.next();
        }
    }

    /**
     * @class Action-based scheduler
     * @augments ROT.Scheduler
     */
    class Action extends Scheduler {
        constructor() {
            super();
            this._defaultDuration = 1; /* for newly added */
            this._duration = this._defaultDuration; /* for this._current */
        }
        /**
         * @param {object} item
         * @param {bool} repeat
         * @param {number} [time=1]
         * @see ROT.Scheduler#add
         */
        add(item, repeat, time) {
            this._queue.add(item, time || this._defaultDuration);
            return super.add(item, repeat);
        }
        clear() {
            this._duration = this._defaultDuration;
            return super.clear();
        }
        remove(item) {
            if (item == this._current) {
                this._duration = this._defaultDuration;
            }
            return super.remove(item);
        }
        /**
         * @see ROT.Scheduler#next
         */
        next() {
            if (this._current && this._repeat.indexOf(this._current) != -1) {
                this._queue.add(this._current, this._duration || this._defaultDuration);
                this._duration = this._defaultDuration;
            }
            return super.next();
        }
        /**
         * Set duration for the active item
         */
        setDuration(time) {
            if (this._current) {
                this._duration = time;
            }
            return this;
        }
    }

    var Scheduler$1 = { Simple, Speed, Action };

    class FOV {
        /**
         * @class Abstract FOV algorithm
         * @param {function} lightPassesCallback Does the light pass through x,y?
         * @param {object} [options]
         * @param {int} [options.topology=8] 4/6/8
         */
        constructor(lightPassesCallback, options = {}) {
            this._lightPasses = lightPassesCallback;
            this._options = Object.assign({ topology: 8 }, options);
        }
        /**
         * Return all neighbors in a concentric ring
         * @param {int} cx center-x
         * @param {int} cy center-y
         * @param {int} r range
         */
        _getCircle(cx, cy, r) {
            let result = [];
            let dirs, countFactor, startOffset;
            switch (this._options.topology) {
                case 4:
                    countFactor = 1;
                    startOffset = [0, 1];
                    dirs = [
                        DIRS[8][7],
                        DIRS[8][1],
                        DIRS[8][3],
                        DIRS[8][5]
                    ];
                    break;
                case 6:
                    dirs = DIRS[6];
                    countFactor = 1;
                    startOffset = [-1, 1];
                    break;
                case 8:
                    dirs = DIRS[4];
                    countFactor = 2;
                    startOffset = [-1, 1];
                    break;
                default:
                    throw new Error("Incorrect topology for FOV computation");
                    break;
            }
            /* starting neighbor */
            let x = cx + startOffset[0] * r;
            let y = cy + startOffset[1] * r;
            /* circle */
            for (let i = 0; i < dirs.length; i++) {
                for (let j = 0; j < r * countFactor; j++) {
                    result.push([x, y]);
                    x += dirs[i][0];
                    y += dirs[i][1];
                }
            }
            return result;
        }
    }

    /**
     * @class Discrete shadowcasting algorithm. Obsoleted by Precise shadowcasting.
     * @augments ROT.FOV
     */
    class DiscreteShadowcasting extends FOV {
        compute(x, y, R, callback) {
            /* this place is always visible */
            callback(x, y, 0, 1);
            /* standing in a dark place. FIXME is this a good idea?  */
            if (!this._lightPasses(x, y)) {
                return;
            }
            /* start and end angles */
            let DATA = [];
            let A, B, cx, cy, blocks;
            /* analyze surrounding cells in concentric rings, starting from the center */
            for (let r = 1; r <= R; r++) {
                let neighbors = this._getCircle(x, y, r);
                let angle = 360 / neighbors.length;
                for (let i = 0; i < neighbors.length; i++) {
                    cx = neighbors[i][0];
                    cy = neighbors[i][1];
                    A = angle * (i - 0.5);
                    B = A + angle;
                    blocks = !this._lightPasses(cx, cy);
                    if (this._visibleCoords(Math.floor(A), Math.ceil(B), blocks, DATA)) {
                        callback(cx, cy, r, 1);
                    }
                    if (DATA.length == 2 && DATA[0] == 0 && DATA[1] == 360) {
                        return;
                    } /* cutoff? */
                } /* for all cells in this ring */
            } /* for all rings */
        }
        /**
         * @param {int} A start angle
         * @param {int} B end angle
         * @param {bool} blocks Does current cell block visibility?
         * @param {int[][]} DATA shadowed angle pairs
         */
        _visibleCoords(A, B, blocks, DATA) {
            if (A < 0) {
                let v1 = this._visibleCoords(0, B, blocks, DATA);
                let v2 = this._visibleCoords(360 + A, 360, blocks, DATA);
                return v1 || v2;
            }
            let index = 0;
            while (index < DATA.length && DATA[index] < A) {
                index++;
            }
            if (index == DATA.length) { /* completely new shadow */
                if (blocks) {
                    DATA.push(A, B);
                }
                return true;
            }
            let count = 0;
            if (index % 2) { /* this shadow starts in an existing shadow, or within its ending boundary */
                while (index < DATA.length && DATA[index] < B) {
                    index++;
                    count++;
                }
                if (count == 0) {
                    return false;
                }
                if (blocks) {
                    if (count % 2) {
                        DATA.splice(index - count, count, B);
                    }
                    else {
                        DATA.splice(index - count, count);
                    }
                }
                return true;
            }
            else { /* this shadow starts outside an existing shadow, or within a starting boundary */
                while (index < DATA.length && DATA[index] < B) {
                    index++;
                    count++;
                }
                /* visible when outside an existing shadow, or when overlapping */
                if (A == DATA[index - count] && count == 1) {
                    return false;
                }
                if (blocks) {
                    if (count % 2) {
                        DATA.splice(index - count, count, A);
                    }
                    else {
                        DATA.splice(index - count, count, A, B);
                    }
                }
                return true;
            }
        }
    }

    /**
     * @class Precise shadowcasting algorithm
     * @augments ROT.FOV
     */
    class PreciseShadowcasting extends FOV {
        compute(x, y, R, callback) {
            /* this place is always visible */
            callback(x, y, 0, 1);
            /* standing in a dark place. FIXME is this a good idea?  */
            if (!this._lightPasses(x, y)) {
                return;
            }
            /* list of all shadows */
            let SHADOWS = [];
            let cx, cy, blocks, A1, A2, visibility;
            /* analyze surrounding cells in concentric rings, starting from the center */
            for (let r = 1; r <= R; r++) {
                let neighbors = this._getCircle(x, y, r);
                let neighborCount = neighbors.length;
                for (let i = 0; i < neighborCount; i++) {
                    cx = neighbors[i][0];
                    cy = neighbors[i][1];
                    /* shift half-an-angle backwards to maintain consistency of 0-th cells */
                    A1 = [i ? 2 * i - 1 : 2 * neighborCount - 1, 2 * neighborCount];
                    A2 = [2 * i + 1, 2 * neighborCount];
                    blocks = !this._lightPasses(cx, cy);
                    visibility = this._checkVisibility(A1, A2, blocks, SHADOWS);
                    if (visibility) {
                        callback(cx, cy, r, visibility);
                    }
                    if (SHADOWS.length == 2 && SHADOWS[0][0] == 0 && SHADOWS[1][0] == SHADOWS[1][1]) {
                        return;
                    } /* cutoff? */
                } /* for all cells in this ring */
            } /* for all rings */
        }
        /**
         * @param {int[2]} A1 arc start
         * @param {int[2]} A2 arc end
         * @param {bool} blocks Does current arc block visibility?
         * @param {int[][]} SHADOWS list of active shadows
         */
        _checkVisibility(A1, A2, blocks, SHADOWS) {
            if (A1[0] > A2[0]) { /* split into two sub-arcs */
                let v1 = this._checkVisibility(A1, [A1[1], A1[1]], blocks, SHADOWS);
                let v2 = this._checkVisibility([0, 1], A2, blocks, SHADOWS);
                return (v1 + v2) / 2;
            }
            /* index1: first shadow >= A1 */
            let index1 = 0, edge1 = false;
            while (index1 < SHADOWS.length) {
                let old = SHADOWS[index1];
                let diff = old[0] * A1[1] - A1[0] * old[1];
                if (diff >= 0) { /* old >= A1 */
                    if (diff == 0 && !(index1 % 2)) {
                        edge1 = true;
                    }
                    break;
                }
                index1++;
            }
            /* index2: last shadow <= A2 */
            let index2 = SHADOWS.length, edge2 = false;
            while (index2--) {
                let old = SHADOWS[index2];
                let diff = A2[0] * old[1] - old[0] * A2[1];
                if (diff >= 0) { /* old <= A2 */
                    if (diff == 0 && (index2 % 2)) {
                        edge2 = true;
                    }
                    break;
                }
            }
            let visible = true;
            if (index1 == index2 && (edge1 || edge2)) { /* subset of existing shadow, one of the edges match */
                visible = false;
            }
            else if (edge1 && edge2 && index1 + 1 == index2 && (index2 % 2)) { /* completely equivalent with existing shadow */
                visible = false;
            }
            else if (index1 > index2 && (index1 % 2)) { /* subset of existing shadow, not touching */
                visible = false;
            }
            if (!visible) {
                return 0;
            } /* fast case: not visible */
            let visibleLength;
            /* compute the length of visible arc, adjust list of shadows (if blocking) */
            let remove = index2 - index1 + 1;
            if (remove % 2) {
                if (index1 % 2) { /* first edge within existing shadow, second outside */
                    let P = SHADOWS[index1];
                    visibleLength = (A2[0] * P[1] - P[0] * A2[1]) / (P[1] * A2[1]);
                    if (blocks) {
                        SHADOWS.splice(index1, remove, A2);
                    }
                }
                else { /* second edge within existing shadow, first outside */
                    let P = SHADOWS[index2];
                    visibleLength = (P[0] * A1[1] - A1[0] * P[1]) / (A1[1] * P[1]);
                    if (blocks) {
                        SHADOWS.splice(index1, remove, A1);
                    }
                }
            }
            else {
                if (index1 % 2) { /* both edges within existing shadows */
                    let P1 = SHADOWS[index1];
                    let P2 = SHADOWS[index2];
                    visibleLength = (P2[0] * P1[1] - P1[0] * P2[1]) / (P1[1] * P2[1]);
                    if (blocks) {
                        SHADOWS.splice(index1, remove);
                    }
                }
                else { /* both edges outside existing shadows */
                    if (blocks) {
                        SHADOWS.splice(index1, remove, A1, A2);
                    }
                    return 1; /* whole arc visible! */
                }
            }
            let arcLength = (A2[0] * A1[1] - A1[0] * A2[1]) / (A1[1] * A2[1]);
            return visibleLength / arcLength;
        }
    }

    /** Octants used for translating recursive shadowcasting offsets */
    const OCTANTS = [
        [-1, 0, 0, 1],
        [0, -1, 1, 0],
        [0, -1, -1, 0],
        [-1, 0, 0, -1],
        [1, 0, 0, -1],
        [0, 1, -1, 0],
        [0, 1, 1, 0],
        [1, 0, 0, 1]
    ];
    /**
     * @class Recursive shadowcasting algorithm
     * Currently only supports 4/8 topologies, not hexagonal.
     * Based on Peter Harkins' implementation of Björn Bergström's algorithm described here: http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting
     * @augments ROT.FOV
     */
    class RecursiveShadowcasting extends FOV {
        /**
         * Compute visibility for a 360-degree circle
         * @param {int} x
         * @param {int} y
         * @param {int} R Maximum visibility radius
         * @param {function} callback
         */
        compute(x, y, R, callback) {
            //You can always see your own tile
            callback(x, y, 0, 1);
            for (let i = 0; i < OCTANTS.length; i++) {
                this._renderOctant(x, y, OCTANTS[i], R, callback);
            }
        }
        /**
         * Compute visibility for a 180-degree arc
         * @param {int} x
         * @param {int} y
         * @param {int} R Maximum visibility radius
         * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
         * @param {function} callback
         */
        compute180(x, y, R, dir, callback) {
            //You can always see your own tile
            callback(x, y, 0, 1);
            let previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 180 degrees
            let nextPreviousOctant = (dir - 2 + 8) % 8; //Need to retrieve the previous two octants to render a full 180 degrees
            let nextOctant = (dir + 1 + 8) % 8; //Need to grab to next octant to render a full 180 degrees
            this._renderOctant(x, y, OCTANTS[nextPreviousOctant], R, callback);
            this._renderOctant(x, y, OCTANTS[previousOctant], R, callback);
            this._renderOctant(x, y, OCTANTS[dir], R, callback);
            this._renderOctant(x, y, OCTANTS[nextOctant], R, callback);
        }
        ;
        /**
         * Compute visibility for a 90-degree arc
         * @param {int} x
         * @param {int} y
         * @param {int} R Maximum visibility radius
         * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
         * @param {function} callback
         */
        compute90(x, y, R, dir, callback) {
            //You can always see your own tile
            callback(x, y, 0, 1);
            let previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 90 degrees
            this._renderOctant(x, y, OCTANTS[dir], R, callback);
            this._renderOctant(x, y, OCTANTS[previousOctant], R, callback);
        }
        /**
         * Render one octant (45-degree arc) of the viewshed
         * @param {int} x
         * @param {int} y
         * @param {int} octant Octant to be rendered
         * @param {int} R Maximum visibility radius
         * @param {function} callback
         */
        _renderOctant(x, y, octant, R, callback) {
            //Radius incremented by 1 to provide same coverage area as other shadowcasting radiuses
            this._castVisibility(x, y, 1, 1.0, 0.0, R + 1, octant[0], octant[1], octant[2], octant[3], callback);
        }
        /**
         * Actually calculates the visibility
         * @param {int} startX The starting X coordinate
         * @param {int} startY The starting Y coordinate
         * @param {int} row The row to render
         * @param {float} visSlopeStart The slope to start at
         * @param {float} visSlopeEnd The slope to end at
         * @param {int} radius The radius to reach out to
         * @param {int} xx
         * @param {int} xy
         * @param {int} yx
         * @param {int} yy
         * @param {function} callback The callback to use when we hit a block that is visible
         */
        _castVisibility(startX, startY, row, visSlopeStart, visSlopeEnd, radius, xx, xy, yx, yy, callback) {
            if (visSlopeStart < visSlopeEnd) {
                return;
            }
            for (let i = row; i <= radius; i++) {
                let dx = -i - 1;
                let dy = -i;
                let blocked = false;
                let newStart = 0;
                //'Row' could be column, names here assume octant 0 and would be flipped for half the octants
                while (dx <= 0) {
                    dx += 1;
                    //Translate from relative coordinates to map coordinates
                    let mapX = startX + dx * xx + dy * xy;
                    let mapY = startY + dx * yx + dy * yy;
                    //Range of the row
                    let slopeStart = (dx - 0.5) / (dy + 0.5);
                    let slopeEnd = (dx + 0.5) / (dy - 0.5);
                    //Ignore if not yet at left edge of Octant
                    if (slopeEnd > visSlopeStart) {
                        continue;
                    }
                    //Done if past right edge
                    if (slopeStart < visSlopeEnd) {
                        break;
                    }
                    //If it's in range, it's visible
                    if ((dx * dx + dy * dy) < (radius * radius)) {
                        callback(mapX, mapY, i, 1);
                    }
                    if (!blocked) {
                        //If tile is a blocking tile, cast around it
                        if (!this._lightPasses(mapX, mapY) && i < radius) {
                            blocked = true;
                            this._castVisibility(startX, startY, i + 1, visSlopeStart, slopeStart, radius, xx, xy, yx, yy, callback);
                            newStart = slopeEnd;
                        }
                    }
                    else {
                        //Keep narrowing if scanning across a block
                        if (!this._lightPasses(mapX, mapY)) {
                            newStart = slopeEnd;
                            continue;
                        }
                        //Block has ended
                        blocked = false;
                        visSlopeStart = newStart;
                    }
                }
                if (blocked) {
                    break;
                }
            }
        }
    }

    var FOV$1 = { DiscreteShadowcasting, PreciseShadowcasting, RecursiveShadowcasting };

    class Map$1 {
        /**
         * @class Base map generator
         * @param {int} [width=ROT.DEFAULT_WIDTH]
         * @param {int} [height=ROT.DEFAULT_HEIGHT]
         */
        constructor(width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
            this._width = width;
            this._height = height;
        }
        ;
        _fillMap(value) {
            let map = [];
            for (let i = 0; i < this._width; i++) {
                map.push([]);
                for (let j = 0; j < this._height; j++) {
                    map[i].push(value);
                }
            }
            return map;
        }
    }

    /**
     * @class Simple empty rectangular room
     * @augments ROT.Map
     */
    class Arena extends Map$1 {
        create(callback) {
            let w = this._width - 1;
            let h = this._height - 1;
            for (let i = 0; i <= w; i++) {
                for (let j = 0; j <= h; j++) {
                    let empty = (i && j && i < w && j < h);
                    callback(i, j, empty ? 0 : 1);
                }
            }
            return this;
        }
    }

    /**
     * @class Dungeon map: has rooms and corridors
     * @augments ROT.Map
     */
    class Dungeon extends Map$1 {
        constructor(width, height) {
            super(width, height);
            this._rooms = [];
            this._corridors = [];
        }
        /**
         * Get all generated rooms
         * @returns {ROT.Map.Feature.Room[]}
         */
        getRooms() { return this._rooms; }
        /**
         * Get all generated corridors
         * @returns {ROT.Map.Feature.Corridor[]}
         */
        getCorridors() { return this._corridors; }
    }

    /**
     * @class Dungeon feature; has own .create() method
     */
    class Feature {
    }
    /**
     * @class Room
     * @augments ROT.Map.Feature
     * @param {int} x1
     * @param {int} y1
     * @param {int} x2
     * @param {int} y2
     * @param {int} [doorX]
     * @param {int} [doorY]
     */
    class Room extends Feature {
        constructor(x1, y1, x2, y2, doorX, doorY) {
            super();
            this._x1 = x1;
            this._y1 = y1;
            this._x2 = x2;
            this._y2 = y2;
            this._doors = {};
            if (doorX !== undefined && doorY !== undefined) {
                this.addDoor(doorX, doorY);
            }
        }
        ;
        /**
         * Room of random size, with a given doors and direction
         */
        static createRandomAt(x, y, dx, dy, options) {
            let min = options.roomWidth[0];
            let max = options.roomWidth[1];
            let width = RNG$1.getUniformInt(min, max);
            min = options.roomHeight[0];
            max = options.roomHeight[1];
            let height = RNG$1.getUniformInt(min, max);
            if (dx == 1) { /* to the right */
                let y2 = y - Math.floor(RNG$1.getUniform() * height);
                return new this(x + 1, y2, x + width, y2 + height - 1, x, y);
            }
            if (dx == -1) { /* to the left */
                let y2 = y - Math.floor(RNG$1.getUniform() * height);
                return new this(x - width, y2, x - 1, y2 + height - 1, x, y);
            }
            if (dy == 1) { /* to the bottom */
                let x2 = x - Math.floor(RNG$1.getUniform() * width);
                return new this(x2, y + 1, x2 + width - 1, y + height, x, y);
            }
            if (dy == -1) { /* to the top */
                let x2 = x - Math.floor(RNG$1.getUniform() * width);
                return new this(x2, y - height, x2 + width - 1, y - 1, x, y);
            }
            throw new Error("dx or dy must be 1 or -1");
        }
        /**
         * Room of random size, positioned around center coords
         */
        static createRandomCenter(cx, cy, options) {
            let min = options.roomWidth[0];
            let max = options.roomWidth[1];
            let width = RNG$1.getUniformInt(min, max);
            min = options.roomHeight[0];
            max = options.roomHeight[1];
            let height = RNG$1.getUniformInt(min, max);
            let x1 = cx - Math.floor(RNG$1.getUniform() * width);
            let y1 = cy - Math.floor(RNG$1.getUniform() * height);
            let x2 = x1 + width - 1;
            let y2 = y1 + height - 1;
            return new this(x1, y1, x2, y2);
        }
        /**
         * Room of random size within a given dimensions
         */
        static createRandom(availWidth, availHeight, options) {
            let min = options.roomWidth[0];
            let max = options.roomWidth[1];
            let width = RNG$1.getUniformInt(min, max);
            min = options.roomHeight[0];
            max = options.roomHeight[1];
            let height = RNG$1.getUniformInt(min, max);
            let left = availWidth - width - 1;
            let top = availHeight - height - 1;
            let x1 = 1 + Math.floor(RNG$1.getUniform() * left);
            let y1 = 1 + Math.floor(RNG$1.getUniform() * top);
            let x2 = x1 + width - 1;
            let y2 = y1 + height - 1;
            return new this(x1, y1, x2, y2);
        }
        addDoor(x, y) {
            this._doors[x + "," + y] = 1;
            return this;
        }
        /**
         * @param {function}
         */
        getDoors(cb) {
            for (let key in this._doors) {
                let parts = key.split(",");
                cb(parseInt(parts[0]), parseInt(parts[1]));
            }
            return this;
        }
        clearDoors() {
            this._doors = {};
            return this;
        }
        addDoors(isWallCallback) {
            let left = this._x1 - 1;
            let right = this._x2 + 1;
            let top = this._y1 - 1;
            let bottom = this._y2 + 1;
            for (let x = left; x <= right; x++) {
                for (let y = top; y <= bottom; y++) {
                    if (x != left && x != right && y != top && y != bottom) {
                        continue;
                    }
                    if (isWallCallback(x, y)) {
                        continue;
                    }
                    this.addDoor(x, y);
                }
            }
            return this;
        }
        debug() {
            console.log("room", this._x1, this._y1, this._x2, this._y2);
        }
        isValid(isWallCallback, canBeDugCallback) {
            let left = this._x1 - 1;
            let right = this._x2 + 1;
            let top = this._y1 - 1;
            let bottom = this._y2 + 1;
            for (let x = left; x <= right; x++) {
                for (let y = top; y <= bottom; y++) {
                    if (x == left || x == right || y == top || y == bottom) {
                        if (!isWallCallback(x, y)) {
                            return false;
                        }
                    }
                    else {
                        if (!canBeDugCallback(x, y)) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
        /**
         * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty, 1 = wall, 2 = door. Multiple doors are allowed.
         */
        create(digCallback) {
            let left = this._x1 - 1;
            let right = this._x2 + 1;
            let top = this._y1 - 1;
            let bottom = this._y2 + 1;
            let value = 0;
            for (let x = left; x <= right; x++) {
                for (let y = top; y <= bottom; y++) {
                    if (x + "," + y in this._doors) {
                        value = 2;
                    }
                    else if (x == left || x == right || y == top || y == bottom) {
                        value = 1;
                    }
                    else {
                        value = 0;
                    }
                    digCallback(x, y, value);
                }
            }
        }
        getCenter() {
            return [Math.round((this._x1 + this._x2) / 2), Math.round((this._y1 + this._y2) / 2)];
        }
        getLeft() { return this._x1; }
        getRight() { return this._x2; }
        getTop() { return this._y1; }
        getBottom() { return this._y2; }
    }
    /**
     * @class Corridor
     * @augments ROT.Map.Feature
     * @param {int} startX
     * @param {int} startY
     * @param {int} endX
     * @param {int} endY
     */
    class Corridor extends Feature {
        constructor(startX, startY, endX, endY) {
            super();
            this._startX = startX;
            this._startY = startY;
            this._endX = endX;
            this._endY = endY;
            this._endsWithAWall = true;
        }
        static createRandomAt(x, y, dx, dy, options) {
            let min = options.corridorLength[0];
            let max = options.corridorLength[1];
            let length = RNG$1.getUniformInt(min, max);
            return new this(x, y, x + dx * length, y + dy * length);
        }
        debug() {
            console.log("corridor", this._startX, this._startY, this._endX, this._endY);
        }
        isValid(isWallCallback, canBeDugCallback) {
            let sx = this._startX;
            let sy = this._startY;
            let dx = this._endX - sx;
            let dy = this._endY - sy;
            let length = 1 + Math.max(Math.abs(dx), Math.abs(dy));
            if (dx) {
                dx = dx / Math.abs(dx);
            }
            if (dy) {
                dy = dy / Math.abs(dy);
            }
            let nx = dy;
            let ny = -dx;
            let ok = true;
            for (let i = 0; i < length; i++) {
                let x = sx + i * dx;
                let y = sy + i * dy;
                if (!canBeDugCallback(x, y)) {
                    ok = false;
                }
                if (!isWallCallback(x + nx, y + ny)) {
                    ok = false;
                }
                if (!isWallCallback(x - nx, y - ny)) {
                    ok = false;
                }
                if (!ok) {
                    length = i;
                    this._endX = x - dx;
                    this._endY = y - dy;
                    break;
                }
            }
            /**
             * If the length degenerated, this corridor might be invalid
             */
            /* not supported */
            if (length == 0) {
                return false;
            }
            /* length 1 allowed only if the next space is empty */
            if (length == 1 && isWallCallback(this._endX + dx, this._endY + dy)) {
                return false;
            }
            /**
             * We do not want the corridor to crash into a corner of a room;
             * if any of the ending corners is empty, the N+1th cell of this corridor must be empty too.
             *
             * Situation:
             * #######1
             * .......?
             * #######2
             *
             * The corridor was dug from left to right.
             * 1, 2 - problematic corners, ? = N+1th cell (not dug)
             */
            let firstCornerBad = !isWallCallback(this._endX + dx + nx, this._endY + dy + ny);
            let secondCornerBad = !isWallCallback(this._endX + dx - nx, this._endY + dy - ny);
            this._endsWithAWall = isWallCallback(this._endX + dx, this._endY + dy);
            if ((firstCornerBad || secondCornerBad) && this._endsWithAWall) {
                return false;
            }
            return true;
        }
        /**
         * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty.
         */
        create(digCallback) {
            let sx = this._startX;
            let sy = this._startY;
            let dx = this._endX - sx;
            let dy = this._endY - sy;
            let length = 1 + Math.max(Math.abs(dx), Math.abs(dy));
            if (dx) {
                dx = dx / Math.abs(dx);
            }
            if (dy) {
                dy = dy / Math.abs(dy);
            }
            for (let i = 0; i < length; i++) {
                let x = sx + i * dx;
                let y = sy + i * dy;
                digCallback(x, y, 0);
            }
            return true;
        }
        createPriorityWalls(priorityWallCallback) {
            if (!this._endsWithAWall) {
                return;
            }
            let sx = this._startX;
            let sy = this._startY;
            let dx = this._endX - sx;
            let dy = this._endY - sy;
            if (dx) {
                dx = dx / Math.abs(dx);
            }
            if (dy) {
                dy = dy / Math.abs(dy);
            }
            let nx = dy;
            let ny = -dx;
            priorityWallCallback(this._endX + dx, this._endY + dy);
            priorityWallCallback(this._endX + nx, this._endY + ny);
            priorityWallCallback(this._endX - nx, this._endY - ny);
        }
    }

    /**
     * @class Dungeon generator which tries to fill the space evenly. Generates independent rooms and tries to connect them.
     * @augments ROT.Map.Dungeon
     */
    class Uniform extends Dungeon {
        constructor(width, height, options) {
            super(width, height);
            this._options = {
                roomWidth: [3, 9],
                roomHeight: [3, 5],
                roomDugPercentage: 0.1,
                timeLimit: 1000 /* we stop after this much time has passed (msec) */
            };
            Object.assign(this._options, options);
            this._map = [];
            this._dug = 0;
            this._roomAttempts = 20; /* new room is created N-times until is considered as impossible to generate */
            this._corridorAttempts = 20; /* corridors are tried N-times until the level is considered as impossible to connect */
            this._connected = []; /* list of already connected rooms */
            this._unconnected = []; /* list of remaining unconnected rooms */
            this._digCallback = this._digCallback.bind(this);
            this._canBeDugCallback = this._canBeDugCallback.bind(this);
            this._isWallCallback = this._isWallCallback.bind(this);
        }
        /**
         * Create a map. If the time limit has been hit, returns null.
         * @see ROT.Map#create
         */
        create(callback) {
            let t1 = Date.now();
            while (1) {
                let t2 = Date.now();
                if (t2 - t1 > this._options.timeLimit) {
                    return null;
                } /* time limit! */
                this._map = this._fillMap(1);
                this._dug = 0;
                this._rooms = [];
                this._unconnected = [];
                this._generateRooms();
                if (this._rooms.length < 2) {
                    continue;
                }
                if (this._generateCorridors()) {
                    break;
                }
            }
            if (callback) {
                for (let i = 0; i < this._width; i++) {
                    for (let j = 0; j < this._height; j++) {
                        callback(i, j, this._map[i][j]);
                    }
                }
            }
            return this;
        }
        /**
         * Generates a suitable amount of rooms
         */
        _generateRooms() {
            let w = this._width - 2;
            let h = this._height - 2;
            let room;
            do {
                room = this._generateRoom();
                if (this._dug / (w * h) > this._options.roomDugPercentage) {
                    break;
                } /* achieved requested amount of free space */
            } while (room);
            /* either enough rooms, or not able to generate more of them :) */
        }
        /**
         * Try to generate one room
         */
        _generateRoom() {
            let count = 0;
            while (count < this._roomAttempts) {
                count++;
                let room = Room.createRandom(this._width, this._height, this._options);
                if (!room.isValid(this._isWallCallback, this._canBeDugCallback)) {
                    continue;
                }
                room.create(this._digCallback);
                this._rooms.push(room);
                return room;
            }
            /* no room was generated in a given number of attempts */
            return null;
        }
        /**
         * Generates connectors beween rooms
         * @returns {bool} success Was this attempt successfull?
         */
        _generateCorridors() {
            let cnt = 0;
            while (cnt < this._corridorAttempts) {
                cnt++;
                this._corridors = [];
                /* dig rooms into a clear map */
                this._map = this._fillMap(1);
                for (let i = 0; i < this._rooms.length; i++) {
                    let room = this._rooms[i];
                    room.clearDoors();
                    room.create(this._digCallback);
                }
                this._unconnected = RNG$1.shuffle(this._rooms.slice());
                this._connected = [];
                if (this._unconnected.length) {
                    this._connected.push(this._unconnected.pop());
                } /* first one is always connected */
                while (1) {
                    /* 1. pick random connected room */
                    let connected = RNG$1.getItem(this._connected);
                    if (!connected) {
                        break;
                    }
                    /* 2. find closest unconnected */
                    let room1 = this._closestRoom(this._unconnected, connected);
                    if (!room1) {
                        break;
                    }
                    /* 3. connect it to closest connected */
                    let room2 = this._closestRoom(this._connected, room1);
                    if (!room2) {
                        break;
                    }
                    let ok = this._connectRooms(room1, room2);
                    if (!ok) {
                        break;
                    } /* stop connecting, re-shuffle */
                    if (!this._unconnected.length) {
                        return true;
                    } /* done; no rooms remain */
                }
            }
            return false;
        }
        ;
        /**
         * For a given room, find the closest one from the list
         */
        _closestRoom(rooms, room) {
            let dist = Infinity;
            let center = room.getCenter();
            let result = null;
            for (let i = 0; i < rooms.length; i++) {
                let r = rooms[i];
                let c = r.getCenter();
                let dx = c[0] - center[0];
                let dy = c[1] - center[1];
                let d = dx * dx + dy * dy;
                if (d < dist) {
                    dist = d;
                    result = r;
                }
            }
            return result;
        }
        _connectRooms(room1, room2) {
            /*
                room1.debug();
                room2.debug();
            */
            let center1 = room1.getCenter();
            let center2 = room2.getCenter();
            let diffX = center2[0] - center1[0];
            let diffY = center2[1] - center1[1];
            let start;
            let end;
            let dirIndex1, dirIndex2, min, max, index;
            if (Math.abs(diffX) < Math.abs(diffY)) { /* first try connecting north-south walls */
                dirIndex1 = (diffY > 0 ? 2 : 0);
                dirIndex2 = (dirIndex1 + 2) % 4;
                min = room2.getLeft();
                max = room2.getRight();
                index = 0;
            }
            else { /* first try connecting east-west walls */
                dirIndex1 = (diffX > 0 ? 1 : 3);
                dirIndex2 = (dirIndex1 + 2) % 4;
                min = room2.getTop();
                max = room2.getBottom();
                index = 1;
            }
            start = this._placeInWall(room1, dirIndex1); /* corridor will start here */
            if (!start) {
                return false;
            }
            if (start[index] >= min && start[index] <= max) { /* possible to connect with straight line (I-like) */
                end = start.slice();
                let value = 0;
                switch (dirIndex2) {
                    case 0:
                        value = room2.getTop() - 1;
                        break;
                    case 1:
                        value = room2.getRight() + 1;
                        break;
                    case 2:
                        value = room2.getBottom() + 1;
                        break;
                    case 3:
                        value = room2.getLeft() - 1;
                        break;
                }
                end[(index + 1) % 2] = value;
                this._digLine([start, end]);
            }
            else if (start[index] < min - 1 || start[index] > max + 1) { /* need to switch target wall (L-like) */
                let diff = start[index] - center2[index];
                let rotation = 0;
                switch (dirIndex2) {
                    case 0:
                    case 1:
                        rotation = (diff < 0 ? 3 : 1);
                        break;
                    case 2:
                    case 3:
                        rotation = (diff < 0 ? 1 : 3);
                        break;
                }
                dirIndex2 = (dirIndex2 + rotation) % 4;
                end = this._placeInWall(room2, dirIndex2);
                if (!end) {
                    return false;
                }
                let mid = [0, 0];
                mid[index] = start[index];
                let index2 = (index + 1) % 2;
                mid[index2] = end[index2];
                this._digLine([start, mid, end]);
            }
            else { /* use current wall pair, but adjust the line in the middle (S-like) */
                let index2 = (index + 1) % 2;
                end = this._placeInWall(room2, dirIndex2);
                if (!end) {
                    return false;
                }
                let mid = Math.round((end[index2] + start[index2]) / 2);
                let mid1 = [0, 0];
                let mid2 = [0, 0];
                mid1[index] = start[index];
                mid1[index2] = mid;
                mid2[index] = end[index];
                mid2[index2] = mid;
                this._digLine([start, mid1, mid2, end]);
            }
            room1.addDoor(start[0], start[1]);
            room2.addDoor(end[0], end[1]);
            index = this._unconnected.indexOf(room1);
            if (index != -1) {
                this._unconnected.splice(index, 1);
                this._connected.push(room1);
            }
            index = this._unconnected.indexOf(room2);
            if (index != -1) {
                this._unconnected.splice(index, 1);
                this._connected.push(room2);
            }
            return true;
        }
        _placeInWall(room, dirIndex) {
            let start = [0, 0];
            let dir = [0, 0];
            let length = 0;
            switch (dirIndex) {
                case 0:
                    dir = [1, 0];
                    start = [room.getLeft(), room.getTop() - 1];
                    length = room.getRight() - room.getLeft() + 1;
                    break;
                case 1:
                    dir = [0, 1];
                    start = [room.getRight() + 1, room.getTop()];
                    length = room.getBottom() - room.getTop() + 1;
                    break;
                case 2:
                    dir = [1, 0];
                    start = [room.getLeft(), room.getBottom() + 1];
                    length = room.getRight() - room.getLeft() + 1;
                    break;
                case 3:
                    dir = [0, 1];
                    start = [room.getLeft() - 1, room.getTop()];
                    length = room.getBottom() - room.getTop() + 1;
                    break;
            }
            let avail = [];
            let lastBadIndex = -2;
            for (let i = 0; i < length; i++) {
                let x = start[0] + i * dir[0];
                let y = start[1] + i * dir[1];
                avail.push(null);
                let isWall = (this._map[x][y] == 1);
                if (isWall) {
                    if (lastBadIndex != i - 1) {
                        avail[i] = [x, y];
                    }
                }
                else {
                    lastBadIndex = i;
                    if (i) {
                        avail[i - 1] = null;
                    }
                }
            }
            for (let i = avail.length - 1; i >= 0; i--) {
                if (!avail[i]) {
                    avail.splice(i, 1);
                }
            }
            return (avail.length ? RNG$1.getItem(avail) : null);
        }
        /**
         * Dig a polyline.
         */
        _digLine(points) {
            for (let i = 1; i < points.length; i++) {
                let start = points[i - 1];
                let end = points[i];
                let corridor = new Corridor(start[0], start[1], end[0], end[1]);
                corridor.create(this._digCallback);
                this._corridors.push(corridor);
            }
        }
        _digCallback(x, y, value) {
            this._map[x][y] = value;
            if (value == 0) {
                this._dug++;
            }
        }
        _isWallCallback(x, y) {
            if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
                return false;
            }
            return (this._map[x][y] == 1);
        }
        _canBeDugCallback(x, y) {
            if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
                return false;
            }
            return (this._map[x][y] == 1);
        }
    }

    /**
     * @class Cellular automaton map generator
     * @augments ROT.Map
     * @param {int} [width=ROT.DEFAULT_WIDTH]
     * @param {int} [height=ROT.DEFAULT_HEIGHT]
     * @param {object} [options] Options
     * @param {int[]} [options.born] List of neighbor counts for a new cell to be born in empty space
     * @param {int[]} [options.survive] List of neighbor counts for an existing  cell to survive
     * @param {int} [options.topology] Topology 4 or 6 or 8
     */
    class Cellular extends Map$1 {
        constructor(width, height, options = {}) {
            super(width, height);
            this._options = {
                born: [5, 6, 7, 8],
                survive: [4, 5, 6, 7, 8],
                topology: 8
            };
            this.setOptions(options);
            this._dirs = DIRS[this._options.topology];
            this._map = this._fillMap(0);
        }
        /**
         * Fill the map with random values
         * @param {float} probability Probability for a cell to become alive; 0 = all empty, 1 = all full
         */
        randomize(probability) {
            for (let i = 0; i < this._width; i++) {
                for (let j = 0; j < this._height; j++) {
                    this._map[i][j] = (RNG$1.getUniform() < probability ? 1 : 0);
                }
            }
            return this;
        }
        /**
         * Change options.
         * @see ROT.Map.Cellular
         */
        setOptions(options) { Object.assign(this._options, options); }
        set(x, y, value) { this._map[x][y] = value; }
        create(callback) {
            let newMap = this._fillMap(0);
            let born = this._options.born;
            let survive = this._options.survive;
            for (let j = 0; j < this._height; j++) {
                let widthStep = 1;
                let widthStart = 0;
                if (this._options.topology == 6) {
                    widthStep = 2;
                    widthStart = j % 2;
                }
                for (let i = widthStart; i < this._width; i += widthStep) {
                    let cur = this._map[i][j];
                    let ncount = this._getNeighbors(i, j);
                    if (cur && survive.indexOf(ncount) != -1) { /* survive */
                        newMap[i][j] = 1;
                    }
                    else if (!cur && born.indexOf(ncount) != -1) { /* born */
                        newMap[i][j] = 1;
                    }
                }
            }
            this._map = newMap;
            callback && this._serviceCallback(callback);
        }
        _serviceCallback(callback) {
            for (let j = 0; j < this._height; j++) {
                let widthStep = 1;
                let widthStart = 0;
                if (this._options.topology == 6) {
                    widthStep = 2;
                    widthStart = j % 2;
                }
                for (let i = widthStart; i < this._width; i += widthStep) {
                    callback(i, j, this._map[i][j]);
                }
            }
        }
        /**
         * Get neighbor count at [i,j] in this._map
         */
        _getNeighbors(cx, cy) {
            let result = 0;
            for (let i = 0; i < this._dirs.length; i++) {
                let dir = this._dirs[i];
                let x = cx + dir[0];
                let y = cy + dir[1];
                if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
                    continue;
                }
                result += (this._map[x][y] == 1 ? 1 : 0);
            }
            return result;
        }
        /**
         * Make sure every non-wall space is accessible.
         * @param {function} callback to call to display map when do
         * @param {int} value to consider empty space - defaults to 0
         * @param {function} callback to call when a new connection is made
         */
        connect(callback, value, connectionCallback) {
            if (!value)
                value = 0;
            let allFreeSpace = [];
            let notConnected = {};
            // find all free space
            let widthStep = 1;
            let widthStarts = [0, 0];
            if (this._options.topology == 6) {
                widthStep = 2;
                widthStarts = [0, 1];
            }
            for (let y = 0; y < this._height; y++) {
                for (let x = widthStarts[y % 2]; x < this._width; x += widthStep) {
                    if (this._freeSpace(x, y, value)) {
                        let p = [x, y];
                        notConnected[this._pointKey(p)] = p;
                        allFreeSpace.push([x, y]);
                    }
                }
            }
            let start = allFreeSpace[RNG$1.getUniformInt(0, allFreeSpace.length - 1)];
            let key = this._pointKey(start);
            let connected = {};
            connected[key] = start;
            delete notConnected[key];
            // find what's connected to the starting point
            this._findConnected(connected, notConnected, [start], false, value);
            while (Object.keys(notConnected).length > 0) {
                // find two points from notConnected to connected
                let p = this._getFromTo(connected, notConnected);
                let from = p[0]; // notConnected
                let to = p[1]; // connected
                // find everything connected to the starting point
                let local = {};
                local[this._pointKey(from)] = from;
                this._findConnected(local, notConnected, [from], true, value);
                // connect to a connected cell
                let tunnelFn = (this._options.topology == 6 ? this._tunnelToConnected6 : this._tunnelToConnected);
                tunnelFn.call(this, to, from, connected, notConnected, value, connectionCallback);
                // now all of local is connected
                for (let k in local) {
                    let pp = local[k];
                    this._map[pp[0]][pp[1]] = value;
                    connected[k] = pp;
                    delete notConnected[k];
                }
            }
            callback && this._serviceCallback(callback);
        }
        /**
         * Find random points to connect. Search for the closest point in the larger space.
         * This is to minimize the length of the passage while maintaining good performance.
         */
        _getFromTo(connected, notConnected) {
            let from = [0, 0], to = [0, 0], d;
            let connectedKeys = Object.keys(connected);
            let notConnectedKeys = Object.keys(notConnected);
            for (let i = 0; i < 5; i++) {
                if (connectedKeys.length < notConnectedKeys.length) {
                    let keys = connectedKeys;
                    to = connected[keys[RNG$1.getUniformInt(0, keys.length - 1)]];
                    from = this._getClosest(to, notConnected);
                }
                else {
                    let keys = notConnectedKeys;
                    from = notConnected[keys[RNG$1.getUniformInt(0, keys.length - 1)]];
                    to = this._getClosest(from, connected);
                }
                d = (from[0] - to[0]) * (from[0] - to[0]) + (from[1] - to[1]) * (from[1] - to[1]);
                if (d < 64) {
                    break;
                }
            }
            // console.log(">>> connected=" + to + " notConnected=" + from + " dist=" + d);
            return [from, to];
        }
        _getClosest(point, space) {
            let minPoint = null;
            let minDist = null;
            for (let k in space) {
                let p = space[k];
                let d = (p[0] - point[0]) * (p[0] - point[0]) + (p[1] - point[1]) * (p[1] - point[1]);
                if (minDist == null || d < minDist) {
                    minDist = d;
                    minPoint = p;
                }
            }
            return minPoint;
        }
        _findConnected(connected, notConnected, stack, keepNotConnected, value) {
            while (stack.length > 0) {
                let p = stack.splice(0, 1)[0];
                let tests;
                if (this._options.topology == 6) {
                    tests = [
                        [p[0] + 2, p[1]],
                        [p[0] + 1, p[1] - 1],
                        [p[0] - 1, p[1] - 1],
                        [p[0] - 2, p[1]],
                        [p[0] - 1, p[1] + 1],
                        [p[0] + 1, p[1] + 1],
                    ];
                }
                else {
                    tests = [
                        [p[0] + 1, p[1]],
                        [p[0] - 1, p[1]],
                        [p[0], p[1] + 1],
                        [p[0], p[1] - 1]
                    ];
                }
                for (let i = 0; i < tests.length; i++) {
                    let key = this._pointKey(tests[i]);
                    if (connected[key] == null && this._freeSpace(tests[i][0], tests[i][1], value)) {
                        connected[key] = tests[i];
                        if (!keepNotConnected) {
                            delete notConnected[key];
                        }
                        stack.push(tests[i]);
                    }
                }
            }
        }
        _tunnelToConnected(to, from, connected, notConnected, value, connectionCallback) {
            let a, b;
            if (from[0] < to[0]) {
                a = from;
                b = to;
            }
            else {
                a = to;
                b = from;
            }
            for (let xx = a[0]; xx <= b[0]; xx++) {
                this._map[xx][a[1]] = value;
                let p = [xx, a[1]];
                let pkey = this._pointKey(p);
                connected[pkey] = p;
                delete notConnected[pkey];
            }
            if (connectionCallback && a[0] < b[0]) {
                connectionCallback(a, [b[0], a[1]]);
            }
            // x is now fixed
            let x = b[0];
            if (from[1] < to[1]) {
                a = from;
                b = to;
            }
            else {
                a = to;
                b = from;
            }
            for (let yy = a[1]; yy < b[1]; yy++) {
                this._map[x][yy] = value;
                let p = [x, yy];
                let pkey = this._pointKey(p);
                connected[pkey] = p;
                delete notConnected[pkey];
            }
            if (connectionCallback && a[1] < b[1]) {
                connectionCallback([b[0], a[1]], [b[0], b[1]]);
            }
        }
        _tunnelToConnected6(to, from, connected, notConnected, value, connectionCallback) {
            let a, b;
            if (from[0] < to[0]) {
                a = from;
                b = to;
            }
            else {
                a = to;
                b = from;
            }
            // tunnel diagonally until horizontally level
            let xx = a[0];
            let yy = a[1];
            while (!(xx == b[0] && yy == b[1])) {
                let stepWidth = 2;
                if (yy < b[1]) {
                    yy++;
                    stepWidth = 1;
                }
                else if (yy > b[1]) {
                    yy--;
                    stepWidth = 1;
                }
                if (xx < b[0]) {
                    xx += stepWidth;
                }
                else if (xx > b[0]) {
                    xx -= stepWidth;
                }
                else if (b[1] % 2) {
                    // Won't step outside map if destination on is map's right edge
                    xx -= stepWidth;
                }
                else {
                    // ditto for left edge
                    xx += stepWidth;
                }
                this._map[xx][yy] = value;
                let p = [xx, yy];
                let pkey = this._pointKey(p);
                connected[pkey] = p;
                delete notConnected[pkey];
            }
            if (connectionCallback) {
                connectionCallback(from, to);
            }
        }
        _freeSpace(x, y, value) {
            return x >= 0 && x < this._width && y >= 0 && y < this._height && this._map[x][y] == value;
        }
        _pointKey(p) { return p[0] + "." + p[1]; }
    }

    const FEATURES = {
        "room": Room,
        "corridor": Corridor
    };
    /**
     * Random dungeon generator using human-like digging patterns.
     * Heavily based on Mike Anderson's ideas from the "Tyrant" algo, mentioned at
     * http://www.roguebasin.roguelikedevelopment.org/index.php?title=Dungeon-Building_Algorithm.
     */
    class Digger extends Dungeon {
        constructor(width, height, options = {}) {
            super(width, height);
            this._options = Object.assign({
                roomWidth: [3, 9],
                roomHeight: [3, 5],
                corridorLength: [3, 10],
                dugPercentage: 0.2,
                timeLimit: 1000 /* we stop after this much time has passed (msec) */
            }, options);
            this._features = {
                "room": 4,
                "corridor": 4
            };
            this._map = [];
            this._featureAttempts = 20; /* how many times do we try to create a feature on a suitable wall */
            this._walls = {}; /* these are available for digging */
            this._dug = 0;
            this._digCallback = this._digCallback.bind(this);
            this._canBeDugCallback = this._canBeDugCallback.bind(this);
            this._isWallCallback = this._isWallCallback.bind(this);
            this._priorityWallCallback = this._priorityWallCallback.bind(this);
        }
        create(callback) {
            this._rooms = [];
            this._corridors = [];
            this._map = this._fillMap(1);
            this._walls = {};
            this._dug = 0;
            let area = (this._width - 2) * (this._height - 2);
            this._firstRoom();
            let t1 = Date.now();
            let priorityWalls;
            do {
                priorityWalls = 0;
                let t2 = Date.now();
                if (t2 - t1 > this._options.timeLimit) {
                    break;
                }
                /* find a good wall */
                let wall = this._findWall();
                if (!wall) {
                    break;
                } /* no more walls */
                let parts = wall.split(",");
                let x = parseInt(parts[0]);
                let y = parseInt(parts[1]);
                let dir = this._getDiggingDirection(x, y);
                if (!dir) {
                    continue;
                } /* this wall is not suitable */
                //		console.log("wall", x, y);
                /* try adding a feature */
                let featureAttempts = 0;
                do {
                    featureAttempts++;
                    if (this._tryFeature(x, y, dir[0], dir[1])) { /* feature added */
                        //if (this._rooms.length + this._corridors.length == 2) { this._rooms[0].addDoor(x, y); } /* first room oficially has doors */
                        this._removeSurroundingWalls(x, y);
                        this._removeSurroundingWalls(x - dir[0], y - dir[1]);
                        break;
                    }
                } while (featureAttempts < this._featureAttempts);
                for (let id in this._walls) {
                    if (this._walls[id] > 1) {
                        priorityWalls++;
                    }
                }
            } while (this._dug / area < this._options.dugPercentage || priorityWalls); /* fixme number of priority walls */
            this._addDoors();
            if (callback) {
                for (let i = 0; i < this._width; i++) {
                    for (let j = 0; j < this._height; j++) {
                        callback(i, j, this._map[i][j]);
                    }
                }
            }
            this._walls = {};
            this._map = [];
            return this;
        }
        _digCallback(x, y, value) {
            if (value == 0 || value == 2) { /* empty */
                this._map[x][y] = 0;
                this._dug++;
            }
            else { /* wall */
                this._walls[x + "," + y] = 1;
            }
        }
        _isWallCallback(x, y) {
            if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
                return false;
            }
            return (this._map[x][y] == 1);
        }
        _canBeDugCallback(x, y) {
            if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
                return false;
            }
            return (this._map[x][y] == 1);
        }
        _priorityWallCallback(x, y) { this._walls[x + "," + y] = 2; }
        ;
        _firstRoom() {
            let cx = Math.floor(this._width / 2);
            let cy = Math.floor(this._height / 2);
            let room = Room.createRandomCenter(cx, cy, this._options);
            this._rooms.push(room);
            room.create(this._digCallback);
        }
        /**
         * Get a suitable wall
         */
        _findWall() {
            let prio1 = [];
            let prio2 = [];
            for (let id in this._walls) {
                let prio = this._walls[id];
                if (prio == 2) {
                    prio2.push(id);
                }
                else {
                    prio1.push(id);
                }
            }
            let arr = (prio2.length ? prio2 : prio1);
            if (!arr.length) {
                return null;
            } /* no walls :/ */
            let id = RNG$1.getItem(arr.sort()); // sort to make the order deterministic
            delete this._walls[id];
            return id;
        }
        /**
         * Tries adding a feature
         * @returns {bool} was this a successful try?
         */
        _tryFeature(x, y, dx, dy) {
            let featureName = RNG$1.getWeightedValue(this._features);
            let ctor = FEATURES[featureName];
            let feature = ctor.createRandomAt(x, y, dx, dy, this._options);
            if (!feature.isValid(this._isWallCallback, this._canBeDugCallback)) {
                //		console.log("not valid");
                //		feature.debug();
                return false;
            }
            feature.create(this._digCallback);
            //	feature.debug();
            if (feature instanceof Room) {
                this._rooms.push(feature);
            }
            if (feature instanceof Corridor) {
                feature.createPriorityWalls(this._priorityWallCallback);
                this._corridors.push(feature);
            }
            return true;
        }
        _removeSurroundingWalls(cx, cy) {
            let deltas = DIRS[4];
            for (let i = 0; i < deltas.length; i++) {
                let delta = deltas[i];
                let x = cx + delta[0];
                let y = cy + delta[1];
                delete this._walls[x + "," + y];
                x = cx + 2 * delta[0];
                y = cy + 2 * delta[1];
                delete this._walls[x + "," + y];
            }
        }
        /**
         * Returns vector in "digging" direction, or false, if this does not exist (or is not unique)
         */
        _getDiggingDirection(cx, cy) {
            if (cx <= 0 || cy <= 0 || cx >= this._width - 1 || cy >= this._height - 1) {
                return null;
            }
            let result = null;
            let deltas = DIRS[4];
            for (let i = 0; i < deltas.length; i++) {
                let delta = deltas[i];
                let x = cx + delta[0];
                let y = cy + delta[1];
                if (!this._map[x][y]) { /* there already is another empty neighbor! */
                    if (result) {
                        return null;
                    }
                    result = delta;
                }
            }
            /* no empty neighbor */
            if (!result) {
                return null;
            }
            return [-result[0], -result[1]];
        }
        /**
         * Find empty spaces surrounding rooms, and apply doors.
         */
        _addDoors() {
            let data = this._map;
            function isWallCallback(x, y) {
                return (data[x][y] == 1);
            }
            for (let i = 0; i < this._rooms.length; i++) {
                let room = this._rooms[i];
                room.clearDoors();
                room.addDoors(isWallCallback);
            }
        }
    }

    /**
     * Join lists with "i" and "i+1"
     */
    function addToList(i, L, R) {
        R[L[i + 1]] = R[i];
        L[R[i]] = L[i + 1];
        R[i] = i + 1;
        L[i + 1] = i;
    }
    /**
     * Remove "i" from its list
     */
    function removeFromList(i, L, R) {
        R[L[i]] = R[i];
        L[R[i]] = L[i];
        R[i] = i;
        L[i] = i;
    }
    /**
     * Maze generator - Eller's algorithm
     * See http://homepages.cwi.nl/~tromp/maze.html for explanation
     */
    class EllerMaze extends Map$1 {
        create(callback) {
            let map = this._fillMap(1);
            let w = Math.ceil((this._width - 2) / 2);
            let rand = 9 / 24;
            let L = [];
            let R = [];
            for (let i = 0; i < w; i++) {
                L.push(i);
                R.push(i);
            }
            L.push(w - 1); /* fake stop-block at the right side */
            let j;
            for (j = 1; j + 3 < this._height; j += 2) {
                /* one row */
                for (let i = 0; i < w; i++) {
                    /* cell coords (will be always empty) */
                    let x = 2 * i + 1;
                    let y = j;
                    map[x][y] = 0;
                    /* right connection */
                    if (i != L[i + 1] && RNG$1.getUniform() > rand) {
                        addToList(i, L, R);
                        map[x + 1][y] = 0;
                    }
                    /* bottom connection */
                    if (i != L[i] && RNG$1.getUniform() > rand) {
                        /* remove connection */
                        removeFromList(i, L, R);
                    }
                    else {
                        /* create connection */
                        map[x][y + 1] = 0;
                    }
                }
            }
            /* last row */
            for (let i = 0; i < w; i++) {
                /* cell coords (will be always empty) */
                let x = 2 * i + 1;
                let y = j;
                map[x][y] = 0;
                /* right connection */
                if (i != L[i + 1] && (i == L[i] || RNG$1.getUniform() > rand)) {
                    /* dig right also if the cell is separated, so it gets connected to the rest of maze */
                    addToList(i, L, R);
                    map[x + 1][y] = 0;
                }
                removeFromList(i, L, R);
            }
            for (let i = 0; i < this._width; i++) {
                for (let j = 0; j < this._height; j++) {
                    callback(i, j, map[i][j]);
                }
            }
            return this;
        }
    }

    /**
     * @class Recursively divided maze, http://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
     * @augments ROT.Map
     */
    class DividedMaze extends Map$1 {
        constructor() {
            super(...arguments);
            this._stack = [];
            this._map = [];
        }
        create(callback) {
            let w = this._width;
            let h = this._height;
            this._map = [];
            for (let i = 0; i < w; i++) {
                this._map.push([]);
                for (let j = 0; j < h; j++) {
                    let border = (i == 0 || j == 0 || i + 1 == w || j + 1 == h);
                    this._map[i].push(border ? 1 : 0);
                }
            }
            this._stack = [
                [1, 1, w - 2, h - 2]
            ];
            this._process();
            for (let i = 0; i < w; i++) {
                for (let j = 0; j < h; j++) {
                    callback(i, j, this._map[i][j]);
                }
            }
            this._map = [];
            return this;
        }
        _process() {
            while (this._stack.length) {
                let room = this._stack.shift(); /* [left, top, right, bottom] */
                this._partitionRoom(room);
            }
        }
        _partitionRoom(room) {
            let availX = [];
            let availY = [];
            for (let i = room[0] + 1; i < room[2]; i++) {
                let top = this._map[i][room[1] - 1];
                let bottom = this._map[i][room[3] + 1];
                if (top && bottom && !(i % 2)) {
                    availX.push(i);
                }
            }
            for (let j = room[1] + 1; j < room[3]; j++) {
                let left = this._map[room[0] - 1][j];
                let right = this._map[room[2] + 1][j];
                if (left && right && !(j % 2)) {
                    availY.push(j);
                }
            }
            if (!availX.length || !availY.length) {
                return;
            }
            let x = RNG$1.getItem(availX);
            let y = RNG$1.getItem(availY);
            this._map[x][y] = 1;
            let walls = [];
            let w = [];
            walls.push(w); /* left part */
            for (let i = room[0]; i < x; i++) {
                this._map[i][y] = 1;
                w.push([i, y]);
            }
            w = [];
            walls.push(w); /* right part */
            for (let i = x + 1; i <= room[2]; i++) {
                this._map[i][y] = 1;
                w.push([i, y]);
            }
            w = [];
            walls.push(w); /* top part */
            for (let j = room[1]; j < y; j++) {
                this._map[x][j] = 1;
                w.push([x, j]);
            }
            w = [];
            walls.push(w); /* bottom part */
            for (let j = y + 1; j <= room[3]; j++) {
                this._map[x][j] = 1;
                w.push([x, j]);
            }
            let solid = RNG$1.getItem(walls);
            for (let i = 0; i < walls.length; i++) {
                let w = walls[i];
                if (w == solid) {
                    continue;
                }
                let hole = RNG$1.getItem(w);
                this._map[hole[0]][hole[1]] = 0;
            }
            this._stack.push([room[0], room[1], x - 1, y - 1]); /* left top */
            this._stack.push([x + 1, room[1], room[2], y - 1]); /* right top */
            this._stack.push([room[0], y + 1, x - 1, room[3]]); /* left bottom */
            this._stack.push([x + 1, y + 1, room[2], room[3]]); /* right bottom */
        }
    }

    /**
     * Icey's Maze generator
     * See http://www.roguebasin.roguelikedevelopment.org/index.php?title=Simple_maze for explanation
     */
    class IceyMaze extends Map$1 {
        constructor(width, height, regularity = 0) {
            super(width, height);
            this._regularity = regularity;
            this._map = [];
        }
        create(callback) {
            let width = this._width;
            let height = this._height;
            let map = this._fillMap(1);
            width -= (width % 2 ? 1 : 2);
            height -= (height % 2 ? 1 : 2);
            let cx = 0;
            let cy = 0;
            let nx = 0;
            let ny = 0;
            let done = 0;
            let blocked = false;
            let dirs = [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ];
            do {
                cx = 1 + 2 * Math.floor(RNG$1.getUniform() * (width - 1) / 2);
                cy = 1 + 2 * Math.floor(RNG$1.getUniform() * (height - 1) / 2);
                if (!done) {
                    map[cx][cy] = 0;
                }
                if (!map[cx][cy]) {
                    this._randomize(dirs);
                    do {
                        if (Math.floor(RNG$1.getUniform() * (this._regularity + 1)) == 0) {
                            this._randomize(dirs);
                        }
                        blocked = true;
                        for (let i = 0; i < 4; i++) {
                            nx = cx + dirs[i][0] * 2;
                            ny = cy + dirs[i][1] * 2;
                            if (this._isFree(map, nx, ny, width, height)) {
                                map[nx][ny] = 0;
                                map[cx + dirs[i][0]][cy + dirs[i][1]] = 0;
                                cx = nx;
                                cy = ny;
                                blocked = false;
                                done++;
                                break;
                            }
                        }
                    } while (!blocked);
                }
            } while (done + 1 < width * height / 4);
            for (let i = 0; i < this._width; i++) {
                for (let j = 0; j < this._height; j++) {
                    callback(i, j, map[i][j]);
                }
            }
            this._map = [];
            return this;
        }
        _randomize(dirs) {
            for (let i = 0; i < 4; i++) {
                dirs[i][0] = 0;
                dirs[i][1] = 0;
            }
            switch (Math.floor(RNG$1.getUniform() * 4)) {
                case 0:
                    dirs[0][0] = -1;
                    dirs[1][0] = 1;
                    dirs[2][1] = -1;
                    dirs[3][1] = 1;
                    break;
                case 1:
                    dirs[3][0] = -1;
                    dirs[2][0] = 1;
                    dirs[1][1] = -1;
                    dirs[0][1] = 1;
                    break;
                case 2:
                    dirs[2][0] = -1;
                    dirs[3][0] = 1;
                    dirs[0][1] = -1;
                    dirs[1][1] = 1;
                    break;
                case 3:
                    dirs[1][0] = -1;
                    dirs[0][0] = 1;
                    dirs[3][1] = -1;
                    dirs[2][1] = 1;
                    break;
            }
        }
        _isFree(map, x, y, width, height) {
            if (x < 1 || y < 1 || x >= width || y >= height) {
                return false;
            }
            return map[x][y];
        }
    }

    /**
     * Dungeon generator which uses the "orginal" Rogue dungeon generation algorithm. See http://kuoi.com/~kamikaze/GameDesign/art07_rogue_dungeon.php
     * @author hyakugei
     */
    class Rogue extends Map$1 {
        constructor(width, height, options) {
            super(width, height);
            this.map = [];
            this.rooms = [];
            this.connectedCells = [];
            options = Object.assign({
                cellWidth: 3,
                cellHeight: 3 //     ie. as an array with min-max values for each direction....
            }, options);
            /*
            Set the room sizes according to the over-all width of the map,
            and the cell sizes.
            */
            if (!options.hasOwnProperty("roomWidth")) {
                options["roomWidth"] = this._calculateRoomSize(this._width, options["cellWidth"]);
            }
            if (!options.hasOwnProperty("roomHeight")) {
                options["roomHeight"] = this._calculateRoomSize(this._height, options["cellHeight"]);
            }
            this._options = options;
        }
        create(callback) {
            this.map = this._fillMap(1);
            this.rooms = [];
            this.connectedCells = [];
            this._initRooms();
            this._connectRooms();
            this._connectUnconnectedRooms();
            this._createRandomRoomConnections();
            this._createRooms();
            this._createCorridors();
            if (callback) {
                for (let i = 0; i < this._width; i++) {
                    for (let j = 0; j < this._height; j++) {
                        callback(i, j, this.map[i][j]);
                    }
                }
            }
            return this;
        }
        _calculateRoomSize(size, cell) {
            let max = Math.floor((size / cell) * 0.8);
            let min = Math.floor((size / cell) * 0.25);
            if (min < 2) {
                min = 2;
            }
            if (max < 2) {
                max = 2;
            }
            return [min, max];
        }
        _initRooms() {
            // create rooms array. This is the "grid" list from the algo.
            for (let i = 0; i < this._options.cellWidth; i++) {
                this.rooms.push([]);
                for (let j = 0; j < this._options.cellHeight; j++) {
                    this.rooms[i].push({ "x": 0, "y": 0, "width": 0, "height": 0, "connections": [], "cellx": i, "celly": j });
                }
            }
        }
        _connectRooms() {
            //pick random starting grid
            let cgx = RNG$1.getUniformInt(0, this._options.cellWidth - 1);
            let cgy = RNG$1.getUniformInt(0, this._options.cellHeight - 1);
            let idx;
            let ncgx;
            let ncgy;
            let found = false;
            let room;
            let otherRoom;
            let dirToCheck;
            // find  unconnected neighbour cells
            do {
                //dirToCheck = [0, 1, 2, 3, 4, 5, 6, 7];
                dirToCheck = [0, 2, 4, 6];
                dirToCheck = RNG$1.shuffle(dirToCheck);
                do {
                    found = false;
                    idx = dirToCheck.pop();
                    ncgx = cgx + DIRS[8][idx][0];
                    ncgy = cgy + DIRS[8][idx][1];
                    if (ncgx < 0 || ncgx >= this._options.cellWidth) {
                        continue;
                    }
                    if (ncgy < 0 || ncgy >= this._options.cellHeight) {
                        continue;
                    }
                    room = this.rooms[cgx][cgy];
                    if (room["connections"].length > 0) {
                        // as long as this room doesn't already coonect to me, we are ok with it.
                        if (room["connections"][0][0] == ncgx && room["connections"][0][1] == ncgy) {
                            break;
                        }
                    }
                    otherRoom = this.rooms[ncgx][ncgy];
                    if (otherRoom["connections"].length == 0) {
                        otherRoom["connections"].push([cgx, cgy]);
                        this.connectedCells.push([ncgx, ncgy]);
                        cgx = ncgx;
                        cgy = ncgy;
                        found = true;
                    }
                } while (dirToCheck.length > 0 && found == false);
            } while (dirToCheck.length > 0);
        }
        _connectUnconnectedRooms() {
            //While there are unconnected rooms, try to connect them to a random connected neighbor
            //(if a room has no connected neighbors yet, just keep cycling, you'll fill out to it eventually).
            let cw = this._options.cellWidth;
            let ch = this._options.cellHeight;
            this.connectedCells = RNG$1.shuffle(this.connectedCells);
            let room;
            let otherRoom;
            let validRoom;
            for (let i = 0; i < this._options.cellWidth; i++) {
                for (let j = 0; j < this._options.cellHeight; j++) {
                    room = this.rooms[i][j];
                    if (room["connections"].length == 0) {
                        let directions = [0, 2, 4, 6];
                        directions = RNG$1.shuffle(directions);
                        validRoom = false;
                        do {
                            let dirIdx = directions.pop();
                            let newI = i + DIRS[8][dirIdx][0];
                            let newJ = j + DIRS[8][dirIdx][1];
                            if (newI < 0 || newI >= cw || newJ < 0 || newJ >= ch) {
                                continue;
                            }
                            otherRoom = this.rooms[newI][newJ];
                            validRoom = true;
                            if (otherRoom["connections"].length == 0) {
                                break;
                            }
                            for (let k = 0; k < otherRoom["connections"].length; k++) {
                                if (otherRoom["connections"][k][0] == i && otherRoom["connections"][k][1] == j) {
                                    validRoom = false;
                                    break;
                                }
                            }
                            if (validRoom) {
                                break;
                            }
                        } while (directions.length);
                        if (validRoom) {
                            room["connections"].push([otherRoom["cellx"], otherRoom["celly"]]);
                        }
                        else {
                            console.log("-- Unable to connect room.");
                        }
                    }
                }
            }
        }
        _createRandomRoomConnections() {
            // Empty for now.
        }
        _createRooms() {
            let w = this._width;
            let h = this._height;
            let cw = this._options.cellWidth;
            let ch = this._options.cellHeight;
            let cwp = Math.floor(this._width / cw);
            let chp = Math.floor(this._height / ch);
            let roomw;
            let roomh;
            let roomWidth = this._options["roomWidth"];
            let roomHeight = this._options["roomHeight"];
            let sx;
            let sy;
            let otherRoom;
            for (let i = 0; i < cw; i++) {
                for (let j = 0; j < ch; j++) {
                    sx = cwp * i;
                    sy = chp * j;
                    if (sx == 0) {
                        sx = 1;
                    }
                    if (sy == 0) {
                        sy = 1;
                    }
                    roomw = RNG$1.getUniformInt(roomWidth[0], roomWidth[1]);
                    roomh = RNG$1.getUniformInt(roomHeight[0], roomHeight[1]);
                    if (j > 0) {
                        otherRoom = this.rooms[i][j - 1];
                        while (sy - (otherRoom["y"] + otherRoom["height"]) < 3) {
                            sy++;
                        }
                    }
                    if (i > 0) {
                        otherRoom = this.rooms[i - 1][j];
                        while (sx - (otherRoom["x"] + otherRoom["width"]) < 3) {
                            sx++;
                        }
                    }
                    let sxOffset = Math.round(RNG$1.getUniformInt(0, cwp - roomw) / 2);
                    let syOffset = Math.round(RNG$1.getUniformInt(0, chp - roomh) / 2);
                    while (sx + sxOffset + roomw >= w) {
                        if (sxOffset) {
                            sxOffset--;
                        }
                        else {
                            roomw--;
                        }
                    }
                    while (sy + syOffset + roomh >= h) {
                        if (syOffset) {
                            syOffset--;
                        }
                        else {
                            roomh--;
                        }
                    }
                    sx = sx + sxOffset;
                    sy = sy + syOffset;
                    this.rooms[i][j]["x"] = sx;
                    this.rooms[i][j]["y"] = sy;
                    this.rooms[i][j]["width"] = roomw;
                    this.rooms[i][j]["height"] = roomh;
                    for (let ii = sx; ii < sx + roomw; ii++) {
                        for (let jj = sy; jj < sy + roomh; jj++) {
                            this.map[ii][jj] = 0;
                        }
                    }
                }
            }
        }
        _getWallPosition(aRoom, aDirection) {
            let rx;
            let ry;
            let door;
            if (aDirection == 1 || aDirection == 3) {
                rx = RNG$1.getUniformInt(aRoom["x"] + 1, aRoom["x"] + aRoom["width"] - 2);
                if (aDirection == 1) {
                    ry = aRoom["y"] - 2;
                    door = ry + 1;
                }
                else {
                    ry = aRoom["y"] + aRoom["height"] + 1;
                    door = ry - 1;
                }
                this.map[rx][door] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
            }
            else {
                ry = RNG$1.getUniformInt(aRoom["y"] + 1, aRoom["y"] + aRoom["height"] - 2);
                if (aDirection == 2) {
                    rx = aRoom["x"] + aRoom["width"] + 1;
                    door = rx - 1;
                }
                else {
                    rx = aRoom["x"] - 2;
                    door = rx + 1;
                }
                this.map[door][ry] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
            }
            return [rx, ry];
        }
        _drawCorridor(startPosition, endPosition) {
            let xOffset = endPosition[0] - startPosition[0];
            let yOffset = endPosition[1] - startPosition[1];
            let xpos = startPosition[0];
            let ypos = startPosition[1];
            let tempDist;
            let xDir;
            let yDir;
            let move; // 2 element array, element 0 is the direction, element 1 is the total value to move.
            let moves = []; // a list of 2 element arrays
            let xAbs = Math.abs(xOffset);
            let yAbs = Math.abs(yOffset);
            let percent = RNG$1.getUniform(); // used to split the move at different places along the long axis
            let firstHalf = percent;
            let secondHalf = 1 - percent;
            xDir = xOffset > 0 ? 2 : 6;
            yDir = yOffset > 0 ? 4 : 0;
            if (xAbs < yAbs) {
                // move firstHalf of the y offset
                tempDist = Math.ceil(yAbs * firstHalf);
                moves.push([yDir, tempDist]);
                // move all the x offset
                moves.push([xDir, xAbs]);
                // move sendHalf of the  y offset
                tempDist = Math.floor(yAbs * secondHalf);
                moves.push([yDir, tempDist]);
            }
            else {
                //  move firstHalf of the x offset
                tempDist = Math.ceil(xAbs * firstHalf);
                moves.push([xDir, tempDist]);
                // move all the y offset
                moves.push([yDir, yAbs]);
                // move secondHalf of the x offset.
                tempDist = Math.floor(xAbs * secondHalf);
                moves.push([xDir, tempDist]);
            }
            this.map[xpos][ypos] = 0;
            while (moves.length > 0) {
                move = moves.pop();
                while (move[1] > 0) {
                    xpos += DIRS[8][move[0]][0];
                    ypos += DIRS[8][move[0]][1];
                    this.map[xpos][ypos] = 0;
                    move[1] = move[1] - 1;
                }
            }
        }
        _createCorridors() {
            // Draw Corridors between connected rooms
            let cw = this._options.cellWidth;
            let ch = this._options.cellHeight;
            let room;
            let connection;
            let otherRoom;
            let wall;
            let otherWall;
            for (let i = 0; i < cw; i++) {
                for (let j = 0; j < ch; j++) {
                    room = this.rooms[i][j];
                    for (let k = 0; k < room["connections"].length; k++) {
                        connection = room["connections"][k];
                        otherRoom = this.rooms[connection[0]][connection[1]];
                        // figure out what wall our corridor will start one.
                        // figure out what wall our corridor will end on.
                        if (otherRoom["cellx"] > room["cellx"]) {
                            wall = 2;
                            otherWall = 4;
                        }
                        else if (otherRoom["cellx"] < room["cellx"]) {
                            wall = 4;
                            otherWall = 2;
                        }
                        else if (otherRoom["celly"] > room["celly"]) {
                            wall = 3;
                            otherWall = 1;
                        }
                        else {
                            wall = 1;
                            otherWall = 3;
                        }
                        this._drawCorridor(this._getWallPosition(room, wall), this._getWallPosition(otherRoom, otherWall));
                    }
                }
            }
        }
    }

    var Map$2 = { Arena, Uniform, Cellular, Digger, EllerMaze, DividedMaze, IceyMaze, Rogue };

    /**
     * Base noise generator
     */

    /**
     * @class Asynchronous main loop
     * @param {ROT.Scheduler} scheduler
     */

    const Color = color;

    let UIMenu = class UIMenu extends LitElement {
        constructor() {
            super();
            this.options = [];
            this.onKeydown = (e) => {
                if (e.keyCode == KEYS.VK_ESCAPE) {
                    this.dispatchEvent(new CustomEvent('ui-close', { bubbles: true, composed: true }));
                    return;
                }
                let focused = this.shadowRoot.activeElement;
                if (!focused) {
                    focused = this.focusFirst();
                }
                else {
                    switch (e.keyCode) {
                        case KEYS.VK_UP:
                            focused = focused.previousElementSibling;
                            break;
                        case KEYS.VK_DOWN:
                            focused = focused.nextElementSibling;
                            break;
                        case KEYS.VK_RETURN:
                            this.dispatchEvent(new CustomEvent('ui-menu-select', {
                                detail: e.target.innerText
                            }));
                    }
                }
                if (focused) {
                    focused.focus();
                }
                e.stopPropagation();
            };
        }
        static get styles() {
            return css `
      .option {
        line-height: 1.5em;
        min-width: 150px;
      }

      .option:focus {
        background-color: blue;
        outline: none;
      }
    `;
        }
        render() {
            return html `
      <ui-frame tabIndex="-1">
        ${this.options.map(option => html `
            <div class="option" tabindex="0">${option}</div>
          `)}
      </ui-frame>
    `;
        }
        focusFirst() {
            const firstOption = this.shadowRoot.querySelector('.option:first-child');
            if (firstOption) {
                firstOption.focus();
                return firstOption;
            }
            return null;
        }
        firstUpdated() {
            return __awaiter(this, void 0, void 0, function* () {
                this.shadowRoot.addEventListener('keydown', this
                    .onKeydown);
                yield this.shadowRoot.querySelector('ui-frame').updateComplete;
                this.focusFirst();
            });
        }
    };
    __decorate([
        property({ type: Array })
    ], UIMenu.prototype, "options", void 0);
    UIMenu = __decorate([
        customElement('ui-menu')
    ], UIMenu);

    let UIFrame = class UIFrame extends LitElement {
        render() {
            return html `
      <div class="background" @click=${this.close}></div>
      <div class="content">
        <slot></slot>
      </div>
    `;
        }
        static get styles() {
            return css `
      :host {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        z-index: 2;
        align-items: center;
        justify-content: center;
      }

      .background {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.7);
      }

      .content {
        background-color: #000;
        padding: 6px;
        border: 2px solid #fff;
        z-index: 3;
        color: #fff;
      }
    `;
        }
        close() {
            this.dispatchEvent(new CustomEvent('ui-close', { bubbles: true, composed: true }));
        }
    };
    UIFrame = __decorate([
        customElement('ui-frame')
    ], UIFrame);
    //# sourceMappingURL=frame.js.map

    const dateFormat = Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
    let UIQuestLog = class UIQuestLog extends LitElement {
        constructor() {
            super(...arguments);
            this.items = [];
        }
        render() {
            return html `
      ${this.items.map(item => html `
          <div class="log-entry ${item.type}">
            ${dateFormat.format(item.date)} ${item.text}
          </div>
        `)}
    `;
        }
        static get styles() {
            return css `
      :host {
        background-color: #000;
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: repeat(5, 1.5em);
        justify-content: start;
        padding: 2px 6px;
      }

      .log-entry.info {
        color: #aaf;
      }

      .log-entry.danger {
        color: #faa;
      }

      .log-entry.success {
        color: #0f4;
      }
    `;
        }
    };
    __decorate([
        property({ type: Array })
    ], UIQuestLog.prototype, "items", void 0);
    UIQuestLog = __decorate([
        customElement('ui-quest-log')
    ], UIQuestLog);
    //# sourceMappingURL=quest-log.js.map

    function getKeyPress() {
        return new Promise(resolve => {
            const handler = (event) => {
                window.removeEventListener('keydown', handler);
                resolve(event.keyCode);
            };
            window.addEventListener('keydown', handler);
        });
    }
    //# sourceMappingURL=util.js.map

    class Actor {
        constructor() {
            this._cell = null;
        }
        get cell() {
            return this._cell;
        }
        get x() {
            return this._cell ? this._cell.x : 0;
        }
        get y() {
            return this._cell ? this._cell.y : 0;
        }
        set cell(value) {
            if (value !== this._cell) {
                const oldCell = this._cell;
                this._cell = value;
                if (oldCell) {
                    oldCell.removeEntity(this);
                }
                if (this._cell) {
                    this._cell.addEntity(this);
                }
            }
        }
    }
    //# sourceMappingURL=actor.js.map

    class LogEntry {
        constructor(text, type = 'info') {
            this.text = text;
            this.type = type;
            this.date = new Date();
        }
    }
    //# sourceMappingURL=log-entry.js.map

    class Player extends Actor {
        constructor(id, world, ui) {
            super();
            this.world = world;
            this.ui = ui;
            this.char = '@';
            this.bgColor = '#FFF';
            this.fgColor = '#072';
            this.isHostile = false;
            this.isPickable = false;
            this.strength = 10;
            this.weight = 20;
            this.name = 'Player';
            this.health = 100;
            this.inventory = [];
            this.id = `PLY${id}`;
        }
        get burden() {
            let result = 0;
            this.inventory.forEach(item => {
                result += item.weight;
            });
            return result;
        }
        act() {
            return __awaiter(this, void 0, void 0, function* () {
                return getKeyPress().then(keyCode => this.handleKeyPress(keyCode));
            });
        }
        handleKeyPress(keyCode) {
            return __awaiter(this, void 0, void 0, function* () {
                let dx = 0;
                let dy = 0;
                switch (keyCode) {
                    case KEYS.VK_UP:
                        dy = -1;
                        break;
                    case KEYS.VK_DOWN:
                        dy = 1;
                        break;
                    case KEYS.VK_LEFT:
                        dx = -1;
                        break;
                    case KEYS.VK_RIGHT:
                        dx = 1;
                        break;
                }
                if (dx !== 0 || dy !== 0) {
                    return this.move(dx, dy);
                }
            });
        }
        move(dx, dy) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.cell) {
                    const target = this.cell.relativeCell(dx, dy);
                    if (target.isPassable) {
                        const contents = target.contents;
                        let enemy = contents.find(actor => actor.isHostile);
                        if (enemy) {
                            const result = yield this.ui.showMenu(['Attack', 'Push', 'Talk']);
                            switch (result) {
                                case 'Attack':
                                    this.attack(enemy);
                                    break;
                            }
                            return;
                        }
                        for (let actor of target.contents) {
                            if (actor.isPickable) {
                                this.pickup(actor);
                                return;
                            }
                        }
                        this.cell = target;
                    }
                }
            });
        }
        attack(target) {
            this.ui.log(new LogEntry(`${this.name} attacked ${target.name} causing no damage!`, 'danger'));
            if (target.notifyAttack) {
                target.notifyAttack(this);
            }
        }
        pickup(item) {
            if (this.burden + item.weight <= this.strength) {
                item.cell = null;
                this.inventory.push(item);
                this.ui.log(new LogEntry(`${this.name} picked up a ${item.name}`, 'success'));
            }
        }
        notifyAttack() { }
    }
    //# sourceMappingURL=player.js.map

    class Enemy extends Actor {
        constructor(id, weight, name, strength, health, world) {
            super();
            this.id = id;
            this.weight = weight;
            this.name = name;
            this.strength = strength;
            this.health = health;
            this.world = world;
            this.isHostile = true;
            this.currentTarget = null;
        }
        get isPickable() {
            return this.health === 0;
        }
        notifyAttack(aggressor) {
            this.currentTarget = aggressor;
        }
        act() {
            if (this.currentTarget) {
                const { x: tx, y: ty } = this.currentTarget;
                if (Math.abs(tx - this.x) <= 1 && Math.abs(ty - this.y) <= 1) {
                    // In range.
                    this.world.questLog.push(new LogEntry(`${this.name} attacked ${this.currentTarget.name} and caused no damage.`, 'danger'));
                }
            }
        }
    }
    class Skeleton extends Enemy {
        constructor(id, world) {
            super(`SKL${id}`, 15, 'Skeleton', 5, 5, world);
            this.char = 'S';
            this.bgColor = '#000';
            this.fgColor = '#FFF';
        }
    }
    //# sourceMappingURL=enemy.js.map

    var Tile$1;
    (function (Tile) {
        Tile[Tile["Wall"] = 0] = "Wall";
        Tile[Tile["Floor"] = 1] = "Floor";
    })(Tile$1 || (Tile$1 = {}));
    //# sourceMappingURL=types.js.map

    class Cell {
        constructor(x, y, tile, world) {
            this.x = x;
            this.y = y;
            this.tile = tile;
            this.world = world;
            this._contents = new Map();
            this.seen = false;
            this.id = `${x}:${y}`;
            this.world.reportEmpty(this);
        }
        get top() {
            return this.y > 0 ? this.world.grid[this.x][this.y - 1] : null;
        }
        get bottom() {
            return this.y < this.world.grid[this.x].length
                ? this.world.grid[this.x][this.y + 1]
                : null;
        }
        get left() {
            return this.x > 0 ? this.world.grid[this.x - 1][this.y] : null;
        }
        get right() {
            return this.x < this.world.grid.length - 1
                ? this.world.grid[this.x + 1][this.y]
                : null;
        }
        relativeCell(dx, dy) {
            return this.world.grid[this.x + dx][this.y + dy];
        }
        get isEmpty() {
            return this._contents.size === 0;
        }
        get contents() {
            return Array.from(this._contents.values());
        }
        get isPassable() {
            return this.tile == Tile$1.Floor;
        }
        addEntity(entity) {
            if (!this._contents.has(entity.id)) {
                this._contents.set(entity.id, entity);
                if (entity.cell !== this) {
                    entity.cell = this;
                }
                if (this._contents.size === 1) {
                    this.world.reportOccupied(this);
                }
            }
        }
        removeEntity(entity) {
            if (this._contents.has(entity.id)) {
                this._contents.delete(entity.id);
                if (entity.cell === this) {
                    entity.cell = null;
                }
                if (this._contents.size === 0) {
                    this.world.reportOccupied(this);
                }
            }
        }
    }
    //# sourceMappingURL=cell.js.map

    class Treasure extends Actor {
        constructor(id, name, char) {
            super();
            this.name = name;
            this.char = char;
            this.bgColor = '#FF0';
            this.fgColor = '#000';
            this.isHostile = false;
            this.isPickable = true;
            this.weight = 1;
            this.strength = 0;
            this.health = 100;
            this.id = `TRE${id}`;
        }
        act() { }
        notifyAttack() { }
    }
    //# sourceMappingURL=treasure.js.map

    const worldWidth = 100;
    const worldHeight = 100;
    class World {
        constructor(questLog, entityManager) {
            this.questLog = questLog;
            this.entityManager = entityManager;
            this.cells = [];
            this.map = null;
            this.width = worldWidth;
            this.height = worldHeight;
            this.emptyCells = new Set();
            this.occupiedCells = new Set();
            for (let x = 0; x < worldWidth; x++) {
                this.cells[x] = [];
                for (let y = 0; y < worldHeight; y++) {
                    this.cells[x].push(new Cell(x, y, Tile$1.Wall, this));
                }
            }
            const freeCells = [];
            this.map = new Map$2.Uniform(worldWidth, worldHeight, {});
            this.map.create((x, y, value) => {
                if (!value) {
                    this.cells[x][y].tile = Tile$1.Floor;
                    freeCells.push({ x, y });
                }
            });
            // Put the player in the middle of the first room.
            const [x, y] = this.map.getRooms()[0].getCenter();
            this.startPoint = this.cells[x][y];
            for (let i = 0; i < 20; i++) {
                const c = RNG$1.getUniformInt(0, freeCells.length - 1);
                const { x, y } = freeCells[c];
                this.entityManager.createEntity(id => {
                    const enemy = new Skeleton(id, this);
                    enemy.cell = this.cells[x][y];
                });
                freeCells.splice(c, 1);
            }
            for (let i = 0; i < 20; i++) {
                const c = RNG$1.getUniformInt(0, freeCells.length - 1);
                const { x, y } = freeCells[c];
                this.entityManager.createEntity(id => {
                    const treasure = new Treasure(id, 'Cash', '$');
                    treasure.cell = this.cells[x][y];
                    freeCells.splice(c, 1);
                });
            }
        }
        get grid() {
            return this.cells;
        }
        reportEmpty(cell) {
            this.emptyCells.add(cell);
            this.occupiedCells.delete(cell);
        }
        reportOccupied(cell) {
            this.emptyCells.delete(cell);
            this.occupiedCells.add(cell);
        }
        getAllActors() {
            const result = [];
            this.occupiedCells.forEach(cell => {
                result.push(...cell.contents);
            });
            return result;
        }
    }
    //# sourceMappingURL=world.js.map

    const boardWidth = 30;
    const boardHeight = 30;
    //# sourceMappingURL=constants.js.map

    const FLOOR1 = [238, 238, 238];
    const FLOOR2 = [221, 221, 221];
    const WALL = [90, 65, 38];
    const WALL_HEX = Color.toHex(WALL);
    function darken([r, g, b], frac) {
        return [r * frac, g * frac, b * frac].map(v => Math.round(v));
    }
    class Camera {
        constructor(world) {
            this.world = world;
            this._player = null;
            this.cx = 0;
            this.cy = 0;
            this.getMapBg = ({ x, y, seen }, visibility) => {
                const baseColor = (x % 2) + (y % 2) - 1 ? FLOOR1 : FLOOR2;
                const scaled = seen ? 0.3 + 0.7 * visibility : visibility;
                return Color.toHex(darken(baseColor, scaled));
            };
            this.display = new Display({
                width: boardWidth,
                height: boardHeight,
                fontSize: 18,
                forceSquareRatio: true
            });
            this.windowWidth = Math.floor(boardWidth * 0.15);
            this.windowHeight = Math.floor(boardHeight * 0.15);
            this.fov = new FOV$1.PreciseShadowcasting((x, y) => {
                if (this.validCoords(x, y)) {
                    return this.world.cells[x][y].tile === Tile$1.Floor;
                }
                return false;
            });
        }
        set player(value) {
            this._player = value;
            this.cx = value.x;
            this.cy = value.y;
        }
        get displayContainer() {
            return this.display.getContainer();
        }
        draw(x, y, displayable) {
            this.display.draw(x, y, displayable.char, displayable.fgColor, displayable.bgColor);
        }
        render() {
            this.updateWindow();
            const visible = new Map();
            if (this._player) {
                this.fov.compute(this._player.x, this._player.y, 8, (x, y, r, visibility) => {
                    if (this.validCoords(x, y)) {
                        const cell = this.world.cells[x][y];
                        visible.set(cell, visibility);
                        cell.seen = true;
                    }
                });
            }
            for (let rx = 0; rx < boardWidth; rx++) {
                const x = this.cx + (rx - boardWidth / 2);
                for (let ry = 0; ry < boardHeight; ry++) {
                    const y = this.cy + (ry - boardHeight / 2);
                    if (this.validCoords(x, y)) {
                        const cell = this.world.cells[x][y];
                        if (visible.has(cell)) {
                            this.drawCell(cell, rx, ry, visible.get(cell));
                        }
                        else {
                            this.drawCell(cell, rx, ry, 0);
                        }
                    }
                    else {
                        this.display.draw(rx, ry, '', '', '');
                    }
                }
            }
        }
        drawTile(x, y, cell, visibility) {
            switch (cell.tile) {
                case Tile$1.Floor:
                    this.display.draw(x, y, '', null, this.getMapBg(cell, visibility));
                    break;
                case Tile$1.Wall:
                    const scaled = cell.seen ? 0.3 + 0.7 * visibility : visibility;
                    this.display.draw(x, y, '', '', Color.toHex(darken(WALL, scaled)));
                    break;
            }
        }
        drawCell(cell, x, y, visibility) {
            this.drawTile(x, y, cell, visibility);
            if (!cell.isEmpty && visibility > 0.5) {
                this.draw(x, y, cell.contents[0]);
            }
        }
        updateWindow() {
            if (this._player) {
                const dx = this._player.x - this.cx;
                const dy = this._player.y - this.cy;
                if (dx > this.windowWidth) {
                    this.cx += 1;
                }
                else if (dx < -this.windowWidth) {
                    this.cx -= 1;
                }
                if (dy > this.windowHeight) {
                    this.cy += 1;
                }
                else if (dy < -this.windowHeight) {
                    this.cy -= 1;
                }
            }
        }
        validCoords(x, y) {
            return x >= 0 && x < this.world.width && y >= 0 && y < this.world.height;
        }
    }
    //# sourceMappingURL=camera.js.map

    class EntityManager {
        constructor() {
            this.id = 1;
        }
        createEntity(factory) {
            this.id++;
            return factory(this.id);
        }
    }
    //# sourceMappingURL=manager.js.map

    let UIGame = class UIGame extends LitElement {
        constructor() {
            super();
            this.scheduler = new Scheduler$1.Simple();
            this.player = null;
            this.questLog = [];
            RNG$1.setSeed(11);
            this.entityManager = new EntityManager();
            this.world = new World(this.questLog, this.entityManager);
            this.camera = new Camera(this.world);
        }
        render() {
            return html `
      <h1>Underground</h1>
      ${this.camera.displayContainer}
      <ui-quest-log .items="${this.questLog}"></ui-quest-log>
    `;
        }
        static get styles() {
            return css `
      :host {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: auto auto auto;
        align-content: center;
        justify-content: center;
        grid-gap: 12px;
      }

      h1 {
        text-align: center;
        font-weight: normal;
      }
    `;
        }
        log(entry) {
            this.questLog = [...this.questLog, entry];
            this.requestUpdate();
        }
        firstUpdated() {
            return __awaiter(this, void 0, void 0, function* () {
                this.questLog.length = 0;
                this.questLog.push(new LogEntry('Your adventure begins!', 'info'));
                this.scheduler.clear();
                this.entityManager.createEntity(id => {
                    const player = new Player(id, this.world, this);
                    player.cell = this.world.startPoint;
                    this.player = player;
                    this.camera.player = this.player;
                });
                this.world.getAllActors().forEach(actor => {
                    this.scheduler.add(actor, true);
                });
                this.camera.render();
                while (1) {
                    let actor = this.scheduler.next();
                    if (!actor) {
                        break;
                    }
                    yield actor.act();
                    this.camera.render();
                }
            });
        }
        showMenu(options) {
            return new Promise(resolve => {
                const menu = document.createElement('ui-menu');
                document.body.appendChild(menu);
                menu.options = options;
                menu.addEventListener('ui-close', () => {
                    document.body.removeChild(menu);
                    resolve(null);
                });
                menu.addEventListener('ui-menu-select', ((e) => {
                    document.body.removeChild(menu);
                    resolve(e.detail);
                }));
            });
        }
    };
    UIGame = __decorate([
        customElement('ui-game')
    ], UIGame);
    //# sourceMappingURL=game.js.map

    //# sourceMappingURL=index.js.map

}());
//# sourceMappingURL=underground.js.map
