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
                choices: ["Display", "Exit"]
            }
        ]).then(function (n) {

            if (n.to_do === "Display") {
                display()
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
        afterDisplay()

    })
}

function afterDisplay() {
    inquirer.prompt([
        {
            name: "to_do",
            type: "list",
            message: "What would you like to do?",
            choices: ["buy something", "Exit"]
        }
    ]).then(function (n) {
        if (n.to_do === "buy something") {
            buy()
        }
        else {

        }
    })
}

function buy() {

    connection.query("SELECT * FROM products", function (err, res) {
        var itemList = [];
        for (var i = 0; i < res.length; i++) {
            itemList[i] = res[i].product_name
        }

        inquirer
            .prompt([
                {
                    name: "to_buy",
                    type: "list",
                    message: "What would you like to buy",
                    choices: itemList
                }
            ]).then(function (n) {

                connection.query("SELECT * FROM products WHERE product_name=?",
                    [n.to_buy],
                    function (err, res) {
                        var qunt_left = "how many would you like to order? (Max: " + res[0].stock_quantity + ")";

                        inquirer.prompt([

                            {
                                name: "howmany",
                                type: "input",
                                message: qunt_left
                            }

                        ]).then(function (n) {

                            if (Number(n.howmany) <= res[0].stock_quantity) {

                                var disp =
                                    "\nYour Order" +
                                    "\n------------------------" +
                                    "\nProduct Name: " + res[0].product_name +
                                    "\nQuantity :" + n.howmany +
                                    "\nTotal :" + (res[0].price * Number(n.howmany)) +
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
                                        console.log("\nThank you, your order is proceeded\n")
                                        updateSQL(res[0].product_name, res[0].stock_quantity, orderQuant)
                            

                                    }
                                    else if (n.confirmation === "No") {
                                        buy()
                                    }
                                })
                            }
                            else {
                                console.log("\nInsufficient quantity!")
                                buy()
                            }

                        })

                    })



            })
    })
}

function updateSQL(product_name, old_quantity, new_quantity) {
    var quantity = Number(old_quantity) - Number(new_quantity);
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
        connection.end()
}
