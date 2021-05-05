import _ from 'lodash';
const data = [
    {
        id: 1,
        account: 'aa',
    },
    {
        id: 2,
        account: 'bb',
    },
];
for (let i of data) {
    if (i.id === 1) {
        _.set(i, 'account', '83974284');
    }
}
console.log(data);
