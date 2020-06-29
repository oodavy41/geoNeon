import * as THREE from "three";
import "../settings";

let SET = global.Sets;
export default class TextFrag extends THREE.Sprite {
  constructor(factory, index, text, size = undefined, color = undefined) {
    super(new THREE.SpriteMaterial({ map: factory.tex, transparent: true }));
    this.factory = factory;
    this.text = text;
    this._size = size;
    this._color = color;
    this.index = index;

    this.uvs = [];
    this.width = 0;
    this.height = size;
    this.factory.draw(this);
  }

  set color(color) {
    this._color = color;
    this.factory.modify = true;
  }

  get color() {
    return this._color;
  }

  set size(size) {
    this._size = size;
    this.height = size;
    this.factory.modify = true;
  }

  get size() {
    return this._size;
  }

  get obj() {
    let textgeo = new THREE.BufferGeometry();
    let spritePos = [
      -0.5 * this.width,
      0,
      0,
      0.5 * this.width,
      0,
      0,
      0.5 * this.width,
      this.height,
      0,
      -0.5 * this.width,
      this.height,
      0,
    ];
    textgeo.setIndex([0, 1, 2, 0, 2, 3]);
    textgeo.addAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(spritePos), 3)
    );
    textgeo.addAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(this.uvs), 2)
    );
    this.geometry = textgeo;
    this.scale.set(
      SET.textScale / SET.boatSize,
      SET.textScale / SET.boatSize,
      SET.textScale / SET.boatSize
    );
    this.position.y = 0.5;
    this.position.z = 0.5;
    return this;
  }
}
