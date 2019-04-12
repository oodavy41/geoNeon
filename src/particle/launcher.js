import * as THREE from "three";
import particle from "./particle";

export default class launcher extends THREE.Object3D {
  constructor(texture, color, scene, options = {}) {
    super();
    this.texture = texture;
    this.color = color;
    this.scene = scene;
    this.option = {
      start: 400000,
      end: 0,
      delta: 20,
      life: 1000,
      autoPlay: true
    };
    Object.assign(this.option, options);
    this.popQueue = [];
  }

  update() {
    if (!this.last) {
      this.fire();
      this.last = Date.now();
    } else {
      let now = Date.now();
      if (now - this.last > this.option.delta) {
        this.last = now;
        this.fire();
      }
    }
  }
  fire() {
    if (this.popQueue.length === 0 || this.popQueue[0].alive) {
      this.popQueue.push(
        new particle(new THREE.SpriteMaterial({ map: this.texture, color: this.color }), this).aweak(this.scene, this.option)
      );
    } else {
      this.popQueue.push(this.popQueue.shift().aweak(this.scene, this.option));
    }
  }
}
