var $ = document.querySelector.bind(document);
    var $$ = document.querySelectorAll.bind(document);

var api_url = "http://localhost:8080/api";
var categoryUrl_get = "/category/";
var url_uploadImg= "/img/upload";
var url_createImg = "/img/create";
var url_bookD = "/book/uploadD"

var ctx = {
    login: false,
    modal: {},
    event: {},
    localImage: {},
    error: {}
}
var oldEvent = {};
const menu = [
    {"id":1, "name": "Đồng Nhân "}, 
    {"id":2, "name": "Tất cả "}, 
    {"id":3, "name": "Khoa Huyễn "}, 
    {"id":4, "name": "Tiên Hiệp "}, 
    {"id":5, "name": "Võng Du "}, 
    {"id":6, "name": "Đô Thị "}, 
    {"id":7, "name": "Cạnh Kỹ "}, 
    {"id":8, "name": "Dã Sử "}, 
    {"id":9, "name": "Huyền Nghi "}, 
    {"id":10, "name": "Kỳ Ảo "}, 
    {"id":11, "name": "Huyền Huyễn "}, 
    {"id":12, "name": "Kiếm Hiệp "}
];

var roleMenu = {
    "1":[
        {text: "Quản lý người dùng",path: "/listUser" },
        {text: "Quản lý truyện",path: "/listBook" },

    ],
    "2": [
        {text: "Quản lý truyện",path: "/listBook" },
    ]
}
var base_memnu = [
    {text: "Tài khoản",path:"/user"},
    {text: "Tủ truyện",path:"/books"},

]

window.onload = ()=>{ctx.start()}



