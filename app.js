const productos = [
    {
      id: 1,
      nombre: "alimentoPuppy",
      precio: 15700,
      imagen: "./img/excellent-puppy.jpg"
    },
    {
      id: 2,
      nombre: "alimentoAdulto",
      precio: 14700,
      imagen: "./img/excellent-adulto.jpg"
    },
    {
      id: 3,
      nombre: "bebedero",
      precio: 4700,
      imagen: "./img/bebedero-comedero.webp"
    },
    {
      id: 4,
      nombre: "bandejaSanitaria",
      precio: 8700,
      imagen: "./img/bandeja-sanitaria.png"
    }
  ];
  
  document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos();
    mostrarCarrito();
  });
  
  function renderizarProductos() {
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = '';
  
    productos.forEach((producto) => {
      const divProducto = document.createElement('div');
      divProducto.classList.add('producto');
      divProducto.innerHTML = `
        <div class="card" style="width: 18rem;">
          <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
          <div class="card-body">
            <h5>${producto.nombre}</h5>
            <p class="card-text">Precio: $${producto.precio.toFixed(2)}</p>
            <a href="#" class="btn btn-primary" onClick="agregarAlCarrito(${producto.id})">Comprar</a>
          </div>
        </div>
      `;
      listaProductos.appendChild(divProducto);
    });
  }
  
  function agregarAlCarrito(id) {
    let carrito = obtenerCarrito();
  
    const productoSeleccionado = productos.find((producto) => producto.id === id);
  
    if (productoSeleccionado) {
      carrito.push(productoSeleccionado);
      guardarCarrito(carrito);
      mostrarCarrito();
    }
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