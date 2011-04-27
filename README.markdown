# Pencil jQuery Plugin

Like an appointment you pencil in and may change, jQuery.Pencil is an Event that can be deferred.

Suppose your content management system fires a `save` event before saving, allowing other components to validate forms or whatever. Now suppose that one or more of those components needs to do something that requires a server roundtrip (make sure the post name isn't taken?) or user interaction (require a title?), and that the component can't tell whether to cancel the save event or not until after that's done.

With traditional events, the handler would need to cancel the event immediately and then invoke the save function again if everything turns out to be ok. But then you can't reuse handlers for different events without a lot of bookkeeping (how will the handler know which function to invoke?), and the save function itself can't return a promise. And if you've gotten into promises in jQuery or got used to them elsewhere, you really don't want to be limited to plain callbacks anymore (which you also couldn't maintain without more bookkeeping).

As you, gentle reader, have no doubt guessed, this was the very situation in which the midnightmonster found himself.

You use jQuery.Pencil like this:

    var e = new jQuery.Pencil('save');
    $(document).trigger(e);

Then instead of checking `e.isDefaultPrevented()`, do this:

    e.then(
      function(){
        // finish saving
      },
      function(){
        // cancel saving
      }
    );

Your event handlers do not have to know about Pencil's additional capabilities if they don't need them. If a handler returns false or calls `e.preventDefault()`, the event's promise will be rejected. For your asynchronous event handlers, there's a new method on the event:

    e.waitFor(promise);

If the promise is rejected, the event will be rejected. If the promise is resolved and any other promises the event is told to wait for are resolved (and no handler canceled the event directly!) then the event will resolve.


