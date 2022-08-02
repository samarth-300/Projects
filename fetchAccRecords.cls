public class fetchAccRecords {
@AuraEnabled(cacheable = true)
    public static List<SObject> getRecord(string recordId, List<string> fields,string objectApiName) {
        string query;
        query = 'SELECT ' + fields + ' FROM ' + objectApiName + ' WHERE Id = :recordId'; 
        
        List<SObject> recList = new List<SObject> ();
        recList = Database.Query(query);
        return recList; // Consists of all the fetched records
    }
}