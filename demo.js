// Example (demo)

const formInfo = {
    title: "Sign Up"
};
const sectionsInfo = [{
    "title": "Details",
    "fieldNames": ["firstname", "username", "email", "website"]
}, {
    'title': 'Authentication',
    'fieldNames': ['password', 'confirm-password'],
    'validators': [{
        'name': 'equal',
        'customErrMsg': 'Password and Confirm password should be equal.'
    }]
}, {
    'title': '',
    'fieldNames': ['accept-terms']
}];
const fieldsInfo = {
    'firstname': {
        'type': 'text',
        'label': 'First Name',
        'validators': [{
            'name': 'required'
        }]
    },
    'username': {
        'type': 'text',
        'label': 'Username',
        'validators': [{
            'name': 'required'
        }, {
            'name': 'username'
        }]
    },
    'email': {
        'type': 'text',
        'label': 'Email',
        'validators': [{
            'name': 'required'
        }, {
            'name': 'email'
        }]
    },
    'website': {
        'type': 'text',
        'label': 'Website',
        'validators': [{
            'name': 'url'
        }]
    },
    'password': {
        'type': 'password',
        'label': 'Password',
        'validators': [{
            'name': 'required'
        }, {
            'name': 'minlength',
            specs: 5
        }, {
            'name': 'maxlength',
            specs: 12
        }]
    },
    'confirm-password': {
        'type': 'password',
        'label': 'Confirm Password',
        'validators': [{
            'name': 'required'
        }]
    },
    'accept-terms': {
        'type': 'checkbox',
        'label': 'Accept the Terms',
        'validators': [{
            'name': 'required',
            'customErrMsg': 'You should accept terms.'
        }, {
            'name': 'isChecked',
            'customErrMsg': 'You should accept terms.'
        }]
    }
};

let myForm = new Form(formInfo, sectionsInfo, fieldsInfo);
myForm.appendFormToElement(document.getElementById('form-container'));