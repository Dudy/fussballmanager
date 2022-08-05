function randomInt(start = 0, end = 1) {
    return Math.floor(Math.random() * (end - start)) + start;
}

function zweiZufallszahlen() {
    const u1 = Math.random();
    const u2 = Math.random();
    return [
        Math.cos(2 * Math.PI * u1) * Math.sqrt(-2.0 * Math.log(u2)),
        Math.sin(2 * Math.PI * u1) * Math.sqrt(-2.0 * Math.log(u2))
    ];
}

function test01() {
    let min = 0;
    let max = 0;
    for (let i = 0; i < 10000; i++) {
        const [x, y] = zweiZufallszahlen()
        if (x < min) {
            min = x;
        }
        if (x > max) {
            max = x;
        }
        if (y < min) {
            min = y;
        }
        if (y > max) {
            max = y;
        }
    }

    console.log(`min: ${min}`)
    console.log(`max: ${max}`)
}

function test02() {
    const heimstaerke = randomInt(0, 99);
    const gaststaerke = randomInt(0, 99);

    const summe = heimstaerke + gaststaerke;
    const normierteHeimstaerke = parseFloat(heimstaerke) / summe;
    const normierteGaststaerke = parseFloat(gaststaerke) / summe;

    const sieger = Math.random() < normierteHeimstaerke ? "Heim" : "Gast";

    console.log(`Heim : Gast = ${heimstaerke} : ${gaststaerke} = ${normierteHeimstaerke} : ${normierteGaststaerke}, Sieger ist ${sieger}`);
}

function test03() {
    const heimstaerke = randomInt(0, 99);
    const gaststaerke = randomInt(0, 99);

    const random = randomInt(0, heimstaerke + gaststaerke);
    const sieger = random < heimstaerke ? "Heim" : "Gast";

    console.log(`Heim : Gast = ${heimstaerke} : ${gaststaerke}, random(0, ${heimstaerke + gaststaerke}) = ${random} ==> Sieger ist ${sieger}`);
}

function test04() {
    const heimstaerke = 51;
    const gaststaerke = 49;

    let heimsieger = 0;
    let gastsieger = 0;
    const numberOfRuns = 100000000;

    for (let i = 0; i < numberOfRuns; i++) {
        randomInt(0, heimstaerke + gaststaerke) < heimstaerke ? heimsieger++ : gastsieger++;
    }

    console.log(`erwartete Verteilung 0.51 : 0.49`);
    console.log(`ermittelte Verteilung ${parseFloat(heimsieger) / numberOfRuns} : ${parseFloat(gastsieger) / numberOfRuns}`);
}



test04()
