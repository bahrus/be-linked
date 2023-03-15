# be-linked [TODO]

## Propagating Event Target Subscribing Scenarios

Scenario 1.

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

```html
<host-element>
    #shadow
    <input be-linked='
        Link read only property of host to local read only property.
    '>
</host-element>
```

Scenario 2.

host-element container has property "readOnly".  Inner element wants to set dataset.isEditable to the opposite.

```html
<host-element>
    #shadow
    <input be-linked='
        Negate read only property of host to local dataset:isEditable property.
    '>
</host-element>
```

Alternative:

```html
<host-element>
    #shadow
    <input be-linked='
        Link read only property of host to local dataset:isEditable property.
        Negate the link.
    '>
</host-element>
```

"the link" is optional and ignored.  Treated as commentary.

```html
<paul-mccartney age=64>
    #shadow
    <daughter-heather be-linked='
        Link age props.
        Minus by 20 the linkage.
    '></daughter-heather>
</paul-mccartney>
```

Scenario 3

host-element container has boolean property "readOnly" property.  If readOnly is true, set inner element's checked property to "on", if it is false "off".

```html
<host-element>
    #shadow
    <toggle-element be-linked='
        ```
            {
                "matchValues": [
                    {"from": true, "to": "on"},
                    {"from": false, "to": "off"},
                    {"default": "indefinite"}
                ]
            }
            Link readOnly property of host to local checked property.
        ```
    '></toggle-element>
</host-element>
```

Scenario 4

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

Ambient Verbs:

Key               |Meaning                                                |Notes
------------------|-------------------------------------------------------|-----
Clone.            |Do a structured clone of the value before passing it.  |Makes it almost impossible to experience unexpected side effects from passing an object from one component to another.
Parse as number.  |Parse value as number.
Parse as date.    |Parse value as date.
Stringify.        |Do a JSON.stringify.
Objectify.        |Do a JSON.parse.
Parse as regExp.  |Compile string as regular expression.
Pass as weak ref. |Pass weak reference of the property.
Negate.           |
Minus by.         |Parse as number if needed and subtract this number.
Plus by.
Increment.
Increment by.

Scenario 5

Property passing, with updates only, debug, fire

```html
<my-light-weight-container>
    <number-generator></number-generator>
    <metric-units be-linked='
        ```
        Skip initialization.
        Link value of previous element to local cm property.
        Debug.
        Fire changed event.
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
        On value changed event of previous element do pass value to local cm property. 
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

