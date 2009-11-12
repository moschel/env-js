/*
 * Envjs env-js.1.1.rc1 
 * Pure JavaScript Browser Environment
 *   By John Resig <http://ejohn.org/>
 * Copyright 2008-2009 John Resig, under the MIT License
 */

try {

    Envjs.window = function($w,
                            $env,
                            $parentWindow,
                            $openingWindow,
                            $initTop,
                            $thisIsTheOriginalWindow){

        // The Window Object
        var __this__ = $w;
        $w.__defineGetter__('window', function(){
            return __this__;
        });
        $w.$isOriginalWindow = $thisIsTheOriginalWindow;
        $w.$haveCalledWindowLocationSetter = false;

        
        /*
*	window.js
*   - this file will be wrapped in a closure providing the window object as $w
*/
// a logger or empty function available to all modules.
var $log = $env.log,
    $debug = $env.debug,
    $info = $env.info,
    $warn = $env.warn,
    $error = $env.error;
    
//The version of this application
var $version = "0.1";
//This should be hooked to git or svn or whatever
var $revision = "0.0.0.0";

//These descriptions of window properties are taken loosely David Flanagan's
//'JavaScript - The Definitive Guide' (O'Reilly)

/**> $cookies - see cookie.js <*/
// read only boolean specifies whether the window has been closed
var $closed = false;

// a read/write string that specifies the default message that appears in the status line 
var $defaultStatus = "Done";

// a read-only reference to the Document object belonging to this window
/**> $document - See document.js <*/

//IE only, refers to the most recent event object - this maybe be removed after review
var $event = null;

//A read-only array of window objects
//var $frames = [];    // TODO: since window.frames can be accessed like a
                       //   hash, will need an object to really implement

// a read-only reference to the History object
/**>  $history - see location.js <**/

// read-only properties that specify the height and width, in pixels
var $innerHeight = 600, $innerWidth = 800;

// a read-only reference to the Location object.  the location object does expose read/write properties
/**> $location - see location.js <**/

// The name of window/frame.  Set directly, when using open(), or in frameset.
// May be used when specifying the target attribute of links
var $name;

// a read-only reference to the Navigator object
/**> $navigator - see navigator.js <**/

// a read/write reference to the Window object that contained the script that called open() to 
//open this browser window.  This property is valid only for top-level window objects.
var $opener = $openingWindow;

// Read-only properties that specify the total height and width, in pixels, of the browser window.
// These dimensions include the height and width of the menu bar, toolbars, scrollbars, window
// borders and so on.  These properties are not supported by IE and IE offers no alternative 
// properties;
var $outerHeight = $innerHeight, $outerWidth = $innerWidth;

// Read-only properties that specify the number of pixels that the current document has been scrolled
//to the right and down.  These are not supported by IE.
var $pageXOffset = 0, $pageYOffset = 0;


// A read-only reference to the Window object that contains this window
// or frame.  If the window is a top-level window, parent refers to
// the window itself.  If this window is a frame, this property refers
// to the window or frame that conatins it.
var $parent = $parentWindow;
try {
    if ($parentWindow.$thisWindowsProxyObject)
        $parent = $parentWindow.$thisWindowsProxyObject;
} catch(e){}



// a read-only refernce to the Screen object that specifies information about the screen: 
// the number of available pixels and the number of available colors.
/**> $screen - see screen.js <**/
// read only properties that specify the coordinates of the upper-left corner of the screen.
var $screenX = 0, $screenY = 0;
var $screenLeft = $screenX, $screenTop = $screenY;

// a read/write string that specifies the current contents of the status line.
var $status = '';

// a read-only reference to the top-level window that contains this window.  If this
// window is a top-level window it is simply a refernce to itself.  If this window 
// is a frame, the top property refers to the top-level window that contains the frame.
var $top = $initTop;

// the window property is identical to the self property and to this obj
var $window = $w;
try {
    if ($w.$thisWindowsProxyObject)
        $window = $w.$thisWindowsProxyObject;
} catch(e){}


$debug("Initializing Window.");
__extend__($w,{
  get closed(){return $closed;},
  get defaultStatus(){return $defaultStatus;},
  set defaultStatus(_defaultStatus){$defaultStatus = _defaultStatus;},
  //get document(){return $document;}, - see document.js
  get event(){return $event;},

  get frames(){return undefined;}, // TODO: not yet any code to maintain list
  get length(){return undefined;}, //   should be frames.length, but.... TODO

  //get history(){return $history;}, - see history.js
  get innerHeight(){return $innerHeight;},
  get innerWidth(){return $innerWidth;},
  get clientHeight(){return $innerHeight;},
  get clientWidth(){return $innerWidth;},
  //get location(){return $location;}, see location.js
  get name(){return $name;},
  set name(newName){ $name = newName; },
  //get navigator(){return $navigator;}, see navigator.js
  get opener(){return $opener;},
  get outerHeight(){return $outerHeight;},
  get outerWidth(){return $outerWidth;},
  get pageXOffest(){return $pageXOffset;},
  get pageYOffset(){return $pageYOffset;},
  get parent(){return $parent;},
  //get screen(){return $screen;}, see screen.js
  get screenLeft(){return $screenLeft;},
  get screenTop(){return $screenTop;},
  get screenX(){return $screenX;},
  get screenY(){return $screenY;},
  get self(){return $window;},
  get status(){return $status;},
  set status(_status){$status = _status;},
  get top(){return $top || $window;},
  get window(){return $window;}
});

$w.open = function(url, name, features, replace){
  if (features)
    $env.warn("'features' argument for 'window.open()' not yet implemented");
  if (replace)
    $env.warn("'replace' argument for 'window.open()' not yet implemented");

  var newWindow = $env.newwindow(this, null, url);
  newWindow.$name = name;
  return newWindow;
};

$w.close = function(){
  $env.unload($w);
  $closed = true;
};     

$env.unload = function(windowToUnload){
  try {
    var event = windowToUnload.document.createEvent();
    event.initEvent("unload");
    windowToUnload.document.getElementsByTagName('body')[0].
      dispatchEvent(event, false);
  }
  catch (e){}   // maybe no/bad document loaded, ignore

  var event = windowToUnload.document.createEvent();
  event.initEvent("unload");
  windowToUnload.dispatchEvent(event, false);
};
  
  
$env.load = function(url){
    $location = $env.location(url);
    __setHistory__($location);
    $w.document.load($location);
};


/* Time related functions - see timer.js
*   - clearTimeout
*   - clearInterval
*   - setTimeout
*   - setInterval
*/

/*
* Events related functions - see event.js
*   - addEventListener
*   - attachEvent
*   - detachEvent
*   - removeEventListener
*   
* These functions are identical to the Element equivalents.
*/

/*
* UIEvents related functions - see uievent.js
*   - blur
*   - focus
*
* These functions are identical to the Element equivalents.
*/

/* Dialog related functions - see dialog.js
*   - alert
*   - confirm
*   - prompt
*/

/* Screen related functions - see screen.js
*   - moveBy
*   - moveTo
*   - print
*   - resizeBy
*   - resizeTo
*   - scrollBy
*   - scrollTo
*/

/* CSS related functions - see css.js
*   - getComputedStyle
*/

/*
* Shared utility methods
*/
// Helper method for extending one object with another.  
function __extend__(a,b) {
	for ( var i in b ) {
		var g = b.__lookupGetter__(i), s = b.__lookupSetter__(i);
		if ( g || s ) {
			if ( g ) a.__defineGetter__(i, g);
			if ( s ) a.__defineSetter__(i, s);
		} else
			a[i] = b[i];
	} return a;
};
	

// from ariel flesler http://flesler.blogspot.com/2008/11/fast-trim-function-for-javascript.html
// this might be a good utility function to provide in the env.core
// as in might be useful to the parser and other areas as well
function trim( str ){
    return (str || "").replace( /^\s+|\s+$/g, "" );
    
};
/*function trim( str ){
    var start = -1,
    end = str.length;
    /*jsl:ignore*
    while( str.charCodeAt(--end) < 33 );
    while( str.charCodeAt(++start) < 33 );
    /*jsl:end*
    return str.slice( start, end + 1 );
};*/

//from jQuery
function __setArray__( target, array ) {
	// Resetting the length to 0, then using the native Array push
	// is a super-fast way to populate an object with array-like properties
	target.length = 0;
	Array.prototype.push.apply( target, array );
};


$debug("Defining NodeList");
/*
* NodeList - DOM Level 2
*/
/**
 * @class  DOMNodeList - provides the abstraction of an ordered collection of nodes
 *
 * @author Jon van Noort (jon@webarcana.com.au)
 *
 * @param  ownerDocument : DOMDocument - the ownerDocument
 * @param  parentNode    : DOMNode - the node that the DOMNodeList is attached to (or null)
 */
var DOMNodeList = function(ownerDocument, parentNode) {
    this.length = 0;
    this.parentNode = parentNode;
    this.ownerDocument = ownerDocument;
    
    this._readonly = false;
    
    __setArray__(this, []);
};
__extend__(DOMNodeList.prototype, {
    item : function(index) {
        var ret = null;
        //$log("NodeList item("+index+") = " + this[index]);
        if ((index >= 0) && (index < this.length)) { // bounds check
            ret = this[index];                    // return selected Node
        }
        
        return ret;                                    // if the index is out of bounds, default value null is returned
    },
    get xml() {
        var ret = "";
        
        // create string containing the concatenation of the string values of each child
        for (var i=0; i < this.length; i++) {
            if(this[i]){
                if(this[i].nodeType == DOMNode.TEXT_NODE && i>0 && this[i-1].nodeType == DOMNode.TEXT_NODE){
                    //add a single space between adjacent text nodes
                    ret += " "+this[i].xml;
                }else{
                    ret += this[i].xml;
                }
            }
        }
        
        return ret;
    },
    toArray: function () {
        var children = [];
        for ( var i=0; i < this.length; i++) {
                children.push (this[i]);
        }
        return children;
    },
    toString: function(){
      return "[ "+(this.length > 0?Array.prototype.join.apply(this, [", "]):"Empty NodeList")+" ]";
    }
});


/**
 * @method DOMNodeList._findItemIndex - find the item index of the node with the specified internal id
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  id : int - unique internal id
 * @return : int
 */
var __findItemIndex__ = function (nodelist, id) {
  var ret = -1;

  // test that id is valid
  if (id > -1) {
    for (var i=0; i<nodelist.length; i++) {
      // compare id to each node's _id
      if (nodelist[i]._id == id) {            // found it!
        ret = i;
        break;
      }
    }
  }

  return ret;                                    // if node is not found, default value -1 is returned
};

/**
 * @method DOMNodeList._insertBefore - insert the specified Node into the NodeList before the specified index
 *   Used by DOMNode.insertBefore(). Note: DOMNode.insertBefore() is responsible for Node Pointer surgery
 *   DOMNodeList._insertBefore() simply modifies the internal data structure (Array).
 *
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  newChild      : DOMNode - the Node to be inserted
 * @param  refChildIndex : int     - the array index to insert the Node before
 */
var __insertBefore__ = function(nodelist, newChild, refChildIndex) {
    if ((refChildIndex >= 0) && (refChildIndex <= nodelist.length)) { // bounds check
        if (newChild.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) {  // node is a DocumentFragment
            // append the children of DocumentFragment
            Array.prototype.splice.apply(nodelist,[refChildIndex, 0].concat(newChild.childNodes.toArray()));
        }
        else {
            // append the newChild
            Array.prototype.splice.apply(nodelist,[refChildIndex, 0, newChild]);
        }
    }
};

/**
 * @method DOMNodeList._replaceChild - replace the specified Node in the NodeList at the specified index
 *   Used by DOMNode.replaceChild(). Note: DOMNode.replaceChild() is responsible for Node Pointer surgery
 *   DOMNodeList._replaceChild() simply modifies the internal data structure (Array).
 *
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  newChild      : DOMNode - the Node to be inserted
 * @param  refChildIndex : int     - the array index to hold the Node
 */
var __replaceChild__ = function(nodelist, newChild, refChildIndex) {
    var ret = null;
    
    if ((refChildIndex >= 0) && (refChildIndex < nodelist.length)) { // bounds check
        ret = nodelist[refChildIndex];            // preserve old child for return
    
        if (newChild.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) {  // node is a DocumentFragment
            // get array containing children prior to refChild
            Array.prototype.splice.apply(nodelist,[refChildIndex, 1].concat(newChild.childNodes.toArray()));
        }
        else {
            // simply replace node in array (links between Nodes are made at higher level)
            nodelist[refChildIndex] = newChild;
        }
    }
    
    return ret;                                   // return replaced node
};

/**
 * @method DOMNodeList._removeChild - remove the specified Node in the NodeList at the specified index
 *   Used by DOMNode.removeChild(). Note: DOMNode.removeChild() is responsible for Node Pointer surgery
 *   DOMNodeList._replaceChild() simply modifies the internal data structure (Array).
 *
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  refChildIndex : int - the array index holding the Node to be removed
 */
var __removeChild__ = function(nodelist, refChildIndex) {
    var ret = null;
    
    if (refChildIndex > -1) {                              // found it!
        ret = nodelist[refChildIndex];                    // return removed node
        
        // rebuild array without removed child
        Array.prototype.splice.apply(nodelist,[refChildIndex, 1]);
    }
    
    return ret;                                   // return removed node
};

/**
 * @method DOMNodeList._appendChild - append the specified Node to the NodeList
 *   Used by DOMNode.appendChild(). Note: DOMNode.appendChild() is responsible for Node Pointer surgery
 *   DOMNodeList._appendChild() simply modifies the internal data structure (Array).
 *
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  newChild      : DOMNode - the Node to be inserted
 */
var __appendChild__ = function(nodelist, newChild) {
    if (newChild.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) {  // node is a DocumentFragment
        // append the children of DocumentFragment
         Array.prototype.push.apply(nodelist, newChild.childNodes.toArray() );
    } else {
        // simply add node to array (links between Nodes are made at higher level)
        Array.prototype.push.apply(nodelist, [newChild]);
    }
    
};

/**
 * @method DOMNodeList._cloneNodes - Returns a NodeList containing clones of the Nodes in this NodeList
 *
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  deep : boolean - If true, recursively clone the subtree under each of the nodes;
 *   if false, clone only the nodes themselves (and their attributes, if it is an Element).
 * @param  parentNode : DOMNode - the new parent of the cloned NodeList
 * @return : DOMNodeList - NodeList containing clones of the Nodes in this NodeList
 */
var __cloneNodes__ = function(nodelist, deep, parentNode) {
    var cloneNodeList = new DOMNodeList(nodelist.ownerDocument, parentNode);
    
    // create list containing clones of each child
    for (var i=0; i < nodelist.length; i++) {
        __appendChild__(cloneNodeList, nodelist[i].cloneNode(deep));
    }
    
    return cloneNodeList;
};

$w.NodeList = DOMNodeList;
/**
 * @class  DOMNamedNodeMap - used to represent collections of nodes that can be accessed by name
 *  typically a set of Element attributes
 *
 * @extends DOMNodeList - note W3C spec says that this is not the case,
 *   but we need an item() method identicle to DOMNodeList's, so why not?
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  ownerDocument : DOMDocument - the ownerDocument
 * @param  parentNode    : DOMNode - the node that the DOMNamedNodeMap is attached to (or null)
 */
var DOMNamedNodeMap = function(ownerDocument, parentNode) {
    //$log("\t\tcreating dom namednodemap");
    this.DOMNodeList = DOMNodeList;
    this.DOMNodeList(ownerDocument, parentNode);
    __setArray__(this, []);
};
DOMNamedNodeMap.prototype = new DOMNodeList;
__extend__(DOMNamedNodeMap.prototype, {
    add: function(name){
        this[this.length] = name;
    },
    getNamedItem : function(name) {
        var ret = null;
        
        // test that Named Node exists
        var itemIndex = __findNamedItemIndex__(this, name);
        
        if (itemIndex > -1) {                          // found it!
            ret = this[itemIndex];                // return NamedNode
        }
        
        return ret;                                    // if node is not found, default value null is returned
    },
    setNamedItem : function(arg) {
      // test for exceptions
      if (__ownerDocument__(this).implementation.errorChecking) {
            // throw Exception if arg was not created by this Document
            if (this.ownerDocument != arg.ownerDocument) {
              throw(new DOMException(DOMException.WRONG_DOCUMENT_ERR));
            }
        
            // throw Exception if DOMNamedNodeMap is readonly
            if (this._readonly || (this.parentNode && this.parentNode._readonly)) {
              throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
            }
        
            // throw Exception if arg is already an attribute of another Element object
            if (arg.ownerElement && (arg.ownerElement != this.parentNode)) {
              throw(new DOMException(DOMException.INUSE_ATTRIBUTE_ERR));
            }
      }
    
      // get item index
      var itemIndex = __findNamedItemIndex__(this, arg.name);
      var ret = null;
    
      if (itemIndex > -1) {                          // found it!
            ret = this[itemIndex];                // use existing Attribute
        
            // throw Exception if DOMAttr is readonly
            if (__ownerDocument__(this).implementation.errorChecking && ret._readonly) {
              throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
            } else {
              this[itemIndex] = arg;                // over-write existing NamedNode
              this[arg.name.toLowerCase()] = arg;
            }
      } else {
            // add new NamedNode
            Array.prototype.push.apply(this, [arg]);
            this[arg.name.toLowerCase()] = arg;
      }
    
      arg.ownerElement = this.parentNode;            // update ownerElement
    
      return ret;                                    // return old node or null
    },
    removeNamedItem : function(name) {
          var ret = null;
          // test for exceptions
          // throw Exception if DOMNamedNodeMap is readonly
          if (__ownerDocument__(this).implementation.errorChecking && 
                (this._readonly || (this.parentNode && this.parentNode._readonly))) {
              throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
          }
        
          // get item index
          var itemIndex = __findNamedItemIndex__(this, name);
        
          // throw Exception if there is no node named name in this map
          if (__ownerDocument__(this).implementation.errorChecking && (itemIndex < 0)) {
            throw(new DOMException(DOMException.NOT_FOUND_ERR));
          }
        
          // get Node
          var oldNode = this[itemIndex];
          //this[oldNode.name] = undefined;
        
          // throw Exception if Node is readonly
          if (__ownerDocument__(this).implementation.errorChecking && oldNode._readonly) {
            throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
          }
        
          // return removed node
          return __removeChild__(this, itemIndex);
    },
    getNamedItemNS : function(namespaceURI, localName) {
          var ret = null;
        
          // test that Named Node exists
          var itemIndex = __findNamedItemNSIndex__(this, namespaceURI, localName);
        
          if (itemIndex > -1) {                          // found it!
            ret = this[itemIndex];                // return NamedNode
          }
        
          return ret;                                    // if node is not found, default value null is returned
    },
    setNamedItemNS : function(arg) {
          // test for exceptions
          if (__ownerDocument__(this).implementation.errorChecking) {
            // throw Exception if DOMNamedNodeMap is readonly
            if (this._readonly || (this.parentNode && this.parentNode._readonly)) {
              throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
            }
        
            // throw Exception if arg was not created by this Document
            if (__ownerDocument__(this) != __ownerDocument__(arg)) {
              throw(new DOMException(DOMException.WRONG_DOCUMENT_ERR));
            }
        
            // throw Exception if arg is already an attribute of another Element object
            if (arg.ownerElement && (arg.ownerElement != this.parentNode)) {
              throw(new DOMException(DOMException.INUSE_ATTRIBUTE_ERR));
            }
          }
        
          // get item index
          var itemIndex = __findNamedItemNSIndex__(this, arg.namespaceURI, arg.localName);
          var ret = null;
        
          if (itemIndex > -1) {                          // found it!
            ret = this[itemIndex];                // use existing Attribute
            // throw Exception if DOMAttr is readonly
            if (__ownerDocument__(this).implementation.errorChecking && ret._readonly) {
              throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
            } else {
              this[itemIndex] = arg;                // over-write existing NamedNode
            }
          }else {
            // add new NamedNode
            Array.prototype.push.apply(this, [arg]);
          }
          arg.ownerElement = this.parentNode;
        
        
          return ret;                                    // return old node or null
    },
    removeNamedItemNS : function(namespaceURI, localName) {
          var ret = null;
        
          // test for exceptions
          // throw Exception if DOMNamedNodeMap is readonly
          if (__ownerDocument__(this).implementation.errorChecking && (this._readonly || (this.parentNode && this.parentNode._readonly))) {
            throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
          }
        
          // get item index
          var itemIndex = __findNamedItemNSIndex__(this, namespaceURI, localName);
        
          // throw Exception if there is no matching node in this map
          if (__ownerDocument__(this).implementation.errorChecking && (itemIndex < 0)) {
            throw(new DOMException(DOMException.NOT_FOUND_ERR));
          }
        
          // get Node
          var oldNode = this[itemIndex];
        
          // throw Exception if Node is readonly
          if (__ownerDocument__(this).implementation.errorChecking && oldNode._readonly) {
            throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
          }
        
          return __removeChild__(this, itemIndex);             // return removed node
    },
    get xml() {
          var ret = "";
        
          // create string containing concatenation of all (but last) Attribute string values (separated by spaces)
          for (var i=0; i < this.length -1; i++) {
            ret += this[i].xml +" ";
          }
        
          // add last Attribute to string (without trailing space)
          if (this.length > 0) {
            ret += this[this.length -1].xml;
          }
        
          return ret;
    }

});

/**
 * @method DOMNamedNodeMap._findNamedItemIndex - find the item index of the node with the specified name
 *
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  name : string - the name of the required node
 * @param  isnsmap : if its a DOMNamespaceNodeMap
 * @return : int
 */
var __findNamedItemIndex__ = function(namednodemap, name, isnsmap) {
  var ret = -1;

  // loop through all nodes
  for (var i=0; i<namednodemap.length; i++) {
    // compare name to each node's nodeName
    if(isnsmap){
        if (namednodemap[i].localName.toLowerCase() == name.toLowerCase()) {         // found it!
          ret = i;
          break;
        }
    }else{
        if (namednodemap[i].name.toLowerCase() == name.toLowerCase()) {         // found it!
          ret = i;
          break;
        }
    }
  }

  return ret;                                    // if node is not found, default value -1 is returned
};

/**
 * @method DOMNamedNodeMap._findNamedItemNSIndex - find the item index of the node with the specified namespaceURI and localName
 *
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  namespaceURI : string - the namespace URI of the required node
 * @param  localName    : string - the local name of the required node
 * @return : int
 */
var __findNamedItemNSIndex__ = function(namednodemap, namespaceURI, localName) {
  var ret = -1;

  // test that localName is not null
  if (localName) {
    // loop through all nodes
    for (var i=0; i<namednodemap.length; i++) {
      // compare name to each node's namespaceURI and localName
      if ((namednodemap[i].namespaceURI.toLowerCase() == namespaceURI.toLowerCase()) && 
          (namednodemap[i].localName.toLowerCase() == localName.toLowerCase())) {
        ret = i;                                 // found it!
        break;
      }
    }
  }

  return ret;                                    // if node is not found, default value -1 is returned
};

/**
 * @method DOMNamedNodeMap._hasAttribute - Returns true if specified node exists
 *
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  name : string - the name of the required node
 * @return : boolean
 */
var __hasAttribute__ = function(namednodemap, name) {
  var ret = false;

  // test that Named Node exists
  var itemIndex = __findNamedItemIndex__(namednodemap, name);

  if (itemIndex > -1) {                          // found it!
    ret = true;                                  // return true
  }

  return ret;                                    // if node is not found, default value false is returned
}

/**
 * @method DOMNamedNodeMap._hasAttributeNS - Returns true if specified node exists
 *
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  namespaceURI : string - the namespace URI of the required node
 * @param  localName    : string - the local name of the required node
 * @return : boolean
 */
var __hasAttributeNS__ = function(namednodemap, namespaceURI, localName) {
  var ret = false;

  // test that Named Node exists
  var itemIndex = __findNamedItemNSIndex__(namednodemap, namespaceURI, localName);

  if (itemIndex > -1) {                          // found it!
    ret = true;                                  // return true
  }

  return ret;                                    // if node is not found, default value false is returned
}

/**
 * @method DOMNamedNodeMap._cloneNodes - Returns a NamedNodeMap containing clones of the Nodes in this NamedNodeMap
 *
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  parentNode : DOMNode - the new parent of the cloned NodeList
 * @param  isnsmap : bool - is this a DOMNamespaceNodeMap
 * @return : DOMNamedNodeMap - NamedNodeMap containing clones of the Nodes in this DOMNamedNodeMap
 */
var __cloneNamedNodes__ = function(namednodemap, parentNode, isnsmap) {
  var cloneNamedNodeMap = isnsmap?
    new DOMNamespaceNodeMap(namednodemap.ownerDocument, parentNode):
    new DOMNamedNodeMap(namednodemap.ownerDocument, parentNode);

  // create list containing clones of all children
  for (var i=0; i < namednodemap.length; i++) {
      $debug("cloning node in named node map :" + namednodemap[i]);
    __appendChild__(cloneNamedNodeMap, namednodemap[i].cloneNode(false));
  }

  return cloneNamedNodeMap;
};


/**
 * @class  DOMNamespaceNodeMap - used to represent collections of namespace nodes that can be accessed by name
 *  typically a set of Element attributes
 *
 * @extends DOMNamedNodeMap
 *
 * @author Jon van Noort (jon@webarcana.com.au)
 *
 * @param  ownerDocument : DOMDocument - the ownerDocument
 * @param  parentNode    : DOMNode - the node that the DOMNamespaceNodeMap is attached to (or null)
 */
var DOMNamespaceNodeMap = function(ownerDocument, parentNode) {
    //$log("\t\t\tcreating dom namespacednodemap");
    this.DOMNamedNodeMap = DOMNamedNodeMap;
    this.DOMNamedNodeMap(ownerDocument, parentNode);
    __setArray__(this, []);
};
DOMNamespaceNodeMap.prototype = new DOMNamedNodeMap;
__extend__(DOMNamespaceNodeMap.prototype, {
    get xml() {
          var ret = "";
        
          // identify namespaces declared local to this Element (ie, not inherited)
          for (var ind = 0; ind < this.length; ind++) {
            // if namespace declaration does not exist in the containing node's, parentNode's namespaces
            var ns = null;
            try {
                var ns = this.parentNode.parentNode._namespaces.
                    getNamedItem(this[ind].localName);
            }
            catch (e) {
                //breaking to prevent default namespace being inserted into return value
                break;
            }
            if (!(ns && (""+ ns.nodeValue == ""+ this[ind].nodeValue))) {
              // display the namespace declaration
              ret += this[ind].xml +" ";
            }
          }
        
          return ret;
    }
});
$debug("Defining Node");
/*
* Node - DOM Level 2
*/	
/**
 * @class  DOMNode - The Node interface is the primary datatype for the entire Document Object Model.
 *   It represents a single node in the document tree.
 * @author Jon van Noort (jon@webarcana.com.au), David Joham (djoham@yahoo.com) and Scott Severtson
 * @param  ownerDocument : DOMDocument - The Document object associated with this node.
 */
var DOMNode = function(ownerDocument) {
  if (ownerDocument) {
    this._id = ownerDocument._genId();           // generate unique internal id
  }
  
  this.namespaceURI = "";                        // The namespace URI of this node (Level 2)
  this.prefix       = "";                        // The namespace prefix of this node (Level 2)
  this.localName    = "";                        // The localName of this node (Level 2)

  this.nodeName = "";                            // The name of this node
  this.nodeValue = null;                           // The value of this node
  //this.className = "";                           // The CSS class name of this node.
  
  // The parent of this node. All nodes, except Document, DocumentFragment, and Attr may have a parent.
  // However, if a node has just been created and not yet added to the tree, or if it has been removed from the tree, this is null
  this.parentNode      = null;

  // A NodeList that contains all children of this node. If there are no children, this is a NodeList containing no nodes.
  // The content of the returned NodeList is "live" in the sense that, for instance, changes to the children of the node object
  // that it was created from are immediately reflected in the nodes returned by the NodeList accessors;
  // it is not a static snapshot of the content of the node. This is true for every NodeList, including the ones returned by the getElementsByTagName method.
  this.childNodes      = new DOMNodeList(ownerDocument, this);

  this.firstChild      = null;                   // The first child of this node. If there is no such node, this is null
  this.lastChild       = null;                   // The last child of this node. If there is no such node, this is null.
  this.previousSibling = null;                   // The node immediately preceding this node. If there is no such node, this is null.
  this.nextSibling     = null;                   // The node immediately following this node. If there is no such node, this is null.

  this.ownerDocument   = ownerDocument;          // The Document object associated with this node
  this.attributes = new DOMNamedNodeMap(this.ownerDocument, this);
  this._namespaces = new DOMNamespaceNodeMap(ownerDocument, this);  // The namespaces in scope for this node
  this._readonly = false;
};

// nodeType constants
DOMNode.ELEMENT_NODE                = 1;
DOMNode.ATTRIBUTE_NODE              = 2;
DOMNode.TEXT_NODE                   = 3;
DOMNode.CDATA_SECTION_NODE          = 4;
DOMNode.ENTITY_REFERENCE_NODE       = 5;
DOMNode.ENTITY_NODE                 = 6;
DOMNode.PROCESSING_INSTRUCTION_NODE = 7;
DOMNode.COMMENT_NODE                = 8;
DOMNode.DOCUMENT_NODE               = 9;
DOMNode.DOCUMENT_TYPE_NODE          = 10;
DOMNode.DOCUMENT_FRAGMENT_NODE      = 11;
DOMNode.NOTATION_NODE               = 12;
DOMNode.NAMESPACE_NODE              = 13;

__extend__(DOMNode.prototype, {
    hasAttributes : function() {
        if (this.attributes.length == 0) {
            return false;
        }else{
            return true;
        }
    },
    insertBefore : function(newChild, refChild) {
        var prevNode;
        
        if(newChild==null){
            return newChild;
        }
        if(refChild==null){
            this.appendChild(newChild);
            return this.newChild;
        }
        
        // test for exceptions
        if (__ownerDocument__(this).implementation.errorChecking) {
            // throw Exception if DOMNode is readonly
            if (this._readonly) {
                throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
            }
            
            // throw Exception if newChild was not created by this Document
            if (__ownerDocument__(this) != __ownerDocument__(newChild)) {
                throw(new DOMException(DOMException.WRONG_DOCUMENT_ERR));
            }
            
            // throw Exception if the node is an ancestor
            if (__isAncestor__(this, newChild)) {
                throw(new DOMException(DOMException.HIERARCHY_REQUEST_ERR));
            }
        }
        
        if (refChild) {                                // if refChild is specified, insert before it
            // find index of refChild
            var itemIndex = __findItemIndex__(this.childNodes, refChild._id);
            // throw Exception if there is no child node with this id
            if (__ownerDocument__(this).implementation.errorChecking && (itemIndex < 0)) {
              throw(new DOMException(DOMException.NOT_FOUND_ERR));
            }
            
            // if the newChild is already in the tree,
            var newChildParent = newChild.parentNode;
            if (newChildParent) {
              // remove it
              newChildParent.removeChild(newChild);
            }
            
            // insert newChild into childNodes
            __insertBefore__(this.childNodes, newChild, itemIndex);
            
            // do node pointer surgery
            prevNode = refChild.previousSibling;
            
            // handle DocumentFragment
            if (newChild.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) {
              if (newChild.childNodes.length > 0) {
                // set the parentNode of DocumentFragment's children
                for (var ind = 0; ind < newChild.childNodes.length; ind++) {
                  newChild.childNodes[ind].parentNode = this;
                }
            
                // link refChild to last child of DocumentFragment
                refChild.previousSibling = newChild.childNodes[newChild.childNodes.length-1];
              }
            }else {
                newChild.parentNode = this;                // set the parentNode of the newChild
                refChild.previousSibling = newChild;       // link refChild to newChild
            }
            
        }else {                                         // otherwise, append to end
            prevNode = this.lastChild;
            this.appendChild(newChild);
        }
        
        if (newChild.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) {
            // do node pointer surgery for DocumentFragment
            if (newChild.childNodes.length > 0) {
                if (prevNode) {  
                    prevNode.nextSibling = newChild.childNodes[0];
                }else {                                         // this is the first child in the list
                    this.firstChild = newChild.childNodes[0];
                }
            
                newChild.childNodes[0].previousSibling = prevNode;
                newChild.childNodes[newChild.childNodes.length-1].nextSibling = refChild;
            }
        }else {
            // do node pointer surgery for newChild
            if (prevNode) {
              prevNode.nextSibling = newChild;
            }else {                                         // this is the first child in the list
              this.firstChild = newChild;
            }
            
            newChild.previousSibling = prevNode;
            newChild.nextSibling     = refChild;
        }
        
        return newChild;
    },
    replaceChild : function(newChild, oldChild) {
        var ret = null;
        
        if(newChild==null || oldChild==null){
            return oldChild;
        }
        
        // test for exceptions
        if (__ownerDocument__(this).implementation.errorChecking) {
            // throw Exception if DOMNode is readonly
            if (this._readonly) {
                throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
            }
        
            // throw Exception if newChild was not created by this Document
            if (__ownerDocument__(this) != __ownerDocument__(newChild)) {
                throw(new DOMException(DOMException.WRONG_DOCUMENT_ERR));
            }
        
            // throw Exception if the node is an ancestor
            if (__isAncestor__(this, newChild)) {
                throw(new DOMException(DOMException.HIERARCHY_REQUEST_ERR));
            }
        }
        
        // get index of oldChild
        var index = __findItemIndex__(this.childNodes, oldChild._id);
        
        // throw Exception if there is no child node with this id
        if (__ownerDocument__(this).implementation.errorChecking && (index < 0)) {
            throw(new DOMException(DOMException.NOT_FOUND_ERR));
        }
        
        // if the newChild is already in the tree,
        var newChildParent = newChild.parentNode;
        if (newChildParent) {
            // remove it
            newChildParent.removeChild(newChild);
        }
        
        // add newChild to childNodes
        ret = __replaceChild__(this.childNodes,newChild, index);
        
        
        if (newChild.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) {
            // do node pointer surgery for Document Fragment
            if (newChild.childNodes.length > 0) {
                for (var ind = 0; ind < newChild.childNodes.length; ind++) {
                    newChild.childNodes[ind].parentNode = this;
                }
                
                if (oldChild.previousSibling) {
                    oldChild.previousSibling.nextSibling = newChild.childNodes[0];
                } else {
                    this.firstChild = newChild.childNodes[0];
                }
                
                if (oldChild.nextSibling) {
                    oldChild.nextSibling.previousSibling = newChild;
                } else {
                    this.lastChild = newChild.childNodes[newChild.childNodes.length-1];
                }
                
                newChild.childNodes[0].previousSibling = oldChild.previousSibling;
                newChild.childNodes[newChild.childNodes.length-1].nextSibling = oldChild.nextSibling;
            }
        } else {
            // do node pointer surgery for newChild
            newChild.parentNode = this;
            
            if (oldChild.previousSibling) {
                oldChild.previousSibling.nextSibling = newChild;
            }else{
                this.firstChild = newChild;
            }
            if (oldChild.nextSibling) {
                oldChild.nextSibling.previousSibling = newChild;
            }else{
                this.lastChild = newChild;
            }
            newChild.previousSibling = oldChild.previousSibling;
            newChild.nextSibling = oldChild.nextSibling;
        }
        
        return ret;
    },
    removeChild : function(oldChild) {
        if(!oldChild){
            return null;
        }
        // throw Exception if DOMNamedNodeMap is readonly
        if (__ownerDocument__(this).implementation.errorChecking && (this._readonly || oldChild._readonly)) {
            throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
        }
        
        // get index of oldChild
        var itemIndex = __findItemIndex__(this.childNodes, oldChild._id);
        
        // throw Exception if there is no child node with this id
        if (__ownerDocument__(this).implementation.errorChecking && (itemIndex < 0)) {
            throw(new DOMException(DOMException.NOT_FOUND_ERR));
        }
        
        // remove oldChild from childNodes
        __removeChild__(this.childNodes, itemIndex);
        
        // do node pointer surgery
        oldChild.parentNode = null;
        
        if (oldChild.previousSibling) {
            oldChild.previousSibling.nextSibling = oldChild.nextSibling;
        }else {
            this.firstChild = oldChild.nextSibling;
        }
        if (oldChild.nextSibling) {
            oldChild.nextSibling.previousSibling = oldChild.previousSibling;
        }else {
            this.lastChild = oldChild.previousSibling;
        }
        
        oldChild.previousSibling = null;
        oldChild.nextSibling = null;
        
        return oldChild;
    },
    appendChild : function(newChild) {
        if(!newChild){
            return null;
        }
      // test for exceptions
      if (__ownerDocument__(this).implementation.errorChecking) {
        // throw Exception if Node is readonly
        if (this._readonly) {
          throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
        }
    
        // throw Exception if arg was not created by this Document
        if (__ownerDocument__(this) != __ownerDocument__(this)) {
          throw(new DOMException(DOMException.WRONG_DOCUMENT_ERR));
        }
    
        // throw Exception if the node is an ancestor
        if (__isAncestor__(this, newChild)) {
          throw(new DOMException(DOMException.HIERARCHY_REQUEST_ERR));
        }
      }
    
      // if the newChild is already in the tree,
      var newChildParent = newChild.parentNode;
      if (newChildParent) {
        // remove it
        newChildParent.removeChild(newChild);
      }
    
      // add newChild to childNodes
      __appendChild__(this.childNodes, newChild);
    
      if (newChild.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) {
        // do node pointer surgery for DocumentFragment
        if (newChild.childNodes.length > 0) {
          for (var ind = 0; ind < newChild.childNodes.length; ind++) {
            newChild.childNodes[ind].parentNode = this;
          }
    
          if (this.lastChild) {
            this.lastChild.nextSibling = newChild.childNodes[0];
            newChild.childNodes[0].previousSibling = this.lastChild;
            this.lastChild = newChild.childNodes[newChild.childNodes.length-1];
          }
          else {
            this.lastChild = newChild.childNodes[newChild.childNodes.length-1];
            this.firstChild = newChild.childNodes[0];
          }
        }
      }
      else {
        // do node pointer surgery for newChild
        newChild.parentNode = this;
        if (this.lastChild) {
          this.lastChild.nextSibling = newChild;
          newChild.previousSibling = this.lastChild;
          this.lastChild = newChild;
        }
        else {
          this.lastChild = newChild;
          this.firstChild = newChild;
        }
      }
      return newChild;
    },
    hasChildNodes : function() {
        return (this.childNodes.length > 0);
    },
    cloneNode: function(deep) {
        // use importNode to clone this Node
        //do not throw any exceptions
        try {
            return __ownerDocument__(this).importNode(this, deep);
        } catch (e) {
            //there shouldn't be any exceptions, but if there are, return null
            // may want to warn: $debug("could not clone node: "+e.code);
            return null;
        }
    },
    normalize : function() {
        var inode;
        var nodesToRemove = new DOMNodeList();
        
        if (this.nodeType == DOMNode.ELEMENT_NODE || this.nodeType == DOMNode.DOCUMENT_NODE) {
            var adjacentTextNode = null;
        
            // loop through all childNodes
            for(var i = 0; i < this.childNodes.length; i++) {
                inode = this.childNodes.item(i);
            
                if (inode.nodeType == DOMNode.TEXT_NODE) { // this node is a text node
                    if (inode.length < 1) {                  // this text node is empty
                        __appendChild__(nodesToRemove, inode);      // add this node to the list of nodes to be remove
                    }else {
                        if (adjacentTextNode) {                // if previous node was also text
                            adjacentTextNode.appendData(inode.data);     // merge the data in adjacent text nodes
                            __appendChild__(nodesToRemove, inode);    // add this node to the list of nodes to be removed
                        }else {
                            adjacentTextNode = inode;              // remember this node for next cycle
                        }
                    }
                } else {
                    adjacentTextNode = null;                 // (soon to be) previous node is not a text node
                    inode.normalize();                       // normalise non Text childNodes
                }
            }
                
            // remove redundant Text Nodes
            for(var i = 0; i < nodesToRemove.length; i++) {
                inode = nodesToRemove.item(i);
                inode.parentNode.removeChild(inode);
            }
        }
    },
    isSupported : function(feature, version) {
        // use Implementation.hasFeature to determin if this feature is supported
        return __ownerDocument__(this).implementation.hasFeature(feature, version);
    },
    getElementsByTagName : function(tagname) {
        // delegate to _getElementsByTagNameRecursive
        // recurse childNodes
        var nodelist = new DOMNodeList(__ownerDocument__(this));
        for(var i = 0; i < this.childNodes.length; i++) {
            nodeList = __getElementsByTagNameRecursive__(this.childNodes.item(i), tagname, nodelist);
        }
        return nodelist;
    },
    getElementsByTagNameNS : function(namespaceURI, localName) {
        // delegate to _getElementsByTagNameNSRecursive
        return __getElementsByTagNameNSRecursive__(this, namespaceURI, localName, 
            new DOMNodeList(__ownerDocument__(this)));
    },
    importNode : function(importedNode, deep) {
        
        var importNode;

        // debug("importing node " + importedNode.nodeName + "(" + importedNode.nodeType + ")" + "(?deep = "+deep+")");

        //there is no need to perform namespace checks since everything has already gone through them
        //in order to have gotten into the DOM in the first place. The following line
        //turns namespace checking off in ._isValidNamespace
        __ownerDocument__(this)._performingImportNodeOperation = true;
        
            if (importedNode.nodeType == DOMNode.ELEMENT_NODE) {
                if (!__ownerDocument__(this).implementation.namespaceAware) {
                    // create a local Element (with the name of the importedNode)
                    importNode = __ownerDocument__(this).createElement(importedNode.tagName);
                
                    // create attributes matching those of the importedNode
                    for(var i = 0; i < importedNode.attributes.length; i++) {
                        importNode.setAttribute(importedNode.attributes.item(i).name, importedNode.attributes.item(i).value);
                    }
                }else {
                    // create a local Element (with the name & namespaceURI of the importedNode)
                    importNode = __ownerDocument__(this).createElementNS(importedNode.namespaceURI, importedNode.nodeName);
                
                    // create attributes matching those of the importedNode
                    for(var i = 0; i < importedNode.attributes.length; i++) {
                        importNode.setAttributeNS(importedNode.attributes.item(i).namespaceURI, 
                            importedNode.attributes.item(i).name, importedNode.attributes.item(i).value);
                    }
                
                    // create namespace definitions matching those of the importedNode
                    for(var i = 0; i < importedNode._namespaces.length; i++) {
                        importNode._namespaces[i] = __ownerDocument__(this).createNamespace(importedNode._namespaces.item(i).localName);
                        importNode._namespaces[i].value = importedNode._namespaces.item(i).value;
                    }
                }
            } else if (importedNode.nodeType == DOMNode.ATTRIBUTE_NODE) {
                if (!__ownerDocument__(this).implementation.namespaceAware) {
                    // create a local Attribute (with the name of the importedAttribute)
                    importNode = __ownerDocument__(this).createAttribute(importedNode.name);
                } else {
                    // create a local Attribute (with the name & namespaceURI of the importedAttribute)
                    importNode = __ownerDocument__(this).createAttributeNS(importedNode.namespaceURI, importedNode.nodeName);
                
                    // create namespace definitions matching those of the importedAttribute
                    for(var i = 0; i < importedNode._namespaces.length; i++) {
                        importNode._namespaces[i] = __ownerDocument__(this).createNamespace(importedNode._namespaces.item(i).localName);
                        importNode._namespaces[i].value = importedNode._namespaces.item(i).value;
                    }
                }
            
                // set the value of the local Attribute to match that of the importedAttribute
                importNode.value = importedNode.value;
                
            } else if (importedNode.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) {
                // create a local DocumentFragment
                importNode = __ownerDocument__(this).createDocumentFragment();
            } else if (importedNode.nodeType == DOMNode.NAMESPACE_NODE) {
                // create a local NamespaceNode (with the same name & value as the importedNode)
                importNode = __ownerDocument__(this).createNamespace(importedNode.nodeName);
                importNode.value = importedNode.value;
            } else if (importedNode.nodeType == DOMNode.TEXT_NODE) {
                // create a local TextNode (with the same data as the importedNode)
                importNode = __ownerDocument__(this).createTextNode(importedNode.data);
            } else if (importedNode.nodeType == DOMNode.CDATA_SECTION_NODE) {
                // create a local CDATANode (with the same data as the importedNode)
                importNode = __ownerDocument__(this).createCDATASection(importedNode.data);
            } else if (importedNode.nodeType == DOMNode.PROCESSING_INSTRUCTION_NODE) {
                // create a local ProcessingInstruction (with the same target & data as the importedNode)
                importNode = __ownerDocument__(this).createProcessingInstruction(importedNode.target, importedNode.data);
            } else if (importedNode.nodeType == DOMNode.COMMENT_NODE) {
                // create a local Comment (with the same data as the importedNode)
                importNode = __ownerDocument__(this).createComment(importedNode.data);
            } else {  // throw Exception if nodeType is not supported
                throw(new DOMException(DOMException.NOT_SUPPORTED_ERR));
            }
            
            if (deep) {                                    // recurse childNodes
                for(var i = 0; i < importedNode.childNodes.length; i++) {
                    importNode.appendChild(__ownerDocument__(this).importNode(importedNode.childNodes.item(i), true));
                }
            }
            
            //reset _performingImportNodeOperation
            __ownerDocument__(this)._performingImportNodeOperation = false;
            return importNode;
        
    },
    contains : function(node){
            while(node && node != this ){
                node = node.parentNode;
            }
            return !!node;
    },
    compareDocumentPosition : function(b){
        var a = this;
        var number = (a != b && a.contains(b) && 16) + (a != b && b.contains(a) && 8);
        //find position of both
        var all = document.getElementsByTagName("*");
        var my_location = 0, node_location = 0;
        for(var i=0; i < all.length; i++){
            if(all[i] == a) my_location = i;
            if(all[i] == b) node_location = i;
            if(my_location && node_location) break;
        }
        number += (my_location < node_location && 4)
        number += (my_location > node_location && 2)
        return number;
    } 

});



/**
 * @method DOMNode._getElementsByTagNameRecursive - implements getElementsByTagName()
 * @param  elem     : DOMElement  - The element which are checking and then recursing into
 * @param  tagname  : string      - The name of the tag to match on. The special value "*" matches all tags
 * @param  nodeList : DOMNodeList - The accumulating list of matching nodes
 *
 * @return : DOMNodeList
 */
var __getElementsByTagNameRecursive__ = function (elem, tagname, nodeList) {
    
    if (elem.nodeType == DOMNode.ELEMENT_NODE || elem.nodeType == DOMNode.DOCUMENT_NODE) {
    
        if(elem.nodeType !== DOMNode.DOCUMENT_NODE && 
            ((elem.nodeName.toUpperCase() == tagname.toUpperCase()) || 
                (tagname == "*")) ){
            __appendChild__(nodeList, elem);               // add matching node to nodeList
        }
    
        // recurse childNodes
        for(var i = 0; i < elem.childNodes.length; i++) {
            nodeList = __getElementsByTagNameRecursive__(elem.childNodes.item(i), tagname, nodeList);
        }
    }
    
    return nodeList;
};

/**
 * @method DOMNode._getElementsByTagNameNSRecursive - implements getElementsByTagName()
 *
 * @param  elem     : DOMElement  - The element which are checking and then recursing into
 * @param  namespaceURI : string - the namespace URI of the required node
 * @param  localName    : string - the local name of the required node
 * @param  nodeList     : DOMNodeList - The accumulating list of matching nodes
 *
 * @return : DOMNodeList
 */
var __getElementsByTagNameNSRecursive__ = function(elem, namespaceURI, localName, nodeList) {
  if (elem.nodeType == DOMNode.ELEMENT_NODE || elem.nodeType == DOMNode.DOCUMENT_NODE) {

    if (((elem.namespaceURI == namespaceURI) || (namespaceURI == "*")) && ((elem.localName == localName) || (localName == "*"))) {
      __appendChild__(nodeList, elem);               // add matching node to nodeList
    }

    // recurse childNodes
    for(var i = 0; i < elem.childNodes.length; i++) {
      nodeList = __getElementsByTagNameNSRecursive__(elem.childNodes.item(i), namespaceURI, localName, nodeList);
    }
  }

  return nodeList;
};

/**
 * @method DOMNode._isAncestor - returns true if node is ancestor of target
 * @param  target         : DOMNode - The node we are using as context
 * @param  node         : DOMNode - The candidate ancestor node
 * @return : boolean
 */
var __isAncestor__ = function(target, node) {
  // if this node matches, return true,
  // otherwise recurse up (if there is a parentNode)
  return ((target == node) || ((target.parentNode) && (__isAncestor__(target.parentNode, node))));
};

var __ownerDocument__ = function(node){
    return (node.nodeType == DOMNode.DOCUMENT_NODE)?node:node.ownerDocument;
};

$w.Node = DOMNode;

/**
 * @class  DOMNamespace - The Namespace interface represents an namespace in an Element object
 *
 * @extends DOMNode
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  ownerDocument : DOMDocument - The Document object associated with this node.
 */
var DOMNamespace = function(ownerDocument) {
  this.DOMNode = DOMNode;
  this.DOMNode(ownerDocument);

  this.name      = "";                           // the name of this attribute

  // If this attribute was explicitly given a value in the original document, this is true; otherwise, it is false.
  // Note that the implementation is in charge of this attribute, not the user.
  // If the user changes the value of the attribute (even if it ends up having the same value as the default value)
  // then the specified flag is automatically flipped to true
  this.specified = false;
};
DOMNamespace.prototype = new DOMNode;
__extend__(DOMNamespace.prototype, {
    get value(){
        // the value of the attribute is returned as a string
        return this.nodeValue;
    },
    set value(value){
        this.nodeValue = value+'';
    },
    get nodeType(){
        return DOMNode.NAMESPACE_NODE;
    },
    get xml(){
        var ret = "";

          // serialize Namespace Declaration
          if (this.nodeName != "") {
            ret += this.nodeName +"=\""+ __escapeXML__(this.nodeValue) +"\"";
          }
          else {  // handle default namespace
            ret += "xmlns=\""+ __escapeXML__(this.nodeValue) +"\"";
          }
        
          return ret;
    },
    toString: function(){
        return "Namespace #" + this.id;
    }
});

$debug("Defining CharacterData");
/*
* CharacterData - DOM Level 2
*/
/**
 * @class  DOMCharacterData - parent abstract class for DOMText and DOMComment
 * @extends DOMNode
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  ownerDocument : DOMDocument - The Document object associated with this node.
 */
var DOMCharacterData = function(ownerDocument) {
  this.DOMNode  = DOMNode;
  this.DOMNode(ownerDocument);
};
DOMCharacterData.prototype = new DOMNode;
__extend__(DOMCharacterData.prototype,{
    get data(){
        return this.nodeValue;
    },
    set data(data){
        this.nodeValue = data;
    },
    get length(){return this.nodeValue.length;},
    appendData: function(arg){
        // throw Exception if DOMCharacterData is readonly
        if (__ownerDocument__(this).implementation.errorChecking && this._readonly) {
            throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
        }
        // append data
        this.data = "" + this.data + arg;
    },
    deleteData: function(offset, count){ 
        // throw Exception if DOMCharacterData is readonly
        if (__ownerDocument__(this).implementation.errorChecking && this._readonly) {
            throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
        }
        if (this.data) {
            // throw Exception if offset is negative or greater than the data length,
            if (__ownerDocument__(this).implementation.errorChecking && 
                ((offset < 0) || (offset >  this.data.length) || (count < 0))) {
                throw(new DOMException(DOMException.INDEX_SIZE_ERR));
            }
            
            // delete data
            if(!count || (offset + count) > this.data.length) {
              this.data = this.data.substring(0, offset);
            }else {
              this.data = this.data.substring(0, offset).
                concat(this.data.substring(offset + count));
            }
        }
    },
    insertData: function(offset, arg){
        // throw Exception if DOMCharacterData is readonly
        if(__ownerDocument__(this).implementation.errorChecking && this._readonly){
            throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
        }
        
        if(this.data){
            // throw Exception if offset is negative or greater than the data length,
            if (__ownerDocument__(this).implementation.errorChecking && 
                ((offset < 0) || (offset >  this.data.length))) {
                throw(new DOMException(DOMException.INDEX_SIZE_ERR));
            }
            
            // insert data
            this.data =  this.data.substring(0, offset).concat(arg, this.data.substring(offset));
        }else {
            // throw Exception if offset is negative or greater than the data length,
            if (__ownerDocument__(this).implementation.errorChecking && (offset != 0)) {
               throw(new DOMException(DOMException.INDEX_SIZE_ERR));
            }
            
            // set data
            this.data = arg;
        }
    },
    replaceData: function(offset, count, arg){
        // throw Exception if DOMCharacterData is readonly
        if (__ownerDocument__(this).implementation.errorChecking && this._readonly) {
            throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
        }
        
        if (this.data) {
            // throw Exception if offset is negative or greater than the data length,
            if (__ownerDocument__(this).implementation.errorChecking && 
                ((offset < 0) || (offset >  this.data.length) || (count < 0))) {
                throw(new DOMException(DOMException.INDEX_SIZE_ERR));
            }
            
            // replace data
            this.data = this.data.substring(0, offset).
                concat(arg, this.data.substring(offset + count));
        }else {
            // set data
            this.data = arg;
        }
    },
    substringData: function(offset, count){
        var ret = null;
        if (this.data) {
            // throw Exception if offset is negative or greater than the data length,
            // or the count is negative
            if (__ownerDocument__(this).implementation.errorChecking && 
                ((offset < 0) || (offset > this.data.length) || (count < 0))) {
                throw(new DOMException(DOMException.INDEX_SIZE_ERR));
            }
            // if count is not specified
            if (!count) {
                ret = this.data.substring(offset); // default to 'end of string'
            }else{
                ret = this.data.substring(offset, offset + count);
            }
        }
        return ret;
    }
});

$w.CharacterData = DOMCharacterData;$debug("Defining Text");
/*
* Text - DOM Level 2
*/
/**
 * @class  DOMText - The Text interface represents the textual content (termed character data in XML) of an Element or Attr.
 *   If there is no markup inside an element's content, the text is contained in a single object implementing the Text interface
 *   that is the only child of the element. If there is markup, it is parsed into a list of elements and Text nodes that form the
 *   list of children of the element.
 * @extends DOMCharacterData
 * @author Jon van Noort (jon@webarcana.com.au) and David Joham (djoham@yahoo.com)
 * @param  ownerDocument : DOMDocument - The Document object associated with this node.
 */
var DOMText = function(ownerDocument) {
  this.DOMCharacterData  = DOMCharacterData;
  this.DOMCharacterData(ownerDocument);

  this.nodeName  = "#text";
};
DOMText.prototype = new DOMCharacterData;
__extend__(DOMText.prototype,{
    //Breaks this Text node into two Text nodes at the specified offset,
    // keeping both in the tree as siblings. This node then only contains all the content up to the offset point.
    // And a new Text node, which is inserted as the next sibling of this node, contains all the content at and after the offset point.
    splitText : function(offset) {
        var data, inode;
        
        // test for exceptions
        if (__ownerDocument__(this).implementation.errorChecking) {
            // throw Exception if Node is readonly
            if (this._readonly) {
              throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
            }
            
            // throw Exception if offset is negative or greater than the data length,
            if ((offset < 0) || (offset > this.data.length)) {
              throw(new DOMException(DOMException.INDEX_SIZE_ERR));
            }
        }
        
        if (this.parentNode) {
            // get remaining string (after offset)
            data  = this.substringData(offset);
            
            // create new TextNode with remaining string
            inode = __ownerDocument__(this).createTextNode(data);
            
            // attach new TextNode
            if (this.nextSibling) {
              this.parentNode.insertBefore(inode, this.nextSibling);
            }
            else {
              this.parentNode.appendChild(inode);
            }
            
            // remove remaining string from original TextNode
            this.deleteData(offset);
        }
        
        return inode;
    },
    get nodeType(){
        return DOMNode.TEXT_NODE;
    },
    get xml(){
        return __escapeXML__(""+ this.nodeValue);
        //return ""+ this.nodeValue;
    },
    toString: function(){
        return "Text #" + this._id;    
    }
});

$w.Text = DOMText;$debug("Defining CDATASection");
/*
* CDATASection - DOM Level 2
*/
/**
 * @class  DOMCDATASection - CDATA sections are used to escape blocks of text containing characters that would otherwise be regarded as markup.
 *   The only delimiter that is recognized in a CDATA section is the "\]\]\>" string that ends the CDATA section
 * @extends DOMCharacterData
 * @author Jon van Noort (jon@webarcana.com.au) and David Joham (djoham@yahoo.com)
 * @param  ownerDocument : DOMDocument - The Document object associated with this node.
 */
var DOMCDATASection = function(ownerDocument) {
  this.DOMText  = DOMText;
  this.DOMText(ownerDocument);

  this.nodeName  = "#cdata-section";
};
DOMCDATASection.prototype = new DOMText;
__extend__(DOMCDATASection.prototype,{
    get nodeType(){
        return DOMNode.CDATA_SECTION_NODE;
    },
    get xml(){
        return "<![CDATA[" + this.nodeValue + "]]>";
    },
    toString : function(){
        return "CDATA #"+this._id;
    }
});

$w.CDATASection = DOMCDATASection;$debug("Defining Comment");
/* 
* Comment - DOM Level 2
*/
/**
 * @class  DOMComment - This represents the content of a comment, i.e., all the characters between the starting '<!--' and ending '-->'
 * @extends DOMCharacterData
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  ownerDocument : DOMDocument - The Document object associated with this node.
 */
var DOMComment = function(ownerDocument) {
  this.DOMCharacterData  = DOMCharacterData;
  this.DOMCharacterData(ownerDocument);

  this.nodeName  = "#comment";
};
DOMComment.prototype = new DOMCharacterData;
__extend__(DOMComment.prototype, {
    get nodeType(){
        return DOMNode.COMMENT_NODE;
    },
    get xml(){
        return "<!--" + this.nodeValue + "-->";
    },
    toString : function(){
        return "Comment #"+this._id;
    }
});

$w.Comment = DOMComment;
$debug("Defining DocumentType");
;/*
* DocumentType - DOM Level 2
*/
var DOMDocumentType    = function() { 
    $error("DOMDocumentType.constructor(): Not Implemented"   ); 
};

$w.DocumentType = DOMDocumentType;
$debug("Defining Attr");
/*
* Attr - DOM Level 2
*/
/**
 * @class  DOMAttr - The Attr interface represents an attribute in an Element object
 * @extends DOMNode
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  ownerDocument : DOMDocument - The Document object associated with this node.
 */
var DOMAttr = function(ownerDocument) {
    this.DOMNode = DOMNode;
    this.DOMNode(ownerDocument);
                   
    this.ownerElement = null;               // set when Attr is added to NamedNodeMap
};
DOMAttr.prototype = new DOMNode; 
__extend__(DOMAttr.prototype, {
    // the name of this attribute
    get name(){
        return this.nodeName;
    },
    set name(name){
        this.nodeName = name;
    },
    // the value of the attribute is returned as a string
    get value(){
        return this.nodeValue;
    },
    set value(value){
        // throw Exception if Attribute is readonly
        if (__ownerDocument__(this).implementation.errorChecking && this._readonly) {
            throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
        }
        // delegate to node
        this.nodeValue = value;
    },
    get specified(){
        return (this!==null&&this!=undefined);
    },
    get nodeType(){
        return DOMNode.ATTRIBUTE_NODE;
    },
    get xml(){
        if(this.nodeValue)
            return this.nodeName + '="' + __escapeXML__(this.nodeValue+"") + '" ';
        else
            return '';
    },
    toString : function(){
        return "Attr #" + this._id + " " + this.name;
    }
});

$w.Attr = DOMAttr;
$debug("Defining Element");
/**
 * @class  DOMElement - By far the vast majority of objects (apart from text) that authors encounter
 *   when traversing a document are Element nodes.
 * @extends DOMNode
 * @author Jon van Noort (jon@webarcana.com.au) and David Joham (djoham@yahoo.com)
 * @param  ownerDocument : DOMDocument - The Document object associated with this node.
 */
var DOMElement = function(ownerDocument) {
    this.DOMNode  = DOMNode;
    this.DOMNode(ownerDocument);                   
    //this.id = null;                                  // the ID of the element
};
DOMElement.prototype = new DOMNode;
__extend__(DOMElement.prototype, {	
    // The name of the element.
    get tagName(){
        return this.nodeName;  
    },
    set tagName(name){
        this.nodeName = name;  
    },
    addEventListener        : function(){ window.addEventListener.apply(this, arguments) },
	removeEventListener     : function(){ window.removeEventListener.apply(this, arguments) },
	dispatchEvent           : function(){ window.dispatchEvent.apply(this, arguments) },
    getAttribute: function(name) {
        var ret = null;
        // if attribute exists, use it
        var attr = this.attributes.getNamedItem(name);
        if (attr) {
            ret = attr.value;
        }
        return ret; // if Attribute exists, return its value, otherwise, return null
    },
    setAttribute : function (name, value) {
        // if attribute exists, use it
        var attr = this.attributes.getNamedItem(name);
        
        //I had to add this check becuase as the script initializes
        //the id may be set in the constructor, and the html element
        //overrides the id property with a getter/setter.
        if(__ownerDocument__(this)){
            if (attr===null||attr===undefined) {
                attr = __ownerDocument__(this).createAttribute(name);  // otherwise create it
            }
            
            
            // test for exceptions
            if (__ownerDocument__(this).implementation.errorChecking) {
                // throw Exception if Attribute is readonly
                if (attr._readonly) {
                    throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
                }
                
                // throw Exception if the value string contains an illegal character
                if (!__isValidString__(value)) {
                    throw(new DOMException(DOMException.INVALID_CHARACTER_ERR));
                }
            }
            
            /*if (__isIdDeclaration__(name)) {
                this.id = value;  // cache ID for getElementById()
            }*/
            
            // assign values to properties (and aliases)
            attr.value     = value + '';
            
            // add/replace Attribute in NamedNodeMap
            this.attributes.setNamedItem(attr);
        }else{
            $warn('Element has no owner document '+this.tagName+'\n\t cant set attribute ' + name + ' = '+value );
        }
    },
    removeAttribute : function removeAttribute(name) {
        // delegate to DOMNamedNodeMap.removeNamedItem
        return this.attributes.removeNamedItem(name);
    },
    getAttributeNode : function getAttributeNode(name) {
        // delegate to DOMNamedNodeMap.getNamedItem
        return this.attributes.getNamedItem(name);
    },
    setAttributeNode: function(newAttr) {
        // if this Attribute is an ID
        if (__isIdDeclaration__(newAttr.name)) {
            this.id = newAttr.value;  // cache ID for getElementById()
        }
        // delegate to DOMNamedNodeMap.setNamedItem
        return this.attributes.setNamedItem(newAttr);
    },
    removeAttributeNode: function(oldAttr) {
      // throw Exception if Attribute is readonly
      if (__ownerDocument__(this).implementation.errorChecking && oldAttr._readonly) {
        throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
      }
    
      // get item index
      var itemIndex = this.attributes._findItemIndex(oldAttr._id);
    
      // throw Exception if node does not exist in this map
      if (__ownerDocument__(this).implementation.errorChecking && (itemIndex < 0)) {
        throw(new DOMException(DOMException.NOT_FOUND_ERR));
      }
    
      return this.attributes._removeChild(itemIndex);
    },
    getAttributeNS : function(namespaceURI, localName) {
        var ret = "";
        // delegate to DOMNAmedNodeMap.getNamedItemNS
        var attr = this.attributes.getNamedItemNS(namespaceURI, localName);
        if (attr) {
            ret = attr.value;
        }
        return ret;  // if Attribute exists, return its value, otherwise return ""
    },
    setAttributeNS : function(namespaceURI, qualifiedName, value) {
        // call DOMNamedNodeMap.getNamedItem
        var attr = this.attributes.getNamedItem(namespaceURI, qualifiedName);
        
        if (!attr) {  // if Attribute exists, use it
            // otherwise create it
            attr = __ownerDocument__(this).createAttributeNS(namespaceURI, qualifiedName);
        }
        
        var value = value+'';
        
        // test for exceptions
        if (__ownerDocument__(this).implementation.errorChecking) {
            // throw Exception if Attribute is readonly
            if (attr._readonly) {
                throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
            }
            
            // throw Exception if the Namespace is invalid
            if (!__isValidNamespace__(namespaceURI, qualifiedName)) {
                throw(new DOMException(DOMException.NAMESPACE_ERR));
            }
            
            // throw Exception if the value string contains an illegal character
            if (!__isValidString__(value)) {
                throw(new DOMException(DOMException.INVALID_CHARACTER_ERR));
            }
        }
        
        // if this Attribute is an ID
        if (__isIdDeclaration__(name)) {
            this.id = value;  // cache ID for getElementById()
        }
        
        // assign values to properties (and aliases)
        attr.value     = value;
        attr.nodeValue = value;
        
        // delegate to DOMNamedNodeMap.setNamedItem
        this.attributes.setNamedItemNS(attr);
    },
    removeAttributeNS : function(namespaceURI, localName) {
        // delegate to DOMNamedNodeMap.removeNamedItemNS
        return this.attributes.removeNamedItemNS(namespaceURI, localName);
    },
    getAttributeNodeNS : function(namespaceURI, localName) {
        // delegate to DOMNamedNodeMap.getNamedItemNS
        return this.attributes.getNamedItemNS(namespaceURI, localName);
    },
    setAttributeNodeNS : function(newAttr) {
        // if this Attribute is an ID
        if ((newAttr.prefix == "") &&  __isIdDeclaration__(newAttr.name)) {
            this.id = newAttr.value+'';  // cache ID for getElementById()
        }
        
        // delegate to DOMNamedNodeMap.setNamedItemNS
        return this.attributes.setNamedItemNS(newAttr);
    },
    hasAttribute : function(name) {
        // delegate to DOMNamedNodeMap._hasAttribute
        return __hasAttribute__(this.attributes,name);
    },
    hasAttributeNS : function(namespaceURI, localName) {
        // delegate to DOMNamedNodeMap._hasAttributeNS
        return __hasAttributeNS__(this.attributes, namespaceURI, localName);
    },
    get nodeType(){
        return DOMNode.ELEMENT_NODE;
    },
    get xml() {
        var ret = "";
        
        // serialize namespace declarations
        var ns = this._namespaces.xml;
        if (ns.length > 0) ns = " "+ ns;
        
        // serialize Attribute declarations
        var attrs = this.attributes.xml;
        if (attrs.length > 0) attrs = " "+ attrs;
        
        // serialize this Element
        ret += "<" + this.nodeName.toLowerCase() + ns + attrs +">";
        ret += this.childNodes.xml;
        ret += "</" + this.nodeName.toLowerCase()+">";
        
        return ret;
    },
    toString : function(){
        return "Element #"+this._id + " "+ this.tagName + (this.id?" => "+this.id:'');
    }
});

$w.Element = DOMElement;
/**
 * @class  DOMException - raised when an operation is impossible to perform
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  code : int - the exception code (one of the DOMException constants)
 */
var DOMException = function(code) {
  this.code = code;
};

// DOMException constants
// Introduced in DOM Level 1:
DOMException.INDEX_SIZE_ERR                 = 1;
DOMException.DOMSTRING_SIZE_ERR             = 2;
DOMException.HIERARCHY_REQUEST_ERR          = 3;
DOMException.WRONG_DOCUMENT_ERR             = 4;
DOMException.INVALID_CHARACTER_ERR          = 5;
DOMException.NO_DATA_ALLOWED_ERR            = 6;
DOMException.NO_MODIFICATION_ALLOWED_ERR    = 7;
DOMException.NOT_FOUND_ERR                  = 8;
DOMException.NOT_SUPPORTED_ERR              = 9;
DOMException.INUSE_ATTRIBUTE_ERR            = 10;

// Introduced in DOM Level 2:
DOMException.INVALID_STATE_ERR              = 11;
DOMException.SYNTAX_ERR                     = 12;
DOMException.INVALID_MODIFICATION_ERR       = 13;
DOMException.NAMESPACE_ERR                  = 14;
DOMException.INVALID_ACCESS_ERR             = 15;
$debug("Defining DocumentFragment");
/* 
* DocumentFragment - DOM Level 2
*/
/**
 * @class  DOMDocumentFragment - DocumentFragment is a "lightweight" or "minimal" Document object.
 * @extends DOMNode
 * @author Jon van Noort (jon@webarcana.com.au) and David Joham (djoham@yahoo.com)
 * @param  ownerDocument : DOMDocument - The Document object associated with this node.
 */
var DOMDocumentFragment = function(ownerDocument) {
  this.DOMNode = DOMNode;
  this.DOMNode(ownerDocument);
  this.nodeName  = "#document-fragment";
};
DOMDocumentFragment.prototype = new DOMNode;
__extend__(DOMDocumentFragment.prototype,{
    get nodeType(){
        return DOMNode.DOCUMENT_FRAGMENT_NODE;
    },
    get xml(){
        var xml = "",
            count = this.childNodes.length;
        
        // create string concatenating the serialized ChildNodes
        for (var i = 0; i < count; i++) {
            xml += this.childNodes.item(i).xml;
        }
        
        return xml;
    },
    toString : function(){
        return "DocumentFragment #"+this._id;
    }
});

$w.DocumentFragment = DOMDocumentFragment;
$debug("Defining ProcessingInstruction");
/*
* ProcessingInstruction - DOM Level 2
*/
/**
 * @class  DOMProcessingInstruction - The ProcessingInstruction interface represents a "processing instruction",
 *   used in XML as a way to keep processor-specific information in the text of the document
 * @extends DOMNode
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  ownerDocument : DOMDocument - The Document object associated with this node.
 */
var DOMProcessingInstruction = function(ownerDocument) {
  this.DOMNode  = DOMNode;
  this.DOMNode(ownerDocument);
};
DOMProcessingInstruction.prototype = new DOMNode;
__extend__(DOMProcessingInstruction.prototype, {
    get data(){
        return this.nodeValue;
    },
    set data(data){
        // throw Exception if DOMNode is readonly
        if (__ownerDocument__(this).errorChecking && this._readonly) {
            throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));
        }
        this.nodeValue = data;
    },
    get target(){
      // The target of this processing instruction.
      // XML defines this as being the first token following the markup that begins the processing instruction.
      // The content of this processing instruction.
        return this.nodeName;
    },
    set target(value){
      // The target of this processing instruction.
      // XML defines this as being the first token following the markup that begins the processing instruction.
      // The content of this processing instruction.
        this.nodeName = value;
    },
    get nodeType(){
        return DOMNode.PROCESSING_INSTRUCTION_NODE;
    },
    get xml(){
        return "<?" + this.nodeName +" "+ this.nodeValue + " ?>";
    },
    toString : function(){
        return "ProcessingInstruction #"+this._id;
    }
});

$w.ProcessesingInstruction = DOMProcessingInstruction;
$debug("Defining DOMParser");
/*
* DOMParser
*/

var DOMParser = function(){};
__extend__(DOMParser.prototype,{
    parseFromString: function(xmlString){
        $debug("Parsing XML String: " +xmlString);
        return document.implementation.createDocument().loadXML(xmlString);
    }
});

$debug("Initializing Internal DOMParser.");
//keep one around for internal use
$domparser = new DOMParser();

$w.DOMParser = DOMParser;
// =========================================================================
//
// xmlsax.js - an XML SAX parser in JavaScript.
//
// version 3.1
//
// =========================================================================
//
// Copyright (C) 2001 - 2002 David Joham (djoham@yahoo.com) and Scott Severtson
//
// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.

// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.

// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//
//
// Visit the XML for <SCRIPT> home page at http://xmljs.sourceforge.net
//

// CONSTANTS
var whitespace = "\n\r\t ";


/**
*   function:   this is the constructor to the XMLP Object
*   Author:   Scott Severtson
*   Description:XMLP is a pull-based parser. The calling application passes in a XML string
*   to the constructor, then repeatedly calls .next() to parse the next segment.
*   .next() returns a flag indicating what type of segment was found, and stores
*   data temporarily in couple member variables (name, content, array of
*   attributes), which can be accessed by several .get____() methods.
*
*   Basically, XMLP is the lowest common denominator parser - an very simple
*   API which other wrappers can be built against.
**/


var XMLP = function(strXML) {
    // Normalize line breaks
    strXML = SAXStrings.replace(strXML, null, null, "\r\n", "\n");
    strXML = SAXStrings.replace(strXML, null, null, "\r", "\n");

    this.m_xml = strXML;
    this.m_iP = 0;
    this.m_iState = XMLP._STATE_PROLOG;
    this.m_stack = new Stack();
    this._clearAttributes();
    this.replaceEntities = true;
};


// CONSTANTS    (these must be below the constructor)


XMLP._NONE    = 0;
XMLP._ELM_B   = 1;
XMLP._ELM_E   = 2;
XMLP._ELM_EMP = 3;
XMLP._ATT     = 4;
XMLP._TEXT    = 5;
XMLP._ENTITY  = 6;
XMLP._PI      = 7;
XMLP._CDATA   = 8;
XMLP._COMMENT = 9;
XMLP._DTD     = 10;
XMLP._ERROR   = 11;

XMLP._CONT_XML = 0;
XMLP._CONT_ALT = 1;

XMLP._ATT_NAME = 0;
XMLP._ATT_VAL  = 1;

XMLP._STATE_PROLOG = 1;
XMLP._STATE_DOCUMENT = 2;
XMLP._STATE_MISC = 3;

XMLP._errs = new Array();
XMLP._errs[XMLP.ERR_CLOSE_PI       = 0 ] = "PI: missing closing sequence";
XMLP._errs[XMLP.ERR_CLOSE_DTD      = 1 ] = "DTD: missing closing sequence";
XMLP._errs[XMLP.ERR_CLOSE_COMMENT  = 2 ] = "Comment: missing closing sequence";
XMLP._errs[XMLP.ERR_CLOSE_CDATA    = 3 ] = "CDATA: missing closing sequence";
XMLP._errs[XMLP.ERR_CLOSE_ELM      = 4 ] = "Element: missing closing sequence";
XMLP._errs[XMLP.ERR_CLOSE_ENTITY   = 5 ] = "Entity: missing closing sequence";
XMLP._errs[XMLP.ERR_PI_TARGET      = 6 ] = "PI: target is required";
XMLP._errs[XMLP.ERR_ELM_EMPTY      = 7 ] = "Element: cannot be both empty and closing";
XMLP._errs[XMLP.ERR_ELM_NAME       = 8 ] = "Element: name must immediatly follow \"<\"";
XMLP._errs[XMLP.ERR_ELM_LT_NAME    = 9 ] = "Element: \"<\" not allowed in element names";
XMLP._errs[XMLP.ERR_ATT_VALUES     = 10] = "Attribute: values are required and must be in quotes";
XMLP._errs[XMLP.ERR_ATT_LT_NAME    = 11] = "Element: \"<\" not allowed in attribute names";
XMLP._errs[XMLP.ERR_ATT_LT_VALUE   = 12] = "Attribute: \"<\" not allowed in attribute values";
XMLP._errs[XMLP.ERR_ATT_DUP        = 13] = "Attribute: duplicate attributes not allowed";
XMLP._errs[XMLP.ERR_ENTITY_UNKNOWN = 14] = "Entity: unknown entity";
XMLP._errs[XMLP.ERR_INFINITELOOP   = 15] = "Infininte loop";
XMLP._errs[XMLP.ERR_DOC_STRUCTURE  = 16] = "Document: only comments, processing instructions, or whitespace allowed outside of document element";
XMLP._errs[XMLP.ERR_ELM_NESTING    = 17] = "Element: must be nested correctly";



XMLP.prototype._addAttribute = function(name, value) {
    this.m_atts[this.m_atts.length] = new Array(name, value);
}


XMLP.prototype._checkStructure = function(iEvent) {

    if(XMLP._STATE_PROLOG == this.m_iState) {

	    //The prolog is initial state of the document before parsing
	    //has really begun.  A rigid xml parsing implementation would not
		//allow anything but '<' as the first non-whitespace character
        if((XMLP._TEXT == iEvent) || (XMLP._ENTITY == iEvent)) {
            if(SAXStrings.indexOfNonWhitespace(this.getContent(), 
			    this.getContentBegin(), this.getContentEnd()) != -1) {
                    //TODO: HTML Helper here.
                    return this._setErr(XMLP.ERR_DOC_STRUCTURE);
            }
        }

        if((XMLP._ELM_B == iEvent) || (XMLP._ELM_EMP == iEvent)) {
            this.m_iState = XMLP._STATE_DOCUMENT;
            // Don't return - fall through to next state
        }
		
    }
	
	
    if(XMLP._STATE_DOCUMENT == this.m_iState) {
        //The document is the state that the parser is in after the
		//first element event, and remains in that state until
		//the initial element is closed
        if((XMLP._ELM_B == iEvent) || (XMLP._ELM_EMP == iEvent)) {
            this.m_stack.push(this.getName());
        }

        if((XMLP._ELM_E == iEvent) || (XMLP._ELM_EMP == iEvent)) {
            var strTop = this.m_stack.pop();
            if((strTop == null) || (strTop != this.getName())) {
                return this._setErr(XMLP.ERR_ELM_NESTING);
            }
        }

        if(this.m_stack.count() == 0) {
            this.m_iState = XMLP._STATE_MISC;
            return iEvent;
        }
    }
	
	
    if(XMLP._STATE_MISC == this.m_iState) {
        //The misc parser state occurs after the root element has been
		//closed.  basically a rigid xml parser would throw an error
		//for any element or text found after this
        if((XMLP._ELM_B == iEvent) || 
		   (XMLP._ELM_E == iEvent) || 
		   (XMLP._ELM_EMP == iEvent) || 
		   (XMLP.EVT_DTD == iEvent)) {
            //TODO: HTML Helper here.
            return this._setErr(XMLP.ERR_DOC_STRUCTURE);
        }

        if((XMLP._TEXT == iEvent) || (XMLP._ENTITY == iEvent)) {
            if(SAXStrings.indexOfNonWhitespace(this.getContent(), 
			     this.getContentBegin(), this.getContentEnd()) != -1) {
                    //TODO: HTML Helper here.
                    return this._setErr(XMLP.ERR_DOC_STRUCTURE);
            }
        }
    }

    return iEvent;

};


XMLP.prototype._clearAttributes = function() {
    this.m_atts = new Array();
};


XMLP.prototype._findAttributeIndex = function(name) {
    for(var i = 0; i < this.m_atts.length; i++) {
        if(this.m_atts[i][XMLP._ATT_NAME] == name) {
            return i;
        }
    }
    return -1;

};


XMLP.prototype.getAttributeCount = function() {

    return this.m_atts ? this.m_atts.length : 0;

};


XMLP.prototype.getAttributeName = function(index) {

    return ((index < 0) || (index >= this.m_atts.length)) ? 
       null : 
       this.m_atts[index][XMLP._ATT_NAME];

};


XMLP.prototype.getAttributeValue = function(index) {

    return ((index < 0) || (index >= this.m_atts.length)) ? 
       null : 
	   __unescapeXML__(this.m_atts[index][XMLP._ATT_VAL]);

};


XMLP.prototype.getAttributeValueByName = function(name) {

    return this.getAttributeValue(this._findAttributeIndex(name));

};


XMLP.prototype.getColumnNumber = function() {

    return SAXStrings.getColumnNumber(this.m_xml, this.m_iP);

};


XMLP.prototype.getContent = function() {

    return (this.m_cSrc == XMLP._CONT_XML) ? 
	   this.m_xml : 
	   this.m_cAlt;

};


XMLP.prototype.getContentBegin = function() {

    return this.m_cB;

};


XMLP.prototype.getContentEnd = function() {

    return this.m_cE;

};


XMLP.prototype.getLineNumber = function() {

    return SAXStrings.getLineNumber(this.m_xml, this.m_iP);

};


XMLP.prototype.getName = function() {

    return this.m_name;

};


XMLP.prototype.next = function() {

    return this._checkStructure(this._parse());

};

XMLP.prototype.appendFragment = function(xmlfragment) {

    var start = this.m_xml.slice(0,this.m_iP);
    var end = this.m_xml.slice(this.m_iP);
    this.m_xml = start+xmlfragment+end;

};


XMLP.prototype._parse = function() {

    if(this.m_iP == this.m_xml.length) {
        return XMLP._NONE;
    }

    if(this.m_iP == this.m_xml.indexOf("<", this.m_iP)){
        if(this.m_xml.charAt(this.m_iP+1) == "?") {
            return this._parsePI(this.m_iP + 2);
        }
        else if(this.m_xml.charAt(this.m_iP+1) == "!") {
            if(this.m_xml.charAt(this.m_iP+2) == "D") {
                return this._parseDTD(this.m_iP + 9);
            }
            else if(this.m_xml.charAt(this.m_iP+2) == "-") {
                return this._parseComment(this.m_iP + 4);
            }
            else if(this.m_xml.charAt(this.m_iP+2) == "[") {
                return this._parseCDATA(this.m_iP + 9);
            }
        }
        else{
              
            return this._parseElement(this.m_iP + 1);
        }
    }
    else if(this.m_iP == this.m_xml.indexOf("&", this.m_iP)) {
        return this._parseEntity(this.m_iP + 1);
    }
    else{
          
        return this._parseText(this.m_iP);
    }


}


XMLP.prototype._parseAttribute = function(iB, iE) {
    var iNB, iNE, iEq, iVB, iVE;
    var cQuote, strN, strV;

    //resets the value so we don't use an old one by 
	//accident (see testAttribute7 in the test suite)
	this.m_cAlt = ""; 

    iNB = SAXStrings.indexOfNonWhitespace(this.m_xml, iB, iE);
    if((iNB == -1) ||(iNB >= iE)) {
        return iNB;
    }

    iEq = this.m_xml.indexOf("=", iNB);
    if((iEq == -1) || (iEq > iE)) {
        return this._setErr(XMLP.ERR_ATT_VALUES);
    }

    iNE = SAXStrings.lastIndexOfNonWhitespace(this.m_xml, iNB, iEq);

    iVB = SAXStrings.indexOfNonWhitespace(this.m_xml, iEq + 1, iE);
    if((iVB == -1) ||(iVB > iE)) {
        return this._setErr(XMLP.ERR_ATT_VALUES);
    }

    cQuote = this.m_xml.charAt(iVB);
    if(_SAXStrings.QUOTES.indexOf(cQuote) == -1) {
        return this._setErr(XMLP.ERR_ATT_VALUES);
    }

    iVE = this.m_xml.indexOf(cQuote, iVB + 1);
    if((iVE == -1) ||(iVE > iE)) {
        return this._setErr(XMLP.ERR_ATT_VALUES);
    }

    strN = this.m_xml.substring(iNB, iNE + 1);
    strV = this.m_xml.substring(iVB + 1, iVE);

    if(strN.indexOf("<") != -1) {
        return this._setErr(XMLP.ERR_ATT_LT_NAME);
    }

    if(strV.indexOf("<") != -1) {
        return this._setErr(XMLP.ERR_ATT_LT_VALUE);
    }

    strV = SAXStrings.replace(strV, null, null, "\n", " ");
    strV = SAXStrings.replace(strV, null, null, "\t", " ");
        iRet = this._replaceEntities(strV);
    if(iRet == XMLP._ERROR) {
        return iRet;
    }

    strV = this.m_cAlt;

    if(this._findAttributeIndex(strN) == -1) {
        this._addAttribute(strN, strV);
    }else {
        return this._setErr(XMLP.ERR_ATT_DUP);
    }

    this.m_iP = iVE + 2;

    return XMLP._ATT;

}


XMLP.prototype._parseCDATA = function(iB) {
    var iE = this.m_xml.indexOf("]]>", iB);
    if (iE == -1) {
        return this._setErr(XMLP.ERR_CLOSE_CDATA);
    }

    this._setContent(XMLP._CONT_XML, iB, iE);

    this.m_iP = iE + 3;

    return XMLP._CDATA;

}


XMLP.prototype._parseComment = function(iB) {
    var iE = this.m_xml.indexOf("-" + "->", iB);
    if (iE == -1) {
        return this._setErr(XMLP.ERR_CLOSE_COMMENT);
    }

    this._setContent(XMLP._CONT_XML, iB, iE);

    this.m_iP = iE + 3;

    return XMLP._COMMENT;

}


XMLP.prototype._parseDTD = function(iB) {

    // Eat DTD

    var iE, strClose, iInt, iLast;

    iE = this.m_xml.indexOf(">", iB);
    if(iE == -1) {
        return this._setErr(XMLP.ERR_CLOSE_DTD);
    }

    iInt = this.m_xml.indexOf("[", iB);
    strClose = ((iInt != -1) && (iInt < iE)) ? "]>" : ">";

    while(true) {
        // DEBUG: Remove
        /*if(iE == iLast) {
            return this._setErr(XMLP.ERR_INFINITELOOP);
        }

        iLast = iE;*/
        // DEBUG: Remove End

        iE = this.m_xml.indexOf(strClose, iB);
        if(iE == -1) {
            return this._setErr(XMLP.ERR_CLOSE_DTD);
        }

        // Make sure it is not the end of a CDATA section
        if (this.m_xml.substring(iE - 1, iE + 2) != "]]>") {
            break;
        }
    }

    this.m_iP = iE + strClose.length;

    return XMLP._DTD;

}


XMLP.prototype._parseElement = function(iB) {
    var iE, iDE, iNE, iRet;
    var iType, strN, iLast;

    iDE = iE = this.m_xml.indexOf(">", iB);
    if(iE == -1) {
        return this._setErr(XMLP.ERR_CLOSE_ELM);
    }

    if(this.m_xml.charAt(iB) == "/") {
        iType = XMLP._ELM_E;
        iB++;
    } else {
        iType = XMLP._ELM_B;
    }

    if(this.m_xml.charAt(iE - 1) == "/") {
        if(iType == XMLP._ELM_E) {
            return this._setErr(XMLP.ERR_ELM_EMPTY);
        }
        iType = XMLP._ELM_EMP;
        iDE--;
    }

    iDE = SAXStrings.lastIndexOfNonWhitespace(this.m_xml, iB, iDE);

    //djohack
    //hack to allow for elements with single character names to be recognized

    /*if (iE - iB != 1 ) {
        if(SAXStrings.indexOfNonWhitespace(this.m_xml, iB, iDE) != iB) {
            return this._setErr(XMLP.ERR_ELM_NAME);
        }
    }*/
    // end hack -- original code below

    /*
    if(SAXStrings.indexOfNonWhitespace(this.m_xml, iB, iDE) != iB)
        return this._setErr(XMLP.ERR_ELM_NAME);
    */
    this._clearAttributes();

    iNE = SAXStrings.indexOfWhitespace(this.m_xml, iB, iDE);
    if(iNE == -1) {
        iNE = iDE + 1;
    }
    else {
        this.m_iP = iNE;
        while(this.m_iP < iDE) {
            // DEBUG: Remove
            //if(this.m_iP == iLast) return this._setErr(XMLP.ERR_INFINITELOOP);
            //iLast = this.m_iP;
            // DEBUG: Remove End


            iRet = this._parseAttribute(this.m_iP, iDE);
            if(iRet == XMLP._ERROR) return iRet;
        }
    }

    strN = this.m_xml.substring(iB, iNE);

    /*if(strN.indexOf("<") != -1) {
        return this._setErr(XMLP.ERR_ELM_LT_NAME);
    }*/

    this.m_name = strN;
    this.m_iP = iE + 1;

    return iType;

}


XMLP.prototype._parseEntity = function(iB) {
    var iE = this.m_xml.indexOf(";", iB);
    if(iE == -1) {
        return this._setErr(XMLP.ERR_CLOSE_ENTITY);
    }

    this.m_iP = iE + 1;

    return this._replaceEntity(this.m_xml, iB, iE);

}


XMLP.prototype._parsePI = function(iB) {

    var iE, iTB, iTE, iCB, iCE;

    iE = this.m_xml.indexOf("?>", iB);
    if(iE   == -1) {
        return this._setErr(XMLP.ERR_CLOSE_PI);
    }

    iTB = SAXStrings.indexOfNonWhitespace(this.m_xml, iB, iE);
    if(iTB == -1) {
        return this._setErr(XMLP.ERR_PI_TARGET);
    }

    iTE = SAXStrings.indexOfWhitespace(this.m_xml, iTB, iE);
    if(iTE  == -1) {
        iTE = iE;
    }

    iCB = SAXStrings.indexOfNonWhitespace(this.m_xml, iTE, iE);
    if(iCB == -1) {
        iCB = iE;
    }

    iCE = SAXStrings.lastIndexOfNonWhitespace(this.m_xml, iCB, iE);
    if(iCE  == -1) {
        iCE = iE - 1;
    }

    this.m_name = this.m_xml.substring(iTB, iTE);
    this._setContent(XMLP._CONT_XML, iCB, iCE + 1);
    this.m_iP = iE + 2;

    return XMLP._PI;

}


XMLP.prototype._parseText = function(iB) {
    var iE, iEE;

    iE = this.m_xml.indexOf("<", iB);
    if(iE == -1) {
        iE = this.m_xml.length;
    }

    if(this.replaceEntities) {
        iEE = this.m_xml.indexOf("&", iB);
        if((iEE != -1) && (iEE <= iE)) {
            iE = iEE;
        }
    }

    this._setContent(XMLP._CONT_XML, iB, iE);

    this.m_iP = iE;

    return XMLP._TEXT;

}


XMLP.prototype._replaceEntities = function(strD, iB, iE) {
    if(SAXStrings.isEmpty(strD)) return "";
    iB = iB || 0;
    iE = iE || strD.length;


    var iEB, iEE, strRet = "";

    iEB = strD.indexOf("&", iB);
    iEE = iB;

    while((iEB > 0) && (iEB < iE)) {
        strRet += strD.substring(iEE, iEB);

        iEE = strD.indexOf(";", iEB) + 1;

        if((iEE == 0) || (iEE > iE)) {
            return this._setErr(XMLP.ERR_CLOSE_ENTITY);
        }

        iRet = this._replaceEntity(strD, iEB + 1, iEE - 1);
        if(iRet == XMLP._ERROR) {
            return iRet;
        }

        strRet += this.m_cAlt;

        iEB = strD.indexOf("&", iEE);
    }

    if(iEE != iE) {
        strRet += strD.substring(iEE, iE);
    }

    this._setContent(XMLP._CONT_ALT, strRet);

    return XMLP._ENTITY;

}


XMLP.prototype._replaceEntity = function(strD, iB, iE) {
    if(SAXStrings.isEmpty(strD)) return -1;
    iB = iB || 0;
    iE = iE || strD.length;


    ent = strD.substring(iB, iE);
    strEnt = $w.$entityDefinitions[ent];
    if (!strEnt)  // special case for entity name==JS reserved keyword
        strEnt = $w.$entityDefinitions[ent+"XX"];
    if (!strEnt) {
        if(strD.charAt(iB) == "#")
            strEnt = String.fromCharCode(
                         parseInt(strD.substring(iB + 1, iE)))+'';
        else
            return this._setErr(XMLP.ERR_ENTITY_UNKNOWN);
    }

    this._setContent(XMLP._CONT_ALT, strEnt);
    return XMLP._ENTITY;
}


XMLP.prototype._setContent = function(iSrc) {
    var args = arguments;

    if(XMLP._CONT_XML == iSrc) {
        this.m_cAlt = null;
        this.m_cB = args[1];
        this.m_cE = args[2];
    } else {
        this.m_cAlt = args[1];
        this.m_cB = 0;
        this.m_cE = args[1].length;
    }
    this.m_cSrc = iSrc;

}


XMLP.prototype._setErr = function(iErr) {
    var strErr = XMLP._errs[iErr];

    this.m_cAlt = strErr;
    this.m_cB = 0;
    this.m_cE = strErr.length;
    this.m_cSrc = XMLP._CONT_ALT;

    return XMLP._ERROR;

}


/**
* function:   SAXDriver
* Author:   Scott Severtson
* Description:
*    SAXDriver is an object that basically wraps an XMLP instance, and provides an
*   event-based interface for parsing. This is the object users interact with when coding
*   with XML for <SCRIPT>
**/

var SAXDriver = function() {
    this.m_hndDoc = null;
    this.m_hndErr = null;
    this.m_hndLex = null;
}


// CONSTANTS
SAXDriver.DOC_B = 1;
SAXDriver.DOC_E = 2;
SAXDriver.ELM_B = 3;
SAXDriver.ELM_E = 4;
SAXDriver.CHARS = 5;
SAXDriver.PI    = 6;
SAXDriver.CD_B  = 7;
SAXDriver.CD_E  = 8;
SAXDriver.CMNT  = 9;
SAXDriver.DTD_B = 10;
SAXDriver.DTD_E = 11;



SAXDriver.prototype.parse = function(strD) {
    var parser = new XMLP(strD);

    if(this.m_hndDoc && this.m_hndDoc.setDocumentLocator) {
        this.m_hndDoc.setDocumentLocator(this);
    }

    this.m_parser = parser;
    this.m_bErr = false;

    if(!this.m_bErr) {
        this._fireEvent(SAXDriver.DOC_B);
    }
    this._parseLoop();
    if(!this.m_bErr) {
        this._fireEvent(SAXDriver.DOC_E);
    }

    this.m_xml = null;
    this.m_iP = 0;

}


SAXDriver.prototype.setDocumentHandler = function(hnd) {

    this.m_hndDoc = hnd;

}


SAXDriver.prototype.setErrorHandler = function(hnd) {

    this.m_hndErr = hnd;

}


SAXDriver.prototype.setLexicalHandler = function(hnd) {

    this.m_hndLex = hnd;

}


    /**
    * LOCATOR/PARSE EXCEPTION INTERFACE
    ***/

SAXDriver.prototype.getColumnNumber = function() {

    return this.m_parser.getColumnNumber();

}


SAXDriver.prototype.getLineNumber = function() {

    return this.m_parser.getLineNumber();

}


SAXDriver.prototype.getMessage = function() {

    return this.m_strErrMsg;

}


SAXDriver.prototype.getPublicId = function() {

    return null;

}


SAXDriver.prototype.getSystemId = function() {

    return null;

}


    /***
    * Attribute List Interface
    **/

SAXDriver.prototype.getLength = function() {

    return this.m_parser.getAttributeCount();

}


SAXDriver.prototype.getName = function(index) {

    return this.m_parser.getAttributeName(index);

}


SAXDriver.prototype.getValue = function(index) {

    return this.m_parser.getAttributeValue(index);

}


SAXDriver.prototype.getValueByName = function(name) {

    return this.m_parser.getAttributeValueByName(name);

}


    /***
    *    Private functions
    **/

SAXDriver.prototype._fireError = function(strMsg) {
    this.m_strErrMsg = strMsg;
    this.m_bErr = true;

    if(this.m_hndErr && this.m_hndErr.fatalError) {
        this.m_hndErr.fatalError(this);
    }

}   // end function _fireError


SAXDriver.prototype._fireEvent = function(iEvt) {
    var hnd, func, args = arguments, iLen = args.length - 1;

    if(this.m_bErr) return;

    if(SAXDriver.DOC_B == iEvt) {
        func = "startDocument";         hnd = this.m_hndDoc;
    }
    else if (SAXDriver.DOC_E == iEvt) {
        func = "endDocument";           hnd = this.m_hndDoc;
    }
    else if (SAXDriver.ELM_B == iEvt) {
        func = "startElement";          hnd = this.m_hndDoc;
    }
    else if (SAXDriver.ELM_E == iEvt) {
        func = "endElement";            hnd = this.m_hndDoc;
    }
    else if (SAXDriver.CHARS == iEvt) {
        func = "characters";            hnd = this.m_hndDoc;
    }
    else if (SAXDriver.PI    == iEvt) {
        func = "processingInstruction"; hnd = this.m_hndDoc;
    }
    else if (SAXDriver.CD_B  == iEvt) {
        func = "startCDATA";            hnd = this.m_hndLex;
    }
    else if (SAXDriver.CD_E  == iEvt) {
        func = "endCDATA";              hnd = this.m_hndLex;
    }
    else if (SAXDriver.CMNT  == iEvt) {
        func = "comment";               hnd = this.m_hndLex;
    }

    if(hnd && hnd[func]) {
        if(0 == iLen) {
            hnd[func]();
        }
        else if (1 == iLen) {
            hnd[func](args[1]);
        }
        else if (2 == iLen) {
            hnd[func](args[1], args[2]);
        }
        else if (3 == iLen) {
            hnd[func](args[1], args[2], args[3]);
        }
    }

}  // end function _fireEvent


SAXDriver.prototype._parseLoop = function(parser) {
    var iEvent, parser;

    parser = this.m_parser;
    while(!this.m_bErr) {
        iEvent = parser.next();

        if(iEvent == XMLP._ELM_B) {
            this._fireEvent(SAXDriver.ELM_B, parser.getName(), this);
        }
        else if(iEvent == XMLP._ELM_E) {
            this._fireEvent(SAXDriver.ELM_E, parser.getName());
        }
        else if(iEvent == XMLP._ELM_EMP) {
            this._fireEvent(SAXDriver.ELM_B, parser.getName(), this);
            this._fireEvent(SAXDriver.ELM_E, parser.getName());
        }
        else if(iEvent == XMLP._TEXT) {
            this._fireEvent(SAXDriver.CHARS, parser.getContent(), parser.getContentBegin(), parser.getContentEnd() - parser.getContentBegin());
        }
        else if(iEvent == XMLP._ENTITY) {
            this._fireEvent(SAXDriver.CHARS, parser.getContent(), parser.getContentBegin(), parser.getContentEnd() - parser.getContentBegin());
        }
        else if(iEvent == XMLP._PI) {
            this._fireEvent(SAXDriver.PI, parser.getName(), parser.getContent().substring(parser.getContentBegin(), parser.getContentEnd()));
        }
        else if(iEvent == XMLP._CDATA) {
            this._fireEvent(SAXDriver.CD_B);
            this._fireEvent(SAXDriver.CHARS, parser.getContent(), parser.getContentBegin(), parser.getContentEnd() - parser.getContentBegin());
            this._fireEvent(SAXDriver.CD_E);
        }
        else if(iEvent == XMLP._COMMENT) {
            this._fireEvent(SAXDriver.CMNT, parser.getContent(), parser.getContentBegin(), parser.getContentEnd() - parser.getContentBegin());
        }
        else if(iEvent == XMLP._DTD) {
        }
        else if(iEvent == XMLP._ERROR) {
            this._fireError(parser.getContent());
        }
        else if(iEvent == XMLP._NONE) {
            return;
        }
    }

}  // end function _parseLoop

/**
*   function:   SAXStrings
*   Author:   Scott Severtson
*   Description: a useful object containing string manipulation functions
**/

var _SAXStrings = function() {};


_SAXStrings.WHITESPACE = " \t\n\r";
_SAXStrings.NONWHITESPACE = /\S/;
_SAXStrings.QUOTES = "\"'";


_SAXStrings.prototype.getColumnNumber = function(strD, iP) {
    if((strD === null) || (strD.length === 0)) {
        return -1;
    }
    iP = iP || strD.length;

    var arrD = strD.substring(0, iP).split("\n");
    var strLine = arrD[arrD.length - 1];
    arrD.length--;
    var iLinePos = arrD.join("\n").length;

    return iP - iLinePos;

}  // end function getColumnNumber


_SAXStrings.prototype.getLineNumber = function(strD, iP) {
    if((strD === null) || (strD.length === 0)) {
        return -1;
    }
    iP = iP || strD.length;

    return strD.substring(0, iP).split("\n").length
}  // end function getLineNumber


_SAXStrings.prototype.indexOfNonWhitespace = function(strD, iB, iE) {
    if((strD === null) || (strD.length === 0)) {
        return -1;
    }
    iB = iB || 0;
    iE = iE || strD.length;

    //var i = strD.substring(iB, iE).search(_SAXStrings.NONWHITESPACE);
    //return i < 0 ? i : iB + i;

    while( strD.charCodeAt(iB++) < 33 );
    return (iB > iE)?-1:iB-1;
    /*for(var i = iB; i < iE; i++){
        if(_SAXStrings.WHITESPACE.indexOf(strD.charAt(i)) == -1) {
            return i;
        }
    }
    return -1;*/

}  // end function indexOfNonWhitespace


_SAXStrings.prototype.indexOfWhitespace = function(strD, iB, iE) {
    if((strD === null) || (strD.length === 0)) {
        return -1;
    }
    iB = iB || 0;
    iE = iE || strD.length;


    while( strD.charCodeAt(iB++) >= 33 );
    return (iB > iE)?-1:iB-1;

    /*for(var i = iB; i < iE; i++) {
        if(_SAXStrings.WHITESPACE.indexOf(strD.charAt(i)) != -1) {
            return i;
        }
    }
    return -1;*/
}  // end function indexOfWhitespace


_SAXStrings.prototype.isEmpty = function(strD) {

    return (strD == null) || (strD.length == 0);

}


_SAXStrings.prototype.lastIndexOfNonWhitespace = function(strD, iB, iE) {
    if((strD === null) || (strD.length === 0)) {
        return -1;
    }
    iB = iB || 0;
    iE = iE || strD.length;

    while( (iE >= iB) && strD.charCodeAt(--iE) < 33 );
    return (iE < iB)?-1:iE;

    /*for(var i = iE - 1; i >= iB; i--){
        if(_SAXStrings.WHITESPACE.indexOf(strD.charAt(i)) == -1){
            return i;
        }
    }
    return -1;*/
}


_SAXStrings.prototype.replace = function(strD, iB, iE, strF, strR) {
    if((strD == null) || (strD.length == 0)) {
        return "";
    }
    iB = iB || 0;
    iE = iE || strD.length;

    return strD.substring(iB, iE).split(strF).join(strR);

};

var SAXStrings = new _SAXStrings();



/***************************************************************************************************************
Stack: A simple stack class, used for verifying document structure.

    Author:   Scott Severtson
*****************************************************************************************************************/

var Stack = function() {
    this.m_arr = new Array();
};
__extend__(Stack.prototype, {
    clear : function() {
        this.m_arr = new Array();
    },
    count : function() {
        return this.m_arr.length;
    },
    destroy : function() {
        this.m_arr = null;
    },
    peek : function() {
        if(this.m_arr.length == 0) {
            return null;
        }
        return this.m_arr[this.m_arr.length - 1];
    },
    pop : function() {
        if(this.m_arr.length == 0) {
            return null;
        }
        var o = this.m_arr[this.m_arr.length - 1];
        this.m_arr.length--;
        return o;
    },
    push : function(o) {
        this.m_arr[this.m_arr.length] = o;
    }
});


/**
* function: isEmpty
* Author: mike@idle.org
* Description:  convenience function to identify an empty string
**/
function isEmpty(str) {
    return (str==null) || (str.length==0);
};


/**
 * function __escapeXML__
 * author: David Joham djoham@yahoo.com
 * @param  str : string - The string to be escaped
 * @return : string - The escaped string
 */
var escAmpRegEx = /&(?!(amp;|lt;|gt;|quot|apos;))/g;
var escLtRegEx = /</g;
var escGtRegEx = />/g;
var quotRegEx = /"/g;
var aposRegEx = /'/g;
function __escapeXML__(str) {
    str = str.replace(escAmpRegEx, "&amp;").
            replace(escLtRegEx, "&lt;").
            replace(escGtRegEx, "&gt;").
            replace(quotRegEx, "&quot;").
            replace(aposRegEx, "&apos;");

    return str;
};

/**
 * function __unescapeXML__
 * author: David Joham djoham@yahoo.com
 * @param  str : string - The string to be unescaped
 * @return : string - The unescaped string
 */
var unescAmpRegEx = /&amp;/g;
var unescLtRegEx = /&lt;/g;
var unescGtRegEx = /&gt;/g;
var unquotRegEx = /&quot;/g;
var unaposRegEx = /&apos;/g;
function __unescapeXML__(str) {
    str = str.replace(unescAmpRegEx, "&").
            replace(unescLtRegEx, "<").
            replace(unescGtRegEx, ">").
            replace(unquotRegEx, "\"").
            replace(unaposRegEx, "'");

    return str;
};

/**
 * @author Glen Ivey (gleneivey@wontology.org)
 */

$debug("Instantiating list of HTML4 standard entities");
/*
 * $w.$entityDefinitions
 */

var $entityDefinitions = {
        // content taken from W3C "HTML 4.01 Specification"
        //                        "W3C Recommendation 24 December 1999"

    nbsp: "\u00A0",
    iexcl: "\u00A1",
    cent: "\u00A2",
    pound: "\u00A3",
    curren: "\u00A4",
    yen: "\u00A5",
    brvbar: "\u00A6",
    sect: "\u00A7",
    uml: "\u00A8",
    copy: "\u00A9",
    ordf: "\u00AA",
    laquo: "\u00AB",
    not: "\u00AC",
    shy: "\u00AD",
    reg: "\u00AE",
    macr: "\u00AF",
    deg: "\u00B0",
    plusmn: "\u00B1",
    sup2: "\u00B2",
    sup3: "\u00B3",
    acute: "\u00B4",
    micro: "\u00B5",
    para: "\u00B6",
    middot: "\u00B7",
    cedil: "\u00B8",
    sup1: "\u00B9",
    ordm: "\u00BA",
    raquo: "\u00BB",
    frac14: "\u00BC",
    frac12: "\u00BD",
    frac34: "\u00BE",
    iquest: "\u00BF",
    Agrave: "\u00C0",
    Aacute: "\u00C1",
    Acirc: "\u00C2",
    Atilde: "\u00C3",
    Auml: "\u00C4",
    Aring: "\u00C5",
    AElig: "\u00C6",
    Ccedil: "\u00C7",
    Egrave: "\u00C8",
    Eacute: "\u00C9",
    Ecirc: "\u00CA",
    Euml: "\u00CB",
    Igrave: "\u00CC",
    Iacute: "\u00CD",
    Icirc: "\u00CE",
    Iuml: "\u00CF",
    ETH: "\u00D0",
    Ntilde: "\u00D1",
    Ograve: "\u00D2",
    Oacute: "\u00D3",
    Ocirc: "\u00D4",
    Otilde: "\u00D5",
    Ouml: "\u00D6",
    times: "\u00D7",
    Oslash: "\u00D8",
    Ugrave: "\u00D9",
    Uacute: "\u00DA",
    Ucirc: "\u00DB",
    Uuml: "\u00DC",
    Yacute: "\u00DD",
    THORN: "\u00DE",
    szlig: "\u00DF",
    agrave: "\u00E0",
    aacute: "\u00E1",
    acirc: "\u00E2",
    atilde: "\u00E3",
    auml: "\u00E4",
    aring: "\u00E5",
    aelig: "\u00E6",
    ccedil: "\u00E7",
    egrave: "\u00E8",
    eacute: "\u00E9",
    ecirc: "\u00EA",
    euml: "\u00EB",
    igrave: "\u00EC",
    iacute: "\u00ED",
    icirc: "\u00EE",
    iuml: "\u00EF",
    eth: "\u00F0",
    ntilde: "\u00F1",
    ograve: "\u00F2",
    oacute: "\u00F3",
    ocirc: "\u00F4",
    otilde: "\u00F5",
    ouml: "\u00F6",
    divide: "\u00F7",
    oslash: "\u00F8",
    ugrave: "\u00F9",
    uacute: "\u00FA",
    ucirc: "\u00FB",
    uuml: "\u00FC",
    yacute: "\u00FD",
    thorn: "\u00FE",
    yuml: "\u00FF",
    fnof: "\u0192",
    Alpha: "\u0391",
    Beta: "\u0392",
    Gamma: "\u0393",
    Delta: "\u0394",
    Epsilon: "\u0395",
    Zeta: "\u0396",
    Eta: "\u0397",
    Theta: "\u0398",
    Iota: "\u0399",
    Kappa: "\u039A",
    Lambda: "\u039B",
    Mu: "\u039C",
    Nu: "\u039D",
    Xi: "\u039E",
    Omicron: "\u039F",
    Pi: "\u03A0",
    Rho: "\u03A1",
    Sigma: "\u03A3",
    Tau: "\u03A4",
    Upsilon: "\u03A5",
    Phi: "\u03A6",
    Chi: "\u03A7",
    Psi: "\u03A8",
    Omega: "\u03A9",
    alpha: "\u03B1",
    beta: "\u03B2",
    gamma: "\u03B3",
    delta: "\u03B4",
    epsilon: "\u03B5",
    zeta: "\u03B6",
    eta: "\u03B7",
    theta: "\u03B8",
    iota: "\u03B9",
    kappa: "\u03BA",
    lambda: "\u03BB",
    mu: "\u03BC",
    nu: "\u03BD",
    xi: "\u03BE",
    omicron: "\u03BF",
    pi: "\u03C0",
    rho: "\u03C1",
    sigmaf: "\u03C2",
    sigma: "\u03C3",
    tau: "\u03C4",
    upsilon: "\u03C5",
    phi: "\u03C6",
    chi: "\u03C7",
    psi: "\u03C8",
    omega: "\u03C9",
    thetasym: "\u03D1",
    upsih: "\u03D2",
    piv: "\u03D6",
    bull: "\u2022",
    hellip: "\u2026",
    prime: "\u2032",
    Prime: "\u2033",
    oline: "\u203E",
    frasl: "\u2044",
    weierp: "\u2118",
    image: "\u2111",
    real: "\u211C",
    trade: "\u2122",
    alefsym: "\u2135",
    larr: "\u2190",
    uarr: "\u2191",
    rarr: "\u2192",
    darr: "\u2193",
    harr: "\u2194",
    crarr: "\u21B5",
    lArr: "\u21D0",
    uArr: "\u21D1",
    rArr: "\u21D2",
    dArr: "\u21D3",
    hArr: "\u21D4",
    forall: "\u2200",
    part: "\u2202",
    exist: "\u2203",
    empty: "\u2205",
    nabla: "\u2207",
    isin: "\u2208",
    notin: "\u2209",
    ni: "\u220B",
    prod: "\u220F",
    sum: "\u2211",
    minus: "\u2212",
    lowast: "\u2217",
    radic: "\u221A",
    prop: "\u221D",
    infin: "\u221E",
    ang: "\u2220",
    and: "\u2227",
    or: "\u2228",
    cap: "\u2229",
    cup: "\u222A",
    intXX: "\u222B",
    there4: "\u2234",
    sim: "\u223C",
    cong: "\u2245",
    asymp: "\u2248",
    ne: "\u2260",
    equiv: "\u2261",
    le: "\u2264",
    ge: "\u2265",
    sub: "\u2282",
    sup: "\u2283",
    nsub: "\u2284",
    sube: "\u2286",
    supe: "\u2287",
    oplus: "\u2295",
    otimes: "\u2297",
    perp: "\u22A5",
    sdot: "\u22C5",
    lceil: "\u2308",
    rceil: "\u2309",
    lfloor: "\u230A",
    rfloor: "\u230B",
    lang: "\u2329",
    rang: "\u232A",
    loz: "\u25CA",
    spades: "\u2660",
    clubs: "\u2663",
    hearts: "\u2665",
    diams: "\u2666",
    quot: "\u0022",
    amp: "\u0026",
    lt: "\u003C",
    gt: "\u003E",
    OElig: "\u0152",
    oelig: "\u0153",
    Scaron: "\u0160",
    scaron: "\u0161",
    Yuml: "\u0178",
    circ: "\u02C6",
    tilde: "\u02DC",
    ensp: "\u2002",
    emsp: "\u2003",
    thinsp: "\u2009",
    zwnj: "\u200C",
    zwj: "\u200D",
    lrm: "\u200E",
    rlm: "\u200F",
    ndash: "\u2013",
    mdash: "\u2014",
    lsquo: "\u2018",
    rsquo: "\u2019",
    sbquo: "\u201A",
    ldquo: "\u201C",
    rdquo: "\u201D",
    bdquo: "\u201E",
    dagger: "\u2020",
    Dagger: "\u2021",
    permil: "\u2030",
    lsaquo: "\u2039",
    rsaquo: "\u203A",
    euro: "\u20AC",

    // non-standard entities
    apos: "'"
};


$w.$entityDefinitions = $entityDefinitions;

//DOMImplementation
$debug("Defining DOMImplementation");
/**
 * @class  DOMImplementation - provides a number of methods for performing operations
 *   that are independent of any particular instance of the document object model.
 *
 * @author Jon van Noort (jon@webarcana.com.au)
 */
var DOMImplementation = function() {
    this.preserveWhiteSpace = false;  // by default, ignore whitespace
    this.namespaceAware = true;       // by default, handle namespaces
    this.errorChecking  = true;       // by default, test for exceptions
};

__extend__(DOMImplementation.prototype,{
    // @param  feature : string - The package name of the feature to test.
    //      the legal only values are "XML" and "CORE" (case-insensitive).
    // @param  version : string - This is the version number of the package
    //       name to test. In Level 1, this is the string "1.0".*
    // @return : boolean
    hasFeature : function(feature, version) {
        var ret = false;
        if (feature.toLowerCase() == "xml") {
            ret = (!version || (version == "1.0") || (version == "2.0"));
        }
        else if (feature.toLowerCase() == "core") {
            ret = (!version || (version == "2.0"));
        }
        else if (feature == "http://www.w3.org/TR/SVG11/feature#BasicStructure") {
            ret = (version == "1.1");
        }
        return ret;
    },
    createDocumentType : function(qname, publicid, systemid){
        return new DOMDocumentType();
    },
    createDocument : function(nsuri, qname, doctype){
      //TODO - this currently returns an empty doc
      //but needs to handle the args
        return new HTMLDocument($implementation, null, "");
    },
    translateErrCode : function(code) {
        //convert DOMException Code to human readable error message;
      var msg = "";

      switch (code) {
        case DOMException.INDEX_SIZE_ERR :                // 1
           msg = "INDEX_SIZE_ERR: Index out of bounds";
           break;

        case DOMException.DOMSTRING_SIZE_ERR :            // 2
           msg = "DOMSTRING_SIZE_ERR: The resulting string is too long to fit in a DOMString";
           break;

        case DOMException.HIERARCHY_REQUEST_ERR :         // 3
           msg = "HIERARCHY_REQUEST_ERR: The Node can not be inserted at this location";
           break;

        case DOMException.WRONG_DOCUMENT_ERR :            // 4
           msg = "WRONG_DOCUMENT_ERR: The source and the destination Documents are not the same";
           break;

        case DOMException.INVALID_CHARACTER_ERR :         // 5
           msg = "INVALID_CHARACTER_ERR: The string contains an invalid character";
           break;

        case DOMException.NO_DATA_ALLOWED_ERR :           // 6
           msg = "NO_DATA_ALLOWED_ERR: This Node / NodeList does not support data";
           break;

        case DOMException.NO_MODIFICATION_ALLOWED_ERR :   // 7
           msg = "NO_MODIFICATION_ALLOWED_ERR: This object cannot be modified";
           break;

        case DOMException.NOT_FOUND_ERR :                 // 8
           msg = "NOT_FOUND_ERR: The item cannot be found";
           break;

        case DOMException.NOT_SUPPORTED_ERR :             // 9
           msg = "NOT_SUPPORTED_ERR: This implementation does not support function";
           break;

        case DOMException.INUSE_ATTRIBUTE_ERR :           // 10
           msg = "INUSE_ATTRIBUTE_ERR: The Attribute has already been assigned to another Element";
           break;

        // Introduced in DOM Level 2:
        case DOMException.INVALID_STATE_ERR :             // 11
           msg = "INVALID_STATE_ERR: The object is no longer usable";
           break;

        case DOMException.SYNTAX_ERR :                    // 12
           msg = "SYNTAX_ERR: Syntax error";
           break;

        case DOMException.INVALID_MODIFICATION_ERR :      // 13
           msg = "INVALID_MODIFICATION_ERR: Cannot change the type of the object";
           break;

        case DOMException.NAMESPACE_ERR :                 // 14
           msg = "NAMESPACE_ERR: The namespace declaration is incorrect";
           break;

        case DOMException.INVALID_ACCESS_ERR :            // 15
           msg = "INVALID_ACCESS_ERR: The object does not support this function";
           break;

        default :
           msg = "UNKNOWN: Unknown Exception Code ("+ code +")";
      }

      return msg;
    }
});


/**
* Defined 'globally' to this scope.  Remember everything is wrapped in a closure so this doesnt show up
* in the outer most global scope.
*/

/**
 *  process SAX events
 *
 * @author Jon van Noort (jon@webarcana.com.au), David Joham (djoham@yahoo.com) and Scott Severtson
 *
 * @param  impl : DOMImplementation
 * @param  doc : DOMDocument - the Document to contain the parsed XML string
 * @param  p   : XMLP        - the SAX Parser
 *
 * @return : DOMDocument
 */

/*function __parseLoop__(impl, doc, p, isWindowDocument) {
    var iEvt, iNode, iAttr, strName;
    var iNodeParent = doc;

    var el_close_count = 0;

    var entitiesList = new Array();
    var textNodesList = new Array();

    // if namespaceAware, add default namespace
    if (impl.namespaceAware) {
        var iNS = doc.createNamespace(""); // add the default-default namespace
        iNS.value = "http://www.w3.org/2000/xmlns/";
        doc._namespaces.setNamedItem(iNS);
    }

  // loop until SAX parser stops emitting events
  var q = 0;
  while(true) {
    // get next event
    iEvt = p.next();
    
    if (iEvt == XMLP._ELM_B) {                      // Begin-Element Event
      var pName = p.getName();                      // get the Element name
      pName = trim(pName, true, true);              // strip spaces from Element name
      if(pName.toLowerCase() == 'script')
        p.replaceEntities = false;

      if (!impl.namespaceAware) {
        iNode = doc.createElement(p.getName());     // create the Element
        // add attributes to Element
        for(var i = 0; i < p.getAttributeCount(); i++) {
          strName = p.getAttributeName(i);          // get Attribute name
          iAttr = iNode.getAttributeNode(strName);  // if Attribute exists, use it

          if(!iAttr) {
            iAttr = doc.createAttribute(strName);   // otherwise create it
          }

          iAttr.value = p.getAttributeValue(i);   // set Attribute value
          iNode.setAttributeNode(iAttr);            // attach Attribute to Element
        }
      }
      else {  // Namespace Aware
        // create element (with empty namespaceURI,
        //  resolve after namespace 'attributes' have been parsed)
        iNode = doc.createElementNS("", p.getName());

        // duplicate ParentNode's Namespace definitions
        iNode._namespaces = __cloneNamedNodes__(iNodeParent._namespaces, iNode);

        // add attributes to Element
        for(var i = 0; i < p.getAttributeCount(); i++) {
          strName = p.getAttributeName(i);          // get Attribute name

          // if attribute is a namespace declaration
          if (__isNamespaceDeclaration__(strName)) {
            // parse Namespace Declaration
            var namespaceDec = __parseNSName__(strName);

            if (strName != "xmlns") {
              iNS = doc.createNamespace(strName);   // define namespace
            }
            else {
              iNS = doc.createNamespace("");        // redefine default namespace
            }
            iNS.value = p.getAttributeValue(i);   // set value = namespaceURI

            iNode._namespaces.setNamedItem(iNS);    // attach namespace to namespace collection
          }
          else {  // otherwise, it is a normal attribute
            iAttr = iNode.getAttributeNode(strName);        // if Attribute exists, use it

            if(!iAttr) {
              iAttr = doc.createAttributeNS("", strName);   // otherwise create it
            }

            iAttr.value = p.getAttributeValue(i);         // set Attribute value
            iNode.setAttributeNodeNS(iAttr);                // attach Attribute to Element

            if (__isIdDeclaration__(strName)) {
              iNode.id = p.getAttributeValue(i);    // cache ID for getElementById()
            }
          }
        }

        // resolve namespaceURIs for this Element
        if (iNode._namespaces.getNamedItem(iNode.prefix)) {
          iNode.namespaceURI = iNode._namespaces.getNamedItem(iNode.prefix).value;
        }

        //  for this Element's attributes
        for (var i = 0; i < iNode.attributes.length; i++) {
          if (iNode.attributes.item(i).prefix != "") {  // attributes do not have a default namespace
            if (iNode._namespaces.getNamedItem(iNode.attributes.item(i).prefix)) {
              iNode.attributes.item(i).namespaceURI = iNode._namespaces.getNamedItem(iNode.attributes.item(i).prefix).value;
            }
          }
        }
      }

      // if this is the Root Element
      if (iNodeParent.nodeType == DOMNode.DOCUMENT_NODE) {
        iNodeParent._documentElement = iNode;        // register this Element as the Document.documentElement
      }

      iNodeParent.appendChild(iNode);               // attach Element to parentNode
      iNodeParent = iNode;                          // descend one level of the DOM Tree
    }

    else if(iEvt == XMLP._ELM_E) {                  // End-Element Event        
        __endHTMLElement__(iNodeParent, doc, p);
        iNodeParent = iNodeParent.parentNode;         // ascend one level of the DOM Tree
    }

    else if(iEvt == XMLP._ELM_EMP) {                // Empty Element Event
      pName = p.getName();                          // get the Element name
      pName = trim(pName, true, true);              // strip spaces from Element name

      if (!impl.namespaceAware) {
        iNode = doc.createElement(pName);           // create the Element

        // add attributes to Element
        for(var i = 0; i < p.getAttributeCount(); i++) {
          strName = p.getAttributeName(i);          // get Attribute name
          iAttr = iNode.getAttributeNode(strName);  // if Attribute exists, use it

          if(!iAttr) {
            iAttr = doc.createAttribute(strName);   // otherwise create it
          }

          iAttr.value = p.getAttributeValue(i);   // set Attribute value
          iNode.setAttributeNode(iAttr);            // attach Attribute to Element
        }
      }
      else {  // Namespace Aware
        // create element (with empty namespaceURI,
        //  resolve after namespace 'attributes' have been parsed)
        iNode = doc.createElementNS("", p.getName());

        // duplicate ParentNode's Namespace definitions
        iNode._namespaces = __cloneNamedNodes__(iNodeParent._namespaces, iNode);

        // add attributes to Element
        for(var i = 0; i < p.getAttributeCount(); i++) {
          strName = p.getAttributeName(i);          // get Attribute name

          // if attribute is a namespace declaration
          if (__isNamespaceDeclaration__(strName)) {
            // parse Namespace Declaration
            var namespaceDec = __parseNSName__(strName);

            if (strName != "xmlns") {
              iNS = doc.createNamespace(strName);   // define namespace
            }
            else {
              iNS = doc.createNamespace("");        // redefine default namespace
            }
            iNS.value = p.getAttributeValue(i);   // set value = namespaceURI

            iNode._namespaces.setNamedItem(iNS);    // attach namespace to namespace collection
          }
          else {  // otherwise, it is a normal attribute
            iAttr = iNode.getAttributeNode(strName);        // if Attribute exists, use it

            if(!iAttr) {
              iAttr = doc.createAttributeNS("", strName);   // otherwise create it
            }

            iAttr.value = p.getAttributeValue(i);         // set Attribute value
            iNode.setAttributeNodeNS(iAttr);                // attach Attribute to Element

            if (__isIdDeclaration__(strName)) {
              iNode.id = p.getAttributeValue(i);    // cache ID for getElementById()
            }
          }
        }

        // resolve namespaceURIs for this Element
        if (iNode._namespaces.getNamedItem(iNode.prefix)) {
          iNode.namespaceURI = iNode._namespaces.getNamedItem(iNode.prefix).value;
        }

        //  for this Element's attributes
        for (var i = 0; i < iNode.attributes.length; i++) {
          if (iNode.attributes.item(i).prefix != "") {  // attributes do not have a default namespace
            if (iNode._namespaces.getNamedItem(iNode.attributes.item(i).prefix)) {
              iNode.attributes.item(i).namespaceURI = iNode._namespaces.getNamedItem(iNode.attributes.item(i).prefix).value;
            }
          }
        }
      }

      // if this is the Root Element
      if (iNodeParent.nodeType == DOMNode.DOCUMENT_NODE) {
        iNodeParent._documentElement = iNode;        // register this Element as the Document.documentElement
      }

      iNodeParent.appendChild(iNode);               // attach Element to parentNode
      __endHTMLElement__(iNode, doc, p);
    }
    else if(iEvt == XMLP._TEXT || iEvt == XMLP._ENTITY) {                   // TextNode and entity Events
      // get Text content
      var pContent = p.getContent().substring(p.getContentBegin(), p.getContentEnd());

      if (!impl.preserveWhiteSpace ) {
        if (trim(pContent, true, true) == "") {
            pContent = ""; //this will cause us not to create the text node below
        }
      }

      if (pContent.length > 0) {                    // ignore empty TextNodes
        var textNode = doc.createTextNode(pContent);
        iNodeParent.appendChild(textNode); // attach TextNode to parentNode

        //the sax parser breaks up text nodes when it finds an entity. For
        //example hello&lt;there will fire a text, an entity and another text
        //this sucks for the dom parser because it looks to us in this logic
        //as three text nodes. I fix this by keeping track of the entity nodes
        //and when we're done parsing, calling normalize on their parent to
        //turn the multiple text nodes into one, which is what DOM users expect
        //the code to do this is at the bottom of this function
        if (iEvt == XMLP._ENTITY) {
            entitiesList[entitiesList.length] = textNode;
        }
        else {
            //I can't properly decide how to handle preserve whitespace
            //until the siblings of the text node are built due to
            //the entitiy handling described above. I don't know that this
            //will be all of the text node or not, so trimming is not appropriate
            //at this time. Keep a list of all the text nodes for now
            //and we'll process the preserve whitespace stuff at a later time.
            textNodesList[textNodesList.length] = textNode;
        }
      }
    }
    else if(iEvt == XMLP._PI) {                     // ProcessingInstruction Event
      // attach ProcessingInstruction to parentNode
      iNodeParent.appendChild(doc.createProcessingInstruction(p.getName(), p.getContent().substring(p.getContentBegin(), p.getContentEnd())));
    }
    else if(iEvt == XMLP._CDATA) {                  // CDATA Event
      // get CDATA data
      pContent = p.getContent().substring(p.getContentBegin(), p.getContentEnd());

      if (!impl.preserveWhiteSpace) {
        pContent = trim(pContent, true, true);      // trim whitespace
        pContent.replace(/ +/g, ' ');               // collapse multiple spaces to 1 space
      }

      if (pContent.length > 0) {                    // ignore empty CDATANodes
        iNodeParent.appendChild(doc.createCDATASection(pContent)); // attach CDATA to parentNode
      }
    }
    else if(iEvt == XMLP._COMMENT) {                // Comment Event
      // get COMMENT data
      var pContent = p.getContent().substring(p.getContentBegin(), p.getContentEnd());

      if (!impl.preserveWhiteSpace) {
        pContent = trim(pContent, true, true);      // trim whitespace
        pContent.replace(/ +/g, ' ');               // collapse multiple spaces to 1 space
      }

      if (pContent.length > 0) {                    // ignore empty CommentNodes
        iNodeParent.appendChild(doc.createComment(pContent));  // attach Comment to parentNode
      }
    }
    else if(iEvt == XMLP._DTD) {                    // ignore DTD events
    }
    else if(iEvt == XMLP._ERROR) {
        $error("Fatal Error: " + p.getContent() +
                "\nLine: " + p.getLineNumber() +
                "\nColumn: " + p.getColumnNumber() + "\n");
        throw(new DOMException(DOMException.SYNTAX_ERR));
    }
    else if(iEvt == XMLP._NONE) {                   // no more events
      //steven woods notes that unclosed tags are rejected elsewhere and this check
	  //breaks a table patching routine
	  //if (iNodeParent == doc) {                     // confirm that we have recursed back up to root
      //  break;
      //}
      //else {
      //  throw(new DOMException(DOMException.SYNTAX_ERR));  // one or more Tags were not closed properly
      //}
        break;

    }
  }

  //normalize any entities in the DOM to a single textNode
  for (var i = 0; i < entitiesList.length; i++) {
      var entity = entitiesList[i];
      //its possible (if for example two entities were in the
      //same domnode, that the normalize on the first entitiy
      //will remove the parent for the second. Only do normalize
      //if I can find a parent node
      var parentNode = entity.parentNode;
      if (parentNode) {
          parentNode.normalize();

          //now do whitespace (if necessary)
          //it was not done for text nodes that have entities
          if(!impl.preserveWhiteSpace) {
                var children = parentNode.childNodes;
                for ( var j = 0; j < children.length; j++) {
                    var child = children.item(j);
                    if (child.nodeType == DOMNode.TEXT_NODE) {
                        var childData = child.data;
                        childData.replace(/\s/g, ' ');
                        child.data = childData;
                    }
                }
          }
      }
  }

  //do the preserve whitespace processing on the rest of the text nodes
  //It's possible (due to the processing above) that the node will have been
  //removed from the tree. Only do whitespace checking if parentNode is not null.
  //This may duplicate the whitespace processing for some nodes that had entities in them
  //but there's no way around that
  if (!impl.preserveWhiteSpace) {
    for (var i = 0; i < textNodesList.length; i++) {
        var node = textNodesList[i];
        if (node.parentNode != null) {
            var nodeData = node.data;
            nodeData.replace(/\s/g, ' ');
            node.data = nodeData;
        }
    }

  }
};*/


/**
 * @method DOMImplementation._isNamespaceDeclaration - Return true, if attributeName is a namespace declaration
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  attributeName : string - the attribute name
 * @return : boolean
 */
function __isNamespaceDeclaration__(attributeName) {
  // test if attributeName is 'xmlns'
  return (attributeName.indexOf('xmlns') > -1);
};

/**
 * @method DOMImplementation._isIdDeclaration - Return true, if attributeName is an id declaration
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  attributeName : string - the attribute name
 * @return : boolean
 */
function __isIdDeclaration__(attributeName) {
  // test if attributeName is 'id' (case insensitive)
  return attributeName?(attributeName.toLowerCase() == 'id'):false;
};

/**
 * @method DOMImplementation._isValidName - Return true,
 *   if name contains no invalid characters
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  name : string - the candidate name
 * @return : boolean
 */
function __isValidName__(name) {
  // test if name contains only valid characters
  return name.match(re_validName);
};
var re_validName = /^[a-zA-Z_:][a-zA-Z0-9\.\-_:]*$/;

/**
 * @method DOMImplementation._isValidString - Return true, if string does not contain any illegal chars
 *  All of the characters 0 through 31 and character 127 are nonprinting control characters.
 *  With the exception of characters 09, 10, and 13, (Ox09, Ox0A, and Ox0D)
 *  Note: different from _isValidName in that ValidStrings may contain spaces
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  name : string - the candidate string
 * @return : boolean
 */
function __isValidString__(name) {
  // test that string does not contains invalid characters
  return (name.search(re_invalidStringChars) < 0);
};
var re_invalidStringChars = /\x01|\x02|\x03|\x04|\x05|\x06|\x07|\x08|\x0B|\x0C|\x0E|\x0F|\x10|\x11|\x12|\x13|\x14|\x15|\x16|\x17|\x18|\x19|\x1A|\x1B|\x1C|\x1D|\x1E|\x1F|\x7F/;

/**
 * @method DOMImplementation._parseNSName - parse the namespace name.
 *  if there is no colon, the
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  qualifiedName : string - The qualified name
 * @return : NSName - [
         .prefix        : string - The prefix part of the qname
         .namespaceName : string - The namespaceURI part of the qname
    ]
 */
function __parseNSName__(qualifiedName) {
  var resultNSName = new Object();

  resultNSName.prefix          = qualifiedName;  // unless the qname has a namespaceName, the prefix is the entire String
  resultNSName.namespaceName   = "";

  // split on ':'
  var delimPos = qualifiedName.indexOf(':');
  if (delimPos > -1) {
    // get prefix
    resultNSName.prefix        = qualifiedName.substring(0, delimPos);
    // get namespaceName
    resultNSName.namespaceName = qualifiedName.substring(delimPos +1, qualifiedName.length);
  }
  return resultNSName;
};

/**
 * @method DOMImplementation._parseQName - parse the qualified name
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  qualifiedName : string - The qualified name
 * @return : QName
 */
function __parseQName__(qualifiedName) {
  var resultQName = new Object();

  resultQName.localName = qualifiedName;  // unless the qname has a prefix, the local name is the entire String
  resultQName.prefix    = "";

  // split on ':'
  var delimPos = qualifiedName.indexOf(':');

  if (delimPos > -1) {
    // get prefix
    resultQName.prefix    = qualifiedName.substring(0, delimPos);

    // get localName
    resultQName.localName = qualifiedName.substring(delimPos +1, qualifiedName.length);
  }

  return resultQName;
};

$debug("Initializing document.implementation");
var $implementation =  new DOMImplementation();
$implementation.namespaceAware = false;
$implementation.errorChecking = false;$debug("Defining Document");
/**
 * @class  DOMDocument - The Document interface represents the entire HTML 
 *      or XML document. Conceptually, it is the root of the document tree, 
 *      and provides the primary access to the document's data.
 *
 * @extends DOMNode
 * @author Jon van Noort (jon@webarcana.com.au)
 * @param  implementation : DOMImplementation - the creator Implementation
 */
var DOMDocument = function(implementation, docParentWindow) {
    //$log("\tcreating dom document");
    this.DOMNode = DOMNode;
    this.DOMNode(this);
    
    this.doctype = null;                  // The Document Type Declaration (see DocumentType) associated with this document
    this.implementation = implementation; // The DOMImplementation object that handles this document.
    
    // "private" variable providing the read-only document.parentWindow property
    this._parentWindow = docParentWindow;
    try {
        if (docParentWindow.$thisWindowsProxyObject)
            this._parentWindow = docParentWindow.$thisWindowsProxyObject;
    } catch(e){}

    this.nodeName  = "#document";
    this._id = 0;
    this._lastId = 0;
    this._parseComplete = false;                   // initially false, set to true by parser
    this._url = "";
    
    this.ownerDocument = null;
    
    this._performingImportNodeOperation = false;
};
DOMDocument.prototype = new DOMNode;
__extend__(DOMDocument.prototype, {	
    addEventListener        : function(){ window.addEventListener.apply(this, arguments); },
	removeEventListener     : function(){ window.removeEventListener.apply(this, arguments); },
	attachEvent             : function(){ window.addEventListener.apply(this, arguments); },
	detachEvent             : function(){ window.removeEventListener.apply(this, arguments); },
	dispatchEvent           : function(){ window.dispatchEvent.apply(this, arguments); },

    get styleSheets(){ 
        return [];/*TODO*/ 
    },
    get all(){
        return this.getElementsByTagName("*");
    },
    get documentElement(){
        var i, length = this.childNodes?this.childNodes.length:0;
        for(i=0;i<length;i++){
           if(this.childNodes[i].nodeType == DOMNode.ELEMENT_NODE){
                return this.childNodes[i];
            }
        }
        return null;
    },
    get parentWindow(){
        return this._parentWindow;
    },
    loadXML : function(xmlString) {
        // create DOM Document
        if(this === $document){
            $debug("Setting internal window.document");
            $document = this;
        }
        // populate Document with Parsed Nodes
        try {
            // make sure thid document object is empty before we try to load ...
            this.childNodes      = new DOMNodeList(this, this);
            this.firstChild      = null;
            this.lastChild       = null;
            this.attributes      = new DOMNamedNodeMap(this, this);
            this._namespaces     = new DOMNamespaceNodeMap(this, this);
            this._readonly = false;

            parseHtmlDocument(xmlString, this, null, null);
            
            $env.wait(-1);
        } catch (e) {
            $error(e);
        }

        // set parseComplete flag, (Some validation Rules are relaxed if this is false)
        this._parseComplete = true;
        return this;
    },
    load: function(url){
		$debug("Loading url into DOM Document: "+ url + " - (Asynch? "+$w.document.async+")");
        var scripts, _this = this;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, $w.document.async);
        xhr.onreadystatechange = function(){
            try{
        	    _this.loadXML(xhr.responseText);
            }catch(e){
                $error("Error Parsing XML - ",e);
                _this.loadXML(
                "<html><head></head><body>"+
                    "<h1>Parse Error</h1>"+
                    "<p>"+e.toString()+"</p>"+  
                "</body></html>");
            }
            _this._url = url;
            
        	$info("Sucessfully loaded document at "+url);

                // first fire body-onload event
            var event = document.createEvent();
            event.initEvent("load");
            try {  // assume <body> element, but just in case....
                $w.document.getElementsByTagName('body')[0].
                  dispatchEvent( event, false );
            } catch (e){;}

                // then fire window-onload event
            event = document.createEvent();
            event.initEvent("load");
            $w.dispatchEvent( event, false );
			
			//also use DOMContentLoaded event
            var domContentLoaded = document.createEvent();
            domContentLoaded.initEvent("DOMContentLoaded");
            $w.dispatchEvent( domContentLoaded, false );
            
        };
        xhr.send();
    },
	createEvent             : function(eventType){ 
        var event;
        if(eventType === "UIEvents"){ event = new UIEvent();}
        else if(eventType === "MouseEvents"){ event = new MouseEvent();}
        else{ event = new Event(); } 
        return event;
    },
    createExpression        : function(xpath, nsuriMap){ 
        return new XPathExpression(xpath, nsuriMap);
    },
    createElement : function(tagName) {
          //$debug("DOMDocument.createElement( "+tagName+" )");
          // throw Exception if the tagName string contains an illegal character
          if (__ownerDocument__(this).implementation.errorChecking 
            && (!__isValidName__(tagName))) {
            throw(new DOMException(DOMException.INVALID_CHARACTER_ERR));
          }
        
          // create DOMElement specifying 'this' as ownerDocument
          var node = new DOMElement(this);
        
          // assign values to properties (and aliases)
          node.tagName  = tagName;
        
          return node;
    },
    createDocumentFragment : function() {
          // create DOMDocumentFragment specifying 'this' as ownerDocument
          var node = new DOMDocumentFragment(this);
          return node;
    },
    createTextNode: function(data) {
          // create DOMText specifying 'this' as ownerDocument
          var node = new DOMText(this);
        
          // assign values to properties (and aliases)
          node.data      = data;
        
          return node;
    },
    createComment : function(data) {
          // create DOMComment specifying 'this' as ownerDocument
          var node = new DOMComment(this);
        
          // assign values to properties (and aliases)
          node.data      = data;
        
          return node;
    },
    createCDATASection : function(data) {
          // create DOMCDATASection specifying 'this' as ownerDocument
          var node = new DOMCDATASection(this);
        
          // assign values to properties (and aliases)
          node.data      = data;
        
          return node;
    },
    createProcessingInstruction : function(target, data) {
          // throw Exception if the target string contains an illegal character
          //$log("DOMDocument.createProcessingInstruction( "+target+" )");
          if (__ownerDocument__(this).implementation.errorChecking 
            && (!__isValidName__(target))) {
            throw(new DOMException(DOMException.INVALID_CHARACTER_ERR));
          }
        
          // create DOMProcessingInstruction specifying 'this' as ownerDocument
          var node = new DOMProcessingInstruction(this);
        
          // assign values to properties (and aliases)
          node.target    = target;
          node.data      = data;
        
          return node;
    },
    createAttribute : function(name) {
        // throw Exception if the name string contains an illegal character
        //$log("DOMDocument.createAttribute( "+target+" )");
        if (__ownerDocument__(this).implementation.errorChecking 
            && (!__isValidName__(name))) {
            throw(new DOMException(DOMException.INVALID_CHARACTER_ERR));
        }
        
        // create DOMAttr specifying 'this' as ownerDocument
        var node = new DOMAttr(this);
        
        // assign values to properties (and aliases)
        node.name     = name;
        
        return node;
    },
    createElementNS : function(namespaceURI, qualifiedName) {
        //$log("DOMDocument.createElement( "+namespaceURI+", "+qualifiedName+" )");
          // test for exceptions
          if (__ownerDocument__(this).implementation.errorChecking) {
            // throw Exception if the Namespace is invalid
            if (!__isValidNamespace__(this, namespaceURI, qualifiedName)) {
              throw(new DOMException(DOMException.NAMESPACE_ERR));
            }
        
            // throw Exception if the qualifiedName string contains an illegal character
            if (!__isValidName__(qualifiedName)) {
              throw(new DOMException(DOMException.INVALID_CHARACTER_ERR));
            }
          }
        
          // create DOMElement specifying 'this' as ownerDocument
          var node  = new DOMElement(this);
          var qname = __parseQName__(qualifiedName);
        
          // assign values to properties (and aliases)
          node.namespaceURI = namespaceURI;
          node.prefix       = qname.prefix;
          node.localName    = qname.localName;
          node.tagName      = qualifiedName;
        
          return node;
    },
    createAttributeNS : function(namespaceURI, qualifiedName) {
          // test for exceptions
          if (__ownerDocument__(this).implementation.errorChecking) {
            // throw Exception if the Namespace is invalid
            if (!__isValidNamespace__(this, namespaceURI, qualifiedName, true)) {
              throw(new DOMException(DOMException.NAMESPACE_ERR));
            }
        
            // throw Exception if the qualifiedName string contains an illegal character
            if (!__isValidName__(qualifiedName)) {
              throw(new DOMException(DOMException.INVALID_CHARACTER_ERR));
            }
          }
        
          // create DOMAttr specifying 'this' as ownerDocument
          var node  = new DOMAttr(this);
          var qname = __parseQName__(qualifiedName);
        
          // assign values to properties (and aliases)
          node.namespaceURI = namespaceURI;
          node.prefix       = qname.prefix;
          node.localName    = qname.localName;
          node.name         = qualifiedName;
          node.nodeValue    = "";
        
          return node;
    },
    createNamespace : function(qualifiedName) {
          // create DOMNamespace specifying 'this' as ownerDocument
          var node  = new DOMNamespace(this);
          var qname = __parseQName__(qualifiedName);
        
          // assign values to properties (and aliases)
          node.prefix       = qname.prefix;
          node.localName    = qname.localName;
          node.name         = qualifiedName;
          node.nodeValue    = "";
        
          return node;
    },
    /** from David Flanagan's JavaScript - The Definitive Guide
     * 
     * @param {String} xpathText
     *     The string representing the XPath expression to evaluate.
     * @param {Node} contextNode 
     *     The node in this document against which the expression is to
     *     be evaluated.
     * @param {Function} nsuriMapper 
     *     A function that will map from namespace prefix to to a full 
     *     namespace URL or null if no such mapping is required.
     * @param {Number} resultType 
     *     Specifies the type of object expected as a result, using
     *     XPath conversions to coerce the result. Possible values for
     *     type are the constrainsts defined by the XPathResult object.
     *     (null if not required)
     * @param {XPathResult} result 
     *     An XPathResult object to be reused or null
     *     if you want a new XPathResult object to be created.
     * @returns {XPathResult} result
     *     A XPathResult object representing the evaluation of the 
     *     expression against the given context node.
     * @throws {Exception} e
     *     This method may throw an exception if the xpathText contains 
     *     a syntax error, if the expression cannot be converted to the
     *     desired resultType, if the expression contains namespaces 
     *     that nsuriMapper cannot resolve, or if contextNode is of the 
     *     wrong type or is not assosciated with this document.
     * @seealso
     *     Document.evaluate
     */
    /*evaluate: function(xpathText, contextNode, nsuriMapper, resultType, result){
        return new XPathExpression().evaluate();
    },*/
    getElementById : function(elementId) {
          var retNode = null,
              node;
          // loop through all Elements in the 'all' collection
          var all = this.all;
          for (var i=0; i < all.length; i++) {
            node = all[i];
            // if id matches & node is alive (ie, connected (in)directly to the documentElement)
            if (node.id == elementId) {
                if((__ownerDocument__(node).documentElement._id == this.documentElement._id)){
                    retNode = node;
                    //$log("Found node with id = " + node.id);
                    break;
                }
            }
          }
          
          //if(retNode == null){$log("Couldn't find id " + elementId);}
          return retNode;
    },
    normalizeDocument: function(){
	    this.documentElement.normalize();
    },
    get nodeType(){
        return DOMNode.DOCUMENT_NODE;
    },
    get xml(){
        //$log("Serializing " + this);
        return this.documentElement.xml;
    },
	toString: function(){ 
	    return "Document" +  (typeof this._url == "string" ? ": " + this._url : ""); 
    },
	get defaultView(){ 
		return { getComputedStyle: function(elem){
			return $w.getComputedStyle(elem);
		}};
	},
    _genId : function() {
          this._lastId += 1;                             // increment lastId (to generate unique id)
          return this._lastId;
    }
});


var __isValidNamespace__ = function(doc, namespaceURI, qualifiedName, isAttribute) {

      if (doc._performingImportNodeOperation == true) {
        //we're doing an importNode operation (or a cloneNode) - in both cases, there
        //is no need to perform any namespace checking since the nodes have to have been valid
        //to have gotten into the DOM in the first place
        return true;
      }
    
      var valid = true;
      // parse QName
      var qName = __parseQName__(qualifiedName);
    
    
      //only check for namespaces if we're finished parsing
      if (this._parseComplete == true) {
    
        // if the qualifiedName is malformed
        if (qName.localName.indexOf(":") > -1 ){
            valid = false;
        }
    
        if ((valid) && (!isAttribute)) {
            // if the namespaceURI is not null
            if (!namespaceURI) {
            valid = false;
            }
        }
    
        // if the qualifiedName has a prefix
        if ((valid) && (qName.prefix == "")) {
            valid = false;
        }
    
      }
    
      // if the qualifiedName has a prefix that is "xml" and the namespaceURI is
      //  different from "http://www.w3.org/XML/1998/namespace" [Namespaces].
      if ((valid) && (qName.prefix == "xml") && (namespaceURI != "http://www.w3.org/XML/1998/namespace")) {
        valid = false;
      }
    
      return valid;
};

$w.Document = DOMDocument;
/*
*	parser.js
*/
/*
 * HTML Parser By John Resig (ejohn.org)
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * // Use like so:
 * HTMLParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * // or to get an XML string:
 * HTMLtoXML(htmlString);
 *
 * // or to get an XML DOM Document
 * HTMLtoDOM(htmlString);
 *
 * // or to inject into an existing document/DOM node
 * HTMLtoDOM(htmlString, document);
 * HTMLtoDOM(htmlString, document.body);
 *
 */
 var html2dom, html2xml;

(function(){

	// Regular Expressions for parsing tags and attributes
	var startTag = /^<([\w\:\-]+)((?:\s+[\w\:\-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
        endTag = /^<\/([\w\:\-]+)[^>]*>/,
        attr = /([\w\:\-]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g; 	
	// Empty Elements - HTML 4.01
	var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");

	// Block Elements - HTML 4.01
	var block = makeMap("address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul");

	// Inline Elements - HTML 4.01
	var inline = makeMap("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

	// Elements that you can, intentionally, leave open
	// (and which close themselves)
	var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

	// Attributes that have their values filled in disabled="disabled"
	var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

	// Special Elements (can contain anything)
	var special = makeMap("script,style");

	var HTMLParser  = function( html, handler ) {
		var index, chars, match, stack = [], last = html;
		stack.last = function(){
			return this[ this.length - 1 ];
		};

		while ( html ) {
		    //$log("HTMLParser: chunking... ");
			chars = true;

			// Make sure we're not in a script or style element
			if ( !stack.last() || !special[ stack.last() ] ) {
            
		        //$log("HTMLParser: ... ");
				// Comment
				if ( html.indexOf("<!--") === 0 ) {
		            //$log("HTMLParser: comment ");
					index = html.indexOf("-->");
	
					if ( index >= 0 ) {
						if ( handler.comment )
							handler.comment( html.substring( 4, index ) );
						html = html.substring( index + 3 );
						chars = false;
					}
	
				// end tag
				} else if ( html.indexOf("</") === 0 ) {
		            //$log("HTMLParser: endtag ");
					match = html.match( endTag );
	
					if ( match ) {
		                //$log("HTMLParser: endtag match : "+match[0]);
						html = html.substring( match[0].length );
						match[0].replace( endTag, parseEndTag );
						chars = false;
					}
	
				// start tag
				} else if ( html.indexOf("<") === 0 ) {
		            //$log("HTMLParser: starttag ");
					match = html.match( startTag );
	
					if ( match ) {
		                //$log("HTMLParser: starttag match : "+match[0]);
						html = html.substring( match[0].length );
						match[0].replace( startTag, parseStartTag );
						chars = false;
					}
				}

				if ( chars ) {
		            //$log("HTMLParser: other ");
					index = html.indexOf("<");
					var text = index < 0 ? html : html.substring( 0, index );
					html = index < 0 ? "" : html.substring( index );
					if ( handler.chars ){
		                //$log("HTMLParser: chars " + text);
					    handler.chars( text );
				    }
				}
			} else {
		        //$log("HTMLParser: special ");
				html = html.replace(new RegExp("(.*)<\/" + stack.last() + "[^>]*>"), function(all, text){
					text = text.replace(/<!--(.*?)-->/g, "$1").
						replace(/<!\[CDATA\[(.*?)]]>/g, "$1");
					if ( handler.chars ){
		                //$log("HTMLParser: special chars " + text);
					    handler.chars( text );
				    }
					return "";
				});
				parseEndTag( "", stack.last() );
			}
			if ( html == last ){throw "Parse Error: " + html;}
			last = html;
		}
		
		// Clean up any remaining tags
		parseEndTag();

		function parseStartTag( tag, tagName, rest, unary ) {
			if ( block[ tagName ] ) {
				while ( stack.last() && inline[ stack.last() ] ) {
					parseEndTag( "", stack.last() );
				}
			}

			if ( closeSelf[ tagName ] && stack.last() == tagName ) {
				parseEndTag( "", tagName );
			}

			unary = empty[ tagName ] || !!unary;

			if ( !unary )
				stack.push( tagName );
			
			if ( handler.start ) {
				var attrs = [];
	
				rest.replace(attr, function(match, name) {
					var value = arguments[2] ? arguments[2] :
						arguments[3] ? arguments[3] :
						arguments[4] ? arguments[4] :
						fillAttrs[name] ? name : "";
					
					attrs.push({
						name: name,
						value: value,
						escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
					});
				});
	
				if ( handler.start ){
				    //$log("unary ? : "+unary);
					handler.start( tagName, attrs, unary );
				}
			}
		}

		function parseEndTag( tag, tagName ) {
		  var pos;
			// If no tag name is provided, clean shop
			if ( !tagName ){
				pos = 0;
			}else{
			// Find the closest opened tag of the same type
				for ( pos = stack.length - 1; pos >= 0; pos-- ){
					//$log("parseEndTag : "+stack[ pos ] );
					if ( stack[ pos ] == tagName ){ 
					    break; 
				    }
				}
            }
			if ( pos >= 0 ) {
				// Close all the open elements, up the stack
				for ( var i = stack.length - 1; i >= pos; i-- ){
                    if ( handler.end ){
					    //$log("end : "+stack[ i ] );
                        handler.end( stack[ i ] );
                    }
				}
				// Remove the open elements from the stack
				//$log("setting stack length : " + stack.length + " -> " +pos );
				stack.length = pos;
			}
		}
	};
	
	html2xml = function( html ) {
		var results = "";
		
		HTMLParser(html, {
			start: function( tag, attrs, unary ) {
				results += "<" + tag;
		
				for ( var i = 0; i < attrs.length; i++ )
					results += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
		
				results += (unary ? "/" : "") + ">";
			},
			end: function( tag ) {
				results += "</" + tag + ">";
			},
			chars: function( text ) {
				results += text;
			},
			comment: function( text ) {
				results += "<!--" + text + "-->";
			}
		});
		
		return results;
	};
	
	html2dom = function( html, doc ) {
		// There can be only one of these elements
		var one = makeMap("html,head,body,title");
		
		// Enforce a structure for the document
		/*var structure = {
			link: "head",
			base: "head"
		};*/
	
		if ( !doc ) {
			if ( typeof DOMDocument != "undefined" ){
				doc = new DOMDocument();
			}else if ( typeof document != "undefined" && document.implementation && document.implementation.createDocument ){
				doc = document.implementation.createDocument("", "", null);
			}else if ( typeof ActiveX != "undefined" ){
				doc = new ActiveXObject("Msxml.DOMDocument");
			}
		} else {
			doc = doc.ownerDocument ||
				doc.getOwnerDocument && doc.getOwnerDocument() ||
				doc;
		}
		
		var elems = [],
			documentElement = doc.documentElement || 
			    doc.getDocumentElement && doc.getDocumentElement();
				
		// If we're dealing with an empty document then we
		// need to pre-populate it with the HTML document structure
		/*if ( !documentElement && doc.createElement ) (function(){
		    //$log("HTMLtoDOM: adding structure... ");
			var html = doc.createElement("html");
			var head = doc.createElement("head");
			head.appendChild( doc.createElement("title") );
			html.appendChild( head );
			html.appendChild( doc.createElement("body") );
			doc.appendChild( html );
			doc.documentElement = html;
		})();*/
		
		// Find all the unique elements
		/*if ( doc.getElementsByTagName ){
			for ( var i in one ){
			   one[ i ] = doc.getElementsByTagName( i )[0];
            }
		}*/
		
		// If we're working with a document, inject contents into
		// the body element
		var curParentNode;// = one.body;
		
		//$log("HTMLtoDOM: Parsing... ");
		HTMLParser( html, {
			start: function( tagName, attrs, unary ) {
			    
				var elem;
		        //$log("HTMLtoDOM: createElement... " + tagName);
				elem = doc.createElement( tagName );
			
				
				for ( var attr in attrs ){
		            //$log("HTMLtoDOM: setAttribute... " +  attrs[ attr ].name);
					elem.setAttribute( attrs[ attr ].name, attrs[ attr ].value );
				}
				
				if ( !doc.documentElement ){		            
				    //$log("HTMLtoDOM: documentElement... " +  elem.nodeName);
		            doc.documentElement = elem;
			        doc.appendChild( elem );
				}
				
				else if ( curParentNode && curParentNode.appendChild ){
		            //$log("HTMLtoDOM: curParentNode.appendChild... " +  curParentNode.nodeName + " -> " +elem.nodeName);
					curParentNode.appendChild( elem );
				}
					
				if ( !unary ) {
				    //$log("start : push into elems[] " + tagName);
					elems.push( elem );
					curParentNode = elem;
				}
			},
			end: function( tag ) {
			    //$log(tag + " : elems.lengths : "+elems.length);
			    elems.length -= 1;
				
				// Init the new parentNode
				curParentNode = elems[ elems.length - 1 ];

			},
			chars: function( text ) {
				curParentNode.appendChild( doc.createTextNode( text ) );
			},
			comment: function( text ) {
				curParentNode.appendChild( doc.createComment( text ) );
			}
		});
				
        //$log("HTMLtoDOM: doc... " + doc);
		return doc;
	};

	function makeMap(str){
		var obj = {}, items = str.split(",");
		for ( var i = 0; i < items.length; i++ )
			obj[ items[i] ] = true;
		return obj;
	};
	
})( );
$debug("Defining HTMLDocument");
/*
* HTMLDocument - DOM Level 2
*/
/**
 * @class  HTMLDocument - The Document interface represents the entire HTML or XML document.
 *   Conceptually, it is the root of the document tree, and provides the primary access to the document's data.
 *
 * @extends DOMDocument
 */
var HTMLDocument = function(implementation, docParentWindow, docReferrer) {
  this.DOMDocument = DOMDocument;
  this.DOMDocument(implementation, docParentWindow);

  this._referrer = docReferrer;
  this._domain;
  this._open = false;
  this.$async = false;
};
HTMLDocument.prototype = new DOMDocument;
__extend__(HTMLDocument.prototype, {
    createElement: function(tagName){
          //print('createElement :'+tagName);
          // throw Exception if the tagName string contains an illegal character
          if (__ownerDocument__(this).implementation.errorChecking && 
                (!__isValidName__(tagName))) {
              throw(new DOMException(DOMException.INVALID_CHARACTER_ERR));
          }
          tagName = tagName.toUpperCase();
          // create DOMElement specifying 'this' as ownerDocument
          //This is an html document so we need to use explicit interfaces per the 
          if(     tagName.match(/^A$/))                 {node = new HTMLAnchorElement(this);}
          else if(tagName.match(/^AREA$/))              {node = new HTMLAreaElement(this);}
          else if(tagName.match(/BASE/))                {node = new HTMLBaseElement(this);}
          else if(tagName.match(/BLOCKQUOTE|Q/))        {node = new HTMLQuoteElement(this);}
          else if(tagName.match(/BODY/))                {node = new HTMLBodyElement(this);}
          else if(tagName.match(/BR/))                  {node = new HTMLElement(this);}
          else if(tagName.match(/BUTTON/))              {node = new HTMLButtonElement(this);}
          else if(tagName.match(/CAPTION/))             {node = new HTMLElement(this);}
          else if(tagName.match(/COL|COLGROUP/))        {node = new HTMLTableColElement(this);}
          else if(tagName.match(/DEL|INS/))             {node = new HTMLModElement(this);}
          else if(tagName.match(/DIV/))                 {node = new HTMLDivElement(this);}
          else if(tagName.match(/DL/))                  {node = new HTMLElement(this);}
          else if(tagName.match(/FIELDSET/))            {node = new HTMLFieldSetElement(this);}
          else if(tagName.match(/FORM/))                {node = new HTMLFormElement(this);}
          else if(tagName.match(/^FRAME$/))             {node = new HTMLFrameElement(this);}
          else if(tagName.match(/FRAMESET/))            {node = new HTMLFrameSetElement(this);}
          else if(tagName.match(/H1|H2|H3|H4|H5|H6/))   {node = new HTMLElement(this);}
          else if(tagName.match(/HEAD/))                {node = new HTMLHeadElement(this);}
          else if(tagName.match(/HR/))                  {node = new HTMLElement(this);}
          else if(tagName.match(/HTML/))                {node = new HTMLElement(this);}
          else if(tagName.match(/IFRAME/))              {node = new HTMLIFrameElement(this);}
          else if(tagName.match(/IMG/))                 {node = new HTMLImageElement(this);}
          else if(tagName.match(/INPUT/))               {node = new HTMLInputElement(this);}
          else if(tagName.match(/LABEL/))               {node = new HTMLLabelElement(this);}
          else if(tagName.match(/LEGEND/))              {node = new HTMLLegendElement(this);}
          else if(tagName.match(/^LI$/))                {node = new HTMLElement(this);}
          else if(tagName.match(/LINK/))                {node = new HTMLLinkElement(this);}
          else if(tagName.match(/MAP/))                 {node = new HTMLMapElement(this);}
          else if(tagName.match(/META/))                {node = new HTMLMetaElement(this);}
          else if(tagName.match(/OBJECT/))              {node = new HTMLObjectElement(this);}
          else if(tagName.match(/OL/))                  {node = new HTMLElement(this);}
          else if(tagName.match(/OPTGROUP/))            {node = new HTMLOptGroupElement(this);}
          else if(tagName.match(/OPTION/))              {node = new HTMLOptionElement(this);;}
          else if(tagName.match(/^P$/))                 {node = new HTMLElement(this);}
          else if(tagName.match(/PARAM/))               {node = new HTMLParamElement(this);}
          else if(tagName.match(/PRE/))                 {node = new HTMLElement(this);}
          else if(tagName.match(/SCRIPT/))              {node = new HTMLScriptElement(this);}
          else if(tagName.match(/SELECT/))              {node = new HTMLSelectElement(this);}
          else if(tagName.match(/STYLE/))               {node = new HTMLStyleElement(this);}
          else if(tagName.match(/TABLE/))               {node = new HTMLTableElement(this);}
          else if(tagName.match(/TBODY|TFOOT|THEAD/))   {node = new HTMLTableSectionElement(this);}
          else if(tagName.match(/TD|TH/))               {node = new HTMLTableCellElement(this);}
          else if(tagName.match(/TEXTAREA/))            {node = new HTMLTextAreaElement(this);}
          else if(tagName.match(/TITLE/))               {node = new HTMLTitleElement(this);}
          else if(tagName.match(/TR/))                  {node = new HTMLTableRowElement(this);}
          else if(tagName.match(/UL/))                  {node = new HTMLElement(this);}
          else{
            node = new HTMLElement(this);
          }
        
          // assign values to properties (and aliases)
          node.tagName  = tagName;
          return node;
    },
    createElementNS : function (uri, local) {
        //print('createElementNS :'+uri+" "+local);
        if(!uri){
            return this.createElement(local);
        }else if ("http://www.w3.org/1999/xhtml" == uri) {
             return this.createElement(local);
        } else if ("http://www.w3.org/1998/Math/MathML" == uri) {
          if (!this.mathplayerinitialized) {
              var obj = this.createElement("object");
              obj.setAttribute("id", "mathplayer");
              obj.setAttribute("classid", "clsid:32F66A20-7614-11D4-BD11-00104BD3F987");
              this.getElementsByTagName("head")[0].appendChild(obj);
              this.namespaces.add("m", "http://www.w3.org/1998/Math/MathML", "#mathplayer");  
              this.mathplayerinitialized = true;
          }
          return this.createElement("m:" + local);
        } else {
            return DOMDocument.prototype.createElementNS.apply(this,[uri, local]);
        }
    },
    get anchors(){
        return new HTMLCollection(this.getElementsByTagName('a'), 'Anchor');
        
    },
    get applets(){
        return new HTMLCollection(this.getElementsByTagName('applet'), 'Applet');
        
    },
    get body(){ 
        var nodelist = this.getElementsByTagName('body');
        return nodelist.item(0);
        
    },
    set body(html){
        return this.replaceNode(this.body,html);
        
    },

    get title(){
        var titleArray = this.getElementsByTagName('title');
        if (titleArray.length < 1)
            return "";
        return titleArray[0].text;
    },
    set title(titleStr){
        titleArray = this.getElementsByTagName('title');
        if (titleArray.length < 1){
            // need to make a new element and add it to "head"
            var titleElem = new HTMLTitleElement(this);
            titleElem.text = titleStr;
            var headArray = this.getElementsByTagName('head');
	    if (headArray.length < 1)
                return;  // ill-formed, just give up.....
            headArray[0].appendChild(titleElem);
        }
        else {
            titleArray[0].text = titleStr;
        }
    },

    //set/get cookie see cookie.js
    get domain(){
        return this._domain||window.location.domain;
        
    },
    set domain(){
        /* TODO - requires a bit of thought to enforce domain restrictions */ 
        return; 
        
    },
    get forms(){
      return new HTMLCollection(this.getElementsByTagName('form'), 'Form');
    },
    get images(){
        return new HTMLCollection(this.getElementsByTagName('img'), 'Image');
        
    },
    get lastModified(){ 
        /* TODO */
        return this._lastModified; 
    
    },
    get links(){
        return new HTMLCollection(this.getElementsByTagName('a'), 'Link');
        
    },
    get location(){
        return $w.location
    },
    get referrer(){
        return this._referrer;
    },
	close : function(){ 
	    /* TODO */ 
	    this._open = false;
    },
	getElementsByName : function(name){
        //returns a real Array + the DOMNodeList
        var retNodes = __extend__([],new DOMNodeList(this, this.documentElement)),
          node;
        // loop through all Elements in the 'all' collection
        var all = this.all;
        for (var i=0; i < all.length; i++) {
            node = all[i];
            if (node.nodeType == DOMNode.ELEMENT_NODE && node.getAttribute('name') == name) {
                retNodes.push(node);
            }
        }
        return retNodes;
	},
	open : function(){ 
	    /* TODO */
	    this._open = true;  
    },
	write: function(htmlstring){ 
	    /* TODO */
	    return; 
	
    },
	writeln: function(htmlstring){ 
	    this.write(htmlstring+'\n'); 
    },
	toString: function(){ 
	    return "Document" +  (typeof this._url == "string" ? ": " + this._url : ""); 
    },
	get innerHTML(){ 
	    return this.documentElement.outerHTML; 
	    
    },
	get __html__(){
	    return true;
	    
    },
    get async(){ return this.$async;},
    set async(async){ this.$async = async; },
    get baseURI(){ return $env.location('./'); },
    get URL(){ return $w.location.href;  },
    set URL(url){ $w.location.href = url;  }
});

var __elementPopped__ = function(ns, name, node){
    // print('Element Popped: '+ns+" "+name+ " "+ node+" " +node.type+" "+node.nodeName);
    var doc = __ownerDocument__(node);
    // SMP: subtle issue here: we're currently getting two kinds of script nodes from the html5 parser.
    // The "fake" nodes come with a type of undefined. The "real" nodes come with the type that's given,
    // or null if not given. So the following check has the side-effect of ignoring the "fake" nodes. So
    // something to watch for if this code changes.
    var type = ( node.type === null ) ? "text/javascript" : node.type;
    try{
        if(node.nodeName.toLowerCase() == 'script' && type == "text/javascript"){
            //$env.debug("element popped: script\n"+node.xml);
            // unless we're parsing in a window context, don't execute scripts
            if (doc.parentWindow){
                //p.replaceEntities = true;
                var okay = $env.loadLocalScript(node, null);
                // only fire event if we actually had something to load
                if (node.src && node.src.length > 0){
                    var event = doc.createEvent();
                    event.initEvent( okay ? "load" : "error" );
                    node.dispatchEvent( event, false );
                  }
            }
        }
        else if (node.nodeName.toLowerCase() == 'frame' ||
                 node.nodeName.toLowerCase() == 'iframe'   ){
            
            //$env.debug("element popped: iframe\n"+node.xml);
            if (node.src && node.src.length > 0){
                $debug("getting content document for (i)frame from " + node.src);
    
                $env.loadFrame(node, $env.location(node.src));
    
                var event = doc.createEvent();
                event.initEvent("load");
                node.dispatchEvent( event, false );
            }
        }
        else if (node.nodeName.toLowerCase() == 'link'){
            //$env.debug("element popped: link\n"+node.xml);
            if (node.href && node.href.length > 0){
                // don't actually load anything, so we're "done" immediately:
                var event = doc.createEvent();
                event.initEvent("load");
                node.dispatchEvent( event, false );
            }
        }
        else if (node.nodeName.toLowerCase() == 'img'){
            //$env.debug("element popped: img \n"+node.xml);
            if (node.src && node.src.length > 0){
                // don't actually load anything, so we're "done" immediately:
                var event = doc.createEvent();
                event.initEvent("load");
                node.dispatchEvent( event, false );
            }
        }
    }catch(e){
        $env.error('error loading html element', e);
    }
};

$w.HTMLDocument = HTMLDocument;
$debug("Defining HTMLElement");
/*
* HTMLElement - DOM Level 2
*/
var HTMLElement = function(ownerDocument) {
    this.DOMElement = DOMElement;
    this.DOMElement(ownerDocument);
    
    this.$css2props = null;
};
HTMLElement.prototype = new DOMElement;
__extend__(HTMLElement.prototype, {

		get className() { 
		    return this.getAttribute("class")||''; 
	    },
		set className(value) { 
		    return this.setAttribute("class",trim(value)); 
		    
	    },
		get dir() { 
		    return this.getAttribute("dir")||"ltr"; 
		    
	    },
		set dir(val) { 
		    return this.setAttribute("dir",val); 
		    
	    },
		get id(){  
		    return this.getAttribute('id'); 
		    
	    },
		set id(id){  
		    this.setAttribute('id', id); 
            
	    },
		get innerHTML(){  
		    return this.childNodes.xml; 
		    
	    },
		set innerHTML(html){
		    //Should be replaced with HTMLPARSER usage
            //$debug('SETTING INNER HTML ('+this+'+'+html.substring(0,64));
		    var doc = new DOMParser().
			  parseFromString(html);
            var parent = doc.body;
			while(this.firstChild != null){
			    this.removeChild( this.firstChild );
			}
			var importedNode;
			while(parent.firstChild != null){
	            importedNode = this.importNode( 
	                parent.removeChild( parent.firstChild ), true);
			    this.appendChild( importedNode );   
		    }
		    //Mark for garbage collection
		    doc = null;
		},
        get innerText(){
            return __recursivelyGatherText__(this);
        },
        set innerText(newText){
            this.innerHTML = newText;  // a paranoid would HTML-escape, but...
        },
		get lang() { 
		    return this.getAttribute("lang"); 
		    
	    },
		set lang(val) { 
		    return this.setAttribute("lang",val); 
		    
	    },
		get offsetHeight(){
		    return Number(this.style["height"].replace("px",""));
		},
		get offsetWidth(){
		    return Number(this.style["width"].replace("px",""));
		},
		offsetLeft: 0,
		offsetRight: 0,
		get offsetParent(){
		    /* TODO */
		    return;
	    },
		set offsetParent(element){
		    /* TODO */
		    return;
	    },
		scrollHeight: 0,
		scrollWidth: 0,
		scrollLeft: 0, 
		scrollRight: 0,
		get style(){
		    if(this.$css2props === null){
	            this.$css2props = new CSS2Properties(this);
	        }
	        return this.$css2props;
		},
        set style(values){
		    __updateCss2Props__(this, values);
        },
		setAttribute: function (name, value) {
            DOMElement.prototype.setAttribute.apply(this,[name, value]);
		    if (name === "style") {
		        __updateCss2Props__(this, value);
		    }
		},
		get title() { 
		    return this.getAttribute("title"); 
		    
	    },
		set title(value) { 
		    return this.setAttribute("title", value); 
		    
	    },
		get tabIndex(){
            var ti = this.getAttribute('tabindex');
            if(ti!==null)
                return Number(ti);
            else
                return 0;
        },
        set tabIndex(value){
            if(value===undefined||value===null)
                value = 0;
            this.setAttribute('tabindex',Number(value));
        },
		//Not in the specs but I'll leave it here for now.
		get outerHTML(){ 
		    return this.xml; 
		    
	    },
	    scrollIntoView: function(){
	        /*TODO*/
	        return;
	    
        },

		onclick: function(event){
		    __eval__(this.getAttribute('onclick')||'', this);
	    },
        

		ondblclick: function(event){
            __eval__(this.getAttribute('ondblclick')||'', this);
	    },
		onkeydown: function(event){
            __eval__(this.getAttribute('onkeydown')||'', this);
	    },
		onkeypress: function(event){
            __eval__(this.getAttribute('onkeypress')||'', this);
	    },
		onkeyup: function(event){
            __eval__(this.getAttribute('onkeyup')||'', this);
	    },
		onmousedown: function(event){
            __eval__(this.getAttribute('onmousedown')||'', this);
	    },
		onmousemove: function(event){
            __eval__(this.getAttribute('onmousemove')||'', this);
	    },
		onmouseout: function(event){
            __eval__(this.getAttribute('onmouseout')||'', this);
	    },
		onmouseover: function(event){
            __eval__(this.getAttribute('onmouseover')||'', this);
	    },
		onmouseup: function(event){
            __eval__(this.getAttribute('onmouseup')||'', this);
	    }
});


var __recursivelyGatherText__ = function(aNode) {
    var accumulateText = "";
    var idx; var n;
    for (idx=0;idx < aNode.childNodes.length;idx++){
        n = aNode.childNodes.item(idx);
        if(n.nodeType == DOMNode.TEXT_NODE)
            accumulateText += n.data;
        else
            accumulateText += __recursivelyGatherText__(n);
    }

    return accumulateText;
};
    
var __eval__ = function(script, startingNode){
    if (script == "")
        return;                    // don't assemble environment if no script...

    try{
        var doEval = function(scriptText){
            eval(scriptText);
        }

        var listOfScopes = [];
        for (var node = startingNode; node != null; node = node.parentNode)
            listOfScopes.push(node);
        listOfScopes.push(window);


        var oldScopesArray = $env.configureScope(
          doEval,        // the function whose scope chain to change
          listOfScopes); // last array element is "head" of new chain
        doEval.call(startingNode, script);
        $env.restoreScope(oldScopesArray);
                         // oldScopesArray is N-element array of two-element
                         // arrays.  First element is JS object whose scope
                         // was modified, second is original value to restore.
    }catch(e){
        $error(e);
    }
};

var __updateCss2Props__ = function(elem, values){
    if(elem.$css2props === null){
        elem.$css2props = new CSS2Properties(elem);
    }
    __cssTextToStyles__(elem.$css2props, values);
};

var __registerEventAttrs__ = function(elm){
    if(elm.hasAttribute('onclick')){ 
        elm.addEventListener('click', elm.onclick ); 
    }
    if(elm.hasAttribute('ondblclick')){ 
        elm.addEventListener('dblclick', elm.onclick ); 
    }
    if(elm.hasAttribute('onkeydown')){ 
        elm.addEventListener('keydown', elm.onclick ); 
    }
    if(elm.hasAttribute('onkeypress')){ 
        elm.addEventListener('keypress', elm.onclick ); 
    }
    if(elm.hasAttribute('onkeyup')){ 
        elm.addEventListener('keyup', elm.onclick ); 
    }
    if(elm.hasAttribute('onmousedown')){ 
        elm.addEventListener('mousedown', elm.onclick ); 
    }
    if(elm.hasAttribute('onmousemove')){ 
        elm.addEventListener('mousemove', elm.onclick ); 
    }
    if(elm.hasAttribute('onmouseout')){ 
        elm.addEventListener('mouseout', elm.onclick ); 
    }
    if(elm.hasAttribute('onmouseover')){ 
        elm.addEventListener('mouseover', elm.onclick ); 
    }
    if(elm.hasAttribute('onmouseup')){ 
        elm.addEventListener('mouseup', elm.onclick ); 
    }
    return elm;
};
	
// non-ECMA function, but no other way for click events to enter env.js
var  __click__ = function(element){
    var event = new Event({
      target:element,
      currentTarget:element
    });
    event.initEvent("click");
    element.dispatchEvent(event);
};
var __submit__ = function(element){
	var event = new Event({
	  target:element,
	  currentTarget:element
	});
	event.initEvent("submit");
	element.dispatchEvent(event);
};
var __focus__ = function(element){
	var event = new Event({
	  target:element,
	  currentTarget:element
	});
	event.initEvent("focus");
	element.dispatchEvent(event);
};
var __blur__ = function(element){
	var event = new Event({
	  target:element,
	  currentTarget:element
	});
	event.initEvent("blur");
	element.dispatchEvent(event);
};

$w.HTMLElement = HTMLElement;
$debug("Defining HTMLCollection");
/*
* HTMLCollection - DOM Level 2
* Implementation Provided by Steven Wood
*/
var HTMLCollection = function(nodelist, type){

  __setArray__(this, []);
  for (var i=0; i<nodelist.length; i++) {
      this[i] = nodelist[i];
  }
  
  this.length = nodelist.length;

}

HTMLCollection.prototype = {
        
    item : function (idx) {
        var ret = null;
        if ((idx >= 0) && (idx < this.length)) { 
            ret = this[idx];                    
        }
    
        return ret;   
    },
    
    namedItem : function (name) {
    }
};

$w.HTMLCollection = HTMLCollection;

/*var HTMLCollection = function(nodelist, type){
  var $items = [], 
      $item, i;
  if(type === "Anchor" ){
    for(i=0;i<nodelist.length;i++){ 
      //The name property is required to be add to the collection
      if(nodelist.item(i).name){
        item = new nodelist.item(i);
        $items.push(item);
        this[nodelist.item(i).name] = item;
      }
    }
  }else if(type === "Link"){
    for(i=0;i<nodelist.length;i++){ 
      //The name property is required to be add to the collection
      if(nodelist.item(i).href){
        item = new nodelist.item(i);
        $items.push(item);
        this[nodelist.item(i).name] = item;
      }
    }
  }else if(type === "Form"){
    for(i=0;i<nodelist.length;i++){ 
      //The name property is required to be add to the collection
      if(nodelist.item(i).href){
        item = new nodelist.item(i);
        $items.push(item);
        this[nodelist.item(i).name] = item;
      }
    }
  }
  setArray(this, $items);
  return __extend__(this, {
    item : function(i){return this[i];},
    namedItem : function(name){return this[name];}
  });
};*/

	/*
 *  a set of convenience classes to centralize implementation of
 * properties and methods across multiple in-form elements
 *
 *  the hierarchy of related HTML elements and their members is as follows:
 *
 *
 *    HTMLInputCommon:  common to all elements
 *       .form
 *
 *    <legend>
 *          [common plus:]
 *       .align
 *
 *    <fieldset>
 *          [identical to "legend" plus:]
 *       .margin
 *
 *
 *  ****
 *
 *    <label>
 *          [common plus:]
 *       .dataFormatAs
 *       .htmlFor
 *       [plus data properties]
 *
 *    <option>
 *          [common plus:]
 *       .defaultSelected
 *       .index
 *       .label
 *       .selected
 *       .text
 *       .value   // unique implementation, not duplicated
 *
 *  ****
 *
 *    HTMLTypeValueInputs:  common to remaining elements
 *          [common plus:]
 *       .name
 *       .type
 *       .value
 *       [plus data properties]
 *
 *
 *    <select>
 *       .length
 *       .multiple
 *       .options[]
 *       .selectedIndex
 *       .add()
 *       .remove()
 *       .item()                                       // unimplemented
 *       .namedItem()                                  // unimplemented
 *       [plus ".onchange"]
 *       [plus focus events]
 *       [plus data properties]
 *       [plus ".size"]
 *
 *    <button>
 *       .dataFormatAs   // duplicated from above, oh well....
 *       [plus ".status", ".createTextRange()"]
 *
 *  ****
 *
 *    HTMLInputAreaCommon:  common to remaining elements
 *       .defaultValue
 *       .readOnly
 *       .handleEvent()                                // unimplemented
 *       .select()
 *       .onselect
 *       [plus ".size"]
 *       [plus ".status", ".createTextRange()"]
 *       [plus focus events]
 *       [plus ".onchange"]
 *
 *    <textarea>
 *       .cols
 *       .rows
 *       .wrap                                         // unimplemented
 *       .onscroll                                     // unimplemented
 *
 *    <input>
 *       .alt
 *       .accept                                       // unimplemented
 *       .checked
 *       .complete                                     // unimplemented
 *       .defaultChecked
 *       .dynsrc                                       // unimplemented
 *       .height
 *       .hspace                                       // unimplemented
 *       .indeterminate                                // unimplemented
 *       .loop                                         // unimplemented
 *       .lowsrc                                       // unimplemented
 *       .maxLength
 *       .src
 *       .start                                        // unimplemented
 *       .useMap
 *       .vspace                                       // unimplemented
 *       .width
 *       .onclick
 *       [plus ".size"]
 *       [plus ".status", ".createTextRange()"]

 *    [data properties]                                // unimplemented
 *       .dataFld
 *       .dataSrc

 *    [status stuff]                                   // unimplemented
 *       .status
 *       .createTextRange()

 *    [focus events]
 *       .onblur
 *       .onfocus

 */




$debug("Defining input element 'mix in' objects");
var inputElements_dataProperties = {};
var inputElements_status = {};

var inputElements_onchange = {
    onchange: function(event){
        __eval__(this.getAttribute('onchange')||'', this)
    }
};

var inputElements_size = {
    get size(){
        return Number(this.getAttribute('size'));
    },
    set size(value){
        this.setAttribute('size',value);
    }
};

var inputElements_focusEvents = {
    blur: function(){
        __blur__(this);

        if (this._oldValue != this.value){
            var event = document.createEvent();
            event.initEvent("change");
            this.dispatchEvent( event );
        }
    },
    focus: function(){
        __focus__(this);
        this._oldValue = this.value;
    }
};


$debug("Defining HTMLInputCommon");

/*
* HTMLInputCommon - convenience class, not DOM
*/
var HTMLInputCommon = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLInputCommon.prototype = new HTMLElement;
__extend__(HTMLInputCommon.prototype, {
    get form(){
        var parent = this.parentNode;
        while(parent.nodeName.toLowerCase() != 'form'){
            parent = parent.parentNode;
        }
        return parent;
    },
    get accessKey(){
        return this.getAttribute('accesskey');
    },
    set accessKey(value){
        this.setAttribute('accesskey',value);
    },
    get access(){
        return this.getAttribute('access');
    },
    set access(value){
        this.setAttribute('access', value);
    },
    get disabled(){
        return (this.getAttribute('disabled')=='disabled');
    },
    set disabled(value){
        this.setAttribute('disabled', (value ? 'disabled' :''));
    }
});

$w.HTMLInputCommon = HTMLInputCommon;


$debug("Defining HTMLTypeValueInputs");

/*
* HTMLTypeValueInputs - convenience class, not DOM
*/
var HTMLTypeValueInputs = function(ownerDocument) {
    this.HTMLInputCommon = HTMLInputCommon;
    this.HTMLInputCommon(ownerDocument);

    this._oldValue = "";
};
HTMLTypeValueInputs.prototype = new HTMLInputCommon;
__extend__(HTMLTypeValueInputs.prototype, inputElements_size);
__extend__(HTMLTypeValueInputs.prototype, inputElements_status);
__extend__(HTMLTypeValueInputs.prototype, inputElements_dataProperties);
__extend__(HTMLTypeValueInputs.prototype, {
    get defaultValue(){
        return this.getAttribute('defaultValue');
    },
    set defaultValue(value){
        this.setAttribute('defaultValue', value);
    },
    get name(){
        return this.getAttribute('name')||'';
    },
    set name(value){
        this.setAttribute('name',value);
    },
    get type(){
        return this.getAttribute('type');
    },
    set type(type){
        return this.setAttribute('type', type);
    },
    get value(){
        return this.getAttribute('value')||'';
    },
    set value(newValue){
        this.setAttribute('value',newValue);
    },
    setAttribute: function(name, value){
        if(name == 'value' && !this.defaultValue){
            this.defaultValue = value;
        }
        HTMLElement.prototype.setAttribute.apply(this, [name, value]);
    }
});

$w.HTMLTypeValueInputs = HTMLTypeValueInputs;



$debug("Defining HTMLInputAreaCommon");

/*
* HTMLInputAreaCommon - convenience class, not DOM
*/
var HTMLInputAreaCommon = function(ownerDocument) {
    this.HTMLTypeValueInputs = HTMLTypeValueInputs;
    this.HTMLTypeValueInputs(ownerDocument);
};
HTMLInputAreaCommon.prototype = new HTMLTypeValueInputs;
__extend__(HTMLInputAreaCommon.prototype, inputElements_focusEvents);
__extend__(HTMLInputAreaCommon.prototype, inputElements_onchange);
__extend__(HTMLInputAreaCommon.prototype, {
    get readOnly(){
        return (this.getAttribute('readonly')=='readonly');
    },
    set readOnly(value){
        this.setAttribute('readonly', (value ? 'readonly' :''));
    },
    select:function(){
        __select__(this);

    }
});

$w.HTMLInputAreaCommon = HTMLInputAreaCommon;
$debug("Defining HTMLAnchorElement");
/* 
* HTMLAnchorElement - DOM Level 2
*/
var HTMLAnchorElement = function(ownerDocument) {
    //$log("creating anchor element");
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLAnchorElement.prototype = new HTMLElement;
__extend__(HTMLAnchorElement.prototype, {
	get accessKey() { 
	    return this.getAttribute("accesskey"); 
	    
    },
	set accessKey(val) { 
	    return this.setAttribute("accesskey",val); 
	    
    },
	get charset() { 
	    return this.getAttribute("charset"); 
	    
    },
	set charset(val) { 
	    return this.setAttribute("charset",val); 
	    
    },
	get coords() { 
	    return this.getAttribute("coords"); 
	    
    },
	set coords(val) { 
	    return this.setAttribute("coords",val); 
	    
    },
	get href() { 
	    return this.getAttribute("href"); 
	    
    },
	set href(val) { 
	    return this.setAttribute("href",val); 
	    
    },
	get hreflang() { 
	    return this.getAttribute("hreflang"); 
	    
    },
	set hreflang(val) { 
	    return this.setAttribute("hreflang",val); 
	    
    },
	get name() { 
	    return this.getAttribute("name"); 
	    
    },
	set name(val) { 
	    return this.setAttribute("name",val); 
	    
    },
	get rel() { 
	    return this.getAttribute("rel"); 
	    
    },
	set rel(val) { 
	    return this.setAttribute("rel",val); 
	    
    },
	get rev() { 
	    return this.getAttribute("rev"); 
	    
    },
	set rev(val) { 
	    return this.setAttribute("rev",val); 
	    
    },
	get shape() { 
	    return this.getAttribute("shape"); 
	    
    },
	set shape(val) { 
	    return this.setAttribute("shape",val); 
	    
    },
	get target() { 
	    return this.getAttribute("target"); 
	    
    },
	set target(val) { 
	    return this.setAttribute("target",val); 
	    
    },
	get type() { 
	    return this.getAttribute("type"); 
	    
    },
	set type(val) { 
	    return this.setAttribute("type",val); 
	    
    },
	blur:function(){
	    __blur__(this);
	    
    },
	focus:function(){
	    __focus__(this);
	    
    }
});

$w.HTMLAnchorElement = HTMLAnchorElement;$debug("Defining Anchor");
/* 
* Anchor - DOM Level 2
*/
var Anchor = function(ownerDocument) {
    this.HTMLAnchorElement = HTMLAnchorElement;
    this.HTMLAnchorElement(ownerDocument);
};

(function(){
    //static regular expressions
	var hash 	 = new RegExp('(\\#.*)'),
        hostname = new RegExp('\/\/([^\:\/]+)'),
        pathname = new RegExp('(\/[^\\?\\#]*)'),
        port 	 = new RegExp('\:(\\d+)\/'),
        protocol = new RegExp('(^\\w*\:)'),
        search 	 = new RegExp('(\\?[^\\#]*)');
			
    __extend__(Anchor.prototype, {
		get hash(){
			var m = hash.exec(this.href);
			return m&&m.length>1?m[1]:"";
		},
		set hash(_hash){
			//setting the hash is the only property of the location object
			//that doesn't cause the window to reload
			_hash = _hash.indexOf('#')===0?_hash:"#"+_hash;	
			this.href = this.protocol + this.host + this.pathname + this.search + _hash;
		},
		get host(){
			return this.hostname + (this.port !== "")?":"+this.port:"";
		},
		set host(_host){
			this.href = this.protocol + _host + this.pathname + this.search + this.hash;
		},
		get hostname(){
			var m = hostname.exec(this.href);
			return m&&m.length>1?m[1]:"";
		},
		set hostname(_hostname){
			this.href = this.protocol + _hostname + ((this.port=="")?"":(":"+this.port)) +
			 	 this.pathname + this.search + this.hash;
		},
		get pathname(){
			var m = this.href;
			m = pathname.exec(m.substring(m.indexOf(this.hostname)));
			return m&&m.length>1?m[1]:"/";
		},
		set pathname(_pathname){
			this.href = this.protocol + this.host + _pathname + 
				this.search + this.hash;
		},
		get port(){
			var m = port.exec(this.href);
			return m&&m.length>1?m[1]:"";
		},
		set port(_port){
			this.href = this.protocol + this.hostname + ":"+_port + this.pathname + 
				this.search + this.hash;
		},
		get protocol(){
			return protocol.exec(this.href)[0];
		},
		set protocol(_protocol){
			this.href = _protocol + this.host + this.pathname + 
				this.search + this.hash;
		},
		get search(){
			var m = search.exec(this.href);
			return m&&m.length>1?m[1]:"";
		},
		set search(_search){
			this.href = this.protocol + this.host + this.pathname + 
				_search + this.hash;
		}
  });

})();

$w.Anchor = Anchor;
$debug("Defining HTMLAreaElement");
/* 
* HTMLAreaElement - DOM Level 2
*/
var HTMLAreaElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLAreaElement.prototype = new HTMLElement;
__extend__(HTMLAreaElement.prototype, {
    get accessKey(){
        return this.getAttribute('accesskey');
    },
    set accessKey(value){
        this.setAttribute('accesskey',value);
    },
    get alt(){
        return this.getAttribute('alt');
    },
    set alt(value){
        this.setAttribute('alt',value);
    },
    get coords(){
        return this.getAttribute('coords');
    },
    set coords(value){
        this.setAttribute('coords',value);
    },
    get href(){
        return this.getAttribute('href');
    },
    set href(value){
        this.setAttribute('href',value);
    },
    get noHref(){
        return this.hasAttribute('href');
    },
    get shape(){
        //TODO
        return 0;
    },
    /*get tabIndex(){
        return this.getAttribute('tabindex');
    },
    set tabIndex(value){
        this.setAttribute('tabindex',value);
    },*/
    get target(){
        return this.getAttribute('target');
    },
    set target(value){
        this.setAttribute('target',value);
    }
});

$w.HTMLAreaElement = HTMLAreaElement;
			$debug("Defining HTMLBaseElement");
/* 
* HTMLBaseElement - DOM Level 2
*/
var HTMLBaseElement = function(ownerDocument) {
    //$log("creating anchor element");
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLBaseElement.prototype = new HTMLElement;
__extend__(HTMLBaseElement.prototype, {
    get href(){
        return this.getAttribute('href');
    },
    set href(value){
        this.setAttribute('href',value);
    },
    get target(){
        return this.getAttribute('target');
    },
    set target(value){
        this.setAttribute('target',value);
    }
});

$w.HTMLBaseElement = HTMLBaseElement;		$debug("Defining HTMLQuoteElement");
/* 
* HTMLQuoteElement - DOM Level 2
*/
var HTMLQuoteElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLQuoteElement.prototype = new HTMLElement;
__extend__(HTMLQuoteElement.prototype, {
    get cite(){
        return this.getAttribute('cite');
    },
    set cite(value){
        this.setAttribute('cite',value);
    }
});

$w.HTMLQuoteElement = HTMLQuoteElement;		$debug("Defining HTMLBodyElement");
/*
* HTMLBodyElement - DOM Level 2
*/
var HTMLBodyElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLBodyElement.prototype = new HTMLElement;
__extend__(HTMLBodyElement.prototype, {
    onload: function(event){
        __eval__(this.getAttribute('onload')||'', this)
    },
    onunload: function(event){
        __eval__(this.getAttribute('onunload')||'', this)
    }
});

$w.HTMLBodyElement = HTMLBodyElement;
$debug("Defining HTMLButtonElement");
/*
* HTMLButtonElement - DOM Level 2
*/
var HTMLButtonElement = function(ownerDocument) {
    this.HTMLTypeValueInputs = HTMLTypeValueInputs;
    this.HTMLTypeValueInputs(ownerDocument);
};
HTMLButtonElement.prototype = new HTMLTypeValueInputs;
__extend__(HTMLButtonElement.prototype, inputElements_status);
__extend__(HTMLButtonElement.prototype, {
    get dataFormatAs(){
        return this.getAttribute('dataFormatAs');
    },
    set dataFormatAs(value){
        this.setAttribute('dataFormatAs',value);
    }
});

$w.HTMLButtonElement = HTMLButtonElement;

$debug("Defining HTMLTableColElement");
/* 
* HTMLTableColElement - DOM Level 2
*/
var HTMLTableColElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLTableColElement.prototype = new HTMLElement;
__extend__(HTMLTableColElement.prototype, {
    get align(){
        return this.getAttribute('align');
    },
    set align(value){
        this.setAttribute('align', value);
    },
    get ch(){
        return this.getAttribute('ch');
    },
    set ch(value){
        this.setAttribute('ch', value);
    },
    get chOff(){
        return this.getAttribute('ch');
    },
    set chOff(value){
        this.setAttribute('ch', value);
    },
    get span(){
        return this.getAttribute('span');
    },
    set span(value){
        this.setAttribute('span', value);
    },
    get vAlign(){
        return this.getAttribute('valign');
    },
    set vAlign(value){
        this.setAttribute('valign', value);
    },
    get width(){
        return this.getAttribute('width');
    },
    set width(value){
        this.setAttribute('width', value);
    }
});

$w.HTMLTableColElement = HTMLTableColElement;
$debug("Defining HTMLModElement");
/* 
* HTMLModElement - DOM Level 2
*/
var HTMLModElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLModElement.prototype = new HTMLElement;
__extend__(HTMLModElement.prototype, {
    get cite(){
        return this.getAttribute('cite');
    },
    set cite(value){
        this.setAttribute('cite', value);
    },
    get dateTime(){
        return this.getAttribute('datetime');
    },
    set dateTime(value){
        this.setAttribute('datetime', value);
    }
});

$w.HTMLModElement = HTMLModElement;	/*
 * This file is a component of env.js,
 *     http://github.com/gleneivey/env-js/commits/master/README
 * a Pure JavaScript Browser Environment
 * Copyright 2009 John Resig, licensed under the MIT License
 *     http://www.opensource.org/licenses/mit-license.php
 */


$debug("Defining HTMLDivElement");
/*
* HTMLDivElement - DOM Level 2
*/
var HTMLDivElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLDivElement.prototype = new HTMLElement;
__extend__(HTMLDivElement.prototype, {
    get align(){
        return this.getAttribute('align') || 'left';
    },
    set align(value){
        this.setAttribute('align', value);
    }
});

$w.HTMLDivElement = HTMLDivElement;
$debug("Defining HTMLLegendElement");
/*
* HTMLLegendElement - DOM Level 2
*/
var HTMLLegendElement = function(ownerDocument) {
    this.HTMLInputCommon = HTMLInputCommon;
    this.HTMLInputCommon(ownerDocument);
};
HTMLLegendElement.prototype = new HTMLInputCommon;
__extend__(HTMLLegendElement.prototype, {
    get align(){
        return this.getAttribute('align');
    },
    set align(value){
        this.setAttribute('align',value);
    }
});

$w.HTMLLegendElement = HTMLLegendElement;
$debug("Defining HTMLFieldSetElement");
/*
* HTMLFieldSetElement - DOM Level 2
*/
var HTMLFieldSetElement = function(ownerDocument) {
    this.HTMLLegendElement = HTMLLegendElement;
    this.HTMLLegendElement(ownerDocument);
};
HTMLFieldSetElement.prototype = new HTMLLegendElement;
__extend__(HTMLFieldSetElement.prototype, {
    get margin(){
        return this.getAttribute('margin');
    },
    set margin(value){
        this.setAttribute('margin',value);
    }
});

$w.HTMLFieldSetElement = HTMLFieldSetElement;
$debug("Defining HTMLFormElement");
/* 
* HTMLFormElement - DOM Level 2
*/
var HTMLFormElement = function(ownerDocument){
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLFormElement.prototype = new HTMLElement;
__extend__(HTMLFormElement.prototype,{
    get acceptCharset(){ 
        return this.getAttribute('accept-charset');
        
    },
    set acceptCharset(acceptCharset){
        this.setAttribute('accept-charset', acceptCharset);
        
    },
    get action(){
        return this.getAttribute('action');
        
    },
    set action(action){
        this.setAttribute('action', action);
        
    },
    get elements() {
        return this.getElementsByTagName("*");
        
    },
    get enctype(){
        return this.getAttribute('enctype');
        
    },
    set enctype(enctype){
        this.setAttribute('enctype', enctype);
        
    },
    get length() {
        return this.elements.length;
        
    },
    get method(){
        return this.getAttribute('method');
        
    },
    set method(action){
        this.setAttribute('method', method);
        
    },
	get name() {
	    return this.getAttribute("name"); 
	    
    },
	set name(val) { 
	    return this.setAttribute("name",val); 
	    
    },
	get target() { 
	    return this.getAttribute("target"); 
	    
    },
	set target(val) { 
	    return this.setAttribute("target",val); 
	    
    },
	submit:function(){
	    __submit__(this);
	    
    },
	reset:function(){
	    __reset__(this);
	    
    },
    onsubmit:function(){
        if (__eval__(this.getAttribute('onsubmit')||'', this)) {
            this.submit();
        }
    },
    onreset:function(){
        if (__eval__(this.getAttribute('onreset')||'', this)) {
            this.reset();
        }
    }
});

$w.HTMLFormElement	= HTMLFormElement;$debug("Defining HTMLFrameElement");
/* 
* HTMLFrameElement - DOM Level 2
*/
var HTMLFrameElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLFrameElement.prototype = new HTMLElement;
__extend__(HTMLFrameElement.prototype, {
    get frameBorder(){
        return this.getAttribute('border')||"";
    },
    set frameBorder(value){
        this.setAttribute('border', value);
    },
    get longDesc(){
        return this.getAttribute('longdesc')||"";
    },
    set longDesc(value){
        this.setAttribute('longdesc', value);
    },
    get marginHeight(){
        return this.getAttribute('marginheight')||"";
    },
    set marginHeight(value){
        this.setAttribute('marginheight', value);
    },
    get marginWidth(){
        return this.getAttribute('marginwidth')||"";
    },
    set marginWidth(value){
        this.setAttribute('marginwidth', value);
    },
    get name(){
        return this.getAttribute('name')||"";
    },
    set name(value){
        this.setAttribute('name', value);
    },
    get noResize(){
        return this.getAttribute('noresize')||"";
    },
    set noResize(value){
        this.setAttribute('noresize', value);
    },
    get scrolling(){
        return this.getAttribute('scrolling')||"";
    },
    set scrolling(value){
        this.setAttribute('scrolling', value);
    },
    get src(){
        return this.getAttribute('src')||"";
    },
    set src(value){
        this.setAttribute('src', value);

        if (value && value.length > 0){
            $env.loadFrame(this, $env.location(value));
            
            var event = document.createEvent();
            event.initEvent("load");
            this.dispatchEvent( event, false );
        }
    },
    get contentDocument(){
        if (!this._content)
            return null;
        return this._content.document;
    },
    get contentWindow(){
        return this._content;
    },
    onload: function(event){
        __eval__(this.getAttribute('onload')||'', this)
    }
});

$w.HTMLFrameElement = HTMLFrameElement;
$debug("Defining HTMLFrameSetElement");
/* 
* HTMLFrameSetElement - DOM Level 2
*/
var HTMLFrameSetElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLFrameSetElement.prototype = new HTMLElement;
__extend__(HTMLFrameSetElement.prototype, {
    get cols(){
        return this.getAttribute('cols');
    },
    set cols(value){
        this.setAttribute('cols', value);
    },
    get rows(){
        return this.getAttribute('rows');
    },
    set rows(value){
        this.setAttribute('rows', value);
    }
});

$w.HTMLFrameSetElement = HTMLFrameSetElement;	$debug("Defining HTMLHeadElement");
/* 
* HTMLHeadElement - DOM Level 2
*/
var HTMLHeadElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLHeadElement.prototype = new HTMLElement;
__extend__(HTMLHeadElement.prototype, {
    get profile(){
        return this.getAttribute('profile');
    },
    set profile(value){
        this.setAttribute('profile', value);
    },
    //we override this so we can apply browser behavior specific to head children
    //like loading scripts
    appendChild : function(newChild) {
        var newChild = HTMLElement.prototype.appendChild.apply(this,[newChild]);
        //__evalScript__(newChild);
        return newChild;
    },
    insertBefore : function(newChild, refChild) {
        var newChild = HTMLElement.prototype.insertBefore.apply(this,[newChild]);
        //__evalScript__(newChild);
        return newChild;
    }
});

var __evalScript__ = function(newChild){
    //check to see if this is a script element and apply a script loading strategy
    //the check against the ownerDocument isnt really enough to support frames in
    // the long run, but for now it's ok
    if(newChild.nodeType == DOMNode.ELEMENT_NODE && 
        newChild.ownerDocument == window.document ){
        if(newChild.nodeName.toUpperCase() == "SCRIPT"){
            $debug("loading script via policy. ");
            $policy.loadScript(newChild);
        }
    }
};

$w.HTMLHeadElement = HTMLHeadElement;
$debug("Defining HTMLIFrameElement");
/* 
* HTMLIFrameElement - DOM Level 2
*/
var HTMLIFrameElement = function(ownerDocument) {
    this.HTMLFrameElement = HTMLFrameElement;
    this.HTMLFrameElement(ownerDocument);
};
HTMLIFrameElement.prototype = new HTMLFrameElement;
__extend__(HTMLIFrameElement.prototype, {
	get height() { 
	    return this.getAttribute("height") || ""; 
    },
	set height(val) { 
	    return this.setAttribute("height",val); 
    },
	get width() { 
	    return this.getAttribute("width") || ""; 
    },
	set width(val) { 
	    return this.setAttribute("width",val); 
    }
});

$w.HTMLIFrameElement = HTMLIFrameElement;
			$debug("Defining HTMLImageElement");
/* 
* HTMLImageElement - DOM Level 2
*/
var HTMLImageElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLImageElement.prototype = new HTMLElement;
__extend__(HTMLImageElement.prototype, {
    get alt(){
        return this.getAttribute('alt');
    },
    set alt(value){
        this.setAttribute('alt', value);
    },
    get height(){
        return this.getAttribute('height');
    },
    set height(value){
        this.setAttribute('height', value);
    },
    get isMap(){
        return this.hasAttribute('map');
    },
    set useMap(value){
        this.setAttribute('map', value);
    },
    get longDesc(){
        return this.getAttribute('longdesc');
    },
    set longDesc(value){
        this.setAttribute('longdesc', value);
    },
    get name(){
        return this.getAttribute('name');
    },
    set name(value){
        this.setAttribute('name', value);
    },
    get src(){
        return this.getAttribute('src');
    },
    set src(value){
        this.setAttribute('src', value);

        var event = document.createEvent();
        event.initEvent("load");
        this.dispatchEvent( event, false );
    },
    get width(){
        return this.getAttribute('width');
    },
    set width(value){
        this.setAttribute('width', value);
    },
    onload: function(event){
        __eval__(this.getAttribute('onload')||'', this)
    }
});

$w.HTMLImageElement = HTMLImageElement;$debug("Defining HTMLInputElement");
/*
* HTMLInputElement - DOM Level 2
*/
var HTMLInputElement = function(ownerDocument) {
    this.HTMLInputAreaCommon = HTMLInputAreaCommon;
    this.HTMLInputAreaCommon(ownerDocument);
};
HTMLInputElement.prototype = new HTMLInputAreaCommon;
__extend__(HTMLInputElement.prototype, {
    get alt(){
        return this.getAttribute('alt');
    },
    set alt(value){
        this.setAttribute('alt', value);
    },
    get checked(){
        return (this.getAttribute('checked')=='checked');
    },
    set checked(value){
        this.setAttribute('checked', (value ? 'checked' :''));
    },
    get defaultChecked(){
        return this.getAttribute('defaultChecked');
    },
    get height(){
        return this.getAttribute('height');
    },
    set height(value){
        this.setAttribute('height',value);
    },
    get maxLength(){
        return Number(this.getAttribute('maxlength')||'0');
    },
    set maxLength(value){
        this.setAttribute('maxlength', value);
    },
    get src(){
        return this.getAttribute('src');
    },
    set src(value){
        this.setAttribute('src', value);
    },
    get useMap(){
        return this.getAttribute('map');
    },
    get width(){
        return this.getAttribute('width');
    },
    set width(value){
        this.setAttribute('width',value);
    },
    click:function(){
        __click__(this);
    }
});

$w.HTMLInputElement = HTMLInputElement;

$debug("Defining HTMLLabelElement");
/* 
* HTMLLabelElement - DOM Level 2
*/
var HTMLLabelElement = function(ownerDocument) {
    this.HTMLInputCommon = HTMLInputCommon;
    this.HTMLInputCommon(ownerDocument);
};
HTMLLabelElement.prototype = new HTMLInputCommon;
__extend__(HTMLLabelElement.prototype, inputElements_dataProperties);
__extend__(HTMLLabelElement.prototype, {
    get htmlFor(){
        return this.getAttribute('for');
    },
    set htmlFor(value){
        this.setAttribute('for',value);
    },
    get dataFormatAs(){
        return this.getAttribute('dataFormatAs');
    },
    set dataFormatAs(value){
        this.setAttribute('dataFormatAs',value);
    }
});

$w.HTMLLabelElement = HTMLLabelElement;
/**
* Link - HTMLElement 
*/
$w.__defineGetter__("Link", function(){
  return function(){
    throw new Error("Object cannot be created in this context");
  };
});


$debug("Defining HTMLLinkElement");
/* 
* HTMLLinkElement - DOM Level 2
*/
var HTMLLinkElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLLinkElement.prototype = new HTMLElement;
__extend__(HTMLLinkElement.prototype, {
    get disabled(){
        return this.getAttribute('disabled');
    },
    set disabled(value){
        this.setAttribute('disabled',value);
    },
    get charset(){
        return this.getAttribute('charset');
    },
    set charset(value){
        this.setAttribute('charset',value);
    },
    get href(){
        return this.getAttribute('href');
    },
    set href(value){
        this.setAttribute('href',value);
    },
    get hreflang(){
        return this.getAttribute('hreflang');
    },
    set hreflang(value){
        this.setAttribute('hreflang',value);
    },
    get media(){
        return this.getAttribute('media');
    },
    set media(value){
        this.setAttribute('media',value);
    },
    get rel(){
        return this.getAttribute('rel');
    },
    set rel(value){
        this.setAttribute('rel',value);
    },
    get rev(){
        return this.getAttribute('rev');
    },
    set rev(value){
        this.setAttribute('rev',value);
    },
    get target(){
        return this.getAttribute('target');
    },
    set target(value){
        this.setAttribute('target',value);
    },
    get type(){
        return this.getAttribute('type');
    },
    set type(value){
        this.setAttribute('type',value);
    },
    onload: function(event){
        __eval__(this.getAttribute('onload')||'', this)
    }
});

$w.HTMLLinkElement = HTMLLinkElement;
$debug("Defining HTMLMapElement");
/* 
* HTMLMapElement - DOM Level 2
*/
var HTMLMapElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLMapElement.prototype = new HTMLElement;
__extend__(HTMLMapElement.prototype, {
    get areas(){
        return this.getElementsByTagName('area');
    },
    get name(){
        return this.getAttribute('name');
    },
    set name(value){
        this.setAttribute('name',value);
    }
});

$w.HTMLMapElement = HTMLMapElement;$debug("Defining HTMLMetaElement");
/* 
* HTMLMetaElement - DOM Level 2
*/
var HTMLMetaElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLMetaElement.prototype = new HTMLElement;
__extend__(HTMLMetaElement.prototype, {
    get content(){
        return this.getAttribute('content');
    },
    set content(value){
        this.setAttribute('content',value);
    },
    get httpEquiv(){
        return this.getAttribute('http-equiv');
    },
    set httpEquiv(value){
        this.setAttribute('http-equiv',value);
    },
    get name(){
        return this.getAttribute('name');
    },
    set name(value){
        this.setAttribute('name',value);
    },
    get scheme(){
        return this.getAttribute('scheme');
    },
    set scheme(value){
        this.setAttribute('scheme',value);
    }
});

$w.HTMLMetaElement = HTMLMetaElement;
$debug("Defining HTMLObjectElement");
/* 
* HTMLObjectElement - DOM Level 2
*/
var HTMLObjectElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLObjectElement.prototype = new HTMLElement;
__extend__(HTMLObjectElement.prototype, {
    get code(){
        return this.getAttribute('code');
    },
    set code(value){
        this.setAttribute('code',value);
    },
    get archive(){
        return this.getAttribute('archive');
    },
    set archive(value){
        this.setAttribute('archive',value);
    },
    get codeBase(){
        return this.getAttribute('codebase');
    },
    set codeBase(value){
        this.setAttribute('codebase',value);
    },
    get codeType(){
        return this.getAttribute('codetype');
    },
    set codeType(value){
        this.setAttribute('codetype',value);
    },
    get data(){
        return this.getAttribute('data');
    },
    set data(value){
        this.setAttribute('data',value);
    },
    get declare(){
        return this.getAttribute('declare');
    },
    set declare(value){
        this.setAttribute('declare',value);
    },
    get height(){
        return this.getAttribute('height');
    },
    set height(value){
        this.setAttribute('height',value);
    },
    get standby(){
        return this.getAttribute('standby');
    },
    set standby(value){
        this.setAttribute('standby',value);
    },
    /*get tabIndex(){
        return this.getAttribute('tabindex');
    },
    set tabIndex(value){
        this.setAttribute('tabindex',value);
    },*/
    get type(){
        return this.getAttribute('type');
    },
    set type(value){
        this.setAttribute('type',value);
    },
    get useMap(){
        return this.getAttribute('usemap');
    },
    set useMap(value){
        this.setAttribute('usemap',value);
    },
    get width(){
        return this.getAttribute('width');
    },
    set width(value){
        this.setAttribute('width',value);
    },
    get contentDocument(){
        return this.ownerDocument;
    }
});

$w.HTMLObjectElement = HTMLObjectElement;
			$debug("Defining HTMLOptGroupElement");
/* 
* HTMLOptGroupElement - DOM Level 2
*/
var HTMLOptGroupElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLOptGroupElement.prototype = new HTMLElement;
__extend__(HTMLOptGroupElement.prototype, {
    get disabled(){
        return this.getAttribute('disabled');
    },
    set disabled(value){
        this.setAttribute('disabled',value);
    },
    get label(){
        return this.getAttribute('label');
    },
    set label(value){
        this.setAttribute('label',value);
    },
});

$w.HTMLOptGroupElement = HTMLOptGroupElement;		$debug("Defining HTMLOptionElement");
/*
* HTMLOptionElement - DOM Level 2
*/
var HTMLOptionElement = function(ownerDocument) {
    this.HTMLInputCommon = HTMLInputCommon;
    this.HTMLInputCommon(ownerDocument);
};
HTMLOptionElement.prototype = new HTMLInputCommon;
__extend__(HTMLOptionElement.prototype, {
    get defaultSelected(){
        return this.getAttribute('defaultSelected');
    },
    set defaultSelected(value){
        this.setAttribute('defaultSelected',value);
    },
    get index(){
        var options = this.parent.childNodes;
        for(var i; i<options.length;i++){
            if(this == options[i])
                return i;
        }
        return -1;
    },
    get label(){
        return this.getAttribute('label');
    },
    set label(value){
        this.setAttribute('label',value);
    },
    get selected(){
        return (this.getAttribute('selected')=='selected');
    },
    set selected(value){
        if(this.defaultSelected===null && this.selected!==null){
            this.defaultSelected = this.selected;
        }
        var selectedValue = (value ? 'selected' : '');
        if (this.getAttribute('selected') == selectedValue) {
            // prevent inifinite loops (option's selected modifies 
            // select's value which modifies option's selected)
            return;
        }
        this.setAttribute('selected', selectedValue);
        if (value) {
            // set select's value to this option's value (this also 
            // unselects previously selected value)
            this.parentNode.value = this.value;
        } else {
            // if no other option is selected, select the first option in the select
            var i, anythingSelected;
            for (i=0; i<this.parentNode.options.length; i++) {
                if (this.parentNode.options[i].selected) {
                    anythingSelected = true;
                    break;
                }
            }
            if (!anythingSelected) {
                this.parentNode.value = this.parentNode.options[0].value;
            }
        }

    },
    get text(){
         return ((this.nodeValue === null) ||  (this.nodeValue ===undefined)) ?
             this.innerHTML :
             this.nodeValue;
    },
    get value(){
        return ((this.getAttribute('value') === undefined) || (this.getAttribute('value') === null)) ?
            this.text :
            this.getAttribute('value');
    },
    set value(value){
        this.setAttribute('value',value);
    }
});

$w.HTMLOptionElement = HTMLOptionElement;
$debug("Defining HTMLParamElement");
/* 
* HTMLParamElement - DOM Level 2
*/
var HTMLParamElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLParamElement.prototype = new HTMLElement;
__extend__(HTMLParamElement.prototype, {
    get name(){
        return this.getAttribute('name');
    },
    set name(value){
        this.setAttribute('name',value);
    },
    get type(){
        return this.getAttribute('type');
    },
    set type(value){
        this.setAttribute('type',value);
    },
    get value(){
        return this.getAttribute('value');
    },
    set value(value){
        this.setAttribute('value',value);
    },
    get valueType(){
        return this.getAttribute('valuetype');
    },
    set valueType(value){
        this.setAttribute('valuetype',value);
    },
});

$w.HTMLParamElement = HTMLParamElement;
		$debug("Defining HTMLScriptElement");
/* 
* HTMLScriptElement - DOM Level 2
*/
var HTMLScriptElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLScriptElement.prototype = new HTMLElement;
__extend__(HTMLScriptElement.prototype, {
    get text(){
        // text of script is in a child node of the element
        // scripts with < operator must be in a CDATA node
        for (var i=0; i<this.childNodes.length; i++) {
            if (this.childNodes[i].nodeType == DOMNode.CDATA_SECTION_NODE) {
                return this.childNodes[i].nodeValue;
            }
        } 
        // otherwise there will be a text node containing the script
        if (this.childNodes[0] && this.childNodes[0].nodeType == DOMNode.TEXT_NODE) {
            return this.childNodes[0].nodeValue;
 		}
        return this.nodeValue;

    },
    set text(value){
        this.nodeValue = value;
        $env.loadInlineScript(this);
    },
    get htmlFor(){
        return this.getAttribute('for');
    },
    set htmlFor(value){
        this.setAttribute('for',value);
    },
    get event(){
        return this.getAttribute('event');
    },
    set event(value){
        this.setAttribute('event',value);
    },
    get charset(){
        return this.getAttribute('charset');
    },
    set charset(value){
        this.setAttribute('charset',value);
    },
    get defer(){
        return this.getAttribute('defer');
    },
    set defer(value){
        this.setAttribute('defer',value);
    },
    get src(){
        return this.getAttribute('src');
    },
    set src(value){
        this.setAttribute('src',value);
    },
    get type(){
        return this.getAttribute('type');
    },
    set type(value){
        this.setAttribute('type',value);
    },
    onload: function(event){
        __eval__(this.getAttribute('onload')||'', this);
    },
    onerror: function(event){
        __eval__(this.getAttribute('onerror')||'', this);
    }
});

$w.HTMLScriptElement = HTMLScriptElement;$debug("Defining HTMLSelectElement");
/*
* HTMLSelectElement - DOM Level 2
*/
var HTMLSelectElement = function(ownerDocument) {
    this.HTMLTypeValueInputs = HTMLTypeValueInputs;
    this.HTMLTypeValueInputs(ownerDocument);

    this._oldIndex = -1;
};
HTMLSelectElement.prototype = new HTMLTypeValueInputs;
__extend__(HTMLSelectElement.prototype, inputElements_dataProperties);
__extend__(HTMLButtonElement.prototype, inputElements_size);
__extend__(HTMLSelectElement.prototype, inputElements_onchange);
__extend__(HTMLSelectElement.prototype, inputElements_focusEvents);
__extend__(HTMLSelectElement.prototype, {

    // over-ride the value setter in HTMLTypeValueInputs
    set value(newValue) {
        var options = this.options,
            i, index;
        for (i=0; i<options.length; i++) {
            if (options[i].value == newValue) {
                index = i;
                break;
            }
        }
        if (index !== undefined) {
            this.setAttribute('value', newValue);
            this.selectedIndex = index;
        }
    },
    get value() {
        var value = this.getAttribute('value');
        if (value === undefined || value === null) {
            var index = this.selectedIndex;
            return (index != -1) ? this.options[index].value : "";
        } else {
            return value;
        }
    },


    get length(){
        return this.options.length;
    },
    get multiple(){
        return this.getAttribute('multiple');
    },
    set multiple(value){
        this.setAttribute('multiple',value);
    },
    get options(){
        return this.getElementsByTagName('option');
    },
    get selectedIndex(){
        var options = this.options;
        for(var i=0;i<options.length;i++){
            if(options[i].selected){
                return i;
            }
        };
        return -1;
    },
    
    set selectedIndex(value) {
        var i;
        for (i=0; i<this.options.length; i++) {
            this.options[i].selected = (i == Number(value));
        }
    },
    get type(){
        var type = this.getAttribute('type');
        return type?type:'select-one';
    },

    add : function(){
        __add__(this);
    },
    remove : function(){
        __remove__(this);
    }
});

$w.HTMLSelectElement = HTMLSelectElement;

$debug("Defining HTMLStyleElement");
/* 
* HTMLStyleElement - DOM Level 2
*/
var HTMLStyleElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLStyleElement.prototype = new HTMLElement;
__extend__(HTMLStyleElement.prototype, {
    get disabled(){
        return this.getAttribute('disabled');
    },
    set disabled(value){
        this.setAttribute('disabled',value);
    },
    get media(){
        return this.getAttribute('media');
    },
    set media(value){
        this.setAttribute('media',value);
    },
    get type(){
        return this.getAttribute('type');
    },
    set type(value){
        this.setAttribute('type',value);
    }
});

$w.HTMLStyleElement = HTMLStyleElement;$debug("Defining HTMLTableElement");
/* 
* HTMLTableElement - DOM Level 2
* Implementation Provided by Steven Wood
*/
var HTMLTableElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);

};

HTMLTableElement.prototype = new HTMLElement;
__extend__(HTMLTableElement.prototype, {
    
        get tFoot() { 
        //tFoot returns the table footer.
        return this.getElementsByTagName("tfoot")[0];
    },
    
    createTFoot : function () {
        var tFoot = this.tFoot;
       
        if (!tFoot) {
            tFoot = document.createElement("tfoot");
            this.appendChild(tFoot);
        }
        
        return tFoot;
    },
    
    deleteTFoot : function () {
        var foot = this.tFoot;
        if (foot) {
            foot.parentNode.removeChild(foot);
        }
    },
    
    get tHead() { 
        //tHead returns the table head.
        return this.getElementsByTagName("thead")[0];
    },
    
    createTHead : function () {
        var tHead = this.tHead;
       
        if (!tHead) {
            tHead = document.createElement("thead");
            this.insertBefore(tHead, this.firstChild);
        }
        
        return tHead;
    },
    
    deleteTHead : function () {
        var head = this.tHead;
        if (head) {
            head.parentNode.removeChild(head);
        }
    },
 
    appendChild : function (child) {
        
        var tagName;
        if(child&&child.nodeType==DOMNode.ELEMENT_NODE){
            tagName = child.tagName.toLowerCase();
            if (tagName === "tr") {
                // need an implcit <tbody> to contain this...
                if (!this.currentBody) {
                    this.currentBody = document.createElement("tbody");
                
                    DOMNode.prototype.appendChild.apply(this, [this.currentBody]);
                }
              
                return this.currentBody.appendChild(child); 
       
            } else if (tagName === "tbody" || tagName === "tfoot" && this.currentBody) {
                this.currentBody = child;
                return DOMNode.prototype.appendChild.apply(this, arguments);  
                
            } else {
                return DOMNode.prototype.appendChild.apply(this, arguments);
            }
        }else{
            //tables can still have text node from white space
            return DOMNode.prototype.appendChild.apply(this, arguments);
        }
    },
     
    get tBodies() {
        return new HTMLCollection(this.getElementsByTagName("tbody"));
        
    },
    
    get rows() {
        return new HTMLCollection(this.getElementsByTagName("tr"));
    },
    
    insertRow : function (idx) {
        if (idx === undefined) {
            throw new Error("Index omitted in call to HTMLTableElement.insertRow ");
        }
        
        var rows = this.rows, 
            numRows = rows.length,
            node,
            inserted, 
            lastRow;
        
        if (idx > numRows) {
            throw new Error("Index > rows.length in call to HTMLTableElement.insertRow");
        }
        
        var inserted = document.createElement("tr");
        // If index is -1 or equal to the number of rows, 
        // the row is appended as the last row. If index is omitted 
        // or greater than the number of rows, an error will result
        if (idx === -1 || idx === numRows) {
            this.appendChild(inserted);
        } else {
            rows[idx].parentNode.insertBefore(inserted, rows[idx]);
        }

        return inserted;
    },
    
    deleteRow : function (idx) {
        var elem = this.rows[idx];
        elem.parentNode.removeChild(elem);
    },
    
    get summary() {
        return this.getAttribute("summary");
    },
    
    set summary(summary) {
        this.setAttribute("summary", summary);
    },
    
    get align() {
        return this.getAttribute("align");
    },
    
    set align(align) {
        this.setAttribute("align", align);
    },
    
     
    get bgColor() {
        return this.getAttribute("bgColor");
    },
    
    set bgColor(bgColor) {
        return this.setAttribute("bgColor", bgColor);
    },
   
    get cellPadding() {
        return this.getAttribute("cellPadding");
    },
    
    set cellPadding(cellPadding) {
        return this.setAttribute("cellPadding", cellPadding);
    },
    
    
    get cellSpacing() {
        return this.getAttribute("cellSpacing");
    },
    
    set cellSpacing(cellSpacing) {
        this.setAttribute("cellSpacing", cellSpacing);
    },

    get frame() {
        return this.getAttribute("frame");
    },
    
    set frame(frame) { 
        this.setAttribute("frame", frame);
    },
    
    get rules() {
        return this.getAttribute("rules");
    }, 
    
    set rules(rules) {
        this.setAttribute("rules", rules);
    }, 
    
    get width() {
        return this.getAttribute("width");
    },
    
    set width(width) {
        this.setAttribute("width", width);
    }
    
});

$w.HTMLTableElement = HTMLTableElement;		$debug("Defining HTMLTableSectionElement");
/* 
* HTMLxElement - DOM Level 2
* - Contributed by Steven Wood
*/
var HTMLTableSectionElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLTableSectionElement.prototype = new HTMLElement;
__extend__(HTMLTableSectionElement.prototype, {    
    
    appendChild : function (child) {
    
        // disallow nesting of these elements.
        if (child.tagName.match(/TBODY|TFOOT|THEAD/)) {
            return this.parentNode.appendChild(child);
        } else {
            return DOMNode.prototype.appendChild.apply(this, arguments);
        }

    },
    
    get align() {
        return this.getAttribute("align");
    },

    get ch() {
        return this.getAttribute("ch");
    },
     
    set ch(ch) {
        this.setAttribute("ch", ch);
    },
    
    // ch gets or sets the alignment character for cells in a column. 
    set chOff(chOff) {
        this.setAttribute("chOff", chOff);
    },
     
    get chOff(chOff) {
        return this.getAttribute("chOff");
    },
     
    get vAlign () {
         return this.getAttribute("vAlign");
    },
    
    get rows() {
        return new HTMLCollection(this.getElementsByTagName("tr"));
    },
    
    insertRow : function (idx) {
        if (idx === undefined) {
            throw new Error("Index omitted in call to HTMLTableSectionElement.insertRow ");
        }
        
        var numRows = this.rows.length,
            node = null;
        
        if (idx > numRows) {
            throw new Error("Index > rows.length in call to HTMLTableSectionElement.insertRow");
        }
        
        var row = document.createElement("tr");
        // If index is -1 or equal to the number of rows, 
        // the row is appended as the last row. If index is omitted 
        // or greater than the number of rows, an error will result
        if (idx === -1 || idx === numRows) {
            this.appendChild(row);
        } else {
            node = this.firstChild;

            for (var i=0; i<idx; i++) {
                node = node.nextSibling;
            }
        }
            
        this.insertBefore(row, node);
        
        return row;
    },
    
    deleteRow : function (idx) {
        var elem = this.rows[idx];
        this.removeChild(elem);
    }

});

$w.HTMLTableSectionElement = HTMLTableSectionElement;
$debug("Defining HTMLTableCellElement");
/* 
* HTMLTableCellElement - DOM Level 2
* Implementation Provided by Steven Wood
*/
var HTMLTableCellElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLTableCellElement.prototype = new HTMLElement;
__extend__(HTMLTableCellElement.prototype, {
    
    
    // TODO :
    
});

$w.HTMLTableCellElement	= HTMLTableCellElement;$debug("Defining HTMLTextAreaElement");
/*
* HTMLTextAreaElement - DOM Level 2
*/
var HTMLTextAreaElement = function(ownerDocument) {
    this.HTMLInputAreaCommon = HTMLInputAreaCommon;
    this.HTMLInputAreaCommon(ownerDocument);
};
HTMLTextAreaElement.prototype = new HTMLInputAreaCommon;
__extend__(HTMLTextAreaElement.prototype, {
    get cols(){
        return this.getAttribute('cols');
    },
    set cols(value){
        this.setAttribute('cols', value);
    },
    get rows(){
        return this.getAttribute('rows');
    },
    set rows(value){
        this.setAttribute('rows', value);
    }
});

$w.HTMLTextAreaElement = HTMLTextAreaElement;
$debug("Defining HTMLTitleElement");
/* 
* HTMLTitleElement - DOM Level 2
*/
var HTMLTitleElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLTitleElement.prototype = new HTMLElement;
__extend__(HTMLTitleElement.prototype, {
    get text() {
        return this.innerText;
    },

    set text(titleStr) {
        this.innerHTML = titleStr; // if paranoid, would error on embedded HTML
    }
});

$w.HTMLTitleElement = HTMLTitleElement;
$debug("Defining HTMLTableRowElement");
/* 
* HTMLRowElement - DOM Level 2
* Implementation Provided by Steven Wood
*/
var HTMLTableRowElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);

};
HTMLTableRowElement.prototype = new HTMLElement;
__extend__(HTMLTableRowElement.prototype, {
    
    appendChild : function (child) {
    
       var retVal = DOMNode.prototype.appendChild.apply(this, arguments);
       retVal.cellIndex = this.cells.length -1;
             
       return retVal;
    },
    // align gets or sets the horizontal alignment of data within cells of the row.
    get align() {
        return this.getAttribute("align");
    },
     
    get bgColor() {
        return this.getAttribute("bgcolor");
    },
         
    get cells() {
        var nl = this.getElementsByTagName("td");
        return new HTMLCollection(nl);
    },
       
    get ch() {
        return this.getAttribute("ch");
    },
     
    set ch(ch) {
        this.setAttribute("ch", ch);
    },
    
    // ch gets or sets the alignment character for cells in a column. 
    set chOff(chOff) {
        this.setAttribute("chOff", chOff);
    },
     
    get chOff(chOff) {
        return this.getAttribute("chOff");
    },
   
    get rowIndex() {
        var nl = this.parentNode.childNodes;
        for (var i=0; i<nl.length; i++) {
            if (nl[i] === this) {
                return i;
            }
        }
    },

    get sectionRowIndex() {
        var nl = this.parentNode.getElementsByTagName(this.tagName);
        for (var i=0; i<nl.length; i++) {
            if (nl[i] === this) {
                return i;
            }
        }
    },
     
    get vAlign () {
         return this.getAttribute("vAlign");
    },

    insertCell : function (idx) {
        if (idx === undefined) {
            throw new Error("Index omitted in call to HTMLTableRow.insertCell");
        }
        
        var numCells = this.cells.length,
            node = null;
        
        if (idx > numCells) {
            throw new Error("Index > rows.length in call to HTMLTableRow.insertCell");
        }
        
        var cell = document.createElement("td");

        if (idx === -1 || idx === numCells) {
            this.appendChild(cell);
        } else {
            

            node = this.firstChild;

            for (var i=0; i<idx; i++) {
                node = node.nextSibling;
            }
        }
            
        this.insertBefore(cell, node);
        cell.cellIndex = idx;
          
        return cell;
    },

    
    deleteCell : function (idx) {
        var elem = this.cells[idx];
        this.removeChild(elem);
    }

});

$w.HTMLTableRowElement = HTMLTableRowElement;
/**
 * @author thatcher
 */
$debug("Defining XMLSerializer");
/*
* XMLSerializer 
*/
$w.__defineGetter__("XMLSerializer", function(){
    return new XMLSerializer(arguments);
});

var XMLSerializer = function() {

};
__extend__(XMLSerializer.prototype, {
    serializeToString: function(node){
        return node.xml;
    }
});/**
 * @author thatcher
 */
$debug("Defining XPathExpression");
/*
* XPathExpression 
*/
$w.__defineGetter__("XPathExpression", function(){
    return XPathExpression;
});

var XPathExpression = function() {};
__extend__(XPathExpression.prototype, {
    evaluate: function(){
        //TODO for now just return an empty XPathResult
        return new XPathResult();        
    }
});/**
 * @author thatcher
 */
$debug("Defining XPathResult");
/*
* XPathResult 
*/
$w.__defineGetter__("XPathResult", function(){
    return XPathResult;
});

var XPathResult = function() {
    this.snapshotLength = 0;
    this.stringValue = '';
};

__extend__( XPathResult, {
    ANY_TYPE:                     0,
    NUMBER_TYPE:                  1,
    STRING_TYPE:                  2,
    BOOLEAN_TYPE:                 3,
    UNORDERED_NODE_ITERATOR_TYPE: 4,
    ORDERED_NODEITERATOR_TYPE:    5,
    UNORDERED_NODE_SNAPSHOT_TYPE: 6,
    ORDERED_NODE_SNAPSHOT_TYPE:   7,
    ANY_ORDERED_NODE_TYPE:        8,
    FIRST_ORDERED_NODE_TYPE:      9
});

__extend__(XPathResult.prototype, {
    get booleanValue(){
      //TODO  
    },
    get invalidIteration(){
        //TODO
    },
    get numberValue(){
        //TODO
    },
    get resultType(){
        //TODO
    },
    get singleNodeValue(){
        //TODO
    },
    iterateNext: function(){
        //TODO
    },
    snapshotItem: function(index){
        //TODO
    }
});

/**
 * @author thatcher
 */

$w.__defineGetter__("XSLTProcessor", function(){
    return new XSLTProcessor(arguments);
});

var XSLTProcessor = function() {
    this.__stylesheet__ = null;
};
__extend__(XSLTProcessor.prototype, {
    clearParameters: function(){
        //TODO
    },
    getParameter: function(nsuri, name){
        //TODO
    },
    importStyleSheet: function(stylesheet){
        this.__stylesheet__ = stylesheet;
    },
    removeParameter: function(nsuri, name){
        //TODO
    },
    reset: function(){
        //TODO
    },
    setParameter: function(nsuri, name, value){
        //TODO
    },
    transformToDocument: function(sourceNode){
        return xsltProcess(sourceNode, this.__stylesheet__);
    },
    transformToFragment: function(sourceNode, ownerDocument){
        return xsltProcess(sourceNode, this.__stylesheet__).childNodes;
    }
});$debug("Defining Event");
/*
* event.js
*/
var Event = function(options){
  if(options === undefined){
      options={target:window,currentTarget:window};
  }
  __extend__(this,{
    CAPTURING_PHASE : 1,
    AT_TARGET       : 2,
    BUBBLING_PHASE  : 3
  });
  $debug("Creating new Event");
  var $bubbles = options.bubbles?options.bubbles:true,
      $cancelable = options.cancelable?options.cancelable:true,
      $currentTarget = options.currentTarget?options.currentTarget:null,
      $eventPhase = options.eventPhase?options.eventPhase:Event.CAPTURING_PHASE,
      $target = options.target?options.target:document,
      $timestamp = options.timestamp?options.timestamp:new Date().getTime().toString(),
      $type = options.type?options.type:"";
  return __extend__(this,{
    get bubbles(){return $bubbles;},
    get cancelable(){return $cancelable;},
    get currentTarget(){return $currentTarget;},
    get eventPhase(){return $eventPhase;},
    get target(){return $target;},
    get timestamp(){return $timestamp;},
    get type(){return $type;},
    initEvent: function(type,bubbles,cancelable){
      $type=type?type:$type;
      $bubbles=bubbles?bubbles:$bubbles;
      $cancelable=cancelable?cancelable:$cancelable;
    },
    preventDefault: function(){return;/* TODO */},
    stopPropagation: function(){return;/* TODO */}
  });
};

$w.Event = Event;
$debug("Defining MouseEvent");
/*
*	mouseevent.js
*/
$debug("Defining UiEvent");
/*
*	uievent.js
*/

var $onblur,
    $onfocus,
    $onresize;/*
* CSS2Properties - DOM Level 2 CSS
*/
var CSS2Properties = function(element){
    //this.onSetCallback = options.onSet?options.onSet:(function(){});
    this.styleIndex = __supportedStyles__();
    this.nameMap = {};
    this.__previous__ = {};
    this.__element__ = element;
    __cssTextToStyles__(this, element.getAttribute('style')||'');
};
__extend__(CSS2Properties.prototype, {
    get cssText(){
        var css = '';
        for(var i=0;i<this.length;i++){
            css+=this[i]+":"+this.getPropertyValue(this[i])+';'
        }
        return css;
    },
    set cssText(cssText){ 
        __cssTextToStyles__(this, cssText); 
    },
    getPropertyCSSValue : function(name){
        //?
    },
    getPropertyPriority : function(){
        
    },
    getPropertyValue : function(name){
        if(name in this.styleIndex){
            //$info(name +' in style index');
            return this[name];
        }else if(name in this.nameMap){
            return this[__toCamelCase__(name)];
        }
        //$info(name +' not found');
        return null;
    },
    item : function(index){
        return this[index];
    },
    removeProperty: function(name){
        this.styleIndex[name] = null;
    },
    setProperty: function(name, value){
        //$info('setting css property '+name+' : '+value);
        name = __toCamelCase__(name);
        if(name in this.styleIndex){
            //$info('setting camel case css property ');
            if (value!==undefined){
                this.styleIndex[name] = value;
            }
            if(name!==__toDashed__(name)){
                //$info('setting dashed name css property ');
                name = __toDashed__(name);
                this[name] = value;
                if(!(name in this.nameMap)){
                    Array.prototype.push.apply(this, [name]);
                    this.nameMap[name] = this.length;
                }
                
            }
        }
        //$info('finished setting css property '+name+' : '+value);
    },
    toString:function(){
        if (this.length >0){
            return "{\n\t"+Array.prototype.join.apply(this,[';\n\t'])+"}\n";
        }else{
            return '';
        }
    }
});



var __cssTextToStyles__ = function(css2props, cssText){
    //var styleArray=[];
    var style, styles = cssText.split(';');
    for ( var i = 0; i < styles.length; i++ ) {
        //$log("Adding style property " + styles[i]);
    	style = styles[i].split(':');
        //$log(" style  " + style[0]);
    	if ( style.length == 2 ){
            //$log(" value  " + style[1]);
    	    css2props.setProperty( style[0].replace(" ",'','g'), style[1].replace(" ",'','g'));
    	}
    }
};

var __toCamelCase__ = function(name) {
    //$info('__toCamelCase__'+name);
    if(name){
    	return name.replace(/\-(\w)/g, function(all, letter){
    		return letter.toUpperCase();
    	});
    }
    return name;
};

var __toDashed__ = function(camelCaseName) {
    //$info("__toDashed__"+camelCaseName);
    if(camelCaseName){
    	return camelCaseName.replace(/[A-Z]/g, function(all) {
    		return "-" + all.toLowerCase();
    	});
    }
    return camelCaseName;
};

//Obviously these arent all supported but by commenting out various sections
//this provides a single location to configure what is exposed as supported.
var __supportedStyles__ = function(){
    return {
        azimuth:                null,
        background:	            null,
        backgroundAttachment:	null,
        backgroundColor:	    null,
        backgroundImage:	    null,
        backgroundPosition:	    null,
        backgroundRepeat:	    null,
        border:	                null,
        borderBottom:	        null,
        borderBottomColor:	    null,
        borderBottomStyle:	    null,
        borderBottomWidth:	    null,
        borderCollapse:	        null,
        borderColor:	        null,
        borderLeft:	            null,
        borderLeftColor:	    null,
        borderLeftStyle:	    null,
        borderLeftWidth:	    null,
        borderRight:	        null,
        borderRightColor:	    null,
        borderRightStyle:	    null,
        borderRightWidth:	    null,
        borderSpacing:	        null,
        borderStyle:	        null,
        borderTop:	            null,
        borderTopColor:	        null,
        borderTopStyle:	        null,
        borderTopWidth:	        null,
        borderWidth:	        null,
        bottom:	                null,
        captionSide:	        null,
        clear:	                null,
        clip:	                null,
        color:	                null,
        content:	            null,
        counterIncrement:	    null,
        counterReset:	        null,
        cssFloat:	            null,
        cue:	                null,
        cueAfter:	            null,
        cueBefore:	            null,
        cursor:	                null,
        direction:	            'ltr',
        display:	            null,
        elevation:	            null,
        emptyCells:	            null,
        font:	                null,
        fontFamily:	            null,
        fontSize:	            "1em",
        fontSizeAdjust:	null,
        fontStretch:	null,
        fontStyle:	null,
        fontVariant:	null,
        fontWeight:	null,
        height:	'1px',
        left:	null,
        letterSpacing:	null,
        lineHeight:	null,
        listStyle:	null,
        listStyleImage:	null,
        listStylePosition:	null,
        listStyleType:	null,
        margin:	null,
        marginBottom:	"0px",
        marginLeft:	"0px",
        marginRight:	"0px",
        marginTop:	"0px",
        markerOffset:	null,
        marks:	null,
        maxHeight:	null,
        maxWidth:	null,
        minHeight:	null,
        minWidth:	null,
        opacity:	1,
        orphans:	null,
        outline:	null,
        outlineColor:	null,
        outlineOffset:	null,
        outlineStyle:	null,
        outlineWidth:	null,
        overflow:	null,
        overflowX:	null,
        overflowY:	null,
        padding:	null,
        paddingBottom:	"0px",
        paddingLeft:	"0px",
        paddingRight:	"0px",
        paddingTop:	"0px",
        page:	null,
        pageBreakAfter:	null,
        pageBreakBefore:	null,
        pageBreakInside:	null,
        pause:	null,
        pauseAfter:	null,
        pauseBefore:	null,
        pitch:	null,
        pitchRange:	null,
        position:	null,
        quotes:	null,
        richness:	null,
        right:	null,
        size:	null,
        speak:	null,
        speakHeader:	null,
        speakNumeral:	null,
        speakPunctuation:	null,
        speechRate:	null,
        stress:	null,
        tableLayout:	null,
        textAlign:	null,
        textDecoration:	null,
        textIndent:	null,
        textShadow:	null,
        textTransform:	null,
        top:	null,
        unicodeBidi:	null,
        verticalAlign:	null,
        visibility:	null,
        voiceFamily:	null,
        volume:	null,
        whiteSpace:	null,
        widows:	null,
        width:	'1px',
        wordSpacing:	null,
        zIndex:	1
    };
};

var __displayMap__ = {
		"DIV"      : "block",
		"P"        : "block",
		"A"        : "inline",
		"CODE"     : "inline",
		"PRE"      : "block",
		"SPAN"     : "inline",
		"TABLE"    : "table",
		"THEAD"    : "table-header-group",
		"TBODY"    : "table-row-group",
		"TR"       : "table-row",
		"TH"       : "table-cell",
		"TD"       : "table-cell",
		"UL"       : "block",
		"LI"       : "list-item"
};
var __styleMap__ = __supportedStyles__();

for(var style in __supportedStyles__()){
    (function(name){
        if(name === 'width' || name === 'height'){
            CSS2Properties.prototype.__defineGetter__(name, function(){
                if(this.display==='none'){
                    return '0px';
                }
                //$info(name+' = '+this.getPropertyValue(name));
                return this.styleIndex[name];
            });
        }else if(name === 'display'){
            //display will be set to a tagName specific value if ""
            CSS2Properties.prototype.__defineGetter__(name, function(){
                var val = this.styleIndex[name];
                val = val?val:__displayMap__[this.__element__.tagName];
                //$log(" css2properties.get  " + name + "="+val+" for("+this.__element__.tagName+")");
                return val;
            });
        }else{
            CSS2Properties.prototype.__defineGetter__(name, function(){
                //$log(" css2properties.get  " + name + "="+this.styleIndex[name]);
                return this.styleIndex[name];
            });
       }
       CSS2Properties.prototype.__defineSetter__(name, function(value){
           //$log(" css2properties.set  " + name +"="+value);
           this.setProperty(name, value);
       });
    })(style);
};


$w.CSS2Properties = CSS2Properties;/* 
* CSSRule - DOM Level 2
*/
var CSSRule = function(options){
  var $style, 
      $selectorText = options.selectorText?options.selectorText:"";
      $style = new CSS2Properties({
          cssText:options.cssText?options.cssText:null
      });
    return __extend__(this, {
      get style(){
          return $style;
      },
      get selectorText(){
          return $selectorText;
      },
      set selectorText(selectorText){
          $selectorText = selectorText;
      }
    });
};
$w.CSSRule = CSSRule;
/* 
* CSSStyleSheet - DOM Level 2
*/
var CSSStyleSheet = function(options){
    var $cssRules, 
        $disabled = options.disabled?options.disabled:false,
        $href = options.href?options.href:null,
        $parentStyleSheet = options.parentStyleSheet?options.parentStyleSheet:null,
        $title = options.title?options.title:"",
        $type = "text/css";
        
    function parseStyleSheet(text){
        $debug("parsing css");
        //this is pretty ugly, but text is the entire text of a stylesheet
        var cssRules = [];
    	if (!text) text = "";
    	text = trim(text.replace(/\/\*(\r|\n|.)*\*\//g,""));
    	// TODO: @import ?
    	var blocks = text.split("}");
    	blocks.pop();
    	var i, len = blocks.length;
    	var definition_block, properties, selectors;
    	for (i=0; i<len; i++){
    		definition_block = blocks[i].split("{");
    		if(definition_block.length === 2){
      		selectors = definition_block[0].split(",");
      		for(var j=0;j<selectors.length;j++){
      		  cssRules.push(new CSSRule({
      		    selectorText:selectors[j],
      		    cssText:definition_block[1]
      		  }));
      		}
      		__setArray__($cssRules, cssRules);
    		}
    	}
    };
    parseStyleSheet(options.text);
    return __extend__(this, {
      get cssRules(){return $cssRules;},
      get rule(){return $cssRules;},//IE - may be deprecated
      get href(){return $href;},
      get parentStyleSheet(){return $parentStyleSheet;},
      get title(){return $title;},
      get type(){return $type;},
      addRule: function(selector, style, index){/*TODO*/},
      deleteRule: function(index){/*TODO*/},
      insertRule: function(rule, index){/*TODO*/},
      removeRule: function(index){this.deleteRule(index);}//IE - may be deprecated
    });
};

$w.CSSStyleSheet = CSSStyleSheet;
/*
*	location.js
*   - requires env
*/
$debug("Initializing Window Location.");
//the current location
var $location = '';

$w.__defineSetter__("location", function(url){
    if ($w.$isOriginalWindow){
        if ($w.$haveCalledWindowLocationSetter)
            throw new Error("Cannot call 'window.location=' multiple times " +
              "from the context used to load 'env.js'.  Try using " +
              "'window.open()' to get a new context.");
        $w.$haveCalledWindowLocationSetter = true;
        $env.load(url);
    }
    else {
        $env.unload($w);
        var proxy = $w;
        if (proxy.$thisWindowsProxyObject)
            proxy = proxy.$thisWindowsProxyObject;
        $env.reload(proxy, url);
    }
});


$w.__defineGetter__("location", function(url){
	var hash 	 = new RegExp('(\\#.*)'),
		hostname = new RegExp('\/\/([^\:\/]+)'),
		pathname = new RegExp('(\/[^\\?\\#]*)'),
		port 	 = new RegExp('\:(\\d+)\/'),
		protocol = new RegExp('(^\\w*\:)'),
		search 	 = new RegExp('(\\?[^\\#]*)');
	return {
		get hash(){
			var m = hash.exec(this.href);
			return m&&m.length>1?m[1]:"";
		},
		set hash(_hash){
			//setting the hash is the only property of the location object
			//that doesn't cause the window to reload
			_hash = _hash.indexOf('#')===0?_hash:"#"+_hash;	
			$location = this.protocol + this.host + this.pathname + 
				this.search + _hash;
			setHistory(_hash, "hash");
		},
		get host(){
			return this.hostname + (this.port !== "")?":"+this.port:"";
		},
		set host(_host){
			$w.location = this.protocol + _host + this.pathname + 
				this.search + this.hash;
		},
		get hostname(){
			var m = hostname.exec(this.href);
			return m&&m.length>1?m[1]:"";
		},
		set hostname(_hostname){
			$w.location = this.protocol + _hostname + ((this.port==="")?"":(":"+this.port)) +
			 	 this.pathname + this.search + this.hash;
		},
		get href(){
			//This is the only env specific function
			return $location;
		},
		set href(url){
			$w.location = url;	
		},
		get pathname(){
			var m = this.href;
			m = pathname.exec(m.substring(m.indexOf(this.hostname)));
			return m&&m.length>1?m[1]:"/";
		},
		set pathname(_pathname){
			$w.location = this.protocol + this.host + _pathname + 
				this.search + this.hash;
		},
		get port(){
			var m = port.exec(this.href);
			return m&&m.length>1?m[1]:"";
		},
		set port(_port){
			$w.location = this.protocol + this.hostname + ":"+_port + this.pathname + 
				this.search + this.hash;
		},
		get protocol(){
			return this.href && protocol.exec(this.href)[0];
		},
		set protocol(_protocol){
			$w.location = _protocol + this.host + this.pathname + 
				this.search + this.hash;
		},
		get search(){
			var m = search.exec(this.href);
			return m&&m.length>1?m[1]:"";
		},
		set search(_search){
			$w.location = this.protocol + this.host + this.pathname + 
				_search + this.hash;
		},
		toString: function(){
			return this.href;
		},
        reload: function(force){
            // ignore 'force': we don't implement a cache
            var thisWindow = $w;
            $env.unload(thisWindow);
            try { thisWindow = thisWindow.$thisWindowsProxyObject; }catch (e){}
            $env.reload(thisWindow, thisWindow.location.href);
        },
        replace: function(url){
            $location = url;
            $w.location.reload();
        }
    };
});

/*
*	history.js
*/

	$currentHistoryIndex = 0;
	$history = [];
	
	// Browser History
	$w.__defineGetter__("history", function(){	
		return {
			get length(){ return $history.length; },
			back : function(count){
				if(count){
					go(-count);
				}else{go(-1);}
			},
			forward : function(count){
				if(count){
					go(count);
				}else{go(1);}
			},
			go : function(target){
				if(typeof target == "number"){
					target = $currentHistoryIndex+target;
					if(target > -1 && target < $history.length){
						if($history[target].location == "hash"){
							$w.location.hash = $history[target].value;
						}else{
							$w.location = $history[target].value;
						}
						$currentHistoryIndex = target;
						//remove the last item added to the history
						//since we are moving inside the history
						$history.pop();
					}
				}else{
					//TODO: walk throu the history and find the 'best match'
				}
			}
		};
	});

	//Here locationPart is the particutlar method/attribute 
	// of the location object that was modified.  This allows us
	// to modify the correct portion of the location object
	// when we navigate the history
	var __setHistory__ = function( value, locationPart){
	    $info("adding value to history: " +value);
		$currentHistoryIndex++;
		$history.push({
			location: locationPart||"href",
			value: value
		});
	};
	/*
*	navigator.js
*   - requires env
*/
$debug("Initializing Window Navigator.");

var $appCodeName  = $env.appCodeName;//eg "Mozilla"
var $appName      = $env.appName;//eg "Gecko/20070309 Firefox/2.0.0.3"

// Browser Navigator
$w.__defineGetter__("navigator", function(){	
	return {
		get appCodeName(){
			return $appCodeName;
		},
		get appName(){
			return $appName;
		},
		get appVersion(){
			return $version +" ("+ 
			    $w.navigator.platform +"; "+
			    "U; "+//?
			    $env.os_name+" "+$env.os_arch+" "+$env.os_version+"; "+
			    $env.lang+"; "+
			    "rv:"+$revision+
			  ")";
		},
		get cookieEnabled(){
			return true;
		},
		get mimeTypes(){
			return [];
		},
		get platform(){
			return $env.platform;
		},
		get plugins(){
			return [];
		},
		get userAgent(){
			return $w.navigator.appCodeName + "/" + $w.navigator.appVersion + " " + $w.navigator.appName;
		},
		javaEnabled : function(){
			return $env.javaEnabled;	
		}
	};
});

/*
*	timer.js
*/

$debug("Initializing Window Timer.");

//private
var $timers = $env.timers = $env.timers || [];
var $event_loop_running = false;
$timers.lock = $env.sync(function(fn){fn();});

var $timer = function(fn, interval){
  this.fn = fn;
  this.interval = interval;
  this.at = Date.now() + interval;
  this.running = false; // allows for calling wait() from callbacks
};
  
$timer.prototype.start = function(){};
$timer.prototype.stop = function(){};

var convert_time = function(time) {
  time = time*1;
  if ( isNaN(time) || time < 0 ) {
    time = 0;
  }
  // html5 says this should be at least 4, but the parser is using a setTimeout for the SAX stuff
  // which messes up the world
  var min = /* 4 */ 0;
  if ( $event_loop_running && time < min ) {
    time = min;
  }
  return time;
}

window.setTimeout = function(fn, time){
  var num;
  time = convert_time(time);
  $timers.lock(function(){
    num = $timers.length+1;
    var tfn;
    if (typeof fn == 'string') {
      tfn = function() {
        try {
          eval(fn);
        } catch (e) {
          $env.error(e);
        } finally {
          window.clearInterval(num);
        }
      };
    } else {
      tfn = function() {
        try {
          fn();
        } catch (e) {
          $env.error(e);
        } finally {
          window.clearInterval(num);
        }
      };
    }
    $debug("Creating timer number "+num);
    $timers[num] = new $timer(tfn, time);
    $timers[num].start();
  });
  return num;
};

window.setInterval = function(fn, time){
  time = convert_time(time);
  if ( time < 10 ) {
    time = 10;
  }
  if (typeof fn == 'string') {
    var fnstr = fn; 
    fn = function() { 
      eval(fnstr);
    }; 
  }
  var num;
  $timers.lock(function(){
    num = $timers.length+1;
    //$debug("Creating timer number "+num);
    $timers[num] = new $timer(fn, time);
    $timers[num].start();
  });
  return num;
};

window.clearInterval = window.clearTimeout = function(num){
  //$log("clearing interval "+num);
  $timers.lock(function(){
    if ( $timers[num] ) {
      $timers[num].stop();
      delete $timers[num];
    }
  });
};	

// wait === null/undefined: execute any timers as they fire, waiting until there are none left
// wait(n) (n > 0): execute any timers as they fire until there are none left waiting at least n ms
// but no more, even if there are future events/current threads
// wait(0): execute any immediately runnable timers and return
// wait(-n): keep sleeping until the next event is more than n ms in the future

// FIX: make a priority queue ...

window.$wait = $env.wait = $env.wait || function(wait) {
  var delta_wait;
  if (wait < 0) {
    delta_wait = -wait;
    wait = 0;
  }
  var start = Date.now();
  var old_loop_running = $event_loop_running;
  $event_loop_running = true; 
  if (wait !== 0 && wait !== null && wait !== undefined){
    wait += Date.now();
  }
  for (;;) {
    var earliest;
    $timers.lock(function(){
      earliest = undefined;
      for(var i in $timers){
        if( isNaN(i*0) ) {
          continue;
        }
        var timer = $timers[i];
        if( !timer.running && ( !earliest || timer.at < earliest.at) ) {
          earliest = timer;
        }
      }
    });
    var sleep = earliest && earliest.at - Date.now();
    if ( earliest && sleep <= 0 ) {
      var f = earliest.fn;
      try {
        earliest.running = true;
        f();
      } catch (e) {
        $env.error(e);
      } finally {
        earliest.running = false;
      }
      var goal = earliest.at + earliest.interval;
      var now = Date.now();
      if ( goal < now ) {
        earliest.at = now;
      } else {
        earliest.at = goal;
      }
      continue;
    }

    // bunch of subtle cases here ...
    if ( !earliest ) {
      // no events in the queue (but maybe XHR will bring in events, so ...
      if ( !wait || wait < Date.now() ) {
        // Loop ends if there are no events and a wait hasn't been requested or has expired
        break;
      }
      // no events, but a wait requested: fall through to sleep
    } else {
      // there are events in the queue, but they aren't firable now
      if ( delta_wait && sleep <= delta_wait ) {
        // if they will happen within the next delta, fall through to sleep
      } else if ( wait === 0 || ( wait > 0 && wait < Date.now () ) ) {
        // loop ends even if there are events but the user specifcally asked not to wait too long
        break;
      }
      // there are events and the user wants to wait: fall through to sleep
    }

    // Related to ajax threads ... hopefully can go away ..
    var interval =  $wait.interval || 100;
    if ( !sleep || sleep > interval ) {
      sleep = interval;
    }
    java.lang.Thread.currentThread().sleep(sleep);
  }
  $event_loop_running = old_loop_running;
};

/*
* event.js
*/
// Window Events
$debug("Initializing Window Event.");
var $events = [{}],
    $onerror,
    $onload,
    $onunload;

$w.addEventListener = function(type, fn){
    $debug("adding event listener \n\t" + type +" \n\tfor "+this+" with callback \n\t"+fn);
	if ( !this.uuid ) {
		this.uuid = $events.length;
		$events[this.uuid] = {};
	}
	if ( !$events[this.uuid][type] ){
		$events[this.uuid][type] = [];
	}
	if ( $events[this.uuid][type].indexOf( fn ) < 0 ){
		$events[this.uuid][type].push( fn );
	}
};

$w.removeEventListener = function(type, fn){
  if ( !this.uuid ) {
    this.uuid = $events.length;
    $events[this.uuid] = {};
  }
  if ( !$events[this.uuid][type] ){
		$events[this.uuid][type] = [];
	}	
  $events[this.uuid][type] =
    $events[this.uuid][type].filter(function(f){
			return f != fn;
		});
};

$w.dispatchEvent = function(event, bubbles){
    $debug("dispatching event " + event.type);

    //the window scope defines the $event object, for IE(^^^) compatibility;
    $event = event;

    if (bubbles == undefined || bubbles == null)
        bubbles = true;

    if (!event.target) {
        $debug("no event target : "+event.target);
        event.target = this;
    }
    $debug("event target: " + event.target);
    if ( event.type && (this.nodeType             ||
                        this === window           ||
                        this.__proto__ === window ||
                        this.$thisWindowsProxyObject === window)) {
        $debug("nodeType: " + this.nodeType);
        if ( this.uuid && $events[this.uuid][event.type] ) {
            var _this = this;
            $events[this.uuid][event.type].forEach(function(fn){
                $debug('calling event handler '+fn+' on target '+_this);
                fn( event );
            });
        }
    
        if (this["on" + event.type]) {
            $debug('calling event handler on'+event.type+' on target '+this);
            this["on" + event.type](event);
        }
    }else{
        $debug("non target: " + event.target + " \n this->"+this);
    }
    if (bubbles && this.parentNode){
        this.parentNode.dispatchEvent(event);
    }
};
	
$w.__defineGetter__('onerror', function(){
  return function(){
   //$w.dispatchEvent('error');
  };
});

$w.__defineSetter__('onerror', function(fn){
  //$w.addEventListener('error', fn);
});

/*$w.__defineGetter__('onload', function(){
  return function(){
		//var event = document.createEvent();
		//event.initEvent("load");
   //$w.dispatchEvent(event);
  };
});

$w.__defineSetter__('onload', function(fn){
  //$w.addEventListener('load', fn);
});

$w.__defineGetter__('onunload', function(){
  return function(){
   //$w.dispatchEvent('unload');
  };
});

$w.__defineSetter__('onunload', function(fn){
  //$w.addEventListener('unload', fn);
});*//*
*	xhr.js
*/
$debug("Initializing Window XMLHttpRequest.");
// XMLHttpRequest
// Originally implemented by Yehuda Katz
$w.XMLHttpRequest = function(){
	this.headers = {};
	this.responseHeaders = {};
    this.$continueProcessing = true;
	$debug("creating xhr");
};

XMLHttpRequest.prototype = {
	open: function(method, url, async, user, password){ 
		this.readyState = 1;
		if (async === false ){
			this.async = false;
		}else{ this.async = true; }
		this.method = method || "GET";
		this.url = $env.location(url);
		this.onreadystatechange();
	},
	setRequestHeader: function(header, value){
		this.headers[header] = value;
	},
	send: function(data){
		var _this = this;
		
		function makeRequest(){
            $env.connection(_this, function(){
                if (_this.$continueProcessing){
                    var responseXML = null;
                    _this.__defineGetter__("responseXML", function(){
                        if ( _this.responseText.match(/^\s*</) ) {
                          if(responseXML){
                              return responseXML;

                          }else{
                                try {
                                    $debug("parsing response text into xml document");
                                    responseXML = $domparser.parseFromString(_this.responseText+"");
                                    return responseXML;
                                } catch(e) {
                                    $error('response XML does not apear to be well formed xml', e);
                                    responseXML = $domparser.parseFromString("<html>"+
                                        "<head/><body><p> parse error </p></body></html>");
                                    return responseXML;
                                }
                            }
                        }else{
                            $env.warn('response XML does not apear to be xml');
                            return null;
                        }
                    });
                    _this.__defineSetter__("responseXML",function(xml){
                        responseXML = xml;
                    });
                }
			}, data);

            if (_this.$continueProcessing)
                _this.onreadystatechange();
		}

		if (this.async){
		    $debug("XHR sending asynch;");
			$env.runAsync(makeRequest);
		}else{
		    $debug("XHR sending synch;");
			makeRequest();
		}
	},
	abort: function(){
        this.$continueProcessing = false;
	},
	onreadystatechange: function(){
		//TODO
	},
	getResponseHeader: function(header){
        $debug('GETTING RESPONSE HEADER '+header);
	  var rHeader, returnedHeaders;
		if (this.readyState < 3){
			throw new Error("INVALID_STATE_ERR");
		} else {
			returnedHeaders = [];
			for (rHeader in this.responseHeaders) {
				if (rHeader.match(new RegExp(header, "i")))
					returnedHeaders.push(this.responseHeaders[rHeader]);
			}
            
			if (returnedHeaders.length){ 
                $debug('GOT RESPONSE HEADER '+returnedHeaders.join(", "));
                return returnedHeaders.join(", "); 
            }
		}
        return null;
	},
	getAllResponseHeaders: function(){
	  var header, returnedHeaders = [];
		if (this.readyState < 3){
			throw new Error("INVALID_STATE_ERR");
		} else {
			for (header in this.responseHeaders){
				returnedHeaders.push( header + ": " + this.responseHeaders[header] );
			}
		}return returnedHeaders.join("\r\n");
	},
	async: true,
	readyState: 0,
	responseText: "",
	status: 0
};/*
*	css.js
*/
$debug("Initializing Window CSS");
// returns a CSS2Properties object that represents the style
// attributes and values used to render the specified element in this
// window.  Any length values are always expressed in pixel, or
// absolute values.

$w.getComputedStyle = function(elt, pseudo_elt){
  //TODO
  //this is a naive implementation
  $debug("Getting computed style");
  return elt?elt.style:new CSS2Properties({cssText:""});
};/*
*	screen.js
*/
$debug("Initializing Window Screen.");

var $availHeight  = 600,
    $availWidth   = 800,
    $colorDepth    = 16,
    $height       = 600,
    $width        = 800;
    
$w.__defineGetter__("screen", function(){
  return {
    get availHeight(){return $availHeight;},
    get availWidth(){return $availWidth;},
    get colorDepth(){return $colorDepth;},
    get height(){return $height;},
    get width(){return $width;}
  };
});


$w.moveBy = function(dx,dy){
  //TODO
};

$w.moveTo = function(x,y) {
  //TODO
};

/*$w.print = function(){
  //TODO
};*/

$w.resizeBy = function(dw, dh){
  $w.resizeTo($width+dw,$height+dh);
};

$w.resizeTo = function(width, height){
  $width = (width <= $availWidth) ? width : $availWidth;
  $height = (height <= $availHeight) ? height : $availHeight;
};


$w.scroll = function(x,y){
  //TODO
};
$w.scrollBy = function(dx, dy){
  //TODO
};
$w.scrollTo = function(x,y){
  //TODO
};/*
*	dialog.js
*/
$debug("Initializing Window Dialogs.");
$w.alert = function(message){
     $env.warn(message);
};

$w.confirm = function(question){
  //TODO
};

$w.prompt = function(message, defaultMsg){
  //TODO
};/**
* jQuery AOP - jQuery plugin to add features of aspect-oriented programming (AOP) to jQuery.
* http://jquery-aop.googlecode.com/
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*
* Version: 1.1
*/
window.$profiler;

(function() {

	var _after	= 1;
	var _before	= 2;
	var _around	= 3;
	var _intro  = 4;
	var _regexEnabled = true;

	/**
	 * Private weaving function.
	 */
	var weaveOne = function(source, method, advice) {

		var old = source[method];

		var aspect;
		if (advice.type == _after)
			aspect = function() {
				var returnValue = old.apply(this, arguments);
				return advice.value.apply(this, [returnValue, method]);
			};
		else if (advice.type == _before)
			aspect = function() {
				advice.value.apply(this, [arguments, method]);
				return old.apply(this, arguments);
			};
		else if (advice.type == _intro)
			aspect = function() {
				return advice.value.apply(this, arguments);
			};
		else if (advice.type == _around) {
			aspect = function() {
				var invocation = { object: this, args: arguments };
				return advice.value.apply(invocation.object, [{ arguments: invocation.args, method: method, proceed : 
					function() {
						return old.apply(invocation.object, invocation.args);
					}
				}] );
			};
		}

		aspect.unweave = function() { 
			source[method] = old;
			pointcut = source = aspect = old = null;
		};

		source[method] = aspect;

		return aspect;

	};


	/**
	 * Private weaver and pointcut parser.
	 */
	var weave = function(pointcut, advice)
	{

		var source = (typeof(pointcut.target.prototype) != 'undefined') ? pointcut.target.prototype : pointcut.target;
		var advices = [];

		// If it's not an introduction and no method was found, try with regex...
		if (advice.type != _intro && typeof(source[pointcut.method]) == 'undefined')
		{

			for (var method in source)
			{
				if (source[method] != null && source[method] instanceof Function && method.match(pointcut.method))
				{
					advices[advices.length] = weaveOne(source, method, advice);
				}
			}

			if (advices.length == 0)
				throw 'No method: ' + pointcut.method;

		} 
		else
		{
			// Return as an array of one element
			advices[0] = weaveOne(source, pointcut.method, advice);
		}

		return _regexEnabled ? advices : advices[0];

	};

	window.$profiler = 
	{
		/**
		 * Creates an advice after the defined point-cut. The advice will be executed after the point-cut method 
		 * has completed execution successfully, and will receive one parameter with the result of the execution.
		 * This function returns an array of weaved aspects (Function).
		 *
		 * @example jQuery.aop.after( {target: window, method: 'MyGlobalMethod'}, function(result) { alert('Returned: ' + result); } );
		 * @result Array<Function>
		 *
		 * @example jQuery.aop.after( {target: String, method: 'indexOf'}, function(index) { alert('Result found at: ' + index + ' on:' + this); } );
		 * @result Array<Function>
		 *
		 * @name after
		 * @param Map pointcut Definition of the point-cut to apply the advice. A point-cut is the definition of the object/s and method/s to be weaved.
		 * @option Object target Target object to be weaved. 
		 * @option String method Name of the function to be weaved. Regex are supported, but not on built-in objects.
		 * @param Function advice Function containing the code that will get called after the execution of the point-cut. It receives one parameter
		 *                        with the result of the point-cut's execution.
		 *
		 * @type Array<Function>
		 * @cat Plugins/General
		 */
		after : function(pointcut, advice)
		{
			return weave( pointcut, { type: _after, value: advice } );
		},

		/**
		 * Creates an advice before the defined point-cut. The advice will be executed before the point-cut method 
		 * but cannot modify the behavior of the method, or prevent its execution.
		 * This function returns an array of weaved aspects (Function).
		 *
		 * @example jQuery.aop.before( {target: window, method: 'MyGlobalMethod'}, function() { alert('About to execute MyGlobalMethod'); } );
		 * @result Array<Function>
		 *
		 * @example jQuery.aop.before( {target: String, method: 'indexOf'}, function(index) { alert('About to execute String.indexOf on: ' + this); } );
		 * @result Array<Function>
		 *
		 * @name before
		 * @param Map pointcut Definition of the point-cut to apply the advice. A point-cut is the definition of the object/s and method/s to be weaved.
		 * @option Object target Target object to be weaved. 
		 * @option String method Name of the function to be weaved. Regex are supported, but not on built-in objects.
		 * @param Function advice Function containing the code that will get called before the execution of the point-cut.
		 *
		 * @type Array<Function>
		 * @cat Plugins/General
		 */
		before : function(pointcut, advice)
		{
			return weave( pointcut, { type: _before, value: advice } );
		},


		/**
		 * Creates an advice 'around' the defined point-cut. This type of advice can control the point-cut method execution by calling
		 * the functions '.proceed()' on the 'invocation' object, and also, can modify the arguments collection before sending them to the function call.
		 * This function returns an array of weaved aspects (Function).
		 *
		 * @example jQuery.aop.around( {target: window, method: 'MyGlobalMethod'}, function(invocation) {
		 *                alert('# of Arguments: ' + invocation.arguments.length); 
		 *                return invocation.proceed(); 
		 *          } );
		 * @result Array<Function>
		 *
		 * @example jQuery.aop.around( {target: String, method: 'indexOf'}, function(invocation) { 
		 *                alert('Searching: ' + invocation.arguments[0] + ' on: ' + this); 
		 *                return invocation.proceed(); 
		 *          } );
		 * @result Array<Function>
		 *
		 * @example jQuery.aop.around( {target: window, method: /Get(\d+)/}, function(invocation) {
		 *                alert('Executing ' + invocation.method); 
		 *                return invocation.proceed(); 
		 *          } );
		 * @desc Matches all global methods starting with 'Get' and followed by a number.
		 * @result Array<Function>
		 *
		 *
		 * @name around
		 * @param Map pointcut Definition of the point-cut to apply the advice. A point-cut is the definition of the object/s and method/s to be weaved.
		 * @option Object target Target object to be weaved. 
		 * @option String method Name of the function to be weaved. Regex are supported, but not on built-in objects.
		 * @param Function advice Function containing the code that will get called around the execution of the point-cut. This advice will be called with one
		 *                        argument containing one function '.proceed()', the collection of arguments '.arguments', and the matched method name '.method'.
		 *
		 * @type Array<Function>
		 * @cat Plugins/General
		 */
		around : function(pointcut, advice)
		{
			return weave( pointcut, { type: _around, value: advice } );
		},

		/**
		 * Creates an introduction on the defined point-cut. This type of advice replaces any existing methods with the same
		 * name. To restore them, just unweave it.
		 * This function returns an array with only one weaved aspect (Function).
		 *
		 * @example jQuery.aop.introduction( {target: window, method: 'MyGlobalMethod'}, function(result) { alert('Returned: ' + result); } );
		 * @result Array<Function>
		 *
		 * @example jQuery.aop.introduction( {target: String, method: 'log'}, function() { alert('Console: ' + this); } );
		 * @result Array<Function>
		 *
		 * @name introduction
		 * @param Map pointcut Definition of the point-cut to apply the advice. A point-cut is the definition of the object/s and method/s to be weaved.
		 * @option Object target Target object to be weaved. 
		 * @option String method Name of the function to be weaved.
		 * @param Function advice Function containing the code that will be executed on the point-cut. 
		 *
		 * @type Array<Function>
		 * @cat Plugins/General
		 */
		introduction : function(pointcut, advice)
		{
			return weave( pointcut, { type: _intro, value: advice } );
		},
		
		/**
		 * Configures global options.
		 *
		 * @name setup
		 * @param Map settings Configuration options.
		 * @option Boolean regexMatch Enables/disables regex matching of method names.
		 *
		 * @example jQuery.aop.setup( { regexMatch: false } );
		 * @desc Disable regex matching.
		 *
		 * @type Void
		 * @cat Plugins/General
		 */
		setup: function(settings)
		{
			_regexEnabled = settings.regexMatch;
		}
	};

})();


var $profile = window.$profile = {};


var __profile__ = function(id, invocation){
    var start = new Date().getTime();
    var retval = invocation.proceed(); 
    var finish = new Date().getTime();
    $profile[id] = $profile[id] ? $profile[id] : {};
    $profile[id].callCount = $profile[id].callCount !== undefined ? 
        $profile[id].callCount+1 : 0;
    $profile[id].times = $profile[id].times ? $profile[id].times : [];
    $profile[id].times[$profile[id].callCount++] = (finish-start);
    return retval;
};


window.$profiler.stats = function(raw){
    var max     = 0,
        avg     = -1,
        min     = 10000000,
        own     = 0;
    for(var i = 0;i<raw.length;i++){
        if(raw[i] > 0){
            own += raw[i];
        };
        if(raw[i] > max){
            max = raw[i];
        }
        if(raw[i] < min){
            min = raw[i];
        }
    }
    avg = Math.floor(own/raw.length);
    return {
        min: min,
        max: max,
        avg: avg,
        own: own
    };
};

if($env.profile){
    /**
    *   CSS2Properties
    */
    window.$profiler.around({ target: CSS2Properties,  method:"getPropertyCSSValue"}, function(invocation) {
        return __profile__("CSS2Properties.getPropertyCSSValue", invocation);
    });  
    window.$profiler.around({ target: CSS2Properties,  method:"getPropertyPriority"}, function(invocation) {
        return __profile__("CSS2Properties.getPropertyPriority", invocation);
    });  
    window.$profiler.around({ target: CSS2Properties,  method:"getPropertyValue"}, function(invocation) {
        return __profile__("CSS2Properties.getPropertyValue", invocation);
    });  
    window.$profiler.around({ target: CSS2Properties,  method:"item"}, function(invocation) {
        return __profile__("CSS2Properties.item", invocation);
    });  
    window.$profiler.around({ target: CSS2Properties,  method:"removeProperty"}, function(invocation) {
        return __profile__("CSS2Properties.removeProperty", invocation);
    });  
    window.$profiler.around({ target: CSS2Properties,  method:"setProperty"}, function(invocation) {
        return __profile__("CSS2Properties.setProperty", invocation);
    });  
    window.$profiler.around({ target: CSS2Properties,  method:"toString"}, function(invocation) {
        return __profile__("CSS2Properties.toString", invocation);
    });  
               
    
    /**
    *   DOMNode
    */
                    
    window.$profiler.around({ target: DOMNode,  method:"hasAttributes"}, function(invocation) {
        return __profile__("DOMNode.hasAttributes", invocation);
    });          
    window.$profiler.around({ target: DOMNode,  method:"insertBefore"}, function(invocation) {
        return __profile__("DOMNode.insertBefore", invocation);
    }); 
    window.$profiler.around({ target: DOMNode,  method:"replaceChild"}, function(invocation) {
        return __profile__("DOMNode.replaceChild", invocation);
    }); 
    window.$profiler.around({ target: DOMNode,  method:"removeChild"}, function(invocation) {
        return __profile__("DOMNode.removeChild", invocation);
    }); 
    window.$profiler.around({ target: DOMNode,  method:"replaceChild"}, function(invocation) {
        return __profile__("DOMNode.replaceChild", invocation);
    }); 
    window.$profiler.around({ target: DOMNode,  method:"appendChild"}, function(invocation) {
        return __profile__("DOMNode.appendChild", invocation);
    }); 
    window.$profiler.around({ target: DOMNode,  method:"hasChildNodes"}, function(invocation) {
        return __profile__("DOMNode.hasChildNodes", invocation);
    }); 
    window.$profiler.around({ target: DOMNode,  method:"cloneNode"}, function(invocation) {
        return __profile__("DOMNode.cloneNode", invocation);
    }); 
    window.$profiler.around({ target: DOMNode,  method:"normalize"}, function(invocation) {
        return __profile__("DOMNode.normalize", invocation);
    }); 
    window.$profiler.around({ target: DOMNode,  method:"isSupported"}, function(invocation) {
        return __profile__("DOMNode.isSupported", invocation);
    }); 
    window.$profiler.around({ target: DOMNode,  method:"getElementsByTagName"}, function(invocation) {
        return __profile__("DOMNode.getElementsByTagName", invocation);
    }); 
    window.$profiler.around({ target: DOMNode,  method:"getElementsByTagNameNS"}, function(invocation) {
        return __profile__("DOMNode.getElementsByTagNameNS", invocation);
    }); 
    window.$profiler.around({ target: DOMNode,  method:"importNode"}, function(invocation) {
        return __profile__("DOMNode.importNode", invocation);
    }); 
    window.$profiler.around({ target: DOMNode,  method:"contains"}, function(invocation) {
        return __profile__("DOMNode.contains", invocation);
    }); 
    window.$profiler.around({ target: DOMNode,  method:"compareDocumentPosition"}, function(invocation) {
        return __profile__("DOMNode.compareDocumentPosition", invocation);
    }); 
    
    
    /**
    *   DOMDocument
    */
    window.$profiler.around({ target: DOMDocument,  method:"addEventListener"}, function(invocation) {
        return __profile__("DOMDocument.addEventListener", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"removeEventListener"}, function(invocation) {
        return __profile__("DOMDocument.removeEventListener", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"attachEvent"}, function(invocation) {
        return __profile__("DOMDocument.attachEvent", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"detachEvent"}, function(invocation) {
        return __profile__("DOMDocument.detachEvent", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"dispatchEvent"}, function(invocation) {
        return __profile__("DOMDocument.dispatchEvent", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"loadXML"}, function(invocation) {
        return __profile__("DOMDocument.loadXML", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"load"}, function(invocation) {
        return __profile__("DOMDocument.load", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"createEvent"}, function(invocation) {
        return __profile__("DOMDocument.createEvent", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"createExpression"}, function(invocation) {
        return __profile__("DOMDocument.createExpression", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"createElement"}, function(invocation) {
        return __profile__("DOMDocument.createElement", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"createDocumentFragment"}, function(invocation) {
        return __profile__("DOMDocument.createDocumentFragment", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"createTextNode"}, function(invocation) {
        return __profile__("DOMDocument.createTextNode", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"createComment"}, function(invocation) {
        return __profile__("DOMDocument.createComment", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"createCDATASection"}, function(invocation) {
        return __profile__("DOMDocument.createCDATASection", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"createProcessingInstruction"}, function(invocation) {
        return __profile__("DOMDocument.createProcessingInstruction", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"createAttribute"}, function(invocation) {
        return __profile__("DOMDocument.createAttribute", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"createElementNS"}, function(invocation) {
        return __profile__("DOMDocument.createElementNS", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"createAttributeNS"}, function(invocation) {
        return __profile__("DOMDocument.createAttributeNS", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"createNamespace"}, function(invocation) {
        return __profile__("DOMDocument.createNamespace", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"getElementById"}, function(invocation) {
        return __profile__("DOMDocument.getElementById", invocation);
    });
    window.$profiler.around({ target: DOMDocument,  method:"normalizeDocument"}, function(invocation) {
        return __profile__("DOMDocument.normalizeDocument", invocation);
    });
    
    
    /**
    *   HTMLDocument
    */      
    window.$profiler.around({ target: HTMLDocument,  method:"createElement"}, function(invocation) {
        return __profile__("HTMLDocument.createElement", invocation);
    }); 
    
    /**
    *   DOMParser
    */      
    window.$profiler.around({ target: DOMParser,  method:"parseFromString"}, function(invocation) {
        return __profile__("DOMParser.parseFromString", invocation);
    }); 
    
    /**
    *   DOMNodeList
    */      
    window.$profiler.around({ target: DOMNodeList,  method:"item"}, function(invocation) {
        return __profile__("DOMNode.item", invocation);
    }); 
    window.$profiler.around({ target: DOMNodeList,  method:"toString"}, function(invocation) {
        return __profile__("DOMNode.toString", invocation);
    }); 
    
    /**
    *   XMLP
    */      
    window.$profiler.around({ target: XMLP,  method:"_addAttribute"}, function(invocation) {
        return __profile__("XMLP._addAttribute", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_checkStructure"}, function(invocation) {
        return __profile__("XMLP._checkStructure", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_clearAttributes"}, function(invocation) {
        return __profile__("XMLP._clearAttributes", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_findAttributeIndex"}, function(invocation) {
        return __profile__("XMLP._findAttributeIndex", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"getAttributeCount"}, function(invocation) {
        return __profile__("XMLP.getAttributeCount", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"getAttributeName"}, function(invocation) {
        return __profile__("XMLP.getAttributeName", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"getAttributeValue"}, function(invocation) {
        return __profile__("XMLP.getAttributeValue", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"getAttributeValueByName"}, function(invocation) {
        return __profile__("XMLP.getAttributeValueByName", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"getColumnNumber"}, function(invocation) {
        return __profile__("XMLP.getColumnNumber", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"getContentBegin"}, function(invocation) {
        return __profile__("XMLP.getContentBegin", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"getContentEnd"}, function(invocation) {
        return __profile__("XMLP.getContentEnd", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"getLineNumber"}, function(invocation) {
        return __profile__("XMLP.getLineNumber", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"getName"}, function(invocation) {
        return __profile__("XMLP.getName", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"next"}, function(invocation) {
        return __profile__("XMLP.next", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_parse"}, function(invocation) {
        return __profile__("XMLP._parse", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_parse"}, function(invocation) {
        return __profile__("XMLP._parse", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_parseAttribute"}, function(invocation) {
        return __profile__("XMLP._parseAttribute", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_parseCDATA"}, function(invocation) {
        return __profile__("XMLP._parseCDATA", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_parseComment"}, function(invocation) {
        return __profile__("XMLP._parseComment", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_parseDTD"}, function(invocation) {
        return __profile__("XMLP._parseDTD", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_parseElement"}, function(invocation) {
        return __profile__("XMLP._parseElement", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_parseEntity"}, function(invocation) {
        return __profile__("XMLP._parseEntity", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_parsePI"}, function(invocation) {
        return __profile__("XMLP._parsePI", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_parseText"}, function(invocation) {
        return __profile__("XMLP._parseText", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_replaceEntities"}, function(invocation) {
        return __profile__("XMLP._replaceEntities", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_replaceEntity"}, function(invocation) {
        return __profile__("XMLP._replaceEntity", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_setContent"}, function(invocation) {
        return __profile__("XMLP._setContent", invocation);
    }); 
    window.$profiler.around({ target: XMLP,  method:"_setErr"}, function(invocation) {
        return __profile__("XMLP._setErr", invocation);
    }); 
    
    
    /**
    *   SAXDriver
    */      
    window.$profiler.around({ target: SAXDriver,  method:"parse"}, function(invocation) {
        return __profile__("SAXDriver.parse", invocation);
    }); 
    window.$profiler.around({ target: SAXDriver,  method:"setDocumentHandler"}, function(invocation) {
        return __profile__("SAXDriver.setDocumentHandler", invocation);
    }); 
    window.$profiler.around({ target: SAXDriver,  method:"setErrorHandler"}, function(invocation) {
        return __profile__("SAXDriver.setErrorHandler", invocation);
    }); 
    window.$profiler.around({ target: SAXDriver,  method:"setLexicalHandler"}, function(invocation) {
        return __profile__("SAXDriver.setLexicalHandler", invocation);
    }); 
    window.$profiler.around({ target: SAXDriver,  method:"getColumnNumber"}, function(invocation) {
        return __profile__("SAXDriver.getColumnNumber", invocation);
    }); 
    window.$profiler.around({ target: SAXDriver,  method:"getLineNumber"}, function(invocation) {
        return __profile__("SAXDriver.getLineNumber", invocation);
    }); 
    window.$profiler.around({ target: SAXDriver,  method:"getMessage"}, function(invocation) {
        return __profile__("SAXDriver.getMessage", invocation);
    }); 
    window.$profiler.around({ target: SAXDriver,  method:"getPublicId"}, function(invocation) {
        return __profile__("SAXDriver.getPublicId", invocation);
    }); 
    window.$profiler.around({ target: SAXDriver,  method:"getSystemId"}, function(invocation) {
        return __profile__("SAXDriver.getSystemId", invocation);
    }); 
    window.$profiler.around({ target: SAXDriver,  method:"getLength"}, function(invocation) {
        return __profile__("SAXDriver.getLength", invocation);
    }); 
    window.$profiler.around({ target: SAXDriver,  method:"getName"}, function(invocation) {
        return __profile__("SAXDriver.getName", invocation);
    }); 
    window.$profiler.around({ target: SAXDriver,  method:"getValue"}, function(invocation) {
        return __profile__("SAXDriver.getValue", invocation);
    }); 
    window.$profiler.around({ target: SAXDriver,  method:"getValueByName"}, function(invocation) {
        return __profile__("SAXDriver.getValueByName", invocation);
    }); 
    window.$profiler.around({ target: SAXDriver,  method:"_fireError"}, function(invocation) {
        return __profile__("SAXDriver._fireError", invocation);
    }); 
    window.$profiler.around({ target: SAXDriver,  method:"_fireEvent"}, function(invocation) {
        return __profile__("SAXDriver._fireEvent", invocation);
    }); 
    window.$profiler.around({ target: SAXDriver,  method:"_parseLoop"}, function(invocation) {
        return __profile__("SAXDriver._parseLoop", invocation);
    }); 
    
    /**
    *   SAXStrings    
    */
    window.$profiler.around({ target: SAXStrings,  method:"getColumnNumber"}, function(invocation) {
        return __profile__("SAXStrings.getColumnNumber", invocation);
    }); 
    window.$profiler.around({ target: SAXStrings,  method:"getLineNumber"}, function(invocation) {
        return __profile__("SAXStrings.getLineNumber", invocation);
    }); 
    window.$profiler.around({ target: SAXStrings,  method:"indexOfNonWhitespace"}, function(invocation) {
        return __profile__("SAXStrings.indexOfNonWhitespace", invocation);
    }); 
    window.$profiler.around({ target: SAXStrings,  method:"indexOfWhitespace"}, function(invocation) {
        return __profile__("SAXStrings.indexOfWhitespace", invocation);
    }); 
    window.$profiler.around({ target: SAXStrings,  method:"isEmpty"}, function(invocation) {
        return __profile__("SAXStrings.isEmpty", invocation);
    }); 
    window.$profiler.around({ target: SAXStrings,  method:"lastIndexOfNonWhitespace"}, function(invocation) {
        return __profile__("SAXStrings.lastIndexOfNonWhitespace", invocation);
    }); 
    window.$profiler.around({ target: SAXStrings,  method:"replace"}, function(invocation) {
        return __profile__("SAXStrings.replace", invocation);
    }); 
    
    /**
    *   Stack - SAX Utility
    window.$profiler.around({ target: Stack,  method:"clear"}, function(invocation) {
        return __profile__("Stack.clear", invocation);
    }); 
    window.$profiler.around({ target: Stack,  method:"count"}, function(invocation) {
        return __profile__("Stack.count", invocation);
    }); 
    window.$profiler.around({ target: Stack,  method:"destroy"}, function(invocation) {
        return __profile__("Stack.destroy", invocation);
    }); 
    window.$profiler.around({ target: Stack,  method:"peek"}, function(invocation) {
        return __profile__("Stack.peek", invocation);
    }); 
    window.$profiler.around({ target: Stack,  method:"pop"}, function(invocation) {
        return __profile__("Stack.pop", invocation);
    }); 
    window.$profiler.around({ target: Stack,  method:"push"}, function(invocation) {
        return __profile__("Stack.push", invocation);
    }); 
    */
}
      
/*
*	document.js
*
*	DOM Level 2 /DOM level 3 (partial)
*	
*	This file adds the document object to the window and allows you
*	you to set the window.document using an html string or dom object.
*
*/

// read only reference to the Document object
var $document;
{    // a temporary scope, nothing more
  var referrer = "";
  try {
    referrer = $openingWindow.location.href;
  } catch (e){ /* or not */ }
  $document = new HTMLDocument($implementation, $w, referrer);
}

$w.__defineGetter__("document", function(){
	return $document;
});
$debug("Defining document.cookie");
/*
*	cookie.js
*   - requires env
*/

var $cookies = {
	persistent:{
		//domain - key on domain name {
			//path - key on path {
				//name - key on name {
					 //value : cookie value
					 //other cookie properties
				//}
			//}
		//}
		//expire - provides a timestamp for expiring the cookie
		//cookie - the cookie!
	},
	temporary:{//transient is a reserved word :(
		//like above
	}
};

//HTMLDocument cookie
document.__defineSetter__("cookie", function(cookie){
	var i,name,value,properties = {},attr,attrs = cookie.split(";");
	//for now the strategy is to simply create a json object
	//and post it to a file in the .cookies.js file.  I hate parsing
	//dates so I decided not to implement support for 'expires' 
	//(which is deprecated) and instead focus on the easier 'max-age'
	//(which succeeds 'expires') 
	cookie = {};//keyword properties of the cookie
	for(i=0;i<attrs.length;i++){
		var index = attrs[i].indexOf("=");
        if(index > -1){
            name = trim(attrs[i].slice(0,index));
            value = trim(attrs[i].slice(index+1));
            cookie['domain'] = "";
            if(name=='max-age'){
               //we'll have to set a timer to check these
				//and garbage collect expired cookies
				cookie[name] = parseInt(value, 10);
			} else if(name=='domain'){
				if(domainValid(value)){
					cookie['domain']=value;
				}else{
					cookie['domain']=$w.location.domain;
				}
			} else if(name=='path'){
				//not sure of any special logic for path
				cookie['path'] = value;
			} else {
				//its not a cookie keyword so store it in our array of properties
				//and we'll serialize individually in a moment
				properties[name] = value;
			}
		}else{
			if(attrs[i] == 'secure'){
                cookie[attrs[i]] = true;
			}
		}
	}
	if(!cookie['max-age']){
		//it's a transient cookie so it only lasts as long as 
		//the window.location remains the same
		mergeCookie($cookies.temporary, cookie, properties);
	}else if(cookie['max-age']===0){
		//delete the cookies
		//TODO
	}else{
		//the cookie is persistent
		mergeCookie($cookies.persistent, cookie, properties);
		persistCookies();
	}
});

document.__defineGetter__("cookie", function(c){
	//The cookies that are returned must belong to the same domain
	//and be at or below the current window.location.path.  Also
	//we must check to see if the cookie was set to 'secure' in which
	//case we must check our current location.protocol to make sure it's
	//https:
	var allcookies = [], i;
	return cookieString($cookies.temporary) + cookieString($cookies.persistent); 	
});

var cookieString = function(cookies) {
    var cookieString = "";
    for (var i in cookies) {
        // check if the cookie is in the current domain (if domain is set)
        if (i == "" || i == $w.location.domain) {
            for (var j in cookies[i]) {
                // make sure path is at or below the window location path
                if (j == "/" || $w.location.pathname.indexOf(j) === 0) {
                    for (var k in cookies[i][j]) {
                        cookieString += k + "=" + cookies[i][j][k].value+";";
                    }
                }
            }
        }
    }
    return cookieString;
}


var domainValid = function(domain){
	//make sure the domain
	//TODO 	
};

var mergeCookie = function(target, cookie, properties){
	var name, now;
	if(!target[cookie.domain]){
		target[cookie.domain] = {};
	}
	if(!target[cookie.domain][cookie.path]){
		target[cookie.domain][cookie.path] = {};
	}
	for(name in properties){
		now = new Date().getTime();
		target[cookie.domain][cookie.path][name] = {
			value:properties[name],
			"@env:secure":cookie.secure,
			"@env:max-age":cookie['max-age'],
			"@env:date-created":now,
			"@env:expiration":now + cookie['max-age']
		};
	}
};

var persistCookies = function(){
	//TODO
	//I think it should be done via $env so it can be customized
};

var loadCookies = function(){
	//TODO
	//should also be configurable via $env	
};

//We simply use the default ajax get to load the .cookies.js file
//if it doesn't exist we create it with a post.  Cookies are maintained
//in memory, but serialized with each set.
try{
	//TODO - load cookies
	loadCookies();
}catch(e){
	//TODO - fail gracefully
}	
	/**
 * @author thatcher
 */
(function(window,document){

var Html5Parser;
(function () {window.nu_validator_htmlparser_HtmlParser=function(){var k='',v='" for "gwt:onLoadErrorFn"',t='" for "gwt:onPropertyErrorFn"',z='#',B='/',w='<script id="__gwt_marker_nu.validator.htmlparser.HtmlParser"><\/script>',q='=',A='?',s='Bad handler "',x='DOMContentLoaded',y='__gwt_marker_nu.validator.htmlparser.HtmlParser',C='base',E='clear.cache.gif',p='content',u='gwt:onLoadErrorFn',r='gwt:onPropertyErrorFn',o='gwt:property',D='img',m='meta',n='name',l='nu.validator.htmlparser.HtmlParser';var F=window,j=document,gb,eb,db=k,jb={},qb=[],pb=[],cb=[],mb,ob;if(!F.__gwt_stylesLoaded){F.__gwt_stylesLoaded={}}if(!F.__gwt_scriptsLoaded){F.__gwt_scriptsLoaded={}}function ib(){if(gb&&eb){gb(mb,l,db)}}
function fb(){var i,h;j.write(w);h=j.getElementById(y);if(h){i=h.previousSibling}function f(b){var a=b.lastIndexOf(z);if(a==-1){a=b.length}var c=b.indexOf(A);if(c==-1){c=b.length}var d=b.lastIndexOf(B,Math.min(c,a));return d>=0?b.substring(0,d+1):k}
;if(i&&i.src){db=f(i.src)}if(db==k){var e=j.getElementsByTagName(C);if(e.length>0){db=e[e.length-1].href}else{db=f(j.location.href)}}else if(db.match(/^\w+:\/\//)){}else{var g=j.createElement(D);g.src=db+E;db=f(g.src)}if(h){h.parentNode.removeChild(h)}}
function nb(){var f=document.getElementsByTagName(m);for(var d=0,g=f.length;d<g;++d){var e=f[d],h=e.getAttribute(n),b;if(h){if(h==o){b=e.getAttribute(p);if(b){var i,c=b.indexOf(q);if(c>=0){h=b.substring(0,c);i=b.substring(c+1)}else{h=b;i=k}jb[h]=i}}else if(h==r){b=e.getAttribute(p);if(b){try{ob=eval(b)}catch(a){alert(s+b+t)}}}else if(h==u){b=e.getAttribute(p);if(b){try{mb=eval(b)}catch(a){alert(s+b+v)}}}}}}
nu_validator_htmlparser_HtmlParser.onScriptLoad=function(a){nu_validator_htmlparser_HtmlParser=null;gb=a;ib()};fb();nb();var lb;/*envjsedit*/var kb = Html5Parser = function(){if(!eb){eb=true;ib();if(false/*envjsedit*/){j.removeEventListener(x,kb,false)}if(lb){clearInterval(lb)}}}
/*envjsedit*/};nu_validator_htmlparser_HtmlParser.__gwt_initHandlers=function(i,e,j){var d=window,g=d.onresize,f=d.onbeforeunload,h=d.onunload;d.onresize=function(a){try{i()}finally{g&&g(a)}};d.onbeforeunload=function(a){var c,b;try{c=e()}finally{b=f&&f(a)}if(c!=null){return c}if(b!=null){return b}};d.onunload=function(a){try{j()}finally{h&&h(a);d.onresize=null;d.onbeforeunload=null;d.onunload=null}}};nu_validator_htmlparser_HtmlParser();})();(function () {var $gwt_version = "1.5.1";var $wnd = window;var $doc = $wnd.document;var $moduleName, $moduleBase;var $stats = $wnd.__gwtStatsEvent ? function(a) {$wnd.__gwtStatsEvent(a)} : null;var cNh='',qPg='\n',n4h='\n ',Bxg=' which is not a legal XML 1.0 character.',cNg='#mathplayer',zOg='#renesis',rZg='(',vxg=').',iwh='): ',fPh='+//silmaril//dtd html pro v0r11 19970101//',cWg=', ',mih=', Size: ',dNh='-//W3C//DTD HTML 4.0 Frameset//EN',oNh='-//W3C//DTD HTML 4.0 Transitional//EN',zNh='-//W3C//DTD HTML 4.0//EN',eOh='-//W3C//DTD HTML 4.01 Frameset//EN',pOh='-//W3C//DTD HTML 4.01 Transitional//EN',AOh='-//W3C//DTD HTML 4.01//EN',utg='-//W3C//DTD XHTML 1.0 Strict//EN',lug='-//W3C//DTD XHTML 1.1//EN',qPh='-//advasoft ltd//dtd html 3.0 aswedit + extensions//',BPh='-//as//dtd html 3.0 aswedit + extensions//',gQh='-//ietf//dtd html 2.0 level 1//',sQh='-//ietf//dtd html 2.0 level 2//',DQh='-//ietf//dtd html 2.0 strict level 1//',iRh='-//ietf//dtd html 2.0 strict level 2//',tRh='-//ietf//dtd html 2.0 strict//',ERh='-//ietf//dtd html 2.0//',jSh='-//ietf//dtd html 2.1e//',uSh='-//ietf//dtd html 3.0//',FSh='-//ietf//dtd html 3.2 final//',kTh='-//ietf//dtd html 3.2//',vTh='-//ietf//dtd html 3//',bUh='-//ietf//dtd html level 0//',mUh='-//ietf//dtd html level 1//',xUh='-//ietf//dtd html level 2//',cVh='-//ietf//dtd html level 3//',nVh='-//ietf//dtd html strict level 0//',yVh='-//ietf//dtd html strict level 1//',dWh='-//ietf//dtd html strict level 2//',oWh='-//ietf//dtd html strict level 3//',zWh='-//ietf//dtd html strict//',eXh='-//ietf//dtd html//',qXh='-//metrius//dtd metrius presentational//',BXh='-//microsoft//dtd internet explorer 2.0 html strict//',gYh='-//microsoft//dtd internet explorer 2.0 html//',rYh='-//microsoft//dtd internet explorer 2.0 tables//',CYh='-//microsoft//dtd internet explorer 3.0 html strict//',hZh='-//microsoft//dtd internet explorer 3.0 html//',sZh='-//microsoft//dtd internet explorer 3.0 tables//',DZh='-//netscape comm. corp.//dtd html//',i0h='-//netscape comm. corp.//dtd strict html//',t0h="-//o'reilly and associates//dtd html 2.0//",F0h="-//o'reilly and associates//dtd html extended 1.0//",k1h="-//o'reilly and associates//dtd html extended relaxed 1.0//",v1h='-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//',a2h='-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//',l2h='-//spyglass//dtd html 2.0 extended//',w2h='-//sq//dtd html 2.0 hotmetal + extensions//',b3h='-//sun microsystems corp.//dtd hotjava html//',m3h='-//sun microsystems corp.//dtd hotjava strict html//',x3h='-//w3c//dtd html 3 1995-03-24//',c4h='-//w3c//dtd html 3.2 draft//',o4h='-//w3c//dtd html 3.2 final//',z4h='-//w3c//dtd html 3.2//',e5h='-//w3c//dtd html 3.2s draft//',p5h='-//w3c//dtd html 4.0 frameset//',A5h='-//w3c//dtd html 4.0 transitional//',Czg='-//w3c//dtd html 4.01 frameset//en',rzg='-//w3c//dtd html 4.01 transitional//en',f6h='-//w3c//dtd html experimental 19960712//',q6h='-//w3c//dtd html experimental 970421//',B6h='-//w3c//dtd w3 html//',gzg='-//w3c//dtd xhtml 1.0 frameset//en',Byg='-//w3c//dtd xhtml 1.0 transitional//en',g7h='-//w3o//dtd w3 html 3.0//',sAg='-//w3o//dtd w3 html strict 3.0//en//',r7h='-//webtechs//dtd mozilla html 2.0//',Cqg='-//webtechs//dtd mozilla html//',DAg='-/w3c/dtd html 4.0 transitional/en',Dxg='.',gyg='0123456789ABCDEF',iBg=':',Aqg=': ',q6g='=',zqg='@',txg='A character reference expanded to a form feed which is not legal XML 1.0 white space.',iyg='AElig',jyg='AElig;',wLh='ALLOW',fKh='ALMOST_STANDARDS_MODE',mMh='ALTER_INFOSET',kyg='AMP',lyg='AMP;',yzh='AUTO',myg='Aacute',nyg='Aacute;',oyg='Abreve;',DIh='AbstractCollection',rJh='AbstractHashMap',tJh='AbstractHashMap$EntrySet',uJh='AbstractHashMap$EntrySetIterator',wJh='AbstractHashMap$MapEntryNull',xJh='AbstractHashMap$MapEntryString',EIh='AbstractList',yJh='AbstractList$IteratorImpl',zJh='AbstractList$ListIteratorImpl',qJh='AbstractMap',vJh='AbstractMapEntry',BJh='AbstractSequentialList',sJh='AbstractSet',pyg='Acirc',ryg='Acirc;',syg='Acy;',ePg='Add not supported on this collection',obh='Add not supported on this list',tyg='Afr;',uyg='Agrave',vyg='Agrave;',wyg='Alpha;',xyg='Amacr;',yyg='And;',zyg='Aogon;',Ayg='Aopf;',Cyg='ApplyFunction;',Dyg='Aring',Eyg='Aring;',vLg='Array types must match',FIh='ArrayList',cJh='ArrayStoreException',Fyg='Ascr;',azg='Assign;',bzg='Atilde',czg='Atilde;',mxg='Attribute \u201C',vKh='AttributeName',uKh='AttributeName;',dzg='Auml',ezg='Auml;',fzg='Backslash;',hzg='Barv;',izg='Barwed;',jzg='Bcy;',kzg='Because;',lzg='Bernoullis;',mzg='Beta;',nzg='Bfr;',ozg='Bopf;',pzg='Breve;',mKh='BrowserTreeBuilder',nKh='BrowserTreeBuilder$ScriptHolder',qzg='Bscr;',szg='Bumpeq;',ixg='CDATA[',tzg='CHcy;',uzg='COPY',vzg='COPY;',wzg='Cacute;',Blh="Can't get element ",xxg="Can't use FATAL here.",xzg='Cap;',yzg='CapitalDifferentialD;',zzg='Cayleys;',Azg='Ccaron;',Bzg='Ccedil',Dzg='Ccedil;',Ezg='Ccirc;',Fzg='Cconint;',aAg='Cdot;',bAg='Cedilla;',cAg='CenterDot;',dAg='Cfr;',uxg='Character reference expands to a control character (',eAg='Chi;',fAg='CircleDot;',gAg='CircleMinus;',iAg='CirclePlus;',jAg='CircleTimes;',fJh='Class',gJh='ClassCastException',kAg='ClockwiseContourIntegral;',lAg='CloseCurlyDoubleQuote;',mAg='CloseCurlyQuote;',kKh='CoalescingTreeBuilder',nAg='Colon;',oAg='Colone;',CJh='Comparators$1',pAg='Congruent;',qAg='Conint;',rAg='ContourIntegral;',tAg='Copf;',uAg='Coproduct;',vAg='CounterClockwiseContourIntegral;',wAg='Cross;',xAg='Cscr;',yAg='Cup;',zAg='CupCap;',AAg='DD;',BAg='DDotrahd;',CAg='DJcy;',EAg='DScy;',FAg='DZcy;',aBg='Dagger;',bBg='Darr;',cBg='Dashv;',dBg='Dcaron;',eBg='Dcy;',fBg='Del;',gBg='Delta;',hBg='Dfr;',kBg='DiacriticalAcute;',lBg='DiacriticalDot;',mBg='DiacriticalDoubleAcute;',nBg='DiacriticalGrave;',oBg='DiacriticalTilde;',pBg='Diamond;',qBg='DifferentialD;',dKh='DoctypeExpectation',eKh='DocumentMode',rBg='Dopf;',sBg='Dot;',tBg='DotDot;',vBg='DotEqual;',wBg='DoubleContourIntegral;',xBg='DoubleDot;',yBg='DoubleDownArrow;',zBg='DoubleLeftArrow;',ABg='DoubleLeftRightArrow;',BBg='DoubleLeftTee;',CBg='DoubleLongLeftArrow;',DBg='DoubleLongLeftRightArrow;',EBg='DoubleLongRightArrow;',aCg='DoubleRightArrow;',bCg='DoubleRightTee;',cCg='DoubleUpArrow;',dCg='DoubleUpDownArrow;',eCg='DoubleVerticalBar;',fCg='DownArrow;',gCg='DownArrowBar;',hCg='DownArrowUpArrow;',iCg='DownBreve;',jCg='DownLeftRightVector;',lCg='DownLeftTeeVector;',mCg='DownLeftVector;',nCg='DownLeftVectorBar;',oCg='DownRightTeeVector;',pCg='DownRightVector;',qCg='DownRightVectorBar;',rCg='DownTee;',sCg='DownTeeArrow;',tCg='Downarrow;',uCg='Dscr;',wCg='Dstrok;',qxg='Duplicate attribute \u201C',xCg='ENG;',yCg='ETH',zCg='ETH;',ACg='Eacute',BCg='Eacute;',CCg='Ecaron;',DCg='Ecirc',ECg='Ecirc;',FCg='Ecy;',bDg='Edot;',cDg='Efr;',dDg='Egrave',eDg='Egrave;',isg='Element name \u201C',fDg='Element;',xKh='ElementName',wKh='ElementName;',gDg='Emacr;',hDg='EmptySmallSquare;',iDg='EmptyVerySmallSquare;',AIh='Enum',jDg='Eogon;',kDg='Eopf;',mDg='Epsilon;',nDg='Equal;',oDg='EqualTilde;',pDg='Equilibrium;',zKh='ErrorReportingTokenizer',qDg='Escr;',rDg='Esim;',sDg='Eta;',tDg='Euml',uDg='Euml;',sIh='Exception',vDg='Exists;',xDg='ExponentialE;',bMh='FATAL',yDg='Fcy;',zDg='Ffr;',ADg='FilledSmallSquare;',BDg='FilledVerySmallSquare;',CDg='Fopf;',DDg='ForAll;',Cxg='Forbidden code point ',EDg='Fouriertrf;',FDg='Fscr;',aEg='GJcy;',cEg='GT',dEg='GT;',eEg='Gamma;',fEg='Gammad;',gEg='Gbreve;',hEg='Gcedil;',iEg='Gcirc;',jEg='Gcy;',kEg='Gdot;',lEg='Gfr;',nEg='Gg;',oEg='Gopf;',pEg='GreaterEqual;',qEg='GreaterEqualLess;',rEg='GreaterFullEqual;',sEg='GreaterGreater;',tEg='GreaterLess;',uEg='GreaterSlantEqual;',vEg='GreaterTilde;',wEg='Gscr;',zEg='Gt;',AEg='HARDcy;',kph='HTML',jwh='HTML401_STRICT',zsh='HTML401_TRANSITIONAL',BEg='Hacek;',DJh='HashMap',CEg='Hat;',DEg='Hcirc;',EEg='Hfr;',FEg='HilbertSpace;',aFg='Hopf;',bFg='HorizontalLine;',cFg='Hscr;',eFg='Hstrok;',AKh='HtmlAttributes',oKh='HtmlParser',pKh='HtmlParser$1',fFg='HumpDownHump;',gFg='HumpEqual;',hFg='IEcy;',iFg='IJlig;',jFg='IOcy;',kFg='Iacute',lFg='Iacute;',mFg='Icirc',nFg='Icirc;',pFg='Icy;',qFg='Idot;',rFg='Ifr;',sFg='Igrave',tFg='Igrave;',hJh='IllegalArgumentException',uFg='Im;',vFg='Imacr;',wFg='ImaginaryI;',xFg='Implies;',Deh='Index: ',bJh='IndexOutOfBoundsException',yFg='Int;',AFg='Integral;',BFg='Intersection;',CFg='InvisibleComma;',DFg='InvisibleTimes;',EFg='Iogon;',FFg='Iopf;',aGg='Iota;',bGg='Iscr;',cGg='Itilde;',dGg='Iukcy;',fGg='Iuml',gGg='Iuml;',vIh='JavaScriptException',wIh='JavaScriptObject$',hGg='Jcirc;',iGg='Jcy;',jGg='Jfr;',kGg='Jopf;',lGg='Jscr;',mGg='Jsercy;',nGg='Jukcy;',oGg='KHcy;',qGg='KJcy;',rGg='Kappa;',sGg='Kcedil;',tGg='Kcy;',uGg='Kfr;',vGg='Kopf;',wGg='Kscr;',xGg='LJcy;',yGg='LT',zGg='LT;',BGg='Lacute;',CGg='Lambda;',DGg='Lang;',EGg='Laplacetrf;',FGg='Larr;',aHg='Lcaron;',bHg='Lcedil;',cHg='Lcy;',dHg='LeftAngleBracket;',eHg='LeftArrow;',gHg='LeftArrowBar;',hHg='LeftArrowRightArrow;',iHg='LeftCeiling;',jHg='LeftDoubleBracket;',kHg='LeftDownTeeVector;',lHg='LeftDownVector;',mHg='LeftDownVectorBar;',nHg='LeftFloor;',oHg='LeftRightArrow;',pHg='LeftRightVector;',rHg='LeftTee;',sHg='LeftTeeArrow;',tHg='LeftTeeVector;',uHg='LeftTriangle;',vHg='LeftTriangleBar;',wHg='LeftTriangleEqual;',xHg='LeftUpDownVector;',yHg='LeftUpTeeVector;',zHg='LeftUpVector;',AHg='LeftUpVectorBar;',CHg='LeftVector;',DHg='LeftVectorBar;',EHg='Leftarrow;',FHg='Leftrightarrow;',aIg='LessEqualGreater;',bIg='LessFullEqual;',cIg='LessGreater;',dIg='LessLess;',eIg='LessSlantEqual;',fIg='LessTilde;',iIg='Lfr;',EJh='LinkedList',FJh='LinkedList$ListIteratorImpl',aKh='LinkedList$Node',jIg='Ll;',kIg='Lleftarrow;',lIg='Lmidot;',BKh='LocatorImpl',mIg='LongLeftArrow;',nIg='LongLeftRightArrow;',oIg='LongRightArrow;',pIg='Longleftarrow;',qIg='Longleftrightarrow;',rIg='Longrightarrow;',tIg='Lopf;',uIg='LowerLeftArrow;',vIg='LowerRightArrow;',wIg='Lscr;',xIg='Lsh;',yIg='Lstrok;',zIg='Lt;',AIg='Map;',BIg='Mcy;',CIg='MediumSpace;',EIg='Mellintrf;',FIg='Mfr;',aJg='MinusPlus;',bJg='Mopf;',cJg='Mscr;',dJg='Mu;',gIg='Must be array types',eJg='NJcy;',hDh='NO_DOCTYPE_ERRORS',fJg='Nacute;',gJg='Ncaron;',hJg='Ncedil;',jJg='Ncy;',kJg='NegativeMediumSpace;',lJg='NegativeThickSpace;',mJg='NegativeThinSpace;',nJg='NegativeVeryThinSpace;',oJg='NestedGreaterGreater;',pJg='NestedLessLess;',qJg='NewLine;',rJg='Nfr;',sxg='No digits after \u201C',sJg='NoBreak;',bKh='NoSuchElementException',uJg='NonBreakingSpace;',vJg='Nopf;',wJg='Not;',xJg='NotCongruent;',yJg='NotCupCap;',zJg='NotDoubleVerticalBar;',AJg='NotElement;',BJg='NotEqual;',CJg='NotExists;',DJg='NotGreater;',FJg='NotGreaterEqual;',aKg='NotGreaterLess;',bKg='NotGreaterTilde;',cKg='NotLeftTriangle;',dKg='NotLeftTriangleEqual;',eKg='NotLess;',fKg='NotLessEqual;',gKg='NotLessGreater;',hKg='NotLessTilde;',iKg='NotPrecedes;',kKg='NotPrecedesSlantEqual;',lKg='NotReverseElement;',mKg='NotRightTriangle;',nKg='NotRightTriangleEqual;',oKg='NotSquareSubsetEqual;',pKg='NotSquareSupersetEqual;',qKg='NotSubsetEqual;',rKg='NotSucceeds;',sKg='NotSucceedsSlantEqual;',tKg='NotSupersetEqual;',vKg='NotTilde;',wKg='NotTildeEqual;',xKg='NotTildeFullEqual;',yKg='NotTildeTilde;',zKg='NotVerticalBar;',AKg='Nscr;',BKg='Ntilde',CKg='Ntilde;',DKg='Nu;',jJh='NullPointerException',EKg='OElig;',aLg='Oacute',bLg='Oacute;',nIh='Object',oJh='Object;',cLg='Ocirc',dLg='Ocirc;',eLg='Ocy;',fLg='Odblac;',gLg='Ofr;',hLg='Ograve',iLg='Ograve;',jLg='Omacr;',lLg='Omega;',mLg='Omicron;',nLg='Oopf;',oLg='OpenCurlyDoubleQuote;',pLg='OpenCurlyQuote;',qLg='Or;',rLg='Oscr;',sLg='Oslash',tLg='Oslash;',uLg='Otilde',xLg='Otilde;',yLg='Otimes;',zLg='Ouml',ALg='Ouml;',BLg='OverBar;',CLg='OverBrace;',DLg='OverBracket;',ELg='OverParenthesis;',qKh='ParseEndListener',FLg='PartialD;',aMg='Pcy;',cMg='Pfr;',dMg='Phi;',eMg='Pi;',fMg='PlusMinus;',gMg='Poincareplane;',hMg='Popf;',iMg='Pr;',jMg='Precedes;',kMg='PrecedesEqual;',lMg='PrecedesSlantEqual;',nMg='PrecedesTilde;',oMg='Prime;',pMg='Product;',qMg='Proportion;',rMg='Proportional;',sMg='Pscr;',tMg='Psi;',lLh='QUIRKS_MODE',uMg='QUOT',vMg='QUOT;',wMg='Qfr;',yMg='Qopf;',zMg='Qscr;',AMg='RBarr;',BMg='REG',CMg='REG;',DMg='Racute;',EMg='Rang;',FMg='Rarr;',aNg='Rarrtl;',bNg='Rcaron;',dNg='Rcedil;',eNg='Rcy;',fNg='Re;',gNg='ReverseElement;',hNg='ReverseEquilibrium;',iNg='ReverseUpEquilibrium;',jNg='Rfr;',kNg='Rho;',lNg='RightAngleBracket;',mNg='RightArrow;',oNg='RightArrowBar;',pNg='RightArrowLeftArrow;',qNg='RightCeiling;',rNg='RightDoubleBracket;',sNg='RightDownTeeVector;',tNg='RightDownVector;',uNg='RightDownVectorBar;',vNg='RightFloor;',wNg='RightTee;',xNg='RightTeeArrow;',zNg='RightTeeVector;',ANg='RightTriangle;',BNg='RightTriangleBar;',CNg='RightTriangleEqual;',DNg='RightUpDownVector;',ENg='RightUpTeeVector;',FNg='RightUpVector;',aOg='RightUpVectorBar;',bOg='RightVector;',cOg='RightVectorBar;',eOg='Rightarrow;',fOg='Ropf;',gOg='RoundImplies;',hOg='Rrightarrow;',iOg='Rscr;',jOg='Rsh;',kOg='RuleDelayed;',tIh='RuntimeException',cLh='SAXException',dLh='SAXParseException',lOg='SHCHcy;',mOg='SHcy;',nOg='SOFTcy;',wGh='STANDARDS_MODE',pOg='Sacute;',dyg='Saw an xmlns attribute.',qOg='Sc;',rOg='Scaron;',sOg='Scedil;',tOg='Scirc;',uOg='Scy;',vOg='Sfr;',wOg='ShortDownArrow;',xOg='ShortLeftArrow;',yOg='ShortRightArrow;',AOg='ShortUpArrow;',BOg='Sigma;',COg='SmallCircle;',DOg='Sopf;',EOg='Sqrt;',FOg='Square;',aPg='SquareIntersection;',bPg='SquareSubset;',cPg='SquareSubsetEqual;',dPg='SquareSuperset;',gPg='SquareSupersetEqual;',hPg='SquareUnion;',iPg='Sscr;',EKh='StackNode',FKh='StackNode;',jPg='Star;',aUh='String',xEg='String index out of range: ',yIh='String;',kJh='StringBuffer',lJh='StringBuilder',mJh='StringIndexOutOfBoundsException',kPg='Sub;',lPg='Subset;',mPg='SubsetEqual;',nPg='Succeeds;',oPg='SucceedsEqual;',pPg='SucceedsSlantEqual;',rPg='SucceedsTilde;',sPg='SuchThat;',tPg='Sum;',uPg='Sup;',vPg='Superset;',wPg='SupersetEqual;',xPg='Supset;',yPg='THORN',zPg='THORN;',APg='TRADE;',CPg='TSHcy;',DPg='TScy;',EPg='Tab;',FPg='Tau;',aQg='Tcaron;',bQg='Tcedil;',cQg='Tcy;',dQg='Tfr;',wxg='The document is not mappable to XML 1.0 due to a trailing hyphen in a comment.',pxg='The document is not mappable to XML 1.0 due to two consecutive hyphens in a comment.',eQg='Therefore;',fQg='Theta;',hQg='ThinSpace;',yxg='This document is not mappable to XML 1.0 without data loss due to ',xMh='This is a searchable index. Insert your search keywords here: ',rIh='Throwable',iQg='Tilde;',jQg='TildeEqual;',kQg='TildeFullEqual;',lQg='TildeTilde;',qIh='Timer',aJh='Timer$1',yKh='Tokenizer',mQg='Topf;',jKh='TreeBuilder',nQg='TripleDot;',oQg='Tscr;',pQg='Tstrok;',hyg='U',byg='U+',ayg='U+0',Fxg='U+00',Exg='U+000',aLh='UTF16Buffer',qQg='Uacute',sQg='Uacute;',tQg='Uarr;',uQg='Uarrocir;',vQg='Ubrcy;',wQg='Ubreve;',xQg='Ucirc',yQg='Ucirc;',zQg='Ucy;',AQg='Udblac;',BQg='Ufr;',DQg='Ugrave',EQg='Ugrave;',FQg='Umacr;',aRg='UnderBar;',bRg='UnderBrace;',cRg='UnderBracket;',dRg='UnderParenthesis;',eRg='Union;',fRg='UnionPlus;',uKg='Unreachable',cyg='Unreachable.',nJh='UnsupportedOperationException',gRg='Uogon;',iRg='Uopf;',jRg='UpArrow;',kRg='UpArrowBar;',lRg='UpArrowDownArrow;',mRg='UpDownArrow;',nRg='UpEquilibrium;',oRg='UpTee;',pRg='UpTeeArrow;',qRg='Uparrow;',rRg='Updownarrow;',tRg='UpperLeftArrow;',uRg='UpperRightArrow;',vRg='Upsi;',wRg='Upsilon;',xRg='Uring;',yRg='Uscr;',zRg='Utilde;',ARg='Uuml',BRg='Uuml;',CRg='VDash;',ERg='Vbar;',FRg='Vcy;',aSg='Vdash;',bSg='Vdashl;',cSg='Vee;',dSg='Verbar;',eSg='Vert;',fSg='VerticalBar;',gSg='VerticalLine;',hSg='VerticalSeparator;',jSg='VerticalTilde;',kSg='VeryThinSpace;',lSg='Vfr;',mSg='Vopf;',nSg='Vscr;',oSg='Vvdash;',pSg='Wcirc;',qSg='Wedge;',rSg='Wfr;',sSg='Wopf;',vSg='Wscr;',wSg='Xfr;',xSg='Xi;',hKh='XmlViolationPolicy',ySg='Xopf;',zSg='Xscr;',ASg='YAcy;',BSg='YIcy;',CSg='YUcy;',DSg='Yacute',ESg='Yacute;',aTg='Ycirc;',bTg='Ycy;',cTg='Yfr;',dTg='Yopf;',eTg='Yscr;',fTg='Yuml;',gTg='ZHcy;',hTg='Zacute;',iTg='Zcaron;',jTg='Zcy;',lTg='Zdot;',mTg='ZeroWidthSpace;',nTg='Zeta;',oTg='Zfr;',pTg='Zopf;',qTg='Zscr;',tSg='[',dJh='[C',iJh='[I',xIh='[Ljava.lang.',tKh='[Lnu.validator.htmlparser.impl.',sKh='[Z',DKh='[[C',BIh='[[D',sZg=']',oFg='a',rTg='aacute',sTg='aacute;',C6g='abbr',bvg='about:legacy-compat',tTg='abreve;',C2h='abs',uTg='ac;',Cuh='accent',gWh='accent-height',wSh='accentunder',ruh='accept',DXh='accept-charset',cPh='accesskey',bRh='accumulate',wTg='acd;',xTg='acirc',yTg='acirc;',rrg='acronym',kwh='action',aRh='actiontype',svh='active',zXh='actuate',zTg='acute',ATg='acute;',BTg='acy;',hNh='additive',yEg='address',CTg='aelig',DTg='aelig;',ETg='af;',FTg='afr;',bUg='agrave',cUg='agrave;',dUg='alefsym;',eUg='aleph;',ojh='align',w0h='alignment-baseline',EXh='alignmentscope',djh='alink',fUg='alpha;',FQh='alphabetic',l2g='alt',atg='altGlyph',Fug='altGlyphDef',qvg='altGlyphItem',Fsg='altglyph',Eug='altglyphdef',pvg='altglyphitem',Dvh='altimg',hLh='alttext',gUg='amacr;',hUg='amalg;',iUg='amp',jUg='amp;',gPh='amplitude',A2h='and',kUg='and;',mUg='andand;',nUg='andd;',oUg='andslope;',pUg='andv;',qUg='ang;',rUg='ange;',sUg='angle;',tUg='angmsd;',uUg='angmsdaa;',vUg='angmsdab;',xUg='angmsdac;',yUg='angmsdad;',zUg='angmsdae;',AUg='angmsdaf;',BUg='angmsdag;',CUg='angmsdah;',DUg='angrt;',EUg='angrtvb;',FUg='angrtvbd;',aVg='angsph;',cVg='angst;',dVg='angzarr;',krg='animate',svg='animateColor',Evg='animateMotion',zwg='animateTransform',rvg='animatecolor',Dvg='animatemotion',xwg='animatetransform',aug='animation',sug='annotation',kwg='annotation-xml',eVg='aogon;',fVg='aopf;',gVg='ap;',hVg='apE;',iVg='apacir;',jVg='ape;',kVg='apid;',lVg='apos;',A6h='applet',w5h='apply',D6h='approx',nVg='approx;',oVg='approxeq;',BSh='arabic-form',z6h='arccos',prg='arccosh',C6h='arccot',qrg='arccoth',w6h='arccsc',mrg='arccsch',iLh='archive',CXh='arcrole',v6h='arcsec',lrg='arcsech',y6h='arcsin',org='arcsinh',x6h='arctan',nrg='arctanh',i4h='area',B2h='arg',h1h='aria-activedescendant',ySh='aria-atomic',e0h='aria-autocomplete',dPh='aria-busy',uUh='aria-channel',rUh='aria-checked',eWh='aria-controls',vWh='aria-datatype',iZh='aria-describedby',qWh='aria-disabled',xYh='aria-dropeffect',pWh='aria-expanded',ASh='aria-flowto',ePh='aria-grab',fWh='aria-haspopup',zSh='aria-hidden',pUh='aria-invalid',yYh='aria-labelledby',cRh='aria-level',hPh='aria-live',FXh='aria-multiline',f1h='aria-multiselectable',FOh='aria-owns',jWh='aria-posinset',qUh='aria-pressed',lWh='aria-readonly',iWh='aria-relevant',nWh='aria-required',xSh='aria-secret',mWh='aria-selected',tUh='aria-setsize',bPh='aria-sort',zYh='aria-templateid',kWh='aria-valuemax',wWh='aria-valuemin',hWh='aria-valuenow',pVg='aring',qVg='aring;',jrg='article',hvh='ascent',rVg='ascr;',u5h='aside',sVg='ast;',tVg='asymp;',uVg='asympeq;',yih='async',vVg='atilde',wVg='atilde;',uWh='attributeName',sWh='attributeType',tWh='attributename',rWh='attributetype',v5h='audio',yVg='auml',zVg='auml;',sUh='autocomplete',aPh='autofocus',gNh='autoplay',EQh='autosubmit',AVg='awconint;',BVg='awint;',r6g='axis',jLh='azimuth',t1h='b',CVg='bNot;',DVg='backcong;',EVg='backepsilon;',fRh='background',FVg='backprime;',aWg='backsim;',bWg='backsimeq;',eWg='barvee;',fWg='barwed;',gWg='barwedge;',u9g='base',yWh='baseFrequency',eTh='baseProfile',btg='basefont',xWh='basefrequency',pNh='baseline',aYh='baseline-shift',dTh='baseprofile',h7g='bbox',hWg='bbrk;',iWg='bbrktbrk;',jWg='bcong;',kWg='bcy;',E2h='bdo',lWg='bdquo;',mWg='becaus;',nWg='because;',flh='begin',pWg='bemptyv;',qWg='bepsi;',rWg='bernou;',sWg='beta;',tWg='beth;',uWg='between;',nNh='bevelled',vWg='bfr;',oLh='bgcolor',trg='bgsound',i8g='bias',D2h='big',wWg='bigcap;',xWg='bigcirc;',yWg='bigcup;',AWg='bigodot;',BWg='bigoplus;',CWg='bigotimes;',DWg='bigsqcup;',EWg='bigstar;',FWg='bigtriangledown;',aXg='bigtriangleup;',bXg='biguplus;',cXg='bigvee;',dXg='bigwedge;',fXg='bkarow;',gXg='blacklozenge;',hXg='blacksquare;',iXg='blacktriangle;',jXg='blacktriangledown;',kXg='blacktriangleleft;',lXg='blacktriangleright;',mXg='blank;',nXg='blk12;',oXg='blk14;',qXg='blk34;',rXg='block;',tug='blockquote',sXg='bnot;',lDg='body',tXg='bopf;',vwh='border',uXg='bot;',vXg='bottom;',wXg='bowtie;',xXg='boxDL;',yXg='boxDR;',zXg='boxDl;',BXg='boxDr;',CXg='boxH;',DXg='boxHD;',EXg='boxHU;',FXg='boxHd;',aYg='boxHu;',bYg='boxUL;',cYg='boxUR;',dYg='boxUl;',eYg='boxUr;',gYg='boxV;',hYg='boxVH;',iYg='boxVL;',jYg='boxVR;',kYg='boxVh;',lYg='boxVl;',mYg='boxVr;',nYg='boxbox;',oYg='boxdL;',pYg='boxdR;',rYg='boxdl;',sYg='boxdr;',tYg='boxh;',uYg='boxhD;',vYg='boxhU;',wYg='boxhd;',xYg='boxhu;',yYg='boxminus;',zYg='boxplus;',AYg='boxtimes;',CYg='boxuL;',DYg='boxuR;',EYg='boxul;',FYg='boxur;',aZg='boxv;',bZg='boxvH;',cZg='boxvL;',dZg='boxvR;',eZg='boxvh;',fZg='boxvl;',hZg='boxvr;',iZg='bprime;',z1h='br',jZg='breve;',kZg='brvbar',lZg='brvbar;',mZg='bscr;',nZg='bsemi;',oZg='bsim;',pZg='bsime;',qZg='bsol;',uZg='bsolb;',vZg='bull;',wZg='bullet;',xZg='bump;',yZg='bumpE;',zZg='bumpe;',AZg='bumpeq;',E6h='button',j4h='bvar',aUg='by',BZg='cacute;',jNh='calcMode',iNh='calcmode',b7h='canvas',eRh='cap-height',CZg='cap;',DZg='capand;',FZg='capbrcup;',a0g='capcap;',b0g='capcup;',c0g='capdot;',nwg='caption',k4h='card',d0g='caret;',e0g='caron;',Awg='cartesianproduct',f0g='ccaps;',g0g='ccaron;',h0g='ccedil',i0g='ccedil;',k0g='ccirc;',l0g='ccups;',m0g='ccupssm;',n0g='cdot;',o0g='cedil',p0g='cedil;',wrg='ceiling',CSh='cellpadding',DSh='cellspacing',q0g='cemptyv;',r0g='cent',s0g='cent;',a7h='center',t0g='centerdot;',v0g='cfr;',j9g='char',nLh='charoff',qLh='charset',w0g='chcy;',x0g='check;',mLh='checked',y0g='checkmark;',z0g='chi;',A1h='ci',A0g='cir;',B0g='cirE;',C0g='circ;',D0g='circeq;',F6h='circle',E0g='circlearrowleft;',a1g='circlearrowright;',b1g='circledR;',c1g='circledS;',d1g='circledast;',e1g='circledcirc;',f1g='circleddash;',g1g='cire;',h1g='cirfnint;',i1g='cirmid;',j1g='cirscir;',s7g='cite',pkh='class',zxg='class ',bMg='classid',Akh='clear',E8g='clip',jPh='clip-path',iPh='clip-rule',dtg='clipPath',DWh='clipPathUnits',ctg='clippath',CWh='clippathunits',zjh='close',kLh='closure',mMg='clsid:32F66A20-7614-11D4-BD11-00104BD3F987',dOg='clsid:AC159093-1683-4BA2-9DCF-0C350141D7F2',l1g='clubs;',m1g='clubsuit;',B1h='cn',D7g='code',lNh='codebase',kNh='codetype',etg='codomain',a3h='col',aDg='colgroup',n1g='colon;',o1g='colone;',p1g='coloneq;',ekh='color',D0h='color-interpolation',q1h='color-interpolation-filters',BWh='color-profile',AYh='color-rendering',t8g='cols',pLh='colspan',aTh='columnalign',bTh='columnlines',AWh='columnspacing',dRh='columnspan',ESh='columnwidth',uIh='com.google.gwt.core.client.',pIh='com.google.gwt.user.client.',q1g='comma;',urg='command',r1g='commat;',s1g='comp;',rLh='compact',t1g='compfn;',u1g='complement;',dug='complexes',w1g='complexes;',vrg='compose',cug='condition',x1g='cong;',y1g='congdot;',z1g='conint;',bug='conjugate',sLh='content',g0h='contentScriptType',kZh='contentStyleType',BYh='contenteditable',f0h='contentscripttype',jZh='contentstyletype',cTh='contextmenu',mNh='controls',lxh='coords',A1g='copf;',B1g='coprod;',C1g='copy',D1g='copy;',E1g='copysr;',c3h='cos',m4h='cosh',d3h='cot',p4h='coth',F1g='crarr;',b2g='cross;',F2h='csc',l4h='csch',c2g='cscr;',d2g='csub;',e2g='csube;',f2g='csup;',g2g='csupe;',xrg='csymbol',h2g='ctdot;',i2g='cudarrl;',j2g='cudarrr;',k2g='cuepr;',m2g='cuesc;',n2g='cularr;',o2g='cularrp;',p2g='cup;',q2g='cupbrcap;',r2g='cupcap;',s2g='cupcup;',t2g='cupdot;',u2g='cupor;',v2g='curarr;',x2g='curarrm;',q4h='curl',y2g='curlyeqprec;',z2g='curlyeqsucc;',A2g='curlyvee;',B2g='curlywedge;',C2g='curren',D2g='curren;',axh='cursor',E2g='curvearrowleft;',F2g='curvearrowright;',a3g='cuvee;',d3g='cuwed;',e3g='cwconint;',f3g='cwint;',lUg='cx',wUg='cy',g3g='cylcty;',DRg='d',h3g='dArr;',i3g='dHar;',j3g='dagger;',k3g='daleth;',l3g='darr;',m3g='dash;',o3g='dashv;',l$g='data',vLh='datafld',yUh='dataformatas',ftg='datagrid',uLh='datasrc',tvg='datatemplate',wNh='datetime',p3g='dbkarow;',q3g='dblac;',r3g='dcaron;',s3g='dcy;',C1h='dd',t3g='dd;',u3g='ddagger;',v3g='ddarr;',w3g='ddotseq;',xLh='declare',ALh='default',Clh='defer',lwg='definition-src',FWh='definitionURL',EWh='definitionurl',t4h='defs',x3g='deg',z3g='deg;',d7h='degree',e3h='del',A3g='delta;',B3g='demptyv;',qlh='depth',r4h='desc',BLh='descent',zrg='details',avg='determinant',C3g='dfisht;',f3h='dfn',D3g='dfr;',E3g='dharl;',F3g='dharr;',e7h='dialog',a4g='diam;',b4g='diamond;',c4g='diamondsuit;',e4g='diams;',f4g='die;',s4h='diff',EYh='diffuseConstant',DYh='diffuseconstant',g4g='digamma;',w2g='dir',mPh='direction',xNh='disabled',yrg='discard',h4g='disin;',yLh='display',wUh='displaystyle',dFg='div',i4g='div;',uug='divergence',c7h='divide',j4g='divide;',k4g='divideontimes;',zLh='divisor',l4g='divonx;',m4g='djcy;',D1h='dl',n4g='dlcorn;',p4g='dlcrop;',q4g='dollar;',f7h='domain',fxg='domainofapplication',j0h='dominant-baseline',r4g='dopf;',s4g='dot;',t4g='doteq;',u4g='doteqdot;',v4g='dotminus;',w4g='dotplus;',x4g='dotsquare;',y4g='doublebarwedge;',A4g='downarrow;',B4g='downdownarrows;',C4g='downharpoonleft;',D4g='downharpoonright;',nPh='draggable',E4g='drbkarow;',F4g='drcorn;',a5g='drcrop;',b5g='dscr;',c5g='dscy;',d5g='dsol;',f5g='dstrok;',E1h='dt',g5g='dtdot;',h5g='dtri;',i5g='dtrif;',j5g='duarr;',k5g='duhar;',c3g='dur',l5g='dwangle;',bVg='dx',mVg='dy',m5g='dzcy;',n5g='dzigrarr;',o5g='eDDot;',q5g='eDot;',r5g='eacute',s5g='eacute;',t5g='easter;',u5g='ecaron;',v5g='ecir;',w5g='ecirc',x5g='ecirc;',y5g='ecolon;',z5g='ecy;',a$g='edge',sNh='edgeMode',rNh='edgemode',B5g='edot;',C5g='ee;',D5g='efDot;',E5g='efr;',F5g='eg;',a6g='egrave',b6g='egrave;',c6g='egs;',d6g='egsdot;',e6g='el;',lPh='elevation',g6g='elinters;',h6g='ell;',Arg='ellipse',i6g='els;',j6g='elsdot;',F1h='em',k6g='emacr;',x5h='embed',l6g='empty;',gtg='emptyset',m6g='emptyset;',n6g='emptyv;',o6g='emsp13;',p6g='emsp14;',s6g='emsp;',h0h='enable-background',tNh='encoding',tLh='enctype',n3g='end',t6g='eng;',u6g='ensp;',v6g='eogon;',w6g='eopf;',x6g='epar;',y6g='eparsl;',z6g='eplus;',A6g='epsi;',B6g='epsilon;',D6g='epsiv;',b2h='eq',E6g='eqcirc;',F6g='eqcolon;',a7g='eqsim;',b7g='eqslantgtr;',c7g='eqslantless;',vUh='equalcolumns',kPh='equalrows',d7g='equals;',e7g='equest;',f7g='equiv;',g7g='equivDD;',xug='equivalent',i7g='eqvparsl;',j7g='erDot;',k7g='erarr;',l7g='escr;',m7g='esdot;',n7g='esim;',o7g='eta;',p7g='eth',q7g='eth;',vug='eulergamma',r7g='euml',t7g='euml;',u7g='euro;',cvg='eventsource',v7g='excl;',w7g='exist;',h7h='exists',g3h='exp',x7g='expectation;',qNh='exponent',uvg='exponentiale',y7g='exponentiale;',o1h='externalResourcesRequired',n1h='externalresourcesrequired',m_g='face',fug='factorial',htg='factorof',z7g='fallingdotseq;',y5h='false',A7g='fcy;',bsg='feBlend',fwg='feColorMatrix',hxg='feComponentTransfer',gvg='feComposite',Dwg='feConvolveMatrix',Fwg='feDiffuseLighting',bxg='feDisplacementMap',rwg='feDistantLight',dsg='feFlood',Crg='feFuncA',Frg='feFuncB',ksg='feFuncG',msg='feFuncR',pwg='feGaussianBlur',fsg='feImage',hsg='feMerge',evg='feMergeNode',Bvg='feMorphology',ltg='feOffset',zvg='fePointLight',exg='feSpecularLighting',ivg='feSpotLight',j7h='feTile',wvg='feTurbulence',asg='feblend',ewg='fecolormatrix',gxg='fecomponenttransfer',fvg='fecomposite',Cwg='feconvolvematrix',Ewg='fediffuselighting',axg='fedisplacementmap',qwg='fedistantlight',csg='feflood',Brg='fefunca',Erg='fefuncb',jsg='fefuncg',lsg='fefuncr',owg='fegaussianblur',esg='feimage',B7g='female;',gsg='femerge',dvg='femergenode',Avg='femorphology',hmh='fence',ktg='feoffset',yvg='fepointlight',cxg='fespecularlighting',hvg='fespotlight',i7h='fetile',vvg='feturbulence',C7g='ffilig;',E7g='fflig;',F7g='ffllig;',a8g='ffr;',itg='fieldset',k7h='figure',b8g='filig;',w$g='fill',zUh='fill-opacity',rPh='fill-rule',wxh='filter',pPh='filterRes',iTh='filterUnits',oPh='filterres',hTh='filterunits',c8g='flat;',d8g='fllig;',jTh='flood-color',cXh='flood-opacity',z5h='floor',e8g='fltns;',c2h='fn',f8g='fnof;',u4h='font',eug='font-face',Bwg='font-face-format',mwg='font-face-name',Fvg='font-face-src',awg='font-face-uri',fTh='font-family',tPh='font-size',lZh='font-size-adjust',BUh='font-stretch',lRh='font-style',AUh='font-variant',lTh='font-weight',jRh='fontfamily',yNh='fontsize',sPh='fontstyle',kRh='fontweight',m7h='footer',g8g='fopf;',y3g='for',l7h='forall',h8g='forall;',dwg='foreignObject',bwg='foreignobject',j8g='fork;',k8g='forkv;',srg='form',byh='format',l8g='fpartint;',m8g='frac12',n8g='frac12;',o8g='frac13;',p8g='frac14',q8g='frac14;',r8g='frac15;',s8g='frac16;',u8g='frac18;',v8g='frac23;',w8g='frac25;',x8g='frac34',y8g='frac34;',z8g='frac35;',A8g='frac38;',B8g='frac45;',C8g='frac56;',D8g='frac58;',F8g='frac78;',smh='frame',gTh='frameborder',Axg='frameset',CUh='framespacing',a9g='frasl;',b_g='from',b9g='frown;',c9g='fscr;',oWg='fx',zWg='fy',u1h='g',dWg='g1',xVg='g2',d9g='gE;',e9g='gEl;',f9g='gacute;',g9g='gamma;',h9g='gammad;',i9g='gap;',k9g='gbreve;',h3h='gcd',l9g='gcirc;',m9g='gcy;',n9g='gdot;',o9g='ge;',p9g='gel;',i3h='geq',q9g='geq;',r9g='geqq;',s9g='geqslant;',t9g='ges;',v9g='gescc;',w9g='gesdot;',x9g='gesdoto;',y9g='gesdotol;',z9g='gesles;',A9g='gfr;',B9g='gg;',C9g='ggg;',D9g='gimel;',E9g='gjcy;',b$g='gl;',c$g='glE;',d$g='gla;',e$g='glj;',B5h='glyph',gRh='glyph-name',r1h='glyph-orientation-horizontal',p1h='glyph-orientation-vertical',vNh='glyphRef',uNh='glyphref',f$g='gnE;',g$g='gnap;',h$g='gnapprox;',i$g='gne;',j$g='gneq;',k$g='gneqq;',m$g='gnsim;',n$g='gopf;',v4h='grad',l0h='gradientTransform',bXh='gradientUnits',k0h='gradienttransform',aXh='gradientunits',o$g='grave;',hRh='groupalign',p$g='gscr;',q$g='gsim;',r$g='gsime;',s$g='gsiml;',j2h='gt',t$g='gt;',u$g='gtcc;',v$g='gtcir;',x$g='gtdot;',y$g='gtlPar;',z$g='gtquest;',A$g='gtrapprox;',B$g='gtrarr;',C$g='gtrdot;',D$g='gtreqless;',E$g='gtreqqless;',F$g='gtrless;',a_g='gtrsim;',d2h='h1',e2h='h2',f2h='h3',g2h='h4',h2h='h5',i2h='h6',c_g='hArr;',d_g='hairsp;',e_g='half;',f_g='hamilt;',nsg='handler',DLh='hanging',g_g='hardcy;',h_g='harr;',i_g='harrcir;',j_g='harrw;',k_g='hbar;',l_g='hcirc;',Drg='head',n7h='header',ELh='headers',n_g='hearts;',o_g='heartsuit;',xyh='height',p_g='hellip;',q_g='hercon;',r_g='hfr;',mEg='hidden',wPh='hidefocus',x_g='high',C5h='hkern',s_g='hksearow;',t_g='hkswarow;',u_g='hoarr;',v_g='homtht;',w_g='hookleftarrow;',y_g='hookrightarrow;',z_g='hopf;',A_g='horbar;',mTh='horiz-adv-x',bYh='horiz-origin-x',cYh='horiz-origin-y',k2h='hr',cah='href',DNh='hreflang',B_g='hscr;',C_g='hslash;',myh='hspace',D_g='hstrok;',hAg='html',oRh='http-equiv',jKg='http://n.validator.nu/placeholder/',jBg='http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd',wDg='http://www.w3.org/1998/Math/MathML',hrg='http://www.w3.org/1999/xhtml',rQg='http://www.w3.org/1999/xlink',bEg='http://www.w3.org/2000/svg',BPg='http://www.w3.org/2000/xmlns/',Esg='http://www.w3.org/TR/REC-html40/strict.dtd',mvg='http://www.w3.org/TR/html4/loose.dtd',jtg='http://www.w3.org/TR/html4/strict.dtd',Ftg='http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd',wug='http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd',gQg='http://www.w3.org/XML/1998/namespace',E_g='hybull;',F_g='hyphen;',w1h='i',aah='iacute',bah='iacute;',dah='ic;',eah='icirc',fah='icirc;',yah='icon',gah='icy;',kLg='id',E5h='ident',tTh='ideographic',hah='iecy;',iah='iexcl',jah='iexcl;',kah='iff;',lah='ifr;',DIg='iframe',mah='igrave',oah='igrave;',pah='ii;',qah='iiiint;',rah='iiint;',sah='iinfin;',tah='iiota;',uah='ijlig;',vah='imacr;',D5h='image',bZh='image-rendering',wah='image;',hug='imaginary',yug='imaginaryi',xah='imagline;',zah='imagpart;',Aah='imath;',j3h='img',Bah='imof;',Cah='imped;',psg='implies',qYg='in',d4g='in2',Dah='in;',Eah='incare;',tnh='index',Fah='infin;',otg='infinity',abh='infintie;',bbh='inodot;',pGg='input',aQh='inputmode',k3h='ins',l3h='int',cbh='int;',ebh='intcal;',ntg='integers',fbh='integers;',gbh='intercal;',yPh='intercept',kug='interface ',gug='intersect',mtg='interval',hbh='intlarhk;',ibh='intprod;',osg='inverse',jbh='iocy;',kbh='iogon;',lbh='iopf;',mbh='iota;',nbh='iprod;',qbh='iquest',rbh='iquest;',rRh='irrelevant',sbh='iscr;',tbh='isin;',ubh='isinE;',eGg='isindex',vbh='isindot;',wbh='isins;',xbh='isinsv;',ybh='isinv;',Dmh='ismap',zbh='it;',Bbh='itilde;',Cbh='iukcy;',Dbh='iuml',Ebh='iuml;',mIh='java.lang.',CIh='java.util.',Fbh='jcirc;',ach='jcy;',bch='jfr;',cch='jmath;',dch='jopf;',ech='jscr;',gch='jsercy;',hch='jukcy;',iSg='k',fYg='k1',pXg='k2',AXg='k3',eXg='k4',ich='kappa;',jch='kappav;',n3h='kbd',kch='kcedil;',lch='kcy;',EUh='kernelMatrix',nZh='kernelUnitLength',DUh='kernelmatrix',mZh='kernelunitlength',CLh='kerning',vPh='keyPoints',nRh='keySplines',BNh='keyTimes',o7h='keygen',uPh='keypoints',mRh='keysplines',ANh='keytimes',mch='kfr;',nch='kgreen;',och='khcy;',pch='kjcy;',rch='kopf;',sch='kscr;',tch='lAarr;',uch='lArr;',vch='lAtail;',wch='lBarr;',xch='lE;',ych='lEg;',zch='lHar;',wph='label',Ach='lacute;',Cch='laemptyv;',Dch='lagran;',p7h='lambda',Ech='lambda;',fch='lang',Fch='lang;',adh='langd;',bdh='langle;',rOh='language',cdh='lap;',iug='laplacian',ddh='laquo',edh='laquo;',rMh='largeop',fdh='larr;',hdh='larrb;',idh='larrbfs;',jdh='larrfs;',kdh='larrhk;',ldh='larrlp;',mdh='larrpl;',ndh='larrsim;',odh='larrtl;',pdh='lat;',qdh='latail;',sdh='late;',tdh='lbarr;',udh='lbbrk;',vdh='lbrace;',wdh='lbrack;',xdh='lbrke;',ydh='lbrksld;',zdh='lbrkslu;',Adh='lcaron;',Bdh='lcedil;',Ddh='lceil;',p3h='lcm',Edh='lcub;',Fdh='lcy;',aeh='ldca;',beh='ldquo;',ceh='ldquor;',deh='ldrdhar;',eeh='ldrushar;',feh='ldsh;',geh='le;',ieh='leftarrow;',jeh='leftarrowtail;',keh='leftharpoondown;',leh='leftharpoonup;',meh='leftleftarrows;',neh='leftrightarrow;',oeh='leftrightarrows;',peh='leftrightharpoons;',qeh='leftrightsquigarrow;',reh='leftthreetimes;',teh='leg;',q7h='legend',qVh='lengthAdjust',pVh='lengthadjust',q3h='leq',ueh='leq;',veh='leqq;',weh='leqslant;',xeh='les;',yeh='lescc;',zeh='lesdot;',Aeh='lesdoto;',Beh='lesdotor;',Ceh='lesges;',Feh='lessapprox;',afh='lessdot;',bfh='lesseqgtr;',cfh='lesseqqgtr;',dfh='lessgtr;',efh='lesssim;',jYh='letter-spacing',ffh='lfisht;',gfh='lfloor;',hfh='lfr;',ifh='lg;',kfh='lgE;',lfh='lhard;',mfh='lharu;',nfh='lharul;',ofh='lhblk;',m2h='li',kYh='lighting-color',F5h='limit',r0h='limitingConeAngle',q0h='limitingconeangle',w4h='line',twg='linearGradient',swg='lineargradient',hQh='linebreak',mXh='linethickness',Abh='link',qch='list',ptg='listener',rsg='listing',pfh='ljcy;',qfh='ll;',rfh='llarr;',sfh='llcorner;',tfh='llhard;',vfh='lltri;',wfh='lmidot;',xfh='lmoust;',yfh='lmoustache;',n2h='ln',zfh='lnE;',Afh='lnap;',Bfh='lnapprox;',Cfh='lne;',Dfh='lneq;',Efh='lneqq;',agh='lnsim;',bgh='loang;',cgh='loarr;',dgh='lobrk;',bqh='local',o3h='log',qsg='logbase',qOh='longdesc',egh='longleftarrow;',fgh='longleftrightarrow;',ggh='longmapsto;',hgh='longrightarrow;',igh='looparrowleft;',jgh='looparrowright;',qMh='loopend',iQh='loopstart',lgh='lopar;',mgh='lopf;',ngh='loplus;',ogh='lotimes;',e5g='low',pgh='lowast;',qgh='lowbar;',qtg='lowlimit',uEh='lowsrc',rgh='loz;',sgh='lozenge;',tgh='lozf;',ugh='lpar;',wgh='lparlt;',kFh='lquote',xgh='lrarr;',ygh='lrcorner;',zgh='lrhar;',Agh='lrhard;',Bgh='lrm;',Cgh='lrtri;',Dgh='lsaquo;',Egh='lscr;',Fgh='lsh;',bhh='lsim;',chh='lsime;',dhh='lsimg;',FEh='lspace',ehh='lsqb;',fhh='lsquo;',ghh='lsquor;',hhh='lstrok;',o2h='lt',ihh='lt;',jhh='ltcc;',khh='ltcir;',mhh='ltdot;',nhh='lthree;',ohh='ltimes;',phh='ltlarr;',qhh='ltquest;',rhh='ltrPar;',shh='ltri;',thh='ltrie;',uhh='ltrif;',vhh='lurdshar;',xhh='luruhar;',xMg='m',nNg='m:',yhh='mDDot;',zhh='macr',Ahh='macr;',EDh='macros',wsg='maction',Bhh='male;',jvg='maligngroup',zug='malignmark',Chh='malt;',Dhh='maltese;',mOh='manifest',s3h='map',Ehh='map;',Fhh='mapsto;',aih='mapstodown;',cih='mapstoleft;',dih='mapstoup;',jVh='marginheight',CTh='marginwidth',B4h='mark',y7h='marker',DRh='marker-end',CRh='marker-mid',mVh='marker-start',eih='marker;',lVh='markerHeight',ATh='markerUnits',ETh='markerWidth',kVh='markerheight',zTh='markerunits',DTh='markerwidth',vsg='marquee',pbh='mask',tZh='maskContentUnits',eQh='maskUnits',rZh='maskcontentunits',dQh='maskunits',A4h='math',iYh='mathbackground',cQh='mathcolor',oVh='mathematical',wLg='mathplayer',nOh='mathsize',BTh='mathvariant',B7h='matrix',jug='matrixrow',o4g='max',fQh='maxlength',pMh='maxsize',fih='mcomma;',gih='mcy;',hih='mdash;',C4h='mean',iih='measuredangle;',lph='media',w7h='median',cZh='mediummathspace',stg='menclose',E4h='menu',z7h='merror',E0h='message',x4h='meta',rtg='metadata',c6h='meter',jEh='method',ssg='mfenced',jih='mfr;',a6h='mfrac',v7h='mglyph',kih='mho;',p2h='mi',lih='micro',oih='micro;',pih='mid;',qih='midast;',rih='midcir;',sih='middot',tih='middot;',z4g='min',oMh='minsize',e6h='minus',uih='minus;',vih='minusb;',wih='minusd;',xih='minusdu;',gwg='missing-glyph',Bug='mlabeledtr',zih='mlcp;',Aih='mldr;',hwg='mmultiscripts',q2h='mn',Bih='mnplus;',r2h='mo',dbh='mode',Cih='models;',jIh='moduleStartup',A7h='moment',lvg='momentabout',Dih='mopf;',lXh='movablelimits',d6h='mover',Eih='mp;',usg='mpadded',b6h='mpath',ttg='mphantom',kvg='mprescripts',g6h='mroot',F4h='mrow',s2h='ms',Fih='mscr;',s7h='mspace',h6h='msqrt',ajh='mstpos;',u7h='mstyle',y4h='msub',xsg='msubsup',D4h='msup',t7h='mtable',r3h='mtd',i6h='mtext',t3h='mtr',bjh='mu;',cjh='multimap;',oOh='multiple',ejh='mumap;',x7h='munder',Aug='munderover',Bqg='must be positive',fjh='nLeftarrow;',gjh='nLeftrightarrow;',hjh='nRightarrow;',ijh='nVDash;',jjh='nVdash;',kjh='nabla;',ljh='nacute;',pXh='name',mjh='nap;',njh='napos;',pjh='napprox;',Foh='nargs',qjh='natur;',rjh='natural;',uwg='naturalnumbers',sjh='naturals;',w3h='nav',tjh='nbsp',ujh='nbsp;',vjh='ncap;',wjh='ncaron;',xjh='ncedil;',yjh='ncong;',Ajh='ncup;',Bjh='ncy;',Cjh='ndash;',Djh='ne;',Ejh='neArr;',Fjh='nearhk;',akh='nearr;',bkh='nearrow;',u3h='neq',ckh='nequiv;',dkh='nesear;',b5h='nest',fkh='nexist;',gkh='nexists;',hkh='nfr;',ikh='nge;',jkh='ngeq;',kkh='ngsim;',lkh='ngt;',mkh='ngtr;',nkh='nhArr;',okh='nharr;',qkh='nhpar;',rkh='ni;',skh='nis;',tkh='nisd;',ukh='niv;',vkh='njcy;',wkh='nlArr;',xkh='nlarr;',ykh='nldr;',zkh='nle;',Bkh='nleftarrow;',Ckh='nleftrightarrow;',Dkh='nleq;',Ekh='nless;',Fkh='nlsim;',alh='nlt;',blh='nltri;',clh='nltrie;',dlh='nmid;',zFg='nobr',iJg='noembed',tJg='noframes',tDh='nohref',a5h='none',elh='nopf;',lOh='noresize',vtg='noscript',nMh='noshade',v3h='not',glh='not;',Cug='notanumber',kOh='notation',j6h='notin',hlh='notin;',ilh='notinva;',jlh='notinvb;',klh='notinvc;',llh='notni;',mlh='notniva;',nlh='notnivb;',olh='notnivc;',nvg='notprsubset',mug='notsubset',iDh='nowrap',plh='npar;',rlh='nparallel;',slh='npolint;',tlh='npr;',ulh='nprcue;',vlh='nprec;',wlh='nrArr;',xlh='nrarr;',ylh='nrightarrow;',zlh='nrtri;',Alh='nrtrie;',Dlh='nsc;',Elh='nsccue;',Flh='nscr;',amh='nshortmid;',bmh='nshortparallel;',cmh='nsim;',dmh='nsime;',emh='nsimeq;',fmh='nsmid;',gmh='nspar;',imh='nsqsube;',jmh='nsqsupe;',kmh='nsub;',lmh='nsube;',mmh='nsubseteq;',nmh='nsucc;',omh='nsup;',pmh='nsupe;',qmh='nsupseteq;',rmh='ntgl;',tmh='ntilde',umh='ntilde;',vmh='ntlg;',wmh='ntriangleleft;',xmh='ntrianglelefteq;',ymh='ntriangleright;',zmh='ntrianglerighteq;',cKh='nu.validator.htmlparser.common.',lKh='nu.validator.htmlparser.gwt.',lIh='nu.validator.htmlparser.gwt.HtmlParserModule',iKh='nu.validator.htmlparser.impl.',Amh='nu;',rQh='null',Bmh='num;',BRh='numOctaves',Cmh='numero;',ARh='numoctaves',Emh='numsp;',Fmh='nvDash;',anh='nvHarr;',bnh='nvdash;',cnh='nvinfin;',dnh='nvlArr;',enh='nvrArr;',fnh='nwArr;',gnh='nwarhk;',hnh='nwarr;',jnh='nwarrow;',knh='nwnear;',lnh='oS;',mnh='oacute',nnh='oacute;',onh='oast;',FKg='object',qRh='occurrence',pnh='ocir;',qnh='ocirc',rnh='ocirc;',jxg='octype',snh='ocy;',unh='odash;',vnh='odblac;',wnh='odiv;',xnh='odot;',ynh='odsold;',znh='oelig;',Anh='ofcir;',gCh='offset',Bnh='ofr;',Cnh='ogon;',Dnh='ograve',Fnh='ograve;',aoh='ogt;',boh='ohbar;',coh='ohm;',doh='oint;',t2h='ol',eoh='olarr;',foh='olcir;',goh='olcross;',hoh='oline;',ioh='olt;',koh='omacr;',loh='omega;',moh='omicron;',noh='omid;',ooh='ominus;',kIh='onModuleLoadStart',iMh='onabort',pRh='onactivate',hVh='onafterprint',dXh='onafterupdate',m0h='onbefordeactivate',oZh='onbeforeactivate',iVh='onbeforecopy',uTh='onbeforecut',p0h='onbeforeeditfocus',gXh='onbeforepaste',kXh='onbeforeprint',hYh='onbeforeunload',dYh='onbeforeupdate',dMh='onbegin',BBh='onblur',aOh='onbounce',eVh='oncellchange',FNh='onchange',aMh='onclick',iXh='oncontextmenu',aZh='oncontrolselect',CCh='oncopy',uoh='oncut',FYh='ondataavailable',qZh='ondatasetchanged',n0h='ondatasetcomplete',sRh='ondblclick',FUh='ondeactivate',zzh='ondrag',uRh='ondragdrop',zPh='ondragend',sTh='ondragenter',nTh='ondragleave',xRh='ondragover',xTh='ondragstart',qBh='ondrop',inh='onend',gMh='onerror',fXh='onerrorupdate',eYh='onfilterchange',cOh='onfinish',fMh='onfocus',EPh='onfocusin',yRh='onfocusout',dVh='onformchange',wTh='onforminput',AAh='onhelp',hMh='oninput',CPh='oninvalid',DPh='onkeydown',vRh='onkeypress',eMh='onkeyup',nzh='onload',hXh='onlosecapture',xPh='onmessage',qTh='onmousedown',gVh='onmouseenter',bVh='onmouseleave',oTh='onmousemove',zRh='onmouseout',rTh='onmouseover',FPh='onmouseup',fVh='onmousewheel',czh='onmove',APh='onmoveend',yTh='onmovestart',FLh='onpaste',pZh='onpropertychange',x0h='onreadystatechange',iOh='onrepeat',kMh='onreset',ENh='onresize',wRh='onrowenter',bQh='onrowexit',aVh='onrowsdelete',fYh='onrowsinserted',dOh='onscroll',jOh='onselect',jXh='onselectstart',jMh='onstart',fBh='onstop',hOh='onsubmit',bOh='onunload',pAh='onzoom',poh='oopf;',lMh='opacity',qoh='opar;',nah='open',fOh='operator',roh='operp;',soh='oplus;',oxg='optgroup',cMh='optimum',dxg='option',u2h='or',toh='or;',voh='orarr;',woh='ord;',Enh='order',xoh='order;',yoh='orderof;',zoh='ordf',Aoh='ordf;',Boh='ordm',Coh='ordm;',bLh='org.xml.sax.',rCh='orient',pTh='orientation',eAh='origin',Doh='origof;',Eoh='oror;',aph='orslope;',bph='orv;',cph='oscr;',dph='oslash',eph='oslash;',fph='osol;',joh='other',nug='otherwise',gph='otilde',hph='otilde;',iph='otimes;',jph='otimesas;',mph='ouml',nph='ouml;',Cvg='outerproduct',Dqg='output',oph='ovbar;',gOh='overflow',o0h='overline-position',y0h='overline-thickness',ywg='p',CNh='panose-1',pph='par;',qph='para',rph='para;',sph='parallel;',l6h='param',tph='parsim;',uph='parsl;',vph='part;',ovg='partialdiff',heh='path',gSh='pathLength',fSh='pathlength',BMh='pattern',e1h='patternContentUnits',vZh='patternTransform',zVh='patternUnits',d1h='patterncontentunits',uZh='patterntransform',xVh='patternunits',xph='pcy;',yph='percnt;',zph='period;',Aph='permil;',Bph='perp;',Cph='pertenk;',Dph='pfr;',Eph='phi;',Fph='phiv;',aqh='phmmat;',cqh='phone;',v2h='pi',dqh='pi;',k6h='piece',oug='piecewise',seh='ping',eqh='pitchfork;',fqh='piv;',EJg='plaintext',gqh='planck;',hqh='planckh;',iqh='plankv;',uQh='playcount',c5h='plus',jqh='plus;',kqh='plusacir;',lqh='plusb;',nqh='pluscir;',oqh='plusdo;',pqh='plusdu;',qqh='pluse;',rqh='plusmn',sqh='plusmn;',tqh='plussim;',uqh='plustwo;',vqh='pm;',oYh='pointer-events',wqh='pointint;',dIh='points',pQh='pointsAtX',tQh='pointsAtY',nQh='pointsAtZ',oQh='pointsatx',qQh='pointsaty',mQh='pointsatz',ysg='polygon',wtg='polyline',yqh='popf;',yHh='poster',zqh='pound',Aqh='pound;',m6h='power',Bqh='pr;',Cqh='prE;',Dqh='prap;',Eqh='prcue;',y3h='pre',Fqh='pre;',arh='prec;',brh='precapprox;',drh='preccurlyeq;',erh='preceq;',frh='precnapprox;',grh='precneqq;',hrh='precnsim;',irh='precsim;',xtg='prefetch',vXh='preserveAlpha',c1h='preserveAspectRatio',uXh='preservealpha',b1h='preserveaspectratio',jrh='prime;',Eqg='primes',krh='primes;',qYh='primitiveUnits',pYh='primitiveunits',lrh='prnE;',mrh='prnap;',orh='prnsim;',prh='prod;',zsg='product',qrh='profalar;',CMh='profile',rrh='profline;',srh='profsurf;',ytg='progress',oIh='prompt',trh='prop;',urh='propto;',vrh='prsim;',ztg='prsubset',wrh='prurel;',xrh='pscr;',zrh='psi;',Arh='puncsp;',x1h='q',Brh='qfr;',Crh='qint;',Drh='qopf;',Erh='qprime;',Frh='qscr;',ash='quaternions;',bsh='quatint;',csh='quest;',esh='questeq;',fsh='quot',gsh='quot;',Atg='quotient',uSg='r',hsh='rAarr;',ish='rArr;',jsh='rAtail;',ksh='rBarr;',lsh='rHar;',msh='race;',nsh='racute;',wwg='radialGradient',vwg='radialgradient',psh='radic;',iSh='radiogroup',gKh='radius',qsh='raemptyv;',rsh='rang;',ssh='rangd;',tsh='range;',ush='rangle;',vsh='raquo',wsh='raquo;',xsh='rarr;',ysh='rarrap;',Bsh='rarrb;',Csh='rarrbfs;',Dsh='rarrc;',Esh='rarrfs;',Fsh='rarrhk;',ath='rarrlp;',bth='rarrpl;',cth='rarrsim;',dth='rarrtl;',eth='rarrw;',gth='ratail;',hth='ratio;',pug='rationals',ith='rationals;',jth='rbarr;',kth='rbbrk;',lth='rbrace;',mth='rbrack;',nth='rbrke;',oth='rbrksld;',pth='rbrkslu;',rth='rcaron;',sth='rcedil;',tth='rceil;',uth='rcub;',vth='rcy;',wth='rdca;',xth='rdldhar;',yth='rdquo;',zth='rdquor;',Ath='rdsh;',uOh='readonly',f5h='real',Cth='real;',Dth='realine;',Eth='realpart;',n6h='reals',Fth='reals;',h5h='rect',auh='rect;',jfh='refX',Ffh='refY',Eeh='refx',ufh='refy',buh='reg',cuh='reg;',p5g='rel',g5h='reln',z3h='rem',yZh='rendering-intent',yNg='renesis',CKh='repeat',hSh='repeat-max',mSh='repeat-min',FVh='repeat-start',gZh='repeat-template',gUh='repeatCount',yQh='repeatDur',fUh='repeatcount',xQh='repeatdur',fNh='replace',BOh='required',C0h='requiredExtensions',xZh='requiredFeatures',B0h='requiredextensions',wZh='requiredfeatures',EMh='restart',rKh='result',A5g='rev',duh='rfisht;',euh='rfloor;',fuh='rfr;',huh='rhard;',iuh='rharu;',juh='rharul;',kuh='rho;',luh='rhov;',muh='rightarrow;',nuh='rightarrowtail;',ouh='rightharpoondown;',puh='rightharpoonup;',quh='rightleftarrows;',suh='rightleftharpoons;',tuh='rightrightarrows;',uuh='rightsquigarrow;',vuh='rightthreetimes;',wuh='ring;',xuh='risingdotseq;',yuh='rlarr;',zuh='rlhar;',Auh='rlm;',Buh='rmoust;',Duh='rmoustache;',Euh='rnmid;',Fuh='roang;',avh='roarr;',bvh='robrk;',bih='role',i5h='root',cvh='ropar;',dvh='ropf;',evh='roplus;',fLh='rotate',fvh='rotimes;',yOh='rowalign',wOh='rowlines',ahh='rows',nSh='rowspacing',FMh='rowspan',x2h='rp',gvh='rpar;',ivh='rpargt;',jvh='rppolint;',gLh='rquote',kvh='rrarr;',lvh='rsaquo;',mvh='rscr;',nvh='rsh;',eLh='rspace',ovh='rsqb;',pvh='rsquo;',qvh='rsquor;',tZg='rt',rvh='rthree;',tvh='rtimes;',uvh='rtri;',vvh='rtrie;',wvh='rtrif;',xvh='rtriltri;',AGg='ruby',d5h='rule',fth='rules',yvh='ruluhar;',EZg='rx',zvh='rx;',j0g='ry',oOg='s',fPg='s:',Avh='sacute;',l5h='samp',aNh='sandbox',Bvh='sbquo;',Cvh='sc;',Evh='scE;',iwg='scalarproduct',osh='scale',Fvh='scap;',awh='scaron;',bwh='sccue;',cwh='sce;',dwh='scedil;',pJh='scheme',ewh='scirc;',fwh='scnE;',gwh='scnap;',hwh='scnsim;',dsh='scope',zIh='scoped',lwh='scpolint;',hIg='script',eUh='scriptlevel',wXh='scriptminsize',g1h='scriptsizemultiplier',lUh='scrolldelay',wQh='scrolling',mwh='scsim;',nwh='scy;',n5h='sdev',owh='sdot;',pwh='sdotb;',qwh='sdote;',rwh='seArr;',xOh='seamless',swh='searhk;',twh='searr;',uwh='searrow;',B3h='sec',j5h='sech',wwh='sect',xwh='sect;',Bsg='section',vgh='seed',xvg='select',vOh='selected',zQh='selection',Btg='selector',qug='semantics',ywh='semi;',F3h='sep',AQh='separator',lSh='separators',zwh='seswar;',b4h='set',Asg='setdiff',Awh='setminus;',Bwh='setmn;',Cwh='sext;',Dwh='sfr;',Ewh='sfrown;',yrh='shape',eZh='shape-rendering',Fwh='sharp;',bxh='shchcy;',cxh='shcy;',dxh='shortmid;',exh='shortparallel;',vSh='show',fxh='shy',gxh='shy;',hxh='sigma;',ixh='sigmaf;',jxh='sigmav;',kxh='sim;',mxh='simdot;',nxh='sime;',oxh='simeq;',pxh='simg;',qxh='simgE;',rxh='siml;',sxh='simlE;',txh='simne;',uxh='simplus;',vxh='simrarr;',E3h='sin',k5h='sinh',kgh='size',xxh='slarr;',nrh='slope',o6h='small',yxh='smallsetminus;',zxh='smashp;',Axh='smeparsl;',Bxh='smid;',Cxh='smile;',Dxh='smt;',Exh='smte;',Fxh='softcy;',ayh='sol;',cyh='solb;',dyh='solbar;',Dug='solidcolor',eyh='sopf;',Fqg='source',CQh='space',erg='spacer',DMh='spacing',fyh='spades;',gyh='spadesuit;',lhh='span',hyh='spar;',xXh='specification',CZh='specularConstant',AZh='specularExponent',BZh='specularconstant',zZh='specularexponent',Ash='speed',BVh='spreadMethod',AVh='spreadmethod',iyh='sqcap;',jyh='sqcup;',kyh='sqsub;',lyh='sqsube;',nyh='sqsubset;',oyh='sqsubseteq;',pyh='sqsup;',qyh='sqsupe;',ryh='sqsupset;',syh='sqsupseteq;',tyh='squ;',uyh='square;',vyh='squarf;',wyh='squf;',yyh='srarr;',f6g='src',zyh='sscr;',Ayh='ssetmn;',Byh='ssmile;',Cyh='sstarf;',eNh='standby',Dyh='star;',Eyh='starf;',guh='start',kUh='startOffset',jUh='startoffset',iIh='startup',bWh='stdDeviation',aWh='stddeviation',qth='stemh',Bth='stemv',whh='step',iUh='stitchTiles',hUh='stitchtiles',m5h='stop',kSh='stop-color',cWh='stop-opacity',Fyh='straightepsilon;',azh='straightphi;',zOh='stretchy',arg='strike',l1h='strikethrough-position',m1h='strikethrough-thickness',eJh='string',bzh='strns;',AJh='stroke',FZh='stroke-dasharray',u0h='stroke-dashoffset',uYh='stroke-linecap',fZh='stroke-linejoin',v0h='stroke-miterlimit',wYh='stroke-opacity',EVh='stroke-width',brg='strong',BHg='style',A3h='sub',dzh='sub;',ezh='subE;',fzh='subdot;',gzh='sube;',hzh='subedot;',izh='submult;',jzh='subnE;',kzh='subne;',lzh='subplus;',mzh='subrarr;',vYh='subscriptshift',frg='subset',ozh='subset;',pzh='subseteq;',qzh='subseteqq;',rzh='subsetneq;',szh='subsetneqq;',tzh='subsim;',uzh='subsub;',vzh='subsup;',wzh='succ;',xzh='succapprox;',Azh='succcurlyeq;',Bzh='succeq;',Czh='succnapprox;',Dzh='succneqq;',Ezh='succnsim;',Fzh='succsim;',D3h='sum',aAh='sum;',bNh='summary',bAh='sung;',a4h='sup',cAh='sup1',dAh='sup1;',fAh='sup2',gAh='sup2;',hAh='sup3',iAh='sup3;',jAh='sup;',kAh='supE;',lAh='supdot;',mAh='supdsub;',nAh='supe;',oAh='supedot;',EZh='superscriptshift',qAh='suphsub;',rAh='suplarr;',sAh='supmult;',tAh='supnE;',uAh='supne;',vAh='supplus;',wAh='supset;',xAh='supseteq;',yAh='supseteqq;',zAh='supsetneq;',BAh='supsetneqq;',CAh='supsim;',DAh='supsub;',EAh='supsup;',DVh='surfaceScale',CVh='surfacescale',C3h='svg',FAh='swArr;',aBh='swarhk;',bBh='swarr;',cBh='swarrow;',crg='switch',dBh='swnwar;',drg='symbol',vQh='symmetric',tYh='systemLanguage',sYh='systemlanguage',eBh='szlig',gBh='szlig;',tOh='tabindex',cwg='table',dUh='tableValues',cUh='tablevalues',d4h='tan',s5h='tanh',lGh='target',hBh='target;',uMh='targetX',wMh='targetY',tMh='targetx',vMh='targety',iBh='tau;',FBg='tbody',grg='tbreak',jBh='tbrk;',kBh='tcaron;',lBh='tcedil;',mBh='tcy;',fyg='td',nBh='tdot;',oBh='telrec;',sOh='template',Csg='tendsto',Cdh='text',FTh='text-anchor',dZh='text-decoration',mYh='text-rendering',aSh='textLength',Dtg='textPath',qHg='textarea',FRh='textlength',Ctg='textpath',vCg='tfoot',pBh='tfr;',qyg='th',kCg='thead',rBh='there4;',sBh='therefore;',tBh='theta;',uBh='thetasym;',vBh='thetav;',wBh='thickapprox;',lYh='thickmathspace',xBh='thicksim;',oXh='thinmathspace',yBh='thinsp;',zBh='thkap;',ABh='thksim;',CBh='thorn',DBh='thorn;',EBh='tilde;',o5h='time',r6h='times',FBh='times;',aCh='timesb;',bCh='timesbar;',cCh='timesd;',dCh='tint;',fHg='title',u0g='to',eCh='toea;',fCh='top;',hCh='topbot;',iCh='topcir;',jCh='topf;',kCh='topfork;',lCh='tosa;',mCh='tprime;',uBg='tr',nCh='trade;',jQh='transform',rug='transpose',r5h='tref',oCh='triangle;',pCh='triangledown;',qCh='triangleleft;',sCh='trianglelefteq;',tCh='triangleq;',uCh='triangleright;',vCh='trianglerighteq;',wCh='tridot;',xCh='trie;',yCh='triminus;',zCh='triplus;',ACh='trisb;',BCh='tritime;',DCh='trpezium;',q5h='true',ECh='tscr;',FCh='tscy;',aDh='tshcy;',p6h='tspan',bDh='tstrok;',y2h='tt',cDh='twixt;',dDh='twoheadleftarrow;',eDh='twoheadrightarrow;',Bch='type',y1h='u',gZg='u1',BYg='u2',fDh='uArr;',gDh='uHar;',jDh='uacute',kDh='uacute;',lDh='uarr;',kxg='ublic',mDh='ubrcy;',nDh='ubreve;',oDh='ucirc',pDh='ucirc;',qDh='ucy;',rDh='udarr;',sDh='udblac;',uDh='udhar;',vDh='ufisht;',wDh='ufr;',xDh='ugrave',yDh='ugrave;',zDh='uharl;',ADh='uharr;',BDh='uhblk;',z2h='ul',CDh='ulcorn;',DDh='ulcorner;',FDh='ulcrop;',aEh='ultri;',bEh='umacr;',cEh='uml',dEh='uml;',z0h='underline-position',a1h='underline-thickness',sMh='unicode',sVh='unicode-bidi',nXh='unicode-range',s6h='union',tVh='units-per-em',rVh='unselectable',eEh='uogon;',fEh='uopf;',gEh='uparrow;',hEh='updownarrow;',iEh='upharpoonleft;',kEh='upharpoonright;',Dsg='uplimit',lEh='uplus;',mEh='upsi;',nEh='upsih;',oEh='upsilon;',pEh='upuparrows;',qEh='urcorn;',rEh='urcorner;',sEh='urcrop;',tEh='uring;',vEh='urtri;',wEh='uscr;',e4h='use',vFh='usemap',xEh='utdot;',yEh='utilde;',zEh='utri;',AEh='utrif;',BEh='uuarr;',CEh='uuml',DEh='uuml;',EEh='uwangle;',wVh='v-alphabetic',kQh='v-hanging',tXh='v-ideographic',nYh='v-mathematical',aFh='vArr;',bFh='vBar;',cFh='vBarv;',dFh='vDash;',cHh='valign',crh='value',xGh='values',lQh='valuetype',eFh='vangrt;',f4h='var',fFh='varepsilon;',Etg='variance',gFh='varkappa;',hFh='varnothing;',iFh='varphi;',jFh='varpi;',lFh='varpropto;',mFh='varr;',nFh='varrho;',oFh='varsigma;',pFh='vartheta;',qFh='vartriangleleft;',rFh='vartriangleright;',sFh='vcy;',tFh='vdash;',irg='vector',jwg='vectorproduct',uFh='vee;',wFh='veebar;',xFh='veeeq;',yFh='vellip;',zFh='verbar;',AMh='version',eSh='vert-adv-y',rXh='vert-origin-x',sXh='vert-origin-y',AFh='vert;',A0h='verythickmathspace',s0h='verythinmathspace',j1h='veryverythickmathspace',i1h='veryverythinmathspace',BFh='vfr;',u6h='video',t5h='view',zMh='viewBox',dSh='viewTarget',yMh='viewbox',cSh='viewtarget',bSh='visibility',t6h='vkern',xqh='vlink',CFh='vltri;',DFh='vopf;',EFh='vprop;',FFh='vrtri;',bGh='vscr;',nHh='vspace',cGh='vzigzag;',g4h='wbr',dGh='wcirc;',eGh='wedbar;',fGh='wedge;',gGh='wedgeq;',hGh='weierp;',iGh='wfr;',gdh='when',mqh='width',aGh='widths',jGh='wopf;',uVh='word-spacing',kGh='wp;',mGh='wr;',rdh='wrap',nGh='wreath;',vVh='writing-mode',oGh='wscr;',FSg='x',EOh='x-height',v1g='x1',a2g='x2',b0h='xChannelSelector',pGh='xcap;',a0h='xchannelselector',qGh='xcirc;',rGh='xcup;',sGh='xdtri;',tGh='xfr;',uGh='xhArr;',vGh='xharr;',yGh='xi;',zGh='xlArr;',AGh='xlarr;',hRg='xlink',yXh='xlink:actuate',AXh='xlink:arcrole',sSh='xlink:href',rSh='xlink:role',tSh='xlink:show',oUh='xlink:title',qSh='xlink:type',BGh='xmap;',sRg='xml',COh='xml:base',DOh='xml:lang',BQh='xml:space',CQg='xmlns',s1h='xmlns:',nUh='xmlns:xlink',sIg='xmp',CGh='xnis;',DGh='xodot;',EGh='xopf;',FGh='xoplus;',h4h='xor',aHh='xotime;',bHh='xrArr;',dHh='xrarr;',nih='xref',eHh='xscr;',fHh='xsqcup;',gHh='xuplus;',hHh='xutri;',iHh='xvee;',jHh='xwedge;',kTg='y',k1g='y1',F0g='y2',d0h='yChannelSelector',kHh='yacute',lHh='yacute;',mHh='yacy;',c0h='ychannelselector',oHh='ycirc;',pHh='ycy;',qHh='yen',rHh='yen;',sHh='yfr;',tHh='yicy;',uHh='yopf;',vHh='yscr;',lxg='ystem',wHh='yucy;',xHh='yuml',zHh='yuml;',vTg='z',AHh='zacute;',BHh='zcaron;',CHh='zcy;',DHh='zdot;',EHh='zeetrf;',FHh='zeta;',aIh='zfr;',bIh='zhcy;',cIh='zigrarr;',pSh='zoomAndPan',oSh='zoomandpan',eIh='zopf;',fIh='zscr;',gIh='zwj;',hIh='zwnj;',b3g='{',F9g='}',tsg='\u201D cannot be represented as XML 1.0.',eyg='\u201D is not serializable as XML 1.0.',nxg='\u201D without an explicit value seen. The attribute may be dropped by IE7.',rxg='\u201D.';var _,C7h=[0,-9223372036854775808],D7h=[16777216,0],E7h=[4294967295,9223372032559808512];function zdi(a){return (this==null?null:this)===(a==null?null:a)}
function Adi(){return k$h}
function Bdi(){return this.$H||(this.$H=++D8h)}
function Cdi(){return (this.tM==v0i||this.tI==2?this.gC():F9h).b+zqg+idi(this.tM==v0i||this.tI==2?this.hC():this.$H||(this.$H=++D8h),4)}
function xdi(){}
_=xdi.prototype={};_.eQ=zdi;_.gC=Adi;_.hC=Bdi;_.tS=Cdi;_.toString=function(){return this.tS()};_.tM=v0i;_.tI=1;function agi(c){var a,b;a=c.gC().b;b=c.Bb();if(b!=null){return a+Aqg+b}else{return a}}
function bgi(){return q$h}
function cgi(){return this.b}
function dgi(){return agi(this)}
function Efi(){}
_=Efi.prototype=new xdi();_.gC=bgi;_.Bb=cgi;_.tS=dgi;_.tI=3;_.b=null;function Bci(b,a){b.b=a;return b}
function Dci(){return g$h}
function Aci(){}
_=Aci.prototype=new Efi();_.gC=Dci;_.tI=4;function Edi(b,a){b.b=a;return b}
function aei(){return l$h}
function Ddi(){}
_=Ddi.prototype=new Aci();_.gC=aei;_.tI=5;function a8h(b,a){Bci(b,rZg+h8h(a)+iwh+e8h(a)+(a!=null&&(a.tM!=v0i&&a.tI!=2)?i8h(o9h(a)):cNh));h8h(a);e8h(a);f8h(a);return b}
function c8h(){return E9h}
function e8h(a){if(a!=null&&(a.tM!=v0i&&a.tI!=2)){return d8h(o9h(a))}else{return a+cNh}}
function d8h(a){return a==null?null:a.message}
function f8h(a){if(a!=null&&(a.tM!=v0i&&a.tI!=2)){return o9h(a)}else{return null}}
function h8h(a){if(a==null){return rQh}else if(a!=null&&(a.tM!=v0i&&a.tI!=2)){return g8h(o9h(a))}else if(a!=null&&n9h(a.tI,1)){return aUh}else{return (a.tM==v0i||a.tI==2?a.gC():F9h).b}}
function g8h(a){return a==null?null:a.name}
function i8h(a){var b=cNh;for(prop in a){if(prop!=pXh&&prop!=E0h){b+=n4h+prop+Aqg+a[prop]}}return b}
function F7h(){}
_=F7h.prototype=new Ddi();_.gC=c8h;_.tI=6;function q8h(){return function(){}}
function s8h(b,a){return b.tM==v0i||b.tI==2?b.eQ(a):(b==null?null:b)===(a==null?null:a)}
function w8h(a){return a.tM==v0i||a.tI==2?a.hC():a.$H||(a.$H=++D8h)}
var D8h=0;function c9h(e,c){var d=[null,0,false,[0,0]];var f=d[e];var a=new Array(c);for(var b=0;b<c;++b){a[b]=f}return a}
function d9h(){return this.aC}
function e9h(a,f,c,b,e){var d;d=c9h(e,b);f9h(a,f,c,d);return d}
function f9h(b,d,c,a){if(!g9h){g9h=new E8h()}j9h(a,g9h);a.aC=b;a.tI=d;a.qI=c;return a}
function h9h(a,b,c){if(c!=null){if(a.qI>0&&!m9h(c.tI,a.qI)){throw new Ebi()}if(a.qI<0&&(c.tM==v0i||c.tI==2)){throw new Ebi()}}return a[b]=c}
function j9h(a,c){for(var b in c){var d=c[b];if(d){a[b]=d}}return a}
function E8h(){}
_=E8h.prototype=new xdi();_.gC=d9h;_.tI=0;_.aC=null;_.length=0;_.qI=0;var g9h=null;function n9h(b,a){return b&&!!B9h[b][a]}
function m9h(b,a){return b&&B9h[b][a]}
function p9h(b,a){if(b!=null&&!m9h(b.tI,a)){throw new eci()}return b}
function o9h(a){if(a!=null&&(a.tM==v0i||a.tI==2)){throw new eci()}return a}
function s9h(b,a){return b!=null&&n9h(b.tI,a)}
var B9h=[{},{},{1:1,6:1,7:1,8:1},{2:1,6:1},{2:1,6:1},{2:1,6:1},{2:1,6:1,19:1},{4:1},{2:1,6:1},{2:1,6:1},{2:1,6:1},{2:1,6:1},{2:1,6:1},{6:1,8:1},{2:1,6:1},{2:1,6:1},{2:1,6:1},{7:1},{7:1},{2:1,6:1},{2:1,6:1},{18:1},{14:1},{14:1},{14:1},{15:1},{15:1},{6:1,15:1},{6:1,16:1},{6:1,15:1},{2:1,6:1,17:1},{6:1,8:1},{6:1,8:1},{6:1,8:1},{20:1},{3:1},{9:1},{10:1},{11:1},{21:1},{2:1,6:1,22:1},{2:1,6:1,22:1},{12:1},{13:1},{5:1},{5:1},{5:1},{5:1},{5:1},{5:1},{5:1},{5:1},{5:1},{5:1}];function gai(a){if(a!=null&&n9h(a.tI,2)){return a}return a8h(new F7h(),a)}
function rai(d,c){var a,b;c%=1.8446744073709552E19;d%=1.8446744073709552E19;a=c%4294967296;b=Math.floor(d/4294967296)*4294967296;c=c-a+b;d=d-b+a;while(d<0){d+=4294967296;c-=4294967296}while(d>4294967295){d-=4294967296;c+=4294967296}c=c%1.8446744073709552E19;while(c>9223372032559808512){c-=1.8446744073709552E19}while(c<-9223372036854775808){c+=1.8446744073709552E19}return [d,c]}
function sai(a){if(isNaN(a)){return mai(),pai}if(a<-9223372036854775808){return mai(),oai}if(a>=9223372036854775807){return mai(),nai}if(a>0){return rai(Math.floor(a),0)}else{return rai(Math.ceil(a),0)}}
function tai(c){var a,b;if(c>-129&&c<128){a=c+128;b=(jai(),kai)[a];if(b==null){b=kai[a]=uai(c)}return b}return uai(c)}
function uai(a){if(a>=0){return [a,0]}else{return [a+4294967296,-4294967296]}}
function jai(){jai=v0i;kai=e9h(dai,53,13,256,0)}
var kai;function mai(){mai=v0i;Math.log(2);nai=E7h;oai=C7h;tai(-1);tai(1);tai(2);pai=tai(0)}
var nai,oai,pai;function gbi(){gbi=v0i;obi=fji(new eji());sbi(new bbi())}
function fbi(a){if(a.b){$wnd.clearInterval(a.c)}else{$wnd.clearTimeout(a.c)}lji(obi,a)}
function hbi(a){if(!a.b){lji(obi,a)}rni(a)}
function ibi(b,a){if(a<=0){throw Fci(new Eci(),Bqg)}fbi(b);b.b=false;b.c=lbi(b,a);gji(obi,b)}
function lbi(b,a){return $wnd.setTimeout(function(){b.zb()},a)}
function mbi(){hbi(this)}
function nbi(){return b$h}
function abi(){}
_=abi.prototype=new xdi();_.zb=mbi;_.gC=nbi;_.tI=0;_.b=false;_.c=0;var obi;function dbi(){while((gbi(),obi).b>0){fbi(p9h(iji(obi,0),3))}}
function ebi(){return a$h}
function bbi(){}
_=bbi.prototype=new xdi();_.gC=ebi;_.tI=7;function sbi(a){ybi();if(!tbi){tbi=fji(new eji())}gji(tbi,a)}
function ubi(){var a;if(tbi){for(a=zhi(new xhi(),tbi);a.a<a.b.bc();){p9h(Chi(a),4);dbi()}}}
function vbi(){var a,b;b=null;if(tbi){for(a=zhi(new xhi(),tbi);a.a<a.b.bc();){p9h(Chi(a),4);b=null}}return b}
function xbi(){__gwt_initHandlers(function(){},function(){return vbi()},function(){ubi()})}
function ybi(){if(!wbi){xbi();wbi=true}}
var tbi=null,wbi=false;function Fbi(b,a){b.b=a;return b}
function bci(){return c$h}
function Ebi(){}
_=Ebi.prototype=new Ddi();_.gC=bci;_.tI=9;function ici(c,a){var b;b=new dci();b.b=c+a;b.a=4;return b}
function jci(c,a){var b;b=new dci();b.b=c+a;return b}
function kci(c,a){var b;b=new dci();b.b=c+a;b.a=8;return b}
function mci(){return e$h}
function nci(){return ((this.a&2)!=0?kug:(this.a&1)!=0?cNh:zxg)+this.b}
function dci(){}
_=dci.prototype=new xdi();_.gC=mci;_.tS=nci;_.tI=0;_.a=0;_.b=null;function gci(){return d$h}
function eci(){}
_=eci.prototype=new Ddi();_.gC=gci;_.tI=12;function vci(a){return this.b-a.b}
function wci(a){return (this==null?null:this)===(a==null?null:a)}
function xci(){return f$h}
function yci(){return this.$H||(this.$H=++D8h)}
function zci(){return this.a}
function tci(){}
_=tci.prototype=new xdi();_.cT=vci;_.eQ=wci;_.gC=xci;_.hC=yci;_.tS=zci;_.tI=13;_.a=null;_.b=0;function Fci(b,a){b.b=a;return b}
function bdi(){return h$h}
function Eci(){}
_=Eci.prototype=new Ddi();_.gC=bdi;_.tI=14;function ddi(b,a){b.b=a;return b}
function fdi(){return i$h}
function cdi(){}
_=cdi.prototype=new Ddi();_.gC=fdi;_.tI=15;function idi(f,e){var a,b,c,d;c=~~(32/e);a=(1<<e)-1;b=e9h(A_h,42,-1,c,1);d=c-1;if(f>=0){while(f>a){b[d--]=(udi(),vdi)[f&a];f>>=e}}else{while(d>0){b[d--]=(udi(),vdi)[f&a];f>>=e}}b[d]=(udi(),vdi)[f&a];return ofi(b,d,c)}
function rdi(){return j$h}
function pdi(){}
_=pdi.prototype=new Ddi();_.gC=rdi;_.tI=16;function udi(){udi=v0i;vdi=f9h(A_h,42,-1,[48,49,50,51,52,53,54,55,56,57,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122])}
var vdi;function efi(b,a){if(!(a!=null&&n9h(a.tI,1))){return false}return String(b)==a}
function ffi(f,c,d,a,b){var e;for(e=c;e<d;++e){a[b++]=f.charCodeAt(e)}}
function lfi(c){var a,b;b=c.length;a=e9h(A_h,42,-1,b,1);ffi(c,0,b,a,0);return a}
function mfi(b,c,a){if(c<0){throw Fei(new Eei(),c)}if(a<c){throw Fei(new Eei(),a-c)}if(a>b){throw Fei(new Eei(),a)}}
function ofi(c,b,a){c=c.slice(b,a);return String.fromCharCode.apply(null,c)}
function qfi(b,a){b=String(b);if(b==a){return 0}return b<a?-1:1}
function pfi(a){return qfi(this,a)}
function rfi(a){return efi(this,a)}
function sfi(){return p$h}
function tfi(){return iei(this)}
function ufi(){return this}
function xfi(d,c,a){var b;b=c+a;mfi(d.length,c,b);return ofi(d,c,b)}
_=String.prototype;_.cT=pfi;_.eQ=rfi;_.gC=sfi;_.hC=tfi;_.tS=ufi;_.tI=2;function dei(){dei=v0i;eei={};hei={}}
function fei(e){var a,b,c,d;d=e.length;c=d<64?1:~~(d/32);a=0;for(b=0;b<d;b+=c){a<<=1;a+=e.charCodeAt(b)}a|=0;return a}
function iei(c){dei();var a=iBg+c;var b=hei[a];if(b!=null){return b}b=eei[a];if(b==null){b=fei(c)}jei();return hei[a]=b}
function jei(){if(gei==256){eei=hei;hei={};gei=0}++gei}
var eei,gei=0,hei;function mei(a){a.a=tei(new rei());return a}
function nei(a,b){uei(a.a,b);return a}
function pei(){return m$h}
function qei(){return zei(this.a)}
function kei(){}
_=kei.prototype=new xdi();_.gC=pei;_.tS=qei;_.tI=17;function tei(a){a.b=e9h(D_h,48,1,0,0);return a}
function uei(b,c){var a;if(c==null){c=rQh}a=c.length;if(a>0){b.b[b.a++]=c;b.c+=a;if(b.a>1024){zei(b);b.b.length=1024}}return b}
function wei(f,e,d,a,b){var c;mfi(f.c,e,d);mfi(a.length,b,b+(d-e));c=zei(f);while(e<d){a[b++]=c.charCodeAt(e++)}}
function yei(d,b){var c,a;c=d.c;if(b<c){a=zei(d);d.b=f9h(D_h,48,1,[a.substr(0,b-0),cNh,a.substr(c,a.length-c)]);d.a=3;d.c+=cNh.length-(c-b)}else if(b>c){uei(d,String.fromCharCode.apply(null,e9h(A_h,42,-1,b-c,1)))}}
function zei(b){var a;if(b.a!=1){b.b.length=b.a;a=b.b.join(cNh);b.b=f9h(D_h,48,1,[a]);b.a=1}return b.b[0]}
function Aei(){return n$h}
function Dei(){return zei(this)}
function rei(){}
_=rei.prototype=new xdi();_.gC=Aei;_.tS=Dei;_.tI=18;_.a=0;_.c=0;function Fei(b,a){b.b=xEg+a;return b}
function bfi(){return o$h}
function Eei(){}
_=Eei.prototype=new cdi();_.gC=bfi;_.tI=19;function Afi(h,j,a,d,g){var b,c,e,f,i,k,l;if(h==null||a==null){throw new pdi()}k=(h.tM==v0i||h.tI==2?h.gC():F9h).b;e=(a.tM==v0i||a.tI==2?a.gC():F9h).b;if(k.charCodeAt(0)!=91||e.charCodeAt(0)!=91){throw Fbi(new Ebi(),gIg)}if(k.charCodeAt(1)!=e.charCodeAt(1)){throw Fbi(new Ebi(),vLg)}l=h.length;f=a.length;if(j<0||d<0||g<0||j+g>l||d+g>f){throw new cdi()}if((k.charCodeAt(1)==76||k.charCodeAt(1)==91)&&!efi(k,e)){i=p9h(h,5);b=p9h(a,5);if((h==null?null:h)===(a==null?null:a)&&j<d){j+=g;for(c=d+g;c-->d;){h9h(b,c,i[--j])}}else{for(c=d+g;d<c;){h9h(b,d++,i[j++])}}}else{Array.prototype.splice.apply(a,[d,g].concat(h.slice(j,j+g)))}}
function fgi(b,a){b.b=a;return b}
function hgi(){return r$h}
function egi(){}
_=egi.prototype=new Ddi();_.gC=hgi;_.tI=20;function jgi(a,b){var c;while(a.Eb()){c=a.ac();if(b==null?c==null:s8h(b,c)){return a}}return null}
function lgi(a){throw fgi(new egi(),ePg)}
function mgi(b){var a;a=jgi(this.Fb(),b);return !!a}
function ngi(){return s$h}
function ogi(){var a,b,c;c=mei(new kei());a=null;uei(c.a,tSg);b=this.Fb();while(b.Eb()){if(a!=null){uei(c.a,a)}else{a=cWg}nei(c,cNh+b.ac())}uei(c.a,sZg);return zei(c.a)}
function igi(){}
_=igi.prototype=new xdi();_.vb=lgi;_.wb=mgi;_.gC=ngi;_.tS=ogi;_.tI=0;function vii(c){var a,b,d,e,f;if((c==null?null:c)===(this==null?null:this)){return true}if(!(c!=null&&n9h(c.tI,16))){return false}e=p9h(c,16);if(p9h(this,16).d!=e.d){return false}for(b=sgi(new rgi(),xgi(new qgi(),e).a);Bhi(b.a);){a=p9h(Chi(b.a),14);d=a.Ab();f=a.Cb();if(!(d==null?p9h(this,16).c:d!=null?thi(p9h(this,16),d):shi(p9h(this,16),d,~~iei(d)))){return false}if(!pli(f,d==null?p9h(this,16).b:d!=null?p9h(this,16).e[iBg+d]:phi(p9h(this,16),d,~~iei(d)))){return false}}return true}
function wii(){return C$h}
function xii(){var a,b,c;c=0;for(b=sgi(new rgi(),xgi(new qgi(),p9h(this,16)).a);Bhi(b.a);){a=p9h(Chi(b.a),14);c+=a.hC();c=~~c}return c}
function yii(){var a,b,c,d;d=b3g;a=false;for(c=sgi(new rgi(),xgi(new qgi(),p9h(this,16)).a);Bhi(c.a);){b=p9h(Chi(c.a),14);if(a){d+=cWg}else{a=true}d+=cNh+b.Ab();d+=q6g;d+=cNh+b.Cb()}return d+F9g}
function nii(){}
_=nii.prototype=new xdi();_.eQ=vii;_.gC=wii;_.hC=xii;_.tS=yii;_.tI=0;function khi(g,c){var e=g.a;for(var d in e){if(d==parseInt(d)){var a=e[d];for(var f=0,b=a.length;f<b;++f){c.vb(a[f])}}}}
function lhi(e,a){var d=e.e;for(var c in d){if(c.charCodeAt(0)==58){var b=jhi(e,c.substring(1));a.vb(b)}}}
function mhi(a){a.a=[];a.e={};a.c=false;a.b=null;a.d=0}
function ohi(b,a){return a==null?b.c:a!=null?iBg+a in b.e:shi(b,a,~~iei(a))}
function rhi(b,a){return a==null?b.b:a!=null?b.e[iBg+a]:phi(b,a,~~iei(a))}
function phi(h,g,e){var a=h.a[e];if(a){for(var f=0,b=a.length;f<b;++f){var c=a[f];var d=c.Ab();if(h.yb(g,d)){return c.Cb()}}}return null}
function shi(h,g,e){var a=h.a[e];if(a){for(var f=0,b=a.length;f<b;++f){var c=a[f];var d=c.Ab();if(h.yb(g,d)){return true}}}return false}
function thi(b,a){return iBg+a in b.e}
function uhi(a,b){return (a==null?null:a)===(b==null?null:b)||a!=null&&s8h(a,b)}
function vhi(){return x$h}
function pgi(){}
_=pgi.prototype=new nii();_.yb=uhi;_.gC=vhi;_.tI=0;_.a=null;_.b=null;_.c=false;_.d=0;_.e=null;function bji(b){var a,c,d;if((b==null?null:b)===(this==null?null:this)){return true}if(!(b!=null&&n9h(b.tI,18))){return false}c=p9h(b,18);if(c.a.d!=this.bc()){return false}for(a=sgi(new rgi(),c.a);Bhi(a.a);){d=p9h(Chi(a.a),14);if(!this.wb(d)){return false}}return true}
function cji(){return E$h}
function dji(){var a,b,c;a=0;for(b=this.Fb();b.Eb();){c=b.ac();if(c!=null){a+=w8h(c);a=~~a}}return a}
function Fii(){}
_=Fii.prototype=new igi();_.eQ=bji;_.gC=cji;_.hC=dji;_.tI=0;function xgi(b,a){b.a=a;return b}
function zgi(c){var a,b,d;if(c!=null&&n9h(c.tI,14)){a=p9h(c,14);b=a.Ab();if(ohi(this.a,b)){d=rhi(this.a,b);return eki(a.Cb(),d)}}return false}
function Agi(){return u$h}
function Bgi(){return sgi(new rgi(),this.a)}
function Cgi(){return this.a.d}
function qgi(){}
_=qgi.prototype=new Fii();_.wb=zgi;_.gC=Agi;_.Fb=Bgi;_.bc=Cgi;_.tI=21;_.a=null;function sgi(c,b){var a;c.b=b;a=fji(new eji());if(c.b.c){gji(a,Egi(new Dgi(),c.b))}lhi(c.b,a);khi(c.b,a);c.a=zhi(new xhi(),a);return c}
function ugi(){return t$h}
function vgi(){return Bhi(this.a)}
function wgi(){return p9h(Chi(this.a),14)}
function rgi(){}
_=rgi.prototype=new xdi();_.gC=ugi;_.Eb=vgi;_.ac=wgi;_.tI=0;_.a=null;_.b=null;function qii(b){var a;if(b!=null&&n9h(b.tI,14)){a=p9h(b,14);if(pli(this.Ab(),a.Ab())&&pli(this.Cb(),a.Cb())){return true}}return false}
function rii(){return B$h}
function sii(){var a,b;a=0;b=0;if(this.Ab()!=null){a=iei(this.Ab())}if(this.Cb()!=null){b=w8h(this.Cb())}return a^b}
function tii(){return this.Ab()+q6g+this.Cb()}
function oii(){}
_=oii.prototype=new xdi();_.eQ=qii;_.gC=rii;_.hC=sii;_.tS=tii;_.tI=22;function Egi(b,a){b.a=a;return b}
function ahi(){return v$h}
function bhi(){return null}
function chi(){return this.a.b}
function Dgi(){}
_=Dgi.prototype=new oii();_.gC=ahi;_.Ab=bhi;_.Cb=chi;_.tI=23;_.a=null;function ehi(c,a,b){c.b=b;c.a=a;return c}
function ghi(){return w$h}
function hhi(){return this.a}
function ihi(){return this.b.e[iBg+this.a]}
function jhi(b,a){return ehi(new dhi(),a,b)}
function dhi(){}
_=dhi.prototype=new oii();_.gC=ghi;_.Ab=hhi;_.Cb=ihi;_.tI=24;_.a=null;_.b=null;function gii(a){this.ub(this.bc(),a);return true}
function fii(b,a){throw fgi(new egi(),obh)}
function hii(a,b){if(a<0||a>=b){lii(a,b)}}
function iii(e){var a,b,c,d,f;if((e==null?null:e)===(this==null?null:this)){return true}if(!(e!=null&&n9h(e.tI,15))){return false}f=p9h(e,15);if(this.bc()!=f.bc()){return false}c=this.Fb();d=f.Fb();while(c.a<c.b.bc()){a=Chi(c);b=Chi(d);if(!(a==null?b==null:s8h(a,b))){return false}}return true}
function jii(){return A$h}
function kii(){var a,b,c;b=1;a=this.Fb();while(a.a<a.b.bc()){c=Chi(a);b=31*b+(c==null?0:w8h(c));b=~~b}return b}
function lii(a,b){throw ddi(new cdi(),Deh+a+mih+b)}
function mii(){return zhi(new xhi(),this)}
function whi(){}
_=whi.prototype=new igi();_.vb=gii;_.ub=fii;_.eQ=iii;_.gC=jii;_.hC=kii;_.Fb=mii;_.tI=25;function zhi(b,a){b.b=a;return b}
function Bhi(a){return a.a<a.b.bc()}
function Chi(a){if(a.a>=a.b.bc()){throw new hli()}return a.b.Db(a.a++)}
function Dhi(){return y$h}
function Ehi(){return this.a<this.b.bc()}
function Fhi(){return Chi(this)}
function xhi(){}
_=xhi.prototype=new xdi();_.gC=Dhi;_.Eb=Ehi;_.ac=Fhi;_.tI=0;_.a=0;_.b=null;function bii(b,a){b.b=a;return b}
function dii(){return z$h}
function aii(){}
_=aii.prototype=new xhi();_.gC=dii;_.tI=0;function Bii(b,a){var c;c=Dki(this,b);yki(c.d,a,c.b);++c.a;c.c=null}
function Dii(c){var a,d;d=Dki(this,c);try{return nki(d)}catch(a){a=gai(a);if(s9h(a,17)){throw ddi(new cdi(),Blh+c)}else throw a}}
function Cii(){return D$h}
function Eii(){return bii(new aii(),this)}
function zii(){}
_=zii.prototype=new whi();_.ub=Bii;_.Db=Dii;_.gC=Cii;_.Fb=Eii;_.tI=26;function fji(a){a.a=e9h(C_h,47,0,0,0);a.b=0;return a}
function gji(b,a){h9h(b.a,b.b++,a);return true}
function iji(b,a){hii(a,b.b);return b.a[a]}
function jji(c,b,a){for(;a<c.b;++a){if(pli(b,c.a[a])){return a}}return -1}
function lji(d,c){var a,b;a=jji(d,c,0);if(a==-1){return false}b=(hii(a,d.b),d.a[a]);d.a.splice(a,1);--d.b;return true}
function nji(a){return h9h(this.a,this.b++,a),true}
function mji(a,b){if(a<0||a>this.b){lii(a,this.b)}this.a.splice(a,0,b);++this.b}
function oji(a){return jji(this,a,0)!=-1}
function qji(a){return hii(a,this.b),this.a[a]}
function pji(){return F$h}
function rji(){return this.b}
function eji(){}
_=eji.prototype=new whi();_.vb=nji;_.ub=mji;_.wb=oji;_.Db=qji;_.gC=pji;_.bc=rji;_.tI=27;_.a=null;_.b=0;function wji(f,b){var a,c,d,e;c=0;a=f.length-1;while(c<=a){d=c+(a-c>>1);e=f[d];if(e<b){c=d+1}else if(e>b){a=d-1}else{return d}}return -c-1}
function xji(h,d,a){var b,c,e,f,g;if(!a){a=(Eji(),Fji)}e=0;c=h.length-1;while(e<=c){f=e+(c-e>>1);g=h[f];b=g.cT(d);if(b<0){e=f+1}else if(b>0){c=f-1}else{return f}}return -e-1}
function Eji(){Eji=v0i;Fji=new Bji()}
var Fji;function Dji(){return a_h}
function Bji(){}
_=Bji.prototype=new xdi();_.gC=Dji;_.tI=0;function cki(a){mhi(a);return a}
function eki(a,b){return (a==null?null:a)===(b==null?null:b)||a!=null&&s8h(a,b)}
function fki(){return b_h}
function bki(){}
_=bki.prototype=new pgi();_.gC=fki;_.tI=28;function xki(a){a.a=ski(new rki());a.b=0;return a}
function yki(c,a,b){tki(new rki(),a,b);++c.b}
function zki(b,a){tki(new rki(),a,b.a);++b.b}
function Aki(a){a.a=ski(new rki());a.b=0}
function Cki(a){Fki(a);return a.a.b.c}
function Dki(d,b){var a,c;if(b<0||b>d.b){lii(b,d.b)}if(b>=d.b>>1){c=d.a;for(a=d.b;a>b;--a){c=c.b}}else{c=d.a.a;for(a=0;a<b;++a){c=c.a}}return kki(new iki(),b,c,d)}
function Eki(b){var a;Fki(b);--b.b;a=b.a.b;a.a.b=a.b;a.b.a=a.a;a.a=a.b=a;return a.c}
function Fki(a){if(a.b==0){throw new hli()}}
function ali(a){tki(new rki(),a,this.a);++this.b;return true}
function bli(){return e_h}
function cli(){return this.b}
function hki(){}
_=hki.prototype=new zii();_.vb=ali;_.gC=bli;_.bc=cli;_.tI=29;_.a=null;_.b=0;function kki(d,a,b,c){d.d=c;d.b=b;d.a=a;return d}
function nki(a){if(a.b==a.d.a){throw new hli()}a.c=a.b;a.b=a.b.a;++a.a;return a.c.c}
function oki(){return c_h}
function pki(){return this.b!=this.d.a}
function qki(){return nki(this)}
function iki(){}
_=iki.prototype=new xdi();_.gC=oki;_.Eb=pki;_.ac=qki;_.tI=0;_.a=0;_.b=null;_.c=null;_.d=null;function ski(a){a.a=a.b=a;return a}
function tki(b,c,a){b.c=c;b.a=a;b.b=a.b;a.b.a=b;a.b=b;return b}
function wki(){return d_h}
function rki(){}
_=rki.prototype=new xdi();_.gC=wki;_.tI=0;_.a=null;_.b=null;_.c=null;function jli(){return f_h}
function hli(){}
_=hli.prototype=new Ddi();_.gC=jli;_.tI=30;function pli(a,b){return (a==null?null:a)===(b==null?null:b)||a!=null&&s8h(a,b)}
function sli(){sli=v0i;tli=rli(new qli(),kph,0);rli(new qli(),zsh,1);rli(new qli(),jwh,2);rli(new qli(),yzh,3);rli(new qli(),hDh,4)}
function rli(c,a,b){sli();c.a=a;c.b=b;return c}
function uli(){return g_h}
function qli(){}
_=qli.prototype=new tci();_.gC=uli;_.tI=31;var tli;function xli(){xli=v0i;Ali=wli(new vli(),wGh,0);yli=wli(new vli(),fKh,1);zli=wli(new vli(),lLh,2)}
function wli(c,a,b){xli();c.a=a;c.b=b;return c}
function Bli(){return h_h}
function vli(){}
_=vli.prototype=new tci();_.gC=Bli;_.tI=32;var yli,zli,Ali;function Fli(){Fli=v0i;ami=Eli(new Dli(),wLh,0);cmi=Eli(new Dli(),bMh,1);bmi=Eli(new Dli(),mMh,2)}
function Eli(c,a,b){Fli();c.a=a;c.b=b;return c}
function dmi(){return i_h}
function Dli(){}
_=Dli.prototype=new tci();_.gC=dmi;_.tI=33;var ami,bmi,cmi;function CYi(){CYi=v0i;l0i=lfi(xMh);k0i=f9h(D_h,48,1,[dNh,oNh,zNh,eOh,pOh,AOh]);m0i=f9h(D_h,48,1,[fPh,qPh,BPh,gQh,sQh,DQh,iRh,tRh,ERh,jSh,uSh,FSh,kTh,vTh,bUh,mUh,xUh,cVh,nVh,yVh,dWh,oWh,zWh,eXh,qXh,BXh,gYh,rYh,CYh,hZh,sZh,DZh,i0h,t0h,F0h,k1h,v1h,a2h,l2h,w2h,b3h,m3h,x3h,c4h,o4h,z4h,e5h,p5h,A5h,f6h,q6h,B6h,g7h,r7h,Cqg])}
function eYi(d,a){var b,c;c=d.g+1;if(c>d.f.length){b=e9h(A_h,42,-1,c,1);Afi(d.f,0,b,0,d.g);d.f=b}d.f[d.g]=a;d.g=c}
function fYi(c,a){var b;FUi(a,c,c.u);if(c.j>=1){b=c.y[1];if(b.c==3){lmi(c,b.e,a)}}}
function gYi(u,m){var a,b,c,d,e,f,g,h,i,j,k,l,n,o,p,q;rZi(u);for(;;){f=u.s;while(f>-1){l=u.r[f];if(!l){f=-1;break}else if(l.d==m){break}--f}if(f==-1){return}e=u.r[f];g=u.j;j=true;while(g>-1){o=u.y[g];if(o==e){break}else if(o.i){j=false}--g}if(g==-1){c0i(u,f);return}if(!j){return}i=g+1;while(i<=u.j){o=u.y[i];if(o.i||o.j){break}++i}if(i>u.j){while(u.j>=g){EZi(u)}c0i(u,f);return}c=u.y[g-1];h=u.y[i];a=f;q=i;k=h;for(;;){--q;o=u.y[q];p=iZi(u,o);if(p==-1){d0i(u,q);--i;continue}if(q==g){break}if(q==i){a=p+1}b=smi(u,hrg,o.d,xUi(o.a));n=CVi(new AVi(),o.c,o.f,o.d,b,o.i,o.j,o.b,o.g,o.a);o.a=null;u.y[q]=n;++n.h;u.r[p]=n;--o.h;--o.h;o=n;vmi(u,k.e);qmi(u,k.e,o.e);k=o}if(c.b){vmi(u,k.e);wZi(u,k.e)}else{vmi(u,k.e);qmi(u,k.e,c.e)}b=smi(u,hrg,e.d,xUi(e.a));d=CVi(new AVi(),e.c,e.f,e.d,b,e.i,e.j,e.b,e.g,e.a);e.a=null;nmi(u,h.e,b);qmi(u,b,h.e);c0i(u,f);xZi(u,d,a);d0i(u,g);yZi(u,d,i)}}
function vYi(c,b){var a;++c.s;if(c.s==c.r.length){a=e9h(aai,51,11,c.r.length+64,0);Afi(c.r,0,a,0,c.r.length);c.r=a}c.r[c.s]=b}
function hYi(d,a){var b,c;FUi(a,d,d.u);b=umi(d,a);c=DVi(new AVi(),hrg,(wHi(),gNi),b);a0i(d,c)}
function nYi(f,e,b,a){var c,d;rZi(f);FUi(a,f,f.u);c=smi(f,e,b.e,a);qmi(f,c,f.y[f.j].e);d=DVi(new AVi(),e,b,c);a0i(f,d)}
function lYi(h,f,c,a){var b,d,e,g;rZi(h);g=c.e;FUi(a,h,h.u);if(c.b){g=zYi(h,g)}d=smi(h,f,g,a);b=h.y[h.j];if(b.b){wZi(h,d)}else{qmi(h,d,b.e)}e=EVi(new AVi(),f,c,d,g);a0i(h,e)}
function mYi(g,f,c,a){var b,d,e;rZi(g);FUi(a,g,g.u);d=tmi(g,f,c.e,a);b=g.y[g.j];if(b.b){wZi(g,d)}else{qmi(g,d,b.e)}e=DVi(new AVi(),f,c,d);a0i(g,e)}
function jYi(h,f,c,a){var b,d,e,g;rZi(h);g=c.a;FUi(a,h,h.u);if(c.b){g=zYi(h,g)}d=smi(h,f,g,a);b=h.y[h.j];if(b.b){wZi(h,d)}else{qmi(h,d,b.e)}e=FVi(new AVi(),f,c,d,g,(wHi(),qMi)==c);a0i(h,e)}
function kYi(h,f,c,a){var b,d,e,g;rZi(h);g=c.e;FUi(a,h,h.u);if(c.b){g=zYi(h,g)}d=smi(h,f,g,a);b=h.y[h.j];if(b.b){wZi(h,d)}else{qmi(h,d,b.e)}e=FVi(new AVi(),f,c,d,g,false);a0i(h,e)}
function oYi(e,a){var b,c,d;rZi(e);FUi(a,e,e.u);c=smi(e,hrg,srg,a);e.m=c;b=e.y[e.j];if(b.b){wZi(e,c)}else{qmi(e,c,b.e)}d=DVi(new AVi(),hrg,(wHi(),rMi),c);a0i(e,d)}
function pYi(g,f,c,a){var b,d,e;rZi(g);FUi(a,g,g.u);d=smi(g,f,c.e,a);b=g.y[g.j];if(b.b){wZi(g,d)}else{qmi(g,d,b.e)}e=aWi(new AVi(),f,c,d,xUi(a));a0i(g,e);vYi(g,e);++e.h}
function qYi(d,a){var b,c;rZi(d);FUi(a,d,d.u);b=smi(d,hrg,Drg,a);qmi(d,b,d.y[d.j].e);d.o=b;c=DVi(new AVi(),hrg,(wHi(),cNi),b);a0i(d,c)}
function sYi(f,e,d,a){var b,c;rZi(f);FUi(a,f,f.u);c=tmi(f,e,d,a);b=f.y[f.j];if(b.b){wZi(f,c)}else{qmi(f,c,b.e)}wmi(f,e,d,c)}
function tYi(g,e,c,a){var b,d,f;rZi(g);f=c.e;FUi(a,g,g.u);if(c.b){f=zYi(g,f)}d=smi(g,e,f,a);b=g.y[g.j];if(b.b){wZi(g,d)}else{qmi(g,d,b.e)}wmi(g,e,f,d)}
function rYi(g,e,c,a){var b,d,f;rZi(g);f=c.a;FUi(a,g,g.u);if(c.b){f=zYi(g,f)}d=smi(g,e,f,a);b=g.y[g.j];if(b.b){wZi(g,d)}else{qmi(g,d,b.e)}wmi(g,e,f,d)}
function wYi(b){var a;for(a=0;a<b.g;++a){switch(b.f[a]){case 32:case 9:case 10:case 12:continue;default:return true;}}return false}
function xYi(p,a,o,e){var c,d;if(p.v){if(a[o]==10){++o;--e;if(e==0){return}}p.v=false}switch(p.t){case 6:case 12:case 8:b0i(p);case 20:pHi(p,a,o,e);return;default:c=o+e;b:for(d=o;d<c;++d){switch(a[d]){case 32:case 9:case 10:case 12:switch(p.t){case 0:case 1:case 2:o=d+1;continue;case 21:case 3:case 4:case 5:case 9:case 16:case 17:continue;case 6:case 12:case 8:if(o<d){pHi(p,a,o,d-o);o=d}b0i(p);break b;case 7:case 10:case 11:b0i(p);eYi(p,a[d]);o=d+1;continue;case 15:if(o<d){pHi(p,a,o,d-o);o=d}b0i(p);continue;case 18:case 19:if(o<d){pHi(p,a,o,d-o);o=d}b0i(p);continue;}default:switch(p.t){case 0:aZi(p,(xli(),zli));p.t=1;--d;continue;case 1:hYi(p,AWi(p.z));p.t=2;--d;continue;case 2:if(o<d){pHi(p,a,o,d-o);o=d}qYi(p,(wUi(),bVi));p.t=3;--d;continue;case 3:if(o<d){pHi(p,a,o,d-o);o=d}EZi(p);p.t=5;--d;continue;case 4:if(o<d){pHi(p,a,o,d-o);o=d}EZi(p);p.t=3;--d;continue;case 5:if(o<d){pHi(p,a,o,d-o);o=d}nYi(p,hrg,(wHi(),cJi),AWi(p.z));p.t=21;--d;continue;case 21:p.t=6;--d;continue;case 6:case 12:case 8:if(o<d){pHi(p,a,o,d-o);o=d}b0i(p);break b;case 7:case 10:case 11:b0i(p);eYi(p,a[d]);o=d+1;continue;case 9:if(o<d){pHi(p,a,o,d-o);o=d}if(p.j==0){o=d+1;continue}EZi(p);p.t=7;--d;continue;break b;case 15:p.t=6;--d;continue;case 16:if(o<d){pHi(p,a,o,d-o);o=d}o=d+1;continue;case 17:if(o<d){pHi(p,a,o,d-o);o=d}o=d+1;continue;case 18:p.t=6;--d;continue;case 19:p.t=16;--d;continue;}}}if(o<c){pHi(p,a,o,c-o)}}}
function yYi(e,a){var b,c,d;b=EUi(a,(koi(),nsi));d=null;if(b!=null){d=n0i(b)}if(d==null){c=EUi(a,pri);if(c!=null){e.z.jb=true}}else{e.z.jb=true}}
function zYi(b,a){if(pVi(a)){return a}else{switch(b.u.b){case 0:return a;case 2:return mVi(a);case 1:gZi(b,isg+a+tsg);}}return null}
function AYi(e,a){while(e.j>a){EZi(e)}}
function BYi(a){while(a.s>-1){if(!a.r[a.s]){--a.s;return}--a.r[a.s].h;--a.s}}
function DYi(e,a){tZi(e);while(e.j>=a){EZi(e)}BYi(e);e.t=11;return}
function EYi(h,a,g,f){var c,d,e;h.v=false;if(!h.A){return}b:for(;;){switch(h.l){case 0:break b;default:switch(h.t){case 0:case 1:case 18:case 19:omi(h,(c=g+f,mfi(a.length,g,c),ofi(a,g,c)));return;case 15:rZi(h);pmi(h,h.y[0].e,(d=g+f,mfi(a.length,g,d),ofi(a,g,d)));return;default:break b;}}}rZi(h);pmi(h,h.y[h.j].e,(e=g+f,mfi(a.length,g,e),ofi(a,g,e)));return}
function FYi(f,c,d,e,b){f.v=false;a:for(;;){switch(f.l){case 0:break a;default:switch(f.t){case 0:switch(f.k.b){case 0:if(CZi(c,d,e,b)){aZi(f,(xli(),zli))}else if(zZi(d,e)){aZi(f,(xli(),yli))}else{if(efi(zNh,d)&&(e==null||efi(Esg,e))||efi(AOh,d)&&(e==null||efi(jtg,e))||efi(utg,d)&&efi(Ftg,e)||efi(lug,d)&&efi(wug,e)){}else !((e==null||efi(bvg,e))&&d==null);aZi(f,(xli(),Ali))}break;case 2:f.p=true;f.z.A=true;if(CZi(c,d,e,b)){aZi(f,(xli(),zli))}else if(zZi(d,e)){aZi(f,(xli(),yli))}else{if(efi(AOh,d)){!efi(jtg,e)}else{}aZi(f,(xli(),Ali))}break;case 1:f.p=true;f.z.A=true;if(CZi(c,d,e,b)){aZi(f,(xli(),zli))}else if(zZi(d,e)){if(efi(pOh,d)&&e!=null){!efi(mvg,e)}else{}aZi(f,(xli(),yli))}else{aZi(f,(xli(),Ali))}break;case 3:f.p=AZi(d);if(f.p){f.z.A=true}if(CZi(c,d,e,b)){aZi(f,(xli(),zli))}else if(zZi(d,e)){if(efi(pOh,d)){!efi(mvg,e)}else{}aZi(f,(xli(),yli))}else{if(efi(AOh,d)){!efi(jtg,e)}else{}aZi(f,(xli(),Ali))}break;case 4:if(CZi(c,d,e,b)){aZi(f,(xli(),zli))}else if(zZi(d,e)){aZi(f,(xli(),yli))}else{aZi(f,(xli(),Ali))}}f.t=1;return;default:break a;}}}return}
function aZi(b,a){b.x=a==(xli(),zli)}
function bZi(e){var a;a=nZi(e,xvg);if(a==2147483647){return}while(e.j>=a){EZi(e)}f0i(e)}
function cZi(ad,a){var b,d,e,f;ad.v=false;c:for(;;){d=a.d;e=a.e;switch(ad.t){case 11:switch(d){case 37:b=oZi(ad,37);if(b==0){break c}AYi(ad,b);EZi(ad);ad.t=10;break c;case 34:b=oZi(ad,37);if(b==0){break c}AYi(ad,b);EZi(ad);ad.t=10;continue;case 39:if(nZi(ad,e)==2147483647){break c}b=oZi(ad,37);if(b==0){break c}AYi(ad,b);EZi(ad);ad.t=10;continue;break c;}case 10:switch(d){case 39:b=pZi(ad,e);if(b==0){break c}AYi(ad,b);EZi(ad);ad.t=7;break c;case 34:b=lZi(ad);if(b==0){break c}AYi(ad,b);EZi(ad);ad.t=7;continue;break c;}case 7:switch(d){case 34:b=qZi(ad,cwg);if(b==2147483647){break c}while(ad.j>=b){EZi(ad)}f0i(ad);break c;}case 8:switch(d){case 6:b=nZi(ad,nwg);if(b==2147483647){break c}tZi(ad);while(ad.j>=b){EZi(ad)}BYi(ad);ad.t=7;break c;case 34:b=nZi(ad,nwg);if(b==2147483647){break c}tZi(ad);while(ad.j>=b){EZi(ad)}BYi(ad);ad.t=7;continue;break c;}case 12:switch(d){case 40:b=nZi(ad,e);if(b==2147483647){break c}tZi(ad);while(ad.j>=b){EZi(ad)}BYi(ad);ad.t=11;break c;case 34:case 39:case 37:if(nZi(ad,e)==2147483647){break c}DYi(ad,mZi(ad));continue;break c;}case 21:case 6:switch(d){case 3:if(!(ad.j>=1&&ad.y[1].c==3)){break c}ad.t=15;break c;case 23:if(!(ad.j>=1&&ad.y[1].c==3)){break c}ad.t=15;continue;case 50:case 46:case 44:case 61:case 51:b=kZi(ad,e);if(b==2147483647){}else{tZi(ad);while(ad.j>=b){EZi(ad)}}break c;case 9:if(!ad.m){break c}ad.m=null;b=kZi(ad,e);if(b==2147483647){break c}tZi(ad);d0i(ad,b);break c;case 29:b=kZi(ad,ywg);if(b==2147483647){if(ad.l==0){while(ad.y[ad.j].f!=hrg){EZi(ad)}ad.l=1}tYi(ad,hrg,a,(wUi(),bVi));break c}sZi(ad,ywg);while(ad.j>=b){EZi(ad)}break c;case 41:case 15:b=kZi(ad,e);if(b==2147483647){}else{sZi(ad,e);while(ad.j>=b){EZi(ad)}}break c;case 42:b=jZi(ad);if(b==2147483647){}else{tZi(ad);while(ad.j>=b){EZi(ad)}}break c;case 1:case 45:case 64:case 24:gYi(ad,e);break c;case 5:case 63:case 43:b=kZi(ad,e);if(b==2147483647){}else{tZi(ad);while(ad.j>=b){EZi(ad)}BYi(ad)}break c;case 4:if(ad.l==0){while(ad.y[ad.j].f!=hrg){EZi(ad)}ad.l=1}b0i(ad);tYi(ad,hrg,a,(wUi(),bVi));break c;case 49:case 55:case 48:case 12:case 13:case 65:case 22:case 14:case 47:case 60:case 25:case 32:case 34:case 35:break c;case 26:default:if(e==ad.y[ad.j].d){EZi(ad);break c}b=ad.j;for(;;){f=ad.y[b];if(f.d==e){tZi(ad);while(ad.j>=b){EZi(ad)}break c}else if(f.i||f.j){break c}--b}}case 9:switch(d){case 8:if(ad.j==0){break c}EZi(ad);ad.t=7;break c;case 7:break c;default:if(ad.j==0){break c}EZi(ad);ad.t=7;continue;}case 14:switch(d){case 6:case 34:case 39:case 37:case 40:if(nZi(ad,e)!=2147483647){bZi(ad);continue}else{break c}}case 13:switch(d){case 28:if(dxg==ad.y[ad.j].d){EZi(ad);break c}else{break c}case 27:if(dxg==ad.y[ad.j].d&&oxg==ad.y[ad.j-1].d){EZi(ad)}if(oxg==ad.y[ad.j].d){EZi(ad)}else{}break c;case 32:bZi(ad);break c;default:break c;}case 15:switch(d){case 23:if(ad.n){break c}else{ad.t=18;break c}default:ad.t=6;continue;}case 16:switch(d){case 11:if(ad.j==0){break c}EZi(ad);if(!ad.n&&Axg!=ad.y[ad.j].d){ad.t=17}break c;default:break c;}case 17:switch(d){case 23:ad.t=19;break c;default:break c;}case 0:aZi(ad,(xli(),zli));ad.t=1;continue;case 1:hYi(ad,AWi(ad.z));ad.t=2;continue;case 2:switch(d){case 20:case 4:case 23:case 3:qYi(ad,(wUi(),bVi));ad.t=3;continue;default:break c;}case 3:switch(d){case 20:EZi(ad);ad.t=5;break c;case 4:case 23:case 3:EZi(ad);ad.t=5;continue;default:break c;}case 4:switch(d){case 26:EZi(ad);ad.t=3;break c;case 4:EZi(ad);ad.t=3;continue;default:break c;}case 5:switch(d){case 23:case 3:case 4:nYi(ad,hrg,(wHi(),cJi),AWi(ad.z));ad.t=21;continue;default:break c;}case 18:ad.t=6;continue;case 19:ad.t=16;continue;case 20:if(ad.w==5){EZi(ad)}EZi(ad);ad.t=ad.w;break c;}}if(ad.l==0&&!uZi(ad)){ad.l=1}}
function dZi(a){a.m=null;a.o=null;while(a.j>-1){--a.y[a.j].h;--a.j}a.y=null;while(a.s>-1){if(a.r[a.s]){--a.r[a.s].h}--a.s}a.r=null;mhi(a.q);a.f=null}
function eZi(C){var b,c;rZi(C);switch(C.l){case 0:while(C.y[C.j].f!=hrg){DZi(C)}C.l=1;}a:for(;;){switch(C.t){case 0:aZi(C,(xli(),zli));C.t=1;continue;case 1:hYi(C,AWi(C.z));C.t=2;continue;case 2:qYi(C,(wUi(),bVi));C.t=3;continue;case 3:while(C.j>0){DZi(C)}C.t=5;continue;case 4:while(C.j>1){DZi(C)}C.t=3;continue;case 5:nYi(C,hrg,(wHi(),cJi),AWi(C.z));C.t=6;continue;case 9:if(C.j==0){break a}else{DZi(C);C.t=7;continue}case 21:case 8:case 12:case 6:B:for(c=C.j;c>=0;--c){b=C.y[c].c;switch(b){case 41:case 15:case 29:case 39:case 40:case 3:case 23:break;default:break B;}}break a;case 20:if(C.w==5){DZi(C)}DZi(C);C.t=C.w;continue;case 10:case 11:case 7:case 13:case 14:case 16:break a;case 15:case 17:case 18:case 19:default:if(C.j==0){sai((new Date()).getTime())}break a;}}while(C.j>0){DZi(C)}if(!C.n){DZi(C)}}
function fZi(c,a){var b;b=b1i(new F0i(),a.b,c.z,a);throw b}
function gZi(c,a){var b;b=a1i(new F0i(),a,c.z);throw b}
function iZi(c,b){var a;for(a=c.s;a>=0;--a){if(b==c.r[a]){return a}}return -1}
function hZi(d,b){var a,c;for(a=d.s;a>=0;--a){c=d.r[a];if(!c){return -1}else if(c.d==b){return a}}return -1}
function qZi(c,b){var a;for(a=c.j;a>0;--a){if(c.y[a].d==b){return a}}return 2147483647}
function kZi(c,b){var a;for(a=c.j;a>0;--a){if(c.y[a].d==b){return a}else if(c.y[a].i){return 2147483647}}return 2147483647}
function jZi(b){var a;for(a=b.j;a>0;--a){if(b.y[a].c==42){return a}else if(b.y[a].i){return 2147483647}}return 2147483647}
function nZi(c,b){var a;for(a=c.j;a>0;--a){if(c.y[a].d==b){return a}else if(c.y[a].d==cwg){return 2147483647}}return 2147483647}
function lZi(b){var a;for(a=b.j;a>0;--a){if(b.y[a].c==39){return a}}return 0}
function mZi(c){var a,b;for(a=c.j;a>0;--a){b=c.y[a].d;if(fyg==b||qyg==b){return a}else if(b==cwg){return 2147483647}}return 2147483647}
function pZi(c,b){var a;for(a=c.j;a>0;--a){if(c.y[a].d==b){return a}}return 0}
function oZi(c,a){var b;for(b=c.j;b>0;--b){if(c.y[b].c==a){return b}}return 0}
function rZi(e){var a,b,c,d;if(e.g>0){a=e.y[e.j];if(a.b&&wYi(e)){c=oZi(e,34);d=e.y[c];b=d.e;if(c==0){mmi(e,b,xfi(e.f,0,e.g));e.g=0;return}rHi(e,e.f,0,e.g,b,e.y[c-1].e);e.g=0;return}mmi(e,e.y[e.j].e,xfi(e.f,0,e.g));e.g=0}}
function tZi(d){for(;;){switch(d.y[d.j].c){case 29:case 15:case 41:case 28:case 27:case 53:EZi(d);continue;default:return;}}}
function sZi(f,a){var b;for(;;){b=f.y[f.j];switch(b.c){case 29:case 15:case 41:case 28:case 27:case 53:if(b.d==a){return}EZi(f);continue;default:return;}}}
function uZi(b){var a;for(a=b.j;a>0;--a){if(b.y[a].f!=hrg){return true}else if(b.y[a].i){return false}}return false}
function vZi(e){var a;a=kZi(e,ywg);if(a==2147483647){return}sZi(e,ywg);while(e.j>=a){EZi(e)}}
function wZi(e,a){var b,c,d;c=oZi(e,34);d=e.y[c];b=d.e;if(c==0){qmi(e,a,b);return}zmi(e,a,b,e.y[c-1].e)}
function xZi(c,b,a){++b.h;if(a<=c.s){Afi(c.r,a,c.r,a+1,c.s-a+1)}++c.s;c.r[a]=b}
function yZi(c,a,b){if(b==c.j+1){rZi(c);a0i(c,a)}else{Afi(c.y,b,c.y,b+1,c.j-b+1);++c.j;c.y[b]=a}}
function zZi(a,b){if(yVi(Byg,a)){return true}if(yVi(gzg,a)){return true}if(b!=null){if(yVi(rzg,a)){return true}if(yVi(Czg,a)){return true}}return false}
function AZi(a){if(a!=null&&xji(k0i,a,(Eji(),Fji))>-1){return true}return false}
function BZi(c,b){var a;for(a=c.j;a>=0;--a){if(c.y[a]==b){return true}}return false}
function CZi(c,d,e,a){var b;if(a){return true}if(c!=hAg){return true}if(d!=null){for(b=0;b<m0i.length;++b){if(zVi(m0i[b],d)){return true}}if(yVi(sAg,d)||yVi(DAg,d)||yVi(hAg,d)){return true}}if(e==null){if(yVi(rzg,d)){return true}else if(yVi(Czg,d)){return true}}else if(yVi(jBg,e)){return true}return false}
function EZi(b){var a;rZi(b);a=b.y[b.j];--b.j;wmi(b,a.f,a.g,a.e);--a.h}
function DZi(b){var a;rZi(b);a=b.y[b.j];--b.j;wmi(b,a.f,a.g,a.e);--a.h}
function a0i(c,b){var a;++c.j;if(c.j==c.y.length){a=e9h(aai,51,11,c.y.length+64,0);Afi(c.y,0,a,0,c.y.length);c.y=a}c.y[c.j]=b}
function FZi(a){rZi(a);if(!a.o){a0i(a,a.y[a.j])}else{a0i(a,DVi(new AVi(),hrg,(wHi(),cNi),a.o))}}
function b0i(g){var a,b,c,d,e,f;if(g.s==-1){return}f=g.r[g.s];if(!f||BZi(g,f)){return}e=g.s;for(;;){--e;if(e==-1){break}if(!g.r[e]){break}if(BZi(g,g.r[e])){break}}if(e<g.s){rZi(g)}while(e<g.s){++e;c=g.r[e];a=smi(g,hrg,c.d,xUi(c.a));d=CVi(new AVi(),c.c,c.f,c.d,a,c.i,c.j,c.b,c.g,c.a);c.a=null;b=g.y[g.j];if(b.b){wZi(g,a)}else{qmi(g,a,b.e)}a0i(g,d);g.r[e]=d;--c.h;++d.h}}
function c0i(b,a){--b.r[a].h;if(a==b.s){--b.s;return}Afi(b.r,a+1,b.r,a,b.s-a);--b.s}
function d0i(e,d){if(e.j==d){EZi(e)}else{--e.y[d].h;Afi(e.y,d+1,e.y,d,e.j-d);--e.j}}
function e0i(f,a){var e;if(f.y[f.j]==a){EZi(f)}else{e=f.j-1;while(e>=0&&f.y[e]!=a){--e}if(e==-1){return}--a.h;Afi(f.y,e+1,f.y,e,f.j-e);--f.j}}
function f0i(d){var a,b,c;d.l=1;for(a=d.j;a>=0;--a){c=d.y[a];b=c.d;if(a==0){if(d.i==hrg&&(d.h==fyg||d.h==qyg)){d.t=6;return}else{b=d.h}}if(xvg==b){d.t=13;return}else if(fyg==b||qyg==b){d.t=12;return}else if(uBg==b){d.t=11;return}else if(FBg==b||kCg==b||vCg==b){d.t=10;return}else if(nwg==b){d.t=8;return}else if(aDg==b){d.t=9;return}else if(cwg==b){d.t=7;return}else if(hrg!=c.f){d.l=0;d.t=6;return}else if(Drg==b){d.t=6;return}else if(lDg==b){d.t=6;return}else if(Axg==b){d.t=16;return}else if(hAg==b){if(!d.o){d.t=2}else{d.t=5}return}else if(a==0){d.t=6;return}}}
function g0i(b,a){b.h=a;b.i=hrg;b.n=false;b.x=false}
function i0i(wg,i,e,ug){var a,b,c,d,f,g,h,j,k,l,m,p,r,s,t,sg,tg,ae,be;wg.v=false;s=false;vg:for(;;){l=i.d;r=i.e;switch(wg.l){case 0:h=wg.y[wg.j];g=h.f;f=h.c;if(hrg==g||wDg==g&&(56!=l&&57==f||19==l&&58==f)||bEg==g&&(36==f||59==f)){s=true}else{switch(l){case 45:case 50:case 3:case 4:case 52:case 41:case 46:case 48:case 42:case 20:case 22:case 15:case 18:case 24:case 29:case 44:case 34:while(wg.y[wg.j].f!=hrg){EZi(wg)}wg.l=1;continue vg;case 64:if(yUi(e,(koi(),Fri))||yUi(e,Ati)||yUi(e,nDi)){while(wg.y[wg.j].f!=hrg){EZi(wg)}wg.l=1;continue vg}default:if(bEg==g){e.b=2;if(ug){rYi(wg,g,i,e);ug=false}else{jYi(wg,g,i,e)}e=null;break vg}else{e.b=1;if(ug){tYi(wg,g,i,e);ug=false}else{kYi(wg,g,i,e)}e=null;break vg}}}default:switch(wg.t){case 10:switch(l){case 37:AYi(wg,lZi(wg));nYi(wg,hrg,i,e);wg.t=11;e=null;break vg;case 40:AYi(wg,lZi(wg));nYi(wg,hrg,(wHi(),lTi),(wUi(),bVi));wg.t=11;continue;case 6:case 7:case 8:case 39:j=lZi(wg);if(j==0){break vg}else{AYi(wg,j);EZi(wg);wg.t=7;continue}}case 11:switch(l){case 40:AYi(wg,oZi(wg,37));nYi(wg,hrg,i,e);wg.t=12;vYi(wg,null);e=null;break vg;case 6:case 7:case 8:case 39:case 37:j=oZi(wg,37);if(j==0){break vg}AYi(wg,j);EZi(wg);wg.t=10;continue;}case 7:q:for(;;){switch(l){case 6:AYi(wg,oZi(wg,34));vYi(wg,null);nYi(wg,hrg,i,e);wg.t=8;e=null;break vg;case 8:AYi(wg,oZi(wg,34));nYi(wg,hrg,i,e);wg.t=9;e=null;break vg;case 7:AYi(wg,oZi(wg,34));nYi(wg,hrg,(wHi(),uJi),(wUi(),bVi));wg.t=9;continue vg;case 39:AYi(wg,oZi(wg,34));nYi(wg,hrg,i,e);wg.t=10;e=null;break vg;case 37:case 40:AYi(wg,oZi(wg,34));nYi(wg,hrg,(wHi(),ESi),(wUi(),bVi));wg.t=10;continue vg;case 34:j=nZi(wg,r);if(j==2147483647){break vg}tZi(wg);while(wg.j>=j){EZi(wg)}f0i(wg);continue vg;case 31:case 33:nYi(wg,hrg,i,e);wg.w=wg.t;wg.t=20;eXi(wg.z,2,i);e=null;break vg;case 13:if(!yVi(mEg,EUi(e,(koi(),fFi)))){break q}rZi(wg);FUi(e,wg,wg.u);be=tmi(wg,hrg,r,e);ae=wg.y[wg.j];qmi(wg,be,ae.e);wmi(wg,hrg,r,be);ug=false;e=null;break vg;default:break q;}}case 8:switch(l){case 6:case 7:case 8:case 39:case 37:case 40:j=nZi(wg,nwg);if(j==2147483647){break vg}tZi(wg);while(wg.j>=j){EZi(wg)}BYi(wg);wg.t=7;continue;}case 12:switch(l){case 6:case 7:case 8:case 39:case 37:case 40:j=mZi(wg);if(j==2147483647){break vg}else{DYi(wg,j);continue}}case 21:switch(l){case 11:if(wg.t==21){if(wg.j==0||wg.y[1].c!=3){break vg}else{vmi(wg,wg.y[1].e);while(wg.j>0){EZi(wg)}nYi(wg,hrg,i,e);wg.t=16;e=null;break vg}}else{break vg}case 44:case 15:case 41:case 5:case 43:case 63:case 34:case 49:case 4:case 48:case 13:case 65:case 22:case 35:case 38:case 47:case 32:if(wg.t==21){wg.t=6}}case 6:n:for(;;){switch(l){case 23:FUi(e,wg,wg.u);lmi(wg,wg.y[0].e,e);e=null;break vg;case 2:case 16:case 18:case 33:case 31:case 36:case 54:break n;case 3:fYi(wg,e);e=null;break vg;case 29:case 50:case 46:case 51:vZi(wg);lYi(wg,hrg,i,e);e=null;break vg;case 42:vZi(wg);if(wg.y[wg.j].c==42){EZi(wg)}lYi(wg,hrg,i,e);e=null;break vg;case 61:vZi(wg);mYi(wg,hrg,i,e);e=null;break vg;case 44:vZi(wg);lYi(wg,hrg,i,e);wg.v=true;e=null;break vg;case 9:if(wg.m){break vg}else{vZi(wg);oYi(wg,e);e=null;break vg}case 15:case 41:j=wg.j;for(;;){t=wg.y[j];if(t.c==l){sZi(wg,t.d);while(wg.j>=j){EZi(wg)}break}else if(t.i||t.j&&t.d!=ywg&&t.d!=yEg&&t.d!=dFg){break}--j}vZi(wg);lYi(wg,hrg,i,e);e=null;break vg;case 30:vZi(wg);lYi(wg,hrg,i,e);eXi(wg.z,3,i);e=null;break vg;case 1:c=hZi(wg,oFg);if(c!=-1){b=wg.r[c];++b.h;gYi(wg,oFg);e0i(wg,b);c=iZi(wg,b);if(c!=-1){c0i(wg,c)}--b.h}b0i(wg);pYi(wg,hrg,i,e);e=null;break vg;case 45:case 64:b0i(wg);pYi(wg,hrg,i,e);e=null;break vg;case 24:b0i(wg);if(2147483647!=kZi(wg,zFg)){gYi(wg,zFg)}pYi(wg,hrg,i,e);e=null;break vg;case 5:j=kZi(wg,r);if(j!=2147483647){tZi(wg);while(wg.j>=j){EZi(wg)}BYi(wg);continue vg}else{b0i(wg);mYi(wg,hrg,i,e);vYi(wg,null);e=null;break vg}case 63:b0i(wg);mYi(wg,hrg,i,e);vYi(wg,null);e=null;break vg;case 43:b0i(wg);lYi(wg,hrg,i,e);vYi(wg,null);e=null;break vg;case 38:b0i(wg);lYi(wg,hrg,i,e);wg.w=wg.t;wg.t=20;eXi(wg.z,2,i);e=null;break vg;case 34:if(!wg.x){vZi(wg)}lYi(wg,hrg,i,e);wg.t=7;e=null;break vg;case 4:case 48:case 49:b0i(wg);case 55:tYi(wg,hrg,i,e);ug=false;e=null;break vg;case 22:vZi(wg);tYi(wg,hrg,i,e);ug=false;e=null;break vg;case 12:i=(wHi(),nNi);continue vg;case 65:case 13:b0i(wg);sYi(wg,hrg,r,e);ug=false;e=null;break vg;case 14:if(wg.m){break vg}vZi(wg);k=sUi(new rUi(),0);a=AUi(e,(koi(),zoi));if(a>-1){tUi(k,zoi,DUi(e,a),(Fli(),ami))}oYi(wg,k);tYi(wg,hrg,(wHi(),fNi),(wUi(),bVi));lYi(wg,hrg,AQi,bVi);lYi(wg,hrg,BNi,bVi);tg=AUi(e,wBi);if(tg>-1){sg=lfi(DUi(e,tg));mmi(wg,wg.y[wg.j].e,xfi(sg,0,sg.length))}else{mmi(wg,wg.y[wg.j].e,xfi(l0i,0,l0i.length))}p=sUi(new rUi(),0);tUi(p,yxi,eGg,(Fli(),ami));for(m=0;m<e.a;++m){d=zUi(e,m);if(yxi==d||wBi==d){}else if(zoi!=d){tUi(p,d,DUi(e,m),ami)}}uUi(e);sYi(wg,hrg,pGg,p);EZi(wg);EZi(wg);tYi(wg,hrg,fNi,bVi);EZi(wg);ug=false;e=null;break vg;case 35:mYi(wg,hrg,i,e);eXi(wg.z,1,i);wg.w=wg.t;wg.t=20;wg.v=true;e=null;break vg;case 26:{b0i(wg);lYi(wg,hrg,i,e);e=null;break vg}case 25:case 47:case 60:lYi(wg,hrg,i,e);wg.w=wg.t;wg.t=20;eXi(wg.z,2,i);e=null;break vg;case 32:b0i(wg);mYi(wg,hrg,i,e);switch(wg.t){case 7:case 8:case 9:case 10:case 11:case 12:wg.t=14;break;default:wg.t=13;}e=null;break vg;case 27:case 28:if(kZi(wg,dxg)!=2147483647){rg:for(;;){if(dxg==wg.y[wg.j].d){EZi(wg);break rg}j=wg.j;for(;;){if(wg.y[j].d==dxg){tZi(wg);while(wg.j>=j){EZi(wg)}break rg}--j}}}b0i(wg);lYi(wg,hrg,i,e);e=null;break vg;case 53:j=kZi(wg,AGg);if(j!=2147483647){tZi(wg)}if(j!=wg.j){while(wg.j>j){EZi(wg)}}lYi(wg,hrg,i,e);e=null;break vg;case 17:b0i(wg);e.b=1;if(ug){tYi(wg,wDg,i,e);ug=false}else{lYi(wg,wDg,i,e);wg.l=0}e=null;break vg;case 19:b0i(wg);e.b=2;if(ug){rYi(wg,bEg,i,e);ug=false}else{lYi(wg,bEg,i,e);wg.l=0}e=null;break vg;case 6:case 7:case 8:case 39:case 37:case 40:case 10:case 11:case 20:break vg;case 62:b0i(wg);mYi(wg,hrg,i,e);e=null;break vg;default:b0i(wg);lYi(wg,hrg,i,e);e=null;break vg;}}case 3:o:for(;;){switch(l){case 23:FUi(e,wg,wg.u);lmi(wg,wg.y[0].e,e);e=null;break vg;case 2:case 54:tYi(wg,hrg,i,e);ug=false;e=null;break vg;case 18:case 16:break o;case 36:lYi(wg,hrg,i,e);wg.w=wg.t;wg.t=20;eXi(wg.z,1,i);e=null;break vg;case 26:{lYi(wg,hrg,i,e);wg.t=4}e=null;break vg;case 31:case 33:case 25:lYi(wg,hrg,i,e);wg.w=wg.t;wg.t=20;eXi(wg.z,2,i);e=null;break vg;case 20:break vg;default:EZi(wg);wg.t=5;continue vg;}}case 4:switch(l){case 23:FUi(e,wg,wg.u);lmi(wg,wg.y[0].e,e);e=null;break vg;case 16:tYi(wg,hrg,i,e);ug=false;e=null;break vg;case 18:yYi(wg,e);tYi(wg,hrg,i,e);ug=false;e=null;break vg;case 33:case 25:nYi(wg,hrg,i,e);wg.w=wg.t;wg.t=20;eXi(wg.z,2,i);e=null;break vg;case 20:break vg;case 26:break vg;default:EZi(wg);wg.t=3;continue;}case 9:switch(l){case 23:FUi(e,wg,wg.u);lmi(wg,wg.y[0].e,e);e=null;break vg;case 7:tYi(wg,hrg,i,e);ug=false;e=null;break vg;default:if(wg.j==0){break vg}EZi(wg);wg.t=7;continue;}case 14:switch(l){case 6:case 39:case 37:case 40:case 34:bZi(wg);continue;}case 13:switch(l){case 23:FUi(e,wg,wg.u);lmi(wg,wg.y[0].e,e);e=null;break vg;case 28:if(dxg==wg.y[wg.j].d){EZi(wg)}nYi(wg,hrg,i,e);e=null;break vg;case 27:if(dxg==wg.y[wg.j].d){EZi(wg)}if(oxg==wg.y[wg.j].d){EZi(wg)}nYi(wg,hrg,i,e);e=null;break vg;case 32:j=nZi(wg,r);if(j==2147483647){break vg}else{while(wg.j>=j){EZi(wg)}f0i(wg);break vg}case 13:case 35:bZi(wg);continue;case 31:lYi(wg,hrg,i,e);wg.w=wg.t;wg.t=20;eXi(wg.z,2,i);e=null;break vg;default:break vg;}case 15:switch(l){case 23:FUi(e,wg,wg.u);lmi(wg,wg.y[0].e,e);e=null;break vg;default:wg.t=6;continue;}case 16:switch(l){case 11:nYi(wg,hrg,i,e);e=null;break vg;case 10:tYi(wg,hrg,i,e);ug=false;e=null;break vg;}case 17:switch(l){case 23:FUi(e,wg,wg.u);lmi(wg,wg.y[0].e,e);e=null;break vg;case 25:nYi(wg,hrg,i,e);wg.w=wg.t;wg.t=20;eXi(wg.z,2,i);e=null;break vg;default:break vg;}case 0:aZi(wg,(xli(),zli));wg.t=1;continue;case 1:switch(l){case 23:if(e==(wUi(),bVi)){hYi(wg,AWi(wg.z))}else{hYi(wg,e)}wg.t=2;e=null;break vg;default:hYi(wg,AWi(wg.z));wg.t=2;continue;}case 2:switch(l){case 23:FUi(e,wg,wg.u);lmi(wg,wg.y[0].e,e);e=null;break vg;case 20:qYi(wg,e);wg.t=3;e=null;break vg;default:qYi(wg,(wUi(),bVi));wg.t=3;continue;}case 5:switch(l){case 23:FUi(e,wg,wg.u);lmi(wg,wg.y[0].e,e);e=null;break vg;case 3:if(e.a==0){nYi(wg,hrg,(wHi(),cJi),AWi(wg.z))}else{nYi(wg,hrg,(wHi(),cJi),e)}wg.t=21;e=null;break vg;case 11:nYi(wg,hrg,i,e);wg.t=16;e=null;break vg;case 2:FZi(wg);tYi(wg,hrg,i,e);ug=false;EZi(wg);e=null;break vg;case 16:FZi(wg);tYi(wg,hrg,i,e);ug=false;EZi(wg);e=null;break vg;case 18:yYi(wg,e);FZi(wg);tYi(wg,hrg,i,e);ug=false;EZi(wg);e=null;break vg;case 31:FZi(wg);nYi(wg,hrg,i,e);wg.w=wg.t;wg.t=20;eXi(wg.z,2,i);e=null;break vg;case 33:case 25:FZi(wg);nYi(wg,hrg,i,e);wg.w=wg.t;wg.t=20;eXi(wg.z,2,i);e=null;break vg;case 36:FZi(wg);nYi(wg,hrg,i,e);wg.w=wg.t;wg.t=20;eXi(wg.z,1,i);e=null;break vg;case 20:break vg;default:nYi(wg,hrg,(wHi(),cJi),AWi(wg.z));wg.t=21;continue;}case 18:switch(l){case 23:FUi(e,wg,wg.u);lmi(wg,wg.y[0].e,e);e=null;break vg;default:wg.t=6;continue;}case 19:switch(l){case 25:lYi(wg,hrg,i,e);wg.w=wg.t;wg.t=20;eXi(wg.z,2,i);e=null;break vg;default:break vg;}}}}if(s&&wg.l==0&&!uZi(wg)){wg.l=1}e!=(wUi(),bVi)}
function j0i(d,c){var a,b;d.z=c;d.y=e9h(aai,51,11,64,0);d.r=e9h(aai,51,11,64,0);d.v=false;d.w=0;d.j=-1;d.s=-1;d.m=null;d.o=null;d.p=false;mhi(d.q);d.A=d.A;d.d=null;d.b=null;d.c=false;d.g=0;d.f=e9h(A_h,42,-1,1024,1);if(d.n){a=umi(d,AWi(d.z));b=DVi(new AVi(),hrg,(wHi(),gNi),a);++d.j;d.y[d.j]=b;f0i(d);if(fHg==d.h||qHg==d.h){dXi(d.z,1)}else if(BHg==d.h||hIg==d.h||sIg==d.h||DIg==d.h||iJg==d.h||tJg==d.h){dXi(d.z,2)}else if(EJg==d.h){dXi(d.z,3)}else{dXi(d.z,0)}d.h=null}else{d.t=0;d.l=1}}
function n0i(a){var b,c,d,e,g,h,o;e=0;o=-1;g=-1;b=lfi(a);f:for(h=0;h<b.length;++h){c=b[h];switch(e){case 0:switch(c){case 99:case 67:e=1;continue;default:continue;}case 1:switch(c){case 104:case 72:e=2;continue;default:e=0;continue;}case 2:switch(c){case 97:case 65:e=3;continue;default:e=0;continue;}case 3:switch(c){case 114:case 82:e=4;continue;default:e=0;continue;}case 4:switch(c){case 115:case 83:e=5;continue;default:e=0;continue;}case 5:switch(c){case 101:case 69:e=6;continue;default:e=0;continue;}case 6:switch(c){case 116:case 84:e=7;continue;default:e=0;continue;}case 7:switch(c){case 9:case 10:case 12:case 13:case 32:continue;case 61:e=8;continue;default:return null;}case 8:switch(c){case 9:case 10:case 12:case 13:case 32:continue;case 39:o=h+1;e=9;continue;case 34:o=h+1;e=10;continue;default:o=h;e=11;continue;}case 9:switch(c){case 39:g=h;break f;default:continue;}case 10:switch(c){case 34:g=h;break f;default:continue;}case 11:switch(c){case 9:case 10:case 12:case 13:case 32:case 59:g=h;break f;default:continue;}}}d=null;if(o!=-1){if(g==-1){g=b.length}d=xfi(b,o,g-o)}return d}
function o0i(){return w_h}
function bYi(){}
_=bYi.prototype=new xdi();_.gC=o0i;_.tI=0;_.f=null;_.g=0;_.h=null;_.i=null;_.j=-1;_.l=1;_.m=null;_.n=false;_.o=null;_.p=false;_.r=null;_.s=-1;_.t=0;_.v=false;_.w=0;_.x=false;_.y=null;_.z=null;_.A=false;var k0i,l0i,m0i;function qHi(){qHi=v0i;CYi()}
function pHi(f,a,e,b){var c,d;d=f.g+b;if(d>f.f.length){c=e9h(A_h,42,-1,d,1);Afi(f.f,0,c,0,f.g);f.f=c}Afi(a,e,f.f,f.g,b);f.g=d}
function rHi(g,a,e,c,f,d){var b;ymi(g,(b=e+c,mfi(a.length,e,b),ofi(a,e,b)),f,d)}
function sHi(){return p_h}
function oHi(){}
_=oHi.prototype=new bYi();_.gC=sHi;_.tI=0;function rmi(){rmi=v0i;qHi()}
function kmi(b,a){rmi();b.k=(sli(),tli);b.u=(Fli(),bmi);b.q=cki(new bki());b.n=false;b.e=xki(new hki());b.a=a;jni(a);return b}
function lmi(h,e,c){var a,d,f,g,i;try{for(f=0;f<c.a;++f){g=BUi(c,f);i=CUi(c,f);if(!e.hasAttributeNS(i,g)){e.setAttributeNS(i,g,DUi(c,f))}}}catch(a){a=gai(a);if(s9h(a,19)){d=a;fZi(h,d)}else throw a}}
function mmi(f,d,e){var a,c;try{if(d==f.b){f.d.appendChild(f.a.createTextNode(e))}d.appendChild(f.a.createTextNode(e))}catch(a){a=gai(a);if(s9h(a,19)){c=a;fZi(f,c)}else throw a}}
function nmi(f,e,d){var a,c;try{while(e.hasChildNodes()){d.appendChild(e.firstChild)}}catch(a){a=gai(a);if(s9h(a,19)){c=a;fZi(f,c)}else throw a}}
function pmi(f,e,c){var a,d;try{if(e==f.b){f.d.appendChild(f.a.createComment(c))}e.appendChild(f.a.createComment(c))}catch(a){a=gai(a);if(s9h(a,19)){d=a;fZi(f,d)}else throw a}}
function omi(e,c){var a,d;try{e.a.appendChild(e.a.createComment(c))}catch(a){a=gai(a);if(s9h(a,19)){d=a;fZi(e,d)}else throw a}}
function qmi(f,c,e){var a,d;try{if(e==f.b){f.d.appendChild(c.cloneNode(true))}e.appendChild(c)}catch(a){a=gai(a);if(s9h(a,19)){d=a;fZi(f,d)}else throw a}}
function smi(i,g,f,c){var a,d,e,h;try{h=i.a.createElementNS(g,f);for(e=0;e<c.a;++e){h.setAttributeNS(CUi(c,e),BUi(c,e),DUi(c,e))}if(hIg==f){if(i.b){zki(i.e,gmi(new fmi(),i.d,i.b))}i.d=h;i.b=i.a.createElementNS(jKg,hIg);h=i.b;for(e=0;e<c.a;++e){h.setAttributeNS(CUi(c,e),BUi(c,e),DUi(c,e))}}return h}catch(a){a=gai(a);if(s9h(a,19)){d=a;fZi(i,d);throw Edi(new Ddi(),uKg)}else throw a}}
function tmi(h,f,e,c){var a,d,g;try{g=smi(h,f,e,c);return g}catch(a){a=gai(a);if(s9h(a,19)){d=a;fZi(h,d);return null}else throw a}}
function umi(g,c){var a,d,e,f;try{f=g.a.createElementNS(hrg,hAg);for(e=0;e<c.a;++e){f.setAttributeNS(CUi(c,e),BUi(c,e),DUi(c,e))}g.a.appendChild(f);return f}catch(a){a=gai(a);if(s9h(a,19)){d=a;fZi(g,d);throw Edi(new Ddi(),uKg)}else throw a}}
function vmi(f,d){var a,c,e;try{e=d.parentNode;if(e){e.removeChild(d)}}catch(a){a=gai(a);if(s9h(a,19)){c=a;fZi(f,c)}else throw a}}
function wmi(d,c,a,b){if(b==d.b){d.c=true;d.z.jb=true}__elementPopped__(c,a,b)}
function xmi(b){var a;a=b.a;b.a=null;return a}
function ymi(i,h,g,f){var a,c,d,e;try{c=i.a.createTextNode(h);e=g.parentNode;if(!!e&&e.nodeType==1){e.insertBefore(c,g)}else{f.appendChild(c)}}catch(a){a=gai(a);if(s9h(a,19)){d=a;fZi(i,d)}else throw a}}
function zmi(h,c,g,f){var a,d,e;e=g.parentNode;try{if(!!e&&e.nodeType==1){e.insertBefore(c,g)}else{f.appendChild(c)}}catch(a){a=gai(a);if(s9h(a,19)){d=a;fZi(h,d)}else throw a}}
function Ami(b){var a;if(b.c){b.c=false;lni(b.b,b.d);if(b.e.b==0){b.d=null;b.b=null}else{a=p9h(Eki(b.e),20);b.d=a.b;b.b=a.a}}}
function cni(){return k_h}
function jni(d){if(!d.createElementNS){d.createElementNS=function(c,a){if(hrg==c){return d.createElement(a)}else if(wDg==c){if(!d.mathplayerinitialized){var b=document.createElement(FKg);b.setAttribute(kLg,wLg);b.setAttribute(bMg,mMg);document.getElementsByTagName(Drg)[0].appendChild(b);document.namespaces.add(xMg,wDg,cNg);d.mathplayerinitialized=true}return d.createElement(nNg+a)}else if(bEg==c){if(!d.renesisinitialized){var b=document.createElement(FKg);b.setAttribute(kLg,yNg);b.setAttribute(bMg,dOg);document.getElementsByTagName(Drg)[0].appendChild(b);document.namespaces.add(oOg,bEg,zOg);d.renesisinitialized=true}return d.createElement(fPg+a)}else{}}}}
function lni(b,a){b.parentNode.replaceChild(a,b);__elementPopped__(cNh,a.nodeName,a)}
function emi(){}
_=emi.prototype=new oHi();_.gC=cni;_.tI=0;_.a=null;_.b=null;_.c=false;_.d=null;function gmi(c,b,a){c.b=b;c.a=a;return c}
function imi(){return j_h}
function fmi(){}
_=fmi.prototype=new xdi();_.gC=imi;_.tI=34;_.a=null;_.b=null;function Ani(b,a){b.b=tei(new rei());b.a=xki(new hki());b.c=kmi(new emi(),a);b.i=fUi(new dUi(),b.c);b.c.u=(Fli(),bmi);b.i.p=bmi;b.i.e=bmi;b.i.t=bmi;b.i.db=bmi;hXi(b.i,bmi);return b}
function Cni(i,h,a){i.f=a;g0i(i.c,null);i.e=false;i.d=false;yei(i.b,0);i.h=h.length;i.g=q0i(new p0i(),lfi(h),0,i.h<512?i.h:512);Aki(i.a);zki(i.a,i.g);g0i(i.c,null);iXi(i.i);Dni(i)}
function Dni(e){var a,b,c,d,f;if(e.d){BWi(e.i);xmi(e.c);e.f.a();return}b=e.b.c;if(b>0){c=e9h(A_h,42,-1,b,1);wei(e.b,0,b,c,0);zki(e.a,q0i(new p0i(),c,0,b));yei(e.b,0)}for(;;){a=p9h(Cki(e.a),21);if(a.c>=a.b){if(a==e.g){if(a.b==e.h){CWi(e.i);e.d=true;break}else{d=a.c+512;a.b=d<e.h?d:e.h;continue}}else{p9h(Eki(e.a),21);continue}}r0i(a,e.e);e.e=false;if(a.c<a.b){e.e=kXi(e.i,a);Ami(e.c);break}else{continue}}f=pni(new oni(),e);ibi(f,1)}
function aoi(h){var a;a=q0i(new p0i(),lfi(h),0,h.length);while(a.c<a.b){r0i(a,this.e);this.e=false;if(a.c<a.b){this.e=kXi(this.i,a);Ami(this.c)}}}
function boi(){return m_h}
function nni(){}
_=nni.prototype=new xdi();_.xb=aoi;_.gC=boi;_.tI=0;_.c=null;_.d=false;_.e=false;_.f=null;_.g=null;_.h=0;_.i=null;function qni(){qni=v0i;gbi()}
function pni(b,a){qni();b.a=a;return b}
function rni(c){var a;try{Dni(c.a)}catch(a){a=gai(a);if(s9h(a,22)){c.a.d=true}else throw a}}
function sni(){return l_h}
function oni(){}
_=oni.prototype=new abi();_.gC=sni;_.tI=35;_.a=null;function wni(c,d){c.write=function(){if(arguments.length==0){return}var b=arguments[0];for(var a=1;a<arguments.length;a++){b+=arguments[a]}d.xb(b)};c.writeln=function(){if(arguments.length==0){d.xb(qPg);return}var b=arguments[0];for(var a=1;a<arguments.length;a++){b+=arguments[a]}b+=qPg;d.xb(b)}}
function xni(e,a,d,b){var c;if(!d){d=q8h()}yni(a);c=Ani(new nni(),a);wni(a,c);Cni(c,e,doi(new coi(),d))}
function yni(a){while(a.hasChildNodes()){a.removeChild(a.lastChild)}}
function doi(b,a){b.a=a;return b}
function goi(){return n_h}
function coi(){}
_=coi.prototype=new xdi();_.gC=goi;_.tI=0;_.a=null;function koi(){var bb;koi=v0i;dpi=f9h(D_h,48,1,[cNh,cNh,cNh,cNh]);zGi=f9h(D_h,48,1,[cNh,BPg,BPg,cNh]);EGi=f9h(D_h,48,1,[cNh,gQg,gQg,cNh]);sGi=f9h(D_h,48,1,[cNh,rQg,rQg,cNh]);hwi=f9h(D_h,48,1,[cNh,cNh,cNh,gQg]);epi=f9h(D_h,48,1,[null,null,null,null]);AGi=f9h(D_h,48,1,[null,CQg,CQg,null]);tGi=f9h(D_h,48,1,[null,hRg,hRg,null]);FGi=f9h(D_h,48,1,[null,sRg,sRg,null]);iwi=f9h(D_h,48,1,[null,null,null,sRg]);bpi=f9h(bai,0,-1,[true,true,true,true]);cpi=f9h(bai,0,-1,[false,false,false,false]);xsi=ioi(new hoi(),dpi,ACi(DRg),epi,bpi,false);zvi=ioi(new hoi(),dpi,ACi(iSg),epi,bpi,false);xBi=ioi(new hoi(),dpi,ACi(uSg),epi,bpi,false);lGi=ioi(new hoi(),dpi,ACi(FSg),epi,bpi,false);dHi=ioi(new hoi(),dpi,ACi(kTg),epi,bpi,false);hHi=ioi(new hoi(),dpi,ACi(vTg),epi,bpi,false);iri=ioi(new hoi(),dpi,ACi(aUg),epi,bpi,false);vsi=ioi(new hoi(),dpi,ACi(lUg),epi,bpi,false);wsi=ioi(new hoi(),dpi,ACi(wUg),epi,bpi,false);nti=ioi(new hoi(),dpi,ACi(bVg),epi,bpi,false);oti=ioi(new hoi(),dpi,ACi(mVg),epi,bpi,false);zui=ioi(new hoi(),dpi,ACi(xVg),epi,bpi,false);yui=ioi(new hoi(),dpi,ACi(dWg),epi,bpi,false);wui=ioi(new hoi(),dpi,ACi(oWg),epi,bpi,false);xui=ioi(new hoi(),dpi,ACi(zWg),epi,bpi,false);Dvi=ioi(new hoi(),dpi,ACi(eXg),epi,bpi,false);Bvi=ioi(new hoi(),dpi,ACi(pXg),epi,bpi,false);Cvi=ioi(new hoi(),dpi,ACi(AXg),epi,bpi,false);Avi=ioi(new hoi(),dpi,ACi(fYg),epi,bpi,false);pvi=joi(new hoi(),dpi,ACi(kLg),epi,bpi,false);svi=ioi(new hoi(),dpi,ACi(qYg),epi,bpi,false);hFi=ioi(new hoi(),dpi,ACi(BYg),epi,bpi,false);gFi=ioi(new hoi(),dpi,ACi(gZg),epi,bpi,false);wCi=ioi(new hoi(),dpi,ACi(tZg),epi,bpi,false);yCi=ioi(new hoi(),dpi,ACi(EZg),epi,bpi,false);zCi=ioi(new hoi(),dpi,ACi(j0g),epi,bpi,false);dFi=ioi(new hoi(),dpi,ACi(u0g),epi,bpi,false);fHi=ioi(new hoi(),dpi,ACi(F0g),epi,bpi,false);eHi=ioi(new hoi(),dpi,ACi(k1g),epi,bpi,false);mGi=ioi(new hoi(),dpi,ACi(v1g),epi,bpi,false);nGi=ioi(new hoi(),dpi,ACi(a2g),epi,bpi,false);gpi=ioi(new hoi(),dpi,ACi(l2g),epi,bpi,false);eti=ioi(new hoi(),dpi,ACi(w2g),epi,bpi,false);mti=ioi(new hoi(),dpi,ACi(c3g),epi,bpi,false);vti=ioi(new hoi(),dpi,ACi(n3g),epi,bpi,false);pui=ioi(new hoi(),dpi,ACi(y3g),epi,bpi,false);tvi=ioi(new hoi(),dpi,ACi(d4g),epi,bpi,false);nxi=ioi(new hoi(),dpi,ACi(o4g),epi,bpi,false);txi=ioi(new hoi(),dpi,ACi(z4g),epi,bpi,false);wwi=ioi(new hoi(),dpi,ACi(e5g),epi,bpi,false);DBi=ioi(new hoi(),dpi,ACi(p5g),epi,bpi,false);mCi=ioi(new hoi(),dpi,ACi(A5g),epi,bpi,false);wDi=ioi(new hoi(),dpi,ACi(f6g),epi,bpi,false);Aqi=ioi(new hoi(),dpi,ACi(r6g),epi,bpi,false);roi=ioi(new hoi(),dpi,ACi(C6g),epi,bpi,false);cri=ioi(new hoi(),dpi,ACi(h7g),epi,bpi,false);rri=ioi(new hoi(),dpi,ACi(s7g),epi,bpi,false);Bri=ioi(new hoi(),dpi,ACi(D7g),epi,bpi,false);gri=ioi(new hoi(),dpi,ACi(i8g),epi,bpi,false);esi=ioi(new hoi(),dpi,ACi(t8g),epi,bpi,false);vri=ioi(new hoi(),dpi,ACi(E8g),epi,bpi,false);nri=ioi(new hoi(),dpi,ACi(j9g),epi,bpi,false);Dqi=ioi(new hoi(),dpi,ACi(u9g),epi,bpi,false);pti=ioi(new hoi(),dpi,ACi(a$g),epi,bpi,false);ysi=ioi(new hoi(),dpi,ACi(l$g),epi,bpi,false);Cti=ioi(new hoi(),dpi,ACi(w$g),epi,bpi,false);vui=ioi(new hoi(),dpi,ACi(b_g),epi,bpi,false);qui=ioi(new hoi(),dpi,ACi(srg),epi,bpi,false);Ati=ioi(new hoi(),dpi,ACi(m_g),epi,bpi,false);gvi=ioi(new hoi(),dpi,ACi(x_g),epi,bpi,false);kvi=ioi(new hoi(),dpi,ACi(cah),epi,bpi,false);yAi=ioi(new hoi(),dpi,ACi(nah),epi,bpi,false);ovi=ioi(new hoi(),dpi,ACi(yah),epi,bpi,false);yxi=ioi(new hoi(),dpi,ACi(pXh),epi,bpi,false);vxi=ioi(new hoi(),dpi,ACi(dbh),epi,bpi,false);exi=ioi(new hoi(),dpi,ACi(pbh),epi,bpi,false);qwi=ioi(new hoi(),dpi,ACi(Abh),epi,bpi,false);fwi=ioi(new hoi(),hwi,ACi(fch),iwi,bpi,false);rwi=ioi(new hoi(),dpi,ACi(qch),epi,bpi,false);fFi=ioi(new hoi(),dpi,ACi(Bch),epi,bpi,false);fGi=ioi(new hoi(),dpi,ACi(gdh),epi,bpi,false);jGi=ioi(new hoi(),dpi,ACi(rdh),epi,bpi,false);BEi=ioi(new hoi(),dpi,ACi(Cdh),epi,bpi,false);eBi=ioi(new hoi(),dpi,ACi(heh),epi,bpi,false);kBi=ioi(new hoi(),dpi,ACi(seh),epi,bpi,false);BBi=ioi(new hoi(),dpi,sEi(Eeh,jfh),epi,bpi,false);CBi=ioi(new hoi(),dpi,sEi(ufh,Ffh),epi,bpi,false);nDi=ioi(new hoi(),dpi,ACi(kgh),epi,bpi,false);gDi=ioi(new hoi(),dpi,ACi(vgh),epi,bpi,false);rCi=ioi(new hoi(),dpi,ACi(ahh),epi,bpi,false);qDi=ioi(new hoi(),dpi,ACi(lhh),epi,bpi,false);DDi=ioi(new hoi(),dpi,ACi(whh),epi,bpi,false);nCi=ioi(new hoi(),dpi,ACi(bih),epi,bpi,false);bHi=ioi(new hoi(),dpi,ACi(nih),epi,bpi,false);rqi=ioi(new hoi(),dpi,ACi(yih),epi,bpi,false);api=ioi(new hoi(),dpi,ACi(djh),epi,bpi,false);Doi=ioi(new hoi(),dpi,ACi(ojh),epi,bpi,false);zri=ioi(new hoi(),dpi,ACi(zjh),epi,bpi,false);Fri=ioi(new hoi(),dpi,ACi(ekh),epi,bpi,false);sri=ioi(new hoi(),dpi,ACi(pkh),epi,bpi,false);uri=ioi(new hoi(),dpi,ACi(Akh),epi,bpi,false);dri=ioi(new hoi(),dpi,ACi(flh),epi,bpi,false);bti=ioi(new hoi(),dpi,ACi(qlh),epi,bpi,false);Fsi=ioi(new hoi(),dpi,ACi(Clh),epi,bpi,false);Bti=ioi(new hoi(),dpi,ACi(hmh),epi,bpi,false);sui=ioi(new hoi(),dpi,ACi(smh),epi,bpi,false);yvi=ioi(new hoi(),dpi,ACi(Dmh),epi,bpi,false);hzi=ioi(new hoi(),dpi,ACi(inh),epi,bpi,false);uvi=ioi(new hoi(),dpi,ACi(tnh),epi,bpi,false);BAi=ioi(new hoi(),dpi,ACi(Enh),epi,bpi,false);FAi=ioi(new hoi(),dpi,ACi(joh),epi,bpi,false);zyi=ioi(new hoi(),dpi,ACi(uoh),epi,bpi,false);zxi=ioi(new hoi(),dpi,ACi(Foh),epi,bpi,false);qxi=ioi(new hoi(),dpi,ACi(lph),epi,bpi,false);ewi=ioi(new hoi(),dpi,ACi(wph),epi,bpi,false);swi=ioi(new hoi(),dpi,ACi(bqh),epi,bpi,false);gGi=ioi(new hoi(),dpi,ACi(mqh),epi,bpi,false);cFi=ioi(new hoi(),dpi,ACi(fHg),epi,bpi,false);FFi=ioi(new hoi(),dpi,ACi(xqh),epi,bpi,false);rFi=ioi(new hoi(),dpi,ACi(crh),epi,bpi,false);oDi=ioi(new hoi(),dpi,ACi(nrh),epi,bpi,false);lDi=ioi(new hoi(),dpi,ACi(yrh),epi,bpi,false);ECi=ioi(new hoi(),dpi,ACi(dsh),epi,bpi,false);CCi=ioi(new hoi(),dpi,ACi(osh),epi,bpi,false);uDi=ioi(new hoi(),dpi,ACi(Ash),epi,bpi,false);nEi=ioi(new hoi(),dpi,ACi(BHg),epi,bpi,false);xCi=ioi(new hoi(),dpi,ACi(fth),epi,bpi,false);BDi=ioi(new hoi(),dpi,ACi(qth),epi,bpi,false);CDi=ioi(new hoi(),dpi,ACi(Bth),epi,bpi,false);yDi=ioi(new hoi(),dpi,ACi(guh),epi,bpi,false);yGi=ioi(new hoi(),zGi,ACi(CQg),epi,f9h(bai,0,-1,[false,false,false,false]),true);voi=ioi(new hoi(),dpi,ACi(ruh),epi,bpi,false);soi=ioi(new hoi(),dpi,ACi(Cuh),epi,bpi,false);qqi=ioi(new hoi(),dpi,ACi(hvh),epi,bpi,false);Boi=ioi(new hoi(),dpi,ACi(svh),epi,bpi,false);hpi=ioi(new hoi(),dpi,ACi(Dvh),epi,bpi,false);zoi=ioi(new hoi(),dpi,ACi(kwh),epi,bpi,false);hri=ioi(new hoi(),dpi,ACi(vwh),epi,bpi,false);usi=ioi(new hoi(),dpi,ACi(axh),epi,bpi,false);tsi=ioi(new hoi(),dpi,ACi(lxh),epi,bpi,false);Fti=ioi(new hoi(),dpi,ACi(wxh),epi,bpi,false);rui=ioi(new hoi(),dpi,ACi(byh),epi,bpi,false);evi=ioi(new hoi(),dpi,ACi(mEg),epi,bpi,false);mvi=ioi(new hoi(),dpi,ACi(myh),epi,bpi,false);dvi=ioi(new hoi(),dpi,ACi(xyh),epi,bpi,false);cAi=ioi(new hoi(),dpi,ACi(czh),epi,bpi,false);xzi=ioi(new hoi(),dpi,ACi(nzh),epi,bpi,false);Fyi=ioi(new hoi(),dpi,ACi(zzh),epi,bpi,false);EAi=ioi(new hoi(),dpi,ACi(eAh),epi,bpi,false);wAi=ioi(new hoi(),dpi,ACi(pAh),epi,bpi,false);rzi=ioi(new hoi(),dpi,ACi(AAh),epi,bpi,false);tAi=ioi(new hoi(),dpi,ACi(fBh),epi,bpi,false);gzi=ioi(new hoi(),dpi,ACi(qBh),epi,bpi,false);ryi=ioi(new hoi(),dpi,ACi(BBh),epi,bpi,false);ayi=ioi(new hoi(),dpi,ACi(FKg),epi,bpi,false);cyi=ioi(new hoi(),dpi,ACi(gCh),epi,bpi,false);CAi=ioi(new hoi(),dpi,ACi(rCh),epi,bpi,false);yyi=ioi(new hoi(),dpi,ACi(CCh),epi,bpi,false);Exi=ioi(new hoi(),dpi,ACi(iDh),epi,bpi,false);Axi=ioi(new hoi(),dpi,ACi(tDh),epi,bpi,false);Awi=ioi(new hoi(),dpi,ACi(EDh),epi,bpi,false);sxi=ioi(new hoi(),dpi,ACi(jEh),epi,bpi,false);xwi=ioi(new hoi(),dpi,ACi(uEh),epi,bpi,false);zwi=ioi(new hoi(),dpi,ACi(FEh),epi,bpi,false);ywi=ioi(new hoi(),dpi,ACi(kFh),epi,bpi,false);pFi=ioi(new hoi(),dpi,ACi(vFh),epi,bpi,false);hGi=ioi(new hoi(),dpi,ACi(aGh),epi,bpi,false);xEi=ioi(new hoi(),dpi,ACi(lGh),epi,bpi,false);sFi=ioi(new hoi(),dpi,ACi(xGh),epi,bpi,false);qFi=ioi(new hoi(),dpi,ACi(cHh),epi,bpi,false);aGi=ioi(new hoi(),dpi,ACi(nHh),epi,bpi,false);rBi=ioi(new hoi(),dpi,ACi(yHh),epi,bpi,false);nBi=ioi(new hoi(),dpi,ACi(dIh),epi,bpi,false);wBi=ioi(new hoi(),dpi,ACi(oIh),epi,bpi,false);FCi=ioi(new hoi(),dpi,ACi(zIh),epi,bpi,false);eEi=ioi(new hoi(),dpi,ACi(eJh),epi,bpi,false);DCi=ioi(new hoi(),dpi,ACi(pJh),epi,bpi,false);fEi=ioi(new hoi(),dpi,ACi(AJh),epi,bpi,false);zBi=ioi(new hoi(),dpi,ACi(gKh),epi,bpi,false);lCi=ioi(new hoi(),dpi,ACi(rKh),epi,bpi,false);FBi=ioi(new hoi(),dpi,ACi(CKh),epi,bpi,false);vCi=ioi(new hoi(),dpi,ACi(eLh),epi,bpi,false);oCi=ioi(new hoi(),dpi,ACi(fLh),epi,bpi,false);uCi=ioi(new hoi(),dpi,ACi(gLh),epi,bpi,false);ipi=ioi(new hoi(),dpi,ACi(hLh),epi,bpi,false);lpi=ioi(new hoi(),dpi,ACi(iLh),epi,bpi,false);Bqi=ioi(new hoi(),dpi,ACi(jLh),epi,bpi,false);Ari=ioi(new hoi(),dpi,ACi(kLh),epi,bpi,false);qri=ioi(new hoi(),dpi,ACi(mLh),epi,bpi,false);tri=ioi(new hoi(),dpi,ACi(bMg),epi,bpi,false);ori=ioi(new hoi(),dpi,ACi(nLh),epi,bpi,false);fri=ioi(new hoi(),dpi,ACi(oLh),epi,bpi,false);fsi=ioi(new hoi(),dpi,ACi(pLh),epi,bpi,false);pri=ioi(new hoi(),dpi,ACi(qLh),epi,bpi,false);lsi=ioi(new hoi(),dpi,ACi(rLh),epi,bpi,false);nsi=ioi(new hoi(),dpi,ACi(sLh),epi,bpi,false);uti=ioi(new hoi(),dpi,ACi(tLh),epi,bpi,false);Bsi=ioi(new hoi(),dpi,ACi(uLh),epi,bpi,false);zsi=ioi(new hoi(),dpi,ACi(vLh),epi,bpi,false);Dsi=ioi(new hoi(),dpi,ACi(xLh),epi,bpi,false);hti=ioi(new hoi(),dpi,ACi(yLh),epi,bpi,false);jti=ioi(new hoi(),dpi,ACi(zLh),epi,bpi,false);Esi=ioi(new hoi(),dpi,ACi(ALh),epi,bpi,false);cti=ioi(new hoi(),dpi,ACi(BLh),epi,bpi,false);awi=ioi(new hoi(),dpi,ACi(CLh),epi,bpi,false);bvi=ioi(new hoi(),dpi,ACi(DLh),epi,bpi,false);cvi=ioi(new hoi(),dpi,ACi(ELh),epi,bpi,false);fAi=ioi(new hoi(),dpi,ACi(FLh),epi,bpi,false);vyi=ioi(new hoi(),dpi,ACi(aMh),epi,bpi,false);AAi=ioi(new hoi(),dpi,ACi(cMh),epi,bpi,false);qyi=ioi(new hoi(),dpi,ACi(dMh),epi,bpi,false);wzi=ioi(new hoi(),dpi,ACi(eMh),epi,bpi,false);mzi=ioi(new hoi(),dpi,ACi(fMh),epi,bpi,false);izi=ioi(new hoi(),dpi,ACi(gMh),epi,bpi,false);szi=ioi(new hoi(),dpi,ACi(hMh),epi,bpi,false);dyi=ioi(new hoi(),dpi,ACi(iMh),epi,bpi,false);sAi=ioi(new hoi(),dpi,ACi(jMh),epi,bpi,false);jAi=ioi(new hoi(),dpi,ACi(kMh),epi,bpi,false);xAi=ioi(new hoi(),dpi,ACi(lMh),epi,bpi,false);Cxi=ioi(new hoi(),dpi,ACi(nMh),epi,bpi,false);uxi=ioi(new hoi(),dpi,ACi(oMh),epi,bpi,false);pxi=ioi(new hoi(),dpi,ACi(pMh),epi,bpi,false);uwi=ioi(new hoi(),dpi,ACi(qMh),epi,bpi,false);jwi=ioi(new hoi(),dpi,ACi(rMh),epi,bpi,false);kFi=ioi(new hoi(),dpi,ACi(sMh),epi,bpi,false);yEi=ioi(new hoi(),dpi,sEi(tMh,uMh),epi,bpi,false);zEi=ioi(new hoi(),dpi,sEi(vMh,wMh),epi,bpi,false);CFi=ioi(new hoi(),dpi,sEi(yMh,zMh),epi,bpi,false);uFi=ioi(new hoi(),dpi,ACi(AMh),epi,bpi,false);gBi=ioi(new hoi(),dpi,ACi(BMh),epi,bpi,false);vBi=ioi(new hoi(),dpi,ACi(CMh),epi,bpi,false);pDi=ioi(new hoi(),dpi,ACi(DMh),epi,bpi,false);kCi=ioi(new hoi(),dpi,ACi(EMh),epi,bpi,false);tCi=ioi(new hoi(),dpi,ACi(FMh),epi,bpi,false);BCi=ioi(new hoi(),dpi,ACi(aNh),epi,bpi,false);pEi=ioi(new hoi(),dpi,ACi(bNh),epi,bpi,false);xDi=ioi(new hoi(),dpi,ACi(eNh),epi,bpi,false);gCi=ioi(new hoi(),dpi,ACi(fNh),epi,bpi,false);yqi=ioi(new hoi(),dpi,ACi(gNh),epi,bpi,false);Coi=ioi(new hoi(),dpi,ACi(hNh),epi,bpi,false);jri=ioi(new hoi(),dpi,sEi(iNh,jNh),epi,bpi,false);Dri=ioi(new hoi(),dpi,ACi(kNh),epi,bpi,false);Cri=ioi(new hoi(),dpi,ACi(lNh),epi,bpi,false);ssi=ioi(new hoi(),dpi,ACi(mNh),epi,bpi,false);eri=ioi(new hoi(),dpi,ACi(nNh),epi,bpi,false);Fqi=ioi(new hoi(),dpi,ACi(pNh),epi,bpi,false);yti=ioi(new hoi(),dpi,ACi(qNh),epi,bpi,false);qti=ioi(new hoi(),dpi,sEi(rNh,sNh),epi,bpi,false);tti=ioi(new hoi(),dpi,ACi(tNh),epi,bpi,false);Aui=ioi(new hoi(),dpi,sEi(uNh,vNh),epi,bpi,false);Csi=ioi(new hoi(),dpi,ACi(wNh),epi,bpi,false);gti=ioi(new hoi(),dpi,ACi(xNh),epi,bpi,false);fui=ioi(new hoi(),dpi,ACi(yNh),epi,bpi,false);dwi=ioi(new hoi(),dpi,sEi(ANh,BNh),epi,bpi,false);dBi=ioi(new hoi(),dpi,ACi(CNh),epi,bpi,false);lvi=ioi(new hoi(),dpi,ACi(DNh),epi,bpi,false);kAi=ioi(new hoi(),dpi,ACi(ENh),epi,bpi,false);uyi=ioi(new hoi(),dpi,ACi(FNh),epi,bpi,false);syi=ioi(new hoi(),dpi,ACi(aOh),epi,bpi,false);vAi=ioi(new hoi(),dpi,ACi(bOh),epi,bpi,false);lzi=ioi(new hoi(),dpi,ACi(cOh),epi,bpi,false);pAi=ioi(new hoi(),dpi,ACi(dOh),epi,bpi,false);zAi=ioi(new hoi(),dpi,ACi(fOh),epi,bpi,false);aBi=ioi(new hoi(),dpi,ACi(gOh),epi,bpi,false);uAi=ioi(new hoi(),dpi,ACi(hOh),epi,bpi,false);iAi=ioi(new hoi(),dpi,ACi(iOh),epi,bpi,false);qAi=ioi(new hoi(),dpi,ACi(jOh),epi,bpi,false);Dxi=ioi(new hoi(),dpi,ACi(kOh),epi,bpi,false);Bxi=ioi(new hoi(),dpi,ACi(lOh),epi,bpi,false);Bwi=ioi(new hoi(),dpi,ACi(mOh),epi,bpi,false);kxi=ioi(new hoi(),dpi,ACi(nOh),epi,bpi,false);xxi=ioi(new hoi(),dpi,ACi(oOh),epi,bpi,false);twi=ioi(new hoi(),dpi,ACi(qOh),epi,bpi,false);gwi=ioi(new hoi(),dpi,ACi(rOh),epi,bpi,false);AEi=ioi(new hoi(),dpi,ACi(sOh),epi,bpi,false);vEi=ioi(new hoi(),dpi,ACi(tOh),epi,bpi,false);ABi=ioi(new hoi(),dpi,ACi(uOh),epi,bpi,false);hDi=ioi(new hoi(),dpi,ACi(vOh),epi,bpi,false);qCi=ioi(new hoi(),dpi,ACi(wOh),epi,bpi,false);fDi=ioi(new hoi(),dpi,ACi(xOh),epi,bpi,false);pCi=ioi(new hoi(),dpi,ACi(yOh),epi,bpi,false);bEi=ioi(new hoi(),dpi,ACi(zOh),epi,bpi,false);hCi=ioi(new hoi(),dpi,ACi(BOh),epi,bpi,false);CGi=ioi(new hoi(),EGi,Eri(COh,u9g),FGi,f9h(bai,0,-1,[false,true,true,false]),false);DGi=ioi(new hoi(),EGi,Eri(DOh,fch),FGi,f9h(bai,0,-1,[false,true,true,false]),false);cHi=ioi(new hoi(),dpi,ACi(EOh),epi,bpi,false);cqi=ioi(new hoi(),dpi,ACi(FOh),epi,bpi,false);xqi=ioi(new hoi(),dpi,ACi(aPh),epi,bpi,false);lqi=ioi(new hoi(),dpi,ACi(bPh),epi,bpi,false);xoi=ioi(new hoi(),dpi,ACi(cPh),epi,bpi,false);ppi=ioi(new hoi(),dpi,ACi(dPh),epi,bpi,false);zpi=ioi(new hoi(),dpi,ACi(ePh),epi,bpi,false);jpi=ioi(new hoi(),dpi,ACi(gPh),epi,bpi,false);Fpi=ioi(new hoi(),dpi,ACi(hPh),epi,bpi,false);yri=ioi(new hoi(),dpi,ACi(iPh),epi,bpi,false);xri=ioi(new hoi(),dpi,ACi(jPh),epi,bpi,false);xti=ioi(new hoi(),dpi,ACi(kPh),epi,bpi,false);rti=ioi(new hoi(),dpi,ACi(lPh),epi,bpi,false);fti=ioi(new hoi(),dpi,ACi(mPh),epi,bpi,false);lti=ioi(new hoi(),dpi,ACi(nPh),epi,bpi,false);aui=ioi(new hoi(),dpi,sEi(oPh,pPh),epi,bpi,false);Eti=ioi(new hoi(),dpi,ACi(rPh),epi,bpi,false);gui=ioi(new hoi(),dpi,ACi(sPh),epi,bpi,false);jui=ioi(new hoi(),dpi,ACi(tPh),epi,bpi,false);bwi=ioi(new hoi(),dpi,sEi(uPh,vPh),epi,bpi,false);fvi=ioi(new hoi(),dpi,ACi(wPh),epi,bpi,false);zzi=ioi(new hoi(),dpi,ACi(xPh),epi,bpi,false);wvi=ioi(new hoi(),dpi,ACi(yPh),epi,bpi,false);bzi=ioi(new hoi(),dpi,ACi(zPh),epi,bpi,false);dAi=ioi(new hoi(),dpi,ACi(APh),epi,bpi,false);tzi=ioi(new hoi(),dpi,ACi(CPh),epi,bpi,false);uzi=ioi(new hoi(),dpi,ACi(DPh),epi,bpi,false);nzi=ioi(new hoi(),dpi,ACi(EPh),epi,bpi,false);aAi=ioi(new hoi(),dpi,ACi(FPh),epi,bpi,false);vvi=ioi(new hoi(),dpi,ACi(aQh),epi,bpi,false);mAi=ioi(new hoi(),dpi,ACi(bQh),epi,bpi,false);ixi=ioi(new hoi(),dpi,ACi(cQh),epi,bpi,false);gxi=ioi(new hoi(),dpi,sEi(dQh,eQh),epi,bpi,false);oxi=ioi(new hoi(),dpi,ACi(fQh),epi,bpi,false);owi=ioi(new hoi(),dpi,ACi(hQh),epi,bpi,false);vwi=ioi(new hoi(),dpi,ACi(iQh),epi,bpi,false);eFi=ioi(new hoi(),dpi,ACi(jQh),epi,bpi,false);cGi=ioi(new hoi(),dpi,ACi(kQh),epi,bpi,false);tFi=ioi(new hoi(),dpi,ACi(lQh),epi,bpi,false);qBi=ioi(new hoi(),dpi,sEi(mQh,nQh),epi,bpi,false);oBi=ioi(new hoi(),dpi,sEi(oQh,pQh),epi,bpi,false);pBi=ioi(new hoi(),dpi,sEi(qQh,tQh),epi,bpi,false);lBi=ioi(new hoi(),dpi,ACi(uQh),epi,bpi,false);tEi=ioi(new hoi(),dpi,ACi(vQh),epi,bpi,false);eDi=ioi(new hoi(),dpi,ACi(wQh),epi,bpi,false);bCi=ioi(new hoi(),dpi,sEi(xQh,yQh),epi,bpi,false);iDi=ioi(new hoi(),dpi,ACi(zQh),epi,bpi,false);jDi=ioi(new hoi(),dpi,ACi(AQh),epi,bpi,false);aHi=ioi(new hoi(),EGi,Eri(BQh,CQh),FGi,f9h(bai,0,-1,[false,true,true,false]),false);zqi=ioi(new hoi(),dpi,ACi(EQh),epi,bpi,false);fpi=ioi(new hoi(),dpi,ACi(FQh),epi,bpi,false);Aoi=ioi(new hoi(),dpi,ACi(aRh),epi,bpi,false);yoi=ioi(new hoi(),dpi,ACi(bRh),epi,bpi,false);Epi=ioi(new hoi(),dpi,ACi(cRh),epi,bpi,false);jsi=ioi(new hoi(),dpi,ACi(dRh),epi,bpi,false);kri=ioi(new hoi(),dpi,ACi(eRh),epi,bpi,false);Cqi=ioi(new hoi(),dpi,ACi(fRh),epi,bpi,false);Bui=ioi(new hoi(),dpi,ACi(gRh),epi,bpi,false);avi=ioi(new hoi(),dpi,ACi(hRh),epi,bpi,false);eui=ioi(new hoi(),dpi,ACi(jRh),epi,bpi,false);hui=ioi(new hoi(),dpi,ACi(kRh),epi,bpi,false);mui=ioi(new hoi(),dpi,ACi(lRh),epi,bpi,false);cwi=ioi(new hoi(),dpi,sEi(mRh,nRh),epi,bpi,false);nvi=ioi(new hoi(),dpi,ACi(oRh),epi,bpi,false);eyi=ioi(new hoi(),dpi,ACi(pRh),epi,bpi,false);byi=ioi(new hoi(),dpi,ACi(qRh),epi,bpi,false);xvi=ioi(new hoi(),dpi,ACi(rRh),epi,bpi,false);Dyi=ioi(new hoi(),dpi,ACi(sRh),epi,bpi,false);azi=ioi(new hoi(),dpi,ACi(uRh),epi,bpi,false);vzi=ioi(new hoi(),dpi,ACi(vRh),epi,bpi,false);lAi=ioi(new hoi(),dpi,ACi(wRh),epi,bpi,false);ezi=ioi(new hoi(),dpi,ACi(xRh),epi,bpi,false);ozi=ioi(new hoi(),dpi,ACi(yRh),epi,bpi,false);Ezi=ioi(new hoi(),dpi,ACi(zRh),epi,bpi,false);Fxi=ioi(new hoi(),dpi,sEi(ARh,BRh),epi,bpi,false);cxi=ioi(new hoi(),dpi,ACi(CRh),epi,bpi,false);bxi=ioi(new hoi(),dpi,ACi(DRh),epi,bpi,false);CEi=ioi(new hoi(),dpi,sEi(FRh,aSh),epi,bpi,false);EFi=ioi(new hoi(),dpi,ACi(bSh),epi,bpi,false);DFi=ioi(new hoi(),dpi,sEi(cSh,dSh),epi,bpi,false);vFi=ioi(new hoi(),dpi,ACi(eSh),epi,bpi,false);fBi=ioi(new hoi(),dpi,sEi(fSh,gSh),epi,bpi,false);cCi=ioi(new hoi(),dpi,ACi(hSh),epi,bpi,false);yBi=ioi(new hoi(),dpi,ACi(iSh),epi,bpi,false);FDi=ioi(new hoi(),dpi,ACi(kSh),epi,bpi,false);kDi=ioi(new hoi(),dpi,ACi(lSh),epi,bpi,false);dCi=ioi(new hoi(),dpi,ACi(mSh),epi,bpi,false);sCi=ioi(new hoi(),dpi,ACi(nSh),epi,bpi,false);iHi=ioi(new hoi(),dpi,sEi(oSh,pSh),epi,bpi,false);xGi=ioi(new hoi(),sGi,Eri(qSh,Bch),tGi,f9h(bai,0,-1,[false,true,true,false]),false);uGi=ioi(new hoi(),sGi,Eri(rSh,bih),tGi,f9h(bai,0,-1,[false,true,true,false]),false);rGi=ioi(new hoi(),sGi,Eri(sSh,cah),tGi,f9h(bai,0,-1,[false,true,true,false]),false);vGi=ioi(new hoi(),sGi,Eri(tSh,vSh),tGi,f9h(bai,0,-1,[false,true,true,false]),false);toi=ioi(new hoi(),dpi,ACi(wSh),epi,bpi,false);iqi=ioi(new hoi(),dpi,ACi(xSh),epi,bpi,false);npi=ioi(new hoi(),dpi,ACi(ySh),epi,bpi,false);Bpi=ioi(new hoi(),dpi,ACi(zSh),epi,bpi,false);ypi=ioi(new hoi(),dpi,ACi(ASh),epi,bpi,false);kpi=ioi(new hoi(),dpi,ACi(BSh),epi,bpi,false);lri=ioi(new hoi(),dpi,ACi(CSh),epi,bpi,false);mri=ioi(new hoi(),dpi,ACi(DSh),epi,bpi,false);ksi=ioi(new hoi(),dpi,ACi(ESh),epi,bpi,false);gsi=ioi(new hoi(),dpi,ACi(aTh),epi,bpi,false);hsi=ioi(new hoi(),dpi,ACi(bTh),epi,bpi,false);rsi=ioi(new hoi(),dpi,ACi(cTh),epi,bpi,false);bri=ioi(new hoi(),dpi,sEi(dTh,eTh),epi,bpi,false);iui=ioi(new hoi(),dpi,ACi(fTh),epi,bpi,false);tui=ioi(new hoi(),dpi,ACi(gTh),epi,bpi,false);bui=ioi(new hoi(),dpi,sEi(hTh,iTh),epi,bpi,false);cui=ioi(new hoi(),dpi,ACi(jTh),epi,bpi,false);oui=ioi(new hoi(),dpi,ACi(lTh),epi,bpi,false);hvi=ioi(new hoi(),dpi,ACi(mTh),epi,bpi,false);dzi=ioi(new hoi(),dpi,ACi(nTh),epi,bpi,false);Dzi=ioi(new hoi(),dpi,ACi(oTh),epi,bpi,false);DAi=ioi(new hoi(),dpi,ACi(pTh),epi,bpi,false);Azi=ioi(new hoi(),dpi,ACi(qTh),epi,bpi,false);Fzi=ioi(new hoi(),dpi,ACi(rTh),epi,bpi,false);czi=ioi(new hoi(),dpi,ACi(sTh),epi,bpi,false);qvi=ioi(new hoi(),dpi,ACi(tTh),epi,bpi,false);kyi=ioi(new hoi(),dpi,ACi(uTh),epi,bpi,false);qzi=ioi(new hoi(),dpi,ACi(wTh),epi,bpi,false);fzi=ioi(new hoi(),dpi,ACi(xTh),epi,bpi,false);eAi=ioi(new hoi(),dpi,ACi(yTh),epi,bpi,false);Fwi=ioi(new hoi(),dpi,sEi(zTh,ATh),epi,bpi,false);lxi=ioi(new hoi(),dpi,ACi(BTh),epi,bpi,false);Dwi=ioi(new hoi(),dpi,ACi(CTh),epi,bpi,false);axi=ioi(new hoi(),dpi,sEi(DTh,ETh),epi,bpi,false);DEi=ioi(new hoi(),dpi,ACi(FTh),epi,bpi,false);wEi=ioi(new hoi(),dpi,sEi(cUh,dUh),epi,bpi,false);aDi=ioi(new hoi(),dpi,ACi(eUh),epi,bpi,false);aCi=ioi(new hoi(),dpi,sEi(fUh,gUh),epi,bpi,false);EDi=ioi(new hoi(),dpi,sEi(hUh,iUh),epi,bpi,false);zDi=ioi(new hoi(),dpi,sEi(jUh,kUh),epi,bpi,false);dDi=ioi(new hoi(),dpi,ACi(lUh),epi,bpi,false);BGi=ioi(new hoi(),zGi,Eri(nUh,hRg),AGi,f9h(bai,0,-1,[false,false,false,false]),true);wGi=ioi(new hoi(),sGi,Eri(oUh,fHg),tGi,f9h(bai,0,-1,[false,true,true,false]),false);Cpi=ioi(new hoi(),dpi,ACi(pUh),epi,bpi,false);eqi=ioi(new hoi(),dpi,ACi(qUh),epi,bpi,false);rpi=ioi(new hoi(),dpi,ACi(rUh),epi,bpi,false);wqi=ioi(new hoi(),dpi,ACi(sUh),epi,bpi,false);kqi=ioi(new hoi(),dpi,ACi(tUh),epi,bpi,false);qpi=ioi(new hoi(),dpi,ACi(uUh),epi,bpi,false);wti=ioi(new hoi(),dpi,ACi(vUh),epi,bpi,false);iti=ioi(new hoi(),dpi,ACi(wUh),epi,bpi,false);Asi=ioi(new hoi(),dpi,ACi(yUh),epi,bpi,false);Dti=ioi(new hoi(),dpi,ACi(zUh),epi,bpi,false);nui=ioi(new hoi(),dpi,ACi(AUh),epi,bpi,false);lui=ioi(new hoi(),dpi,ACi(BUh),epi,bpi,false);uui=ioi(new hoi(),dpi,ACi(CUh),epi,bpi,false);Evi=ioi(new hoi(),dpi,sEi(DUh,EUh),epi,bpi,false);Eyi=ioi(new hoi(),dpi,ACi(FUh),epi,bpi,false);nAi=ioi(new hoi(),dpi,ACi(aVh),epi,bpi,false);Czi=ioi(new hoi(),dpi,ACi(bVh),epi,bpi,false);pzi=ioi(new hoi(),dpi,ACi(dVh),epi,bpi,false);tyi=ioi(new hoi(),dpi,ACi(eVh),epi,bpi,false);bAi=ioi(new hoi(),dpi,ACi(fVh),epi,bpi,false);Bzi=ioi(new hoi(),dpi,ACi(gVh),epi,bpi,false);fyi=ioi(new hoi(),dpi,ACi(hVh),epi,bpi,false);jyi=ioi(new hoi(),dpi,ACi(iVh),epi,bpi,false);Cwi=ioi(new hoi(),dpi,ACi(jVh),epi,bpi,false);Ewi=ioi(new hoi(),dpi,sEi(kVh,lVh),epi,bpi,false);dxi=ioi(new hoi(),dpi,ACi(mVh),epi,bpi,false);jxi=ioi(new hoi(),dpi,ACi(oVh),epi,bpi,false);kwi=ioi(new hoi(),dpi,sEi(pVh,qVh),epi,bpi,false);oFi=ioi(new hoi(),dpi,ACi(rVh),epi,bpi,false);lFi=ioi(new hoi(),dpi,ACi(sVh),epi,bpi,false);nFi=ioi(new hoi(),dpi,ACi(tVh),epi,bpi,false);iGi=ioi(new hoi(),dpi,ACi(uVh),epi,bpi,false);kGi=ioi(new hoi(),dpi,ACi(vVh),epi,bpi,false);bGi=ioi(new hoi(),dpi,ACi(wVh),epi,bpi,false);jBi=ioi(new hoi(),dpi,sEi(xVh,zVh),epi,bpi,false);vDi=ioi(new hoi(),dpi,sEi(AVh,BVh),epi,bpi,false);rEi=ioi(new hoi(),dpi,sEi(CVh,DVh),epi,bpi,false);mEi=ioi(new hoi(),dpi,ACi(EVh),epi,bpi,false);eCi=ioi(new hoi(),dpi,ACi(FVh),epi,bpi,false);ADi=ioi(new hoi(),dpi,sEi(aWh,bWh),epi,bpi,false);aEi=ioi(new hoi(),dpi,ACi(cWh),epi,bpi,false);spi=ioi(new hoi(),dpi,ACi(eWh),epi,bpi,false);Api=ioi(new hoi(),dpi,ACi(fWh),epi,bpi,false);uoi=ioi(new hoi(),dpi,ACi(gWh),epi,bpi,false);pqi=ioi(new hoi(),dpi,ACi(hWh),epi,bpi,false);gqi=ioi(new hoi(),dpi,ACi(iWh),epi,bpi,false);dqi=ioi(new hoi(),dpi,ACi(jWh),epi,bpi,false);nqi=ioi(new hoi(),dpi,ACi(kWh),epi,bpi,false);fqi=ioi(new hoi(),dpi,ACi(lWh),epi,bpi,false);jqi=ioi(new hoi(),dpi,ACi(mWh),epi,bpi,false);hqi=ioi(new hoi(),dpi,ACi(nWh),epi,bpi,false);xpi=ioi(new hoi(),dpi,ACi(pWh),epi,bpi,false);vpi=ioi(new hoi(),dpi,ACi(qWh),epi,bpi,false);tqi=ioi(new hoi(),dpi,sEi(rWh,sWh),epi,bpi,false);sqi=ioi(new hoi(),dpi,sEi(tWh,uWh),epi,bpi,false);tpi=ioi(new hoi(),dpi,ACi(vWh),epi,bpi,false);oqi=ioi(new hoi(),dpi,ACi(wWh),epi,bpi,false);Eqi=ioi(new hoi(),dpi,sEi(xWh,yWh),epi,bpi,false);isi=ioi(new hoi(),dpi,ACi(AWh),epi,bpi,false);csi=ioi(new hoi(),dpi,ACi(BWh),epi,bpi,false);wri=ioi(new hoi(),dpi,sEi(CWh,DWh),epi,bpi,false);ati=ioi(new hoi(),dpi,(bb=e9h(D_h,48,1,4,0),bb[0]=EWh,bb[1]=FWh,bb[2]=EWh,bb[3]=EWh,bb),epi,bpi,false);Fui=ioi(new hoi(),dpi,sEi(aXh,bXh),epi,bpi,false);dui=ioi(new hoi(),dpi,ACi(cXh),epi,bpi,false);gyi=ioi(new hoi(),dpi,ACi(dXh),epi,bpi,false);jzi=ioi(new hoi(),dpi,ACi(fXh),epi,bpi,false);myi=ioi(new hoi(),dpi,ACi(gXh),epi,bpi,false);yzi=ioi(new hoi(),dpi,ACi(hXh),epi,bpi,false);wyi=ioi(new hoi(),dpi,ACi(iXh),epi,bpi,false);rAi=ioi(new hoi(),dpi,ACi(jXh),epi,bpi,false);nyi=ioi(new hoi(),dpi,ACi(kXh),epi,bpi,false);wxi=ioi(new hoi(),dpi,ACi(lXh),epi,bpi,false);pwi=ioi(new hoi(),dpi,ACi(mXh),epi,bpi,false);mFi=ioi(new hoi(),dpi,ACi(nXh),epi,bpi,false);bFi=ioi(new hoi(),dpi,ACi(oXh),epi,bpi,false);wFi=ioi(new hoi(),dpi,ACi(rXh),epi,bpi,false);xFi=ioi(new hoi(),dpi,ACi(sXh),epi,bpi,false);dGi=ioi(new hoi(),dpi,ACi(tXh),epi,bpi,false);sBi=ioi(new hoi(),dpi,sEi(uXh,vXh),epi,bpi,false);bDi=ioi(new hoi(),dpi,ACi(wXh),epi,bpi,false);rDi=ioi(new hoi(),dpi,ACi(xXh),epi,bpi,false);pGi=ioi(new hoi(),sGi,Eri(yXh,zXh),tGi,f9h(bai,0,-1,[false,true,true,false]),false);qGi=ioi(new hoi(),sGi,Eri(AXh,CXh),tGi,f9h(bai,0,-1,[false,true,true,false]),false);woi=ioi(new hoi(),dpi,ACi(DXh),epi,bpi,false);Eoi=ioi(new hoi(),dpi,ACi(EXh),epi,bpi,false);aqi=ioi(new hoi(),dpi,ACi(FXh),epi,bpi,false);ari=ioi(new hoi(),dpi,ACi(aYh),epi,bpi,false);ivi=ioi(new hoi(),dpi,ACi(bYh),epi,bpi,false);jvi=ioi(new hoi(),dpi,ACi(cYh),epi,bpi,false);pyi=ioi(new hoi(),dpi,ACi(dYh),epi,bpi,false);kzi=ioi(new hoi(),dpi,ACi(eYh),epi,bpi,false);oAi=ioi(new hoi(),dpi,ACi(fYh),epi,bpi,false);oyi=ioi(new hoi(),dpi,ACi(hYh),epi,bpi,false);hxi=ioi(new hoi(),dpi,ACi(iYh),epi,bpi,false);lwi=ioi(new hoi(),dpi,ACi(jYh),epi,bpi,false);mwi=ioi(new hoi(),dpi,ACi(kYh),epi,bpi,false);aFi=ioi(new hoi(),dpi,ACi(lYh),epi,bpi,false);FEi=ioi(new hoi(),dpi,ACi(mYh),epi,bpi,false);eGi=ioi(new hoi(),dpi,ACi(nYh),epi,bpi,false);mBi=ioi(new hoi(),dpi,ACi(oYh),epi,bpi,false);uBi=ioi(new hoi(),dpi,sEi(pYh,qYh),epi,bpi,false);uEi=ioi(new hoi(),dpi,sEi(sYh,tYh),epi,bpi,false);iEi=ioi(new hoi(),dpi,ACi(uYh),epi,bpi,false);oEi=ioi(new hoi(),dpi,ACi(vYh),epi,bpi,false);lEi=ioi(new hoi(),dpi,ACi(wYh),epi,bpi,false);wpi=ioi(new hoi(),dpi,ACi(xYh),epi,bpi,false);Dpi=ioi(new hoi(),dpi,ACi(yYh),epi,bpi,false);mqi=ioi(new hoi(),dpi,ACi(zYh),epi,bpi,false);dsi=ioi(new hoi(),dpi,ACi(AYh),epi,bpi,false);osi=ioi(new hoi(),dpi,ACi(BYh),epi,bpi,false);dti=ioi(new hoi(),dpi,sEi(DYh,EYh),epi,bpi,false);Ayi=ioi(new hoi(),dpi,ACi(FYh),epi,bpi,false);xyi=ioi(new hoi(),dpi,ACi(aZh),epi,bpi,false);rvi=ioi(new hoi(),dpi,ACi(bZh),epi,bpi,false);rxi=ioi(new hoi(),dpi,ACi(cZh),epi,bpi,false);EEi=ioi(new hoi(),dpi,ACi(dZh),epi,bpi,false);mDi=ioi(new hoi(),dpi,ACi(eZh),epi,bpi,false);jEi=ioi(new hoi(),dpi,ACi(fZh),epi,bpi,false);fCi=ioi(new hoi(),dpi,ACi(gZh),epi,bpi,false);upi=ioi(new hoi(),dpi,ACi(iZh),epi,bpi,false);qsi=ioi(new hoi(),dpi,sEi(jZh,kZh),epi,bpi,false);kui=ioi(new hoi(),dpi,ACi(lZh),epi,bpi,false);Fvi=ioi(new hoi(),dpi,sEi(mZh,nZh),epi,bpi,false);iyi=ioi(new hoi(),dpi,ACi(oZh),epi,bpi,false);gAi=ioi(new hoi(),dpi,ACi(pZh),epi,bpi,false);Byi=ioi(new hoi(),dpi,ACi(qZh),epi,bpi,false);fxi=ioi(new hoi(),dpi,sEi(rZh,tZh),epi,bpi,false);iBi=ioi(new hoi(),dpi,sEi(uZh,vZh),epi,bpi,false);jCi=ioi(new hoi(),dpi,sEi(wZh,xZh),epi,bpi,false);EBi=ioi(new hoi(),dpi,ACi(yZh),epi,bpi,false);tDi=ioi(new hoi(),dpi,sEi(zZh,AZh),epi,bpi,false);sDi=ioi(new hoi(),dpi,sEi(BZh,CZh),epi,bpi,false);qEi=ioi(new hoi(),dpi,ACi(EZh),epi,bpi,false);gEi=ioi(new hoi(),dpi,ACi(FZh),epi,bpi,false);oGi=ioi(new hoi(),dpi,sEi(a0h,b0h),epi,bpi,false);gHi=ioi(new hoi(),dpi,sEi(c0h,d0h),epi,bpi,false);opi=ioi(new hoi(),dpi,ACi(e0h),epi,bpi,false);psi=ioi(new hoi(),dpi,sEi(f0h,g0h),epi,bpi,false);sti=ioi(new hoi(),dpi,ACi(h0h),epi,bpi,false);kti=ioi(new hoi(),dpi,ACi(j0h),epi,bpi,false);Eui=ioi(new hoi(),dpi,sEi(k0h,l0h),epi,bpi,false);hyi=ioi(new hoi(),dpi,ACi(m0h),epi,bpi,false);Cyi=ioi(new hoi(),dpi,ACi(n0h),epi,bpi,false);bBi=ioi(new hoi(),dpi,ACi(o0h),epi,bpi,false);lyi=ioi(new hoi(),dpi,ACi(p0h),epi,bpi,false);nwi=ioi(new hoi(),dpi,sEi(q0h,r0h),epi,bpi,false);zFi=ioi(new hoi(),dpi,ACi(s0h),epi,bpi,false);hEi=ioi(new hoi(),dpi,ACi(u0h),epi,bpi,false);kEi=ioi(new hoi(),dpi,ACi(v0h),epi,bpi,false);Foi=ioi(new hoi(),dpi,ACi(w0h),epi,bpi,false);hAi=ioi(new hoi(),dpi,ACi(x0h),epi,bpi,false);cBi=ioi(new hoi(),dpi,ACi(y0h),epi,bpi,false);iFi=ioi(new hoi(),dpi,ACi(z0h),epi,bpi,false);yFi=ioi(new hoi(),dpi,ACi(A0h),epi,bpi,false);iCi=ioi(new hoi(),dpi,sEi(B0h,C0h),epi,bpi,false);asi=ioi(new hoi(),dpi,ACi(D0h),epi,bpi,false);jFi=ioi(new hoi(),dpi,ACi(a1h),epi,bpi,false);tBi=ioi(new hoi(),dpi,sEi(b1h,c1h),epi,bpi,false);hBi=ioi(new hoi(),dpi,sEi(d1h,e1h),epi,bpi,false);bqi=ioi(new hoi(),dpi,ACi(f1h),epi,bpi,false);cDi=ioi(new hoi(),dpi,ACi(g1h),epi,bpi,false);mpi=ioi(new hoi(),dpi,ACi(h1h),epi,bpi,false);BFi=ioi(new hoi(),dpi,ACi(i1h),epi,bpi,false);AFi=ioi(new hoi(),dpi,ACi(j1h),epi,bpi,false);cEi=ioi(new hoi(),dpi,ACi(l1h),epi,bpi,false);dEi=ioi(new hoi(),dpi,ACi(m1h),epi,bpi,false);zti=ioi(new hoi(),dpi,sEi(n1h,o1h),epi,bpi,false);Dui=ioi(new hoi(),dpi,ACi(p1h),epi,bpi,false);bsi=ioi(new hoi(),dpi,ACi(q1h),epi,bpi,false);Cui=ioi(new hoi(),dpi,ACi(r1h),epi,bpi,false);vqi=f9h(E_h,49,9,[xsi,zvi,xBi,lGi,dHi,hHi,iri,vsi,wsi,nti,oti,zui,yui,wui,xui,Dvi,Bvi,Cvi,Avi,pvi,svi,hFi,gFi,wCi,yCi,zCi,dFi,fHi,eHi,mGi,nGi,gpi,eti,mti,vti,pui,tvi,nxi,txi,wwi,DBi,mCi,wDi,Aqi,roi,cri,rri,Bri,gri,esi,vri,nri,Dqi,pti,ysi,Cti,vui,qui,Ati,gvi,kvi,yAi,ovi,yxi,vxi,exi,qwi,fwi,rwi,fFi,fGi,jGi,BEi,eBi,kBi,BBi,CBi,nDi,gDi,rCi,qDi,DDi,nCi,bHi,rqi,api,Doi,zri,Fri,sri,uri,dri,bti,Fsi,Bti,sui,yvi,hzi,uvi,BAi,FAi,zyi,zxi,qxi,ewi,swi,gGi,cFi,FFi,rFi,oDi,lDi,ECi,CCi,uDi,nEi,xCi,BDi,CDi,yDi,yGi,voi,soi,qqi,Boi,hpi,zoi,hri,usi,tsi,Fti,rui,evi,mvi,dvi,cAi,xzi,Fyi,EAi,wAi,rzi,tAi,gzi,ryi,ayi,cyi,CAi,yyi,Exi,Axi,Awi,sxi,xwi,zwi,ywi,pFi,hGi,xEi,sFi,qFi,aGi,rBi,nBi,wBi,FCi,eEi,DCi,fEi,zBi,lCi,FBi,vCi,oCi,uCi,ipi,lpi,Bqi,Ari,qri,tri,ori,fri,fsi,pri,lsi,nsi,uti,Bsi,zsi,Dsi,hti,jti,Esi,cti,awi,bvi,cvi,fAi,vyi,AAi,qyi,wzi,mzi,izi,szi,dyi,sAi,jAi,xAi,Cxi,uxi,pxi,uwi,jwi,kFi,yEi,zEi,CFi,uFi,gBi,vBi,pDi,kCi,tCi,BCi,pEi,xDi,gCi,yqi,Coi,jri,Dri,Cri,ssi,eri,Fqi,yti,qti,tti,Aui,Csi,gti,fui,dwi,dBi,lvi,kAi,uyi,syi,vAi,lzi,pAi,zAi,aBi,uAi,iAi,qAi,Dxi,Bxi,Bwi,kxi,xxi,twi,gwi,AEi,vEi,ABi,hDi,qCi,fDi,pCi,bEi,hCi,CGi,DGi,cHi,cqi,xqi,lqi,xoi,ppi,zpi,jpi,Fpi,yri,xri,xti,rti,fti,lti,aui,Eti,gui,jui,bwi,fvi,zzi,wvi,bzi,dAi,tzi,uzi,nzi,aAi,vvi,mAi,ixi,gxi,oxi,owi,vwi,eFi,cGi,tFi,qBi,oBi,pBi,lBi,tEi,eDi,bCi,iDi,jDi,aHi,zqi,fpi,Aoi,yoi,Epi,jsi,kri,Cqi,Bui,avi,eui,hui,mui,cwi,nvi,eyi,byi,xvi,Dyi,azi,vzi,lAi,ezi,ozi,Ezi,Fxi,cxi,bxi,CEi,EFi,DFi,vFi,fBi,cCi,yBi,FDi,kDi,dCi,sCi,iHi,xGi,uGi,rGi,vGi,toi,iqi,npi,Bpi,ypi,kpi,lri,mri,ksi,gsi,hsi,rsi,bri,iui,tui,bui,cui,oui,hvi,dzi,Dzi,DAi,Azi,Fzi,czi,qvi,kyi,qzi,fzi,eAi,Fwi,lxi,Dwi,axi,DEi,wEi,aDi,aCi,EDi,zDi,dDi,BGi,wGi,Cpi,eqi,rpi,wqi,kqi,qpi,wti,iti,Asi,Dti,nui,lui,uui,Evi,Eyi,nAi,Czi,pzi,tyi,bAi,Bzi,fyi,jyi,Cwi,Ewi,dxi,jxi,kwi,oFi,lFi,nFi,iGi,kGi,bGi,jBi,vDi,rEi,mEi,eCi,ADi,aEi,spi,Api,uoi,pqi,gqi,dqi,nqi,fqi,jqi,hqi,xpi,vpi,tqi,sqi,tpi,oqi,Eqi,isi,csi,wri,ati,Fui,dui,gyi,jzi,myi,yzi,wyi,rAi,nyi,wxi,pwi,mFi,bFi,wFi,xFi,dGi,sBi,bDi,rDi,pGi,qGi,woi,Eoi,aqi,ari,ivi,jvi,pyi,kzi,oAi,oyi,hxi,lwi,mwi,aFi,FEi,eGi,mBi,uBi,uEi,iEi,oEi,lEi,wpi,Dpi,mqi,dsi,osi,dti,Ayi,xyi,rvi,rxi,EEi,mDi,jEi,fCi,upi,qsi,kui,Fvi,iyi,gAi,Byi,fxi,iBi,jCi,EBi,tDi,sDi,qEi,gEi,oGi,gHi,opi,psi,sti,kti,Eui,hyi,Cyi,bBi,lyi,nwi,zFi,hEi,kEi,Foi,hAi,cBi,iFi,yFi,iCi,asi,jFi,tBi,hBi,bqi,cDi,mpi,BFi,AFi,cEi,dEi,zti,Dui,bsi,Cui]);uqi=f9h(B_h,0,-1,[1153,1383,1601,1793,1827,1857,68600,69146,69177,70237,70270,71572,71669,72415,72444,74846,74904,74943,75001,75276,75590,84742,84839,85575,85963,85992,87204,88074,88171,89130,89163,3207892,3283895,3284791,3338752,3358197,3369562,3539124,3562402,3574260,3670335,3696933,3721879,135280021,135346322,136317019,136475749,136548517,136652214,136884919,136902418,136942992,137292068,139120259,139785574,142250603,142314056,142331176,142519584,144752417,145106895,146147200,146765926,148805544,149655723,149809441,150018784,150445028,150923321,152528754,152536216,152647366,152962785,155219321,155654904,157317483,157350248,157437941,157447478,157604838,157685404,157894402,158315188,166078431,169409980,169700259,169856932,170007032,170409695,170466488,170513710,170608367,173028944,173896963,176090625,176129212,179390001,179489057,179627464,179840468,179849042,180004216,181779081,183027151,183645319,183698797,185922012,185997252,188312483,188675799,190977533,190992569,191006194,191033518,191038774,191096249,191166163,191194426,191522106,191568039,200104642,202506661,202537381,202602917,203070590,203120766,203389054,203690071,203971238,203986524,209040857,209125756,212055489,212322418,212746849,213002877,213055164,213088023,213259873,213273386,213435118,213437318,213438231,213493071,213532268,213542834,213584431,213659891,215285828,215880731,216112976,216684637,217369699,217565298,217576549,218186795,219743185,220082234,221623802,221986406,222283890,223089542,223138630,223311265,224547358,224587256,224589550,224655650,224785518,224810917,224813302,225429618,225432950,225440869,236107233,236709921,236838947,237117095,237143271,237172455,237209953,237354143,237372743,237668065,237703073,237714273,239743521,240512803,240522627,240560417,240656513,241015715,241062755,241065383,243523041,245865199,246261793,246556195,246774817,246923491,246928419,246981667,247014847,247058369,247112833,247118177,247119137,247128739,247316903,249533729,250235623,250269543,251083937,251402351,252339047,253260911,253293679,254844367,255547879,256077281,256345377,258124199,258354465,258605063,258744193,258845603,258856961,258926689,269869248,270174334,270709417,270778994,270781796,271102503,271478858,271490090,272870654,273335275,273369140,273924313,274108530,274116736,276818662,277476156,279156579,279349675,280108533,280128712,280132869,280162403,280280292,280413430,280506130,280677397,280678580,280686710,280689066,282736758,283110901,283275116,283823226,283890012,284479340,284606461,286700477,286798916,291557706,291665349,291804100,292138018,292166446,292418738,292451039,300298041,300374839,300597935,303073389,303083839,303266673,303354997,303430688,303576261,303724281,303819694,304242723,304382625,306247792,307227811,307468786,307724489,309671175,310252031,310358241,310373094,311015256,313357609,313683893,313701861,313706996,313707317,313710350,314027746,314038181,314091299,314205627,314233813,316741830,316797986,317486755,317794164,318721061,320076137,322657125,322887778,323506876,323572412,323605180,323938869,325060058,325320188,325398738,325541490,325671619,333868843,336806130,337212108,337282686,337285434,337585223,338036037,338298087,338566051,340943551,341190970,342995704,343352124,343912673,344585053,346977248,347218098,347262163,347278576,347438191,347655959,347684788,347726430,347727772,347776035,347776629,349500753,350880161,350887073,353384123,355496998,355906922,355979793,356545959,358637867,358905016,359164318,359247286,359350571,359579447,365560330,367399355,367420285,367510727,368013212,370234760,370353345,370710317,371074566,371122285,371194213,371448425,371448430,371545055,371596922,371758751,371964792,372151328,376550136,376710172,376795771,376826271,376906556,380514830,380774774,380775037,381030322,381136500,381281631,381282269,381285504,381330595,381331422,381335911,381336484,383907298,383917408,384595009,384595013,387799894,387823201,392581647,392584937,392742684,392906485,393003349,400644707,400973830,404428547,404432113,404432865,404469244,404478897,404694860,406887479,408294949,408789955,410022510,410467324,410586448,410945965,411845275,414327152,414327932,414329781,414346257,414346439,414639928,414835998,414894517,414986533,417465377,417465381,417492216,418259232,419310946,420103495,420242342,420380455,420658662,420717432,423183880,424539259,425929170,425972964,426050649,426126450,426142833,426607922,437289840,437347469,437412335,437423943,437455540,437462252,437597991,437617485,437986305,437986507,437986828,437987072,438015591,438034813,438038966,438179623,438347971,438483573,438547062,438895551,441592676,442032555,443548979,447881379,447881655,447881895,447887844,448416189,448445746,448449012,450942191,452816744,453668677,454434495,456610076,456642844,456738709,457544600,459451897,459680944,468058810,468083581,470964084,471470955,471567278,472267822,481177859,481210627,481435874,481455115,481485378,481490218,485105638,486005878,486383494,487988916,488103783,490661867,491574090,491578272,493041952,493441205,493582844,493716979,504577572,504740359,505091638,505592418,505656212,509516275,514998531,515571132,515594682,518712698,521362273,526592419,526807354,527348842,538294791,539214049,544689535,545535009,548544752,548563346,548595116,551679010,558034099,560329411,560356209,560671018,560671152,560692590,560845442,569212097,569474241,572252718,572768481,575326764,576174758,576190819,582099184,582099438,582372519,582558889,586552164,591325418,594231990,594243961,605711268,615672071,616086845,621792370,624879850,627432831,640040548,654392808,658675477,659420283,672891587,694768102,705890982,725543146,759097578,761686526,795383908,843809551,878105336,908643300,945213471])}
function joi(d,e,a,c,b,f){koi();d.c=e;d.a=a;msi(a,c);d.b=b;d.d=f;return d}
function ioi(d,e,a,c,b,f){koi();d.c=e;d.a=a;msi(a,c);d.b=b;d.d=f;return d}
function ooi(a){return a==Boi||a==rqi||a==xqi||a==zqi||a==qri||a==lsi||a==Dsi||a==Esi||a==Fsi||a==gti||a==yvi||a==xxi||a==Axi||a==Bxi||a==Cxi||a==Exi||a==ABi||a==hCi||a==hDi}
function poi(a){return a==Boi||a==Doi||a==rqi||a==wqi||a==xqi||a==zqi||a==qri||a==uri||a==lsi||a==Asi||a==Dsi||a==Esi||a==Fsi||a==eti||a==gti||a==uti||a==sui||a==yvi||a==sxi||a==xxi||a==Axi||a==Bxi||a==Cxi||a==Exi||a==ABi||a==gCi||a==hCi||a==xCi||a==ECi||a==eDi||a==hDi||a==lDi||a==DDi||a==fFi||a==qFi||a==tFi}
function Eri(b,c){var a;a=e9h(D_h,48,1,4,0);a[0]=b;a[1]=c;a[2]=c;a[3]=b;return a}
function msi(c,d){var a,b;a=e9h(D_h,48,1,4,0);for(b=0;b<a.length;++b){if(d[b]==null){a[b]=c[b]}else{a[b]=String(d[b]+iBg+c[b])}}return a}
function ACi(b){var a;a=e9h(D_h,48,1,4,0);a[0]=b;a[1]=b;a[2]=b;a[3]=b;return a}
function sEi(c,b){var a;a=e9h(D_h,48,1,4,0);a[0]=c;a[1]=c;a[2]=b;a[3]=c;return a}
function jHi(a,f){var b,c,d,e;c=0;b=f;b<<=5;b+=a[0]-96;e=f;for(d=0;d<4&&e>0;++d){--e;b<<=5;b+=a[e]-96;c<<=6;c+=a[d]-95}return b^c}
function kHi(b,a){var c,g;c=true;g=b.indexOf(s1h)==0;if(a){if(g){c=false}else{c=pVi(b)}}return ioi(new hoi(),dpi,ACi(b),epi,c?bpi:cpi,g)}
function mHi(){return o_h}
function nHi(b,j,h,c){var f,g;koi();var a,d,e,i;d=jHi(b,h);e=wji(uqi,d);if(e<0){return kHi(String((f=j+h,mfi(b.length,j,f),ofi(b,j,f))),c)}else{a=vqi[e];i=a.a[0];if(!xVi(i,b,j,h)){return kHi(String((g=j+h,mfi(b.length,j,g),ofi(b,j,g))),c)}return a}}
function hoi(){}
_=hoi.prototype=new xdi();_.gC=mHi;_.tI=36;_.a=null;_.b=null;_.c=null;_.d=false;var roi,soi,toi,uoi,voi,woi,xoi,yoi,zoi,Aoi,Boi,Coi,Doi,Eoi,Foi,api,bpi,cpi,dpi,epi,fpi,gpi,hpi,ipi,jpi,kpi,lpi,mpi,npi,opi,ppi,qpi,rpi,spi,tpi,upi,vpi,wpi,xpi,ypi,zpi,Api,Bpi,Cpi,Dpi,Epi,Fpi,aqi,bqi,cqi,dqi,eqi,fqi,gqi,hqi,iqi,jqi,kqi,lqi,mqi,nqi,oqi,pqi,qqi,rqi,sqi,tqi,uqi,vqi,wqi,xqi,yqi,zqi,Aqi,Bqi,Cqi,Dqi,Eqi,Fqi,ari,bri,cri,dri,eri,fri,gri,hri,iri,jri,kri,lri,mri,nri,ori,pri,qri,rri,sri,tri,uri,vri,wri,xri,yri,zri,Ari,Bri,Cri,Dri,Fri,asi,bsi,csi,dsi,esi,fsi,gsi,hsi,isi,jsi,ksi,lsi,nsi,osi,psi,qsi,rsi,ssi,tsi,usi,vsi,wsi,xsi,ysi,zsi,Asi,Bsi,Csi,Dsi,Esi,Fsi,ati,bti,cti,dti,eti,fti,gti,hti,iti,jti,kti,lti,mti,nti,oti,pti,qti,rti,sti,tti,uti,vti,wti,xti,yti,zti,Ati,Bti,Cti,Dti,Eti,Fti,aui,bui,cui,dui,eui,fui,gui,hui,iui,jui,kui,lui,mui,nui,oui,pui,qui,rui,sui,tui,uui,vui,wui,xui,yui,zui,Aui,Bui,Cui,Dui,Eui,Fui,avi,bvi,cvi,dvi,evi,fvi,gvi,hvi,ivi,jvi,kvi,lvi,mvi,nvi,ovi,pvi,qvi,rvi,svi,tvi,uvi,vvi,wvi,xvi,yvi,zvi,Avi,Bvi,Cvi,Dvi,Evi,Fvi,awi,bwi,cwi,dwi,ewi,fwi,gwi,hwi,iwi,jwi,kwi,lwi,mwi,nwi,owi,pwi,qwi,rwi,swi,twi,uwi,vwi,wwi,xwi,ywi,zwi,Awi,Bwi,Cwi,Dwi,Ewi,Fwi,axi,bxi,cxi,dxi,exi,fxi,gxi,hxi,ixi,jxi,kxi,lxi,nxi,oxi,pxi,qxi,rxi,sxi,txi,uxi,vxi,wxi,xxi,yxi,zxi,Axi,Bxi,Cxi,Dxi,Exi,Fxi,ayi,byi,cyi,dyi,eyi,fyi,gyi,hyi,iyi,jyi,kyi,lyi,myi,nyi,oyi,pyi,qyi,ryi,syi,tyi,uyi,vyi,wyi,xyi,yyi,zyi,Ayi,Byi,Cyi,Dyi,Eyi,Fyi,azi,bzi,czi,dzi,ezi,fzi,gzi,hzi,izi,jzi,kzi,lzi,mzi,nzi,ozi,pzi,qzi,rzi,szi,tzi,uzi,vzi,wzi,xzi,yzi,zzi,Azi,Bzi,Czi,Dzi,Ezi,Fzi,aAi,bAi,cAi,dAi,eAi,fAi,gAi,hAi,iAi,jAi,kAi,lAi,mAi,nAi,oAi,pAi,qAi,rAi,sAi,tAi,uAi,vAi,wAi,xAi,yAi,zAi,AAi,BAi,CAi,DAi,EAi,FAi,aBi,bBi,cBi,dBi,eBi,fBi,gBi,hBi,iBi,jBi,kBi,lBi,mBi,nBi,oBi,pBi,qBi,rBi,sBi,tBi,uBi,vBi,wBi,xBi,yBi,zBi,ABi,BBi,CBi,DBi,EBi,FBi,aCi,bCi,cCi,dCi,eCi,fCi,gCi,hCi,iCi,jCi,kCi,lCi,mCi,nCi,oCi,pCi,qCi,rCi,sCi,tCi,uCi,vCi,wCi,xCi,yCi,zCi,BCi,CCi,DCi,ECi,FCi,aDi,bDi,cDi,dDi,eDi,fDi,gDi,hDi,iDi,jDi,kDi,lDi,mDi,nDi,oDi,pDi,qDi,rDi,sDi,tDi,uDi,vDi,wDi,xDi,yDi,zDi,ADi,BDi,CDi,DDi,EDi,FDi,aEi,bEi,cEi,dEi,eEi,fEi,gEi,hEi,iEi,jEi,kEi,lEi,mEi,nEi,oEi,pEi,qEi,rEi,tEi,uEi,vEi,wEi,xEi,yEi,zEi,AEi,BEi,CEi,DEi,EEi,FEi,aFi,bFi,cFi,dFi,eFi,fFi,gFi,hFi,iFi,jFi,kFi,lFi,mFi,nFi,oFi,pFi,qFi,rFi,sFi,tFi,uFi,vFi,wFi,xFi,yFi,zFi,AFi,BFi,CFi,DFi,EFi,FFi,aGi,bGi,cGi,dGi,eGi,fGi,gGi,hGi,iGi,jGi,kGi,lGi,mGi,nGi,oGi,pGi,qGi,rGi,sGi,tGi,uGi,vGi,wGi,xGi,yGi,zGi,AGi,BGi,CGi,DGi,EGi,FGi,aHi,bHi,cHi,dHi,eHi,fHi,gHi,hHi,iHi;function wHi(){wHi=v0i;uHi(new tHi(),null);xHi=vHi(new tHi(),oFg,oFg,1,false,false,false);BIi=vHi(new tHi(),t1h,t1h,45,false,false,false);uMi=vHi(new tHi(),u1h,u1h,0,false,false,false);hNi=vHi(new tHi(),w1h,w1h,45,false,false,false);AQi=vHi(new tHi(),ywg,ywg,29,true,false,false);nRi=vHi(new tHi(),x1h,x1h,0,false,false,false);BRi=vHi(new tHi(),oOg,oOg,45,false,false,false);rTi=vHi(new tHi(),y1h,y1h,45,false,false,false);dJi=vHi(new tHi(),z1h,z1h,4,true,false,false);mJi=vHi(new tHi(),A1h,A1h,0,false,false,false);qJi=vHi(new tHi(),B1h,B1h,0,false,false,false);gKi=vHi(new tHi(),C1h,C1h,41,true,false,false);xKi=vHi(new tHi(),D1h,D1h,46,true,false,false);AKi=vHi(new tHi(),E1h,E1h,41,true,false,false);EKi=vHi(new tHi(),F1h,F1h,45,false,false,false);bLi=vHi(new tHi(),b2h,b2h,0,false,false,false);hMi=vHi(new tHi(),c2h,c2h,0,false,false,false);BMi=vHi(new tHi(),d2h,d2h,42,true,false,false);CMi=vHi(new tHi(),e2h,e2h,42,true,false,false);DMi=vHi(new tHi(),f2h,f2h,42,true,false,false);EMi=vHi(new tHi(),g2h,g2h,42,true,false,false);FMi=vHi(new tHi(),h2h,h2h,42,true,false,false);aNi=vHi(new tHi(),i2h,i2h,42,true,false,false);AMi=vHi(new tHi(),j2h,j2h,0,false,false,false);fNi=vHi(new tHi(),k2h,k2h,22,true,false,false);pNi=vHi(new tHi(),qYg,qYg,0,false,false,false);bOi=vHi(new tHi(),m2h,m2h,15,true,false,false);jOi=vHi(new tHi(),n2h,n2h,0,false,false,false);nOi=vHi(new tHi(),o2h,o2h,0,false,false,false);fPi=vHi(new tHi(),p2h,p2h,57,false,false,false);lPi=vHi(new tHi(),q2h,q2h,57,false,false,false);mPi=vHi(new tHi(),r2h,r2h,57,false,false,false);xPi=vHi(new tHi(),s2h,s2h,57,false,false,false);tQi=vHi(new tHi(),t2h,t2h,46,true,false,false);wQi=vHi(new tHi(),u2h,u2h,0,false,false,false);FQi=vHi(new tHi(),v2h,v2h,0,false,false,false);xRi=vHi(new tHi(),x2h,x2h,53,false,false,false);yRi=vHi(new tHi(),tZg,tZg,53,false,false,false);aTi=vHi(new tHi(),fyg,fyg,40,false,true,false);gTi=vHi(new tHi(),qyg,qyg,40,false,true,false);lTi=vHi(new tHi(),uBg,uBg,37,true,false,true);qTi=vHi(new tHi(),y2h,y2h,45,false,false,false);sTi=vHi(new tHi(),z2h,z2h,46,true,false,false);FHi=vHi(new tHi(),A2h,A2h,0,false,false,false);xIi=vHi(new tHi(),B2h,B2h,0,false,false,false);zHi=vHi(new tHi(),C2h,C2h,0,false,false,false);aJi=vHi(new tHi(),D2h,D2h,45,false,false,false);EIi=vHi(new tHi(),E2h,E2h,0,false,false,false);FJi=vHi(new tHi(),F2h,F2h,0,false,false,false);tJi=vHi(new tHi(),a3h,a3h,7,true,false,false);BJi=vHi(new tHi(),c3h,c3h,0,false,false,false);DJi=vHi(new tHi(),d3h,d3h,0,false,false,false);lKi=vHi(new tHi(),e3h,e3h,0,false,false,false);pKi=vHi(new tHi(),f3h,f3h,0,false,false,false);sKi=vHi(new tHi(),w2g,w2g,51,true,false,false);uKi=vHi(new tHi(),dFg,dFg,50,true,false,false);gLi=vHi(new tHi(),g3h,g3h,0,false,false,false);vMi=vHi(new tHi(),h3h,h3h,0,false,false,false);wMi=vHi(new tHi(),i3h,i3h,0,false,false,false);nNi=vHi(new tHi(),j3h,j3h,48,true,false,false);sNi=vHi(new tHi(),k3h,k3h,0,false,false,false);tNi=vHi(new tHi(),l3h,l3h,0,false,false,false);zNi=vHi(new tHi(),n3h,n3h,0,false,false,false);kOi=vHi(new tHi(),o3h,o3h,0,false,false,false);ENi=vHi(new tHi(),p3h,p3h,0,false,false,false);aOi=vHi(new tHi(),q3h,q3h,0,false,false,false);FPi=vHi(new tHi(),r3h,r3h,0,false,false,false);gPi=vHi(new tHi(),z4g,z4g,0,false,false,false);rOi=vHi(new tHi(),s3h,s3h,0,false,false,false);bQi=vHi(new tHi(),t3h,t3h,0,false,false,false);zOi=vHi(new tHi(),o4g,o4g,0,false,false,false);gQi=vHi(new tHi(),u3h,u3h,0,false,false,false);nQi=vHi(new tHi(),v3h,v3h,0,false,false,false);fQi=vHi(new tHi(),w3h,w3h,51,true,false,false);hRi=vHi(new tHi(),y3h,y3h,44,true,false,false);vRi=vHi(new tHi(),z3h,z3h,0,false,false,false);uSi=vHi(new tHi(),A3h,A3h,52,false,false,false);aSi=vHi(new tHi(),B3h,B3h,0,false,false,false);ySi=vHi(new tHi(),C3h,C3h,19,false,false,false);wSi=vHi(new tHi(),D3h,D3h,0,false,false,false);jSi=vHi(new tHi(),E3h,E3h,0,false,false,false);gSi=vHi(new tHi(),F3h,F3h,0,false,false,false);xSi=vHi(new tHi(),a4h,a4h,52,false,false,false);hSi=vHi(new tHi(),b4h,b4h,0,false,false,false);CSi=vHi(new tHi(),d4h,d4h,0,false,false,false);vTi=vHi(new tHi(),e4h,e4h,0,false,false,false);wTi=vHi(new tHi(),f4h,f4h,52,false,false,false);DTi=vHi(new tHi(),g4h,g4h,49,true,false,false);ETi=vHi(new tHi(),sIg,sIg,38,false,false,false);FTi=vHi(new tHi(),h4h,h4h,0,false,false,false);wIi=vHi(new tHi(),i4h,i4h,49,true,false,false);yHi=vHi(new tHi(),C6g,C6g,0,false,false,false);CIi=vHi(new tHi(),u9g,u9g,2,true,false,false);fJi=vHi(new tHi(),j4h,j4h,0,false,false,false);cJi=vHi(new tHi(),lDg,lDg,3,true,false,false);iJi=vHi(new tHi(),k4h,k4h,0,false,false,false);rJi=vHi(new tHi(),D7g,D7g,45,false,false,false);oJi=vHi(new tHi(),s7g,s7g,0,false,false,false);aKi=vHi(new tHi(),l4h,l4h,0,false,false,false);CJi=vHi(new tHi(),m4h,m4h,0,false,false,false);EJi=vHi(new tHi(),p4h,p4h,0,false,false,false);cKi=vHi(new tHi(),q4h,q4h,0,false,false,false);mKi=vHi(new tHi(),r4h,r4h,59,false,false,false);rKi=vHi(new tHi(),s4h,s4h,0,false,false,false);jKi=vHi(new tHi(),t4h,t4h,0,false,false,false);rMi=vHi(new tHi(),srg,srg,9,true,false,false);iMi=vHi(new tHi(),u4h,u4h,64,false,false,false);zMi=vHi(new tHi(),v4h,v4h,0,false,false,false);cNi=vHi(new tHi(),Drg,Drg,20,true,false,false);gNi=vHi(new tHi(),hAg,hAg,23,false,true,false);dOi=vHi(new tHi(),w4h,w4h,0,false,false,false);fOi=vHi(new tHi(),Abh,Abh,16,true,false,false);gOi=vHi(new tHi(),qch,qch,0,false,false,false);FOi=vHi(new tHi(),x4h,x4h,18,true,false,false);BPi=vHi(new tHi(),y4h,y4h,0,false,false,false);nPi=vHi(new tHi(),dbh,dbh,0,false,false,false);wOi=vHi(new tHi(),A4h,A4h,17,false,false,false);sOi=vHi(new tHi(),B4h,B4h,0,false,false,false);vOi=vHi(new tHi(),pbh,pbh,0,false,false,false);AOi=vHi(new tHi(),C4h,C4h,0,false,false,false);DPi=vHi(new tHi(),D4h,D4h,0,false,false,false);DOi=vHi(new tHi(),E4h,E4h,50,true,false,false);wPi=vHi(new tHi(),F4h,F4h,0,false,false,false);lQi=vHi(new tHi(),a5h,a5h,0,false,false,false);iQi=vHi(new tHi(),zFg,zFg,24,false,false,false);hQi=vHi(new tHi(),b5h,b5h,0,false,false,false);DQi=vHi(new tHi(),heh,heh,0,false,false,false);dRi=vHi(new tHi(),c5h,c5h,0,false,false,false);ARi=vHi(new tHi(),d5h,d5h,0,false,false,false);rRi=vHi(new tHi(),f5h,f5h,0,false,false,false);uRi=vHi(new tHi(),g5h,g5h,0,false,false,false);tRi=vHi(new tHi(),h5h,h5h,0,false,false,false);wRi=vHi(new tHi(),i5h,i5h,0,false,false,false);zRi=vHi(new tHi(),AGg,AGg,52,false,false,false);bSi=vHi(new tHi(),j5h,j5h,0,false,false,false);kSi=vHi(new tHi(),k5h,k5h,0,false,false,false);pSi=vHi(new tHi(),lhh,lhh,52,false,false,false);CRi=vHi(new tHi(),l5h,l5h,0,false,false,false);qSi=vHi(new tHi(),m5h,m5h,0,false,false,false);FRi=vHi(new tHi(),n5h,n5h,0,false,false,false);iTi=vHi(new tHi(),o5h,o5h,0,false,false,false);oTi=vHi(new tHi(),q5h,q5h,0,false,false,false);nTi=vHi(new tHi(),r5h,r5h,0,false,false,false);DSi=vHi(new tHi(),s5h,s5h,0,false,false,false);cTi=vHi(new tHi(),Cdh,Cdh,0,false,false,false);BTi=vHi(new tHi(),t5h,t5h,0,false,false,false);zIi=vHi(new tHi(),u5h,u5h,51,true,false,false);AIi=vHi(new tHi(),v5h,v5h,0,false,false,false);iIi=vHi(new tHi(),w5h,w5h,0,false,false,false);FKi=vHi(new tHi(),x5h,x5h,48,true,false,false);sMi=vHi(new tHi(),smh,smh,10,true,false,false);kLi=vHi(new tHi(),y5h,y5h,0,false,false,false);gMi=vHi(new tHi(),z5h,z5h,0,false,false,false);xMi=vHi(new tHi(),B5h,B5h,0,false,false,false);eNi=vHi(new tHi(),C5h,C5h,0,false,false,false);kNi=vHi(new tHi(),D5h,D5h,12,true,false,false);iNi=vHi(new tHi(),E5h,E5h,0,false,false,false);rNi=vHi(new tHi(),pGg,pGg,13,true,false,false);BNi=vHi(new tHi(),wph,wph,62,false,false,false);cOi=vHi(new tHi(),F5h,F5h,0,false,false,false);dPi=vHi(new tHi(),a6h,a6h,0,false,false,false);sPi=vHi(new tHi(),b6h,b6h,0,false,false,false);bPi=vHi(new tHi(),c6h,c6h,0,false,false,false);qPi=vHi(new tHi(),d6h,d6h,0,false,false,false);hPi=vHi(new tHi(),e6h,e6h,0,false,false,false);vPi=vHi(new tHi(),g6h,g6h,0,false,false,false);zPi=vHi(new tHi(),h6h,h6h,0,false,false,false);aQi=vHi(new tHi(),i6h,i6h,57,false,false,false);pQi=vHi(new tHi(),j6h,j6h,0,false,false,false);aRi=vHi(new tHi(),k6h,k6h,0,false,false,false);BQi=vHi(new tHi(),l6h,l6h,55,true,false,false);gRi=vHi(new tHi(),m6h,m6h,0,false,false,false);sRi=vHi(new tHi(),n6h,n6h,0,false,false,false);tSi=vHi(new tHi(),BHg,BHg,33,true,false,false);lSi=vHi(new tHi(),o6h,o6h,45,false,false,false);hTi=vHi(new tHi(),kCg,kCg,39,true,false,true);BSi=vHi(new tHi(),cwg,cwg,34,false,true,true);kTi=vHi(new tHi(),fHg,fHg,36,true,false,false);pTi=vHi(new tHi(),p6h,p6h,0,false,false,false);jTi=vHi(new tHi(),r6h,r6h,0,false,false,false);fTi=vHi(new tHi(),vCg,vCg,39,true,false,true);ESi=vHi(new tHi(),FBg,FBg,39,true,false,true);tTi=vHi(new tHi(),s6h,s6h,0,false,false,false);CTi=vHi(new tHi(),t6h,t6h,0,false,false,false);ATi=vHi(new tHi(),u6h,u6h,0,false,false,false);qIi=vHi(new tHi(),v6h,v6h,0,false,false,false);oIi=vHi(new tHi(),w6h,w6h,0,false,false,false);uIi=vHi(new tHi(),x6h,x6h,0,false,false,false);sIi=vHi(new tHi(),y6h,y6h,0,false,false,false);kIi=vHi(new tHi(),z6h,z6h,0,false,false,false);hIi=vHi(new tHi(),A6h,A6h,43,false,true,false);mIi=vHi(new tHi(),C6h,C6h,0,false,false,false);jIi=vHi(new tHi(),D6h,D6h,0,false,false,false);eJi=vHi(new tHi(),E6h,E6h,5,false,true,false);nJi=vHi(new tHi(),F6h,F6h,0,false,false,false);lJi=vHi(new tHi(),a7h,a7h,50,true,false,false);dKi=vHi(new tHi(),axh,axh,0,false,false,false);gJi=vHi(new tHi(),b7h,b7h,0,false,false,false);wKi=vHi(new tHi(),c7h,c7h,0,false,false,false);kKi=vHi(new tHi(),d7h,d7h,0,false,false,false);qKi=vHi(new tHi(),e7h,e7h,51,true,false,false);yKi=vHi(new tHi(),f7h,f7h,0,false,false,false);fLi=vHi(new tHi(),h7h,h7h,0,false,false,false);bMi=vHi(new tHi(),i7h,j7h,0,false,false,false);eMi=vHi(new tHi(),k7h,k7h,51,true,false,false);pMi=vHi(new tHi(),l7h,l7h,0,false,false,false);fMi=vHi(new tHi(),wxh,wxh,0,false,false,false);oMi=vHi(new tHi(),m7h,m7h,51,true,false,false);dNi=vHi(new tHi(),n7h,n7h,51,true,false,false);jNi=vHi(new tHi(),DIg,DIg,47,true,false,false);ANi=vHi(new tHi(),o7h,o7h,65,true,false,false);CNi=vHi(new tHi(),p7h,p7h,0,false,false,false);FNi=vHi(new tHi(),q7h,q7h,0,false,false,false);yPi=vHi(new tHi(),s7h,s7h,0,false,false,false);EPi=vHi(new tHi(),t7h,t7h,0,false,false,false);APi=vHi(new tHi(),u7h,u7h,0,false,false,false);ePi=vHi(new tHi(),v7h,v7h,56,false,false,false);BOi=vHi(new tHi(),w7h,w7h,0,false,false,false);cQi=vHi(new tHi(),x7h,x7h,0,false,false,false);tOi=vHi(new tHi(),y7h,y7h,0,false,false,false);EOi=vHi(new tHi(),z7h,z7h,0,false,false,false);oPi=vHi(new tHi(),A7h,A7h,0,false,false,false);xOi=vHi(new tHi(),B7h,B7h,0,false,false,false);vQi=vHi(new tHi(),dxg,dxg,28,true,false,false);sQi=vHi(new tHi(),FKg,FKg,63,false,true,false);zQi=vHi(new tHi(),Dqg,Dqg,62,false,false,false);jRi=vHi(new tHi(),Eqg,Eqg,0,false,false,false);nSi=vHi(new tHi(),Fqg,Fqg,55,false,false,false);rSi=vHi(new tHi(),arg,arg,45,false,false,false);sSi=vHi(new tHi(),brg,brg,45,false,false,false);zSi=vHi(new tHi(),crg,crg,0,false,false,false);ASi=vHi(new tHi(),drg,drg,0,false,false,false);oSi=vHi(new tHi(),erg,erg,49,true,false,false);dSi=vHi(new tHi(),xvg,xvg,32,true,false,false);vSi=vHi(new tHi(),frg,frg,0,false,false,false);ERi=vHi(new tHi(),hIg,hIg,31,true,false,false);FSi=vHi(new tHi(),grg,grg,0,false,false,false);yTi=vHi(new tHi(),irg,irg,0,false,false,false);yIi=vHi(new tHi(),jrg,jrg,51,true,false,false);aIi=vHi(new tHi(),krg,krg,0,false,false,false);rIi=vHi(new tHi(),lrg,lrg,0,false,false,false);pIi=vHi(new tHi(),mrg,mrg,0,false,false,false);vIi=vHi(new tHi(),nrg,nrg,0,false,false,false);tIi=vHi(new tHi(),org,org,0,false,false,false);lIi=vHi(new tHi(),prg,prg,0,false,false,false);nIi=vHi(new tHi(),qrg,qrg,0,false,false,false);AHi=vHi(new tHi(),rrg,rrg,0,false,false,false);BHi=vHi(new tHi(),yEg,yEg,51,true,false,false);FIi=vHi(new tHi(),trg,trg,49,true,false,false);wJi=vHi(new tHi(),urg,urg,54,true,false,false);yJi=vHi(new tHi(),vrg,vrg,0,false,false,false);kJi=vHi(new tHi(),wrg,wrg,0,false,false,false);bKi=vHi(new tHi(),xrg,xrg,0,false,false,false);hJi=vHi(new tHi(),nwg,nwg,6,false,true,false);tKi=vHi(new tHi(),yrg,yrg,0,false,false,false);hKi=vHi(new tHi(),xLh,xLh,0,false,false,false);nKi=vHi(new tHi(),zrg,zrg,51,true,false,false);DKi=vHi(new tHi(),Arg,Arg,0,false,false,false);uLi=vHi(new tHi(),Brg,Crg,0,false,false,false);vLi=vHi(new tHi(),Erg,Frg,0,false,false,false);lLi=vHi(new tHi(),asg,bsg,0,false,false,false);tLi=vHi(new tHi(),csg,dsg,0,false,false,false);zLi=vHi(new tHi(),esg,fsg,0,false,false,false);ALi=vHi(new tHi(),gsg,hsg,0,false,false,false);wLi=vHi(new tHi(),jsg,ksg,0,false,false,false);xLi=vHi(new tHi(),lsg,msg,0,false,false,false);bNi=vHi(new tHi(),nsg,nsg,0,false,false,false);xNi=vHi(new tHi(),osg,osg,0,false,false,false);oNi=vHi(new tHi(),psg,psg,0,false,false,false);yNi=vHi(new tHi(),eGg,eGg,14,true,false,false);lOi=vHi(new tHi(),qsg,qsg,0,false,false,false);iOi=vHi(new tHi(),rsg,rsg,44,true,false,false);cPi=vHi(new tHi(),ssg,ssg,0,false,false,false);rPi=vHi(new tHi(),usg,usg,0,false,false,false);uOi=vHi(new tHi(),vsg,vsg,43,false,true,false);oOi=vHi(new tHi(),wsg,wsg,0,false,false,false);CPi=vHi(new tHi(),xsg,xsg,0,false,false,false);jQi=vHi(new tHi(),iJg,iJg,60,true,false,false);eRi=vHi(new tHi(),ysg,ysg,0,false,false,false);EQi=vHi(new tHi(),BMh,BMh,0,false,false,false);kRi=vHi(new tHi(),zsg,zsg,0,false,false,false);iSi=vHi(new tHi(),Asg,Asg,0,false,false,false);cSi=vHi(new tHi(),Bsg,Bsg,51,true,false,false);bTi=vHi(new tHi(),Csg,Csg,0,false,false,false);uTi=vHi(new tHi(),Dsg,Dsg,0,false,false,false);CHi=vHi(new tHi(),Fsg,atg,0,false,false,false);DIi=vHi(new tHi(),btg,btg,49,true,false,false);pJi=vHi(new tHi(),ctg,dtg,0,false,false,false);sJi=vHi(new tHi(),etg,etg,0,false,false,false);uJi=vHi(new tHi(),aDg,aDg,8,true,false,false);eKi=vHi(new tHi(),ftg,ftg,51,true,false,false);aLi=vHi(new tHi(),gtg,gtg,0,false,false,false);jLi=vHi(new tHi(),htg,htg,0,false,false,false);dMi=vHi(new tHi(),itg,itg,61,true,false,false);tMi=vHi(new tHi(),Axg,Axg,11,true,false,false);DLi=vHi(new tHi(),ktg,ltg,0,false,false,false);yMi=vHi(new tHi(),uNh,vNh,0,false,false,false);wNi=vHi(new tHi(),mtg,mtg,0,false,false,false);uNi=vHi(new tHi(),ntg,ntg,0,false,false,false);qNi=vHi(new tHi(),otg,otg,0,false,false,false);hOi=vHi(new tHi(),ptg,ptg,0,false,false,false);mOi=vHi(new tHi(),qtg,qtg,0,false,false,false);aPi=vHi(new tHi(),rtg,rtg,0,false,false,false);COi=vHi(new tHi(),stg,stg,0,false,false,false);tPi=vHi(new tHi(),ttg,ttg,0,false,false,false);kQi=vHi(new tHi(),tJg,tJg,25,true,false,false);mQi=vHi(new tHi(),vtg,vtg,26,true,false,false);uQi=vHi(new tHi(),oxg,oxg,27,true,false,false);fRi=vHi(new tHi(),wtg,wtg,0,false,false,false);iRi=vHi(new tHi(),xtg,xtg,0,false,false,false);lRi=vHi(new tHi(),ytg,ytg,0,false,false,false);mRi=vHi(new tHi(),ztg,ztg,0,false,false,false);oRi=vHi(new tHi(),Atg,Atg,0,false,false,false);eSi=vHi(new tHi(),Btg,Btg,0,false,false,false);dTi=vHi(new tHi(),qHg,qHg,35,true,false,false);eTi=vHi(new tHi(),Ctg,Dtg,0,false,false,false);xTi=vHi(new tHi(),Etg,Etg,0,false,false,false);eIi=vHi(new tHi(),aug,aug,0,false,false,false);AJi=vHi(new tHi(),bug,bug,0,false,false,false);zJi=vHi(new tHi(),cug,cug,0,false,false,false);xJi=vHi(new tHi(),dug,dug,0,false,false,false);jMi=vHi(new tHi(),eug,eug,0,false,false,false);iLi=vHi(new tHi(),fug,fug,0,false,false,false);vNi=vHi(new tHi(),gug,gug,0,false,false,false);lNi=vHi(new tHi(),hug,hug,0,false,false,false);DNi=vHi(new tHi(),iug,iug,0,false,false,false);yOi=vHi(new tHi(),jug,jug,0,false,false,false);rQi=vHi(new tHi(),mug,mug,0,false,false,false);xQi=vHi(new tHi(),nug,nug,0,false,false,false);bRi=vHi(new tHi(),oug,oug,0,false,false,false);cRi=vHi(new tHi(),EJg,EJg,30,true,false,false);qRi=vHi(new tHi(),pug,pug,0,false,false,false);fSi=vHi(new tHi(),qug,qug,0,false,false,false);mTi=vHi(new tHi(),rug,rug,0,false,false,false);fIi=vHi(new tHi(),sug,sug,0,false,false,false);bJi=vHi(new tHi(),tug,tug,50,true,false,false);vKi=vHi(new tHi(),uug,uug,0,false,false,false);dLi=vHi(new tHi(),vug,vug,0,false,false,false);cLi=vHi(new tHi(),xug,xug,0,false,false,false);mNi=vHi(new tHi(),yug,yug,0,false,false,false);qOi=vHi(new tHi(),zug,zug,56,false,false,false);dQi=vHi(new tHi(),Aug,Aug,0,false,false,false);jPi=vHi(new tHi(),Bug,Bug,0,false,false,false);oQi=vHi(new tHi(),Cug,Cug,0,false,false,false);mSi=vHi(new tHi(),Dug,Dug,0,false,false,false);DHi=vHi(new tHi(),Eug,Fug,0,false,false,false);oKi=vHi(new tHi(),avg,avg,0,false,false,false);eLi=vHi(new tHi(),cvg,cvg,54,true,false,false);BLi=vHi(new tHi(),dvg,evg,0,false,false,false);oLi=vHi(new tHi(),fvg,gvg,0,false,false,false);aMi=vHi(new tHi(),hvg,ivg,0,false,false,false);pOi=vHi(new tHi(),jvg,jvg,0,false,false,false);uPi=vHi(new tHi(),kvg,kvg,0,false,false,false);pPi=vHi(new tHi(),lvg,lvg,0,false,false,false);qQi=vHi(new tHi(),nvg,nvg,0,false,false,false);CQi=vHi(new tHi(),ovg,ovg,0,false,false,false);EHi=vHi(new tHi(),pvg,qvg,0,false,false,false);bIi=vHi(new tHi(),rvg,svg,0,false,false,false);fKi=vHi(new tHi(),tvg,tvg,0,false,false,false);hLi=vHi(new tHi(),uvg,uvg,0,false,false,false);cMi=vHi(new tHi(),vvg,wvg,0,false,false,false);ELi=vHi(new tHi(),yvg,zvg,0,false,false,false);CLi=vHi(new tHi(),Avg,Bvg,0,false,false,false);yQi=vHi(new tHi(),Cvg,Cvg,0,false,false,false);cIi=vHi(new tHi(),Dvg,Evg,0,false,false,false);vJi=vHi(new tHi(),BWh,BWh,0,false,false,false);mMi=vHi(new tHi(),Fvg,Fvg,0,false,false,false);nMi=vHi(new tHi(),awg,awg,0,false,false,false);qMi=vHi(new tHi(),bwg,dwg,59,false,false,false);mLi=vHi(new tHi(),ewg,fwg,0,false,false,false);iPi=vHi(new tHi(),gwg,gwg,0,false,false,false);kPi=vHi(new tHi(),hwg,hwg,0,false,false,false);DRi=vHi(new tHi(),iwg,iwg,0,false,false,false);zTi=vHi(new tHi(),jwg,jwg,0,false,false,false);gIi=vHi(new tHi(),kwg,kwg,58,false,false,false);iKi=vHi(new tHi(),lwg,lwg,0,false,false,false);lMi=vHi(new tHi(),mwg,mwg,0,false,false,false);yLi=vHi(new tHi(),owg,pwg,0,false,false,false);sLi=vHi(new tHi(),qwg,rwg,0,false,false,false);eOi=vHi(new tHi(),swg,twg,0,false,false,false);eQi=vHi(new tHi(),uwg,uwg,0,false,false,false);pRi=vHi(new tHi(),vwg,wwg,0,false,false,false);dIi=vHi(new tHi(),xwg,zwg,0,false,false,false);jJi=vHi(new tHi(),Awg,Awg,0,false,false,false);kMi=vHi(new tHi(),Bwg,Bwg,0,false,false,false);pLi=vHi(new tHi(),Cwg,Dwg,0,false,false,false);qLi=vHi(new tHi(),Ewg,Fwg,0,false,false,false);rLi=vHi(new tHi(),axg,bxg,0,false,false,false);FLi=vHi(new tHi(),cxg,exg,0,false,false,false);zKi=vHi(new tHi(),fxg,fxg,0,false,false,false);nLi=vHi(new tHi(),gxg,hxg,0,false,false,false);CKi=f9h(F_h,50,10,[xHi,BIi,uMi,hNi,AQi,nRi,BRi,rTi,dJi,mJi,qJi,gKi,xKi,AKi,EKi,bLi,hMi,BMi,CMi,DMi,EMi,FMi,aNi,AMi,fNi,pNi,bOi,jOi,nOi,fPi,lPi,mPi,xPi,tQi,wQi,FQi,xRi,yRi,aTi,gTi,lTi,qTi,sTi,FHi,xIi,zHi,aJi,EIi,FJi,tJi,BJi,DJi,lKi,pKi,sKi,uKi,gLi,vMi,wMi,nNi,sNi,tNi,zNi,kOi,ENi,aOi,FPi,gPi,rOi,bQi,zOi,gQi,nQi,fQi,hRi,vRi,uSi,aSi,ySi,wSi,jSi,gSi,xSi,hSi,CSi,vTi,wTi,DTi,ETi,FTi,wIi,yHi,CIi,fJi,cJi,iJi,rJi,oJi,aKi,CJi,EJi,cKi,mKi,rKi,jKi,rMi,iMi,zMi,cNi,gNi,dOi,fOi,gOi,FOi,BPi,nPi,wOi,sOi,vOi,AOi,DPi,DOi,wPi,lQi,iQi,hQi,DQi,dRi,ARi,rRi,uRi,tRi,wRi,zRi,bSi,kSi,pSi,CRi,qSi,FRi,iTi,oTi,nTi,DSi,cTi,BTi,zIi,AIi,iIi,FKi,sMi,kLi,gMi,xMi,eNi,kNi,iNi,rNi,BNi,cOi,dPi,sPi,bPi,qPi,hPi,vPi,zPi,aQi,pQi,aRi,BQi,gRi,sRi,tSi,lSi,hTi,BSi,kTi,pTi,jTi,fTi,ESi,tTi,CTi,ATi,qIi,oIi,uIi,sIi,kIi,hIi,mIi,jIi,eJi,nJi,lJi,dKi,gJi,wKi,kKi,qKi,yKi,fLi,bMi,eMi,pMi,fMi,oMi,dNi,jNi,ANi,CNi,FNi,yPi,EPi,APi,ePi,BOi,cQi,tOi,EOi,oPi,xOi,vQi,sQi,zQi,jRi,nSi,rSi,sSi,zSi,ASi,oSi,dSi,vSi,ERi,FSi,yTi,yIi,aIi,rIi,pIi,vIi,tIi,lIi,nIi,AHi,BHi,FIi,wJi,yJi,kJi,bKi,hJi,tKi,hKi,nKi,DKi,uLi,vLi,lLi,tLi,zLi,ALi,wLi,xLi,bNi,xNi,oNi,yNi,lOi,iOi,cPi,rPi,uOi,oOi,CPi,jQi,eRi,EQi,kRi,iSi,cSi,bTi,uTi,CHi,DIi,pJi,sJi,uJi,eKi,aLi,jLi,dMi,tMi,DLi,yMi,wNi,uNi,qNi,hOi,mOi,aPi,COi,tPi,kQi,mQi,uQi,fRi,iRi,lRi,mRi,oRi,eSi,dTi,eTi,xTi,eIi,AJi,zJi,xJi,jMi,iLi,vNi,lNi,DNi,yOi,rQi,xQi,bRi,cRi,qRi,fSi,mTi,fIi,bJi,vKi,dLi,cLi,mNi,qOi,dQi,jPi,oQi,mSi,DHi,oKi,eLi,BLi,oLi,aMi,pOi,uPi,pPi,qQi,CQi,EHi,bIi,fKi,hLi,cMi,ELi,CLi,yQi,cIi,vJi,mMi,nMi,qMi,mLi,iPi,kPi,DRi,zTi,gIi,iKi,lMi,yLi,sLi,eOi,eQi,pRi,dIi,jJi,kMi,pLi,qLi,rLi,FLi,zKi,nLi]);BKi=f9h(B_h,0,-1,[1057,1090,1255,1321,1552,1585,1651,1717,68162,68899,69059,69764,70020,70276,71077,71205,72134,72232,72264,72296,72328,72360,72392,73351,74312,75209,78124,78284,78476,79149,79309,79341,79469,81295,81487,82224,84498,84626,86164,86292,86612,86676,87445,3183041,3186241,3198017,3218722,3226754,3247715,3256803,3263971,3264995,3289252,3291332,3295524,3299620,3326725,3379303,3392679,3448233,3460553,3461577,3510347,3546604,3552364,3556524,3576461,3586349,3588141,3590797,3596333,3622062,3625454,3627054,3675728,3749042,3771059,3771571,3776211,3782323,3782963,3784883,3785395,3788979,3815476,3839605,3885110,3917911,3948984,3951096,135304769,135858241,136498210,136906434,137138658,137512995,137531875,137548067,137629283,137645539,137646563,137775779,138529956,138615076,139040932,140954086,141179366,141690439,142738600,143013512,146979116,147175724,147475756,147902637,147936877,148017645,148131885,148228141,148229165,148309165,148395629,148551853,148618829,149076462,149490158,149572782,151277616,151639440,153268914,153486514,153563314,153750706,153763314,153914034,154406067,154417459,154600979,154678323,154680979,154866835,155366708,155375188,155391572,155465780,155869364,158045494,168988979,169321621,169652752,173151309,174240818,174247297,174669292,175391532,176638123,177380397,177879204,177886734,180753473,181020073,181503558,181686320,181999237,181999311,182048201,182074866,182078003,182083764,182920847,184716457,184976961,185145071,187281445,187872052,188100653,188875944,188919873,188920457,189203987,189371817,189414886,189567458,190266670,191318187,191337609,202479203,202493027,202835587,202843747,203013219,203036048,203045987,203177552,203898516,204648562,205067918,205078130,205096654,205689142,205690439,205766017,205988909,207213161,207794484,207800999,208023602,208213644,208213647,210310273,210940978,213325049,213946445,214055079,215125040,215134273,215135028,215237420,215418148,215553166,215553394,215563858,215627949,215754324,217529652,217713834,217732628,218731945,221417045,221424946,221493746,221515401,221658189,221844577,221908140,221910626,221921586,222659762,225001091,236105833,236113965,236194995,236195427,236206132,236206387,236211683,236212707,236381647,236571826,237124271,238172205,238210544,238270764,238435405,238501172,239224867,239257644,239710497,240307721,241208789,241241557,241318060,241319404,241343533,241344069,241405397,241765845,243864964,244502085,244946220,245109902,247647266,247707956,248648814,248648836,248682161,248986932,249058914,249697357,252132601,252135604,252317348,255007012,255278388,256365156,257566121,269763372,271202790,271863856,272049197,272127474,272770631,274339449,274939471,275388004,275388005,275388006,275977800,278267602,278513831,278712622,281613765,281683369,282120228,282250732,282508942,283743649,283787570,284710386,285391148,285478533,285854898,285873762,286931113,288964227,289445441,289689648,291671489,303512884,305319975,305610036,305764101,308448294,308675890,312085683,312264750,315032867,316391000,317331042,317902135,318950711,319447220,321499182,322538804,323145200,337067316,337826293,339905989,340833697,341457068,345302593,349554733,349771471,349786245,350819405,356072847,370349192,373962798,374509141,375558638,375574835,376053993,383276530,383373833,383407586,384439906,386079012,404133513,404307343,407031852,408072233,409112005,409608425,409771500,419040932,437730612,439529766,442616365,442813037,443157674,443295316,450118444,450482697,456789668,459935396,471217869,474073645,476230702,476665218,476717289,483014825,485083298,489306281,538364390,540675748,543819186,543958612,576960820,577242548,610515252,642202932,644420819])}
function vHi(g,d,a,c,f,e,b){wHi();g.e=d;g.a=a;g.d=c;g.g=f;g.f=e;g.c=b;g.b=false;return g}
function uHi(b,a){wHi();b.e=a;b.a=a;b.d=0;b.g=false;b.f=false;b.c=false;b.b=true;return b}
function aUi(a,e){var b,c,d;b=e;b<<=5;b+=a[0]-96;d=e;for(c=0;c<4&&d>0;++c){--d;b<<=5;b+=a[d]-96}return b}
function bUi(a,i,g){var e,f;wHi();var b,c,d,h;c=aUi(a,g);d=wji(BKi,c);if(d<0){return uHi(new tHi(),String((e=i+g,mfi(a.length,i,e),ofi(a,i,e))))}else{b=CKi[d];h=b.e;if(!xVi(h,a,i,g)){return uHi(new tHi(),String((f=i+g,mfi(a.length,i,f),ofi(a,i,f))))}return b}}
function cUi(){return q_h}
function tHi(){}
_=tHi.prototype=new xdi();_.gC=cUi;_.tI=37;_.a=null;_.b=false;_.c=false;_.d=0;_.e=null;_.f=false;_.g=false;var xHi,yHi,zHi,AHi,BHi,CHi,DHi,EHi,FHi,aIi,bIi,cIi,dIi,eIi,fIi,gIi,hIi,iIi,jIi,kIi,lIi,mIi,nIi,oIi,pIi,qIi,rIi,sIi,tIi,uIi,vIi,wIi,xIi,yIi,zIi,AIi,BIi,CIi,DIi,EIi,FIi,aJi,bJi,cJi,dJi,eJi,fJi,gJi,hJi,iJi,jJi,kJi,lJi,mJi,nJi,oJi,pJi,qJi,rJi,sJi,tJi,uJi,vJi,wJi,xJi,yJi,zJi,AJi,BJi,CJi,DJi,EJi,FJi,aKi,bKi,cKi,dKi,eKi,fKi,gKi,hKi,iKi,jKi,kKi,lKi,mKi,nKi,oKi,pKi,qKi,rKi,sKi,tKi,uKi,vKi,wKi,xKi,yKi,zKi,AKi,BKi,CKi,DKi,EKi,FKi,aLi,bLi,cLi,dLi,eLi,fLi,gLi,hLi,iLi,jLi,kLi,lLi,mLi,nLi,oLi,pLi,qLi,rLi,sLi,tLi,uLi,vLi,wLi,xLi,yLi,zLi,ALi,BLi,CLi,DLi,ELi,FLi,aMi,bMi,cMi,dMi,eMi,fMi,gMi,hMi,iMi,jMi,kMi,lMi,mMi,nMi,oMi,pMi,qMi,rMi,sMi,tMi,uMi,vMi,wMi,xMi,yMi,zMi,AMi,BMi,CMi,DMi,EMi,FMi,aNi,bNi,cNi,dNi,eNi,fNi,gNi,hNi,iNi,jNi,kNi,lNi,mNi,nNi,oNi,pNi,qNi,rNi,sNi,tNi,uNi,vNi,wNi,xNi,yNi,zNi,ANi,BNi,CNi,DNi,ENi,FNi,aOi,bOi,cOi,dOi,eOi,fOi,gOi,hOi,iOi,jOi,kOi,lOi,mOi,nOi,oOi,pOi,qOi,rOi,sOi,tOi,uOi,vOi,wOi,xOi,yOi,zOi,AOi,BOi,COi,DOi,EOi,FOi,aPi,bPi,cPi,dPi,ePi,fPi,gPi,hPi,iPi,jPi,kPi,lPi,mPi,nPi,oPi,pPi,qPi,rPi,sPi,tPi,uPi,vPi,wPi,xPi,yPi,zPi,APi,BPi,CPi,DPi,EPi,FPi,aQi,bQi,cQi,dQi,eQi,fQi,gQi,hQi,iQi,jQi,kQi,lQi,mQi,nQi,oQi,pQi,qQi,rQi,sQi,tQi,uQi,vQi,wQi,xQi,yQi,zQi,AQi,BQi,CQi,DQi,EQi,FQi,aRi,bRi,cRi,dRi,eRi,fRi,gRi,hRi,iRi,jRi,kRi,lRi,mRi,nRi,oRi,pRi,qRi,rRi,sRi,tRi,uRi,vRi,wRi,xRi,yRi,zRi,ARi,BRi,CRi,DRi,ERi,FRi,aSi,bSi,cSi,dSi,eSi,fSi,gSi,hSi,iSi,jSi,kSi,lSi,mSi,nSi,oSi,pSi,qSi,rSi,sSi,tSi,uSi,vSi,wSi,xSi,ySi,zSi,ASi,BSi,CSi,DSi,ESi,FSi,aTi,bTi,cTi,dTi,eTi,fTi,gTi,hTi,iTi,jTi,kTi,lTi,mTi,nTi,oTi,pTi,qTi,rTi,sTi,tTi,uTi,vTi,wTi,xTi,yTi,zTi,ATi,BTi,CTi,DTi,ETi,FTi;function qWi(){qWi=v0i;oXi=f9h(A_h,42,-1,[60,62]);pXi=f9h(A_h,42,-1,[60,47]);wXi=f9h(A_h,42,-1,[93,93]);vXi=f9h(A_h,42,-1,[65533]);yXi=f9h(A_h,42,-1,[32]);nXi=f9h(A_h,42,-1,[10]);lXi=lfi(ixg);tXi=lfi(jxg);CXi=lfi(kxg);EXi=lfi(lxg);BXi=f9h(A_h,42,-1,[116,105,116,108,101]);xXi=f9h(A_h,42,-1,[115,99,114,105,112,116]);zXi=f9h(A_h,42,-1,[115,116,121,108,101]);uXi=f9h(A_h,42,-1,[112,108,97,105,110,116,101,120,116]);DXi=f9h(A_h,42,-1,[120,109,112]);AXi=f9h(A_h,42,-1,[116,101,120,116,97,114,101,97]);mXi=f9h(A_h,42,-1,[105,102,114,97,109,101]);qXi=f9h(A_h,42,-1,[110,111,101,109,98,101,100]);sXi=f9h(A_h,42,-1,[110,111,115,99,114,105,112,116]);rXi=f9h(A_h,42,-1,[110,111,102,114,97,109,101,115])}
function hWi(a){var b;a.cb&&(wHi(),FOi)==a.pb&&(koi(),pri)==a.l;if(a.l){b=xfi(a.F,0,a.ab);if(!a.w&&a.A&&a.B&&poi(a.l)){b=aYi(b)}tUi(a.m,a.l,b,a.tb)}}
function iWi(a){a.cb&&(koi(),pri)==a.l&&(wHi(),FOi)==a.pb;if(a.l){if(a.A){if(ooi(a.l)){if(a.B){tUi(a.m,a.l,a.l.a[0],a.tb)}else{tUi(a.m,a.l,cNh,a.tb)}}else{tUi(a.m,a.l,cNh,a.tb)}}else{if((koi(),wDi)==a.l||kvi==a.l){mxg+a.l.a[0]+nxg}tUi(a.m,a.l,cNh,a.tb)}}}
function jWi(b,a){switch(b.p.b){case 2:--b.ab;kWi(b,32);kWi(b,45);case 0:kWi(b,a);break;case 1:DWi(b,pxg);}}
function kWi(c,a){var b;if(c.ab==c.F.length){b=e9h(A_h,42,-1,c.ab+(c.ab>>1),1);Afi(c.F,0,b,0,c.F.length);c.F=b}c.F[c.ab++]=a}
function lWi(f,a,d,b){var c,e;e=f.ab+b;if(f.F.length<e){c=e9h(A_h,42,-1,e+(e>>1),1);Afi(f.F,0,c,0,f.F.length);f.F=c}Afi(a,d,f.F,f.ab,b);f.ab=e}
function mWi(a){switch(a.p.b){case 2:kWi(a,32);case 0:kWi(a,45);break;case 1:DWi(a,pxg);}}
function nWi(c,a){var b;if(c.mb==c.lb.length){b=e9h(A_h,42,-1,c.lb.length+1024,1);Afi(c.lb,0,b,0,c.lb.length);c.lb=b}c.lb[c.mb++]=a}
function oWi(a){a.l=nHi(a.lb,0,a.mb,a.db!=(Fli(),ami));if(!a.m){a.m=sUi(new rUi(),a.bb)}if(yUi(a.m,a.l)){qxg+a.l.a[0]+rxg;a.l=null}}
function rWi(a){switch(a.r.d){case 36:a.s=BXi;return;case 31:a.s=xXi;return;case 33:a.s=zXi;return;case 30:a.s=uXi;return;case 38:a.s=DXi;return;case 35:a.s=AXi;return;case 47:a.s=mXi;return;case 60:a.s=qXi;return;case 26:a.s=sXi;return;case 25:a.s=rXi;return;default:return;}}
function sWi(c,a,b){c.h=true;c.D=true;jUi(c,a,b);xYi(c.qb,nXi,0,1);c.u=2147483647}
function tWi(c,b,a){if(c.sb){EYi(c.qb,c.F,0,c.ab-b)}c.u=a+1}
function uWi(d,c,b){var a;d.u=b+1;d.kb=0;a=!d.m?(wUi(),bVi):d.m;if(d.w){cZi(d.qb,d.pb)}else{i0i(d.qb,d.pb,a,c)}bXi(d);return d.kb}
function xWi(b,c,a){if((a&-2)!=0){lWi(b,c,0,c.length)}else{xYi(b.qb,c,0,c.length)}}
function vWi(b,c,a){if((a&-2)!=0){kWi(b,c[0])}else{xYi(b.qb,c,0,1)}}
function wWi(b,a){if((a&-2)!=0){lWi(b,b.lb,0,b.mb)}else{zWi(b)}}
function yWi(c,a,b){c.h=true;c.D=true;jUi(c,a,b);xYi(c.qb,vXi,0,1);c.u=2147483647}
function zWi(a){if(a.mb>0){xYi(a.qb,a.lb,0,a.mb)}}
function AWi(a){if(a.eb){return sUi(new rUi(),a.bb)}else{return wUi(),bVi}}
function BWi(a){a.lb=null;a.F=null;a.ob=null;a.gb=null;a.v=null;a.pb=null;a.l=null;dZi(a.qb);if(a.m){vUi(a.m,a.bb);a.m=null}}
function CWi(j){var a,b,e,h,i,k;i=j.kb;h=j.hb;c:for(;;){switch(i){case 53:xYi(j.qb,oXi,0,1);break c;case 4:xYi(j.qb,oXi,0,1);break c;case 37:if(j.C<j.s.length){break c}else{break c}case 5:xYi(j.qb,pXi,0,2);break c;case 6:break c;case 7:case 14:case 48:break c;case 8:break c;case 9:case 10:break c;case 11:case 12:case 13:break c;case 15:tWi(j,0,0);break c;case 59:aXi(j);tWi(j,0,0);break c;case 16:j.ab=0;tWi(j,0,0);break c;case 38:tWi(j,0,0);break c;case 39:if(j.C<6){tWi(j,0,0)}else{j.v=cNh;j.gb=null;j.ob=null;j.y=true;j.u=1;FYi(j.qb,j.v,j.gb,j.ob,j.y);break c}break c;case 30:case 32:case 35:tWi(j,0,0);break c;case 34:tWi(j,2,0);break c;case 33:case 31:tWi(j,1,0);break c;case 36:tWi(j,3,0);break c;case 17:case 18:j.y=true;j.u=1;FYi(j.qb,j.v,j.gb,j.ob,j.y);break c;case 19:j.v=String(xfi(j.lb,0,j.mb));j.y=true;j.u=1;FYi(j.qb,j.v,j.gb,j.ob,j.y);break c;case 40:case 41:case 20:case 21:j.y=true;j.u=1;FYi(j.qb,j.v,j.gb,j.ob,j.y);break c;case 22:case 23:j.y=true;j.gb=xfi(j.F,0,j.ab);j.u=1;FYi(j.qb,j.v,j.gb,j.ob,j.y);break c;case 24:case 25:j.y=true;j.u=1;FYi(j.qb,j.v,j.gb,j.ob,j.y);break c;case 26:case 27:j.y=true;j.ob=xfi(j.F,0,j.ab);j.u=1;FYi(j.qb,j.v,j.gb,j.ob,j.y);break c;case 28:j.y=true;j.u=1;FYi(j.qb,j.v,j.gb,j.ob,j.y);break c;case 29:j.u=1;FYi(j.qb,j.v,j.gb,j.ob,j.y);break c;case 42:wWi(j,h);i=h;continue;case 44:g:for(;;){++j.x;d:for(;;){if(j.z==-1){break d}if(j.x==(rVi(),sVi)[j.z].length){break d}if(j.x>sVi[j.z].length){break g}else if(0<sVi[j.z][j.x]){--j.z}else{break d}}f:for(;;){if(j.z<j.E){break g}if(j.x==(rVi(),sVi)[j.E].length){j.o=j.E;j.nb=j.mb;++j.E}else if(j.x>sVi[j.E].length){break g}else if(0>sVi[j.E][j.x]){++j.E}else{break f}}if(j.z<j.E){break g}continue}if(j.o==-1){wWi(j,h);i=h;continue c}else{a=(rVi(),sVi)[j.o];if(a[a.length-1]!=59){if((h&-2)!=0){if(j.nb==j.mb){b=0}else{b=j.lb[j.nb]}if(b>=48&&b<=57||b>=65&&b<=90||b>=97&&b<=122){lWi(j,j.lb,0,j.mb);i=h;continue c}}}k=tVi[j.o];xWi(j,k,h);if(j.nb<j.mb){if((h&-2)!=0){for(e=j.nb;e<j.mb;++e){kWi(j,j.lb[e])}}else{xYi(j.qb,j.lb,j.nb,j.mb-j.nb)}}i=h;continue c}case 43:case 46:case 45:if(j.ib){}else{sxg+xfi(j.lb,0,j.mb)+rxg;wWi(j,h);i=h;continue}EWi(j,h);i=h;continue;case 0:default:break c;}}eZi(j.qb);return}
function DWi(c,a){var b;b=a1i(new F0i(),a,c);throw b}
function EWi(c,b){var a,d;if(c.rb>=128&&c.rb<=159){d=(rVi(),uVi)[c.rb-128];vWi(c,d,b)}else if(c.rb==13){vWi(c,nXi,b)}else if(c.rb==12&&c.t!=(Fli(),ami)){if(c.t==(Fli(),bmi)){vWi(c,yXi,b)}else if(c.t==cmi){DWi(c,txg)}}else if(c.rb>=0&&c.rb<=8||c.rb==11||c.rb>=14&&c.rb<=31||c.rb==127){uxg+oUi(c.rb&65535)+vxg;vWi(c,vXi,b)}else if((c.rb&63488)==55296){vWi(c,vXi,b)}else if((c.rb&65534)==65534){vWi(c,vXi,b)}else if(c.rb>=64976&&c.rb<=65007){vWi(c,vXi,b)}else if(c.rb<=65535){a=c.rb&65535;c.n[0]=a;vWi(c,c.n,b)}else if(c.rb<=1114111){c.k[0]=55232+(c.rb>>10)&65535;c.k[1]=56320+(c.rb&1023)&65535;xWi(c,c.k,b)}else{vWi(c,vXi,b)}}
function aXi(a){switch(a.p.b){case 2:kWi(a,32);break;case 1:DWi(a,wxg);}}
function bXi(a){if(a.eb){a.m=null}else{vUi(a.m,a.bb)}}
function dXi(c,b){var a;c.kb=b;if(b==0){return}a=null.dc();c.r=bUi(a,0,null.cc);rWi(c)}
function eXi(c,b,a){c.kb=b;c.r=a;rWi(c)}
function hXi(a,b){if(b==(Fli(),cmi)){throw Fci(new Eci(),xxg)}a.tb=b}
function iXi(a){a.q=false;a.lb=e9h(A_h,42,-1,64,1);a.mb=0;a.F=e9h(A_h,42,-1,1024,1);a.ab=0;a.kb=0;a.D=false;a.A=false;a.cb=false;j0i(a.qb,a);a.sb=a.qb.A;a.C=0;a.y=false;a.j=0;a.x=-1;a.E=0;a.z=(rVi(),sVi).length-1;a.o=-1;a.nb=0;a.fb=-1;a.rb=0;a.ib=false;a.jb=false;if(a.eb){a.m=null}else{a.m=sUi(new rUi(),a.bb)}a.a=false;a.f=a.g=0;a.c=a.d=1;a.h=true;a.i=0;a.b=false}
function jXi(Ab,vb,p,rb,o,tb,ub,cb){var q,u,bb,ib,kb,Bb;wb:for(;;){switch(vb){case 0:z:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}switch(p){case 38:jUi(Ab,o,rb);Ab.lb[0]=p;Ab.mb=1;Ab.j=0;fVi(new eVi(),Ab);ub=vb;vb=42;continue wb;case 60:jUi(Ab,o,rb);vb=4;break z;case 0:yWi(Ab,o,rb);continue;case 13:sWi(Ab,o,rb);break wb;case 10:Ab.h=true;default:continue;}}case 4:yb:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);if(p>=65&&p<=90){Ab.w=false;Ab.lb[0]=p+32&65535;Ab.mb=1;vb=6;break yb}else if(p>=97&&p<=122){Ab.w=false;Ab.lb[0]=p;Ab.mb=1;vb=6;break yb}switch(p){case 33:vb=16;continue wb;case 47:vb=5;continue wb;case 63:Ab.F[0]=p;Ab.ab=1;vb=15;continue wb;case 62:xYi(Ab.qb,oXi,0,2);Ab.u=rb+1;vb=0;continue wb;default:xYi(Ab.qb,oXi,0,1);Ab.u=rb;vb=0;tb=true;continue wb;}}case 6:xb:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 13:Ab.h=true;Ab.D=true;Ab.pb=bUi(Ab.lb,0,Ab.mb);vb=7;break wb;case 10:Ab.h=true;case 32:case 9:case 12:Ab.pb=bUi(Ab.lb,0,Ab.mb);vb=7;break xb;case 47:Ab.pb=bUi(Ab.lb,0,Ab.mb);vb=48;continue wb;case 62:Ab.pb=bUi(Ab.lb,0,Ab.mb);vb=uWi(Ab,false,rb);if(Ab.jb){break wb}continue wb;case 0:p=65533;default:if(p>=65&&p<=90){p+=32}nWi(Ab,p);continue;}}case 7:h:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}switch(p){case 13:Ab.h=true;Ab.D=true;break wb;case 10:Ab.h=true;case 32:case 9:case 12:continue;case 47:vb=48;continue wb;case 62:vb=uWi(Ab,false,rb);if(Ab.jb){break wb}continue wb;case 0:p=65533;case 34:case 39:case 60:case 61:default:if(p>=65&&p<=90){p+=32}Ab.lb[0]=p;Ab.mb=1;vb=8;break h;}}case 8:e:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 13:Ab.h=true;Ab.D=true;oWi(Ab);vb=9;break wb;case 10:Ab.h=true;case 32:case 9:case 12:oWi(Ab);vb=9;continue wb;case 47:oWi(Ab);iWi(Ab);vb=48;continue wb;case 61:oWi(Ab);vb=10;break e;case 62:oWi(Ab);iWi(Ab);vb=uWi(Ab,false,rb);if(Ab.jb){break wb}continue wb;case 0:p=65533;case 34:case 39:case 60:default:if(p>=65&&p<=90){p+=32}nWi(Ab,p);continue;}}case 10:i:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 13:Ab.h=true;Ab.D=true;break wb;case 10:Ab.h=true;case 32:case 9:case 12:continue;case 34:Ab.ab=0;vb=11;break i;case 38:Ab.ab=0;vb=13;tb=true;continue wb;case 39:Ab.ab=0;vb=12;continue wb;case 62:iWi(Ab);vb=uWi(Ab,false,rb);if(Ab.jb){break wb}continue wb;case 0:p=65533;case 60:case 61:iUi(p);default:Ab.F[0]=p;Ab.ab=1;vb=13;continue wb;}}case 11:f:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}switch(p){case 34:hWi(Ab);vb=14;break f;case 38:Ab.lb[0]=p;Ab.mb=1;Ab.j=34;fVi(new eVi(),Ab);ub=vb;vb=42;continue wb;case 13:Ab.h=true;Ab.D=true;kWi(Ab,10);break wb;case 10:Ab.h=true;kWi(Ab,10);continue;case 0:p=65533;default:kWi(Ab,p);continue;}}case 14:a:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 13:Ab.h=true;Ab.D=true;vb=7;break wb;case 10:Ab.h=true;case 32:case 9:case 12:vb=7;continue wb;case 47:vb=48;break a;case 62:vb=uWi(Ab,false,rb);if(Ab.jb){break wb}continue wb;default:vb=7;tb=true;continue wb;}}case 48:if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 62:vb=uWi(Ab,true,rb);if(Ab.jb){break wb}continue wb;default:vb=7;tb=true;continue wb;}case 13:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}switch(p){case 13:Ab.h=true;Ab.D=true;hWi(Ab);vb=7;break wb;case 10:Ab.h=true;case 32:case 9:case 12:hWi(Ab);vb=7;continue wb;case 38:Ab.lb[0]=p;Ab.mb=1;Ab.j=62;fVi(new eVi(),Ab);ub=vb;vb=42;continue wb;case 62:hWi(Ab);vb=uWi(Ab,false,rb);if(Ab.jb){break wb}continue wb;case 0:p=65533;case 60:case 34:case 39:case 61:default:kWi(Ab,p);continue;}}case 9:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 13:Ab.h=true;Ab.D=true;break wb;case 10:Ab.h=true;case 32:case 9:case 12:continue;case 47:iWi(Ab);vb=48;continue wb;case 61:vb=10;continue wb;case 62:iWi(Ab);vb=uWi(Ab,false,rb);if(Ab.jb){break wb}continue wb;case 0:p=65533;case 34:case 39:case 60:default:iWi(Ab);if(p>=65&&p<=90){p+=32}Ab.lb[0]=p;Ab.mb=1;vb=8;continue wb;}}case 15:n:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}switch(p){case 62:tWi(Ab,0,rb);vb=0;continue wb;case 45:kWi(Ab,p);vb=59;break n;case 13:Ab.h=true;Ab.D=true;kWi(Ab,10);break wb;case 10:Ab.h=true;kWi(Ab,10);continue;case 0:p=65533;default:kWi(Ab,p);continue;}}case 59:m:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 62:aXi(Ab);tWi(Ab,0,rb);vb=0;continue wb;case 45:mWi(Ab);continue m;case 13:Ab.h=true;Ab.D=true;kWi(Ab,10);vb=15;break wb;case 10:Ab.h=true;kWi(Ab,10);vb=15;continue wb;case 0:p=65533;default:kWi(Ab,p);vb=15;continue wb;}}case 16:ob:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 45:Ab.F[0]=p;Ab.ab=1;vb=38;break ob;case 100:case 68:Ab.F[0]=p;Ab.ab=1;Ab.C=0;vb=39;continue wb;case 91:if(Ab.qb.l==0){Ab.F[0]=p;Ab.ab=1;Ab.C=0;vb=49;continue wb}else{}default:Ab.ab=0;vb=15;tb=true;continue wb;}}case 38:nb:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 0:break wb;case 45:Ab.ab=0;vb=30;break nb;default:vb=15;tb=true;continue wb;}}case 30:y:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 45:kWi(Ab,p);vb=31;continue wb;case 62:tWi(Ab,0,rb);vb=0;continue wb;case 13:Ab.h=true;Ab.D=true;kWi(Ab,10);vb=32;break wb;case 10:Ab.h=true;kWi(Ab,10);vb=32;break y;case 0:p=65533;default:kWi(Ab,p);vb=32;break y;}}case 32:x:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 45:kWi(Ab,p);vb=33;break x;case 13:Ab.h=true;Ab.D=true;kWi(Ab,10);break wb;case 10:Ab.h=true;kWi(Ab,10);continue;case 0:p=65533;default:kWi(Ab,p);continue;}}case 33:v:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 45:kWi(Ab,p);vb=34;break v;case 13:Ab.h=true;Ab.D=true;kWi(Ab,10);vb=32;break wb;case 10:Ab.h=true;kWi(Ab,10);vb=32;continue wb;case 0:p=65533;default:kWi(Ab,p);vb=32;continue wb;}}case 34:w:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 62:tWi(Ab,2,rb);vb=0;continue wb;case 45:jWi(Ab,p);continue;case 32:case 9:case 12:jWi(Ab,p);vb=35;break w;case 13:Ab.h=true;Ab.D=true;jWi(Ab,10);vb=35;break wb;case 10:Ab.h=true;jWi(Ab,10);vb=35;break w;case 33:kWi(Ab,p);vb=36;continue wb;case 0:p=65533;default:jWi(Ab,p);vb=32;continue wb;}}case 35:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 62:tWi(Ab,0,rb);vb=0;continue wb;case 45:kWi(Ab,p);vb=33;continue wb;case 32:case 9:case 12:kWi(Ab,p);continue;case 13:Ab.h=true;Ab.D=true;kWi(Ab,10);break wb;case 10:Ab.h=true;kWi(Ab,10);continue;case 0:p=65533;default:kWi(Ab,p);vb=32;continue wb;}}case 36:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 62:tWi(Ab,3,rb);vb=0;continue wb;case 45:kWi(Ab,p);vb=33;continue wb;case 13:Ab.h=true;Ab.D=true;kWi(Ab,10);break wb;case 10:Ab.h=true;kWi(Ab,10);continue;case 0:p=65533;default:kWi(Ab,p);vb=32;continue wb;}}case 31:if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 45:kWi(Ab,p);vb=34;continue wb;case 62:tWi(Ab,1,rb);vb=0;continue wb;case 13:Ab.h=true;Ab.D=true;kWi(Ab,10);vb=32;break wb;case 10:Ab.h=true;kWi(Ab,10);vb=32;continue wb;case 0:p=65533;default:kWi(Ab,p);vb=32;continue wb;}case 39:mb:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);if(Ab.C<6){ib=p;if(p>=65&&p<=90){ib+=32}if(ib==tXi[Ab.C]){kWi(Ab,p)}else{vb=15;tb=true;continue wb}++Ab.C;continue}else{vb=17;tb=true;break mb}}case 17:B:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}Ab.v=cNh;Ab.ob=null;Ab.gb=null;Ab.y=false;switch(p){case 13:Ab.h=true;Ab.D=true;vb=18;break wb;case 10:Ab.h=true;case 32:case 9:case 12:vb=18;break B;default:vb=18;tb=true;break B;}}case 18:j:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}switch(p){case 13:Ab.h=true;Ab.D=true;break wb;case 10:Ab.h=true;case 32:case 9:case 12:continue;case 62:Ab.y=true;Ab.u=rb+1;FYi(Ab.qb,Ab.v,Ab.gb,Ab.ob,Ab.y);vb=0;continue wb;case 0:p=65533;default:if(p>=65&&p<=90){p+=32}Ab.lb[0]=p;Ab.mb=1;vb=19;break j;}}case 19:C:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 13:Ab.h=true;Ab.D=true;Ab.v=String(xfi(Ab.lb,0,Ab.mb));vb=20;break wb;case 10:Ab.h=true;case 32:case 9:case 12:Ab.v=String(xfi(Ab.lb,0,Ab.mb));vb=20;break C;case 62:Ab.v=String(xfi(Ab.lb,0,Ab.mb));Ab.u=rb+1;FYi(Ab.qb,Ab.v,Ab.gb,Ab.ob,Ab.y);vb=0;continue wb;case 0:p=65533;default:if(p>=65&&p<=90){p+=32}nWi(Ab,p);continue;}}case 20:b:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 13:Ab.h=true;Ab.D=true;break wb;case 10:Ab.h=true;case 32:case 9:case 12:continue;case 62:Ab.u=rb+1;FYi(Ab.qb,Ab.v,Ab.gb,Ab.ob,Ab.y);vb=0;continue wb;case 112:case 80:Ab.C=0;vb=40;break b;case 115:case 83:Ab.C=0;vb=41;continue wb;default:Ab.y=true;vb=29;continue wb;}}case 40:F:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);if(Ab.C<5){ib=p;if(p>=65&&p<=90){ib+=32}if(ib!=CXi[Ab.C]){Ab.y=true;vb=29;tb=true;continue wb}++Ab.C;continue}else{vb=21;tb=true;break F}}case 21:k:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}switch(p){case 13:Ab.h=true;Ab.D=true;break wb;case 10:Ab.h=true;case 32:case 9:case 12:continue;case 34:Ab.ab=0;vb=22;break k;case 39:Ab.ab=0;vb=23;continue wb;case 62:Ab.y=true;Ab.u=rb+1;FYi(Ab.qb,Ab.v,Ab.gb,Ab.ob,Ab.y);vb=0;continue wb;default:Ab.y=true;vb=29;continue wb;}}case 22:D:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 34:Ab.gb=xfi(Ab.F,0,Ab.ab);vb=24;break D;case 62:Ab.y=true;Ab.gb=xfi(Ab.F,0,Ab.ab);Ab.u=rb+1;FYi(Ab.qb,Ab.v,Ab.gb,Ab.ob,Ab.y);vb=0;continue wb;case 13:Ab.h=true;Ab.D=true;kWi(Ab,10);break wb;case 10:Ab.h=true;kWi(Ab,10);continue;case 0:p=65533;default:kWi(Ab,p);continue;}}case 24:c:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 13:Ab.h=true;Ab.D=true;break wb;case 10:Ab.h=true;case 32:case 9:case 12:continue;case 34:Ab.ab=0;vb=26;break c;case 39:Ab.ab=0;vb=27;continue wb;case 62:Ab.u=rb+1;FYi(Ab.qb,Ab.v,Ab.gb,Ab.ob,Ab.y);vb=0;continue wb;default:Ab.y=true;vb=29;continue wb;}}case 26:E:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 34:Ab.ob=xfi(Ab.F,0,Ab.ab);vb=28;continue wb;case 62:Ab.y=true;Ab.ob=xfi(Ab.F,0,Ab.ab);Ab.u=rb+1;FYi(Ab.qb,Ab.v,Ab.gb,Ab.ob,Ab.y);vb=0;continue wb;case 13:Ab.h=true;Ab.D=true;kWi(Ab,10);break wb;case 10:Ab.h=true;kWi(Ab,10);continue;case 0:p=65533;default:kWi(Ab,p);continue;}}case 28:d:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 13:Ab.h=true;Ab.D=true;break wb;case 10:Ab.h=true;case 32:case 9:case 12:continue;case 62:Ab.u=rb+1;FYi(Ab.qb,Ab.v,Ab.gb,Ab.ob,Ab.y);vb=0;continue wb;default:Ab.y=false;vb=29;break d;}}case 29:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}switch(p){case 62:Ab.u=rb+1;FYi(Ab.qb,Ab.v,Ab.gb,Ab.ob,Ab.y);vb=0;continue wb;case 13:Ab.h=true;Ab.D=true;break wb;case 10:Ab.h=true;default:continue;}}case 41:ab:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);if(Ab.C<5){ib=p;if(p>=65&&p<=90){ib+=32}if(ib!=EXi[Ab.C]){Ab.y=true;vb=29;tb=true;continue wb}++Ab.C;continue wb}else{vb=25;tb=true;break ab}}case 25:l:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}switch(p){case 13:Ab.h=true;Ab.D=true;break wb;case 10:Ab.h=true;case 32:case 9:case 12:continue;case 34:Ab.ab=0;vb=26;continue wb;case 39:Ab.ab=0;vb=27;break l;case 62:Ab.y=true;Ab.u=rb+1;FYi(Ab.qb,Ab.v,Ab.gb,Ab.ob,Ab.y);vb=0;continue wb;default:Ab.y=true;vb=29;continue wb;}}case 27:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 39:Ab.ob=xfi(Ab.F,0,Ab.ab);vb=28;continue wb;case 62:Ab.y=true;Ab.ob=xfi(Ab.F,0,Ab.ab);Ab.u=rb+1;FYi(Ab.qb,Ab.v,Ab.gb,Ab.ob,Ab.y);vb=0;continue wb;case 13:Ab.h=true;Ab.D=true;kWi(Ab,10);break wb;case 10:Ab.h=true;kWi(Ab,10);continue;case 0:p=65533;default:kWi(Ab,p);continue;}}case 23:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 39:Ab.gb=xfi(Ab.F,0,Ab.ab);vb=24;continue wb;case 62:Ab.y=true;Ab.gb=xfi(Ab.F,0,Ab.ab);Ab.u=rb+1;FYi(Ab.qb,Ab.v,Ab.gb,Ab.ob,Ab.y);vb=0;continue wb;case 13:Ab.h=true;Ab.D=true;kWi(Ab,10);break wb;case 10:Ab.h=true;kWi(Ab,10);continue;case 0:p=65533;default:kWi(Ab,p);continue;}}case 49:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);if(Ab.C<6){if(p==lXi[Ab.C]){kWi(Ab,p)}else{vb=15;tb=true;continue wb}++Ab.C;continue}else{Ab.u=rb;vb=50;tb=true;break}}case 50:t:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}switch(p){case 93:jUi(Ab,o,rb);vb=51;break t;case 0:yWi(Ab,o,rb);continue;case 13:sWi(Ab,o,rb);break wb;case 10:Ab.h=true;default:continue;}}case 51:s:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 93:vb=52;break s;default:xYi(Ab.qb,wXi,0,1);Ab.u=rb;vb=50;tb=true;continue wb;}}case 52:if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 62:Ab.u=rb+1;vb=0;continue wb;default:xYi(Ab.qb,wXi,0,2);Ab.u=rb;vb=50;tb=true;continue wb;}case 12:g:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}switch(p){case 39:hWi(Ab);vb=14;continue wb;case 38:Ab.lb[0]=p;Ab.mb=1;Ab.j=39;fVi(new eVi(),Ab);ub=vb;vb=42;break g;case 13:Ab.h=true;Ab.D=true;kWi(Ab,10);break wb;case 10:Ab.h=true;kWi(Ab,10);continue;case 0:p=65533;default:kWi(Ab,p);continue;}}case 42:if(++rb==cb){break wb}p=gUi(Ab,o,rb);if(p==0){break wb}switch(p){case 32:case 9:case 10:case 13:case 12:case 60:case 38:wWi(Ab,ub);if((ub&-2)==0){Ab.u=rb}vb=ub;tb=true;continue wb;case 35:nWi(Ab,35);vb=43;continue wb;default:if(p==Ab.j){wWi(Ab,ub);vb=ub;tb=true;continue wb}Ab.x=-1;Ab.E=0;Ab.z=(rVi(),sVi).length-1;Ab.o=-1;Ab.nb=0;vb=44;tb=true;}case 44:pb:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}if(p==0){break wb}++Ab.x;jb:for(;;){if(Ab.z==-1){break jb}if(Ab.x==(rVi(),sVi)[Ab.z].length){break jb}if(Ab.x>sVi[Ab.z].length){break pb}else if(p<sVi[Ab.z][Ab.x]){--Ab.z}else{break jb}}lb:for(;;){if(Ab.z<Ab.E){break pb}if(Ab.x==(rVi(),sVi)[Ab.E].length){Ab.o=Ab.E;Ab.nb=Ab.mb;++Ab.E}else if(Ab.x>sVi[Ab.E].length){break pb}else if(p>sVi[Ab.E][Ab.x]){++Ab.E}else{break lb}}if(Ab.z<Ab.E){break pb}nWi(Ab,p);continue}if(Ab.o==-1){wWi(Ab,ub);if((ub&-2)==0){Ab.u=rb}vb=ub;tb=true;continue wb}else{q=(rVi(),sVi)[Ab.o];if(q[q.length-1]!=59){if((ub&-2)!=0){if(Ab.nb==Ab.mb){u=p}else{u=Ab.lb[Ab.nb]}if(u>=48&&u<=57||u>=65&&u<=90||u>=97&&u<=122){lWi(Ab,Ab.lb,0,Ab.mb);vb=ub;tb=true;continue wb}}}Bb=tVi[Ab.o];xWi(Ab,Bb,ub);if(Ab.nb<Ab.mb){if((ub&-2)!=0){for(kb=Ab.nb;kb<Ab.mb;++kb){kWi(Ab,Ab.lb[kb])}}else{xYi(Ab.qb,Ab.lb,Ab.nb,Ab.mb-Ab.nb)}}if((ub&-2)==0){Ab.u=rb}vb=ub;tb=true;continue wb}case 43:if(++rb==cb){break wb}p=gUi(Ab,o,rb);Ab.fb=-1;Ab.rb=0;Ab.ib=false;switch(p){case 120:case 88:nWi(Ab,p);vb=45;continue wb;default:vb=46;tb=true;}case 46:A:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}if(Ab.rb<Ab.fb){Ab.rb=1114112}Ab.fb=Ab.rb;if(p>=48&&p<=57){Ab.ib=true;Ab.rb*=10;Ab.rb+=p-48;continue}else if(p==59){if(Ab.ib){if((ub&-2)==0){Ab.u=rb+1}vb=47;break A}else{sxg+xfi(Ab.lb,0,Ab.mb)+rxg;nWi(Ab,59);wWi(Ab,ub);if((ub&-2)==0){Ab.u=rb+1}vb=ub;continue wb}}else{if(Ab.ib){if((ub&-2)==0){Ab.u=rb}vb=47;tb=true;break A}else{sxg+xfi(Ab.lb,0,Ab.mb)+rxg;wWi(Ab,ub);if((ub&-2)==0){Ab.u=rb}vb=ub;tb=true;continue wb}}}case 47:EWi(Ab,ub);vb=ub;continue wb;case 45:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);if(Ab.rb<Ab.fb){Ab.rb=1114112}Ab.fb=Ab.rb;if(p>=48&&p<=57){Ab.ib=true;Ab.rb*=16;Ab.rb+=p-48;continue}else if(p>=65&&p<=70){Ab.ib=true;Ab.rb*=16;Ab.rb+=p-65+10;continue}else if(p>=97&&p<=102){Ab.ib=true;Ab.rb*=16;Ab.rb+=p-97+10;continue}else if(p==59){if(Ab.ib){if((ub&-2)==0){Ab.u=rb+1}vb=47;continue wb}else{sxg+xfi(Ab.lb,0,Ab.mb)+rxg;nWi(Ab,59);wWi(Ab,ub);if((ub&-2)==0){Ab.u=rb+1}vb=ub;continue wb}}else{if(Ab.ib){if((ub&-2)==0){Ab.u=rb}vb=47;tb=true;continue wb}else{sxg+xfi(Ab.lb,0,Ab.mb)+rxg;wWi(Ab,ub);if((ub&-2)==0){Ab.u=rb}vb=ub;tb=true;continue wb}}}case 3:qb:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}switch(p){case 0:yWi(Ab,o,rb);continue;case 13:sWi(Ab,o,rb);break wb;case 10:Ab.h=true;default:continue;}}case 2:r:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}switch(p){case 60:jUi(Ab,o,rb);ub=vb;vb=53;break r;case 0:yWi(Ab,o,rb);continue;case 13:sWi(Ab,o,rb);break wb;case 10:Ab.h=true;default:continue;}}case 53:zb:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 33:xYi(Ab.qb,oXi,0,1);Ab.u=rb;vb=54;break zb;case 47:if(Ab.r){Ab.C=0;Ab.mb=0;vb=37;continue wb}default:xYi(Ab.qb,oXi,0,1);Ab.u=rb;vb=ub;tb=true;continue wb;}}case 54:eb:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 45:vb=55;break eb;default:vb=ub;tb=true;continue wb;}}case 55:db:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 45:vb=58;break db;default:vb=ub;tb=true;continue wb;}}case 58:fb:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 45:continue;case 62:vb=ub;continue wb;case 0:yWi(Ab,o,rb);vb=56;break fb;case 13:sWi(Ab,o,rb);vb=56;break wb;case 10:Ab.h=true;default:vb=56;break fb;}}case 56:hb:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 45:vb=57;break hb;case 0:yWi(Ab,o,rb);continue;case 13:sWi(Ab,o,rb);break wb;case 10:Ab.h=true;default:continue;}}case 57:gb:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 45:vb=58;continue wb;case 0:yWi(Ab,o,rb);vb=56;continue wb;case 13:sWi(Ab,o,rb);vb=56;continue wb;case 10:Ab.h=true;default:vb=56;continue wb;}}case 37:for(;;){if(++rb==cb){break wb}p=gUi(Ab,o,rb);if(Ab.C<Ab.s.length){bb=Ab.s[Ab.C];ib=p;if(p>=65&&p<=90){ib+=32}if(ib!=bb){Ab.A&&(Ab.C>0||ib>=97&&ib<=122)&&(wHi(),jNi)!=Ab.r;xYi(Ab.qb,pXi,0,2);zWi(Ab);Ab.u=rb;vb=ub;tb=true;continue wb}nWi(Ab,p);++Ab.C;continue}else{Ab.w=true;Ab.pb=Ab.r;switch(p){case 13:Ab.h=true;Ab.D=true;vb=7;break wb;case 10:Ab.h=true;case 32:case 9:case 12:vb=7;continue wb;case 62:vb=uWi(Ab,false,rb);if(Ab.jb){break wb}continue wb;case 47:vb=48;continue wb;default:xYi(Ab.qb,pXi,0,2);zWi(Ab);if(p==0){yWi(Ab,o,rb)}else{Ab.u=rb}vb=ub;continue wb;}}}case 5:if(++rb==cb){break wb}p=gUi(Ab,o,rb);switch(p){case 62:Ab.u=rb+1;vb=0;continue wb;case 13:Ab.h=true;Ab.D=true;Ab.F[0]=10;Ab.ab=1;vb=15;break wb;case 10:Ab.h=true;Ab.F[0]=10;Ab.ab=1;vb=15;continue wb;case 0:p=65533;default:if(p>=65&&p<=90){p+=32}if(p>=97&&p<=122){Ab.w=true;Ab.lb[0]=p;Ab.mb=1;vb=6;continue wb}else{Ab.F[0]=p;Ab.ab=1;vb=15;continue wb}}case 1:sb:for(;;){if(tb){tb=false}else{if(++rb==cb){break wb}p=gUi(Ab,o,rb)}switch(p){case 38:jUi(Ab,o,rb);Ab.lb[0]=p;Ab.mb=1;Ab.j=0;ub=vb;vb=42;continue wb;case 60:jUi(Ab,o,rb);ub=vb;vb=53;continue wb;case 0:yWi(Ab,o,rb);continue;case 13:sWi(Ab,o,rb);break wb;case 10:Ab.h=true;default:continue;}}}}jUi(Ab,o,rb);Ab.kb=vb;Ab.hb=ub;return rb}
function kXi(f,a){var b,c,d,e;e=f.kb;c=f.hb;f.jb=false;f.D=false;d=a.c;b=d-1;switch(e){case 0:case 1:case 2:case 3:case 50:case 56:case 54:case 55:case 57:case 58:f.u=d;break;default:f.u=2147483647;}b=jXi(f,e,0,b,a.a,false,c,a.b);if(b==a.b){a.c=b}else{a.c=b+1}return f.D}
function FXi(){return v_h}
function aYi(d){var a,b,c;if(d==null){return null}a=e9h(A_h,42,-1,d.length,1);for(c=0;c<d.length;++c){b=d.charCodeAt(c);if(b>=65&&b<=90){b+=32}a[c]=b}return String.fromCharCode.apply(null,a)}
function eWi(){}
_=eWi.prototype=new xdi();_.gC=FXi;_.tI=0;_.j=0;_.k=null;_.l=null;_.m=null;_.n=null;_.o=0;_.q=false;_.r=null;_.s=null;_.u=0;_.v=null;_.w=false;_.x=0;_.y=false;_.z=0;_.A=false;_.B=false;_.C=0;_.D=false;_.E=0;_.F=null;_.ab=0;_.bb=0;_.cb=false;_.eb=false;_.fb=0;_.gb=null;_.hb=0;_.ib=false;_.jb=false;_.kb=0;_.lb=null;_.mb=0;_.nb=0;_.ob=null;_.pb=null;_.qb=null;_.rb=0;_.sb=false;var lXi,mXi,nXi,oXi,pXi,qXi,rXi,sXi,tXi,uXi,vXi,wXi,xXi,yXi,zXi,AXi,BXi,CXi,DXi,EXi;function hUi(){hUi=v0i;qWi()}
function fUi(a,b){hUi();a.t=(Fli(),bmi);a.p=bmi;a.tb=bmi;a.db=bmi;a.qb=b;a.eb=false;a.n=e9h(A_h,42,-1,1,1);a.k=e9h(A_h,42,-1,2,1);a.e=bmi;return a}
function gUi(e,a,d){var b,c;e.g=e.f;e.d=e.c;if(e.h){++e.f;e.c=1;e.h=false}else{++e.c}b=a[d];if(!e.q&&!e.a&&b>127){e.a=true}switch(b){case 0:case 9:case 13:case 10:break;case 12:if(e.e==(Fli(),cmi)){DWi(e,yxg+oUi(b)+Bxg)}else{if(e.e==bmi){b=a[d]=32}yxg+oUi(b)+Bxg}break;default:if((b&64512)==56320){if((e.i&64512)==55296){c=(e.i<<10)+b+-56613888;if(c>=983040&&c<=1048573||c>=1048576&&c<=1114109){pUi(e)}}}else if(b<32||(b&65534)==65534){switch(e.e.b){case 1:DWi(e,Cxg+oUi(b)+Dxg);break;case 2:b=a[d]=65533;case 0:Cxg+oUi(b)+Dxg;}}else if(b>=127&&b<=159||b>=64976&&b<=64991){Cxg+oUi(b)+Dxg}else if(b>=57344&&b<=63743){pUi(e)}}e.i=b;return b}
function iUi(a){switch(a){case 61:return;case 60:return;}}
function jUi(e,a,d){var b,c;if(d>e.u){c=e.f;b=e.c;e.f=e.g;e.c=e.d;xYi(e.qb,a,e.u,d-e.u);e.f=c;e.c=b}e.u=2147483647}
function kUi(a){if(a.c>0){return a.c}else{return -1}}
function lUi(a){if(a.f>0){return a.f}else{return -1}}
function oUi(a){var b;b=idi(a,4);switch(b.length){case 1:return Exg+b;case 2:return Fxg+b;case 3:return ayg+b;case 4:return byg+b;default:throw Edi(new Ddi(),cyg);}}
function pUi(a){if(!a.b){a.b=true}}
function qUi(){return r_h}
function dUi(){}
_=dUi.prototype=new eWi();_.gC=qUi;_.tI=0;_.a=false;_.b=false;_.c=0;_.d=0;_.f=0;_.g=0;_.h=false;_.i=0;function wUi(){wUi=v0i;aVi=e9h(E_h,49,9,0,0);cVi=e9h(D_h,48,1,0,0);bVi=sUi(new rUi(),0)}
function sUi(b,a){wUi();b.b=a;b.a=0;b.c=e9h(E_h,49,9,5,0);b.d=e9h(D_h,48,1,5,0);b.e=0;b.f=aVi;b.g=cVi;return b}
function tUi(e,a,f,g){var b,c,d;a==(koi(),pvi);if(a.d){if(e.f.length==e.e){b=e.e==0?2:e.e<<1;c=e9h(E_h,49,9,b,0);Afi(e.f,0,c,0,e.f.length);e.f=c;d=e9h(D_h,48,1,b,0);Afi(e.g,0,d,0,e.g.length);e.g=d}e.f[e.e]=a;e.g[e.e]=f;++e.e;switch(g.b){case 1:throw z0i(new y0i(),dyg);case 2:return;}}if(e.c.length==e.a){b=e.a<<1;c=e9h(E_h,49,9,b,0);Afi(e.c,0,c,0,e.c.length);e.c=c;d=e9h(D_h,48,1,b,0);Afi(e.d,0,d,0,e.d.length);e.d=d}e.c[e.a]=a;e.d[e.a]=f;++e.a}
function vUi(c,b){var a;for(a=0;a<c.a;++a){h9h(c.c,a,null);h9h(c.d,a,null)}c.a=0;c.b=b;for(a=0;a<c.e;++a){h9h(c.f,a,null);h9h(c.g,a,null)}c.e=0}
function uUi(b){var a;for(a=0;a<b.a;++a){h9h(b.c,a,null);h9h(b.d,a,null)}b.a=0}
function xUi(c){var a,b;a=sUi(new rUi(),0);for(b=0;b<c.a;++b){tUi(a,c.c[b],c.d[b],(Fli(),ami))}for(b=0;b<c.e;++b){tUi(a,c.f[b],c.g[b],(Fli(),ami))}return a}
function yUi(c,b){var a;for(a=0;a<c.a;++a){if(b.a[0]==c.c[a].a[0]){return true}}for(a=0;a<c.e;++a){if(b.a[0]==c.f[a].a[0]){return true}}return false}
function zUi(b,a){if(a<b.a&&a>=0){return b.c[a]}else{return null}}
function AUi(c,b){var a;for(a=0;a<c.a;++a){if(c.c[a]==b){return a}}return -1}
function BUi(b,a){if(a<b.a&&a>=0){return b.c[a].a[b.b]}else{return null}}
function CUi(b,a){if(a<b.a&&a>=0){return b.c[a].c[b.b]}else{return null}}
function DUi(b,a){if(a<b.a&&a>=0){return b.d[a]}else{return null}}
function EUi(c,b){var a;a=AUi(c,b);if(a==-1){return null}else{return DUi(c,a)}}
function FUi(e,f,d){var a,b,c;for(b=0;b<e.a;++b){a=e.c[b];if(!a.b[e.b]){c=a.a[e.b];switch(d.b){case 2:e.c[b]=(koi(),ioi(new hoi(),dpi,ACi(mVi(c)),epi,bpi,false));case 0:a!=(koi(),DGi);break;case 1:gZi(f,mxg+c+eyg);}}}}
function dVi(){return s_h}
function rUi(){}
_=rUi.prototype=new xdi();_.gC=dVi;_.tI=0;_.a=0;_.b=0;_.c=null;_.d=null;_.e=0;_.f=null;_.g=null;var aVi,bVi,cVi;function fVi(b,a){kUi(a);lUi(a);return b}
function hVi(){return t_h}
function eVi(){}
_=eVi.prototype=new xdi();_.gC=hVi;_.tI=0;function jVi(){jVi=v0i;kVi=lfi(gyg)}
function lVi(c,a){var b;uei(c,hyg);for(b=0;b<6;++b){uei(c,String.fromCharCode(kVi[(a&15728640)>>20]));a<<=4}}
function mVi(e){jVi();var a,b,c,d;d=tei(new rei());for(b=0;b<e.length;++b){a=e.charCodeAt(b);if((a&64512)==55296){c=e.charCodeAt(++b);lVi(d,(a<<10)+c+-56613888)}else if(b==0&&!(a>=65&&a<=90||a>=97&&a<=122||a>=192&&a<=214||a>=216&&a<=246||a>=248&&a<=255||a>=256&&a<=305||a>=308&&a<=318||a>=321&&a<=328||a>=330&&a<=382||a>=384&&a<=451||a>=461&&a<=496||a>=500&&a<=501||a>=506&&a<=535||a>=592&&a<=680||a>=699&&a<=705||a==902||a>=904&&a<=906||a==908||a>=910&&a<=929||a>=931&&a<=974||a>=976&&a<=982||a==986||a==988||a==990||a==992||a>=994&&a<=1011||a>=1025&&a<=1036||a>=1038&&a<=1103||a>=1105&&a<=1116||a>=1118&&a<=1153||a>=1168&&a<=1220||a>=1223&&a<=1224||a>=1227&&a<=1228||a>=1232&&a<=1259||a>=1262&&a<=1269||a>=1272&&a<=1273||a>=1329&&a<=1366||a==1369||a>=1377&&a<=1414||a>=1488&&a<=1514||a>=1520&&a<=1522||a>=1569&&a<=1594||a>=1601&&a<=1610||a>=1649&&a<=1719||a>=1722&&a<=1726||a>=1728&&a<=1742||a>=1744&&a<=1747||a==1749||a>=1765&&a<=1766||a>=2309&&a<=2361||a==2365||a>=2392&&a<=2401||a>=2437&&a<=2444||a>=2447&&a<=2448||a>=2451&&a<=2472||a>=2474&&a<=2480||a==2482||a>=2486&&a<=2489||a>=2524&&a<=2525||a>=2527&&a<=2529||a>=2544&&a<=2545||a>=2565&&a<=2570||a>=2575&&a<=2576||a>=2579&&a<=2600||a>=2602&&a<=2608||a>=2610&&a<=2611||a>=2613&&a<=2614||a>=2616&&a<=2617||a>=2649&&a<=2652||a==2654||a>=2674&&a<=2676||a>=2693&&a<=2699||a==2701||a>=2703&&a<=2705||a>=2707&&a<=2728||a>=2730&&a<=2736||a>=2738&&a<=2739||a>=2741&&a<=2745||a==2749||a==2784||a>=2821&&a<=2828||a>=2831&&a<=2832||a>=2835&&a<=2856||a>=2858&&a<=2864||a>=2866&&a<=2867||a>=2870&&a<=2873||a==2877||a>=2908&&a<=2909||a>=2911&&a<=2913||a>=2949&&a<=2954||a>=2958&&a<=2960||a>=2962&&a<=2965||a>=2969&&a<=2970||a==2972||a>=2974&&a<=2975||a>=2979&&a<=2980||a>=2984&&a<=2986||a>=2990&&a<=2997||a>=2999&&a<=3001||a>=3077&&a<=3084||a>=3086&&a<=3088||a>=3090&&a<=3112||a>=3114&&a<=3123||a>=3125&&a<=3129||a>=3168&&a<=3169||a>=3205&&a<=3212||a>=3214&&a<=3216||a>=3218&&a<=3240||a>=3242&&a<=3251||a>=3253&&a<=3257||a==3294||a>=3296&&a<=3297||a>=3333&&a<=3340||a>=3342&&a<=3344||a>=3346&&a<=3368||a>=3370&&a<=3385||a>=3424&&a<=3425||a>=3585&&a<=3630||a==3632||a>=3634&&a<=3635||a>=3648&&a<=3653||a>=3713&&a<=3714||a==3716||a>=3719&&a<=3720||a==3722||a==3725||a>=3732&&a<=3735||a>=3737&&a<=3743||a>=3745&&a<=3747||a==3749||a==3751||a>=3754&&a<=3755||a>=3757&&a<=3758||a==3760||a>=3762&&a<=3763||a==3773||a>=3776&&a<=3780||a>=3904&&a<=3911||a>=3913&&a<=3945||a>=4256&&a<=4293||a>=4304&&a<=4342||a==4352||a>=4354&&a<=4355||a>=4357&&a<=4359||a==4361||a>=4363&&a<=4364||a>=4366&&a<=4370||a==4412||a==4414||a==4416||a==4428||a==4430||a==4432||a>=4436&&a<=4437||a==4441||a>=4447&&a<=4449||a==4451||a==4453||a==4455||a==4457||a>=4461&&a<=4462||a>=4466&&a<=4467||a==4469||a==4510||a==4520||a==4523||a>=4526&&a<=4527||a>=4535&&a<=4536||a==4538||a>=4540&&a<=4546||a==4587||a==4592||a==4601||a>=7680&&a<=7835||a>=7840&&a<=7929||a>=7936&&a<=7957||a>=7960&&a<=7965||a>=7968&&a<=8005||a>=8008&&a<=8013||a>=8016&&a<=8023||a==8025||a==8027||a==8029||a>=8031&&a<=8061||a>=8064&&a<=8116||a>=8118&&a<=8124||a==8126||a>=8130&&a<=8132||a>=8134&&a<=8140||a>=8144&&a<=8147||a>=8150&&a<=8155||a>=8160&&a<=8172||a>=8178&&a<=8180||a>=8182&&a<=8188||a==8486||a>=8490&&a<=8491||a==8494||a>=8576&&a<=8578||a>=12353&&a<=12436||a>=12449&&a<=12538||a>=12549&&a<=12588||a>=44032&&a<=55203||a>=19968&&a<=40869||a==12295||a>=12321&&a<=12329||a==95)){lVi(d,a)}else if(b!=0&&!(a>=48&&a<=57||a>=1632&&a<=1641||a>=1776&&a<=1785||a>=2406&&a<=2415||a>=2534&&a<=2543||a>=2662&&a<=2671||a>=2790&&a<=2799||a>=2918&&a<=2927||a>=3047&&a<=3055||a>=3174&&a<=3183||a>=3302&&a<=3311||a>=3430&&a<=3439||a>=3664&&a<=3673||a>=3792&&a<=3801||a>=3872&&a<=3881||a>=65&&a<=90||a>=97&&a<=122||a>=192&&a<=214||a>=216&&a<=246||a>=248&&a<=255||a>=256&&a<=305||a>=308&&a<=318||a>=321&&a<=328||a>=330&&a<=382||a>=384&&a<=451||a>=461&&a<=496||a>=500&&a<=501||a>=506&&a<=535||a>=592&&a<=680||a>=699&&a<=705||a==902||a>=904&&a<=906||a==908||a>=910&&a<=929||a>=931&&a<=974||a>=976&&a<=982||a==986||a==988||a==990||a==992||a>=994&&a<=1011||a>=1025&&a<=1036||a>=1038&&a<=1103||a>=1105&&a<=1116||a>=1118&&a<=1153||a>=1168&&a<=1220||a>=1223&&a<=1224||a>=1227&&a<=1228||a>=1232&&a<=1259||a>=1262&&a<=1269||a>=1272&&a<=1273||a>=1329&&a<=1366||a==1369||a>=1377&&a<=1414||a>=1488&&a<=1514||a>=1520&&a<=1522||a>=1569&&a<=1594||a>=1601&&a<=1610||a>=1649&&a<=1719||a>=1722&&a<=1726||a>=1728&&a<=1742||a>=1744&&a<=1747||a==1749||a>=1765&&a<=1766||a>=2309&&a<=2361||a==2365||a>=2392&&a<=2401||a>=2437&&a<=2444||a>=2447&&a<=2448||a>=2451&&a<=2472||a>=2474&&a<=2480||a==2482||a>=2486&&a<=2489||a>=2524&&a<=2525||a>=2527&&a<=2529||a>=2544&&a<=2545||a>=2565&&a<=2570||a>=2575&&a<=2576||a>=2579&&a<=2600||a>=2602&&a<=2608||a>=2610&&a<=2611||a>=2613&&a<=2614||a>=2616&&a<=2617||a>=2649&&a<=2652||a==2654||a>=2674&&a<=2676||a>=2693&&a<=2699||a==2701||a>=2703&&a<=2705||a>=2707&&a<=2728||a>=2730&&a<=2736||a>=2738&&a<=2739||a>=2741&&a<=2745||a==2749||a==2784||a>=2821&&a<=2828||a>=2831&&a<=2832||a>=2835&&a<=2856||a>=2858&&a<=2864||a>=2866&&a<=2867||a>=2870&&a<=2873||a==2877||a>=2908&&a<=2909||a>=2911&&a<=2913||a>=2949&&a<=2954||a>=2958&&a<=2960||a>=2962&&a<=2965||a>=2969&&a<=2970||a==2972||a>=2974&&a<=2975||a>=2979&&a<=2980||a>=2984&&a<=2986||a>=2990&&a<=2997||a>=2999&&a<=3001||a>=3077&&a<=3084||a>=3086&&a<=3088||a>=3090&&a<=3112||a>=3114&&a<=3123||a>=3125&&a<=3129||a>=3168&&a<=3169||a>=3205&&a<=3212||a>=3214&&a<=3216||a>=3218&&a<=3240||a>=3242&&a<=3251||a>=3253&&a<=3257||a==3294||a>=3296&&a<=3297||a>=3333&&a<=3340||a>=3342&&a<=3344||a>=3346&&a<=3368||a>=3370&&a<=3385||a>=3424&&a<=3425||a>=3585&&a<=3630||a==3632||a>=3634&&a<=3635||a>=3648&&a<=3653||a>=3713&&a<=3714||a==3716||a>=3719&&a<=3720||a==3722||a==3725||a>=3732&&a<=3735||a>=3737&&a<=3743||a>=3745&&a<=3747||a==3749||a==3751||a>=3754&&a<=3755||a>=3757&&a<=3758||a==3760||a>=3762&&a<=3763||a==3773||a>=3776&&a<=3780||a>=3904&&a<=3911||a>=3913&&a<=3945||a>=4256&&a<=4293||a>=4304&&a<=4342||a==4352||a>=4354&&a<=4355||a>=4357&&a<=4359||a==4361||a>=4363&&a<=4364||a>=4366&&a<=4370||a==4412||a==4414||a==4416||a==4428||a==4430||a==4432||a>=4436&&a<=4437||a==4441||a>=4447&&a<=4449||a==4451||a==4453||a==4455||a==4457||a>=4461&&a<=4462||a>=4466&&a<=4467||a==4469||a==4510||a==4520||a==4523||a>=4526&&a<=4527||a>=4535&&a<=4536||a==4538||a>=4540&&a<=4546||a==4587||a==4592||a==4601||a>=7680&&a<=7835||a>=7840&&a<=7929||a>=7936&&a<=7957||a>=7960&&a<=7965||a>=7968&&a<=8005||a>=8008&&a<=8013||a>=8016&&a<=8023||a==8025||a==8027||a==8029||a>=8031&&a<=8061||a>=8064&&a<=8116||a>=8118&&a<=8124||a==8126||a>=8130&&a<=8132||a>=8134&&a<=8140||a>=8144&&a<=8147||a>=8150&&a<=8155||a>=8160&&a<=8172||a>=8178&&a<=8180||a>=8182&&a<=8188||a==8486||a>=8490&&a<=8491||a==8494||a>=8576&&a<=8578||a>=12353&&a<=12436||a>=12449&&a<=12538||a>=12549&&a<=12588||a>=44032&&a<=55203||a>=19968&&a<=40869||a==12295||a>=12321&&a<=12329||a==95||a==46||a==45||a>=768&&a<=837||a>=864&&a<=865||a>=1155&&a<=1158||a>=1425&&a<=1441||a>=1443&&a<=1465||a>=1467&&a<=1469||a==1471||a>=1473&&a<=1474||a==1476||a>=1611&&a<=1618||a==1648||a>=1750&&a<=1756||a>=1757&&a<=1759||a>=1760&&a<=1764||a>=1767&&a<=1768||a>=1770&&a<=1773||a>=2305&&a<=2307||a==2364||a>=2366&&a<=2380||a==2381||a>=2385&&a<=2388||a>=2402&&a<=2403||a>=2433&&a<=2435||a==2492||a==2494||a==2495||a>=2496&&a<=2500||a>=2503&&a<=2504||a>=2507&&a<=2509||a==2519||a>=2530&&a<=2531||a==2562||a==2620||a==2622||a==2623||a>=2624&&a<=2626||a>=2631&&a<=2632||a>=2635&&a<=2637||a>=2672&&a<=2673||a>=2689&&a<=2691||a==2748||a>=2750&&a<=2757||a>=2759&&a<=2761||a>=2763&&a<=2765||a>=2817&&a<=2819||a==2876||a>=2878&&a<=2883||a>=2887&&a<=2888||a>=2891&&a<=2893||a>=2902&&a<=2903||a>=2946&&a<=2947||a>=3006&&a<=3010||a>=3014&&a<=3016||a>=3018&&a<=3021||a==3031||a>=3073&&a<=3075||a>=3134&&a<=3140||a>=3142&&a<=3144||a>=3146&&a<=3149||a>=3157&&a<=3158||a>=3202&&a<=3203||a>=3262&&a<=3268||a>=3270&&a<=3272||a>=3274&&a<=3277||a>=3285&&a<=3286||a>=3330&&a<=3331||a>=3390&&a<=3395||a>=3398&&a<=3400||a>=3402&&a<=3405||a==3415||a==3633||a>=3636&&a<=3642||a>=3655&&a<=3662||a==3761||a>=3764&&a<=3769||a>=3771&&a<=3772||a>=3784&&a<=3789||a>=3864&&a<=3865||a==3893||a==3895||a==3897||a==3902||a==3903||a>=3953&&a<=3972||a>=3974&&a<=3979||a>=3984&&a<=3989||a==3991||a>=3993&&a<=4013||a>=4017&&a<=4023||a==4025||a>=8400&&a<=8412||a==8417||a>=12330&&a<=12335||a==12441||a==12442||a==183||a==720||a==721||a==903||a==1600||a==3654||a==3782||a==12293||a>=12337&&a<=12341||a>=12445&&a<=12446||a>=12540&&a<=12542)){lVi(d,a)}else{uei(d,String.fromCharCode(a))}}return String(zei(d))}
function pVi(c){jVi();var a,b;if(c==null){return false}else{b=c.length;switch(b){case 0:return false;case 1:return nVi(c.charCodeAt(0));default:if(!nVi(c.charCodeAt(0))){return false}for(a=1;a<b;++a){if(!oVi(c.charCodeAt(a))){return false}}}return true}}
function nVi(a){return a>=65&&a<=90||a>=97&&a<=122||a>=192&&a<=214||a>=216&&a<=246||a>=248&&a<=255||a>=256&&a<=305||a>=308&&a<=318||a>=321&&a<=328||a>=330&&a<=382||a>=384&&a<=451||a>=461&&a<=496||a>=500&&a<=501||a>=506&&a<=535||a>=592&&a<=680||a>=699&&a<=705||a==902||a>=904&&a<=906||a==908||a>=910&&a<=929||a>=931&&a<=974||a>=976&&a<=982||a==986||a==988||a==990||a==992||a>=994&&a<=1011||a>=1025&&a<=1036||a>=1038&&a<=1103||a>=1105&&a<=1116||a>=1118&&a<=1153||a>=1168&&a<=1220||a>=1223&&a<=1224||a>=1227&&a<=1228||a>=1232&&a<=1259||a>=1262&&a<=1269||a>=1272&&a<=1273||a>=1329&&a<=1366||a==1369||a>=1377&&a<=1414||a>=1488&&a<=1514||a>=1520&&a<=1522||a>=1569&&a<=1594||a>=1601&&a<=1610||a>=1649&&a<=1719||a>=1722&&a<=1726||a>=1728&&a<=1742||a>=1744&&a<=1747||a==1749||a>=1765&&a<=1766||a>=2309&&a<=2361||a==2365||a>=2392&&a<=2401||a>=2437&&a<=2444||a>=2447&&a<=2448||a>=2451&&a<=2472||a>=2474&&a<=2480||a==2482||a>=2486&&a<=2489||a>=2524&&a<=2525||a>=2527&&a<=2529||a>=2544&&a<=2545||a>=2565&&a<=2570||a>=2575&&a<=2576||a>=2579&&a<=2600||a>=2602&&a<=2608||a>=2610&&a<=2611||a>=2613&&a<=2614||a>=2616&&a<=2617||a>=2649&&a<=2652||a==2654||a>=2674&&a<=2676||a>=2693&&a<=2699||a==2701||a>=2703&&a<=2705||a>=2707&&a<=2728||a>=2730&&a<=2736||a>=2738&&a<=2739||a>=2741&&a<=2745||a==2749||a==2784||a>=2821&&a<=2828||a>=2831&&a<=2832||a>=2835&&a<=2856||a>=2858&&a<=2864||a>=2866&&a<=2867||a>=2870&&a<=2873||a==2877||a>=2908&&a<=2909||a>=2911&&a<=2913||a>=2949&&a<=2954||a>=2958&&a<=2960||a>=2962&&a<=2965||a>=2969&&a<=2970||a==2972||a>=2974&&a<=2975||a>=2979&&a<=2980||a>=2984&&a<=2986||a>=2990&&a<=2997||a>=2999&&a<=3001||a>=3077&&a<=3084||a>=3086&&a<=3088||a>=3090&&a<=3112||a>=3114&&a<=3123||a>=3125&&a<=3129||a>=3168&&a<=3169||a>=3205&&a<=3212||a>=3214&&a<=3216||a>=3218&&a<=3240||a>=3242&&a<=3251||a>=3253&&a<=3257||a==3294||a>=3296&&a<=3297||a>=3333&&a<=3340||a>=3342&&a<=3344||a>=3346&&a<=3368||a>=3370&&a<=3385||a>=3424&&a<=3425||a>=3585&&a<=3630||a==3632||a>=3634&&a<=3635||a>=3648&&a<=3653||a>=3713&&a<=3714||a==3716||a>=3719&&a<=3720||a==3722||a==3725||a>=3732&&a<=3735||a>=3737&&a<=3743||a>=3745&&a<=3747||a==3749||a==3751||a>=3754&&a<=3755||a>=3757&&a<=3758||a==3760||a>=3762&&a<=3763||a==3773||a>=3776&&a<=3780||a>=3904&&a<=3911||a>=3913&&a<=3945||a>=4256&&a<=4293||a>=4304&&a<=4342||a==4352||a>=4354&&a<=4355||a>=4357&&a<=4359||a==4361||a>=4363&&a<=4364||a>=4366&&a<=4370||a==4412||a==4414||a==4416||a==4428||a==4430||a==4432||a>=4436&&a<=4437||a==4441||a>=4447&&a<=4449||a==4451||a==4453||a==4455||a==4457||a>=4461&&a<=4462||a>=4466&&a<=4467||a==4469||a==4510||a==4520||a==4523||a>=4526&&a<=4527||a>=4535&&a<=4536||a==4538||a>=4540&&a<=4546||a==4587||a==4592||a==4601||a>=7680&&a<=7835||a>=7840&&a<=7929||a>=7936&&a<=7957||a>=7960&&a<=7965||a>=7968&&a<=8005||a>=8008&&a<=8013||a>=8016&&a<=8023||a==8025||a==8027||a==8029||a>=8031&&a<=8061||a>=8064&&a<=8116||a>=8118&&a<=8124||a==8126||a>=8130&&a<=8132||a>=8134&&a<=8140||a>=8144&&a<=8147||a>=8150&&a<=8155||a>=8160&&a<=8172||a>=8178&&a<=8180||a>=8182&&a<=8188||a==8486||a>=8490&&a<=8491||a==8494||a>=8576&&a<=8578||a>=12353&&a<=12436||a>=12449&&a<=12538||a>=12549&&a<=12588||a>=44032&&a<=55203||a>=19968&&a<=40869||a==12295||a>=12321&&a<=12329||a==95}
function oVi(a){return a>=48&&a<=57||a>=1632&&a<=1641||a>=1776&&a<=1785||a>=2406&&a<=2415||a>=2534&&a<=2543||a>=2662&&a<=2671||a>=2790&&a<=2799||a>=2918&&a<=2927||a>=3047&&a<=3055||a>=3174&&a<=3183||a>=3302&&a<=3311||a>=3430&&a<=3439||a>=3664&&a<=3673||a>=3792&&a<=3801||a>=3872&&a<=3881||a>=65&&a<=90||a>=97&&a<=122||a>=192&&a<=214||a>=216&&a<=246||a>=248&&a<=255||a>=256&&a<=305||a>=308&&a<=318||a>=321&&a<=328||a>=330&&a<=382||a>=384&&a<=451||a>=461&&a<=496||a>=500&&a<=501||a>=506&&a<=535||a>=592&&a<=680||a>=699&&a<=705||a==902||a>=904&&a<=906||a==908||a>=910&&a<=929||a>=931&&a<=974||a>=976&&a<=982||a==986||a==988||a==990||a==992||a>=994&&a<=1011||a>=1025&&a<=1036||a>=1038&&a<=1103||a>=1105&&a<=1116||a>=1118&&a<=1153||a>=1168&&a<=1220||a>=1223&&a<=1224||a>=1227&&a<=1228||a>=1232&&a<=1259||a>=1262&&a<=1269||a>=1272&&a<=1273||a>=1329&&a<=1366||a==1369||a>=1377&&a<=1414||a>=1488&&a<=1514||a>=1520&&a<=1522||a>=1569&&a<=1594||a>=1601&&a<=1610||a>=1649&&a<=1719||a>=1722&&a<=1726||a>=1728&&a<=1742||a>=1744&&a<=1747||a==1749||a>=1765&&a<=1766||a>=2309&&a<=2361||a==2365||a>=2392&&a<=2401||a>=2437&&a<=2444||a>=2447&&a<=2448||a>=2451&&a<=2472||a>=2474&&a<=2480||a==2482||a>=2486&&a<=2489||a>=2524&&a<=2525||a>=2527&&a<=2529||a>=2544&&a<=2545||a>=2565&&a<=2570||a>=2575&&a<=2576||a>=2579&&a<=2600||a>=2602&&a<=2608||a>=2610&&a<=2611||a>=2613&&a<=2614||a>=2616&&a<=2617||a>=2649&&a<=2652||a==2654||a>=2674&&a<=2676||a>=2693&&a<=2699||a==2701||a>=2703&&a<=2705||a>=2707&&a<=2728||a>=2730&&a<=2736||a>=2738&&a<=2739||a>=2741&&a<=2745||a==2749||a==2784||a>=2821&&a<=2828||a>=2831&&a<=2832||a>=2835&&a<=2856||a>=2858&&a<=2864||a>=2866&&a<=2867||a>=2870&&a<=2873||a==2877||a>=2908&&a<=2909||a>=2911&&a<=2913||a>=2949&&a<=2954||a>=2958&&a<=2960||a>=2962&&a<=2965||a>=2969&&a<=2970||a==2972||a>=2974&&a<=2975||a>=2979&&a<=2980||a>=2984&&a<=2986||a>=2990&&a<=2997||a>=2999&&a<=3001||a>=3077&&a<=3084||a>=3086&&a<=3088||a>=3090&&a<=3112||a>=3114&&a<=3123||a>=3125&&a<=3129||a>=3168&&a<=3169||a>=3205&&a<=3212||a>=3214&&a<=3216||a>=3218&&a<=3240||a>=3242&&a<=3251||a>=3253&&a<=3257||a==3294||a>=3296&&a<=3297||a>=3333&&a<=3340||a>=3342&&a<=3344||a>=3346&&a<=3368||a>=3370&&a<=3385||a>=3424&&a<=3425||a>=3585&&a<=3630||a==3632||a>=3634&&a<=3635||a>=3648&&a<=3653||a>=3713&&a<=3714||a==3716||a>=3719&&a<=3720||a==3722||a==3725||a>=3732&&a<=3735||a>=3737&&a<=3743||a>=3745&&a<=3747||a==3749||a==3751||a>=3754&&a<=3755||a>=3757&&a<=3758||a==3760||a>=3762&&a<=3763||a==3773||a>=3776&&a<=3780||a>=3904&&a<=3911||a>=3913&&a<=3945||a>=4256&&a<=4293||a>=4304&&a<=4342||a==4352||a>=4354&&a<=4355||a>=4357&&a<=4359||a==4361||a>=4363&&a<=4364||a>=4366&&a<=4370||a==4412||a==4414||a==4416||a==4428||a==4430||a==4432||a>=4436&&a<=4437||a==4441||a>=4447&&a<=4449||a==4451||a==4453||a==4455||a==4457||a>=4461&&a<=4462||a>=4466&&a<=4467||a==4469||a==4510||a==4520||a==4523||a>=4526&&a<=4527||a>=4535&&a<=4536||a==4538||a>=4540&&a<=4546||a==4587||a==4592||a==4601||a>=7680&&a<=7835||a>=7840&&a<=7929||a>=7936&&a<=7957||a>=7960&&a<=7965||a>=7968&&a<=8005||a>=8008&&a<=8013||a>=8016&&a<=8023||a==8025||a==8027||a==8029||a>=8031&&a<=8061||a>=8064&&a<=8116||a>=8118&&a<=8124||a==8126||a>=8130&&a<=8132||a>=8134&&a<=8140||a>=8144&&a<=8147||a>=8150&&a<=8155||a>=8160&&a<=8172||a>=8178&&a<=8180||a>=8182&&a<=8188||a==8486||a>=8490&&a<=8491||a==8494||a>=8576&&a<=8578||a>=12353&&a<=12436||a>=12449&&a<=12538||a>=12549&&a<=12588||a>=44032&&a<=55203||a>=19968&&a<=40869||a==12295||a>=12321&&a<=12329||a==95||a==46||a==45||a>=768&&a<=837||a>=864&&a<=865||a>=1155&&a<=1158||a>=1425&&a<=1441||a>=1443&&a<=1465||a>=1467&&a<=1469||a==1471||a>=1473&&a<=1474||a==1476||a>=1611&&a<=1618||a==1648||a>=1750&&a<=1756||a>=1757&&a<=1759||a>=1760&&a<=1764||a>=1767&&a<=1768||a>=1770&&a<=1773||a>=2305&&a<=2307||a==2364||a>=2366&&a<=2380||a==2381||a>=2385&&a<=2388||a>=2402&&a<=2403||a>=2433&&a<=2435||a==2492||a==2494||a==2495||a>=2496&&a<=2500||a>=2503&&a<=2504||a>=2507&&a<=2509||a==2519||a>=2530&&a<=2531||a==2562||a==2620||a==2622||a==2623||a>=2624&&a<=2626||a>=2631&&a<=2632||a>=2635&&a<=2637||a>=2672&&a<=2673||a>=2689&&a<=2691||a==2748||a>=2750&&a<=2757||a>=2759&&a<=2761||a>=2763&&a<=2765||a>=2817&&a<=2819||a==2876||a>=2878&&a<=2883||a>=2887&&a<=2888||a>=2891&&a<=2893||a>=2902&&a<=2903||a>=2946&&a<=2947||a>=3006&&a<=3010||a>=3014&&a<=3016||a>=3018&&a<=3021||a==3031||a>=3073&&a<=3075||a>=3134&&a<=3140||a>=3142&&a<=3144||a>=3146&&a<=3149||a>=3157&&a<=3158||a>=3202&&a<=3203||a>=3262&&a<=3268||a>=3270&&a<=3272||a>=3274&&a<=3277||a>=3285&&a<=3286||a>=3330&&a<=3331||a>=3390&&a<=3395||a>=3398&&a<=3400||a>=3402&&a<=3405||a==3415||a==3633||a>=3636&&a<=3642||a>=3655&&a<=3662||a==3761||a>=3764&&a<=3769||a>=3771&&a<=3772||a>=3784&&a<=3789||a>=3864&&a<=3865||a==3893||a==3895||a==3897||a==3902||a==3903||a>=3953&&a<=3972||a>=3974&&a<=3979||a>=3984&&a<=3989||a==3991||a>=3993&&a<=4013||a>=4017&&a<=4023||a==4025||a>=8400&&a<=8412||a==8417||a>=12330&&a<=12335||a==12441||a==12442||a==183||a==720||a==721||a==903||a==1600||a==3654||a==3782||a==12293||a>=12337&&a<=12341||a>=12445&&a<=12446||a>=12540&&a<=12542}
var kVi;function rVi(){rVi=v0i;sVi=f9h(cai,52,12,[lfi(iyg),lfi(jyg),lfi(kyg),lfi(lyg),lfi(myg),lfi(nyg),lfi(oyg),lfi(pyg),lfi(ryg),lfi(syg),lfi(tyg),lfi(uyg),lfi(vyg),lfi(wyg),lfi(xyg),lfi(yyg),lfi(zyg),lfi(Ayg),lfi(Cyg),lfi(Dyg),lfi(Eyg),lfi(Fyg),lfi(azg),lfi(bzg),lfi(czg),lfi(dzg),lfi(ezg),lfi(fzg),lfi(hzg),lfi(izg),lfi(jzg),lfi(kzg),lfi(lzg),lfi(mzg),lfi(nzg),lfi(ozg),lfi(pzg),lfi(qzg),lfi(szg),lfi(tzg),lfi(uzg),lfi(vzg),lfi(wzg),lfi(xzg),lfi(yzg),lfi(zzg),lfi(Azg),lfi(Bzg),lfi(Dzg),lfi(Ezg),lfi(Fzg),lfi(aAg),lfi(bAg),lfi(cAg),lfi(dAg),lfi(eAg),lfi(fAg),lfi(gAg),lfi(iAg),lfi(jAg),lfi(kAg),lfi(lAg),lfi(mAg),lfi(nAg),lfi(oAg),lfi(pAg),lfi(qAg),lfi(rAg),lfi(tAg),lfi(uAg),lfi(vAg),lfi(wAg),lfi(xAg),lfi(yAg),lfi(zAg),lfi(AAg),lfi(BAg),lfi(CAg),lfi(EAg),lfi(FAg),lfi(aBg),lfi(bBg),lfi(cBg),lfi(dBg),lfi(eBg),lfi(fBg),lfi(gBg),lfi(hBg),lfi(kBg),lfi(lBg),lfi(mBg),lfi(nBg),lfi(oBg),lfi(pBg),lfi(qBg),lfi(rBg),lfi(sBg),lfi(tBg),lfi(vBg),lfi(wBg),lfi(xBg),lfi(yBg),lfi(zBg),lfi(ABg),lfi(BBg),lfi(CBg),lfi(DBg),lfi(EBg),lfi(aCg),lfi(bCg),lfi(cCg),lfi(dCg),lfi(eCg),lfi(fCg),lfi(gCg),lfi(hCg),lfi(iCg),lfi(jCg),lfi(lCg),lfi(mCg),lfi(nCg),lfi(oCg),lfi(pCg),lfi(qCg),lfi(rCg),lfi(sCg),lfi(tCg),lfi(uCg),lfi(wCg),lfi(xCg),lfi(yCg),lfi(zCg),lfi(ACg),lfi(BCg),lfi(CCg),lfi(DCg),lfi(ECg),lfi(FCg),lfi(bDg),lfi(cDg),lfi(dDg),lfi(eDg),lfi(fDg),lfi(gDg),lfi(hDg),lfi(iDg),lfi(jDg),lfi(kDg),lfi(mDg),lfi(nDg),lfi(oDg),lfi(pDg),lfi(qDg),lfi(rDg),lfi(sDg),lfi(tDg),lfi(uDg),lfi(vDg),lfi(xDg),lfi(yDg),lfi(zDg),lfi(ADg),lfi(BDg),lfi(CDg),lfi(DDg),lfi(EDg),lfi(FDg),lfi(aEg),lfi(cEg),lfi(dEg),lfi(eEg),lfi(fEg),lfi(gEg),lfi(hEg),lfi(iEg),lfi(jEg),lfi(kEg),lfi(lEg),lfi(nEg),lfi(oEg),lfi(pEg),lfi(qEg),lfi(rEg),lfi(sEg),lfi(tEg),lfi(uEg),lfi(vEg),lfi(wEg),lfi(zEg),lfi(AEg),lfi(BEg),lfi(CEg),lfi(DEg),lfi(EEg),lfi(FEg),lfi(aFg),lfi(bFg),lfi(cFg),lfi(eFg),lfi(fFg),lfi(gFg),lfi(hFg),lfi(iFg),lfi(jFg),lfi(kFg),lfi(lFg),lfi(mFg),lfi(nFg),lfi(pFg),lfi(qFg),lfi(rFg),lfi(sFg),lfi(tFg),lfi(uFg),lfi(vFg),lfi(wFg),lfi(xFg),lfi(yFg),lfi(AFg),lfi(BFg),lfi(CFg),lfi(DFg),lfi(EFg),lfi(FFg),lfi(aGg),lfi(bGg),lfi(cGg),lfi(dGg),lfi(fGg),lfi(gGg),lfi(hGg),lfi(iGg),lfi(jGg),lfi(kGg),lfi(lGg),lfi(mGg),lfi(nGg),lfi(oGg),lfi(qGg),lfi(rGg),lfi(sGg),lfi(tGg),lfi(uGg),lfi(vGg),lfi(wGg),lfi(xGg),lfi(yGg),lfi(zGg),lfi(BGg),lfi(CGg),lfi(DGg),lfi(EGg),lfi(FGg),lfi(aHg),lfi(bHg),lfi(cHg),lfi(dHg),lfi(eHg),lfi(gHg),lfi(hHg),lfi(iHg),lfi(jHg),lfi(kHg),lfi(lHg),lfi(mHg),lfi(nHg),lfi(oHg),lfi(pHg),lfi(rHg),lfi(sHg),lfi(tHg),lfi(uHg),lfi(vHg),lfi(wHg),lfi(xHg),lfi(yHg),lfi(zHg),lfi(AHg),lfi(CHg),lfi(DHg),lfi(EHg),lfi(FHg),lfi(aIg),lfi(bIg),lfi(cIg),lfi(dIg),lfi(eIg),lfi(fIg),lfi(iIg),lfi(jIg),lfi(kIg),lfi(lIg),lfi(mIg),lfi(nIg),lfi(oIg),lfi(pIg),lfi(qIg),lfi(rIg),lfi(tIg),lfi(uIg),lfi(vIg),lfi(wIg),lfi(xIg),lfi(yIg),lfi(zIg),lfi(AIg),lfi(BIg),lfi(CIg),lfi(EIg),lfi(FIg),lfi(aJg),lfi(bJg),lfi(cJg),lfi(dJg),lfi(eJg),lfi(fJg),lfi(gJg),lfi(hJg),lfi(jJg),lfi(kJg),lfi(lJg),lfi(mJg),lfi(nJg),lfi(oJg),lfi(pJg),lfi(qJg),lfi(rJg),lfi(sJg),lfi(uJg),lfi(vJg),lfi(wJg),lfi(xJg),lfi(yJg),lfi(zJg),lfi(AJg),lfi(BJg),lfi(CJg),lfi(DJg),lfi(FJg),lfi(aKg),lfi(bKg),lfi(cKg),lfi(dKg),lfi(eKg),lfi(fKg),lfi(gKg),lfi(hKg),lfi(iKg),lfi(kKg),lfi(lKg),lfi(mKg),lfi(nKg),lfi(oKg),lfi(pKg),lfi(qKg),lfi(rKg),lfi(sKg),lfi(tKg),lfi(vKg),lfi(wKg),lfi(xKg),lfi(yKg),lfi(zKg),lfi(AKg),lfi(BKg),lfi(CKg),lfi(DKg),lfi(EKg),lfi(aLg),lfi(bLg),lfi(cLg),lfi(dLg),lfi(eLg),lfi(fLg),lfi(gLg),lfi(hLg),lfi(iLg),lfi(jLg),lfi(lLg),lfi(mLg),lfi(nLg),lfi(oLg),lfi(pLg),lfi(qLg),lfi(rLg),lfi(sLg),lfi(tLg),lfi(uLg),lfi(xLg),lfi(yLg),lfi(zLg),lfi(ALg),lfi(BLg),lfi(CLg),lfi(DLg),lfi(ELg),lfi(FLg),lfi(aMg),lfi(cMg),lfi(dMg),lfi(eMg),lfi(fMg),lfi(gMg),lfi(hMg),lfi(iMg),lfi(jMg),lfi(kMg),lfi(lMg),lfi(nMg),lfi(oMg),lfi(pMg),lfi(qMg),lfi(rMg),lfi(sMg),lfi(tMg),lfi(uMg),lfi(vMg),lfi(wMg),lfi(yMg),lfi(zMg),lfi(AMg),lfi(BMg),lfi(CMg),lfi(DMg),lfi(EMg),lfi(FMg),lfi(aNg),lfi(bNg),lfi(dNg),lfi(eNg),lfi(fNg),lfi(gNg),lfi(hNg),lfi(iNg),lfi(jNg),lfi(kNg),lfi(lNg),lfi(mNg),lfi(oNg),lfi(pNg),lfi(qNg),lfi(rNg),lfi(sNg),lfi(tNg),lfi(uNg),lfi(vNg),lfi(wNg),lfi(xNg),lfi(zNg),lfi(ANg),lfi(BNg),lfi(CNg),lfi(DNg),lfi(ENg),lfi(FNg),lfi(aOg),lfi(bOg),lfi(cOg),lfi(eOg),lfi(fOg),lfi(gOg),lfi(hOg),lfi(iOg),lfi(jOg),lfi(kOg),lfi(lOg),lfi(mOg),lfi(nOg),lfi(pOg),lfi(qOg),lfi(rOg),lfi(sOg),lfi(tOg),lfi(uOg),lfi(vOg),lfi(wOg),lfi(xOg),lfi(yOg),lfi(AOg),lfi(BOg),lfi(COg),lfi(DOg),lfi(EOg),lfi(FOg),lfi(aPg),lfi(bPg),lfi(cPg),lfi(dPg),lfi(gPg),lfi(hPg),lfi(iPg),lfi(jPg),lfi(kPg),lfi(lPg),lfi(mPg),lfi(nPg),lfi(oPg),lfi(pPg),lfi(rPg),lfi(sPg),lfi(tPg),lfi(uPg),lfi(vPg),lfi(wPg),lfi(xPg),lfi(yPg),lfi(zPg),lfi(APg),lfi(CPg),lfi(DPg),lfi(EPg),lfi(FPg),lfi(aQg),lfi(bQg),lfi(cQg),lfi(dQg),lfi(eQg),lfi(fQg),lfi(hQg),lfi(iQg),lfi(jQg),lfi(kQg),lfi(lQg),lfi(mQg),lfi(nQg),lfi(oQg),lfi(pQg),lfi(qQg),lfi(sQg),lfi(tQg),lfi(uQg),lfi(vQg),lfi(wQg),lfi(xQg),lfi(yQg),lfi(zQg),lfi(AQg),lfi(BQg),lfi(DQg),lfi(EQg),lfi(FQg),lfi(aRg),lfi(bRg),lfi(cRg),lfi(dRg),lfi(eRg),lfi(fRg),lfi(gRg),lfi(iRg),lfi(jRg),lfi(kRg),lfi(lRg),lfi(mRg),lfi(nRg),lfi(oRg),lfi(pRg),lfi(qRg),lfi(rRg),lfi(tRg),lfi(uRg),lfi(vRg),lfi(wRg),lfi(xRg),lfi(yRg),lfi(zRg),lfi(ARg),lfi(BRg),lfi(CRg),lfi(ERg),lfi(FRg),lfi(aSg),lfi(bSg),lfi(cSg),lfi(dSg),lfi(eSg),lfi(fSg),lfi(gSg),lfi(hSg),lfi(jSg),lfi(kSg),lfi(lSg),lfi(mSg),lfi(nSg),lfi(oSg),lfi(pSg),lfi(qSg),lfi(rSg),lfi(sSg),lfi(vSg),lfi(wSg),lfi(xSg),lfi(ySg),lfi(zSg),lfi(ASg),lfi(BSg),lfi(CSg),lfi(DSg),lfi(ESg),lfi(aTg),lfi(bTg),lfi(cTg),lfi(dTg),lfi(eTg),lfi(fTg),lfi(gTg),lfi(hTg),lfi(iTg),lfi(jTg),lfi(lTg),lfi(mTg),lfi(nTg),lfi(oTg),lfi(pTg),lfi(qTg),lfi(rTg),lfi(sTg),lfi(tTg),lfi(uTg),lfi(wTg),lfi(xTg),lfi(yTg),lfi(zTg),lfi(ATg),lfi(BTg),lfi(CTg),lfi(DTg),lfi(ETg),lfi(FTg),lfi(bUg),lfi(cUg),lfi(dUg),lfi(eUg),lfi(fUg),lfi(gUg),lfi(hUg),lfi(iUg),lfi(jUg),lfi(kUg),lfi(mUg),lfi(nUg),lfi(oUg),lfi(pUg),lfi(qUg),lfi(rUg),lfi(sUg),lfi(tUg),lfi(uUg),lfi(vUg),lfi(xUg),lfi(yUg),lfi(zUg),lfi(AUg),lfi(BUg),lfi(CUg),lfi(DUg),lfi(EUg),lfi(FUg),lfi(aVg),lfi(cVg),lfi(dVg),lfi(eVg),lfi(fVg),lfi(gVg),lfi(hVg),lfi(iVg),lfi(jVg),lfi(kVg),lfi(lVg),lfi(nVg),lfi(oVg),lfi(pVg),lfi(qVg),lfi(rVg),lfi(sVg),lfi(tVg),lfi(uVg),lfi(vVg),lfi(wVg),lfi(yVg),lfi(zVg),lfi(AVg),lfi(BVg),lfi(CVg),lfi(DVg),lfi(EVg),lfi(FVg),lfi(aWg),lfi(bWg),lfi(eWg),lfi(fWg),lfi(gWg),lfi(hWg),lfi(iWg),lfi(jWg),lfi(kWg),lfi(lWg),lfi(mWg),lfi(nWg),lfi(pWg),lfi(qWg),lfi(rWg),lfi(sWg),lfi(tWg),lfi(uWg),lfi(vWg),lfi(wWg),lfi(xWg),lfi(yWg),lfi(AWg),lfi(BWg),lfi(CWg),lfi(DWg),lfi(EWg),lfi(FWg),lfi(aXg),lfi(bXg),lfi(cXg),lfi(dXg),lfi(fXg),lfi(gXg),lfi(hXg),lfi(iXg),lfi(jXg),lfi(kXg),lfi(lXg),lfi(mXg),lfi(nXg),lfi(oXg),lfi(qXg),lfi(rXg),lfi(sXg),lfi(tXg),lfi(uXg),lfi(vXg),lfi(wXg),lfi(xXg),lfi(yXg),lfi(zXg),lfi(BXg),lfi(CXg),lfi(DXg),lfi(EXg),lfi(FXg),lfi(aYg),lfi(bYg),lfi(cYg),lfi(dYg),lfi(eYg),lfi(gYg),lfi(hYg),lfi(iYg),lfi(jYg),lfi(kYg),lfi(lYg),lfi(mYg),lfi(nYg),lfi(oYg),lfi(pYg),lfi(rYg),lfi(sYg),lfi(tYg),lfi(uYg),lfi(vYg),lfi(wYg),lfi(xYg),lfi(yYg),lfi(zYg),lfi(AYg),lfi(CYg),lfi(DYg),lfi(EYg),lfi(FYg),lfi(aZg),lfi(bZg),lfi(cZg),lfi(dZg),lfi(eZg),lfi(fZg),lfi(hZg),lfi(iZg),lfi(jZg),lfi(kZg),lfi(lZg),lfi(mZg),lfi(nZg),lfi(oZg),lfi(pZg),lfi(qZg),lfi(uZg),lfi(vZg),lfi(wZg),lfi(xZg),lfi(yZg),lfi(zZg),lfi(AZg),lfi(BZg),lfi(CZg),lfi(DZg),lfi(FZg),lfi(a0g),lfi(b0g),lfi(c0g),lfi(d0g),lfi(e0g),lfi(f0g),lfi(g0g),lfi(h0g),lfi(i0g),lfi(k0g),lfi(l0g),lfi(m0g),lfi(n0g),lfi(o0g),lfi(p0g),lfi(q0g),lfi(r0g),lfi(s0g),lfi(t0g),lfi(v0g),lfi(w0g),lfi(x0g),lfi(y0g),lfi(z0g),lfi(A0g),lfi(B0g),lfi(C0g),lfi(D0g),lfi(E0g),lfi(a1g),lfi(b1g),lfi(c1g),lfi(d1g),lfi(e1g),lfi(f1g),lfi(g1g),lfi(h1g),lfi(i1g),lfi(j1g),lfi(l1g),lfi(m1g),lfi(n1g),lfi(o1g),lfi(p1g),lfi(q1g),lfi(r1g),lfi(s1g),lfi(t1g),lfi(u1g),lfi(w1g),lfi(x1g),lfi(y1g),lfi(z1g),lfi(A1g),lfi(B1g),lfi(C1g),lfi(D1g),lfi(E1g),lfi(F1g),lfi(b2g),lfi(c2g),lfi(d2g),lfi(e2g),lfi(f2g),lfi(g2g),lfi(h2g),lfi(i2g),lfi(j2g),lfi(k2g),lfi(m2g),lfi(n2g),lfi(o2g),lfi(p2g),lfi(q2g),lfi(r2g),lfi(s2g),lfi(t2g),lfi(u2g),lfi(v2g),lfi(x2g),lfi(y2g),lfi(z2g),lfi(A2g),lfi(B2g),lfi(C2g),lfi(D2g),lfi(E2g),lfi(F2g),lfi(a3g),lfi(d3g),lfi(e3g),lfi(f3g),lfi(g3g),lfi(h3g),lfi(i3g),lfi(j3g),lfi(k3g),lfi(l3g),lfi(m3g),lfi(o3g),lfi(p3g),lfi(q3g),lfi(r3g),lfi(s3g),lfi(t3g),lfi(u3g),lfi(v3g),lfi(w3g),lfi(x3g),lfi(z3g),lfi(A3g),lfi(B3g),lfi(C3g),lfi(D3g),lfi(E3g),lfi(F3g),lfi(a4g),lfi(b4g),lfi(c4g),lfi(e4g),lfi(f4g),lfi(g4g),lfi(h4g),lfi(i4g),lfi(c7h),lfi(j4g),lfi(k4g),lfi(l4g),lfi(m4g),lfi(n4g),lfi(p4g),lfi(q4g),lfi(r4g),lfi(s4g),lfi(t4g),lfi(u4g),lfi(v4g),lfi(w4g),lfi(x4g),lfi(y4g),lfi(A4g),lfi(B4g),lfi(C4g),lfi(D4g),lfi(E4g),lfi(F4g),lfi(a5g),lfi(b5g),lfi(c5g),lfi(d5g),lfi(f5g),lfi(g5g),lfi(h5g),lfi(i5g),lfi(j5g),lfi(k5g),lfi(l5g),lfi(m5g),lfi(n5g),lfi(o5g),lfi(q5g),lfi(r5g),lfi(s5g),lfi(t5g),lfi(u5g),lfi(v5g),lfi(w5g),lfi(x5g),lfi(y5g),lfi(z5g),lfi(B5g),lfi(C5g),lfi(D5g),lfi(E5g),lfi(F5g),lfi(a6g),lfi(b6g),lfi(c6g),lfi(d6g),lfi(e6g),lfi(g6g),lfi(h6g),lfi(i6g),lfi(j6g),lfi(k6g),lfi(l6g),lfi(m6g),lfi(n6g),lfi(o6g),lfi(p6g),lfi(s6g),lfi(t6g),lfi(u6g),lfi(v6g),lfi(w6g),lfi(x6g),lfi(y6g),lfi(z6g),lfi(A6g),lfi(B6g),lfi(D6g),lfi(E6g),lfi(F6g),lfi(a7g),lfi(b7g),lfi(c7g),lfi(d7g),lfi(e7g),lfi(f7g),lfi(g7g),lfi(i7g),lfi(j7g),lfi(k7g),lfi(l7g),lfi(m7g),lfi(n7g),lfi(o7g),lfi(p7g),lfi(q7g),lfi(r7g),lfi(t7g),lfi(u7g),lfi(v7g),lfi(w7g),lfi(x7g),lfi(y7g),lfi(z7g),lfi(A7g),lfi(B7g),lfi(C7g),lfi(E7g),lfi(F7g),lfi(a8g),lfi(b8g),lfi(c8g),lfi(d8g),lfi(e8g),lfi(f8g),lfi(g8g),lfi(h8g),lfi(j8g),lfi(k8g),lfi(l8g),lfi(m8g),lfi(n8g),lfi(o8g),lfi(p8g),lfi(q8g),lfi(r8g),lfi(s8g),lfi(u8g),lfi(v8g),lfi(w8g),lfi(x8g),lfi(y8g),lfi(z8g),lfi(A8g),lfi(B8g),lfi(C8g),lfi(D8g),lfi(F8g),lfi(a9g),lfi(b9g),lfi(c9g),lfi(d9g),lfi(e9g),lfi(f9g),lfi(g9g),lfi(h9g),lfi(i9g),lfi(k9g),lfi(l9g),lfi(m9g),lfi(n9g),lfi(o9g),lfi(p9g),lfi(q9g),lfi(r9g),lfi(s9g),lfi(t9g),lfi(v9g),lfi(w9g),lfi(x9g),lfi(y9g),lfi(z9g),lfi(A9g),lfi(B9g),lfi(C9g),lfi(D9g),lfi(E9g),lfi(b$g),lfi(c$g),lfi(d$g),lfi(e$g),lfi(f$g),lfi(g$g),lfi(h$g),lfi(i$g),lfi(j$g),lfi(k$g),lfi(m$g),lfi(n$g),lfi(o$g),lfi(p$g),lfi(q$g),lfi(r$g),lfi(s$g),lfi(j2h),lfi(t$g),lfi(u$g),lfi(v$g),lfi(x$g),lfi(y$g),lfi(z$g),lfi(A$g),lfi(B$g),lfi(C$g),lfi(D$g),lfi(E$g),lfi(F$g),lfi(a_g),lfi(c_g),lfi(d_g),lfi(e_g),lfi(f_g),lfi(g_g),lfi(h_g),lfi(i_g),lfi(j_g),lfi(k_g),lfi(l_g),lfi(n_g),lfi(o_g),lfi(p_g),lfi(q_g),lfi(r_g),lfi(s_g),lfi(t_g),lfi(u_g),lfi(v_g),lfi(w_g),lfi(y_g),lfi(z_g),lfi(A_g),lfi(B_g),lfi(C_g),lfi(D_g),lfi(E_g),lfi(F_g),lfi(aah),lfi(bah),lfi(dah),lfi(eah),lfi(fah),lfi(gah),lfi(hah),lfi(iah),lfi(jah),lfi(kah),lfi(lah),lfi(mah),lfi(oah),lfi(pah),lfi(qah),lfi(rah),lfi(sah),lfi(tah),lfi(uah),lfi(vah),lfi(wah),lfi(xah),lfi(zah),lfi(Aah),lfi(Bah),lfi(Cah),lfi(Dah),lfi(Eah),lfi(Fah),lfi(abh),lfi(bbh),lfi(cbh),lfi(ebh),lfi(fbh),lfi(gbh),lfi(hbh),lfi(ibh),lfi(jbh),lfi(kbh),lfi(lbh),lfi(mbh),lfi(nbh),lfi(qbh),lfi(rbh),lfi(sbh),lfi(tbh),lfi(ubh),lfi(vbh),lfi(wbh),lfi(xbh),lfi(ybh),lfi(zbh),lfi(Bbh),lfi(Cbh),lfi(Dbh),lfi(Ebh),lfi(Fbh),lfi(ach),lfi(bch),lfi(cch),lfi(dch),lfi(ech),lfi(gch),lfi(hch),lfi(ich),lfi(jch),lfi(kch),lfi(lch),lfi(mch),lfi(nch),lfi(och),lfi(pch),lfi(rch),lfi(sch),lfi(tch),lfi(uch),lfi(vch),lfi(wch),lfi(xch),lfi(ych),lfi(zch),lfi(Ach),lfi(Cch),lfi(Dch),lfi(Ech),lfi(Fch),lfi(adh),lfi(bdh),lfi(cdh),lfi(ddh),lfi(edh),lfi(fdh),lfi(hdh),lfi(idh),lfi(jdh),lfi(kdh),lfi(ldh),lfi(mdh),lfi(ndh),lfi(odh),lfi(pdh),lfi(qdh),lfi(sdh),lfi(tdh),lfi(udh),lfi(vdh),lfi(wdh),lfi(xdh),lfi(ydh),lfi(zdh),lfi(Adh),lfi(Bdh),lfi(Ddh),lfi(Edh),lfi(Fdh),lfi(aeh),lfi(beh),lfi(ceh),lfi(deh),lfi(eeh),lfi(feh),lfi(geh),lfi(ieh),lfi(jeh),lfi(keh),lfi(leh),lfi(meh),lfi(neh),lfi(oeh),lfi(peh),lfi(qeh),lfi(reh),lfi(teh),lfi(ueh),lfi(veh),lfi(weh),lfi(xeh),lfi(yeh),lfi(zeh),lfi(Aeh),lfi(Beh),lfi(Ceh),lfi(Feh),lfi(afh),lfi(bfh),lfi(cfh),lfi(dfh),lfi(efh),lfi(ffh),lfi(gfh),lfi(hfh),lfi(ifh),lfi(kfh),lfi(lfh),lfi(mfh),lfi(nfh),lfi(ofh),lfi(pfh),lfi(qfh),lfi(rfh),lfi(sfh),lfi(tfh),lfi(vfh),lfi(wfh),lfi(xfh),lfi(yfh),lfi(zfh),lfi(Afh),lfi(Bfh),lfi(Cfh),lfi(Dfh),lfi(Efh),lfi(agh),lfi(bgh),lfi(cgh),lfi(dgh),lfi(egh),lfi(fgh),lfi(ggh),lfi(hgh),lfi(igh),lfi(jgh),lfi(lgh),lfi(mgh),lfi(ngh),lfi(ogh),lfi(pgh),lfi(qgh),lfi(rgh),lfi(sgh),lfi(tgh),lfi(ugh),lfi(wgh),lfi(xgh),lfi(ygh),lfi(zgh),lfi(Agh),lfi(Bgh),lfi(Cgh),lfi(Dgh),lfi(Egh),lfi(Fgh),lfi(bhh),lfi(chh),lfi(dhh),lfi(ehh),lfi(fhh),lfi(ghh),lfi(hhh),lfi(o2h),lfi(ihh),lfi(jhh),lfi(khh),lfi(mhh),lfi(nhh),lfi(ohh),lfi(phh),lfi(qhh),lfi(rhh),lfi(shh),lfi(thh),lfi(uhh),lfi(vhh),lfi(xhh),lfi(yhh),lfi(zhh),lfi(Ahh),lfi(Bhh),lfi(Chh),lfi(Dhh),lfi(Ehh),lfi(Fhh),lfi(aih),lfi(cih),lfi(dih),lfi(eih),lfi(fih),lfi(gih),lfi(hih),lfi(iih),lfi(jih),lfi(kih),lfi(lih),lfi(oih),lfi(pih),lfi(qih),lfi(rih),lfi(sih),lfi(tih),lfi(uih),lfi(vih),lfi(wih),lfi(xih),lfi(zih),lfi(Aih),lfi(Bih),lfi(Cih),lfi(Dih),lfi(Eih),lfi(Fih),lfi(ajh),lfi(bjh),lfi(cjh),lfi(ejh),lfi(fjh),lfi(gjh),lfi(hjh),lfi(ijh),lfi(jjh),lfi(kjh),lfi(ljh),lfi(mjh),lfi(njh),lfi(pjh),lfi(qjh),lfi(rjh),lfi(sjh),lfi(tjh),lfi(ujh),lfi(vjh),lfi(wjh),lfi(xjh),lfi(yjh),lfi(Ajh),lfi(Bjh),lfi(Cjh),lfi(Djh),lfi(Ejh),lfi(Fjh),lfi(akh),lfi(bkh),lfi(ckh),lfi(dkh),lfi(fkh),lfi(gkh),lfi(hkh),lfi(ikh),lfi(jkh),lfi(kkh),lfi(lkh),lfi(mkh),lfi(nkh),lfi(okh),lfi(qkh),lfi(rkh),lfi(skh),lfi(tkh),lfi(ukh),lfi(vkh),lfi(wkh),lfi(xkh),lfi(ykh),lfi(zkh),lfi(Bkh),lfi(Ckh),lfi(Dkh),lfi(Ekh),lfi(Fkh),lfi(alh),lfi(blh),lfi(clh),lfi(dlh),lfi(elh),lfi(v3h),lfi(glh),lfi(hlh),lfi(ilh),lfi(jlh),lfi(klh),lfi(llh),lfi(mlh),lfi(nlh),lfi(olh),lfi(plh),lfi(rlh),lfi(slh),lfi(tlh),lfi(ulh),lfi(vlh),lfi(wlh),lfi(xlh),lfi(ylh),lfi(zlh),lfi(Alh),lfi(Dlh),lfi(Elh),lfi(Flh),lfi(amh),lfi(bmh),lfi(cmh),lfi(dmh),lfi(emh),lfi(fmh),lfi(gmh),lfi(imh),lfi(jmh),lfi(kmh),lfi(lmh),lfi(mmh),lfi(nmh),lfi(omh),lfi(pmh),lfi(qmh),lfi(rmh),lfi(tmh),lfi(umh),lfi(vmh),lfi(wmh),lfi(xmh),lfi(ymh),lfi(zmh),lfi(Amh),lfi(Bmh),lfi(Cmh),lfi(Emh),lfi(Fmh),lfi(anh),lfi(bnh),lfi(cnh),lfi(dnh),lfi(enh),lfi(fnh),lfi(gnh),lfi(hnh),lfi(jnh),lfi(knh),lfi(lnh),lfi(mnh),lfi(nnh),lfi(onh),lfi(pnh),lfi(qnh),lfi(rnh),lfi(snh),lfi(unh),lfi(vnh),lfi(wnh),lfi(xnh),lfi(ynh),lfi(znh),lfi(Anh),lfi(Bnh),lfi(Cnh),lfi(Dnh),lfi(Fnh),lfi(aoh),lfi(boh),lfi(coh),lfi(doh),lfi(eoh),lfi(foh),lfi(goh),lfi(hoh),lfi(ioh),lfi(koh),lfi(loh),lfi(moh),lfi(noh),lfi(ooh),lfi(poh),lfi(qoh),lfi(roh),lfi(soh),lfi(toh),lfi(voh),lfi(woh),lfi(xoh),lfi(yoh),lfi(zoh),lfi(Aoh),lfi(Boh),lfi(Coh),lfi(Doh),lfi(Eoh),lfi(aph),lfi(bph),lfi(cph),lfi(dph),lfi(eph),lfi(fph),lfi(gph),lfi(hph),lfi(iph),lfi(jph),lfi(mph),lfi(nph),lfi(oph),lfi(pph),lfi(qph),lfi(rph),lfi(sph),lfi(tph),lfi(uph),lfi(vph),lfi(xph),lfi(yph),lfi(zph),lfi(Aph),lfi(Bph),lfi(Cph),lfi(Dph),lfi(Eph),lfi(Fph),lfi(aqh),lfi(cqh),lfi(dqh),lfi(eqh),lfi(fqh),lfi(gqh),lfi(hqh),lfi(iqh),lfi(jqh),lfi(kqh),lfi(lqh),lfi(nqh),lfi(oqh),lfi(pqh),lfi(qqh),lfi(rqh),lfi(sqh),lfi(tqh),lfi(uqh),lfi(vqh),lfi(wqh),lfi(yqh),lfi(zqh),lfi(Aqh),lfi(Bqh),lfi(Cqh),lfi(Dqh),lfi(Eqh),lfi(Fqh),lfi(arh),lfi(brh),lfi(drh),lfi(erh),lfi(frh),lfi(grh),lfi(hrh),lfi(irh),lfi(jrh),lfi(krh),lfi(lrh),lfi(mrh),lfi(orh),lfi(prh),lfi(qrh),lfi(rrh),lfi(srh),lfi(trh),lfi(urh),lfi(vrh),lfi(wrh),lfi(xrh),lfi(zrh),lfi(Arh),lfi(Brh),lfi(Crh),lfi(Drh),lfi(Erh),lfi(Frh),lfi(ash),lfi(bsh),lfi(csh),lfi(esh),lfi(fsh),lfi(gsh),lfi(hsh),lfi(ish),lfi(jsh),lfi(ksh),lfi(lsh),lfi(msh),lfi(nsh),lfi(psh),lfi(qsh),lfi(rsh),lfi(ssh),lfi(tsh),lfi(ush),lfi(vsh),lfi(wsh),lfi(xsh),lfi(ysh),lfi(Bsh),lfi(Csh),lfi(Dsh),lfi(Esh),lfi(Fsh),lfi(ath),lfi(bth),lfi(cth),lfi(dth),lfi(eth),lfi(gth),lfi(hth),lfi(ith),lfi(jth),lfi(kth),lfi(lth),lfi(mth),lfi(nth),lfi(oth),lfi(pth),lfi(rth),lfi(sth),lfi(tth),lfi(uth),lfi(vth),lfi(wth),lfi(xth),lfi(yth),lfi(zth),lfi(Ath),lfi(Cth),lfi(Dth),lfi(Eth),lfi(Fth),lfi(auh),lfi(buh),lfi(cuh),lfi(duh),lfi(euh),lfi(fuh),lfi(huh),lfi(iuh),lfi(juh),lfi(kuh),lfi(luh),lfi(muh),lfi(nuh),lfi(ouh),lfi(puh),lfi(quh),lfi(suh),lfi(tuh),lfi(uuh),lfi(vuh),lfi(wuh),lfi(xuh),lfi(yuh),lfi(zuh),lfi(Auh),lfi(Buh),lfi(Duh),lfi(Euh),lfi(Fuh),lfi(avh),lfi(bvh),lfi(cvh),lfi(dvh),lfi(evh),lfi(fvh),lfi(gvh),lfi(ivh),lfi(jvh),lfi(kvh),lfi(lvh),lfi(mvh),lfi(nvh),lfi(ovh),lfi(pvh),lfi(qvh),lfi(rvh),lfi(tvh),lfi(uvh),lfi(vvh),lfi(wvh),lfi(xvh),lfi(yvh),lfi(zvh),lfi(Avh),lfi(Bvh),lfi(Cvh),lfi(Evh),lfi(Fvh),lfi(awh),lfi(bwh),lfi(cwh),lfi(dwh),lfi(ewh),lfi(fwh),lfi(gwh),lfi(hwh),lfi(lwh),lfi(mwh),lfi(nwh),lfi(owh),lfi(pwh),lfi(qwh),lfi(rwh),lfi(swh),lfi(twh),lfi(uwh),lfi(wwh),lfi(xwh),lfi(ywh),lfi(zwh),lfi(Awh),lfi(Bwh),lfi(Cwh),lfi(Dwh),lfi(Ewh),lfi(Fwh),lfi(bxh),lfi(cxh),lfi(dxh),lfi(exh),lfi(fxh),lfi(gxh),lfi(hxh),lfi(ixh),lfi(jxh),lfi(kxh),lfi(mxh),lfi(nxh),lfi(oxh),lfi(pxh),lfi(qxh),lfi(rxh),lfi(sxh),lfi(txh),lfi(uxh),lfi(vxh),lfi(xxh),lfi(yxh),lfi(zxh),lfi(Axh),lfi(Bxh),lfi(Cxh),lfi(Dxh),lfi(Exh),lfi(Fxh),lfi(ayh),lfi(cyh),lfi(dyh),lfi(eyh),lfi(fyh),lfi(gyh),lfi(hyh),lfi(iyh),lfi(jyh),lfi(kyh),lfi(lyh),lfi(nyh),lfi(oyh),lfi(pyh),lfi(qyh),lfi(ryh),lfi(syh),lfi(tyh),lfi(uyh),lfi(vyh),lfi(wyh),lfi(yyh),lfi(zyh),lfi(Ayh),lfi(Byh),lfi(Cyh),lfi(Dyh),lfi(Eyh),lfi(Fyh),lfi(azh),lfi(bzh),lfi(dzh),lfi(ezh),lfi(fzh),lfi(gzh),lfi(hzh),lfi(izh),lfi(jzh),lfi(kzh),lfi(lzh),lfi(mzh),lfi(ozh),lfi(pzh),lfi(qzh),lfi(rzh),lfi(szh),lfi(tzh),lfi(uzh),lfi(vzh),lfi(wzh),lfi(xzh),lfi(Azh),lfi(Bzh),lfi(Czh),lfi(Dzh),lfi(Ezh),lfi(Fzh),lfi(aAh),lfi(bAh),lfi(cAh),lfi(dAh),lfi(fAh),lfi(gAh),lfi(hAh),lfi(iAh),lfi(jAh),lfi(kAh),lfi(lAh),lfi(mAh),lfi(nAh),lfi(oAh),lfi(qAh),lfi(rAh),lfi(sAh),lfi(tAh),lfi(uAh),lfi(vAh),lfi(wAh),lfi(xAh),lfi(yAh),lfi(zAh),lfi(BAh),lfi(CAh),lfi(DAh),lfi(EAh),lfi(FAh),lfi(aBh),lfi(bBh),lfi(cBh),lfi(dBh),lfi(eBh),lfi(gBh),lfi(hBh),lfi(iBh),lfi(jBh),lfi(kBh),lfi(lBh),lfi(mBh),lfi(nBh),lfi(oBh),lfi(pBh),lfi(rBh),lfi(sBh),lfi(tBh),lfi(uBh),lfi(vBh),lfi(wBh),lfi(xBh),lfi(yBh),lfi(zBh),lfi(ABh),lfi(CBh),lfi(DBh),lfi(EBh),lfi(r6h),lfi(FBh),lfi(aCh),lfi(bCh),lfi(cCh),lfi(dCh),lfi(eCh),lfi(fCh),lfi(hCh),lfi(iCh),lfi(jCh),lfi(kCh),lfi(lCh),lfi(mCh),lfi(nCh),lfi(oCh),lfi(pCh),lfi(qCh),lfi(sCh),lfi(tCh),lfi(uCh),lfi(vCh),lfi(wCh),lfi(xCh),lfi(yCh),lfi(zCh),lfi(ACh),lfi(BCh),lfi(DCh),lfi(ECh),lfi(FCh),lfi(aDh),lfi(bDh),lfi(cDh),lfi(dDh),lfi(eDh),lfi(fDh),lfi(gDh),lfi(jDh),lfi(kDh),lfi(lDh),lfi(mDh),lfi(nDh),lfi(oDh),lfi(pDh),lfi(qDh),lfi(rDh),lfi(sDh),lfi(uDh),lfi(vDh),lfi(wDh),lfi(xDh),lfi(yDh),lfi(zDh),lfi(ADh),lfi(BDh),lfi(CDh),lfi(DDh),lfi(FDh),lfi(aEh),lfi(bEh),lfi(cEh),lfi(dEh),lfi(eEh),lfi(fEh),lfi(gEh),lfi(hEh),lfi(iEh),lfi(kEh),lfi(lEh),lfi(mEh),lfi(nEh),lfi(oEh),lfi(pEh),lfi(qEh),lfi(rEh),lfi(sEh),lfi(tEh),lfi(vEh),lfi(wEh),lfi(xEh),lfi(yEh),lfi(zEh),lfi(AEh),lfi(BEh),lfi(CEh),lfi(DEh),lfi(EEh),lfi(aFh),lfi(bFh),lfi(cFh),lfi(dFh),lfi(eFh),lfi(fFh),lfi(gFh),lfi(hFh),lfi(iFh),lfi(jFh),lfi(lFh),lfi(mFh),lfi(nFh),lfi(oFh),lfi(pFh),lfi(qFh),lfi(rFh),lfi(sFh),lfi(tFh),lfi(uFh),lfi(wFh),lfi(xFh),lfi(yFh),lfi(zFh),lfi(AFh),lfi(BFh),lfi(CFh),lfi(DFh),lfi(EFh),lfi(FFh),lfi(bGh),lfi(cGh),lfi(dGh),lfi(eGh),lfi(fGh),lfi(gGh),lfi(hGh),lfi(iGh),lfi(jGh),lfi(kGh),lfi(mGh),lfi(nGh),lfi(oGh),lfi(pGh),lfi(qGh),lfi(rGh),lfi(sGh),lfi(tGh),lfi(uGh),lfi(vGh),lfi(yGh),lfi(zGh),lfi(AGh),lfi(BGh),lfi(CGh),lfi(DGh),lfi(EGh),lfi(FGh),lfi(aHh),lfi(bHh),lfi(dHh),lfi(eHh),lfi(fHh),lfi(gHh),lfi(hHh),lfi(iHh),lfi(jHh),lfi(kHh),lfi(lHh),lfi(mHh),lfi(oHh),lfi(pHh),lfi(qHh),lfi(rHh),lfi(sHh),lfi(tHh),lfi(uHh),lfi(vHh),lfi(wHh),lfi(xHh),lfi(zHh),lfi(AHh),lfi(BHh),lfi(CHh),lfi(DHh),lfi(EHh),lfi(FHh),lfi(aIh),lfi(bIh),lfi(cIh),lfi(eIh),lfi(fIh),lfi(gIh),lfi(hIh)]);tVi=f9h(cai,52,12,[f9h(A_h,42,-1,[198]),f9h(A_h,42,-1,[198]),f9h(A_h,42,-1,[38]),f9h(A_h,42,-1,[38]),f9h(A_h,42,-1,[193]),f9h(A_h,42,-1,[193]),f9h(A_h,42,-1,[258]),f9h(A_h,42,-1,[194]),f9h(A_h,42,-1,[194]),f9h(A_h,42,-1,[1040]),f9h(A_h,42,-1,[55349,56580]),f9h(A_h,42,-1,[192]),f9h(A_h,42,-1,[192]),f9h(A_h,42,-1,[913]),f9h(A_h,42,-1,[256]),f9h(A_h,42,-1,[10835]),f9h(A_h,42,-1,[260]),f9h(A_h,42,-1,[55349,56632]),f9h(A_h,42,-1,[8289]),f9h(A_h,42,-1,[197]),f9h(A_h,42,-1,[197]),f9h(A_h,42,-1,[55349,56476]),f9h(A_h,42,-1,[8788]),f9h(A_h,42,-1,[195]),f9h(A_h,42,-1,[195]),f9h(A_h,42,-1,[196]),f9h(A_h,42,-1,[196]),f9h(A_h,42,-1,[8726]),f9h(A_h,42,-1,[10983]),f9h(A_h,42,-1,[8966]),f9h(A_h,42,-1,[1041]),f9h(A_h,42,-1,[8757]),f9h(A_h,42,-1,[8492]),f9h(A_h,42,-1,[914]),f9h(A_h,42,-1,[55349,56581]),f9h(A_h,42,-1,[55349,56633]),f9h(A_h,42,-1,[728]),f9h(A_h,42,-1,[8492]),f9h(A_h,42,-1,[8782]),f9h(A_h,42,-1,[1063]),f9h(A_h,42,-1,[169]),f9h(A_h,42,-1,[169]),f9h(A_h,42,-1,[262]),f9h(A_h,42,-1,[8914]),f9h(A_h,42,-1,[8517]),f9h(A_h,42,-1,[8493]),f9h(A_h,42,-1,[268]),f9h(A_h,42,-1,[199]),f9h(A_h,42,-1,[199]),f9h(A_h,42,-1,[264]),f9h(A_h,42,-1,[8752]),f9h(A_h,42,-1,[266]),f9h(A_h,42,-1,[184]),f9h(A_h,42,-1,[183]),f9h(A_h,42,-1,[8493]),f9h(A_h,42,-1,[935]),f9h(A_h,42,-1,[8857]),f9h(A_h,42,-1,[8854]),f9h(A_h,42,-1,[8853]),f9h(A_h,42,-1,[8855]),f9h(A_h,42,-1,[8754]),f9h(A_h,42,-1,[8221]),f9h(A_h,42,-1,[8217]),f9h(A_h,42,-1,[8759]),f9h(A_h,42,-1,[10868]),f9h(A_h,42,-1,[8801]),f9h(A_h,42,-1,[8751]),f9h(A_h,42,-1,[8750]),f9h(A_h,42,-1,[8450]),f9h(A_h,42,-1,[8720]),f9h(A_h,42,-1,[8755]),f9h(A_h,42,-1,[10799]),f9h(A_h,42,-1,[55349,56478]),f9h(A_h,42,-1,[8915]),f9h(A_h,42,-1,[8781]),f9h(A_h,42,-1,[8517]),f9h(A_h,42,-1,[10513]),f9h(A_h,42,-1,[1026]),f9h(A_h,42,-1,[1029]),f9h(A_h,42,-1,[1039]),f9h(A_h,42,-1,[8225]),f9h(A_h,42,-1,[8609]),f9h(A_h,42,-1,[10980]),f9h(A_h,42,-1,[270]),f9h(A_h,42,-1,[1044]),f9h(A_h,42,-1,[8711]),f9h(A_h,42,-1,[916]),f9h(A_h,42,-1,[55349,56583]),f9h(A_h,42,-1,[180]),f9h(A_h,42,-1,[729]),f9h(A_h,42,-1,[733]),f9h(A_h,42,-1,[96]),f9h(A_h,42,-1,[732]),f9h(A_h,42,-1,[8900]),f9h(A_h,42,-1,[8518]),f9h(A_h,42,-1,[55349,56635]),f9h(A_h,42,-1,[168]),f9h(A_h,42,-1,[8412]),f9h(A_h,42,-1,[8784]),f9h(A_h,42,-1,[8751]),f9h(A_h,42,-1,[168]),f9h(A_h,42,-1,[8659]),f9h(A_h,42,-1,[8656]),f9h(A_h,42,-1,[8660]),f9h(A_h,42,-1,[10980]),f9h(A_h,42,-1,[10232]),f9h(A_h,42,-1,[10234]),f9h(A_h,42,-1,[10233]),f9h(A_h,42,-1,[8658]),f9h(A_h,42,-1,[8872]),f9h(A_h,42,-1,[8657]),f9h(A_h,42,-1,[8661]),f9h(A_h,42,-1,[8741]),f9h(A_h,42,-1,[8595]),f9h(A_h,42,-1,[10515]),f9h(A_h,42,-1,[8693]),f9h(A_h,42,-1,[785]),f9h(A_h,42,-1,[10576]),f9h(A_h,42,-1,[10590]),f9h(A_h,42,-1,[8637]),f9h(A_h,42,-1,[10582]),f9h(A_h,42,-1,[10591]),f9h(A_h,42,-1,[8641]),f9h(A_h,42,-1,[10583]),f9h(A_h,42,-1,[8868]),f9h(A_h,42,-1,[8615]),f9h(A_h,42,-1,[8659]),f9h(A_h,42,-1,[55349,56479]),f9h(A_h,42,-1,[272]),f9h(A_h,42,-1,[330]),f9h(A_h,42,-1,[208]),f9h(A_h,42,-1,[208]),f9h(A_h,42,-1,[201]),f9h(A_h,42,-1,[201]),f9h(A_h,42,-1,[282]),f9h(A_h,42,-1,[202]),f9h(A_h,42,-1,[202]),f9h(A_h,42,-1,[1069]),f9h(A_h,42,-1,[278]),f9h(A_h,42,-1,[55349,56584]),f9h(A_h,42,-1,[200]),f9h(A_h,42,-1,[200]),f9h(A_h,42,-1,[8712]),f9h(A_h,42,-1,[274]),f9h(A_h,42,-1,[9723]),f9h(A_h,42,-1,[9643]),f9h(A_h,42,-1,[280]),f9h(A_h,42,-1,[55349,56636]),f9h(A_h,42,-1,[917]),f9h(A_h,42,-1,[10869]),f9h(A_h,42,-1,[8770]),f9h(A_h,42,-1,[8652]),f9h(A_h,42,-1,[8496]),f9h(A_h,42,-1,[10867]),f9h(A_h,42,-1,[919]),f9h(A_h,42,-1,[203]),f9h(A_h,42,-1,[203]),f9h(A_h,42,-1,[8707]),f9h(A_h,42,-1,[8519]),f9h(A_h,42,-1,[1060]),f9h(A_h,42,-1,[55349,56585]),f9h(A_h,42,-1,[9724]),f9h(A_h,42,-1,[9642]),f9h(A_h,42,-1,[55349,56637]),f9h(A_h,42,-1,[8704]),f9h(A_h,42,-1,[8497]),f9h(A_h,42,-1,[8497]),f9h(A_h,42,-1,[1027]),f9h(A_h,42,-1,[62]),f9h(A_h,42,-1,[62]),f9h(A_h,42,-1,[915]),f9h(A_h,42,-1,[988]),f9h(A_h,42,-1,[286]),f9h(A_h,42,-1,[290]),f9h(A_h,42,-1,[284]),f9h(A_h,42,-1,[1043]),f9h(A_h,42,-1,[288]),f9h(A_h,42,-1,[55349,56586]),f9h(A_h,42,-1,[8921]),f9h(A_h,42,-1,[55349,56638]),f9h(A_h,42,-1,[8805]),f9h(A_h,42,-1,[8923]),f9h(A_h,42,-1,[8807]),f9h(A_h,42,-1,[10914]),f9h(A_h,42,-1,[8823]),f9h(A_h,42,-1,[10878]),f9h(A_h,42,-1,[8819]),f9h(A_h,42,-1,[55349,56482]),f9h(A_h,42,-1,[8811]),f9h(A_h,42,-1,[1066]),f9h(A_h,42,-1,[711]),f9h(A_h,42,-1,[94]),f9h(A_h,42,-1,[292]),f9h(A_h,42,-1,[8460]),f9h(A_h,42,-1,[8459]),f9h(A_h,42,-1,[8461]),f9h(A_h,42,-1,[9472]),f9h(A_h,42,-1,[8459]),f9h(A_h,42,-1,[294]),f9h(A_h,42,-1,[8782]),f9h(A_h,42,-1,[8783]),f9h(A_h,42,-1,[1045]),f9h(A_h,42,-1,[306]),f9h(A_h,42,-1,[1025]),f9h(A_h,42,-1,[205]),f9h(A_h,42,-1,[205]),f9h(A_h,42,-1,[206]),f9h(A_h,42,-1,[206]),f9h(A_h,42,-1,[1048]),f9h(A_h,42,-1,[304]),f9h(A_h,42,-1,[8465]),f9h(A_h,42,-1,[204]),f9h(A_h,42,-1,[204]),f9h(A_h,42,-1,[8465]),f9h(A_h,42,-1,[298]),f9h(A_h,42,-1,[8520]),f9h(A_h,42,-1,[8658]),f9h(A_h,42,-1,[8748]),f9h(A_h,42,-1,[8747]),f9h(A_h,42,-1,[8898]),f9h(A_h,42,-1,[8291]),f9h(A_h,42,-1,[8290]),f9h(A_h,42,-1,[302]),f9h(A_h,42,-1,[55349,56640]),f9h(A_h,42,-1,[921]),f9h(A_h,42,-1,[8464]),f9h(A_h,42,-1,[296]),f9h(A_h,42,-1,[1030]),f9h(A_h,42,-1,[207]),f9h(A_h,42,-1,[207]),f9h(A_h,42,-1,[308]),f9h(A_h,42,-1,[1049]),f9h(A_h,42,-1,[55349,56589]),f9h(A_h,42,-1,[55349,56641]),f9h(A_h,42,-1,[55349,56485]),f9h(A_h,42,-1,[1032]),f9h(A_h,42,-1,[1028]),f9h(A_h,42,-1,[1061]),f9h(A_h,42,-1,[1036]),f9h(A_h,42,-1,[922]),f9h(A_h,42,-1,[310]),f9h(A_h,42,-1,[1050]),f9h(A_h,42,-1,[55349,56590]),f9h(A_h,42,-1,[55349,56642]),f9h(A_h,42,-1,[55349,56486]),f9h(A_h,42,-1,[1033]),f9h(A_h,42,-1,[60]),f9h(A_h,42,-1,[60]),f9h(A_h,42,-1,[313]),f9h(A_h,42,-1,[923]),f9h(A_h,42,-1,[10218]),f9h(A_h,42,-1,[8466]),f9h(A_h,42,-1,[8606]),f9h(A_h,42,-1,[317]),f9h(A_h,42,-1,[315]),f9h(A_h,42,-1,[1051]),f9h(A_h,42,-1,[10216]),f9h(A_h,42,-1,[8592]),f9h(A_h,42,-1,[8676]),f9h(A_h,42,-1,[8646]),f9h(A_h,42,-1,[8968]),f9h(A_h,42,-1,[10214]),f9h(A_h,42,-1,[10593]),f9h(A_h,42,-1,[8643]),f9h(A_h,42,-1,[10585]),f9h(A_h,42,-1,[8970]),f9h(A_h,42,-1,[8596]),f9h(A_h,42,-1,[10574]),f9h(A_h,42,-1,[8867]),f9h(A_h,42,-1,[8612]),f9h(A_h,42,-1,[10586]),f9h(A_h,42,-1,[8882]),f9h(A_h,42,-1,[10703]),f9h(A_h,42,-1,[8884]),f9h(A_h,42,-1,[10577]),f9h(A_h,42,-1,[10592]),f9h(A_h,42,-1,[8639]),f9h(A_h,42,-1,[10584]),f9h(A_h,42,-1,[8636]),f9h(A_h,42,-1,[10578]),f9h(A_h,42,-1,[8656]),f9h(A_h,42,-1,[8660]),f9h(A_h,42,-1,[8922]),f9h(A_h,42,-1,[8806]),f9h(A_h,42,-1,[8822]),f9h(A_h,42,-1,[10913]),f9h(A_h,42,-1,[10877]),f9h(A_h,42,-1,[8818]),f9h(A_h,42,-1,[55349,56591]),f9h(A_h,42,-1,[8920]),f9h(A_h,42,-1,[8666]),f9h(A_h,42,-1,[319]),f9h(A_h,42,-1,[10229]),f9h(A_h,42,-1,[10231]),f9h(A_h,42,-1,[10230]),f9h(A_h,42,-1,[10232]),f9h(A_h,42,-1,[10234]),f9h(A_h,42,-1,[10233]),f9h(A_h,42,-1,[55349,56643]),f9h(A_h,42,-1,[8601]),f9h(A_h,42,-1,[8600]),f9h(A_h,42,-1,[8466]),f9h(A_h,42,-1,[8624]),f9h(A_h,42,-1,[321]),f9h(A_h,42,-1,[8810]),f9h(A_h,42,-1,[10501]),f9h(A_h,42,-1,[1052]),f9h(A_h,42,-1,[8287]),f9h(A_h,42,-1,[8499]),f9h(A_h,42,-1,[55349,56592]),f9h(A_h,42,-1,[8723]),f9h(A_h,42,-1,[55349,56644]),f9h(A_h,42,-1,[8499]),f9h(A_h,42,-1,[924]),f9h(A_h,42,-1,[1034]),f9h(A_h,42,-1,[323]),f9h(A_h,42,-1,[327]),f9h(A_h,42,-1,[325]),f9h(A_h,42,-1,[1053]),f9h(A_h,42,-1,[8203]),f9h(A_h,42,-1,[8203]),f9h(A_h,42,-1,[8203]),f9h(A_h,42,-1,[8203]),f9h(A_h,42,-1,[8811]),f9h(A_h,42,-1,[8810]),f9h(A_h,42,-1,[10]),f9h(A_h,42,-1,[55349,56593]),f9h(A_h,42,-1,[8288]),f9h(A_h,42,-1,[160]),f9h(A_h,42,-1,[8469]),f9h(A_h,42,-1,[10988]),f9h(A_h,42,-1,[8802]),f9h(A_h,42,-1,[8813]),f9h(A_h,42,-1,[8742]),f9h(A_h,42,-1,[8713]),f9h(A_h,42,-1,[8800]),f9h(A_h,42,-1,[8708]),f9h(A_h,42,-1,[8815]),f9h(A_h,42,-1,[8817]),f9h(A_h,42,-1,[8825]),f9h(A_h,42,-1,[8821]),f9h(A_h,42,-1,[8938]),f9h(A_h,42,-1,[8940]),f9h(A_h,42,-1,[8814]),f9h(A_h,42,-1,[8816]),f9h(A_h,42,-1,[8824]),f9h(A_h,42,-1,[8820]),f9h(A_h,42,-1,[8832]),f9h(A_h,42,-1,[8928]),f9h(A_h,42,-1,[8716]),f9h(A_h,42,-1,[8939]),f9h(A_h,42,-1,[8941]),f9h(A_h,42,-1,[8930]),f9h(A_h,42,-1,[8931]),f9h(A_h,42,-1,[8840]),f9h(A_h,42,-1,[8833]),f9h(A_h,42,-1,[8929]),f9h(A_h,42,-1,[8841]),f9h(A_h,42,-1,[8769]),f9h(A_h,42,-1,[8772]),f9h(A_h,42,-1,[8775]),f9h(A_h,42,-1,[8777]),f9h(A_h,42,-1,[8740]),f9h(A_h,42,-1,[55349,56489]),f9h(A_h,42,-1,[209]),f9h(A_h,42,-1,[209]),f9h(A_h,42,-1,[925]),f9h(A_h,42,-1,[338]),f9h(A_h,42,-1,[211]),f9h(A_h,42,-1,[211]),f9h(A_h,42,-1,[212]),f9h(A_h,42,-1,[212]),f9h(A_h,42,-1,[1054]),f9h(A_h,42,-1,[336]),f9h(A_h,42,-1,[55349,56594]),f9h(A_h,42,-1,[210]),f9h(A_h,42,-1,[210]),f9h(A_h,42,-1,[332]),f9h(A_h,42,-1,[937]),f9h(A_h,42,-1,[927]),f9h(A_h,42,-1,[55349,56646]),f9h(A_h,42,-1,[8220]),f9h(A_h,42,-1,[8216]),f9h(A_h,42,-1,[10836]),f9h(A_h,42,-1,[55349,56490]),f9h(A_h,42,-1,[216]),f9h(A_h,42,-1,[216]),f9h(A_h,42,-1,[213]),f9h(A_h,42,-1,[213]),f9h(A_h,42,-1,[10807]),f9h(A_h,42,-1,[214]),f9h(A_h,42,-1,[214]),f9h(A_h,42,-1,[175]),f9h(A_h,42,-1,[9182]),f9h(A_h,42,-1,[9140]),f9h(A_h,42,-1,[9180]),f9h(A_h,42,-1,[8706]),f9h(A_h,42,-1,[1055]),f9h(A_h,42,-1,[55349,56595]),f9h(A_h,42,-1,[934]),f9h(A_h,42,-1,[928]),f9h(A_h,42,-1,[177]),f9h(A_h,42,-1,[8460]),f9h(A_h,42,-1,[8473]),f9h(A_h,42,-1,[10939]),f9h(A_h,42,-1,[8826]),f9h(A_h,42,-1,[10927]),f9h(A_h,42,-1,[8828]),f9h(A_h,42,-1,[8830]),f9h(A_h,42,-1,[8243]),f9h(A_h,42,-1,[8719]),f9h(A_h,42,-1,[8759]),f9h(A_h,42,-1,[8733]),f9h(A_h,42,-1,[55349,56491]),f9h(A_h,42,-1,[936]),f9h(A_h,42,-1,[34]),f9h(A_h,42,-1,[34]),f9h(A_h,42,-1,[55349,56596]),f9h(A_h,42,-1,[8474]),f9h(A_h,42,-1,[55349,56492]),f9h(A_h,42,-1,[10512]),f9h(A_h,42,-1,[174]),f9h(A_h,42,-1,[174]),f9h(A_h,42,-1,[340]),f9h(A_h,42,-1,[10219]),f9h(A_h,42,-1,[8608]),f9h(A_h,42,-1,[10518]),f9h(A_h,42,-1,[344]),f9h(A_h,42,-1,[342]),f9h(A_h,42,-1,[1056]),f9h(A_h,42,-1,[8476]),f9h(A_h,42,-1,[8715]),f9h(A_h,42,-1,[8651]),f9h(A_h,42,-1,[10607]),f9h(A_h,42,-1,[8476]),f9h(A_h,42,-1,[929]),f9h(A_h,42,-1,[10217]),f9h(A_h,42,-1,[8594]),f9h(A_h,42,-1,[8677]),f9h(A_h,42,-1,[8644]),f9h(A_h,42,-1,[8969]),f9h(A_h,42,-1,[10215]),f9h(A_h,42,-1,[10589]),f9h(A_h,42,-1,[8642]),f9h(A_h,42,-1,[10581]),f9h(A_h,42,-1,[8971]),f9h(A_h,42,-1,[8866]),f9h(A_h,42,-1,[8614]),f9h(A_h,42,-1,[10587]),f9h(A_h,42,-1,[8883]),f9h(A_h,42,-1,[10704]),f9h(A_h,42,-1,[8885]),f9h(A_h,42,-1,[10575]),f9h(A_h,42,-1,[10588]),f9h(A_h,42,-1,[8638]),f9h(A_h,42,-1,[10580]),f9h(A_h,42,-1,[8640]),f9h(A_h,42,-1,[10579]),f9h(A_h,42,-1,[8658]),f9h(A_h,42,-1,[8477]),f9h(A_h,42,-1,[10608]),f9h(A_h,42,-1,[8667]),f9h(A_h,42,-1,[8475]),f9h(A_h,42,-1,[8625]),f9h(A_h,42,-1,[10740]),f9h(A_h,42,-1,[1065]),f9h(A_h,42,-1,[1064]),f9h(A_h,42,-1,[1068]),f9h(A_h,42,-1,[346]),f9h(A_h,42,-1,[10940]),f9h(A_h,42,-1,[352]),f9h(A_h,42,-1,[350]),f9h(A_h,42,-1,[348]),f9h(A_h,42,-1,[1057]),f9h(A_h,42,-1,[55349,56598]),f9h(A_h,42,-1,[8595]),f9h(A_h,42,-1,[8592]),f9h(A_h,42,-1,[8594]),f9h(A_h,42,-1,[8593]),f9h(A_h,42,-1,[931]),f9h(A_h,42,-1,[8728]),f9h(A_h,42,-1,[55349,56650]),f9h(A_h,42,-1,[8730]),f9h(A_h,42,-1,[9633]),f9h(A_h,42,-1,[8851]),f9h(A_h,42,-1,[8847]),f9h(A_h,42,-1,[8849]),f9h(A_h,42,-1,[8848]),f9h(A_h,42,-1,[8850]),f9h(A_h,42,-1,[8852]),f9h(A_h,42,-1,[55349,56494]),f9h(A_h,42,-1,[8902]),f9h(A_h,42,-1,[8912]),f9h(A_h,42,-1,[8912]),f9h(A_h,42,-1,[8838]),f9h(A_h,42,-1,[8827]),f9h(A_h,42,-1,[10928]),f9h(A_h,42,-1,[8829]),f9h(A_h,42,-1,[8831]),f9h(A_h,42,-1,[8715]),f9h(A_h,42,-1,[8721]),f9h(A_h,42,-1,[8913]),f9h(A_h,42,-1,[8835]),f9h(A_h,42,-1,[8839]),f9h(A_h,42,-1,[8913]),f9h(A_h,42,-1,[222]),f9h(A_h,42,-1,[222]),f9h(A_h,42,-1,[8482]),f9h(A_h,42,-1,[1035]),f9h(A_h,42,-1,[1062]),f9h(A_h,42,-1,[9]),f9h(A_h,42,-1,[932]),f9h(A_h,42,-1,[356]),f9h(A_h,42,-1,[354]),f9h(A_h,42,-1,[1058]),f9h(A_h,42,-1,[55349,56599]),f9h(A_h,42,-1,[8756]),f9h(A_h,42,-1,[920]),f9h(A_h,42,-1,[8201]),f9h(A_h,42,-1,[8764]),f9h(A_h,42,-1,[8771]),f9h(A_h,42,-1,[8773]),f9h(A_h,42,-1,[8776]),f9h(A_h,42,-1,[55349,56651]),f9h(A_h,42,-1,[8411]),f9h(A_h,42,-1,[55349,56495]),f9h(A_h,42,-1,[358]),f9h(A_h,42,-1,[218]),f9h(A_h,42,-1,[218]),f9h(A_h,42,-1,[8607]),f9h(A_h,42,-1,[10569]),f9h(A_h,42,-1,[1038]),f9h(A_h,42,-1,[364]),f9h(A_h,42,-1,[219]),f9h(A_h,42,-1,[219]),f9h(A_h,42,-1,[1059]),f9h(A_h,42,-1,[368]),f9h(A_h,42,-1,[55349,56600]),f9h(A_h,42,-1,[217]),f9h(A_h,42,-1,[217]),f9h(A_h,42,-1,[362]),f9h(A_h,42,-1,[818]),f9h(A_h,42,-1,[9183]),f9h(A_h,42,-1,[9141]),f9h(A_h,42,-1,[9181]),f9h(A_h,42,-1,[8899]),f9h(A_h,42,-1,[8846]),f9h(A_h,42,-1,[370]),f9h(A_h,42,-1,[55349,56652]),f9h(A_h,42,-1,[8593]),f9h(A_h,42,-1,[10514]),f9h(A_h,42,-1,[8645]),f9h(A_h,42,-1,[8597]),f9h(A_h,42,-1,[10606]),f9h(A_h,42,-1,[8869]),f9h(A_h,42,-1,[8613]),f9h(A_h,42,-1,[8657]),f9h(A_h,42,-1,[8661]),f9h(A_h,42,-1,[8598]),f9h(A_h,42,-1,[8599]),f9h(A_h,42,-1,[978]),f9h(A_h,42,-1,[933]),f9h(A_h,42,-1,[366]),f9h(A_h,42,-1,[55349,56496]),f9h(A_h,42,-1,[360]),f9h(A_h,42,-1,[220]),f9h(A_h,42,-1,[220]),f9h(A_h,42,-1,[8875]),f9h(A_h,42,-1,[10987]),f9h(A_h,42,-1,[1042]),f9h(A_h,42,-1,[8873]),f9h(A_h,42,-1,[10982]),f9h(A_h,42,-1,[8897]),f9h(A_h,42,-1,[8214]),f9h(A_h,42,-1,[8214]),f9h(A_h,42,-1,[8739]),f9h(A_h,42,-1,[124]),f9h(A_h,42,-1,[10072]),f9h(A_h,42,-1,[8768]),f9h(A_h,42,-1,[8202]),f9h(A_h,42,-1,[55349,56601]),f9h(A_h,42,-1,[55349,56653]),f9h(A_h,42,-1,[55349,56497]),f9h(A_h,42,-1,[8874]),f9h(A_h,42,-1,[372]),f9h(A_h,42,-1,[8896]),f9h(A_h,42,-1,[55349,56602]),f9h(A_h,42,-1,[55349,56654]),f9h(A_h,42,-1,[55349,56498]),f9h(A_h,42,-1,[55349,56603]),f9h(A_h,42,-1,[926]),f9h(A_h,42,-1,[55349,56655]),f9h(A_h,42,-1,[55349,56499]),f9h(A_h,42,-1,[1071]),f9h(A_h,42,-1,[1031]),f9h(A_h,42,-1,[1070]),f9h(A_h,42,-1,[221]),f9h(A_h,42,-1,[221]),f9h(A_h,42,-1,[374]),f9h(A_h,42,-1,[1067]),f9h(A_h,42,-1,[55349,56604]),f9h(A_h,42,-1,[55349,56656]),f9h(A_h,42,-1,[55349,56500]),f9h(A_h,42,-1,[376]),f9h(A_h,42,-1,[1046]),f9h(A_h,42,-1,[377]),f9h(A_h,42,-1,[381]),f9h(A_h,42,-1,[1047]),f9h(A_h,42,-1,[379]),f9h(A_h,42,-1,[8203]),f9h(A_h,42,-1,[918]),f9h(A_h,42,-1,[8488]),f9h(A_h,42,-1,[8484]),f9h(A_h,42,-1,[55349,56501]),f9h(A_h,42,-1,[225]),f9h(A_h,42,-1,[225]),f9h(A_h,42,-1,[259]),f9h(A_h,42,-1,[8766]),f9h(A_h,42,-1,[8767]),f9h(A_h,42,-1,[226]),f9h(A_h,42,-1,[226]),f9h(A_h,42,-1,[180]),f9h(A_h,42,-1,[180]),f9h(A_h,42,-1,[1072]),f9h(A_h,42,-1,[230]),f9h(A_h,42,-1,[230]),f9h(A_h,42,-1,[8289]),f9h(A_h,42,-1,[55349,56606]),f9h(A_h,42,-1,[224]),f9h(A_h,42,-1,[224]),f9h(A_h,42,-1,[8501]),f9h(A_h,42,-1,[8501]),f9h(A_h,42,-1,[945]),f9h(A_h,42,-1,[257]),f9h(A_h,42,-1,[10815]),f9h(A_h,42,-1,[38]),f9h(A_h,42,-1,[38]),f9h(A_h,42,-1,[8743]),f9h(A_h,42,-1,[10837]),f9h(A_h,42,-1,[10844]),f9h(A_h,42,-1,[10840]),f9h(A_h,42,-1,[10842]),f9h(A_h,42,-1,[8736]),f9h(A_h,42,-1,[10660]),f9h(A_h,42,-1,[8736]),f9h(A_h,42,-1,[8737]),f9h(A_h,42,-1,[10664]),f9h(A_h,42,-1,[10665]),f9h(A_h,42,-1,[10666]),f9h(A_h,42,-1,[10667]),f9h(A_h,42,-1,[10668]),f9h(A_h,42,-1,[10669]),f9h(A_h,42,-1,[10670]),f9h(A_h,42,-1,[10671]),f9h(A_h,42,-1,[8735]),f9h(A_h,42,-1,[8894]),f9h(A_h,42,-1,[10653]),f9h(A_h,42,-1,[8738]),f9h(A_h,42,-1,[8491]),f9h(A_h,42,-1,[9084]),f9h(A_h,42,-1,[261]),f9h(A_h,42,-1,[55349,56658]),f9h(A_h,42,-1,[8776]),f9h(A_h,42,-1,[10864]),f9h(A_h,42,-1,[10863]),f9h(A_h,42,-1,[8778]),f9h(A_h,42,-1,[8779]),f9h(A_h,42,-1,[39]),f9h(A_h,42,-1,[8776]),f9h(A_h,42,-1,[8778]),f9h(A_h,42,-1,[229]),f9h(A_h,42,-1,[229]),f9h(A_h,42,-1,[55349,56502]),f9h(A_h,42,-1,[42]),f9h(A_h,42,-1,[8776]),f9h(A_h,42,-1,[8781]),f9h(A_h,42,-1,[227]),f9h(A_h,42,-1,[227]),f9h(A_h,42,-1,[228]),f9h(A_h,42,-1,[228]),f9h(A_h,42,-1,[8755]),f9h(A_h,42,-1,[10769]),f9h(A_h,42,-1,[10989]),f9h(A_h,42,-1,[8780]),f9h(A_h,42,-1,[1014]),f9h(A_h,42,-1,[8245]),f9h(A_h,42,-1,[8765]),f9h(A_h,42,-1,[8909]),f9h(A_h,42,-1,[8893]),f9h(A_h,42,-1,[8965]),f9h(A_h,42,-1,[8965]),f9h(A_h,42,-1,[9141]),f9h(A_h,42,-1,[9142]),f9h(A_h,42,-1,[8780]),f9h(A_h,42,-1,[1073]),f9h(A_h,42,-1,[8222]),f9h(A_h,42,-1,[8757]),f9h(A_h,42,-1,[8757]),f9h(A_h,42,-1,[10672]),f9h(A_h,42,-1,[1014]),f9h(A_h,42,-1,[8492]),f9h(A_h,42,-1,[946]),f9h(A_h,42,-1,[8502]),f9h(A_h,42,-1,[8812]),f9h(A_h,42,-1,[55349,56607]),f9h(A_h,42,-1,[8898]),f9h(A_h,42,-1,[9711]),f9h(A_h,42,-1,[8899]),f9h(A_h,42,-1,[10752]),f9h(A_h,42,-1,[10753]),f9h(A_h,42,-1,[10754]),f9h(A_h,42,-1,[10758]),f9h(A_h,42,-1,[9733]),f9h(A_h,42,-1,[9661]),f9h(A_h,42,-1,[9651]),f9h(A_h,42,-1,[10756]),f9h(A_h,42,-1,[8897]),f9h(A_h,42,-1,[8896]),f9h(A_h,42,-1,[10509]),f9h(A_h,42,-1,[10731]),f9h(A_h,42,-1,[9642]),f9h(A_h,42,-1,[9652]),f9h(A_h,42,-1,[9662]),f9h(A_h,42,-1,[9666]),f9h(A_h,42,-1,[9656]),f9h(A_h,42,-1,[9251]),f9h(A_h,42,-1,[9618]),f9h(A_h,42,-1,[9617]),f9h(A_h,42,-1,[9619]),f9h(A_h,42,-1,[9608]),f9h(A_h,42,-1,[8976]),f9h(A_h,42,-1,[55349,56659]),f9h(A_h,42,-1,[8869]),f9h(A_h,42,-1,[8869]),f9h(A_h,42,-1,[8904]),f9h(A_h,42,-1,[9559]),f9h(A_h,42,-1,[9556]),f9h(A_h,42,-1,[9558]),f9h(A_h,42,-1,[9555]),f9h(A_h,42,-1,[9552]),f9h(A_h,42,-1,[9574]),f9h(A_h,42,-1,[9577]),f9h(A_h,42,-1,[9572]),f9h(A_h,42,-1,[9575]),f9h(A_h,42,-1,[9565]),f9h(A_h,42,-1,[9562]),f9h(A_h,42,-1,[9564]),f9h(A_h,42,-1,[9561]),f9h(A_h,42,-1,[9553]),f9h(A_h,42,-1,[9580]),f9h(A_h,42,-1,[9571]),f9h(A_h,42,-1,[9568]),f9h(A_h,42,-1,[9579]),f9h(A_h,42,-1,[9570]),f9h(A_h,42,-1,[9567]),f9h(A_h,42,-1,[10697]),f9h(A_h,42,-1,[9557]),f9h(A_h,42,-1,[9554]),f9h(A_h,42,-1,[9488]),f9h(A_h,42,-1,[9484]),f9h(A_h,42,-1,[9472]),f9h(A_h,42,-1,[9573]),f9h(A_h,42,-1,[9576]),f9h(A_h,42,-1,[9516]),f9h(A_h,42,-1,[9524]),f9h(A_h,42,-1,[8863]),f9h(A_h,42,-1,[8862]),f9h(A_h,42,-1,[8864]),f9h(A_h,42,-1,[9563]),f9h(A_h,42,-1,[9560]),f9h(A_h,42,-1,[9496]),f9h(A_h,42,-1,[9492]),f9h(A_h,42,-1,[9474]),f9h(A_h,42,-1,[9578]),f9h(A_h,42,-1,[9569]),f9h(A_h,42,-1,[9566]),f9h(A_h,42,-1,[9532]),f9h(A_h,42,-1,[9508]),f9h(A_h,42,-1,[9500]),f9h(A_h,42,-1,[8245]),f9h(A_h,42,-1,[728]),f9h(A_h,42,-1,[166]),f9h(A_h,42,-1,[166]),f9h(A_h,42,-1,[55349,56503]),f9h(A_h,42,-1,[8271]),f9h(A_h,42,-1,[8765]),f9h(A_h,42,-1,[8909]),f9h(A_h,42,-1,[92]),f9h(A_h,42,-1,[10693]),f9h(A_h,42,-1,[8226]),f9h(A_h,42,-1,[8226]),f9h(A_h,42,-1,[8782]),f9h(A_h,42,-1,[10926]),f9h(A_h,42,-1,[8783]),f9h(A_h,42,-1,[8783]),f9h(A_h,42,-1,[263]),f9h(A_h,42,-1,[8745]),f9h(A_h,42,-1,[10820]),f9h(A_h,42,-1,[10825]),f9h(A_h,42,-1,[10827]),f9h(A_h,42,-1,[10823]),f9h(A_h,42,-1,[10816]),f9h(A_h,42,-1,[8257]),f9h(A_h,42,-1,[711]),f9h(A_h,42,-1,[10829]),f9h(A_h,42,-1,[269]),f9h(A_h,42,-1,[231]),f9h(A_h,42,-1,[231]),f9h(A_h,42,-1,[265]),f9h(A_h,42,-1,[10828]),f9h(A_h,42,-1,[10832]),f9h(A_h,42,-1,[267]),f9h(A_h,42,-1,[184]),f9h(A_h,42,-1,[184]),f9h(A_h,42,-1,[10674]),f9h(A_h,42,-1,[162]),f9h(A_h,42,-1,[162]),f9h(A_h,42,-1,[183]),f9h(A_h,42,-1,[55349,56608]),f9h(A_h,42,-1,[1095]),f9h(A_h,42,-1,[10003]),f9h(A_h,42,-1,[10003]),f9h(A_h,42,-1,[967]),f9h(A_h,42,-1,[9675]),f9h(A_h,42,-1,[10691]),f9h(A_h,42,-1,[710]),f9h(A_h,42,-1,[8791]),f9h(A_h,42,-1,[8634]),f9h(A_h,42,-1,[8635]),f9h(A_h,42,-1,[174]),f9h(A_h,42,-1,[9416]),f9h(A_h,42,-1,[8859]),f9h(A_h,42,-1,[8858]),f9h(A_h,42,-1,[8861]),f9h(A_h,42,-1,[8791]),f9h(A_h,42,-1,[10768]),f9h(A_h,42,-1,[10991]),f9h(A_h,42,-1,[10690]),f9h(A_h,42,-1,[9827]),f9h(A_h,42,-1,[9827]),f9h(A_h,42,-1,[58]),f9h(A_h,42,-1,[8788]),f9h(A_h,42,-1,[8788]),f9h(A_h,42,-1,[44]),f9h(A_h,42,-1,[64]),f9h(A_h,42,-1,[8705]),f9h(A_h,42,-1,[8728]),f9h(A_h,42,-1,[8705]),f9h(A_h,42,-1,[8450]),f9h(A_h,42,-1,[8773]),f9h(A_h,42,-1,[10861]),f9h(A_h,42,-1,[8750]),f9h(A_h,42,-1,[55349,56660]),f9h(A_h,42,-1,[8720]),f9h(A_h,42,-1,[169]),f9h(A_h,42,-1,[169]),f9h(A_h,42,-1,[8471]),f9h(A_h,42,-1,[8629]),f9h(A_h,42,-1,[10007]),f9h(A_h,42,-1,[55349,56504]),f9h(A_h,42,-1,[10959]),f9h(A_h,42,-1,[10961]),f9h(A_h,42,-1,[10960]),f9h(A_h,42,-1,[10962]),f9h(A_h,42,-1,[8943]),f9h(A_h,42,-1,[10552]),f9h(A_h,42,-1,[10549]),f9h(A_h,42,-1,[8926]),f9h(A_h,42,-1,[8927]),f9h(A_h,42,-1,[8630]),f9h(A_h,42,-1,[10557]),f9h(A_h,42,-1,[8746]),f9h(A_h,42,-1,[10824]),f9h(A_h,42,-1,[10822]),f9h(A_h,42,-1,[10826]),f9h(A_h,42,-1,[8845]),f9h(A_h,42,-1,[10821]),f9h(A_h,42,-1,[8631]),f9h(A_h,42,-1,[10556]),f9h(A_h,42,-1,[8926]),f9h(A_h,42,-1,[8927]),f9h(A_h,42,-1,[8910]),f9h(A_h,42,-1,[8911]),f9h(A_h,42,-1,[164]),f9h(A_h,42,-1,[164]),f9h(A_h,42,-1,[8630]),f9h(A_h,42,-1,[8631]),f9h(A_h,42,-1,[8910]),f9h(A_h,42,-1,[8911]),f9h(A_h,42,-1,[8754]),f9h(A_h,42,-1,[8753]),f9h(A_h,42,-1,[9005]),f9h(A_h,42,-1,[8659]),f9h(A_h,42,-1,[10597]),f9h(A_h,42,-1,[8224]),f9h(A_h,42,-1,[8504]),f9h(A_h,42,-1,[8595]),f9h(A_h,42,-1,[8208]),f9h(A_h,42,-1,[8867]),f9h(A_h,42,-1,[10511]),f9h(A_h,42,-1,[733]),f9h(A_h,42,-1,[271]),f9h(A_h,42,-1,[1076]),f9h(A_h,42,-1,[8518]),f9h(A_h,42,-1,[8225]),f9h(A_h,42,-1,[8650]),f9h(A_h,42,-1,[10871]),f9h(A_h,42,-1,[176]),f9h(A_h,42,-1,[176]),f9h(A_h,42,-1,[948]),f9h(A_h,42,-1,[10673]),f9h(A_h,42,-1,[10623]),f9h(A_h,42,-1,[55349,56609]),f9h(A_h,42,-1,[8643]),f9h(A_h,42,-1,[8642]),f9h(A_h,42,-1,[8900]),f9h(A_h,42,-1,[8900]),f9h(A_h,42,-1,[9830]),f9h(A_h,42,-1,[9830]),f9h(A_h,42,-1,[168]),f9h(A_h,42,-1,[989]),f9h(A_h,42,-1,[8946]),f9h(A_h,42,-1,[247]),f9h(A_h,42,-1,[247]),f9h(A_h,42,-1,[247]),f9h(A_h,42,-1,[8903]),f9h(A_h,42,-1,[8903]),f9h(A_h,42,-1,[1106]),f9h(A_h,42,-1,[8990]),f9h(A_h,42,-1,[8973]),f9h(A_h,42,-1,[36]),f9h(A_h,42,-1,[55349,56661]),f9h(A_h,42,-1,[729]),f9h(A_h,42,-1,[8784]),f9h(A_h,42,-1,[8785]),f9h(A_h,42,-1,[8760]),f9h(A_h,42,-1,[8724]),f9h(A_h,42,-1,[8865]),f9h(A_h,42,-1,[8966]),f9h(A_h,42,-1,[8595]),f9h(A_h,42,-1,[8650]),f9h(A_h,42,-1,[8643]),f9h(A_h,42,-1,[8642]),f9h(A_h,42,-1,[10512]),f9h(A_h,42,-1,[8991]),f9h(A_h,42,-1,[8972]),f9h(A_h,42,-1,[55349,56505]),f9h(A_h,42,-1,[1109]),f9h(A_h,42,-1,[10742]),f9h(A_h,42,-1,[273]),f9h(A_h,42,-1,[8945]),f9h(A_h,42,-1,[9663]),f9h(A_h,42,-1,[9662]),f9h(A_h,42,-1,[8693]),f9h(A_h,42,-1,[10607]),f9h(A_h,42,-1,[10662]),f9h(A_h,42,-1,[1119]),f9h(A_h,42,-1,[10239]),f9h(A_h,42,-1,[10871]),f9h(A_h,42,-1,[8785]),f9h(A_h,42,-1,[233]),f9h(A_h,42,-1,[233]),f9h(A_h,42,-1,[10862]),f9h(A_h,42,-1,[283]),f9h(A_h,42,-1,[8790]),f9h(A_h,42,-1,[234]),f9h(A_h,42,-1,[234]),f9h(A_h,42,-1,[8789]),f9h(A_h,42,-1,[1101]),f9h(A_h,42,-1,[279]),f9h(A_h,42,-1,[8519]),f9h(A_h,42,-1,[8786]),f9h(A_h,42,-1,[55349,56610]),f9h(A_h,42,-1,[10906]),f9h(A_h,42,-1,[232]),f9h(A_h,42,-1,[232]),f9h(A_h,42,-1,[10902]),f9h(A_h,42,-1,[10904]),f9h(A_h,42,-1,[10905]),f9h(A_h,42,-1,[9191]),f9h(A_h,42,-1,[8467]),f9h(A_h,42,-1,[10901]),f9h(A_h,42,-1,[10903]),f9h(A_h,42,-1,[275]),f9h(A_h,42,-1,[8709]),f9h(A_h,42,-1,[8709]),f9h(A_h,42,-1,[8709]),f9h(A_h,42,-1,[8196]),f9h(A_h,42,-1,[8197]),f9h(A_h,42,-1,[8195]),f9h(A_h,42,-1,[331]),f9h(A_h,42,-1,[8194]),f9h(A_h,42,-1,[281]),f9h(A_h,42,-1,[55349,56662]),f9h(A_h,42,-1,[8917]),f9h(A_h,42,-1,[10723]),f9h(A_h,42,-1,[10865]),f9h(A_h,42,-1,[1013]),f9h(A_h,42,-1,[949]),f9h(A_h,42,-1,[949]),f9h(A_h,42,-1,[8790]),f9h(A_h,42,-1,[8789]),f9h(A_h,42,-1,[8770]),f9h(A_h,42,-1,[10902]),f9h(A_h,42,-1,[10901]),f9h(A_h,42,-1,[61]),f9h(A_h,42,-1,[8799]),f9h(A_h,42,-1,[8801]),f9h(A_h,42,-1,[10872]),f9h(A_h,42,-1,[10725]),f9h(A_h,42,-1,[8787]),f9h(A_h,42,-1,[10609]),f9h(A_h,42,-1,[8495]),f9h(A_h,42,-1,[8784]),f9h(A_h,42,-1,[8770]),f9h(A_h,42,-1,[951]),f9h(A_h,42,-1,[240]),f9h(A_h,42,-1,[240]),f9h(A_h,42,-1,[235]),f9h(A_h,42,-1,[235]),f9h(A_h,42,-1,[8364]),f9h(A_h,42,-1,[33]),f9h(A_h,42,-1,[8707]),f9h(A_h,42,-1,[8496]),f9h(A_h,42,-1,[8519]),f9h(A_h,42,-1,[8786]),f9h(A_h,42,-1,[1092]),f9h(A_h,42,-1,[9792]),f9h(A_h,42,-1,[64259]),f9h(A_h,42,-1,[64256]),f9h(A_h,42,-1,[64260]),f9h(A_h,42,-1,[55349,56611]),f9h(A_h,42,-1,[64257]),f9h(A_h,42,-1,[9837]),f9h(A_h,42,-1,[64258]),f9h(A_h,42,-1,[9649]),f9h(A_h,42,-1,[402]),f9h(A_h,42,-1,[55349,56663]),f9h(A_h,42,-1,[8704]),f9h(A_h,42,-1,[8916]),f9h(A_h,42,-1,[10969]),f9h(A_h,42,-1,[10765]),f9h(A_h,42,-1,[189]),f9h(A_h,42,-1,[189]),f9h(A_h,42,-1,[8531]),f9h(A_h,42,-1,[188]),f9h(A_h,42,-1,[188]),f9h(A_h,42,-1,[8533]),f9h(A_h,42,-1,[8537]),f9h(A_h,42,-1,[8539]),f9h(A_h,42,-1,[8532]),f9h(A_h,42,-1,[8534]),f9h(A_h,42,-1,[190]),f9h(A_h,42,-1,[190]),f9h(A_h,42,-1,[8535]),f9h(A_h,42,-1,[8540]),f9h(A_h,42,-1,[8536]),f9h(A_h,42,-1,[8538]),f9h(A_h,42,-1,[8541]),f9h(A_h,42,-1,[8542]),f9h(A_h,42,-1,[8260]),f9h(A_h,42,-1,[8994]),f9h(A_h,42,-1,[55349,56507]),f9h(A_h,42,-1,[8807]),f9h(A_h,42,-1,[10892]),f9h(A_h,42,-1,[501]),f9h(A_h,42,-1,[947]),f9h(A_h,42,-1,[989]),f9h(A_h,42,-1,[10886]),f9h(A_h,42,-1,[287]),f9h(A_h,42,-1,[285]),f9h(A_h,42,-1,[1075]),f9h(A_h,42,-1,[289]),f9h(A_h,42,-1,[8805]),f9h(A_h,42,-1,[8923]),f9h(A_h,42,-1,[8805]),f9h(A_h,42,-1,[8807]),f9h(A_h,42,-1,[10878]),f9h(A_h,42,-1,[10878]),f9h(A_h,42,-1,[10921]),f9h(A_h,42,-1,[10880]),f9h(A_h,42,-1,[10882]),f9h(A_h,42,-1,[10884]),f9h(A_h,42,-1,[10900]),f9h(A_h,42,-1,[55349,56612]),f9h(A_h,42,-1,[8811]),f9h(A_h,42,-1,[8921]),f9h(A_h,42,-1,[8503]),f9h(A_h,42,-1,[1107]),f9h(A_h,42,-1,[8823]),f9h(A_h,42,-1,[10898]),f9h(A_h,42,-1,[10917]),f9h(A_h,42,-1,[10916]),f9h(A_h,42,-1,[8809]),f9h(A_h,42,-1,[10890]),f9h(A_h,42,-1,[10890]),f9h(A_h,42,-1,[10888]),f9h(A_h,42,-1,[10888]),f9h(A_h,42,-1,[8809]),f9h(A_h,42,-1,[8935]),f9h(A_h,42,-1,[55349,56664]),f9h(A_h,42,-1,[96]),f9h(A_h,42,-1,[8458]),f9h(A_h,42,-1,[8819]),f9h(A_h,42,-1,[10894]),f9h(A_h,42,-1,[10896]),f9h(A_h,42,-1,[62]),f9h(A_h,42,-1,[62]),f9h(A_h,42,-1,[10919]),f9h(A_h,42,-1,[10874]),f9h(A_h,42,-1,[8919]),f9h(A_h,42,-1,[10645]),f9h(A_h,42,-1,[10876]),f9h(A_h,42,-1,[10886]),f9h(A_h,42,-1,[10616]),f9h(A_h,42,-1,[8919]),f9h(A_h,42,-1,[8923]),f9h(A_h,42,-1,[10892]),f9h(A_h,42,-1,[8823]),f9h(A_h,42,-1,[8819]),f9h(A_h,42,-1,[8660]),f9h(A_h,42,-1,[8202]),f9h(A_h,42,-1,[189]),f9h(A_h,42,-1,[8459]),f9h(A_h,42,-1,[1098]),f9h(A_h,42,-1,[8596]),f9h(A_h,42,-1,[10568]),f9h(A_h,42,-1,[8621]),f9h(A_h,42,-1,[8463]),f9h(A_h,42,-1,[293]),f9h(A_h,42,-1,[9829]),f9h(A_h,42,-1,[9829]),f9h(A_h,42,-1,[8230]),f9h(A_h,42,-1,[8889]),f9h(A_h,42,-1,[55349,56613]),f9h(A_h,42,-1,[10533]),f9h(A_h,42,-1,[10534]),f9h(A_h,42,-1,[8703]),f9h(A_h,42,-1,[8763]),f9h(A_h,42,-1,[8617]),f9h(A_h,42,-1,[8618]),f9h(A_h,42,-1,[55349,56665]),f9h(A_h,42,-1,[8213]),f9h(A_h,42,-1,[55349,56509]),f9h(A_h,42,-1,[8463]),f9h(A_h,42,-1,[295]),f9h(A_h,42,-1,[8259]),f9h(A_h,42,-1,[8208]),f9h(A_h,42,-1,[237]),f9h(A_h,42,-1,[237]),f9h(A_h,42,-1,[8291]),f9h(A_h,42,-1,[238]),f9h(A_h,42,-1,[238]),f9h(A_h,42,-1,[1080]),f9h(A_h,42,-1,[1077]),f9h(A_h,42,-1,[161]),f9h(A_h,42,-1,[161]),f9h(A_h,42,-1,[8660]),f9h(A_h,42,-1,[55349,56614]),f9h(A_h,42,-1,[236]),f9h(A_h,42,-1,[236]),f9h(A_h,42,-1,[8520]),f9h(A_h,42,-1,[10764]),f9h(A_h,42,-1,[8749]),f9h(A_h,42,-1,[10716]),f9h(A_h,42,-1,[8489]),f9h(A_h,42,-1,[307]),f9h(A_h,42,-1,[299]),f9h(A_h,42,-1,[8465]),f9h(A_h,42,-1,[8464]),f9h(A_h,42,-1,[8465]),f9h(A_h,42,-1,[305]),f9h(A_h,42,-1,[8887]),f9h(A_h,42,-1,[437]),f9h(A_h,42,-1,[8712]),f9h(A_h,42,-1,[8453]),f9h(A_h,42,-1,[8734]),f9h(A_h,42,-1,[10717]),f9h(A_h,42,-1,[305]),f9h(A_h,42,-1,[8747]),f9h(A_h,42,-1,[8890]),f9h(A_h,42,-1,[8484]),f9h(A_h,42,-1,[8890]),f9h(A_h,42,-1,[10775]),f9h(A_h,42,-1,[10812]),f9h(A_h,42,-1,[1105]),f9h(A_h,42,-1,[303]),f9h(A_h,42,-1,[55349,56666]),f9h(A_h,42,-1,[953]),f9h(A_h,42,-1,[10812]),f9h(A_h,42,-1,[191]),f9h(A_h,42,-1,[191]),f9h(A_h,42,-1,[55349,56510]),f9h(A_h,42,-1,[8712]),f9h(A_h,42,-1,[8953]),f9h(A_h,42,-1,[8949]),f9h(A_h,42,-1,[8948]),f9h(A_h,42,-1,[8947]),f9h(A_h,42,-1,[8712]),f9h(A_h,42,-1,[8290]),f9h(A_h,42,-1,[297]),f9h(A_h,42,-1,[1110]),f9h(A_h,42,-1,[239]),f9h(A_h,42,-1,[239]),f9h(A_h,42,-1,[309]),f9h(A_h,42,-1,[1081]),f9h(A_h,42,-1,[55349,56615]),f9h(A_h,42,-1,[567]),f9h(A_h,42,-1,[55349,56667]),f9h(A_h,42,-1,[55349,56511]),f9h(A_h,42,-1,[1112]),f9h(A_h,42,-1,[1108]),f9h(A_h,42,-1,[954]),f9h(A_h,42,-1,[1008]),f9h(A_h,42,-1,[311]),f9h(A_h,42,-1,[1082]),f9h(A_h,42,-1,[55349,56616]),f9h(A_h,42,-1,[312]),f9h(A_h,42,-1,[1093]),f9h(A_h,42,-1,[1116]),f9h(A_h,42,-1,[55349,56668]),f9h(A_h,42,-1,[55349,56512]),f9h(A_h,42,-1,[8666]),f9h(A_h,42,-1,[8656]),f9h(A_h,42,-1,[10523]),f9h(A_h,42,-1,[10510]),f9h(A_h,42,-1,[8806]),f9h(A_h,42,-1,[10891]),f9h(A_h,42,-1,[10594]),f9h(A_h,42,-1,[314]),f9h(A_h,42,-1,[10676]),f9h(A_h,42,-1,[8466]),f9h(A_h,42,-1,[955]),f9h(A_h,42,-1,[10216]),f9h(A_h,42,-1,[10641]),f9h(A_h,42,-1,[10216]),f9h(A_h,42,-1,[10885]),f9h(A_h,42,-1,[171]),f9h(A_h,42,-1,[171]),f9h(A_h,42,-1,[8592]),f9h(A_h,42,-1,[8676]),f9h(A_h,42,-1,[10527]),f9h(A_h,42,-1,[10525]),f9h(A_h,42,-1,[8617]),f9h(A_h,42,-1,[8619]),f9h(A_h,42,-1,[10553]),f9h(A_h,42,-1,[10611]),f9h(A_h,42,-1,[8610]),f9h(A_h,42,-1,[10923]),f9h(A_h,42,-1,[10521]),f9h(A_h,42,-1,[10925]),f9h(A_h,42,-1,[10508]),f9h(A_h,42,-1,[10098]),f9h(A_h,42,-1,[123]),f9h(A_h,42,-1,[91]),f9h(A_h,42,-1,[10635]),f9h(A_h,42,-1,[10639]),f9h(A_h,42,-1,[10637]),f9h(A_h,42,-1,[318]),f9h(A_h,42,-1,[316]),f9h(A_h,42,-1,[8968]),f9h(A_h,42,-1,[123]),f9h(A_h,42,-1,[1083]),f9h(A_h,42,-1,[10550]),f9h(A_h,42,-1,[8220]),f9h(A_h,42,-1,[8222]),f9h(A_h,42,-1,[10599]),f9h(A_h,42,-1,[10571]),f9h(A_h,42,-1,[8626]),f9h(A_h,42,-1,[8804]),f9h(A_h,42,-1,[8592]),f9h(A_h,42,-1,[8610]),f9h(A_h,42,-1,[8637]),f9h(A_h,42,-1,[8636]),f9h(A_h,42,-1,[8647]),f9h(A_h,42,-1,[8596]),f9h(A_h,42,-1,[8646]),f9h(A_h,42,-1,[8651]),f9h(A_h,42,-1,[8621]),f9h(A_h,42,-1,[8907]),f9h(A_h,42,-1,[8922]),f9h(A_h,42,-1,[8804]),f9h(A_h,42,-1,[8806]),f9h(A_h,42,-1,[10877]),f9h(A_h,42,-1,[10877]),f9h(A_h,42,-1,[10920]),f9h(A_h,42,-1,[10879]),f9h(A_h,42,-1,[10881]),f9h(A_h,42,-1,[10883]),f9h(A_h,42,-1,[10899]),f9h(A_h,42,-1,[10885]),f9h(A_h,42,-1,[8918]),f9h(A_h,42,-1,[8922]),f9h(A_h,42,-1,[10891]),f9h(A_h,42,-1,[8822]),f9h(A_h,42,-1,[8818]),f9h(A_h,42,-1,[10620]),f9h(A_h,42,-1,[8970]),f9h(A_h,42,-1,[55349,56617]),f9h(A_h,42,-1,[8822]),f9h(A_h,42,-1,[10897]),f9h(A_h,42,-1,[8637]),f9h(A_h,42,-1,[8636]),f9h(A_h,42,-1,[10602]),f9h(A_h,42,-1,[9604]),f9h(A_h,42,-1,[1113]),f9h(A_h,42,-1,[8810]),f9h(A_h,42,-1,[8647]),f9h(A_h,42,-1,[8990]),f9h(A_h,42,-1,[10603]),f9h(A_h,42,-1,[9722]),f9h(A_h,42,-1,[320]),f9h(A_h,42,-1,[9136]),f9h(A_h,42,-1,[9136]),f9h(A_h,42,-1,[8808]),f9h(A_h,42,-1,[10889]),f9h(A_h,42,-1,[10889]),f9h(A_h,42,-1,[10887]),f9h(A_h,42,-1,[10887]),f9h(A_h,42,-1,[8808]),f9h(A_h,42,-1,[8934]),f9h(A_h,42,-1,[10220]),f9h(A_h,42,-1,[8701]),f9h(A_h,42,-1,[10214]),f9h(A_h,42,-1,[10229]),f9h(A_h,42,-1,[10231]),f9h(A_h,42,-1,[10236]),f9h(A_h,42,-1,[10230]),f9h(A_h,42,-1,[8619]),f9h(A_h,42,-1,[8620]),f9h(A_h,42,-1,[10629]),f9h(A_h,42,-1,[55349,56669]),f9h(A_h,42,-1,[10797]),f9h(A_h,42,-1,[10804]),f9h(A_h,42,-1,[8727]),f9h(A_h,42,-1,[95]),f9h(A_h,42,-1,[9674]),f9h(A_h,42,-1,[9674]),f9h(A_h,42,-1,[10731]),f9h(A_h,42,-1,[40]),f9h(A_h,42,-1,[10643]),f9h(A_h,42,-1,[8646]),f9h(A_h,42,-1,[8991]),f9h(A_h,42,-1,[8651]),f9h(A_h,42,-1,[10605]),f9h(A_h,42,-1,[8206]),f9h(A_h,42,-1,[8895]),f9h(A_h,42,-1,[8249]),f9h(A_h,42,-1,[55349,56513]),f9h(A_h,42,-1,[8624]),f9h(A_h,42,-1,[8818]),f9h(A_h,42,-1,[10893]),f9h(A_h,42,-1,[10895]),f9h(A_h,42,-1,[91]),f9h(A_h,42,-1,[8216]),f9h(A_h,42,-1,[8218]),f9h(A_h,42,-1,[322]),f9h(A_h,42,-1,[60]),f9h(A_h,42,-1,[60]),f9h(A_h,42,-1,[10918]),f9h(A_h,42,-1,[10873]),f9h(A_h,42,-1,[8918]),f9h(A_h,42,-1,[8907]),f9h(A_h,42,-1,[8905]),f9h(A_h,42,-1,[10614]),f9h(A_h,42,-1,[10875]),f9h(A_h,42,-1,[10646]),f9h(A_h,42,-1,[9667]),f9h(A_h,42,-1,[8884]),f9h(A_h,42,-1,[9666]),f9h(A_h,42,-1,[10570]),f9h(A_h,42,-1,[10598]),f9h(A_h,42,-1,[8762]),f9h(A_h,42,-1,[175]),f9h(A_h,42,-1,[175]),f9h(A_h,42,-1,[9794]),f9h(A_h,42,-1,[10016]),f9h(A_h,42,-1,[10016]),f9h(A_h,42,-1,[8614]),f9h(A_h,42,-1,[8614]),f9h(A_h,42,-1,[8615]),f9h(A_h,42,-1,[8612]),f9h(A_h,42,-1,[8613]),f9h(A_h,42,-1,[9646]),f9h(A_h,42,-1,[10793]),f9h(A_h,42,-1,[1084]),f9h(A_h,42,-1,[8212]),f9h(A_h,42,-1,[8737]),f9h(A_h,42,-1,[55349,56618]),f9h(A_h,42,-1,[8487]),f9h(A_h,42,-1,[181]),f9h(A_h,42,-1,[181]),f9h(A_h,42,-1,[8739]),f9h(A_h,42,-1,[42]),f9h(A_h,42,-1,[10992]),f9h(A_h,42,-1,[183]),f9h(A_h,42,-1,[183]),f9h(A_h,42,-1,[8722]),f9h(A_h,42,-1,[8863]),f9h(A_h,42,-1,[8760]),f9h(A_h,42,-1,[10794]),f9h(A_h,42,-1,[10971]),f9h(A_h,42,-1,[8230]),f9h(A_h,42,-1,[8723]),f9h(A_h,42,-1,[8871]),f9h(A_h,42,-1,[55349,56670]),f9h(A_h,42,-1,[8723]),f9h(A_h,42,-1,[55349,56514]),f9h(A_h,42,-1,[8766]),f9h(A_h,42,-1,[956]),f9h(A_h,42,-1,[8888]),f9h(A_h,42,-1,[8888]),f9h(A_h,42,-1,[8653]),f9h(A_h,42,-1,[8654]),f9h(A_h,42,-1,[8655]),f9h(A_h,42,-1,[8879]),f9h(A_h,42,-1,[8878]),f9h(A_h,42,-1,[8711]),f9h(A_h,42,-1,[324]),f9h(A_h,42,-1,[8777]),f9h(A_h,42,-1,[329]),f9h(A_h,42,-1,[8777]),f9h(A_h,42,-1,[9838]),f9h(A_h,42,-1,[9838]),f9h(A_h,42,-1,[8469]),f9h(A_h,42,-1,[160]),f9h(A_h,42,-1,[160]),f9h(A_h,42,-1,[10819]),f9h(A_h,42,-1,[328]),f9h(A_h,42,-1,[326]),f9h(A_h,42,-1,[8775]),f9h(A_h,42,-1,[10818]),f9h(A_h,42,-1,[1085]),f9h(A_h,42,-1,[8211]),f9h(A_h,42,-1,[8800]),f9h(A_h,42,-1,[8663]),f9h(A_h,42,-1,[10532]),f9h(A_h,42,-1,[8599]),f9h(A_h,42,-1,[8599]),f9h(A_h,42,-1,[8802]),f9h(A_h,42,-1,[10536]),f9h(A_h,42,-1,[8708]),f9h(A_h,42,-1,[8708]),f9h(A_h,42,-1,[55349,56619]),f9h(A_h,42,-1,[8817]),f9h(A_h,42,-1,[8817]),f9h(A_h,42,-1,[8821]),f9h(A_h,42,-1,[8815]),f9h(A_h,42,-1,[8815]),f9h(A_h,42,-1,[8654]),f9h(A_h,42,-1,[8622]),f9h(A_h,42,-1,[10994]),f9h(A_h,42,-1,[8715]),f9h(A_h,42,-1,[8956]),f9h(A_h,42,-1,[8954]),f9h(A_h,42,-1,[8715]),f9h(A_h,42,-1,[1114]),f9h(A_h,42,-1,[8653]),f9h(A_h,42,-1,[8602]),f9h(A_h,42,-1,[8229]),f9h(A_h,42,-1,[8816]),f9h(A_h,42,-1,[8602]),f9h(A_h,42,-1,[8622]),f9h(A_h,42,-1,[8816]),f9h(A_h,42,-1,[8814]),f9h(A_h,42,-1,[8820]),f9h(A_h,42,-1,[8814]),f9h(A_h,42,-1,[8938]),f9h(A_h,42,-1,[8940]),f9h(A_h,42,-1,[8740]),f9h(A_h,42,-1,[55349,56671]),f9h(A_h,42,-1,[172]),f9h(A_h,42,-1,[172]),f9h(A_h,42,-1,[8713]),f9h(A_h,42,-1,[8713]),f9h(A_h,42,-1,[8951]),f9h(A_h,42,-1,[8950]),f9h(A_h,42,-1,[8716]),f9h(A_h,42,-1,[8716]),f9h(A_h,42,-1,[8958]),f9h(A_h,42,-1,[8957]),f9h(A_h,42,-1,[8742]),f9h(A_h,42,-1,[8742]),f9h(A_h,42,-1,[10772]),f9h(A_h,42,-1,[8832]),f9h(A_h,42,-1,[8928]),f9h(A_h,42,-1,[8832]),f9h(A_h,42,-1,[8655]),f9h(A_h,42,-1,[8603]),f9h(A_h,42,-1,[8603]),f9h(A_h,42,-1,[8939]),f9h(A_h,42,-1,[8941]),f9h(A_h,42,-1,[8833]),f9h(A_h,42,-1,[8929]),f9h(A_h,42,-1,[55349,56515]),f9h(A_h,42,-1,[8740]),f9h(A_h,42,-1,[8742]),f9h(A_h,42,-1,[8769]),f9h(A_h,42,-1,[8772]),f9h(A_h,42,-1,[8772]),f9h(A_h,42,-1,[8740]),f9h(A_h,42,-1,[8742]),f9h(A_h,42,-1,[8930]),f9h(A_h,42,-1,[8931]),f9h(A_h,42,-1,[8836]),f9h(A_h,42,-1,[8840]),f9h(A_h,42,-1,[8840]),f9h(A_h,42,-1,[8833]),f9h(A_h,42,-1,[8837]),f9h(A_h,42,-1,[8841]),f9h(A_h,42,-1,[8841]),f9h(A_h,42,-1,[8825]),f9h(A_h,42,-1,[241]),f9h(A_h,42,-1,[241]),f9h(A_h,42,-1,[8824]),f9h(A_h,42,-1,[8938]),f9h(A_h,42,-1,[8940]),f9h(A_h,42,-1,[8939]),f9h(A_h,42,-1,[8941]),f9h(A_h,42,-1,[957]),f9h(A_h,42,-1,[35]),f9h(A_h,42,-1,[8470]),f9h(A_h,42,-1,[8199]),f9h(A_h,42,-1,[8877]),f9h(A_h,42,-1,[10500]),f9h(A_h,42,-1,[8876]),f9h(A_h,42,-1,[10718]),f9h(A_h,42,-1,[10498]),f9h(A_h,42,-1,[10499]),f9h(A_h,42,-1,[8662]),f9h(A_h,42,-1,[10531]),f9h(A_h,42,-1,[8598]),f9h(A_h,42,-1,[8598]),f9h(A_h,42,-1,[10535]),f9h(A_h,42,-1,[9416]),f9h(A_h,42,-1,[243]),f9h(A_h,42,-1,[243]),f9h(A_h,42,-1,[8859]),f9h(A_h,42,-1,[8858]),f9h(A_h,42,-1,[244]),f9h(A_h,42,-1,[244]),f9h(A_h,42,-1,[1086]),f9h(A_h,42,-1,[8861]),f9h(A_h,42,-1,[337]),f9h(A_h,42,-1,[10808]),f9h(A_h,42,-1,[8857]),f9h(A_h,42,-1,[10684]),f9h(A_h,42,-1,[339]),f9h(A_h,42,-1,[10687]),f9h(A_h,42,-1,[55349,56620]),f9h(A_h,42,-1,[731]),f9h(A_h,42,-1,[242]),f9h(A_h,42,-1,[242]),f9h(A_h,42,-1,[10689]),f9h(A_h,42,-1,[10677]),f9h(A_h,42,-1,[8486]),f9h(A_h,42,-1,[8750]),f9h(A_h,42,-1,[8634]),f9h(A_h,42,-1,[10686]),f9h(A_h,42,-1,[10683]),f9h(A_h,42,-1,[8254]),f9h(A_h,42,-1,[10688]),f9h(A_h,42,-1,[333]),f9h(A_h,42,-1,[969]),f9h(A_h,42,-1,[959]),f9h(A_h,42,-1,[10678]),f9h(A_h,42,-1,[8854]),f9h(A_h,42,-1,[55349,56672]),f9h(A_h,42,-1,[10679]),f9h(A_h,42,-1,[10681]),f9h(A_h,42,-1,[8853]),f9h(A_h,42,-1,[8744]),f9h(A_h,42,-1,[8635]),f9h(A_h,42,-1,[10845]),f9h(A_h,42,-1,[8500]),f9h(A_h,42,-1,[8500]),f9h(A_h,42,-1,[170]),f9h(A_h,42,-1,[170]),f9h(A_h,42,-1,[186]),f9h(A_h,42,-1,[186]),f9h(A_h,42,-1,[8886]),f9h(A_h,42,-1,[10838]),f9h(A_h,42,-1,[10839]),f9h(A_h,42,-1,[10843]),f9h(A_h,42,-1,[8500]),f9h(A_h,42,-1,[248]),f9h(A_h,42,-1,[248]),f9h(A_h,42,-1,[8856]),f9h(A_h,42,-1,[245]),f9h(A_h,42,-1,[245]),f9h(A_h,42,-1,[8855]),f9h(A_h,42,-1,[10806]),f9h(A_h,42,-1,[246]),f9h(A_h,42,-1,[246]),f9h(A_h,42,-1,[9021]),f9h(A_h,42,-1,[8741]),f9h(A_h,42,-1,[182]),f9h(A_h,42,-1,[182]),f9h(A_h,42,-1,[8741]),f9h(A_h,42,-1,[10995]),f9h(A_h,42,-1,[11005]),f9h(A_h,42,-1,[8706]),f9h(A_h,42,-1,[1087]),f9h(A_h,42,-1,[37]),f9h(A_h,42,-1,[46]),f9h(A_h,42,-1,[8240]),f9h(A_h,42,-1,[8869]),f9h(A_h,42,-1,[8241]),f9h(A_h,42,-1,[55349,56621]),f9h(A_h,42,-1,[966]),f9h(A_h,42,-1,[966]),f9h(A_h,42,-1,[8499]),f9h(A_h,42,-1,[9742]),f9h(A_h,42,-1,[960]),f9h(A_h,42,-1,[8916]),f9h(A_h,42,-1,[982]),f9h(A_h,42,-1,[8463]),f9h(A_h,42,-1,[8462]),f9h(A_h,42,-1,[8463]),f9h(A_h,42,-1,[43]),f9h(A_h,42,-1,[10787]),f9h(A_h,42,-1,[8862]),f9h(A_h,42,-1,[10786]),f9h(A_h,42,-1,[8724]),f9h(A_h,42,-1,[10789]),f9h(A_h,42,-1,[10866]),f9h(A_h,42,-1,[177]),f9h(A_h,42,-1,[177]),f9h(A_h,42,-1,[10790]),f9h(A_h,42,-1,[10791]),f9h(A_h,42,-1,[177]),f9h(A_h,42,-1,[10773]),f9h(A_h,42,-1,[55349,56673]),f9h(A_h,42,-1,[163]),f9h(A_h,42,-1,[163]),f9h(A_h,42,-1,[8826]),f9h(A_h,42,-1,[10931]),f9h(A_h,42,-1,[10935]),f9h(A_h,42,-1,[8828]),f9h(A_h,42,-1,[10927]),f9h(A_h,42,-1,[8826]),f9h(A_h,42,-1,[10935]),f9h(A_h,42,-1,[8828]),f9h(A_h,42,-1,[10927]),f9h(A_h,42,-1,[10937]),f9h(A_h,42,-1,[10933]),f9h(A_h,42,-1,[8936]),f9h(A_h,42,-1,[8830]),f9h(A_h,42,-1,[8242]),f9h(A_h,42,-1,[8473]),f9h(A_h,42,-1,[10933]),f9h(A_h,42,-1,[10937]),f9h(A_h,42,-1,[8936]),f9h(A_h,42,-1,[8719]),f9h(A_h,42,-1,[9006]),f9h(A_h,42,-1,[8978]),f9h(A_h,42,-1,[8979]),f9h(A_h,42,-1,[8733]),f9h(A_h,42,-1,[8733]),f9h(A_h,42,-1,[8830]),f9h(A_h,42,-1,[8880]),f9h(A_h,42,-1,[55349,56517]),f9h(A_h,42,-1,[968]),f9h(A_h,42,-1,[8200]),f9h(A_h,42,-1,[55349,56622]),f9h(A_h,42,-1,[10764]),f9h(A_h,42,-1,[55349,56674]),f9h(A_h,42,-1,[8279]),f9h(A_h,42,-1,[55349,56518]),f9h(A_h,42,-1,[8461]),f9h(A_h,42,-1,[10774]),f9h(A_h,42,-1,[63]),f9h(A_h,42,-1,[8799]),f9h(A_h,42,-1,[34]),f9h(A_h,42,-1,[34]),f9h(A_h,42,-1,[8667]),f9h(A_h,42,-1,[8658]),f9h(A_h,42,-1,[10524]),f9h(A_h,42,-1,[10511]),f9h(A_h,42,-1,[10596]),f9h(A_h,42,-1,[10714]),f9h(A_h,42,-1,[341]),f9h(A_h,42,-1,[8730]),f9h(A_h,42,-1,[10675]),f9h(A_h,42,-1,[10217]),f9h(A_h,42,-1,[10642]),f9h(A_h,42,-1,[10661]),f9h(A_h,42,-1,[10217]),f9h(A_h,42,-1,[187]),f9h(A_h,42,-1,[187]),f9h(A_h,42,-1,[8594]),f9h(A_h,42,-1,[10613]),f9h(A_h,42,-1,[8677]),f9h(A_h,42,-1,[10528]),f9h(A_h,42,-1,[10547]),f9h(A_h,42,-1,[10526]),f9h(A_h,42,-1,[8618]),f9h(A_h,42,-1,[8620]),f9h(A_h,42,-1,[10565]),f9h(A_h,42,-1,[10612]),f9h(A_h,42,-1,[8611]),f9h(A_h,42,-1,[8605]),f9h(A_h,42,-1,[10522]),f9h(A_h,42,-1,[8758]),f9h(A_h,42,-1,[8474]),f9h(A_h,42,-1,[10509]),f9h(A_h,42,-1,[10099]),f9h(A_h,42,-1,[125]),f9h(A_h,42,-1,[93]),f9h(A_h,42,-1,[10636]),f9h(A_h,42,-1,[10638]),f9h(A_h,42,-1,[10640]),f9h(A_h,42,-1,[345]),f9h(A_h,42,-1,[343]),f9h(A_h,42,-1,[8969]),f9h(A_h,42,-1,[125]),f9h(A_h,42,-1,[1088]),f9h(A_h,42,-1,[10551]),f9h(A_h,42,-1,[10601]),f9h(A_h,42,-1,[8221]),f9h(A_h,42,-1,[8221]),f9h(A_h,42,-1,[8627]),f9h(A_h,42,-1,[8476]),f9h(A_h,42,-1,[8475]),f9h(A_h,42,-1,[8476]),f9h(A_h,42,-1,[8477]),f9h(A_h,42,-1,[9645]),f9h(A_h,42,-1,[174]),f9h(A_h,42,-1,[174]),f9h(A_h,42,-1,[10621]),f9h(A_h,42,-1,[8971]),f9h(A_h,42,-1,[55349,56623]),f9h(A_h,42,-1,[8641]),f9h(A_h,42,-1,[8640]),f9h(A_h,42,-1,[10604]),f9h(A_h,42,-1,[961]),f9h(A_h,42,-1,[1009]),f9h(A_h,42,-1,[8594]),f9h(A_h,42,-1,[8611]),f9h(A_h,42,-1,[8641]),f9h(A_h,42,-1,[8640]),f9h(A_h,42,-1,[8644]),f9h(A_h,42,-1,[8652]),f9h(A_h,42,-1,[8649]),f9h(A_h,42,-1,[8605]),f9h(A_h,42,-1,[8908]),f9h(A_h,42,-1,[730]),f9h(A_h,42,-1,[8787]),f9h(A_h,42,-1,[8644]),f9h(A_h,42,-1,[8652]),f9h(A_h,42,-1,[8207]),f9h(A_h,42,-1,[9137]),f9h(A_h,42,-1,[9137]),f9h(A_h,42,-1,[10990]),f9h(A_h,42,-1,[10221]),f9h(A_h,42,-1,[8702]),f9h(A_h,42,-1,[10215]),f9h(A_h,42,-1,[10630]),f9h(A_h,42,-1,[55349,56675]),f9h(A_h,42,-1,[10798]),f9h(A_h,42,-1,[10805]),f9h(A_h,42,-1,[41]),f9h(A_h,42,-1,[10644]),f9h(A_h,42,-1,[10770]),f9h(A_h,42,-1,[8649]),f9h(A_h,42,-1,[8250]),f9h(A_h,42,-1,[55349,56519]),f9h(A_h,42,-1,[8625]),f9h(A_h,42,-1,[93]),f9h(A_h,42,-1,[8217]),f9h(A_h,42,-1,[8217]),f9h(A_h,42,-1,[8908]),f9h(A_h,42,-1,[8906]),f9h(A_h,42,-1,[9657]),f9h(A_h,42,-1,[8885]),f9h(A_h,42,-1,[9656]),f9h(A_h,42,-1,[10702]),f9h(A_h,42,-1,[10600]),f9h(A_h,42,-1,[8478]),f9h(A_h,42,-1,[347]),f9h(A_h,42,-1,[8218]),f9h(A_h,42,-1,[8827]),f9h(A_h,42,-1,[10932]),f9h(A_h,42,-1,[10936]),f9h(A_h,42,-1,[353]),f9h(A_h,42,-1,[8829]),f9h(A_h,42,-1,[10928]),f9h(A_h,42,-1,[351]),f9h(A_h,42,-1,[349]),f9h(A_h,42,-1,[10934]),f9h(A_h,42,-1,[10938]),f9h(A_h,42,-1,[8937]),f9h(A_h,42,-1,[10771]),f9h(A_h,42,-1,[8831]),f9h(A_h,42,-1,[1089]),f9h(A_h,42,-1,[8901]),f9h(A_h,42,-1,[8865]),f9h(A_h,42,-1,[10854]),f9h(A_h,42,-1,[8664]),f9h(A_h,42,-1,[10533]),f9h(A_h,42,-1,[8600]),f9h(A_h,42,-1,[8600]),f9h(A_h,42,-1,[167]),f9h(A_h,42,-1,[167]),f9h(A_h,42,-1,[59]),f9h(A_h,42,-1,[10537]),f9h(A_h,42,-1,[8726]),f9h(A_h,42,-1,[8726]),f9h(A_h,42,-1,[10038]),f9h(A_h,42,-1,[55349,56624]),f9h(A_h,42,-1,[8994]),f9h(A_h,42,-1,[9839]),f9h(A_h,42,-1,[1097]),f9h(A_h,42,-1,[1096]),f9h(A_h,42,-1,[8739]),f9h(A_h,42,-1,[8741]),f9h(A_h,42,-1,[173]),f9h(A_h,42,-1,[173]),f9h(A_h,42,-1,[963]),f9h(A_h,42,-1,[962]),f9h(A_h,42,-1,[962]),f9h(A_h,42,-1,[8764]),f9h(A_h,42,-1,[10858]),f9h(A_h,42,-1,[8771]),f9h(A_h,42,-1,[8771]),f9h(A_h,42,-1,[10910]),f9h(A_h,42,-1,[10912]),f9h(A_h,42,-1,[10909]),f9h(A_h,42,-1,[10911]),f9h(A_h,42,-1,[8774]),f9h(A_h,42,-1,[10788]),f9h(A_h,42,-1,[10610]),f9h(A_h,42,-1,[8592]),f9h(A_h,42,-1,[8726]),f9h(A_h,42,-1,[10803]),f9h(A_h,42,-1,[10724]),f9h(A_h,42,-1,[8739]),f9h(A_h,42,-1,[8995]),f9h(A_h,42,-1,[10922]),f9h(A_h,42,-1,[10924]),f9h(A_h,42,-1,[1100]),f9h(A_h,42,-1,[47]),f9h(A_h,42,-1,[10692]),f9h(A_h,42,-1,[9023]),f9h(A_h,42,-1,[55349,56676]),f9h(A_h,42,-1,[9824]),f9h(A_h,42,-1,[9824]),f9h(A_h,42,-1,[8741]),f9h(A_h,42,-1,[8851]),f9h(A_h,42,-1,[8852]),f9h(A_h,42,-1,[8847]),f9h(A_h,42,-1,[8849]),f9h(A_h,42,-1,[8847]),f9h(A_h,42,-1,[8849]),f9h(A_h,42,-1,[8848]),f9h(A_h,42,-1,[8850]),f9h(A_h,42,-1,[8848]),f9h(A_h,42,-1,[8850]),f9h(A_h,42,-1,[9633]),f9h(A_h,42,-1,[9633]),f9h(A_h,42,-1,[9642]),f9h(A_h,42,-1,[9642]),f9h(A_h,42,-1,[8594]),f9h(A_h,42,-1,[55349,56520]),f9h(A_h,42,-1,[8726]),f9h(A_h,42,-1,[8995]),f9h(A_h,42,-1,[8902]),f9h(A_h,42,-1,[9734]),f9h(A_h,42,-1,[9733]),f9h(A_h,42,-1,[1013]),f9h(A_h,42,-1,[981]),f9h(A_h,42,-1,[175]),f9h(A_h,42,-1,[8834]),f9h(A_h,42,-1,[10949]),f9h(A_h,42,-1,[10941]),f9h(A_h,42,-1,[8838]),f9h(A_h,42,-1,[10947]),f9h(A_h,42,-1,[10945]),f9h(A_h,42,-1,[10955]),f9h(A_h,42,-1,[8842]),f9h(A_h,42,-1,[10943]),f9h(A_h,42,-1,[10617]),f9h(A_h,42,-1,[8834]),f9h(A_h,42,-1,[8838]),f9h(A_h,42,-1,[10949]),f9h(A_h,42,-1,[8842]),f9h(A_h,42,-1,[10955]),f9h(A_h,42,-1,[10951]),f9h(A_h,42,-1,[10965]),f9h(A_h,42,-1,[10963]),f9h(A_h,42,-1,[8827]),f9h(A_h,42,-1,[10936]),f9h(A_h,42,-1,[8829]),f9h(A_h,42,-1,[10928]),f9h(A_h,42,-1,[10938]),f9h(A_h,42,-1,[10934]),f9h(A_h,42,-1,[8937]),f9h(A_h,42,-1,[8831]),f9h(A_h,42,-1,[8721]),f9h(A_h,42,-1,[9834]),f9h(A_h,42,-1,[185]),f9h(A_h,42,-1,[185]),f9h(A_h,42,-1,[178]),f9h(A_h,42,-1,[178]),f9h(A_h,42,-1,[179]),f9h(A_h,42,-1,[179]),f9h(A_h,42,-1,[8835]),f9h(A_h,42,-1,[10950]),f9h(A_h,42,-1,[10942]),f9h(A_h,42,-1,[10968]),f9h(A_h,42,-1,[8839]),f9h(A_h,42,-1,[10948]),f9h(A_h,42,-1,[10967]),f9h(A_h,42,-1,[10619]),f9h(A_h,42,-1,[10946]),f9h(A_h,42,-1,[10956]),f9h(A_h,42,-1,[8843]),f9h(A_h,42,-1,[10944]),f9h(A_h,42,-1,[8835]),f9h(A_h,42,-1,[8839]),f9h(A_h,42,-1,[10950]),f9h(A_h,42,-1,[8843]),f9h(A_h,42,-1,[10956]),f9h(A_h,42,-1,[10952]),f9h(A_h,42,-1,[10964]),f9h(A_h,42,-1,[10966]),f9h(A_h,42,-1,[8665]),f9h(A_h,42,-1,[10534]),f9h(A_h,42,-1,[8601]),f9h(A_h,42,-1,[8601]),f9h(A_h,42,-1,[10538]),f9h(A_h,42,-1,[223]),f9h(A_h,42,-1,[223]),f9h(A_h,42,-1,[8982]),f9h(A_h,42,-1,[964]),f9h(A_h,42,-1,[9140]),f9h(A_h,42,-1,[357]),f9h(A_h,42,-1,[355]),f9h(A_h,42,-1,[1090]),f9h(A_h,42,-1,[8411]),f9h(A_h,42,-1,[8981]),f9h(A_h,42,-1,[55349,56625]),f9h(A_h,42,-1,[8756]),f9h(A_h,42,-1,[8756]),f9h(A_h,42,-1,[952]),f9h(A_h,42,-1,[977]),f9h(A_h,42,-1,[977]),f9h(A_h,42,-1,[8776]),f9h(A_h,42,-1,[8764]),f9h(A_h,42,-1,[8201]),f9h(A_h,42,-1,[8776]),f9h(A_h,42,-1,[8764]),f9h(A_h,42,-1,[254]),f9h(A_h,42,-1,[254]),f9h(A_h,42,-1,[732]),f9h(A_h,42,-1,[215]),f9h(A_h,42,-1,[215]),f9h(A_h,42,-1,[8864]),f9h(A_h,42,-1,[10801]),f9h(A_h,42,-1,[10800]),f9h(A_h,42,-1,[8749]),f9h(A_h,42,-1,[10536]),f9h(A_h,42,-1,[8868]),f9h(A_h,42,-1,[9014]),f9h(A_h,42,-1,[10993]),f9h(A_h,42,-1,[55349,56677]),f9h(A_h,42,-1,[10970]),f9h(A_h,42,-1,[10537]),f9h(A_h,42,-1,[8244]),f9h(A_h,42,-1,[8482]),f9h(A_h,42,-1,[9653]),f9h(A_h,42,-1,[9663]),f9h(A_h,42,-1,[9667]),f9h(A_h,42,-1,[8884]),f9h(A_h,42,-1,[8796]),f9h(A_h,42,-1,[9657]),f9h(A_h,42,-1,[8885]),f9h(A_h,42,-1,[9708]),f9h(A_h,42,-1,[8796]),f9h(A_h,42,-1,[10810]),f9h(A_h,42,-1,[10809]),f9h(A_h,42,-1,[10701]),f9h(A_h,42,-1,[10811]),f9h(A_h,42,-1,[9186]),f9h(A_h,42,-1,[55349,56521]),f9h(A_h,42,-1,[1094]),f9h(A_h,42,-1,[1115]),f9h(A_h,42,-1,[359]),f9h(A_h,42,-1,[8812]),f9h(A_h,42,-1,[8606]),f9h(A_h,42,-1,[8608]),f9h(A_h,42,-1,[8657]),f9h(A_h,42,-1,[10595]),f9h(A_h,42,-1,[250]),f9h(A_h,42,-1,[250]),f9h(A_h,42,-1,[8593]),f9h(A_h,42,-1,[1118]),f9h(A_h,42,-1,[365]),f9h(A_h,42,-1,[251]),f9h(A_h,42,-1,[251]),f9h(A_h,42,-1,[1091]),f9h(A_h,42,-1,[8645]),f9h(A_h,42,-1,[369]),f9h(A_h,42,-1,[10606]),f9h(A_h,42,-1,[10622]),f9h(A_h,42,-1,[55349,56626]),f9h(A_h,42,-1,[249]),f9h(A_h,42,-1,[249]),f9h(A_h,42,-1,[8639]),f9h(A_h,42,-1,[8638]),f9h(A_h,42,-1,[9600]),f9h(A_h,42,-1,[8988]),f9h(A_h,42,-1,[8988]),f9h(A_h,42,-1,[8975]),f9h(A_h,42,-1,[9720]),f9h(A_h,42,-1,[363]),f9h(A_h,42,-1,[168]),f9h(A_h,42,-1,[168]),f9h(A_h,42,-1,[371]),f9h(A_h,42,-1,[55349,56678]),f9h(A_h,42,-1,[8593]),f9h(A_h,42,-1,[8597]),f9h(A_h,42,-1,[8639]),f9h(A_h,42,-1,[8638]),f9h(A_h,42,-1,[8846]),f9h(A_h,42,-1,[965]),f9h(A_h,42,-1,[978]),f9h(A_h,42,-1,[965]),f9h(A_h,42,-1,[8648]),f9h(A_h,42,-1,[8989]),f9h(A_h,42,-1,[8989]),f9h(A_h,42,-1,[8974]),f9h(A_h,42,-1,[367]),f9h(A_h,42,-1,[9721]),f9h(A_h,42,-1,[55349,56522]),f9h(A_h,42,-1,[8944]),f9h(A_h,42,-1,[361]),f9h(A_h,42,-1,[9653]),f9h(A_h,42,-1,[9652]),f9h(A_h,42,-1,[8648]),f9h(A_h,42,-1,[252]),f9h(A_h,42,-1,[252]),f9h(A_h,42,-1,[10663]),f9h(A_h,42,-1,[8661]),f9h(A_h,42,-1,[10984]),f9h(A_h,42,-1,[10985]),f9h(A_h,42,-1,[8872]),f9h(A_h,42,-1,[10652]),f9h(A_h,42,-1,[949]),f9h(A_h,42,-1,[1008]),f9h(A_h,42,-1,[8709]),f9h(A_h,42,-1,[966]),f9h(A_h,42,-1,[982]),f9h(A_h,42,-1,[8733]),f9h(A_h,42,-1,[8597]),f9h(A_h,42,-1,[1009]),f9h(A_h,42,-1,[962]),f9h(A_h,42,-1,[977]),f9h(A_h,42,-1,[8882]),f9h(A_h,42,-1,[8883]),f9h(A_h,42,-1,[1074]),f9h(A_h,42,-1,[8866]),f9h(A_h,42,-1,[8744]),f9h(A_h,42,-1,[8891]),f9h(A_h,42,-1,[8794]),f9h(A_h,42,-1,[8942]),f9h(A_h,42,-1,[124]),f9h(A_h,42,-1,[124]),f9h(A_h,42,-1,[55349,56627]),f9h(A_h,42,-1,[8882]),f9h(A_h,42,-1,[55349,56679]),f9h(A_h,42,-1,[8733]),f9h(A_h,42,-1,[8883]),f9h(A_h,42,-1,[55349,56523]),f9h(A_h,42,-1,[10650]),f9h(A_h,42,-1,[373]),f9h(A_h,42,-1,[10847]),f9h(A_h,42,-1,[8743]),f9h(A_h,42,-1,[8793]),f9h(A_h,42,-1,[8472]),f9h(A_h,42,-1,[55349,56628]),f9h(A_h,42,-1,[55349,56680]),f9h(A_h,42,-1,[8472]),f9h(A_h,42,-1,[8768]),f9h(A_h,42,-1,[8768]),f9h(A_h,42,-1,[55349,56524]),f9h(A_h,42,-1,[8898]),f9h(A_h,42,-1,[9711]),f9h(A_h,42,-1,[8899]),f9h(A_h,42,-1,[9661]),f9h(A_h,42,-1,[55349,56629]),f9h(A_h,42,-1,[10234]),f9h(A_h,42,-1,[10231]),f9h(A_h,42,-1,[958]),f9h(A_h,42,-1,[10232]),f9h(A_h,42,-1,[10229]),f9h(A_h,42,-1,[10236]),f9h(A_h,42,-1,[8955]),f9h(A_h,42,-1,[10752]),f9h(A_h,42,-1,[55349,56681]),f9h(A_h,42,-1,[10753]),f9h(A_h,42,-1,[10754]),f9h(A_h,42,-1,[10233]),f9h(A_h,42,-1,[10230]),f9h(A_h,42,-1,[55349,56525]),f9h(A_h,42,-1,[10758]),f9h(A_h,42,-1,[10756]),f9h(A_h,42,-1,[9651]),f9h(A_h,42,-1,[8897]),f9h(A_h,42,-1,[8896]),f9h(A_h,42,-1,[253]),f9h(A_h,42,-1,[253]),f9h(A_h,42,-1,[1103]),f9h(A_h,42,-1,[375]),f9h(A_h,42,-1,[1099]),f9h(A_h,42,-1,[165]),f9h(A_h,42,-1,[165]),f9h(A_h,42,-1,[55349,56630]),f9h(A_h,42,-1,[1111]),f9h(A_h,42,-1,[55349,56682]),f9h(A_h,42,-1,[55349,56526]),f9h(A_h,42,-1,[1102]),f9h(A_h,42,-1,[255]),f9h(A_h,42,-1,[255]),f9h(A_h,42,-1,[378]),f9h(A_h,42,-1,[382]),f9h(A_h,42,-1,[1079]),f9h(A_h,42,-1,[380]),f9h(A_h,42,-1,[8488]),f9h(A_h,42,-1,[950]),f9h(A_h,42,-1,[55349,56631]),f9h(A_h,42,-1,[1078]),f9h(A_h,42,-1,[8669]),f9h(A_h,42,-1,[55349,56683]),f9h(A_h,42,-1,[55349,56527]),f9h(A_h,42,-1,[8205]),f9h(A_h,42,-1,[8204])]);uVi=f9h(cai,52,12,[f9h(A_h,42,-1,[8364]),f9h(A_h,42,-1,[65533]),f9h(A_h,42,-1,[8218]),f9h(A_h,42,-1,[402]),f9h(A_h,42,-1,[8222]),f9h(A_h,42,-1,[8230]),f9h(A_h,42,-1,[8224]),f9h(A_h,42,-1,[8225]),f9h(A_h,42,-1,[710]),f9h(A_h,42,-1,[8240]),f9h(A_h,42,-1,[352]),f9h(A_h,42,-1,[8249]),f9h(A_h,42,-1,[338]),f9h(A_h,42,-1,[65533]),f9h(A_h,42,-1,[381]),f9h(A_h,42,-1,[65533]),f9h(A_h,42,-1,[65533]),f9h(A_h,42,-1,[8216]),f9h(A_h,42,-1,[8217]),f9h(A_h,42,-1,[8220]),f9h(A_h,42,-1,[8221]),f9h(A_h,42,-1,[8226]),f9h(A_h,42,-1,[8211]),f9h(A_h,42,-1,[8212]),f9h(A_h,42,-1,[732]),f9h(A_h,42,-1,[8482]),f9h(A_h,42,-1,[353]),f9h(A_h,42,-1,[8250]),f9h(A_h,42,-1,[339]),f9h(A_h,42,-1,[65533]),f9h(A_h,42,-1,[382]),f9h(A_h,42,-1,[376])])}
var sVi,tVi,uVi;function xVi(d,a,e,c){var b;if(d.length!=c){return false}for(b=0;b<c;++b){if(d.charCodeAt(b)!=a[e+b]){return false}}return true}
function yVi(d,e){var a,b,c;if(e==null){return false}if(d.length!=e.length){return false}for(c=0;c<d.length;++c){a=d.charCodeAt(c);b=e.charCodeAt(c);if(b>=65&&b<=90){b+=32}if(a!=b){return false}}return true}
function zVi(d,e){var a,b,c;if(e==null){return false}if(d.length>e.length){return false}for(c=0;c<d.length;++c){a=d.charCodeAt(c);b=e.charCodeAt(c);if(b>=65&&b<=90){b+=32}if(a!=b){return false}}return true}
function CVi(j,c,f,d,e,h,i,b,g,a){j.c=c;j.d=d;j.g=g;j.f=f;j.e=e;j.i=h;j.j=i;j.b=b;j.a=a;j.h=1;return j}
function DVi(d,c,a,b){d.c=a.d;d.d=a.e;d.g=a.e;d.f=c;d.e=b;d.i=a.f;d.j=a.g;d.b=a.c;d.a=null;d.h=1;return d}
function aWi(e,d,b,c,a){e.c=b.d;e.d=b.e;e.g=b.e;e.f=d;e.e=c;e.i=b.f;e.j=b.g;e.b=b.c;e.a=a;e.h=1;return e}
function EVi(e,c,a,b,d){e.c=a.d;e.d=a.e;e.g=d;e.f=c;e.e=b;e.i=a.f;e.j=a.g;e.b=a.c;e.a=null;e.h=1;return e}
function FVi(f,c,a,b,d,e){f.c=a.d;f.d=a.e;f.g=d;f.f=c;f.e=b;f.i=e;f.j=false;f.b=false;f.a=null;f.h=1;return f}
function cWi(){return u_h}
function dWi(){return this.d}
function AVi(){}
_=AVi.prototype=new xdi();_.gC=cWi;_.tS=dWi;_.tI=38;_.a=null;_.b=false;_.c=0;_.d=null;_.e=null;_.f=null;_.g=null;_.h=1;_.i=false;_.j=false;function q0i(d,a,c,b){d.a=a;d.c=c;d.b=b;return d}
function r0i(b,a){if(a&&b.a[b.c]==10){++b.c}}
function u0i(){return x_h}
function p0i(){}
_=p0i.prototype=new xdi();_.gC=u0i;_.tI=39;_.a=null;_.b=0;_.c=0;function z0i(b,a){b.b=a;b.a=null;return b}
function B0i(b){var a;a=b.b;if(a==null&&!!b.a){return b.a.b}else{return a}}
function C0i(){return y_h}
function D0i(){return B0i(this)}
function E0i(){if(this.a){return agi(this.a)}else{return agi(this)}}
function y0i(){}
_=y0i.prototype=new Aci();_.gC=C0i;_.Bb=D0i;_.tS=E0i;_.tI=40;_.a=null;function a1i(c,b,a){c.b=b;c.a=null;if(a){lUi(a);kUi(a)}else{}return c}
function b1i(d,c,b,a){d.b=c;d.a=a;if(b){lUi(b);kUi(b)}else{}return d}
function d1i(){return z_h}
function F0i(){}
_=F0i.prototype=new y0i();_.gC=d1i;_.tI=41;function Cbi(){!!$stats&&$stats({moduleName:$moduleName,subSystem:iIh,evtGroup:jIh,millis:(new Date()).getTime(),type:kIh,className:lIh});$wnd.parseHtmlDocument=xni}
function gwtOnLoad(b,d,c){$moduleName=d;$moduleBase=c;if(b)try{Cbi()}catch(a){b(d)}else{Cbi()}}
function v0i(){}
var k$h=jci(mIh,nIh),b$h=jci(pIh,qIh),q$h=jci(mIh,rIh),g$h=jci(mIh,sIh),l$h=jci(mIh,tIh),E9h=jci(uIh,vIh),F9h=jci(uIh,wIh),D_h=ici(xIh,yIh),f$h=jci(mIh,AIh),dai=ici(cNh,BIh),s$h=jci(CIh,DIh),A$h=jci(CIh,EIh),F$h=jci(CIh,FIh),a$h=jci(pIh,aJh),i$h=jci(mIh,bJh),c$h=jci(mIh,cJh),A_h=ici(cNh,dJh),e$h=jci(mIh,fJh),d$h=jci(mIh,gJh),h$h=jci(mIh,hJh),B_h=ici(cNh,iJh),j$h=jci(mIh,jJh),p$h=jci(mIh,aUh),m$h=jci(mIh,kJh),n$h=jci(mIh,lJh),o$h=jci(mIh,mJh),r$h=jci(mIh,nJh),C_h=ici(xIh,oJh),C$h=jci(CIh,qJh),x$h=jci(CIh,rJh),E$h=jci(CIh,sJh),u$h=jci(CIh,tJh),t$h=jci(CIh,uJh),B$h=jci(CIh,vJh),v$h=jci(CIh,wJh),w$h=jci(CIh,xJh),y$h=jci(CIh,yJh),z$h=jci(CIh,zJh),D$h=jci(CIh,BJh),a_h=jci(CIh,CJh),b_h=jci(CIh,DJh),e_h=jci(CIh,EJh),c_h=jci(CIh,FJh),d_h=jci(CIh,aKh),f_h=jci(CIh,bKh),g_h=kci(cKh,dKh),h_h=kci(cKh,eKh),i_h=kci(cKh,hKh),w_h=jci(iKh,jKh),p_h=jci(iKh,kKh),k_h=jci(lKh,mKh),j_h=jci(lKh,nKh),m_h=jci(lKh,oKh),l_h=jci(lKh,pKh),n_h=jci(lKh,qKh),bai=ici(cNh,sKh),E_h=ici(tKh,uKh),o_h=jci(iKh,vKh),F_h=ici(tKh,wKh),q_h=jci(iKh,xKh),v_h=jci(iKh,yKh),r_h=jci(iKh,zKh),s_h=jci(iKh,AKh),t_h=jci(iKh,BKh),cai=ici(cNh,DKh),u_h=jci(iKh,EKh),aai=ici(tKh,FKh),x_h=jci(iKh,aLh),y_h=jci(bLh,cLh),z_h=jci(bLh,dLh);if (nu_validator_htmlparser_HtmlParser) {  var __gwt_initHandlers = nu_validator_htmlparser_HtmlParser.__gwt_initHandlers;  nu_validator_htmlparser_HtmlParser.onScriptLoad(gwtOnLoad);}})();/**
 * @author thatcher
 */

Html5Parser();

})($w,$document);
/*
*	outro.js
*/
    

    };// close function definition begun in 'intro.js'


    // turn "original" JS interpreter global object into the
    // "root" window object
    Envjs.window(this,    // object to "window-ify"
                 Envjs,   // our scope for globals
                 this,    // a root window's parent is itself
                 null,    // "opener" for new window
                 this,    // "top" for new window
                 true     // identify this as the original (not reloadable) win
                );
    
    
} catch(e){
    Envjs.error("ERROR LOADING ENV : " + e + "\nLINE SOURCE:\n" +
        Envjs.lineSource(e));
}
