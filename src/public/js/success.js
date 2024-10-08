import { URL_API } from "./api.js";

async function saveOrder() {
  const [_,token] = document.cookie.split('=');
  const products = localStorage.getItem('shopping');
  console.log(products);
  const response = await fetch(`${URL_API}order-products`, {
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