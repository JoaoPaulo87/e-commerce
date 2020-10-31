let formulario = {}, boton = {}, pasosFormulario = [1, 1], clave = [], formularioActual;

iniciarAplicacion();

function iniciarAplicacion(){
  obtenerControles();
  agregarListeners();
  obtenerPasos();
  obtenerInputs(pasosFormulario[1]);
  document.forms[0].reset();
}

function obtenerControles(){
  formulario['formulario registro'] = document.getElementById('formulario-registro');
  formulario['formulario inicio'] = document.getElementById('formulario-inicio');
  formularioActual = formulario['formulario registro'];
  boton['siguiente paso'] = document.getElementById('siguiente-paso');
  boton['volver paso'] = document.getElementById('volver-paso');
  boton['formulario registro'] = document.getElementById('boton-formulario-registro');
  boton['formulario inicio'] = document.getElementById('boton-formulario-inicio');
  boton['enviar formulario'] = document.querySelectorAll('button[type=submit]');
  clave.push(document.getElementById('clave-registro'));
  clave.push(document.getElementById('clave-registro-repetir'));
}

function agregarListeners(){
  boton['siguiente paso'].addEventListener('click', navegarFormulario);
  boton['volver paso'].addEventListener('click', navegarFormulario);
  boton['formulario registro'].addEventListener('click', alternarFormulario);
  boton['formulario inicio'].addEventListener('click', alternarFormulario);
  for(btn of boton['enviar formulario']){
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
  if(pasosFormulario[2]){
    //Si el formulario tiene un solo paso, pasosFormulario[2] es cero.
    if(!inputsValidos(obtenerInputs())){
      return false;
    }
  } else {
    for(let i = pasosFormulario[0]; i<= pasosFormulario[2]; i++){
      if(!inputsValidos(obtenerInputs(i))){
        navegarFormulario(null, i);
        return false;
      }
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
      if(input.type == 'checkbox' && input.checked) continue;
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

function obtenerInputs(paso = null){
  let inputs = formularioActual.querySelectorAll(`.form-group[data-paso="${paso}"] input, .form-group[data-paso="${paso}"] select`);
  if(!inputs.length){
    inputs = formularioActual.querySelectorAll('.form-group input, .form-group select');
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
  } else {
    formulario['formulario registro'].classList.add('oculto');
    formulario['formulario inicio'].classList.remove('oculto');
    boton['formulario inicio'].classList.add('active');
    boton['formulario registro'].classList.remove('active');
    formularioActual = formulario['formulario inicio'];
  }
  obtenerPasos();
  obtenerInputs(1);
}
