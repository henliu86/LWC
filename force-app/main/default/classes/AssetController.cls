public with sharing class AssetController {
    @AuraEnabled(cacheable=true)
    public static List<Asset> getAssetsWithSameRoot(Id searchId){
        Asset currentAsset = [  SELECT ParentId, RootAssetId 
                                FROM Asset
                                WHERE Id = :searchId
                                LIMIT 1];

        List<Asset> allAssets = [
            SELECT Id, Name, ParentId, Parent.Name, RootAssetId, AssetLevel
            FROM Asset
            WHERE RootAssetId = :currentAsset.RootAssetId
            WITH SECURITY_ENFORCED
            ORDER BY AssetLevel ASC
        ];
        return allAssets;
        
    }
    @AuraEnabled(cacheable=true)
    public static Asset getParentAsset(Id searchId){
        Asset currentAsset = [  SELECT ParentId 
                                FROM Asset
                                WHERE Id = :searchId
                                LIMIT 1];
        List<Asset> assets = [
            SELECT Id, Name, ParentId, Parent.Name, RootAssetId
            FROM Asset
            WHERE Id = :currentAsset.ParentId
            WITH SECURITY_ENFORCED
            ORDER BY Name
        ];
        if(assets.isEmpty())
            return null;
        else
            return assets[0];
    }

    @AuraEnabled(cacheable=true)
    public static List<Asset> getPeerAssets(Id searchId){
        Asset currentAsset = [  SELECT ParentId 
                                FROM Asset
                                WHERE Id = :searchId
                                LIMIT 1];
        return [
            SELECT Id, Name
            FROM Asset
            WHERE  Id != :currentAsset.Id AND ParentId != null AND ParentId = :currentAsset.ParentId 
            WITH SECURITY_ENFORCED
            ORDER BY Name
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Asset> getChildrenAssets(Id searchId) {
        return [
            SELECT Id, Name
            FROM Asset
            WHERE ParentId = :searchId
            WITH SECURITY_ENFORCED
            ORDER BY Name
        ];
    }
}
