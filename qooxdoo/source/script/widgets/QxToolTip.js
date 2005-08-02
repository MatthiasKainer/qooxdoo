function QxToolTip(text, icon)
{
  QxPopup.call(this, text, icon);
  
  this._showTimer = new QxTimer(this.getShowInterval());
  this._showTimer.addEventListener("interval", this._onshowtimer, this);
  
  this._hideTimer = new QxTimer(this.getHideInterval());
  this._hideTimer.addEventListener("interval", this._onhidetimer, this);
  
  this.addEventListener("mouseover", this._onmouseover);
  this.addEventListener("mouseout", this._onmouseover);
};

QxToolTip.extend(QxPopup, "QxToolTip");


QxToolTip.addProperty({ name : "hideOnHover", type : Boolean, defaultValue : true });

QxToolTip.addProperty({ name : "mousePointerOffsetLeft", type : Number, defaultValue : 4 });
QxToolTip.addProperty({ name : "mousePointerOffsetTop", type : Number, defaultValue : 22 });
QxToolTip.addProperty({ name : "mousePointerOffsetRight", type : Number, defaultValue : 0 });
QxToolTip.addProperty({ name : "mousePointerOffsetBottom", type : Number, defaultValue : -2 });

QxToolTip.addProperty({ name : "showInterval", type : Number, defaultValue : 1000 });
QxToolTip.addProperty({ name : "hideInterval", type : Number, defaultValue : 4000 });

QxToolTip.addProperty({ name : "axisToleranceX", type : Number, defaultValue : 0.7 });
QxToolTip.addProperty({ name : "axisToleranceY", type : Number, defaultValue : 0.7 });

QxToolTip.addProperty({ name : "boundToWidget" });

proto._toolTipManager = new QxToolTipManager();
proto._minZindex = 1e7;

proto._modifyHideInterval = function(propValue, propOldValue, propName, uniqModIds) 
{
  this._hideTimer.setInterval(nHideInterval);  
  return true;
};

proto._modifyShowInterval = function(propValue, propOldValue, propName, uniqModIds) 
{
  this._showTimer.setInterval(nShowInterval);  
  return true;
};

proto._modifyBoundToWidget = function(propValue, propOldValue, propName, uniqModIds) 
{
  if (propValue)
  {
    this.setParent(propValue.getTopLevelWidget()); 
  }
  else if (propOldValue)
  {
    this.setParent(null); 
  };  
  
  return true;
};

proto._startShowTimer = function()
{
  if(!this._showTimer.getEnabled()) {
    this._showTimer.start();
  };
};

proto._startHideTimer = function()
{
  if(!this._hideTimer.getEnabled()) {
    this._hideTimer.start();    
  };
};

proto._stopShowTimer = function()
{
  if(this._showTimer.getEnabled()) {
    this._showTimer.stop();
  };
};

proto._stopHideTimer = function()
{
  if(this._hideTimer.getEnabled()) {
    this._hideTimer.stop();    
  };
};

proto._modifyVisible = function(propValue, propOldValue, propName, uniqModIds)
{
  if (propValue) 
  {
    this._stopShowTimer();
    this._startHideTimer();
  }
  else
  {
    this._stopHideTimer();
  };
  
  return QxPopup.prototype._modifyVisible.call(this, propValue, propOldValue, propName, uniqModIds);
};

proto._onmouseover = function(e)
{
  if(this.getHideOnHover()) {
    this.setVisible(false);
  };
};

proto._onshowtimer = function(e)
{
  var ex = QxMouseEvent.getPageX();
  var ey = QxMouseEvent.getPageY();
  
  if (ex < (QxDOM.getWindowInnerWidth() * this.getAxisToleranceX())) 
  {
    this.setRight(null);
    this.setLeft(ex + this.getMousePointerOffsetLeft());
  }
  else
  {
    this.setLeft(null);
    this.setRight(QxDOM.getWindowInnerWidth() - ex - this.getMousePointerOffsetRight());
  };
  
  if (ey < (QxDOM.getWindowInnerHeight() * this.getAxisToleranceY())) 
  {
    this.setBottom(null);
    this.setTop(ey + this.getMousePointerOffsetTop());
  }
  else
  {
    this.setTop(null);
    this.setBottom(QxDOM.getWindowInnerHeight() - ey - this.getMousePointerOffsetBottom());
  };  
  
  this.setVisible(true);  
  
  return true;
};

proto._onhidetimer = function(e) {
  return this.setVisible(false);
};

proto.dispose = function()
{
  if(this.getDisposed()) {
    return;
  };
    
  this.removeEventListener("mouseover", this._onmouseover);
  this.removeEventListener("mouseout",  this._onmouseover);

  if (this._showTimer) 
  {  
    this._showTimer.removeEventListener("interval", this._onshowtimer, this);
    this._showTimer.dispose();
    this._showTimer = null;
  };
  
  if (this._hideTimer) 
  {
    this._hideTimer.removeEventListener("interval", this._onhidetimer, this);
    this._hideTimer.dispose();
    this._hideTimer = null;
  };
  
  return QxPopup.prototype.dispose.call(this);
};