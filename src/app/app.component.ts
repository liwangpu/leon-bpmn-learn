import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import Modeler from 'bpmn-js/lib/Modeler';
import * as bjs from 'bpmn-js';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

    public constructor(
        private http: HttpClient
    ) {

    }

    public async ngOnInit(): Promise<void> {
        const bpmnXML = await this.http.get('/assets/diagram.bpmn', { responseType: 'text' }).toPromise();
        const modeler = new Modeler({ container: '#container' });
        await modeler.importXML(bpmnXML);
    }
}
