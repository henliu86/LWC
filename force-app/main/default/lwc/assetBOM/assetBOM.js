import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import getAssetsWithSameRoot from '@salesforce/apex/AssetController.getAssetsWithSameRoot';

import ID_FIELD from '@salesforce/schema/Asset.Id';
import NAME_FIELD from '@salesforce/schema/Asset.Name';
import PARENTID_FIELD from '@salesforce/schema/Asset.ParentId';
import ROOTASSETID_FIELD from '@salesforce/schema/Asset.RootAssetId';

export default class AssetBOM extends LightningElement {
    @api recordId = '02iB00000007LXUIA2'; //'02iB000000061BoIAI';
    @track selectedId;
    assetTree = [];
    assetList = [];
    
    //initially get children asset from current record
    @wire(getRecord, { recordId: '$recordId', fields: [ID_FIELD, NAME_FIELD, PARENTID_FIELD, ROOTASSETID_FIELD] })
    assetWire ({error, data}) {
        if (data){
            console.log('current asset:' );
            console.log(data);
            this.findAssetsWithSameRoot(this.recordId);
        }
        else if(error){
            console.log('@wire failed');
            console.log(error);
        }
        
    }

    findAssetsWithSameRoot(myAssetId){
        getAssetsWithSameRoot({searchId : myAssetId}) //apex call
        .then(tempAssets => {
            console.log('all asset in '+ myAssetId +' tree: ');
            console.log(tempAssets);
            if(tempAssets == null || tempAssets == undefined){ //no assets
                console.log('no assets for '+ myAssetId);
                return;
            }
            else
            {
                this.assetList = tempAssets;
                var maxLevel = tempAssets[tempAssets.length-1].AssetLevel; //start at the last level
                var rootAsset = {
                    label: this.assetList[0].Name,
                    name: this.assetList[0].Id,
                    expanded: true,
                    items: []
                };
                rootAsset.items = this.findImmediateChildren(rootAsset.name); //set children
                this.assetTree = [rootAsset];
                console.log(this.assetTree);
            }
        })
        .catch(error => {
            console.log('no parent?');
            console.log(error);
        });
    }
    findImmediateChildren(rootAssetId){
        var allChildrenAsset  = [];
        //get all the assets that's on the same level
        for(var index = 0 ; index < this.assetList.length; index++){
            if(this.assetList[index].ParentId == rootAssetId){ //found 1 child
                console.log('have children for '+ rootAssetId);
                allChildrenAsset.push({
                    label: this.assetList[index].Name,
                    name: this.assetList[index].Id,
                    expanded: true,
                    items: this.findImmediateChildren(this.assetList[index].Id)
                });   
            }
        }
        return allChildrenAsset;
    }



    handleAdd(event){
        const newItems = Array.from(this.assetTree);
        const branch = newItems.length;
        const label = 'New item added at Record' + branch;
        const newItem = {
            label: label,
            expanded: true,
            disabled: false,
            items: []
        };
        newItems[0].items.push(newItem);
        this.assetTree = newItems;
    }
    handleSelect(event) {
        //set the name of selected tree item
        this.selectedId = event.detail.name;
        console.log('selected: '+this.selectedId);
    }
    
}

