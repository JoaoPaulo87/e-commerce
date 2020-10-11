let formulario = {}, inputs, boton = {}, pasoFormulario = 1;

iniciarAplicacion();

function iniciarAplicacion(){
  obtenerInputs();
  obtenerControles();
  agregarListeners();
}

function obtenerControles(){
  formulario['registro'] = document.getElementById('formulario-registro');
  formulario['inicio'] = document.getElementById('formulario-inicio');
  boton['formulario-registro'] = document.getElementById('boton-formulario-registro');
  boton['formulario-inicio'] = document.getElementById('boton-formulario-inicio');
  boton['siguiente'] = document.getElementById('boton-siguiente');
  boton['volver'] = document.getElementById('boton-volver');
}

function agregarListeners(){
  boton['formulario-registro'].addEventListener('click', alternarFormulario);

  boton['formulario-inicio'].addEventListener('click', alternarFormulario);
  boton['formulario-inicio'].addEventListener('click', obtenerInputs);
  boton['formulario-inicio'].addEventListener('click', obtenerInputs);
  boton['siguiente'].addEventListener('click', navegarFormulario);
  boton['volver'].addEventListener('click', navegarFormulario)
}

function alternarFormulario(e){
  if(e.target.id.includes('registro')){
    formulario['inicio'].classList.add('oculto');
    formulario['registro'].classList.remove('oculto');
    boton['formulario-registro'].classList.add('active');
    boton['formulario-inicio'].classList.remove('active');
  }else{
    formulario['inicio'].classList.remove('oculto');
    formulario['registro'].classList.add('oculto');
    boton['formulario-inicio'].classList.add('active');
    boton['formulario-registro'].classList.remove('active');
  }
}

function alternarLabel(e){
  let label = e.target.previousElementSibling;
  label.classList.toggle('en-foco');
}

function obtenerInputs(){
  inputs = document.querySelector('.form .form__controles:not(.oculto)');
  inputs = inputs.querySelectorAll('input');

  for (input of inputs){
    if(input.type != "checkbox"){
      input.addEventListener('focus',alternarLabel);
      input.addEventListener('blur',alternarLabel);
    }
  }
}

function navegarFormulario(e){
  if(e.target == boton['siguiente']){
    gruposInputs = document.querySelectorAll('[data-paso]');
    for(input of gruposInputs){
      input.classList.add('oculto');
    }
    pasoFormulario++;
    gruposInputs = document.querySelectorAll(`[data-paso="${pasoFormulario}"]`);
    console.log(gruposInputs);
    for(input of gruposInputs){
      input.classList.remove('oculto');
    }

    if(pasoFormulario > 1){
      boton['volver'].classList.remove('oculto');
    }
  } else {
    gruposInputs = document.querySelectorAll('[data-paso]');
    for(input of gruposInputs){
      input.classList.add('oculto');
    }
    pasoFormulario--;
    gruposInputs = document.querySelectorAll(`[data-paso="${pasoFormulario}"]`);
    console.log(gruposInputs);
    for(input of gruposInputs){
      input.classList.remove('oculto');
    }

    if(pasoFormulario == 1){
      boton['volver'].classList.add('oculto');
    }
  }

}
