async function saveOrder() {
  const [_,token] = document.cookie.split('=');
  const products = localStorage.getItem('shopping');
  console.log(products);
  const response = await fetch('https://store-proyect.onrender.com/api/v1/order-products', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: products
  })
  localStorage.clear();
  location.href = '/';
}

saveOrder()