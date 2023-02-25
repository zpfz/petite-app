

function isHorzFrameset(el) { return el.tag == "frameset" && el.attributes.getNamedItem("cols"); }
function isVertFrameset(el) { return el.tag == "frameset" && el.attributes.getNamedItem("rows"); }


export class DockCaption extends Element {

  ["on mousedragrequest"](evt) {
    let dockable = this.$p(".dockable");
    //if(dockable.isWindowed) return false;
    let [x,y,width,height] = dockable.state.box("xywh","inner","screen",true);
    dockable.style.set({
        width: Length.px(width / devicePixelRatio),
        height: Length.px(height / devicePixelRatio),
    });
    dockable.takeOff({x,y,window:"detached", relativeTo:"screen"});
    this.$p(".dock").doDrag(dockable,evt.x * devicePixelRatio,evt.y * devicePixelRatio);
    return true;
  }
}

export class Dock extends Element {

  dropLocation = 0;
  targetDockable = null; // target dockable

  mx = 0; my = 0; mw = 0; mh = 0;

  doDrag(dockable, xOff, yOff) {

      const me = this;

      function onmousemove(evt) {

        const x = evt.screenX - xOff;
        const y = evt.screenY - yOff;

        this.takeOff({ x, y, relativeTo: "screen", window: "detached" });

        me.handleDrag(evt);
        return true;
      }

      let list = this.$("popup.windowed");
      list.append(dockable);
      dockable.isWindowed = true;
      dockable.classList.toggle("window",true);

      dockable.on("mousemove",onmousemove);
      dockable.state.capture("strict");

      Window.this.doEvent("untilMouseUp");

      dockable.state.capture(false);
      dockable.off(onmousemove);

      this.dragEnded(dockable); 
  }

  dragEnded(dockable)
  {
    if(!this.dropLocation) { 
      dockable.classList.add("detached");
      return this.setupWindowed;
    }

    let target,before,after;

    if(this.targetDockable.tag == "frameset") {
      target = this.targetDockable; 
      if(this.dropLocation == 8 || this.dropLocation == 4)
        before = target.firstElementChild;
      else 
        after = target.lastElementChild;
    }
    else if(this.targetDockable.parentElement.tag == "frameset"){
       target = this.targetDockable.parentElement;
      if(this.dropLocation == 8 || this.dropLocation == 4)
        before = this.targetDockable;
      else 
        after = this.targetDockable;
    } else {
      // convert non-frameset target to frameset
      console.log("ddd");
    }

    //console.log(target,before,after);

    if(after)
      target.insertAfter(dockable,after);
    else if(before)
      target.insertBefore(dockable,before);

    dockable.classList.remove("detached","window");
    dockable.takeOff();

    this.dropLocation = 0;
    this.targetDockable = null; // target dockable
  }

  handleDrag(evt) {
    const {clientX,clientY} = evt;
    const elementUnder = document.elementFromPoint(clientX,clientY);
    let location = 0;
    let dockable;
    if(elementUnder) {
      dockable = elementUnder.$p(".dockable");
      if( dockable ) {
        let [x1,y1,x2,y2] = dockable.state.box("rect","padding","document");
        let w3 = (x2 - x1) / 3;
        let h3 = (y2 - y1) / 3;
        
        if( clientX < x1 + w3 ) location = 1;
        else if( clientX > x2 - w3 ) location = 3;
        else location = 2;

        if( clientY < (y1 + h3) ) location += 6;
        else if( clientY < (y2 - h3) ) location += 3;

        //console.log(clientX,clientY,x1,y1,x2,y2);
        //console.log(location);
        switch(location) {
          case 2: this.mx = x1; this.my = y2 - h3; this.mw = x2 - x1; this.mh = h3; break;
          case 4: this.mx = x1; this.my = y1; this.mw = w3; this.mh = x2 - x1; break;
          case 6: this.mx = x2 - w3; this.my = y1; this.mw = w3; this.mh = y2 - y1; break;
          case 8: this.mx = x1; this.my = y1; this.mw = x2 - x1; this.mh = h3; break;
          default: location = 0; break;
        }
      }
    }

    if(this.dropLocation != location) {
      this.dropLocation = location;
      this.requestPaint();
    }

    this.targetDockable = location ? dockable : null;
  }

  paintForeground(gfx) {
    if( this.dropLocation )  {
      gfx.fillStyle = Color.RGB(0,128,255,128);
      gfx.fillRect(this.mx,this.my,this.mw,this.mh);
    }
  }

}

export function DockableWindow() {
   /*this.on("mousedragrequest.dockablewindow",".dockable caption", function(evt,caption) {
      let dockable = caption.$p(".dockable");
      if(!dockable.isWindowed) return false;
      this.$p(".dock").doDrag(dockable,evt.x * devicePixelRatio,evt.y * devicePixelRatio);
      return true;
   });*/
}

DockableWindow.detached = function() {
  //this.off(".dockablewindow")
};