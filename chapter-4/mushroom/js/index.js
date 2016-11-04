


window.onload = () => {
    const
        scene = new THREE.Scene(),
        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            .1,
            1000
        ),
        renderer = new THREE.WebGLRenderer()

    document.body.appendChild(renderer.domElement)

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0xffffff)
    renderer.clear()

    const addSpotLight = (color, pos) => {
        var spotLight = new THREE.SpotLight(color)
        spotLight.position.set(...pos)

        spotLight.castShadow = true

        spotLight.shadow.mapSize.width = 1024
        spotLight.shadow.mapSize.height = 1024

        spotLight.shadow.camera.near = 500
        spotLight.shadow.camera.far = 1000
        spotLight.shadow.camera.fov = 30

        scene.add(spotLight)
    }
    addSpotLight(0xffffff, [0, 20, 20])

    const loader = () => {
        return new Promise(resolve => {
            const
                jsonLoader = new THREE.JSONLoader(),
                textureLoader = new THREE.TextureLoader()

            textureLoader.load('js/mushroom.png', texture => {
                jsonLoader.load('js/mushroom.json?13', (geometry, materials) => {
                    materials[0].setValues({
                        map: texture
                    })

                    const
                        material = new THREE.MultiMaterial(materials),
                        mushroom = new THREE.Mesh(geometry, material)

                    mushroom.position.z = -6
                    scene.add(mushroom)
                    renderer.render(scene, camera)
                    resolve(mushroom)
                })
            })
        })
    }
    loader().then(mushroom => drag(mushroom))

    const drag = mushroom => {
        let
            down = false

        const
            start = {}

        document.body.addEventListener('mousedown', event => {
            start.x = event.pageX
            start.y = event.pageY
            down = true
        })

        document.body.addEventListener('mouseup', () => down = false)

        document.body.addEventListener('mousemove', event => {
            if (!down) return
            const
                deltaX = event.pageX - start.x,
                deltaY = event.pageY - start.y

            if (deltaX > 0) mushroom.rotation.y += .05
            if (deltaX < 0) mushroom.rotation.y -= .05
            if (deltaY > 0) mushroom.rotation.x += .05
            if (deltaY < 0) mushroom.rotation.x -= .05

            renderer.render(scene, camera)

            start.x = event.pageX
            start.y = event.pageY
        })
    }
}
