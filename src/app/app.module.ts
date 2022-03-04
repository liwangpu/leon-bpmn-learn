import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BpmnjsComponent } from './components/bpmnjs/bpmnjs.component';
import { ModdleComponent } from './components/moddle/moddle.component';
import zh from '@angular/common/locales/zh';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import { IconDefinition } from '@ant-design/icons-angular';
import * as fromIcon from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';

registerLocaleData(zh);

const icons: Array<IconDefinition> = [fromIcon.MenuFoldOutline, fromIcon.MenuUnfoldOutline];

@NgModule({
    declarations: [
        AppComponent,
        BpmnjsComponent,
        ModdleComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        NzMenuModule,
        NzButtonModule,
        NzIconModule.forRoot(icons),
    ],
    providers: [{ provide: NZ_I18N, useValue: zh_CN }],
    bootstrap: [AppComponent]
})
export class AppModule { }
