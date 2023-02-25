

function isHorzFrameset(el) { return el?.isSplitSet === "cols"; }
function isVertFrameset(el) { return el?.isSplitSet === "rows"; }
function isTabsFrameset(el) { return el?.isTabSet; }

const MARKER_SIZE = 36;
const MARKER_SIZE2 = MARKER_SIZE / 2;      
const MARKER_LEFT   = new Graphics.Path("m 0 0 V 32 H 32 V 0 Z m 10 1 V 31 H 31 V 1 Z");
const MARKER_RIGHT  = new Graphics.Path("m 0 0 V 32 H 32 V 0 Z m 1 1 V 31 H 22 V 1 Z");
const MARKER_TOP    = new Graphics.Path("m 0 0 V 32 H 32 V 0 Z m 1 10 V 31 H 31 V 10 Z");
const MARKER_BOTTOM = new Graphics.Path("m 0 0 V 32 H 32 V 0 Z m 1 1 V 22 H 31 V 1 Z");
const MARKER_MIDDLE = new Graphics.Path("m 0 0 V 32 H 32 V 0 Z m 1 7 V 31 H 31 V 7 Z M 16 1 V 6 H 31 V 1 Z");

const WINDOW_WIDTH = 300;
const WINDOW_HEIGHT = 300;

const MARKER_COLOR_HOVER = Color.RGB(255,129,0);
const MARKER_COLOR = Color.RGB(0,129,255);

function createHatchBrush() {
  const bitmap = new Graphics.Image(Length.ppx(8),Length.ppx(8),((ctx) => {
    ctx.fillStyle = MARKER_COLOR;
    ctx.fillRect(0,0,8,1);
    ctx.fillRect(0,0,1,8);
  }));
  //Clipboard.write({image:bitmap});
  return Graphics.Brush.createTile(bitmap);
}

const HATCH_BRUSH = createHatchBrush();

export class Dock extends Element {

  dropLocation = null;
  targetDockable = null; // target dockable

  constructor(props,kids) {
    super();
    this.props = props;
    this.kids = kids;
    globalThis.showWidget = cls => this.showWidget(cls);
  }

  showWidget(widgetClass) {
    // show widget as a window in the middle of the window
    const [w,h] = this.state.box("dimension");
    const x = (w - WINDOW_WIDTH) / 2;
    const y = (h - WINDOW_HEIGHT) / 2;
    //console.log("widgetClass",widgetClass);
    let dockable = <DockPanel.window.detached widgetType={widgetClass}/>;
    let list = this.$("popup.windowed");
    list.append(dockable);
    dockable = list.lastElementChild;
    //console.log("dockable.lastElementChild",dockable.lastElementChild);

    dockable.style.set({width:Length.px(WINDOW_WIDTH),height:Length.px(WINDOW_HEIGHT)});
    dockable.takeOff({x,y, window:"detached", relativeTo:"window"});

    // notify observers:
    widgetClass.shown = true;
    Window.post(new Event("widget-show"));
  }

  onDragStart(dockable) {
    dockable.on("move",evt => this.handleDrag(evt));
    dockable.classList.add("dragging");    
    this.paintForeground = this.paintMarkers;
  }

  onDragEnd(dockable) {
    dockable.off("move");
    dockable.classList.remove("dragging");    
    this.paintForeground = null;
    this.dragEnded(dockable); 
    this.dropLocation = null;
    this.targetDockable = null;
      }

  takeOffDockable(dockable) {
      let parent = dockable.parentElement;

      let [x,y,w,h] = dockable.state.box("xywh","inner","screen",true);

      let list = this.$("popup.windowed");
      list.append(dockable);
      dockable.classList.add("window","dragging");

      //console.log("DD", dockable, dockable instanceof DockPanel);

      if(parent !== this && parent.tag == "frameset" && parent.childElementCount == 1) {

        //setup default dimensions of element that will be reparented
        if(isHorzFrameset(parent.parentElement)) {
          const w = parent.firstElementChild.state.box("width");
          parent.firstElementChild.style.set({
            width: Length.px(w),
            height: Length.fx(1) 
          });
        }
        else if(isVertFrameset(parent.parentElement)) {
          const h = parent.firstElementChild.state.box("height");
          parent.firstElementChild.style.set({
            height: Length.px(h),
            width: Length.fx(1) 
          });
        }
        // remove <frameset> that has just one child
        parent.unwrapElement();
      }

      dockable.takeOff({x,y,window:"detached", relativeTo:"screen"});
      //console.log("BEFORE beginMoveDrag");
      dockable.window.performMove(); // 
      //console.log("AFTER beginMoveDrag");
  }

  dragEnded(dockable)
  {

    if(!this.dropLocation) { 
      dockable.classList.remove("dragging");
      dockable.classList.add("detached");
      //console.log("DDD end", dockable, dockable.style["opacity"]);
      dockable.requestPaint();
      return; //this.setupWindowed;
    }

    //console.assert(dockable instanceof DockPanel,"must be DockPanel");    
    //console.log("DDD", this.targetDockable, this.targetDockable.parentElement, this.dropLocation);

    let target,before,after;

    const createSubFrame = (rowscols) => {
      // target ...
      //console.log(target,dockable,this.targetDockable);
      //const atts = { [rowscols]: "" };
      const subFrame = Element.create(<DockSplitSet type={rowscols} />);

      this.targetDockable.parentElement.insertBefore(subFrame,this.targetDockable);
      subFrame.insertBefore(this.targetDockable);

      target = subFrame;

      // set that initial frame to span whole frameset
      this.targetDockable.style.set({
        width:Length.fx(1), 
        height:Length.fx(1)
      });
        
      return this.targetDockable;
    
    };

    if( this.dropLocation == "L" ) {
       this.targetDockable = this.targetDockable.$p("frameset");
       before = createSubFrame("cols");
       this.dropLocation = "l"; 
    } 
    else if( this.dropLocation == "R" ) {
       this.targetDockable = this.targetDockable.$p("frameset");
       after = createSubFrame("cols");
       this.dropLocation = "r";
    } 
    else if( this.dropLocation == "T" ) {
       this.targetDockable = this.targetDockable.$p("frameset");
       before = createSubFrame("rows");
       this.dropLocation = "t"; 
    } 
    else if( this.dropLocation == "B" ) {
       this.targetDockable = this.targetDockable.$p("frameset");
       after = createSubFrame("rows");
       this.dropLocation = "t"; 
    } 
    else if( this.dropLocation == "m" ) {
      DockTabSet.convert(this.targetDockable).appendTab(dockable);
    }
    else if(isHorzFrameset(this.targetDockable.parentElement)) {
      target = this.targetDockable.parentElement;
      if(this.dropLocation == "t")
        before = createSubFrame("rows");
      else if(this.dropLocation == "b")
        after = createSubFrame("rows");
      else if(this.dropLocation == "l")
        before = this.targetDockable;
      else if(this.dropLocation == "r")
        after = this.targetDockable;
    }
    else if(isVertFrameset(this.targetDockable.parentElement)) {
      target = this.targetDockable.parentElement;
      if(this.dropLocation == "l")
        before = createSubFrame("cols");
      else if(this.dropLocation == "r")
        after = createSubFrame("cols");
      else if(this.dropLocation == "t")
        before = this.targetDockable;
      else if(this.dropLocation == "b")
        after = this.targetDockable;
    }

    else {
      target = this.targetDockable.parentElement;
      if(this.dropLocation == "l")
        before = createSubFrame("cols");
      else if(this.dropLocation == "r")
        after = createSubFrame("cols");
      else if(this.dropLocation == "t")
        before = createSubFrame("rows");
      else if(this.dropLocation == "b")
        after = createSubFrame("rows");
    }

    //console.log(target,before,after);

    if(after)
      target.insertAfter(dockable,after);
    else if(before)
      target.insertBefore(dockable,before);

    dockable.style.removeProperties();
    dockable.classList.remove("detached","window");
    dockable.takeOff();

    this.markers = null;
    this.requestPaint();
    this.notifyStateChange();
  }

  notifyStateChange() {
    this.postEvent(new Event("statechange",{bubbles:true}));
  }

  generateMarkers(elementUnder) {

    let dockable = elementUnder.$p(".dockable,.dockable-content");

    let markers;

    if(dockable) {

      let [x1,y1,x2,y2] = dockable.state.box("rect","padding",this);
      let xc = (x2 + x1) / 2 , yc = (y2 + y1) / 2;
      
      markers = {
        t: [xc - MARKER_SIZE2, yc - MARKER_SIZE2 - 4 - MARKER_SIZE],
        l: [xc - MARKER_SIZE2 - 4 - MARKER_SIZE, yc - MARKER_SIZE2],
        r: [xc + MARKER_SIZE2 + 4, yc - MARKER_SIZE2],
        b: [xc - MARKER_SIZE2, yc + MARKER_SIZE2 + 4],
        ltrb: [x1,y1,x2,y2],
      };

      if(!dockable.$is(".dockable-content"))
        markers["m"] = [xc - MARKER_SIZE2, yc - MARKER_SIZE2];

    } else {
      dockable = elementUnder.$p("frameset");
      markers = {};
    }

    let parentFrameSet = elementUnder.$p("frameset");
    if(isHorzFrameset(parentFrameSet)) {
      let [x1,y1,x2,y2] = parentFrameSet.state.box("rect","padding",this);
      markers["T"] = [ (x1 + x2) / 2 - MARKER_SIZE2, y1 ];
      markers["B"] = [ (x1 + x2) / 2 - MARKER_SIZE2, y2 - MARKER_SIZE];
      markers["TB"] = [ x1,y1,x2,y2 ];
    }
    if(isVertFrameset(parentFrameSet)) {
      let [x1,y1,x2,y2] = parentFrameSet.state.box("rect","padding",this);
      markers["L"] = [ x1, (y1 + y2) / 2 - MARKER_SIZE2 ];
      markers["R"] = [ x2 - MARKER_SIZE, (y1 + y2) / 2 - MARKER_SIZE2];
      markers["LR"] = [ x1,y1,x2,y2 ];
    }
    this.markers = markers;
    return dockable;
  }

  handleDrag(evt) {

    let {cursorClientX,cursorClientY} = evt.data;

    //console.log("DRAG", cursorClientX,cursorClientY);

    const [docx,docy] = this.state.box("position","inner","document");
    cursorClientX -= docx; cursorClientY -= docy;
    const elementUnder = this.elementFromPoint(cursorClientX,cursorClientY);
    let location;
    if(elementUnder) {
        this.targetDockable = this.generateMarkers(elementUnder);
        for( const [loc,origin] of Object.entries(this.markers)) {
          const [x,y] = origin;
          if( cursorClientX > x && cursorClientX < (x + MARKER_SIZE) && 
              cursorClientY > y && cursorClientY < (y + MARKER_SIZE) ) {
            location = loc;
            break;
          }
        } 
      //}
    }

    if(this.dropLocation != location) {
      //console.log(location,dockable,elementUnder);
      this.dropLocation = location;
    }
    this.requestPaint();
  }

  paintMarkers(gfx) {
    if( !this.markers ) return;  
    
    function rectTargetArea(rect,location) {
      const w = rect[2] - rect[0];
      const h = rect[3] - rect[1];
      switch(location) {
        case "B": case "b":  return [rect[0],rect[3]-h/4,rect[2],rect[3]];
        case "L": case "l":  return [rect[0],rect[1], rect[0]+w/4,rect[3]];
        case "R": case "r":  return [rect[2]-w/4, rect[1], rect[2],rect[3]];
        case "T": case "t":  return [rect[0],rect[1],rect[2],rect[1]+h/4];
        case "m": return [rect[0],rect[1],rect[2],rect[3]];
      }
    }
  
    for( const [location,origin] of Object.entries(this.markers)) {

      if(location.length > 1) continue; // "ltrb","TB", "LR"

      gfx.fillStyle = Color.RGB(255,255,255);
      gfx.fillRect(origin[0],origin[1],MARKER_SIZE,MARKER_SIZE);
      
      const x = origin[0] + 2,y = origin[1] + 2;
      gfx.fillStyle = this.dropLocation == location? MARKER_COLOR_HOVER: MARKER_COLOR;

      let targetArea;

      switch(location) {
        case "B":   targetArea = this.markers["TB"];   gfx.draw(MARKER_BOTTOM, {x,y}); break;
        case "b":   targetArea = this.markers["ltrb"]; gfx.draw(MARKER_BOTTOM, {x,y}); break;
        case "L":   targetArea = this.markers["LR"];   gfx.draw(MARKER_LEFT, {x,y}); break;
        case "l" :  targetArea = this.markers["ltrb"]; gfx.draw(MARKER_LEFT, {x,y}); break;
        case "R":   targetArea = this.markers["LR"];   gfx.draw(MARKER_RIGHT, {x,y}); break;
        case "r":   targetArea = this.markers["ltrb"]; gfx.draw(MARKER_RIGHT, {x,y}); break;
        case "T":   targetArea = this.markers["TB"];   gfx.draw(MARKER_TOP, {x,y}); break;
        case "t":   targetArea = this.markers["ltrb"]; gfx.draw(MARKER_TOP, {x,y}); break;
        case "m" :  targetArea = this.markers["ltrb"]; gfx.draw(MARKER_MIDDLE, {x,y}); break;
      }

      if(targetArea && (this.dropLocation == location)) {
        gfx.fillStyle = HATCH_BRUSH;
        const rc = rectTargetArea(targetArea,location);
        gfx.fillRect(rc[0],rc[1],rc[2] - rc[0],rc[3] - rc[1]);
      }
    }
  }

  render() {
    return <main class="dock" id="dock" styleset={`${__DIR__}docks.css#dock`} {...this.props}>
      {this.kids}
      <popup class="windowed" />
    </main>;
  }

  resetLayout() {
    for(let widget of Registry) widget.shown = false;
    // eslint-disable-next-line react/jsx-key
    this.componentUpdate({kids:[<Content/>]});
  }

  ["on do-close-panel"](evt) {
    const dockable = evt.target;
    const widgetClass = dockable.classOf;
    widgetClass.shown = false;
    Window.post(new Event("widget-close"));
    dockable.remove();
  }


  store(data) {
    let list = [];
    for(let child of this.children)
      if(child.tag != "popup")
        list.push(child.persist());
    data.docks = list;
    //console.log(list);
  }

  restore(data) {
    if(data.docks)
      this.componentUpdate({kids: constructKids(data.docks) });
  }

  ["on statechange"]() {
    // request state saving
    Settings.saveState();
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

export class DockCaption extends Element {

  #text = "";

  this(props) {
    if(props.data) {
       const widgetClassName = props.data;
       const widgetClass = RegistryClassById(widgetClassName);
       this.#text = widgetClass.className;
       this.contentElement = Element.create(JSX(widgetClass,{},[]));
    } else 
    this.#text = props.text;
  }

  render() {
    return <caption><text>{this.#text}</text><b class="close"/></caption>;
  }

  getDockTabs() {
    const parent = this.parentElement;
    return parent.tag == "header" &&
           parent.parentElement instanceof DockTabSet ? parent.parentElement : null;
  }

  ["on mousedragrequest"](evt) {

    const dock = this.$p(".dock");

    const dockTabs = this.getDockTabs();

    let dockable = dockTabs ? dockTabs.takeoffTab(this)
                            : this.$p(".dockable");

    if(dockable.isWindowed)
      return false;

    let [x,y,width,height] = dockable.state.box("xywh","inner","screen",true);

    dockable.style.set({
        width: Length.px(width / devicePixelRatio),
        height: Length.px(height / devicePixelRatio),
    });
    //dock.doDrag(dockable,x, y, evt.x * devicePixelRatio,evt.y * devicePixelRatio);
    dock.takeOffDockable(dockable);
    return true;
  }

}

class DockContent extends Element {

  this(props,kids) {
    this.props = props;
    this.kids = kids;
  }

  render() {
    return <div class="content" {...this.props}>{this.kids}</div>;
  }
  
}

export class DockPanel extends Element {

  props = {};
  kids = [];
  caption = "{unnamed}";
  type = null;

  this(props,kids) {
    let {widgetType,caption,class:cls,...rest} = props;
    // note: removing class attribute deliberately
    this.type = widgetType || DockContent; // should be JS class
    this.caption = caption || this.type.className;
    this.props = rest;
    this.kids = kids;
  }
  
  get classOf() { // class of content controller
    return Object.getPrototypeOf(this.lastElementChild).constructor;
  }

  get contentElement() {
    return this.lastElementChild;
  }

  get isWindowed() {
    return this.classList.contains("window");
  }

  /*componentWillUnmount() {
    throw new Error("DockPanel!");
  }*/

  render() {
    if(this.props._empty)
      return <widget class="dockable" />;
    return <widget class="dockable">
        <DockCaption text={this.caption}  />
        { this.type && JSX(this.type,this.props,this.kids) }
      </widget>;
  }

  ["on mousehittest"](evt) {
    if( !this.isWindowed )
      return false;
    if( evt.target.$is("caption>text"))
      evt.data = "caption"; // HTCAPTION
    else 
      evt.data = "auto"; // borders and HTCLIENT
    return true;
  }

  ["on replacementstart"](evt) {
    const mode = evt.data;
    if(mode == "move") {
      this.classList.add("dragging");
      const dock = this.$p(".dock");
      dock.onDragStart(this,evt);
    }
  }
  ["on replacementend"](evt) {
    const mode = evt.data;
    if(mode == "move") {
      this.classList.remove("dragging");
      const dock = this.$p(".dock");
      dock.onDragEnd(this);
    }
  }

  ["on click at b.close"]() {
    this.post(new Event("do-close-panel",{bubbles:true}));
    return true;
  }

  persist() {
    return { 
      kind: "DockPanel",
      type : this.classOf.classId 
    };
  }

}

export class DockTabSet extends Element {

  captions = [];
  data = null; // restoration data 

  this(props,kids) {
    this.data = props.data;
  }

  render() {
    //console.log("render",this);
    let tabs = [];
    if(this.data)
       // eslint-disable-next-line react/jsx-key
       tabs = this.data.children.map(childData => <DockCaption data={childData}/> );
    return <frameset class="dockable" tabs><header>{tabs}</header></frameset>;
  }

  get isTabSet() { return true; }

  get captionBar() { return this.firstElementChild; }
  get contentElement() { return this.lastElementChild; }

  componentDidMount() {
    if(this.data) { // component mounted after state restoration
      const activeIdx = this.data.active || 0;
      this.data = null;
      const activeTab = this.captionBar.children[activeIdx];
      this.switchTab(activeTab,true);
    }
  }

  notifyStateChange() {
    this.postEvent(new Event("statechange",{bubbles:true}));
  }

  appendTab(dockable) {
    let caption = dockable.$(">caption"); 
    console.assert(dockable instanceof DockPanel,"must be DockPanel");
    console.assert(caption,"caption");
    this.captions.push(caption);
    caption.contentElement = dockable.contentElement;
    console.assert(caption.contentElement,"content");
    this.captionBar.append(caption);
    this.contentElement.detach();
    this.append(dockable.contentElement);
    caption.value = true; // set it as current
    this.notifyStateChange();
  }

  initTab(dockable/*Panel*/) {
    let caption = dockable.$(">caption");
    //console.assert(dockable instanceof DockPanel,"must be DockPanel");
    if(!(dockable instanceof DockPanel))
      console.log("dockable", dockable);
    console.assert(caption,"caption");
    caption.contentElement = dockable.contentElement;
    console.assert(caption.contentElement,"content");
    this.captionBar.append(caption);
    this.captions = [caption];
    this.notifyStateChange();
  }

  switchTab(caption, init) {
    if(!init) {
      //console.log("switchTab");
    this.contentElement.detach();
      this.notifyStateChange();
    }
    this.append(caption.contentElement);
    caption.value = true; // set it as current
  }

  takeoffTab(caption) {
    const dock = caption.$p(".dock");
    const [w,h] = this.state.box("dimension","inner");
    
    const header = this.$(">header");
    if(header.childElementCount > 2) {
      if(caption.nextElementSibling)
        this.switchTab(caption.nextElementSibling);
      else
        this.switchTab(caption.previousElementSibling);
    }

    function createDockable(caption) {
      const dockable = Element.create(<DockPanel _empty={true} />); //Element.create(<widget.dockable/>);
      dockable.append(caption);
      dockable.append(caption.contentElement);
      dock.append(dockable);
      dockable.style.set({width:Length.px(w),height:Length.px(h)});
      return dockable;
    }  

    const dockable = createDockable(caption);

    if(header.childElementCount == 1) { // only one left
       const last = createDockable(header.firstElementChild);
       this.parentElement.insertBefore(last,this);
       this.remove();
    }
    this.notifyStateChange();
    return dockable;
  }
  

  ["on click at >header>caption"](evt,caption) {
    this.switchTab(caption);
    return true; // consume the event
  }

  static convert(element) {

    //console.log("convert",element, element.constructor.name);

    if(element instanceof DockTabSet) return element;
    
    console.assert(element instanceof DockPanel);

    const caption = element.caption; 

    const subFrame = Element.create(<DockTabSet />);

    element.parentElement.insertBefore(subFrame,element);
    subFrame.append(element);

    subFrame.initTab(element);

    return subFrame;
  }

  persist() {
    let children = [];
    for(const caption of this.captionBar.children) {
      const widgetClass = Object.getPrototypeOf(caption.contentElement).constructor;
      children.push(widgetClass.classId);
    }
    return { 
      kind: "DockTabSet",
      type: this.type,
      active: this.captionBar.$(":checked").elementIndex,
      children
    };
  }
}

function constructKids(defs) {
  return defs.map( def => {
    switch( def.kind ) {
      case "DockPanel": return <DockPanel data={def} />;
      case "DockTabSet": return <DockTabSet data={def} />;
      case "DockSplitSet": return <DockSplitSet data={def} />;
      case "Content": return <Content data={def} />;
    }
  });
  
}

class DockSplitSet extends Element {
  atts = {};

  this(props,kids) {
    if( props.data ) {
      this.type = props.data.type;
      this.atts = {[this.type]:props.data.sizes};
      this.kids = constructKids(props.data.children);
    } else {
    let def = [];
    let flexes = 0;
    for(const kid of kids) {
      const tag = Reactor.tagOf(kid);
        if( tag === DockPanel || tag == DockTabSet || tag == DockGroup )
        def.push("200px");
      else {
        def.push("*");
        ++flexes;
      }
    }
    if(!flexes) def[def.length / 2] = "*";
      let cr = def.join(",");
      this.type = props.type;
      this.atts = { [this.type]:cr };
      this.kids = kids;
    }
  }

  get isSplitSet() { return this.type; }

  render() {
    return <frameset {...this.atts}>{this.kids}</frameset>;
  }

  persist() {
    let children = [];
    for(const child of this.children)
      children.push(child.persist());

    return { 
      kind: "DockSplitSet",
      type: this.type,
      sizes: this.frameset.state.join(","),
      children
    };
  }

}

export function DockGroup(props,kids) {
  switch(props.type) {
    case "cols": return <DockSplitSet type="cols">{kids}</DockSplitSet>;
    case "rows": return <DockSplitSet type="rows">{kids}</DockSplitSet>;
    case "tabs": return <DockTabSet>{kids}</DockTabSet>;
  }
}

