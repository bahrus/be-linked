# be-linked

[![Playwright Tests](https://github.com/bahrus/be-linked/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-linked/actions/workflows/CI.yml)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-linked?style=for-the-badge)](https://bundlephobia.com/result?p=be-linked)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-linked?compression=gzip">
[![NPM version](https://badge.fury.io/js/be-linked.png)](http://badge.fury.io/js/be-linked)

Connect (web) components together.

## Part I Downstream linkage

### Property setter subscription scenarios

#### Simplest scenario.

host-element container has boolean property "readOnly".  Inner element wants to match the value with the same property name.

```html
<host-element>
    #shadow
    <input be-linked='
        Link read only props.
    '>
</host-element>
```

which is shorthand for:

###### Hemingway Notation

```html
<host-element>
    #shadow
    <input be-linked='
        Link read only property of host to read only property of adorned element.
    '>
</host-element>
```

##### JavaScriptObjectNotation

```html
<host-element>
    #shadow
    <input be-linked='
        "links":[{
            "downstreamPropPath": "readOnly",
            "target": "local",
            "upstreamCamelQry": "host",
            "upstreamPropPath": "readOnly",
            "passDirection": "towards"
        }]
    '>
</host-element>
```

#### Negation scenario.

host-element container has property "readOnly".  Inner element wants to set dataset.isEditable to the opposite.

```html
<host-element>
    #shadow
    <input be-linked='
        Negate read only property of host to dataset:isEditable property of adorned element.
    '>
</host-element>
```



Alternative:

```html
<host-element>
    #shadow
    <input be-linked='
        Link read only property of host to dataset:isEditable property of adorned element.
        Negate the linkage.
    '>
</host-element>
```

"the linkage" is optional and ignored.  Treated as commentary.

### Other verbs [Untested]

In place of "Negate" above, we can use the following verbs:

Key               |Meaning                                                |Notes
------------------|-------------------------------------------------------|-----
Clone             |Do a structured clone of the value before passing it.  |Makes it almost impossible to experience unexpected side effects from passing an object from one component to another.
Refer             |Pass weak reference of the property.

#### Translate scenario

```html
<paul-mccartney age=64>
    #shadow
    <daughter-heather be-linked='
        Link age property of host - 20 to age property of adorned element.
    '></daughter-heather>
</paul-mccartney>
```

#### as number (or other data formats)

```html
<input type=number value=37>

<paul-mccartney be-linked='
    Link value property of previous element sibling as number to age property of adorned element.
'></paul-mccartney>
```

Options:  as number, as date, as object, as string, as reg exp, as url.


#### Mapping

In many frameworks (take knockout.js, for example) the expectation is that the host element can easily be peppered with lots of computed properties that can then be passed to various child elements.  

However, there may be circumstances where this might not be ideal:

1.  We may be building a "Democratic Organism" web component, where the "brains" of the component is a non visual "component as a service" sitting within the outer web component skin.
2.  We may need to interact with sibling elements, where we cannot go in and add computed properties.
3.  Even if we are using a more traditional model with a robust host container element filled with computed property logic that we maintain, some of the computed property logic contained within the host container may seem overly tightly coupled to the UI, and can detract from the central meaning of the host container element.
4.  Constantly switching context between the UI Markup and the host element's computed properties might make sense when the requirements are very well understood, and the desire is to make the host element highly reusable.  But before that happens, it might be easier on the developer if the computed properties are defined as close to where they are used as possible.  I would suggest that this argument provides some of the reasoning behind why template engines with full access to the JavaScript runtime engine (tagged template literals and/or JSX) seem quite popular.

So we provide two ways of adding the equivalent of computed properties:  

##### Declarative mapping scenario

host-element container has boolean property "readOnly" property.  If readOnly is true, set inner element's checked property to "on", if it is false "off".  If anything else, set it to "indeterminate".

```html
<host-element>
    #shadow
    <toggle-element be-linked='
        {
            "declare": {
                "true": true,
                "false": false,
                "trueVal": "on",
                "falseVal": "off"
            }
        }
        When read only property of host equals true assign true val to checked property of adorned element.
    '></toggle-element>
</host-element>
```

##### Using JavaScript for more complex scenarios

```html
<host-element>
    #shadow
    <script nomodule>
        export const readOnlyHandler = ({remoteInstance, adornedElement}) => ({
            checked: remoteInstance.readOnly ? 'on' : 'off',
        });
    </script>
    <toggle-element be-linked='
        When read only property of host changes assign result of read only handler to adorned element. 
    '></toggle-element>
</host-element>
```

#### Counting Scenario

```html
<my-light-weight-container>
        <my-time-ticker-service></my-time-ticker-service>
        <my-counter be-linked='
            When value property of previous element sibling changes increment count property of adorned element.
        '></my-counter>
</my-light-weight-container>
```



<!--#### Copying [TODO]

Pass number value of previous element to local cm property.

```html
<div>
    <div data-d=7></div>
    <metric-units be-linked='
        ```
        Copy dataset:d property as number of previous element to local cm property.
        ```
    '></metric-units>
</div>
```
-->

NB:  Can't subscribe to dataset.d changes.  So can't support link, only copy. 

Maybe this should be a separate decorator?


### Leaning on server rendering

If the server is able to apply the initial round of rendering / passing, then we can alleviate the browser of a little extra work by saying it is so.

```html
<my-light-weight-container>
    <number-generator></number-generator>
    <metric-units be-linked='
        ```
        Skip initialization.
        ...
        ```
    '></metric-units>
</my-light-weight-container>
```

## Traditional Element Events 

```html
<my-light-weight-container>
    <number-generator></number-generator>
    <metric-units be-linked='
        ```
        On value changed event of previous element sibling pass value property to cm property of adorned element. 
        Debug. //Done.
        Fire changed event.  //Done.
        Nudge previous element. //"previous element" is ignored commentary.  //Always nudges the source element.  //Done.
        Skip initialization. //"initialization" is ignored commentary.
        ```
    '></metric-units>
</my-light-weight-container
```

The use of the three tick marks here, by the way, is there just to demonstrate another important feature -- we can include multiple instruction sets within one be-linked attribute (i.e. an array of bindings).  We use the three tick separator (similar to markdown) to indicate a single object.  Nested tick marks not supported.

## Upstream linking 

Suppose we want to pass information in the opposite direction -- from the adorned element to an upstream element like the host container element?  If we are not careful, this can easily result in infinite loops.  To help prevent this, no support for property changes ("setter subscribing") is supported.  Only events.  The developer should lean heavily on the practice of only allowing data to flow in this direction when it is triggered (directly or indirectly) by user initiated actions.

```html
<host-element>
    #shadow
        <input be-linked='
            On input event of adorned element pass value property to greeting property of host.
        '>
</host-element>
```

## Upstream scripting 

```html
<host-element>
    #shadow
        <script nomodule>
            export const myHandler = ({remoteInstance, adornedElement}) => ({

            })
        </script>
        <input be-linked='
            On input event of adorned element assign result of my handler to host.
        '>
</host-element>
```

If host-element has method "doSomething": [Untested]

```html
<host-element>
    #shadow
        <input be-linked='
            On input event of adorned element invoke method do something of host.
        '>
</host-element>
```

 

### Sidewise linking [Untested]

It is possible to employ either downstream or upstream syntax, if targeting a peer element of the adorned element, within the Shadow DOM realm, wherever it may exist.  That can be done by specifying the id (but other css matches can be used instead.  The one restriction is we can only target one element with each statement, the first element that matches the instructions):

```html
<host-element>
    #shadow
        <input type=number be-linked='
            On input event of adorned element 
            pass value property as number 
            to slide index property 
            of slide show id 
            within root node.
        '>
        ...
        <my-carousel id=slide-show></my-carousel>
</host-element>
```

If the user enters something in the input field before the my-carousel element has streamed to the browser, tough luck!

To avoid this possibility maybe it would make more sense to add a be-linked attribute to my-carousel?




