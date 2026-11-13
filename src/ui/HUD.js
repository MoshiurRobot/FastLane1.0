
export default class HUD {

    constructor() {

        this.scoreElement =
            document.getElementById('score');

        this.speedElement =
            document.getElementById('speed');

        this.distanceElement =
            document.getElementById('distance');

        this.overlay =
            document.getElementById('overlay');

        this.title =
            document.getElementById('overlay-title');

        this.message =
            document.getElementById('overlay-message');

        this.button =
            document.getElementById('start-button');
    }

    update(score, speed, distance) {

        this.scoreElement.textContent = score;

        this.speedElement.textContent =
            Math.round(speed * 12) + ' KM/H';

        this.distanceElement.textContent =
            Math.floor(distance) + ' M';
    }

    showStart() {

        this.title.textContent = 'Lane Fast 3D 1.0';

        this.message.textContent =
            'Avoid vehicles and race as far as possible!';

        this.button.textContent = 'Let\'s Go!';

        this.overlay.style.display = 'flex';
    }

    showGameOver(score) {

        this.title.textContent = 'GAME OVER';

        this.message.textContent =
            'Your final score: ' + score;

        this.button.textContent = 'PLAY AGAIN';

        this.overlay.style.display = 'flex';
    }

    hide() {

        this.overlay.style.display = 'none';
    }
}
