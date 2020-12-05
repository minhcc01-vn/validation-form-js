function Validator (options) {

    var selectorRules = {};

    // Validate inputelement
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector('.form-message')
        var errorMessage

        var rules = selectorRules[rule.selector]
        for (let i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }
        if(errorMessage) {
            errorElement.innerText = errorMessage
            inputElement.parentElement.classList.add('invalid')
        }else {
            errorElement.innerText = ''
        }
        return !errorMessage
    }

    // selector form need validate
    var formElement = document.querySelector (options.form)

    if (formElement) {

        formElement.onsubmit = (e) => {
            e.preventDefault();
            
            var isFormValid = true

            // Lặp qua từng rule và validate 
            options.rules.forEach(rule => {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)
                if(!isValid) {
                    isFormValid = false
                }
            })

            if(isFormValid) {
                // Submit with javascript 
                if(typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                    var formValues = Array.from(enableInputs).reduce((values, input) => (values[input.name] = input.value) && values, {})
                    options.onSubmit(formValues)
                    return;
                }
                // Submit default
                formElement.submit();
            }
        
        }


        // Lặp qua từng rule và lắng nghe sự kiên (input, blur,......)
        options.rules.forEach(rule => {
            var inputElement = formElement.querySelector(rule.selector)
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            }else {
                selectorRules[rule.selector] = [rule.test];
            }

            if(inputElement) {    
                // event blur
                inputElement.onblur = function () {
                    validate(inputElement, rule)
                }

                // event input 
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector('.form-message')
                    errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        });
    }
}

Validator.isRequired = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value ? undefined : message
        } 
    }
}

Validator.isEmail = (selector, message) => {
    return {
        selector: selector,
        test: function (value) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(value) ? undefined : message
        }
    }
}

Validator.isPassword = (selector, minlength) =>{
    return {
        selector: selector, 
        test: function (value) {
            return value.length>= minlength ? undefined : `Vui lòng tối thiểu ${minlength} kí tự `
        }
    }
}

Validator.isConfirmed = (selector, getConfirmValue, message) => {
    return {
        selector: selector, 
        test: (value) => {
            return !value.localeCompare(getConfirmValue()) ? undefined : message
        }
    }
}












