router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
  
  router.get('/',
      async (req, res, next) => {
          const sql = 'SELECT * FROM meeps';
          result = await query(sql);
          res.send(result);        
  });
  
  router.get('/new',
      verify,
      (req, res, next) => {
          res.render('meepsform');
  });
  
  router.get('/:id',
      param('id').isInt(),
      async (req, res, next) => {
          const sql = 'SELECT * FROM meeps WHERE meeps.id = ?';
          result = await query(sql, req.params.id);
          res.send(result);
  });
  
  router.post('/',
      body('body').notEmpty(),
      verify,
      async (req, res, next) => {
          const sql = 'INSERT INTO meeps (user_id, body, created_at, updated_at) VALUES (?, ?, now(), now())';
          const result = await query(sql, [req.session.userid, req.body.body]);
          if (result.insertId > 0) {
              res.redirect('/meeps/' + result.insertId);
      }
  });
  
  router.get('/update/:id',
      param('id').isInt(),
      verify,
      async (req, res, next) => {
          const sql = 'SELECT meeps.*, users.name FROM meeps JOIN users ON meeps.user_id = users.id WHERE meeps.id = ?';
          result = await query(sql, req.params.id);
          res.render('meepsform', { meep: result[0] });
  });
  
  router.post('/update',
      body('meepid').isInt(),
      body('body').notEmpty(),
      verify,
      async (req, res, next) => {
          const sql = 'UPDATE meeps SET body = ?, updated_at = now() WHERE id = ?';
          const result = await query(sql, [req.body.body, req.body.meepid]);
          if (result.changedRows > 0) {
              res.redirect('/meeps/' + req.body.meepid);
          }
  });
  
  router.post('/delete/',
      body('meepid').isInt(),
      verify,
      async (req, res, next) => {
          const sql = 'DELETE FROM meeps WHERE id = ?';
          const result = await query(sql, req.body.meepid);
          if (result.affectedRows > 0) {
              res.redirect('/meeps');
          }
  });
  
  res.render('meeps', { meeps: result });
  
  module.exports = router;