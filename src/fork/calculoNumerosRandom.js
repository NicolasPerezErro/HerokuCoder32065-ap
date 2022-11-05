function numerosRandom(cant) {
    const obj = {};
    for (let i = 0; i < cant; i++) {
        let randomNumber = Math.ceil(Math.random() * 1000);
        if (obj[randomNumber]) {
            obj[randomNumber]++;
        } else {
            obj[randomNumber] = 1;
        }
        obj[randomNumber] ? obj[randomNumber] : obj[randomNumber] = 0
    }
    return obj
}

process.on('message', (msg) => {
    if (msg === 'start') {
        console.log('Child process received START message');
        let result = numerosRandom(600000000);
        process.send(result);

    }
})