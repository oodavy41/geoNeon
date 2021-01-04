import * as THREE from "three";
import "../settings";

export default class lineTrail {
  constructor(color, scene, parent) {
    this.parent = parent;
    this.color = color;
    this.scene = scene;
    this.curves = [];
    this.index = 0;
    this.mat = new THREE.LineBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: global.Sets.trailOpacity
    });
  }

  update() {
    let now = new THREE.Vector3();
    now.copy(this.parent.position);
    this.curves[this.index].points.push(now);
    this.curves[this.index].obj.geometry.setFromPoints(this.curves[this.index].points);
    this.curves[this.index].obj.geometry.verticesNeedUpdate = true;
    this.curves[this.index].obj.geometry.computeBoundingSphere();
  }

  unmount() {
    
  }

  switch(index) {
    if (!this.curves[index]) {
        let geo = new THREE.BufferGeometry();
        let mat = this.mat;
        let line = new THREE.Line(geo, mat);
        line["sealineInfo"] = this.parent.sealineInfo;
        this.curves[index] = { obj: line, points: [] };
    }
    this.curves[index].obj.geometry.dispose();
    this.curves[index].obj.geometry.setFromPoints(this.curves[this.index].points);
    this.curves[index].obj.layers.mask = this.parent.layers.mask;
    this.scene.add(this.curves[index].obj);
    this.index = index;
  }
  complete() {
    this.curves.forEach(e => {
      this.scene.remove(e.obj);
      e.points = [];
    });
  }

  changeMatColor(color) {
    this.mat.color = new THREE.Color(color);
  }
}
