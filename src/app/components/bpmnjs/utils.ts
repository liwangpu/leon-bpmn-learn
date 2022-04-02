import { Element as ModdleElement } from 'moddle';

export function traceUpStreamElement(current: ModdleElement, skipTypes: Array<string> = [], skipCurrent: boolean = false): Array<ModdleElement> {
    const upStreamElements = [];
    if (!current) { return upStreamElements; }
    _traceUpStreamElement(current, upStreamElements, skipTypes, skipCurrent);
    return upStreamElements;
}

function _traceUpStreamElement(bo: ModdleElement, collection: Array<ModdleElement>, skipTypes: Array<string> = [], skipCurrent: boolean = false) {

    if (!skipCurrent) {
        let need = true;
        if (skipTypes.length) {
            for (let idx = skipTypes.length - 1; idx >= 0; idx--) {
                if (bo.$instanceOf(skipTypes[idx])) {
                    need = false;
                    break;
                }
            }
        }
        if (need) {
            collection.push(bo);
        }
    }

    // 两个基类,SequenceFlow和FlowNode
    if (bo.$instanceOf('bpmn:SequenceFlow')) {
        if (bo.sourceRef) {
            _traceUpStreamElement(bo.sourceRef, collection, skipTypes);
        }
    } else if (bo.$instanceOf('bpmn:FlowNode')) {
        const incoming: Array<ModdleElement> = bo.incoming;
        // console.log('incoming:',incoming);
        if (incoming?.length) {
            incoming.forEach(e => {
                _traceUpStreamElement(e as any, collection, skipTypes);
            });
        }
    } else if (bo.$instanceOf('bpmn:FlowElementsContainer')) {
        // 容器系列,可能需要关注一下
    }
    else {
        console.warn(`如果出现这个类型,不一定是问题,但是需要调试看看是否需要调整`);
    }
}