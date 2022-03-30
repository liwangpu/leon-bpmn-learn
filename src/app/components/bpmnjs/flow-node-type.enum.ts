export enum FlowNodeType {
    label = 'label',
    process = 'bpmn:Process',
    startEvent = 'bpmn:StartEvent',
    userTask = 'bpmn:UserTask',
    endEvent = 'bpmn:EndEvent',
    sequenceFlow = 'bpmn:SequenceFlow',
    exclusiveGateway = 'bpmn:ExclusiveGateway',
}
