import { Component, OnInit, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { %E%Service } from '../../../core/services/%k%.service';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

/*services-imports*/


import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TituloDialogoComponent } from "../titulo-dialogo/titulo-dialogo.component";
import { %E% } from '../../../core/models/%k%.model';
import { catchError, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-%k%-create-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogContent,
    MatSelectModule,
    MatOptionModule,
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

  /*variable-declarations*/


  constructor(
    private fb: FormBuilder,
    private %e%Service: %E%Service,
    private translate: TranslateService,
    private toastr: ToastrService,
    /*other-services-injection*/
  ) {
    // Tipando el FormGroup
    this.form = this.fb.group({
      /*inputsflag*/
    });
  }

  ngOnInit() {
    console.log("Datos recibidos en el formulario:", this.data);

    // Verificar si 'data.object' existe y tiene el campo 'descripcion%E%'
    if (this.esActualizar() && this.data?.object) {
      console.log("Objeto recibido:", this.data.object);


      this.form.patchValue({
        /*object-fields-edit*/
      });

      console.log("Datos en el formulario después de patchValue:", this.form.value);
    } else {
      console.error("No se recibió un objeto válido en 'data'");
    }
    /*services-init-call*/

  }

  onSubmit() {
    console.log("Formulario enviado:", this.form.value);

    if (this.form.valid) {
      const formData: %E% = {
        /*form-fields-submit*/
      };

      console.log("Datos mapeados para enviar:", formData);

      // Cierra el formulario con los datos correctos
      if (this.esActualizar()) {
        this.%e%Service.actualizar(formData.id, formData).subscribe({
          next: (response) => {
            this.toastr.success(this.translate.instant('mantenedores.formularios.toastr.success'));
            this.dialogRef.close(response);
          },
          error: (error) => {
            const errorMessage = error.error?.message || this.translate.instant('mantenedores.formularios.toastr.error');
            this.toastr.error(errorMessage);
          }
        })

      }
      else {
        this.%e%Service.crear(formData).subscribe({
          next: (response) => {
            this.toastr.success(this.translate.instant('mantenedores.formularios.toastr.success'));
            this.dialogRef.close(response);
          },
          error: (error) => {
            const errorMessage = error.error?.message || this.translate.instant('mantenedores.formularios.toastr.error');
            this.toastr.error(errorMessage);
          }
        })
      }
    } else {
      console.log("Formulario no válido");
    }
  }
}