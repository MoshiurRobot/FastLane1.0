
import * as THREE from 'three';

export default class FollowCamera {

    constructor(camera, car) {

        this.camera = camera;
        this.car = car;

        this.offset = new THREE.Vector3(
            0, 7, 10
        );

        this.lookOffset = new THREE.Vector3(
            0, 1, -8
        );

        this.camera.position.copy(
            this.car.group.position.clone().add(this.offset)
        );
    }

    update(delta) {

        const targetPosition =
            this.car.group.position.clone().add(this.offset);

        this.camera.position.lerp(
            targetPosition,
            1 - Math.exp(-0.0 * delta)
        );

        const lookPosition =
            this.car.group.position.clone().add(this.lookOffset);

        this.camera.lookAt(lookPosition);
    }
}
