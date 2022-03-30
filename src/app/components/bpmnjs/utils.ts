import { Element as ModdleElement } from 'moddle';
import { FlowNodeType } from './flow-node-type.enum';

export function traceUpStreamActivity(current: ModdleElement, filter?: (activity: ModdleElement) => boolean): Array<ModdleElement> {
    const upStreamActivities = [];
    if (!current) { return upStreamActivities; }
    if (current.incoming?.length) {
        _traceUpStreamActivity(current.incoming, upStreamActivities, filter);
    }

    return upStreamActivities;
}

function _traceUpStreamActivity(incoming: Array<ModdleElement>, collection: Array<ModdleElement>, filter?: (activity: ModdleElement) => boolean) {
    if (!incoming?.length) { return; }
    // debugger;
    incoming.forEach(e => {
        console.log('type:',e.type);
        switch (e.type) {
            case FlowNodeType.sequenceFlow:
                console.log('1:',e.source.incoming);
                _traceUpStreamActivity(e.source.incoming, collection, filter);
                break;
            default:
                let needed = typeof filter === 'function' ? filter(e) : true;
                console.log('needed:',needed);
                if (needed) {
                    collection.push(e);
                }
                _traceUpStreamActivity(e.incoming, collection, filter);
                break;
        }
    });
}