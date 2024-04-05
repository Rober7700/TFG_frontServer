import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, catchError, throwError } from "rxjs";
import { Prenda } from "../classes/prenda";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class PrendaService {

  private urlEndPoint: string = 'http://localhost:8080/almacen/prendas';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router, private tokenService: TokenService) { }

  private isNoAutorizado(e): boolean {
    if (e.status == 401) {
      if (this.tokenService.isLogged()){
        this.tokenService.clear();
      }
      this.router.navigateByUrl('');
      return true;
    }
    if (e.status == 403) {
      this.router.navigateByUrl('');
      return true;
    }
    return false;
  }

  getPrendas(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page)
    .pipe(
      map((response) => response as Prenda[]),
      catchError(e => {
        this.isNoAutorizado(e)
        return throwError(() => (e));
      })
    );
  }

  create(prenda: Prenda): Observable<any> {
    return this.http.post(this.urlEndPoint, prenda, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.data as Prenda),
      catchError(e => {

        if (this.isNoAutorizado(e)) {
          return throwError(() => (e));
        }

        if (e.status == 400) {
          return throwError(() => (e));
        }

        console.log(e);
        Swal.fire('Error al crear la ropa: ', e.error.mensaje, 'error');
        return throwError(() => (e));
      })
    );
  }

  getPrenda(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {

        if (this.isNoAutorizado(e)) {
          return throwError(() => (e));
        }

        this.router.navigate(['/prendas']);
        console.log(e);
        Swal.fire('Error al editar: ', e.error.mensaje, 'error');
        return throwError(() => (e));
      })
    );
  }

  update(prenda: Prenda): Observable<Prenda> {
    return this.http.put<Prenda>(`${this.urlEndPoint}/${prenda.id}`, prenda, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.data as Prenda),
      catchError(e => {

        if (this.isNoAutorizado(e)) {
          return throwError(() => (e));
        }

        if (e.status == 400) {
          return throwError(() => (e));
        }

        console.log(e);
        Swal.fire('Error al editar la prenda: ', e.error.mensaje, 'error');
        return throwError(() => (e));
      })
    );
  }

  delete(id: number): Observable<Prenda> {
    return this.http.delete<Prenda>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {

        if (this.isNoAutorizado(e)) {
          return throwError(() => (e));
        }

        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => (e));
      })
    );
  }

  subirFoto(file: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);

    let httpHeaders = new HttpHeaders();
    const token = this.tokenService.getAccessToken();
    if (token != null) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true,
      headers: httpHeaders
    });

    return this.http.request(req).pipe(
      catchError(e => {
        this.isNoAutorizado(e)
        return throwError(() => (e));
      })
    );
  }
}