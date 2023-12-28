// ./handles.js
// Necessary imports


        //express
        const express = require('express')
        const router = express.Router()
        const fs = require('fs')
        //let jsonData = JSON.parse(fs.readFileSync('about.json', 'utf-8'))
        //res.writeHead(200, {'Content-Type': 'text/html'})


        router.use((req, res, next) => {
            console.log('Time: ', Date.now())
            next()
          })

          // define the home page route
          router.get('/', (req, res) => {

            const content = "<!DOCTYPE html>" +
                '<html>' +
                '    <head>' +
                '        <meta charset="utf-8" />' +
                '        <title>ECE AST</title>' +
                '    </head>' +
                '    <body>' +
                '       <a href="/hello?name=Thanushan">Thanushan</a>' +
                '<br/>'+
                '       <a href="/hello?name=Harold">Harold</a>' +
                '<br/>'+
                '       <a href="/hello?name=Victor">Victor</a>' +
                '    </body>' +
                '</html>'

            res.send(content)
          });


          router.get('/hello', (req, res) => {
            const name = req.query.name;

            if(name === 'Harold'){
                const message  = ` <br>je suis en prepa `
                res.send(`Hello ${name}`+ message);
        }
        else if(name === 'Thanushan'){
                const message  = ` <br>je suis en dut `
                res.send(`Hello ${name}`+ message);
        }
        else if(name === 'Victor'){
                const message  = ` <br>je suis en dut `
                res.send(`Hello ${name}`+ message);
        }
        else{
                res.write(" T'as choisi personne, Il y a une erreur CODE 404. <br>")
        }
});

// define the about route
router.get('/about',(req, res) => {
        try {
                const jsonData = JSON.parse(fs.readFileSync('about.json', 'utf-8'));
                const message = `title :` + jsonData.title + `<br>`+
                'content : ' + jsonData.content + '<br>'+
                'author : ' + jsonData.author + '<br>'+
                'date : ' + jsonData.date + '<br>'
                res.send(message);
        } catch (e) {
        res.status(500).send('Erreur fichier introuvable');
        }
        res.end();
})

module.exports = router;