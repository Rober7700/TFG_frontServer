import { Component, OnInit } from '@angular/core';
import { Prenda  } from '../../core/classes/prenda';
import { PrendaService } from '../../core/services/prenda.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-crear-prenda',
  templateUrl: './crear-prenda.component.html',
  styleUrl: './crear-prenda.component.css'
})
export class CrearPrendaComponent implements OnInit {

  prenda: Prenda = new Prenda();
  titulo: string = "Crear Prenda";
  tiposPrenda: string[] = ["BOLSO", "CHAQUETA", "CINTURON", "FALDA", "JERSEY", "JOYA", "PANTALONES", "TOP", "VESTIDO", "ZAPATO"];
  tallasPrenda: string[] = ["XS", "S", "M", "L", "XL"];
  errores: string[]
  tipoSeleccionado: String;
  
  constructor(private prendaService: PrendaService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarPrenda();
  }

  seleccionTipoPrenda(tipo: String): void {
    this.tipoSeleccionado = tipo;
  }

  isTipoInhabilitado(): boolean {
    return this.tipoSeleccionado === 'BOLSO' || this.tipoSeleccionado === 'CINTURON' || this.tipoSeleccionado === 'JOYA';
  }
  

  cargarPrenda(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.prendaService.getPrenda(id).subscribe((prenda) => {
          this.prenda = prenda.data;
          console.log(this.prenda);
        })
      }
    })
  }

  create(): void {
    this.prendaService.create(this.prenda)
      .subscribe({
        next: (prenda) => {
          this.router.navigate(['/prendas'])
          console.log(prenda)
          Swal.fire('Nuevo prenda', `Prenda ${prenda.id} creada con éxito!`, 'success')
        },
        error: (err) => {
          console.error(err);
          this.errores = err.error.errors as string[]
        }
      });
  }

  update(): void {
    this.prendaService.update(this.prenda)
      .subscribe({
        next: (prenda) => {
          this.router.navigate(['/prendas'])
          Swal.fire('Prenda Actualizada', `Prendas ${prenda.id} actualizada con éxito!`, 'success')
        },
        error: (err) => {
          console.error(err);
          this.errores = err.error.errors as string[];
        }
      });
  }

}
