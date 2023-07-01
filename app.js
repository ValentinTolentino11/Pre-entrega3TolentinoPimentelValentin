document.addEventListener('DOMContentLoaded', () => {
  renderizarProductos();
  listaProductos;
  mostrarCarrito();
});

const listaProductos = document.querySelector(".listado");

const renderizarProductos = async()=> {
  const res = await fetch("./data.json")
  const data = await res.json()

  listaProductos.innerHTML = '';

  data.forEach((producto)=>{
    const li = document.createElement('li')
      li.innerHTML=`
      <div class="card" style="width: 18rem;">
          <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
          <div class="card-body">
            <h5>${producto.nombre}</h5>
            <p class="card-text">Precio: $${producto.precio.toFixed(2)}</p>
            <a href="#" class="btn btn-primary" onClick="agregarAlCarrito(${producto.id})">Comprar</a>
          </div>
        </div>
      `;
    listaProductos.append(li)
  })
}

function agregarAlCarrito(id) {
  let carrito = obtenerCarrito();
  
  const productoSeleccionado = obtenerProductos().find((producto) => producto.id === id);
  if (productoSeleccionado) {
    carrito.push(productoSeleccionado);
      guardarCarrito(carrito);
      mostrarCarrito();
  }
}
  
async function agregarAlCarrito(id) {
  let carrito = obtenerCarrito();
  
  const productoSeleccionado = await obtenerProductoPorId(id);
  
  if (productoSeleccionado) {
    carrito.push(productoSeleccionado);
    guardarCarrito(carrito);
    mostrarCarrito();
  }
}
  
async function obtenerProductoPorId(id) {
  const res = await fetch("./data.json");
  const data = await res.json();
  return data.find((producto) => producto.id === id);
}
  
function obtenerCarrito() {
  const carrito = localStorage.getItem('carrito');
  return carrito ? JSON.parse(carrito) : [];
}
  
function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}
  
/*function mostrarCarrito() {
  const carrito = obtenerCarrito();
  const carritoLista = document.getElementById('carrito-lista');
  const totalElement = document.getElementById('total');
  
  carritoLista.innerHTML = '';
  carrito.forEach((producto) => {
    const li = document.createElement('li');
    li.classList.add('carrito-item');
    li.innerHTML = `
      <span>${producto.nombre}</span>
      <span>$${producto.precio.toFixed(2)}</span>
    `;
    carritoLista.appendChild(li);
  });
  
  const total = carrito.reduce((acumulador, producto) => acumulador + producto.precio, 0);
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
  }
  
  function vaciarCarrito() {
    localStorage.removeItem('carrito');
    mostrarCarrito();
  }*/

  function mostrarCarrito() {
    const carrito = obtenerCarrito();
    const carritoLista = document.getElementById('carrito-lista');
    const totalElement = document.getElementById('total');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
  
    carritoLista.innerHTML = '';
  
    const productosAgregados = {};
    carrito.forEach((producto) => {
      if (!productosAgregados[producto.id]) {
        productosAgregados[producto.id] = {
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1
        };
      } else {
        productosAgregados[producto.id].cantidad++;
      }
    });
  
    let total = 0;
  
    for (let productId in productosAgregados) {
      if (productosAgregados.hasOwnProperty(productId)) {
        const producto = productosAgregados[productId];
        const li = document.createElement('li');
        li.classList.add('carrito-item');
        li.innerHTML = `
          <span>${producto.nombre} (x${producto.cantidad})</span>
          <span>$${(producto.precio * producto.cantidad).toFixed(2)}</span>
        `;
        carritoLista.appendChild(li);
        total += producto.precio * producto.cantidad;
      }
    }
  
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
  
    // Agregar el controlador de eventos para vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
      vaciarCarrito();
      mostrarCarrito(); // Vuelve a mostrar el carrito actualizado (vacío)
    });
  }
  function vaciarCarrito() {
    localStorage.removeItem('carrito');
    mostrarCarrito();
  }
  
 
  