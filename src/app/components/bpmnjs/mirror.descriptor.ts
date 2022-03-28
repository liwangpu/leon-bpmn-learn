export const Descriptor: { [key: string]: any } = {
    "name": "Flowable",
    "uri": "http://flowable.org/bpmn",
    "prefix": "flowable",
    "xml": {
        "tagAlias": "lowerCase"
    },
    "associations": [],
    "types": [
        {
            "name": "Employee",
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
            'name': 'ConditionExp',
            'superClass': ['Element'],
            // 'superClass': ['bpmn:BaseElement'],
            // 'superClass': ['bpmn:Expression'],
            'properties': [
                {
                    "name": "body",
                    "isBody": true,
                    // "type": "String",
                    "type": "Expression",
                    "xml": {
                        "serialize": "xsi:type"
                    }
                }
            ]
        }
    ],
    "emumerations": []
};