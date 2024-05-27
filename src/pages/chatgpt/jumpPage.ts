interface IJumpPage {
    name: string;
    path: string;
}


const jumpPage: IJumpPage[] = [{
    name: "适老化",
    path: "/autoOld"
}, {
    name: "历史记录",
    path: "/home/1"
}, {
    name: "视频",
    path: "/home"
},{
    name: "消息列表",
    path: "/home/2"
},{
    name: "个人信息",
    path: "/home/3"
}, {
    name: "搜索",
    path: "/search"
}
];

export default jumpPage;


