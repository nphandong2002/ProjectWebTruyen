function loadMenuHeader(){
    $('header nav ul li ul').innerHTML = ""
    if(!ctx.error.category){
        categoryService().getAll((err,res,array)=>{
       
            array = menu
            if(err){
                ctx.error.category = true;
            }
            if(res.code && res.code == "success"){
                array = res.data 
            }
            return array.forEach(category => $('header nav ul li ul').innerHTML += `<li><a class="dropdown-item" href = '/category/${category.id}'>${category.name}</a></li>`)
        })
    }
    ctx.error.category && menu.forEach(category => $('header nav ul li ul').innerHTML += `<li><a class="dropdown-item">${category.name}</a></li>`); 
    if(!ctx.login){      
        return $$("header nav .container .nav-alter li")[1].innerHTML = `<div class="modalBtn" data-toggle="modal" data-target="#modalLogin">
                        Đăng nhập/Đăng ký
                    </div>`;  
    }else{
        var avatar = " ";
        var name = "Người dùng";
        return postApi("/user/0").then(res => {   
            if(res.code && res.code != "success" || res.error ){
                localStorage.setItem("token","");
                Toast("Bạn đã đăng xuất",1)
                return ctx.start();
            }       
            
            var data = res.data;
            name = data.name;
            avatar = data.url_avatar;
            ctx.user = data
            
            var menuUser = [...base_memnu, ...roleMenu[data.roleId]];

            $$("header nav  .container .nav-alter li")[1].innerHTML = `<div class="modalBtn userInfo" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="${avatar}"/> ${name}           
            </div>
            <ul class="dropdown-menu" >
                ${menuUser.map(data => `<li ><a class="dropdown-item" href="${data.path}">${data.text}</a></li>`).join(" ")}
                
                <li><a class="dropdown-item" href="/logout">Đăng xuất</a></li>
            </ul>`;
            
            
        })
        
        
    }
}

ctx.modal["#modalLogin"] = `
<div class="modal fade show" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <ul>
                    <li class ="btn-choose btn-choose-active">Đăng nhập</li>
                    <li class ="btn-choose">Đăng ký</li>
                </ul>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body p-5 mb-3">
                <div id="msgLogin" class="mb-3" ></div>
                <form id="formLogin">
                    <div class="form-group mb-3">
                        <label for="username">Tài khoản</label>
                        <input type="text" class="form-control mt-2" id="username" placeholder="Nhập tài khoản"  required>
                    </div>
                    <div class="form-group mb-3">
                        <label for="password">Mật khẩu</label>
                        <input type="password" class="form-control mt-2" id="password" placeholder="Nhập mật khẩu" required>
                    </div>
                    <div class="form-group form-check mb-3">
                        <input type="checkbox" class="form-check-input" id="remember">
                        <label class="form-check-label" for="remember">Ghi nhớ đăng nhập</label>
                    </div>
                    <button type="submit" class="btn w-100 rounded-5 btn-outline-primary">Đăng nhập</button>
                </form>
                <form id="formRegister" class="d-none">
                    <div class="form-group mb-3">
                        <label for="username">Tài khoản</label>
                        <input type="text" class="form-control mt-2" id="username" placeholder="Nhập tài khoản" required>
                    </div>
                    <div class="form-group mb-3">
                        <label for="password">Mật khẩu</label>
                        <input type="password" class="form-control mt-2" id="password" placeholder="Nhập mật khẩu" required>
                    </div>
                    <div class="form-group mb-3">
                        <label for="retype-password">Nhập lại mật khẩu</label>
                        <input type="password" class="form-control mt-2" id="retype-password" placeholder="Nhập lại mật khẩu" required>
                    </div>
                    <div class="form-group mb-3">
                        <label for="name">Tên hiện thị</label>
                        <input type="text" class="form-control mt-2" id="name" placeholder="Nhập tên hiện thị" required>
                    </div>
                    <button type="submit" class="btn w-100 rounded-5 btn-outline-primary">Đăng ký</button>
                </form>
            </div>

        </div>
    </div>
</div>
`;

var chossoeLogin = ()=>{
    $$("#modalLogin .modal-header .btn-choose").forEach((btn,index) =>{
        btn.onclick = function(){
            $$("#modalLogin .modal-header .btn-choose").forEach(btn => btn.classList.remove("btn-choose-active"))
            this.classList.add("btn-choose-active");
            $("#formLogin").classList.toggle("d-none");
            $("#formRegister").classList.toggle("d-none");
            $("#msgLogin").innerHTML = "";
        }
    })

    $("#formLogin").onsubmit = function(){
        loginService($("#username").value,$("#password").value,(err,res)=>{
            if(err){
                localStorage.setItem("token","")
                return $("#msgLogin").innerHTML = err;
            }
            // console.log(err,res);
            if(res.code == "success"){
                localStorage.setItem("token",res.data)
                removeChild($("#modalLogin"))
                Toast("Đăng nhập thành công")
               return ctx.start();
            }else{
                $("#msgLogin").innerHTML = res.error;
                return localStorage.setItem("token","")
            }
        })
        return false;
    }


}


ctx.event["#modalLogin"] = chossoeLogin