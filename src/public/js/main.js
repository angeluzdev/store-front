import { URL_API } from "./api.js";
const containerProducts = document.querySelector('#section-products .products_items');
const formSearch = document.querySelector('#form-search');
const numbersSection = document.querySelector('#section-numbers');


formSearch.addEventListener('submit', (e) => {
  const input = document.querySelector('#input-search').value;
  if(input.length < 2) {
    e.preventDefault();
    alert('El valor de búsqueda debe tener dos o más caracteres')
  }
})

const createProduct = (data, container) => {
  data.forEach((e) => {
    const article = document.createElement('article');
    const img = document.createElement('img');
    const h3 = document.createElement('h3');
    const div = document.createElement('div');
    const pBrand = document.createElement('p');
    const pPrice = document.createElement('p');
    const ach = document.createElement('a');

    h3.classList.add('item__title');
    div.classList.add('item__info');
    pBrand.className = 'item__marca';
    pPrice.className = 'item__price';

    img.src = e.image;
    ach.href = '/product/'+e.id;
    ach.textContent = e.title;
    pBrand.textContent = e.brand;
    pPrice.textContent = e.price+'$';

    h3.appendChild(ach)
    div.append(pBrand, pPrice);
    article.appendChild(img);
    article.appendChild(h3);
    article.appendChild(div);

    container.append(article);
  })

}

async function getProducts(offset) {
  offset ??= 0
  const response = await fetch(`${URL_API}products?offset=${offset}&limit=6`);
  const data = await response.json();
  containerProducts.innerHTML = ''
  createProduct(data, containerProducts);
}

numbersSection.addEventListener('click', (e) => {
  console.log(e.target, 'elemento clickeado')
  if(e.target.nodeName === 'DIV') {
    console.log(e.target.innerHTML, 'valor del elemento')
    getProducts(e.target.innerHTML - 1);
  }
})

