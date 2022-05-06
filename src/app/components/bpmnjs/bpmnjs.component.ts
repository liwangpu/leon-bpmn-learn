import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import Modeler from 'bpmn-js/lib/Modeler';
import { HttpClient } from '@angular/common/http';
import { Element as ModdleElement, Moddle } from 'moddle';
// import { Descriptor as CamundaDescriptor } from './camunda.descriptor';
import { Descriptor as MirrorDescriptor } from './mirror.descriptor';
import { Descriptor as FlowableDescriptor } from './flowable.descriptor';
import minimapModule from 'diagram-js-minimap';
import { Reader, Writer } from 'moddle-xml';
import customTranslate from './custom-translate';
// import { el } from 'bpmn-moddle';
import * as _ from 'lodash';
import { traceUpStreamElement } from './utils';



const cacheStorageKey: string = 'flowCache';
const cacheXmlFilenameKey: string = 'xmlFilename';

var customTranslateModule = {
    translate: ['value', customTranslate]
};

class CustomContextPadProvider {
    constructor(contextPad) {
        contextPad.registerProvider(this);
    }

    getContextPadEntries(element) {
        return function (entries) {
            delete entries["delete"];
            console.log('entries:',entries);
            console.log('element:',element);
            return entries;
        };
    }
}


@Component({
    selector: 'app-bpmnjs',
    templateUrl: './bpmnjs.component.html',
    styleUrls: ['./bpmnjs.component.scss']
})
export class BpmnjsComponent implements OnInit {

    public filename: string;
    public readonly simpleBpmnDoc = 'simple';
    public readonly gatewayBpmnDoc = 'gateway';
    public readonly traceUpStreamBpmnDoc = 'trace-upstream';
    public readonly flowableBpmnDoc = 'flowable';
    public modeler: any;
    public constructor(
        private http: HttpClient
    ) { }


    public async ngOnInit(): Promise<void> {
        // let bpmnXML = localStorage.getItem(cacheStorageKey);
        // let lastFilename = localStorage.getItem(cacheXmlFilenameKey);
        // if (!bpmnXML) {
        //     bpmnXML = await this.loadXML(lastFilename || this.simpleBpmnDoc);
        // }
        // let bpmnXML = this.getTmpXML();
        let bpmnXML = this.getServerXML();

        // bpmnXML = await this.loadXML(this.simpleBpmnDoc);

        this.filename = localStorage.getItem(cacheXmlFilenameKey);

        this.modeler = new Modeler({
            container: '#container',
            // additionalModules: [
            //     minimapModule
            // ],
            moddleExtensions: {
                // flowable: FlowableDescriptor,
                // mirror: MirrorDescriptor,
                flowable: { ...FlowableDescriptor, types: [...MirrorDescriptor.types, ...FlowableDescriptor.types] }
            },
            // 插件
            additionalModules: [
                customTranslateModule,
                {
                    __init__: ["customContextPadProvider"],
                    customContextPadProvider: ["type", CustomContextPadProvider]
                }
            ]
        });


        // console.log('title:',bpmnXML);
        await this.modeler.importXML(bpmnXML);

        this.modeler.on('element.click', (e: any) => {
            const shape: any = this.getElementRegistry().get(e.element.id);
            // console.log('type:', shape?.type);
            // console.log('shape:', shape);
            // if (this.filename === this.traceUpStreamBpmnDoc) {
            // const upstream = traceUpStreamElement(shape.businessObject, ['bpmn:SequenceFlow', 'bpmn:Gateway', 'bpmn:Event'], true);
            // const upstream = traceUpStreamElement(shape.businessObject, [], true);
            // console.log('上游节点:', upstream);
            // }
        });

        this.modeler.on('commandStack.changed', async () => {
            const { xml } = await this.modeler.saveXML({ format: true });
            localStorage.setItem(cacheStorageKey, xml);
        });
    }

    public async translate(): Promise<string> {
        const { xml } = await this.modeler.saveXML({ format: true });
        console.log(xml);
        return xml;
    }

    public async save(): Promise<void> {
        const { xml } = await this.modeler.saveXML({ format: true });
        localStorage.setItem(cacheStorageKey, xml);
    }

    public async loadSimpleXML(): Promise<void> {
        let xml = await this.loadXML(this.simpleBpmnDoc);
        await this.modeler.importXML(xml);
        this.save();
    }

    public async loadGatewayXML(): Promise<void> {
        let xml = await this.loadXML(this.gatewayBpmnDoc);
        await this.modeler.importXML(xml);
        this.save();
    }

    public async loadTraceUpStreamXML(): Promise<void> {
        let xml = await this.loadXML(this.traceUpStreamBpmnDoc);
        await this.modeler.importXML(xml);
        this.save();
    }

    public async loadFlowableXML(): Promise<void> {
        let xml = await this.loadXML(this.flowableBpmnDoc);
        await this.modeler.importXML(xml);
        this.save();
    }

    public async checkGatewayElement(): Promise<void> {
        const shape = this.getElementRegistry().get('Gateway_007fdxl');
        console.log('shape:', shape.definition);
        const businessObject = shape.businessObject;
        console.log('businessObject', businessObject);
        const outgoing = businessObject.outgoing;
        console.log('outgoing', outgoing);
    }

    public clearCache(): void {
        localStorage.removeItem(cacheStorageKey);
        location.reload();
    }

    public async updateElementAttrs(): Promise<void> {
        const moddle = this.getModdle();
        const shape = this.getElementRegistry().get('Gateway_007fdxl');
        const businessObject = shape.businessObject;


        // const attrs = { 'flowable:my-test': '天天开心' };
        // businessObject.$attrs['flowable:my-test'] = '嘻嘻哈哈';

        // this.getModeling().updateProperties(shape, shape.businessObject);
        let extensionElements = shape?.businessObject?.extensionElements;
        if (!extensionElements) {
            extensionElements = moddle.create('bpmn:ExtensionElements');
        }
        shape.businessObject.extensionElements = extensionElements;
        this.getModeling().updateProperties(shape, { extensionElements, ['flowable:my-test1']: '天天开心' });


        const xml = await this.translate();
        localStorage.setItem(cacheStorageKey, xml);
    }

    public async deleteElementAttrs(): Promise<void> {
        const shape = this.getElementRegistry().get('Gateway_007fdxl');
        const businessObject = shape.businessObject;
        console.log('title:', businessObject.$attrs);
        delete businessObject.$attrs['flowable:my-test'];
    }

    public async updateElementExtension(): Promise<void> {
        const moddle = this.getModdle();
        const shape = this.getElementRegistry().get('Gateway_007fdxl');
        const businessObject = shape.businessObject;
        let extensionElements = shape?.businessObject?.extensionElements || moddle.create('bpmn:ExtensionElements');

        extensionElements.values = [];

        // var exp = "嘻嘻";
        // const myExp = moddle.create("flowable:MyExpression", { body: `<![CDATA[${exp}]]>` }); // variable
        // extensionElements.values.push(myExp);

        const e1 = moddle.create("flowable:Employee", { id: 1, age: 18 });
        extensionElements.values.push(e1);

        var exp = { link: 'and', conditions: [] };
        const myExp = moddle.create("flowable:ConditionExp", { body: `<![CDATA[${JSON.stringify(exp)}]]>` }); // variable
        extensionElements.values.push(myExp);

        // businessObject.extensionElements = extensionElements;
        this.getModeling().updateProperties(shape, { extensionElements });

        const xml = await this.translate();
        localStorage.setItem(cacheStorageKey, xml);
    }

    public async checkElementAttrs(): Promise<void> {
        const shape = this.getElementRegistry().get('Gateway_007fdxl');
        const businessObject = shape.businessObject;
        console.log('attrs:', businessObject.$attrs);
    }

    public async checkElementExtension(): Promise<void> {
        const moddle = this.getModdle();
        const shape = this.getElementRegistry().get('Gateway_007fdxl');
        const businessObject = shape.businessObject;
        let extensionElements = shape?.businessObject?.extensionElements || moddle.create('bpmn:ExtensionElements');

        let myExp = extensionElements.values.find(e => e.$instanceOf('flowable:ConditionExp'));
        console.log('exp:', myExp.body);
    }

    public async updateGatewayDefault(): Promise<void> {
        const moddle = this.getModdle();
        const shape = this.getElementRegistry().get('Gateway_007fdxl');
        const businessObject = shape.businessObject;
        const cd1 = this.getElementRegistry().get('Flow_1xnt7a9').businessObject;
        // businessObject.default = cd1;
        this.getModeling().updateProperties(shape, { default: cd1 });
        const xml = await this.translate();
        localStorage.setItem(cacheStorageKey, xml);
    }

    public async checkRefUpStreamNode(): Promise<void> {
        const moddle = this.getModdle();
        const shape = this.getElementRegistry().get('Activity_154zjtd');
        const businessObject = shape.businessObject;
        console.log('shape:', shape);
        console.log('shape:', shape.parent);
    }

    public async changeFlowableAttrs(): Promise<void> {
        const moddle = this.getModdle();
        const shape = this.getElementRegistry().get('Activity_0j03jym');
        let extensionElements = shape?.businessObject?.extensionElements || moddle.create("bpmn:ExtensionElements");
        extensionElements.values = [];

        let updateObj: { [key: string]: any } = {};
        updateObj.name = `test ${+new Date()}`;

        updateObj['flowable:my-title'] = '测试名称';

        updateObj.extensionElements = extensionElements;
        this.getModeling().updateProperties(shape, updateObj);
        const xml = await this.translate();
        localStorage.setItem(cacheStorageKey, xml);
    }

    public async userTaskChangeParticipant(): Promise<void> {
        const shape = this.getElementRegistry().get('Activity_06t0e98');
        const moddle = this.getModdle();
        console.log('shape:', shape);
        console.log('businessObject:', shape?.businessObject);
        console.log('extensionElements:', shape?.businessObject?.extensionElements);
        let extensionElements = shape?.businessObject?.extensionElements;
        if (!extensionElements) {
            console.log('create ext:',);
            // extensionElements = moddle.create("flowable:extensionElements");
            extensionElements = moddle.create("bpmn:ExtensionElements");
        }
        extensionElements.values = [];
        // extensionElements.id = 'my_custom_ext';
        const newUser = moddle.create("flowable:Assignee"); // variable
        newUser.type = 'user';
        newUser.value = +new Date();
        extensionElements.values.push(newUser);

        const newRow = moddle.create("flowable:Assignee"); // variable
        newRow.type = 'role';
        newRow.value = +new Date();
        extensionElements.values.push(newRow);
        this.getModeling().updateProperties(shape, {
            name: '修改中....',
            extensionElements
        });
        this.translate();
    }

    public async changeSimpleXML2Element(): Promise<void> {
        const shape = this.getElementRegistry().get('Activity_1hj5vg8');
        const moddle = this.getModdle();
        console.log('shape:', shape);
        console.log('businessObject:', shape.businessObject);
        // console.log('documentation:', shape.businessObject.documentation);
        // let extensionElements = shape.businessObject?.extensionElements;
        // console.log('extensionElements:', extensionElements);
        // const documentation = shape.businessObject.documentation;
        // documentation.text = "我是描述哦,嘻嘻嘻";
        const updateObj: any = {};
        updateObj.name = `5 ${+new Date()}`;
        updateObj['flowable:my-test'] = 'my-test';

        let extensionElements = shape?.businessObject?.extensionElements || moddle.create('bpmn:ExtensionElements');
        extensionElements.values = [];
        const e1 = moddle.create("flowable:Employee", { id: 'p1', age: 18 }); // variable
        extensionElements.values.push(e1);
        updateObj.extensionElements = extensionElements;

        this.getModeling().updateProperties(shape, updateObj);
    }

    public async changeXML(): Promise<void> {
        let bpmnXML = await this.http.get('/assets/diagram.bpmn', { responseType: 'text' }).toPromise();
        const reader = new Reader(bpmnXML);
        const rootHandler = reader.handler('process');
        console.log('title:', rootHandler);

    }

    public async reRender(): Promise<void> {
        let bpmnXML = await this.http.get('/assets/newDiagram.bpmn', { responseType: 'text' }).toPromise();
        await this.modeler.importXML(bpmnXML);
    }

    private getTmpXML(): string {
        return `
        <?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" targetNamespace="http://bpmn.io/schema/bpmn">
          <bpmn:process id="Process_1t03o4w" isExecutable="false">
            <bpmn:startEvent id="StartEvent_09hx5ui">
              <bpmn:outgoing>Flow_080ax4j</bpmn:outgoing>
            </bpmn:startEvent>
            <bpmn:exclusiveGateway id="Gateway_0jnjamq">
              <bpmn:incoming>Flow_080ax4j</bpmn:incoming>
              <bpmn:outgoing>Flow_0thkae6</bpmn:outgoing>
            </bpmn:exclusiveGateway>
            <bpmn:sequenceFlow id="Flow_080ax4j" sourceRef="StartEvent_09hx5ui" targetRef="Gateway_0jnjamq" />
            <bpmn:sequenceFlow id="Flow_0thkae6" sourceRef="Gateway_0jnjamq" targetRef="Activity_1qtr9ur" />
            <bpmn:sequenceFlow id="Flow_129jq20" sourceRef="Activity_1qtr9ur" targetRef="Activity_0j03jym" />
            <bpmn:userTask id="Activity_1qtr9ur" name="1">
              <bpmn:incoming>Flow_0thkae6</bpmn:incoming>
              <bpmn:outgoing>Flow_129jq20</bpmn:outgoing>
            </bpmn:userTask>
            <bpmn:endEvent id="Event_0wg04aj">
              <bpmn:incoming>Flow_0yjf17q</bpmn:incoming>
            </bpmn:endEvent>
            <bpmn:sequenceFlow id="Flow_0yjf17q" sourceRef="Activity_0j03jym" targetRef="Event_0wg04aj" />
            <bpmn:userTask id="Activity_0j03jym" name="2">
              <bpmn:incoming>Flow_129jq20</bpmn:incoming>
              <bpmn:outgoing>Flow_0yjf17q</bpmn:outgoing>
            </bpmn:userTask>
          </bpmn:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1t03o4w">
              <bpmndi:BPMNEdge id="Flow_0yjf17q_di" bpmnElement="Flow_0yjf17q">
                <di:waypoint x="630" y="120" />
                <di:waypoint x="702" y="120" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_129jq20_di" bpmnElement="Flow_129jq20">
                <di:waypoint x="460" y="120" />
                <di:waypoint x="530" y="120" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_0thkae6_di" bpmnElement="Flow_0thkae6">
                <di:waypoint x="295" y="120" />
                <di:waypoint x="360" y="120" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNEdge id="Flow_080ax4j_di" bpmnElement="Flow_080ax4j">
                <di:waypoint x="188" y="120" />
                <di:waypoint x="245" y="120" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_09hx5ui">
                <dc:Bounds x="152" y="102" width="36" height="36" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Gateway_0jnjamq_di" bpmnElement="Gateway_0jnjamq" isMarkerVisible="true">
                <dc:Bounds x="245" y="95" width="50" height="50" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_0dar54s_di" bpmnElement="Activity_1qtr9ur">
                <dc:Bounds x="360" y="80" width="100" height="80" />
                <bpmndi:BPMNLabel />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Event_0wg04aj_di" bpmnElement="Event_0wg04aj">
                <dc:Bounds x="702" y="102" width="36" height="36" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="Activity_000f3wi_di" bpmnElement="Activity_0j03jym">
                <dc:Bounds x="530" y="80" width="100" height="80" />
                <bpmndi:BPMNLabel />
              </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn:definitions>
        `;
    }

    public getServerXML(): string {
        return `
        <?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI"  targetNamespace="http://bpmn.io/schema/bpmn">
  <process id="Process_1t03o4w" isExecutable="false">
    <startEvent id="StartEvent_09hx5ui"></startEvent>
    <exclusiveGateway id="Gateway_0jnjamq"></exclusiveGateway>
    <sequenceFlow id="Flow_080ax4j" sourceRef="StartEvent_09hx5ui" targetRef="Gateway_0jnjamq"></sequenceFlow>
    <sequenceFlow id="Flow_0thkae6" sourceRef="Gateway_0jnjamq" targetRef="Activity_1qtr9ur"></sequenceFlow>
    <sequenceFlow id="Flow_129jq20" sourceRef="Activity_1qtr9ur" targetRef="Activity_0j03jym"></sequenceFlow>
    <userTask id="Activity_1qtr9ur" name="1"></userTask>
    <endEvent id="Event_0wg04aj"></endEvent>
    <sequenceFlow id="Flow_0yjf17q" sourceRef="Activity_0j03jym" targetRef="Event_0wg04aj"></sequenceFlow>
    <userTask id="Activity_0j03jym" name="2"></userTask>
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_Process_1t03o4w">
    <bpmndi:BPMNPlane bpmnElement="Process_1t03o4w" id="BPMNPlane_Process_1t03o4w">
      <bpmndi:BPMNShape bpmnElement="StartEvent_09hx5ui" id="BPMNShape_StartEvent_09hx5ui">
        <omgdc:Bounds height="36.0" width="36.0" x="152.0" y="102.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="Gateway_0jnjamq" id="BPMNShape_Gateway_0jnjamq">
        <omgdc:Bounds height="50.0" width="50.0" x="245.0" y="95.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="Activity_1qtr9ur" id="BPMNShape_Activity_1qtr9ur">
        <omgdc:Bounds height="80.0" width="100.0" x="360.0" y="80.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="Event_0wg04aj" id="BPMNShape_Event_0wg04aj">
        <omgdc:Bounds height="36.0" width="36.0" x="702.0" y="102.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="Activity_0j03jym" id="BPMNShape_Activity_0j03jym">
        <omgdc:Bounds height="80.0" width="100.0" x="530.0" y="80.0"></omgdc:Bounds>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge bpmnElement="Flow_0yjf17q" id="BPMNEdge_Flow_0yjf17q">
        <omgdi:waypoint x="630.0" y="120.0"></omgdi:waypoint>
        <omgdi:waypoint x="702.0" y="120.0"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="Flow_129jq20" id="BPMNEdge_Flow_129jq20">
        <omgdi:waypoint x="460.0" y="120.0"></omgdi:waypoint>
        <omgdi:waypoint x="530.0" y="120.0"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="Flow_0thkae6" id="BPMNEdge_Flow_0thkae6">
        <omgdi:waypoint x="295.0" y="120.0"></omgdi:waypoint>
        <omgdi:waypoint x="360.0" y="120.0"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge bpmnElement="Flow_080ax4j" id="BPMNEdge_Flow_080ax4j">
        <omgdi:waypoint x="188.0" y="120.0"></omgdi:waypoint>
        <omgdi:waypoint x="245.0" y="120.0"></omgdi:waypoint>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
        `;
    }

    private loadXML(filename: string): Promise<string> {
        this.filename = filename;
        localStorage.setItem(cacheXmlFilenameKey, filename);
        return this.http.get(`/assets/${filename}.bpmn`, { responseType: 'text' }).toPromise();
    }

    private testEvent(): void {
        const events = [
            "attach",
            "autoPlace",
            "autoPlace.end",
            "bendpoint.move.cancel",
            "bendpoint.move.cleanup",
            "bendpoint.move.end",
            "bendpoint.move.hover",
            "bendpoint.move.move",
            "bendpoint.move.out",
            "bendpoint.move.start",
            "bpmnElement.added",
            "canvas.destroy",
            "canvas.init",
            "canvas.resized",
            "canvas.viewbox.changed",
            "canvas.viewbox.changing",
            "commandStack.canvas.updateRoot.executed",
            "commandStack.canvas.updateRoot.postExecute",
            "commandStack.canvas.updateRoot.preExecute",
            "commandStack.canvas.updateRoot.reverted",
            "commandStack.changed",
            "commandStack.connection.create.canExecute",
            "commandStack.connection.create.executed",
            "commandStack.connection.create.postExecute",
            "commandStack.connection.create.postExecuted",
            "commandStack.connection.create.preExecute",
            "commandStack.connection.create.preExecuted",
            "commandStack.connection.create.reverted",
            "commandStack.connection.delete.executed",
            "commandStack.connection.delete.preExecute",
            "commandStack.connection.delete.reverted",
            "commandStack.connection.layout.executed",
            "commandStack.connection.layout.postExecute",
            "commandStack.connection.layout.postExecuted",
            "commandStack.connection.layout.reverted",
            "commandStack.connection.move.executed",
            "commandStack.connection.move.preExecute",
            "commandStack.connection.move.reverted",
            "commandStack.connection.reconnect.canExecute",
            "commandStack.connection.reconnect.executed",
            "commandStack.connection.reconnect.postExecute",
            "commandStack.connection.reconnect.preExecute",
            "commandStack.connection.reconnect.reverted",
            "commandStack.connection.start.canExecute",
            "commandStack.connection.updateWaypoints.canExecute",
            "commandStack.connection.updateWaypoints.executed",
            "commandStack.connection.updateWaypoints.postExecute",
            "commandStack.connection.updateWaypoints.postExecuted",
            "commandStack.connection.updateWaypoints.reverted",
            "commandStack.element.autoResize.canExecute",
            "commandStack.element.copy.canExecute",
            "commandStack.element.updateAttachment.executed",
            "commandStack.element.updateAttachment.reverted",
            "commandStack.element.updateProperties.postExecute",
            "commandStack.element.updateProperties.postExecuted",
            "commandStack.elements.create.canExecute",
            "commandStack.elements.create.postExecute",
            "commandStack.elements.create.postExecuted",
            "commandStack.elements.create.preExecute",
            "commandStack.elements.create.revert",
            "commandStack.elements.delete.postExecuted",
            "commandStack.elements.delete.preExecute",
            "commandStack.elements.move.canExecute",
            "commandStack.elements.move.postExecuted",
            "commandStack.elements.move.preExecute",
            "commandStack.elements.move.preExecuted",
            "commandStack.label.create.postExecuted",
            "commandStack.lane.add.postExecuted",
            "commandStack.lane.add.preExecute",
            "commandStack.lane.resize.postExecuted",
            "commandStack.lane.resize.preExecute",
            "commandStack.lane.split.postExecuted",
            "commandStack.lane.split.preExecute",
            "commandStack.shape.append.preExecute",
            "commandStack.shape.attach.canExecute",
            "commandStack.shape.create.canExecute",
            "commandStack.shape.create.execute",
            "commandStack.shape.create.executed",
            "commandStack.shape.create.postExecute",
            "commandStack.shape.create.postExecuted",
            "commandStack.shape.create.preExecute",
            "commandStack.shape.create.revert",
            "commandStack.shape.create.reverted",
            "commandStack.shape.delete.execute",
            "commandStack.shape.delete.executed",
            "commandStack.shape.delete.postExecute",
            "commandStack.shape.delete.postExecuted",
            "commandStack.shape.delete.preExecute",
            "commandStack.shape.delete.revert",
            "commandStack.shape.delete.reverted",
            "commandStack.shape.move.executed",
            "commandStack.shape.move.postExecute",
            "commandStack.shape.move.postExecuted",
            "commandStack.shape.move.preExecute",
            "commandStack.shape.move.reverted",
            "commandStack.shape.replace.postExecute",
            "commandStack.shape.replace.postExecuted",
            "commandStack.shape.replace.preExecuted",
            "commandStack.shape.resize.canExecute",
            "commandStack.shape.resize.executed",
            "commandStack.shape.resize.postExecute",
            "commandStack.shape.resize.postExecuted",
            "commandStack.shape.resize.preExecute",
            "commandStack.shape.resize.reverted",
            "commandStack.shape.toggleCollapse.executed",
            "commandStack.shape.toggleCollapse.postExecuted",
            "commandStack.shape.toggleCollapse.reverted",
            "commandStack.spaceTool.postExecuted",
            "commandStack.spaceTool.preExecute",
            "commandStack或者.label.create.postExecute",
            "connect.cleanup",
            "connect.end",
            "connect.hover",
            "connect.move",
            "connect.out",
            "connect.start",
            "connection.added",
            "connection.changed",
            "connection.remove",
            "connection.removed",
            "connectionSegment.move.cancel",
            "connectionSegment.move.cleanup",
            "connectionSegment.move.end",
            "connectionSegment.move.hover",
            "connectionSegment.move.move",
            "connectionSegment.move.out",
            "connectionSegment.move.start",
            "contextPad.create",
            "contextPad.getProviders",
            "copyPaste.copyElement",
            "copyPaste.pasteElement",
            "copyPaste.pasteElements",
            "create.cleanup",
            "create.end",
            "create.hover",
            "create.init",
            "create.move",
            "create.out",
            "create.rejected",
            "create.start",
            "detach",
            "diagram.clear",
            "diagram.destroy",
            "diagram.init",
            "directEditing.activate",
            "directEditing.cancel",
            "directEditing.complete",
            "directEditing.resize",
            "drag.cleanup",
            "drag.init",
            "drag.move",
            "drag.start",
            "editorActions.init",
            "element.changed",
            "element.click",
            "element.hover",
            "element.marker.update",
            "element.mousedown",
            "element.mousemove",
            "element.out",
            "element.updateId",
            "elements.changed",
            "elements.delete",
            "elements.paste.rejected",
            "elementTemplates.changed",
            "global-connect.canceled",
            "global-connect.cleanup",
            "global-connect.drag.canceled",
            "global-connect.drag.ended",
            "global-connect.end",
            "global-connect.ended",
            "global-connect.hover",
            "global-connect.init",
            "global-connect.out",
            "hand.canceled",
            "hand.end",
            "hand.ended",
            "hand.init",
            "hand.move.canceled",
            "hand.move.end",
            "hand.move.ended",
            "hand.move.move",
            "i18n.changed",
            "import.parse.complete",
            "interactionEvents.createHit",
            "interactionEvents.updateHit",
            "keyboard.keydown",
            "lasso.canceled",
            "lasso.cleanup",
            "lasso.end",
            "lasso.ended",
            "lasso.move",
            "lasso.selection.canceled",
            "lasso.selection.end",
            "lasso.selection.ended",
            "lasso.selection.init",
            "lasso.start",
            "moddleCopy.canCopyProperties",
            "moddleCopy.canCopyProperty",
            "moddleCopy.canSetCopiedProperty",
            "palette.create",
            "palette.getProviders",
            "popupMenu.getProviders.bpmn-replace",
            "propertiesPanel.changed",
            "propertiesPanel.isEntryVisible",
            "propertiesPanel.isPropertyEditable",
            "propertiesPanel.resized",
            "render.connection",
            "render.getConnectionPath",
            "render.getShapePath",
            "render.shape",
            "resize.cleanup",
            "resize.end",
            "resize.move",
            "resize.start",
            "root.added",
            "saveXML.start",
            "selection.changed",
            "shape.added",
            "shape.changed",
            "shape.move.cleanup",
            "shape.move.end",
            "shape.move.hover",
            "shape.move.init",
            "shape.move.move",
            "shape.move.out",
            "shape.move.rejected",
            "shape.move.start",
            "shape.remove",
            "shape.removed",
            "spaceTool.canceled",
            "spaceTool.cleanup",
            "spaceTool.end",
            "spaceTool.ended",
            "spaceTool.getMinDimensions",
            "spaceTool.move",
            "spaceTool.selection.canceled",
            "spaceTool.selection.cleanup",
            "spaceTool.selection.end",
            "spaceTool.selection.ended",
            "spaceTool.selection.init",
            "spaceTool.selection.move",
            "spaceTool.selection.start",
            "tool-manager.update",
        ];

        const interestedEvent = events.filter(e => e.includes('shape'));

        events.forEach((event) => {

            this.modeler.on(event, function (e) {
                // e.element = the model element
                // e.gfx = the graphical element

                console.log(event, e, e?.element?.id);
            });
        });
    }

    private getCreate() {
        return this.modeler.get("create");
    }

    private getElementFactory() {
        return this.modeler.get("elementFactory");
    }

    private getElementRegistry() {
        return this.modeler.get("elementRegistry");
    }

    private getModeling() {
        return this.modeler.get("modeling");
    }

    private getModdle(): Moddle.Moddle {
        return this.modeler.get("moddle");
    }

    private getPropertiesPanel() {
        return this.modeler.get("propertiesPanel");
    }


}
