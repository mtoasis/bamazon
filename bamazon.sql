DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price INT NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES("comic_book1", "book", 10, 5);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES("comic_book2", "book", 9, 5);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES("comic_book3", "book", 11, 5);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES("comic_book4", "book", 13, 5);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES("comic_book5", "book", 15, 8);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES("magazine1", "book", 2, 10);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES("magazine2", "book", 1, 51);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES("magazine3", "book", 3, 52);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES("magazine4", "book", 3, 5);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES("magazine5", "book", 4, 2);
