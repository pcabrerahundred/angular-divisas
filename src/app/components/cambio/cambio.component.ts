import { Component, OnInit } from '@angular/core';
//
import { Cambio } from './../../shared/cambio';
import { ApiService } from './../../shared/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, interval } from 'rxjs';
import { CommonModule, CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-cambio',
  templateUrl: './cambio.component.html',
  styleUrls: ['./cambio.component.css']
})
export class CambioComponent implements OnInit {
  form: FormGroup;
  // formTipo: string;
  formMonto: string;
  formTotal: string;
  timer = null;
  formattedAmount;
  amount;

  montoReal;

  constructor(private cambioApi: ApiService,
    private formBuilder: FormBuilder,
    private currencyPipe : CurrencyPipe) {

    // this.formTipo = 'tipo';
    this.formMonto = "monto";
    this.formTotal = 'total';

    this.form = this.formBuilder.group(
      {
        // tipo: ['', [Validators.required]],
        monto: ['', [Validators.required]],
        total: ['', null],
      }
    )

  }

  //Convierte input de doláres al formato de moneda
  transformAmountToDollar(element){
    this.montoReal = element.target.value;
    this.formattedAmount = this.currencyPipe.transform(this.formattedAmount, '$','symbol','1.2-4');
    element.target.value = this.formattedAmount;
  }

  //Convierte resultado del cambio a formato de moneda euros
  transformAmountToEuro(element){
    this.form.controls[this.formTotal].setValue(this.currencyPipe.transform(element, '€','symbol','1.2-4'));
  }

  ngOnInit(): void {
  }

  //Función que es invocado por el botón Convertir
  convertir() {

    //Obtiene los valores del formulario
    let xtipo =   'D';
    let xmonto = this.montoReal;
    let xdatos = sessionStorage.getItem('datos');

    // Valida si en sessionStorage esta guardado los datos persistidos
    if (xdatos !== null) {
      //Si se encuentran los datos persistidos, multplicar por el tipo de cambio y mandar los datos al formulario.
      console.log(xdatos);
      let xobj = JSON.parse(xdatos);
      if (xobj.tipo == xtipo) {
        let m = (xmonto * xobj.tasa);
        this.form.controls[this.formTotal].setValue(m.toFixed(4));
        return;
      }
      else {
        //De lo contrario (ya no esta persistido), desactivar la funcion TIMER.
        console.log(this.timer);
        if (this.timer !== null) {
          console.log('unsubcribe');
          this.timer.unsubscribe();
        }
      }
    }

    //Crea el objeto a enviar al API REST
    let c: Cambio = {
      tipo: xtipo,
      monto: parseFloat(xmonto),
      total: 0
    };

    //Invoca al API REST
    this.cambioApi.convertir(c).subscribe(data => {
      this.transformAmountToEuro(data.total);
      
      // Crea Objeto para persistir los datos en SessionStorage
      var obj = {
        tipo: xtipo,
        tasa: data.tasa,
      }
      sessionStorage.setItem('datos', JSON.stringify(obj));

      // Crea el TIMER (en mílisegundos). Cuando se cumple el tiempo, borra los datos persistidos en SessionStorage  
      this.timer = interval(10000).subscribe(x => {
        sessionStorage.removeItem('datos');
        console.log('removeItem');
        this.timer.unsubscribe();
      })
    },
    error => {
        console.log(JSON.stringify(error));
    })

  }

}
