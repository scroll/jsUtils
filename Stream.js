//Defines Stream interface
//ServerStream Implements Stream interface to make easy communication with server through Key-Value pairs.

//constructor
function Stream()
{
	this._length = 0;
	this._position = -1;
};

//instance members
//Length - total length of the stream
Stream.prototype.Length = function()
{
	return this._length;
};

//Position - position for the next read
Stream.prototype.Position = function(value)
{
	if(IsUndefined(value)) return this._position;
	this._position = value;
};

//Count - available count for reading/writing == Length - Position
Stream.prototype.Count = function()
{
	return this._length - this._position;
};

Stream.prototype.Close = function()
{
	this.Flush();

	this._length = 0;
	this._position = -1;
};

Stream.prototype.Flush = function()
{
};

Stream.prototype.Read = function()
{
	_position = _length;
	return null;
};

Stream.prototype.Read = function(count)
{
	_position += count;
	return null;
};

Stream.prototype.Write = function(buffer, offset, count)
{
	_length += count;
};
//constructor
MemoryStream.prototype = new Stream();
MemoryStream.prototype.base = Stream.prototype;
function MemoryStream()
{
	this._buffer = new Array();
	this._chunkIndex = 0;
	this._chunkPosition = 0;
	this.base = Stream.prototype;
};

//instance members
MemoryStream.prototype.Close = function()
{	
	delete this._buffer; 
	this._buffer = null;
	this._chunkIndex = 0;
	this._chunkPosition = 0;

	this.base.Flush.call(this);
};

MemoryStream.prototype.Flush = function()
{
};

MemoryStream.prototype.Clear = function()
{
	if(this._length != 0)
	{
		Close();
		this._buffer = new Array();
	}
};

MemoryStream.prototype.ReadNext = function()
{
	if(this._length == 0) return '';
	var ret;
	if(this._chunkPosition == 0)
	{
		ret = this._buffer[this._chunkIndex++];
	}
	else
	{
		ret = this._buffer[this._chunkIndex++].Substring(this._chunkPosition);
		this._chunkPosition = 0;
	}
	this.base.Read.call(this, ret.Length());
	return ret;
};

MemoryStream.prototype.Read = function(count)
{
	if(this._length == 0) return '';
	if(this._chunkIndex == 0 && this._chunkPosition == 0 && _buffer[0].Length() == count) 
	{
		++this._chunkIndex;
		return _buffer[0];
	}
		
	var ret = new String();
	while(this._chunkIndex < this._buffer.Length())
	{
		if(count - ret.Length() >= this._buffer[this._chunkIndex].Length() - this._chunkPosition )
		{
			if(this._chunkPosition == 0)
			{
				ret += this._buffer[this._chunkIndex++];
			}
			else
			{
				ret += this._buffer[this._chunkIndex++].Substring(this._chunkPosition);
				this._chunkPosition = 0;
			}
		}
		else
		{
			var c = count - ret.Length();
			ret += this._buffer[this._chunkIndex].Substring(this._chunkPosition, c);
			this._chunkPosition += c;
		}
		
		if(count == ret.Length())
			break;
	}
	this.base.Read.call(this, ret.Length());
	return ret;
};

MemoryStream.prototype.ReadAll = function()
{
	try
	{
		var ret = this.ToString();
		if(ret.Length() != 0)
		{
			this.base.Read.call(this, ret, 0, ret.Length());
			this._chunkIndex = this._buffer.Length();
			this._chunkPosition = this.buffer[this.buffer.Length()-1].Length();
		}
		this.base.Read.call(this, ret.Length());
		return ret;
	}
	catch(e)
	{
	}
};

MemoryStream.prototype.Write = function(buffer, offset, count)
{
	if(offset == null) offset = 0;
	if(count == null) count = buffer.Length();
	if(offset == 0 && count == buffer.Length())
		this._buffer.Add(buffer);
	else
		this._buffer.Add(buffer.Substring(offset, count));
	this.base.Write.call(this, buffer, offset, count);
};

MemoryStream.prototype.ToString = function()
{
	if(this._buffer.Length() == 0) return '';
	if(this._buffer.Length() == 1 && this._chunkIndex == 0 && this._chunkPosition == 0) return _buffer[0];
		
	var ret = this._buffer[this._chunkIndex].Substring(this._chunkPosition);
	for(var i  = this._chunkIndex + 1; i < this._buffer.Length(); ++i)
		ret += this._buffer[i];
	return ret;
};

//constructor
ServerStream.prototype = new MemoryStream();
ServerStream.prototype.base = MemoryStream.prototype;
//ServerStream.js

//constructor
function ServerStream(url)
{
	this._url = url;
	this.KeyID = null;
	this.KeyValue = null;
	this.base = MemoryStream.prototype;

	if (window.XMLHttpRequest) this._server = new XMLHttpRequest();
	else if (window.ActiveXObject) this._server = new ActiveXObject('Microsoft.XMLHTTP');
};

//instance members
ServerStream.prototype.Close = function()
{
	delete this._server;
	
	this.base.Close.call(this);
};

ServerStream.prototype.Flush = function()
{
	if(this._isWriting == true)
	{
		this._server.open('POST', this._url, false);
		this._server.send(this.base.call.ReadAll(this));
		this.Clear();
	}
};

var _queryID = new Date().getTime();
ServerStream.prototype.Read = function(count)
{
	if(count > this.Count())
	{
		var pass = IsNull(_body) ? "" : _body.a;
		this._server.abort();
		this._server.open('POST', this._url, false);
		this._server.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		this._server.send(String.Format('ID={0}&Pass={1}&Key={2}&Value={3}', _queryID++, pass, this.KeyID, this.KeyValue));
		this.Write(this._server.responseText);
		
		if(count > this.Count())
			return '';
	}
	var ret = this.base.Read.call(this, count);
	if(this.Count() == 0) this.Clean();
	return ret;
};

ServerStream.prototype.ReadAll = function()
{
	if(this._length == 0)
	{
		var pass = IsNull(_body) ? "" : _body.a;
		this._server.abort();
		this._server.open('POST', this._url, false);
		this._server.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		this._server.send(String.Format('ID={0}&Pass={1}&Key={2}&Value={3}', _queryID++, pass, this.KeyID, this.KeyValue));
		
		return this._server.responseText;
	}
	
	var ret = this.base.ReadAll.call(this);
	this.Clean();
	return ret;
};


/* example of using ServerStream
//java script _server object initialization
var _server = new ServerStream("Default.aspx");

//aspx server side code that listens for Key=="FILE" and sends to client the requested file.
protected override void Render(HtmlTextWriter writer)
{			
	Directory.SetCurrentDirectory(HttpContext.Current.Server.MapPath("~/"));

	var key = Request.Form["Key"];
	if(key == "FILE")
	{
		var value = Request["Value"];
		value = File.ReadAllText(value);
		writer.Write(value);
	}
	else
	{
		base.Render(writer);
	}
}
*/