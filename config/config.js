// =========================================
//                  PUERTO
// =========================================
process.env.PORT = process.env.PORT || 3000;

// =========================================
//                 ENTORNO
// =========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =========================================
//              BASE DE DATOS
// =========================================
let urlDB = "";
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee'
} else {
    urlDB = 'mongodb+srv://admin_edo:mongous_1547878@cluster0-xjare.mongodb.net/coffee?retryWrites=true&w=majority'
}
process.env.MONGO_DB = urlDB;