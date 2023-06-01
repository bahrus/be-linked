# be-linked [WIP]

[![Playwright Tests](https://github.com/bahrus/be-linked/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-linked/actions/workflows/CI.yml)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-linked?style=for-the-badge)](https://bundlephobia.com/result?p=be-linked)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-linked?compression=gzip">
[![NPM version](https://badge.fury.io/js/be-linked.png)](http://badge.fury.io/js/be-linked)

Connect HTML (web) components and custom enhancements together.

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

which is shorthand for one of two lingo's:

###### Hemingway Notation

```html
<host-element>
    #shadow
    <input be-linked='
        Link read only property of host to read only property of $0.
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

<!--##### Microdata Notation [TODO]
```html
<host-element>
    #shadow
    <link itemscope itemref="my-id" be-linked>
    ...
    <input be-linked='
        Derive read only property from my-id
    '>
    <link itemprop=readOnly id=my-id href="https://schema.org/True">
    ...
    
</host-element>
```

This is just a sneak peak into something that will be discussed in more depth later -- integration with microdata.-->

## Special notation for hooking up custom enhancements

```html
<input type=search>

<div be-linked='
    On input event of previous element sibling pass value property to $0-enh-by-be-searching => for text.
'>
<div>
    supercalifragilisticexpialidocious
</div>
```

#### Negation scenario [Untested]

host-element container has property "readOnly".  Inner element wants to set dataset.isEditable to the opposite.

```html
<host-element>
    #shadow
    <input be-linked='
        Negate read only property of host to dataset:isEditable property of $0.
    '>
</host-element>
```


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
    <daughter-heather enh-by-be-linked='
        Link age property of host - 20 to age property of $0.
    '></daughter-heather>
</paul-mccartney>
```

#### as number (or other data formats)

```html
<input type=number value=37>

<paul-mccartney enh-by-be-linked='
    Link value property of previous element sibling as number to age property of $0.
'></paul-mccartney>
```

Options:  as number, as date, as object, as string, as reg exp, as url.


#### Mapping [Deprecated]

In many frameworks (take knockout.js, for example) the expectation is that the host element can easily be peppered with lots of computed properties that can then be passed to various child elements.  

However, there may be circumstances where this might not be ideal:

1.  We may be building a "Democratic Organism" web component, where the "brains" of the component is a non visual "component as a service" sitting within the outer web component skin.
2.  We may need to interact with sibling elements, where we cannot go in and add computed properties.
3.  Even if we are using a more traditional model with a robust host container element filled with computed property logic that we maintain, some of the computed property logic contained within the host container may seem overly tightly coupled to the UI, and can detract from the central meaning of the host container element.
4.  Constantly switching context between the UI Markup and the host element's computed properties might make sense when the requirements are very well understood, and the desire is to make the host element highly reusable.  But before that happens, it might be easier on the developer if the computed properties are defined as close to where they are used as possible.  I would suggest that this argument provides some of the reasoning behind why template engines with full access to the JavaScript runtime engine (tagged template literals and/or JSX) seem quite popular.

So we provide two ways of adding the equivalent of computed properties:  

##### Declarative mapping scenario [Deprecated]

host-element container has boolean property "readOnly" property.  If readOnly is true, set inner element's checked property to "on", if it is false "off".  If anything else, set it to "indeterminate".

```html
<host-element>
    #shadow
    <toggle-element enh-by-be-linked='
        {
            "declare": {
                "true": true,
                "false": false,
                "trueVal": "on",
                "falseVal": "off"
            }
        }
        When read only property of host equals true assign true val to checked property of $0.
    '></toggle-element>
    <be-hive></be-hive>
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
    <toggle-element enh-by-be-linked='
        When read only property of host changes assign result of read only handler to $0. 
    '></toggle-element>
    <be-hive></be-hive>
</host-element>
```

#### Counting Scenario

```html
<my-light-weight-container>
        <my-time-ticker-service></my-time-ticker-service>
        <my-counter enh-by-be-linked='
            When value property of previous element sibling changes increment count property of $0.
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


NB:  Can't subscribe to dataset.d changes.  So can't support link, only copy. 

Maybe this should be a separate decorator? -->


### Leaning on server rendering

If the server is able to apply the initial round of rendering / passing, then we can alleviate the browser of a little extra work by saying it is so.


```html
<host-element>
    #shadow
    <input disable be-linked='
        ```
        Link read only props.
        Nudge previous element. //"previous element" is ignored commentary.  //Always nudges the source element.  //Done.
        Skip initialization. //"initialization" is ignored commentary.
        ```
    '>
</host-element>
```

The use of the three tick marks here, by the way, is there just to demonstrate another important feature -- we can include multiple instruction sets within one be-linked attribute (i.e. an array of bindings).  We use the three tick separator (similar to markdown) to indicate a single object.  Nested tick marks not supported.  This is important when using separate qualifiers like "nudge" and "skip", because those qualifiers apply to all the "Link" and other statements contained within the tick marks.  So if those qualifiers should be applied to a single statement, simply wrap the single statement and qualifiers together within a set of tick marks.


## Traditional Element Events 

```html
<my-light-weight-container>
    <number-generator></number-generator>
    <metric-units enh-by-be-linked='
        ```
        On value changed event of previous element sibling pass value property to cm property of $0. 
        Debug. //Done.
        Fire changed event.  //Done.
        Nudge previous element. //"previous element" is ignored commentary.  //Always nudges the source element.  //Done.
        Skip initialization. //"initialization" is ignored commentary.
        ```
    '></metric-units>
</my-light-weight-container
```



### Traditional Element Events to enhancement property

```html
<input name=lhs>
<template be-switched be-linked='
    On input event of previous lhs named element pass value property to lhs property of enhancement be-switched of $0.
'>
```

## Upstream linking 

Suppose we want to pass information in the opposite direction -- from the adorned element to an upstream element like the host container element?  If we are not careful, this can easily result in infinite loops.  To help prevent this, no support for property changes ("setter subscribing") is supported.  Only events.  The developer should lean heavily on the practice of only allowing data to flow in this direction when it is triggered (directly or indirectly) by user initiated actions.

```html
<host-element>
    #shadow
        <input be-linked='
            On input event of $0 pass value property to greeting property of host.
        '>
</host-element>
```

## Upstream scripting 

```html
<host-element>
    #shadow
        <script nomodule>
            export const myHandler = ({remoteInstance, $0}) => ({

            })
        </script>
        <input be-linked='
            On input event of $0 assign result of my handler to host.
        '>
</host-element>
```

If host-element has method "doSomething": [Untested]

```html
<host-element>
    #shadow
        <input be-linked='
            On input event of $0 invoke method do something of host.
        '>
</host-element>
```

## Shorthand for invoking

A special key word is used for invoking methods on the host:

```html
<host-element>
    #shadow
        <input be-linked='
            Invoke do something.
        '>
</host-element>
```

Because this is a form element, by default invokes the method on the input event (or change?).  If it's the form, invokes on submit.  

For everything else, defaults to click.

To specify the event:

```html
<host-element>
    #shadow
        <input be-linked='
            Invoke do something on click.
        '>
</host-element>
```

As far as finding the host, the following is used:

1.  Searches for the closest element with attribute itemscope.
2.  If dash in the name, does an await customElements.whenDefined
3.  Checks if method exists on custom element.
4.  If not found, continues to searching for the next closest element with attribute itemscope.
5.  Lastly, tries getRootNode().host
6.  If that fails, throws an error.

Method can be nested path (using : delimiter).

### Sidewise linking [Untested]

It is possible to employ either downstream or upstream syntax, if targeting a peer element of the adorned element, within the Shadow DOM realm, wherever it may exist.  That can be done by specifying the id (but other css matches can be used instead.  The one restriction is we can only target one element with each statement, the first element that matches the instructions):

```html
<host-element>
    #shadow
        <input type=number be-linked='
            On input event of $0 
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




## Running locally

1.  Do a git clone or a git fork of repository https://github.com/bahrus/be-linked
2.  Install node.js
3.  Run "npm install" from location of folder created in step 1.
4.  Run npm run serve.  Open browser to http://localhost:3030/demo/

## Using from ESM Module:

```JavaScript
import 'be-linked/be-linked.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-linked';
</script>
```