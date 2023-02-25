

class MutationObserver {
   constructor(callback) {}
   observe(target, options) {}
   disconnect() {}
   takeRecords() { return []; }
}


// primitive version of ResizeObserver, supports only single element per instance
class ResizeObserver {
   #callback;
   #element;
   constructor(callback) { 
      console.assert(typeof callback == "function");
      this.#callback = callback; 
   }

   observe(element) {
      this.#element = element;
      element.onsizechange = () => { element.timer(20ms,() => this.notify()); };
   }

   unobserve(element) {
     if(this.#element === element) {
       element.onsizechange = null;
       this.#element = null;
     }
   }

   disconnect() {
      this.unobserve(this.#element);
   }

   notify() {
      let [x,y,width,height] = this.#element.state.box("xywh","inner");
      this.#callback([{contentRect:{x,y,width,height}}]);
   }

}