import * as THREE from "three";

export default class tObj {
  constructor(mesh, anime = null) {
    this.mesh = mesh;
    this.anime = anime;
  }
  update() {}

  getObj() {
    return this.mesh;
  }
}
