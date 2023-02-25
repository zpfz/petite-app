

import { Chart as ChartJS, registerables } from 'chartjs/chart.esm.js';
         ChartJS.register(...registerables);

// local redifinition: we do not need canvas.style.height / width redefines;
function retinaScale(chart, forceRatio, forceStyle) {
  const pixelRatio = forceRatio || 1;
  const deviceHeight = Math.floor(chart.height * pixelRatio);
  const deviceWidth = Math.floor(chart.width * pixelRatio);
  chart.height = deviceHeight / pixelRatio;
  chart.width = deviceWidth / pixelRatio;
  const canvas = chart.canvas;
  /*AF: if (canvas.style && (forceStyle || (!canvas.style.height && !canvas.style.width))) {
    canvas.style.height = `${chart.height}px`;
    canvas.style.width = `${chart.width}px`;
  }*/
  if (chart.currentDevicePixelRatio !== pixelRatio
      || canvas.height !== deviceHeight
      || canvas.width !== deviceWidth) {
    chart.currentDevicePixelRatio = pixelRatio;
    canvas.height = deviceHeight;
    canvas.width = deviceWidth;
    chart.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    return true;
  }
  return false;
}

function doResize(width,height) { 
  // this == chart
  const options = this.options;
  const canvas = this.canvas;
  const aspectRatio = options.maintainAspectRatio && this.aspectRatio;
  const newSize = this.platform.getMaximumSize(canvas, width, height, aspectRatio);
  const newRatio = options.devicePixelRatio || this.platform.getDevicePixelRatio();
  const mode = this.width ? 'resize' : 'attach';
  this.width = newSize.width;
  this.height = newSize.height;
  this._aspectRatio = this.aspectRatio;
  if (!retinaScale(this, newRatio, false)) {
     return;
  }
  this.notifyPlugins('resize', {size: newSize});
  if (this.attached) {
     if (this._doResize(mode))
       this.render();
  }
}

export class Chart extends Element {

  chartjs = null;
  config = {};

  this(props,kids) {
    if(props.config) {
      this.config = this.#setupConfig(props.config);
      if(this.chartjs)
        this.chartjs.update("none"); // update the chart but without animations
    }
  }

  render() {
    return <canvas.chart />;
  }

  componentDidMount() {
     this.chartjs = new ChartJS(this,this.config);
     this.chartjs._resize = doResize;
     this.post(this.onsizechange);
  }
  componentWillUnmount() {
     this.chartjs.destroy();
     this.chartjs = null;
  }

  onsizechange() {
    if(this.chartjs) {
      let [w,h] = this.state.box("dimension");
      this.chartjs.resize(w,h);
    }
  }

  #setupConfig(c) {
    c = c || {};
    c.options = c.options || {};
    c.options.responsive = false;
    c.options.maintainAspectRatio = false;
    return c;
  }

} 