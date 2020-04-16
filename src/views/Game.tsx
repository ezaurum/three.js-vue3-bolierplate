import { Component, Vue } from "vue-property-decorator"
import * as THREE from "three"
import { AnimationMixer, WebGLRenderer } from "three"
import { CreateElement, VNode } from "vue"
import gsap from "gsap"
import { WEBGL } from "three/examples/jsm/WebGL.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

@Component
export default class Game extends Vue {
  scene?: THREE.Scene
  camera?: THREE.PerspectiveCamera
  contextType?: string
  renderer?: WebGLRenderer
  private mixer?: AnimationMixer

  public render(h: CreateElement): VNode {
    return h("canvas", { ref: "mainCanvas" })
  }

  created() {
    if (WEBGL.isWebGL2Available()) {
      this.contextType = "webgl2"
    } else if (WEBGL.isWebGLAvailable()) {
      this.contextType = "webgl"
    }
  }

  beforeMount() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )

    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    this.scene.add(cube)
    this.camera.position.z = 5

    gsap.to(cube.rotation, {
      x: 6,
      y: 6,
      z: 10,
      duration: 10,
      yoyo: true,
      repeat: -1,
    })

    /*    gsap.to(this.camera.position, {
          z: 10,
          duration:2,
          yoyo:true,
          repeat:-1,
      })*/

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    this.scene.add(directionalLight)

    const loader = new GLTFLoader()

    loader.load(
      "/models/CesiumMan.glb",
      gltf => {
        const mesh = gltf.scene
        this.scene?.add(mesh)
        directionalLight.target = mesh

        this.mixer = new THREE.AnimationMixer(mesh)
        const clips = gltf.animations
        const action = this.mixer.clipAction(clips[0])
        action.play()
      },
      undefined,
      function(error) {
        console.error(error)
      },
    )
  }

  mounted() {
    if (!this.initRenderer()) {
      document.body.appendChild(WEBGL.getWebGLErrorMessage())
      return
    } else {
      this.$nextTick(() => {
        const light = new THREE.AmbientLight(0x404040) // soft white light
        this.scene?.add(light)
        this.animate()
      })
    }
  }

  protected initRenderer(): boolean {
    if (!this.contextType) {
      return false
    }
    const canvas = this.$refs.mainCanvas as HTMLCanvasElement
    const context = canvas.getContext(this.contextType, {
      alpha: false,
    }) as WebGLRenderingContext
    this.renderer = new THREE.WebGLRenderer({ canvas, context })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    return true
  }

  beforeDestroy() {
    if (this.renderer) {
      document.body.removeChild(this.renderer.domElement)
    }
    if (this.scene) {
      this.scene.dispose()
    }
  }

  animate() {
    requestAnimationFrame(this.animate)
    this.renderer?.render(
      this.scene as THREE.Scene,
      this.camera as THREE.PerspectiveCamera,
    )

    this.mixer?.update(1 / 24)
  }
}
