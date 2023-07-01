document.addEventListener('DOMContentLoaded', () => {
    const listaProductos = document.querySelector(".listado");
    renderizarProductos(listaProductos);
    mostrarCarrito();
  });
  
  async function renderizarProductos(listaProductos) {
    const res = await fetch("./data.json");
    const data = await res.json();
  
    listaProductos.innerHTML = '';
  
    data.forEach((producto) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="card" style="width: 18rem;">
            <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
            <div class="card-body">
              <h5>${producto.nombre}</h5>
              <p class="card-text">Precio: $${producto.precio.toFixed(2)}</p>
              <a href="#" class="btn btn-primary" onClick="agregarAlCarrito(${producto.id})">Comprar</a>
            </div>
          </div>
        `;
      listaProductos.append(li);
    });
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
  
  function mostrarCarrito() {
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
  }
  