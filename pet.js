const CAR_COUNT = 10;

const world = document.getElementById("pet-world");
const cars = [];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createCar() {
    const img = document.createElement("img");
    img.src = "images/gtr-r35.png";
    img.className = "desktop-car";
    img.alt = "";

    world.appendChild(img);

    // 車子大小
    const size = random(70, 120);
    img.style.width = `${size}px`;

    // 初始位置
    let x = random(0, Math.max(0, window.innerWidth - size));
    let y = random(0, Math.max(0, window.innerHeight - size));

    // 初始速度
    const speed = random(45, 95);

    // 初始方向
    const angle = random(0, Math.PI * 2);
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;

    const car = {
        element: img,
        size: size,
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        speed: speed,
        nextTurn: performance.now() + random(1800, 5000)
    };

    cars.push(car);
}

for (let i = 0; i < CAR_COUNT; i++) {
    createCar();
}

function changeDirection(car) {
    const currentAngle = Math.atan2(car.vy, car.vx);

    // 車子不要亂甩得太誇張，所以只小幅轉向
    const turnAmount = random(-Math.PI / 3, Math.PI / 3);
    const newAngle = currentAngle + turnAmount;

    car.vx = Math.cos(newAngle) * car.speed;
    car.vy = Math.sin(newAngle) * car.speed;

    car.nextTurn = performance.now() + random(1800, 5000);
}

let previousTime = performance.now();

function animate(currentTime) {
    const deltaTime = Math.min((currentTime - previousTime) / 1000, 0.05);
    previousTime = currentTime;

    cars.forEach((car) => {
        if (currentTime > car.nextTurn) {
            changeDirection(car);
        }

        car.x += car.vx * deltaTime;
        car.y += car.vy * deltaTime;

        const maxX = window.innerWidth - car.size;
        const maxY = window.innerHeight - car.size;

        // 撞左牆
        if (car.x <= 0) {
            car.x = 0;
            car.vx = Math.abs(car.vx);
        }

        // 撞右牆
        if (car.x >= maxX) {
            car.x = maxX;
            car.vx = -Math.abs(car.vx);
        }

        // 撞上牆
        if (car.y <= 0) {
            car.y = 0;
            car.vy = Math.abs(car.vy);
        }

        // 撞下牆
        if (car.y >= maxY) {
            car.y = maxY;
            car.vy = -Math.abs(car.vy);
        }

        // 根據移動方向決定翻面
        const facing = car.vx >= 0 ? 1 : -1;

        // 根據速度方向加一點傾斜角度
        const angleDeg = Math.atan2(car.vy, car.vx) * 180 / Math.PI;
        const tilt = Math.max(-18, Math.min(18, angleDeg * 0.35));

        car.element.style.transform = `
            translate3d(${car.x}px, ${car.y}px, 0)
            scaleX(${facing})
            rotate(${facing === 1 ? tilt : -tilt}deg)
        `;
    });

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

window.addEventListener("resize", () => {
    cars.forEach((car) => {
        const maxX = window.innerWidth - car.size;
        const maxY = window.innerHeight - car.size;

        car.x = Math.min(car.x, Math.max(0, maxX));
        car.y = Math.min(car.y, Math.max(0, maxY));
    });
});
