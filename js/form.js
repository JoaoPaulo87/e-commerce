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
  formularioActual = formulario[Object.keys(formulario)[0]];
  boton['siguiente paso'] = document.getElementById('siguiente-paso');
  boton['volver paso'] = document.getElementById('volver-paso');
  boton['formulario registro'] = document.getElementById('boton-formulario-registro');
  boton['formulario inicio'] = document.getElementById('boton-formulario-inicio');
  boton['enviar formulario'] = document.querySelector('button[type=submit]');
  clave.push(document.getElementById('clave-registro'));
  clave.push(document.getElementById('clave-registro-repetir'));
}

function agregarListeners(){
  boton['siguiente paso'].addEventListener('click', navegarFormulario);
  boton['volver paso'].addEventListener('click', navegarFormulario);
  boton['formulario registro'].addEventListener('click', alternarFormulario);
  boton['formulario inicio'].addEventListener('click', alternarFormulario);

  for(let boton of document.querySelectorAll('button[type=submit]')){
    boton.addEventListener('click', enviarFormulario);
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
  let withError = [];

  for(input of inputs){
    if(input.type){
      if(input.type == 'text' && input.value) continue;
      if(input.type == 'email'){
        let regExp = /[a-zA-z]+@{1}[a-zA-z]+.[a-zA-z]+/ig;
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
    }
    if(input.localName == 'select' && input.selectedIndex > 0) continue;
    withError.push(input);
  }
  if(withError.length){
    let tiempo = 3;
    for(input of withError){
      agregarErrorInput(input, tiempo*1000);
      tiempo+=2;
    }
    return false;
  }
  else return true;
}

function agregarErrorInput(input, tiempo){
  let alerta = document.createElement('p');
  alerta.classList.add('formulario__mensaje', 'mensaje-error');
  if(input.type != "checkbox"){
    alerta.innerText = 'Revisa el campo de: ';
    alerta.innerText += input.previousElementSibling.innerText.toLowerCase();
  } else {
    alerta.innerText = 'Tenés que aceptar los términos y condiciones';
  }
  document.querySelector('.formulario__errores').appendChild(alerta);
  setTimeout(() => alerta.remove(), tiempo);
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
  let inputs = formularioActual.querySelectorAll(`.form-group[data-paso="${paso}"] input, .form-group[data-paso="${paso}"] select`);

  if(!inputs.length){
    inputs = formularioActual.querySelectorAll(`.form-group input, .form-group select`);
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
