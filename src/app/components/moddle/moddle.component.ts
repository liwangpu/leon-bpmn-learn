import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Moddle } from 'moddle';
import { definition as carsDefinition } from './cars.definition';
import { Reader, Writer } from 'moddle-xml';
import BpmnModdle from 'bpmn-moddle';

@Component({
  selector: 'app-moddle',
  templateUrl: './moddle.component.html',
  styleUrls: ['./moddle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModdleComponent implements OnInit {

  public constructor() { }

  public async ngOnInit(): Promise<void> {
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
    // const xmlStr =
    //   '<?xml version="1.0" encoding="UTF-8"?>' +
    //   '<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
    //   'id="empty-definitions" ' +
    //   'targetNamespace="http://bpmn.io/schema/bpmn">' +
    //   '</bpmn2:definitions>';


    // const { rootElement: definitions } = await moddle.fromXML(xmlStr);
    // definitions.set('id', 'NEW ID');
    // const bpmnProcess = moddle.create('bpmn:Process', { id: 'MyProcess_1' });
    // definitions.get('rootElements').push(bpmnProcess);

    // console.log('definitions:', definitions);
    // const { xml: xmlStrUpdated } = await moddle.toXML(definitions);

    // console.log('xml:', xmlStrUpdated);
  }

  public async metaModelTest(): Promise<void> {
    let model = new Moddle([carsDefinition]);
    let taiga = model.create('c:Car', { name: 'Taiga' });
    let options = { format: false, preamble: false };
    let writer = new Writer(options);
    let xml = writer.toXML(taiga);
    console.log('taiga:', taiga);

    console.log('cars:', model);
    console.log('xml:', xml);


  }

}
