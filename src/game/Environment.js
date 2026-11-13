
import * as THREE from 'three';

export default class Environment {

    constructor(scene) {

        this.scene = scene;

        this.objects = [];

        const grass = new THREE.Mesh(
            new THREE.PlaneGeometry(500, 500),
            new THREE.MeshStandardMaterial({
                color: 0x347c35
            })
        );

        grass.rotation.x = -Math.PI / 2;
        grass.position.y = -0.08;

        scene.add(grass);

        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x795548
        });

        const leafMaterial = new THREE.MeshStandardMaterial({
            color: 0x15803d
        });

        for (let z = -140; z < 30; z += 12) {

            for (const side of [-1, 1]) {

                const tree = new THREE.Group();

                const trunk = new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        0.18, 0.25, 1.5, 8
                    ),
                    trunkMaterial
                );

                trunk.position.y = 0.75;
                tree.add(trunk);

                const leaves = new THREE.Mesh(
                    new THREE.ConeGeometry(1.2, 3, 8),
                    leafMaterial
                );

                leaves.position.y = 2.6;
                tree.add(leaves);

                tree.position.set(side * 10, 0, z);

                scene.add(tree);

                this.objects.push(tree);
            }
        }
    }

    update(delta, speed) {

        this.objects.forEach(tree => {

            tree.position.z += speed * delta;

            if (tree.position.z > 20) {
                tree.position.z -= 170;
            }

        });
    }
}
