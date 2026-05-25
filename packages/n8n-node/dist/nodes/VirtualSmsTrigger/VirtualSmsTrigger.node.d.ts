import { IDataObject, IPollFunctions, INodeType, INodeTypeDescription } from "n8n-workflow";
export declare class VirtualSmsTrigger implements INodeType {
    description: INodeTypeDescription;
    poll(this: IPollFunctions): Promise<{
        json: IDataObject;
    }[][] | null>;
}
//# sourceMappingURL=VirtualSmsTrigger.node.d.ts.map