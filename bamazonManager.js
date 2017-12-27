var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});


initiate()

function initiate() {

    inquirer
        .prompt([
            {
                name: "to_do",
                type: "list",
                message: "What would you like to do?",
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product",
                    "Exit"
                ]
            }
        ]).then(function (n) {

            if (n.to_do === "View Products for Sale") {
                display()
            }
            else if (n.to_do === "View Low Inventory") {
                lowInventory()
            }
            else if (n.to_do === "Add to Inventory") {
                addInventory()
            }
            else if (n.to_do === "Add New Product") {
                addNewProduct()
            }
            else if (n.to_do === "Exit") {
                connection.end()
            }
        })
}

function display() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                "\nItem id: " + res[i].item_id +
                "\nProduct name: " + res[i].product_name +
                "\nDepartment: " + res[i].department_name +
                "\nPrice: " + res[i].price +
                "\nQuantity: " + res[i].stock_quantity +
                "\n----------------------------------------"
            )
        }
        initiate()
    })


}


function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                "\nItem id: " + res[i].item_id +
                "\nProduct name: " + res[i].product_name +
                "\nDepartment: " + res[i].department_name +
                "\nPrice: " + res[i].price +
                "\nQuantity: " + res[i].stock_quantity +
                "\n----------------------------------------"
            )
        }
        initiate()
    })

}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        var itemList = [];
        for (var i = 0; i < res.length; i++) {
            itemList[i] = res[i].product_name
        }

        inquirer
            .prompt([
                {
                    name: "to_add",
                    type: "list",
                    message: "Select the product name you would like to add inventory",
                    choices: itemList
                }
            ]).then(function (n) {
                var chosenItem = n.to_add;

                connection.query("SELECT * FROM products WHERE product_name=?",
                    [n.to_add],
                    function (err, res) {

                        inquirer.prompt([

                            {
                                name: "howmany",
                                type: "input",
                                message: "How many would you like to add? (current: " + res[0].stock_quantity + ")"
                            }
                        ]).then(function (n) {

                            var disp =
                                "\nYour Order" +
                                "\n------------------------" +
                                "\nProduct Name: " + chosenItem +
                                "\nQuantity :" + n.howmany +
                                "\n------------------------" +
                                "\nIs this correct?";
                            var orderQuant = n.howmany;

                            inquirer.prompt([

                                {
                                    name: "confirmation",
                                    type: "list",
                                    message: disp,
                                    choices: ["Yes", "No"]

                                }
                            ]).then(function (n) {
                                if (n.confirmation === "Yes") {
                                    console.log("\nThank you, Inventory has been added\n")
                                    updateSQL(chosenItem, res[0].stock_quantity, orderQuant)

                                }
                                else if (n.confirmation === "No") {
                                    addInventory()
                                }
                            })

                        })
                    })
            })
    })
}

function updateSQL(product_name, old_quantity, new_quantity) {
    var quantity = Number(old_quantity) + Number(new_quantity);
    console.log(
        "\nUpdate info-------" +
        "\nProduct: " + product_name +
        "\nQuant: " + quantity +
        "\n--------------------"
    )
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: quantity
            },
            {
                product_name: product_name
            }
        ])
    initiate()
}

function addNewProduct() {
    inquirer.prompt([
        {
            name: "productName",
            type: "input",
            message: "What is name of the product?"
        },

        {
            name: "department",
            type: "input",
            message: "What is the department of the product?"
        },

        {
            name: "price",
            type: "input",
            message: "What is the price of the product?"
        },

        {
            name: "howmany",
            type: "input",
            message: "how many would you like to add?"
        }

    ]).then(function (n) {
        var productName = n.productName;
        var department = n.department;
        var price = n.price;
        var quantity = n.howmany

        var message = "\n--------------------" +
            "\nUpdate info" +
            "\nProduct Name: " + productName +
            "\nDepartment: " + department +
            "\nPrice: " + price +
            "\nQuant: " + quantity +
            "\n--------------------";

        inquirer.prompt([
            {

                name: "confirmation",
                type: "list",
                message: message,
                choices: ["Yes", "No"]

            }
        ]).then(function (n) {

            if (n.confirmation === "Yes") {

                connection.query("INSERT products SET ?",
                    {
                        product_name: productName,
                        department_name: department,
                        price: price,
                        stock_quantity: quantity
                    }

                )
                initiate()
            }
            else {
                initiate()
            }
        })
    })
}