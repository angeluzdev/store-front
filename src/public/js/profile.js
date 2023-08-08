async function getOrdersByUser() {
  console.log(document.cookie);
  const container = document.querySelector('.orders__content');
  const response = await fetch('https://store-proyect.onrender.com/api/v1/order-products/my-orders', {
    method: 'GET',
    credentials: 'include'
  });
  const data = await response.json();
  console.log(data)
  if(data.length === 0) container.innerHTML = '<h4>Aún no tienes compras</h4>'
  data.forEach(e => {
    const details = document.createElement('details');
    details.className = 'content__item--container';
    const date = new Date(e.create_at).toLocaleDateString();
    const monto = e.products.reduce((t, v) => t+=v.qty * v.price, 0);
    console.log(monto)
    const structHeader = `
      <summary>
        <p>N: ${e.id}</p>
        <p>Date: ${date}</p>
        <p>Monto: ${monto}</p>
      </summary>
      <div id="order__header">
        <p>Nombre</p>
        <p>Cantidad</p>
        <p>Precio/unit</p>
      </div>
    `;
    details.innerHTML = structHeader;
    for(let i=0; i <e.products.length; i++) {
      const structBody = `
    <div class="item__content--order">
      <a href="/product/${e.products[i].product_id}">${e.products[i].title}</a>
      <p>${e.products[i].qty}</p>
      <p>${e.products[i].price}$</p>
    </div>
    <hr>
    `
      details.innerHTML += structBody;
    }
    

    container.append(details);
  })

  console.log(data);
}
getOrdersByUser();