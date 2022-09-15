function loginService(username,password,callback){
    var resolveFunc = function(){};
    var rejectFunc = function(){};
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });
    if(!callback){
        callback = function (err, data) {
            if (err) {
            return rejectFunc(err);
            }
            resolveFunc(data);
        };
    }
    postApi("/login",{
        username,password
    })
    .then(res => {
        return callback(null, res);
    }).catch(function(err) {
        console.log("login: ", err);
        return callback(err);
    });
    return returnPromise;
}

function categoryService(){
    return {
      create: function(name){
        return postApi("/category/create",{
            name
        })
      },
      getAll: function(callback){
        var resolveFunc = function(){};
        var rejectFunc = function(){};
        var returnPromise = new Promise(function (resolve, reject) {
          resolveFunc = resolve;
          rejectFunc = reject;
        });
        if(!callback){
            callback = function (err, data) {
                if (err) {
                return rejectFunc(err);
                }
                resolveFunc(data);
            };
        }
        getApi(categoryUrl_get)
            .then(res => {
                return callback(null, res);
            }).catch(function(err) {
                console.log("category: ", err);
                return callback(err);
            });
            return returnPromise;
      }
    };
}

function getApi(url,form){
    if(ctx.error.service) return;
    var headers = {
        'Content-Type': 'application/json',
    }
    ctx.token && (headers['Authorization'] = ctx.token)
    return fetch(api_url + url,{
        method: "GET",
        headers,
        body: JSON.stringify(form)
    }).then(p => p.json()).catch(ex => {
        localStorage.setItem("token","")
        Toast("Hệ thông sảy ra lỗi",1)
        ctx.error.service = true;

        return ctx.start()
    })
}
function postApi(url,form,formdata){
    if(ctx.error.service) return;
    var headers = {
        'Content-Type': 'application/json',
    }
    ctx.token && (headers['Authorization'] = ctx.token)
    formdata && (delete headers['Content-Type']) 
    return fetch(api_url + url,{
        method: "POST",
        headers,
        body: form ?  JSON.stringify(form) : formdata
    }).then(p => p.json()).catch(ex => {
        localStorage.setItem("token","")
        Toast("Hệ thông sảy ra lỗi",1);
        ctx.error.service = true;
        return ctx.start()
    })
}

var bookService = {
    upload: function(form){
        return postApi("/book/upload",form)
    },
    uploadb: function(form){
        return postApi("/book/uploadD",form)

    },
    showAll: function(page){
        return postApi("/book?id=0" + `&page=${!page ? 0 : page}`)
    },
    getTop: function(){
        return postApi("/book/top")
    },
    getChapterNew: function(){
        return postApi("/book/chapterNew")
    },
    getBook: function(id){
        return postApi("/book?id=" + id);
    },
    getChapter: function(id){
        return postApi(`/book/chapter/${id}`)
    }
}