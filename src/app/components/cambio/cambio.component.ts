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
  formTipo: string;
  formMonto: string;
  formTotal: string;
  timer = null;
  formattedAmount;
  amount;

  montoReal;

  constructor(private cambioApi: ApiService,
    private formBuilder: FormBuilder,
    private currencyPipe : CurrencyPipe) {

    this.formTipo = 'tipo';
    this.formMonto = "monto";
    this.formTotal = 'total';

    this.form = this.formBuilder.group(
      {
        tipo: ['', [Validators.required]],
        monto: ['', [Validators.required]],
        total: ['', null],
      }
    )

  }

  transformAmount(element){
    this.montoReal = element.target.value;
    this.formattedAmount = this.currencyPipe.transform(this.formattedAmount, '$','symbol','1.2-4');
    element.target.value = this.formattedAmount;
  }

  transformAmountToEuro(element){
    //this.formattedAmount = this.currencyPipe.transform(element, '€','symbol','1.2-4');
    this.form.controls[this.formTotal].setValue(this.currencyPipe.transform(element, '€','symbol','1.2-4'));
  }

  ngOnInit(): void {
  }

  convertir() {
    let xtipo =   this.form.get(this.formTipo).value;
    //let xmonto = this.form.get(this.formMonto).value;
    let xmonto = this.montoReal;
    let xdatos = sessionStorage.getItem('datos');

    if (xdatos !== null) {
      console.log(xdatos);
      let xobj = JSON.parse(xdatos);
      if (xobj.tipo == xtipo) {
        let m = (xmonto * xobj.tasa);
        this.form.controls[this.formTotal].setValue(m.toFixed(4));
        return;
      }
      else {
        console.log(this.timer);
        if (this.timer !== null) {
          console.log('unsubcribe');
          this.timer.unsubscribe();
        }
      }
    }

    let c: Cambio = {
      tipo: xtipo,
      monto: parseFloat(xmonto),
      total: 0
    };

    this.cambioApi.convertir(c).subscribe(data => {
      //console.log(data);
      //this.form.controls[this.formTotal].setValue(parseFloat(data.total).toFixed(4));
      this.transformAmountToEuro(data.total);
      // persistir
      var obj = {
        tipo: xtipo,
        tasa: data.tasa,
      }
      sessionStorage.setItem('datos', JSON.stringify(obj));

      this.timer = interval(10000).subscribe(x => {
        sessionStorage.removeItem('datos');
        console.log('removeItem');
        this.timer.unsubscribe();
      })
    })

  }

}
