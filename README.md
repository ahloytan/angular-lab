<a name="readme-top"></a>
# Nnew Angular Observable

[Angular CLI](https://github.com/angular/angular-cli) v18 | Unified state control source

## Sandbox
https://codesandbox.io/p/github/ahloytan/angular-observables/master

## Pre-requisites
1. Ensure you have [Node.js](https://nodejs.org/en/download) installed
2. Node.js (v22.5.1) | npm (v10.8.2)
3. Install Angular CLI (`npm install -g @angular/cli`)

## Start up project
1. If you are launching this project for the first time, install the necessary npm libraries by `npm i`
2. Start the frontend by `npm run start`. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

# Tech Stack

## Frontend
### Framework
[Angular](https://angular.dev/tools/cli/setup-local), [Typescript](https://www.typescriptlang.org/) <br>
![My Skills](https://skillicons.dev/icons?i=angular,ts&perline=3)

### Styling
[SASS](https://sass-lang.com/), [SASS](https://www.w3schools.com/css/) <br>
![My Skills](https://skillicons.dev/icons?i=sass,css&perline=3)

## Deployment
[Vercel](https://vercel.com/)<br>
![My Skills](https://skillicons.dev/icons?i=vercel&perline=3)
<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Contact Me
1. To explore more of my works, head over to [Portfolio Website](https://ahloytan.netlify.app)
2. Feel free to contact me if there are issues or if there are opportunities that I can help you with!
<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Notes/Observations
1. Main bulk of code located in `src/app/components/observable-form/observable-form.component.ts`
2. Although `.events()` provides the source (formControl) that's emitting the value, it's name is always `FormControl2` even if 2 separate forms are created
3. As an example, if you subscribe to `myForm`, which is the parent form group, and you change the value of `streetName`, the source doesn't tell you that the change comes from `streetName`. Instead, the source will be `FormControl2`
4. Chaining `.events()` with `.pipe(debounceTime(x))` will only return the most recent notification. In order of emission (first to last): `StatusChangeEvent` --> `ValueChangedEvent` --> `TouchedChangedEvent`

# References
1. https://dev.to/railsstudent/unified-control-state-change-events-working-with-reactive-form-is-never-the-same-in-angular-ipm
2. https://github.com/angular/angular/issues/10887
3. https://github.com/angular/angular/issues/42862
4. https://medium.com/@chandantechie/angular-v18-unified-control-state-change-events-f4c99f7ba1f1
5. https://medium.com/@pudalepramod/commonly-used-rxjs-features-with-reactive-forms-3e072b14a9f4
6. https://www.angulararchitects.io/en/blog/whats-new-in-angular-18/
7. https://www.angularspace.com/unified-control-state-change-events-in-angular-18/
8. https://netbasal.com/unified-control-state-change-events-in-angular-7e83c0504c8b
9. https://stackoverflow.com/questions/39142616/what-are-the-practical-differences-between-template-driven-and-reactive-forms
10. https://stackoverflow.com/questions/56729248/how-to-get-formcontrolname-of-the-field-which-value-changed-in-angular-reactive
11. https://stackoverflow.com/questions/60016114/angular-reactuve-form-control-valuechanges-get-value-changed-field-name-prev-v
    
