import { Component, Vue } from "vue-property-decorator"
import * as THREE from "three"
import { CreateElement, VNode } from "vue"
import gsap from "gsap"

@Component
export default class Game extends Vue {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  )
  renderer = new THREE.WebGLRenderer()

  animate() {
    requestAnimationFrame(this.animate)
    this.renderer.render(this.scene, this.camera)
  }

  public render(h: CreateElement): VNode {
    const domElement = this.renderer.domElement
    document.body.appendChild(domElement)
    return h()
  }

  beforeMount() {
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    this.scene.add(cube)
    this.camera.position.z = 5

    gsap.to(cube.rotation, {
      x: 6,
      y: 6,
      duration: 2,
      yoyo: true,
      repeat: -1,
    })
  }

  mounted() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.animate()
  }

  beforeDestroy() {
    document.body.removeChild(this.renderer.domElement)
    this.scene.dispose()
  }
}
