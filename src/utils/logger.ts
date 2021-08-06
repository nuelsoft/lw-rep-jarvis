import {debuglog} from "util";

export default class Logger{
    static speak(message: string) {
        debuglog(message);
    }
}