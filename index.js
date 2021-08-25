const sharp = require('sharp');
const fs = require('fs');

//Pobiera wprowadzone parametry
const inputArgv = process.argv.slice(2)
let inputData = {}

inputArgv.forEach((el, id, array) => {
    const regExp = /--\w*/;
    if (regExp.test(el) && id !== array.length - 1) {
        if (!regExp.test(array[id + 1])) {
            if (el === '--size') {
                inputData = {
                    ...inputData,
                    [el.slice(2)]: Number(array[id + 1])
                }
            } else {
                inputData = {
                    ...inputData,
                    [el.slice(2)]: array[id + 1]
                }
            }
        }
    }
})

const validation = () => {
    const dataToCheck = ['path', 'size', 'direction'];
    const action = ['width', 'height'];

    //Sprawdza czy podano wszystkie wymagane parametry
    let isError;
    dataToCheck.forEach(el => {
        if (inputData[el] == undefined) {
            console.log(`Nie wprowadzono parametru "--${el}"!`)
            isError = true;
        }
    })
    if (isError) (process.exit())

    //Sprawdza czy parametr --size jest liczbą
    if (isNaN(inputData.size)) {
        console.log(`Wprowadzono błędnie parametr "--size"!`)
            (process.exit())
    }

    //Sprawdza czy parametr --direction jest poprawny
    if (!action.includes(inputData.direction)) {
        console.log(`Wprowadzono błędnie parametr "--direction"! Dozwolone wartości to: ${action.join(', ')}!`)
            (process.exit())
    }

    //Sprawdza czy wskazany katalog istnieje
    fs.stat(inputData.path, (err, stat) => {
        if (err) {
            console.log(`Wprowadzono błędny parametr "--path", katalog nie istnieje!`)
                (process.exit())
        }
    })
}

//Tworzy pusty katalog _small we wskazanej lokalizacji
const createDir = () => {
    return new Promise((resolve) => {
        fs.stat(inputData.path + '\\' + '_small', (err, stat) => {
            if (err) {
                fs.mkdirSync(inputData.path + '\\' + '_small')
                resolve();
            } else {
                resolve();
            }
        })
    })
}

//Pobiera pliki z wskazanego katalogu
const getPhoto = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(inputData.path, function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        })
    })
}

// Sprawdza asynchronicznie czy podana ścieżka jest katalogiem
const isDirectory = (link) => {
    return new Promise((resolve, reject) => {
        fs.stat(link, (err, data) => {
            if (err) {
                console.log(err)
                reject();
            }
            if (data.isDirectory()) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    })
}

//Główna funkcja
const resizePhoto = async () => {
    validation();
    await createDir();
    const photos = await getPhoto();
    const linksToPhoto = photos.map(el => {
        return inputData.path + '\\' + el;
    })

    //Zwraca asynchronicznie tablicę true/false czy ścieżka jest katalogiem
    const results = await Promise.all(linksToPhoto.map(el => { return isDirectory(el) }))

    //Filtruje według wcześniej stworzonej tablicy true/false
    const onlyFiles = photos.filter((el, id) => {
        if (results[id] === false) {
            return el
        } else {
            return
        }
    })

    //Filtruje pliki nie będące plikami graficznymi
    const regExp = /\w*\.(jpge?|gif|png|bmp)/im
    const onlyGraphic = onlyFiles.filter(el => {

        if (regExp.test(el)) {
            return el;
        } else {
            return;
        }
    })

    onlyGraphic.forEach((el) => {

        const inputFilePath = inputData.path + '\\' + el;
        const outputFilePath = inputData.path + '\\' + '_small' + '\\' + el;

        sharp(inputFilePath).resize({ [inputData.direction]: inputData.size }).toFile(outputFilePath)
            .then(function (newFileInfo) {
                console.log(`Sukces - Plik ${el} został przeskalowany!`);
            })
            .catch(function (err) {
                console.log(`Błąd - Nie udało się przeskalować pliku ${el}`);
            });
    })

}
resizePhoto();