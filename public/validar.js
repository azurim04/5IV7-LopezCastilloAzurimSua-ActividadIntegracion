let formulario = document.getElementById("formulario");

function iniciarsesion(event) {
    formulario.setAttribute("action", "/menu.html");
    validacion = true;
    // Validar que no haya campos vacios
    if (Texto.value == "" || clave.value == "") {
        alert('Llena los datos');
        validacion = false;
    }
    if (validacion == false) {
        event.preventDefault();
    }
}