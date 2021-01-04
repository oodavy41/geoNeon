import * as THREE from "three";

export default class particle {
  constructor(material, launcher) {
    this.sprite = new THREE.Sprite(material);
    this.alive = false;
    this.birth = 0;
    this.launcher = launcher;
    this.opt = null;
    this.scene = null;
    this.lastT = 0;
  }
  update(t) {
    if (this.alive) {
      if (this.birth === 0) this.birth = t;
      if (t - this.birth < this.opt.life) {
        let percent = (t - this.birth) / this.opt.life;
        let _t =
          this.opt.end +
          (this.opt.start - this.opt.end) * (1 - Math.min(percent, 1));
        this.sprite.scale.set(_t, _t, _t);
      } else {
        this.alive = false;
        this.scene.remove(this.sprite);
      }
    }
    this.lastT = t;
  }

  unmount() {}
  aweak(scene, parent, opt) {
    this.scene = scene;
    this.opt = opt;
    this.alive = true;
    this.birth = 0;
    let pos = new THREE.Vector3();
    this.launcher.getWorldPosition(pos);
    let rad = Math.random() * Math.PI;
    let dx = Math.cos(rad) * opt.start * 0.05;
    let dy = Math.sin(rad) * opt.start * 0.05;
    pos.x += dx;
    pos.y += dy;
    this.sprite.position.copy(pos);
    scene.add(this.sprite);
    this.sprite.layers = parent.layers;
    return this;
  }
}
