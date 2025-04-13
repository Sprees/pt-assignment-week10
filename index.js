// Grab the form and table to interact with them via JS
const formEl = document.querySelector('form')
const tableEl = document.querySelector('table')

// Add 'submit' event listener to the form
formEl.addEventListener('submit', e => {
    // prevent page refresh
    e.preventDefault()
    // use FormData to get all form input values
    let formData = new FormData(formEl)
    // create array of booleans used to fire addDataToTable if true
    let areInputsValid = []
    
    for(let [key, value] of formData.entries()) {
        // grab input associated with current formData iteration
        let inputEl = document.querySelector(`input[name=${key}]`)
        // if you are required to press submit more than once, clear the previous attempt's classes
        if(inputEl.classList.contains('is-valid')) inputEl.classList.remove('is-valid')
        if(inputEl.classList.contains('is-invalid')) inputEl.classList.remove('is-invalid')

        // add simple validation and formatting for each input type
        switch(key) {
            case 'phoneNumber':
                if(isValidNumber(value)) {
                    formData.set('phoneNumber', formatNumber(value))
                    inputEl.classList.add('is-valid')
                    areInputsValid.push(true)
                } else {
                    inputEl.classList.add('is-invalid')
                    areInputsValid.push(false)
                }
                break
            case 'firstName':
                if(isValidName(value)) {
                    formData.set('firstName', formatName(value))
                    inputEl.classList.add('is-valid')
                    areInputsValid.push(true)
                } else {
                    inputEl.classList.add('is-invalid')
                    areInputsValid.push(false)
                }
                break
            case 'lastName':
                if(isValidName(value)) {
                    formData.set('lastName', formatName(value))
                    inputEl.classList.add('is-valid')
                    areInputsValid.push(true)
                } else {
                    inputEl.classList.add('is-invalid')
                    areInputsValid.push(false)
                }
                break
            case 'email':
                if(isValidEmail(value)) {
                    inputEl.classList.add('is-valid')
                    areInputsValid.push(true)
                } else {
                    inputEl.classList.add('is-invalid')
                    areInputsValid.push(false)
                }
                break
            default:
                break
        }

    }

    // if the above boolean array evaluates to true, add data to table
    if(areInputsValid.every(Boolean)) {
        // pass the FormData
        addDataToTable(formData)
    }

}, false)

function addDataToTable(formData) {
    const inputs = Array.from(document.querySelectorAll('input'))
    const tBody = document.querySelector('tBody')

    // create elements needed and add attributes and classes 
    let tr = document.createElement('tr')
    // alternating green background for rows 
    if(tBody.children.length % 2 !== 0) tr.classList.add('table-success')
    let th = document.createElement('th')
    th.setAttribute('scope', 'row')
    // add the non-user input value, which is basically a simple counter for amount of people in table
    th.textContent = tBody.children.length + 1 
    tr.appendChild(th)
    for(let value of formData.values()) {
        // create td for each input value and append to the table row with formData value
        let td = document.createElement('td')
        td.textContent = value
        tr.append(td)
        
    }
    // append table row to the table body
    tBody.append(tr)

    // show success validation on all inputs briefly before clearing classes and values 
    setTimeout(() => {
        inputs.forEach(input => input.classList.remove('is-valid'))
        formEl.reset()
    }, 200)
}

function formatNumber(phoneNumber) {
    // remove anything that isn't an integer 
    phoneNumber = phoneNumber.replace(/\D/g, '')
    // format for area code and dash between core number
    return phoneNumber.replace( 
        /(\d{3})(\d{3})(\d{4})/, 
        '($1) $2-$3' 
    )
}

function formatName(name) {
    // Capitalize first letter in name
    let firstLetter = name.charAt(0).toUpperCase()
    let remainingLetters = name.slice(1)
    return firstLetter + remainingLetters
}

function isValidNumber(phoneNumber) {
    // remove anything that isn't an integer 
    phoneNumber = phoneNumber.replace(/\D/g, '')
    // not sure on this logic, but is concise 
    const pattern = /^(\+?\d{1,4})?[-. (]*\d{3}[-. )]*(\d{3}[-. ]*\d{4})$/
    // if number is not standard 10 digits return false, otherwise return the regex test
    if(phoneNumber.length === 10) {
        return pattern.test(phoneNumber);
    }
    return false
}

function isValidName(name) {
    // check for alphabetical characters only
    const pattern = /^[a-zA-Z]+$/
    return pattern.test(name)
}

function isValidEmail(email) {
    // not sure on logic but test for a widely accepted format of email
    const pattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    return pattern.test(email)
}