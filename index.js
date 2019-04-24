const express = require('express')
const app = express()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const port = 8082

app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('upload', { title: 'Upload de video para o Vimeo' })
})

app.post('/upload', upload.single('video'), (req, res) => {
    let Vimeo = require('vimeo').Vimeo;
    let client = new Vimeo( "b3fd9e33a7266c33b371d3d7b7c64a5d51d1111d", "muK7ycjf08yQmwgGEb0Pru0KE7/BzYbWJW1eA9+tml5Q47tBpXZbBaUGAN99HDG5rGXV5Ir6x14TDxOhXIN52Rq3jkDfiifBU9XHdEYd4Zybflxn0vC7rD3qmxOVFi3T", "26390a65e4241d1c96537b774a980b4d");
    let file_name = req.file.path
    client.upload(
        file_name,
        {
          'name': req.body.title,
          'description': req.body.description
        },
        function(uri) {
            console.log('Seu video URI é: ' + uri);
            client.request(uri, function(error, body, statusCode, headers){
                if (error) {
                      console.log('Algum erro ocorreu, que foi o seguinte: ' + error);
                      return
                }
                setTimeout(function(){
                    res.render( 'sucess', { name: req.body.name, link: body.link, player: body.embed.html } )
                },60000);
            })
        },
        function(bytes_uploaded, bytes_total) {
             var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
             //res.render( 'porcentagem', { porcentagem: percentage + '%' } )
             console.log(bytes_uploaded, bytes_total, percentage + '%')
        },
        function(error) {
            console.log('Falhou!! ' + error)
        }
    )

})

app.listen(port, () => console.log(`Servidor rodando na porta: ${port}!`))
