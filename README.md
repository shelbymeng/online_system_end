## 数据结构

### 学生发布求助信息

```ts
{
    account: number; //发布者学号
    userName:string;//发布者姓名
    category:string;//求助类别  取快递，取外卖，北区打水，南区打水，交易（卖书，买书）
    info: string; //求助信息
    location:string;//地点
    releaseTime: string; //发布时间
    state:string;//接单状态
    helperAccount?:number;//接单者学号
    helper?: string; //接单者姓名
    startTime?:string;//接单时间
    finishTime?: string; //完成时间
}
```

## 接口

### 通用说明

-   字段中所有与日期时间相关的字段，其值均采用 13 位时间戳字符串

### error 通用错误

| 值  |          说明          |
| :-: | :--------------------: |
|  0  |          成功          |
| 400 | 请求地址错误，路由错误 |
| 401 |   传递参数错误或为空   |

### - 用户登录

url: /login
method:POST
请求参数:
| 名称 | 类型 | 允许空 | 说明|
| --- | --- | :---: | --- |
| account| string | N| 用户名 |
| password| string|N|密码|

返回值:
| 名称 | 类型 | 允许空 | 说明|
| --- | --- | :---: | --- |
|error| int| N | 返回值错误码 0 |
|msg| string| Y | 返回值描述 |
|data|user 对象| N | 数据 |

user 对象
| 名称 | 类型 | 允许空 | 说明|
| --- | --- | :---: | --- |
| account | string | N | 用户名 |
| role | string | N | 用户角色 |

### - 学生发布求助信息

url: /handleHelpInfo
method:POST
请求参数：
| 名称 | 类型 | 允许空 | 说明|
| --- | --- | :---: | --- |
| orderId | number | N | 求助订单编码 | （前端生成）
| account | number | N | 学生学号 |
| userName | string | N | 学生姓名 |
| category | string | N | 求助类别 |
| info | string | N | 求助信息 |
| location | string | N | 地点 |
| releaseTime | string | N | 发布时间 |
| expectTime | string | N | 期望时间 |

返回值:
| 名称 | 类型 | 允许空 | 说明|
| --- | --- | :---: | --- |
|error| int| N|返回值错误码 0|
|msg| string| Y|返回值描述|

### - 学生接单

url: /approveHelpInfo
method:POST
请求参数：
| 名称 | 类型 | 允许空 | 说明|
| --- | --- | :---: | --- |
| orderId | number | N | 求助订单编码 |
| helperAccount | number | N | 接单者学号 |
| helper | string | N | 接单者姓名 |
| state | string | N | 接单状态 |
| startTime | string | N | 接单时间 |

### - 学生完成接单任务

url: /finishHelpOrder
method:POST
请求参数：
| 名称 | 类型 | 允许空 | 说明|
| --- | --- | :---: | --- |
| orderId | number | N | 求助订单编码 |
| finishTime | string | N | 完成时间 |

## 个人中心

### 查看我的提交订单

url:/getStudentHelpOrder
method:POST
| 名称 | 类型 | 允许空 | 说明|
| --- | --- | :---: | --- |
| account | number | N | 学生学号 |
返回值:
| 名称 | 类型 | 允许空 | 说明|
| --- | --- | :---: | --- |
|error| int| N|返回值错误码 0|
|msg| string| Y|返回值描述|
| data |

### 查看我的接单

### 撤销我提交的订单

### 取消接单

## 论坛

### 发表评论

### 回复评论

### 删除评论
