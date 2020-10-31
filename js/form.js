/*
  Descripción de las variables:
  - formulario: guarda los formularios disponibles en la página. Se guardan de forma automática usando el atributo data-nombre-formulario = nombre.
  - boton: guarda todos los botones de los formularios. Se guardan de forma manual. Se puede automatizar usando data-componente-formulario = boton (a posterior).
  - pasosFormulario: es un array de tres posiciones, la primera es el paso inicial, la segunda el paso actual y la tercera el total de pasos. Si el total de pasos es cero, significa que el formulario es de un solo paso.
  - clave: es un array que guarda la referencia de los campos de claves. Está puesto de forma manual pero se puede automatizar usando data-componente-formulario = clave (a posterior).
  - formularioActual: se guarda la referencia del formulario que está viendo el usuario en un momento dado.
  -

*/
let formulario = {}, boton = {}, pasosFormulario = [1, 1], clave = [], formularioActual;

iniciarAplicacion();

function iniciarAplicacion(){
  /* Limpia el formulario y obtiene los inputs del paso actual (por defecto el primero) */
  obtenerControles();
  agregarListeners();
  obtenerPasos();
  obtenerInputs(pasosFormulario[1]);
  document.forms[0].reset();
}

function obtenerControles(){
  /* Se obtienen los controles de forma manual (se puede mejorar y automatizar con data-componente-formulario) */

  for(form of document.querySelectorAll('[data-nombre-formulario]')){
    formulario['formulario ' + form.dataset.nombreFormulario] = form;
  }
  for(btn of document.querySelectorAll('[data-nombre-boton]')){
    boton[btn.dataset.nombreBoton] = btn;
  }
  formularioActual = formulario[Object.keys(formulario)[0]];
  clave.push(document.getElementById('clave-registro'));
  clave.push(document.getElementById('clave-registro-repetir'));
}

function agregarListeners(){
  for(btn in boton){
    if(btn.includes('paso')){
      boton[btn].addEventListener('click', navegarFormulario);
      continue;
    }
    if(btn.includes('formulario')){
      if(btn.includes('enviar')){
        boton[btn].addEventListener('click', enviarFormulario);
      } else {
        boton[btn].addEventListener('click', alternarFormulario);
      }
      continue;
    }
  }
}

function reiniciarFormulario(e){
  e.preventDefault();
  reiniciarLabels();
  navegarFormulario(null, 1);
  document.forms[0].reset();
}
function enviarFormulario(e){
  e.preventDefault();
  if(!pasosFormulario[2]){
    if(!inputsValidos(obtenerInputs(0))){
      return false;
    }
  }
  for(let i = pasosFormulario[0]; i<= pasosFormulario[2]; i++){
    if(!inputsValidos(obtenerInputs(i))){
      navegarFormulario(null, i);
      return false;
    }
  }
  document.forms[0].submit();
  document.forms[0].reset();
}

function inputsValidos(inputs = obtenerInputs(pasosFormulario[1])){
  let conError = [];

  for(input of inputs){
    if(input.type){
      if(input.type == 'text' && input.value) continue;
      if(input.type == 'email'){
        let regExp = /[a-zA-z0-9]+@{1}[a-zA-z0-9]+.[a-zA-z0-9]+/ig;
        if(regExp.test(input.value)) continue;
      }
      if(input.type == 'password' && input.id == 'clave-inicio' && input.value) continue;
      if(input.type == 'password' && compararClaves() && clave[0].value && clave[1].value) continue;
      if(input.type == 'number'){
        let regExp = /[0-9]+/gi;
        if(regExp.test(input.value)) continue;
      }
      if(input.type == 'checkbox') {
        if(input.checked || !('required' in input.attributes)) continue;
      }
      if(input.localName == 'textarea' && input.value) continue;
    }
    if(input.localName == 'select' && input.selectedIndex > 0) continue;
    conError.push(input);
  }
  if(conError.length){
    let tiempo = 3;
    let altura = (conError.length-1) * 4;
    for(input of conError){
      agregarErrorInput(input, tiempo*1000, altura);
      tiempo+=2;
      altura-=4;
    }
    return false;
  }
  else return true;
}

function agregarErrorInput(input, tiempo, altura){
  let alerta = document.createElement('p');
  alerta.classList.add('formulario__mensaje', 'mensaje-error');
  if(input.type != "checkbox"){
    alerta.innerText = 'Revisa el campo de: ';
    alerta.innerText += input.previousElementSibling.innerText.toLowerCase();
  } else {
    alerta.innerText = 'Tenés que aceptar los términos y condiciones';
  }
  alerta.style.bottom = altura + 'em';
  document.body.appendChild(alerta);
  alerta.addEventListener('click', eliminarErrorInput);
  setTimeout(() => alerta.remove(), tiempo);
}
function eliminarErrorInput(e){
  e.target.remove();
}
function compararClaves(){
  let mensaje, sonIguales = true;

  if(clave[0].value !== clave[1].value){
    mensaje = '¡Las contraseñas no coinciden!';
    sonIguales = false;
  }

  return sonIguales;
}

function alternarLabel(e, label = e.target.previousElementSibling){
  if(document.getElementById(label.htmlFor).value && label.classList.contains('en-foco')) return;
  label.classList.toggle('en-foco');
}

function reiniciarLabels(){
  let labels = document.querySelectorAll('label.en-foco');
  for(label of labels){
    label.classList.remove('en-foco');
  }
}

function obtenerPasos(){
  pasosFormulario[2] = formularioActual.querySelectorAll('[data-paso]').length;
}

function obtenerInputs(paso){
  let inputs = formularioActual.querySelectorAll(`.form-group[data-paso="${paso}"] input, .form-group[data-paso="${paso}"] select, .form-group[data-paso="${paso}"] textarea`);

  if(!inputs.length){
    inputs = formularioActual.querySelectorAll(`.form-group input, .form-group select, .form-group textarea`);
  }
  for (input of inputs){
    if(input.type != "checkbox" && input.type != "select"){
      input.addEventListener('focus',alternarLabel);
      input.addEventListener('blur',alternarLabel);
    }
  }
  inputs[0].focus();
  return inputs;
}

function alternarInputs(anterior, actual){
  let gruposInputs = document.querySelectorAll(`[data-paso="${anterior}"]`);

  for(input of gruposInputs){
    input.classList.add('oculto');
  }

  gruposInputs = document.querySelectorAll(`[data-paso="${actual}"]`);

  for(input of gruposInputs){
    input.classList.remove('oculto');
  }

  if(actual == pasosFormulario[2]){
    boton['siguiente paso'].classList.add('oculto');
    boton['enviar formulario'].classList.remove('oculto');
  } else {
    boton['siguiente paso'].classList.remove('oculto');
    boton['enviar formulario'].classList.add('oculto');
  }

  if(actual > pasosFormulario[0]){
    boton['volver paso'].classList.remove('oculto');
  } else {
    boton['volver paso'].classList.add('oculto');
  }
}

/*
  Si la función es disparada por un evento (esto quiere decir, que se preseionó o bien el botón de siguiente o bien el de volver), esta tendrá que validar los inputs y luego avanzar o retroceder.

  Si la función es disparada porque el programa necesita que se vuelva a un paso a verificar datos, entonces el evento será nulo y el paso será pasado por parametro.
*/
function navegarFormulario(e, paso = null){
  if(paso){
    alternarInputs(pasosFormulario[1], paso);
    pasosFormulario[1] = paso;
  } else if(e.target == boton['siguiente paso']){
    if(inputsValidos()) alternarInputs(pasosFormulario[1], ++pasosFormulario[1]);
  } else alternarInputs(pasosFormulario[1], --pasosFormulario[1]);

  obtenerInputs(pasosFormulario[1]);
}

function alternarFormulario(e){
  if(e.target == boton['formulario registro']){
    formulario['formulario registro'].classList.remove('oculto');
    formulario['formulario inicio'].classList.add('oculto');
    boton['formulario registro'].classList.add('active');
    boton['formulario inicio'].classList.remove('active');
    formularioActual = formulario['formulario registro'];
    boton['enviar formulario'] = document.querySelector('button[type=submit]:not(.oculto)');
  } else {
    formulario['formulario registro'].classList.add('oculto');
    formulario['formulario inicio'].classList.remove('oculto');
    boton['formulario inicio'].classList.add('active');
    boton['formulario registro'].classList.remove('active');
    formularioActual = formulario['formulario inicio'];
    boton['enviar formulario'] = document.querySelector('button[type=submit]:not(.oculto)');
    boton['enviar formulario'].addEventListener('click', enviarFormulario);
  }
  obtenerPasos();
  obtenerInputs(1);
}
