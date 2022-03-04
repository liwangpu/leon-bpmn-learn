export const Descriptor = {
    "name": "Mirror",
    "uri": "http://camunda.org/schema/1.0/bpmn",
    "prefix": "mo",
    "xml": {
        "tagAlias": "lowerCase"
    },
    "associations": [],
    "types": [
        {
            "name": "Participant",
            "superClass": [
                "InOutBinding"
            ],
            "meta": {
                "allowedIn": [
                    "bpmn:CallActivity",
                    "bpmn:SignalEventDefinition"
                ]
            }
        },
    ],
    "emumerations": []
};