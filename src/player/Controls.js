
export default class Controls {

    constructor(car) {

        this.car = car;

        this.lane = 1;

        window.addEventListener('keydown', (event) => {

            if (
                ['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D']
                .includes(event.key)
            ) {
                event.preventDefault();
            }

            if (
                event.key === 'ArrowLeft' ||
                event.key.toLowerCase() === 'a'
            ) {
                this.moveLeft();
            }

            if (
                event.key === 'ArrowRight' ||
                event.key.toLowerCase() === 'd'
            ) {
                this.moveRight();
            }
        });

        document.getElementById('left-button')
            .addEventListener('pointerdown', (e) => {
                e.preventDefault();
                this.moveLeft();
            });

        document.getElementById('right-button')
            .addEventListener('pointerdown', (e) => {
                e.preventDefault();
                this.moveRight();
            });
    }

    moveLeft() {

        this.lane = Math.max(0, this.lane - 1);

        this.car.setLane(this.lane);
    }

    moveRight() {

        this.lane = Math.min(2, this.lane + 1);

        this.car.setLane(this.lane);
    }

    reset() {

        this.lane = 1;

        this.car.setLane(this.lane);
    }
}
