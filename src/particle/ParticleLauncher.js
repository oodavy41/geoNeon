import * as THREE from "three";
import particle from "./particle";
import "../settings";

let SET = global.Sets;

export default class particleLauncher extends THREE.Object3D {
  constructor(texture, color, parent, scene, options = {}) {
    super();
    this.sealineInfo = parent.sealineInfo;
    this.texture = texture;
    this.color = color;
    this.parent = parent;
    this.scene = scene;
    this.option = {
      start: SET.boatSize * SET.particleScale,
      end: 0.0000001,
      delta: SET.particleFireTime,
      life: SET.particleLife,
      autoPlay: true,
    };
    Object.assign(this.option, options);
    this.last = null;
    this.popQueue = [];
  }

  update(t) {
    if (!this.last) {
      this.fire();
      this.last = t;
    } else {
      let now = t;
      let delta = now - this.last;
      this.last = now;
      if (this.option.delta && delta > this.option.delta) {
        this.fire();
      }
      this.popQueue.forEach((p) => p.alive && p.update(t));
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
            opacity: SET.particleOpacity,
          }),
          this,
          this.parent
        ).aweak(this.scene, this.parent, this.option)
      );
    } else {
      this.popQueue.push(
        this.popQueue.shift().aweak(this.scene, this.parent, this.option)
      );
    }
  }
}
