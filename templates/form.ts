import { Component, OnInit, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { %E%Service } from '../../../core/services/%k%.service';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';

/*servicesImports*/

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
import { %E% } from '../../../core/models/%k%.model';

@Component({
  selector: 'app-%e%-create-form',
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
  templateUrl: `./%k%.component.html`,
  styles: [],
})
export class %E%FormComponent implements OnInit {
  form!: FormGroup;

  readonly dialogRef = inject(MatDialogRef<%E%FormComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly esActualizar = model(this.data.esActualizar);

  //declarations

  constructor(
    private fb: FormBuilder,
    private %e%Service: %E%Service,
    //other services
  ) {
    // Tipando el FormGroup
    this.form = this.fb.group({
     /*inputsflag*/
    });
  }

  ngOnInit() {
    console.log("Datos recibidos en el formulario:", this.data);

    // Verificar si 'data.object' existe y tiene el campo '%e%Desc'
    if (this.esActualizar() && this.data?.object) {
      console.log("Objeto recibido:", this.data.object);


      this.form.patchValue({
       /*objectFields*/
      });

      console.log("Datos en el formulario después de patchValue:", this.form.value);
    } else {
      console.error("No se recibió un objeto válido en 'data'");
    }

    /*service*/
  }

  onSubmit() {
    console.log("Formulario enviado:", this.form.value);

    if (this.form.valid) {
      const formData: %E% = {
       /*formFields*/
      };

      console.log("Datos mapeados para enviar:", formData);

      // Cierra el formulario con los datos correctos
      this.dialogRef.close(formData);
    } else {
      console.log("Formulario no válido");
    }
  }
}
