const express = require('express');
const app = express();
const handlesRouter = require('./handles');
//app.use(bodyParser.json());
app.use('/', handlesRouter); // Utilisez le routeur dans l'application principale

const port = process.env.PORT || 8080; // Utilisez le port 8080 (ou configurez-le selon vos besoins)

app.listen(port, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
});