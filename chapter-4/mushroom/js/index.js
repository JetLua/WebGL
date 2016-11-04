


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
    addSpotLight(0xffffff, [0, 100, 100])

    const loader = () => {
        const
            jsonLoader = new THREE.JSONLoader(),
            textureLoader = new THREE.TextureLoader()

        textureLoader.load('js/mushroom.png', texture => {
            jsonLoader.load('js/mushroom.json', (geometry, materials) => {
                materials[0].setValues({
                    map: texture
                })

                const
                    material = new THREE.MultiMaterial(materials),
                    mushroom = new THREE.Mesh(geometry, material)

                mushroom.position.y = -3
                mushroom.position.z = -6
                scene.add(mushroom)
                renderer.render(scene, camera)
            })
        })
    }
    loader()


}
