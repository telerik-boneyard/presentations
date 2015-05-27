import observable = require("data/observable");
import dialogs = require("ui/dialogs");
import view = require("ui/core/view");
import localSettings = require("local-settings");
import platform = require("platform");
import appModule = require("application");
import types = require("utils/types");

var LOADING_ERROR = "Could not load sessions. Check your Internet connection and try again."; 
var everlive = require("./everlive/everlive");
interface ConferenceDay {
    date: Date;
    title: string;
}

export interface Speaker {
    //Id: string;
    name: string;
    title: string;
    company: string;
    picture: string;
    twitterName: string;
}

export interface RoomInfo {
    roomId: string;
    name: string;
    url: string;
    theme: string;
}

export interface Session {
    Id: string;
    title: string;
    start: Date;
    end: Date;
    room: string;
    roomInfo: RoomInfo;
    speakers: Array<Speaker>;
    description: string;
    descriptionShort: string;
    calendarEventId: string;
    isBreak: boolean;
}

export interface FavouriteSession {
    sessionId: string;
    calendarEventId: string;
}

var conferenceDays: Array<ConferenceDay> = [
    { title: "WORKSHOPS", date: new Date(2015, 5, 3) },
    { title: "CONFERENCE DAY 1", date: new Date(2015, 5, 4) },
    { title: "CONFERENCE DAY 2", date: new Date(2015, 5, 5) }
];

var sessions: Array<SessionModel> = new Array<SessionModel>();

var REMIDER_MINUTES = 5;
var FAVOURITES = "FAVOURITES";
var favourites: Array<FavouriteSession>;
try {
    favourites = <Array<FavouriteSession>>JSON.parse(localSettings.getString(FAVOURITES, "[]"));
}
catch (error) {
    console.log("Error while retrieveing favourites: " + error);
    favourites = new Array<FavouriteSession>();
    updateFavourites();
}

function findSessionIndexInFavourites(sessionId: string): number {
    for (var i = 0; i < favourites.length; i++) {
        if (favourites[i].sessionId === sessionId) {
            return i;
        }
    }
    return -1;
}

function addToFavourites(session: SessionModel) {
    if (findSessionIndexInFavourites(session.Id) >= 0) {
        // Sesson already added to favourites.
        return;
    }
    try {

        if (platform.device.os === platform.platformNames.android) {
            var projection = java.lang.reflect.Array.newInstance(java.lang.String.class, 1);
            projection[0] = "_id";

            var calendars = android.net.Uri.parse("content://com.android.calendar/calendars");
            var contentResolver = appModule.android.foregroundActivity.getApplicationContext().getContentResolver();
            var managedCursor = contentResolver.query(calendars, projection, null, null, null);
            var calID;

            if (managedCursor.moveToFirst()) {
                var idCol = managedCursor.getColumnIndex(projection[0]);
                calID = managedCursor.getString(idCol);
                managedCursor.close();
            }

            if (types.isUndefined(calID)) {
                // No caledndar to add to
                return;
            }

            var timeZone = java.util.TimeZone.getTimeZone("GMT-05:00");

            var startDate = session.start.getTime();
            var endDate = session.end.getTime();

            var values = new android.content.ContentValues();
            values.put("calendar_id", calID);
            values.put("eventTimezone", timeZone.getID());
            values.put("dtstart", java.lang.Long.valueOf(startDate));
            values.put("dtend", java.lang.Long.valueOf(endDate));
            values.put("title", session.title);
            values.put("eventLocation", session.room);
            var uri = contentResolver.insert(android.provider.CalendarContract.Events.CONTENT_URI, values);

            var eventId = uri.getLastPathSegment();
            session.calendarEventId = eventId;

            var reminderValues = new android.content.ContentValues();
            reminderValues.put("event_id", java.lang.Long.valueOf(java.lang.Long.parseLong(eventId)));
            reminderValues.put("method", java.lang.Long.valueOf(1)); // METHOD_ALERT
            reminderValues.put("minutes", java.lang.Long.valueOf(REMIDER_MINUTES));
            contentResolver.insert(android.provider.CalendarContract.Reminders.CONTENT_URI, reminderValues);

            persistSessionToFavourites(session);

        } else if (platform.device.os === platform.platformNames.ios) {
            var store = EKEventStore.new()
            store.requestAccessToEntityTypeCompletion(EKEntityTypeEvent, (granted: boolean, error: NSError) => {
                if (!granted) {
                    return;
                }

                var event = EKEvent.eventWithEventStore(store);
                event.title = session.title;
                event.timeZone = NSTimeZone.alloc().initWithName("UTC-05:00");
                event.startDate = NSDate.dateWithTimeIntervalSince1970(session.start.getTime() / 1000);
                event.endDate = NSDate.dateWithTimeIntervalSince1970(session.end.getTime() / 1000);
                event.calendar = store.defaultCalendarForNewEvents;
                event.location = session.room;
                event.addAlarm(EKAlarm.alarmWithRelativeOffset(-REMIDER_MINUTES * 60));

                var err: NSError;
                var result = store.saveEventSpanCommitError(event, EKSpan.EKSpanThisEvent, true, err);

                session.calendarEventId = event.eventIdentifier;
                persistSessionToFavourites(session);
            });
        }
    }
    catch (error) {
        console.log("Error while creating calendar event: " + error);
    }
}

function persistSessionToFavourites(session: SessionModel) {
    favourites.push({
        sessionId: session.Id,
        calendarEventId: session.calendarEventId
    });
    updateFavourites();
}

function removeFromFavourites(session: SessionModel) {
    var index = findSessionIndexInFavourites(session.Id);
    if (index >= 0) {
        favourites.splice(index, 1);
        updateFavourites();
    }

    if (session.calendarEventId) {
        if (platform.device.os === platform.platformNames.android) {
            var deleteUri = android.content.ContentUris.withAppendedId(android.provider.CalendarContract.Events.CONTENT_URI, parseInt(session.calendarEventId));
            appModule.android.foregroundActivity.getApplicationContext().getContentResolver().delete(deleteUri, null, null);
        } else if (platform.device.os === platform.platformNames.ios) {
            var store = EKEventStore.new()
            store.requestAccessToEntityTypeCompletion(EKEntityTypeEvent, (granted: boolean, error: NSError) => {
                if (!granted) {
                    return;
                }

                var eventToRemove = store.eventWithIdentifier(session.calendarEventId);
                if (eventToRemove) {
                    var err: NSError;
                    store.removeEventSpanCommitError(eventToRemove, EKSpan.EKSpanThisEvent, true, err);
                    session.calendarEventId = undefined;
                }
            });
        }
    }
}

function updateFavourites() {
    var newValue = JSON.stringify(favourites);
    console.log("favourites: " + newValue);
    localSettings.setString(FAVOURITES, newValue);
}

var el = new everlive("mzacGkKPFlZUfbMq");
var expandExp = {
    "speakers": true,
    "roomInfo": true
};
function pushSessions(sessionsFromEvelive: Array<Session>) {
    for (var i = 0; i < sessionsFromEvelive.length; i++) {
        var newSession = new SessionModel(sessionsFromEvelive[i]);
        var indexInFavs = findSessionIndexInFavourites(newSession.Id);
        if (indexInFavs >= 0) {
            newSession.favorite = true;
            newSession.calendarEventId = favourites[indexInFavs].calendarEventId;
        }
        sessions.push(newSession);
    }
}

function loadFirstChunk() {
    var query = new everlive.Query();
    query.order("start").take(50).expand(expandExp);

    el.data('Sessions').get(query).then(
        function (data) {
            pushSessions(<Array<Session>> data.result);
            loadSecondChunk();

        }, function (error) {
            dialogs.alert(LOADING_ERROR);
        });
}

function loadSecondChunk() {
    var query = new everlive.Query();
    query.order("start").skip(50).take(50).expand(expandExp);

    el.data('Sessions').get(query).then(
        function (data) {
            pushSessions(<Array<Session>> data.result);
            appModel.onDataLoaded();
        }, function (error) {
            dialogs.alert(LOADING_ERROR);
        });
}

loadFirstChunk();

export class AppViewModel extends observable.Observable {
    private _selectedIndex;
    private _search = "";
    private _sessions: Array<SessionModel>;

    public selectedViewIndex: number;

    constructor() {
        super();

        this.selectedIndex = 0;
        this.selectedViewIndex = 1;
        this.set("actionBarTitle", "All sessions");
        this.set("isLoading", true);
        this.set("isSessionsPage", true);
    }

    get sessions(): Array<SessionModel> {
        return this._sessions;
    }

    get favorites(): Array<SessionModel> {
        return this.sessions.filter(i=> { return i.favorite });
    }

    get search(): string {
        return this._search;
    }
    set search(value: string) {
        if (this._search !== value) {
            this._search = value;
            this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "search", value: value });

            this.filter();
        }
    }

    get selectedIndex(): number {
        return this._selectedIndex;
    }
    set selectedIndex(value: number) {
        if (this._selectedIndex !== value) {
            this._selectedIndex = value;
            this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "selectedIndex", value: value });

            this.set("dayHeader", conferenceDays[value].title);

            if (this.search !== "") {
                this.search = "";
            } else {
                this.filter();
            }
        }
    }

    private filter() {
        this._sessions = sessions.filter(s=> {
            return s.start.getDate() === conferenceDays[this.selectedIndex].date.getDate()
                && s.title.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase()) >= 0;
        });

        if (this.selectedViewIndex === 0) {
            this._sessions = this._sessions.filter(i=> { return i.favorite || i.isBreak; });
        }

        this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "sessions", value: this._sessions });
    }

    public onDataLoaded() {
        this.set("isLoading", false);
        this.filter();
    }

    public selectView(index: number, titleText: string) {
        this.selectedViewIndex = index;
        if (this.selectedViewIndex < 2) {
            this.filter();
        }
        this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "selectedViewIndex", value: this.selectedViewIndex });
        this.set("actionBarTitle", titleText);
        this.set("isSessionsPage", this.selectedViewIndex < 2);
    }
}

export class SessionModel extends observable.Observable implements Session {
    constructor(source?: Session) {
        super();

        if (source) {
            this._id = source.Id;
            this._title = source.title;
            this._room = source.room;
            this._roomInfo = source.roomInfo;
            this._start = this.fixDate(source.start);
            this._end = this.fixDate(source.end);
            this._speakers = source.speakers;
            this._description = source.description;
            this._isBreak = source.isBreak;
        }
    }

    private fixDate(date: Date): Date {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    }

    private _id: string;
    private _speakers: Array<Speaker>;
    private _title: string;
    private _start: Date;
    private _end: Date;
    private _room: string;
    private _roomInfo: RoomInfo;
    private _favorite: boolean;
    private _description: string;
    private _calendarEventId: string;
    private _isBreak: boolean;

    get Id(): string {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get room(): string {
        if (this._room) {
            return this._room;
        }

        if (this._roomInfo) {
            return this._roomInfo.name
        }

        return null;
    }

    get roomInfo(): RoomInfo {
        return this._roomInfo;
    }

    get start(): Date {
        return this._start;
    }

    get end(): Date {
        return this._end;
    }

    get speakers(): Array<Speaker> {
        return this._speakers;
    }

    get range(): string {
        var startMinutes = this.start.getMinutes() + "";
        var endMinutes = this.end.getMinutes() + "";
        var startAM = this.start.getHours() < 12 ? "am" : "pm";
        var endAM = this.end.getHours() < 12 ? "am" : "pm";

        var startHours = (this.start.getHours() <= 12 ? this.start.getHours() : this.start.getHours() - 12) + "";
        var endHours = (this.end.getHours() <= 12 ? this.end.getHours() : this.end.getHours() - 12) + "";

        return (startHours.length === 1 ? '0' + startHours : startHours) + ':' + (startMinutes.length === 1 ? '0' + startMinutes : startMinutes) + startAM +
            ' - ' + (endHours.length === 1 ? '0' + endHours : endHours) + ':' + (endMinutes.length === 1 ? '0' + endMinutes : endMinutes) + endAM;
    }

    get isBreak(): boolean {
        return this._isBreak;
    }

    get favorite(): boolean {
        return this._favorite;
    }
    set favorite(value: boolean) {
        if (this._favorite !== value && !this._isBreak) {
            this._favorite = value;
            this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "favorite", value: this._favorite });
        }
    }

    get description(): string {
        return this._description;
    }

    get descriptionShort(): string {
        if (this.description.length > 160) {
            return this.description.substr(0, 160) + "...";
        }
        else {
            return this.description;
        }
    }

    public toggleFavorite() {
        this.favorite = !this.favorite;
        if (this.favorite) {
            addToFavourites(this);
        }
        else {
            removeFromFavourites(this);
        }
    }

    get calendarEventId(): string {
        return this._calendarEventId;
    }
    set calendarEventId(value: string) {
        if (this._calendarEventId !== value) {
            this._calendarEventId = value;
            this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "calendarEventId", value: this._calendarEventId });
        }
    }
}

export var appModel = new AppViewModel();

// load other info
el.data('Info').get().then(
    function (data) {
        for (var i = 0; i < data.result.length; i++) {
            var item = data.result[i];
            appModel.set("info_" + item.key, item.value);
        }
    }, function (error) {
        console.log("Could not load Info. Error: " + error);
        dialogs.alert(LOADING_ERROR);
    });


