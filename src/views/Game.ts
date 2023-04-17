import * as THREE from "three"
import { defineComponent } from "vue"

export default defineComponent({
  setup() {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer()

    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)

    const clock = new THREE.Clock()
    const animate = () => {
      const delta = clock.getElapsedTime()
      cube.setRotationFromEuler(new THREE.Euler(delta, delta, delta))
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }

    const render = () => {
      return
    }

    scene.add(cube)
    camera.position.z = 5

    renderer.setSize(window.innerWidth, window.innerHeight)

    // mount
    const domElement = renderer.domElement
    document.body.appendChild(domElement)

    // initiate render
    window.requestAnimationFrame(() => animate())

    return render
  },
})
