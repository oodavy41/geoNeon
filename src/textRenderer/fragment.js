import * as THREE from "three";
export default class TextFrag extends THREE.Sprite {
  constructor(factory, index, text, size = undefined, color = undefined) {
    super(new THREE.SpriteMaterial({ map: factory.tex, transparent: true }));
    this.factory = factory;
    factory.modify = true;
    this.text = text;
    this._size = size;
    this._color = color;
    this.index = index;

    this.uvs = [];
    this.width = 0;
    this.height = size;
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
    this.factory.redraw();
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
      0
    ];
    textgeo.setIndex([0, 1, 2, 0, 2, 3]);
    textgeo.addAttribute("position", new THREE.BufferAttribute(new Float32Array(spritePos), 3));
    textgeo.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(this.uvs), 2));
    this.geometry = textgeo;
    this.scale.set(0.1, 0.1, 0.1);
    return this;
  }
}
