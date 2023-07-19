document.addEventListener('DOMContentLoaded', () => {
  renderizarProductos();
  listaProductos;
  mostrarCarrito();
  mostrarDatosFormulario();
});

const listaProductos = document.querySelector(".listado");

const renderizarProductos = async() => {
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
          <a href="#" class="btn btn-primary" onClick="agregarAlCarritoAsync(${producto.id})">Comprar</a>
        </div>
      </div>
    `;

    listaProductos.append(li);
  });

  const formulario = document.querySelector('.formulario');
  formulario.addEventListener('submit', guardarDatosFormulario);
}

function agregarAlCarrito(id, event) {
  event.preventDefault();

  let carrito = obtenerCarrito();

  const productoSeleccionado = obtenerProductos().find((producto) => producto.id === id);
  if (productoSeleccionado) {
    carrito.push(productoSeleccionado);
    guardarCarrito(carrito);
    mostrarCarrito();
  }
}

async function agregarAlCarritoAsync(id) {
  let carrito = obtenerCarrito();

  const productoSeleccionado = await obtenerProductoPorId(id);

  if (productoSeleccionado) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Producto agregado',
      showConfirmButton: false,
      timer: 1500
    })
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
        <button class="eliminar-producto" onClick="eliminarDelCarrito(${productId})">Eliminar</button>
      `;
      
      carritoLista.appendChild(li);
      total += producto.precio * producto.cantidad;
    }
  }

  totalElement.textContent = `Total: $${total.toFixed(2)}`;

  vaciarCarritoBtn.addEventListener('click', () => {
    vaciarCarrito();
    mostrarCarrito();
  });
}

function restarCantidad(id) {
  let carrito = obtenerCarrito();

  const producto = carrito.find((item) => item.id === id);
  if (producto && producto.cantidad > 1) {
    producto.cantidad--;
    guardarCarrito(carrito);
    mostrarCarrito();
  }
}

function sumarCantidad(id) {
  let carrito = obtenerCarrito();

  const producto = carrito.find((item) => item.id === id);
  if (producto) {
    producto.cantidad++;
    guardarCarrito(carrito);
    mostrarCarrito();
  }
}

function eliminarDelCarrito(id) {
  let carrito = obtenerCarrito();

  const productoIndex = carrito.findIndex((producto) => producto.id === id);
  if (productoIndex !== -1) {
    carrito.splice(productoIndex, 1);
    guardarCarrito(carrito);
    mostrarCarrito();
  }
}

function vaciarCarrito() {
  Swal.fire(
    'Eliminar carro de compras',
    'Seguro quiere vaciar su carrito?',
    'question'
  )
  
  localStorage.removeItem('carrito');
  mostrarCarrito();
}

/*form*/
function mostrarDatosFormulario() {
  const nombre = localStorage.getItem('nombre') || '';
  const email = localStorage.getItem('email') || '';
  const telefono = localStorage.getItem('telefono') || '';

  document.getElementById('nombre').value = nombre;
  document.getElementById('email').value = email;
  document.getElementById('telefono').value = telefono;
}

function guardarDatosFormulario(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const telefono = document.getElementById('telefono').value;

  localStorage.setItem('nombre', nombre);
  localStorage.setItem('email', email);
  localStorage.setItem('telefono', telefono);
}

