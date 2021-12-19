const express = require('express')
const multer = require('multer')
const { Sequelize, QueryTypes } = require('sequelize')
const router = express.Router()
const { Images, Posts, Users } = require('../models')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const sequelize = new Sequelize('instagram', 'root', 'myroot', {
    dialect: 'mysql',
    host: 'localhost',
    timestamps: false,
    pool: {
      max: 3,
      min: 0,
      idle: 10000
    },
})

const upload = multer({storage}).single('file')

router.get('/list/:rows?', async (req, res) => {
    let row = 0
    if (req.params.rows !== undefined) {
        row = req.params.rows
    }
    const query = `SELECT Posts.description, Posts.id AS postId, Users.username, Users.photo AS profile, Users.id AS userId, Images.photo FROM Posts INNER JOIN Users ON Posts.UserId = Users.id INNER JOIN Images ON Posts.id = Images.PostId ORDER BY Posts.createdAt DESC LIMIT ${row}, 3`

    const posts = await sequelize.query(query, { type: QueryTypes.SELECT })

    res.json(posts)
})

router.get('/:id', (req, res) => {
    res.json(req.params.id)
})

const deleteImg = async (img) => {
    await fs.unlink(img, (a) => {
        console.log(a)
    })
}

router.post('/create', (req, res) => {
    if (req.user) {
        Posts.create({ description: req.body.title, UserId: req.user.id })
        .then((resp) => {
            const iid = resp.dataValues.id
            Images.create({ photo: req.body.img, PostId: iid })
                .then((img) => {
                    res.send({ result: 'success', data: { profile: req.user.photo, postId: iid, username: req.user.username, description: resp.dataValues.description, photo: img.dataValues.photo } })
                })
        })
    } else {
        deleteImg(`public/${req.body.img}`)
        res.send({ result: 'faild' })
    }
})

router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    images = await Images.findAll({ where: { PostId: id } })
    images.forEach(img =>  {
        deleteImg(`public/${img.photo}`)
    })
    Posts.destroy({ where: { id: id } })
    res.json({ result: 'success' })
    
})

router.post('/photo', (req, res) => {
    upload(req, res, (err) => {
        if (err) throw err
        res.json(req.file)
    })
})

module.exports = router