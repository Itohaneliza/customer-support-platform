"use strict";

const Support = use("App/Models/Support");
const User = use("App/Models/User");
const { validate } = use("Validator");
const Database = use("Database");

class SupportController {
  async submitSupport({ request, response }) {
    try {
      // Validate input
      const validation = await validate(request.all(), {
        first_name: "required",
        last_name: "required",
        email: "required|email",
        support_title: "required",
        support_text: "required",
        file: "required|file_ext:png,jpg,pdf", // Adjust file extensions as needed
      });

      if (validation.fails()) {
        return response.status(422).json(validation.messages());
      }

      // Database operations within a transaction
      const trx = await Database.beginTransaction();

      try {
        const {
          first_name,
          last_name,
          email,
          support_title,
          support_text,
          file,
        } = request.all();

        // Store support request data in the database
        const supportRequest = await Support.create({
          first_name,
          last_name,
          email,
          support_title,
          support_text,
          file,
        });

        // Link support request to user
        const user = await User.findBy("email", email);
        if (user) {
          await user.supportRequests().save(supportRequest);
        }

        // Commit the transaction
        await trx.commit();

        return response
          .status(200)
          .json({ message: "Support request submitted successfully." });
      } catch (error) {
        console.error(error);
        // Rollback the transaction in case of an error
        await trx.rollback();
        return response.status(500).json({
          error: "Internal server error. Please try again later.",
        });
      }
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
    session.flash({ notification: "Message sent" });
  }
}


module.exports = SupportController;
