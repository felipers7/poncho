import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Sector } from '../../core/models/sector.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class SectorService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(sectorId: number): Observable<Sector> {
        return this.http.get<Sector>(`${this.url}sector/${sectorId}`);
    }

    buscarTodos(): Observable<Sector[]> {
        return this.http.get<Sector[]>(`${this.url}sector`, { headers: this.headers });
    }

    borrar(sectorId: number): Observable<any> {
        return this.http.delete<any>(`${this.url}sector/${sectorId}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}sector/`, { headers: this.headers, body: ids });
    }

    actualizar(sectorId: number, sector: Sector): Observable<Sector> {
        return this.http.put<Sector>(`${this.url}sector/${sectorId}`, sector);
    }

    crear(sector: Sector): Observable<Sector> {
        return this.http.post<Sector>(`${this.url}sector`, sector);
    }

    buscarFiltrado(filtros: { [key: string]: any }): Observable<any> {
        console.log("filtros", filtros)
        let params = new HttpParams(filtros);
        // Recorrer los filtros y agregar los que tengan valor
        for (let key in filtros) {
            if (filtros.hasOwnProperty(key)) {
                params = params.append(key, filtros[key]);
            }
        }
        console.log("params", params)
        // Hacer la solicitud GET con los parámetros dinámicos
        return this.http.get(`${this.url}core/filter/sector`, { params, headers: this.headers });
    }
}
