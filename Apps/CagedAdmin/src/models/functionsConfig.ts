// Lambda functions url config model.
export class FunctionsConfigModel {

    // Users
    public getNewUserIdUrl: string = 'https://jacxddnbch.execute-api.us-east-1.amazonaws.com/dev/users/getNewUserId';

    public userLoginUrl: string = 'https://jacxddnbch.execute-api.us-east-1.amazonaws.com/dev/users/login';

    public createUserUrl: string = 'https://jacxddnbch.execute-api.us-east-1.amazonaws.com/dev/users';

    public updateUserUrl: string = 'https://jacxddnbch.execute-api.us-east-1.amazonaws.com/dev/users';

    public deleteUserUrl: string = 'https://jacxddnbch.execute-api.us-east-1.amazonaws.com/dev/users';

    // Events

    public getNewEventIdUrl: string = 'https://n3cgvvoxd4.execute-api.us-east-1.amazonaws.com/dev/events/getNewEventId';

    public createEventUrl: string = 'https://n3cgvvoxd4.execute-api.us-east-1.amazonaws.com/dev/events';

    public updateEventUrl: string = 'https://n3cgvvoxd4.execute-api.us-east-1.amazonaws.com/dev/events';

    public deleteEventUrl: string = 'https://n3cgvvoxd4.execute-api.us-east-1.amazonaws.com/dev/events';

    public assignMusicianToEventUrl: string = 'https://n3cgvvoxd4.execute-api.us-east-1.amazonaws.com/dev/events/{eventId}/musicians';

    public unassignMusicianFromEventUrl: string = 'https://n3cgvvoxd4.execute-api.us-east-1.amazonaws.com/dev/events/{eventId}/musicians';

    public assignStreamToEventUrl: string = 'https://n3cgvvoxd4.execute-api.us-east-1.amazonaws.com/dev/events/{eventId}/streams';

    public unassignStreamFromEventUrl: string = 'https://n3cgvvoxd4.execute-api.us-east-1.amazonaws.com/dev/events/{eventId}/streams';

    // Musicians

    public createMusicianUrl: string = 'https://di78q88alh.execute-api.us-east-1.amazonaws.com/dev/musicians';

    public updateMusicianUrl: string = 'https://di78q88alh.execute-api.us-east-1.amazonaws.com/dev/musicians';

    public deleteMusicianUrl: string = 'https://di78q88alh.execute-api.us-east-1.amazonaws.com/dev/musicians';

    public getNewMusicianIdUrl: string = 'https://di78q88alh.execute-api.us-east-1.amazonaws.com/dev/musicians/getNewMusicianId';

    // Streams

    public getNewStreamIdUrl: string = 'https://84jjtsp6cd.execute-api.us-east-1.amazonaws.com/dev/streams/getNewStreamId';

    public createStreamUrl: string = 'https://84jjtsp6cd.execute-api.us-east-1.amazonaws.com/dev/streams';

    public updateStreamUrl: string = 'https://84jjtsp6cd.execute-api.us-east-1.amazonaws.com/dev/streams';

    public deleteStreamUrl: string = 'https://84jjtsp6cd.execute-api.us-east-1.amazonaws.com/dev/streams';

    public assignBeaconToStreamUrl: string = 'https://84jjtsp6cd.execute-api.us-east-1.amazonaws.com/dev/streams/{streamId}/beacons';

    public unassignBeaconFromStreamUrl: string = 'https://84jjtsp6cd.execute-api.us-east-1.amazonaws.com/dev/streams/{streamId}/beacons';

    // Beacons

    public getNewBeaconIdUrl: string = 'https://yllfwozr2i.execute-api.us-east-1.amazonaws.com/dev/beacons/getNewBeaconId';

    public createBeaconUrl: string = 'https://yllfwozr2i.execute-api.us-east-1.amazonaws.com/dev/beacons';

    public updateBeaconUrl: string = 'https://yllfwozr2i.execute-api.us-east-1.amazonaws.com/dev/beacons';

    public deleteBeaconUrl: string = 'https://yllfwozr2i.execute-api.us-east-1.amazonaws.com/dev/beacons';

}