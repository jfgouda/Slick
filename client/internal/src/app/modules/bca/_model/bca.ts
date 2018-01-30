import { BCAComment } from "app/modules/bca/_model/bcaComments";

export class BCA {
    id: number;
    projectId: number;
    projectName: string;    
    applicantName: string;
    company: string;
    county: string;
    comments: BCAComment[];
    creationDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
}