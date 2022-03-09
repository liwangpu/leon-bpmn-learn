import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import Modeler from 'bpmn-js/lib/Modeler';
import { HttpClient } from '@angular/common/http';
// import { Descriptor as CamundaDescriptor } from './camunda.descriptor';
import { Descriptor as MirrorDescriptor } from './mirror.descriptor';
import minimapModule from 'diagram-js-minimap';

const cacheStorageKey: string = 'flowCache';

@Component({
    selector: 'app-bpmnjs',
    templateUrl: './bpmnjs.component.html',
    styleUrls: ['./bpmnjs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BpmnjsComponent implements OnInit {

    public modeler: any;
    public constructor(
        private http: HttpClient
    ) {

    }

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
        let bpmnXML = await this.http.get('/assets/diagram.bpmn', { responseType: 'text' }).toPromise();
        this.modeler = new Modeler({
            container: '#container',
            // additionalModules: [
            //     minimapModule
            // ],
            moddleExtensions: {
                flowable: MirrorDescriptor,
                // mirror: MirrorDescriptor
            }
        });

        const flowCacheStr = localStorage.getItem(cacheStorageKey);
        if (flowCacheStr) {
            bpmnXML = flowCacheStr;
            console.log('cache:', flowCacheStr);
        }
        await this.modeler.importXML(bpmnXML);

        this.modeler.on('element.click', (e: any) => {
            // console.log('click:', e);
            // console.log('element:', e.element);
            // const shape = this.getElementRegistry().get(e.element.id);
            // console.log('type:', shape?.type);
            // console.log('shape:', shape);
            // const ext = shape.businessObject.extensionElements;
            // console.log('shape:', shape);
            // console.log('ext:', ext.boys);
            // const boy = ext.boys[0];
            // console.log('boy:', boy.name);

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

    public clearCache(): void {
        localStorage.removeItem(cacheStorageKey);
        location.reload();
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
        const newUser = moddle.create("flowable:assignee"); // variable
        newUser.type = 'user';
        newUser.value = '11,22';
        extensionElements.values.push(newUser);

        // const newRow = moddle.create("flowable:assignee"); // variable
        // newRow.type = 'role';
        // newRow.value = '33';
        // extensionElements.values.push(newRow);
        this.getModeling().updateProperties(shape, {
            extensionElements
        });
        this.translate();
    }

    public async userTaskName(): Promise<void> {
        const shape = this.getElementRegistry().get('Activity_06t0e98');
        console.log('shape', shape);
        const moddle = this.getModdle();
        console.log('businessObject', shape?.businessObject);
        console.log('extensionElements', shape?.businessObject?.extensionElements);
        // console.log('title', shape.di);
        // shape.businessObject.name = "测试";
        const extensionElements = moddle.create("bpmn:ExtensionElements");
        extensionElements.values = [];
        const newUser = moddle.create("flowable:assignee"); // variable
        newUser.type = 'user';
        newUser.value = '11,22';
        extensionElements.values.push(newUser);

        const newRow = moddle.create("flowable:assignee"); // variable
        newRow.type = 'role';
        newRow.value = '33';
        extensionElements.values.push(newRow);
        // this.getModeling().updateProperties(shape, {
        //     extensionElements
        // });
        shape.businessObject.name = 'xxxxx';
        this.getModeling().updateProperties(shape, shape.businessObject);

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
            console.log('create ext:',);
            // extensionElements = moddle.create("flowable:extensionElements");
            extensionElements = moddle.create("bpmn:ExtensionElements");
            extensionElements.values = [];
        }

        const properties = moddle.create("flowable:Properties");
        extensionElements.values.push(properties);
        this.getModeling().updateProperties(shape, {
            extensionElements
        });
        this.translate();
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
