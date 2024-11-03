import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ControlEvent, FormControl, FormGroupDirective, NgForm, PristineChangeEvent, TouchedChangeEvent, ValueChangeEvent, StatusChangeEvent, FormSubmittedEvent, FormResetEvent } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { combineLatest, debounceTime, distinctUntilChanged, filter, merge, Subscription } from 'rxjs';

@Component({
  selector: 'app-observable-form',
  templateUrl: './observable-form.component.html',
  styleUrl: './observable-form.component.scss'
})
export class ObservableFormComponent implements OnInit {
  myForm: FormGroup;
  formStatus: string = "";
  formValue: any;
  matcher = new MyErrorStateMatcher();
  prevValues: any;
  private subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      amount: [''],
      address: this.fb.group({
        streetDetails: this.fb.group({
          streetName: [''],
          streetNumber: [''],
        }),
        city: [''],
        state: [''],
        zip: ['']
      }),
      description: ['']
    });
  }

  ngOnInit() {
    this.subscribeEach();
    // this.subscribeWithMerge();
    // this.subscribeWithCombinedLatest();
  }

  subscribeEach() {
    // // Subscribe to valueChanges observable
    // const valueChangesSub = this.myForm.get('address.streetDetails.streetName')?.valueChanges.subscribe((value) => {
    //   this.formValue = value;  // Get the current value of the form
    //   console.log('Form Value Changed using .valueChanges():', value);
    // });

    // // Subscribe to statusChanges observable
    // const statusChangesSub = this.myForm.statusChanges.subscribe((status) => {
    //   this.formStatus = status;  // Get the current form status (VALID, INVALID, etc.)
    //   console.log('Form Status Changed using .statusChanges():', status);
    // });

    // this.subscription.add(valueChangesSub);
    // this.subscription.add(statusChangesSub);

    //New observable angular v18
    this.prevValues = {...this.myForm.value};
    const changesSub = this.myForm.events.subscribe((event) => {
      
      if (event instanceof StatusChangeEvent) {
        console.log("STATUS CHANGE EVENT using new observable", event);
      }

      if (event instanceof ValueChangeEvent) {
        const values = event.value;
        const changedProperty = Object.keys(values).find((key)=> values[key] !== this.prevValues[key]);
        this.prevValues = {...this.myForm.value};
        console.log("PROPERTY CHANGED:", changedProperty);
        console.log("VALUE CHANGE EVENT using new observable", event);
      }

      if (event instanceof TouchedChangeEvent) {
        console.log("TOUCHED CHANGE EVENT using new observable", event);
      }
      if (event instanceof PristineChangeEvent) {
        console.log("PRISTINE CHANGE EVENT using new observable", event);
      }
      if (event instanceof FormSubmittedEvent) {
        console.log("FORM SUBMITTED using new observable", event);
      }
      if (event instanceof FormResetEvent) {
        console.log("FORM RESET using new observable", event);
      }
    });
    this.subscription.add(changesSub);
    
    //Note: The below console.log will log the 'StatusChangeEvent' because debounceTime only emits the latest notification.
    //If you require the other events, you might have to do some extra transformation like .filter
    //filter(x => !(x instanceof StatusChangeEvent))
    //or just use the specific methods like .valueChanges or .statusChanges depending on your use case
    //this.myForm.events.pipe(debounceTime(200)).subscribe((event) => console.log(event))

    // const changesStreetNameSub = this.myForm.get("address.streetDetails.streetName")?.events.subscribe((event) => {
    //   console.log('STREET NAME using new observable', event);
    // });
    // this.subscription.add(changesStreetNameSub);
  }

  //Upon any subscribed child emits an event, the subscription will be triggered
  subscribeWithMerge() {
    const changesSub: any = this.myForm.events
    const changesStreetNameSub: any = this.myForm.get("address.streetDetails.streetName")?.events;
    const combinedSub = merge(changesSub, changesStreetNameSub).subscribe((event) => {
      console.log('New observable with merge()', event);
    });

    this.subscription.add(combinedSub);
  }

  //After all children (streetNumber, streetName) in combineLatest have been triggered once, value will be outputted 
  subscribeWithCombinedLatest() {
    const changesStreetNumberSub: any = this.myForm.get("address.streetDetails.streetNumber")?.events;
    const changesAmountSub: any = this.myForm.get("amount")?.events;
    const changesStreetNameSub: any = this.myForm.get("address.streetDetails.streetName")?.events;
    const combinedSub = combineLatest(changesStreetNumberSub, changesAmountSub, changesStreetNameSub).subscribe((event) => {
      console.log('New observable with combinedLatest()', event);
    });
    
    this.subscription.add(combinedSub);
  }

  onSubmit() {
    console.log("submitting form...");
  }

  onReset() {
    console.log("resetting form...")
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}