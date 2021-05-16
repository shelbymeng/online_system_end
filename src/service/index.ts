import { connection } from '../utils/connect';
import IUser from '../ts/interface/IUser';
import IHelpInfo from '../ts/interface/IHelpInfo';
import moment from 'moment';
import IComments from '../ts/interface/IComments';
import IAddress from '../ts/interface/IAddress';
import IUsers from '../ts/interface/IUsers';
import IOrderType from '../ts/interface/IOrderType';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

//  用户登录
async function login(params: IUser): Promise<Array<IUser>> {
    const { account, password } = params;
    return new Promise((resolve, reject) => {
        const sql = `select account,username,role,phonenumber,locked from user where account='${account}' and password='${password}'`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  注册
async function registrer(params: any) {
    const { account, username, password, phonenumber, role, address } = params;
    return new Promise((resolve, reject) => {
        const sql = `insert into user (account,username,password,phonenumber,role,address,balance,locked) values (${account},'${username}','${password}',${phonenumber},'${role}','${address}',500,'正常')`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(true);
            }
        });
    });
}
//  获取地址
async function getAddress(): Promise<Array<IAddress>> {
    return new Promise((resolve, reject) => {
        const sql = 'select * from addressTable';
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  管理员获取人员信息(除 管理员外)
async function getUsers(): Promise<Array<IUsers>> {
    return new Promise((resolve, reject) => {
        const sql = `select * from user where role != 'admin' `;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  管理员操作用户登录权限
async function updateUserStatus(params: IUsers) {
    const { account, locked } = params;
    return new Promise((resolve, reject) => {
        const sql = `update user set locked='${locked}' where account=${account}`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(true);
            }
        });
    });
}
//  获取订单类型
async function getOrderType(): Promise<Array<IOrderType>> {
    return new Promise((resolve, reject) => {
        const sql = 'select * from orderTypeTable';
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  管理员获取全部接单信息
async function getAllOrders(): Promise<Array<IHelpInfo>> {
    return new Promise((resolve, reject) => {
        const sql = 'select * from helpInfo';
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  获取全部未接单信息
async function getHelpInfo(account: number): Promise<Array<IHelpInfo>> {
    return new Promise((resolve, reject) => {
        const sql = `select * from helpInfo where account != ${account} and state='未接单' and appeal = '正常' and locked='正常'`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  学生提交求助信息
async function handleHelpInfo(params: IHelpInfo) {
    const { orderId, account, userName, category, info, location, releaseTime, expectTime, state, extra, urgency } = params;
    const fReleaseTime = moment(parseInt(releaseTime)).format(dateFormat);
    const fExpectTime = moment(parseInt(expectTime)).format(dateFormat);
    return new Promise((resolve, reject) => {
        const sql = `insert into helpInfo (orderId,account,userName,category,info,location,releaseTime,expectTime,state,extra,appeal,locked,urgency) values('${orderId}',${account},'${userName}','${category}','${info}','${location}','${fReleaseTime}','${fExpectTime}','${state}',${extra},'正常','正常','${urgency}')`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                const orders: Array<IHelpInfo> = [];
                for (let order of result) {
                    const { releaseTime, expectTime, ...item } = order;
                    orders.push({
                        ...item,
                        releaseTime: moment(releaseTime).format('x'),
                        expectTime: moment(expectTime).format('x'),
                    });
                }
                resolve(orders);
            }
        });
    });
}
//  学生接单
async function approveHelpInfo(params: any) {
    const { orderId, helperAccount, helper, state, startTime } = params;
    const fStartTime = moment(parseInt(startTime)).format(dateFormat);
    return new Promise((resolve, reject) => {
        const sql = `update helpInfo set helperAccount=${helperAccount},helper='${helper}',state='${state}',startTime='${fStartTime}' where orderId='${orderId}'`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  学生完成接单任务
async function finishHelpOrder(params: any) {
    const { orderId, finishTime } = params;
    const fFinishTime = moment(parseInt(finishTime)).format(dateFormat);
    return new Promise((resolve, reject) => {
        const sql = `update helpInfo set state='已完成',finishTime='${fFinishTime}' where orderId='${orderId}'`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  修改用户余额
async function calculate(params: any) {
    console.log(`ML ~ file: index.ts ~ line 175 ~ calculate ~ params`, params);
    const { account, balance } = params;
    return new Promise((resolve, reject) => {
        const sql = `update user set balance=${balance} where account=${account}`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(true);
            }
        });
    });
}
//  学生获取个人信息
async function getUserInfo(params: IUsers): Promise<IUsers> {
    const { account } = params;
    return new Promise((resolve, reject) => {
        const sql = `select * from user where account=${account}`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  学生修改个人信息
async function updateUserInfo(params: IUsers) {
    const { account, address, phonenumber } = params;
    return new Promise((resolve, reject) => {
        const sql = `update user set address='${address}', phonenumber=${phonenumber} where account=${account}`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(true);
            }
        });
    });
}
//  学生获取个人求助信息
async function getStudentHelpOrder(account: number): Promise<Array<IHelpInfo>> {
    return new Promise((resolve, reject) => {
        const sql = `select * from helpInfo where account=${account}`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  学生获取个人接单信息
async function getStudentApproveOrder(helperAccount: number): Promise<Array<IHelpInfo>> {
    return new Promise((resolve, reject) => {
        const sql = `select * from helpInfo where helperAccount=${helperAccount} and state != '已完成'`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  学生取消提交订单
async function cancelOrder(params: any) {
    const { orderId, account } = params;
    return new Promise((resolve, reject) => {
        const sql = `delete from helpInfo where orderId='${orderId}' and account=${account}`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  学生撤销接单
async function cancelApproveOrder(params: any) {
    const { orderId } = params;
    return new Promise((resolve, reject) => {
        const sql = `update helpInfo set state='未接单', helperAccount='',helper='',startTime=null where orderId='${orderId}'`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  获取留言
async function getComments(): Promise<Array<IComments>> {
    return new Promise((resolve, reject) => {
        const sql = `select * from commentsTable ORDER BY datetime DESC`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  提交留言
async function addComments(params: IComments) {
    const { commentId, account, author, datetime, content } = params;
    const fDatetime = moment(datetime).format(dateFormat);
    return new Promise((resolve, reject) => {
        const sql = `insert into commentsTable (commentId,account,author,datetime,content) values ('${commentId}',${account},'${author}','${fDatetime}','${content}')`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  获取留言回复
async function getMessages(commentId: string): Promise<Array<IComments>> {
    return new Promise((resolve, reject) => {
        const sql = `select * from messageTable where commentId='${commentId}'`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  留言回复
async function addMessages(params: IComments) {
    const { commentId, account, author, datetime, content } = params;
    const fDatetime = moment(datetime).format(dateFormat);
    return new Promise((resolve, reject) => {
        const sql = `insert into messageTable (commentId,account,author,datetime,content) values ('${commentId}',${account},'${author}','${fDatetime}','${content}')`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

//  管理员功能
//  配置订单种类
async function setOrderType(params: IOrderType) {
    const { orderType } = params;
    return new Promise((resolve, reject) => {
        const sql = `insert into orderTypeTable (orderType) values ('${orderType}')`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(true);
            }
        });
    });
}
//  订单种类删除
async function deleteOrderType(params: IOrderType) {
    const { id } = params;
    return new Promise((resolve, reject) => {
        const sql = `delete from orderTypeTable where id=${id}`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(true);
            }
        });
    });
}
//  管理员获取申诉或冻结订单
async function getAbnormalOrders(): Promise<Array<IHelpInfo>> {
    return new Promise((resolve, reject) => {
        const sql = `select * from helpinfo where appeal = '申诉' or locked = '冻结'`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
//  管理员冻结账单
async function lockOrder(params: IHelpInfo) {
    const { orderId } = params;
    return new Promise((resolve, reject) => {
        const sql = `update helpInfo set locked='冻结' where orderId = '${orderId}'`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(true);
            }
        });
    });
}
//  学生申诉
async function userAppealOrder(params: IHelpInfo) {
    const { orderId } = params;
    return new Promise((resolve, reject) => {
        const sql = `update helpInfo set appeal='申诉' where orderId='${orderId}'`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(true);
            }
        });
    });
}
//  管理员解决申诉订单
async function dealAppealOrder(params: IHelpInfo) {
    const { orderId } = params;
    return new Promise((resolve, reject) => {
        const sql = `update helpInfo set appeal='正常' where orderId='${orderId}'`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(true);
            }
        });
    });
}
export {
    login,
    registrer,
    getAddress,
    getUsers,
    updateUserStatus,
    getOrderType,
    getAllOrders,
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
    addMessages,
    getMessages,
    setOrderType,
    deleteOrderType,
    getAbnormalOrders,
    lockOrder,
    userAppealOrder,
    dealAppealOrder,
    calculate,
};
