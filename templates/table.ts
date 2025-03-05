import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableData, TableDataService } from "../../../core/services/table-data.service";
import { SharedTableComponent } from "../../../shared/components/shared-table/shared-table.component";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { OpcionesMantenedorComponent } from "../../../shared/components/opciones-mantenedor/opciones-mantenedor.component";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { %E%FormComponent } from "../../../shared/components/forms/%k%.component";
import { ExportarDocService } from "../../../core/services/exportar-doc.service";
import { DialogAlertaComponent } from "../../../shared/dialogo-alerta/dialogo-alerta.component";
import { %E%Service } from "../../../core/services/%k%.service";
import { %E% } from "../../../core/models/%k%.model";
import { catchError, tap, throwError } from "rxjs";
import { PagedResponse } from "../../../core/models/paged-content.models";
import { HeadTableComponent } from "../../../shared/head-table/head-table.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-%k%",
  standalone: true,
  imports: [CommonModule, SharedTableComponent, MatIconModule, HeadTableComponent, MatPaginatorModule, OpcionesMantenedorComponent, TranslateModule],
  templateUrl: "./%k%.component.html",
  styleUrl: "./%k%.component.css",
})
export class %E%Component implements OnInit {
  displayedColumns: string[] = []; // Se inicializa vacío
  dataSource: %E%[] = []; // Ahora usa la interfaz %e%
  titulo: string = '%s%'; // Puedes cambiarlo dinámicamente
  hasSelection = false;
  selectedData: any[] = []; // Almacena la data seleccionada
  pageNumber = 0
  totalPages = 0
  pageSize = 5;
  totalElements = 0;
  @ViewChild(SharedTableComponent) sharedTableComponent!: SharedTableComponent;
  activeOptionalFilters: any = [];
  constructor(private cdr: ChangeDetectorRef,
    private router: Router, public dialog: MatDialog, private exportService: ExportarDocService,
    private translate: TranslateService, private toastr: ToastrService,
    private %e%Service: %E%Service) { }

  ngOnInit() {
    this.obtenerDatos();
  }


  /********************************** TABLA - SHARED TABLE **********************************/
  onSelectionChange(selectedItems: any[]) {
    this.hasSelection = selectedItems.length > 0;
    this.selectedData = selectedItems; // Guardamos la data seleccionada
  }



  onViewSelected(id: string): void {
    const dialogRef = this.dialog.open(%E%FormComponent, {
      width: '400px',
      data: {
        esActualizar: true,
        object: this.dataSource.find(item => item.id === Number(id))
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Ver seleccionado:", result);
      }
    });
  }

  onDeleteSelected(ids: string[]) {
    console.log("Eliminar seleccionados:", ids);
  }

  exportarExcel(selectedItems: TableData[]) {
    console.log("Exportando los siguientes elementos:", selectedItems);
    this.exportService.exportToExcel(selectedItems, this.titulo);
  }

  volver() {
    this.router.navigate(['/portal/home']);
  }
  sortDatos(sortData: { selectedColumnName: string, currentSortType: string }) {
    this.obtenerDatos(sortData.selectedColumnName, sortData.currentSortType);
  }

  onPageChanged(newPage: number) {
    console.log("Página cambiada", newPage);
    this.pageNumber = newPage
    this.obtenerDatos();
  }


  buscar(filters: any) {
    this.pageNumber = 0;
    this.obtenerDatos("id", "asc", filters);
  }
  onFilterDeleted(field: string) {
    this.activeOptionalFilters = this.activeOptionalFilters.filter((filter: any) => filter.field !== field);
    this.obtenerDatos("id", "asc", this.activeOptionalFilters);
  }



  /********************************** TABLA - SHARED TABLE **********************************/


  /*********************************** CRUD   - GET ***********************************/





  obtenerDatos(sortField: string = 'id', sortDirection: string = 'asc', optionalFilter: any = {}) {
    const mandatoryFilter = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortField: sortField,
      sortDirection: sortDirection,
      ...optionalFilter
    }

    this.%e%Service.buscarFiltrado(mandatoryFilter).subscribe((data: PagedResponse<%E%[]>) => {
      console.log("Datos recibidos:", data);

      this.pageNumber = data.pageNumber
      this.totalPages = data.totalPages
      this.pageSize = data.pageSize;
      this.totalElements = data.totalElements;

      this.activeOptionalFilters = Object.entries(optionalFilter).map(([field, value]) => ({ field, value }));

      this.dataSource = data.content.flat();
      if (data.content.length > 0) {
        this.displayedColumns = Object.keys(data.content[0]);
      }
      this.cdr.detectChanges();
    });
  }






  /*********************************** CRUD   - DELETE ***********************************/
  eliminar(selectedItems: %E%[]) {
    const count = selectedItems.length;

    // Obtener las traducciones
    const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo');
    const mensaje = this.translate.instant('alertas.eliminacionIndividualMensaje', { count });
    const textoBotonCancelar = this.translate.instant('alertas.cancelar');
    const textoBotonConfirmar = this.translate.instant('alertas.eliminar');

    const dialogRef = this.dialog.open(DialogAlertaComponent, {
      width: '600px',
      height: '400px',
      data: {
        titulo: titulo,
        mensaje: mensaje,
        textoBotonCancelar: textoBotonCancelar,
        textoBotonConfirmar: textoBotonConfirmar
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        const ids = selectedItems.map(item => item.id);
        console.log("Datos a enviar para eliminar:", { ids: ids });

        this.%e%Service.borrarTodos(ids).subscribe({
          next: () => {
            console.log("Elementos eliminados exitosamente:", ids);
            this.dataSource = this.dataSource.filter(item => !ids.includes(item.id));
            this.hasSelection = false;

            // Actualizar las propiedades de paginación
            this.totalElements -= ids.length;
            this.totalPages = this.totalElements > 0 ? Math.ceil(this.totalElements / this.pageSize) : 0;

            // Ajustar pageNumber si es necesario
            if (this.pageNumber >= this.totalPages && this.totalPages > 0) {
              this.pageNumber = this.totalPages - 1; // Ir a la última página disponible
            }

            // Recargar los datos
            this.obtenerDatos();

            // Mostrar mensaje de éxito
            this.toastr.success(this.translate.instant('mantenedores.formularios.toastr.success'));

            // Limpiar selecciones en el componente hijo
            if (this.sharedTableComponent) {
              this.sharedTableComponent.selection.clear();
            }

            // Depurar el estado del paginador
            console.log("Estado del paginador después de eliminar:", {
              pageNumber: this.pageNumber,
              totalElements: this.totalElements,
              totalPages: this.totalPages
            });
          },
          error: err => {
            console.error("Error al eliminar elementos:", err);
            this.toastr.error(this.translate.instant('mantenedores.formularios.toastr.error'));
          }
        });
      }
    });
  }

  onDeleteSingleSelected(id: string) {
    console.log("Eliminar seleccionado:", id);

    // Obtener las traducciones
    const titulo = this.translate.instant('alertas.eliminacionIndividualTitulo') + ' ' + this.translate.instant('mantenedores.%e%.titulo');
    const mensaje = this.translate.instant('alertas.eliminacionIndividualMensaje', { count: 1 });
    const textoBotonCancelar = this.translate.instant('alertas.cancelar');
    const textoBotonConfirmar = this.translate.instant('alertas.eliminar');

    const dialogRef = this.dialog.open(DialogAlertaComponent, {
      data: {
        titulo: titulo,
        mensaje: mensaje,
        textoBotonCancelar: textoBotonCancelar,
        textoBotonConfirmar: textoBotonConfirmar
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        console.log("Eliminando elemento con ID:", id);

        this.%e%Service.borrar(Number(id)).subscribe({
          next: () => {
            console.log("Elemento eliminado exitosamente:", id);

            // Filtrar el item eliminado del dataSource
            this.dataSource = this.dataSource.filter(item => item.id !== Number(id));

            // Actualizar propiedades de paginación
            this.totalElements -= 1;
            this.totalPages = this.totalElements > 0 ? Math.ceil(this.totalElements / this.pageSize) : 0;

            // Ajustar pageNumber si es necesario
            if (this.pageNumber >= this.totalPages && this.totalPages > 0) {
              this.pageNumber = this.totalPages - 1;
            }

            // Recargar datos
            this.obtenerDatos();

            // Mostrar mensaje de éxito
            this.toastr.success(this.translate.instant('mantenedores.formularios.toastr.success'));

            // Limpiar selección si existe un componente compartido
            if (this.sharedTableComponent) {
              this.sharedTableComponent.selection.clear();
            }

            // Debug: Estado del paginador después de eliminar
            console.log("Estado del paginador después de eliminar:", {
              pageNumber: this.pageNumber,
              totalElements: this.totalElements,
              totalPages: this.totalPages
            });
          },
          error: (err: any) => {
            console.error("Error al eliminar elemento:", err);
            this.toastr.error(this.translate.instant('mantenedores.formularios.toastr.error'));
          }
        });
      }
    });
  }
  
  /* **********************************CRUD   - CREATE ***********************************/

  agregarServicio() {
    const dialogRef = this.dialog.open(%E%FormComponent, {
      width: '400px',
      data: {
        esActualizar: false,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Datos recibidos del formulario:", result);
        this.obtenerDatos("id","desc");
      }
    });
  }


  /* * * * * * * * * * * *  CRUD   - UPDATE * * * * * * * * * * * * * * * * *  */
  onEditSelected(id: string) {
    const selectedObject = this.dataSource.find(item => item.id === Number(id));
    if (!selectedObject) {
      return;
    }
    const dialogRef = this.dialog.open(%E%FormComponent, {
      width: '400px',
      data: {
        esActualizar: true,
        object: selectedObject
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerDatos("id","desc");
      }
    });
  }



}