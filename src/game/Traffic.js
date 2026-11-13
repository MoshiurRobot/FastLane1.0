
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { rotate } from 'three/src/nodes/utils/RotateNode.js';

export default class Traffic {

    constructor(scene) {

        this.scene = scene;
        this.loader = new GLTFLoader();

        this.cars = [];
        this.models = {};

        this.lanes = [-4, 0, 4];

        // Traffic vehicle configurations
        this.vehicleTypes = [

            {
                name: 'auto',
                path: '/assets/models/traffic/auto.glb',
                scale: .5,
                width: 1.8,
                length: 3.8,
                speed: 0.55,
                weight: 30
            },

            {
                name: 'bus',
                path: '/assets/models/traffic/bus.glb',
                scale: .5,
                width: 2,
                length: 4.5,
                speed: 0.55,
                weight: 30
            },

            {
                name: 'truck',
                path: '/assets/models/traffic/truck.glb',
                scale: .25,
                width: 2.5,
                length: 7,
                speed: 0.55,
                weight: 10
            },


            

        ];

        this.loadModels();
    }


    // =====================================
    // LOAD ALL VEHICLE MODELS
    // =====================================

    async loadModels() {

        console.log('Loading traffic vehicles...');

        const promises = this.vehicleTypes.map(vehicle => {

            return new Promise(resolve => {

                this.loader.load(

                    vehicle.path,

                    gltf => {

                        this.models[vehicle.name] = gltf.scene;

                        console.log(
                            vehicle.name + ' loaded successfully'
                        );

                        resolve();

                    },

                    undefined,

                    error => {

                        console.error(
                            'Failed to load ' + vehicle.name,
                            error
                        );

                        resolve();

                    }

                );

            });

        });

        await Promise.all(promises);

        console.log('Traffic loading completed.');

        this.spawnInitialTraffic();
    }


    // =====================================
    // RANDOM VEHICLE SELECTION
    // =====================================

    getRandomVehicle() {

        const available = this.vehicleTypes.filter(
            vehicle => this.models[vehicle.name]
        );

        if (available.length === 0) {
            return null;
        }

        const totalWeight = available.reduce(
            (sum, vehicle) => sum + vehicle.weight,
            0
        );

        let random = Math.random() * totalWeight;

        for (const vehicle of available) {

            random -= vehicle.weight;

            if (random <= 0) {
                return vehicle;
            }

        }

        return available[0];
    }


    // =====================================
    // CREATE TRAFFIC VEHICLE
    // =====================================

    createVehicle(z) {

        const type = this.getRandomVehicle();

        if (!type) {
            return;
        }

        // Clone the original model
        const model = this.models[type.name].clone(true);

        // Rotate traffic vehicles 180 degrees
        // Player car faces -Z
        // Traffic cars face +Z

        model.rotation.y = Math.PI;

        // Vehicle size
        model.scale.setScalar(type.scale);

        // Enable shadows
        model.traverse(child => {

            if (child.isMesh) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        });

        // Create vehicle container
        const group = new THREE.Group();

        group.add(model);

        // Select random lane
        const lane = Math.floor(
            Math.random() * this.lanes.length
        );

        group.position.set(
            this.lanes[lane],
            1.5,
            z
        );

        this.scene.add(group);

        // Store vehicle data
        this.cars.push({

            group: group,

            type: type,

            lane: lane,

            passed: false,

            width: type.width,

            length: type.length

        });

    }


    // =====================================
    // INITIAL TRAFFIC GENERATION
    // =====================================

    spawnInitialTraffic() {

        if (this.cars.length > 0) {
            return;
        }

        for (let i = 0; i < 5; i++) {

            this.createVehicle(-30 - i * 28);

        }

    }


    // =====================================
    // UPDATE TRAFFIC MOVEMENT
    // =====================================

    update(delta, speed) {

        this.cars.forEach(car => {

            // Different vehicle speeds
            const trafficSpeed =
                speed * car.type.speed;

            // Move vehicle toward player
            car.group.position.z +=
                trafficSpeed * delta;


            // =================================
            // RECYCLE VEHICLE
            // =================================

            if (car.group.position.z > 18) {

                // Move vehicle back into distance
                car.group.position.z =
                    -100 - Math.random() * 40;

                // Select another lane
                car.lane = Math.floor(
                    Math.random() * 3
                );

                car.group.position.x =
                    this.lanes[car.lane];

                car.passed = false;


                // Select another vehicle type
                const newType = this.getRandomVehicle();

                if (newType) {

                    // Remove old model
                    const oldModel =
                        car.group.children[0];

                    if (oldModel) {
                        car.group.remove(oldModel);
                    }

                    // Update vehicle type
                    car.type = newType;

                    car.width = newType.width;

                    car.length = newType.length;


                    // Load from already cached model
                    const newModel =
                        this.models[newType.name].clone(true);

                    // Rotate new traffic model 180 degrees
                    newModel.rotation.y = Math.PI;

                    // Set vehicle scale
                    newModel.scale.setScalar(
                        newType.scale
                    );

                    // Enable shadows
                    newModel.traverse(child => {

                        if (child.isMesh) {

                            child.castShadow = true;
                            child.receiveShadow = true;

                        }

                    });

                    // Add new model
                    car.group.add(newModel);

                }

            }

        });

    }


    // =====================================
    // RESET TRAFFIC
    // =====================================

    reset() {

        this.cars.forEach((car, index) => {

            car.group.position.z =
                -30 - index * 28;

            car.lane = index % 3;

            car.group.position.x =
                this.lanes[car.lane];

            car.passed = false;

        });

    }

}
