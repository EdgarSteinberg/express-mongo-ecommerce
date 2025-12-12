import multer from "multer";
import path from 'path';
import __dirname from "./dirname.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/img'));
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

export const uploader = multer({storage});


/*
req.file.path	Ruta completa del archivo (fea, larga, depende de tu PC)
    const mainImage = req.file.path;
req.file.destination	Carpeta donde se guardó
    const mainImage = `/img/${req.file.filename}`;
req.file.filename	Solo el nombre del archivo ✔ 
    const mainImage = req.file.filename;
*/
