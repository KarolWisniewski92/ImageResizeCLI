const sharp = require('sharp');
const fs = require('fs');

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

fs.readdir(inputData.path, (err, data) => {
    if (err) {
        console.log(err)
    }
    
    console.log(data)
})

const inputFilePath = '';
const outputFilePath = '';

// sharp(inputFilePath).resize({ [inputData.direction]: inputData.size }).toFile(outputFilePath)
//     .then(function (newFileInfo) {
//         console.log("Image Resized");
//     })
//     .catch(function (err) {
//         console.log("Got Error");
//     });





