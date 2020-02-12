import { Component, OnInit } from '@angular/core';
//
import { Cambio } from './../../shared/cambio';
import { ApiService } from './../../shared/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, interval } from 'rxjs';

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

  constructor(private cambioApi: ApiService,
    private formBuilder: FormBuilder) {

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

  ngOnInit(): void {
  }

  convertir() {
    let xtipo = this.form.get(this.formTipo).value;
    let xmonto = this.form.get(this.formMonto).value;
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
      this.form.controls[this.formTotal].setValue(parseFloat(data.total).toFixed(4));
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
