import express from 'express';
const app = express();
import http from 'http';
import cors from 'cors';
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
import { Server, Socket } from 'socket.io';
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
import _ from 'lodash';
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

import {
    login,
    registrer,
    getAddress,
    getHelpInfo,
    handleHelpInfo,
    approveHelpInfo,
    finishHelpOrder,
    getUserInfo,
    updateUserInfo,
    getStudentHelpOrder,
    getStudentApproveOrder,
    cancelOrder,
    cancelApproveOrder,
    addComments,
    getComments,
    getMessages,
    addMessages,
    getUsers,
    updateUserStatus,
    getOrderType,
    getAllOrders,
    setOrderType,
    deleteOrderType,
    getAbnormalOrders,
    lockOrder,
    userAppealOrder,
    dealAppealOrder,
    getUserChat,
} from '../service/index';
import calculateExtra from '../service/calculateExtra';

//  登录
app.post('/login', async (req, res) => {
    const loginRes = await login(req.body);
    if (loginRes.length !== 0) {
        res.send({
            error: 0,
            msg: 'success',
            data: loginRes,
        });
    } else {
        res.send({
            error: 1001,
            msg: '登陆失败',
        });
    }
});
//  注册
app.post('/register', async (req, res) => {
    const result = await registrer(req.body);
    if (result) {
        res.send({
            error: 0,
            msg: 'success',
        });
    }
});
//  获取地址信息
app.get('/getAddress', async (req, res) => {
    const result = await getAddress();
    if (result.length > 0) {
        res.send({
            error: 0,
            msg: 'success',
            data: result,
        });
    }
});
//  管理员获取人员信息(除 管理员外)
app.get('/getUsers', async (req, res) => {
    const result = await getUsers();
    if (result.length > 0) {
        res.send({
            error: 0,
            msg: 'success',
            data: result,
        });
    }
});
//  管理员操作用户登录权限
app.post('/updateUserStatus', async (req, res) => {
    const result = await updateUserStatus(req.body);
    if (result) {
        res.send({
            error: 0,
            msg: 'success',
        });
    }
});
//  获取订单类型
app.get('/getOrderType', async (req, res) => {
    const result = await getOrderType();
    if (result.length > 0) {
        res.send({
            error: 0,
            msg: 'success',
            data: result,
        });
    }
});
//  管理员获取全部订单
app.get('/getAllOrders', async (req, res) => {
    const orders = await getAllOrders();
    if (orders.length > 0) {
        res.send({
            error: 0,
            msg: 'success',
            data: orders,
        });
    }
});
//  获取全部未接单信息
app.post('/getHelpInfo', async (req, res) => {
    const helpInfo = await getHelpInfo(req.body.account);
    if (helpInfo.length !== 0) {
        res.send({
            error: 0,
            msg: 'success',
            data: helpInfo,
        });
    } else {
        res.send({
            error: 2001,
            msg: '数据为空',
        });
    }
});
//  学生提交求助信息
app.post('/handleOrderInfo', async (req, res) => {
    const handleInfoRes = await handleHelpInfo(req.body);
    if (handleInfoRes) {
        res.send({
            error: 0,
            msg: 'success',
        });
    } else {
        res.send({
            error: 3001,
            msg: '求助信息申请失败',
        });
    }
});
//  学生接单
app.post('/approveHelpInfo', async (req, res) => {
    const approveHelpInfoRes = await approveHelpInfo(req.body);
    if (approveHelpInfoRes) {
        res.send({
            error: 0,
            msg: 'success',
        });
    } else {
        res.send({
            error: 4001,
            msg: '接单失败',
        });
    }
});
//  学生完成接单任务
app.post('/finishHelpOrder', async (req, res) => {
    const result = await calculateExtra(req.body);
    if (result) {
        res.send({
            error: 0,
            msg: 'success',
        });
    } else {
        res.send({
            error: 5001,
            msg: '完成订单失败',
        });
    }
});
//  学生获取个人信息
app.post('/getUserInfo', async (req, res) => {
    const user = await getUserInfo(req.body);
    if (user) {
        res.send({
            error: 0,
            msg: 'success',
            data: user,
        });
    }
});
//  学生修改个人信息
app.post('/updateUserInfo', async (req, res) => {
    const result = await updateUserInfo(req.body);
    if (result) {
        res.send({
            error: 0,
            msg: 'success',
        });
    }
});
//  学生获取个人求助信息
app.post('/getStudentHelpOrder', async (req, res) => {
    const ownHelpOrderRes = await getStudentHelpOrder(req.body.account);
    if (ownHelpOrderRes.length !== 0) {
        res.send({
            error: 0,
            msg: 'success',
            data: ownHelpOrderRes,
        });
    } else {
        res.send({
            error: 6001,
            msg: '暂无信息',
        });
    }
});
//  学生获取个人接单信息
app.post('/getStudentApproveOrder', async (req, res) => {
    const studentApproveOrderRes = await getStudentApproveOrder(req.body.helperAccount);
    if (studentApproveOrderRes.length !== 0) {
        res.send({
            error: 0,
            msg: 'success',
            data: studentApproveOrderRes,
        });
    } else {
        res.send({
            error: 7001,
            msg: '暂无接单数据',
        });
    }
});
//  学生取消提交订单
app.post('/cancelOrder', async (req, res) => {
    const cancelRes = await cancelOrder(req.body);
    if (cancelRes) {
        res.send({
            error: 0,
            msg: 'success',
        });
    } else {
        res.send({
            error: 8001,
            msg: '取消失败',
        });
    }
});
//  学生取消接单
app.post('/cancelApproveOrder', async (req, res) => {
    const cancelRes = await cancelApproveOrder(req.body);
    if (cancelRes) {
        res.send({
            error: 0,
            msg: 'success',
        });
    } else {
        res.send({
            error: 9001,
            msg: '取消接单失败',
        });
    }
});
//  获取留言
app.get('/getComments', async (req, res) => {
    const getRes = await getComments();
    if (getRes.length !== 0) {
        res.send({
            error: 0,
            msg: 'success',
            data: getRes,
        });
    } else {
        res.send({
            error: 9999,
            msg: '获取留言失败',
        });
    }
});
//  提交留言
app.post('/addComments', async (req, res) => {
    const addRes = await addComments(req.body);
    if (addRes) {
        res.send({
            error: 0,
            msg: 'success',
        });
    } else {
        res.send({
            error: 9998,
            msg: '添加留言失败',
        });
    }
});
//  删除留言
//  获取留言回复
app.post('/getMessages', async (req, res) => {
    const getMessageRes = await getMessages(req.body.commentId);
    if (getMessageRes.length !== 0) {
        res.send({
            error: 0,
            msg: 'success',
            data: getMessageRes,
        });
    } else {
        res.send({
            error: 9996,
            msg: '暂无数据',
        });
    }
});
//  提交留言回复
app.post('/addMessages', async (req, res) => {
    const addMessageRes = await addMessages(req.body);
    if (addMessageRes) {
        res.send({
            error: 0,
            msg: 'success',
        });
    } else {
        res.send({
            error: 9995,
            msg: '提交失败',
        });
    }
});
//  管理员功能
//  添加订单种类
app.post('/setOrderType', async (req, res) => {
    const result = await setOrderType(req.body);
    if (result) {
        res.send({
            error: 0,
            msg: 'success',
        });
    }
});
//  删除订单种类
app.post('/deleteOrderType', async (req, res) => {
    const result = await deleteOrderType(req.body);
    if (result) {
        res.send({
            error: 0,
            msg: 'success',
        });
    }
});
//  获取申诉订单
app.get('/getAppealOrders', async (req, res) => {
    const result = await getAbnormalOrders();
    if (result.length > 0) {
        res.send({
            error: 0,
            msg: 'success',
            data: result,
        });
    }
});
//  冻结订单
app.post('/lockOrder', async (req, res) => {
    let result = await lockOrder(req.body);
    if (result) {
        res.send({
            error: 0,
            msg: 'success',
        });
    }
});
//  学生申诉订单
app.post('/userAppealOrder', async (req, res) => {
    const result = await userAppealOrder(req.body);
    if (result) {
        res.send({
            error: 0,
            msg: 'success',
        });
    }
});
//  解决申诉订单
app.post('/dealAppealOrder', async (req, res) => {
    const result = await dealAppealOrder(req.body);
    if (result) {
        res.send({
            error: 0,
            msg: 'success',
        });
    }
});
app.post('/getuserChat', async (req, res) => {
    const result = await getUserChat(req.body.account);
    if (result.length !== 0) {
        res.send({
            error: 0,
            msg: 'success',
            data: result,
        });
    } else {
        res.send({
            error: 9988,
            msg: '暂无人员信息',
        });
    }
});
interface userMsg {
    user: number;
    msg: string;
    date: string;
    receiver: number;
}
interface user {
    account: number;
    username: string;
}

const userArr: user[] = [];
const msg: userMsg[] = [];
//  在线聊天
io.on('connection', (socket: Socket) => {
    console.log('后端刷新-------');
    console.log(socket.id);

    socket.on(`send`, (value: userMsg) => {
        console.log(`ML ~ file: index.ts ~ line 451 ~ io.on ~ value`, value);
        const { user, receiver } = value;
        msg.push(value);
        io.emit(`receive`, msg);
    });
});

server.listen(3000, () => {
    console.log(`ML ~ file: index.ts ~ line 45 ~ server.listen ~ io_socket 连接成功`);
});
