import { LightningElement, api, wire, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
//import getRelatedContacts from '@salesforce/apex/ContactController.getRelatedContacts';

import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

const COLUMNS = [
    {label: 'First Name', fieldName: FIRSTNAME_FIELD.fieldApiName, type: 'text'},
    {label: 'Last Name', fieldName: LASTNAME_FIELD.fieldApiName, type: 'text'},
    {label: 'Email', fieldName: EMAIL_FIELD.fieldApiName, type: 'email'}
    //why doesn't this work?
    //{label: 'First Name', fieldName: 'Contact.FirstName', type: 'text'},
    //{label: 'Last Name', fieldName: 'Contact.LastName', type: 'text'},
    //{label: 'Email', fieldName: 'Contact.Email', type: 'email'}
];

export default class ContactList extends LightningElement {
    @api recordId;
    //@api contacts;
    columns = COLUMNS;

    @wire(getContacts)
    contacts;
    
    handleButtonClick(){
        /*
        getRelatedContacts({
            accountId: '$recordId'
        })
            .then(contactsFromApex => {
                this.contacts = contactsFromApex;
            })
            .catch(error => {

            });
        */
       console.log(this.contacts);
    }
}