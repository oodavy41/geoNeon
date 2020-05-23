import * as THREE from "three";
import "../settings";

export default class lineTrail {
  constructor(color, scene, parent) {
    this.parent = parent;
    this.color = color;
    this.scene = scene;
    this.obj = null;
    this.mat = new THREE.MeshLambertMaterial({
      color: this.color,
      transparent: true,
      opacity: global.Sets.trailOpacity,
    });
  }

  update() {}

  switch(curve) {
    if (this.obj) {
      this.scene.remove(this.obj);
    }
    let line = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 100, 0.2, 5, false),
      this.mat
    );
    line["sealineInfo"] = this.parent.sealineInfo;
    line.layers.mask = this.parent.layers.mask;
    this.scene.add(line);
    this.obj = line;
  }
  complete() {
    if (this.obj) {
      this.scene.remove(this.obj);
      this.obj = null;
    }
  }

  changeMatColor(color) {
    this.mat.color = new THREE.Color(color);
  }
}
