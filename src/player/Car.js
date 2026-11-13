
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Car {

    constructor(scene) {

        this.scene = scene;

        this.group = new THREE.Group();

        this.targetX = 0;
        this.x = 0;

        this.model = null;

        this.group.position.set(0, 0, 5);

        this.scene.add(this.group);

        this.loadModel();
    }

    loadModel() {

        const loader = new GLTFLoader();

        loader.load(
            '/assets/models/car.glb',

            (gltf) => {

                this.model = gltf.scene;

                // Customize car size
                this.model.scale.set(1.0, 0.8, 1.0);

                // Adjust if your model faces the wrong direction
                this.model.rotation.y = 0;

                // Enable shadows
                this.model.traverse((child) => {

                    if (child.isMesh) {

                        child.castShadow = true;
                        child.receiveShadow = true;

                    }

                });

                this.group.add(this.model);

                console.log('Custom car loaded successfully!');

            },

            undefined,

            (error) => {

                console.error(
                    'Failed to load car model:',
                    error
                );

            }
        );
    }

    setLane(lane) {

        const positions = [-4, 0, 4];

        this.targetX = positions[
            THREE.MathUtils.clamp(lane, 0, 2)
        ];
    }

    update(delta) {

        this.x = THREE.MathUtils.lerp(
            this.x,
            this.targetX,
            1 - Math.exp(-10 * delta)
        );

        this.group.position.x = this.x;

        this.group.rotation.z = THREE.MathUtils.clamp(
            (this.targetX - this.x) * 0.06,
            -0.12,
            0.12
        );
    }
}
