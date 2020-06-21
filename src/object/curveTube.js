import * as THREE from "three";
import "../settings";

export default class curveTube {
  constructor(color, scene, parent, pointsArrray) {
    this.parent = parent;
    this.color = color;
    this.scene = scene;
    this.mat = new THREE.MeshLambertMaterial({
      color: this.color,
      transparent: true,
      opacity: global.Sets.trailOpacity,
    });

    let tubes = pointsArrray.map(
      (e) =>
        new THREE.Mesh(
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(e),
            e.length*10,
            0.2,
            5,
            false
          ),
          this.mat
        )
    );
    this.obj = new THREE.Object3D();
    this.obj.add(...tubes);
    this.obj.layers.mask = this.parent.layers.mask;
      this.scene.add(this.obj);
      this.hide();
  }

  setVisible(flag) {
    this.obj.children.forEach((e) => {
      e.visible = flag;
    });
  }
  hide() {
    if (this.obj) {
      this.setVisible(false);
    }
  }

  show() {
    if (this.obj) {
      this.setVisible(true);
    }
  }

  changeMatColor(color) {
    this.mat.color = new THREE.Color(color);
  }
}
