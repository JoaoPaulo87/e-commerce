let inputs = document.querySelector('.form .form__controles:not(.oculto)');
inputs = inputs.querySelectorAll('input');

for (input of inputs){
  if(input.type != "checkbox"){
    input.addEventListener('focus',alternarLabel);
    input.addEventListener('blur',alternarLabel);
  }
}

function alternarLabel(e){
  let label = e.target.previousElementSibling;
  label.classList.toggle('en-foco');
}
