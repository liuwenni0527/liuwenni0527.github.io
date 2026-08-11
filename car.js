/* =========================================================
   GTR R35 Desktop Cars
========================================================= */

const CAR_COUNT = 10;

const world = document.getElementById("car-world");

const cars = [];


/* =========================================================
   Random Number
========================================================= */

function random(min, max) {

    return Math.random() * (max - min) + min;

}


/* =========================================================
   Create Car
========================================================= */

function createCar() {

    const img = document.createElement("img");

    img.src = "images/gtr-r35.png";

    img.className = "desktop-car";

    img.alt = "";

    world.appendChild(img);


    /* -------------------------
       Random Size
    ------------------------- */

    const size = random(60, 110);

    img.style.width = `${size}px`;


    /* -------------------------
       Random Position
    ------------------------- */

    let x = random(
        0,
        Math.max(
            0,
            window.innerWidth - size
        )
    );


    let y = random(
        0,
        Math.max(
            0,
            window.innerHeight - size
        )
    );


    /* -------------------------
       Random Speed
    ------------------------- */

    const speed = random(40, 90);


    /* -------------------------
       Random Direction
    ------------------------- */

    const angle =
        random(
            0,
            Math.PI * 2
        );


    let vx =
        Math.cos(angle) *
        speed;


    let vy =
        Math.sin(angle) *
        speed;


    const car = {

        element: img,

        size: size,

        x: x,
        y: y,

        vx: vx,
        vy: vy,

        speed: speed,

        nextTurn:
            performance.now() +
            random(2000, 6000)

    };


    cars.push(car);

}


/* =========================================================
   Create 10 Cars
========================================================= */

for (
    let i = 0;
    i < CAR_COUNT;
    i++
) {

    createCar();

}


/* =========================================================
   Random Direction Change
========================================================= */

function changeDirection(car) {

    const currentAngle =
        Math.atan2(
            car.vy,
            car.vx
        );


    /*
       只稍微轉向
       避免汽車突然 180 度亂甩
    */

    const turnAmount =
        random(
            -Math.PI / 4,
            Math.PI / 4
        );


    const newAngle =
        currentAngle +
        turnAmount;


    car.vx =
        Math.cos(newAngle) *
        car.speed;


    car.vy =
        Math.sin(newAngle) *
        car.speed;


    car.nextTurn =
        performance.now() +
        random(2000, 6000);

}


/* =========================================================
   Animation
========================================================= */

let previousTime =
    performance.now();


function animate(currentTime) {

    const deltaTime =
        Math.min(
            (currentTime - previousTime) / 1000,
            0.05
        );


    previousTime =
        currentTime;


    cars.forEach((car) => {


        /* -------------------------
           Change Direction
        ------------------------- */

        if (
            currentTime >
            car.nextTurn
        ) {

            changeDirection(car);

        }


        /* -------------------------
           Move Car
        ------------------------- */

        car.x +=
            car.vx *
            deltaTime;


        car.y +=
            car.vy *
            deltaTime;


        const maxX =
            window.innerWidth -
            car.size;


        const maxY =
            window.innerHeight -
            car.size;


        /* -------------------------
           Left Wall
        ------------------------- */

        if (car.x <= 0) {

            car.x = 0;

            car.vx =
                Math.abs(car.vx);

        }


        /* -------------------------
           Right Wall
        ------------------------- */

        if (car.x >= maxX) {

            car.x =
                maxX;

            car.vx =
                -Math.abs(car.vx);

        }


        /* -------------------------
           Top Wall
        ------------------------- */

        if (car.y <= 0) {

            car.y = 0;

            car.vy =
                Math.abs(car.vy);

        }


        /* -------------------------
           Bottom Wall
        ------------------------- */

        if (car.y >= maxY) {

            car.y =
                maxY;

            car.vy =
                -Math.abs(car.vy);

        }


        /* -------------------------
           Face Direction
        ------------------------- */

        const facing =
            car.vx >= 0
                ? 1
                : -1;


        /* -------------------------
           Slight Body Tilt
        ------------------------- */

        const verticalRatio =
            car.vy /
            car.speed;


        const tilt =
            verticalRatio * 10;


        /* -------------------------
           Render
        ------------------------- */

        car.element.style.transform = `

            translate3d(
                ${car.x}px,
                ${car.y}px,
                0
            )

            scaleX(${facing})

            rotate(
                ${facing === 1
                    ? tilt
                    : -tilt}deg
            )

        `;

    });


    requestAnimationFrame(
        animate
    );

}


/* Start animation */

requestAnimationFrame(
    animate
);


/* =========================================================
   Browser Resize
========================================================= */

window.addEventListener(
    "resize",
    () => {

        cars.forEach(
            (car) => {

                const maxX =
                    window.innerWidth -
                    car.size;


                const maxY =
                    window.innerHeight -
                    car.size;


                car.x =
                    Math.min(
                        car.x,
                        Math.max(
                            0,
                            maxX
                        )
                    );


                car.y =
                    Math.min(
                        car.y,
                        Math.max(
                            0,
                            maxY
                        )
                    );

            }
        );

    }
);
