// Carga de módulos
function loadModules() {
  return new Promise((resolve) => {
    import('./generate.js')
    import('./save.js')
    import('./new.js')
    setTimeout(() => {
      console.log('Módulos cargados.');
      resolve();
    }, 5000); // Simula un retraso de 2 segundos en la carga de los módulos
  });
}

document.addEventListener('DOMContentLoaded', async (event) => {

  // Efecto Escritura

  var i = 0;
  var speed = 50;
  var element = document.getElementById("project-id");
  var text = element.innerHTML; // Almacenar el texto existente
  element.innerHTML = ''; // Borrar el contenido del elemento

  function typeWriter() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i); // Agregar el siguiente carácter al elemento
      i++;
      setTimeout(typeWriter, speed);
    } else {
      setTimeout(deleteWriter, 1500);
    }
  }

  function deleteWriter() {
    if (element.innerHTML.length > 0) {
      element.innerHTML = element.innerHTML.substring(1); // Eliminar el primer carácter del elemento
      setTimeout(deleteWriter, speed);
    } else {
      i = 0;
      setTimeout(typeWriter, speed);
    }
  }

  typeWriter();

  // Pantalla de carga
  var loader = document.getElementById("loading-screen");


  // Espera a que los módulos se carguen antes de ocultar la pantalla de carga
  await loadModules();
  loader.style.display = "none";
});