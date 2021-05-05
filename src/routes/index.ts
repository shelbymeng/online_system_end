import express from 'express';
import http from 'http';
const app = express();
const server = http.createServer(app);
import { Server, Socket } from 'socket.io';
import _ from 'lodash';
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
import cors from 'cors';
app.use(cors());
// io.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const io = new Server(server);

import {
    login,
    getHelpInfo,
    handleHelpInfo,
    approveHelpInfo,
    finishHelpOrder,
    getStudentHelpOrder,
    getStudentApproveOrder,
    cancelOrder,
    cancelApproveOrder,
    addComments,
    getComments,
    getMessages,
    addMessages,
} from '../service/index';

interface userMsg {
    user: string;
    msg: string;
    date: string;
}
interface user {
    account: number;
    id: string;
}
const userLists: Array<user> = [];

const userArr: user[] = [];
const msg: userMsg[] = [];
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
            msg: '获取接单信息失败',
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
    const result = await finishHelpOrder(req.body);
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
//  在线聊天
// io.on('connection', (socket: Socket) => {
//     // socket.join('room');
//     console.log('后端刷新-------');
//     console.log(socket.id);
//     //  用户login
//     socket.on('login', (content: user) => {
//         console.log(`ML ~ file: index.ts ~ line 47 ~ socket.on ~ content`, content);
//         const { account, id } = content;
//         if (userArr.length !== 0) {
//             for (let user of userArr) {
//                 if (user.account !== account) {
//                     userArr.push(content);
//                 } else if (user.account === account && user.id !== id) {
//                     _.set(user, 'id', id);
//                 }
//             }
//         } else {
//             userArr.push(content);
//         }
//         console.log(`ML ~ file: index.ts ~ line 59 ~ login`, userArr);
//     });
//     //  接收用户发送消息
//     socket.on('send', (content: userMsg) => {
//         console.log('监听前端发送数据');
//         msg.push(content);
//         socket.emit('msgfromServer', msg);
//         socket.to('room').emit('msgfromServer', msg);
//         socket.to('room').broadcast.emit('msgfromServer', msg);
//     });
//     //  获取在线用户
//     socket.on('handleOnlineUsers', (account: string) => {
//         socket.emit('getOnlineUsers', userArr);
//     });
// });
// function getId(account: number) {
//     return userArr.filter((item) => item.account === account);
// }
const app_port = 3000;
// const io_socket = 4000;
app.listen(app_port, () => {
    console.log(`ML ~ file: index.ts ~ line 42 ~ app.listen ~ app_port`, app_port);
});
// server.listen(io_socket, () => {
//     console.log(`ML ~ file: index.ts ~ line 45 ~ server.listen ~ io_socket`, io_socket);
// });
