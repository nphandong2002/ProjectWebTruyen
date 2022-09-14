//function tìm kiếm
function searchData(url,divShow){

}

function checkLogin(){
    ctx.token = localStorage.getItem("token");
    ctx.login = ctx.token ? true : false;
}

function appendChild(div,area){
    document.body.appendChild(div);
    ctx.loadevent()
}

function removeChild(div){
    document.body.removeChild(div);
    ctx.loadevent()
}
function updateThumbnail(file, parent) {
  var input = parent.querySelector("input")
  var multiple = input.getAttribute("multiple");
  var name = parent.getAttribute("data-name");
  !multiple && parent.querySelector(".drop-zone").classList.add("d-none")
  multiple && ctx.localImage[name].push(file);

  var divShow = parent.querySelector(".drop-zone__thumb");
  divShow.innerHTML += `
    <div class="img-show">   
      <div class="drop-zone__remove"><i class='bx bx-x'></i></div>
      <img src="${URL.createObjectURL(file)}"/>
    </div>`;
  
  divShow.classList.remove("d-none")
  parent.querySelectorAll(".drop-zone__remove").forEach(remove => {
    remove.onclick = function(){
      if(!multiple){
        input.files = (new DataTransfer).files;
        divShow.innerHTML = ""
        divShow.classList.add("d-none");
        parent.querySelector(".drop-zone").classList.remove("d-none");
      }else{
        ctx.localImage[name].splice(ctx.localImage[name].findIndex(img => img.name == file.name),1);
        if(ctx.localImage[name].length == 0){
          input.files = (new DataTransfer).files;
          divShow.innerHTML = ""
          divShow.classList.add("d-none");
          parent.querySelector(".drop-zone").classList.remove("d-none");
        }else{
          divShow.removeChild(this.parentElement);

        }
      }
    }
  });

}


function resetForm(id){
  var form = $("#"+id);
  form.querySelectorAll('input').forEach(input => {
    input.value = null;
    input.checked = false;
  })
  form.querySelectorAll("textarea").forEach(textarea => textarea.value = "")
  form.querySelectorAll(".tinymce").forEach(textarea => tinymce.get(textarea.getAttribute("id")).setContent(" "))
  form.querySelectorAll("select").forEach(select => {
    for (var i=0; i < select.options.length; i++) {
      if (select.options[i].defaultSelected) {
        select.selectedIndex = i;
        return;
      }
    }
    select.selectedIndex  = 0;
  })

  form.querySelectorAll(".drop-zone").forEach(div => {
    div.classList.remove("d-none");
  })
  form.querySelectorAll(".drop-zone__thumb").forEach(div => {
    div.classList.add("d-none");
    div.innerHTML = ""
  })
}


function Toast(msg,options){
  var success = !options ? "bg-success" : "bg-danger";
  var totalHeader = !options ? "Thành công" : "Thật bại";
  var div = $(".toast-container");

  var length = $$(".toast").length;
  div.innerHTML += `<div class="toast fade show" id='toast_${length}'>
    <div class="toast-header ${success} text-white " data-bs-autohide="true">
      <strong class="me-auto">${totalHeader}</strong>
      <button type="button" class="btn-close me-2" data-bs-dismiss="toast"></button>
    </div>
    <div class="toast-body">
      ${msg}
    </div>
  </div>`;
  setTimeout(()=>{
    var parent = $(`#toast_${length}`).parentElement;
    parent.removeChild($(`#toast_${length}`))
  },5000)
  // new bootstrap.Toast($('#toast_'+length), {
  //   delay: 5000
  // }).show();
    
  
}



