export const Descriptor = {
    "name": "Custom",
    "uri": "http://custom/org",
    "prefix": "cus",
    "types": [
        {
            "name": "Card",
            "properties": [
                {
                    "name": "key",
                    "type": "String",
                    "isAttr": true
                },
                {
                    "name": "name",
                    "type": "String",
                    "isAttr": true
                }
            ]
        },
        {
            "name": "Person",
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
                    "name": "age",
                    "type": "Number",
                    "isAttr": true
                },
                {
                    "name": "cards",
                    "type": "Card",
                    "isMany": true
                }
            ]
        },
    ]
};