import { Component, OnInit, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SectorService } from '../../../core/services/sector.service';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';

import { ZonaService } from '../../core/services/zona.service';
				import { Zona } from '../../models/zona.model'; 
				

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { TituloDialogoComponent } from "../titulo-dialogo/titulo-dialogo.component";
import { Sector } from '../../../core/models/sector.model';

@Component({
  selector: 'app-sector-create-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatError,
    TranslateModule,
    TituloDialogoComponent,
  ],
  templateUrl: `./sector.component.html`,
  styles: [],
})
export class SectorFormComponent implements OnInit {
  form!: FormGroup;

  readonly dialogRef = inject(MatDialogRef<SectorFormComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly esActualizar = model(this.data.esActualizar);

  zona: Zona[] = [];

  constructor(
    private fb: FormBuilder,
    private sectorService: SectorService,
    private zonaService: ZonaService,
  ) {
    // Tipando el FormGroup
    this.form = this.fb.group({
       id: [null, Validators.required],
  descripcionSector: [null, Validators.required],
  zona: [{}, Validators.required],
    });
  }

  ngOnInit() {
    console.log("Datos recibidos en el formulario:", this.data);

    // Verificar si 'data.object' existe y tiene el campo 'sectorDesc'
    if (this.esActualizar() && this.data?.object) {
      console.log("Objeto recibido:", this.data.object);


      this.form.patchValue({
       id: this.data.object.id
descripcionSector: this.data.object.descripcionSector
zona: this.data.object.zona
      });

      console.log("Datos en el formulario después de patchValue:", this.form.value);
    } else {
      console.error("No se recibió un objeto válido en 'data'");
    }

    
					this.zonaService.buscarTodos().subscribe({
						next:(zona :Zona[])=>{
							console.log("created entity ", zona)
							this.zona = zona
						}
					})
				
  }

  onSubmit() {
    console.log("Formulario enviado:", this.form.value);

    if (this.form.valid) {
      const formData: Sector = {
       id: this.form.value.id
descripcionSector: this.form.value.descripcionSector
zona: this.form.value.zona
      };

      console.log("Datos mapeados para enviar:", formData);

      // Cierra el formulario con los datos correctos
      this.dialogRef.close(formData);
    } else {
      console.log("Formulario no válido");
    }
  }
}
