import { calculate, finishHelpOrder, getUsers } from './index';
import IHelpInfo from '../ts/interface/IHelpInfo';
//  学生完成订单计算余额
export default async function calculateExtra(params: IHelpInfo) {
    console.log(`ML ~ file: calculateExtra.ts ~ line 5 ~ calculateExtra ~ params`, params);
    const { account, orderId, helperAccount, extra, finishTime } = params;
    const res = await finishHelpOrder({ orderId, finishTime });
    if (!res) {
        return false;
    }
    const users = await getUsers();
    if (users.length === 0) {
        return false;
    }
    const user = users.filter((item) => item.account === account);
    console.log(`ML ~ file: calculateExtra.ts ~ line 16 ~ calculateExtra ~ user`, user);
    const helper = users.filter((item) => item.account === helperAccount);
    console.log(`ML ~ file: calculateExtra.ts ~ line 18 ~ calculateExtra ~ helper`, helper);
    const userRes = user && (await calculate({ account: user[0].account, balance: user[0].balance - extra }));
    const helperRes = helper && (await calculate({ account: helper[0].account, balance: helper[0].balance + extra }));
    return userRes && helperRes ? true : false;
}
