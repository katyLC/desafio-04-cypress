

//const Cypress  = require("cypress");
//<reference  types='cypress'>

import {ProductPage} from "../support/pages/pageProduct";
import {PurchaseProduct} from "../support/pages/purchaseProduct";

describe(' Create Product in Online shop',()=>{

    const productPage = new ProductPage()
    const purchaseProduct = new PurchaseProduct()
    before('Iniciar sesion', ()=>{
        cy.login(Cypress.env().usuario, Cypress.env().password);
        cy.visit("/")
    })

    it('Create Product ', () => {

        cy.fixture('data').then(data =>{
            cy.deleteProduct(data.product1.id);
            cy.deleteProduct(data.product2.id);
            cy.createProduct(data.product1);
            cy.createProduct(data.product2);

        })

    });
    it("Make a purchase",()=>{
        cy.wait(1000)
        productPage.onlineShopClick.click()
        cy.get('[data-cy="add-to-cart-1002"]').click()
        purchaseProduct.closeModalClick.click()
        cy.get('[data-cy="add-to-cart-1002"]').click()
        purchaseProduct.closeModalClick.click()
        cy.get('[data-cy="add-to-cart-1005"]').click()
        purchaseProduct.closeModalClick.click()
        cy.get('[data-cy="add-to-cart-1005"]').click()
        purchaseProduct.closeModalClick.click()
        purchaseProduct.goShoppingCartButton.should('be.visible')
        purchaseProduct.goShoppingCartButton.click()
        cy.verifyPurchase()
        cy.verifyTotalPrice()
        purchaseProduct.goBillingSummaryClick.click()
        cy.verifyBillingSummary()
        purchaseProduct.goCheckoutClick.click()
        purchaseProduct.firstNameLabel.type('katherine')
        purchaseProduct.lastNameLabel.type('Perz')
        purchaseProduct.cardNumberLabel.type('2345678923456789')
        purchaseProduct.purchaseButton.click();
        cy.wait(2000)
        cy.fixture('data').then(data=>{
            cy.validacionBD(data.product1.name,data.product2.name,data.product1.price, data.product2.price, 2,2);
        })


    })

})