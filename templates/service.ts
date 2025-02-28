import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { %E% } from '../../core/models/%k%.model';

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class %E%Service {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    buscar(%e%Id: number): Observable<%E%> {
        return this.http.get<%E%>(`${this.url}%ee%/${%e%Id}`);
    }

    buscarTodos(): Observable<%E%[]> {
        return this.http.get<%E%[]>(`${this.url}%ee%/lote`, { headers: this.headers });
    }

    borrar(%e%Id: number): Observable<any> {
        return this.http.delete<any>(`${this.url}%ee%/${%e%Id}`);
    }

    borrarTodos(ids: number[]): Observable<any> {
        return this.http.delete<any>(`${this.url}%ee%/lote`, { headers: this.headers, body: ids });
    }

    actualizar(%e%Id: number, %e%: %E%): Observable<%E%> {
        return this.http.put<%E%>(`${this.url}%ee%/${%e%Id}`, %e%);
    }

    crear(%e%: %E%): Observable<%E%> {
        return this.http.post<%E%>(`${this.url}%ee%`, %e%);
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
        return this.http.get(`${this.url}core/filter/%ee%`, { params, headers: this.headers });
    }
}
