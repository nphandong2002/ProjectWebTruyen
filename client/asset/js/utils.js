ctx.utils = function(){
    //hover li
    $$(".dropdown-hover").forEach(div => {
        div.addEventListener("click",function(){
            return false;
        })
        div.onmouseover = function(){
            this.click()
        }
        div.onmouseout  = function(){
            this.click()
        }
    });

    $$("a").forEach(a =>{
        a.onclick = function(event){
            event.preventDefault();
            var url = this.getAttribute("href");
            var area = this.getAttribute("area");
            var Maindiv = area ? area : 'main';
            if(url == "/logout"){
                fetch(api_url + "/logout").catch(ex => {})
                localStorage.setItem("token","")
                Toast("Đăng xuất thành công")
                return ctx.start();    
            }
            if(url.indexOf('book') != -1 && url.indexOf('category') == -1) {
                $('#showbook').value = url.split('/')[2] ? url.split('/')[2] : '' ;
                url = 'book';

            };
            if(url.indexOf('category') != -1){
                $('#showbook').value = url.split('/')[2] ? url.split('/')[2] : '' ;
                $('#showchapter').value = url.split('/')[4] ? url.split('/')[4] : '' ;
                url = 'category'
            };
            

            return fetch(`/page/${url}.html`).then(p => p.text())
            .then(html => {
                $(Maindiv).innerHTML = `<div class = '${Maindiv == 'main' ? 'main' : ''}'>${html}</div>`;
                Array.from($$(".main script")).forEach( oldScript => {
                    const newScript = document.createElement("script");
                    Array.from(oldScript.attributes)
                        .forEach( attr => newScript.setAttribute(attr.name, attr.value) );
                        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                    });
                ctx.loadevent();
            })
                
        }
    })

    //modal
    $$('[data-toggle="modal"]').forEach(btn =>{
        btn.onclick = function(){
            var target = this.getAttribute("data-target");

            if($(target)){
                document.body.removeChild($(target));
                ctx.loadevent()
            }else{
                var div = document.createElement("div");
                div.innerHTML = ctx.modal[target];
                div.id = 'modalLogin';
                div.setAttribute("type","modal")
                ctx.modal[target] && appendChild(div)
            }
        }
    })
    $$('[data-dismiss="modal"]').forEach(btn =>{       
        btn.onclick = function(){
            var parent = btn.parentElement;
            while(parent.getAttribute("type") != "modal"){
                parent = parent.parentElement
            }
            removeChild($(`#${parent.getAttribute("id")}`));
            
        }
    })
    $$("img").forEach(img => {
        const imgNew = new Image();
        imgNew.onerror = function(){
            img.src = "./asset/img/avatar.jpg"
        }
        imgNew.src = img.src
    })


    $$(".upload-file").forEach(div => {
        var name = div.getAttribute("data-name"); 
        var multiple = div.getAttribute("data-multiple");
        var id =  div.getAttribute("data-id"); 
        if(multiple){
            ctx.localImage[name] ? " " : ctx.localImage[name] = [];

        }

        div.innerHTML = `
            <input type="file" id=${id} name = "${name}" ${multiple ? "multiple='multiple'" : ""} class="drop-zone__input"/>
            <div class="drop-zone">
                <label  class="drop-zone__prompt">
                    <img src="../asset/img/image-icon.png"/>
                </label>
            </div>
            <div class = "drop-zone__thumb d-none">
            </div>
        `       
    })


    //drop 
    $$(".drop-zone__input").forEach((inputElement) => {
        const parent = inputElement.parentElement;
        const dropZoneElement = parent.querySelector(".drop-zone");
        // const multiple = inputElement.getAttribute("multiple");

        dropZoneElement.onclick = ()=> inputElement.click();
        dropZoneElement.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZoneElement.classList.add("drop-zone--over");
        });
        ["dragleave", "dragend"].forEach((type) => {
            dropZoneElement.addEventListener(type, (e) => {
                dropZoneElement.classList.remove("drop-zone--over");
            });
        });
        dropZoneElement.addEventListener("drop", function(e){
            e.preventDefault();
            e.dataTransfer.files.length > 0 
                && (inputElement.files = e.dataTransfer.files)
                &&  Array.from(inputElement.files).forEach(img => updateThumbnail(img,parent)) 

            dropZoneElement.classList.remove("drop-zone--over");
        });

        inputElement.onchange = (e)=>{
            inputElement.files.length > 0 && Array.from(inputElement.files).forEach(img => updateThumbnail(img,parent)) 
        }
    });

    $$("select").forEach(select => {
        var url = select.getAttribute("data-url")
        if(!url) return;
        var method = select.getAttribute("data-method");
        if(method == "get"){
            return fetch(api_url + url).then(p => p.json()).then(res => {
                select.innerHTML = "<option>--Chon--</option>"
                if(res.code && res.code == 'success'){
                    res.data.forEach(data => {
                        select.innerHTML += `<option value=${data.id}>${data.name}</option>`

                    })
                }
            }).catch(function(err) {
                console.log("category: ", err);
                return callback(err);
            });
        }
    })

    
    


}
ctx.loadevent = ()=>{
    for(var e in ctx.event){
        var evt = ctx.event[e];
        if($(e)){
            if(typeof evt == 'function') evt();
            if(Object.prototype.toString.call(evt) == '[object Array]'){
                evt.forEach(e => e())
            }
        }
        
    }
    ctx.utils()
}
var checkError = function(){
    var errorSys = {
        "category": {
            method: "get",
            url: api_url + categoryUrl_get
        }
    }
    Object.keys(errorSys).forEach(e =>{
        ctx.error[e] && fetch(errorSys[e].url,{
            method: errorSys[e].method
        }).then(p => p.json()).then(p => delete ctx.error[e])
    })
}
ctx.start = async function(){
    console.log("app: start");
    await checkLogin();
    await checkError();
    await loadMenuHeader();
    ctx.loadevent();
    $('[href="/home"]').click()
}

