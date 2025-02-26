import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
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
import { catchError, forkJoin, tap, throwError } from "rxjs";
import { PagedResponse } from "../../../core/models/paged-content.models";
import { HeadTableComponent } from "../../../shared/head-table/head-table.component";

@Component({
  selector: "app-%k%",
  standalone: true,
  imports: [CommonModule, SharedTableComponent, MatIconModule, HeadTableComponent, MatPaginatorModule, OpcionesMantenedorComponent],
  templateUrl: "./%k%.component.html",
  styleUrl: "./%k%.component.css",
})
export class %E%Component implements OnInit {
  displayedColumns: string[] = []; // Se inicializa vacío
  dataSource: %E%[] = []; // Ahora usa la interfaz %s%
  titulo: string = '%s%'; // Puedes cambiarlo dinámicamente
  hasSelection = false;
  selectedData: any[] = []; // Almacena la data seleccionada
  pageNumber = 0
  totalPages = 0
  pageSize = 5;
  totalElements = 0;

  constructor(private cdr: ChangeDetectorRef,
    private router: Router, public dialog: MatDialog, private exportService: ExportarDocService,
    private %e%Service: %E%Service) { }

  ngOnInit() {
    this.obtenerDatos();
  }
  onSelectionChange(selectedItems: any[]) {
    this.hasSelection = selectedItems.length > 0;
    this.selectedData = selectedItems; // Guardamos la data seleccionada
  }

  onDeleteSelected(ids: string[]) {
    console.log("Eliminar seleccionados:", ids);
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

  onEditSelected(id: string) {
    const selectedObject = this.dataSource.find(item => item.id === Number(id));
    console.log('Selected Object:', selectedObject);

    if (!selectedObject) {
      console.error("No se encontró el objeto a editar.");
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
        console.log("Datos editados recibidos:", result);

        if (!result.%e%Desc) {
          console.error("Descripción no válida:", result.%e%Desc);
          return;
        }

        const formData: %E% = {
          id: result.id,
          %e%Desc: result.%e%Desc
        };

        this.%e%Service.actualizar(formData.id, formData).pipe(
          tap(response => {
            console.log("Respuesta del servicio:", response);
            this.obtenerDatos();
          }),
          catchError(error => {
            console.error("Error en el servicio:", error);
            return throwError(error);
          })
        ).subscribe();
      }
    });
  }

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
        this.%e%Service.crear(result).subscribe(
          (response) => {
            console.log("Cliente creado con éxito:", response);
          },
          (error) => {
            console.error("Error al crear cliente:", error);
          }
        );
      }
    });
  }

  exportarExcel(selectedItems: TableData[]) {
    console.log("Exportando los siguientes elementos:", selectedItems);
    this.exportService.exportToExcel(selectedItems, this.titulo);
  }

  eliminarServicio(selectedItems: %E%[]) {
    const dialogRef = this.dialog.open(DialogAlertaComponent, {
      width: '600px',
      height: '400px',
      data: {
        titulo: 'Eliminación individual',
        mensaje: `¿Estás seguro que deseas eliminar ${selectedItems.length > 1 ? 'los elementos seleccionados' : 'el elemento'}? Esta acción no se puede deshacer`,
        textoBotonCancelar: 'Cancelar',
        textoBotonConfirmar: 'Eliminar'
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
          },
          error: err => {
            console.error("Error al eliminar elementos:", err);
          }
        });
      }
    });
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

  obtenerDatos(sortField: string = 'id', sortDirection: string = 'asc') {
    this.%e%Service.buscarFiltrado({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortField: sortField,
      sortDirection: sortDirection
    }).subscribe((data: PagedResponse<%E%[]>) => {
      console.log("Datos recibidos:", data);

      this.pageNumber = data.pageNumber
      this.totalPages = data.totalPages
      this.pageSize = data.pageSize;
      this.totalElements = data.totalElements;

      this.dataSource = data.content.flat();
      if (data.content.length > 0) {
        this.displayedColumns = Object.keys(data.content[0]);
      }
      this.cdr.detectChanges();
    });
  }

  transformarNombreColumna(columna: string): string {
    return columna
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}
