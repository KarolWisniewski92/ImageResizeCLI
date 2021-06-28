const sharp = require('sharp');
const fs = require('fs');
const { ifError } = require('assert');

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
const dataToCheck = ['path', 'size', 'direction'];
const action = ['width', 'height'];

let isError;
dataToCheck.forEach(el => {
    if (inputData[el] == undefined) {
        console.log(`Nie wprowadzono parametru "--${el}"!`)
        isError = true;
    }
})
if (isError) return;

if (isNaN(inputData.size)) {
    console.log(`Wprowadzono błędnie parametr "--size"!`)
    return;
}

if (!action.includes(inputData.direction)) {
    console.log(`Wprowadzono błędnie parametr "--direction"! Dozwolone wartości to: ${action.join(', ')}!`)
    return;
}

fs.stat(inputData.path, (err, stat) => {
    if (err) {
        console.log(`Wprowadzono błędny parametr "--path", katalog nie istnieje!`)
        return;
    }
})

const createDir = () => {
    return new Promise((resolve) => {
        fs.stat(inputData.path + '\\' + '_small', (err, stat) => {
            if (err) {
                console.log(`Utworzono katalog`)
                fs.mkdirSync(inputData.path + '\\' + '_small')
                resolve();
            } else {
                console.log(`był już katalog`)
                resolve();
            }
        })
    })
}

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


const resizePhoto = async () => {

    await createDir();
    const photos = await getPhoto();
    const linkPhoto = photos.map(el => {
        return inputData.path + '\\' + el;
    })
    const results = await Promise.all(linkPhoto.map(el => { return isDirectory(el) }))

    const onlyPhoto = photos.filter((el, id) => {
        if (results[id] === false) {
            return el
        } else {
            return
        }
    })

    onlyPhoto.forEach((el) => {

        const inputFilePath = inputData.path + '\\' + el;
        const outputFilePath = inputData.path + '\\' + '_small' + '\\' + el;

        console.log(inputFilePath)
        console.log(outputFilePath)
    })

}
resizePhoto();



// sharp(inputFilePath).resize({ [inputData.direction]: inputData.size }).toFile(outputFilePath)
//     .then(function (newFileInfo) {
//         console.log("Image Resized");
//     })
//     .catch(function (err) {
//         console.log("Got Error");
//     });





