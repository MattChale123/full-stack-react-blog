var express = require('express');
var router = express.Router();
const models = require('../models')
const bcrypt = require('bcrypt')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// POST /api/v1/users/register
router.post('/register', async (req, res) => {
  // check for username and password on req
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      error: 'Please include username and password'
    })
  }

  // check database for existing user 
  const user = await models.User.findOne({
    where: {
      username: req.body.username
    }
  })
    // if exists, send error
    if (user) {
      return res.json(400).json({
        error: 'Username already in use. Pick another'
      })
    }
  // hash password
  const hash = await bcrypt.hash(req.body.password, 10)
  // create user
  const newUser = await models.User.create({
    username: req.body.username,
    password: hash
  })

  // respond with success message
  return res.status(201).json({})
})
router.post('/login', async (req, res) => {
  // check for usernam password
    // if not there, send error
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        error: 'Please include username and password'
      })
    }
  // find user from username
    const user = await models.User.findOne({
      where: {
        username: req.body.username
      },
    })
  // if no user, send error
    if (!user) {
      return res.status(404).json({
        error: 'Username already in use.'
      })
    }
  // check password
    const match = await bcrypt.compare(req.body.password, user.password)
    // if no match, send error
    if (!match) {
      return res.status(401).json({
        error: "Password incorrect"
      })
    }
  // store user info in session
    req.session.user = user

    const userResonse = user;
    delete user.password

  // respond with user info
  res.json({
    id: user.id,
    username: user.username,
    updatedAt: user.updatedAt
  });
})
router.get('/logout', (req, res) => {
  req.session.user = null

  res.json({
    success: 'LoL'
  })
})
router.get('/current', (req, res) => {
  const { user } = req.session
    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        updatedAt: user.updatedAt,
        })
      } else {
        res.status(401).json({
          error: 'Not logged in',
        });
    }
  
})

module.exports = router;
