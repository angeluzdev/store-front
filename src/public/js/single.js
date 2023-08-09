const URL_API = 'https://store-proyect.onrender.com';
const buttonCart = document.querySelector('#product__button');
const productDescription = document.querySelector('.info__description');

document.addEventListener('click', (e) => {
  if(e.target.id === 'product__category') {
    console.log(e.target.dataset.id);
    location.href = '/category/'+e.target.dataset.id;
  }
})

document.addEventListener('submit', async (e) => {
  try {
    e.preventDefault();
    const [_, token] = document.cookie.split('=');
    const coment = document.querySelector('textarea').value;
    const pid = location.href.split('/').pop();
    const response = await fetch('https://store-proyect.onrender.com/api/v1/reviews/add', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        content: coment,
        product_id: pid
      })
    })
    const data = await response.json();
    console.log(data);
    if(data.error) throw new Error(data.statusCode);
    location.href = '/product/'+pid;
  } catch (error) {
    if(error.message === '401') {
      alert('Inicia sesión para comentar');
      location.href = '/signin';
    }
  }
  
})

buttonCart.addEventListener('click', () => {
  const title = productDescription.querySelector('h3').innerHTML;
  const id = productDescription.dataset.idp;

  let products = localStorage.getItem('shopping') ?? '[]';
  products = JSON.parse(products);

  for(let i=0; i<products.length; i++) {
    if(products[i].id == id) {
      products[i].qty += 1;
      localStorage.setItem('shopping', JSON.stringify(products));
      return
    }
  }

  const newProduct = {
    id,
    title,
    qty: 1
  }
  products.push(newProduct);

  const productsSet = JSON.stringify(products);
  localStorage.setItem('shopping', productsSet);;
})