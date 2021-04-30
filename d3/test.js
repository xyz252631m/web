const data ={
    "status": 200,
    "result": {
        "nodes": [
            {
                "id": "1",
                "nodeType": "company",
                "typeId": "tzf",
                "typeName": "投资方",
                "properties": {
                    "keyNo": "276352a95db7aa252420e896ffb1ff6c",
                    "registCapi": "46415.828",
                    "name": "XXX股份有限公司",
                    "econKind": "其他股份有限公司(上市)",
                    "hasImage": true,
                    "statusId": "1",
                    "status": "正常户"
                }
            },
            {
                "id": "2",
                "nodeType": "company",
                "typeId": "glry",
                "typeName": "管理人员",
                "properties": {
                    "keyNo": "47635c2a6eabc66e0c54edf44e112a11",
                    "registCapi": "6000.000",
                    "name": "华农健康产业发展有限公司",
                    "econKind": "有限责任公司(自然人投资或控股)",
                    "hasImage": false,
                    "statusId": "-1",
                    "status": "非正常户"
                }
            },
            {
                "id": "3",
                "nodeType": "company",
                "typeId": "fzjg",
                "typeName": "分支机构",
                "properties": {
                    "keyNo": "d0ca754f7049728c42859eb8a28a17fb",
                    "registCapi": "5000.000",
                    "name": "无锡美林数联科技有限公司",
                    "econKind": "有限责任公司(自然人投资或控股)",
                    "hasImage": false,
                    "statusId": "-3",
                    "status": "清算"
                }
            },
            {
                "id": "4",
                "nodeType": "company",
                "typeId": "sjjg",
                "typeName": "上级机构",
                "properties": {
                    "keyNo": "dee21f29a987890b7fd1e0d0d826a1c2",
                    "registCapi": "500.000",
                    "name": "上海琢学科技有限公司",
                    "econKind": "有限责任公司（自然人投资或控股的法人独资）",
                    "hasImage": false,
                    "statusId": "1",
                    "status": "正常户"
                }
            },
            {
                "id": "5",
                "nodeType": "company",
                "typeId": "tz",
                "typeName": "投资",
                "properties": {
                    "keyNo": "fd53eebf6fec1c00d41f1c4406ebbb87",
                    "registCapi": "221.053",
                    "name": "西安深谱之光智能科技有限公司",
                    "econKind": "有限责任公司(自然人投资或控股)",
                    "hasImage": true,
                    "statusId": "-2",
                    "status": "注销"
                }
            },
            {
                "id": "6",
                "nodeType": "person",
                "typeId": "tz",
                "typeName": "投资",
                "properties": {
                    "keyNo": "p5bf198309851fe05e3dad0bc3d3e48e",
                    "role": "自然人股东",
                    "name": "王志坚",
                    "hasImage": false
                }
            },
            {
                "id": "7",
                "nodeType": "person",
                "typeId": "tz",
                "typeName": "投资",
                "properties": {
                    "keyNo": "p6fcdfc51320ba2f68e07b19f0678b96",
                    "role": "自然人股东",
                    "name": "李炜",
                    "hasImage": false
                }
            },
            {
                "id": "8",
                "nodeType": "person",
                "typeId": "tz",
                "typeName": "投资",
                "properties": {
                    "keyNo": "p9716455e8dfef7326b39ec43003af2d",
                    "role": "自然人股东",
                    "name": "郭联伟",
                    "hasImage": false
                }
            },
            {
                "id": "9",
                "nodeType": "person",
                "typeId": "tz",
                "typeName": "投资",
                "properties": {
                    "keyNo": "pbd00865ba4e05a06afd85a30e687b72",
                    "role": "自然人股东",
                    "name": "张鹏飞",
                    "hasImage": true
                }
            }
        ],
        "links": [
            {
                "id": "6562919",
                "source": "1",
                "target": "2",
                "properties": {
                    "role": "分支机构"
                }
            },
            {
                "id": "150868219",
                "source": "3",
                "target": "1",
                "properties": {
                    "role": "上级机构"
                }
            },
            {
                "id": "6562920",
                "source": "1",
                "target": "4",
                "properties": {
                    "role": "持股",
                    "stockPercent": 100,
                    "shouldCapi": "200万"
                }
            },
            {
                "id": "656292033",
                "source": "5",
                "target": "1",
                "properties": {
                    "role": "持股",
                    "stockPercent": 49,
                    "shouldCapi": "200万"
                }
            },
            {
                "id": "138822743",
                "source": "6",
                "target": "5",
                "properties": {
                    "role": "财务负责人"
                }
            },
            {
                "id": "153442098",
                "source": "7",
                "target": "1",
                "properties": {
                    "role": "持股",
                    "stockPercent": 51,
                    "shouldCapi": "200万"
                }
            },
            {
                "id": "4561500",
                "source": "8",
                "target": "1",
                "properties": {
                    "role": "法人"
                }
            },
            {
                "id": "189975922",
                "source": "9",
                "target": "1",
                "properties": {
                    "role": "财务负责人"
                }
            },
            {
                "id": "1799220",
                "source": "8",
                "target": "5",
                "properties": {
                    "role": "法人"
                }
            },
            {
                "id": "276747328",
                "source": "8",
                "target": "5",
                "properties": {
                    "role": "持股",
                    "stockPercent": 100,
                    "shouldCapi": "500万"
                }
            }
        ]
    }
}
