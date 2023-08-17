const buttonQty = document.querySelector('.item__cantidad');
const shopButton = document.querySelector('#shop-button')

function getProductsShopp() {
  const containerProducts = document.querySelector('.info__products');
  const products = JSON.parse(localStorage.getItem('shopping')) ?? [];
  console.log(products);
  if(products.length >= 1) {
    shopButton.disabled = false;
    products.forEach(element => {
      const HTML = `
      
      <div class="info__products--item" data-id="${element.id}">
        <div class="item__title">
          <h5 id="item__name">${element.title}</h5>
        </div>
        <div class="item__cantidad">
          <input type="number" min="1" max="12" value="${element.qty}">
        </div>
        <div class="item__delete">
          <div class="fa-solid fa-x" data-name="delete">
            
          </div>
        </div>
      </div>

      `
      containerProducts.innerHTML += HTML;

      
    });
  } else {
    shopButton.disabled = true;
  }
}

function changeQty(input) {
  const value = input.value;
  const valueId = input.parentElement.parentElement.dataset.id;
  value < 1 ? input.value = 1 : null;
  value > 10 ? input.value = 10 : null;
  const products = JSON.parse(localStorage.getItem('shopping'));

  for(let i = 0; i < products.length; i++) {
    if(products[i].id == valueId && value > 0 && value <=10) {
      products[i].qty = value;
      break
    }
  }
  localStorage.setItem('shopping', JSON.stringify(products));
}

getProductsShopp();

document.addEventListener('click', e => {
  if(e.target.dataset.name === 'delete') {
    const element = e.target.parentElement.parentElement;
    const valueId = e.target.parentElement.parentElement.dataset.id;
    element.remove();
    const products = JSON.parse(localStorage.getItem('shopping'));
    for(let i = 0; i<products.length; i++) {
      if(products[i].id == valueId) {
        products.splice(i, 1);
      }
    }
    localStorage.setItem('shopping', JSON.stringify(products));
    products.length === 0 ? shopButton.disabled = true : null;
  }
})

document.addEventListener('change', e => {
  if(e.target.nodeName === 'INPUT') {
    changeQty(e.target);
  }
})

shopButton.addEventListener('click', async () => {
  try {
    const [_, token] = document.cookie.split('=');
    const products = localStorage.getItem('shopping');
    const response = await fetch('https://store-front-zio1.onrender.com/api/v1/payment', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: products
    });
    const data = await response.json();

    if(data.error) throw new Error(data.statusCode);

    location.href = data.url;
  } catch (error) {
    if(error.message == 401) {
      location.href = '/signin';
    }
  }
  
})
