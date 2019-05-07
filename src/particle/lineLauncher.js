import * as THREE from "three";
import lineParticle from "./lineParticle";
import "../settings";

export default class lineLauncher extends THREE.Object3D {
  constructor(color, scene, parent) {
    super();
    this.layers = parent.layers;
    this.color = color;
    this.scene = scene;
    this.last = null;
    this.now = new THREE.Vector3();
  }

  update() {
    this.getWorldPosition(this.now);

    if (this.last) {
      if (this.last.distanceTo(this.now) < global.Sets.earthS / 30) {
        let l = new lineParticle(
          this.now,
          this.last,
          new THREE.LineBasicMaterial({
            color: this.color,
            transparent: true,
            linewidth: global.Sets.trailWidth
          }),
          this.scene,
          this.parent
        );
        this.add(l);
      }
    } else {
      this.last = new THREE.Vector3();
    }

    this.last.copy(this.now);
  }
}
