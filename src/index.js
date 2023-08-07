const fetch = require('node-fetch')
const express = require('express');
const app = express();
const path = require('path');

app.set('port', process.env.PORT | 4000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/public')));

app.use((req, res ,next) => {
  app.locals.user ??= undefined;
  console.log(app.locals.user);
  next();
})

const isAuthenticate = (req, res, next) => {
  if(!app.locals.user) {
    return res.redirect('/');
  }
  next();
}

const noAuthenticate = (req, res, next) => {
  if(app.locals.user) {
    return res.redirect('/profile');
  }
  next();
}

app.get('/', async (req, res) => {
  const response = await fetch('https://store-proyect.onrender.com/api/v1/products?offset=0&limit=6');
  const data = await response.json();
  res.render('pages', {
    products: data
  });
})

app.get('/profile', isAuthenticate, async (req, res) => {
  res.render('pages/profile');
})

app.get('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reponse = await fetch('https://store-proyect.onrender.com/api/v1/products/'+id);
    const data = await reponse.json();

    res.render('pages/single', {
      product: data[0]
    });
  } catch (error) {

  }
})

app.get('/shopping', (req, res) => {
  res.render('pages/shop');
})

app.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  const response = await fetch('https://store-proyect.onrender.com/api/v1/products/category/'+category);
  const data = await response.json();

  res.render('pages/presentation', {
    products: data,
    search: data[0].category.category_name
  })
})

app.get('/search', async (req, res) => {
  const { valueSearch } = req.query;
  const response = await fetch('https://store-proyect.onrender.com/api/v1/products/title/'+valueSearch);
  const data = await response.json();
  res.render('pages/search', {
    products: data,
    search: valueSearch 
  })
})

app.get('/signin', noAuthenticate, (req, res) => {
  res.render('pages/signin', {
    error: undefined
  });
})

app.get('/signup', noAuthenticate, (req, res) => {
  res.render('pages/signup.ejs', {
    error: undefined
  });
})

app.post('/signin', noAuthenticate, async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await fetch('https://store-proyect.onrender.com/api/v1/auth/signin', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })
    });
    const data = await response.json();
    
    if(data.error) throw new Error(data.message);

    app.locals.user = data.user;
    res.cookie('token_jwt', data.token);
    res.redirect('/profile');
  } catch (error) {
    res.render('pages/signin', {
      error: error.message
    });
  }
  
})

app.post('/signup', noAuthenticate, async (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    const response = await fetch('https://store-proyect.onrender.com/api/v1/auth/signup', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        username
      })
    })
    const data = await response.json();

    if(data.error) throw new Error(data.message)
    
    app.locals.user = data.user;
    res.cookie('token_jwt', data.token);
    res.redirect('/profile');
  } catch (error) {
    res.render('pages/signup', {
      error: error.message
    })
  }
})

app.get('/recovery', noAuthenticate, (req, res) => {
  res.render('pages/recovery', {
    error: undefined
  });
})

app.get('/change-password', noAuthenticate, (req, res) => {
  const token = req.query.token ?? undefined
  res.render('pages/change.ejs', {
    error: undefined,
    token
  })
})
app.post('/change-password', noAuthenticate, async (req, res) => {
  const { password } = req.body;
  const { token } = req.query;

  const response = await fetch('https://store-proyect.onrender.com/api/v1/auth/change-password', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      newPassword: password,
      token
    })
  })
  const data = await response.json();
  console.log(data);
  res.render('pages/change.ejs', {
    error: 'change password',
    token: undefined
  })
})


app.post('/recovery', noAuthenticate, async (req, res) => {
  const { email } = req.body;
  const response = await fetch('https://store-proyect.onrender.com/api/v1/auth/recovery', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      email
    })
  })
  const data = await response.json();
  console.log(data);
  res.render('pages/recovery', {
    error: 'Revisa tu correo'
  })
})

app.get('/success', isAuthenticate, (req, res) => {
  res.render('pages/success');
})

app.get('/logout', isAuthenticate, (req, res) => {
  app.locals.user = undefined;
  res.clearCookie('token_jwt');
  res.redirect('/');
})

app.listen(app.get('port'), () => {
  console.log('server inicilizado en port:', app.get('port'))
})