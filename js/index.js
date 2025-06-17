let carrito = [];
let contador = 0;

document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".producto button");
  const contadorCarrito = document.getElementById("contador-carrito");
  const resumenCarrito = document.getElementById("resumen-carrito");
  const iconoCarrito = document.getElementById("icono-carrito");
  const botonVaciar = document.getElementById("vaciar-carrito");

  // 🧠 Cargar del localStorage
  const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
  if (carritoGuardado) {
    carrito = carritoGuardado;
    contador = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contadorCarrito.textContent = contador;
  }

  botones.forEach(boton => {
    boton.addEventListener("click", (e) => {
      const producto = e.target.parentElement;
      const nombre = producto.querySelector("h5").textContent;
      const precioTexto = producto.querySelector("p").textContent;
      const precio = parseFloat(precioTexto.replace(/[^0-9.]/g, ""));

      const item = carrito.find(p => p.nombre === nombre);
      if (item) {
        item.cantidad++;
      } else {
        carrito.push({ nombre, precio, cantidad: 1 });
      }

      contador++;
      contadorCarrito.textContent = contador;
      localStorage.setItem("carrito", JSON.stringify(carrito));
    });
  });

  iconoCarrito.addEventListener("click", () => {
    if (resumenCarrito.classList.contains("oculto")) {
      mostrarResumen();
    } else {
      resumenCarrito.classList.add("oculto");
      botonVaciar.classList.add("oculto");
    }
  });

  botonVaciar.addEventListener("click", () => {
    carrito = [];
    contador = 0;
    contadorCarrito.textContent = contador;
    localStorage.removeItem("carrito");
    mostrarResumen();
    resumenCarrito.classList.add("oculto");
    botonVaciar.classList.add("oculto");
  });

  function mostrarResumen() {
    resumenCarrito.innerHTML = "<h3>Resumen de compra</h3>";
    let total = 0;

    carrito.forEach((item, index) => {
      total += item.precio * item.cantidad;
      resumenCarrito.innerHTML += `
        <div class="item-carrito">
          <strong>${item.nombre}</strong><br>
          Precio: ${item.precio} x 
          <input type="number" value="${item.cantidad}" min="1" data-nombre="${item.nombre}" class="cantidad-input">
          <button class="eliminar-item" data-index="${index}">Eliminar</button>
        </div>`;
    });

    resumenCarrito.innerHTML += `<p><strong>Total: ${total.toFixed(2)} soles</strong></p>`;
    resumenCarrito.classList.remove("oculto");
    botonVaciar.classList.remove("oculto");

    // Cambiar cantidades
    document.querySelectorAll(".cantidad-input").forEach(input => {
      input.addEventListener("change", (e) => {
        const nuevoValor = parseInt(e.target.value);
        const nombre = e.target.getAttribute("data-nombre");
        const prod = carrito.find(p => p.nombre === nombre);
        contador += nuevoValor - prod.cantidad;
        prod.cantidad = nuevoValor;
        contadorCarrito.textContent = contador;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarResumen(); // actualizar vista
      });
    });

    // Eliminar producto individual
    document.querySelectorAll(".eliminar-item").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        contador -= carrito[index].cantidad;
        carrito.splice(index, 1);
        contadorCarrito.textContent = contador;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarResumen();
      });
    });
  }
});
