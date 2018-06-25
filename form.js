

/**
 * @author Nermeen Mattar
 * This class is a base for general form to build on top of it so that 
 * it can be used for any needed form.
 * If you need an input or a validator rule other than currently supported
 * ones simply expand this class to support your needs and others' needs.
 */
let Form = (function() {
    // form constructor
    function Form(formInfo, sectionsInfo, fieldsInfo) {
        // class properties
        this.formInfo = formInfo;
        this.sectionsInfo = sectionsInfo;
        this.fieldsInfo = fieldsInfo;
        this.formEl = document.createElement('form');
        const headerEl = document.createElement('div');
        headerEl.classList.add('form-header');
        if (this.formInfo.title) { // a preventive check
            const formTitleEl = document.createElement('div');
            formTitleEl.innerText = this.formInfo.title;
            headerEl.appendChild(formTitleEl);
        }
        headerEl.appendChild(this.initSaveButton(this.formInfo.saveCallback));
        this.formEl.appendChild(headerEl);
        this.appendSectionsIntoForm(this.fieldsInfo, this.sectionsInfo);
    }
    Form.prototype.appendSectionsIntoForm =
        function(fieldsInfo, sectionsInfo) {
            let sectionEl, sectionTitleEl;
            sectionsInfo.forEach(sectionInfo => {
                sectionEl = document.createElement('div');
                sectionEl.classList.add('section');
                if (sectionInfo.title) {
                    sectionTitleEl = document.createElement('div');
                    sectionTitleEl.classList.add('section-title');
                    sectionTitleEl.innerText = sectionInfo.title;
                    sectionEl.appendChild(sectionTitleEl);
                }
                this.appendFieldsIntoSection(fieldsInfo, sectionInfo, sectionEl);
                if (sectionInfo.validators) {
                    this.addSectionValidators(sectionInfo.validators, sectionEl);
                }
                this.formEl.appendChild(sectionEl);
            });
        };
    Form.prototype.appendFieldsIntoSection =
        function(fieldsInfo, sectionInfo, sectionEl) {
            let fieldInfo, inputEl, inputContainerEL, labelEl, fieldAndLabelEl;
            sectionInfo.fieldNames.forEach((fieldName) => {
                fieldInfo = fieldsInfo[fieldName];
                inputEl = document.createElement('input');
                inputEl.type = fieldInfo.type;
                inputContainerEL = document.createElement('div');
                inputContainerEL.appendChild(inputEl);
                labelEl = document.createElement('label');
                labelEl.innerText = fieldInfo.label ? fieldInfo.label : '';
                fieldAndLabelEl = document.createElement('div');
                fieldAndLabelEl.classList.add('field-and-label-container');
                // special case for checkboxes
                if (fieldInfo.type == 'checkbox') {
                    fieldAndLabelEl.appendChild(inputContainerEL);
                    fieldAndLabelEl.appendChild(labelEl);
                    inputContainerEL.classList.add('input-checkbox');
                } else {
                    fieldAndLabelEl.appendChild(labelEl);
                    fieldAndLabelEl.appendChild(inputContainerEL);
                    inputContainerEL.classList.add('w-90');
                }
                sectionEl.appendChild(fieldAndLabelEl);
                if (fieldInfo.validators) {
                    this.addFieldValidators(fieldInfo, inputEl, inputContainerEL);
                }
            });
        };
    Form.prototype.addSectionValidators = function(validatorsInfo, sectionEl) {
        const errorEl = document.createElement('div');
        errorEl.classList.add("error-msg");
        sectionEl.appendChild(errorEl);
        sectionEl.onchange = () => {
            let generalErrorName, customErrMsg;
            const sectionHasErrors = validatorsInfo.some(validatorInfo => {
                generalErrorName = validatorInfo.name;
                customErrMsg = validatorInfo.customErrMsg;
                return !validators.getValidator(validatorInfo.name)(sectionEl);
            });
            if (sectionHasErrors) {
                sectionEl.classList.remove("clean");
                sectionEl.classList.add("error");
                errorEl.innerText = customErrMsg ? customErrMsg : validators.errorMsgs[generalErrorName];
            } else {
                sectionEl.classList.remove("error");
                errorEl.innerText = ''; // clear error div from previous errors.
            }
        }
    };
    Form.prototype.addFieldValidators =
        function(fieldInfo, inputEl, inputContainerEL) {
            const validatorsInfo = fieldInfo.validators;
            const errorEl = document.createElement('div');
            errorEl.classList.add("error-msg");
            inputContainerEL.appendChild(errorEl);

            const hasRequired = validatorsInfo.some(validatorInfo => {
                return validatorInfo.name === 'required';
            });
            // needed in case the user clicked save without modifying any of the required field.
            inputContainerEL.classList.add("clean");
            if (hasRequired) {
                inputContainerEL.classList.add("error");
                errorEl.innerText = fieldInfo.label + ' ' + validators.errorMsgs.required;
            }
            inputEl.onchange = () => {
                let generalErrorName, customErrMsg;
                let specsCopy, isValid;
                const inputHasErrors = validatorsInfo.some(validatorInfo => {
                    generalErrorName = validatorInfo.name;
                    customErrMsg = validatorInfo.customErrMsg;
                    isValid = validators.getValidator(validatorInfo.name)(inputEl, validatorInfo.specs);
                    if (!isValid) {
                        specsCopy = validatorInfo.specs;
                    }
                    return !isValid;
                });
                inputContainerEL.classList.remove("clean");
                if (inputHasErrors) {
                    inputContainerEL.classList.add("error");
                    errorEl.innerText = customErrMsg ? customErrMsg : fieldInfo.label + ' ' + validators.errorMsgs[generalErrorName].replace('$$', specsCopy);
                } else {
                    inputContainerEL.classList.remove("error");
                    errorEl.innerText = ''; // clear error div from previous errors.
                }
            };
        };
    Form.prototype.initSaveButton = function(saveCallback) {
        let saveBtn = document.createElement('button');
        saveBtn.innerText = 'Save';
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let formHasError = false;
            const requiredEls = this.formEl.getElementsByClassName('clean error');
            formHasError = requiredEls.length > 0; // check if there are any empty required fields
            for (let i = 0; i < requiredEls.length; i++) { // loop through required fields that are empty

                requiredEls[0].classList.remove('clean');
                i--;
            }
            // check if there are other errors in filled fields
            if (!formHasError) {
                let errorMsgs = this.formEl.getElementsByClassName('error-msg');
                for (let i = 0; i < errorMsgs.length; i++) { // loop through required fields that are empty
                    if (errorMsgs[i].innerText !== undefined && errorMsgs[i].innerText !== '') {
                        formHasError = true;
                        break;
                    }
                }
            }
            if (formHasError) {
                alert("Error!")
            } else {
                alert("Saved!")
                // do something
            }
        });
        return saveBtn;
    };
    Form.prototype.appendFormToElement = function(el) {
        el.appendChild(this.formEl);
    };
    return Form;
}());
