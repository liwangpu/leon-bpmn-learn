import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import Modeler from 'bpmn-js/lib/Modeler';
import { HttpClient } from '@angular/common/http';

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

    public getModdle() {
        return this.modeler.get("moddle");
    }

    public getPropertiesPanel() {
        return this.modeler.get("propertiesPanel");
    }

    public async ngOnInit(): Promise<void> {
        const bpmnXML = await this.http.get('/assets/diagram.bpmn', { responseType: 'text' }).toPromise();
        this.modeler = new Modeler({ container: '#container' });
        await this.modeler.importXML(bpmnXML);

        this.modeler.on('element.click', (e: any) => {
            console.log('click:', e);
            console.log('click e:', e.element);
        });
    }

    public async translate(): Promise<void> {
        const { xml } = await this.modeler.saveXML({ format: true });
        console.log('xml:', xml);

    }

    public async test(): Promise<void> {
        // let dfs = this.modeler.getDefinitions();
        const els = this.getElementRegistry().getAll();
        const el = this.getElementRegistry().get('StartEvent_1');
        console.log(1, el);
        // console.log(2, el);
        // console.log(3,this.getElementRegistry());
        const moddle = this.getModdle();
        // // 自定义属性1
        // const attrOne = moddle.create("se:AttrOne", { name: "testAttrOne", values: [] });
        // // 自定义属性子属性
        // const attrOneProp = moddle.create("se:AttrOneProp", { propName: "propName1", value: "propValue1" })
        // // 自定义属性2
        // const attrTwo = moddle.create("se:AttrTwo", { value: "testAttrTwo" })
        // // 原生属性Properties
        // const props = moddle.create("camunda:Properties", { values: [] });
        // // 原生属性Properties的子属性
        // const propItem = moddle.create("camunda:Property", { name: "原生子属性name", values: "原生子属性value" });

        const extensions = moddle.create("bpmn:ExtensionElements", { values: [] });
        // // 开始节点插入原生属性
        // if (eventObj.element.type === "bpmn:StartEvent") {
        //     props.values.push(propItem);
        //     extensions.values.push(props);
        // }
        // // 任务节点插入多种属性
        // if (eventObj.element.type === "bpmn:Task") {
        //     props.values.push(propItem, propItem);

        //     attrOne.values.push(attrOneProp);

        //     extensions.values.push(props, attrOne, attrTwo);
        // }

        console.log('extensions:', extensions);

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
