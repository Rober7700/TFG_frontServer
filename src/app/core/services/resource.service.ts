import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ResourceService {

    resourceUrl = environment.resource_url;

    constructor(private httpClient: HttpClient) { }

    public user(): Observable<any> {
        return this.httpClient.get<any>(this.resourceUrl + 'resource/user');
    }

    public admin(): Observable<any> {
        return this.httpClient.get<any>(this.resourceUrl + 'resource/admin');
    }
}