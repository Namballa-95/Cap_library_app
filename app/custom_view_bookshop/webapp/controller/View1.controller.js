sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, MessageBox, Fragment, MessageToast, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("customviewbookshop.controller.View1", {
        onInit() {
        },
        onSubmit : function () {
            var title = this.getView().byId("title").getValue();
            var author = this.getView().byId("author").getValue();
            var price = this.getView().byId("price").getValue();
            var stock = this.getView().byId("stock").getValue();
            var seller = this.getView().byId("seller").getValue();

            //MessageBox.information("Book Details:\nTitle: " + title + "\nAuthor: " + author + "\nPrice: " + price + "\nStock: " + stock + "\nSeller: " + seller);
            var oModel = this.getView().getModel();  //communication between frontend and backend
            var oContext = oModel.bindList("/Books").create({
                "title": title,
                "author": author,
                "price": price,
                "stock": stock,
                "seller": seller
            }); 
            oContext.created().then(function () {
                MessageBox.success("Book added successfully!");
            }).catch(function (error) {
                MessageBox.error("Error adding new book");
                console.error("Error adding new book:", error);
            });
        },
        	onCollapseExpandPress() {
			const oSideNavigation = this.byId("sideNavigation"),
				bExpanded = oSideNavigation.getExpanded();

			oSideNavigation.setExpanded(!bExpanded);
		},
          onAddBooksPressed: function () {
            this.hideAllPanels();
            var oPanel = this.byId("Pannel");
            oPanel.setVisible(true);
        },
        onViewDetailsPressed: function () {
            this.hideAllPanels();
            var oPanel = this.byId("panel2");
            oPanel.setVisible(true);
        },
        onEditPress: function () {
            this.hideAllPanels();
            var oPanel = this.byId("Pannel3");
            oPanel.setVisible(true);
        },
        hideAllPanels: function () {
           this.byId("Pannel").setVisible(false);
           this.byId("panel2").setVisible(false);
           this.byId("Pannel3").setVisible(false);
        },
    
        // Action button press handler
        onActionPressed: function(oEvent) {
    var oButton = oEvent.getSource();
    var oContext = oButton.getBindingContext();
    this._oSelectedContext = oContext;

    if (!this._oActionSheet) {
        Fragment.load({
            id: this.getView().getId(),
            name: "customviewbookshop.view.ActionSheet",
            controller: this
        }).then(function(oActionSheet) {
            this._oActionSheet = oActionSheet;
            this.getView().addDependent(this._oActionSheet);
            this._oActionSheet.openBy(oButton);
        }.bind(this));
    }
    else {
        this._oActionSheet.openBy(oButton);
    }
},
 // Delete button press handler
onDeletePress: function () {
    var oContext = this._oSelectedContext;
    var sBookId = oContext.getProperty("ID");

    MessageBox.confirm("Are you sure you want to delete this book with ID: " + sBookId + "?", {
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],

        onClose: function (oAction) {
            if (oAction === MessageBox.Action.YES) {

                // Code to delete the book using sBookId
                oContext.delete("$direct")
                    .then(function () {
                        MessageBox.success("Book ID: " + sBookId + " deleted successfully.");
                    })
                    .catch(function (oError) {
                        MessageBox.error("Error deleting book ID: " + sBookId + ": " + oError.message);
                    });
            }
        }
    });
},
  // Edit button press handler
  onUpdatePress: function () {

    this.hideAllPanels();
    this.byId("Pannel3").setVisible(true);
    var oData = this._oSelectedContext.getObject();

    MessageToast.show("Edit action for Item ID: " + oData.ID);

    this.onEditBookPressed();

    var product_model = this.getView().getModel();

    let aFilters = [
        new Filter("ID", FilterOperator.EQ, oData.ID)
    ];

    let oBinding = product_model.bindList("/Books");

    oBinding.filter(aFilters);

    oBinding.requestContexts().then(function (aContexts) {

        // Handle the retrieved contexts
        if (aContexts.length > 0) {

            aContexts.forEach((oContext) => {

                let oUser = oContext.getObject();

                this.getView().byId("titleUpdate").setValue(oUser.title);
                this.getView().byId("authorUpdate").setValue(oUser.author);
                this.getView().byId("priceUpdate").setValue(oUser.price);
                this.getView().byId("stockUpdate").setValue(oUser.stock);
                this.getView().byId("sellerUpdate").setValue(oUser.seller);
                this.getView().byId("itemCode").setValue(oUser.ID);
            });

        } else {
            MessageBox.error("No book found with the specified ID.");
        }

    }.bind(this)).catch(function (oError) {
        MessageBox.error("Error fetching book details: " + oError.message);
    });

},

     // update item function
    onUpdatePress: function () {

    var itemCode = this.getView().byId("itemCode").getValue();
    var title = this.getView().byId("titleUpdate").getValue();
    var author = this.getView().byId("authorUpdate").getValue();
    var price = this.getView().byId("priceUpdate").getValue();
    var stock = this.getView().byId("stockUpdate").getValue();
    var seller = this.getView().byId("sellerUpdate").getValue();
    var update_oModel = this.getView().getModel();

    var sPath = "/Books('" + itemCode + "')";
    var oContext = update_oModel.bindContext(sPath);

var oView = this.getView();

function resetBusy() {
    oView.setBusy(false);
}

oView.setBusy(true);

oContext.setProperty("title", title);
oContext.setProperty("author", author);
oContext.setProperty("price", price);
oContext.setProperty("stock", stock);
oContext.setProperty("seller", seller);

update_oModel.submitBatch("$auto").then(function () {

    resetBusy();

    MessageBox.success("Item details updated successfully");

}).catch(function (err) {

    resetBusy();

    MessageBox.error("An error occurred while updating the item :" + err);

});
}
     

    });
}); 