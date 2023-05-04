import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-aggiungi-biglietto-val',
  templateUrl: './aggiungi-biglietto-val.component.html',
  styleUrls: ['./aggiungi-biglietto-val.component.scss']
})
export class AggiungiBigliettoValComponent implements OnInit {


  form: FormGroup;
  description;
  isGruppoSpeciale: boolean;

  constructor(
    private dialogRef: MatDialogRef<AggiungiBigliettoValComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data) {

      this.description = data;
  }

  ngOnInit(): void {

    this.isGruppoSpeciale = this.description.buyCountChild == undefined;
    console.log(this.description, 'ao')
    this.createForm();
    this.inizializeForm();
  }

  createForm(){
    this.form = this.isGruppoSpeciale ?
     this.fb.group({
      buyCountAdult: [0,[Validators.required, Validators.pattern("^([0-9]|1[09])$")]],
    })
    :
    this.fb.group({
      buyCountAdult: [0,[Validators.required, Validators.pattern("^([0-9]|1[09])$")]],
      buyCountChild: [0,[Validators.required, Validators.pattern("^([0-9]|1[09])$")]],
    })

  }

//   public comparisonValidator() : ValidatorFn{
//     return (group: FormGroup): ValidationErrors => {
//        const control1 = group.controls['buyCountAdult'];
//        const control2 = group.controls['buyCountChild'];
//        if (control1.value < 0 || control1.value > 9 || control2.value < 0 || control2.value > 9) {
//          //console.log(control1.value, this.distributore.creditoTotale)
//         control1.setErrors({minore: true});
//         control2.setErrors({minore: true});
//        } else {
//         control1.setErrors(null);
//         control2.setErrors(null);
//        }
//        return;
//  };
// }

  inizializeForm() {
    if(this.isGruppoSpeciale){
      this.form.setValue({
        buyCountAdult: this.description.buyCountAdult,
    });
    } else {
      this.form.setValue({
        buyCountAdult: this.description.buyCountAdult,
        buyCountChild: this.description.buyCountChild,
    });
    }
}

  close(){
    this.dialogRef.close();
  }

  save() {
    let wrapper = {
      form: this.form.value,
      id: this.description.id,
    }
    this.dialogRef.close(wrapper);
  }

  submit(){
    this.save();
  }


}
