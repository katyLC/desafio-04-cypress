// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import {PurchaseProduct} from "./pages/purchaseProduct";
import {PageBillingSummary} from "./pages/pageBillingSummary";

Cypress.Commands.add('login', (usuario, password) => {

    cy.session('loginSession',() =>{
        cy.request({
            method: "POST",
            url: 'https://pushing-it.onrender.com/api/login',
            body: {
                username: usuario,
                password: password
            },
        }).then(respuesta => {
            window.localStorage.setItem('token', respuesta.body.token);
            window.localStorage.setItem('user', respuesta.body.user.username);
            window.localStorage.setItem('userId', respuesta.body.user._id);
            Cypress.env().token = respuesta.body.token;

        });

    })



})

Cypress.Commands.add('createProduct', (body) => {
    cy.request({
        method: "POST",
        url: 'https://pushing-it.onrender.com/api/create-product',
        body: body
    })
})

Cypress.Commands.add('deleteProduct', (id) => {
    cy.request({
        method: "GET",
        url: `https://pushing-it.onrender.com/api/products?id=${id}`,
        failOnStatusCode: false,
        headers: {
            Authorization: `Bearer ${Cypress.env().token}`
        }
    }).its('body.products.docs').each((product) => {

        cy.request({

            method: "DELETE",
            url: `https://pushing-it.onrender.com/api/product/${product._id}`,
            headers: {
                Authorization: `Bearer ${Cypress.env().token}`
            }
        })

    })
})

Cypress.Commands.add('validacionBD', (nameProduct1,nameProduct2,priceUnit1, priceUnit2,quantityProduct1, quantityProduct2) => {

    const purchaseProduct = new PurchaseProduct()

    purchaseProduct.sellIDLabel.invoke('text').then(sellid => {
        const query = `Select p.sell_id, p.product, p.quantity, p.total_price, p.price
                       from public."purchaseProducts" p inner join public."sells" s on p.sell_id = s.id
                       where p.sell_id = ${sellid}`
        cy.task("connectDB", query).then(result => {
            expect(result).to.be.deep.equal(
                [{sell_id: Number(sellid), product: nameProduct1, quantity: quantityProduct1, total_price: "14.24", price: priceUnit1},
                    {sell_id:Number(sellid),product:nameProduct2, quantity:quantityProduct2,total_price:"10.86",price:priceUnit2} ])
        })

    })
})


Cypress.Commands.add('verifyPurchase', ()=>{

    const purchaseProduct = new PurchaseProduct()
    purchaseProduct.productAmountLabel.eq(0).invoke('text').should('eq', '2')
    purchaseProduct.productAmountLabel.eq(1).invoke('text').should('eq', '2')
    purchaseProduct.productNameLAbel.eq(0).invoke('text').as('firstProduct');
    purchaseProduct.productNameLAbel.eq(0).invoke('text').then(function (nameProduct){
        expect(nameProduct).to.equal(this.firstProduct)
    })
    purchaseProduct.productNameLAbel.eq(1).invoke('text').as('secondProduct');
    purchaseProduct.productNameLAbel.eq(1).invoke('text').then(function (nameProduct){
        expect(nameProduct).to.equal(this.secondProduct)
    })
    purchaseProduct.unitePriceLabel.eq(0).invoke('text').as('priceUnitFirstProduct').then(function (unitePriceFirst){
    expect(unitePriceFirst).to.equal(this.priceUnitFirstProduct)
})
    purchaseProduct.unitePriceLabel.eq(1).invoke('text').as('priceUnitSecondProduct').then(function (unitePriceSecond){
        expect(unitePriceSecond).to.equal(this.priceUnitSecondProduct)
    })
    purchaseProduct.totalPriceLabel.eq(0).invoke('text').as('totalPriceFirst')
    purchaseProduct.totalPriceLabel.eq(1).invoke('text').as('totalPriceSecond')
    purchaseProduct.totalPriceLabel.eq(0).invoke('text').then(function (totalPrice){
        expect(totalPrice).to.be.equal(`$${2 * parseFloat(this.priceUnitFirstProduct.slice(1))}`)
    })
    purchaseProduct.totalPriceLabel.eq(1).invoke('text').then(function (totalPrice){
        expect(totalPrice).to.be.equal(`$${ 2 * parseFloat(this.priceUnitSecondProduct.slice(1))}`)
    })
})

Cypress.Commands.add('verifyTotalPrice',()=>{
    const purchaseProduct = new PurchaseProduct()
    purchaseProduct.totalPriceLabel.eq(0).invoke('text').as('totalPriceFirst')
    purchaseProduct.totalPriceLabel.eq(1).invoke('text').as('totalPriceSecond')
    cy.contains('Show total price').click()
    purchaseProduct.priceTotalPurchaseLabel.invoke('text').then(function (price){
        expect(parseFloat(price)).to.equal(parseFloat(this.totalPriceFirst.slice(1)) + parseFloat(this.totalPriceSecond.slice(1)))
    })
})

Cypress.Commands.add('verifyBillingSummary',()=>{

const pageBillingSummary = new PageBillingSummary()
    pageBillingSummary.subTotalLabel.eq(0).invoke('text').as('subtotal')
    pageBillingSummary.totalPriceSummaryLabel.invoke('text').as('lalalla')
    pageBillingSummary.totalPriceSummaryLabel.then(function (){
        expect(this.lalalla).to.equal(this.subtotal)
    })

})