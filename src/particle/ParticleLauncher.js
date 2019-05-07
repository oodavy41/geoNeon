import * as THREE from "three";
import particle from "./particle";
import "../settings";

let SET = global.Sets;

export default class particleLauncher extends THREE.Object3D {
  constructor(texture, color, parent, scene, options = {}) {
    super();
    this.layers = parent.layers;
    this.texture = texture;
    this.color = color;
    this.parent = parent;
    this.scene = scene;
    this.option = {
      start: SET.boatSize * SET.particleScale,
      end: 0,
      delta: SET.particleFireTime,
      life: SET.particleLife,
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
        new particle(
          new THREE.SpriteMaterial({
            map: this.texture,
            color: this.color,
            transparent: true,
            opacity: SET.particleOpacity
          }),
          this,
          this.parent
        ).aweak(this.scene, this.parent, this.option)
      );
    } else {
      this.popQueue.push(this.popQueue.shift().aweak(this.scene, this.parent, this.option));
    }
  }
}
