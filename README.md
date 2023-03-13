# be-linked

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



```html
<host-element>
<my-element be-linked='
    Link value as number from previous largest scale element 
        to my very important \and unusual property.
    Link value as number from propagating beScoped:scope of previous largest scale element to my very important \and unusual property.   
    Nudge previous largest scale element.
    Link update of value property as float from previous largest scale element to my very important \and unusual property.//SkipInit.
    On value-changed event of previous largest scale element having inner a-duck element  
        do stop propagation
        and debug 
        and link value as string to my rhs property
        and fire my custom event name.
    Link true value as hello and false value as goodbye as string from previous largest scale element to my very import \and unusual property.
    
'>
</my-element>
```