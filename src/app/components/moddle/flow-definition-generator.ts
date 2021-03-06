export function flowDefinitionGenerator(): string {
    // tslint:disable-next-line: prefer-immediate-return
    const definition: string = `
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:flowable="http://flowable.org/bpmn" xmlns:activiti="http://activiti.org/bpmn" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" targetNamespace="http://bpmn.io/schema/bpmn">
  <process id="process_Gpx5c4Nb" name="工作流名称" isExecutable="true" flowable:skipFirstNode="true" flowable:rollbackNode="Activity_06t0e98">
    <documentation>工作流描述</documentation>
    <startEvent id="startEvent_1">
      <outgoing>Flow_0yhobgw</outgoing>
    </startEvent>
    <userTask id="Activity_06t0e98" name="发起人">
      <incoming>Flow_0yhobgw</incoming>
      <outgoing>Flow_00ryj5m</outgoing>
    </userTask>
    <sequenceFlow id="Flow_0yhobgw" sourceRef="startEvent_1" targetRef="Activity_06t0e98" />
    <endEvent id="Event_058o6mz">
      <incoming>Flow_00ryj5m</incoming>
    </endEvent>
    <sequenceFlow id="Flow_00ryj5m" sourceRef="Activity_06t0e98" targetRef="Event_058o6mz" />
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_flow">
    <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="process_Gpx5c4Nb">
      <bpmndi:BPMNEdge id="Flow_00ryj5m_di" bpmnElement="Flow_00ryj5m">
        <di:waypoint x="500" y="218" />
        <di:waypoint x="632" y="218" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0yhobgw_di" bpmnElement="Flow_0yhobgw">
        <di:waypoint x="276" y="218" />
        <di:waypoint x="400" y="218" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="BPMNShape_startEvent_1" bpmnElement="startEvent_1">
        <dc:Bounds x="240" y="200" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="247" y="243" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_06t0e98_di" bpmnElement="Activity_06t0e98">
        <dc:Bounds x="400" y="178" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_058o6mz_di" bpmnElement="Event_058o6mz">
        <dc:Bounds x="632" y="200" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
`;

    return definition;
}
