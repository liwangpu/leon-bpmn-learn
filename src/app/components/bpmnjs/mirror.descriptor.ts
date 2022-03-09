export const Descriptor = {
    "name": "flowable",
    "uri": "http://flowable.org/bpmn",
    "prefix": "flowable",
    "xml": {
        "tagAlias": "lowerCase"
    },
    "associations": [],
    "types": [
        {
            "name": "employee",
            "properties": [
                {
                    "name": "id",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "age",
                    "isAttr": true,
                    "type": "Number",
                    "default": 1
                },
            ]
        },
        {
            "name": "assignee",
            "superClass": ["Element"],
            "properties": [
                {
                    "name": "type",
                    "type": "String",
                    "isAttr": true,
                },
                {
                    "name": "value",
                    "type": "String",
                    "isAttr": true,
                },
            ]
        },
        {
            "name": "Properties",
            "superClass": [
                "Element"
            ],
            "meta": {
                "allowedIn": ["*"]
            },
            "properties": [
                {
                    "name": "values",
                    "type": "Property",
                    "isMany": true
                }
            ]
        },
        {
            "name": "Property",
            "superClass": [
                "Element"
            ],
            "properties": [
                {
                    "name": "id",
                    "type": "String",
                    "isAttr": true
                },
                {
                    "name": "name",
                    "type": "String",
                    "isAttr": true
                },
                {
                    "name": "value",
                    "type": "String",
                    "isAttr": true
                }
            ]
        },
    ],
    "emumerations": []
};