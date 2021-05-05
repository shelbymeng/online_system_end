import { Socket } from 'socket.io';

interface IUser {
    account: string;
    role: string;
    sid: string;
}

export default function fetchUser(socket: Socket) {
    const { id } = socket;
    const userArr: Array<IUser> = [];

}
