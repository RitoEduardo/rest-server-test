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

// =========================================
//           VENCIMIENTO DE TOKEN
// =========================================

process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 35;

// =========================================
//           SEED TOKEN AUTH
// =========================================

process.env.SEED_TOKEN = 'secret';

// =========================================
//           GOOGLE CLIENT ID
// =========================================

process.env.CLIENT_ID = process.env.CLIENT_ID || "876638959603-gmo1erk03esb7g8blprkg6e02b78ba9a.apps.googleusercontent.com";