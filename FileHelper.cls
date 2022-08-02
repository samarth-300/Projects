// Copyright © 2022 MaxVal Group. All Rights Reserved.
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential
public with sharing class FileHelper {
    @AuraEnabled(cacheable=true)
    // To get existing file details using document Id.
        public static List<ContentVersion> GetFileDetails(List<String> fileId){
            List<ContentVersion> contentversion = new List<ContentVersion>();
            System.debug('test for apex class');
            System.debug(fileId);
            try {
                
                contentversion =  [SELECT Id,
                Title,
                ContentDocumentId,
                FileType, 
                ContentSize,
                FileExtension,
                VersionNumber,
                CreatedDate,
                VersionData,
                FirstPublishLocationId
        FROM ContentVersion where ContentDocumentId IN :fileId];
             
                
            } catch (Exception e) {
                
                System.debug('exception --------- ' + e.getMessage() + e.getLineNumber());
                
            }   
             return contentversion;
        }
    public class CustomException extends Exception {}
}