/* ================================================================== *\
   (C) Copyright 2008 by Secure Data Software, Inc.
   This file is part of Andromeda
   
   Andromeda is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.

   Andromeda is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with Andromeda; if not, write to the Free Software
   Foundation, Inc., 51 Franklin St, Fifth Floor,
   Boston, MA  02110-1301  USA 
   or visit http://www.gnu.org/licenses/gpl.html
\* ================================================================== */

/* ================================================================== *\
 
   Debugging using Firebug.
   
   This file is full of commands that make use of firebugs 
   very nice console facilities.  The up-side is that we get very
   thorough event tracing when needed.  The down-side is that they
   do not work at all on Internet Explorer and severely slow you 
   down while running.
   
   Therefore, it is desirable to be able to turn them off andon
   from time to time.  The best thing to do is comment them all
   out completely, but that can be tedious.  The following two
   Beanshell files show the jEdit commands for turning logging
   on and off by commenting and uncommenting the relevant lines.
   
   If you want to do it manually, just replace all "//console."
   with "//console." or vice-versa.
   
   # Beanshell: Turn logging off by commenting out lines
    SearchAndReplace.setSearchString("//console.");
    SearchAndReplace.setReplaceString("//console.");
    SearchAndReplace.setBeanShellReplace(false);
    SearchAndReplace.setIgnoreCase(true);
    SearchAndReplace.setRegexp(false);
    SearchAndReplace.setSearchFileSet(new CurrentBufferSet());
    SearchAndReplace.replaceAll(view);

   # Beanshell: Turn logging on by uncommenting the lines.
    SearchAndReplace.setSearchString("//console.");
    SearchAndReplace.setReplaceString("//console.");
    SearchAndReplace.setBeanShellReplace(false);
    SearchAndReplace.setIgnoreCase(true);
    SearchAndReplace.setRegexp(false);
    SearchAndReplace.setSearchFileSet(new CurrentBufferSet());
    SearchAndReplace.replaceAll(view);
\* ================================================================== */

/****O* Javascript-API/jsHtml
*
* NAME
*   Javascript-API.jsHtml
*
* FUNCTION
*   The javascript function jsHtml is a constructor 
*   function for a new HTML node.  It is considerably
*   faster and easier than document.createElement() and
*   node.appendChild.
*
*   This function works almost exactly the same way as the
*   PHP function html(), except that it works in the
*   browser.
*
*   The resulting object is considerably simpler than the
*   HTML nodes you can create in PHP, and is designed
*   only for basic tasks.  There are no shortcuts for 
*   creating complex entities, those must be coded by
*   hand.
*
*   You can pass the innerHTML in as the second parameter,
*   or you can set it directly by assigning the innerHtml
*   property of the object.
*
* INPUTS
*   * string - a valid (x)html tag name like 'div' or 'span'
*   * string - (optional) the value of innerHtml
*
* EXAMPLE
*   Use the Javascript "new" operator with this function.
*        <script>
*        var div = new jsHtml('div','Hello, I am a div!');
*        div.hp.style = 'width: 300px';
*        var html = div.bufferedRender();
*        $( -- some jquery selector -- ).append(html);
*        </script>
*
******
*/
function jsHtml(tag,innerHtml) {
    this.tag = tag;
    this.children = [ ];
    this.hp = { };

    /****O* jsHtml/innerHtml
    *
    * NAME
    *   jsHtml.innerHtml
    *
    * FUNCTION
    *   The javascript property innerHtml holds the innerHTML
    *   of an HTML node created by jsHtml().  You can pass in
    *   the innerHtml as the second parameter to jsHtml, or
    *   you can set this property directly.
    *
    * EXAMPLE
    *   Use the Javascript "new" operator with this function.
    *        <script>
    *        var div = new jsHtml('div');
    *        div.innerHtml = 'I set this on the 2nd line!';
    *        var html = div.bufferedRender();
    *        $( -- some jquery selector -- ).append(html);
    *        </script>
    *
    ******
    */
    this.innerHtml = innerHtml ? innerHtml : '';
    
    /****O* jsHtml/addChild
    *
    * NAME
    *   jsHtml.addChild
    *
    * FUNCTION
    *   The javascript method addChild adds one HTML node as
    *   a child to another.  Both nodes must have been 
    *   created by using the jsHtml() constructor function.
    *
    * EXAMPLE
    *   Use the Javascript "new" operator with this function.
    *        <script>
    *        var div = new jsHtml('div');
    *        var span = new jsHtml('span','A span in a div!');
    *        div.addChild(span);
    *        var html = div.bufferedRender();
    *        $( -- some jquery selector -- ).append(html);
    *        </script>
    *
    ******
    */
    this.addChild = function(child) {
        this.children.push(child);
    }
    /******/

    /****O* jsHtml/h
    *
    * NAME
    *   jsHtml.h
    *
    * FUNCTION
    *   The javascript method h creates a new HTML node and
    *   makes it a child of the current node.  This is a 
    *   shortcut for having to call jsHtml and then
    *   addChild.
    *
    * EXAMPLE
    *   Use the Javascript "new" operator with this function.
    *        <script>
    *        var div = new jsHtml('div');
    *        var span = div.h('span','Hello!');
    *        var html = div.bufferedRender();
    *        $( -- some jquery selector -- ).append(html);
    *        </script>
    *
    ******
    */
    this.h = function(tag,innerHtml) {
        var newNode = new jsHtml(tag,innerHtml);
        this.addChild(newNode);
        return newNode;
    }
    /******/

    /****O* jsHtml/bufferedRender
    *
    * NAME
    *   jsHtml.bufferedRender
    *
    * FUNCTION
    *   The javascript method bufferedRender returns a string
    *   of HTML for a node created with jsHtml.  It sets all
    *   properties, and recursively runs through all children.
    *   The innerHtml, if it is present, goes out last.
    *
    * SOURCE
    */
    this.bufferedRender = function() {
        var html = '<' + this.tag;
        for(var attName in this.hp) {
            html+=' '+attName+'="'+this.hp[attName]+'"';
        }
        html+=">";
        for(var idx in this.children) {
            html+=this.children[idx].bufferedRender();
        }
        html+=this.innerHtml;
        html+='</'+this.tag+'>';
        return html;
    }
    /******/

}

    
/****O* Javascript-API/x6events
*
* NAME
*   x6events
*
* FUNCTION
*   The javascript object x6events implements the classic
*   event listener and dispatcher pattern.
*
*   Objects can subscribe to events by name.  Other 
*   objects can notify the events object when an event
*   fires, and it will in turn notify all of the subscribers.
*
* PORTABILITY
*   The u.events object and its methods expect other u
*   methods to be available, but do not have any other
*   dependencies.
*
******
*/
var x6events = {
    /****iv* events/subscribers
    *
    * NAME
    *   u.events.subscribers
    *
    * FUNCTION
    *   The javascript object x6events.subscribers is an object
    *   serving as an Associative Array.  Each entry in the array
    *   has a key that is the name of the event, and a value that
    *   is an array of object ids for the subscribers.  In JSON
    *   format the array might look like this:
    *
    *       u.events.subscribers = {  // example code only
    *           keyPress_Enter: { 
    *              gridEdit_regrules: 'gridEdit_regrules'
    *           }
    *           addRow_customers: {
    *              gridBrowse_customers: 'gridBrowse_customers'
    *           }
    *       }
    *
    *   This object is documented for completeness only, it is
    *   not intended for direct manipulation.
    * 
    ******
    */
    subscribers: { },

    /****m* x6events/subscribeToEvent
    *
    * NAME
    *   x6events.subscribeToEvent
    *
    * FUNCTION
    *   The Javascript method x6events.subscribeToEvent allows an
    *   object to subscribe to a named event.  That object will
    *   then be notified whenever the event fires.  See the
    *   method x6events.notify for more information on how
    *   the notification is handled.
    *
    * INPUTS
    *   * eventName - Any string.  There is no validation of the 
    *   eventName, so misspellings will result in your object 
    *   not being notified.
    *   * id - the Id of the object
    *   
    * NOTES
    *
    * RESULT
    *   No return value
    *
    * SEE ALSO
    *   x6events.fireEvent
    *
    * SOURCE
    */
    subscribeToEvent: function(eventName,id) {
        //console.group("subscribeToEvent "+eventName);
        //console.log("event name: ",eventName)
        //console.log("id subscbr: ",id);
        if(id=='undefined') {
            u.error('x6events.subscribeToEvent.  Second parameter '
                +' undefined.  First parameter: '+eventName
            );
            return;
        }
        if(id==null) {
            u.error('x6events.subscribeToEvent.  Second parameter '
                +' null.  First parameter: '+eventName
            );
            return;
        }
        
        // First determine if we have any listeners for this
        // event at all.  If not, make up the empty object
        if( u.p(this.subscribers,eventName,null)==null) {
            this.subscribers[eventName] = [ ];
        }
        if(this.subscribers[eventName].indexOf(id)==-1) {
            this.subscribers[eventName].push(id);
        }
        //console.groupEnd();
    },
    /******/
    
    unsubscribeToEvent: function(eventName,id) {
        var subs = u.p(this.subscribers,eventName);
        if( subs!=null) {
            var i = this.subscribers[eventName].indexOf(id);
            if(i >= 0) {
                this.subscribers[eventName].splice(i,1);
            }
        }
    },
        
    /****m* events/getSubscribers
    *
    * NAME
    *   x6events.getSubscribers
    *
    * FUNCTION
    *   The Javascript method x6events.getSubscribers returns
    *   an array of subscribers to a particular event.
    *
    * NOTES
    *   Use this method to discover which objects are
    *   subscribed to a particular event.
    *
    * RETURNS
    *   An array of zero or more object id's. 
    *
    * SOURCE
    */
    getSubscribers: function(eventName) {
        return u.p(this.subscribers,eventName,[]);
    },
    /******/

    /****m* x6events/fireEvent
    *
    * NAME
    *   x6events.fireEvent
    *
    * FUNCTION
    *   The Javascript method x6events.fireEvent will notify all
    *   objects that have subscribed to an event.  Each subscribing
    *   object must have a either:
    *   * a method named receiveEvents(eventName,args)
    *   * a method named receiveEvent_{EventName}(args)
    *
    *   If you want your application objects to notify other objects
    *   of its own events, call this function.
    *
    * INPUTS
    *   * eventName, the name of the event
    *   * mixed, a single argument.  If multiple arguments are required,
    *   pass an object that contains property:value assignments or 
    *   an array.  The only requirement for the argument is that the
    *   listeners know what to expect.
    *
    * RESULTS
    *   no return value.
    *
    ******
    */
    retvals: { },
    fireEvent: function(eventName,arguments) {
        //console.group("fireEvent "+eventName);
        //console.log('arguments: ',arguments);
        // Find out if anybody is listening for this event
        var subscribers = this.getSubscribers(eventName);
        
        // loop through subscribers.  Note at the bottom of the list
        // that if an event handler returns false we must stop.
        this.retvals[eventName] = true;
        for(var x in subscribers) {
            var id = subscribers[x];
            //console.log("subscriber: ",id);
            var subscriber = u.byId(id);
            if(subscriber==null) {
                u.error("There is no object with that ID, cannot dispatch");
                continue;
            }
            
            // First possibility is a generic nofity handler
            var retval = false;
            var method = 'receiveEvent_'+eventName;
            if(typeof(subscriber[method])=='function') {
                retval = subscriber[method](arguments);
            }
            else {
                u.error("Subscriber has no method: ",method); 
            }
            if(retval==false) {
                this.retvals[eventName] = false;
                break;
            }
        }
        //console.log("fireEvent ",eventName," RETURNING: ",this.retvals[eventName]);
        //console.groupEnd();
        return this.retvals[eventName];
    }
}
/* **************************************************************** *\

   X6 Data Dictionary and general functions that require knowledge
   of a data dictionary or work on dictionary-supplied data.
   
\* **************************************************************** */
var x6dd = {
    // Oddly enough, we figured out how to do without this
    // by putting extra attributes onto inputs.  Currently 
    // not being used.
    tables: { },
    
    // KFD 11/13/08.  Generic display routine
    display: function(typeid,value,nullDisplay) {
        if(nullDisplay==null) nullDisplay = '';
        if(value==null || value.toString().trim()=='') {
            return nullDisplay;
        }
        switch(typeid) {
        case 'int':
        case 'numb':
        case 'money':
            if(value=='null') return '';
            return Number(value);
            break;
        default:
            return value;
        }
    }
}

/* **************************************************************** *\

   X6 Object
   
\* **************************************************************** */
var x6 = {
    // Find all plugins in the x6plugins object.  Find all
    // DOM elements with property x6plugIn=xxx.  
    // Invoke the constructor for each one.
    init: function() {
        // Activate a global keyboard handler
        // SEE ALSO: input.keyDown(), it must also pass some
        //           events to keyDispatcher that don't go to
        //           the document.keypress from an input 
        $(document).keypress(function(e) {
                //console.group("Document Keypress");
                //console.log("keypress ",e);
                var retval= x6.keyDispatcher(e);
                //console.groupEnd(); 
                return retval;
        });
    },
    
    // Initialize an object that has been sent from the server
    initOne: function(id) {
        var obj = u.byId(id);
        var pin = u.p(obj,'x6plugin');
        obj.zTable = u.p(obj,'x6table');
        //console.log(pin,obj.zTable);
        //console.log(obj);
        x6plugins[pin](obj,obj.id,obj.zTable);
    },
    
    initFocus: function() {
        //var str   = '[x6firstFocus=Y]:not([disabled]):reallyvisible:first';
        var str   = 'input:not([disabled]):reallyvisible:first';        
        //var first = $('input:not([disabled])').isVisible().find(':first');
        var first = $(str);
        if(first.length>0) first.focus();
        else $('.x6main').focus();
    },
    
    // Keyboard handler
    keyDispatcher: function(e) {
        var retval = u.keyLabel(e);
        
        // Make list of keys to stop no matter what
        var stopThem = [ 'CtrlF5', 'F10' ];
        
        // Now we have a complete key label, fire the event
        //console.log("In x6.keyDispatch, code and event follow");
        //console.log(retval);
        //console.log(e);
        if(stopThem.indexOf(retval)>0) {
            //console.log("x6.keyDispatch: key is in force stop list, stopping propagation.");
            e.stopPropagation();
            return false;
        }
        else if (!x6events.fireEvent('key_'+retval,retval)) {
            //console.log("x6.keyDispatch: handler returned false, stopping propagation.");
            e.stopPropagation();
            return false;
        }
        else {
            //console.log("x6.keyDispatch: handler returned true, continuing propagation.");
            return true;
        }
    }    
}

/* **************************************************************** *\

   Universal x6 input keyup handler
   
\* **************************************************************** */
var x6inputs = {
    // Key up is used to look for changed values because
    // you do not see an input's new value until the keyup 
    // event.  You do not see it in keypress or keydown.
    keyUp: function(e,inp) {
        //console.group("Input keyUp");
        //console.log(e);
        //console.log(inp);
        
        x6inputs.setClass(inp);
        //console.groupEnd("Input keyUp");
    },
    
    // Keydown is used only for tab or shift tab, to enforce
    // the concept of a "tab loop".  This function only does
    // anything if there are no enabled controls after the
    // current control
    //
    keyDown: function(e,inp) {
        //console.group('Input keyDown ');
        //console.log(inp);
        var keyLabel=u.keyLabel(e);
        var isTab   =keyLabel=='Tab'    || keyLabel=='ShiftTab';
        var isEnter =keyLabel=='Enter'  || keyLabel=='ShiftEnter';  
        var isMeta  =u.keyIsMeta(e);
        var isNav   =isEnter || isTab;
        //console.log("label ",keyLabel,' isTab ',isTab,' isEnter ',isEnter,' isMeta ',isMeta,' isNav ',isNav);
        
        // All meta keys return true immediately except TAB and ENTER
        if(isMeta && !isNav) {
            //console.log(keyLabel);
            var handUpList = ['UpArrow','DownArrow','PageUp','PageDown'];
            if(handUpList.indexOf(keyLabel)>=0) {
                //console.log("Weird key that we pass up to doc-level keyPress");
                var retval= x6.keyDispatcher(e);
                //console.groupEnd(); 
                return retval;
            }
            else if(keyLabel=='CtrlLeftArrow') {
                this.firstInput(inp);
            }
            else if(keyLabel=='CtrlRightArrow') {
                this.lastInput(inp);
            }
            else if(keyLabel=='ShiftDownArrow') {
                if(u.p(inp,'x6select','N')=='Y') {
                    x6inputs.x6select.display(inp,'Down');
                }
            }
            else if(keyLabel=='ShiftUpArrow') {
                if(u.p(inp,'x6select','N')=='Y') {
                    x6inputs.x6select.display(inp,'Up');
                }
            }
            else if(keyLabel=='Home') {
                if(inp.selectionStart == 0 && inp.selectionEnd==0)
                    this.firstInput(inp);
            }
            else if(keyLabel=='End') {
                //console.log(inp);
                var ss = inp.selectionStart;
                var se = inp.selectionEnd;
                var ln = inp.value.toString().trim().length;
                //console.log(ss,se,ln);
                if(ss == se && se == ln) this.lastInput(inp);
            }
            else {
                //console.log("meta but not nav, ret true");
            }
            //console.groupEnd();
            return true;
        }
        
        // Type validation for some types, only if not TAB or ENTER
        if(!isNav) {
            console.log("Not nav key, doing type validation");
            type = u.p(inp,'xtypeid');
            switch(type) {
            case 'int':
                //console.log("type validation for int");
                if(!u.keyIsNumeric(e)) return false;
                break;
            case 'numb':
            case 'money':
                //console.log("type validation for numb/money");
                if(!u.keyIsNumeric(e) && u.keyLabel(e)!='.') return false;
                break;
            case 'date':
                //console.log("type validation for date");
                if(!u.keyIsNumeric(e)) {
                    if(keyLabel!='-' && keyLabel!='/') return false;
                }
                break;
            case 'gender':
                if(['M','F','U','H'].indexOf(keyLabel.toUpperCase())==-1) {
                    return false;
                }
                break;
            case 'cbool':
                if(['Y','N'].indexOf(keyLabel.toUpperCase())==-1) {
                    return false;
                }
                break;
            }
            
            // Next possibility is a lookup that requires a
            // fetch from the server.
            if(u.p(inp,'x6select','N')=='Y' && u.p(inp,'xValues',null)==null) {
                // Generate the value to send back
                var val = inp.value;
                var val = val.slice(0,inp.selectionStart)
                    +keyLabel
                    +val.slice(inp.selectionEnd);
                //console.log("current value: ",inp.value)
                //console.log("sel start: ",inp.selectionStart)
                //console.log("sel end: ",inp.selectionEnd)
                //console.log("computed value:",val);
                json = new androJSON('x6page',u.p(inp,'x6seltab'));
                json.addParm('x6select','Y');
                json.addParm('gpletters',val);
                json.execute(true);
                x6inputs.x6select.display(inp);
                x6inputs.x6select.displayDynamic(inp,ua.data.x6select);
            }
            
            //console.log("Type validation complete, returning true");
            //console.groupEnd();
            return true;
        }
        
        // If this input has an open x6select (SELECT replacement)
        // then ask it for the value.
        //
        // Do this *before* the afterBlurner command below, so that
        // the value is set when afterBlurner fires.
        if(u.p(inp,'x6select','N')=='Y') {
            x6inputs.x6select.assignToMe(inp);
        }
        
        // This took a lot of experimentation to get right.
        // Normally a BLUR would occur when an object loses focus
        //  -> except if the user hits ENTER, we must force processing
        //  -> except if processing enables new inputs
        //
        // So we unconditionally fire the afterblurner to hit
        // anything the control's special processing code might
        // do.  Then we proceed normally.
        //
        // Also: returning false does NOT prevent losing focus,
        // that's we don't check the return value.  We are not
        // *validating*, we are *processing*.
        x6inputs.afterBlurner(inp);
        
        
        // Get the first and last controls for easier
        // logic immediately below
        var tg       = u.p(inp,'xTabGroup','tgdefault');
        var jqString = '[xTabGroup='+tg+']:not([disabled])';
        var jqObj = $(jqString)
        var inpCount = jqObj.length;
        var first    = jqObj[0];
        var last     = jqObj[inpCount-1];
                
        // If we are on first or last, Enter/Tab dichotomy does not matter,
        // we just send focus where we want and return false to kill
        // original behavior.
        if(inp==first && e.shiftKey) {
            $('[xTabGroup='+tg+']:not([disabled]):last').focus();
            //console.log("First input, hit shift, going to last");
            //console.groupEnd();
            return false;
        }
        if(inp==last && !e.shiftKey) {
            //if(u.p(inp,'inGrid',false)) {
            //    x6events.fireEvent('key_DownArrow');
            //    return;
            //}
            
            $('[xTabGroup='+tg+']:not([disabled]):first').focus();
            //console.log("Last input, no shift, going to first");
            //console.groupEnd();
            return false;
        }
        
        // If they hit the TAB key, we can quit now and return
        // true to allow default behavior.  If they hit ENTER 
        // we have to work out the next control to give focus
        // to, either forward or backward
        if(isTab) {
            //console.log("Tab key hit, returning true");
            //console.groupEnd();
            return true;
        }
        if(!e.shiftKey) {
            // no shift means look for next one
            var focusTo = false;
            var foundMe = false;
            $('[xTabGroup='+tg+']:not([disabled])').each(
                function() {
                    //console.log(this.id);
                    //console.log(focusTo,foundMe);
                    if(focusTo) return;
                    if(foundMe) {
                        focusTo = this.id;
                    }
                    if(this == inp) foundMe = true;
                }
            );
            if(focusTo) {
                //console.log("Setting focus forward to ",focusTo);
                $('#'+focusTo).focus().select();
            }
            
        }
        else {
            // shift means look for previous one.  Go forward 
            // through inputs, assuming each one is the one that
            // will get focus.  Once we find the input we are
            // on stop doing that, and the last one assigned will
            // be the one that gets focus.
            var focusTo = false;
            var foundMe = false;
            $('[xTabGroup='+tg+']:not([disabled])').each(
                function() {
                    if(foundMe) return;
                    if(this == inp) 
                        foundMe = true;
                    else
                        focusTo = this.id;
                }
            );
            if(focusTo) {
                //console.log("Setting focus backward to ",focusTo);
                $('#'+focusTo).focus().select();
            }
        }
        //console.log("Returning True");
        //console.groupEnd();
        return true;
    },
    
    focus: function(inp) {
        //console.group("Input focus ",inp.id);
        //console.log("Input: ",inp);
        inp.zSelected = 1;
        inp.zOriginalValue = u.p(inp,'zOriginalValue','').trim();
        inp.lastBlurred    = '';
        x6inputs.setClass(inp);
        //console.log("Input focus DONE");
        //console.groupEnd();
        return true;
    },
    // KFD 11/29/08, not being called anywhere?
    //xFocus: function(anyObject) {
    //    $(this).addCla*ss('selected');
    //},
    
    blur: function(inp) {
        //console.group("Input blur ",inp.id);
        inp.zSelected = 0;
        x6inputs.setClass(inp);
        x6inputs.afterBlurner(inp);
        x6inputs.x6select.hide();
        //console.log("Input Blur DONE");
        //console.groupEnd();
        return true;
    },
    // KFD 11/29/08, not being called anywhere?
    //xBlur: function(anyObject) {
    //},
    /*
    *  We need to route through a wrapper to afterBlur 
    *  mostly to keep it from firing multiple times.
    *  Example: a blur calling alert() causes blur to fire again
    *  
    */
    afterBlurner: function(inp) {
        //console.group("afterBlurner");
        //console.log(inp);
        if(u.p(inp,'inblur',false)) {
            //console.log("inblur flag set, no action");
            //console.groupEnd();
            return false;
        }
        inp.inblur = true;
        // If method does not exist forget it
        if(!inp.afterBlur) {
            //console.log("No afterBlur(), leaving flag set and returning");
            //console.groupEnd();
            return true;
        }
        // If value has changed, fire it
        if(inp.lastBlurred==u.p(inp,'value','').trim()) {
            //console.log("Input lastBlurred is current value, no action");
            //console.groupEnd();
            inp.inblur = false;
            return true;
        }
        else {
            // Note that returning true only means the afterBlur() will
            // not be fired again for this value.  It does not mean there
            // is anything particularly "valid" or correct about the
            // value.
            if(inp.afterBlur()) {
                //console.log("Afterblurner setting flag false, return true");
                //console.groupEnd();
                inp.inblur = false;
                inp.lastBlurred = u.p(inp,'value','').trim();
                return true;
            }
            else {
                //console.log("Afterblurner setting flag false, return false");
                //console.groupEnd();
                inp.inblur = false;
                return false;
            }
        }
    },
    
    enable: function(inp) {
        if(typeof(inp)=='string') inp = u.byId(inp);
        //console.log("Enabling input ",inp.id);
        inp.disabled = false;
        inp.zOriginalValue = u.p(inp,'value','');
        this.setClass(inp);
    },
    disable: function(inp) {
        if(typeof(inp)=='string') inp = u.byId(inp);
        //console.log("Disabling input ",inp.id);
        inp.disabled = true;
        this.setClass(inp);
    },
    
    setClass: function(inp) {
        // Easiest is disabled controls, remove all classes
        if(u.p(inp,'disabled',false)) {
            inp.className='';
            doRow = u.p(inp,'xClassRow',0);
            if(doRow!=0) {
                inp.parentNode.parentNode.className = '';
            }
            return;
        }
        
        ux = u.uniqueId();
        //console.group("setClass for an input  "+ux);
        //console.log(inp);
        if(u.p(inp,'zOriginalValue',null)==null) inp.zOriginalValue = '';
        if(inp.value==inp.zOriginalValue) {
            inp.zChanged = 0;
        }
        else {
            inp.zChanged = 1;
        }
        
        // First grab the flags that determine
        // what we will do
        var zSelected = u.p(inp,'zSelected',0);
        var zChanged  = u.p(inp,'zChanged', 0);
        var zError    = u.p(inp,'zError'  , 0);
        //var zRO       = u.p(inp,'zRO'     , 0);
        var zNew      = u.p(inp,'zNew'    , 0);
        
        // now pick them in order of preference,
        // we only pick one stem.
        //if     (zRO)      css = 'readOnly';
             if(zError)   css = 'error';
        else if(zNew)     css = 'changed';
        else if(zChanged) css = 'changed';
        else              css = '';
        //console.log("initial class is "+css);
        
        // Now pick the selected version if required
        if(zSelected) css += 'Selected';
        //console.log("Final class is "+css);
        
        // Now do some stuff if it is read only
        //inp.disabled = zRO;
        //console.log("Read Only Decision is",inp.disabled);
        
        // Flag to do the row
        doRow = u.p(inp,'xClassRow',0);
            
        // Now set the class name
        inp.className = css;
        if(doRow!=0) {
            //console.log('do row');
            if(zSelected) {
                inp.parentNode.parentNode.className = 'selected';
            }
            else {
                inp.parentNode.parentNode.className = '';
            }
        }
        //console.groupEnd();
    },
    
    clearOut: function(inp) {
        if(inp.zSelected==1) {
            //console.log("In clear out, blurring ",inp);
            inp.blur();
        }
        inp.disabled       = true;
        inp.zNew           = 0;
        inp.zSelected      = 0;
        inp.value          = '';
        inp.zOriginalValue = '';
        x6inputs.setClass(inp);
    },
    
    findFocus: function(obj) {
        if(typeof(obj)=='string') {
            $(obj+" :input:first:not([disabled])").focus();
        }
        else {
            $(obj).find(":input:first:not([disabled])").focus();
        }
    },
    
    firstInput: function(inp) {
        var xtg = u.p(inp,'xTabGroup','tgdefault');
        $(":input[xtabgroup="+xtg+"]:not([disabled]):first").focus();
    },
    lastInput: function(inp) {
        var xtg = u.p(inp,'xTabGroup','tgdefault');
        $(":input[xtabgroup="+xtg+"]:not([disabled]):last").focus();
    },
    
    jqFocusString: function() {
        return ":input:not([disabled]):first";
    },
    
    obj: function(table,column) {
        if(table ==null) table='';
        if(column==null) column='';
        var selector = ':input'
        if(table!='') {
            selector += '[xtableid='+table+']';
        }
        if(column!='') {
            selector += '[xcolumnid='+column+']';
        }
        var jq = $(selector);
        if(jq.length>0) {
            return jq[0];
        }
        else {
            return false;
        }
    },
    
    ddClick: function(button) {
        var id = u.p(button,'xInputId');
        var inp = $('[zActive]#'+id)[0];
        this.x6select.display(inp);
    },
    
    x6select: {
        dynRowCount: 15,
        div: false,
        
        hide: function() {
            $(".x6select").remove();
            this.tbody=false;
            this.div = false;
        },
        
        assignToMe: function(inp) {
            if(this.div) {
                var row = $('.x6select tr.hilight');
                if(row.length > 0) {
                    inp.value = row[0].firstChild.innerHTML;
                }
            }
        },
        
        display: function(input,fromKeyboard) {
            if(fromKeyboard!=null) {
                if(this.div && this.div.style.display=='block') {
                    return this.moveUpOrDown(fromKeyboard);
                }
            }
            
            if(!this.div) {
                this.div = document.createElement('DIV');
                this.div.style.display    = 'none';
                this.div.style.position   = 'absolute';
                this.div.style.backgroundColor = 'white';
                this.div.style.overflow   = 'hidden';
                this.div.style.border     ="1px solid black";
                var lineHeight            = $(input).height();
                this.lineHeight           = lineHeight;
                this.div.style.lineHeight = lineHeight+"px";
                this.div.style.cursor     = 'pointer';
                this.div.style.zIndex     = 1000;
                this.div.className        = 'x6select';

                // Work out minimum width as the input plus the button
                var jqButton = $('[xInputId='+input.id+']');
                if(jqButton.length==0) {
                    var minwidth = 10;
                }
                else {
                    var minwidth 
                        = ($(jqButton).offset().left - $(input).offset().left)
                        + $(jqButton).width();
                }
                this.div.style.minWidth = minwidth + "px";
                
                // Put in the titles.  This is also where we
                // work out the height of the drop-down
                this.div.innerHTML = this.displayTitles(input);
                
                // Put in the div, and do the mouse events
                document.body.appendChild(this.div);

                // This is for optimization, allows us to avoid
                // repeatedly making jquery calls for this object
                this.tbody = $('.x6select tbody')[0];
                
                // special routine to populate with fixed
                // values on a pre-populated attribute.  If none
                // are there it does nothing.
                this.displayFixed(input);
                
            }
            // If it is invisible, position it and then make it visible
            if(this.div.style.display=='none') {
                var position = $(input).offset();
                var postop = position.top -1;
                var poslft = position.left;
                this.div.style.top  = (postop + input.offsetHeight +1) + "px";
                this.div.style.left = poslft + "px";
                this.div.style.display = 'block';
                this.mouseEvents(input);
            }
            
            if(fromKeyboard != null) {
                this.moveUpOrDown(fromKeyboard);
            }
        },
        
        displayTitles: function(input) {
            // If still here, we have values and descriptions
            var retval = '<table><thead><tr>';
            var descs  = u.p(input,'xTitles').split('|');
            for(var idx in descs) {
                retval+='<th>'+descs[idx]+'</th>';
            }
            retval+='<th>&nbsp;&nbsp;&nbsp;&nbsp;';

            // Now work out the height.  If static, go by
            // the number of rows, otherwise set it to 16, which
            // is 15 for data and one for titles.
            if(u.p(input,'x6rowCount',null)!=null) {
                var rowCount = Number(u.p(input,'x6rowCount'));
            }
            else {
                var rowCount = this.dynRowCount;
            }
            this.div.style.height = ((this.lineHeight+3)*(rowCount+1))+"px";
            // ...and the height of the body
            var h = (this.lineHeight + 3)*rowCount;
            
            // Now put out an empty body
            retval+='</thead>'
                +'<tbody style="height: '+h+'px; max-height: '+h+'px; '
                +' overflow-y:scroll">'
                +'</tbody></table>';
            return retval;
        },
        
        displayFixed: function(input) {
            var svals = u.p(input,'xValues','');
            if(svals.trim()=='') return;

            console.log(svals);
            retval = '';
            var rows   = svals.split('||');
            for(var idx in rows) {
                retval += '<tr>';
                var values = rows[idx].split('|');
                for(var idx2 in values) {
                    retval+= '<td>'+values[idx2];
                }
            }
            console.log(retval);
            this.tbody.innerHTML = retval;
        },
        
        displayDynamic: function(input,rows) {
            retval = ''
            if(rows.length==0) {
                this.tbody.innerHTML = '';
                return;
            }
            for(var idx in rows) {
                retval += '<tr>';
                var values = rows[idx];
                for(var idx2 in values) {
                    retval+= '<td>'+values[idx2];
                }
            }
            var lh = this.lineHeight + 3;
            if(rows.length < this.dynRowCount) {
                this.div.style.height = lh*(rows.length+1) + "px";
                this.tbody.style.height = lh*rows.length  + "px";
            }
            else {
                this.div.style.height = lh*(this.dynRowCount+1) + "px";
                this.tbody.style.height = lh*this.dynRowCount + "px";
            }
            this.tbody.innerHTML = retval;
            this.mouseEvents(input);
        },
        
        mouseEvents: function(input) {
            $('.x6select td')
            .each(
                function() {
                    this.input = input;
                }
            )
            .mouseover(
                function() {
                    var rowNow = $('.x6select tr.hilight');
                    if(rowNow.length > 0) {
                        if(rowNow[0] == this.parentNode) return;
                    }
                    $('.x6select tr.hilight').removeClass('hilight');
                    $(this.parentNode).addClass('hilight');
                }
            )
            .mousedown(
                function(e) {
                    this.input.value = this.parentNode.firstChild.innerHTML;
                    x6inputs.x6select.hide();
                    setTimeout(function() {$(this.input).focus();},100);
                    e.stopPropagation();
                    return false;
                }
            );
        },
        
        moveUpOrDown: function(direction) {
            // get current row
            var rowNow = $('.x6select tr.hilight:visible');
            var jqBody = $('.x6select tbody');
            if(rowNow.length==0) {
                $(jqBody[0].firstChild).addClass('hilight');
            }
            else {
                if(direction == 'Up') {
                    var candidate = $(rowNow).prev();
                    console.log("Up candidate ",candidate);
                    var rowsBelow = $(rowNow).nextAll().length;
                    if(rowsBelow > 5) {
                        var stNow = $('.x6select tbody').scrollTop();
                        $(jqBody).scrollTop(stNow - ( this.lineHeight + 3));                        
                    }
                }
                else {
                    var candidate = $(rowNow).next();
                    console.log("Down candidate ",candidate);
                    var rowsAbove = $(rowNow).prevAll().length;
                    if(rowsAbove > 5) {
                        var stNow = $('.x6select tbody').scrollTop();
                        $(jqBody).scrollTop(stNow + this.lineHeight + 3);                        
                    }
                }
                console.log("row now ",rowNow);
                console.log(direction);
                if (candidate.length > 0) $(candidate[0].firstChild).mouseover();
            }
        }
    }
}



/* **************************************************************** *\

   X6 Builtin plugins
   
\* **************************************************************** */

/****O* Javascript-API/x6plugins
*
* NAME
*   x6plugins
*
* FUNCTION
*   The javascript object x6plugins is a collection of functions.
*   Each function is a 'constructor'.
*  
*
******
*/
var x6plugins = {
    buttonNew: function(self,id,table) {
        x6plugins.buttonStandard(self,'new','CtrlN');
        self.main = function() {
            x6events.fireEvent('reqNewRow_'+this.zTable);   
        }
    },
    buttonInsert: function(self,id,table) {
        x6plugins.buttonStandard(self,'ins','CtrlI');
        self.main = function() {
            x6events.fireEvent('reqNewRow_'+this.zTable,true);   
        }
    },
    buttonDelete: function(self,id,table) {
        x6plugins.buttonStandard(self,'delete','CtrlD');
        self.main = function() {
            x6events.fireEvent('reqDelRow_'+this.zTable);
        }
    },
    buttonCancel: function(self,id,table) {
        x6plugins.buttonStandard(self,'cancel','Esc');
        self.main = function() {
            if(confirm("Abandon all changes?")) {
                x6events.fireEvent('reqUndoRow_'+this.zTable);
            }
        }
    },
    buttonSave: function(self,id,table) {
        x6plugins.buttonStandard(self,'save','CtrlS');
        self.main = function() {
            x6events.fireEvent('reqSaveRow_'+this.zTable);
        }
    },
    /****m* x6plugins/buttonStandard
    *
    * NAME
    *   x6plugins.buttonStandard
    *
    * FUNCTION
    *   The Javascript method buttonStandard gives a button 
    *   object the standard behavior of responding to 
    *   a single keystroke and responding to enable/disable
    *   commands.
    * 
    *   Use this function when you create a custom button to
    *   put onto the screen.
    *
    *   A custom button requires a uniquely named 'action' and
    *   a hotkey.  Actions reserved by andromeda are:
    *   *  duplicate
    *   *  new
    *   *  remove
    *   *  save
    *
    * EXAMPLE
    *   A custom button is created in PHP code like so:
    *
    *    <?php
    *    # option 1, straight html
    *    <input type='button' x6plugIn='buttonMine' x6table='example'>
    *
    *    # option 2, or a link
    *    $div = html('div');
    *    $a = $div->h('a-void','My Action');
    *    $a->hp['x6plugIn'] = 'buttonMine';
    *    $a->hp['x6table'] = 'example';  // only if relevant
    *    ?>
    *
    *   Then you define a javascript x6plugIn that includes a 
    *   single function, main(), which is called when the button
    *   is enabled and is clicked or the hotkey is pressed.
    *
    *     <script>
    *     x6plugins.buttonMine = function(self,id,table) {
    *         // the first line activates normal behavior, 
    *         // replace the values in this line with those
    *         // appropriate to your button.
    *         x6plugins.buttonStandard(self,'save','CtrlS');
    *
    *         // Then create the main function 
    *         self.main = function() {
    *            // fire off some event
    *         }
    *     }
    *     </script>    
    *
    ******/
    buttonStandard: function(self,action,key) {
        // Assume everything starts out enabled
        self.zDisabled = false;
        self.zTable    = u.p(self,'x6table');
        self.zAction   = action;
        self.zKey      = key;
        
        // Respond to an enable event
        x6events.subscribeToEvent('enable_'+action+'_'+self.zTable,self.id);
        self['receiveEvent_enable_'+action+'_'+self.zTable] = function() {
            this.className = 'button';
            this.zDisabled = false;
        }

        // Respond to an disable event
        x6events.subscribeToEvent('disable_'+action+'_'+self.zTable,self.id);
        self['receiveEvent_disable_'+action+'_'+self.zTable] = function() {
            this.className = 'button_disabled';
            this.zDisabled = true;
        }
        
        // Create an empty main routine to be replaced
        // button by button.  Put out a useful error message
        // when they have not 
        self.main = function() {
            u.error("Button "+this.id+", handling action "+this.zAction
                +" and keypress "+this.zKey+" has no main() function."
            );
        }
        // Respond to a keypress event
        x6events.subscribeToEvent('key_'+key,self.id);
        self['receiveEvent_key_'+key] = function() {
            if(!this.zDisabled) this.main();
            // if a key event is received, we *always* stop 
            // propagation
            x6events.retvals['key_'+this.zKey] = false;
        }
        
        // finally of course set the onclick method
        $(self).click(function() { 
            if(!this.zDisabled) this.main(); 
        });
        
        // Make cute mouse effects on buttons
        self.onmousedown = function() {
            if(!this.zDisabled) {
                $(this).addClass('button_mousedown');
            }
        }
        self.onmouseup = self.onmouseout = function() {
            if(!this.zDisabled) {
                $(this).removeClass('button_mousedown');
            }
        }
    }
}
 

/****m* x6plugins/tableController
*
* NAME
*   x6plugins.tableController
*
* FUNCTION
*   The Javascript method x6plugins.tableController is
*   a constructor function.  It accepts as a parameter the
*   ID of a DOM element.  It adds functions to that DOM 
*   element so that it will fully implement all browser-side
*   features of our tableController object.
*
*   A tableController subscribes to all events in which a
*   user requests to do something like add a row or delete
*   a row.  The tableController executes whatever server-side
*   requests are required, and then fires various events to
*   notify other UI elements that they should display the
*   results.
* 
*   Normally you do not invoke this method directly.  All 
*   x6 plugins are detected and implmented automatically on
*   page load.

*   To turn any DOM element into a table controller, just set
*   the properties x6plugIn and x6table, as in either
*   of these:
*
*      <?php
*      # here is one way to do it:
*      echo "<div x6plugIn='tableController' x6table='users'>";
*
*      # another way to do it:
*      $div = html('div');
*      $div->hp['x6plugIn'] = 'tableController';
*      $div->hp['x6table'] = 'users';
*      $div->render();
*      ?>
*
*   You should not have more than one table controller per 
*   table on a page -- Andromeda will not trap for this!
*
* INPUTS
*   id - the ID of the object to be 'activated'.
*
* RESULTS
*   no return value.
*
******
*/
x6plugins.tableController = function(self,id,table) {
    // Initialize new properties
    u.bb.vgfSet('skey_'+table,-1);
    self.zTable   = table;
    self.zSortCol = false;
    self.zSortAsc = false;
    self.zCache   = u.p(self,'xCache')=='Y' ? true : false;
    
    if(u.p(self,'xPermIns','*')=='*') {
        alert("Program Error!  Table Controller was not assigned permissions!"
            +"\n\nPlease assign xPermIns,xPermUpd,xPermDel,xPermSel"
        );
    }
    
    /*
    *   Table controller accepts the request to
    *   save current changes.  First checks if this
    *   makes sense.
    *   
    */
    x6events.subscribeToEvent('reqSaveRow_'+table,id);
    self['receiveEvent_reqSaveRow_'+table] = function(dupe) {
        //console.group("tableController reqSaveRow "+this.zTable);
        
        var result = this.saveOk();
        u.bb.vgfSet('lastSave_'+this.zTable,result);
        //console.log('tableController reqSaveRow finished');
        //console.groupEnd();
    }
    
    
    /*
    *   Table controller accepts the request to
    *   begin editing a new row.  It must first 
    *   work out if any open rows being edited must
    *   be saved.  If everything works out it 
    *   broadcasts a UI notification that UI elements
    *   should display their inputs in NEW mode.
    *   
    */
    x6events.subscribeToEvent('reqNewRow_'    +table,id);
    self['receiveEvent_reqNewRow_'+table] = function(tabDivBefore) {
        //console.group("tableController reqNewRow "+this.zTable);
        
        var result = this.saveOk();
        u.bb.vgfSet('lastSave_'+this.zTable,result);
        if(result!='fail') {
            x6events.fireEvent('uiNewRow_'+table,tabDivBefore);
        }
        //console.groupEnd();
    }

    /*
    *   Table controller accepts a request to edit a 
    *   row.  It is smart enough that if we are already
    *   editing that row it does nothing.  Otherwise
    *   it tries to save any existing row before 
    *   deciding whether to move on.
    *   
    */
    x6events.subscribeToEvent('reqEditRow_'+table,id);
    self['receiveEvent_reqEditRow_'+table] = function(skey) {
        //console.group("tableController reqEditRow "+this.zTable);
        var skeynow = u.bb.vgfGet('skey_'+this.zTable);
        if(skeynow == skey) {
            //console.log("Request to edit same row, no action");
        } 
        else {
            var result = this.saveOk();
            u.bb.vgfSet('lastSave_'+this.zTable,result);
            if(result!='fail') {
                x6events.fireEvent('uiEditRow_'+table,skey);
            }
        }
        //console.log("tableController reqEditRow finished");
        //console.groupEnd();
        return true;
    }
    
    /*
    *   The saveOk figures out if it needs to save and
    *   tries to do so.  If no active fields have changed,
    *   it just returns 'noaction'.  If it needs to save,
    *   it attempts to do so and returns 'success' or
    *   'fail'.
    */
    self.saveOk = function() {
        //console.group("tableController saveOK");
        var inpAll = { };
        var inpChg = { };
        var cntChg = 0;
        var jq = ':input[xtableid='+this.zTable+'][zActive]';
        //console.log("Query string",jq);
        $(jq).each(
        //$(this).find(jq).each(
            function() {
                var col = u.p(this,'xcolumnid');
                inpAll[col] = this.value;
                var oval = u.p(this,'zOriginalValue','').trim();
                if(this.value.trim()!= oval) {
                    inpChg[col] = this.value.trim();
                    cntChg++;
                }
            }
        );
        //console.log("All inputs: ",inpAll);
        //console.log("Changed inputs: ",inpChg);
        //console.log("Count of changes: ",cntChg);
        
        // Only attempt a save if something changed
        if(cntChg == 0) {
            //console.log("no changes, not trying to save");
            var retval = 'noaction';
        }
        else {
            
            //console.log("attempting database save");
            //console.log("Sending x4v_skey ",this.zSkey);
            ua.json.init('x6page',this.zTable);
            ua.json.addParm('x6action','save');
            ua.json.addParm('x6v_skey',u.bb.vgfGet('skey_'+this.zTable));
            ua.json.inputs(jq);
            // Look for an "skey after" to send back 
            var queuepos  = u.bb.vgfGet('queuepos_'+this.zTable,false);
            if(queuepos) {
                var skeyAfter = u.bb.vgfGet('skeyAfter_' +this.zTable,-1);
                var skeyBefore= u.bb.vgfGet('skeyBefore_'+this.zTable,-1);
                ua.json.addParm('queuepos'  ,queuepos);
                ua.json.addParm('skeyAfter' ,skeyAfter);
                ua.json.addParm('skeyBefore',skeyBefore);
            }
            if(ua.json.execute()) {
                var retval = 'success';
                ua.json.process();
            }
            else {
                var retval = 'fail';
                var errors = [ ];
                for(var idx in ua.json.jdata.error) {
                    if(ua.json.jdata.error[idx].slice(0,8)!='(ADMIN):') {
                        errors.push(ua.json.jdata.error[idx]);
                    }
                }
                //console.log("save failed, here are errors");
                //console.log(errors);
                x6events.fireEvent('uiShowErrors_'+this.zTable,errors);
            }
        }
        u.bb.vgfSet('lastSave_'+this.zTable,retval);
        
        // If save went ok, notify any ui elements, then 
        // fire off a cache save also if required.
        if(retval=='success') {
            //console.log(retval);
            x6events.fireEvent('uiRowSaved_'+table,$a.data.row);
            if(this.zCache) {
                this.zRows[$a.data.row.skey] = $a.data.row;
            }
        }            
        
        //console.log("tableController saveOK RETURNING: ",retval);
        //console.groupEnd();
        return retval;
    };


    /*
    *   The table controller accepts requests to undo
    *   changes to a row.  It actually rolls back all
    *   inputs and sets their classes, and then
    *   fires of a uiUndoRow event so various other
    *   elements can do their own thing.
    */
    x6events.subscribeToEvent('reqUndoRow_'+table,id);
    self['receiveEvent_reqUndoRow_'+table] = function() {
        //console.group("tableController reqUndoRow");
        var skey = u.bb.vgfGet('skey_'+table);
        if(skey>=0) {
            //console.log("Skey is >= 0, continuing ",skey);
            $(this).find(":input:not([disabled])[zActive]").each( 
                function() {
                    this.value = this.zOriginalValue;
                    this.zError = 0;
                    x6inputs.setClass(this);
                }
            );
            x6events.fireEvent('uiUndoRow_'+this.zTable,skey);
        }
        //console.log("tableController reqUndoRow Finished");
        //console.groupEnd();
        return true;
    }
    

    /*
    *   The table controller accepts delete request
    *   and asks the database to do the delete.  If
    *   this is successful, it tells any UI subscribers
    *   to update their displays accordingly.
    */
    x6events.subscribeToEvent('reqDelRow_'    +table,id);
    self['receiveEvent_reqDelRow_'+table] = function() {
        //console.group("tableController reqDelRow ",this.zTable);
        var skey = u.bb.vgfGet('skey_'+this.zTable);
        if(this.zSkey<1) {
            //console.log("nothing being edited, quietly ignoring");
        }
        else {
            if(confirm("Delete current row?")) {
                //console.log("sending delete to server");
                ua.json.init('x6page',this.zTable);
                ua.json.addParm('x6action','delete');
                ua.json.addParm('skey',skey);
                ua.json.addParm('json',1);
                if(ua.json.execute()) {
                    x6events.fireEvent('uiDelRow_'+table,skey);
                }
            }
        }
        //console.log("tableController reqDelRow finished");
        //console.groupEnd();
        return true;
    }
    
    // Sort requests are sorted out here.        
    x6events.subscribeToEvent('reqSort_'+table,id);
    self['receiveEvent_reqSort_'+table] = function(args) {
        // Work out sort order
        table = this.zTable
        xColumn = args.xColumn;
        xChGroup= args.xChGroup;
        if(xColumn == this.zSortCol) {
            this.zSortAsc = ! this.zSortAsc;
        }
        else {
            this.zSortCol = xColumn;
            this.zSortAsc = true;
        }
        
        // Flip all icons to both
        //$('[xChGroup='+xChGroup+']').html('&hArr;');
        
        // Flip just this icon to up or down
        var icon = this.zSortAsc ? '&dArr;' : '&uArr;';
        //$('[xChGroup='+xChGroup+'][xColumn='+xColumn+']').html(icon);
        
        // Make the request to the server
        var args2 = { sortCol: this.zSortCol, sortAsc: this.zSortAsc };
        x6events.fireEvent('uiSort_'+this.zTable,args2);
    }
    

    /*
    *   Table controller will be happy to cache
    *   rows for a table if they are offered. It
    *   will also be happy to add a row to that
    *   cache if offered.  There ought also to be
    *   something here to remove a row, but that
    *   seems to be missing?
    *
    *   Note: shouldn't that be cacheAddRow ?
    *   Note: and then wouldn't we want cacheDelRow?
    */
    self.zRows = { };
    x6events.subscribeToEvent('cacheRows_'+table,id);
    self['receiveEvent_cacheRows_'+table] = function(rows) {
        this.zRows = rows;
    }
    x6events.subscribeToEvent('addRow_'+table,id);
    self['receiveEvent_addRow_'+table] = function(row) {
        this.zRows[row.skey] = row;
    }
    
    /*
    *    A request to put the current row onto
    *    the bulletin board.
    */
    x6events.subscribeToEvent('dbFetchRow_'+table,id);
    self['receiveEvent_dbFetchRow_'+table] = function(skey) {
        
        if(typeof(this.zRows[skey])=='undefined') {
            //console.log("tableController bbRow, no row found, fetching");
            ua.json.init('x6page',this.zTable);
            ua.json.addParm('x6action','fetchRow');
            ua.json.addParm('x6w_skey',skey);
            if(ua.json.execute(true)) {
                u.bb.vgfSet('dbRow_'+this.zTable,a.data.row);
            }
        }
        else {
            //console.log("tableController bbRow, publishing row "+skey);
            //console.log("putting onto bb as dbRow_"+this.zTable);
            u.bb.vgfSet('dbRow_'+this.zTable,this.zRows[skey]);
        }
    }
    
    /*
    *   Two requests, one to turn on editing-mode buttons,
    *   another to turn them off.
    */
    x6events.subscribeToEvent('buttonsOn_'+table,id);
    self['receiveEvent_buttonsOn_'+table] = function() {
        x6events.fireEvent('enable_save_'   +this.zTable);
        x6events.fireEvent('enable_cancel_' +this.zTable);
        x6events.fireEvent('enable_delete_' +this.zTable);
    }
    x6events.subscribeToEvent('buttonsOff_'+table,id);
    self['receiveEvent_buttonsOff_'+table] = function() {
        x6events.fireEvent('disable_save_'   +this.zTable);
        x6events.fireEvent('disable_cancel_' +this.zTable);
        x6events.fireEvent('disable_delete_' +this.zTable);
    }
}
    
    
/****m* x6plugins/detailDisplay
*
* NAME
*   x6plugins.detailDisplay
*
* FUNCTION
*   The Javascript method x6plugins.detailDisplay implements
*   all browser-side functionality for Andromeda's built-in
*   plugIn detailDisplay.
*
*   A 'detailDisplay' plugIn displays user inputs to edit
*   the values for a particular row in a table.  
*
*   This plugin subscribes to the following events:
*   *  goMode_{table}
*
* INPUTS
*   self - the DOM object to be activated.
*   id - the ID of the object to be 'activated'.
*   table - the database table that the detailPane is handling.
*
* RESULTS
*   no return value.
*
******
*/
x6plugins.detailDisplay = function(self,id,table) {
    self.zTable = table;
    
    // If we are supposed to start out disabled, do it
    if(u.p(self,'xInitDisabled','N')=='Y') {
        $(self).find(":input").each(
            function() {
                x6inputs.disable(this);
            }
        );
    }
    
    // detail receives a request to go to a mode which
    // is unconditional, it will do what it is told
    x6events.subscribeToEvent('uiEditRow_'+table,id);
    self['receiveEvent_uiEditRow_'+table] = function(skey) {
        //console.group("detailDisplay uiEditRow",skey);
        
        // Ask somebody to publish the row
        x6events.fireEvent('dbFetchRow_'+table,skey);
        var row = u.bb.vgfGet('dbRow_'+table);
        
        // Branch out to display in edit mode
        this.displayRow('edit',row);
        //console.log("detailDisplay uiEditRow FINISHED");
        //console.groupEnd();
    }
        
    // Detail receives an addRow event and interprets it
    // as a goMode.  The parameter is intended only for
    // grids, a detail display ignores it.
    x6events.subscribeToEvent('uiNewRow_'+table,id);
    self['receiveEvent_uiNewRow_'+table] = function(tabDivBefore) {
        //console.group("detailDisplay uiNewRow");
        this.displayRow('new',{});
        //console.log("detailDisplay uiNewRow FINISHED");
        //console.groupEnd();
    }

    /*
    *    A uiRowSaved says there are new values.  This
    *    will be caught and interpreted as a uiEditRow
    */
    x6events.subscribeToEvent('uiRowSaved_'+table,id);
    self['receiveEvent_uiRowSaved_'+table] = function(row) {
        //console.group("detailDisplay uiRowSaved");
        //console.log("parms: ",row);
        this.displayRow('edit',row);
        //console.log("detailDisplay uiRowSaved FINISHED");
        //console.groupEnd();
    }
    
    /*
    *   A detail always subscribes to uiUndoRow, and disables
    *   and clears all controls.  
    *
    */
    x6events.subscribeToEvent('uiUndoRow_'+table,id);
    self['receiveEvent_uiUndoRow_'+table] = function(skey) {
        $(this).find(":input").each(
            function() {
                x6inputs.clearOut(this);
            }
        );
        u.bb.vgfSet('skey_'+this.zTable,-1);
    }
    
        
    /*
    *    A uiDelRow clears all inputs
    */
    x6events.subscribeToEvent('uiDelRow_'+table,id);
    self['receiveEvent_uiDelRow_'+table] = function(skey) {
        //console.group("detailDisplay uiDelRow",skey);
        $(this).find(':input').each(function() {
                x6inputs.clearOut(this);
        });
        x6events.fireEvent('buttonsOff_'+this.zTable);
        //console.log("detailDisplay uiDelRow FINISHED");
        //console.groupEnd();
    }

    self.displayRow = function(mode,row) { 
        //console.group("detailDisplay displayRow ",mode);
        //console.log(row);
        if(mode!='new' && mode!='edit') {
            u.error("Object "+this.id+" has received a 'goMode' event "
                +"for unhandled mode "+mode+".  Cannot process this "
                +"request."
            );
        }

        // Set values and remember skey value
        x6events.fireEvent('buttonsOn_'+this.zTable);
        if(mode=='new')  {
            //console.log("detail display going into new mode");
            // For new rows, set defaults, otherwise blank
            // out.
            $(this).find(':input').each(function() {
                this.value=u.p(this,'xdefault','');
                this.zOriginalValue = this.value;
                this.zChanged = 0;
                this.zActive  = 1;
            });
            //if(typeof(row.skey)!='undefined') {
            //    u.debug("detail display populating inputs");
            //    this.populateInputs(row);
            //}
            u.bb.vgfSet('skey_'+this.zTable,0);
        }
        else {
            this.populateInputs(row);
            u.bb.vgfSet('skey_'+this.zTable,row.skey);
        }
        
        
        // now set the readonly and new flags on all controls
        $(this).find(':input').each(function() {
            this.zNew = mode=='new' ? 1 : 0;
            if(mode=='new') {
                var ro = u.p(this,'xroins','N');
            }
            else {
                var ro = u.p(this,'xroupd','N');
            }
            if(ro=='Y') {
                this.disabled = true;
            }
            else {
                this.disabled = false;
            }
            x6inputs.setClass(this);
        });
        var jqString = x6inputs.jqFocusString();
        $(this).find(jqString).focus();
        
        // Now that all displays are done, if we have a tab
        // selector then select it
        var tabSelector = u.p(this,'xTabSelector','');
        //console.log("tabSelector ",tabSelector);
        if(tabSelector != '') {
            var tabIndex = u.p(this,'xTabIndex');
            //console.log("Tab index ",tabIndex);
            $(tabSelector).tabs('select', Number(tabIndex));
        }
        
        //console.log("detailDisplay displayRow FINISHED");
        //console.groupEnd();
        return true;
    }

    self.populateInputs = function(row) {
        $(this).find(":input").each(function() {
                this.zOriginalValue = '';
                this.zChanged       = false;
        });
        for(var colname in row) {
            var val = row[colname];
            colname=colname.trim();
            var jqobj =$(this).find(':input[xcolumnid='+colname+']');
            if(jqobj.length>0) {
                if(val==null) val='';
                jqobj[0].value          = val;
                jqobj[0].zOriginalValue = val;
                jqobj[0].zChanged       = false;
                jqobj[0].zActive        = 1;
            }
        }
    }
}

x6tabDiv = {
    mouseEnabled: true,
    
    mouseDisable: function() {
        this.mouseEnabled = false;
        $('body').css('cursor','url(clib/mouseOff.png), default');
        $(document).one('mousemove',function() {
            x6tabDiv.mouseEnabled = true;
            $('body').css('cursor','');
        });
    },
    
    removeHighlight: function(table) {
        var rowNow = u.bb.vgfGet('highlight_'+table,'');
        if(rowNow!='') $('#'+rowNow).removeClass('hilight');
        u.bb.vgfSet('highlight_'+table,'');
        this.mouseDisable();
    },
    
    mouseover: function(rowDiv) {
        if(!this.mouseEnabled) return false;
        if(!rowDiv.id) return false;
        if(rowDiv.className=='selected') return false;
        var pieces = rowDiv.id.split('_');
        
        var rowNow = u.bb.vgfGet('highlight_'+pieces[0],'');
        if(rowNow!='') u.byId(rowNow).className = '';
        var row = u.byId(rowDiv.id);
        if(row.id != 'selected') {
            u.byId(rowDiv.id).className = 'hilight';
            u.bb.vgfSet('highlight_'+pieces[0],rowDiv.id);
        }
        
        //$(rowDiv).siblings('.hilight').removeClass('hilight');
        //$('#'+rowDiv.id+':not(.selected)').addClass('hilight');
    }
}

/***im* x6plugins/tabDiv
*
* NAME
*   x6plugins.tabDiv
*
* FUNCTION
*   The Javascript method x6plugins.tabDiv implements
*   all browser-side functionality for Andromeda's built-in
*   plugIn tabDiv.  A "tabDiv" appears to the user to be an
*   HTML TABLE but it is implemented with divs.
*
*   This routine is called automatically by x6.init, there
*   is not usually any reason for calling this routine
*   directly.
*
* INPUTS
*   self - the DOM object to be activated.
*   id - the ID of the object to be 'activated'.
*   table - the database table that the tabDiv is handling.
*
* RESULTS
*   no return value.
*
******
*/
x6plugins.x6tabDiv = function(self,id,table) {
    self.zTable    = table;
    self.x6profile = u.p(self,'x6profile','none');
    self.kbOnEdit  = ['x6tabDiv','twosides'].indexOf(self.x6profile)>=0;
    
    /*
    *    These two will tell us down below if the grid
    *    displays inputs for new rows and allows 
    *    inline editing of rows
    */
    var uiNewRow  = u.p(self,'uiNewRow' ,'');
    var uiEditRow = u.p(self,'uiEditRow','');
 
    /*
    *  A grid may be set to receive a cacheRows event.
    *  If so, it will replace its own data with the
    *  data that has been provided.
    */
    /* SUSPICIOUS, probably do not need this
    if(u.p(self,'xCacheRows','')=='Y') {
        x6events.subscribeToEvent('cacheRows_'+table,id);
        
        self['receiveEvent_cacheRows_'+table] = function(rows) {
            // Clear current data
            $(this).find('.tbody').html();
            // Add new data
            //for(var x in rows) {
            //    this.addRow(rows[x]);
            //}
        }
    }
    */

    self.rowId = function(skey,noPound) {
        return (noPound==null ? '#' : '')+this.zTable+'_'+skey;
    }
    self.skeyForRow = function(row) {
        var pieces = row.id.split('_');
        return pieces[1];
    }
    
    /*
    *   The grid is happy to display a new row for
    *   editing if a certain flag has been set.
    *   The event uiNewRow is unconditional, it means
    *   all prerequisites have been met and the grid
    *   should proceed forthwith.
    */
    x6events.subscribeToEvent('uiNewRow_'+table,id);
    if(uiNewRow!='Y') {
        // If the grid itself does not display the row, then it
        // stops responding to keyboard events while somebody
        // else is displaying the new row.
        self['receiveEvent_uiNewRow_'+table] = function() {
            this.keyboardOff();
        }
    }
    else {
        self['receiveEvent_uiNewRow_'+table] = function(tabDivBefore) {
            //console.group("tabDiv uiNewRow "+this.zTable);
            //console.time("tabDiv uiNewRow");
            var skey = u.bb.vgfGet('skey_'+this.zTable,-1);
            
            /*
            *   If we are currently editing a new row, just
            *   focus on it.
            */
            if(skey==0 && u.bb.vgfGet('lastSave_'+this.zTable)=='noaction') {
                $(this.rowId(0)+" :input:first:not([disabled])").focus();
                //console.log("On an empty new row, setting focus");
                //console.groupEnd();
                return;
            }
            
            /*
            *   If editing some other row, we know it was saved
            *   and is ok, convert it back to display
            */
            if(skey>=0) {
                this.removeInputs();
            }

            /*
            *   This is the major UI stuff.  We need to slip a
            *   row into the grid, clone some of the invisible
            *   inputs that have been provided by the PHP code,
            *   and get them all initialized and ready to go.
            */
            var newRow = 
                "<div id='"+this.zTable+"_0' "
                +" class='selected' "
                +" style='display:none'>";
            var numbers = [ 'int', 'numb', 'money' ];
            for (var idx in this.zColsInfo) {
                var colInfo = this.zColsInfo[idx];
                if(colInfo.column_id == '') continue;

                newRow+= "<div gColumn = '"+idx+"'" 
                    +" style='width: "+colInfo.width+"px;";
                if(numbers.indexOf(colInfo.type_id)>=0) {
                    newRow+="text-align: right;";
                }
                newRow+="'>";
                var id = '#wrapper_'+this.zTable+'_'+colInfo.column_id;
                var newInput = $(id).html();
                //console.log("column: ",colInfo.column_id);
                newRow+=newInput+"</div>";
            }
            newRow+="</div>";
            
            
            /* 
            *   Now figure out where to put the row.  [New] always
            *   goes after current row, and [Insert] passes the 
            *   tabDivBefore flag that says go before the current
            *   row.  If there is no current row, [Insert] goes at
            *   the top and [New] goes at the bottom.
            */
            // First work out current row, if there is one
            var iRelative = false;
            if(skey!=0) {
                iRelative = skey;
                if(tabDivBefore) {
                    u.bb.vgfSet('skeyBefore_'+this.zTable,skey);
                    u.bb.vgfSet('skeyAfter_' +this.zTable,-1);
                }
                else {
                    u.bb.vgfSet('skeyAfter_' +this.zTable,skey);
                    u.bb.vgfSet('skeyBefore_'+this.zTable,-1);
                }
                //var jqRow = $('#row_'+skey);
                var jqRow = $(this.rowId(skey));
            }
            else {
                u.bb.vgfSet('skeyBefore_'+this.zTable,-1);
                u.bb.vgfSet('skeyAfter_'+this.zTable, -1);
                var jqRow = this.jqCurrentRow();
            }
            
            // Now go either before or after the row we found, or at
            // top or bottom as the case may be
            if(jqRow.length==0) {
                if(tabDivBefore) {
                    //console.log("body prepend");
                    $(this).find('.tbody').prepend(newRow);                    
                }
                else {
                    //console.log("body append");
                    $(this).find('.tbody').append(newRow);                    
                }
            }
            else {
                if(tabDivBefore) {
                    //console.log("before this row: ",jqRow);
                    $(jqRow).before(newRow);
                }
                else {
                    //console.log("after this row: ",jqRow);
                    $(jqRow).after(newRow);
                }
            }

            
            /*
            *   Now do everything required to make the 
            *   row visible and editable
            */
            tabIndex = 1000;
            var grid = this;
            //$(this).find('#row_0 :input').each(
            $(this.rowId(0)+' :input').each(            
                function() {
                    this.setAttribute('xClassRow','0');
                    grid.initInput(this,tabIndex++,'new','rowNew'); 
                }
            );
            //$(this).find('#row_0').fadeIn('fast'
            $(this.rowId(0)).fadeIn('fast'
                ,function() {
                    x6inputs.findFocus( this );
                }
            );
            
            // Send a message and get lost
            u.bb.vgfSet('skey_'+this.zTable,0);
            x6events.fireEvent('buttonsOn_'+this.zTable);
            //console.time("remove highlight");
            //$(this).find('.tbody > div.hilight').removeClass('hilight');
            x6tabDiv.removeHighlight(this.zTable);
            //console.timeEnd('remove highlight');
            //console.log('New row created, ready to edit');
            //console.timeEnd("tabDiv uiNewRow");
            //console.groupEnd();
            return true;
        }
    }
    
   
    self.initInput = function(input,tabIndex,mode,tabGroup) {
        //console.group("Initializing Input");
        //console.log("tabindex, mode, tabgroup: ",tabIndex,mode,tabGroup);
        //console.log(input);
        
        // Get the read-only decision
        if(mode=='new') {
            //console.log("hello, ro ins");
            input.disabled = u.p(input,'xroins','N')=='Y';
        }
        else {
            //console.log("hello, ro upd");
            input.disabled = u.p(input,'xroupd','N')=='Y';
        }
        
        // This is standard events and attributes
        input.setAttribute('xTabGroup',tabGroup);
        input.setAttribute('tabIndex' ,tabIndex);
        input.zOriginalValue = u.p(input,'value','').trim();
        if(mode=='new') {
            input.zNew = 1;
        }
        x6inputs.setClass(input);
        
        // An 'x6select' control replaces HTML Select.  We add
        // a little button off to the right of the input.
        if(u.p(input,'x6select','N')=='Y') {
            var str= '<span '
                + 'class="button" '
                + 'xInputId="'+input.id+'" '
                + 'onmousedown = "this.className = '+"'button_mousedown'"+'" '
                + 'onmouseup   = "this.className = '+"'button'"+'" '
                + 'onmouseout  = "this.className = '+"'button'"+'" '
                + 'onclick="x6inputs.ddClick(this)">'
                + '&nbsp;&darr;&nbsp;</span>';
            $(input).after(str);
        }
        
        // This is important, it says that this is an 
        // active input.  This distinguishes it from possible
        // hidden inputs that were used as a clone source 
        // that have many or all of the same properties.
        input.zActive = 1;
        //console.groupEnd();
    }


    /*
    *   Always subscribe to an editrow command.  If in edit
    *   mode the handler makes inputs and stuff.  If not,
    *   it just turns off the keyboard.
    */
    x6events.subscribeToEvent('uiEditRow_'+table,id);
    if(uiEditRow!='Y') {
        self['receiveEvent_uiEditRow_'+table] = function(skey) {
            this.keyboardOff();
        }
    }
    else {
        self['receiveEvent_uiEditRow_'+table] = function(skey) {
            //console.group("tabDiv uiEditRow "+this.zTable);
    
            if(u.byId(this.rowId(skey,false))==null) {
            //if( $(this).find('#row_'+skey).length == 0) {
                //console.log("We don't have that row, cannot edit");
                //console.groupEnd();
                return;
            }

            var skeynow = u.bb.vgfGet('skey_'+this.zTable);
            if(skeynow == skey) {
                //console.log("Grid is already on the row, no action");
                //console.groupEnd();
                return;
            }
            
            /*
            *   If editing some other row, we know it was saved
            *   and is ok, convert it back to display
            */
            if(u.bb.vgfGet('skey_'+this.zTable)>=0) {
                this.removeInputs();
            }

            // Set this before adding inputs.  If you
            // do it afterward we get "jumpies" as the
            // border/padding/margin adjusts.
            //$(this).find('.tbody #row_'+skey)[0].className='selected';
            //console.log(this.rowId(skey));
            var rowId = this.rowId(skey,true);
            u.byId(rowId).className='selected';

            //console.log("Putting inputs into div cells");
            var grid = this;
            var tabIndex = 1000;
            var focus=false;
            //$(this).find('#row_'+skey+' div').each(
            //console.log(this.rowId(skey)+' div');
            $(this.rowId(skey)+' div').each(            
                function() {
                    var div = this;
                    // Work up to figuring out the name of the
                    // id that holds the hidden input, then
                    // grab the input and put it in.
                    var colnum = u.p(div,'gColumn');
                    var colid  = grid.zColsInfo[colnum].column_id;
                    var id = 'wrapper_'+grid.zTable+'_'+colid;
                    //console.log(id);

                    // Current Value
                    // KFD 11/29/08, use special html conversion
                    var curval = div.innerHTML.htmlEdit();
                    
                    div.innerHTML = u.byId(id).innerHTML;
                    var inp = div.lastChild;
                    inp.value  = curval;
                    inp.inGrid = true;
                    inp.setAttribute('xClassRow',0);
                    grid.initInput(inp,tabIndex++,'edit','rowEdit');
                    if(!inp.disabled && !focus) {
                        inp.focus();
                        focus=true;
                    }
                }
            );
            
            x6tabDiv.removeHighlight(this.zTable);
            x6events.fireEvent('buttonsOn_'+this.zTable);
            //this.keyboardOff();
            u.bb.vgfSet('skey_'+this.zTable,skey);
            //console.log('uiEditRow Completed, returning true');
            //console.groupEnd();
            return true;
        }
    }
    
    /*
    *   A grid may need to convert inputs back into display
    *   elements.  This routine is unconditionally created
    *   and is only called by ui event handlers.
    *
    */
    self.removeInputs = function() {
        //console.group("tabDiv removeInputs");
        var skey = u.bb.vgfGet('skey_'+this.zTable);

        //if( $(this).find('#row_'+skey+' :input').length==0 ) {
        if( $(this.rowId(skey)+' :input').length==0 ) {
            //console.log("no inputs, doing nothing");
            //console.groupEnd();
            return;
        }
        
        // KFD 12/10/08, hide any dropdowns
        x6inputs.x6select.hide();
        
        // Remove the "selected" class from the inputs row,
        // it does not belong there anymore.
        u.byId(this.rowId(skey,true)).className = '';

        //console.log("skey is ",skey);
        var grid = this;
        //$(this).find("#row_"+skey).removeClass('selected').find("div").each(
        //if( $(this.rowId(skey)+' :input').length==0 ) {
        //$(this).find("#row_"+skey+" div").each(
        $(this.rowId(skey)+' div').each(
            function() {
                var inp    = this.firstChild; 
                //var inp    = $(this).find(":input")[0];
                if(inp != null) {
                    var val    = inp.value;
                    var col    = u.p(inp,'xColumnId');
                    var typeid = grid.zColsById[col].type_id;
                    //console.log(val);
                    this.innerHTML = x6dd.display(typeid,val,'&nbsp;');
                }
            }
        );

        // If we are removing inputs from the 0 row
        // and the last save had no action, kill the row
        if(skey==0) {
            if(u.bb.vgfGet('lastSave_'+this.zTable)=='noaction') {
                //console.log("No action on last save, removing row ",skey);
                $(this.rowId(0)).fadeOut(
                    function() { $(this).remove() }
                );
            }
        }
        
        //console.log("turning on keyboard events");
        this.keyboardOn();
        
        // Since we are no longer editing, set skey appropriately
        //console.log("tabDiv removeInputs Finished");
        //console.groupEnd();
        return true;
    }
    
    /*
    *   Undo Row: the table controller has already reset
    *   any inputs, we will just remove them
    */
    if(uiEditRow=='Y' || uiNewRow=='Y') {
        x6events.subscribeToEvent('uiUndoRow_'+table,id);
        self['receiveEvent_uiUndoRow_'+table] = function(skey) {
            //console.group('tabDiv uiUndoRow ',skey);
            if(skey!=0) {
                //console.log("Skey is not zero, resetting values");
                //$(this).find('#row_'+skey+' :input').each(
                $(this.rowId(skey)+' :input').each(
                    function() {
                        this.value = this.zOriginalValue;
                        x6inputs.setClass(this);
                    }
                );
            }
            else {
                //console.log("Skey is zero, removing row");
                this.removeInputs();
                var iBefore = u.bb.vgfGet('skeyBefore_'+this.zTable,-1);
                var iAfter  = u.bb.vgfGet('skeyAfter_' +this.zTable,-1);
                ////console.log(iBefore,iAfter);
                if     (iBefore!=-1) skeyNew = iBefore;
                else if(iAfter !=-1) skeyNew = iAfter;
                else skeyNew = -1;
                if(skeyNew!=-1){
                    //console.log("Picked this row to edit: ",skeyNew);
                    x6events.fireEvent('reqEditRow_'+this.zTable,skeyNew);
                    //$(this).find('#row_'+skeyNew).mouseover();
                }
            }
            //console.groupEnd();
        }
    }
    else if(self.kbOnEdit) {
        x6events.subscribeToEvent('uiUndoRow_'+table,id);
        self['receiveEvent_uiUndoRow_'+table] = function(skey) {
            this.keyboardOn();
        }
    }
    
    /*
    *   A grid must always have a facility to receive 
    *   new values from any source.  The code is smart
    *   enough to figure out if the row is in edit mode
    *   or display mode.
    *
    */
    x6events.subscribeToEvent('uiRowSaved_'+table,id);
    self['receiveEvent_uiRowSaved_'+table] = function(row) {
        //console.group("tabDiv uiRowSaved: "+this.zTable);
        // Replace the input values with server returned values
        skey = u.bb.vgfGet('skey_'+this.zTable);
        //if( $(this).find("#row_"+skey+" :input").length > 0) {
        if( $(this.rowId(skey)+' :input').length > 0) {
            //console.log($(this).find("#row_"+skey+" :input"));
            //console.log("found inputs, going rowSavedEdit");
            this.uiRowSavedEdit(row);
            var skeyNew = skey==0 ? row.skey : skey;
            x6events.fireEvent('reqEditRow_'+this.zTable,skeyNew);
        }
        else {
            //console.log("no inputs, going rowSavedNoEdit");
            this.uiRowSavedNoEdit(row);
            if(this.kbOnEdit) {
                this.keyboardOn();
            }
        }
        //console.log("tabDiv uiRowSaved finished, returning TRUE");
        //console.groupEnd();
    }
    
    self.uiRowSavedEdit = function(row) {
        var skey = u.bb.vgfGet('skey_'+this.zTable);
        var grid = this;
        //$(this).find("#row_"+skey+" :input").each(
        $(this.rowId(skey)+" :input").each(
            function() {
                var col    = u.p(this,'xColumnId');
                var typeid = grid.zColsById[col].type_id;
                //console.log(col,row[col]);
                this.value = x6dd.display(typeid,row[col],'');
                this.zOriginalValue = this.value;
            }
        );
        this.removeInputs();
        //x6events.fireEvent('buttonsOff_'+this.zTable);
        u.bb.vgfSet('skey_'+this.zTable,-1);
        
        // If this was a new row, set it up
        if(skey==0) {
            //console.log("Was new row, setting up the row for editing");
            table = this.zTable;
            /*
            $(this).find("#row_0").each(
                function() {
                    this.id = 'row_'+row.skey;
                }
            );
            */
            u.byId(this.zTable+'_0').id = this.zTable+'_'+row.skey;
            this.initRow(row.skey);
            
        }
    }
        
    self.uiRowSavedNoEdit = function(row) {
        var skey = row.skey;
        
        // If a new row has been saved and we don't 
        // have it, create it now
        //if($(this).find('.tbody #row_'+skey).length==0) {
        if($(this.rowId(skey)).length==0) {        
            var newRow = new jsHtml('div');
            newRow.hp.id = 'row_'+skey;
            newRow.hp.style = 'display: none;';
            var numbers = [ 'int', 'numb', 'money' ];
            for (var idx in this.zColsInfo) {
                var colInfo = this.zColsInfo[idx];
                if(colInfo.column_id == '') continue;
                
                var innerDiv = newRow.h('div');
                innerDiv.hp.style= "width: "+colInfo.width+"px;";
                innerDiv.hp.gColumn = idx;
                if(numbers.indexOf(colInfo.type_id)>=0) {
                    innerDiv.hp.style+="text-align: right";
                }
                var typeid = colInfo.typeid;
                var value  = row[colInfo.column_id];
                innerDiv.innerHtml = x6dd.display(typeid,value,'&nbsp;');
            }
            $(this).find('.tbody').prepend(newRow.bufferedRender());
            this.initRow(skey);
            $(this.rowId(skey)).fadeIn();
        }
        else {
            for(var idx in this.zColsInfo) {
                var col = this.zColsInfo[idx].column_id;
                if(col!='') {
                    //var str="#row_"+skey+" div[gColumn="+idx+"]";
                    var str=this.rowId(skey)+" div[gColumn="+idx+"]";
                    //$(this).find(str).html(row[col]);
                    $(str).html(row[col]);
                }
            }
        }
    }
    
    self.initRow = function(skey) {
        // PHP-JAVASCRIPT DUPLICATION ALERT!
        // This code also exists in androLib.php
        // addRow method of the tabDiv class
        var table = this.zTable;
        //$(this).find('#row_'+skey)
        $(this.rowId(skey))
            .mouseover(
                function() { x6tabDiv.mouseover(this) }
            )
            .click(
                function() {
                    x6events.fireEvent(
                        'reqEditRow_'+table,skey
                    );
                }
            );
        
    }
                
    /*
    *   A uiDelRow command means a row has been deleted
    *   from the server, and anybody displaying it must
    *   remove it from the display.
    */
    x6events.subscribeToEvent('uiDelRow_'+table,id);
    self['receiveEvent_uiDelRow_'+table] = function() {
        //console.group("tabDiv uiDelRow "+this.zTable);
        skey = u.bb.vgfGet('skey_'+this.zTable);
        //console.log("current skey ",skey);
        
        if(this.kbOnEdit) {
            this.keyboardOn();
            if(this.x6profile=='twosides') {
                //console.log("Twosides profile, exiting after keyboardOn()");
                //console.groupEnd();
                return;
            }
        }
        
        if(skey!=-1) {
            var hilightRow = false;
            //console.log("Determining row to highlight afer removing");
            var jqCandidate = $(this.rowId(skey)).next();
            if(jqCandidate.length>0) {
                var hilightRow = jqCandidate;
            }
            else {
                var jqCandidate = $(this.rowId(skey)).prev();
                if(jqCandidate.length>0) {
                    var hilightRow = jqCandidate;
                }
            }
        }
        
        if(skey==-1) {
            //console.log("No row, ignoring");
            return;
        }
        else if(skey==0) {
            //console.log("on a new row, firing cancelEdit command");
            x6events.fireEvent('cancelEdit_'+this.zTable);
        }
        else {
            $(this.rowId(skey)).fadeOut(
                function() {
                    $(this).remove();
                }
            );
            u.bb.vgfSet('skey_'+this.zTable,-1);
            x6events.fireEvent('buttonsOff_'+this.zTable);
        }
        if(!hilightRow) {
            //console.log("No candidate row to hilight");
        }
        else {
            //console.log("Will hilight this row: ",hilightRow);
            var skey = this.skeyForRow(hilightRow[0]);
            x6events.fireEvent('reqEditRow_'+this.zTable,skey);
        }
        //console.log("uiDelRow finished");
        //console.groupEnd();
    }
    
    /*
    *    If a grid is displaying inputs, it may also have
    *    to display errors.
    */
    if(uiEditRow=='Y' || uiNewRow=='Y') {
        x6events.subscribeToEvent('uiShowErrors_'+table,id);
        self['receiveEvent_uiShowErrors_'+table] = function(errors) {
            //console.group("tabDiv uiShowErrors");
            //console.log(errors);
            for(var idx in errors) {
                //console.log(errors[idx]);
                var aError = errors[idx].split(':');
                var column = aError[0];
                //console.log("Setting zError for column ",column);
                $(this).find(":input[xColumnId="+column+"]").each(
                    function() {
                        this.zError = 1;
                        x6inputs.setClass(this);
                    }
                );
            }
            //console.log("tabDiv uiShowErrors finished");
            //console.groupEnd();
            return true;
        }
    }
    
    /*
    *    Keyboard handling: row navigation
    */
    self.receiveEvent_key_UpArrow = function(e) {
        //console.group("tabDiv key_UpArrow");
        var jqCurrent = this.jqCurrentRow();
        var jqRowPrev = $(jqCurrent).prev();
        if(jqCurrent.length==0) {
            //console.log("current is zero, going to top");
            this.goRowTop();
        }
        else if(jqRowPrev.length!=0) {
            //console.log("there is a previous, going to that");
            this.goRowJq(jqRowPrev);
            this.scrollMove(-1);
        }
        else {
            // KFD 12/8/08, if new rows are inline, do it
            if(u.p(this,'uiNewRow','N')=='Y') {
                //console.log("requesting new row, forcing insert before");
                x6events.fireEvent('reqNewRow_'+this.zTable,true);
            }
        }
        x6events.retvals['key_UpArrow'] =false;
        //console.log("tabDiv key_UpArrow finished");
        //console.groupEnd();
    }
    self.receiveEvent_key_DownArrow = function(e) {
        //console.group("tabDiv key_DownArrow");
        //console.log(e);
        var jqCurrent = this.jqCurrentRow();
        var jqRowNext = $(jqCurrent).next();
        if(jqCurrent.length==0) {
            this.goRowTop();
        }
        else if(jqRowNext.length!=0) {
            this.goRowJq(jqRowNext);
            this.scrollMove(1);
        }
        else {
            // KFD 12/8/08, if new rows are inline, do it
            if(u.p(this,'uiNewRow','N')=='Y') {
                x6events.fireEvent('reqNewRow_'+this.zTable);
            }
        }
        x6events.retvals['key_DownArrow'] =false;
        //console.log("tabDiv key_DownArrow finished");
        //console.groupEnd();
    }
    self.receiveEvent_key_PageUp = function(e) {
        //console.group("tabDiv key_DownArrow");
        var jqCurrent = this.jqCurrentRow();
        var jqRowPrev = $(jqCurrent).prevAll();
        if(jqCurrent.length==0) {
            this.goRowTop();
        }
        else if(jqRowPrev.length!=0) {
            var cntAbove  = jqRowPrev.length;
            var cntJump   = Number(u.p(this,'xRowsVisible')) - 2;
            
            // Figure out how far to go up, then figure the row
            var rowsChange = cntAbove < cntJump ? cntAbove : cntJump;
            var newRow     = jqRowPrev[ rowsChange - 1 ];
            this.goRowJq($(newRow));
            this.scrollMove(-rowsChange);
        }
        x6events.retvals['key_PageUp'] =false;
        //console.log("tabDiv key_DownArrow finished");
        //console.groupEnd();
    }
    self.receiveEvent_key_PageDown = function(e) {
        //console.group("tabDiv key_DownArrow");
        var jqCurrent = this.jqCurrentRow();
        var jqRowNext = $(jqCurrent).nextAll();
        if(jqCurrent.length==0) {
            this.goRowTop();
        }
        else if(jqRowNext.length!=0) {
            // before doing anything, figure how many rows above
            var cntBelow = jqRowNext.length;
            var cntJump  = Number(u.p(this,'xRowsVisible')) - 2;
            
            // Figure out how far to go up, then figure the row
            var rowsChange = cntBelow < cntJump ? cntBelow : cntJump;
            var newRow     = jqRowNext[ rowsChange - 1 ];
            this.goRowJq($(newRow));
            this.scrollMove(rowsChange);
        }
        x6events.retvals['key_PageDown'] =false;
        //console.log("tabDiv key_DownArrow finished");
        //console.groupEnd();
    }
    self.receiveEvent_key_CtrlHome = function(e) {
        this.goRowTop();
        x6events.retvals['key_CtrlHome'] =false;
    }
    self.receiveEvent_key_CtrlEnd = function(e) {
        this.goRowJq( $(this).find('.tbody > div:last') ); 
        var rowHeight = Number(u.p(this,'cssLineHeight'));
        var rowCount  = $(this).find('.tbody > div').length;
        var stNew = rowHeight * rowCount;
        $(this).find('.tbody').animate({scrollTop:stNew},400);
    }
    self.receiveEvent_key_Enter = function(e) {
        //console.group("tabDiv key_Enter - clicking hilighted rows");
        $(this).find('.tbody div.hilight').click();
        //var jqRow = $(this).find('div.hilight')[0];
        //var skey  = this.skeyForRow(jqRow);
        //x6events.fireEvent('reqEditRow_'+this.zTable,skey);
        //console.groupEnd();
    }
    
    /*
    *    Routines to move pick a row and scroll
    *
    */
    self.jqCurrentRow = function() {
        return $(this).find('.selected');
    }
    self.goRowBySkey = function(skey) {
        //console.log('goRowBySkey ',skey);
        if( u.p(this,'uiEditRow','')=='Y') {
            //console.log("We can edit, firing reqEditRow");
            x6events.fireEvent('reqEditRow_'+this.zTable,skey);
        }
        else {
            //console.log("We do not edit, hilighting");
            $(this).find('.hilight').removeClass('.hilight');
            $(this).find('#row_'+skey).addClass('.hilight');
        }
    }
    self.goRow = function(ordinal) {
        var row = $(this).find('.tbody > div')[ordinal];
        var skey= this.skeyForRow(row);
        //console.log("goRow for ",ordinal,' has picked skey ',skey);
        this.goRowBySkey(skey);
    }
    self.goRowJq = function(jqRow) {
        var skey = this.skeyForRow(jqRow[0]);
        //console.log("goRow by jQuery object ");
        //console.log(jqRow);
        //console.log(skey);
        this.goRowBySkey(skey);
    }
    self.goRowTop = function() {
        this.goRow(0);
        //$(this).find('.tbody').scrollTop(0);
        $(this).find('.tbody').animate({scrollTop: 0},400);
    }
    self.scrollMove = function(change) {
        // Get all of the numbers we need
        var jqRow     = this.jqCurrentRow();
        var cntAbove  = $(jqRow).prevAll().length;
        var cntBelow  = $(jqRow).nextAll().length;
        var cntAll    = cntAbove + cntBelow + 1;
        var cntVisible= Number(u.p(this,'xRowsVisible'));
        var cssHeight = Number(u.p(this,'cssLineHeight')) - 2;
        var scrollNow = $(this).find('.tbody').scrollTop();
        var limitBot  = cntVisible - 2;
        var limitTop  = 3;
        
        // Work out where the last row was, by first working out
        // where the current row is and then going backward.
        var rowRaw = (cntAbove + 1);
        var rowReal= rowRaw - (scrollNow / cssHeight);
        
        // Work out what we should adjust.
        var stAdjust = false;
        if(change > 0) {
            // We are going down.  If the new position would be
            // beyond
            if(rowReal > limitBot) {
                var rowsAdjust = rowReal - limitBot;
                stAdjust = rowsAdjust * cssHeight;
            }
        }
        else {
            if(rowReal < limitTop) {
                var rowsAdjust = rowReal - limitTop;
                stAdjust = rowsAdjust * cssHeight;
            }
        }
        if(stAdjust!=0) {
            //console.log(stAdjust);
            var stNew     = scrollNow + stAdjust;
            //$(this).find('.tbody').scrollTop(stNow + stAdjust);
            $(this).find('.tbody').animate({scrollTop:stNew},200);
        }
    }

    /*
    *   This is the list of the keys that we wrote handlers
    *   for above.  They have to sometimes be turned off
    *   and on
    */
    self.keyList = [
        'PageUp', 'PageDown', 'CtrlHome', 'CtrlEnd'
        ,'UpArrow', 'DownArrow', 'Enter'
    ];
    self.keyboardOn = function() {
        if(this.keyboardStatus=='On') return;
        for(var key in this.keyList) {
            var keyLabel = this.keyList[key];
            x6events.subscribeToEvent('key_'+keyLabel,id);
        }
        this.keyboardStatus = 'On';
        $(this).focus();
    }
    self.keyboardOff = function() {
        if(this.keyboardStatus=='Off') return;
        for(var key in this.keyList) {
            var keyLabel = this.keyList[key];
            x6events.unsubscribeToEvent('key_'+keyLabel,id);
        }
        this.keyboardStatus = 'Off';
    }
    this.keyboardStatus = 'Off'
    if(u.p(self,'xInitKeyboard','N')=='Y') {
        self.keyboardOn();
        if(uiEditRow=='Y') {
            x6events.fireEvent('key_DownArrow'); 
        }
    }


    
    /*
    *    Lookup stuff.  If we have a row of input lookups on the
    *    grid, they will all route to here.
    *
    */
    self.fetch = function(doFetch) {
        if(doFetch==null) doFetch=false;
        var cntNoBlank = 0;
        
        // Initialize and then scan
        //ua.json.init('x6page',this.zTable);
        var json = new androJSON('x6page',this.zTable);        
        $(this).find(".thead :input").each(function() {
            if(typeof(this.zValue)=='undefined') 
                this.zValue = this.getAttribute('xValue');
            if(this.value!=this.zValue) {
                doFetch = true;
            }
            if(this.value!='') {
                cntNoBlank++;
            }
            this.zValue = this.value;
            //ua.json.addParm('x6w_'+u.p(this,'xColumnId'),this.value);
            json.addParm('x6w_'+u.p(this,'xColumnId'),this.value);
        });
        
        if(doFetch) {
            // Clear the previous results
            ua.data.browseFetchHtml = '';
            if(cntNoBlank==0) {
                $(this).find('.tbody').html('');
                return;
            }
            //ua.json.addParm('x6action'   ,'browseFetch');
            //ua.json.addParm('xSortable'  ,'N');
            //ua.json.addParm('xReturnAll' ,'N');
            json.addParm('x6action'   ,'browseFetch');
            json.addParm('xSortable'  ,u.p(this,'xSortable'  ,'N'));
            json.addParm('xReturnAll' ,'N');
            json.addParm('xGridHeight',u.p(this,'xGridHeight',500));
            json.addParm('xLookups'   ,u.p(this,'xLookups'   ,'N'));
            if( json.execute()) {
                json.process();
                // The standard path is to take data returned
                // by the server and render it.  This is safe
                // even if the server does not return anything,
                // because we initialized to an empty object.
                //$(this).find(".tbody").replaceWith(ua.json.jdata.html.browseFetchHtml);
                $(this).find(".tbody").replaceWith(json.jdata.html.browseFetchHtml);
            }
        }
        
        delete json;
    }
    
    /*
    *    Accept request to sort on a column.  The grid makes
    *    the request because the grid is going to display it,
    *    which keeps everything in one place.
    */    
    x6events.subscribeToEvent('uiSort_'+table,id);
    self['receiveEvent_uiSort_'+table] = function(args) {
        u.bb.vgfSet('skey_'+this.zTable,-1);
        ua.json.init('x6page',this.zTable);

        var tablePar = u.p(this,'x6tablePar','');
        if(tablePar!='') {
            var skeyPar = u.bb.vgfGet('skey_'+tablePar);
            ua.json.addParm('tableIdPar',tablePar     );
            ua.json.addParm('skeyPar'   ,skeyPar      );
        }
            
        ua.json.addParm('x6action','browseFetch');
        ua.json.addParm('xGridHeight',u.p(this,'xGridHeight'));
        ua.json.addParm('xSortable'  ,u.p(this,'xSortable'  ));
        ua.json.addParm('xReturnAll' ,u.p(this,'xReturnAll' ));
        ua.json.addParm('xButtonBar' ,u.p(this,'xButtonBar','N'));
        ua.json.addParm('sortCol',args.sortCol);
        ua.json.addParm('sortAsc',args.sortAsc);
        u.dialogs.pleaseWait();
        if(ua.json.execute(true)) {
            var html = ua.json.jdata.html['browseFetchHtml'];
            $(this).find('.tbody').replaceWith(html);
        }
        u.dialogs.clear();
    }
}


/* **************************************************************** *\

   Additional routines for jquery tabs
   
\* **************************************************************** */
x6tabs = {
    slideUp: function(event,ui,topPane,topPaneI) {
        var obj = u.byId(topPane);
        if(typeof(obj.currentChild)=='undefined') obj.currentChild='*';
        var currentChild = obj.currentChild
        var newChild     = ui.panel.id;
        
        // if UI.index = 0, they clicked hide.  We do not have to
        // shrink up the tab because jQuery appears to reset heights
        // on a tab when it is hidden from view.  So when the user
        // picks the "hide" tab,  all we have to do is pull down
        // the top pane
        if(ui.index==0) {
            if(currentChild!='*') {
                var newHeight = $('#'+topPane).height()+350;
                var newHeightI= $('#'+topPaneI).height()+350;
                $('#'+topPaneI).animate( {height: newHeightI},500,null
                    ,function() { $(this).css('overflow-y','scroll'); }
                );
                $('#'+topPane).animate( {height: newHeight},500);
                obj.currentChild = '*';
                return true;
            }
        }
        
        // If no tab, slide up and slide down 
        if(currentChild=='*') {
            var newHeight = $('#'+topPane).height()-350;
            var newHeightI= $('#'+topPaneI).height()-350;
            setTimeout(function() {
                $('#'+topPaneI).animate( {height: newHeightI},500,null
                    ,function() {
                        $(this).css('overflow-y','scroll');
                    }
                );
            },100);
            $('#'+topPane).animate( {height: newHeight},500 );
            //$('#'+topPane).animate( {height: newHeight},500,null
            //    ,function() { 
            //        $(this).css('overflow-y','scroll');
            //    }
            //);
            // Originally I had this in after the toppane scrolled
            // up, but it looks cooler if it happens a little bit
            // after.
            var newHeight=$(ui.panel).height()+350;
            setTimeout(function() {
                    $(ui.panel).animate({height: newHeight},500,null
                        ,function() { x6tabs.slideUpData(newChild,newHeight) }
                    );
            },200);
            u.byId(topPane).currentChild = newChild;
            return true;
        }

        // If we are still here, they picked one child tab
        // while another was still open.  We have to drop down
        // the selected tab.  We have to do this even if they
        // swap around between tabs, because jQuery restores the
        // original height (3px or so) when it hides a tab.
        var newHeight=$(ui.panel).height()+350;
        setTimeout(function() {
                $(ui.panel).animate({height: newHeight},500,null
                    ,function() { x6tabs.slideUpData(newChild,newHeight) } 
                );
        },100);
        u.byId(topPane).currentChild = newChild;
        return true;
    },
    
    slideUpData: function(paneId,newHeight) {
        var pane     = u.byId(paneId);
        var tablePar = u.p(pane,'x6tablePar');
        var table    = u.p(pane,'x6table'   );
        var skeyPar  = u.bb.vgfGet('skey_'+tablePar);
        ua.json.init(   'x6page'    ,table        );
        ua.json.addParm('x6action'  ,'browseFetch');
        ua.json.addParm('tableIdPar',tablePar     );
        ua.json.addParm('skeyPar'   ,skeyPar      );
        ua.json.addParm('sendGrid'  ,1            );
        ua.json.addParm('xSortable' ,'Y'          );
        ua.json.addParm('xReturnAll','Y'          );
        ua.json.addParm('xGridHeight',newHeight-2  ); // assume borders
        if(ua.json.execute()) {
            ua.json.process(paneId);
            var id = $(pane).find("div")[0].id;
            x6.initOne(id);
        }
    }
}

x6plugins.x6tabs = function(self,id,table) {
    // We use a standard routine on the PHP side to generate
    // the initialization command, and that routine always
    // passes in the three parameters above.  For tabs we
    // ignore the parameters, we do not need them.
    
    // The count and offset variables determine which
    // keystrokes to listen for.
    var count = Number($('#'+id+' > ul > li').length);
    var offset= Number(u.p(self,'xOffset',0));
    
    for(var x = offset; x<(offset+count); x++) {
        x6events.subscribeToEvent('key_Ctrl'+x.toString(),self.id);
        self['receiveEvent_key_Ctrl'+x.toString()] = function(key) {
            //console.time("tabs key");
            //console.time("checking for visible");
            // Abort if he is not really visible, this is the
            // easiest way to do this, and we don't have to 
            // keep track of whether or not it is visible.
            if($(this).find(":reallyvisible").length==0) return;
            //if($(this).isVisible().length==0) return;            
            //console.timeEnd("checking for visible");
            
            // get the offset, the keystroke, 
            // and calculate the index.
            var offset = Number(u.p(this,'xOffset',0));
            var key    = Number(key.slice(-1));
            var index  = (key - offset);
            var str = '#'+this.id+' > ul';
            $(str).tabs('select',index);
            //console.timeEnd("tabs key");
        }
    }
}

