import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MonacoEditorConstructionOptions, MonacoStandaloneCodeEditor } from '@materia-ui/ngx-monaco-editor';
import * as _ from 'lodash';
import { combineLatest, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-xml-viewer',
    templateUrl: './xml-viewer.component.html',
    styleUrls: ['./xml-viewer.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => XmlViewerComponent),
            multi: true
        }
    ]
})
export class XmlViewerComponent implements ControlValueAccessor, OnInit, OnDestroy {

    public value: string;
    public editorOptions: MonacoEditorConstructionOptions = {
        theme: 'vs-dark',
        language: 'html',
        wordWrap: 'on',
        formatOnType: true,
        formatOnPaste: true,
        // autoIndent: true,
    };
    private onChangeFn: (val: any) => any;
    private valueChange$: Subject<string> = new Subject<string>();
    private editorInstanceReady$ = new Subject<void>();
    private initValue$ = new Subject<string>();
    private editorInstance: MonacoStandaloneCodeEditor;
    private subs: SubSink = new SubSink();
    public constructor() {
        this.subs.sink = combineLatest([
            this.initValue$,
            this.editorInstanceReady$
        ]).subscribe(([value]) => {
            this.value = value;
            setTimeout(() => {
                this.editorInstance.getAction('editor.action.formatDocument').run();
            }, 50);
        });
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
        this.editorInstanceReady$.complete();
        this.editorInstanceReady$.unsubscribe();
    }

    public ngOnInit(): void {
        //
    }

    public onValueChange(val: string): void {
        // this.valueChange$.next(val);
    }

    public writeValue(obj: any): void {
        this.initValue$.next(obj);
    }

    public registerOnChange(fn: any): void {
        this.onChangeFn = fn;
    }

    public registerOnTouched(fn: any): void {
        //
    }

    public setDisabledState?(isDisabled: boolean): void {
        //
    }

    public afterEditorInit(instance: MonacoStandaloneCodeEditor): void {
        this.editorInstance = instance;
        this.editorInstanceReady$.next();
    }

}
