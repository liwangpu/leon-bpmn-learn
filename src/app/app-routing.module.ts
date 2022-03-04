import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BpmnjsComponent } from './components/bpmnjs/bpmnjs.component';
import { ModdleComponent } from './components/moddle/moddle.component';

const routes: Routes = [
    { path: 'bpmnjs', component: BpmnjsComponent },
    { path: 'moddle', component: ModdleComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
