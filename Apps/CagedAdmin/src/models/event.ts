// Model class for holding event information.
import { MusicianModel } from "./musician";
import { StreamModel } from "./stream";

export class EventModel {

    public id: string;
    public name: string;
    public description: string;
    public beginDate: Date;
    public endDate: Date;
    public location: string;
    public musiciansIds: Array<string>;
    public streamsIds: Array<string>;
    public eventImageUrl: string;
    public eventImageDataUrl: string;
    public eventImageFileName: string;

}