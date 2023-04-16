import * as THREE from "three"
import { defineComponent, h } from "vue"

export default defineComponent({
  setup() {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )
    const renderer = new THREE.WebGLRenderer()

    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }

    const render = () => {
      const domElement = renderer.domElement
      document.body.appendChild(domElement)
      return h()
    }

    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    camera.position.z = 5

    renderer.setSize(window.innerWidth, window.innerHeight)
    animate()
    // on before unmount

    return render
  }
})
