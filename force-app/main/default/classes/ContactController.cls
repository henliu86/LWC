public with sharing class ContactController {
    public ContactController() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [
            SELECT Name, Firstname, Lastname, Email, Phone
            FROM Contact
            WITH SECURITY_ENFORCED
            ORDER BY Name
            LIMIT 100
        ];
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getRelatedContacts(Id searchId) {
        return [
            SELECT Name, Title, Email, Phone
            FROM Contact
            WHERE AccountId = :searchId
            WITH SECURITY_ENFORCED
            ORDER BY Name
        ];
    }
}
