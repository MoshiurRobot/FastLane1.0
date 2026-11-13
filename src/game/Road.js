
import * as THREE from 'three';

export default class Road {

    constructor(scene) {

        this.scene = scene;

        const roadMaterial = new THREE.MeshStandardMaterial({
            color: 0x30343b,
            roughness: 0.95
        });

        const road = new THREE.Mesh(
            new THREE.PlaneGeometry(14, 200),
            roadMaterial
        );

        road.rotation.x = -Math.PI / 2;
        road.position.set(0, 0, -40);

        scene.add(road);

        // Road edges
        const edgeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

        for (const x of [-6.5, 6.5]) {

            const edge = new THREE.Mesh(
                new THREE.BoxGeometry(0.12, 0.04, 200),
                edgeMaterial
            );

            edge.position.set(x, 0.03, -40);

            scene.add(edge);
        }

        // Lane markings
        this.markings = [];

        const lineMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

        for (const x of [-2, 2]) {

            for (let z = -140; z <= 20; z += 10) {

                const line = new THREE.Mesh(
                    new THREE.BoxGeometry(0.12, 0.04, 4),
                    lineMaterial
                );

                line.position.set(x, 0.04, z);

                scene.add(line);

                this.markings.push(line);
            }
        }
    }

    update(delta, speed) {

        this.markings.forEach(line => {

            line.position.z += speed * delta;

            if (line.position.z > 15) {
                line.position.z -= 160;
            }

        });
    }
}
