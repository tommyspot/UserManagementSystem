/// Type definitions for Angular JS 1.0 (ngCookies module)
// Project: http://angularjs.org
// Definitions by: Diego Vilar <http://github.com/diegovilar>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


/// <reference path="angular.d.ts" />

///////////////////////////////////////////////////////////////////////////////
// ngCookies module (angular-cookies.js)
///////////////////////////////////////////////////////////////////////////////
declare module ng {

    ///////////////////////////////////////////////////////////////////////////
    // CookieService
    // see http://docs.angularjs.org/api/ngCookies.$cookies
    ///////////////////////////////////////////////////////////////////////////
    interface ICookiesService {
        get(key: string): any;
        getObject(key: string): any;
        put(key: string, value: string): void;
        putObject(key: string, value: Object): void;
        remove(key: string): void;
    }

    ///////////////////////////////////////////////////////////////////////////
    // CookieStoreService
    // see http://docs.angularjs.org/api/ngCookies.$cookieStore
    ///////////////////////////////////////////////////////////////////////////
    interface ICookieStoreService {
        get(key: string): any;
        put(key: string, value: any): void;
        remove(key: string): void;
    }

} 