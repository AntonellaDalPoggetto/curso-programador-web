var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();
var maquinasModel = require('../../models/maquinasModel');
var util = require('util');
var cloudinary = require('cloudinary').v2;
var uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

router.get('/', async function (req, res, next) {

    var maquinas = await maquinasModel.getMaquinas();
    
    maquinas = maquinas.map(maquina => {
        if (maquina.img_id) {
          const imagen = cloudinary.image(maquina.img_id, {
            width: 80,
            height: 80,
            crop: 'fill'
          });
          return {
            ...maquina,
            imagen
          }
        } else {
          return {
            ...maquina,
            imagen: ' '
          }
        }
      });

    res.render('admin/maquinas', {
        layout: 'admin/layout',
        usuario: req.session.nombre, 
        maquinas
    });

});

router.get('/eliminar/:id', async (req, res, next) => {
    var id = req.params.id;
    let maquina = await maquinasModel.getMaquinasById(id);
    if (maquina.img_id) {
      await (destroy(maquina.img_id));
    }
    await maquinasModel.deleteMaquinasById(id);
    res.redirect('/admin/maquinas')
});


router.get('/agregar', (req, res, next) => {
    res.render('admin/agregar', {
        layout: 'admin/layout'
    })
});

router.post('/agregar', async (req, res, next) => {
    console.log(req.body)
    try {

        var img_id = '';
        if (req.files && Object.keys(req.files).length > 0) {
          imagen = req.files.imagen;
          img_id = (await uploader(imagen.tempFilePath)).public_id;
        }

        if (req.body.titulo != "" && req.body.cuerpo != "") {
            await maquinasModel.insertMaquina({
                ...req.body,
                img_id
            });
            res.redirect('/admin/maquinas')
        } else {
            res.render('admin/agregar', {
                layout: 'admin/layout',
                error: true,
                message: 'todos los campos son requerido'
            })
        }
    } catch (error) {
        console.log(error)
        res.render('admin/agregar'), {
            layout: 'admin/layout',
            error: true,
            message: 'no se cargo la novedad'
        }
    }
})

router.get('/modificar/:id', async (req, res, next) => {
    var id = req.params.id;
    var maquina = await maquinasModel.getMaquinasById(id);

    res.render('admin/modificar', {
        layout: 'admin/layout',
        maquina
    });
});

router.post('/modificar', async (req, res, next) => {
    try {

        let img_id = req.body.img_original;
        let borrar_img_vieja = false;
    
        if (req.body.img_delete === "1") {
          img_id = null;
          borrar_img_vieja = true;
        } else {
          if (req.files && Object.keys(req.files).length > 0) {
            imagen = req.files.imagen;
            img_id = (await uploader(imagen.tempFilePath)).public_id;
            borrar_img_vieja = true;
          }
        }
        if (borrar_img_vieja && req.body.img_original) {
          await (destroy(req.body.img_original));
        }


        //console.log(req.body.id);
        //console.log(req.body);
        var obj = {
            titulo: req.body.titulo,
            cuerpo: req.body.cuerpo,
            img_id
        }
        //console.log(obj)
        await maquinasModel.modificarMaquinaById(obj, req.body.id);
        res.redirect('/admin/maquinas');
    } catch (error) {
        console.log(error)
        res.render('admin/modificar', {
            layout: 'admin/layout',
            error: true,
            message: 'no se modifico la maquina'
        })
    }
});


module.exports = router;