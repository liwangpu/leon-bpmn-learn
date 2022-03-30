import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Element as ModdleElement, Moddle } from 'moddle';
import { Descriptor } from './custom.descriptor';
import { Reader, Writer } from 'moddle-xml';
import BpmnModdle from 'bpmn-moddle';
import { flowDefinitionGenerator } from './flow-definition-generator';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-moddle',
    templateUrl: './moddle.component.html',
    styleUrls: ['./moddle.component.scss']
})
export class ModdleComponent implements OnInit {

    public xml: string = flowDefinitionGenerator();
    public constructor(
        private http: HttpClient
    ) { }

    public async ngOnInit(): Promise<void> {
        //         var custom = new Moddle([Descriptor]);
        //         var leon = custom.create('cus:Person', { id: 'a1', name: 'Leon', age: 18 });

        // // leon.$parent=
        //         console.log('leon:', leon);
        //         console.log('type:',leon.$type);
        //         console.log('attrs:',leon.$attrs);
        //         console.log('1:', leon.$instanceOf('cus:Person'));

        //         const a1 = custom.getTypeDescriptor('cus:Person');
        //         console.log('a1:', a1);
        // console.log('businessObject:', leon.businessObject);
        // var cars = new Moddle([definition]);
        // var taiga = cars.create('c:Car', { name: 'Taiga' });

        // console.log(taiga);
        // // { $type: 'c:Car', name: 'Taiga' };


        // var cheapCar = cars.create('c:Car');

        // console.log(cheapCar.name);
        // "No Name"

        // const reader = new Reader(cars);

        // var model = new Moddle([definition]);
        // var cars = model.create('c:Cars');
        // // cars.get('cars').push(model.create('my:Car', { power: 10 }));

        // var options = { format: false, preamble: false };
        // var writer = new Writer(options);
        // var xml = writer.toXML(cars);f

        // console.log(xml);


        // const moddle = new BpmnModdle();
        // // const xmlStr =
        // //   '<?xml version="1.0" encoding="UTF-8"?>' +
        // //   '<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
        // //   'id="empty-definitions" ' +
        // //   'targetNamespace="http://bpmn.io/schema/bpmn">' +
        // //   '</bpmn2:definitions>';

        // const xmlStr=flowDefinitionGenerator();


        // const { rootElement: definitions } = await moddle.fromXML(xmlStr);
        // // definitions.set('id', 'NEW ID');
        // // const bpmnProcess = moddle.create('bpmn:Process', { id: 'MyProcess_1' });
        // // definitions.get('rootElements').push(bpmnProcess);

        // // console.log('definitions:', definitions);
        // const { xml: xmlStrUpdated } = await moddle.toXML(definitions);

        // console.log('xml:', xmlStrUpdated);
    }

    public async test(): Promise<void> {
        // let model = new Moddle([carsDefinition]);
        // let taiga = model.create('c:Car', { name: 'Taiga' });
        // let options = { format: false, preamble: false };
        // let writer = new Writer(options);
        // let xml = writer.toXML(taiga);
        // console.log('taiga:', taiga);

        // console.log('cars:', model);
        // console.log('xml:', xml);
        let filename = 'newDiagram.bpmn';
        let bpmnXML = await this.http.get(`/assets/${filename}`, { responseType: 'text' }).toPromise();
        const moddle = new BpmnModdle();
        let { rootElement: definitions } = await moddle.fromXML(bpmnXML);
        // console.log('definitions:', definitions);

        let root = definitions.get('rootElements')[0];

        let rootDoc = root.documentation?.length ? root.documentation[0] : null;

        if (!rootDoc) {
            const doc = moddle.create('bpmn:Documentation');
            doc.text = "全新的描述";
            // var cars = new Moddle([Descriptor]);
            // var ccc = cars.create('cus:Card');
            root.documentation = [doc];
        }
        // console.log('root:', root);
        // console.log('doc:', rootDoc);
        // rootDoc.text = "天天开心哦";
        root.name = '测试改动';
        let { xml } = await moddle.toXML(definitions);
        // console.log('translate:', xml);
        this.xml = xml;
        // console.log('xxx:',this.xml);
    }

    public async updateStartendExtensionPropertyElement(): Promise<void> {
        let bpmnXML = flowDefinitionGenerator();
        const moddle = new BpmnModdle();
        let { rootElement: definitions } = await moddle.fromXML(bpmnXML);
        let root = definitions.get('rootElements')[0];

        const p1 = moddle.create('bpmn:Property');
        p1.name = "ssssdsd";
        console.log('p1:', p1);
        root.properties = [p1];
        console.log('root:', root);
        let { xml } = await moddle.toXML(definitions);
        this.xml = xml;
    }
}
