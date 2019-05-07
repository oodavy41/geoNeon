import * as THREE from "three";
import anime from "animejs";
import "../settings";

export default class lineParticle extends THREE.Line {
  constructor(start, end, mat, scene, parent) {
    let line = new THREE.Geometry();
    let v1 = new THREE.Vector3().copy(start),
      v2 = new THREE.Vector3().copy(end);

    line.vertices.push(v1, v2);
    super(line, mat);
    this.layers = parent.layers;
    let target = { opacity: 100 };
    this.anime = anime({
      targets: target,
      opacity: 0,
      round: 1,
      easing: "linear",
      duration: global.Sets.particleLife,
      update: a => {
        this.material.opacity = target.opacity / 100;
      },
      complete: a => {
        scene.remove(this);
        delete this;
      }
    });
  }
}
