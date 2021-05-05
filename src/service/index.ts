import { connection } from '../utils/connect';
import IUser from '../ts/interface/IUser';
import IHelpINfo from '../ts/interface/IHelpInfo';
import moment from 'moment';
import IComments from '../ts/interface/IComments';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

//  用户登录
async function login(params: IUser): Promise<Array<IUser>> {
    const { account, password } = params;
    return new Promise((resolve, reject) => {
        const sql = `select account,username,role from user where account='${account}' and password='${password}'`;
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
async function getHelpInfo(account: number): Promise<Array<IHelpINfo>> {
    return new Promise((resolve, reject) => {
        const sql = `select * from helpInfo where account != ${account} and state='未接单'`;
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
async function handleHelpInfo(params: IHelpINfo) {
    const { orderId, account, userName, category, info, location, releaseTime, expectTime, state } = params;
    const fReleaseTime = moment(parseInt(releaseTime)).format(dateFormat);
    const fExpectTime = moment(parseInt(expectTime)).format(dateFormat);
    return new Promise((resolve, reject) => {
        const sql = `insert into helpInfo (orderId,account,userName,category,info,location,releaseTime,expectTime,state) values('${orderId}',${account},'${userName}','${category}','${info}','${location}','${fReleaseTime}','${fExpectTime}','${state}')`;
        connection.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                const orders: Array<IHelpINfo> = [];
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
//  学生获取个人求助信息
async function getStudentHelpOrder(account: number): Promise<Array<IHelpINfo>> {
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
async function getStudentApproveOrder(helperAccount: number): Promise<Array<IHelpINfo>> {
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
export {
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
    addMessages,
    getMessages,
};
