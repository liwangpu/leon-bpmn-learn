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
import * as _ from 'lodash';
import { traceUpStreamActivity } from './utils';



const cacheStorageKey: string = 'flowCache';
const cacheXmlFilenameKey: string = 'xmlFilename';

var customTranslateModule = {
    translate: ['value', customTranslate]
};

@Component({
    selector: 'app-bpmnjs',
    templateUrl: './bpmnjs.component.html',
    styleUrls: ['./bpmnjs.component.scss']
})
export class BpmnjsComponent implements OnInit {

    public filename: string;
    public simpleBpmnDoc = 'gateway';
    public gatewayBpmnDoc = 'gateway';
    public traceUpStreamBpmnDoc = 'trace-upstream';
    public modeler: any;
    public constructor(
        private http: HttpClient
    ) { }

    public getCreate() {
        return this.modeler.get("create");
    }

    public getElementFactory() {
        return this.modeler.get("elementFactory");
    }

    public getElementRegistry() {
        return this.modeler.get("elementRegistry");
    }

    public getModeling() {
        return this.modeler.get("modeling");
    }

    public getModdle(): Moddle.Moddle {
        return this.modeler.get("moddle");
    }

    public getPropertiesPanel() {
        return this.modeler.get("propertiesPanel");
    }

    public async ngOnInit(): Promise<void> {
        let bpmnXML = localStorage.getItem(cacheStorageKey);
        // console.log('title:', bpmnXML);
        if (!bpmnXML) {
            bpmnXML = await this.loadXML(this.simpleBpmnDoc);
        }
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
                customTranslateModule
            ]
        });


        // console.log('title:',bpmnXML);
        await this.modeler.importXML(bpmnXML);

        this.modeler.on('element.click', (e: any) => {
            const shape = this.getElementRegistry().get(e.element.id);
            // console.log('type:', shape?.type);
            console.log('shape:', shape);
            // console.log('businessObject:', shape.businessObject);
            const ext = shape.businessObject.extensionElements;
            if (this.filename === this.traceUpStreamBpmnDoc) {
                const upstream = traceUpStreamActivity(shape);
                console.log('upstream:',upstream);
                // console.log('source:',shape.source);
            }
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

    public async userTaskName(): Promise<void> {
        const shape = this.getElementRegistry().get('Activity_06t0e98');
        console.log('shape', shape);
        const moddle = this.getModdle();
        // console.log('businessObject', shape?.businessObject);
        // console.log('extensionElements', shape?.businessObject?.extensionElements);
        // // console.log('title', shape.di);
        // // shape.businessObject.name = "测试";
        // const extensionElements = moddle.create("bpmn:ExtensionElements");
        // extensionElements.values = [];
        // const newUser = moddle.create("flowable:assignee"); // variable
        // newUser.type = 'user';
        // newUser.value = '11,22';
        // extensionElements.values.push(newUser);

        // const newRow = moddle.create("flowable:assignee"); // variable
        // newRow.type = 'role';
        // newRow.value = '33';
        // extensionElements.values.push(newRow);
        // this.getModeling().updateProperties(shape, {
        //     extensionElements
        // });
        // shape.businessObject.name = 'xxxxx';
        // this.getModeling().updateProperties(shape, shape.businessObject);


        this.getModeling().updateProperties(shape, {
            name: 'ksdjfsdfdsf',
            myggg: 123
        });

        // this.translate();
    }

    public async test(): Promise<void> {
        const shape = this.getElementRegistry().get('Activity_06t0e98');
        console.log('shape:', shape);
        console.log('type:', shape.$type);
        console.log('businessObject:', shape?.businessObject);
        let extensionElements = shape?.businessObject?.extensionElements;
        console.log('extensionElements:', extensionElements);
        if (extensionElements) {
            const values = extensionElements.get('values');
            console.log('values:', values);
        }

        // const all = this.getElementRegistry().getAll();
        // console.log('all:', all);

    }

    public async test2(): Promise<void> {
        const shape = this.getElementRegistry().get('Activity_06t0e98');
        const moddle = this.getModdle();
        let extensionElements = shape?.businessObject?.extensionElements;
        if (!extensionElements) {
            // console.log('create ext:',);
            // extensionElements = moddle.create("flowable:extensionElements");
            extensionElements = moddle.create("bpmn:ExtensionElements");
            extensionElements.values = [];
        }

        const newRow = moddle.create("flowable:Assignee"); // variable
        newRow.type = 'role';
        newRow.value = '33';
        extensionElements.values.push(newRow);

        // this.getModeling().updateProperties(shape, {
        //     extensionElements
        // });

        this.getModeling().updateProperties(shape, {
            // extensionElements
        });
        this.translate();
    }

    public async changeProcessDes(): Promise<void> {
        const shape = this.getElementRegistry().get('process_Gpx5c4NbTXDd35S3YhFPYsZHfFrSnNTb');
        const moddle = this.getModdle();
        console.log('shape:', shape);
        console.log('businessObject:', shape.businessObject);
        console.log('documentation:', shape.businessObject.documentation);
        // let extensionElements = shape.businessObject?.extensionElements;
        // console.log('extensionElements:', extensionElements);
        const documentation = shape.businessObject.documentation;
        documentation.text = "我是描述哦,嘻嘻嘻";
        this.getModeling().updateProperties(shape, shape.businessObject);
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

}
