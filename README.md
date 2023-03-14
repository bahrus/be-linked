# be-linked

## Propagating Event Target Subscribing Scenarios

Scenario 1.

host-element container has boolean property "readOnly".  Inner element wants to match the value with the same property name.

```html
<host-element>
    #shadow
    <input be-linked='
        Link readOnly.
    '>
</host-element>
```

which is shorthand for:

```html
<host-element>
    #shadow
    <input be-linked='
        Link readOnly property of host to local readOnly property.
    '>
</host-element>
```

Scenario 2.

host-element container has property "readOnly".  Inner element wants to set dataset.isEditable to the opposite.

```html
<host-element>
    #shadow
    <input be-linked='
        Negate readOnly property of host to local dataset.isEditable property.
    '>
</host-element>
```

Scenario 3

host-element container has boolean property "readOnly" property.  If readOnly is true, set inner element's checked property to "on", else set it to "off".

```html
<host-element>
    #shadow
    <toggle-element be-linked='
        Map [true, false, null]=>["on","off", "indefinite"] for readOnly property of host to local checked property.
    '></toggle-element>
</host-element>
```

Scenario 4

Pass number value of previous element to local cm property.

```html
<div>
    <div data-d=7></div>
    <metric-units be-linked='
        Number-parse dataset:d property of previous element to local cm property.
    '></metric-units>
</div>
```

NB:  Can't subscribe to dataset.d changes.  Could add attrib mutation observer

Verbs:

Key          |Meaning                                                |Notes
-------------|-------------------------------------------------------|-----
Clone        |Do a structured clone of the value before passing it.  |Makes it almost impossible to experience unexpected side effects from passing an object from one component to another.
Number-parse |Parse value as number.
Date-parse   |Parse value as date.
Stringify    |Do a JSON.stringify.
Objectify    |Do a JSON.parse.
Regexp-parse |Compile string as regular expression.
Reference    |Pass weak reference of the property.
Map          |Two JSON arrays separated by arrow function

Scenario 5

Property passing, with updates only, debug, fire

```html
<my-light-weight-container>
    <number-generator></number-generator>
    <metric-units be-linked='
        ```
        Link value updates of previous element to local cm property.
        Enable debugging.
        Fire changed event.
        ```
    '></metric-units>
</my-liehgt-weight-container>
```

## Traditional Element Events

```html
<my-light-weight-container>
    <number-generator></number-generator>
    <metric-units be-linked='
        ```
        On value changed event of previous element do link value to local cm property. 
        Enable debugging.
        Fire changed event.
        Nudge previous element.
        Skip init.
        ```
    '></metric-units>
</my-light-weight-container
```

