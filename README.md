# be-linked [WIP]

## Part I Downstream linkage

### Propagating Event Target Subscribing Scenarios

#### Simplest scenario. [Done]

host-element container has boolean property "readOnly".  Inner element wants to match the value with the same property name.

```html
<host-element>
    #shadow
    <input be-linked='
        Link read only props.
    '>
</host-element>
```

which is shorthand for [Done]:

```html
<host-element>
    #shadow
    <input be-linked='
        Link read only property of host to read only property of adorned element.
    '>
</host-element>
```

#### Negation scenario [Done].

host-element container has property "readOnly".  Inner element wants to set dataset.isEditable to the opposite.

```html
<host-element>
    #shadow
    <input be-linked='
        Negate read only property of host to dataset:isEditable property of adorned element.
    '>
</host-element>
```



Alternative [Done]:

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
Stringify         |Do a JSON.stringify.
Refer             |Pass weak reference of the property.

#### Translate scenario [Done]

```html
<paul-mccartney age=64>
    #shadow
    <daughter-heather be-linked='
        Link age property of host to age property of adorned element after subtracting 20.
    '></daughter-heather>
</paul-mccartney>
```

#### as ... [Done]

```html
<input type=number value=37>

<paul-mccartney be-linked='
    Link value property as number of previous element sibling to age property of adorned element.
'></paul-mccartney>
```

Options:  as number, as date, as object, as string, as reg exp, as url


#### Mapping

In many frameworks (take knockout.js, for example) the expectation is that the host element can easily be peppered with lots of computed properties that can then be passed to various child elements.  

However, there may be circumstances where this might not be ideal:

1.  We may be building a "Democratic Organism" web component, where the "brains" of the component is a non visual "component as a service" sitting within the outer web component skin.
2.  We may need to interact with sibling elements, where we cannot go in and add computed properties.
3.  Even if we are using a more traditional model with a robust host container element filled with computed property logic, some of the binding rules contained within the component may seem overly tightly coupled to the UI, and can detract from the central meaning of the host container element.
4.  Constantly switching context between the UI Markup and the host element's computed properties might make sense when the requirements are very well understood, and the desire is to make the host element highly reusable.  But before that happens, it might be easier on the developer if the computed properties are defined as close to where they are used as possible.  I would suggest that this argument provides some of the reasoning behind why template engines with full access to the JavaScript runtime engine (tagged template literals and/or JSX) seem quite popular.

So we provide two ways of adding the equivalent of computed properties:  

##### Declarative mapping scenario [TODO]

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
        If read only property of host equals true then set checked property of adorned element to true val.
        If read only property of host equals false then set checked property of adorned element to false val.
    '></toggle-element>
</host-element>
```

##### Using JavaScript for more complex scenarios [Done]


```html
<host-element>
    #shadow
    <script nomodule>
        export const readOnlyHandler = ({remoteInstance}) => ({
            checked: remoteInstance.readOnly ? 'on' : 'off',
        });
    </script>
    <toggle-element be-linked='
        Use read only handler import to manage read only property changes of host.
    '></toggle-element>
</host-element>
```

<!--

```html
<host-element>
    #shadow
    <script nomodule>
        export const readOnlyHandler = async ({upstreamElement, downstreamElement, ctx}) => ({
            checked: upstreamElement.readOnly ? 'on' : 'off';
        })
    <script>
    <toggle-element be-linked='
        {
            "import": {
                "symbol": "readOnlyHandler",
                "as": "readOnlyHandler", //default, optional
                "from": "previousElementSibling", //default
            }
        }
        Use imported read only mediator to manage read only property changes of host.
    '></toggle-element>
</host-element>
```

-->


#### Counting Scenario [TODO]

```html
<my-light-weight-container>
        <my-time-ticker-service></my-time-ticker-service>
        <span be-linked='
            Count changes to value property of previous element and pass it to text content property of adorned element.
        '></span>
</my-light-weight-container>
```



#### Copying [TODO]

Pass number value of previous element to local cm property.

```html
<div>
    <div data-d=7></div>
    <metric-units be-linked='
        ```
        Copy dataset:d property of previous element to local cm property.
        Parse as number the copy.
        ```
    '></metric-units>
</div>
```

NB:  Can't subscribe to dataset.d changes.  So can't support link, only copy. 

Maybe this should be a separate decorator?



Ambient Verbs:

Key               |Meaning                                                |Notes
------------------|-------------------------------------------------------|-----
Clone.            |Do a structured clone of the value before passing it.  |Makes it almost impossible to experience unexpected side effects from passing an object from one component to another.
Parse.            |Parse value as number or date or regExp or Object, whichever works.
Stringify.        |Do a JSON.stringify.
Reference.        |Pass weak reference of the property.
Negate.           |
Minus by.         |Parse as number if needed and subtract this number.
Plus by.
Increment.
Increment by.

### Leaning on server rendering [Done]

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

## Traditional Element Events [TODO]

```html
<my-light-weight-container>
    <number-generator></number-generator>
    <metric-units be-linked='
        ```
        On value changed event of previous element sibling do pass value to cm property of adorned element. 
        Debug.
        Fire changed event.
        Nudge previous element. //"previous element" is ignored commentary.  Always nudges the source element.
        Skip initialization. //"initialization" is ignored commentary.
        ```
    '></metric-units>
</my-light-weight-container
```

```html
<my-light-weight-container>
    <number-generator></number-generator>
    <metric-units be-linked='
        ```
        On value changed event of previous element do increment local cm property. 
        Debug.
        Fire changed event.
        Nudge previous element.
        Skip initialization.
        ```
    '></metric-units>
</my-light-weight-container
```

The use of the three tick marks here, by the way, is there just to mention another important feature -- we can include multiple instruction sets within one be-linked attribute (i.e. an array of bindings).  We use the three tick separator (similar to markdown) to indicate a single object.  Nested tick marks not supported.

## Upstream linking [TODO]

Suppose we want to pass information in the opposite direction?  If we are not careful, this can easily result in infinite loops.  To help prevent this, no support for property changes is supported.  Only events.  The developer should shoulder the responsibility that this is triggered almost exclusively by user initiated events.

```html
<host-element>
    #shadow
        <input be-linked='
            On input event of adorned element do pass value up to greeting property of host.
        '>
</host-element>
```

So the big difference in the syntax is use of "up".  

### Sidewise linking [TODO]

It is possible to employ either downstream or upstream syntax, if targeting a peer element of the adorned element, within the Shadow DOM realm, wherever it may exist.  That is by specifying the id:

```html
<host-element>
    #shadow
        <input be-linked='
            On input event of adorned element do pass value to greeting property of downstream target id.
        '>
        ...
        <my-carousel id=downstream-target></my-carousel>
</host-element>
```

If the enters something in the input field before the my-carousel element has streamed to the browser, tough luck!

To avoid this possibility maybe it would make more sense to add a be-linked attribute to my-carousel?




