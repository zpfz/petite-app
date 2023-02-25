
export function Resizable() {

  function isMouseOnCorner(el,evt) {
    const [w,h] = el.state.box("dimension","border");
    return evt.x > (w - 15) && evt.y > (h - 15);
  }
  
  let xs, ys;     // position of element at the moment mouse down
  let dx, dy;     // deltas (offsets)
  let isResizing = false; // true when inside mouse dragging loop
  
  this.on("mousedown.resizable", evt => { 
    if(!isMouseOnCorner(this,evt)) 
      return false;
    
    let [x,y,w,h] = this.state.box("xywh","border","window", false);
    xs = x;
    ys = y;
    dx = w - evt.x;
    dy = h - evt.y;
    this.state.capture(true);
    isResizing = true;
    Window.this.doEvent("untilMouseUp");
    isResizing = false;
    this.state.capture(false);
    return true; 
  });

  this.on("mousemove.resizable", evt => { 
  
    if(isResizing) {
      let neww = evt.windowX - xs + dx;
      let newh = evt.windowY - ys + dy;
      this.style.width = Length.px(neww);
      this.style.height = Length.px(newh);
      Window.this.update();
      return true;
    }
    else
      this.classList.toggle("mouse-on-corner", isMouseOnCorner(this, evt));
    return false; 
  });
}

Resizable.detached = function() {
   this.off(".resizable");
}

