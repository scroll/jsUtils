//Adds useful functions to the prototype of Array, String, Number etc
//Contains ui (control) specific functions, which can be attached to any ui element by using InitCtrl, InitForm, InitMenu, InitFrame functions.
//

var Keys = new Object();
Keys.Enter = 13;
Keys.Escape = 27;

function IsUndefined(value) { return typeof(value) == "undefined"; };
function IsNull(value) { return typeof(value) == "undefined" || value == null; };
function IsEmpty(str) { return typeof(str) == "undefined" || str == ""; };
function ToString(value) { return typeof(value) == "undefined" || value == null ? "" : value; }
function IsIE() { if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { IsIE = function() { return true; }; IsIE.V = parseFloat( RegExp.$1 ); } else { IsIE = function() { return false; }; } return IsIE(); };
function IsFF() { if(/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) IsFF = function() { return true; }; else IsFF = function() { return false; }; return IsFF(); };
function IsOP() { if(/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)) IsOP = function() { return true; }; else IsOP = function() { return false; }; return IsOP(); };
function IsSF() { if(/Safari/.test(navigator.userAgent)) IsSF = function() { return true; }; else IsSF = function() { return false; }; return IsSF(); };
function IsSY() { if(/Symbian/.test(navigator.userAgent)) IsSY = function() { return true; }; else IsSY = function() { return false; }; return IsSY(); };
function IsCR() { return Boolean(window.chrome); };
var Event = null;

function InitEvent(e)
{
	Event = null;
	if(IsNull(e))
	{
		if(IsNull(window.event)) return false;
		
		Event = window.event;
		Event.KeyCode = window.event.keyCode == 0 ? window.event.charCode : window.event.keyCode;
		Event.OriginalSource = Event.srcElement;
	}
	else
	{
		Event = e;
		Event.KeyCode = e.which == 0 ? e.charCode : e.which;
		Event.OriginalSource = e.target;
	}
	Event.cancelBubble = false;
	if(!IsNull(Event.OriginalSource) && Event.OriginalSource.nodeType == 3)//The last two lines of code are especially for Safari. If an event takes place on an element that contains text, this text node, and not the element, becomes the target of the event. Therefore we check if the target's nodeType is 3, a text node. If it is we move to its parent node, the HTML element.
		Event.OriginalSource = Event.OriginalSource.parentNode;
	return true;
};

//array
Array.prototype.Count = function(value) { if(IsUndefined(value)) return this.length; this.length = value; };
Array.prototype.Insert = function(index, value) { this.splice(index, 0, value); };
Array.prototype.RemoveAt = function(index, count) { if(IsUndefined(count)) count = 1; this.splice(index, count); };
Array.prototype.At = function(index, value) { if(IsUndefined(value)) return this[index]; this[index] = value; };
Array.prototype.Add = Array.prototype.push;

Array.prototype.AddUniq = function(value) { if(!this.Contains(value)) this.Add(value); };
Array.prototype.AddRange = function(arrayValue) { for(var i = 0; i < arrayValue.Count(); ++i) this.Add(arrayValue[i]); };
Array.prototype.InsertRange = function(index, arrayValue) { for(var i = 0; i < arrayValue.Count(); ++i) this.Insert(index+i, arrayValue[i]); };
Array.prototype.Remove = function(value, startIndex) { startIndex = this.IndexOf(value, startIndex); if(startIndex != -1) this.RemoveAt(startIndex, 1); };
Array.prototype.Clear = function() { this.Count(0); };

Array.prototype.Contains = function(value) { return this.IndexOf(value) != -1; };
Array.prototype.IndexOf = function(value, startIndex)
{
	if(this.Count() == 0) return -1;
	if(IsUndefined(startIndex)) startIndex = 0;
	if(IsUndefined(this.At(0).Equals)) { for(; startIndex < this.Count(); ++startIndex) if(this.At(startIndex) == value) return startIndex; }
	else { for(; startIndex < this.Count(); ++startIndex) if(this.At(startIndex).Equals(value)) return startIndex; }
	return -1;
};
Array.prototype.LastIndexOf = function(value, startIndex)
{
	if(this.Count() == 0) return -1;
	if(IsUndefined(startIndex)) startIndex = this.Count() - 1;
	if(IsUndefined(this.At(0).Equals)) { for(; startIndex >= 0; --startIndex) if(this.At(startIndex) == value) return startIndex; }
	else { for(; startIndex >= 0; --startIndex) if(this.At(startIndex).Equals(value)) return startIndex; }
	return -1;
};

Array.prototype.ToString = function(delimiter)
{
	var count = this.Count();
	if(count == 0) return '';
	var toString = IsDefined(this.At(0).ToString);
	if(count == 1) return (toString == true) ? this.At(0).ToString() : '' + this.At(0);
	
	if(IsUndefined(delimiter)) delimiter = ', ';
	var ret = this.At(0);
	if(toString == true) { for(var i = 1; i < this.Count(); ++i) ret = ret + delimiter + this.At(i).ToString(); }
	else { for(var i = 1; i < this.Count(); ++i) ret = ret + delimiter + this.At(i); }
	return ret;
};

//String.js
String.prototype.Count = function() { return this.length; };
String.prototype.Insert = function(index, value) { return this.Substring(0, index) + value + this.Substring(index); };
String.prototype.RemoveAt = function(index, count) { if(IsUndefined(count)) count=1; return this.Substring(0, index) + this.Substring(index + count); };
String.prototype.At = String.prototype.charAt;

String.prototype.Add = function(value) { return this.Insert(this.Count(), value); };
String.prototype.Remove = function(startIndex, value) { var startIndex = this.IndexOf(value, startIndex); if(startIndex != -1) this.RemoveAt(startIndex, value.Count()); };

String.prototype.TrimStart = function(value) { return (this.IndexOf(value) == 0) ? this.Substring(value.Count()) : value; };
String.prototype.TrimEnd = function(value) { return (this.LastIndexOf(value) == value.Count()) ? this.Substring(0, this.Count() - value.Count()) : value; };

String.prototype.Contains = function(value) { return this.IndexOf(value) != -1; };
String.prototype.Equals = function(value, caseSensitive) { if(caseSensitive) return value == this; else return value.ToLower() == this.ToLower(); };
String.prototype.IndexOf = String.prototype.indexOf;
String.prototype.LastIndexOf = String.prototype.lastIndexOf;

String.prototype.ToLower = String.prototype.toLowerCase;
String.prototype.ToUpper = String.prototype.toUpperCase;

String.prototype.Substring = String.prototype.substring;
String.prototype.Split = String.prototype.split;

String.prototype.ToCode = function(index) { if(index==null) index=0; return this.charCodeAt(index); };
String.prototype.ToCodes = function() { var codes = new Array(); for(var i = 0; i < this.Count(); ++i) codes.Add(this.charCodeAt(index)); return codes; };

String.prototype.Replace = function(oldValue, newValue) 
{
	var arr = this.Split(oldValue);
	oldValue = '';
	for(var i = 0; i < arr.Count() - 1; ++i)
	{
		oldValue += arr[i];
		if(newValue != null) oldValue += newValue;
	}
	oldValue += arr[i];
	return oldValue;
};

String.prototype.EndsWith = function(end)
{
	if(end.Count() <= this.Count()) for(var i = 0; i < end.Count(); ++i) if(end.At(end.Count() - 1 - i) == this.At(this.Count() - 1 - i)) return true;
	return false;
};
String.prototype.StartsWith = function(start)
{
	if(start.Count() <= this.Count()) for(var i = 0; i < start.Count(); ++i) if(start.At(i) == this.At(i)) return true;
	return false;
};

String.prototype.ToString = function() { return this; };
String.prototype.ToInt = function() { return parseInt(this); };
String.prototype.ToFloat = function() { return parseFloat(this); };
String.prototype.ToIntOr0 = function() { return IsEmpty(this) ? 0 : parseInt(this); };
String.prototype.ToFloatOr0 = function() { return IsEmpty(this) ? 0 : parseFloat(this); };

//static
String.Format = function()
{
	var str = String.Format.arguments[0];
	for(var i = 1; i < String.Format.arguments.length; ++i)
		str = str.Replace('{' + (i-1).toString() + '}', String.Format.arguments[i]);
	return str;
};
String.Join = function(separator, value)
{
	var count = value.Count();
	if(count == 0) return '';
	if(count == 1) return value[0];
	var ret = value[0];
	for(var i = 1; i < value.Count(); ++i)
		ret = ret + separator + value[i];
};
String.Concatenate = function(value1, value2)
{
	return value1 + value2;
};
String.FromCode = function(code) { return String.fromCharCode(code); };
String.FromCodes = function(codes) { var str = new String(); for(var i = 0; i < codes.Count(); ++i) str = str + String.fromCharCode(codes[i]); return str; };

Number.prototype.ToInt = function() { return parseInt(this.toFixed() + ""); };
Number.prototype.Round = Number.prototype.toFixed;
Number.prototype.ToString = Number.prototype.toString;
Number.prototype.InRange = function(min, max) { if(min > max) { alert("exception: min > max!"); throw "min > max!"; } if(this < min) return min; if(this > max) return max; return this; };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ClassCount(elem)
{
	if(IsNull(elem)) elem = this;
	if(IsEmpty(elem.className)) return 0;
	var classes = elem.className.Split(" ");
	return classes.Count();
};
function ClassAt(index, elem)
{
	if(IsNull(elem)) elem = this;
	var classes = elem.className.Split(" ");
	return classes[index];
};
function AddClass(value, elem)
{
	if(IsNull(elem)) elem = this;
	value = value + " ";
	if(!elem.className.Contains(value)) elem.className = elem.className + (elem.className.EndsWith(" ") ? "" : " ") + value;
};
function RemoveClass(value, elem)
{
	if(IsNull(elem)) elem = this;
	value = value + " ";
	elem.className = elem.className.Replace(value, "");
};
function AddStateClass(value, elem)
{
	if(IsNull(elem)) elem = this;
	value = ClassAt(0, elem) + value + " ";
	if(!elem.className.Contains(value)) elem.className = elem.className + (elem.className.EndsWith(" ") ? "" : " ") + value;
};
function RemoveStateClass(value, elem)
{
	if(IsNull(elem)) elem = this;
	value = ClassAt(0, elem) + value + " ";
	elem.className = elem.className.Replace(value, "");
};


var _downloadedFiles = new Object();
function AddScriptFile(file)
{
	if(!IsNull(_downloadedFiles[file])) return;
	_downloadedFiles[file] = true;
	var script = document.createElement('script'); script.type= 'text/javascript';
	script.src= file;
	_head.appendChild(script);
};
function CreateForm(file, div)
{
	//_server is ServerStream object (see Stream.js) which must be initialized in order to use this function
		
	var html = _downloadedFiles[file];
	if(IsNull(html))
	{
		_server.KeyID = "HTML";
		_server.KeyValue = file;
		_downloadedFiles[file] = html = _server.ReadAll();
	}
	
	if(IsNull(div)) div = document.createElement("div");
	div.innerHTML = html;
	
	return div;
};

function FromID(id) { return document.getElementById(id); };

function InitCtrl(elem) { if(elem == null) return null; if(!IsNull(elem.IsCtrl)) return elem; elem.IsCtrl = true; elem.Attach = Attach; elem.Detach = Detach; elem.ClassCount = ClassCount; elem.ClassAt = ClassAt; elem.AddClass = AddClass; elem.RemoveClass = RemoveClass; elem.AddStateClass = AddStateClass; elem.RemoveStateClass = RemoveStateClass; elem.ToScreen = ToScreen; elem.BackColor = BackColor; elem.BorderColor = BorderColor; elem.FlowLayout = FlowLayout; elem.ZIndex = ZIndex; elem.Top = Top; elem.Left = Left; elem.Position = Position; elem.Height = Height; elem.Width = Width; elem.MinWidth = MinWidth; elem.MinHeight = MinHeight; elem.MaxWidth = MaxWidth; elem.MaxHeight = MaxHeight; elem.BorderWidth = BorderWidth; elem.Visible = Visible; elem.Hidden = Hidden; elem.Collapsed = Collapsed; elem.Enabled = Enabled; elem.BackImage = BackImage; elem.Opacity = Opacity; elem.ShowFading = ShowFading; elem.Move = Move; elem.HideFading = HideFading; elem.OpacityFading = OpacityFading; elem.BackBrush = BackBrush; elem.CornerRadius = CornerRadius; return elem; };
function InitForm(elem) { if(elem == null) return null; InitCtrl(elem); elem.IsForm = true; elem.style.zIndex = 1000; elem.Attach("onmousedown", function() { Event.cancelBubble = true; }); return elem; };
function InitMenu(elem) { if(elem == null) return null; InitCtrl(elem); elem.IsMenu = true; elem.style.zIndex = 10000; elem.style.cursor = "Pointer"; return elem; };
function InitFrame(frame) { if(frame == null) return null; frame.Location = function(src) { this.src = src; }; return frame; };

function DesktopBackColor() { }
function DesktopBackImage() { }
function DesktopWidth() { return IsUndefined(window.innerWidth) ? document.documentElement.clientWidth : window.innerWidth; };
function DesktopHeight() { return IsUndefined(window.innerHeight) ? document.documentElement.clientHeight : window.innerHeight; };
function ZIndex(value) { if(IsUndefined(value)) return this.style.zIndex; this.style.zIndex = value; }
function FlowLayout(value) { if(IsUndefined(value)) return this.style.position != "absolute"; if(value == true) { this.style.top = ""; this.style.left = ""; } if(value == (this.style.position == "absolute")) this.style.position = value == true ? "" : "absolute"; };
function Position(value) { if(IsUndefined(value)) { var pos = new Object(); pos.X = this.Left(); pos.Y = this.Top(); return pos; } else { this.Left(pos.X); this.Top(pos.Y); } };
function Left(value) { if(IsUndefined(value)) return IsEmpty(this.style.left) ? this.offsetLeft : this.style.left.ToInt(); this.FlowLayout(false); this.style.left = value + "px"; };
function Top(value) { if(IsUndefined(value)) return IsEmpty(this.style.top) ? this.offsetTop : this.style.top.ToInt(); this.FlowLayout(false); this.style.top = value + "px"; };
function Width(value) { if(IsUndefined(value)) return IsEmpty(this.style.width) || this.style.width == "auto" ? this.offsetWidth : this.style.width.ToInt(); this.style.width = value + "px"; };
function Height(value) { if(IsUndefined(value)) return IsEmpty(this.style.height) || this.style.height == "auto" ? this.offsetHeight : this.style.height.ToInt(); this.style.height = value + "px"; };
function MinWidth(value) { if(IsUndefined(value)) return this.style.minWidth.ToInt(); this.style.minWidth = value + "px"; };
function MinHeight(value) { if(IsUndefined(value)) return this.style.minHeight.ToInt(); this.style.minHeight = value + "px"; };
function MaxWidth(value) { if(IsUndefined(value)) return this.style.maxWidth.ToInt(); this.style.maxWidth = value + "px"; };
function MaxHeight(value) { if(IsUndefined(value)) return this.style.maxHeight.ToInt(); this.style.maxHeight = value + "px"; };
function BorderWidth(value) { if(IsUndefined(value)) return this.style.borderWidth.ToInt(); this.style.borderWidth = value + "px"; };
function MousePosition(e) { var pos = new Object(); if (e.pageX || e.pageY) { pos.X = e.pageX; pos.Y = e.pageY; } else if (e.clientX || e.clientY) { pos.X = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; pos.Y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; } return pos; };
function ToScreen(point) { var off = this.parentNode ? this.offsetParent : null; while(off != null) { point.X += IsEmpty(off.style.left) ? off.offsetLeft : off.style.left.ToInt(); point.Y += IsEmpty(off.style.top) ? off.offsetTop : off.style.top.ToInt(); off = off.offsetParent; if(off == _body) break; } return point; };

function Enabled(value) { if(IsUndefined(value)) return this.disabled != true; this.disabled = value == true ? null : "disabled"; };

function Visible(value)
{
	if(IsUndefined(value)) return !this.Hidden() && ! this.Collapsed();
	
	var visible = this.Visible();
	if(value == true) { this.Hidden(false); this.Collapsed(false); } else this.Hidden(true);
	if(visible != this.Visible() && !IsNull(this["OnVisible"])) this["OnVisible"]();
};
function Hidden(value)
{
	if(IsUndefined(value)) return this.style.visibility == "hidden";
	
	var visible = this.Visible();
	this.style.visibility = value == true ? "hidden" : "visible";
	if(!IsNull(this["OnHidden"])) this["OnHidden"]();
	if(visible != this.Visible() && !IsNull(this["OnVisible"])) this["OnVisible"]();
};
function Collapsed(value)
{
	if(IsUndefined(value)) return this.style.display != "block";
	
	var visible = this.Visible();
	this.style.display = value == true ? "none" : "block";
	if(!IsNull(this["OnCollapsed"])) this["OnCollapsed"]();
	if(visible != this.Visible() && !IsNull(this["OnVisible"])) this["OnVisible"]();
};
function Opacity(value) { if(IsUndefined(value)) return IsUndefined(this._opacity) ? 100 : this._opacity; else { this._opacity = value; if(IsFF()) this.style.MozOpacity = value / 100; else if(IsIE()) this.style.filter = "alpha(opacity=" + value + ");"; else this.style.opacity = value / 100; } };

function BackColor(value) { if(IsUndefined(value)) return this.style.backgroundColor; if(this.style.backgroundColor != value) this.style.backgroundColor = value; };
function BorderColor(value) { if(IsUndefined(value)) return this.style.borderColor; if(this.style.borderColor != value) this.style.borderColor = value; };
//function BackImage(value) { if(IsUndefined(value)) { if(IsIE()) return this._backImage; return this.style.backgroundImage; } else { if(IsIE() && IsIE.V < 7) { this._backImage = value; this.style.backgroundImage = "none"; this.style.position = "relative"; this.style.zIndex = "0"; this.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + value + "');"; } else this.style.backgroundImage = "url(" + value + ")"; } };
function BackImage(value) { if(IsUndefined(value)) return this._backImage; this.style.backgroundImage = "url(" + value + ")"; };
function BackBrush(value)
{
	if(IsUndefined(value)) return this._backBrush;
	this._backBrush = value;
	if(IsIE())
	{
		var filter = "progid:DXImageTransform.Microsoft.gradient(GradientType=" + value.Vertical == true ? 0 : 1 + ", StartColorStr='" + value.Start + "', endColorstr='" + value.End + "')";
		if(IsIE.V < 8) this.style.filter = filter; else this.style.mozFilter = filter;
	}
	else if(IsFF())
	{
		this.style.background =  "mozLinearGradient(left, " + value.Start + ", " + value.End + ")";//rgba(255,0,0,1)
	}
	if(IsCR())
	{
		this.style.background =  "-webkit-gradient(linear, left top, right top, from(" + value.Start + "), to(" + value.End + "));";//rgba(255,0,0,1)
	}
	else
	{
		BackColor(value.Start);
	}
};
function CornerRadius(value)
{
	value = value + "px";
	if(IsFF()) this.style.setProperty("-moz-border-radius", value, null);
	else if(IsCR()) this.style["-webkit-border-radius"] = value;
	else if(IsIE()) this.style["border-radius"] = value + " " + value + " " + value + " " + value;
	else this.style["-khtml-border-radius"] = value;
}

function FirstChild(elem)
{
	//if(IsNull(elem.FirstChild))
	{
		var firstChild = elem.firstChild;
		while(firstChild != null && firstChild.nodeType == 3) { firstChild = firstChild.nextSibling; }
		
		elem.FirstChild =  firstChild;
	}
	return elem.FirstChild;
}

function CSSStylesCount() { var theRules = document.styleSheets[0].cssRules ? document.styleSheets[0].cssRules : document.styleSheets[0].rules; return theRules.length; };
function CSSStyle(index) { var theRules = document.styleSheets[0].cssRules ? document.styleSheets[0].cssRules : document.styleSheets[0].rules; return theRules[index].style; };


function Attach(evt, handler)
{
	Detach(evt, handler);
	
	var This = this;
	if(IsUndefined(This._handlers)) This._handlers = new Array();
	if(IsUndefined(This._handlers[evt])) { var arr = new Array(); This._handlers[evt] = arr; This[evt] = function(e) { if(InitEvent(e)) Event.Source = This; for(var i = 0; i < This._handlers[evt].Count(); ++i) This._handlers[evt][i](); } }
	This._handlers[evt].Add(handler);
};
function Detach(evt, handler)
{
	if(IsUndefined(this._handlers)) return;
	if(IsUndefined(this._handlers[evt])) return;
	this._handlers[evt].Remove(handler);
};

function AddHistory(fname)
{
	if(_history == null)
	{
		_history = FromID("_history");
		if(IsNull(_history)) { this["AddHistory"] = function(f) { }; }
		else
		{
			_history = InitFrame(_history);
			this["AddHistory"] = function(f) { _history.Location("History.aspx?" + f); };
			AddHistory(fname);
		}
	}
};
var _history = null;

function ShowFading(screenLeft, screenTop)
{
	if(this.Visible()) return;
	
	if(this.IsForm || this.IsMenu) this.Move(screenLeft, screenTop);
	
	_showFading(this);
};
function Move(screenLeft, screenTop)
{
	if(this != _body)
	{
		if(IsUndefined(screenLeft) || IsUndefined(screenTop))
		{
			if(IsNull(this.Owner))
			{
				screenLeft = IsUndefined(screenLeft) ? (0 + (DesktopWidth() - this.Width())/2) : screenLeft;
				screenTop = IsUndefined(screenTop) ? (0 + (DesktopHeight() - this.Height())/3) : screenTop;
			}
			else
			{
				var pos = new Object(); pos.X = this.Owner.Left(); pos.Y = this.Owner.Top();
				pos = this.Owner.ToScreen(pos);
				
				screenLeft = IsUndefined(screenLeft) ? (pos.X + (this.Owner.Width() - this.Width())/2) : screenLeft;
				screenTop = IsUndefined(screenTop) ? (pos.Y + (this.Owner.Height() - this.Height())/3) : screenTop;
			}
		}
		
		if(screenLeft < 0) screenLeft = 0;
		if(screenTop < 0) screenTop = 0;
		
		
		this.Left(screenLeft);		
		this.Top(screenTop);		
	}
};
function HideFading()
{
	if(!this.Visible()) return;
	
	_hideFading(this);
};
function OpacityFading(finalOpacity)
{
	this._opacityBackUp = this.Opacity();
	this.Visible(true);
	if(this._opacityBackUp > finalOpacity) _showFading(this);
	else _hideFading(this);
};
function _showFading(ctrl)
{
	if(!IsNull(ctrl._hideOpacityBkup)) return;

	if(IsNull(ctrl._showOpacityBkup))
	{
		ctrl._showOpacityBkup = ctrl.Opacity();
		ctrl.Opacity(20);
		ctrl.Visible(true);
	}
	
	if(ctrl.Visible())
	{
		var opacity = ctrl.Opacity();
		if(opacity < ctrl._showOpacityBkup)
		{
			opacity += 4;
			if(opacity < ctrl._showOpacityBkup) { ctrl.Opacity(opacity); BeginInvoke(_showFading, ctrl); return; }
		}
	}
	
	ctrl.Opacity(ctrl._showOpacityBkup);
	ctrl._showOpacityBkup = null;
};
function _hideFading(ctrl)
{
	if(!IsNull(ctrl._showOpacityBkup)) return;

	if(IsNull(ctrl._hideOpacityBkup))
		ctrl._hideOpacityBkup = ctrl.Opacity();

	if(ctrl.Visible())
	{
		var opacity = ctrl.Opacity();
		if(opacity > 0)
		{
			opacity -= 4;
			if(opacity > 0) { ctrl.Opacity(opacity); BeginInvoke(_hideFading, ctrl); return; }
		}
	}
	
	ctrl.Collapsed(true);
	ctrl.Opacity(ctrl._hideOpacityBkup);
	ctrl._hideOpacityBkup = null;
};

var _uniqObjectsIndex = 0;
var _uniqObjects = new Object();
function UniqObject(id)
{
	if(IsNull(id))
	{
		var uo = new Object();
		uo.ID = _uniqObjectsIndex++;
		_uniqObjects[uo.ID] = uo;
		return uo;
	}
	else
	{
		return _uniqObjects[id];
	}
};
function ClearUniqObject(id)
{
	delete _uniqObjects[id];
};

var _invokes = new Array();
var _invoking = false;
function BeginInvoke(func, arg)
{
	var rec = new Object();
	rec.Func = func;
	rec.Arg = arg;
	
	_invokes.Add(rec);
	if(!_invoking)
	{
		_invoking = true;
		setTimeout("DoInvoke();", 0);
	}
};
function EndInvoke(func)
{
	for(var i = 0; i < _invokes.Count(); ++i)
		if(_invokes[i].Func == func)
			_invokes.RemoveAt(i--);
};
function DoInvoke()
{
	var count = _invokes.Count();
	for(var i = 0; i < count; ++i)
	{
		var rec = _invokes[i];
		rec.Func(rec.Arg);
	}
	_invokes.RemoveAt(0, count);
	if(_invokes.Count() > 0)
		setTimeout("DoInvoke();", 0);
	else
		_invoking = false;
};
function BeginTimeout(func, arg, delay)
{
	setTimeout(function() { func(arg); }, delay);
};
function BeginTimer(func, arg, interval)
{
	setInterval(function() { func(arg); }, interval);
};

function FitTable(table)
{
	if(table.rows.length == 0) return;
	
	if(table.rows.length == 1) FitHTable(table);
	else FitVTable(table);
	
	if(!IsNull(table.OnFitted))
		table.OnFitted();
};
function FitVTable(table)
{
	if(IsUndefined(table._rowStars))
	{
		InitCtrl(table);
		table._rowPixesHeight = 0;
		table._rowStarsHeight = 0;
		
		table._rowStars = new Array();
		table._rowPixes = new Array();
		for(var i = 0; i < table.rows.length; ++i)
		{
			var row = table.rows[i];
			var heightStr = ToString(FirstChild(row.cells[0]).style.height);
			if(heightStr.Count() == 0 || heightStr.EndsWith("mm"))
			{
				var height = heightStr.Count() == 0 ? 100.0 : heightStr.ToFloat() * 100;
				row._height = height;
				table._rowStars.Add(row);
				table._rowStarsHeight += height;
			}
			else
			{
				var height = heightStr.ToInt();
				row._height = height;
				table._rowPixes.Add(row);
				table._rowPixesHeight += height;
			}
		}

		FitVTable(table);
	}
	else
	{
		var height = table.Height();
		if(table._rowPixesHeight > height) table.Height(height = table._rowPixesHeight);
		
		var starsHeight = height - table._rowPixesHeight;
		var rowStarsHeight = table._rowStarsHeight;
		for(var i = 0; i < table._rowStars.Count(); ++i)
		{
			var row = table._rowStars[i];
			var rowHeight = ((row._height / rowStarsHeight) * starsHeight).ToInt();
			
			var rowMinHeightStr = ToString(row.style.minHeight);
			var rowMinHeight = rowMinHeightStr.ToInt();
			var rowMaxHeightStr = ToString(row.style.maxHeight);
			var rowMaxHeight = rowMaxHeightStr.ToInt();
			if(rowMinHeightStr.Count() != 0 && rowHeight < rowMinHeight) rowHeight = rowMinHeight;
			else if(rowMaxHeightStr.Count() != 0 && rowHeight > rowMaxHeight) rowHeight = rowMaxHeight;
			else { FirstChild(row.cells[0]).style.height = rowHeight + "px"; continue; }
			
			FirstChild(row.cells[0]).style.height = rowHeight + "px";
			starsHeight -= rowHeight;
			rowStarsHeight -= row._height;
		}
	}
};
function FitHTable(table)
{
	if(IsUndefined(table._colStars))
	{
		InitCtrl(table);
		if(IsEmpty(table.rows[0].style.height)) table.rows[0].style.height = "100%";
		table._colPixesWidth = 0;
		table._colStarsWidth = 0;
		
		table._colStars = new Array();
		table._colPixes = new Array();
		for(var i = 0; i < table.rows[0].cells.length; ++i)
		{
			var col = table.rows[0].cells[i];
			var child = FirstChild(col);
			
			if(IsEmpty(child.style.height)) child.style.height = "100%";
			var widthStr = ToString(child.style.width);
			if(widthStr.Count() == 0 || widthStr.EndsWith("mm"))
			{
				var width = widthStr.Count() == 0 ? 100.0 : widthStr.ToFloat() * 100;
				col._width = width;
				table._colStars.Add(col);
				table._colStarsWidth += width;
			}
			else
			{
				var width = widthStr.ToInt();
				col._width = width;
				table._colPixes.Add(col);
				table._colPixesWidth += width;
				child.style.width = width - 2 * child.style.borderWidth.ToIntOr0() + "px";
			}
		}

		FitHTable(table);
	}
	else
	{
		var width = table.Width();
		if(table._colPixesWidth > width) table.Width(width = table._colPixesWidth);
		
		var starsWidth = width - table._colPixesWidth;
		var colStarsWidth = table._colStarsWidth;
		for(var i = 0; i < table._colStars.Count(); ++i)
		{
			var col = table._colStars[i];
			var child = FirstChild(col);

			var colWidth = ((col._width / colStarsWidth) * starsWidth).ToInt();
			
			var colMinWidthStr = ToString(col.style.minWidth);
			var colMinWidth = colMinWidthStr.ToInt();
			var colMaxWidthStr = ToString(col.style.maxWidth);
			var colMaxWidth = colMaxWidthStr.ToInt();
			if(colMinWidthStr.Count() != 0 && colWidth < colMinWidth) colWidth = colMinWidth;
			else if(colMaxWidthStr.Count() != 0 && colWidth > colMaxWidth) colWidth = colMaxWidth;
			else { child.style.width = colWidth - 2 * child.style.borderWidth.ToIntOr0() + "px"; continue; }
			
			child.style.width = colWidth - 2 * child.style.borderWidth.ToIntOr0() + "px";
			starsWidth -= colWidth;
			colStarsWidth -= col._width;
		}
	}
};

var _html, _head, _body;
//initialize these three objects in onload event
//_html = InitCtrl(document.getElementsByTagName('html')[0]);
//_head = InitCtrl(document.getElementsByTagName('head')[0]);
//_body = InitCtrl(document.getElementsByTagName('body')[0]);
