/**
 * @author Nermeen Mattar
 * Validators module will contain all the custom validators needed in forms.
 * New validation rule will be added to this file to be available to any field.
 */
validators = (function() {
    /* The list of all validator messages */
    const errorMsgs = {
        number: 'should be a valid number',
        positive: 'should be a positive number ',
        required: ' is Required',
        email: 'should be a valid a email address',
        username: 'should only contain letters, digits, hyphens and underscores',
        url: 'should be a valid url is required',
        minlength: ' should have a minimum of $$ characters ',
        maxlength: ' should have a maximum of $$ characters '
    };

    /**
     * An object where the key is the validator name and the value is the
     * validator function. A validator function does certain checks on each 
     * change in the attached input.
     */
    const validatorsFunctions = {
        required: (control) => {
            return control.value.length > 0;
        },
        isChecked: (control) => {
            return control.checked;
        },
        minlength: (control, minAllowedLength) => {
            return control.value == '' || control.value.length > minAllowedLength;
        },
        maxlength: (control, maxAllowedLength) => {

            return control.value == '' || control.value.length < maxAllowedLength;
        },
        number: (control) => {
            return control.value == '' || !isNaN(Number(control.value)) ? true : false; 
            // true mean there is an error
        },
        email: (control) => {
            const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return control.value == '' || emailRegExp.test(control.value);
        },
        username: (control) => {
            const usernameRegExp = /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/;
            return control.value == '' || usernameRegExp.test(control.value);
        },
        url: (control) => {
            const usernameRegExp = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
            return control.value == '' || usernameRegExp.test(control.value);
        },
        equal: (control) => { // section validator
            const inputControls = control.getElementsByTagName('input');
            const value = inputControls[0].value;
            let areEqual = true;
            for (let i = 1; i < inputControls.length; i++) {
                if (inputControls[i].value !== value) {
                    areEqual = false;
                    break;
                }
            }
            return areEqual;
        }
    }

    function getValidator(validatorName, specifications) {
        return validatorsFunctions[validatorName];
    }


    return {
        getValidator: getValidator,
        errorMsgs: errorMsgs
    };
})();

