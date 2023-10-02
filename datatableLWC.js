import { LightningElement,wire,track} from 'lwc';
import getContact from '@salesforce/apex/DataTableController.getContact';

const columns = [
    {label:'First Name',fieldName:'FirstName',type:'text',sortable:"true"},
    {label:'Last Name',fieldName:'LastName',type:'text',sortable:"true"},
    {label:'Phone',fieldName:'Phone',type:'phone',sortable:"true"},
    {label:'Email',fieldName:'Email',type:'email',sortable:"true"}
];
export default class DatatableLWC extends LightningElement {
    columns = columns;

    data;
    error;
    @track sortBy;
    @track sortDirection;
    @track sortdata;

    @wire(getContact)
    contacts(results){
        if(results.data){
            this.data = results.data;
            this.error = undefined;
        }else if(results.error){
            this.data = undefined;
            this.error = results.error;
        }
    }
    


   doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.data));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.data = parseData;
    }    

}
