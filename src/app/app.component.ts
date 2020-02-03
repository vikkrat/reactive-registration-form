import { RegistrationService } from './registration.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { forbiddenNameValidator } from './shared/user-name.validator';
import { passwordValidator } from './shared/password.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'reactive-forms';

  registrationForm: FormGroup;

  get userName() {
    return this.registrationForm.get('userName');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get alternateEmails() {
    return this.registrationForm.get('alternateEmails') as FormArray;
  }

  addAlternateEmail() {
    this.alternateEmails.push(this.fb.control(''));
  }

  constructor(private fb: FormBuilder,
              private registrationService: RegistrationService) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      userName: ['', [Validators.required,
                      Validators.minLength(3),
                      forbiddenNameValidator(/password/)]],
      email: [''],
      subscribe: [false],
      password: [''],
      confirmPassword: [''],
      adress: this.fb.group({
        city: [''],
        state: [''],
        postalCode: ['']
      }),
      alternateEmails: this.fb.array([])
    }, {validator: passwordValidator});

    this.registrationForm.get('subscribe').valueChanges
        .subscribe(checkedValue => {
          const email = this.registrationForm.get('email');
          if (checkedValue) {
            email.setValidators(Validators.required);
          } else {
            email.clearValidators();
          }
          email.updateValueAndValidity();
        });

  }

  // registrationForm = new FormGroup({
  //   userName: new FormControl(''),
  //   password: new FormControl (''),
  //   confirmPassword: new FormControl(''),
  //   adress: new FormGroup ({
  //     city: new FormControl(''),
  //     state: new FormControl(''),
  //     postalCode: new FormControl('')
  //   })
  // });

  loadApiData() {
    this.registrationForm.setValue({
      userName: 'Petro',
      email: 'petro@test.com',
      subscribe: false,
      password: '112233',
      confirmPassword: '112233',
      adress: {
        city: 'Kyiv',
        state: 'Ukraine',
        postalCode: '40020'
      },
      alternateEmails: []
  });

  }

  patchApiData() {
    this.registrationForm.patchValue({
      userName: 'Petro',
      password: '112233',
      confirmPassword: '112233'
    });
  }

  onSubmit() {
    console.log(this.registrationForm.value);
    this.registrationService.register(this.registrationForm.value)
        .subscribe(response => console.log('Success!', response),
                   error => console.error('Error', error));
  }
}
