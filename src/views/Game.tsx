import { Component, Vue } from "vue-property-decorator"
import * as THREE from "three"
import { AnimationMixer, Clock, WebGLRenderer } from "three"
import { CreateElement, VNode } from "vue"
import gsap from "gsap"
import { WEBGL } from "three/examples/jsm/WebGL.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import Stats from "three/examples/jsm/libs/stats.module"
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js"

@Component
export default class Game extends Vue {
  scene?: THREE.Scene
  camera?: THREE.PerspectiveCamera
  contextType?: string
  renderer?: WebGLRenderer
  private mixer?: AnimationMixer
  private stats?: Stats
  private clock?: Clock
  touched = false
  clicked = false
  mainStyle = {
    position: "absolute",
  }
  uiStyle = {
    position: "absolute",
    top: 0,
  }

  current = 0
  private onTouchCancel(event: Event) {
    const target = event.target as HTMLElement
    console.log(target)
    console.log(event.type)
    if (target && target.dataset.role === "spin") {
      this.addValue()
    }
  }
  private addValue() {
    this.current = this.current + 1
  }

  private onTouched() {
    this.touched = true
  }
  private onTouchEnded() {
    this.touched = false
  }
  private onMouseDown() {
    this.clicked = true
  }
  private onMouseUp() {
    this.clicked = false
  }

  private onMouseMove() {
    if (this.clicked || this.touched) {
      console.log("dragging")
      if (this.touched) {
        console.log("touch move")
        // https://w3c.github.io/touch-events/#mouse-events
        // https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent
      }
      return
    }
    console.log(this.clicked, this.touched)
  }

  private onClickSpin(event: Event) {
    this.current = this.current + 1
    console.log(event)
  }

  public render(h: CreateElement): VNode {
    return (
      <main style={this.mainStyle} ref={"mainWrapper"}>
        <canvas ref={"mainCanvas"}></canvas>
        <section
          ref={"ui"}
          style={this.uiStyle}
          {...{
            on: {
              click: this.onTouchCancel,
              touchstart: this.onTouched,
              touchmove: this.onMouseMove,
              touchend: this.onTouchEnded,
              mousemove: this.onMouseMove,
              mousedown: this.onMouseDown,
              mouseup: this.onMouseUp,
            },
          }}
        >
          <input type="text" value={this.current} />
          <p> {this.current}</p>
          <button onclick={this.onClickSpin} data-role={"spin"}>
            스핀 2
          </button>
          <button
            data-role={"spin"}
            {...{ on: { "click.prevent": this.onClickSpin } }}
          >
            스핀 1
          </button>
        </section>
      </main>
    )
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

    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const geometry = new THREE.CylinderGeometry(5, 5, 2, 32)
    const cube = new THREE.Mesh(geometry, material)
    this.scene.add(cube)
    this.camera.position.z = 20

    const t = new THREE.TextureLoader().load(
      "/img/icons/android-chrome-512x512.png",
    )
    t.wrapS = THREE.RepeatWrapping
    t.wrapT = THREE.RepeatWrapping
    t.repeat.set(1, 1)

    const cube2 = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        map: t,
      }),
    )
    this.scene.add(cube2)

    gsap.to(cube.rotation, {
      x: Math.PI * 2,
      duration: 10,
      yoyo: true,
      repeat: -1,
    })
    gsap.to(cube2.rotation, {
      y: Math.PI * 2,
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
      "/models/scene.gltf",
      gltf => {
        const mesh = gltf.scene

        this.scene?.add(mesh)
        directionalLight.target = mesh
        mesh.scale.x = 0.05
        mesh.scale.y = 0.05
        mesh.scale.z = 0.05
        mesh.position.x = 3

        this.mixer = new THREE.AnimationMixer(mesh)
        //const clips = gltf.animations
        //const action = this.mixer.clipAction(clips[0])
        //action.play()
      },
      undefined,
      function(error) {
        console.error(error)
      },
    )
  }

  mounted() {
    const mainWrapper = this.$refs.mainWrapper as HTMLElement
    if (!this.initRenderer()) {
      mainWrapper.appendChild(WEBGL.getWebGLErrorMessage())
      return
    } else {
      this.stats = Stats()
      mainWrapper.appendChild(this.stats.dom)
      this.$nextTick(() => {
        const light = new THREE.AmbientLight(0x404040) // soft white light
        this.scene?.add(light)
        this.clock = new Clock()
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
    this.stats?.update()

    const delta = this.clock?.getDelta() as number
    this.mixer?.update(delta * this.current)
  }
}
