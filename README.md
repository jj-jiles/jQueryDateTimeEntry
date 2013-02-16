jQueryDateTimeEntry
===================

DateTime Entry plugin for jQuery

This is a pretty basic date/time entry form for jQuery. It can be bound to any object. It is bound the to onClick event and will present a small menu for the user to enter the date and time

It is in the MM/DD/YYYY HH:mm:ss format. It allows for a callback that is fired when the user presses Enter, or makes a change to the date/time and closes menu.

Example:
```html
<span id="dateTimeEntry"></span>
```
```javascript
$(document).ready(function() {
    // Defaults, with no callback
    $('#dateTimeEntry').dateTimeEntry();
    
    // With callback
    $('#dateTimeEntry').dateTimeEntry({
        callback : function(ui, event) { alert('hello');
    });
});
```
