import * as THREE from "three";
import anime from "animejs";

export default class particle {
  constructor(material, launcher) {
    this.sprite = new THREE.Sprite(material);
    this.anime = null;
    this.alive = false;
    this.launcher = launcher;
  }
  aweak(scene, parent, opt) {
    this.alive = true;
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
    let t = { start: opt.start * 100 };
    this.anime = anime({
      targets: t,
      start: opt.end * 100,
      round: 1,
      easing: "easeOutSine",
      duration: opt.life,
      update: a => {
        let _t = (t.start + 1) / 100;
        this.sprite.scale.set(_t, _t, _t);
      },
      complete: a => {
        this.alive = false;
        scene.remove(this.sprite);
      }
    });

    return this;
  }
}
