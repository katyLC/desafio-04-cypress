
export class PageBillingSummary{


    constructor() {
        this.subTotal = '[data-cy="subtotalAmount"]';
        this.totalPrice = '[data-cy="totalPriceAmount"]';
        this.freight = '[data-cy="freightText"]';
    }

    get subTotalLabel(){

        return cy.get(this.subTotal)
    }

    get totalPriceSummaryLabel(){

        return cy.get(this.totalPrice)
    }

    get freightLabel(){

        return cy.get(this.freight)
    }

}