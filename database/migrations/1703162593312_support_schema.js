"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SupportSchema extends Schema {
  up() {
    this.create("supports", (table) => {
      table.increments();
      table.string("full name");
      table.string("email address");
      table.timestamps();
    });
  }

  down() {
    this.drop("supports");
  }
}

module.exports = SupportSchema;
