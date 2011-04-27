/*
 * Copyright (c) 2011 Joshua Paine, <http://letterblock.com/>
 * Available under the MIT or GPL v2 license. You do not need to reproduce 
 * the full license text here.
 */
(function($){
  var origTrigger = $.fn.trigger;
  $.fn.trigger = function(type){
    origTrigger.apply(this,arguments);
    if(type.doneWithHandlers){ type.doneWithHandlers(); }; 
    return this;
  }

  var Pencil = function(type){
    $.Event.call(this,type);
    this._dfr = new $.Deferred();
    this._waitingFor = [true];
  }
  Pencil.prototype = new $.Event('');

  Pencil.prototype.waitFor = function(promise){
    this._waitingFor.push(promise);
  };
  Pencil.prototype.doneWithHandlers = function(){
    if(this.isDefaultPrevented()){
      this._dfr.reject();
    } else {
      $.when.apply($,this._waitingFor).then(this._dfr.resolve,this._dfr.reject);
    }
  };
  Pencil.prototype.then = function(){ return this._dfr.then.apply(this._dfr,arguments); };
  Pencil.prototype.done = function(){ return this._dfr.done.apply(this._dfr,arguments); };
  Pencil.prototype.fail = function(){ return this._dfr.fail.apply(this._dfr,arguments); };
  Pencil.prototype.isResolved = function(){ return this._dfr.isResolved.apply(this._dfr,arguments); };
  Pencil.prototype.isRejected = function(){ return this._dfr.isRejected.apply(this._dfr,arguments); };

  $.Pencil = Pencil;
})(jQuery);
